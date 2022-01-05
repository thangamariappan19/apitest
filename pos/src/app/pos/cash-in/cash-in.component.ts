import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { Mcashin } from 'src/app/models/m-cash-in';
import { Mcashincashoutdetails } from 'src/app/models/m-cashin-cashout-details';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MDayClosing } from 'src/app/models/m-day-closing';


@Component({
  selector: 'app-cash-in',
  templateUrl: './cash-in.component.html',
  styleUrls: ['./cash-in.component.css']
})
export class CashInComponent implements OnInit {
  myForm: FormGroup;
  ReasonList: Array<any>;
  intReasonCode: string;
  cashin: Mcashin;
  CashinList: Array<Mcashincashoutdetails>;
  //tempcash: Mcashincashoutdetails;
  reason: any;
  receivedAmount: number;
  remarks: any;
  user_details: MUserDetails = null;
  total_amount: number;
  logedpos_details: MDayClosing = null;
  todayDate: Date;
  Date: string;
  CategroyType: string;
  ReasonName: string;
  id: number = 0;

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router) {
    localStorage.setItem('pos_mode', 'true');
    
    this.CashinList = new Array<Mcashincashoutdetails>()
    // localStorage.setItem('pos_mode', 'true');

    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }

    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
    let temp_pos: string = localStorage.getItem('pos_details');
    if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);

      // this.myForm.controls['date'].setValue(this.common.toDMYFormat(this.logedpos_details.businessDate));
      // .log("Day In ");
      // .log(this.logedpos_details);

    }

    if (this.logedpos_details == null) {
      common.showMessage("warn", "Day-In / Shift-In Required");
      localStorage.setItem('pos_mode', 'true');
      // this.router.navigate(['home']);
      this.router.navigate(['day-in-out']);
    }

    this.createForm();
  }



  createForm() {
    this.myForm = this.fb.group({
      reason: [''],
      receivedamount: [0, Validators.required],
      date: ['', Validators.required],
      totalamount: [0],
      remarks: ['']

    });
    if (this.logedpos_details != null && this.logedpos_details.businessDate != null) {
      this.todayDate = this.logedpos_details.businessDate;
    }

    this.clear_controls();
    this.GetLoadCashIn();

  }
  goto_pos() {
    let str: string = localStorage.getItem('from_pos');
    if (str != null && str.toLowerCase() != "null" && str.toLowerCase() == "true") {
      localStorage.setItem('pos_mode', 'true');
      localStorage.setItem('from_pos', 'false');
      this.router.navigate(['pos']);
    } else {
      this.router.navigate(['home']);
    }
  }

  clear_controls() {
    this.getreason();
    this.cashin = new Mcashin();

    this.CashinList = new Array<Mcashincashoutdetails>();
    this.ReasonList = null;
    this.receivedAmount = 0;
    this.reason = 0;
    this.remarks = null;
    this.total_amount = 0;
    this.myForm.controls['totalamount'].setValue(0);
    this.myForm.controls['receivedamount'].setValue(0);
    this.myForm.controls['remarks'].setValue('');
    //this.myForm.controls['date'].setValue('');
    this.myForm.controls['reason'].setValue('');



  }


  getreason() {
    this.ReasonList = null;
    this.common.showSpinner();
    this.api.getAPI("ReasonLookup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.ReasonList = data.reasonMasterList;

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
  addlist() {

    let amt = this.myForm.get('receivedamount').value;
    let reasonName = this.myForm.get('reason').value;
    if (reasonName == '') {
      this.common.showMessage("Warn", "Please Choose Reason");
    }
    else if (amt == 0) {
      this.common.showMessage("Warn", "Received Amount Invalid");
    }
    else if (amt > 0 && amt != '') {
      let reasonID: any = this.ReasonList.filter(x => x.reasonID == reasonName);
      let reasonName1 = reasonID[0].reasonName;
      this.total_amount = this.myForm.get('totalamount').value;
      this.total_amount += parseFloat(this.myForm.get('receivedamount').value);

      this.myForm.controls['totalamount'].setValue(this.total_amount);
      let tempcash: Mcashincashoutdetails = {

        reason: reasonName1,
        receivedAmount: this.myForm.get('receivedamount').value,
        remarks: this.myForm.get('remarks').value,

        id: 0,
        headerID: 0,
        applicationDate: this.myForm.get('date').value,
        documentDate: this.myForm.get('date').value,

        reasonID: this.myForm.get('reason').value,
        paidAmount: 0,
        type: 'CashIn',
        posid: this.logedpos_details.posid,
        storeID: this.user_details.storeID,
        shiftID: 0,
        shiftCode: '0',
        posCode: this.logedpos_details.posCode,
        storeCode: this.user_details.storeCode
      }
      this.myForm.controls['receivedamount'].setValue(0);
      this.myForm.controls['remarks'].setValue('');
      this.myForm.controls['reason'].setValue('');
      this.CashinList.push(tempcash);
    }
    else {
      this.common.showMessage("Warn", "Please Enter Received Amount");
    }


  }

  void_item(item) {
    const idx = this.CashinList.indexOf(item, 0);
    // this.common.showMessage('', idx.toString());
    if (idx > -1) {
      this.CashinList.splice(idx, 1);
      this.calculate();

    }
  }

  calculate() {
    let dis_totalamount: number = 0;
    if (this.CashinList != null && this.CashinList.length > 0) {
      for (let item of this.CashinList) {
        //dis_totalamount = (item.receivedAmount) == null ? 0 : (item.receivedAmount);
        //this.total_amount+=parseInt(dis_totalamount);
        // let recamount: number;
        // recamount=item.receivedAmount == null ? 0 : item.receivedAmount;
        // dis_totalamount += parseFloat(recamount);
        dis_totalamount += item.receivedAmount == null ? 0 : item.receivedAmount;
      }
      //this.total_amount : dis_totalamount;
      this.myForm.controls['totalamount'].setValue(dis_totalamount);


      //this.myForm.controls['totalamount'].setValue(this.total_amount);
    }
    else {
      this.myForm.controls['totalamount'].setValue(0);
    }
  }

  GetLoadCashIn() {

    // this.Date = this.common.toYMDFormat(new Date());
    this.Date = this.common.toYMDFormat(this.todayDate);
    this.CategroyType = 'CashIn';
    this.common.showSpinner();
    this.api.getAPI("CashInCashOut?Date=" + this.Date + "&CategoryType=" + this.CategroyType + " &Storeid=" + this.user_details.storeID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.CashinList = data.cashInCashOutReportList;
            this.id = data.cashInCashOutReportList[0].id;
            this.total_amount = data.cashInCashOutReportList[0].total;
            this.myForm.controls['totalamount'].setValue(this.total_amount);


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


  addcashin() {
    if (this.CashinList.length == 0) {
      this.common.showMessage("Warn", "Can not Save,CashIn Details is Invalid.");
    }
    else {
      this.cashin.id = this.id;
      this.cashin.documentDate = this.myForm.get('date').value;
      this.cashin.storeCode = this.user_details.storeCode;
      this.cashin.posCode = this.user_details.posCode;
      this.cashin.storeID = this.user_details.storeID;
      this.cashin.countryID = this.user_details.countryID;
      this.cashin.total = this.myForm.get('totalamount').value;
      this.cashin.cashInCashOutDetailsList = this.CashinList;
      this.common.showSpinner();
      this.api.postAPI("CashInCashOut", this.cashin).subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          this.GetLoadCashIn();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }

}
