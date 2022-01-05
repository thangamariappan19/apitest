import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { style } from '@angular/animations';
import { MCommonUtil } from 'src/app/models/m-common-util';
import { MCurrencyMaster } from 'src/app/models/m-currency-master';
import { MPricePoint, MPricePointRange } from 'src/app/models/m-price-point';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-price-point-edit',
  templateUrl: './price-point-edit.component.html',
  styleUrls: ['./price-point-edit.component.css']
})
export class PricePointEditComponent implements OnInit {

  myForm: FormGroup;
  id: any;
  user_details: MUserDetails = null;
  brand_list: Array<any>;
  brandDropdownSettings: IDropdownSettings = {};
  selectedBrandList = [];
  brandselList: string = "";
  currencyList: Array<MCurrencyMaster>
  currencyDropDownList: Array<MCurrencyMaster>
  pricePointArryList: Array<any>;
  rangeList: Array<any>;
  rangeList1: Array<any>;
  pricePoint: MPricePoint;
  pricePointList: Array<MPricePoint>;
  pricePointRange: Array<MPricePointRange>;
  tempGetList: Array<any>;
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
      baseCurrency: ['', Validators.required],
      rangeFrom: [''],
      rangeTo: [''],
      active: [true]
    });
    //this.getBrand();
    //this.getcurrencyList();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
    this.rangeList = new Array<any>();
    this.rangeList1 = new Array<any>();
    this.pricePoint = new MPricePoint();
    this.pricePointList = new Array<MPricePoint>();
    this.pricePointRange = new Array<MPricePointRange>();
    this.tempGetList = new Array<any>();
  }
  getBrand() {
    this.brand_list = null;
    this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brand_list = data.responseDynamicData;
            this.selectedBrandList = [];
            this.displayBrand();
            this.brandDropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'brandName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              enableCheckAll: true,
              allowSearchFilter: true,
              itemsShowLimit: 4
            };

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

  onSelectBrand(item: any) {
    //console.log(this.selectedBrandList);
  }
  onSelectAllBrand(items: any) {
    // console.log(this.selectedBrandList);
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
            this.getRemainingCurrencyList();
            //this.currencyList = this.currencyList.filter(x => x.active==true);

            //this.createExchangeRateList();
            //this.pricePointArryList = [];
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  createExchangeRateList() {
    //if (this.currencyList != null && this.dateList != null) {
    //// .log("In Loop");
    //for (let cl of this.currencyList) {
    //for (let dl of this.dateList) {
    this.pricePointArryList.push({
      "rangeFrom": '',
      "rangeTo": '',
      "price": 0,
      "baseCurrency": 'KWD'
    });
    //}
    //}

    //// .log(this.exchangeRateList);
    // }
  }

  getRemainingCurrencyList() {
    this.currencyList = this.currencyDropDownList;
    let basecur = this.myForm.get('baseCurrency').value;
    this.currencyList = this.currencyList.filter(x => x.currencyCode != basecur && x.active == true);
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPricePointData();
  }
  getPricePointData() {
    this.common.showSpinner();
    this.api.getAPI("PricePoint?PricePointCode=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['code'].setValue(data.pricePointList[0].pricePointCode);
            this.myForm.controls['name'].setValue(data.pricePointList[0].pricePointName);
            this.getcurrencyList();
            this.myForm.controls['baseCurrency'].setValue(data.pricePointList[0].baseCurrencyCode);
            this.myForm.controls['active'].setValue(data.pricePointList[0].active);
            this.tempGetList = data.pricePointList;
            this.pricePointArryList = new Array<any>();
            this.pricePointArryList = this.tempGetList[0].pricePointRangeList;
            console.log(this.pricePointArryList);
            console.log(this.tempGetList);
            this.getBrand();
            //this.getRemainingCurrencyList();
            this.displayCurrencyPricePoint();
            //this.displayBrand();
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  displayBrand() {
    if (this.tempGetList != null) {
      for (let i = 0; i < this.brand_list.length; i++) {
        for (let j = 0; j < this.tempGetList.length; j++) {
          if (this.tempGetList[j].brandID == this.brand_list[i].id) {
            this.selectedBrandList.push({
              id: this.brand_list[i].id,
              brandName: this.brand_list[i].brandName
            });
          }
        }
      }
    }
  }

  displayCurrencyPricePoint() {
    //for(let getdata of this.tempGetList[0])
    //{
    this.common.showSpinner();
    let temlist = this.tempGetList[0].pricePointRangeList;
    console.log(temlist);

    for (let getdata of temlist) {
      this.rangeList1.push({
        "rangeFrom": getdata.rangeFrom,
        "rangeTo": getdata.rangeTo
      })
    }
    //this.rangeList = this.rangeList.filter((item, index) => this.rangeList.indexOf(item) === index);
    let i = 0;
    for (let rng of this.rangeList1) {
      this.removeduplicate(rng.rangeFrom, rng.rangeTo)
    }
    setTimeout(() => {
      this.common.hideSpinner();
    }, this.common.time_out_delay);
  }
  removeduplicate(range1, range2) {
    let pushval: boolean = true;
    if (this.rangeList.length == 0) {
      this.rangeList.push({
        "rangeFrom": range1,
        "rangeTo": range2
      })
    }
    else {
      for (let chcrng of this.rangeList) {
        if (chcrng.rangeFrom == range1 && chcrng.rangeTo == range2) {
          pushval = false;
          break;
        }
        else {
          pushval = true;
        }
      }
      if (pushval == true) {
        this.rangeList.push({
          "rangeFrom": range1,
          "rangeTo": range2
        })
      }
    }
  }

  addPricePointDetails() {
    let allowadd: boolean = true;
    let rngfrom = this.myForm.get('rangeFrom').value;
    let rngto = this.myForm.get('rangeTo').value;
    if (this.rangeList.length != 0) {
      for (let rang of this.rangeList) {
        if (rang.rangeFrom == rngfrom) {
          allowadd = false;
        }
        else {
          allowadd = true;
        }
      }
    }
    if (rngfrom >= rngto) {
      this.common.showMessage('warn', 'Range To Must Be Greater than Range From.');
    }
    else {
      if (allowadd == true) {
        this.rangeList.push({
          "rangeFrom": this.myForm.get('rangeFrom').value,
          "rangeTo": this.myForm.get('rangeTo').value
        })
        if (this.currencyList != null) {
          for (let cl of this.currencyList) {
            //for (let dl of this.dateList) {
            this.pricePointArryList.push({
              'pricePointID': 0,
              "rangeFrom": this.myForm.get('rangeFrom').value,
              "rangeTo": this.myForm.get('rangeTo').value,
              "currencyID": cl.id,
              "internationalCode": cl.currencyCode,
              "price": 0,
              'pricePointCode': this.myForm.get('code').value,
              'brandCode': null
            });
            //}
          }
        }
      }
      else {
        this.common.showMessage('warn', 'Range Value Already Exist.');
      }
    }
  }
  clear_controls() { }
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['price-point']);
      }
    }
    else {
      this.router.navigate(['price-point']);
    }
  }

  setExchangeRate(fromRange: string, toRange: string, currencyCode: string, e) {
    this.common.showSpinner();
    if (this.pricePointArryList != null && this.pricePointArryList != []) {
      let item = this.pricePointArryList.filter(x => x.rangeFrom == fromRange && x.rangeTo == toRange && x.internationalCode == currencyCode);
      if (item != null && item[0] != null) {
        item[0].price = e;
      }
    }
    setTimeout(() => {
      this.common.hideSpinner();
    }, this.common.time_out_delay);
  }

  addPricePointRecord() {
    this.getAddPricePointRange();
    if (this.pricePoint == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else {
      if (this.pricePointRange.length == 0) {
        this.common.showMessage("warn", "Can not Save, Price Point Range Details are invalid.");
      }
      else {
        this.pricePoint.id = 1;
        this.pricePoint.pricePointCode = this.myForm.get('code').value;
        this.pricePoint.pricePointName = this.myForm.get('name').value;
        this.pricePoint.pricePointList = this.pricePointList;
        this.pricePoint.pricePointRangeList = this.pricePointRange;
        //this.pricePoint.exchangeRateDate = month;
        //this.pricePoint.exchangeRateslist = this.exchangeRateListAdd;
        this.common.showSpinner();
        this.api.postAPI("PricePoint", this.pricePoint).subscribe((data) => {
          //// .log(data);
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            this.common.showMessage('success', data.displayMessage);
            this.router.navigate(['price-point']);
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

  getAddPricePointRange() {
    for (let brand of this.selectedBrandList) {
      for (let pricerange of this.pricePointArryList) {
        let brandcode = this.brand_list.filter(x => x.id == brand.id)
        //pricerange.brandCode = brandcode[0].brandCode;
        let temprange: MPricePointRange = {
          id: 0,
          pricePointID: 0,
          rangeFrom: pricerange.rangeFrom,
          rangeTo: pricerange.rangeTo,
          currencyID: pricerange.currencyID,
          internationalCode: pricerange.internationalCode,
          price: pricerange.price,
          pricePointCode: pricerange.pricePointCode,
          brandCode: brandcode[0].brandCode
        }
        this.pricePointRange.push(temprange);
      }
    }
    //this.pricePointRange = this.pricePointArryList;
    let basecur = this.myForm.get('baseCurrency').value;
    this.currencyDropDownList = this.currencyDropDownList.filter(x => x.currencyCode == basecur && x.active == true);
    if (this.selectedBrandList.length == 0) {
      this.common.showMessage("warn", "Can not Save, Please Select Brand.");
    }
    else {
      for (let brandse of this.selectedBrandList) {
        let brandcode = this.brand_list.filter(x => x.id == brandse.id)
        let tempcurrencydetails: MPricePoint = {
          id: 0,
          pricePointCode: this.myForm.get('code').value,
          pricePointName: this.myForm.get('name').value,
          brandID: brandse.id,
          baseCurrencyID: this.currencyDropDownList[0].id,
          brandCode: brandcode[0].brandCode,
          baseCurrencyCode: this.currencyDropDownList[0].currencyCode,
          remarks: null,
          //brandName: this.myForm.get('prefix').value,
          currencyName: this.currencyDropDownList[0].currencyCode,
          //pricePointRangeList?: Array<MPricePointRange>;      
          active: this.myForm.get('active').value,
          createBy:this.user_details.id
        }
        this.pricePointList.push(tempcurrencydetails);
      }
    }
  }
  getExchangeRate(fromRange: string, toRange: string, currencyCode: string) {
    let result: Number = 0;
    if (this.pricePointArryList != null && this.pricePointArryList != []) {
      let item = this.pricePointArryList.filter(x => x.rangeFrom == fromRange && x.rangeTo == toRange && x.internationalCode == currencyCode);
      //// .log(item);
      result = item != null && item[0] != null && item[0].price != null ? item[0].price : 0;
    }
    return result;
  }
  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  remove_rang(item) {
    const idx = this.rangeList.indexOf(item, 0);
    if (idx == -1) 
    {
        this.rangeList.splice(idx, 1);
        
       
    }
   
  
  }
}
