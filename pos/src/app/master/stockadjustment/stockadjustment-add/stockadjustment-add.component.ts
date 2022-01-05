import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MStockadjustmentheaderMaster } from 'src/app/models/m-stockadjustmentheader-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MTransactionLog } from 'src/app/models/m-transaction-log';

@Component({
  selector: 'app-stockadjustment-add',
  templateUrl: './stockadjustment-add.component.html',
  styleUrls: ['./stockadjustment-add.component.css']
})
export class StockadjustmentAddComponent implements OnInit {
  myForm: FormGroup;
  stockadjustment: MStockadjustmentheaderMaster;
  stockadjustmentlist: Array<MStockadjustmentheaderMaster>;
  styleWithColorDetailsList: Array<any>;
  styleWithScaleDetailsList: Array<any>;
  stock_List: Array<any>;
  skuList: Array<any>;
  transactionLogList: Array<MTransactionLog>;
  documentnumberinglist: Array<any>;
  user_details: MUserDetails = null;
  userid: number;
  storeid: number;
  styleID: number;
  styleCode: string;
  documenttypeid: number;
  businessdate: any;
  stockQty: number;
  totalstock: number = 0;
  inQty: number;
  outQty: number;

  storename: string;
  storecode: string;

  countryid: number;
  countrycode: string;

  stockList: Array<any> = [];

  binEnabled:any;
  binNotShow:boolean;
  binShow:boolean;

  binList:Array<any>;

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

      documentNo: ['', Validators.required],
      style: [''],
      documentDate: [''],
      totqty: [],
      totnewqty: []
    });
    this.getStaticValues();
    this.getStoreDetails();
    this.getBinDetails();
    this.getDocumentNumber();
    this.skuList = new Array<MSkuMasterTypes>();
    this.styleWithColorDetailsList = new Array<any>();
    this.styleWithScaleDetailsList = new Array<any>();
    this.stock_List = new Array<any>();
    this.binList = new Array<any>();
    this.transactionLogList = new Array<MTransactionLog>();
    //this.myForm.get('totalqty').setValue(0);
    this.myForm.get('totnewqty').setValue(0);
    this.stockadjustment = new MStockadjustmentheaderMaster();
  }
  clear_controls() {
    this.myForm.get('style').setValue('');
    this.myForm.get('totqty').setValue('');
    this.myForm.get('totnewqty').setValue('');
    this.stockList = null;
    this.styleWithScaleDetailsList = null;
    this.styleWithColorDetailsList = null;
    this.binShow = false;
  }
  getStaticValues() {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid = this.user_details.id;
      this.storeid = this.user_details.storeID;
      this.documenttypeid = 65;
      this.businessdate = this.common.toYMDFormat(new Date());
      this.storename = this.user_details.storeName;
      this.storecode = this.user_details.storeCode;
      this.countryid = this.user_details.countryID;
      this.countrycode = this.user_details.countryCode;
      this.myForm.controls['documentDate'].setValue(this.businessdate);
    }
  }
  getStoreDetails() {
    this.common.showSpinner();
    this.api.getAPI("store?ID=" + this.storeid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.binEnabled = data.storeMasterData.enableBin;
            // if (this.binEnabled == 1) {
            //   this.binShow = true;
            //   this.binNotShow = false;
            // }
            // else {
            //   this.binShow = false;
            //   this.binNotShow = true;
            // }
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
            this.common.showMessage('warn', 'Failed to retrieve Data.');
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getBinDetails(){
    this.common.showSpinner();
    this.api.getAPI("BinLevelDetails?ID=" + this.storeid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
           
            this.binList = data.binSubLevelList;

            this.binList = this.binList.filter(x => x.levelName == 'BIN')

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
  getSKUData() {
    this.styleID = 0;
    this.myForm.get('totqty').setValue('');
    this.myForm.get('totnewqty').setValue('');
    this.styleCode = this.myForm.get('style').value;
    this.stock_List = null;
    this.styleWithColorDetailsList = null;
    this.styleWithScaleDetailsList = null;
    if(this.styleCode=="")
    {
      this.common.showMessage('warn', "Style Code is Empty.");
    }
    else
    {
      if (this.binEnabled == 1) {
        this.binShow = true;
        this.binNotShow = false;
      }
      else {
        this.binShow = false;
        this.binNotShow = true;
      }
    this.getStyleWithColorDetails();
    }
    //this.getStyleWithScaleDetails();    
    //this.getStockDetails();
  }
  getStyleWithColorDetails() {
    this.common.showSpinner();
    this.api.getAPI("StyleWithColorDetails?styleid=" + this.styleID + "&stylecode=" + this.styleCode)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.styleWithColorDetailsList = data.styleWithColorDetailsRecord;
            this.getStyleWithScaleDetails();
            this.getStockDetails();
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
  getStyleWithScaleDetails() {

    //if(this.styleWithColorDetailsList.length > 0)
    {
      this.common.showSpinner();
      this.api.getAPI("StyleWithScaleDetails?styleid=" + this.styleID + "&stylecode=" + this.styleCode)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.styleWithScaleDetailsList = data.scaleDetailMasterRecordForStock;

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
  }

  getStockDetails() {
    this.totalstock = 0;
    //if(this.styleWithColorDetailsList!=null && this.styleWithColorDetailsList.length>0){
    this.common.showSpinner();
    this.api.getAPI("Stock?SearchValue=" + this.myForm.get('style').value + "&storeid=" + this.storeid+ "&fromFormName=adjustment")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.stock_List = data.stockList;
            // console.log(this.stock_List);

            for (let i = 0; i < this.stock_List.length; i++) {
              this.totalstock = this.totalstock + this.stock_List[i].stockQty;
            }
            this.myForm.controls['totqty'].setValue(this.totalstock);
            if(this.binEnabled == 1){
            this.updateStockList1();
            }
            else{
              this.updateStockList();
            }
            this.myForm.get('style').setValue('');
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Stock is not available for this Style.";
            this.common.showMessage('warn', msg);
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
    //}
  }
  updateStockList() {
    this.stockList = [];
    if (this.styleWithColorDetailsList != null && this.styleWithColorDetailsList.length > 0
      && this.styleWithScaleDetailsList != null && this.styleWithScaleDetailsList.length > 0) {
      for (let clr of this.styleWithColorDetailsList) {
        for (let siz of this.styleWithScaleDetailsList) {
          let stk = 0;
          let skucode;
          if (this.stock_List != null) {
            let item = this.stock_List.filter(x => x.colorCode == clr.colorCode && x.sizeCode == siz.sizeCode);
            // console.log("colorCode" + clr.colorCode + "sizeCode" + siz.sizeCode );
            // console.log(item);
            skucode = this.styleCode + "-" + clr.colorCode + "-" + siz.sizeCode;
            if (item != null && item.length > 0) {
              if (item[0].skuCode == skucode) {
                stk = item[0].stockQty != null ? item[0].stockQty : 0;
              }
              //skucode = item[0].skuCode != null && item[0].skuCode ==0? item[0].skuCode : this.styleCode+"-"+clr.colorCode+"-"+siz.sizeCode;
            }
            this.stockList.push({
              "sAHID": 0,
              "colorCode": clr.colorCode,
              "sizeCode": siz.sizeCode,
              "stock": stk,
              "sKUCode": skucode,
              "systemQuantity": stk,
              "physicalQuantity": stk,
              "adjustableQuantity": 0
            });
          }
        }
      }

      // console.log(this.stockList);
    }
  }

  updateStockList1() {
    this.stockList = [];
    if (this.styleWithColorDetailsList != null && this.styleWithColorDetailsList.length > 0
      && this.styleWithScaleDetailsList != null && this.styleWithScaleDetailsList.length > 0) {
      for(let bin of this.binList){
      for (let clr of this.styleWithColorDetailsList) {
        for (let siz of this.styleWithScaleDetailsList) {
          let stk = 0;
          let skucode='';
          let bincode='';
          let binid=0;
          let binsublevelcode='';
          let barcode='';
          if (this.stock_List != null) {
            let item = this.stock_List.filter(x => x.colorCode == clr.colorCode && x.sizeCode == siz.sizeCode && x.binCode == bin.autoGeneratedCode);
            // console.log("colorCode" + clr.colorCode + "sizeCode" + siz.sizeCode );
            // console.log(item);
            skucode = this.styleCode + "-" + clr.colorCode + "-" + siz.sizeCode;
            if (item != null && item.length > 0) {
              if (item[0].skuCode == skucode) {
                stk = item[0].stockQty != null ? item[0].stockQty : 0;
                bincode = item[0].binCode != null ? item[0].binCode : '';
                binid = item[0].binID != null ? item[0].binID : 0;
                binsublevelcode = item[0].binSubLevelCode != null ? item[0].binSubLevelCode : '';
                barcode = item[0].barCode != null ? item[0].barCode : '';
              }
              //skucode = item[0].skuCode != null && item[0].skuCode ==0? item[0].skuCode : this.styleCode+"-"+clr.colorCode+"-"+siz.sizeCode;
            }
            else{
              binid = bin.id;
              bincode = bin.autoGeneratedCode;
              binsublevelcode = bin.subLevelCode;
            }
            this.stockList.push({
              "sAHID": 0,
              "colorCode": clr.colorCode,
              "sizeCode": siz.sizeCode,
              "stock": stk,
              "sKUCode": skucode,
              "systemQuantity": stk,
              "physicalQuantity": stk,
              "adjustableQuantity": 0,
              "binCode" : bincode,
              "binID":binid,
              "binSubLevelCode":binsublevelcode,
              "barCode":barcode
            });
          }
        }
      }
      //console.log(this.stockList);
    }
  }
  }

  getSizeDetails(colorCode: string, sizeCode: string) {
    let ret_val: number = 0;
    if (this.stockList != null && this.stockList.length > 0) {
      let item = this.stockList.filter(x => x.colorCode == colorCode && x.sizeCode == sizeCode);
      if (item != null && item.length > 0) {
        ret_val = item[0].stock;
      }
    }
    return ret_val;
  }

  setStock(colorCode: string, sizeCode: string, stockvalue: string, $event) {
    if (this.stockList != null && this.stockList.length > 0) {
      let item = this.stockList.filter(x => x.colorCode == colorCode && x.sizeCode == sizeCode);
      if (item != null && item.length > 0) {
        item[0].stock = stockvalue;
        item[0].physicalQuantity = stockvalue;
        item[0].adjustableQuantity = parseInt(item[0].systemQuantity) - parseInt(stockvalue);
      }
      // let sum = this.stockList.reduce((sum, current) => parseInt(sum) + parseInt(current.stock), 0);

      // if (sum > this.totalstock) {
      //   $event.target.value = "0";
      //   if (item != null && item.length > 0) {
      //     item[0].stock = 0;
      //     item[0].physicalQuantity = 0;
      //     item[0].adjustableQuantity = item[0].systemQuantity;
      //   }
      // }
      let sum1 = this.stockList.reduce((sum1, current) => parseInt(sum1) + parseInt(current.stock), 0);
      this.myForm.controls['totnewqty'].setValue(sum1);
    }

    // console.log(this.stockList);
  }

  getSizeDetails1(binId: number, colorCode: string, sizeCode: string) {
    let ret_val: number = 0;
    if (this.stockList != null && this.stockList.length > 0) {
      let item = this.stockList.filter(x => x.colorCode == colorCode && x.sizeCode == sizeCode && x.binID == binId);
      if (item != null && item.length > 0) {
        ret_val = item[0].stock;
      }
    }
    return ret_val;
  }

  setStock1(binId: number,colorCode: string, sizeCode: string, stockvalue: string, $event) {
    if (this.stockList != null && this.stockList.length > 0) {
      let item = this.stockList.filter(x => x.colorCode == colorCode && x.sizeCode == sizeCode && x.binID == binId);
      if (item != null && item.length > 0) {
        item[0].stock = stockvalue;
        item[0].physicalQuantity = stockvalue;
        item[0].adjustableQuantity = parseInt(item[0].systemQuantity) - parseInt(stockvalue);
      }
      // let sum = this.stockList.reduce((sum, current) => parseInt(sum) + parseInt(current.stock), 0);

      // if (sum > this.totalstock) {
      //   $event.target.value = "0";
      //   if (item != null && item.length > 0) {
      //     item[0].stock = 0;
      //     item[0].physicalQuantity = 0;
      //     item[0].adjustableQuantity = item[0].systemQuantity;
      //   }
      // }
      let sum1 = this.stockList.reduce((sum1, current) => parseInt(sum1) + parseInt(current.stock), 0);
      this.myForm.controls['totnewqty'].setValue(sum1);
    }

    // console.log(this.stockList);
  }
  getTransactionLogList() {

    if (this.stockList != null) {
      for (let i = 0; i < this.stockList.length; i++) {

        let AdjustQty: number = 0;
        //AdjustQty = (this.stockList[i].PhysicalQuantity) - (this.stockList[i].SystemQuantity);
        //adjustableQuantity
        /*if (AdjustQty < 0)
        {
            this.outQty = (AdjustQty * -1);
            this.inQty = 0;
        }
        else
        {
            this.inQty = AdjustQty;
            this.outQty = 0;
        } */
        if (this.stockList[i].adjustableQuantity > 0) {
          this.outQty = this.stockList[i].adjustableQuantity;
          this.inQty = 0;
        }
        else if (this.stockList[i].adjustableQuantity < 0) {
          this.inQty = Math.abs(this.stockList[i].adjustableQuantity);
          this.outQty = 0;
        }
        else {
          this.inQty = 0;
          this.outQty = 0;
        }

        let templogdata: MTransactionLog = {
          id: 0,
          transactionType: "StockAdjustment",
          businessDate: this.businessdate,
          actualDateTime: this.businessdate,
          documentID: 0,
          styleCode: this.styleCode,
          skuCode: this.stockList[i].sKUCode,
          inQty: this.inQty,
          outQty: this.outQty,
          transactionPrice: 0,
          currency: 0,
          exchangeRate: 0,
          documentPrice: 0,
          userID: this.userid,
          documentNo: this.myForm.get('documentNo').value,
          storeID: this.storeid,
          storeCode: this.storecode,
          countryID: this.countryid,
          countryCode: this.countrycode,
        }
        this.transactionLogList.push(templogdata);
      }
    }
  }
  addStockAdjustment() {
    if (this.stockList == null || this.styleWithColorDetailsList==null ||this.styleWithScaleDetailsList==null) {
      this.common.showMessage("warn", "Can not Save, Style Details are invalid.");
    } else {

      if (this.myForm.controls['totqty'].value == this.myForm.controls['totnewqty'].value) {
        this.stockList = this.stockList.filter(x => x.stock != 0); 
        console.log(this.stockList);
        this.common.showSpinner();
        this.getTransactionLogList();
        this.stockadjustment.id = 0;
        this.stockadjustment.documentNumber = this.myForm.get('documentNo').value;
        this.stockadjustment.documentDate = this.businessdate;
        this.stockadjustment.styleID = this.styleID;
        this.stockadjustment.styleCode = this.styleCode;
        this.stockadjustment.storeID = this.storeid;
        this.stockadjustment.storeCode = this.storecode;
        this.stockadjustment.createBy = this.userid;
        this.stockadjustment.countryID = this.user_details.countryID;
        this.stockadjustment.countryCode = this.user_details.countryCode;
        this.stockadjustment.stockAdjustmentDetailList = this.stockList;
        this.stockadjustment.transactionLogList = this.transactionLogList;


         this.api.postAPI("stockadjustment", this.stockadjustment).subscribe((data) => {
           // // console.log(data);
           if (data != null && data.statusCode != null && data.statusCode == 1) {
             this.common.hideSpinner();
             this.common.showMessage('success', data.displayMessage);
             //this.clear_controls();
             this.router.navigate(['stockadjustment']);
           } else {
             setTimeout(() => {
               this.common.hideSpinner();
               this.common.showMessage('error', 'Failed to Save.');
             }, this.common.time_out_delay);
           }
         });
      }
      else {
        setTimeout(() => {
          this.common.hideSpinner();
          this.common.showMessage('error', 'Quantity Mismatch');
        }, this.common.time_out_delay);
      }
    }
  }
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['stockadjustment']);
      }
    }
    else {
      this.router.navigate(['stockadjustment']);
    }
  }
  restrictSpecialChars(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      || (k >= 48 && k <= 57));
  }
  ngOnInit(): void {
  }
  keyPress(event: any) {
    const pattern = /[0-9\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
