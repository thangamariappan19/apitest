import { MSalesReturnDetail } from './m-sales-return-detail';
import { MOnAccountPayment } from './m-on-account-payment';
import { MTransactionLog } from './m-transaction-log';
import { MPaymentDetails } from './m-payment-details';

export class MSalesReturnHeader {
    constructor() { }

    id?: number;
    invoiceHeaderID?: number;
    countryID?: number;
    countryCode?: string;
    countryName?: string;
    storeID?: number;
    storeCode?: string;
    storeName?: string;
    shiftID?: number;
    posid?: number;
    posCode?: string;
    posName?: string;
    cashierID?: number;
 
    documentNo?: string;
    documentDate?: Date;
    documentDate_str?: string;

    salesInvoiceNumber?: string;
    salesDate?: Date;
    salesDate_str?: string;
    applicationDate?: Date; // ???
    applicationDate_str?: string; // ???

    totalReturnQty?: number;
    totalReturnAmount?: number;
    paymentMode?: string;

    taxID?: number;
    totalTaxAmount?: number;

    returnWithOutInvoiceNo?: boolean;
    creditSales?: boolean; // how to check
    
    returnMode?: string; // ???

    runningNo?: number;

    detailID?: number; // ??? 

    salesReturnDetailList?: Array<MSalesReturnDetail>;
    onAccountPaymentRecord?: MOnAccountPayment; 
    transactionLogList?: Array<MTransactionLog>;

    salesReturnPaymentdetails?: Array<MPaymentDetails>;

    // List<SalesReturnDetail> SalesReturnDetailList?:
    // List<TransactionLog> TransactionLogList?:
    // OnAccountPayment OnAccountPaymentRecord?:

    active?: boolean;
    scn?: number;
    createBy?: number;
    createOn?: Date;
    updateBy?: number;
    updateOn?: Date;
    createdByUserName?: string;
    updatedByUserName?: string;
    isStoreSync?: boolean;
    isCountrySync?: boolean;
    appVersion?: string;
    isServerSync?: boolean;
}
