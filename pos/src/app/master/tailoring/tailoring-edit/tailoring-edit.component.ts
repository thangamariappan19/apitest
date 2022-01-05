import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MTailoringMaster } from 'src/app/models/m-tailoring-master';

@Component({
  selector: 'app-tailoring-edit',
  templateUrl: './tailoring-edit.component.html',
  styleUrls: ['./tailoring-edit.component.css']
})
export class TailoringEditComponent implements OnInit {
  myForm: FormGroup;
  countryList: Array<any>;
  storeList: Array<any>;
  countryName: any;
  countryCode: any;
  storeCode: any;
  storeName: any;
  tailoring: MTailoringMaster;
  id: any;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      tailoringCode: ['', Validators.required],
      tailoringName: ['', Validators.required],
      countryID: [0, Validators.required],
      storeID: [0],
      active: [false]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.getCountry();    
    this.tailoring = new MTailoringMaster();
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
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getTailoringList();
  }
  getTailoringList() {
    this.common.showSpinner();
    this.api.getAPI("tailoring?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['tailoringCode'].setValue(data.tailoringMasterRecord.tailoringunitcode);
            this.myForm.controls['tailoringName'].setValue(data.tailoringMasterRecord.tailoringunitName);
            this.myForm.controls['countryID'].setValue(data.tailoringMasterRecord.countryID);
            this.getStoreList();
            this.myForm.controls['storeID'].setValue(data.tailoringMasterRecord.storeID);
            this.myForm.controls['active'].setValue(data.tailoringMasterRecord.active);
            this.countryName = data.tailoringMasterRecord.countryName;
            this.countryCode = data.tailoringMasterRecord.countryCode;
            this.storeCode = data.tailoringMasterRecord.storeCode;
            this.storeName = data.tailoringMasterRecord.storeName;

            //.log(this.company_list);
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

  updatetailoring() {
    if (this.tailoring == null) {
      this.common.showMessage("warn", "Can not Save, Tailoring Details are invalid.");
    } else {
      this.tailoring.id = this.id;
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
          this.common.showMessage('success', 'Tailoring updated successfully.');
          //this.close();
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
