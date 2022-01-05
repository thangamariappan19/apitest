export class MSalesOrderPaymentDetails {
    constructor() { }      
    id?: number;
    salesOrderID?: number;     
    salesOrderDocumentNo    
    documentDate?: Date;     
    paymentCurrency?: string;    
    paymentMode?: string;    
    totalAmount?: number;     
    paidAmount?: number;     
    balanceAmountToPay?: number;     
    cardType?: string;    
    cardHolderName?: string;    
    approvalNo?: string;   
    cardNumber?: string;
}
