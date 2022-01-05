import { MTransactionLog } from './m-transaction-log';
import { MStockadjustmentdetailsMaster } from './m-stockadjustmentdetails-master';

export class MStockadjustmentheaderMaster {
    constructor(){}
    
        id?:number;        
        documentNumber?:string;        
        documentDate?:Date;        
        styleID?:number;        
        styleCode?:string;        
        stockAdjustmentDetailList?:Array<MStockadjustmentdetailsMaster>;        
        storeID?:number;        
        storeCode?:string;        
        transactionLogList?:Array<MTransactionLog>;
        createBy?:number;
        active?:boolean;
        countryID?:number;
        countryCode?:string;
}
