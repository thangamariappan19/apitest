import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCountryMaster } from 'src/app/models/m-country-master';
// import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-country-add',
  templateUrl: './country-add.component.html',
  styleUrls: ['./country-add.component.css']
})
export class CountryAddComponent implements OnInit {

  myForm: FormGroup;
  TaxList: Array<any>;
  LanguageMasterList: Array<any>;
  CurrencyMasterList: Array<any>;
  intcurrencyCode: string;
  inttaxCode: string;
  country: MCountryMaster;

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router) {
    // , public translate: TranslateService) {
      // translate.addLangs(['en', 'ar']);
      // translate.setDefaultLang('ar');
      // const browserLang = translate.getBrowserLang();
      // // translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
      // translate.use('ar');
      this.createForm();
  }



  createForm() {
    this.myForm = this.fb.group({
      countryCode: ['', Validators.required],
      countryName: ['', Validators.required],
      languageName: ['', Validators.required],
      taxID: ['', Validators.required],
      currency: ['', Validators.required],
      decimalDigit: [''],
      decimalPlaces: [''],
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
      currencyID: [''],
      nearByRoundOff: [''],
      currencyCode: [''],
      taxCode: [''],
      posTitle: [''],
      promotionRoundOff: [''],
      active: [false]

    });
    this.gettax();
    this.getlanguage();
    this.getcurrency();
    this.clear_controls();
  }

  clear_controls() {

    this.country = new MCountryMaster();
    this.myForm.controls['countryCode'].setValue('');
    this.myForm.controls['countryName'].setValue('');
    this.myForm.controls['languageName'].setValue('');
    this.myForm.controls['emailID'].setValue('');
    this.myForm.controls['currency'].setValue('');
    this.myForm.controls['currencySeparator'].setValue('');
    this.myForm.controls['dateFormat'].setValue('');
    this.myForm.controls['dateSeparator'].setValue('');
    this.myForm.controls['decimalPlaces'].setValue('');
    this.myForm.controls['negativeSign'].setValue('');
    this.myForm.controls['nearByRoundOff'].setValue('');
    this.myForm.controls['promotionRoundOff'].setValue('');
    this.myForm.controls['taxID'].setValue('');
    this.myForm.controls['posTitle'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['orginCountry'].setValue(false);
    this.myForm.controls['creditLimitCheck'].setValue(false);
    this.myForm.controls['allowSaleAndRedemption'].setValue(false);
  }

  gettax() {
    this.TaxList = null;
    this.common.showSpinner();
    this.api.getAPI("TaxlookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.TaxList = data.responseDynamicData;
            // .log(this.TaxList);
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

  getcurrency() {
    this.CurrencyMasterList = null;
    this.common.showSpinner();
    this.api.getAPI("CurrencylookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.CurrencyMasterList = data.currencyMasterList;
            // .log(this.CurrencyMasterList);
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

  getlanguage() {
    this.LanguageMasterList = null;
    this.common.showSpinner();
    this.api.getAPI("LanguagelookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.LanguageMasterList = data.languageMasterList;
            this.LanguageMasterList = this.LanguageMasterList.filter(x => x.active == true);
            // .log(this.LanguageMasterList);
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

  addCountry() {
    if (this.country == null) {
      this.common.showMessage("warn", "Can not Save, Country Details are invalid.");
    } else {
      this.country.id = 0;
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
      this.api.postAPI("country", this.country).subscribe((data) => {
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
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['Country']);
      }
    }
    else {
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
  restrictExceptNos(event) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
     
    }
  }
}
