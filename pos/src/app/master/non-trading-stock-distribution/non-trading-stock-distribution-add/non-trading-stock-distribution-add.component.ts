import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MNontradingstockheaderMaster } from 'src/app/models/m-nontradingstockheader-master';
import { MNontradingstockdetailsMaster } from 'src/app/models/m-nontradingstockdetails-master';
import { MDocumentNumbering } from 'src/app/models/m-document-numbering';
import { MTransactionLog } from 'src/app/models/m-transaction-log';

@Component({
  selector: 'app-non-trading-stock-distribution-add',
  templateUrl: './non-trading-stock-distribution-add.component.html',
  styleUrls: ['./non-trading-stock-distribution-add.component.css']
})
export class NonTradingStockDistributionAddComponent implements OnInit {
  myForm: FormGroup;
  skuList: Array<MSkuMasterTypes>;
  skuAddedList: Array<MSkuMasterTypes>;
  user_details: MUserDetails = null;
  nontradingstock: MNontradingstockheaderMaster;
  nontradingstocklist: Array<MNontradingstockdetailsMaster>;
  documentnumberinglist: Array<MDocumentNumbering>;
  transactionLogList: Array<MTransactionLog>;
  employeeList: Array<any>;
  returnList: Array<any>;
  returnDetailsList: Array<any>;
  storeid: number;
  storename: string;
  storecode: string;
  documenttypeid: number;
  businessdate: any;
  listdate: any;
  countryid: number;
  countrycode: string;
  userid: number;
  totalQty: number;
  empid: number;
  empname: string;
  empcode: string;
  serialnumber: number = 0;
  transactionType: string;
  receivedType: string;
  receivedQuantity: number = 0;
  returnQuantity: number = 0;
  runningNo: number;
  detailID: number;
  negative: boolean = true;
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
      refDocNo: [''],
      documentDate: ['', Validators.required],
      documentNo: ['', Validators.required],
      empName: [''],
      receivedQty: [],
      totqty: [],
      availableStock: [''],
      ttgroup: [''],
      rtgroup: ['']
    });
    this.skuList = new Array<MSkuMasterTypes>();
    this.skuAddedList = new Array<MSkuMasterTypes>();
    this.nontradingstocklist = new Array<MNontradingstockdetailsMaster>();
    this.transactionLogList = new Array<MTransactionLog>();
    this.nontradingstock = new MNontradingstockheaderMaster;
    this.getStaticValues();
    this.getDocumentNumber();
    this.getEmployeeByStore();
    this.myForm.controls['empName'].setValue(0);
    this.myForm.controls['receivedQty'].setValue(1);
    this.myForm.controls['ttgroup'].setValue("Issue");
    this.myForm.controls['rtgroup'].setValue("Employee");
    this.receivedType = "Employee";
    this.transactionType = "Issue";
    this.myForm.controls['totqty'].setValue("Total : " + 0);
    this.myForm.get('refDocNo').disable();
    this.myForm.get('barCode').disable();
  }
  clear_controls() {
    this.myForm.get('barCode').setValue('');
    this.myForm.get('availableStock').setValue(0);
    this.myForm.get('receivedQty').setValue(0);
    this.myForm.get('empName').setValue(0);
    this.nontradingstocklist = new Array<MNontradingstockheaderMaster>();
    this.myForm.get('totqty').setValue(0);
    this.myForm.controls['refDocNo'].setValue('');
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
      this.documenttypeid = 110;
      this.businessdate = this.common.toYMDFormat(new Date());
      this.listdate = this.common.toDMYFormat(new Date());
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
  getDocumentNumber() {
    //this.getStaticValues();
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.storeid + "&DocumentTypeID=" + this.documenttypeid + "&business_date=" + this.businessdate)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.documentnumberinglist = data.documentNumberingBillNoDetailsRecord;

            this.myForm.controls['documentNo'].setValue(data.documentNumberingBillNoDetailsRecord.prefix);
            this.myForm.controls['documentDate'].setValue(this.listdate);

            this.runningNo = data.documentNumberingBillNoDetailsRecord.runningNo;
            this.detailID = data.documentNumberingBillNoDetailsRecord.detailID;

          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getTrantype() {
    this.transactionType = this.myForm.controls['ttgroup'].value;
    if (this.transactionType == "Return") {
      if (confirm("Are You Sure You want to Choose Return?")) {
        this.myForm.controls['ttgroup'].setValue("Return");
        this.nontradingstocklist = new Array<MNontradingstockheaderMaster>();
        this.myForm.controls['rtgroup'].disable();
        this.myForm.get('barCode').disable();
      }
      else {
        this.myForm.controls['ttgroup'].setValue("Issue");
      }
      this.myForm.get('refDocNo').enable();
    }
    else {
      if (confirm("Are You Sure You want to Choose Issue?")) {
        this.myForm.controls['ttgroup'].setValue("Issue");
        this.nontradingstocklist = new Array<MNontradingstockheaderMaster>();
        this.myForm.controls['refDocNo'].setValue('');
        this.myForm.get('empName').enable();
        this.myForm.controls['rtgroup'].enable();
        this.myForm.get('barCode').enable();
      }
      else {
        this.myForm.controls['ttgroup'].setValue("Return");
      }
      this.myForm.get('refDocNo').disable();
    }
  }
  getRecdtype() {
    this.receivedType = this.myForm.controls['rtgroup'].value;
    if (this.receivedType == "Store") {
      this.myForm.get('empName').setValue(0);
      this.myForm.get('empName').disable();
      this.myForm.get('barCode').enable();
      this.empcode = null;
      this.empname = null;
      this.empid = 0;
    }
    else {
      this.myForm.get('empName').enable();
      if (this.myForm.get('empName').value != 0) {
        this.myForm.get('barCode').enable();
      }
      else {
        this.myForm.get('barCode').disable();
        this.common.showMessage('warn', 'Please select an employee to proceed');
      }
    }
  }

  getSKUData() {
    /*for (let stock of this.nontradingstocklist) {
      if (stock.receivedQty > 0) {
        this.negative = true;
        break;
      }
      else {
        this.negative = false;
      }
    }
    if (this.negative == true) {
      this.common.showMessage('warn', "Quantity Must greater than Zero");
    }
    else */{
      this.common.showSpinner();
      this.api.getAPI("GetNonTradingStockBySKU?itemcode=" + this.myForm.get('barCode').value + "&storeid=" + this.storeid)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.skuList = data.nonTradingStockList;
              this.myForm.get('availableStock').setValue(data.nonTradingStockList[0].stockQty);
              this.serialnumber = this.serialnumber++;
              if (this.skuList.length > 0) {
                let tempdata: MNontradingstockdetailsMaster = {
                  id: 0,
                  nonTradingHeaderID: 0,
                  nonTradingHeaderDocumentNo: this.myForm.get('documentNo').value,
                  serialNo: this.serialnumber,
                  sKUID: data.nonTradingStockList[0].id,
                  barCode: this.myForm.get('barCode').value,
                  sKUCode: data.nonTradingStockList[0].skuCode,
                  receivedQty: 1,
                  returnQty: this.returnQuantity,
                  storeID: this.storeid,
                  date: this.listdate,
                  totalStock: this.myForm.get('availableStock').value
                }
                this.nontradingstocklist.push(tempdata);
                let dis_totalamount: number = 0;
                for (let i = 0; i < this.nontradingstocklist.length; i++) {
                  dis_totalamount = dis_totalamount + parseInt(this.nontradingstocklist[i].receivedQty.toString());
                }
                this.myForm.get('totqty').setValue("Total : " + dis_totalamount);
                this.totalQty = dis_totalamount;
                this.myForm.get('barCode').setValue('');
              }
            } else {
              this.common.showMessage('warn', 'Item not found or Item is not a Non-TradingItem');
              this.myForm.get('barCode').setValue('');
              this.myForm.get('availableStock').setValue('');
              //this.productgroupList=null;
            }
            this.common.hideSpinner();
          }, this.common.time_out_delay);
        });
    }
  }
  getReturnData() {
    this.nontradingstocklist = new Array<MNontradingstockdetailsMaster>();
    this.common.showSpinner();
    this.api.getAPI("NonTradingStockDistribution?id=" + 0 + "&documentno=" + this.myForm.get('refDocNo').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.returnList = data.nonTradingStockHeaderRecord;
            this.returnDetailsList = data.nonTradingStockHeaderRecord.nonTradingStockDetailsList;
            let employeename = data.nonTradingStockHeaderRecord.employeeName;
            if(employeename != null && employeename != ""){
            this.employeeList = this.employeeList.filter(x => x.employeeName.toLowerCase().includes(employeename.toLowerCase()))
            this.myForm.get('empName').setValue(this.employeeList[0].id);
          }else{
            this.myForm.get('empName').setValue(data.nonTradingStockHeaderRecord.empid);
          }
            this.myForm.get('empName').disable();
            //let store_Id = data.nonTradingStockHeaderRecord.storeId;
            this.myForm.controls['rtgroup'].setValue(data.nonTradingStockHeaderRecord.receivedType);
            /*if(store_Id != 0){
              this.myForm.controls['rtgroup'].setValue("Store");
           
            }else{
              this.myForm.controls['rtgroup'].setValue("Employee");
              
            }*/


            //this.myForm.get('availableStock').setValue(data.nonTradingStockList[0].stockQty);
            this.serialnumber = this.serialnumber++;

            for (let i = 0; i < this.returnDetailsList.length; i++) {
              if (this.returnDetailsList[i].receivedQty != this.returnDetailsList[i].returnQty) {
                let tempdata: MNontradingstockdetailsMaster = {
                  id: 0,
                  nonTradingHeaderID: 0,
                  nonTradingHeaderDocumentNo: this.myForm.get('documentNo').value,
                  serialNo: this.serialnumber,
                  sKUID: data.nonTradingStockHeaderRecord.nonTradingStockDetailsList[i].skuid,
                  barCode: data.nonTradingStockHeaderRecord.nonTradingStockDetailsList[i].barCode,
                  sKUCode: data.nonTradingStockHeaderRecord.nonTradingStockDetailsList[i].skuCode,
                  receivedQty: data.nonTradingStockHeaderRecord.nonTradingStockDetailsList[i].receivedQty,
                  returnQty: data.nonTradingStockHeaderRecord.nonTradingStockDetailsList[i].returnQty,
                  totalStock: data.nonTradingStockHeaderRecord.nonTradingStockDetailsList[i].to,
                  storeID: this.storeid,
                  date: this.listdate
                }
                this.nontradingstocklist.push(tempdata);
              }
            }
            let dis_totalamount: number = 0;
            for (let i = 0; i < this.nontradingstocklist.length; i++) {
              dis_totalamount = dis_totalamount + parseInt(this.nontradingstocklist[i].receivedQty.toString());
            }
            this.myForm.get('totqty').setValue("Total : " + dis_totalamount);
            this.totalQty = dis_totalamount;
            this.myForm.get('barCode').setValue('');
          } else {
            this.common.showMessage('warn', 'Item not found or Item is not a Non-TradingItem');
            this.myForm.get('barCode').setValue('');
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  void_item(item) {
    const idx = this.nontradingstocklist.indexOf(item, 0);
    if (idx > -1) {
      this.nontradingstocklist.splice(idx, 1);
      this.addQTY();
    }
  }
  addQTY() {
    let dis_totalamount: number = 0;
    for (let i = 0; i < this.nontradingstocklist.length; i++) {
      dis_totalamount = dis_totalamount + parseInt(this.nontradingstocklist[i].receivedQty.toString());
    }
    this.myForm.get('totqty').setValue("Total : " + dis_totalamount);
    this.totalQty = dis_totalamount;
  }
  getEmployeeByStore() {
    this.common.showSpinner();
    this.api.getAPI("GetEmployeeByStore?storeid=" + this.storeid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.employeeList = data.employeeList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  employeecode() {

    if (this.myForm.get('empName').value != 0) {
      this.myForm.get('barCode').enable();
    }
    else {
      this.myForm.get('barCode').disable();
    }

    if (this.employeeList != null && this.employeeList.length > 0) {
      for (let emp of this.employeeList) {
        if (emp.id == this.myForm.get('empName').value) {
          this.empid = emp.id;
          this.empcode = emp.employeeCode;
          this.empname = emp.employeeName;
          break;
        }
      }
    }
  }
  getTransactionLogList() {
    if (this.nontradingstocklist != null) {
      for (let i = 0; i < this.nontradingstocklist.length; i++) {
        let templogdata: MTransactionLog = {
          id: 0,
          transactionType: "NonTrading",
          businessDate: this.businessdate,
          actualDateTime: this.businessdate,
          documentID: 0,
          skuCode: this.nontradingstocklist[i].sKUCode,
          inQty: this.nontradingstocklist[i].returnQty,
          outQty: this.nontradingstocklist[i].receivedQty,
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

  addNonTradingStockDetails() {
    let stockcheck = true;
    if (this.nontradingstocklist.length == 0) {
      this.common.showMessage("warn", "Can not Save, Non Trading List is Empty.");
    } else {
      for (let stock of this.nontradingstocklist) {
        if (stock.receivedQty > 0) {
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
        for (let checkstock of this.nontradingstocklist) {
          if (checkstock.receivedQty > checkstock.totalStock && this.transactionType != "Return") {
            stockcheck = false;
            break;
          }
          else {
            stockcheck = true;
          }
        }
        if (stockcheck == false) {
          this.common.showMessage('warn', "Entered Qty is greater than Stock Qty");
        }
        else {
          let insert: boolean = true;
          if (this.transactionType == "Return") {
            for (let i = 0; i < this.nontradingstocklist.length; i++) {
              let arry = this.returnDetailsList.filter(x => x.skuCode == this.nontradingstocklist[i].sKUCode && x.serialNo == this.nontradingstocklist[i].serialNo);
              if (arry[0].receivedQty < this.nontradingstocklist[i].receivedQty) {
                insert = false;
                break;
              }
              else {
                let temp: number;
                temp = this.nontradingstocklist[i].receivedQty;
                this.nontradingstocklist[i].receivedQty = this.nontradingstocklist[i].returnQty;
                this.nontradingstocklist[i].returnQty = temp;
                insert = true;
              }
            }
          }
          if (insert == false) {
            this.common.showMessage('warn', "Return Qty is greater than received Qty");
          }
          else {
            this.getTransactionLogList();
            this.common.showSpinner();
            this.nontradingstock.id = 0;
            this.nontradingstock.documentNo = this.myForm.get('documentNo').value;
            this.nontradingstock.documentDate = this.businessdate;
            this.nontradingstock.countryID = this.countryid;
            this.nontradingstock.storeID = this.storeid;
            this.nontradingstock.receivedType = this.receivedType;
            this.nontradingstock.transactionType = this.transactionType;
            this.nontradingstock.receivedQty = this.totalQty;
            this.nontradingstock.refDocumentNo = this.myForm.get('refDocNo').value;
            this.nontradingstock.employeeID = this.empid;
            this.nontradingstock.employeeName = this.empname;
            this.nontradingstock.employeeCode = this.empcode;
            this.nontradingstock.storeCode = this.storecode;
            this.nontradingstock.runningNo = this.runningNo;
            this.nontradingstock.documentNumberingID = this.detailID;
            this.nontradingstock.nonTradingStockDetailsList = this.nontradingstocklist;
            this.nontradingstock.transactionLogList = this.transactionLogList;

            this.api.postAPI("nontradingstockdistribution", this.nontradingstock).subscribe((data) => {
              // // console.log(data);
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                this.common.hideSpinner();
                this.common.showMessage('success', data.displayMessage);
                this.clear_controls();
                this.router.navigate(['non-trading-stock-distribution']);
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
  }
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['non-trading-stock-distribution']);
      }
    }
    else {
      this.router.navigate(['non-trading-stock-distribution']);
    }
  }
  ngOnInit(): void {
  }
  keyPress(event) {
    //const pattern = /[1-9]/;
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue

    //let inputChar = String.fromCharCode(event.charCode);
    //let inpnumber = parseInt(inputChar);
    if (value > 0) {
      this.negative = true;

    }
    else {
      this.negative = false;
      //this.common.showMessage('warn', "Quantity Must greater than Zero");
    }
  }
}
