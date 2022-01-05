import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCurrencyMaster } from 'src/app/models/m-currency-master';
import { MExchangeRate } from 'src/app/models/m-exchange-rate';

@Component({
  selector: 'app-exchange-rate-edit',
  templateUrl: './exchange-rate-edit.component.html',
  styleUrls: ['./exchange-rate-edit.component.css']
})
export class ExchangeRateEditComponent implements OnInit {
  id: any;
  myForm: FormGroup;
  currencyList: Array<MCurrencyMaster>
  currencyDropDownList: Array<MCurrencyMaster>
  exchangeRate: MExchangeRate
  exchangeRateListAdd: Array<MExchangeRate>
  dateList: Array<any>;
  getMonth: Number;
  temp: Array<any>;
  minDate: any;
  maxDate: any;
  exchangeRateList: Array<any>;
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
      code: ['', Validators.required],
      name: ['', Validators.required],
      monthYear: ['', Validators.required],
      baseCurrency: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      targetCurrencys: [''],
      exchangeRates: [''],
      active: [true]
    });
    this.exchangeRate = new MExchangeRate();
    this.exchangeRateListAdd = Array<MExchangeRate>();
    this.getcurrencyList();
  }
  getcurrencyList() {
    this.currencyList = null;
    this.currencyDropDownList = null;
    this.common.showSpinner();
    this.api.getAPI("currency")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.currencyDropDownList = data.currencyMasterList;
            this.currencyDropDownList = this.currencyDropDownList.filter(x => x.active == true);
            //this.currencyList = this.currencyList.filter(x => x.active==true);
            //this.getdata();
            this.getDaysInMonth();
            //this.createExchangeRateList();
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });

  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getDocumentNumberingData();
  }

  getDocumentNumberingData() {
    this.common.showSpinner();
    this.api.getAPI("exchangerates?ExchangeCode=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['code'].setValue(data.exchangeRatesList[0].exchangeRatesCode);
            this.myForm.controls['name'].setValue(data.exchangeRatesList[0].exchangeRatesName);
            this.myForm.controls['monthYear'].setValue(this.common.toMYFormat(new Date(data.exchangeRatesList[0].exchangeRateDate)));
           // this.getDaysInMonth();
            this.myForm.controls['baseCurrency'].setValue(data.exchangeRatesList[0].baseCurrencyID);
            this.myForm.controls['active'].setValue(data.exchangeRatesList[0].active);
            this.exchangeRateListAdd = data.exchangeRatesList;
            this.exchangeRateList = this.exchangeRateListAdd;
            for (let exchange of this.exchangeRateList) {
              exchange.exchangeRateDate = this.common.toYMDFormat(new Date(exchange.exchangeRateDate))
            }
            this.getDaysInMonth();
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });


  }
  getDaysInMonth() {
    // .log(this.myForm.get('monthYear').value)
    this.temp = [];
    var str = new String(this.myForm.get('monthYear').value)
    var splits = str.split("-")
    this.temp = splits;

    this.currencyList = null;
    this.currencyList = this.currencyDropDownList;
    let basecur = this.myForm.get('baseCurrency').value;
    this.currencyList = this.currencyList.filter(x => x.id != basecur && x.active == true);
    for (let currency of this.currencyList) {
      currency.exchangeRate = 0;
    }
    this.getMonth = parseInt(this.temp[1]) - 1;
    // .log(this.getMonth);
    let year = this.temp[0];
    let month = parseInt(this.getMonth.toString());
    var date = new Date(year, month);
    //var days = [];
    this.dateList = [];
    //this.exchangeRateList = [];
    while (date.getMonth() == month) {
      this.dateList.push({
        "valueDate": this.common.toYMDFormat(new Date(date)),
        "displayDate": this.common.toDMYFormat(new Date(date))
      });
      // this.dateList.push(this.common.toYMDFormat(new Date(date)));
      date.setDate(date.getDate() + 1);
    }
    this.minDate = this.dateList[0].valueDate;
    let dateLength = this.dateList.length;
    dateLength = parseInt(dateLength.toString());
    this.maxDate = this.dateList[dateLength - 1].valueDate;
    this.myForm.controls['startDate'].setValue(this.minDate);
    this.myForm.controls['endDate'].setValue(this.maxDate);
     this.getExchangeDatabaseData();
  }
  getExchangeDatabaseData() {
    for (let dbexchange of this.exchangeRateList) {
      for (let cur of this.currencyList) {
        if (cur.currencyCode == dbexchange.targetCurrency) {
          cur.exchangeRate = dbexchange.exchangeAmount;
        }
      }
    }
  }

  getdata() {
    this.currencyList = this.currencyDropDownList;
    let basecur = this.myForm.get('baseCurrency').value;
    this.currencyList = this.currencyList.filter(x => x.id != basecur && x.active == true);
    for (let currency of this.currencyList) {
      currency.exchangeRate = 0;
    }
  }
  addExchangeRate() {
    this.getExchangeRateAddList();
    let valid_Rate = this.exchangeRateListAdd.filter(x => x.exchangeAmount > 0);
    let month = this.myForm.get('monthYear').value;
    month = month + '- 01'
    if (this.exchangeRate == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else {
      if (this.exchangeRateList.length == 0) {
        this.common.showMessage("warn", "Can not Save, Exchange Rate Details are invalid.");
      } else {
        if (valid_Rate.length == 0) {
          this.common.showMessage("warn", "Can not Save, Exchange amount are invalid.");
        } else {
          this.exchangeRate.id = 1;
          this.exchangeRate.exchangeRateDate = month;
          this.exchangeRate.exchangeRateslist = this.exchangeRateListAdd;
          this.common.showSpinner();
          this.api.postAPI("exchangerates", this.exchangeRate).subscribe((data) => {
            //// .log(data);
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.common.hideSpinner();
              this.common.showMessage('success', data.displayMessage);
              this.router.navigate(['exchange-rate']);
            } else {
              setTimeout(() => {
                this.common.hideSpinner();
                this.common.showMessage('error', 'Failed to Save.');
              }, this.common.time_out_delay);
            }

          });
        }
      }
    }
  }
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['exchange-rate']);
      }
    }
    else {
      this.router.navigate(['exchange-rate']);
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
  clear_controls() {
    this.myForm.controls['code'].setValue('');
    this.myForm.controls['name'].setValue('');
    this.myForm.controls['monthYear'].setValue('');
    this.myForm.controls['baseCurrency'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.currencyList = null;
  }
  getExchangeRateAddList() {
    let basecur = this.myForm.get('baseCurrency').value;
    let basecurcode;
    let item = this.currencyDropDownList.filter(x => x.id == basecur);
    basecurcode = item != null && item[0] != null && item[0].currencyCode != null ? item[0].currencyCode : null;
    // .log(basecurcode);
    this.exchangeRateListAdd = this.exchangeRateList;
    for (let exchange of this.exchangeRateListAdd) {
      exchange.exchangeRatesCode = this.myForm.get('code').value;
      exchange.exchangeRatesName = this.myForm.get('name').value;
      exchange.baseCurrencyID = this.myForm.get('baseCurrency').value;
      exchange.baseCurrency = basecurcode;
    }
  }
  getExchangeRate(valueDate: string, currencyCode: string) {
    let result: Number = 0;
    if (this.exchangeRateList != null && this.exchangeRateList != []) {
      let item = this.exchangeRateList.filter(x => x.exchangeRateDate == valueDate && x.targetCurrency == currencyCode);
      //// .log(item);
      result = item != null && item[0] != null && item[0].exchangeAmount != null ? item[0].exchangeAmount : 0;
    }
    return result;
  }

  setExchangeRate(valueDate: string, currencyCode: string, e) {
    //.log(valueDate);
    //.log(currencyCode);
    //.log(e);
    // alert('hi');
    if (this.exchangeRateList != null && this.exchangeRateList != []) {
      let item = this.exchangeRateList.filter(x => x.exchangeRateDate == valueDate && x.targetCurrency == currencyCode);
      if (item != null && item[0] != null) {
        item[0].exchangeAmount = e;
      }

    }
    //.log(this.exchangeRateList);
  }

  assignRates() {
    let startDat = this.common.toYMDFormat(new Date(this.myForm.get('startDate').value));
    let endDat = this.common.toYMDFormat(new Date(this.myForm.get('endDate').value));
    let targetcurr = this.myForm.get('targetCurrencys').value;
    if (this.exchangeRateList != null && this.exchangeRateList != []) {
      for (let exchange of this.exchangeRateList) {
        /*let item = this.exchangeRateList.filter(x => x.valueDate >= startDat && x.valueDate <= endDat && x.targetCurrency == targetcurr);
        if (item != null && item[0] != null) {
          item[0].exchangeAmount = this.myForm.get('exchangeRates').value;
        }*/
        if (exchange.exchangeRateDate >= startDat && exchange.exchangeRateDate <= endDat && exchange.targetCurrency == targetcurr) {
          exchange.exchangeAmount = this.myForm.get('exchangeRates').value;
        }
      }
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
