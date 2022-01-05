export class MCouponTransaction {
    constructor() { }
    id?:number;
    couponSerialCode?:string; 
    issuedStatus?:boolean;
    physicalStore?:string;
    remainingAmount?:string;
    redeemedStatus ?:boolean;
    isSaved ?:boolean;
    toStore ?:string;
    couponTransferHeaderID ?:number;
    couponID?:number;
    couponCode?:string;
    fromLocation?:string;
    transactionDate?:string;
    documentID?:number;
    couponTransactionList:Array<MCouponTransaction>;
   
}