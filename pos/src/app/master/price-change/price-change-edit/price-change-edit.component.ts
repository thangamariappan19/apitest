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
import { MCountryMaster } from 'src/app/models/m-country-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MPriceChangeDetails, MPriceChangeCountries, MPriceChange } from 'src/app/models/m-price-change';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-price-change-edit',
  templateUrl: './price-change-edit.component.html',
  styleUrls: ['./price-change-edit.component.css']
})
export class PriceChangeEditComponent implements OnInit {
  isDisabled:boolean=false;
  id: any;
  myForm: FormGroup;
  // currencyList: Array<MCurrencyMaster>;
  // countryDropDownList:Array<MCountryMaster>;
  // countryList:Array<MCountryMaster>;
  excelUpload: boolean = false;
  tempTableList: Array<any>;
  validateStyleList: Array<any>;
  styleList: Array<any>;
  currencyList: Array<any>;
  headerList: Array<any>;
  countryDropDownList: Array<any>;
  countryList: Array<any>;
  documentnumberinglist: Array<any>;
  columnList: Array<any>;
  tableColumns: Array<any>;
  rowValues: Array<any>;
  gridcolumnheaders: Array<any>;
  source_CountryName: string;
  priceChangeDetailsList: Array<MPriceChangeDetails>;
  dumPriceChangeDetailsList: Array<MPriceChangeDetails>;
  data: Array<MPriceChangeDetails> = null;
  priceChangeCountries: Array<MPriceChangeCountries>;
  user_details: MUserDetails = null;
  userid: number;
  documenttypeid: number;
  businessdate: any;
  storeid: number;
  dateList: Array<any>;
  remarks: any = '';
  priceChangeHeader: MPriceChange;
  sheetJsExcelName = 'null.xlsx';
  sheetBufferRender: any;
  isGenerate: boolean = false;
  isValidate: boolean = false;

  origExcelData: AOA = [
    ['Data: 2018/10/26'],
    ['Data: 2018/10/26'],
    ['Data: 2018/10/26'],
  ];

  sheetCellRange: any;
  sheetMaxRow: any;
  localwSheet: any;
  localWorkBook: any;

  excelDataEncodeToJson;
  excelTransformNum = [];

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
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      documentNo: ['', Validators.required],
      documentDate: ['', Validators.required],
      priceChangeDate: ['', Validators.required],
      priceChangeType: ['', Validators.required],
      multipleCountries: [false],
      sourceCountry: ['', Validators.required],
      remarks: ['']
    });
    this.validateStyleList = new Array<any>();
    this.getStaticValues();
    this.currencyList = new Array<any>();
    this.countryDropDownList = new Array<any>();
    this.countryList = new Array<any>();
    this.documentnumberinglist = new Array<any>();
    this.styleList = new Array<any>();
    //this.getDocumentNumber();
    //this.getcurrencyList();
    //this.getCountryList();
    //this.myForm.get('sourceCountry').setValue(0);
    //this.getRemainingCurrencyList();
    this.dateList = [];
    this.priceChangeCountries = new Array<MPriceChangeCountries>();
    this.dumPriceChangeDetailsList = new Array<MPriceChangeDetails>();
  }
  getStaticValues() {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
    this.userid = this.user_details.id;
    this.storeid = this.user_details.storeID;
    this.documenttypeid = 78;
    this.businessdate = this.common.toYMDFormat(new Date());
    this.myForm.controls['documentDate'].setValue(this.businessdate);
    this.myForm.controls['priceChangeDate'].setValue(this.businessdate);
  }
  getDocumentNumber() {
    this.getStaticValues();
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.storeid + "&DocumentTypeID=" + this.documenttypeid + "&business_date=" + this.businessdate)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.documentnumberinglist = data.documentNumberingBillNoDetailsRecord;
            this.myForm.controls['documentNo'].setValue(data.documentNumberingBillNoDetailsRecord.prefix);
          } else {
            //this.common.showMessage('warn', 'Failed to retrieve Data.');
            //this.productgroupList=null;
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }

          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getcurrencyList() {
    this.currencyList = null;
    this.common.showSpinner();
    this.api.getAPI("APICurrencylookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.currencyList = data.currencyMasterList;
            // console.log(this.currencyList);
            this.currencyList = this.currencyList.filter(x => x.active == true);
            //console.log(this.currencyList);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getCountryList() {
    this.countryList = null;
    this.countryDropDownList = null;
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
            // console.log(this.countryList);
            this.getMultipleCountries();
            this.generateList();
            //this.countryList = this.countryList.filter(x => x.active == true);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getFailedList();
  }

  getFailedList() {
    //this.pos_list = null;
    this.common.showSpinner();
    this.api.getAPI("PriceChange?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.getCountryList();
            this.myForm.controls['documentNo'].setValue(data.priceChangeRecord.documentNo);
            //this.getcurrencyList();
            this.getCountryList();
            this.myForm.controls['documentDate'].setValue(this.common.toYMDFormat(new Date(data.priceChangeRecord.documentDate)));
            this.myForm.controls['priceChangeDate'].setValue(this.common.toYMDFormat(new Date(data.priceChangeRecord.priceChangeDate)));
            this.myForm.controls['priceChangeType'].setValue(data.priceChangeRecord.priceChangeType);
            this.myForm.controls['multipleCountries'].setValue(data.priceChangeRecord.multipleCountry);
            //this.getMultipleCountries();
            this.myForm.controls['sourceCountry'].setValue(data.priceChangeRecord.sourceCountryID);
            this.myForm.controls['remarks'].setValue(data.priceChangeRecord.remarks);
            // this.getCountryList();
            this.dumPriceChangeDetailsList = data.priceChangeRecord.priceChangeDetailsList;
            this.priceChangeCountries = data.priceChangeRecord.priceChangeCountriesList;
            this.validateStyleList=this.dumPriceChangeDetailsList;
            //this.generate();
            //this.generateList();
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

  getMultipleCountries() {
    if (this.myForm.get('multipleCountries').value == true) {
      this.getGridColumnHeaders();
      if (this.myForm.get('sourceCountry').value != 0) {
        this.countryDropDownList = this.countryList;
        let basecur = this.myForm.get('sourceCountry').value;
        this.countryDropDownList = this.countryList.filter(x => x.id != basecur);// && x.active == true);
        for (let countryDrop of this.countryDropDownList) {
          for (let sele of this.priceChangeCountries) {
            if (countryDrop.countryCode == sele.countryCode) {
              countryDrop.active = true;
              countryDrop.pricePointApplicable = sele.pricePointApplicable;
              break;
            }
          }
        }

      } else {
        this.countryDropDownList = this.countryList;
        for (let countryDrop of this.countryDropDownList) {
          for (let sele of this.priceChangeCountries) {
            if (countryDrop.countryCode == sele.countryCode) {
              countryDrop.active = true;
              break;
            }
          }
        }

      }
    } else {
      this.countryDropDownList = null;
      this.gridcolumnheaders = null;
    }
  }
  getGridColumnHeaders() {
    let tempgridcolumnheaders: Array<{ name: string }> = Array()
    tempgridcolumnheaders.push({ name: 'Select' })
    tempgridcolumnheaders.push({ name: 'Code' })
    tempgridcolumnheaders.push({ name: 'Name' })
    tempgridcolumnheaders.push({ name: 'Price-Point Applicable?' })
    this.gridcolumnheaders = tempgridcolumnheaders;
  }
  void_item(item) {
    const idx = this.rowValues.indexOf(item, 0);
    if (idx > -1) {
      this.rowValues.splice(idx, 1);
    }
  }
  getRemainingCurrencyList() {
    // this.source_CountryName = null;
    if (this.myForm.get('multipleCountries').value == true) {
      this.countryDropDownList = this.countryList;
      let basecur = this.myForm.get('sourceCountry').value;

      this.countryDropDownList = this.countryList.filter(x => x.id != basecur);// && x.active == true);
    } else {
      this.countryDropDownList = null;
    }
  }
  generate() {
    if (this.myForm.get('documentNo').value == null || this.myForm.get('documentNo').value == "") {
      this.common.showMessage('warn', 'Document Number is empty');
    }
    else if (this.myForm.get('documentDate').value == null || this.myForm.get('documentDate').value == "") {
      this.common.showMessage('warn', 'Please select Document Date');
    }
    else if (this.myForm.get('priceChangeDate').value == null || this.myForm.get('priceChangeDate').value == "") {
      this.common.showMessage('warn', 'Please select Price change date');
    }
    else if (this.myForm.get('priceChangeType').value == null || this.myForm.get('priceChangeType').value == "") {
      this.common.showMessage('warn', 'Please select Price change type');
    }
    else if (this.myForm.get('sourceCountry').value == null || this.myForm.get('sourceCountry').value == "") {
      this.common.showMessage('warn', 'Please select Source Country');
    }
    else {
      if (confirm("All Header Controls will be Disabled.")) {
        this.isGenerate = true;
        this.myForm.get('documentNo').disable();
        this.myForm.get('documentDate').disable();
        this.myForm.get('priceChangeDate').disable();
        this.myForm.get('priceChangeType').disable();
        this.myForm.get('sourceCountry').disable();
        this.myForm.get('multipleCountries').disable();


        let tempcolumnheaders: Array<{ name: string }> = Array()
        let dropdownselectcounty = this.myForm.get('sourceCountry').value;

        let sourceCountryName = this.countryList.filter(x => x.id == dropdownselectcounty);
        tempcolumnheaders.push({ name: 'StyleCode' })
        tempcolumnheaders.push({ name: 'BrandName' })

        tempcolumnheaders.push({ name: sourceCountryName[0].countryCode + "_" + "Currency" })
        tempcolumnheaders.push({ name: sourceCountryName[0].countryCode + "_" + "Old" })
        tempcolumnheaders.push({ name: sourceCountryName[0].countryCode + "_" + "New" })
        let selCountry = this.myForm.get('multipleCountries').value;
        if(selCountry==true){
        this.columnList = this.countryDropDownList.filter(x => x.active == true);
        for (let i = 0; i < this.columnList.length; i++) {
          tempcolumnheaders.push({ name: this.columnList[i].countryCode + "_" + "Currency" })
          tempcolumnheaders.push({ name: this.columnList[i].countryCode + "_" + "Old" })
          tempcolumnheaders.push({ name: this.columnList[i].countryCode + "_" + "New" })
          let tempcountry: MPriceChangeCountries = {
            id: 0,
            headerID: 0,
            countryID: this.columnList[i].id,
            countryCode: this.columnList[i].countryCode,
            countryName: this.columnList[i].countryName,
            select: true,
            pricePointApplicable: this.columnList[i].pricePointApplicable,
            currencyID: this.columnList[i].currencyID,
            currencyCode: this.columnList[i].currencyCode
          }
          this.priceChangeCountries.push(tempcountry);
        }
      }
        tempcolumnheaders.push({ name: 'Status' })
        tempcolumnheaders.push({ name: 'Remarks' })
        this.tableColumns = tempcolumnheaders;
        this.headerList = tempcolumnheaders;
        //console.log(this.tableColumns);
      }
    }
  }

  getActualValue(col_name: string, serialNo: number) {
    let col_value: string = "";
    let country_code: string = "", column_name: string = "";
    /*if(col_name == "BrandName")
    {
      if (this.validateStyleList.length > 0) {
        for (let serial of this.styleList) {
          for (let valid of this.validateStyleList) {
            if (valid.style_serialNo == serial.serialNo) {
              
              serial.BrandName = valid.brandName;
              }
          }
        }
      }
    }*/
    if (col_name == "Remarks" || col_name=="Status") {
      this.remarks = '';
      if (this.validateStyleList.length > 0) {
        for (let serial of this.styleList) {
          let arr = this.validateStyleList.filter(x => x.style_serialNo == serial.serialNo)
          for (let valid of arr) {
            if (valid.style_serialNo == serial.serialNo) {
              if (col_name == "Remarks") {
                if (serial.remarks == undefined) {
                  this.remarks = valid.remarks;
                  serial.remarks = this.remarks;
                }
                else {
                  this.remarks = this.remarks + ';' + valid.remarks;
                  serial.remarks = this.remarks;
                }
              }
              else {
                serial.status = valid.status;
              }
            }
          }
        }
      }
    }

    if (col_name == "StyleCode" || col_name == "BrandName"
      || col_name == "Status" || col_name == "Remarks") {
      column_name = col_name;
      if (column_name != "" && serialNo != 0) {
        let arr = this.validateStyleList.filter(x=>x.style_serialNo == serialNo)
        let stList = this.styleList.filter(x => x.serialNo == serialNo);
        if (stList != null && stList.length > 0) {
          let st = stList[0];
          if (st != null) {
            if (column_name == "StyleCode") {
              col_value = st.styleCode == null ? "" : st.styleCode;
            } else if (column_name == "BrandName") {
              col_value = st.BrandName == null ? "" : arr[0].brandName;
            } else if (column_name == "Status") {
              col_value = st.status == null ? "" : st.status;
            } else if (column_name == "Remarks") {
              col_value = st.remarks == null ? "" : st.remarks.slice(2);
            }
          }
        }
      }
    } else {
      let strArr = col_name.split("_", 2)
      country_code = strArr != null && strArr[0] != null ? strArr[0] : "";
      column_name = strArr != null && strArr[1] != null ? strArr[1] : "";
      if (country_code != "" && column_name != "" && serialNo != 0) {
        let plDate = this.priceChangeDetailsList.filter(x => x.countryCode == country_code && x.style_serialNo == serialNo);
        //console.log(plDate);
        if (plDate != null && plDate.length > 0) {
          let pl = plDate[0];
          if (pl != null) {
            if (column_name == "Currency") {
              col_value = pl.currencyCode == null ? "" : pl.currencyCode;
            } else if (column_name == "Old") {
              col_value = pl.oldPrice == null ? "" : pl.oldPrice.toString();
            } else if (column_name == "New") {
              col_value = pl.newPrice == null ? "" : pl.newPrice.toString();
            }
          }
        }
      }

    }

    return col_value
  }
  setExchangeRate(fromRange: string, serialNo: number, e) {
    /*if (this.styleList != null && this.styleList != []) {
      let item = this.styleList.filter(x => x.rangeFrom == fromRange && x.rangeTo == toRange && x.internationalCode == currencyCode);
      if (item != null && item[0] != null) {
        item[0].price = e;
      }
    }*/
    let country_code: string = "", column_name: string = "";
    if (fromRange != "StyleCode" && fromRange != "BrandName" && fromRange != "Status" && fromRange != "Remarks") {
      let strArr = fromRange.split("_", 2)
      country_code = strArr != null && strArr[0] != null ? strArr[0] : "";
      column_name = strArr != null && strArr[1] != null ? strArr[1] : "";
      if (country_code != "" && column_name != "" && serialNo != 0) {
        let plDate = this.priceChangeDetailsList.filter(x => x.countryCode == country_code && x.style_serialNo == serialNo);
        //console.log(plDate);
        if (plDate != null && plDate.length > 0) {
          let pl = plDate[0];
          if (pl != null) {
            /*if (column_name == "Currency") {
              col_value = pl.currencyCode == null ? "" : pl.currencyCode;
            } else if (column_name == "Old") {
              col_value = pl.oldPrice == null ? "" : pl.oldPrice.toString();
            } else*/
            for (let price of this.priceChangeDetailsList) {
              if (column_name == "New" && price.style_serialNo == serialNo && country_code == price.countryCode) {
                price.newPrice = e;
              }
            }
          }
        }
      }
    }

    for (let sty of this.styleList) {
      if (serialNo == sty.serialNo && fromRange == "StyleCode") {
        this.dateList.push({
          "serialNo": serialNo,
          "styleCode": e
        });
      }
    }
    console.log(this.dateList);
  }



  createRow() {
    //setTimeout(() => {
      //this.cdRef.detectChanges();
    if (this.isGenerate == false) {
      this.common.showMessage('warn', "Can't Add New Row, 1st Click Generate Currency List...");
    }
    else {
      
      let style_index: number = this.styleList.length;
      if (this.excelUpload == false) {
        if (this.styleList == null) {
          this.styleList = new Array<any>();
        }
        if (this.priceChangeDetailsList == null) {
          this.priceChangeDetailsList = new Array<MPriceChangeDetails>();
        }
        let basecur = this.myForm.get('sourceCountry').value;
        for (let country of this.countryList) {
          if (country.id == basecur || country.active == true) {
            let tempPriceChangeDetail: MPriceChangeDetails = {
              style_serialNo: style_index + 1,
              id: 0,
              headerID: 0,
              styleID: 0,
              styleCode: '',
              brandID: 0,
              brandCode: '',
              brandName: '',
              countryID: country.id,
              countryCode: country.countryCode,
              currencyID: country.currencyID,
              priceListID: 0,
              currencyCode: country.currencyCode,
              priceListCode: '',
              pricePointApplicable: true,
              //pricePointApplicable: country.pricePointApplicable,
              oldPrice: 0,
              newPrice: 0,
              status: '',
              remarks: '',
              baseCurrencyID: this.myForm.get('sourceCountry').value,
              priceType: this.myForm.get('priceChangeType').value
            }
            this.priceChangeDetailsList.push(tempPriceChangeDetail);
          }
        }


        let style = {
          "serialNo": style_index + 1,
          "styleID": 0,
          "styleCode": "",
          "BrandName": "",
          "Status": "",
          "Remarks": ""
        }

        this.styleList.push(style);
      }
      else {
        this.styleList = this.tempTableList;
      }

      

      /*if (this.excelUpload == false) {
        
      }*/
      console.log("this.priceChangeDetailsList");
      console.log(this.priceChangeDetailsList);
    }

    //}, this.common.time_out_delay);
    
  }


  validation() {
    if (this.isGenerate == false) {
      this.common.showMessage('warn', "Can't Add New Row, 1st Click Generate Currency List...");
    }

    else if (this.styleList.length == 0) {
      this.common.showMessage('warn', "Can't Add New Row, 1st Click Generate Currency List...");
    }
    else {
      this.isValidate = true;
      this.validateStyleList = [];
      this.BingValuesInList();
      this.common.showSpinner();
      console.log(this.priceChangeDetailsList);
      this.api.putAPI("PriceChange", this.priceChangeDetailsList)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.validateStyleList = data.responseDynamicData;
              //this.priceChangeDetailsList = data.responseDynamicData;
              /*for (let price of this.priceChangeDetailsList) {
                for (let sty of this.validateStyleList) {
                  if (sty.countryCode == price.countryCode && sty.styleCode == price.styleCode && sty.currencyCode == price.currencyCode) {
                    sty.style_serialNo = price.style_serialNo;
                  }
                }
              }*/
              //this.priceChangeDetailsList = this.validateStyleList;
              for (let prc of this.priceChangeDetailsList) {
                for (let vali of this.validateStyleList) {
                  if (prc.styleCode == vali.styleCode && prc.currencyCode == vali.currencyCode) {
                    vali.newPrice = prc.newPrice;
                    vali.baseCurrencyID = this.myForm.get('sourceCountry').value;
                    vali.priceType = this.myForm.get('priceChangeType').value;
                  }
                }
              }
              this.priceChangeDetailsList = this.validateStyleList;
              for (let sty of this.styleList) {
                this.validateStyleList = this.priceChangeDetailsList;
                let arry = this.validateStyleList.filter(x => x.style_serialNo == sty.serialNo)
                sty.BrandName = arry[0].brandName;
                sty.styleID = arry[0].styleID;
                sty.status = arry[0].status;
              }
              // if (this.validateStyleList.length > 0) {
              //   for (let serial of this.styleList) {
              //     for (let valid of this.validateStyleList) {
              //       if (valid.style_serialNo == serial.serialNo) {
              //         serial.styleID = valid.styleID;
              //         serial.BrandName = valid.brandName;
              //         serial.styleID = valid.styleID;
              //         if (serial.remarks == '') {
              //           serial.remarks = valid.remarks;
              //         }
              //         else {
              //           serial.remarks = serial.remarks + ';' + valid.remarks;
              //         }
              //         serial.status = valid.status;
              //       }
              //     }
              //   }
              //   this.priceChangeDetailsList = this.validateStyleList;
              // }
              console.log(data);
            } else {
              //this.common.showMessage('warn', 'Failed to retrieve Data.');
              //this.productgroupList=null;
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

  BingValuesInList() {
    console.log(this.styleList);
    //this.priceChangeDetailsList = new Array<MPriceChangeDetails>();
    for (let sku of this.dateList) {
      for (let tempPrice of this.priceChangeDetailsList) {
        //tempPrice.style_serialNo = sku.serialNo;
        if (tempPrice.style_serialNo == sku.serialNo) {
          tempPrice.styleCode = sku.styleCode;
          tempPrice.baseCurrencyID = this.myForm.get('sourceCountry').value;
          tempPrice.priceType = this.myForm.get('priceChangeType').value;
        }
      }
    }
    /*let tempPriceChangeDetail: MPriceChangeDetails = {

    }
    this.priceChangeDetailsList.push(tempPriceChangeDetail);*/
  }

  savePriceChange() {
    if (this.isGenerate == false || this.priceChangeDetailsList.length == 0) {
      this.common.showMessage("warn", "Can not Save, Price Change List is Empty.");
    }
    else if (this.isValidate == false) {
      this.common.showMessage("warn", "Can not Save, Please Validate enterd item.");
    }
    else {
      let dropdownselectcounty = this.myForm.get('sourceCountry').value;
      let selectedcountryCode = this.countryList.filter(x => x.id == dropdownselectcounty);
      let status = "";
      for (let statusChk of this.priceChangeDetailsList) {
        if (statusChk.status != 'ERROR') {
          status = "Completed"
        }
        else {
          status = "Draft"
        }
      }
      this.priceChangeHeader = new MPriceChange();
      if (this.priceChangeHeader == null) {
        this.common.showMessage("warn", "Can not Save, Price Change Data is invalid.");
      } else {
        this.priceChangeHeader.id = this.id;
        this.priceChangeHeader.documentNo = this.myForm.get('documentNo').value;
        this.priceChangeHeader.documentDate = this.myForm.get('documentDate').value;
        this.priceChangeHeader.priceChangeDate = this.myForm.get('priceChangeDate').value;
        this.priceChangeHeader.priceChangeType = this.myForm.get('priceChangeType').value;
        this.priceChangeHeader.multipleCountry = this.myForm.get('multipleCountries').value;
        this.priceChangeHeader.sourceCountryID = this.myForm.get('sourceCountry').value;
        this.priceChangeHeader.sourceCountryCode = selectedcountryCode[0].countryCode;
        this.priceChangeHeader.status = status;
        if (this.priceChangeHeader.status == "Completed") {
          this.priceChangeHeader.isPriceUpdated = true;
        }
        else {
          this.priceChangeHeader.isPriceUpdated = false;
        }
        this.priceChangeHeader.active = true;
        this.priceChangeHeader.priceChangeDetailsList = this.priceChangeDetailsList;
        this.priceChangeHeader.priceChangeCountriesList = this.priceChangeCountries;
        if (this.priceChangeHeader.status == "Draft") {
          if (confirm("Validation is Failed. Do you want to Save as Draft?")) {
            this.goTosave()
          }
        }
        else {
          //this.goTosave();
        }

        // .log(this.paymenttype);

      }
    }
  }
  goTosave() {
    this.common.showSpinner();

    this.api.postAPI("PriceChange", this.priceChangeHeader).subscribe((data) => {
      //// .log(data);
      if (data != null && data.statusCode != null && data.statusCode == 1) {
        this.common.hideSpinner();
        this.common.showMessage('success', data.displayMessage);
        this.router.navigate(['price-change']);
        //this.clear_controls();
        //this.router.navigate(['payment-type']);
      }
      else if (data != null && data.statusCode != null && data.statusCode == 2) {
        this.common.hideSpinner();
        this.common.showMessage('', data.displayMessage);
      }
      else {
        setTimeout(() => {
          this.common.hideSpinner();
          this.common.showMessage('error', 'Payment Type Exists');
        }, this.common.time_out_delay);
      }

    });
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

  transform(value) {
    return (value >= 26 ? this.transform(((value / 26) >> 0) - 1) : '') + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[value % 26 >> 0];
  }

  Addlinedata(datalist: Array<any>) {
    this.priceChangeDetailsList = new Array<MPriceChangeDetails>();
    this.excelUpload = true;
    let style_index = 0;
    //this.createRow();
    console.log(datalist);
    let basecur = this.myForm.get('sourceCountry').value;
    let styleGetList: Array<any>;
    styleGetList = new Array<any>();
    this.tempTableList = new Array<any>();
    let i = 0;
    let inc = 1;
    for (let dt of datalist) {
      if (i == 0) {
        this.tempTableList.push({
          'serialNo': 1,
          'styleCode': dt.A,
          'styleID': 0,
          'BrandName': "",
          'Status': "",
          'Remarks': ""
        })
        i++;
        let basecur = this.myForm.get('sourceCountry').value;
        for (let country of this.countryList) {
          if (country.id == basecur || country.active == true) {
            let tempPriceChangeDetail: MPriceChangeDetails = {
              style_serialNo: 1,
              id: 0,
              headerID: 0,
              styleID: 0,
              styleCode: dt.A,
              brandID: 0,
              brandCode: '',
              brandName: '',
              countryID: country.id,
              countryCode: country.countryCode,
              currencyID: country.currencyID,
              priceListID: 0,
              currencyCode: country.currencyCode,
              priceListCode: '',
              pricePointApplicable: true,
              //pricePointApplicable: country.pricePointApplicable,
              oldPrice: 0,
              newPrice: 0,
              status: '',
              remarks: '',
              baseCurrencyID: this.myForm.get('sourceCountry').value,
              priceType: this.myForm.get('priceChangeType').value
            }
            this.priceChangeDetailsList.push(tempPriceChangeDetail);
          }
        }
      }
      else {
        //for(let temp of this.tempTableList)
        let arry = this.tempTableList.filter(x => x.styleCode == dt.A)
        {
          if (arry.length == 0) {
            this.tempTableList.push({
              'serialNo': inc + 1,
              'styleCode': dt.A,
              'styleID': 0,
              'BrandName': "",
              'Status': "",
              'Remarks': ""
            })
            inc++;
            let basecur = this.myForm.get('sourceCountry').value;
            for (let country of this.countryList) {
              if (country.id == basecur || country.active == true) {
                let tempPriceChangeDetail: MPriceChangeDetails = {
                  style_serialNo: inc,
                  id: 0,
                  headerID: 0,
                  styleID: 0,
                  styleCode: dt.A,
                  brandID: 0,
                  brandCode: '',
                  brandName: '',
                  countryID: country.id,
                  countryCode: country.countryCode,
                  currencyID: country.currencyID,
                  priceListID: 0,
                  currencyCode: country.currencyCode,
                  priceListCode: '',
                  pricePointApplicable: true,
                  //pricePointApplicable: country.pricePointApplicable,
                  oldPrice: 0,
                  newPrice: 0,
                  status: '',
                  remarks: '',
                  baseCurrencyID: this.myForm.get('sourceCountry').value,
                  priceType: this.myForm.get('priceChangeType').value
                }
                this.priceChangeDetailsList.push(tempPriceChangeDetail);
              }
            }
          }
        }
      }
    }
    for (let tem of datalist) {
      for (let pr of this.priceChangeDetailsList) {
        if (tem.B == pr.countryCode && tem.A == pr.styleCode) {
          pr.newPrice = tem.C;
        }
      }
    }
    this.createRow();
  }

  generateList() {
    this.priceChangeDetailsList = new Array<MPriceChangeDetails>();
    this.excelUpload = true;
    let style_index = 0;
    //this.createRow();
    console.log(this.dumPriceChangeDetailsList);
    let basecur = this.myForm.get('sourceCountry').value;
    let styleGetList: Array<any>;
    styleGetList = new Array<any>();
    this.tempTableList = new Array<any>();
    let i = 0;
    let inc = 1;
    for (let dt of this.dumPriceChangeDetailsList) {
      if (i == 0) {
        this.tempTableList.push({
          'serialNo': 1,
          'styleCode': dt.styleCode,
          'styleID': 0,
          'BrandName': "",
          'Status': "",
          'Remarks': ""
        })
        i++;
        let basecur = this.myForm.get('sourceCountry').value;
        for (let country of this.countryList) {
          /*for(let dum of this.dumPriceChangeDetailsList)
          {*/
            let dum = this.dumPriceChangeDetailsList.filter(x=>x.styleCode==dt.styleCode && x.countryID==basecur)
          if ((country.id == basecur || country.active == true)){
            let tempPriceChangeDetail: MPriceChangeDetails = {
              style_serialNo: 1,
              id: 0,
              headerID: 0,
              styleID: 0,
              styleCode: dt.styleCode,
              brandID: 0,
              brandCode: '',
              brandName: dum[0].brandName,
              countryID: country.id,
              countryCode: country.countryCode,
              currencyID: country.currencyID,
              priceListID: 0,
              currencyCode: country.currencyCode,
              priceListCode: '',
              pricePointApplicable: true,
              //pricePointApplicable: country.pricePointApplicable,
              oldPrice: dum[0].oldPrice,
              newPrice: dum[0].newPrice,
              status: dum[0].status,
              remarks: dum[0].remarks,
              baseCurrencyID: this.myForm.get('sourceCountry').value,
              priceType: this.myForm.get('priceChangeType').value
            }
            this.priceChangeDetailsList.push(tempPriceChangeDetail);
          }
        //}
        }
      }
      else {
        //for(let temp of this.tempTableList)
        let arry = this.tempTableList.filter(x => x.styleCode == dt.styleCode)
        {
          if (arry.length == 0) {
            this.tempTableList.push({
              'serialNo': inc + 1,
              'styleCode': dt.styleCode,
              'styleID': 0,
              'BrandName': "",
              'Status': "",
              'Remarks': ""
            })
            inc++;
            let basecur = this.myForm.get('sourceCountry').value;
            for (let country of this.countryList) {
              if (country.id == basecur || country.active == true) {
                let tempPriceChangeDetail: MPriceChangeDetails = {
                  style_serialNo: inc,
                  id: 0,
                  headerID: 0,
                  styleID: 0,
                  styleCode: dt.styleCode,
                  brandID: 0,
                  brandCode: '',
                  brandName: '',
                  countryID: country.id,
                  countryCode: country.countryCode,
                  currencyID: country.currencyID,
                  priceListID: 0,
                  currencyCode: country.currencyCode,
                  priceListCode: '',
                  pricePointApplicable: true,
                  //pricePointApplicable: country.pricePointApplicable,
                  oldPrice: 0,
                  newPrice: 0,
                  status: '',
                  remarks: '',
                  baseCurrencyID: this.myForm.get('sourceCountry').value,
                  priceType: this.myForm.get('priceChangeType').value
                }
                this.priceChangeDetailsList.push(tempPriceChangeDetail);
              }
            }
          }
        }
      }
    }
    for (let tem of this.dumPriceChangeDetailsList) {
      for (let pr of this.priceChangeDetailsList) {
        if (tem.countryCode == pr.countryCode && tem.styleCode == pr.styleCode) {
          pr.newPrice = tem.newPrice;
        }
      }
    }
    this.generate();
    this.createRow();
  }
  
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['price-change']);
      }
    }
    else {
      this.router.navigate(['price-change']);
    }
  }
  keyPress(ColumnName: string, event: any) {
    //alert(ColumnName+'-'+event.keyCode.toString());
    if (ColumnName == 'BrandName') {
      //this.isDisabled=true;
      event.target.disabled = true
      event.preventDefault();
    }
    else if (ColumnName.toLowerCase().includes('currency')) {
      //this.isDisabled=true;
      event.target.disabled = true
      event.preventDefault();
    }
    else if (ColumnName.toLowerCase().includes('old')) {
      //this.isDisabled=true;
      event.target.disabled = true
      event.preventDefault();
    }
    else if (ColumnName.toLowerCase().includes('status')) {
      //this.isDisabled=true;
      event.target.disabled = true
      event.preventDefault();
    }
    else if (ColumnName.toLowerCase().includes('remarks')) {
      //this.isDisabled=true;
      event.target.disabled = true
      event.preventDefault();
    }
    else if (ColumnName.toLowerCase().includes('new')) {
      //this.isDisabled=false;
      const pattern = /[0-9\.\ ]/;

      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }


    /*const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }*/
  }
}
