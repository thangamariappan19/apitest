import { MSkuMasterTypes } from './m-sku-master-types';

export class MStockrequestMaster {
    constructor(){}
    
        id?:number;        
        serialNo?:number;        
        stockRequestDetailID?:number;       
        headerID?:number;        
        applicationDate?:Date; 
        documentNo?:string;      
        documentDate?:Date;        
        sKUID?:number;        
        sKUCode?:string;        
        styleCode?:string;        
        sKUName?:string;        
        barCode?:string;        
        fromStoreID?:number;        
        quantity?:number;        
        remarks?:string;        
        brand?:string;        
        color?:string;        
        size?:string;        
        sKUMasterList?:Array<MSkuMasterTypes>;               
        transferQuantity?:number;        
        requestQuantity?:number;        
        receivedQuantity?:number;        
        differenceQuantity?:number;        
        oldReceivedQuantity?:number;        
        docNum?:string;        
        basDocNum?:string;        
        stkRecDocNum?:string;        
        wMSReqKey?:number;        
        toLocation?:string;        
        fromLocation?:string;
        status?:string;
        active?:boolean;
}
