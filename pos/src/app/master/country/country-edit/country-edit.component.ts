import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCountryMaster } from 'src/app/models/m-country-master';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css']
})

export class CountryEditComponent implements OnInit {
  myForm: FormGroup;
  id: any;
  TaxList: Array<any>;
  LanguageMasterList: Array<any>;
  CurrencyMasterList: Array<any>;
  intcurrencyCode: string;
  inttaxCode: string;
  country: MCountryMaster;
  cusList = []
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
      countryCode: ['', Validators.required],
      countryName: ['', Validators.required],
      languageName: ['', Validators.required],
      taxID: [null, Validators.required],
      currency: [null, Validators.required],
      decimalDigit: [0],
      decimalPlaces: [0],
      dateFormat: [''],
      dateSeparator: [''],
      negativeSign: [''],
      currencySeparator: [''],
      //emailID: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      emailID: ['', Validators.required],
      creditLimitCheck: [false],
      allowMultipleTransaction: [false],
      allowPartialReceiving: [false],
      allowSaleAndRedemption: [false],
      orginCountry: [false],
      currencyID: [0],
      nearByRoundOff: [0],
      currencyCode: [''],
      taxCode: [''],
      posTitle: [''],
      promotionRoundOff: [0],
      active: [false]

    });
    this.clear_controls();
  }

  clear_controls() {
    this.gettax();
    this.getlanguage();
    //this.getcurrency();
    this.country = new MCountryMaster();

  }
  gettax() {
    return new Promise((resolve, reject) => {
    this.TaxList = null;
    //this.common.showSpinner();
    this.api.getAPI("TaxlookUp")
      .subscribe((data) => {
       // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.TaxList = data.responseDynamicData;
            resolve(data.responseDynamicData);
           // .log(this.TaxList);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
           // this.common.showMessage('warn', msg);
          }
        //   this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
    });
  }

  getcurrency() {
    return new Promise((resolve, reject) => {
    this.CurrencyMasterList = null;
    // this.common.showSpinner();
    this.api.getAPI("CurrencylookUp")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.CurrencyMasterList = data.currencyMasterList;
            console.log(this.CurrencyMasterList);
           resolve(data.currencyMasterList);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
           // this.common.showMessage('warn', msg);
           reject(msg);
          }
        //   this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
     });
  }

  getlanguage() {
    return new Promise((resolve, reject) => {
    this.LanguageMasterList = null;
    // this.common.showSpinner();
    this.api.getAPI("LanguagelookUp")
      .subscribe((data) => {
       // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.LanguageMasterList = data.languageMasterList;
           // .log(this.LanguageMasterList);
           resolve(data.languageMasterList);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
           // this.common.showMessage('warn', msg);
           reject(msg);
          }
        //   this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
    });
  }

  currencyCode() {
    if (this.CurrencyMasterList != null && this.CurrencyMasterList.length > 0) {
      for (let currency of this.CurrencyMasterList) {
        if (currency.id == this.myForm.get('currency').value) {
          this.intcurrencyCode = currency.currencyCode;
          break;
        }
      }
    }
  }

  taxCode() {
    if (this.TaxList != null && this.TaxList.length > 0) {
      for (let tax of this.TaxList) {
        if (tax.id == this.myForm.get('taxID').value) {
          this.inttaxCode = tax.taxCode;
          break;
        }
      }
    }
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCountryData();
    this.gettax();
    this.getcurrency();
    // .then((tax) => {
    //  this.getcurrency()
    //  .then((currency) => {
    //   this.getlanguage()
    //   .then((language) => {
    //   }).catch((err2) => {
    //     this.common.showMessage('warn', err2);
    //     this.common.hideSpinner();
    //   });
    // }).catch((err1) => {
    //   this.common.showMessage('warn', err1);
    //   this.common.hideSpinner();
    // });
    //  }).catch((err) => {
    //   this.common.showMessage('warn', err);
    //   this.common.hideSpinner();
    // });
  }
  getCountryData() {
    this.common.showSpinner();
    this.api.getAPI("country?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.getcurrency();
       
            this.myForm.controls['countryCode'].setValue(data.countryMasterRecord.countryCode);
            this.myForm.controls['countryName'].setValue(data.countryMasterRecord.countryName);
            this.myForm.controls['languageName'].setValue(data.countryMasterRecord.languageName);
            this.myForm.controls['emailID'].setValue(data.countryMasterRecord.emailID);
            if(data.countryMasterRecord.currencyID > 0)
            this.myForm.controls['currency'].setValue(data.countryMasterRecord.currencyID);
            this.myForm.controls['currencySeparator'].setValue(data.countryMasterRecord.currencySeparator);
            this.myForm.controls['dateFormat'].setValue(data.countryMasterRecord.dateFormat);
            this.myForm.controls['dateSeparator'].setValue(data.countryMasterRecord.dateSeparator);
            this.myForm.controls['decimalPlaces'].setValue(data.countryMasterRecord.decimalPlaces);
            this.myForm.controls['negativeSign'].setValue(data.countryMasterRecord.negativeSign);
            this.myForm.controls['nearByRoundOff'].setValue(data.countryMasterRecord.nearByRoundOff);
            this.myForm.controls['promotionRoundOff'].setValue(data.countryMasterRecord.promotionRoundOff);
            if(data.countryMasterRecord.taxID > 0)
            this.myForm.controls['taxID'].setValue(data.countryMasterRecord.taxID);
            this.myForm.controls['posTitle'].setValue(data.countryMasterRecord.posTitle);
            this.myForm.controls['active'].setValue(data.countryMasterRecord.active);
            this.myForm.controls['orginCountry'].setValue(data.countryMasterRecord.orginCountry);
            this.myForm.controls['creditLimitCheck'].setValue(data.countryMasterRecord.creditLimitCheck);
            this.myForm.controls['allowSaleAndRedemption'].setValue(data.countryMasterRecord.allowSaleAndRedemption);
            this.inttaxCode = data.countryMasterRecord.taxCode;
            this.intcurrencyCode = data.countryMasterRecord.currencyCode;
            console.log("dfd");
            console.log(this.inttaxCode);
            console.log(this.intcurrencyCode);
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

  updateCountry() {
    if (this.country == null) {
      this.common.showMessage("warn", "Can not Save, Country Details are invalid.");
    } else {
      this.country.id = this.id;
      this.country.countryCode = this.myForm.get('countryCode').value;
      this.country.countryName = this.myForm.get('countryName').value;
      this.country.languageName = this.myForm.get('languageName').value;
      this.country.decimalDigit = this.myForm.get('decimalDigit').value;
      this.country.decimalPlaces = this.myForm.get('decimalPlaces').value;
      this.country.dateFormat = this.myForm.get('dateFormat').value;
      this.country.dateSeparator = this.myForm.get('dateSeparator').value;
      this.country.nearByRoundOff = this.myForm.get('nearByRoundOff').value;
      this.country.taxID = this.myForm.get('taxID').value;
      this.country.negativeSign = this.myForm.get('negativeSign').value;
      this.country.currencySeparator = this.myForm.get('currencySeparator').value;
      this.country.currency = this.intcurrencyCode;
      this.country.currencyID = this.myForm.get('currency').value;
      this.country.emailID = this.myForm.get('emailID').value;
      this.country.creditLimitCheck = this.myForm.get('creditLimitCheck').value;
      this.country.allowMultipleTransaction = this.myForm.get('allowMultipleTransaction').value;
      this.country.allowSaleAndRedemption = this.myForm.get('allowSaleAndRedemption').value;
      this.country.currencyCode = this.intcurrencyCode;
      this.country.taxCode = this.inttaxCode;
      this.country.active = this.myForm.get('active').value;
      this.country.orginCountry = this.myForm.get('orginCountry').value;
      this.country.posTitle = this.myForm.get('posTitle').value;
      this.country.promotionRoundOff = this.myForm.get('promotionRoundOff').value;


     // .log(this.country);
      this.common.showSpinner();
      this.api.putAPI("country", this.country).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['Country']);
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
        this.router.navigate(['Country']);
    }  
    } 
    else
    {
      this.router.navigate(['Country']);
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
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
     
    }
  }
}
