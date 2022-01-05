import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCountryMaster } from 'src/app/models/m-country-master';
import { MStateMaster } from 'src/app/models/m-state-master';
import { MStoreMaster } from 'src/app/models/m-store-master';
import { MDocumentNumberingDetails } from 'src/app/models/m-document-numbering-details';
import { MDocumentNumbering } from 'src/app/models/m-document-numbering';

@Component({
  selector: 'app-document-numbering-add',
  templateUrl: './document-numbering-add.component.html',
  styleUrls: ['./document-numbering-add.component.css']
})
export class DocumentNumberingAddComponent implements OnInit {
  myForm: FormGroup;
  documentNumberingMaster: MDocumentNumbering;
  documentNumberingDetailsList: Array<MDocumentNumberingDetails>
  countryList: Array<MCountryMaster>;
  stateList: Array<MStateMaster>;
  storeList: Array<MStoreMaster>;
  documentTypeList: Array<any>;
  countryName: any;
  countryCode: any;
  stateCode: any;
  stateName: any;
  storeCode: any;
  storeName: any;
  documentCode: any;
  documentName: any;
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
      countryID: ['', Validators.required],
      stateID: ['', Validators.required],
      storeID: ['', Validators.required],
      documentType: ['', Validators.required],
      prefix: [''],
      suffix: [''],
      startNumber: [''],
      endNumber: [''],
      noOfCharacter: [''],
      startDate: [''],
      endDate: [''],
      active: [true],
      active1: [true]
    });
    this.getCountry();
    this.getDocumentType();
    this.documentNumberingDetailsList = new Array<MDocumentNumberingDetails>();
    this.documentNumberingMaster = new MDocumentNumbering();
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

  getDocumentType() {
    this.documentTypeList = null;
    this.common.showSpinner();
    this.api.getAPI("DocumentType")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.documentTypeList = data.documentTypeList;
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
  documentTypecode() {
    if (this.documentTypeList != null && this.documentTypeList.length > 0) {
      for (let document of this.documentTypeList) {
        if (document.id == this.myForm.get('documentType').value) {
          this.documentName = document.documentName;
          break;
        }
      }
    }
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
    this.getState();
    this.getStore();
  }

  getState() {
    this.stateList = null;
    let countid = this.myForm.get('countryID').value
    if(countid !=null && countid !=""){
    this.common.showSpinner();
    this.api.getAPI("StateMasterLookUp?countryid=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.stateList = data.stateMasterList;
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
  }
  statecode() {
    if (this.stateList != null && this.stateList.length > 0) {
      for (let state of this.stateList) {
        if (state.id == this.myForm.get('stateID').value) {
          this.stateCode = state.stateCode;
          this.stateName = state.stateName;
          break;
        }
      }
    }
  }

  getStore() {
    this.storeList = null;
    let countid = this.myForm.get('countryID').value
    if(countid !=null && countid !=""){
      this.common.showSpinner();
      //this.api.getAPI("CompanyLookUp?countryID=" + this.myForm.get('countryID').value)
      this.api.getAPI("StoreMasterLookUp?countryID=" + this.myForm.get('countryID').value)      
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.storeList = data.storeMasterList;            
              // hided this.storeList = data.companySettingsList;
             // .log(this.storeCompany_list);
            } else {
              let msg: string = data != null
                && data.displayMessage != null
                && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              this.common.showMessage('warn', msg);
            }
            this.storecode();
            this.common.hideSpinner();
          }, this.common.time_out_delay);
        });
    }
  }
  storecode() {
    if (this.storeList != null && this.storeList.length > 0) {
      for (let store of this.storeList) {
        if (store.id == this.myForm.get('storeID').value) {
          this.storeCode = store.storeCode;
          this.storeName = store.storeName;
          break;
        }
      }
    }
  }

  ngOnInit(): void {
  }
  addDocumentDetailsValue() {
    let save : boolean=true;
    
    let prev_Date = this.myForm.get('startDate').value;
    for(let i=0; i<this.documentNumberingDetailsList.length;i++)
    {
      if(i!=this.documentNumberingDetailsList.length)
      {
       
        let previous_date = this.documentNumberingDetailsList[i].endDate;
        if(previous_date > prev_Date)
        {
          save=false;
          break;
        }
        else
        {
          save=true;
        }
      }
     
    }
    if(save==true){
    let f = this.myForm.get('startDate').value;
    let t = this.myForm.get('endDate').value;
    let prefix_str = this.myForm.get('prefix').value;
    let suffix_str = this.myForm.get('suffix').value;
    let endNumber_str = this.myForm.get('endNumber').value.length;
    let prefix_length = prefix_str.length;
    let suffix_legth = suffix_str.length;
    let endNumber_Length = endNumber_str;
    let total_count = prefix_length + suffix_legth + endNumber_Length;
    let numberCount = this.myForm.get('noOfCharacter').value;
     if(f =='' && t =='') {
      this.common.showMessage('warn', 'Date is Missing');
    }
   else if(prefix_str!='' && suffix_str!='' && f !='' && t !=''){
    if (f >= t) {
      this.common.showMessage('warn', 'End Date Must be Greater than Start Date .');
    }
    else if (total_count != numberCount) {
      this.common.showMessage('warn', 'Number of Characters is not Matching ');
    }
    
    else {

      let tempcurrencydetails: MDocumentNumberingDetails = {
        id: 0,
        prefix: this.myForm.get('prefix').value,
        suffix: this.myForm.get('suffix').value,
        startNumber: this.myForm.get('startNumber').value,
        endNumber: this.myForm.get('endNumber').value,
        numberOfCharacter: this.myForm.get('noOfCharacter').value,
        startDate: this.myForm.get('startDate').value,
        endDate: this.myForm.get('endDate').value,
        active: this.myForm.get('active1').value
      }
      this.documentNumberingDetailsList.push(tempcurrencydetails);
      this.myForm.get('countryID').disable();
      this.myForm.get('stateID').disable();
      this.myForm.get('storeID').disable();
      this.myForm.get('documentType').disable();
      this.myForm.controls['prefix'].setValue('');
      this.myForm.controls['suffix'].setValue('');
      this.myForm.controls['startNumber'].setValue('');
      this.myForm.controls['endNumber'].setValue('');
      this.myForm.controls['noOfCharacter'].setValue('');
      this.myForm.controls['startDate'].setValue('');
      this.myForm.controls['endDate'].setValue('');
      this.myForm.controls['active1'].setValue(true);
    }
  }
  else
  {
    this.common.showMessage("warn", "Prefix, Suffix, From Date and To date ");
  }
}
else
{
  this.common.showMessage("warn", "Start Date Must Be Greater than Previous End Date ");
}
  }
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  void_item(item) {
    const idx = this.documentNumberingDetailsList.indexOf(item, 0);
    if (idx > -1) {
      this.documentNumberingDetailsList.splice(idx, 1);
    }
  }
  clear_controls() {

    this.myForm.get('countryID').enable();
    this.myForm.get('stateID').enable();
    this.myForm.get('storeID').enable();
    this.myForm.get('documentType').enable();
    this.documentNumberingDetailsList = new Array<MDocumentNumberingDetails>();
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['stateID'].setValue('');
    this.myForm.controls['storeID'].setValue('');
    this.myForm.controls['documentType'].setValue('');
    this.myForm.controls['prefix'].setValue('');
    this.myForm.controls['suffix'].setValue('');
    this.myForm.controls['startNumber'].setValue('');
    this.myForm.controls['endNumber'].setValue('');
    this.myForm.controls['noOfCharacter'].setValue('');
    this.myForm.controls['startDate'].setValue('');
    this.myForm.controls['endDate'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['active1'].setValue(true);
    this.stateList = new Array<MStateMaster>();
    this.storeList = new Array<MStoreMaster>();
  }

  addDocumentNumbering() {
    let save : boolean=true;
    let j=0;
    for(let i=0; i<this.documentNumberingDetailsList.length;i++)
    {
      if(i!=this.documentNumberingDetailsList.length-1)
      {
        j++;
        let previous_date = this.documentNumberingDetailsList[i].endDate;
        if(previous_date > this.documentNumberingDetailsList[j].startDate)
        {
          save=false;
          break;
        }
        else
        {
          save=true;
        }
      }
      else
      {
        j=this.documentNumberingDetailsList.length;
      }
    }
    if(save==true){
    if (this.documentNumberingMaster == null ) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else if (this.documentNumberingDetailsList.length == 0) {
      this.common.showMessage("warn", "Can not Save, Document Numbering Detail is Empty.");
    } 
    else {
      this.documentNumberingMaster.id = 0;
      this.documentNumberingMaster.countryID = this.myForm.get('countryID').value;
      this.documentNumberingMaster.countryCode = this.countryCode;
      this.documentNumberingMaster.countryName = this.countryName;
      this.documentNumberingMaster.stateID = this.myForm.get('stateID').value;
      this.documentNumberingMaster.stateCode = this.stateCode;
      this.documentNumberingMaster.stateName = this.stateName;
      this.documentNumberingMaster.storeID = this.myForm.get('storeID').value;
      this.documentNumberingMaster.storeCode = this.storeCode;
      this.documentNumberingMaster.storeName = this.storeName;
      this.documentNumberingMaster.documentTypeID = this.myForm.get('documentType').value;
      this.documentNumberingMaster.active = this.myForm.get('active').value;
      this.documentNumberingMaster.documentNumberingDetails = this.documentNumberingDetailsList;
      this.common.showSpinner();
      this.api.postAPI("DocumentNumbering", this.documentNumberingMaster).subscribe((data) => {
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
  }
  else
  {
    this.common.showMessage("warn", "Can not Save, Start Date must be greater than previous list End Date.");
  }
  }
  
  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['document-numbering']);
    }  
    } 
    else
    {
      this.router.navigate(['document-numbering']);
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
    gridClear(){
    this.myForm.controls['prefix'].setValue('');
    this.myForm.controls['suffix'].setValue('');
    this.myForm.controls['startNumber'].setValue('');
    this.myForm.controls['endNumber'].setValue('');
    this.myForm.controls['noOfCharacter'].setValue(''); 
    this.myForm.controls['startDate'].setValue('');
    this.myForm.controls['endDate'].setValue('');
    this.myForm.controls['active1'].setValue(true);
    }
}
