import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MTailoringMaster } from 'src/app/models/m-tailoring-master';

@Component({
  selector: 'app-tailoring-add',
  templateUrl: './tailoring-add.component.html',
  styleUrls: ['./tailoring-add.component.css']
})
export class TailoringAddComponent implements OnInit {
  myForm: FormGroup;
  countryList: Array<any>;
  storeList: Array<any>;
  countryName: any;
  countryCode: any;
  storeCode: any;
  storeName: any;
  tailoring: MTailoringMaster;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      tailoringCode: ['', Validators.required],
      tailoringName: ['', Validators.required],
      countryID: ['', Validators.required],
      storeID: ['', Validators.required],
      active: [false]
    });
    this.getCountry();
    this.clear_controls();
  }
  clear_controls() {

    this.tailoring = new MTailoringMaster();
    this.myForm.controls['tailoringCode'].setValue('');
    this.myForm.controls['tailoringName'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.storeList=null;
    this.myForm.controls['storeID'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  getCountry() {
    this.countryList = null;
    this.common.showSpinner();
    this.api.getAPI("country")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
           // .log(this.countryList);
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
  }
  countrycode() {
    if (this.countryList != null && this.countryList.length > 0) {
      for (let country of this.countryList) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryName = country.countryName;
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
    this.getStoreList();
  }
  getStoreList() {
    this.storeList = null;
    this.common.showSpinner();
    this.api.getAPI("store?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.storeList = data.storeMasterList;
           // .log(this.storeList);
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
  storecode() {
    if (this.storeList != null && this.storeList.length > 0) {
      for (let store of this.storeList) {
        if (store.id == this.myForm.get('storeID').value) {
          this.storeName = store.storeName;
          this.storeCode = store.storeCode;
          break;
        }
      }
    }
  }

  addtailoring() {
    if (this.tailoring == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else {
      this.tailoring.id = 0;
      this.tailoring.tailoringunitcode = this.myForm.get('tailoringCode').value;
      this.tailoring.tailoringunitName = this.myForm.get('tailoringName').value;
      this.tailoring.countryName = this.countryName;
      this.tailoring.countryCode = this.countryCode;
      this.tailoring.countryID = this.myForm.get('countryID').value;
      this.tailoring.storeID = this.myForm.get('storeID').value;
      this.tailoring.storeName = this.storeName;
      this.tailoring.storeCode = this.storeCode;
      //this.tailoring.remarks = this.myForm.get('remarks').value;
      this.tailoring.active = this.myForm.get('active').value;
     // .log(this.tailoring);
      this.common.showSpinner();
      this.api.postAPI("tailoring", this.tailoring).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'State saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
        } else if (data.statusCode == 2) {
          this.common.hideSpinner();
          this.common.showMessage('warn', 'Tailoring Data Already Exist.');
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  
  close(){      
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['tailoring']);
          }  
        } 
      else
        {
          this.router.navigate(['tailoring']);
        }
  }
}
