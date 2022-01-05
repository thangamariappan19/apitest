import { MTransactionLog } from "./m-transaction-log";

export class MInventorycountingdetailsMaster {
        id?:number;
        inventoryCountingID?:number;        
        applicationDate?:Date;        
        documentDate?:Date;        
        sKUID?:number;        
        sKUCode?:string;        
        barCode?:string;        
        rFID?:string;        
        styleCode?:string;        
        sKUName?:string;        
        storeID?:number;        
        systemQuantity?:number;        
        physicalQuantity?:number;         
        differenceQuantity?:number;        
        remarks?:string;        
        brandCode?:string;        
        colorCode?:string;        
        sizeCode?:string;        
        storeName?:string;
        active?:boolean;
}
export class MSystemStock
{
    inventoryManualCountRecord:MInventoryInit;
    runningNo?:number;
    documentNumberingID?:number;
}

    export class MInventoryInit 
    {
           id ?:number; 
           storeID ?:number; 
           documentNo ?:string;        
           documentDate?:string;        
           remarks ?:string;        
           postingDone ?:boolean;        
           status ?:string;        
           approvedBy ?:number; 
           postingDate ?:string;        
           inventorySysCountList:Array<MInventorySysCount>;
    }
export class MInventorySysCount 
{
    
   id ?:Number;
   inventoryInitID ?:Number;
   skuCode?:string;   
   skuName ?:string; 
   barCode ?:string; 
   supplierBarCode ?:string;
   styleCode?:string;
   styleName ?:string;
   brandCode?:string;
   colorCode?:string;
   sizeCode?:string;
   stockQty ?:number;
   rrpPrice?:Number;
   salesPrice ?:Number;
}
export class MInventoryManualCount 
{
      id ?:Number;
      storeID ?:Number;
      inventoryInitID  ?:Number;
      documentNo?:string;
      documentDate ?:string;
      countingType?:string;
      inventoryManualCountDetailList:Array<MInventoryManualCountDetail>;

}
export class MInventoryManualCountDetail
{
    id ?:Number;
    inventoryManualCountID ?:Number;
    storeID ?:Number;
    locationID ?:Number;
    sheetName ?:string;
    barCode ?:string;
    skuCode ?:string;
    styleCode ?:string;
    stockQty ?:number;

}
export class MInventoryFinalize{
    documentNo?:string;
    status?:string;
    rARemarks?:string;
    transactionLogList:Array<MTransactionLog>;
}
export class MInventoryManualStock{
    inventoryManualCountRecord:MInventoryManualCount;
    status?:string;
}
export class MExcelSKU
{
    barCode?:string;
    stockQty?:number;
    SKUCode ?:string;
}

