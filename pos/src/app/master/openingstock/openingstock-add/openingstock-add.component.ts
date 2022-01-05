import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MOpeningstockdetailsMaster } from 'src/app/models/m-openingstockdetails-master';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MDocumentNumbering } from 'src/app/models/m-document-numbering';
import { threadId } from 'worker_threads';
import { MTransactionLog } from 'src/app/models/m-transaction-log';
import { MOpeningstockheadermaster } from 'src/app/models/m-openingstockheadermaster';

@Component({
  selector: 'app-openingstock-add',
  templateUrl: './openingstock-add.component.html',
  styleUrls: ['./openingstock-add.component.css']
})
export class OpeningstockAddComponent implements OnInit {

  myForm: FormGroup;
  skuList: Array<MSkuMasterTypes>;
  skuAddedList: Array<MSkuMasterTypes>;
  user_details: MUserDetails = null;
  openStock:MOpeningstockheadermaster;
  openingstocklist: Array<MOpeningstockdetailsMaster>;
  documentnumberinglist:Array<MDocumentNumbering>;
  transactionLogList:Array<MTransactionLog>;
  storeid:number;
  storename:string;
  storecode:string;
  documenttypeid:number;
  businessdate:any;
  countryid:number;
  countrycode:string;
  userid:number;
  totalQty:number;
  negative: boolean;
  
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb:FormBuilder,
    private confirm: ConfirmService,
    public router:Router
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      barCode: [''],
      storeid: ['', Validators.required],
      documentDate: ['', Validators.required],
      documentNo:['', Validators.required],
      quantity:[],
      totalqty:[],
      rem:['']
    });
    this.skuList = new Array<MSkuMasterTypes>();
    this.skuAddedList = new Array<MSkuMasterTypes>();
    this.openingstocklist=new Array<MOpeningstockdetailsMaster>();
    this.openStock = new MOpeningstockdetailsMaster;
    this.transactionLogList=new Array<MTransactionLog>();
    this.getDocumentNumber()
    this.myForm.controls['quantity'].setValue(1);
    this.negative = true;
  }
  ngOnInit(): void {
  }
  clear_controls()
  {
    this.myForm.get('barCode').setValue('');
    this.openingstocklist=null;
    this.myForm.get('totalqty').setValue(0);
    this.myForm.get('rem').setValue('');
  }
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;
      this.storeid=this.user_details.storeID;
      this.storename=this.user_details.storeName;
      this.storecode=this.user_details.storeCode;
      this.countryid=this.user_details.countryID;
      this.countrycode=this.user_details.countryCode;
      this.documenttypeid=80;
      this.businessdate=this.common.toYMDFormat(new Date());
    }
  }
  getDocumentNumber()
  {
    this.getStaticValues();
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid="+ this.storeid + "&DocumentTypeID=" + this.documenttypeid + "&business_date="+this.businessdate)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {         
            this.documentnumberinglist = data.documentNumberingBillNoDetailsRecord;
          
                this.myForm.controls['storeid'].setValue(this.storename);
                this.myForm.controls['documentDate'].setValue(this.businessdate);
                this.myForm.controls['documentNo'].setValue( data.documentNumberingBillNoDetailsRecord.prefix);

          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getSKUData(){
    if (this.negative == false) {
      this.common.showMessage('warn', "Quantity Must greater than Zero");
    }else
    {
    //this.productgroupList = null;
    this.common.showSpinner();
    this.api.getAPI("OpeningStock?itemcode=" + this.myForm.get('barCode').value + "&storeid=" +  this.storeid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {         
            this.skuList = data.skuMasterTypesList;
            if(this.skuList.length>0)
            {
              let tempskudata:MOpeningstockdetailsMaster = {
              id:0,
              barCode:data.skuMasterTypesList[0].barCode,
              sKUName :data.skuMasterTypesList[0].skuName,
              sKUCode:data.skuMasterTypesList[0].skuCode,
              brand:data.skuMasterTypesList[0].brandName,
              color:data.skuMasterTypesList[0].colorName,
              size:data.skuMasterTypesList[0].sizeCode,
              quantity:this.myForm.get('quantity').value,
              remarks:data.skuMasterTypesList[0].remarks,
              styleCode:data.skuMasterTypesList[0].styleCode,
              fromStoreCode:this.storecode,
              fromStoreID:this.storeid,
              documentDate:this.businessdate,
              sKUID:data.skuMasterTypesList[0].skuid,
              createBy:this.userid        
              } 
                this.openingstocklist.push(tempskudata);
                  let dis_totalamount: number = 0;
                    for (let i = 0; i < this.openingstocklist.length; i++){
                          dis_totalamount = dis_totalamount + parseInt(this.openingstocklist[i].quantity.toString());
                      }
                  this.myForm.get('totalqty').setValue(dis_totalamount);
                  this.myForm.get('barCode').setValue('');
            }            
          } else {
            this.common.showMessage('warn', 'Wrong SKU Scanned');
            this.myForm.get('barCode').setValue('');
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
    }
  }
  void_item(item) {
    const idx = this.openingstocklist.indexOf(item, 0);
    if (idx > -1) {
      this.openingstocklist.splice(idx, 1);
      this.addQTY();
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
  addQTY()
  {
    let dis_totalamount: number = 0;
    for (let i = 0; i < this.openingstocklist.length; i++){
      dis_totalamount = dis_totalamount + parseInt(this.openingstocklist[i].quantity.toString());
    }
    this.myForm.get('totalqty').setValue(dis_totalamount);
  }
  GetTransactionLogList()
  {
    if(this.openingstocklist != null){
      for (let i = 0; i < this.openingstocklist.length; i++){
        let templogdata:MTransactionLog = {
          id:0,          
          transactionType:"OpeningStock",
          businessDate:this.businessdate,
          actualDateTime:this.businessdate,
          documentID:0,
          styleCode:this.openingstocklist[i].styleCode,
          skuCode:this.openingstocklist[i].sKUCode,
          inQty:this.openingstocklist[i].quantity,             
          transactionPrice:0,
          currency:0,
          exchangeRate:0,
          documentPrice:0,
          userID:this.userid,
          documentNo:this.myForm.get('documentNo').value,
          storeID:this.storeid,
          storeCode:this.storecode,
          countryID:this.countryid,
          countryCode:this.countrycode,
          } 
          this.transactionLogList.push(templogdata);              
      }
    }
  }
  addOpeningStockDetails(){
    for(let stock of this.openingstocklist)
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
      this.common.showMessage('warn', "Quantity Must be greater than Zero");
    }
    else {
    if (this.openingstocklist == null || this.openingstocklist.length == 0) {
      this.common.showMessage("warn", "Can not Save, Opening Stock Details are invalid.");
    }  else {
            this.GetTransactionLogList();
            this.common.showSpinner();
            this.openStock.id=0;
            this.openStock.documentNo=this.myForm.get('documentNo').value;
            this.openStock.documentDate=this.myForm.get('documentDate').value;
            this.openStock.totalQuantity=this.myForm.get('totalqty').value;
            this.openStock.storeID=this.storeid;
            this.openStock.storeCode=this.storecode;
            this.openStock.remarks=this.myForm.get('rem').value;;
            this.openStock.openingStockDetailsList=this.openingstocklist;
            this.openStock.transactionLogList=this.transactionLogList;
            this.openStock.createBy=this.userid;
            this.openStock.countryID=this.countryid;
            this.openStock.countryCode=this.countrycode;

      this.api.postAPI("OpeningStock", this.openStock).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          this.router.navigate(['openingstock']);
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
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['openingstock']);
          }  
        } 
      else
        {
          this.router.navigate(['openingstock']);
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
        this.common.showMessage('warn', "Quantity Must greater than Zero");
      }
    }
}
