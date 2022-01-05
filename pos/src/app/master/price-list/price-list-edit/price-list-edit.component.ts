import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MPricelistMaster } from 'src/app/models/m-pricelist-master';

@Component({
  selector: 'app-price-list-edit',
  templateUrl: './price-list-edit.component.html',
  styleUrls: ['./price-list-edit.component.css']
})
export class PriceListEditComponent implements OnInit {
  myForm: FormGroup;
  id: any;
  currencyList: Array<any>;
  pricelist: MPricelistMaster;
  intcurrencyCode: number;
  strcurrencyCode: string;
  basepricelist: Array<any>;
  basepriceListCode: string;

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
      pricelistCode: ['', Validators.required],
      pricelistName: ['', Validators.required],
      currency: ['', Validators.required],
      basepricelistID: ['', Validators.required],
      conversionfactor: ['', Validators.required],
      remarks: ['', Validators.required],
      pricelisttypeID: ['', Validators.required],
      pricelistcategoryID: ['', Validators.required],
      active: [false],
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
    this.myForm.controls['active'].setValue(false);
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
  currencyCode() {
    if (this.currencyList != null && this.currencyList.length > 0) {
      for (let currency of this.currencyList) {
        if (currency.id == this.myForm.get('currency').value) {
          //this.intcurrencyCode = currency.id;
          this.strcurrencyCode = currency.currencyCode;
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

  ngOnInit() {
    this.getCurrency();
    this.getBasepricelist();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPriceListData();
  }
  getPriceListData() {
    this.common.showSpinner();
    this.api.getAPI("pricelist?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.currencyName(data.priceListTypeRecord.priceListCurrencyType);
            this.myForm.controls['pricelistCode'].setValue(data.priceListTypeRecord.priceListCode);
            this.myForm.controls['pricelistName'].setValue(data.priceListTypeRecord.priceListName);
            this.myForm.controls['currency'].setValue(data.priceListTypeRecord.priceListCurrencyType);
            this.myForm.controls['basepricelistID'].setValue(data.priceListTypeRecord.basePriceListID);
            this.myForm.controls['conversionfactor'].setValue(data.priceListTypeRecord.conversionFactore);
            this.myForm.controls['remarks'].setValue(data.priceListTypeRecord.remarks);
            this.myForm.controls['pricelisttypeID'].setValue(data.priceListTypeRecord.priceType);
            this.myForm.controls['pricelistcategoryID'].setValue(data.priceListTypeRecord.priceCategory);
            this.myForm.controls['active'].setValue(data.priceListTypeRecord.active);
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

  updatePriceList() {
    if (this.pricelist == null) {
      this.common.showMessage("warn", "Can not Save, Price Details are invalid.");
    } else {
      this.pricelist.ID = this.id;
      this.pricelist.PriceListCode = this.myForm.get('pricelistCode').value;
      this.pricelist.PriceListName = this.myForm.get('pricelistName').value;
      this.pricelist.PriceListCurrencyType = this.myForm.get('currency').value; //this.intcurrencyCode;
      this.pricelist.BasePriceListID = this.myForm.get('basepricelistID').value;
      this.pricelist.ConversionFactore = this.myForm.get('conversionfactor').value;
      this.pricelist.Remarks = this.myForm.get('remarks').value;
      this.pricelist.PriceType = this.myForm.get('pricelisttypeID').value;
      this.pricelist.PriceCategory = this.myForm.get('pricelistcategoryID').value;
      this.pricelist.active = this.myForm.get('active').value;

     // .log(this.pricelist);
      this.common.showSpinner();
      this.api.putAPI("pricelist", this.pricelist).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Price details updated successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['price-list']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
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

  picked($event) {

  }
  
  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
