import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { ApiService } from 'src/app/api.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { MUserDetails } from 'src/app/models/m-user-details';
import * as XLSX from 'xlsx';
import { MInventoryManualCount, MInventoryManualCountDetail } from 'src/app/models/m-inventorycountingdetails-master';
import {MInventoryManualStock} from 'src/app/models/m-inventorycountingdetails-master';
import { MInventoryInit } from 'src/app/models/m-inventorycountingdetails-master';
import { MExcelSKU } from 'src/app/models/m-inventorycountingdetails-master';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';
@Component({
  selector: 'app-inventorydoc-upload',
  templateUrl: './inventorydoc-upload.component.html',
  styleUrls: ['./inventorydoc-upload.component.css']
})
export class InventorydocUploadComponent implements OnInit {
  myForm: FormGroup;
  user_details: MUserDetails = null;
  spinnerEnabled = false;
  userid:number;
  storeid:number;
  storename:string;
  storecode:string;
  documenttypeid:number;
  businessdate:any;
  keys: string[];
  InventoryManualCountDetail:MInventoryManualCountDetail;
  SkuMasterTypesList:Array<any>;
  ExcelSKU:MExcelSKU;
  // dataSheet = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('fileInput')
  myFileInput1: ElementRef;
  SummaryStockList:Array<MInventoryManualCountDetail>;
  dataimage:any;
  filelist:any;
  file:File;
  arrayBuffer:any;
  Barcode:any;
  IsValidSKU:boolean;
  start_index:number;
  TotalCount:number;
  dateObj:any;
  status:string;
  InventoryInit:MInventoryInit;
  InventoryManualStock: MInventoryManualStock;
  showSpinner:boolean=false;
  btnApprove :boolean= true;
  btnSave:boolean= true;
  btnAddstck:boolean=true;
  btnSumstck:boolean=true;

  isExcelFile: boolean;

  constructor(  
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private http: HttpClient) {
      this.createForm();
     }
  createForm() {
    this.myForm = this.fb.group({
      fileInput:[''],
       documentDate: ['', Validators.required],
      documentNo:['', Validators.required],
      countingType:['',Validators.required]
    });
    this.getStaticValues();
    this.SummaryStockList=new Array<MInventoryManualCountDetail>();
    this.InventoryInit=new MInventoryInit();
  }
  
 
  ngOnInit(): void {
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
  addfile(e) {
    try{
      this.showSpinner=true;
      const fileName = e.target.files[0].name;
      import('xlsx').then(xlsx => {
        let workBook = null;
        let sheetname=null;
        let jsonData = null;
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = reader.result;
          workBook = xlsx.read(data, { type: 'binary' });
          jsonData = workBook.SheetNames.reduce((initial, name) => {
            const sheet = workBook.Sheets[name]
            initial[name] = xlsx.utils.sheet_to_json(sheet);
            initial[name].sheets=workBook.SheetNames;
            return initial;
          }, {});
          this.filelist = jsonData[Object.keys(jsonData)[0]];
          this.showSpinner=false;
          this.btnAddstck=false;
        };
        reader.readAsBinaryString(e.target.files[0]);
      });
    
    }
    catch(e){
       console.log('error', e);
    }
   
  }

  Add_Stock_SummaryNEW()
  {
    
    this.SkuMasterTypesList=Array<any>();
    for(let item of this.filelist)
    {
      this.IsValidSKU=false;
      this.InventoryManualCountDetail = new MInventoryManualCountDetail();
      this.ExcelSKU  = new MExcelSKU();
      this.common.showSpinner();
      this.api.getAPI("InventoryCountingupload?skucode="+ item.BARCODE +"&storeid="+ this.storeid)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) 
            {
              
                this.IsValidSKU=true;
                this.InventoryManualCountDetail.skuCode=data.skuMasterTypesList[0].skuCode;
                this.InventoryManualCountDetail.barCode=data.skuMasterTypesList[0].barCode;
                this.InventoryManualCountDetail.styleCode=data.skuMasterTypesList[0].styleCode;
                this.InventoryManualCountDetail.stockQty=item.STOCKQTY;
                this.SkuMasterTypesList.push(data.skuMasterTypesList);
                console.log(this.SkuMasterTypesList)
                   
            
            } 
            else {
              let msg: string = data != null
                && data.displayMessage != null
                && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              this.common.showMessage('warn', msg);
            }
            
             this.common.hideSpinner();
          }, this.common.time_out_delay);
        });
        
    }
    if(this.IsValidSKU)
     {
             
             this.SummaryStockList.push(this.InventoryManualCountDetail);
      }

    this.filelist=null;
    
  }
  Add_Stock_Summary(){
    // this.getInventorySystemStockListTotal();
    this.common.showSpinner();
    this.getStock()
    .then((data1:any) => {
      debugger;
      this.start_index=0;
      let calls: Array<any>;
      calls = new Array<any>();
      while(this.start_index < this.TotalCount)
      {
        var Barcode=this.filelist[this.start_index].BARCODE;
        var stkqty =this.filelist[this.start_index].STOCKQTY;
        debugger;
        calls.push(this.http.get(AppConstants.base_url + "api/InventoryCountingupload?skucode="+ Barcode +"&storeid="+ this.storeid));
        this.start_index += 1;
      }

      forkJoin(calls).subscribe((result:Array<any>)=>{
        this.common.hideSpinner();
        if(result != null && result.length > 0){
          for(let data of result){
            if (data != null && data.statusCode != null && data.statusCode == 1) { 
              if(this.SummaryStockList == null){
                this.SummaryStockList = new Array<MInventoryManualCountDetail>();
               
              }
              if(data.skuMasterTypesList != null && data.skuMasterTypesList.length > 0){
                for(let item of data.skuMasterTypesList){
                  this.InventoryManualCountDetail = new MInventoryManualCountDetail();
                  this.InventoryManualCountDetail.skuCode=item.skuCode;
                  this.InventoryManualCountDetail.barCode=item.barCode;
                  this.InventoryManualCountDetail.styleCode=item.styleCode;
                  this.InventoryManualCountDetail.stockQty=this.filelist.find(x=> x.BARCODE==item.barCode).STOCKQTY;
                  this.InventoryManualCountDetail.storeID=this.filelist[0].sheets;
                  this.InventoryManualCountDetail.sheetName="Sheet1";
                  this.SummaryStockList.push(this.InventoryManualCountDetail);
                 
                }
                
              }
            } 
            
          }
          this.filelist=new Array<any>();
          this.btnSumstck=false;
        }
        else {
          let msg: string = "Failed to retrieve Data.";
            this.common.showMessage("warn",msg);
        }  
       
      });
    }).catch((err) => {
      this.common.showMessage('warn', err);
      this.common.hideSpinner();
    });
  }
  getStock()
  {
    return new Promise((resolve, reject) => {
      if( this.filelist != null ||  this.filelist.length >0)
       resolve(this.TotalCount=this.filelist.length);
       else 
       {
        let msg: string = ("Please upload the stock counting file !.")
        reject(msg);
      }
  });
  }
//   Add_Stock_SummaryOLD()
//   {
//     this.start_index=0;
//    this.TotalCount=this.filelist.length;
//    while(this.start_index < this.TotalCount){
//     this.start_index+=0;
//     var Barcode=this.filelist[this.start_index].BARCODE;
//     var stkqty =this.filelist[this.start_index].STOCKQTY;
//     this.getManualStock(Barcode,stkqty)
//     .then((data1)=>{
//       this.start_index += 1;
//     })
//     .catch((err)=>{
//       this.common.showMessage("warn",err);
//       return;
//     });
//   }
// }
// getManualStock(Barcode:any,stkqty:any)
// {
//   return new Promise((resolve, reject)=>{
//     this.api.getAPI("InventoryCountingupload?skucode="+ Barcode +"&storeid="+ this.storeid)
//     .subscribe((data) => {
//       if (data != null && data.statusCode != null && data.statusCode == 1) { 
//         if(this.SummaryStockList == null){
//           this.SummaryStockList = new Array<MInventoryManualCountDetail>();
//           this.InventoryManualCountDetail = new MInventoryManualCountDetail();
//         }
//         if(data.skuMasterTypesList != null && data.skuMasterTypesList.length > 0)
//         {
//           for(let item of data.skuMasterTypesList)
//           {

//             this.InventoryManualCountDetail.skuCode=item.skuCode;
//             this.InventoryManualCountDetail.barCode=item.barCode;
//             this.InventoryManualCountDetail.styleCode=item.styleCode;
//             this.InventoryManualCountDetail.stockQty=stkqty;
//             this.InventoryManualCountDetail.storeID=this.storeid;
//             this.SummaryStockList.push(this.InventoryManualCountDetail);
//           }
//         }
//         resolve("ok");
        
//       } else {
//           let msg: string = data != null
//             && data.displayMessage != null
//             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
//             reject(msg);
//         }
//     });
//   });
// }
Stock_Summary()
{
  console.log(this.groupByKey(this.SummaryStockList, 'barcode'))
}
  Save_Click()
  {
     if (this.myForm.get('documentDate').value == null || this.myForm.get('documentDate').value=='')
     {
        this.common.showMessage("warn",'Please select a initialize date !.');
         
      }
       else if(this.myForm.get('documentNo').value == null || this.myForm.get('documentNo').value=='')
      {
        this.common.showMessage("warn",'Document number is empty.Please choose the proper initialize date for document number !.');
             
      }
      else if(this.SummaryStockList == null || this.SummaryStockList.length==0)
      {
        this.common.showMessage("warn",'Please upload the stock counting file !.');
      }
      else if(this.myForm.get('countingType').value ==null || this.myForm.get('countingType').value=='')
      {
        this.common.showMessage("warn",'Please choose the counting type !.');
         
      }
      else if(this.InventoryInit == null)
      {
        this.common.showMessage("warn",'Inventory initialize record not found !.');
              
      } 
      else
      {
        var mInventoryManualStock =new MInventoryManualStock();
        mInventoryManualStock.inventoryManualCountRecord =new MInventoryManualCount();
        mInventoryManualStock.inventoryManualCountRecord.documentDate=this.myForm.get('documentDate').value;
        mInventoryManualStock.inventoryManualCountRecord.documentNo=this.myForm.get('documentNo').value;
        mInventoryManualStock.inventoryManualCountRecord.inventoryInitID=this.InventoryInit.id;
        mInventoryManualStock.inventoryManualCountRecord.storeID=this.storeid;
        mInventoryManualStock.inventoryManualCountRecord.countingType=this.myForm.get('countingType').value;
        mInventoryManualStock.status="Stock Uploaded";
        mInventoryManualStock.inventoryManualCountRecord.inventoryManualCountDetailList=this.SummaryStockList;
        this.common.showSpinner();
        this.api.postAPI("InventoryCountingupload", mInventoryManualStock).subscribe((data) => {
         if (data != null && data.statusCode != null && data.statusCode == 1) {
           this.common.hideSpinner();
           this.common.showMessage('success', data.displayMessage);
          //  this.inventorySystemStockList = new Array<MInventorySysCount>();
          this.ClearForm();
         } 
         else {
           setTimeout(() => {
             this.common.hideSpinner();
             this.common.showMessage('error', 'Failed to Save.');
           }, this.common.time_out_delay);
         }
       })

      }
   
  }
   groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if(obj[key] === undefined) return hash; 
        return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
      }, {})
 }
//  addEvent(type: string, event:any) {
//  console.log()`${type}: ${event.value}`);
// }
Onchangedate(e)
{
  let documentNo:string=null;
  let selectdate =this.common.toDMYFormat(e);
  this.common.showSpinner();
  debugger;
  this.api.getAPI("InventoryCountingupload?documentNo="+ documentNo + "&documentDate="+ selectdate)
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {         
          this.InventoryInit=data.responseDynamicData;
          if(this.InventoryInit.status == "Pending for Approval")
          {
              this.common.showMessage('info', 'The Document is already goes for approval.You Cannot edit the document!.');
              this.btnApprove= true;
              this.btnSave = true;                        
          }
          else
          {
              this.btnApprove = false;
              this.btnSave = false;
          }
          this.myForm.controls['documentNo'].setValue(data.responseDynamicData.documentNo);
              

        } else {
          this.common.showMessage('warn', 'Failed to retrieve Data.');
        }
        this.common.hideSpinner();
      }, this.common.time_out_delay);
    });
}
Approval_Click()
{
  if (this.myForm.get('documentDate').value == null || this.myForm.get('documentDate').value=='')
     {
        this.common.showMessage("warn",'Please select a initialize date !.');
         
      }
       else if(this.myForm.get('documentNo').value == null || this.myForm.get('documentNo').value=='')
      {
        this.common.showMessage("warn",'Document number is empty.Please choose the proper initialize date for document number !.');
             
      }
      else if(this.SummaryStockList == null || this.SummaryStockList.length==0)
      {
        this.common.showMessage("warn",'Please upload the stock counting file !.');
      }
      else if(this.myForm.get('countingType').value ==null || this.myForm.get('countingType').value=='')
      {
        this.common.showMessage("warn",'Please choose the counting type !.');
         
      }
      else if(this.InventoryInit == null)
      {
        this.common.showMessage("warn",'Inventory initialize record not found !.');
              
      } 
      else
      {
        var mInventoryManualStock =new MInventoryManualStock();
        mInventoryManualStock.inventoryManualCountRecord =new MInventoryManualCount();
        mInventoryManualStock.inventoryManualCountRecord.documentDate=this.myForm.get('documentDate').value;
        mInventoryManualStock.inventoryManualCountRecord.documentNo=this.myForm.get('documentNo').value;
        mInventoryManualStock.inventoryManualCountRecord.inventoryInitID=this.InventoryInit.id;
        mInventoryManualStock.inventoryManualCountRecord.storeID=this.storeid;
        mInventoryManualStock.inventoryManualCountRecord.countingType=this.myForm.get('countingType').value;
        mInventoryManualStock.status="Pending for Approval";
        mInventoryManualStock.inventoryManualCountRecord.inventoryManualCountDetailList=this.SummaryStockList;
        this.common.showSpinner();
        this.api.postAPI("InventoryCountingupload", mInventoryManualStock).subscribe((data) => {
         if (data != null && data.statusCode != null && data.statusCode == 1) {
           this.common.hideSpinner();
           this.common.showMessage('success', data.displayMessage);
          //  this.inventorySystemStockList = new Array<MInventorySysCount>();
          this.ClearForm();
         } 
         else {
           setTimeout(() => {
             this.common.hideSpinner();
             this.common.showMessage('error', 'Failed to Save.');
           }, this.common.time_out_delay);
         }
       })

      }

}
ClearForm()
{
  this.myForm.controls['documentNo'].setValue('');
  this.myForm.controls['documentDate'].setValue('');
  this.myForm.controls['countingType'].setValue('');
  this.InventoryInit=new MInventoryInit();
  this.InventoryManualCountDetail=new MInventoryManualCountDetail();               
  this.SummaryStockList = new Array<MInventoryManualCountDetail>();
  this.filelist=new Array<any>();

}
Reset_Click()
{
  this.ClearForm();
}
close_Click()
{
  if (confirm("Are You Sure You want to close the On inventory counting Upload Document ?")) 
    {
      
      this.router.navigate(['inventory-counting']);
    }
}
}
