import { MStockreturndetailsMaster } from './m-stockreturndetails-master';
import { MTransactionLog } from './m-transaction-log';

export class MStockreturnheaderMaster {
    constructor(){}
    
    id?:number;    
    documentNo?:string;    
    documentDate?:Date;
    totalQuantity?:number;
    toWareHouseID?:number;    
    fromStoreID?:number;    
    status?:string;    
    remarks?:string;    
    toWareHouseCode?:string;    
    stockReturnDetailsList?:Array<MStockreturndetailsMaster>;    
    transactionLogList?:Array<MTransactionLog>;    
    storeCode?:string;    
    returnType?:string;
    active?:boolean;
    binCode?:string;
    
}
