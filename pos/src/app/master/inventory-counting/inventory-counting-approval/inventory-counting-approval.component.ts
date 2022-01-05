import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { MInventorycountingdetailsMaster } from 'src/app/models/m-inventorycountingdetails-master';
import { MInventoryManualCount } from 'src/app/models/m-inventorycountingdetails-master';
import { MInventoryManualCountDetail } from 'src/app/models/m-inventorycountingdetails-master';
import { MInventorySysCount } from 'src/app/models/m-inventorycountingdetails-master';
import { MInventoryInit } from 'src/app/models/m-inventorycountingdetails-master';
import {MTransactionLog} from 'src/app/models/m-transaction-log';
import {MInventoryFinalize} from 'src/app/models/m-inventorycountingdetails-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MInventorycountingheaderMaster } from 'src/app/models/m-inventorycountingheader-master';
import * as Rx  from 'rxjs/Rx';
import * as _ from 'lodash';
import groupBy from 'lodash/groupBy';

@Component({
  selector: 'app-inventory-counting-approval',
  templateUrl: './inventory-counting-approval.component.html',
  styleUrls: ['./inventory-counting-approval.component.css']
})
export class InventoryCountingApprovalComponent implements OnInit {
  myForm: FormGroup;
  CountryList:Array<any>;
  StoreList:Array<any>;
  InventoryList:Array<any>;
  DocumentList:Array<any>;
  PendingList:Array<any>;
  InventoryManualCountRecord:MInventoryManualCount;
  InventoryInitRecord:MInventoryInit;
  InventoryManualCountDetail:Array<MInventoryManualCount>;
  InventoryManualCountDetail1:MInventoryManualCountDetail;
  selected_Date:any;
  ExpandoObject:any;
  InventoryManualCountDetailList:any;
  InventorySystemCountDetailList:any;
  tableList:Array<any>;
  dgStockSummary:Array<any>;
  SheetName:string;
  StockQty:Number;
  CountryCode:string;
  StoreCode:string;
  PhysicalStock:Number;
  DifferenceQty:number;
  CountryID:number;
  StoreID:number;
  user_details: MUserDetails = null;
  TransactionLogList:any;
  Status:string;
  userid:number;
  documentNo:any;
  documentID:number;
  InventoryFinalize:MInventoryFinalize;
  IsTrue:boolean=false;
  
  objExpandoObjectList:Array<any> = new Array<any>();
  constructor( private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router) 
    { 
      this.getStaticValues();
      this.ClearForm();
    
    }
    
  ngOnInit(): void {
    this.GetCountryList();
  }
  ClearForm()
  {
   
    this.myForm = this.fb.group({
      StoreID: [''],
      countryID: [''],
      DocumentNo: [''],
      DocumentDate: [''],
      Remarks:['']
    });
    this.tableList=null;

  }
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;      
    }
  }
GetCountryList()
{
  this.common.showSpinner();
  this.api.getAPI("CountryMasterLookUP")
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
        this.CountryList = data.countryMasterList;
          // this.tblDataCopy = data.responseDynamicData;
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
Onchangecountry(id)
{
  this.common.showSpinner();
  this.api.getAPI("Store?countryID="+ id)
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
        this.StoreList = data.storeMasterList;
          // this.tblDataCopy = data.responseDynamicData;
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
Onchangestore(id)
{
  this.common.showSpinner();
  this.api.getAPI("InventoryCounting")
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
         this.InventoryList = data.responseDynamicData;
         Rx.Observable.from(this.InventoryList)
         .filter(p => p.status === "pending for approval")   //pending for approval
         .map(p => {
          return {
            id:p.id,
            documentNo:p.documentNo

            }
         }) 
         .toArray()
        .subscribe( d => this.PendingList = d,
           err => console.error(err),
         () => console.log("Streaming is over"));
        //  this.PendingList =  this.InventoryList.find(x => x.status == "Initialized");
         if (this.PendingList != null)
         {
           this.DocumentList= this.PendingList;
           
         }
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
OnchangeDocumentDate(documentNo)
{
  if (documentNo !="" && this.InventoryList != null)
  {
  const result = this.InventoryList.find(i => i.documentNo === documentNo);
  this.selected_Date=this.common.toYMDFormat(result.documentDate);
  }
  this.GetInitializeStock();
  if (this.InventoryInitRecord != null && this.InventoryManualCountRecord != null)
  {
    this.myForm.get('countryID').disable();
    this.myForm.get('StoreID').disable();
    this.myForm.get('DocumentNo').disable();
  }
  else
  {
    this.myForm.get('countryID').enable();
    this.myForm.get('StoreID').enable();
    this.myForm.get('DocumentNo').enable();
  }

}
GetInitializeStock()
{
  this.common.showSpinner();
  this.api.getAPI("InventoryCounting?documentno="+ this.myForm.get('DocumentNo').value)
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.InventoryInitRecord = data.responseDynamicData;
          this.InventorySystemCountDetailList = this.InventoryInitRecord.inventorySysCountList;
          this.GetInventorySummary();
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
GetInventorySummary()
{
  this.common.showSpinner();
  this.api.getAPI("InventoryCounting?documentno="+ this.myForm.get('DocumentNo').value + "&i="+ 1)
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
        // this.StoreList = data.storeMasterList;
          this.InventoryManualCountRecord = data.responseDynamicData;
              if (this.InventoryManualCountRecord != null)
                {
                  let InventoryManualCountDetailList: Array<MInventoryManualCountDetail> = new Array<MInventoryManualCountDetail>();
                  let InventorySystemCountDetailList: Array<MInventoryManualCountDetail> = new Array<MInventoryManualCountDetail>();
                       for(var objInventoryManualCountDetail of this.InventoryManualCountRecord.inventoryManualCountDetailList)
                        {
                            if (InventoryManualCountDetailList.filter(x => x.skuCode === objInventoryManualCountDetail.skuCode).length > 0)
                            {
                              // InventoryManualCountDetailList.filter(() => {  }, (x=> x.SKUCode == objInventoryManualCountDetail.skuCode)).forEach(() => {  },y=> y.StockQty=(y.StockQty+ objInventoryManualCountDetail.stockQty));
                              InventoryManualCountDetailList.filter(x => x.skuCode === objInventoryManualCountDetail.skuCode).forEach(y => y.stockQty = (y.stockQty + objInventoryManualCountDetail.stockQty));
                            }
                            else
                            {
                                InventoryManualCountDetailList.push(objInventoryManualCountDetail);
                            }
                        }
                }
                   this.InventoryManualCountDetailList=this.InventoryManualCountRecord.inventoryManualCountDetailList;
                   let GroupedList = this.InventoryManualCountRecord.inventoryManualCountDetailList.reduce((r, a) => {
                    r['Documents'] = [...r[a.sheetName] || [], a];
                    return r;
                    }, {});
                    
                    // console.log("group", GroupedList);
                    //  var GroupedList = this.InventoryManualCountRecord.inventoryManualCountDetailList.GroupBy(u => u.SheetName).Select(grp => grp.ToList()).ToList();
                    //  var GroupedList:any = groupBy(this.InventoryManualCountRecord.inventoryManualCountDetailList, p => p.SheetName);

                //     DocumentBand.Columns.Clear();
                //     foreach (var group in GroupedList)
                //     {
                //         GridColumn objColumn = new GridColumn();
                //         objColumn.FieldName = group.FirstOrDefault().SheetName.Trim(); ;
                //         objColumn.Header = group.FirstOrDefault().SheetName.Trim();
                //         objColumn.UnboundType = DevExpress.Data.UnboundColumnType.Integer;
                //         objColumn.AllowEditing = DevExpress.Utils.DefaultBoolean.False;
                //         DocumentBand.Columns.Add(objColumn);
                //     }

                //    
                // }
          
                this.GenerateStockGridList(GroupedList);
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
GenerateStockGridList(GroupedList)
{
  // inventorySysCountList
  this.tableList=new Array<any>();
  this.InventorySystemCountDetailList = this.InventoryInitRecord.inventorySysCountList;
  // this.InventoryManualCountDetailList =   this.InventoryManualCountRecord.inventoryManualCountDetailList;
    if (this.InventorySystemCountDetailList != null && this.InventorySystemCountDetailList.length > 0)
    {
        for (var objInventoryManualCountDetail of this.InventorySystemCountDetailList)
        {
           var physicalStock = 0;
            // var expando = new this.ExpandoObject;
            var tblProperty:any = {};
            var expando:any = {};
            expando.skuCode = objInventoryManualCountDetail.skuCode;
            expando.styleCode =  objInventoryManualCountDetail.styleCode;
            expando.systemQuantity = objInventoryManualCountDetail.stockQty;
          
            for (var group of GroupedList.Documents)
            {
                this.SheetName = "";
                var stockQty = 0;
                var Templst =[];
                if(group.skuCode == objInventoryManualCountDetail.skuCode)
                {
                  Templst.push(group);
                  
                }
               
                if (Templst != null && Templst.length>0)
                {
                 stockQty = Templst.reduce((x,sum) => sum + x.stockQty);
                 this.SheetName = Templst[0].sheetName;
                }
                if (this.SheetName != "")
                {
                    tblProperty.expando= expando;
                    tblProperty.SheetName= this.SheetName;
                    tblProperty.stockQty= stockQty;
                }
                else
                {
                  tblProperty.expando= expando;
                  tblProperty.SheetName= group.sheetName;
                  tblProperty.stockQty= stockQty;
                }
                physicalStock = physicalStock + stockQty;
              
            
          }
            tblProperty.expando=expando;
            tblProperty.PhysicalStock= physicalStock;
            tblProperty.DifferenceQty= physicalStock -  expando.systemQuantity;
            this.tableList.push(tblProperty);
            this.objExpandoObjectList.push(expando);
            console.log(this.tableList);
        }
        // this.dgStockSummary = objExpandoObjectList;
        // console.log(this.tableList);
        // dgStockSummary.RefreshData();
    }
}
TransactionLogDetails()
{
    this.documentNo=this.myForm.get('DocumentNo').value;
    this.CountryCode ="";
    this.StoreCode = "";
    this.CountryID=this.myForm.get('countryID').value;
    this.StoreID=this.myForm.get('StoreID').value;
    var TransLogList = new Array<MTransactionLog>();
    var CountryRecord =  this.CountryList.filter(x => x.id == this.CountryID)[0];
    var StoreRecord = this.StoreList.filter(x => x.id == this.StoreID)[0];
    var DocumentRecord=this.DocumentList.filter(x=>x.documentNo==this.documentNo)
    if (CountryRecord != null)
    {
        this.CountryCode = CountryRecord.countryCode;
    }

    if (StoreRecord != null)
    {
        this.StoreCode = StoreRecord.storeCode;
    }
    if (DocumentRecord != null)
    {
        this.documentID = StoreRecord.id;
    }

    for (this.ExpandoObject of this.objExpandoObjectList)
    {
        var expandoDict = this.ExpandoObject;
        this.DifferenceQty = expandoDict["DifferenceQty"];

        if ( this.DifferenceQty  != 0)
        {
            let objTransactionType = new MTransactionLog()
            objTransactionType.id = 0;
            objTransactionType.transactionType = "InventoryCounting";
            objTransactionType.businessDate =  new Date();
            objTransactionType.actualDateTime =  new Date();
            objTransactionType.documentID =this.documentID;
            objTransactionType.styleCode = expandoDict["styleCode"];
            objTransactionType.skuCode = expandoDict["skuCode"];
            objTransactionType.countryID = this.CountryID;
            objTransactionType.storeID = this.StoreID;

            if ( this.DifferenceQty  > 0)
            {
                objTransactionType.inQty = this.DifferenceQty;
                objTransactionType.outQty = 0;
            }
            else
            {
                objTransactionType.inQty = 0;
                objTransactionType.outQty = this.DifferenceQty;
            }

            objTransactionType.transactionPrice = 0;
            objTransactionType.currency = 0;
            objTransactionType.exchangeRate = 0;
            objTransactionType.documentPrice = 0;
            objTransactionType.userID =this.userid;
            objTransactionType.documentNo = this.documentNo;
            objTransactionType.storeID = this.StoreID;
            objTransactionType.storeCode = this.StoreCode;
            objTransactionType.countryID = this.CountryID;
            objTransactionType.countryCode = this.CountryCode;

            let TransactionType: MTransactionLog = this.TransactionLogDeepCopy(objTransactionType);
            TransLogList.push(TransactionType);
        }
    }
    this.TransactionLogList = TransLogList;

}
TransactionLogDeepCopy(objTransactionLog: MTransactionLog): MTransactionLog {
  let TempTransactionLog: MTransactionLog = new MTransactionLog();
  TempTransactionLog.transactionType = objTransactionLog.transactionType;
  TempTransactionLog.businessDate = objTransactionLog.businessDate;
  TempTransactionLog.actualDateTime = objTransactionLog.actualDateTime;
  TempTransactionLog.documentID = objTransactionLog.documentID;
  TempTransactionLog.styleCode = objTransactionLog.styleCode;
  TempTransactionLog.skuCode = objTransactionLog.skuCode;
  TempTransactionLog.countryID = objTransactionLog.countryID;
  TempTransactionLog.storeID = objTransactionLog.storeID;
  TempTransactionLog.outQty = objTransactionLog.outQty;
  TempTransactionLog.inQty = objTransactionLog.inQty;
  TempTransactionLog.transactionPrice = objTransactionLog.transactionPrice;
  TempTransactionLog.currency = objTransactionLog.currency;
  TempTransactionLog.exchangeRate = objTransactionLog.exchangeRate;
  TempTransactionLog.documentPrice = objTransactionLog.documentPrice;
  TempTransactionLog.userID = objTransactionLog.userID;
  TempTransactionLog.storeID = objTransactionLog.storeID;
  TempTransactionLog.storeCode = objTransactionLog.storeCode;
  TempTransactionLog.countryID = objTransactionLog.countryID;
  TempTransactionLog.countryCode = objTransactionLog.countryCode;
  TempTransactionLog.posCode = objTransactionLog.posCode;
  TempTransactionLog.documentNo = objTransactionLog.documentNo;
  TempTransactionLog.supplierBarCode = objTransactionLog.supplierBarCode;
  TempTransactionLog.tag_Id = objTransactionLog.tag_Id;
  return TempTransactionLog;
}
// public InventoryManualCount InventoryManualCountRecord
// {
//     get
//     {
//         return ApplicationState.GetValue<InventoryManualCount>("InventoryCounting", "InventoryManualCountRecord");
//     }
//     set
//     {

//         if (value != null)
//         {
//             List<InventoryManualCountDetail> InventoryManualCountDetailList = new List<InventoryManualCountDetail>();
//             List<InventoryManualCountDetail> InventorySystemCountDetailList = new List<InventoryManualCountDetail>();

//             if (value.InventoryManualCountDetailList != null && value.InventoryManualCountDetailList.Count > 0)
//             {
//                 foreach (var objInventoryManualCountDetail in value.InventoryManualCountDetailList)
//                 {
//                     if (InventoryManualCountDetailList.Where(x => x.SKUCode.Trim().ToUpper() == objInventoryManualCountDetail.SKUCode.Trim().ToUpper()).ToList().Count > 0)
//                     {
//                         InventoryManualCountDetailList.Where(x => x.SKUCode.Trim().ToUpper() == objInventoryManualCountDetail.SKUCode.Trim().ToUpper()).ToList().ForEach(y => y.StockQty = (y.StockQty + objInventoryManualCountDetail.StockQty));
//                     }
//                     else
//                     {
//                         InventoryManualCountDetailList.Add(objInventoryManualCountDetail);
//                     }
//                 }
//             }

//             InventorySystemCountDetailList = ApplicationState.GetValue<List<InventoryManualCountDetail>>("InventoryCounting", "InventorySystemCountDetailList");

//             var GroupedList = value.InventoryManualCountDetailList.GroupBy(u => u.SheetName).Select(grp => grp.ToList()).ToList();

//             DocumentBand.Columns.Clear();
//             foreach (var group in GroupedList)
//             {
//                 GridColumn objColumn = new GridColumn();
//                 objColumn.FieldName = group.FirstOrDefault().SheetName.Trim(); ;
//                 objColumn.Header = group.FirstOrDefault().SheetName.Trim();
//                 objColumn.UnboundType = DevExpress.Data.UnboundColumnType.Integer;
//                 objColumn.AllowEditing = DevExpress.Utils.DefaultBoolean.False;
//                 DocumentBand.Columns.Add(objColumn);
//             }

//             GenerateStockGridList(GroupedList);
//         }
//         ApplicationState.SetValue("InventoryCounting", "InventoryManualCountRecord", value);
//     }
// }
BtnApprove_Click()
{
   this.InventoryFinalize=new MInventoryFinalize();
   this.documentNo=this.myForm.get('DocumentNo').value;
   this.Status = "Completed";
   this.TransactionLogDetails();
   this.InventoryFinalize.documentNo = this.documentNo;
   this.InventoryFinalize.status=this.Status;
   this.InventoryFinalize.rARemarks=this.myForm.get('Remarks').value;
   this.InventoryFinalize.transactionLogList= this.TransactionLogList;
   this.common.showSpinner();
   this.api.postAPI("InventoryCountingApproval", this.InventoryFinalize).subscribe((data) => {
    if (data != null && data.statusCode != null && data.statusCode == 1) {
      this.common.hideSpinner();
      this.common.showMessage('success', data.displayMessage);
      this.ClearForm();
    } else {
      setTimeout(() => {
        this.common.hideSpinner();
        this.common.showMessage('error', 'Failed to Save.');
      }, this.common.time_out_delay);
    }
  })

  
}
BtnReject_Click()
{
  this.Status = "Rejected";
  // this.TransactionLogDetails();
  this.InventoryFinalize.documentNo = this.documentNo;
  this.InventoryFinalize.status=this.Status;
  this.InventoryFinalize.rARemarks=this.myForm.get('Remarks').value;
  this.InventoryFinalize.transactionLogList= this.TransactionLogList;
  this.common.showSpinner();
  this.api.postAPI("InventoryCountingApproval", this.InventoryFinalize).subscribe((data) => {
   //// .log(data);
   if (data != null && data.statusCode != null && data.statusCode == 1) {
     this.common.hideSpinner();
     //this.common.showMessage('success', 'Design Data saved successfully.');
     this.common.showMessage('success', data.displayMessage);
     this.ClearForm();
   } else {
     setTimeout(() => {
       this.common.hideSpinner();
       this.common.showMessage('error', 'Failed to Save.');
     }, this.common.time_out_delay);
   }
 })
}
BtnRefresh_Click()
{
this.ClearForm();
}
}
