import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MPricelistMaster } from 'src/app/models/m-pricelist-master';

@Component({
  selector: 'app-price-list-add',
  templateUrl: './price-list-add.component.html',
  styleUrls: ['./price-list-add.component.css']
})
export class PriceListAddComponent implements OnInit {
  myForm: FormGroup;
  currencyList: Array<any>;
  pricelist: MPricelistMaster;
  intcurrencyCode: number;
  basepricelist: Array<any>;
  basepriceListCode: string;

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
      pricelistCode: ['', Validators.required],
      pricelistName: ['', Validators.required],
      currency: ['', Validators.required],
      basepricelistID: ['', Validators.required],
      conversionfactor: ['', Validators.required],
      remarks: [''],
      pricelisttypeID: ['', Validators.required],
      pricelistcategoryID: ['', Validators.required],
      active: [true],
    });
    this.clear_controls();
  }
  clear_controls() {
    this.pricelist = new MPricelistMaster();
    this.myForm.controls['pricelistCode'].setValue('');
    this.myForm.controls['pricelistName'].setValue('');
    this.myForm.controls['currency'].setValue('');
    this.myForm.controls['basepricelistID'].setValue('');
    this.myForm.controls['conversionfactor'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['pricelisttypeID'].setValue('');
    this.myForm.controls['pricelistcategoryID'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  getCurrency() {
    this.currencyList = null;
    this.common.showSpinner();
    this.api.getAPI("APICurrencylookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.currencyList = data.currencyMasterList;
           // .log(this.currencyList);
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
    this.getCurrency();
    this.getBasepricelist();
  }

  currencyCode() {
    if (this.currencyList != null && this.currencyList.length > 0) {
      for (let currency of this.currencyList) {
        if (currency.id == this.myForm.get('currency').value) {
          this.intcurrencyCode = currency.id;
          break;
        }
      }
    }
  }

  getBasepricelist() {
    this.basepricelist = null;
    this.common.showSpinner();
    this.api.getAPI("PriceListLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.basepricelist = data.priceListTypeData;
           // .log(this.basepricelist);
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

  fun_basepricelistcode() {
    if (this.basepricelist != null && this.basepricelist.length > 0) {
      for (let baseprice of this.basepricelist) {
        if (baseprice.id == this.myForm.get('basepricelistID').value) {
          this.basepriceListCode = baseprice.priceListCode;
          break;
        }
      }
    }
  }

  addPrice() {
    if (this.pricelist == null) {
      this.common.showMessage("warn", "Can not Save, Price Details are invalid.");
    } else {
      this.pricelist.ID = 0;
      this.pricelist.PriceListCode = this.myForm.get('pricelistCode').value;
      this.pricelist.PriceListName = this.myForm.get('pricelistName').value;
      this.pricelist.PriceListCurrencyType = this.intcurrencyCode;
      this.pricelist.BasePriceListID = this.myForm.get('basepricelistID').value;
      this.pricelist.ConversionFactore = this.myForm.get('conversionfactor').value;
      this.pricelist.Remarks = this.myForm.get('remarks').value;
      this.pricelist.PriceType = this.myForm.get('pricelisttypeID').value;
      this.pricelist.PriceCategory = this.myForm.get('pricelistcategoryID').value;
      this.pricelist.active = this.myForm.get('active').value;
     // .log(this.pricelist);
      this.common.showSpinner();
      this.api.postAPI("pricelist", this.pricelist).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Price details saved successfully.');
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
  
  picked($event) {

  }
  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['price-list']);
    }  
    } 
    else
    {
      this.router.navigate(['price-list']);
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
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}