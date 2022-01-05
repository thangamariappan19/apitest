import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCountryMaster } from 'src/app/models/m-country-master';
import { Mwnpromotionheader } from 'src/app/models/m-wnpromotion-header'
import { Mwnpromotiondetails } from 'src/app/models/m-wnpromotion-detail'
import { MPricelistMaster } from 'src/app/models/m-pricelist-master';
import { Columns, Config, DefaultConfig, Event } from 'ngx-easy-table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-wnpromotion-add',
  templateUrl: './wnpromotion-add.component.html',
  styleUrls: ['./wnpromotion-add.component.css']
})
export class WnpromotionAddComponent implements OnInit {
  @ViewChild('styleCodeTpl', { static: true }) styleCodeTpl: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('fileInput')

  isSaveEnable: boolean = false;
  IsRow: boolean = false;
  configuration: Config;
  columns: Columns[];
  data: Array<Mwnpromotiondetails> = null;
  wnPromotiondetails: Array<Mwnpromotiondetails> = null;
  defaultCountryID: number;
  myForm: FormGroup;
  discount: boolean = true;
  nowprice: boolean = true;

  //PriceList: Array<MPricelistMaster>;
  PriceList: Array<any>;
  wnPromotion: Mwnpromotionheader
  countryName: any;
  selectedCountries: any = [];
  countries: string;
  dropdownSettings: IDropdownSettings = {};
  countryList: MCountryMaster[];
  sheetJsExcelName = 'null.xlsx';

  sheetCellRange: any;
  sheetMaxRow: any;
  localwSheet: any;
  localWorkBook: any;
  sheetBufferRender: any;

  excelDataEncodeToJson;
  excelTransformNum = [];

  origExcelData: AOA = [
    ['Data: 2018/10/26'],
    ['Data: 2018/10/26'],
    ['Data: 2018/10/26'],
  ];

  refExcelData: Array<any>;
  excelFirstRow = [];

  sheetNameForTab: Array<string> = ['excel tab 1', 'excel tab 2'];
  totalPage = this.sheetNameForTab.length;
  selectDefault: any;
  edit: number;
 


  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    private el: ElementRef,
    public router: Router) {
    this.createForm()
    this.wnPromotiondetails = new Array<Mwnpromotiondetails>();
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'countryName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true
    }
    this.selectedCountries = [];

    /*this.columns = [
      { key: 'country', title: 'Country' },
      { key: 'styleCode', title: 'StyleCode', cellTemplate: this.styleCodeTpl },
      { key: 'brand', title: 'Brand' },
      { key: 'wasPrice', title: 'WasPrice' },
      { key: 'discount', title: 'Discount' },
      { key: 'nowPrice', title: 'NowPrice' },
      { key: 'status', title: 'Status' },
      { key: 'errorMsg', title: 'ErrorMsg' },
      { key: 'action', title: 'Remove', cellTemplate: this.actionTpl },
    ];

    this.configuration = { ...DefaultConfig };
    this.configuration.infiniteScroll = true;
    this.configuration.paginationEnabled = false;
    this.configuration.infiniteScrollThrottleTime = 10;
    this.configuration.rows = 20;

    this.data = new Array<Mwnpromotiondetails>();*/
  }


  inputExcelOnClick(evt) {
    const target: HTMLInputElement = evt.target;

    console.log(target.files[0].name);

    if (target.files.length === 0) {
      throw new Error('Issue During Upload');
    }
    if (target.files.length > 1) {
      throw new Error('Cannot use multiple files');
    }
    this.sheetJsExcelName = evt.target.files.item(0).name;
    const reader: FileReader = new FileReader();
    this.readerExcel(reader);
    reader.readAsArrayBuffer(target.files[0]);
    this.sheetBufferRender = target.files[0];
    evt.target.value = '';
  }

  transform(value) {
    return (value >= 26 ? this.transform(((value / 26) >> 0) - 1) : '') + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[value % 26 >> 0];
  }

  readerExcel(reader, index = 0) {
    /* reset array */
    this.origExcelData = [];
    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const wBook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      this.localWorkBook = wBook;
      const wsname: string = wBook.SheetNames[index];
      this.sheetNameForTab = wBook.SheetNames;
      this.totalPage = this.sheetNameForTab.length;
      this.selectDefault = this.sheetNameForTab[index];
      const wSheet: XLSX.WorkSheet = wBook.Sheets[wsname];
      this.localwSheet = wSheet;
      this.sheetCellRange = XLSX.utils.decode_range(wSheet['!ref']);
      this.sheetMaxRow = this.sheetCellRange.e.r;
      this.origExcelData = <AOA>XLSX.utils.sheet_to_json(wSheet, {
        header: 1,
        range: wSheet['!ref'],
        raw: true,
      });


      this.refExcelData = this.origExcelData.slice(1).map(value => Object.assign([], value));

      this.excelTransformNum = [];
      for (let idx = 0; idx <= this.sheetCellRange.e.c; idx++) {
        this.excelTransformNum[idx] = this.transform(idx);
      }

      //this.refExcelData.map(x => x.unshift('#'));
      //this.excelTransformNum.unshift('order');

      this.excelDataEncodeToJson = this.refExcelData.slice(0).map(item =>
        item.reduce((obj, val, i) => {
          obj[this.excelTransformNum[i]] = val;
          return obj;
        }, {}),
      );

      console.log(this.excelDataEncodeToJson);
      this.Addlinedata(this.excelDataEncodeToJson);

    };
  }

  remove(rowIndex: number): void {
    this.data = [...this.data.filter((_v, k) => k !== rowIndex)];
  }

  AddNewRow() {
    let tempList: Mwnpromotiondetails = {
      brand: "",
      brandID: 0,
      country: "",
      countryID: 1,
      errorMsg: "",
      id: 0,
      status: "",
      styleID: 0,
      wasPrice: 0,
      wnPromotionID: 0,
      styleCode: "",
      discount: 0,
      nowPrice: 0
    }
    this.wnPromotiondetails.push(tempList);
    this.myForm.get('uploadType').disable();
    //this.IsRow=true;
    /*this.data = [
      ...this.data,
      {
          brand:"",
          brandID:0,
          country:"",
          countryID:1,
          errorMsg:"",
          id:0,
          status:"",
          styleID:0,
          wasPrice:0,
          wnPromotionID:0,
          styleCode: "",
          discount : 0,
          nowPrice : 0
      }
    ];*/

  }


  eventEmitted($event: { event: string; value: any }): void {
    if ($event.event === Event.onDoubleClick) {
      this.edit = $event.value.rowId;
    }
  }

  update($event: any): void {
    this.data[this.edit].styleCode = $event.target.value;
    this.edit = -1;
  }

  Addlinedata(datalist: Array<any>) {
    for (let item of datalist) {

      /*this.data = [
        ...this.data,
        {
            brand:"",
            brandID:0,
            country:"",
            countryID:1,
            errorMsg:"",
            id:0,
            status:"",
            styleID:0,
            wasPrice:0,
            wnPromotionID:0,
            styleCode: item.A,
            discount : item.C,
            nowPrice : item.B
        }
      ];*/
      let tempList: Mwnpromotiondetails = {
        brand: "",
        brandID: 0,
        country: "",
        countryID: 1,
        errorMsg: "",
        id: 0,
        status: "",
        styleID: 0,
        wasPrice: 0,
        wnPromotionID: 0,
        styleCode: item.A,
        discount: item.C,
        nowPrice: item.B
      }
      this.wnPromotiondetails.push(tempList);

    }
  }




  Save() {

    this.Validate();
    setTimeout(() => {

      this.common.showSpinner();
      this.countries = "";
      let stDate = this.myForm.get('startDate').value;
      let edDate = this.myForm.get('endDate').value;
      if (stDate > edDate) {
        this.common.showMessage('warn', 'End Date Must be Greater than Start Date');
      }
      else {
        for (let item of this.selectedCountries) {
          if (this.countries != "") {
            this.countries = this.countries + "," + item
          } else {
            this.countries = item;
          }
        }
        let arry = this.PriceList.filter(x => x.id == this.myForm.get('priceListID').value);
        this.wnPromotion = new Mwnpromotionheader();
        this.wnPromotion.id = 0;
        this.wnPromotion.promotionCode = this.myForm.get('promotionCode').value;
        this.wnPromotion.promotionName = this.myForm.get('promotionName').value;
        this.wnPromotion.startDate = this.myForm.get('startDate').value;
        this.wnPromotion.endDate = this.myForm.get('endDate').value;
        this.wnPromotion.pricePointID = 0;
        this.wnPromotion.priceListID = this.myForm.get('priceListID').value;
        this.wnPromotion.priceListCode = arry[0].priceListCode;
        this.wnPromotion.countries = this.countries;
        //  this.wnPromotion.priceListCode = this.myForm.get('priceListCode').value  ;
        this.wnPromotion.uploadType = this.myForm.get('uploadType').value;
        this.wnPromotion.pricePointApplicable = this.myForm.get('pricePointApplicable').value;
        this.wnPromotion.defaultCountryID = this.defaultCountryID;
        this.wnPromotion.active = this.myForm.get('active').value;
        //this.wnPromotion.WNPromotionDetailsList = this.data.filter(x => x.status == "Ok");
        setTimeout(() => {
          this.wnPromotion.WNPromotionDetailsList = this.wnPromotiondetails;

          this.api.postAPI("WNPromotion", this.wnPromotion).subscribe((data) => {

            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.common.hideSpinner();
              this.common.showMessage('success', data.displayMessage);
              console.log(data);
              this.clear_controls();
              this.router.navigate(['WNPromotions']);
            } else if (data != null && data.statusCode != null && data.statusCode == 2) {
              this.common.hideSpinner();
              this.common.showMessage('', data.displayMessage);
            }
            else {
              setTimeout(() => {
                this.common.hideSpinner();
                this.common.showMessage('error', 'Failed to Save.');
              }, this.common.time_out_delay);
            }
          });
        }, this.common.time_out_delay);
      }
    }, this.common.time_out_delay);
  }

  Validate() {
    let j = 1;
    let saveOk = true;
    let stDate = this.myForm.get('startDate').value;
    let edDate = this.myForm.get('endDate').value;
    if (stDate > edDate) {
      this.common.showMessage('warn', 'End Date Must be Greater than Start Date');
    }
    else {
      for (let i = 0; i < this.wnPromotiondetails.length-1; i++) {
        if (j == this.wnPromotiondetails.length) {
          j = this.wnPromotiondetails.length;
        }
        if (this.wnPromotiondetails[i].styleCode == this.wnPromotiondetails[j].styleCode && this.wnPromotiondetails[i].countryID==this.wnPromotiondetails[j].countryID) {
          saveOk = false;
          //j++;
          break;
        }
        else
        {
          j++;
        }
      }
      if (saveOk == true) {
        let tempWnDetailsList = Array<Mwnpromotiondetails>();
        this.common.showSpinner();
        this.countries = "";
        for (let item of this.selectedCountries) {
          if (this.countries != "") {
            this.countries = this.countries + "," + item
          } else {
            this.countries = item;
          }
        }
        

        this.wnPromotion = new Mwnpromotionheader();
        this.wnPromotion.id = 0;
        this.wnPromotion.promotionCode = this.myForm.get('promotionCode').value;
        this.wnPromotion.promotionName = this.myForm.get('promotionName').value;
        this.wnPromotion.startDate = this.myForm.get('startDate').value;
        this.wnPromotion.endDate = this.myForm.get('endDate').value;
        this.wnPromotion.pricePointID = 0;
        this.wnPromotion.priceListID = this.myForm.get('priceListID').value;
        this.wnPromotion.countries = this.countries;
        this.wnPromotion.priceListCode = null;
        this.wnPromotion.uploadType = this.myForm.get('uploadType').value;
        this.wnPromotion.pricePointApplicable = this.myForm.get('pricePointApplicable').value;
        this.wnPromotion.defaultCountryID = this.defaultCountryID;
        this.wnPromotion.active = this.myForm.get('active').value;
        this.wnPromotion.WNPromotionDetailsList = this.wnPromotiondetails;

        //this.wnPromotion.WNPromotionDetailsList = tempWnDetailsList ;
        this.api.putAPI("WNPromotion", this.wnPromotion).subscribe((rdata) => {

          if (rdata != null) {
            this.common.hideSpinner();
            //this.common.showMessage('success', rdata.displayMessage);
            console.log(rdata);
            //this.data = rdata;
            this.wnPromotiondetails = rdata;
            //this.wnPromotiondetails= this.wnPromotiondetails.filter(x=>x.brand != "" && x.errorMsg != null);
            //let inc=0;
            for(let i=0;i<this.wnPromotiondetails.length;i++)
            {
              /*if(inc==this.wnPromotiondetails.length)
              {
                inc=this.wnPromotiondetails.length;
              }
              else
              {
                inc++;
              }*/
              for(let inc=1;inc<this.wnPromotiondetails.length;inc++)
              {
                if(this.wnPromotiondetails[i].styleCode==this.wnPromotiondetails[inc].styleCode && this.wnPromotiondetails[inc].status=='Ok')
                {
                  this.wnPromotiondetails[inc].brand = this.wnPromotiondetails[i].brand;
                  this.wnPromotiondetails[inc].brandID = this.wnPromotiondetails[i].brandID;
                }
              }
            }
            let arry = this.wnPromotiondetails.filter(x => x.status == 'Not Ok');
            if (arry.length == 0) {
              this.isSaveEnable = true;
            }
            //this.clear_controls();
          } else {
            setTimeout(() => {
              this.common.hideSpinner();
              this.common.showMessage('error', 'Failed to Validate.');
            }, this.common.time_out_delay);
          }
        });
      }
      else {
        this.common.showMessage('warn', 'You entered Style Code Twise');
      }
    }
  }

  onOptionsSelected(value: any) {
    console.log("the selected value is " + value);
    let str: any = [];
    str = this.PriceList;
    for (let item of str) {
      if (item.id == value) {
        this.defaultCountryID = item.countryID;
        return;
      }
    }
    console.log(this.defaultCountryID);
  }

  onItemSelect(item: any) {
    this.selectedCountries.push(item.id);
  }

  onDeSelect(item: any) {
    console.log('onDeSelect');
    console.log(item);

    var currCountries = this.selectedCountries;
    const variant = this.selectedCountries.findIndex(v => v.id === item.id);
    this.selectedCountries.splice(variant, 1);

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
            console.log(this.countryList);
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

  getPriceList() {
    this.PriceList = null;
    this.common.showSpinner();
    this.api.getAPI("PriceList?sdata='WNPROMOTION'")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null) {
            this.PriceList = data;
            //this.PriceList = this.PriceList.filter(x => x.active == true );
            console.log(this.PriceList);
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
          break;
        }
      }
    }
  }

  createForm() {
    this.myForm = this.fb.group({
      promotionCode: ['', Validators.required],
      promotionName: ['', Validators.required],
      countries: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      priceListID: ['', Validators.required],
      uploadType: ['', Validators.required],
      active: [true],
      pricePointApplicable: [false],
      fileInput:['']
    });
    this.clear_controls();
    this.getCountry();
    this.getPriceList();
    this.wnPromotion = new Mwnpromotionheader();
    ;
  }

  clear_controls() {
    this.myForm.controls['promotionCode'].setValue('');
    this.myForm.controls['promotionName'].setValue('');
    this.myForm.controls['countries'].setValue('');
    this.myForm.controls['startDate'].setValue('');
    this.myForm.controls['endDate'].setValue('');
    this.myForm.controls['priceListID'].setValue('');
    this.myForm.controls['uploadType'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.wnPromotiondetails = [];
    this.selectedCountries = [];
    this.myForm.get('uploadType').enable();
    this.isSaveEnable = false;
    //this.countryName = '';
  }

  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['WNPromotions']);
      }
    }
    else {
      this.router.navigate(['WNPromotions']);
    }

  }

  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  checkUploadtype() {
    let type = this.myForm.get('uploadType').value;
    if (type == "Discount") {
      this.discount = true;
      this.nowprice = false;
    }
    else if (type == "Now Price") {
      this.discount = false;
      this.nowprice = true;
    }
  }

  void_item(item) {
    const idx = this.wnPromotiondetails.indexOf(item, 0);
    if (idx > -1) {
      this.wnPromotiondetails.splice(idx, 1);
    }
  }

}
