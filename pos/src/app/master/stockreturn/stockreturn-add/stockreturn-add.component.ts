import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MTransactionLog } from 'src/app/models/m-transaction-log';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MDocumentNumbering } from 'src/app/models/m-document-numbering';
import { MStockreturnheaderMaster } from 'src/app/models/m-stockreturnheader-master';
import { MStockreturndetailsMaster } from 'src/app/models/m-stockreturndetails-master';


@Component({
  selector: 'app-stockreturn-add',
  templateUrl: './stockreturn-add.component.html',
  styleUrls: ['./stockreturn-add.component.css']
})
export class StockreturnAddComponent implements OnInit {
  myForm: FormGroup;
  skuList: Array<MSkuMasterTypes>;
  user_details: MUserDetails = null;
  stockreturn: MStockreturnheaderMaster;
  stockreturnlist: Array<MStockreturndetailsMaster>;
  documentnumberinglist: Array<MDocumentNumbering>;
  transactionLogList: Array<MTransactionLog>;
  wareHouseList: Array<any>;
  storeid: number;
  storename: string;
  storecode: string;
  documenttypeid: number;
  businessdate: any;
  countryid: number;
  countrycode: string;
  userid: number;
  totalQty: number;
  warehouseCode: string;
  returntype: string;
  boolUpdate: boolean = false;
  negative: boolean;
  binEnabled: any;
  binShow1: boolean;
  binShow2: boolean;
  binnotShow: boolean;

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
      barCode: [''],
      barCode1: [''],
      fromstore: ['', Validators.required],
      documentDate: ['', Validators.required],
      documentNo: ['', Validators.required],
      status: ['', Validators.required],
      toWareHouse: ['', Validators.required],
      returnquantity: [],
      totalqty: [],
      rem: [''],
      group: [''],
      stockqty: [],
      bin: ['']
    });
    this.getStaticValues();
    this.getStoreDetails();
    this.skuList = new Array<MSkuMasterTypes>();
    this.stockreturnlist = new Array<MStockreturndetailsMaster>();
    this.transactionLogList = new Array<MTransactionLog>();
    this.stockreturn = new MStockreturnheaderMaster();
    this.myForm.controls['bin'].setValue(' ');
    this.getDocumentNumber();
    this.getWarehouse();
    this.myForm.controls['returnquantity'].setValue(1);
    this.myForm.get('toWareHouse').setValue('');
    this.myForm.get('status').setValue("Open");
    this.myForm.get('stockqty').setValue("Total : " + 0);
    this.myForm.get('totalqty').setValue("Total : " + 0);
    this.myForm.controls['fromstore'].setValue(this.storename);
    this.myForm.controls['documentDate'].setValue(this.businessdate);
    this.myForm.get('group').setValue('Bar Code');
    this.negative = true;
  }
  ngOnInit(): void {
  }
  clear_controls() {
    this.myForm.get('barCode').setValue('');
    this.myForm.get('toWareHouse').setValue('');
    this.myForm.get('status').setValue(0);
    this.stockreturnlist = new Array<MStockreturndetailsMaster>();
    //this.stockreturn=new MStockreturnheaderMaster();
    this.myForm.get('totalqty').setValue(0);
    this.myForm.get('stockqty').setValue(0);
    this.myForm.get('status').setValue("Open");
    this.myForm.get('returnquantity').setValue(1);
    this.myForm.get('rem').setValue('');
    //this.myForm.get('group').setValue('Bar Code');
  }
  getStaticValues() {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid = this.user_details.id;
      this.storeid = this.user_details.storeID;
      this.storename = this.user_details.storeName;
      this.storecode = this.user_details.storeCode;
      this.countryid = this.user_details.countryID;
      this.countrycode = this.user_details.countryCode;
      this.documenttypeid = 63;
      this.businessdate = this.common.toYMDFormat(new Date());
    }
  }
  getStoreDetails() {
    this.common.showSpinner();
    this.api.getAPI("store?ID=" + this.storeid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.binEnabled = data.storeMasterData.enableBin;
            if (this.binEnabled == 1) {
              this.binShow1 = true;
              this.binShow2 = true;
              this.binnotShow = false;
            }
            else {
              this.binShow1 = false;
              this.binShow2 = false;
              this.binnotShow = true;
            }
          } 
          else if(data !=null && data.statusCode!=null && data.statusCode==4)
           {
            this.binShow1 = false;
            this.binShow2 = false;
            this.binnotShow = true;
           }
          else 
          {
              this.binShow1 = false;
              this.binShow2 = false;
              this.binnotShow = true;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
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
  getTransactionLogList() {
    if (this.stockreturnlist != null) {
      for (let i = 0; i < this.stockreturnlist.length; i++) {
        let templogdata: MTransactionLog = {
          id: 0,
          transactionType: "StockReturn",
          businessDate: this.businessdate,
          actualDateTime: this.businessdate,
          documentID: 0,
          styleCode: this.stockreturnlist[i].styleCode,
          skuCode: this.stockreturnlist[i].sKUCode,
          inQty: 0,
          outQty: this.stockreturnlist[i].quantity,
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
  getSKUDataBin() {
    if (this.myForm.get('bin').value == "") {
      this.common.showMessage('warn', "From Bin is empty!");
    }
    else {
      var once = 0;
      var stock_qty = 0;
      var already_added_item_stock = 0;
      let tempStockReturnDetails: MStockreturndetailsMaster = null;
      if(this.stockreturnlist != null && this.stockreturnlist.length > 0){
        let filter = this.stockreturnlist.filter(x => x.binCode == this.myForm.get('bin').value 
          && (x.sKUCode == this.myForm.get('barCode1').value || x.barCode == this.myForm.get('barCode1').value));
          if(filter != null && filter.length > 0){
            for(let f of filter){
              if(once == 0){
                stock_qty = f.stockQty == null ? 0 : f.stockQty;
                once = 1;
                tempStockReturnDetails = {
                    id: 0,
                    barCode: f.barCode == null ? "" : f.barCode,
                    sKUID: f.sKUID == null ? 0 : f.sKUID,
                    sKUName: f.sKUName == null ? "" : f.sKUName,
                    sKUCode: f.sKUCode == null ? "" : f.sKUCode,
                    brand: f.brand == null ? "" : f.brand,
                    color: f.color == null ? "" : f.color,
                    size: f.size == null ? "" : f.size,
                    quantity: f.quantity == null ? 0 : f.quantity,
                    remarks: '',
                    styleCode: f.styleCode == null ? "" : f.styleCode,
                    applicationDate: this.businessdate,
                    documentDate: this.businessdate,
                    fromStoreID: this.storeid,
                    stockQty: f.stockQty,
                    binCode: this.myForm.get('bin').value
                };
              }
              already_added_item_stock += f.quantity == null ? 0 : f.quantity;
            }
            if(already_added_item_stock > 0){
              if(stock_qty > 0 && stock_qty > already_added_item_stock)
              {
                if(tempStockReturnDetails != null){
                  this.stockreturnlist.push(tempStockReturnDetails);
                  this.myForm.get('totalqty').setValue(this.stockreturnlist.length);
                  this.myForm.get('barCode1').setValue('');
                }
              }
              else{
                this.common.showMessage('warn', 'No Stock Available');
              }
            }
            
          }
      }

      //this.api.getAPI("StockReturn?itemcode=" + this.myForm.get('barCode').value + "&storeid=" +  this.storeid)
      // this.api.getAPI("invoice?skucode=" + this.myForm.get('barCode').value + "&storeid=" + this.storeid)
      if (already_added_item_stock == 0) {
        
        if(this.myForm.get('barCode1').value == ''){
          this.common.showMessage('warn', 'Please enter Barcode/Skucode');
        }else{
          this.common.showSpinner();
        this.api.getAPI("invoice?skucode=" + this.myForm.get('barCode1').value + "&storeid=" + this.storeid + "&bincode=" + this.myForm.get('bin').value)
          .subscribe((data) => {
            setTimeout(() => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                this.skuList = data.skuMasterTypesList;
                if (this.skuList.length > 0) {
                  let tempdata: MStockreturndetailsMaster = {
                    id: 0,
                    barCode: data.skuMasterTypesList[0].barCode,
                    sKUID: data.skuMasterTypesList[0].skuid,
                    sKUName: data.skuMasterTypesList[0].skuName,
                    sKUCode: data.skuMasterTypesList[0].skuCode,
                    brand: data.skuMasterTypesList[0].brandName,
                    color: data.skuMasterTypesList[0].colorName,
                    size: data.skuMasterTypesList[0].sizeCode,
                    quantity: this.myForm.get('returnquantity').value,
                    remarks: data.skuMasterTypesList[0].remarks,
                    styleCode: data.skuMasterTypesList[0].styleCode,
                    applicationDate: this.businessdate,
                    documentDate: this.businessdate,
                    fromStoreID: this.storeid,
                    stockQty: data.skuMasterTypesList[0].stock,
                    binCode: this.myForm.get('bin').value
                  }
                  this.stockreturnlist.push(tempdata);
                  // if (tempdata.quantity <= tempdata.stockQty) {
                  //   this.stockreturnlist.push(tempdata);
                  // }
                  // else {
                  //   this.common.showMessage('warn', 'No Stock Available');
                  // }
                  let dis_totalamount: number = 0;
                  let dis_stockamount: number = 0;
                  for (let i = 0; i < this.stockreturnlist.length; i++) {
                    dis_totalamount = dis_totalamount + parseInt(this.stockreturnlist[i].quantity.toString());
                    dis_stockamount = dis_stockamount + parseInt(this.stockreturnlist[i].stockQty.toString());
                  }
                  this.myForm.get('totalqty').setValue("Total : " + dis_totalamount);
                  this.myForm.get('stockqty').setValue("Total : " + dis_stockamount);

                  this.myForm.get('barCode1').setValue('');
                }
              } else {
                //this.common.showMessage('warn', 'Failed to retrieve Data.');
                //this.productgroupList=null;
                let msg: string = data != null
                  && data.displayMessage != null
                  && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
                this.common.showMessage('warn', msg);
              }
              this.myForm.controls['barCode'].setValue('');
              this.common.hideSpinner();
            }, this.common.time_out_delay);
          });
        }
      }
    }
  }
  getSKUData() {
    /*if (this.myForm.get('bin').value == "") {
      this.common.showMessage('warn', "Bin code is empty!");
    }
    else */{
      this.common.showSpinner();
      //this.api.getAPI("StockReturn?itemcode=" + this.myForm.get('barCode').value + "&storeid=" +  this.storeid)
      this.api.getAPI("invoice?skucode=" + this.myForm.get('barCode').value + "&storeid=" + this.storeid)
        //this.api.getAPI("invoice?skucode=" + this.myForm.get('barCode').value + "&storeid=" + this.storeid + "&bincode=" + this.myForm.get('bin').value)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.skuList = data.skuMasterTypesList;
              if (this.skuList.length > 0) {
                let tempdata: MStockreturndetailsMaster = {
                  id: 0,
                  barCode: data.skuMasterTypesList[0].barCode,
                  sKUID: data.skuMasterTypesList[0].skuid,
                  sKUName: data.skuMasterTypesList[0].skuName,
                  sKUCode: data.skuMasterTypesList[0].skuCode,
                  brand: data.skuMasterTypesList[0].brandName,
                  color: data.skuMasterTypesList[0].colorName,
                  size: data.skuMasterTypesList[0].sizeCode,
                  quantity: this.myForm.get('returnquantity').value,
                  remarks: data.skuMasterTypesList[0].remarks,
                  styleCode: data.skuMasterTypesList[0].styleCode,
                  applicationDate: this.businessdate,
                  documentDate: this.businessdate,
                  fromStoreID: this.storeid,
                  stockQty: data.skuMasterTypesList[0].stock
                }
                this.stockreturnlist.push(tempdata);
                let dis_totalamount: number = 0;
                let dis_stockamount: number = 0;
                for (let i = 0; i < this.stockreturnlist.length; i++) {
                  dis_totalamount = dis_totalamount + parseInt(this.stockreturnlist[i].quantity.toString());
                  dis_stockamount = dis_stockamount + parseInt(this.stockreturnlist[i].stockQty.toString());
                }
                this.myForm.get('totalqty').setValue("Total : " + dis_totalamount);
                this.myForm.get('stockqty').setValue("Total : " + dis_stockamount);
              }
            } else {
              //this.common.showMessage('warn', 'Failed to retrieve Data.');
              //this.productgroupList=null;
              let msg: string = data != null
                && data.displayMessage != null
                && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              this.common.showMessage('warn', msg);
            }
            this.myForm.controls['barCode'].setValue('');
            this.common.hideSpinner();
          }, this.common.time_out_delay);
        });
    }
  }
  void_item(item) {
    const idx = this.stockreturnlist.indexOf(item, 0);
    if (idx > -1) {
      this.stockreturnlist.splice(idx, 1);
      this.addQTY();
    }
  }
  addQTY() {
    let dis_totalamount: number = 0;
    let dis_stockamount: number = 0;
    for (let i = 0; i < this.stockreturnlist.length; i++) {
      dis_totalamount = dis_totalamount + parseInt(this.stockreturnlist[i].quantity.toString());
      dis_stockamount = dis_stockamount + parseInt(this.stockreturnlist[i].stockQty.toString());
    }
    this.myForm.get('totalqty').setValue("Total : " + dis_totalamount);
    this.myForm.get('stockqty').setValue("Total : " + dis_stockamount);
  }
  getWarehouse() {
    this.common.showSpinner();
    this.api.getAPI("WarehouseLookUp?countryid=" + this.countryid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.wareHouseList = data.warehouseMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  warehousecode() {
    if (this.wareHouseList != null && this.wareHouseList.length > 0) {
      for (let warehouse of this.wareHouseList) {
        if (warehouse.id == this.myForm.get('toWareHouse').value) {
          this.warehouseCode = warehouse.warehouseCode;
          break;
        }
      }
    }
  }
  addStockRequestDetails() {
    if (this.stockreturnlist == null) {
      this.common.showMessage("warn", "Can not Save, Language Details are invalid.");
    }
     else {
      for (let stock of this.stockreturnlist) {
        if (stock.quantity > 0) {
          this.negative = true;
          break;
        }
        else {
          this.negative = false;
        }
      }
      if (this.negative == false) {
        this.common.showMessage('warn', "Quantity Must greater than Zero");
      }
      else {
        for (let i = 0; i < this.stockreturnlist.length; i++) {
          if (this.stockreturnlist[i].quantity > this.stockreturnlist[i].stockQty) {
            this.boolUpdate = false;
            break;
          }
          else {
            this.boolUpdate = true;
          }
        }
        if (this.boolUpdate == true) {
          this.calculateqty();
          this.getTransactionLogList();
          this.common.showSpinner();
          this.stockreturn.id = 0;
          this.stockreturn.documentNo = this.myForm.get('documentNo').value;
          this.stockreturn.documentDate = this.myForm.get('documentDate').value;
          //this.stockreturn.totalQuantity=this.myForm.get('totalqty').value;
          this.stockreturn.totalQuantity = this.totalQty;
          this.stockreturn.toWareHouseID = this.myForm.get('toWareHouse').value;
          this.stockreturn.toWareHouseCode = this.warehouseCode;
          this.stockreturn.fromStoreID = this.storeid;
          this.stockreturn.storeCode = this.storecode;
          this.stockreturn.remarks = this.myForm.get('rem').value;;
          this.stockreturn.stockReturnDetailsList = this.stockreturnlist;
          this.stockreturn.toWareHouseID = this.myForm.get('toWareHouse').value;
          this.stockreturn.status = this.myForm.get('status').value;
          this.stockreturn.transactionLogList = this.transactionLogList;
          this.stockreturn.returnType = "Barcode";
          this.stockreturn.binCode = this.myForm.get('bin').value;

          this.api.postAPI("stockreturn", this.stockreturn).subscribe((data) => {

            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.common.hideSpinner();
              this.common.showMessage('success', data.displayMessage);
              this.clear_controls();
              this.router.navigate(['stockreturn']);
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
            this.common.showMessage('error', 'STOCK QTY AND RETURN QTY IS MISMATHED');
          }, this.common.time_out_delay);
        }
      }
    }
  }
  calculateqty() {
    this.totalQty = 0;
    for (let stock of this.stockreturnlist) {
      this.totalQty = this.totalQty + parseInt(stock.quantity.toString());
    }
  }

  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['stockreturn']);
      }
    }
    else {
      this.router.navigate(['stockreturn']);
    }
  }
  keyPress(event: any) {
    //const pattern = /[1-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    let inpnumber = parseInt(inputChar);
    if (inpnumber > 0) {
      this.negative = true;
    }
    else {
      this.negative = false;
      //this.common.showMessage('warn', "Quantity Must greater than Zero");
    }
  }
}
