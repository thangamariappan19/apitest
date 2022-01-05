import { MSkuMasterTypes } from './m-sku-master-types';
import { MTransactionLog } from './m-transaction-log';

export class MOpeningstockdetailsMaster {

    constructor(){}
    
        id?:number;       
        serialNo?:number;        
        openingStockDetailID?:number;        
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
        fromStoreCode?:string;        
        quantity?:number;        
        remarks?:string;        
        brand?:string;        
        color?:string;        
        size?:string;        
        sKUMasterList?:Array<MSkuMasterTypes>;        
        openingStockDetailssList?:Array<MOpeningstockdetailsMaster>;
        transactionloglist?:Array<MTransactionLog>;
        active?:boolean;
        createBy?:number;
}
