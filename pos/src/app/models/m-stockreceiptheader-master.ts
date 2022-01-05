import { MStockreceiptdetailsMaster } from './m-stockreceiptdetails-master';
import { MTransactionLog } from './m-transaction-log';
import { MTagIdItemDetailsMaster } from './m-tag-id-item-details-master';
import { MBinLogDetails } from './m-bin-log-details';

export class MStockreceiptheaderMaster {
    constructor(){}

    id?:number;    
    stockRequestID?:number;    
    stockRequestDocumentNo?:string;    
    documentNo?:string;    
    documentDate?:Date;    
    createOn?:Date;    
    updateOn?:Date;    
    totalQuantity?:number;    
    type?:boolean;    
    totalReceivedQuantity?:number;    
    status?:string;    
    storeName?:string;    
    remarks?:string;     
    withOutBaseDoc?:boolean;    
    fromWarehouseCode?:string;    
    fromwarehousename?:string;    
    fromWareHouseID?:number;    
    storeID?:number;    
    fromApplication?:boolean;    
    stockReceiptDetailsList?:Array<MStockreceiptdetailsMaster>;    
    transactionLogList?:Array<MTransactionLog>;  
    binLogList?:Array<MBinLogDetails>;  
    storeCode?:string;    
    stockRequestStatus?:string;    
    dataFrom?:string;    
    isFlaged?:boolean;    
    receivedType?:string;    
    discrepancies?:number;    
    rFIDList?:Array<MTagIdItemDetailsMaster>;
    active?:boolean;
}