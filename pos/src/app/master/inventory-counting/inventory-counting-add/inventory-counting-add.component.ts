import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MInventorycountingheaderMaster } from 'src/app/models/m-inventorycountingheader-master';
import { MInventorycountingdetailsMaster, MInventoryInit } from 'src/app/models/m-inventorycountingdetails-master';
import { MSystemStock } from 'src/app/models/m-inventorycountingdetails-master';
import { MInventorySysCount } from 'src/app/models/m-inventorycountingdetails-master';
import { MDocumentNumbering } from 'src/app/models/m-document-numbering';
import { MUserDetails } from 'src/app/models/m-user-details';
import { promise } from 'protractor';
import { rejects } from 'assert';
import { start } from 'repl';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';

@Component({
  selector: 'app-inventory-counting-add',
  templateUrl: './inventory-counting-add.component.html',
  styleUrls: ['./inventory-counting-add.component.css']
})
export class InventoryCountingAddComponent implements OnInit {

  myForm: FormGroup;
  inventoryCounting:MInventorycountingheaderMaster;
  inventoryCountinglist: Array<MInventorycountingdetailsMaster>;
  documentnumberinglist:Array<MDocumentNumbering>;
  inventorySystemStockList:Array<MInventorySysCount>;
  user_details: MUserDetails = null;
  userid:number;
  storeid:number;
  storename:string;
  storecode:string;
  documenttypeid:number;
  businessdate:any;
  runningNo:number;
  detailID:number;
  stockQuantity:any;
  start_index:number;
  limit:number;
  TotalCount:number;
  mInventorysyscount:Array<MInventorySysCount>;
  docnumid:number;
  InventoryInitRecord:MInventoryInit;
  InventorySysCountList:Array<MInventorySysCount>;
  Freezebtn:boolean=true;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router:Router,
    private http: HttpClient
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      documentDate: ['', Validators.required],
      documentNo:['', Validators.required],
      remarks:[],
      totqty:[]
      
    });
    this.inventoryCountinglist=new Array<MInventorycountingdetailsMaster>();
    this.inventoryCounting = new MInventorycountingheaderMaster;
    this.getStaticValues();
    this.getDocumentNumber();   
    this.myForm.controls['totqty'].setValue("Total : "+0);
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
      this.documenttypeid=64;
      this.businessdate=this.common.toYMDFormat(new Date());
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
  getDocumentNumber()
  {
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid="+ this.storeid + "&DocumentTypeID=" + this.documenttypeid + "&business_date="+this.businessdate)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {         
            this.documentnumberinglist = data.documentNumberingBillNoDetailsRecord;

            this.myForm.controls['documentNo'].setValue(data.documentNumberingBillNoDetailsRecord.prefix);
            this.myForm.controls['documentDate'].setValue(this.common.toDMYFormat(new Date()));

            this.runningNo = data.documentNumberingBillNoDetailsRecord.runningNo;
            this.detailID = data.documentNumberingBillNoDetailsRecord.detailID; 
            this.docnumid=data.documentNumberingBillNoDetailsRecord.docNumID;         

          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  // getInventorySystemStockList()
  // {
  //   this.common.showSpinner();
  //   this.api.getAPI("inventorycounting?storeid="+ this.storeid)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {         
  //           this.inventorySystemStockList = data.inventorySysCountList;

  //           for(let i=0;i<this.inventorySystemStockList.length;i++)
  //           {
  //             this.stockQuantity=this.stockQuantity+this.inventorySystemStockList[i].stockQty;
  //           }    
  //           this.myForm.controls['totqty'].setValue("Total : "+ this.stockQuantity);

  //         } else {
  //           this.common.showMessage('warn', 'Failed to retrieve Data.');
  //         }
  //         this.common.hideSpinner();
  //       }, this.common.time_out_delay);
  //     });
  // }
  ngOnInit(): void {
  }

  getStoctList(){
    // this.getInventorySystemStockListTotal();
    this.inventorySystemStockList=new Array<any>();
    this.mInventorysyscount=new Array<MInventorySysCount>();
    this.common.showSpinner();
    this.getInventorySystemStockListTotal()
    .then((data1:any) => {
      debugger;
      this.start_index=0;
      this.limit = 1000;
      let calls: Array<any>;
      calls = new Array<any>();
      while(this.start_index < this.TotalCount)
      {
      // while(this.start_index < 100){
        debugger;
        calls.push(this.http.get(AppConstants.base_url + "api/InventoryCountinginitalize?limit=" + this.limit + "&offset=" + this.start_index + "&storeid="+ this.storeid));
        this.start_index += this.limit;
      }

      forkJoin(calls).subscribe((result:Array<any>)=>{
        this.common.hideSpinner();
        if(result != null && result.length > 0){
          for(let data of result){
            if (data != null && data.statusCode != null && data.statusCode == 1) { 
              if(this.inventorySystemStockList == null){
                this.inventorySystemStockList = new Array<MInventorySysCount>();
              }
              if(data.inventorySysCountList != null && data.inventorySysCountList.length > 0){
                for(let item of data.inventorySysCountList){
                  this.inventorySystemStockList.push(item);
                }
              }
            } 
            
          }
          this.myForm.controls['totqty'].setValue("Total : "+ this.inventorySystemStockList.reduce((sum,x) => sum + x.stockQty,0));  
          this.Freezebtn=false;    
        }
        else {
          let msg: string = "Failed to retrieve Data.";
            this.common.showMessage("warn",msg);
        }  
       
      });
    }).catch((err) => {
      console.log(err);
      this.common.showMessage('warn', err);
      this.common.hideSpinner();
    });
  }


  getStoctListOLD(){
    // this.getInventorySystemStockListTotal();
    this.inventorySystemStockList=new Array<any>();
    this.mInventorysyscount=new Array<MInventorySysCount>();
    this.getInventorySystemStockListTotal()
    .then((data1:any) => {
      debugger;
      this.start_index=0;
      this.limit = 1000;
      let calls: Array<any>;
      calls = new Array<any>();
      while(this.start_index < this.TotalCount){
        this.start_index+=this.limit;
        this.getPhysicalStock(this.start_index, this.limit)
        .then((data1)=>{
          this.start_index += this.limit;
        })
        .catch((err)=>{
          this.common.showMessage("warn",err);
          return;
        });
      }
    }).catch((err) => {
      this.common.showMessage('warn', err);
      this.common.hideSpinner();
    });
  }

  getPhysicalStock(start_index:any, limit:any){
    return new Promise((resolve, reject)=>{
      this.api.getAPI("InventoryCountinginitalize?limit=" + limit + "&offset=" + start_index + "&storeid="+ this.storeid)
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) { 
          if(this.inventorySystemStockList == null){
            this.inventorySystemStockList = new Array<MInventorySysCount>();
          }
          if(data.inventorySysCountList != null && data.inventorySysCountList.length > 0){
            for(let item of data.inventorySysCountList){
              this.inventorySystemStockList.push(item);
            }
          }
          resolve("ok");
          // this.inventorySystemStockList=data.inventorySysCountList;
          // // this.TotalCount=data.inventorySysCountList.length;
          // resolve(data.inventorySysCountList);
        } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
          }
      });
    });
  }
  getInventorySystemStockListTotal()
  {
    return new Promise((resolve, reject) => {
      this.api.getAPI("InventoryCountinginitalize?storeid="+ this.storeid)
       .subscribe((data) => {
         if (data != null && data.statusCode != null && data.statusCode == 1) { 
           this.TotalCount=data.recordCount;
           resolve(data.inventorySysCountList);
         } else {
             let msg: string = data != null
               && data.displayMessage != null
               && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
               reject(msg);
           }
       });
     });
    // this.api.getAPI("InventoryCountinginitalize?storeid="+ this.storeid)
    // .subscribe((data) => {
    //   if (data != null && data.statusCode != null && data.statusCode == 1) { 
    //     this.start_index=0;
    //     this.limit = 100;
    //     this.TotalCount=data.recordCount;
      
    //   } else {
    //       let msg: string = data != null
    //         && data.displayMessage != null
    //         && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            
    //     }
    // });

  }
  getInventorySystemStockList() {
    return new Promise((resolve, reject) => {
     this.api.getAPI("inventorycounting?storeid="+ this.storeid)
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) { 
          this.start_index=0;
          this.limit = 100;
          this.TotalCount=data.inventorySysCountList.length;
          resolve(data.inventorySysCountList);
        } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
          }
      });
    });
  }
  Freeze_Stock()
  {
  
    this.InventorySysCountList=new Array<MInventorySysCount>();
    // console.log(this.InventorySysCountList);
    this.InventoryInitRecord=new MInventoryInit();
    this.InventoryInitRecord.documentNo=this.myForm.get('documentNo').value;
    this.InventoryInitRecord.documentDate=this.myForm.get('documentDate').value;
    this.InventoryInitRecord.storeID=this.storeid;
    this.InventoryInitRecord.remarks=this.myForm.get('remarks').value;
    this.InventoryInitRecord.inventorySysCountList=this.InventorySysCountList;
    var mSystemStock = new MSystemStock(); 
    mSystemStock.inventoryManualCountRecord= this.InventoryInitRecord;
    mSystemStock.documentNumberingID= this.docnumid;
    mSystemStock.runningNo= this.runningNo;
    this.common.showSpinner();
    this.api.postAPI("inventorycounting", mSystemStock).subscribe((data) => {
     if (data != null && data.statusCode != null && data.statusCode == 1) {
       this.common.hideSpinner();
       this.common.showMessage('success', data.displayMessage);
       this.inventorySystemStockList = new Array<MInventorySysCount>();
      //  this.ClearForm();
     } 
     else {
       setTimeout(() => {
         this.common.hideSpinner();
         this.common.showMessage('error', 'Failed to Save.');
       }, this.common.time_out_delay);
     }
   })
 
   

  }
   Close()
   {
    if (confirm("Are You Sure You want to close the On inventory counting?")) 
    {
      
      this.router.navigate(['inventory-counting']);
    }
   }
}
