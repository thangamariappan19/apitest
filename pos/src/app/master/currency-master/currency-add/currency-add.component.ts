import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCurrencyMaster } from 'src/app/models/m-currency-master';
import { MCurrencyDetails } from 'src/app/models/m-currency-details';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-currency-add',
  templateUrl: './currency-add.component.html',
  styleUrls: ['./currency-add.component.css']
})
export class CurrencyAddComponent implements OnInit {
  myForm: FormGroup;
  currency: MCurrencyMaster;
  currencyList: Array<MCurrencyDetails>;
  currencyTypeDropdownSettings: IDropdownSettings = {};
  selectedCurrencyTypeList = [];
  currencyTypeselList: string = "";
  public data = [];
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

    this.myForm.controls['currencyCode'].setValue('');
    this.myForm.controls['currencyName'].setValue('');
    this.myForm.controls['currencySymbol'].setValue('');
    this.myForm.controls['isoCurrencyCode'].setValue('');
    this.myForm.controls['internationalDescription'].setValue('');
    this.myForm.controls['hunderdthName'].setValue('');
    this.myForm.controls['english'].setValue('');
    this.myForm.controls['englishHunderdthName'].setValue('');
    this.myForm.controls['decimalPlaces'].setValue('');
    this.myForm.controls['mRoundValue'].setValue('');
    this.myForm.controls['currencyType'].setValue(0);
    this.myForm.controls['currencyValue'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.currencyList = new Array<MCurrencyDetails>();
    // this.selectedCurrencyTypeList = [];
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
    this.selectedCurrencyTypeList = [];
    this.currencyTypeselList = "";
  }

  ngOnInit() {
    this.data = [
      { id: 1, CurrenctTypeName: 'Sales' },
      { id: 2, CurrenctTypeName: 'Purchase' }
    ];
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
    this.selectedCurrencyTypeList = [];
  }
  addCurrencyValue() {
      let currentval= this.myForm.get('currencyValue').value
      let  remark =this.myForm.get('currencyValue').value

      if(currentval == '' && remark == ''){
        this.common.showMessage("warn","should not be empty")
      }
      else{
          let tempcurrencydetails: MCurrencyDetails = {
            id: 0,
            currencyCode: this.myForm.get('currencyCode').value,
            currencyValue: this.myForm.get('currencyValue').value,
            remarks: this.myForm.get('remarks').value
          }
        
          this.currencyList.push(tempcurrencydetails);
          this.myForm.controls['currencyValue'].setValue('');
          this.myForm.controls['remarks'].setValue('');
        }  
      }

  clearGrid() {
    this.currencyList = null;
    this.currencyList = new Array<MCurrencyDetails>();
    this.myForm.controls['currencyValue'].setValue('');
    this.myForm.controls['remarks'].setValue('');
  }
  void_item(item) {
    const idx = this.currencyList.indexOf(item, 0);
    if (idx > -1) {
      this.currencyList.splice(idx, 1);
    }
  }

  addCurrency() {
    this.getBrandSelectedItems();
    this.currency.id = 0;
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
      this.api.postAPI("currency", this.currency).subscribe((data) => {
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

  getBrandSelectedItems() {
    if (this.selectedCurrencyTypeList != null) {
      for (let i = 0; i < this.selectedCurrencyTypeList.length; i++) {
        if (this.currencyTypeselList != "") {
          this.currencyTypeselList = this.currencyTypeselList + ";" + this.selectedCurrencyTypeList[i].CurrenctTypeName;
        }
        else {
          this.currencyTypeselList = this.selectedCurrencyTypeList[i].CurrenctTypeName;
        }
      }
    }
  }
  decimalplaceChange() {
    let per = this.myForm.get('decimalPlaces').value;
    if (per > 9) {
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
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressD(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  restrictExceptNos(event) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
     
    }
  }
}
