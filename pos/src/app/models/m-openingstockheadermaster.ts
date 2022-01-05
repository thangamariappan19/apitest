import { MOpeningstockdetailsMaster } from './m-openingstockdetails-master';
import { MTransactionLog } from './m-transaction-log';

export class MOpeningstockheadermaster {
    constructor(){}
    
        id?:number;
        documentNo?:string;
        documentDate?:Date;
        totalQuantity?:number;
        type?:boolean;  
        storeName?:string;
        remarks?:string; 
        storeID?:number;
        openingStockDetailsList?:Array<MOpeningstockdetailsMaster>;
        transactionLogList?:Array<MTransactionLog>;
        storeCode?:string;   
        active?:boolean;
        createBy?:number;
        countryID?:number;
        countryCode?:string;   
}
