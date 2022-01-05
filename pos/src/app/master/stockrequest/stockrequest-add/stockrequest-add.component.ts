import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MOpeningstockdetailsMaster } from 'src/app/models/m-openingstockdetails-master';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MTransactionLog } from 'src/app/models/m-transaction-log';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MStockheaderMaster } from 'src/app/models/m-stockheader-master';
import { MDocumentNumbering } from 'src/app/models/m-document-numbering';
import { MStockrequestMaster } from 'src/app/models/m-stockrequest-master';

@Component({
  selector: 'app-stockrequest-add',
  templateUrl: './stockrequest-add.component.html',
  styleUrls: ['./stockrequest-add.component.css']
})
export class StockrequestAddComponent implements OnInit {
  myForm: FormGroup;
  skuList: Array<MSkuMasterTypes>;
  skuAddedList: Array<MSkuMasterTypes>;
  user_details: MUserDetails = null;
  stockrequest: MStockheaderMaster;
  stockrequestlist: Array<MStockrequestMaster>;
  documentnumberinglist: Array<MDocumentNumbering>;
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
  negative: boolean;

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
      fromstore: ['', Validators.required],
      documentDate: ['', Validators.required],
      documentNo: ['', Validators.required],
      status: ['', Validators.required],
      toWareHouse: ['', Validators.required],
      quantity: [],
      totalqty: [],
      rem: ['']
    });
    this.skuList = new Array<MSkuMasterTypes>();
    this.skuAddedList = new Array<MSkuMasterTypes>();
    this.stockrequestlist = new Array<MStockrequestMaster>();
    this.stockrequest = new MStockrequestMaster;

    this.getDocumentNumber();
    this.getWarehouse();
    this.myForm.controls['quantity'].setValue(1);
    //this.myForm.get('toWareHouse').setValue('');
    this.myForm.get('status').setValue("Open");
    this.negative = true;
  }
  ngOnInit(): void {
  }
  clear_controls() {
    this.myForm.get('barCode').setValue('');
    this.myForm.get('toWareHouse').setValue('');
    this.myForm.get('status').setValue(0);
    //this.stockrequestlist=null;
    this.stockrequestlist = new Array<MStockrequestMaster>();
    this.myForm.get('totalqty').setValue(0);
    this.myForm.get('status').setValue("Open");
    this.myForm.get('rem').setValue('');

  }
  getStaticValues() {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);

    }
    this.userid = this.user_details.id;
    this.storeid = this.user_details.storeID;
    this.storename = this.user_details.storeName;
    this.storecode = this.user_details.storeCode;
    this.countryid = this.user_details.countryID;
    this.countrycode = this.user_details.countryCode;
    this.documenttypeid = 61;
    this.businessdate = this.common.toYMDFormat(new Date());
    this.myForm.controls['fromstore'].setValue(this.storename);
    this.myForm.controls['documentDate'].setValue(this.businessdate);
  }
  // restrictSpecialChars(event) {
  // var k;
  //k = event.charCode;
  //return ((k > 64 && k < 91)
  // || (k > 96 && k < 123)
  // || k == 8
  // || k == 32
  // || (k >= 48 && k <= 57));
  //}
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
  getSKUData() {
    /*if (this.negative == false) {
      this.common.showMessage('warn', "Quantity Must greater than Zero");
    }
    else*/ {
      this.common.showSpinner();

      this.api.getAPI("StockRequest?itemcode=" + this.myForm.get('barCode').value + "&storeid=" + this.storeid)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.skuList = data.skuMasterTypesList;
              if (this.skuList.length > 0) {
                let tempdata: MStockrequestMaster = {
                  id: 0,
                  barCode: data.skuMasterTypesList[0].barCode,
                  sKUID: data.skuMasterTypesList[0].skuid,
                  sKUName: data.skuMasterTypesList[0].skuName,
                  sKUCode: data.skuMasterTypesList[0].skuCode,
                  brand: data.skuMasterTypesList[0].brandName,
                  color: data.skuMasterTypesList[0].colorName,
                  size: data.skuMasterTypesList[0].sizeCode,
                  quantity: this.myForm.get('quantity').value,
                  remarks: data.skuMasterTypesList[0].remarks,
                  styleCode: data.skuMasterTypesList[0].styleCode,
                  applicationDate: this.businessdate,
                  documentDate: this.businessdate,
                  fromStoreID: this.storeid
                }
                this.stockrequestlist.push(tempdata);
                let dis_totalamount: number = 0;
                for (let i = 0; i < this.stockrequestlist.length; i++) {
                  dis_totalamount = dis_totalamount + parseInt(this.stockrequestlist[i].quantity.toString());
                }
                this.myForm.get('totalqty').setValue(dis_totalamount);
              }
            } else {
              // this.common.showMessage('warn', 'Failed to retrieve Data.');
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
    const idx = this.stockrequestlist.indexOf(item, 0);
    if (idx > -1) {
      this.stockrequestlist.splice(idx, 1);
      this.addQTY();
    }
  }
  addQTY() {
    let dis_totalamount: number = 0;
    for (let i = 0; i < this.stockrequestlist.length; i++) {
      dis_totalamount = dis_totalamount + parseInt(this.stockrequestlist[i].quantity.toString());
    }
    this.myForm.get('totalqty').setValue(dis_totalamount);
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

  addStockRequestDetails() {
    for(let stock of this.stockrequestlist)
    {
      if(stock.quantity>0)
      {
        this.negative=true;
        break;
      }
      else
      {
        this.negative=false;
      }
    }
    if (this.negative == false) {
      this.common.showMessage('warn', "Quantity Must greater than Zero");
    }
    else {
      if (this.stockrequestlist == null || this.stockrequestlist.length == 0) {
        this.common.showMessage("warn", "Can not Save, Stock Request Details are invalid.");
      } else {
        this.common.showSpinner();
        this.stockrequest.id = 0;
        this.stockrequest.documentNo = this.myForm.get('documentNo').value;
        this.stockrequest.documentDate = this.myForm.get('documentDate').value;
        this.stockrequest.totalQuantity = this.myForm.get('totalqty').value;
        this.stockrequest.fromStore = this.storeid;
        this.stockrequest.storeCode = this.storecode;
        this.stockrequest.remarks = this.myForm.get('rem').value;;
        this.stockrequest.stockRequestDetailsList = this.stockrequestlist;
        this.stockrequest.wareHouseID = this.myForm.get('toWareHouse').value;
        this.stockrequest.status = this.myForm.get('status').value;
        //this.stockrequest.transactionLogList=this.transactionLogList;

        this.api.postAPI("stockrequest", this.stockrequest).subscribe((data) => {
          //// .log(data);
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            this.common.showMessage('success', data.displayMessage);
            this.clear_controls();
            this.router.navigate(['stockrequest']);
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

  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['stockrequest']);
      }
    }
    else {
      this.router.navigate(['stockrequest']);
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
