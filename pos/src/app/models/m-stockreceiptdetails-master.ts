import { MSkuMasterTypes } from './m-sku-master-types';

export class MStockreceiptdetailsMaster {
    constructor(){}
    
        id?:number;        
        headerID?:number;        
        applicationDate?:Date;        
        documentDate?:Date;        
        styleCode?:string;        
        serialNo?:number;        
        quantity?:number;        
        skuID?:number;        
        skuName?:string;        
        skuCode?:string;        
        fromStoreID?:number;        
        oldReceivedQuantity?:number;        
        transferQuantity?:number;        
        requestQuantity?:number;        
        receivedQuantity?:number;        
        differenceQuantity?:number;        
        remarks?:string;        
        brand?:string;        
        color?:string;        
        fromApplication?:boolean;        
        size?:string;        
        barCode?:string;        
        sKUMasterList?:Array<MSkuMasterTypes>;        
        stockReceiptDetailID?:number;        
        status?:string;        
        stkReqStatus?:string;        
        documentNo?:string;        
        isFlaged?:boolean;        
        tag_Id?:string;        
        discrepancies?:number;
        active?:boolean;
}
