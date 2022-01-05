import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCountryMaster } from 'src/app/models/m-country-master';
import { MShiftMaster } from 'src/app/models/m-shift-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-shift-add',
  templateUrl: './shift-add.component.html',
  styleUrls: ['./shift-add.component.css']
})
export class ShiftAddComponent implements OnInit {
  myForm: FormGroup;
  countryList: Array<MCountryMaster>;
  shiftList: Array<MShiftMaster>;
  sortorder: number = -1;
  user_details: MUserDetails = null;
  countryid: number;
  isSaved:boolean=true;
  //shiftcode:Array<any>;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.createForm();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
  }

  createForm() {
    this.myForm = this.fb.group({
      shiftCode: [''],
      shiftName: [''],
      countryID: ['', Validators.required],
      sortOrder: [''],
      active: [true]
    });
    this.shiftList = new Array<MShiftMaster>();
    this.getCountry();

  }
  getCountry() {
    this.countryList = null;
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
            this.countryList = this.countryList.filter(x => x.active == true);
            //// .log(this.countryList);
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
  ngOnInit(): void {
  }

  addShiftList() {
    let allow: boolean = true;
    let allowSort: boolean = true;
    this.myForm.get('countryID').disable();
    let shiftcode = this.myForm.get('shiftCode').value;
    let shiftname = this.myForm.get('shiftName').value;
    let sort = this.myForm.get('sortOrder').value;
    for (let shftcode of this.shiftList) {
      if (shftcode.shiftCode == shiftcode) {
        allow = false;
        break;
      }
      else {
        allow = true;
      }
    }
    for (let order of this.shiftList) {
      if (order.sortOrder == sort) {
        allowSort = false;
        break;
      }
      else {
        allowSort = true;
      }
    }
    if (shiftcode != "" && shiftname != "" && sort!="") {
      if (allow == true) {
        if (allowSort == true) {
          //sortorder:this.sortorder++;
          let tempShift: MShiftMaster = {
            id: 0,
            shiftCode: this.myForm.get('shiftCode').value,
            shiftName: this.myForm.get('shiftName').value,
            countryID: this.myForm.get('countryID').value,
            sortOrder: this.myForm.get('sortOrder').value,
            active: this.myForm.get('active').value,
            createBy: this.user_details.id
          }

          this.shiftList.push(tempShift);
          let count = this.shiftList.length;
             
          if(this.shiftList.length == 0)
          {
            this.myForm.controls['sortOrder'].setValue(0);
          }
          else
          {
            this.myForm.controls['sortOrder'].setValue(count);
          }
         
          this.myForm.controls['shiftCode'].setValue('');
          this.myForm.controls['shiftName'].setValue('');
          //this.myForm.controls['sortOrder'].setValue(this.myForm.get('sortOrder').value+1);
          //this.myForm.controls['sortOrder'].setValue('');
          this.myForm.controls['active'].setValue(true);
        }
        else {
          this.common.showMessage('warn', 'Sort Order Already Exist, can not to be Duplicate');
        }
      }
      else {
        this.common.showMessage('warn', 'Shift Code Already Exist');
      }
    }
    else {
      this.common.showMessage('warn', 'Shift Code or Shift Name is Empty');
    }
  }

  void_item(item) {
    const idx = this.shiftList.indexOf(item, 0);
    if (idx > -1) {
      this.shiftList.splice(idx, 1);
    }
  }

  clear_controls() {
    this.myForm.get('countryID').enable();
    this.shiftList = new Array<MShiftMaster>();
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['shiftCode'].setValue('');
    this.myForm.controls['shiftName'].setValue('');
    this.myForm.controls['sortOrder'].setValue('');
    this.myForm.controls['active'].setValue(true);
    //this.sortorder=-1;
  }
  clearsubcontrols() {
    this.myForm.controls['shiftCode'].setValue('');
    this.myForm.controls['shiftName'].setValue('');
    this.myForm.controls['sortOrder'].setValue('');
  }
  getShiftDetails() {
    this.common.showSpinner();
    this.countryid = this.myForm.get('countryID').value;
    this.api.getAPI("shift?countryid=" + this.countryid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.shiftList = data.shiftList;
           
              let count = this.shiftList.length;
             
              if(this.shiftList.length == 0)
              {
                this.myForm.controls['sortOrder'].setValue(0);
              }
              else
              {
                this.myForm.controls['sortOrder'].setValue(count);
              }
            //this.add_code(data.shiftList);
            this.common.hideSpinner();
            //console.log(this.shiftList.length);
            //shiftcode(this.shiftList);

            //this.myForm.controls['sortOrder'].setValue(this.shiftList.length);
          } else {
            this.shiftList = new Array<MShiftMaster>();
            this.common.showMessage('warn', 'No Shift Data');
            
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

 
  addShift() {
    if (this.shiftList == null || this.shiftList.length == 0) {
      this.common.showMessage("warn", "Can not Save, Shift Details are invalid.");
    } else {
      if(this.isSaved==true)
      {
      this.common.showSpinner();
      this.api.postAPI("shift", this.shiftList).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }
      });
    }
    else
    {
      //this.common.showMessage("warn","Sort Number already exists");
    }
    }
  }
  prioritynochange(item) {
    if(this.shiftList != null && this.shiftList.length > 0){
      if(item.sortOrder != null && item.sortOrder.toString() != ""){
        let filter_item = this.shiftList.filter(x=>x.sortOrder == item.sortOrder && x.shiftCode != item.shiftCode);
        if(filter_item != null && filter_item.length > 0){
          item.sortOrder = null;
          this.common.showMessage("warn","Sort Number already exists");
          this.isSaved=false;
        }
      }
    }
  }
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['shift']);
      }
    }
    else {
      this.router.navigate(['shift']);
    }
  }
  restrictSpecialChars(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      // || k == 45 
      // || k == 47
      // || k == 95
      || (k >= 48 && k <= 57));
    
  }
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
