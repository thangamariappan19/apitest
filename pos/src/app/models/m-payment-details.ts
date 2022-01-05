export class MPaymentDetails {
    constructor() { }

    id?: number;
    invoiceHeaderID?: number;
    invoiceNumber?: string;

    slNo?: number;
    businessDate?: Date;
    fromCountryID?: number;
    fromStoreID?: number;
    mode?: string; // Cash / Card
    payCurrencyID?: number; 
    payCurrency?: string; // Currency Code
    changeCurrency?: string;
    changeCurrencyID?: number;
    
    
    baseAmount?: number; // [Amount to Pay]
    receivedamount?: number;
    returnAmount?: number;
    balanceAmountToBePay?: number;

    // Card Details
    cardNo?: string;
    cardHolder?: string;
    approveNo?: string;
        
    // Order Fullfillment
    fromSalesOrder?: boolean; // [OPTIONAL]
    isPaymentProcesser?: boolean; // [True then card will be swipped else card details will be entered]
    cardType2?: string; // Visa (or) Master

    // Credit Sales
    onAccountReceiveAmount?: number;
    pendingAmount?: number;
    onAcPaymentCompleted?: boolean;
}
