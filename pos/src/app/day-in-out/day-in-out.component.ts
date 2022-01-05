import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from '../models/m-user-details';
import { MDayClosing } from '../models/m-day-closing';
import { MManagerOverride } from '../models/m-manager-override';
import { MRetailSettings } from '../models/m-retail-settings';

@Component({
  selector: 'app-day-in-out',
  templateUrl: './day-in-out.component.html',
  styleUrls: ['./day-in-out.component.css']
})
export class DayInOutComponent implements OnInit {
  json: Array<any>;
  posList: Array<any>;
  shiftList: Array<any>;
  myForm: FormGroup;
  dayclose: MDayClosing;
  Dayindate: Date;
  todayDate: Date;
  user_details: MUserDetails = null;
  manager_OverRide: MManagerOverride = null;
  retail_settings: MRetailSettings = null;
  dayin: boolean;
  pos_details: MDayClosing;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    localStorage.setItem('pos_mode', 'true');

    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }

    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }

    let temp_manageroverride: string = localStorage.getItem('manager_OverRide_Settings');
    if (temp_manageroverride != null) {
      this.manager_OverRide = JSON.parse(temp_manageroverride);
    }
    let temp_Retail: string = localStorage.getItem('retail_settings');
    if (temp_Retail != null) {
      this.retail_settings = JSON.parse(temp_Retail);
    }
    this.createForm();
    this.todayDate = new Date();
  }
  createForm() {

    this.myForm = this.fb.group({
      posID: [''],
      businessdate: [''],
      shiftin: ['']
      // discount_value: [0],
      // current_discount_type: ['Percentage']
    });
    this.clear_controls();
  }

  clear_controls() {
    this.getPos_ShiftCode();
    this.dayclose = new MDayClosing();
  }
  getPos_ShiftCode() {
    this.json = null;
    this.common.showSpinner();
    this.api.getAPI("DayIn?StoreID=" + this.user_details.storeID + "&UserID=" + this.user_details.id + "&CountryID=" + this.user_details.countryID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.json = data.posList;
            this.posList = data.posList;
            this.shiftList = data.shiftMasterList;
            this.dayin = data.dayIn;

            if (this.dayin == true) {
              this.myForm.controls['businessdate'].disable();
              this.Dayindate = data.businessDate;
             
            } else {
              this.Dayindate = new Date();
            }



            //this.myForm.controls['businessdate'].setValue(this.businessDate);
            this.pos_details = new MDayClosing();
            this.pos_details = data.logShiftList;
            localStorage.setItem('pos_details', JSON.stringify(this.pos_details));
            //localStorage.setItem('getpos_shift', data);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  ngOnInit() {
    // localStorage.setItem('pos_mode', 'true');
  }
  add_day() {
    let docudate = this.common.toYMDFormat(this.myForm.get('businessdate').value)
    let curdate = this.common.toYMDFormat(this.todayDate);
    let selectpos = this.myForm.get('posID').value;
    let shiftinamount = this.myForm.get('shiftin').value;
    if (selectpos != null && selectpos != "") {
      if (shiftinamount == "") {
        this.common.showMessage("warn", "Fill Shift in amount.");
      }
      else {
        if (docudate != curdate) {
          if (confirm("BusinessDate and Current Date is Different. Are you sure you want to continue?'")) {
            this.save_DayIN();
          }
        }
        else {
          this.save_DayIN();
        }
      }
    }
    else {
      this.common.showMessage("warn", "Please Select POS .");
    }
  }

  save_DayIN() {
    if (this.dayclose == null) {
      this.common.showMessage("warn", "Can not Save, Invalid Details.");
    } else {
      this.dayclose.id = 0;
      this.dayclose.countryID = this.user_details.countryID;
      this.dayclose.countryCode = this.user_details.countryCode;
      this.dayclose.storeID = this.user_details.storeID;
      this.dayclose.storeCode = this.user_details.storeCode;
      for (let pos of this.posList) {
        if (pos.posid == this.myForm.get('posID').value) {
          this.dayclose.posid = pos.posid;
          this.dayclose.posCode = pos.posCode;
        }
      }
      for (let shift of this.shiftList) {
        this.dayclose.shiftID = shift.id;
        this.dayclose.shiftCode = shift.shiftCode;
      }
      if (this.dayclose.shiftID != 0) {
        this.dayclose.shiftInUserID = this.user_details.id;
        this.dayclose.shiftInUserCode = this.user_details.userCode;
        this.dayclose.status = "Open";
        this.dayclose.startingTime = this.myForm.get('businessdate').value;
        this.dayclose.closingTime = null;
        this.dayclose.amount = this.myForm.get('shiftin').value;
        this.common.showSpinner();
        this.api.postAPI("DayIn", this.dayclose).subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            if(this.pos_details==null)
            {
              this.pos_details=new MDayClosing();
              this.pos_details.businessDate = this.myForm.get('businessdate').value;
              this.pos_details.posid = this.myForm.get('posID').value;
              this.pos_details.posCode=this.dayclose.posCode;
              this.pos_details.shiftCode=this.dayclose.shiftCode;
              this.pos_details.status=this.dayclose.status;
              this.pos_details.shiftID=this.dayclose.shiftID;
              this.pos_details.storeID=this.dayclose.storeID;
              this.pos_details.storeCode=this.dayclose.storeCode;
              this.pos_details.shiftInUserCode=this.dayclose.shiftInUserCode;
              localStorage.setItem('pos_details', null);
              localStorage.setItem('pos_details', JSON.stringify(this.pos_details));
              this.router.navigate(['pos']);
            }
            else
            {
              this.pos_details.businessDate = this.myForm.get('businessdate').value;
              this.pos_details.posid = this.myForm.get('posID').value;
              localStorage.setItem('pos_details', null);
              localStorage.setItem('pos_details', JSON.stringify(this.pos_details));
              this.router.navigate(['pos']);
            }
            this.clear_controls();
           
          } else {
            setTimeout(() => {
              this.common.hideSpinner();
              this.common.showMessage('error', data.displayMessage);
            }, this.common.time_out_delay);
          }
        });
      }
      else {
        this.common.showMessage('warn', "Shift Master Not Found");
      }
    }
  }

  btn_back_click() {
    localStorage.setItem('pos_mode', 'true');
    this.router.navigate(['pos']);
  }
//   getposdetails()
//   {
//     this.api.getAPI("pos?ID=" + this.pos_details.posid)
//       .subscribe((data) => {
//         setTimeout(() => {
//           if (data != null && data.statusCode != null && data.statusCode == 1) {
//             this.pos_details.countryID=data.posMasterRecord.countryID;
//             this.pos_details.printerDeviceName= data.posMasterRecord.printerDeviceName;
//             this.pos_details.defaultCustomerCode=data.posMasterRecord.defaultCustomerCode;
//             this.pos_details.defaultCustomerName=data.posMasterRecord.defaultCustomer;
//           } 
//           else {
//             let msg: string = data != null
//               && data.displayMessage != null
//               && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
//             this.common.showMessage('warn', msg);
//           }
//           this.common.hideSpinner();
//         }, this.common.time_out_delay);
//       })
//   }

 }
