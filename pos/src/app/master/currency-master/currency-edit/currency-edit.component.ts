import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCurrencyMaster } from 'src/app/models/m-currency-master';
import { MCurrencyDetails } from 'src/app/models/m-currency-details';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-currency-edit',
  templateUrl: './currency-edit.component.html',
  styleUrls: ['./currency-edit.component.css']
})
export class CurrencyEditComponent implements OnInit {
  myForm: FormGroup;
  currency: MCurrencyMaster;
  currencyList: Array<MCurrencyDetails>;
  id: any;
  currencyTypeDropdownSettings: IDropdownSettings = {};
  selectedCurrencyTypeList = [];
  currencyTypeselList: string = "";
  currency_type : string = '';
  public data = [];
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
      currencyCode: ['', Validators.required],
      currencyName: ['', Validators.required],
      currencySymbol: ['', Validators.required],
      isoCurrencyCode: ['', Validators.required],
      internationalDescription: ['', Validators.required],
      hunderdthName: [''],
      english: [''],
      englishHunderdthName: [''],
      decimalPlaces: [0],
      mRoundValue: [0],
      currencyType: [0],
      currencyValue: [''],
      remarks: [''],
      active: [true]
    });
    this.clear_controls();
    this.currency = new MCurrencyMaster();
    this.currencyList = new Array<MCurrencyDetails>();
  }
  clear_controls() {
  }

  ngOnInit() {
    
    
    

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCurrency();
    
    //this.getBrandItems();
  }
  addCurrencyValue() {

    let tempcurrencydetails: MCurrencyDetails = {
      id: 0,
      currencyID: this.id,
      currencyCode: this.myForm.get('currencyCode').value,
      currencyValue: this.myForm.get('currencyValue').value,
      remarks: this.myForm.get('remarks').value
    }
    this.currencyList.push(tempcurrencydetails);
  }
  getBrandSelectedItems(){
    if (this.selectedCurrencyTypeList!=null)
    {
      for(let i=0;i<this.selectedCurrencyTypeList.length;i++)
      {
        if(this.currencyTypeselList!="")
        {
        this.currencyTypeselList = this.currencyTypeselList + ";" + this.selectedCurrencyTypeList[i].CurrenctTypeName;
        }
        else
        {
          this.currencyTypeselList = this.selectedCurrencyTypeList[i].CurrenctTypeName;
        }
      }
    }
  }
  getCurrency() {
    this.common.showSpinner();
    this.api.getAPI("currency?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['currencyCode'].setValue(data.currencyMasterRecord.currencyCode);
            this.myForm.controls['currencyName'].setValue(data.currencyMasterRecord.currencyName);
            this.myForm.controls['currencySymbol'].setValue(data.currencyMasterRecord.currencySymbol);
            this.myForm.controls['isoCurrencyCode'].setValue(data.currencyMasterRecord.internationalCode);
            this.myForm.controls['internationalDescription'].setValue(data.currencyMasterRecord.interDescription);
            this.myForm.controls['hunderdthName'].setValue(data.currencyMasterRecord.hundredthName);
            this.myForm.controls['english'].setValue(data.currencyMasterRecord.english);
            this.myForm.controls['englishHunderdthName'].setValue(data.currencyMasterRecord.engHundredthName);
            this.myForm.controls['decimalPlaces'].setValue(data.currencyMasterRecord.decimalPlaces);
            this.myForm.controls['mRoundValue'].setValue(data.currencyMasterRecord.mRoundValue);
            //this.myForm.controls['currencyType'].setValue(data.currencyMasterRecord.currencyType);
            this.currency_type = data.currencyMasterRecord.currencyType;
            this.myForm.controls['active'].setValue(data.currencyMasterRecord.active);
            this.currencyList = data.currencyMasterRecord.currencyDetailsList;
            this.selectedCurrencyTypeList = [];
            this.getBrandItems();
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
  getBrandItems()
  {
    this.data = [
      { id: 1, CurrenctTypeName: 'Sales' },      
      { id: 2, CurrenctTypeName: 'Purchase' }
    ];
    if(this.currency_type!="")
    {
      let item=this.currency_type.split(";")
      //console.log(item[0],item[1],item[2]);
      for(let i=0;i<this.data.length;i++)
      {
        for(let j=0;j<item.length;j++)
        {
          if(this.data[i].CurrenctTypeName==item[j])    
          {     
            this.selectedCurrencyTypeList.push({
            id:this.data[i].id,
            CurrenctTypeName:item[j]
          });
        }
      }        
      }
    }
    this.currencyTypeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'CurrenctTypeName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      allowSearchFilter: true,
      itemsShowLimit: 4
    };
    //console.log(this.selectedCurrencyTypeList);
  }
  update_Currency() {
    this.getBrandSelectedItems();
    this.currency.id = this.id;
    this.currency.currencyCode = this.myForm.get('currencyCode').value;
    this.currency.currencyName = this.myForm.get('currencyName').value;
    this.currency.currencySymbol = this.myForm.get('currencySymbol').value;
    this.currency.internationalCode = this.myForm.get('isoCurrencyCode').value;
    this.currency.interDescription = this.myForm.get('internationalDescription').value;
    this.currency.hundredthName = this.myForm.get('hunderdthName').value;
    this.currency.english = this.myForm.get('english').value;
    this.currency.engHundredthName = this.myForm.get('englishHunderdthName').value;
    this.currency.decimalPlaces = this.myForm.get('decimalPlaces').value;
    this.currency.mRoundValue = this.myForm.get('mRoundValue').value;
    this.currency.currencyType = this.currencyTypeselList;
    this.currency.active = this.myForm.get('active').value;
    this.currency.currencyDetailsList = this.currencyList;
    if (this.currency == null) {
      this.common.showMessage("warn", "Can not Save, Currency Details are invalid.");
    } else {
      this.common.showSpinner();
      this.api.putAPI("currency", this.currency).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          this.router.navigate(['currency']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  void_item(item) {
    const idx = this.currencyList.indexOf(item, 0);
    if (idx > -1) {
      this.currencyList.splice(idx, 1);
    }
  }
  decimalplaceChange(){
    let per = this.myForm.get('decimalPlaces').value;
    if(per>9)
    {
      this.myForm.controls['decimalPlaces'].setValue('');
      this.common.showMessage("warn", "Decimal Places should not exceed 9.");
    }
  }
 
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['currency']);
      }
    }
    else {
      this.router.navigate(['currency']);
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
  refersh(){
    this.currencyList = null;
    this.currencyList = new Array<MCurrencyDetails>();
    this.myForm.controls['currencyValue'].setValue('');
    this.myForm.controls['remarks'].setValue('');
  }
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressD(event:any){
    const pattern = /[1-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
