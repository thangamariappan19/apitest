import { MTransactionLog } from './m-transaction-log';
import { MNontradingstockdetailsMaster } from './m-nontradingstockdetails-master';

export class MNontradingstockheaderMaster {
    constructor(){}
    
    id?:number;    
    documentNo?:string;    
    documentDate?:Date;    
    countryID?:number;    
    storeID?:number;    
    employeeID?:number;    
    employeeName?:string;    
    employeeCode?:string;    
    receivedQty?:number;    
    returnQty?:number;    
    receivedType?:string;    
    transactionType?:string;        
    sKUCode?:string;    
    barCode?:string;    
    storeCode?:string;
    nonTradingStockDetailsList?:Array<MNontradingstockdetailsMaster>;    
    transactionLogList?:Array<MTransactionLog>;    
    refDocumentNo?:string;    
    dummySerialNo?:number;    
    runningNo?:number;    
    documentNumberingID?:number;
    active?:boolean;
}
