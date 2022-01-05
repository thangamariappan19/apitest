import { MTransactionLog } from './m-transaction-log';
import { MSalesExchangeDetails } from './m-sales-exchange-details';

export class MSalesExchangeHeader {
    
    constructor() { }

    id?: number;
    invoiceHeaderID?: number;
    documentNo?: string;
    documentDate?: Date;
    salesInvoiceNumber?: string;
    salesDate?: Date;
    applicationDate?: Date;
    countryID?: number;
    countryCode?: string;
    countryName?: string;
    storeID?: number;
    storeCode?: string;
    storeName?: string;
    posid?: number;
    posCode?: string;
    posName?: string;
    cashierID?: number;
    creditSales?: boolean;

    exchangeWithOutInvoiceNo?: boolean;
    totalExchangeQty?: number;
    
    exchangeMode?: string;
    detailID?: number;
    runningNo?: number;
 
    salesExchangeDetailList?: Array<MSalesExchangeDetails>;
    returnExchangeDetailList?: Array<MSalesExchangeDetails>
    transactionLogList?: Array<MTransactionLog>;

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
