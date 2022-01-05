export class MSalesExchangeDetails {
    constructor() { }

    id?: number;
    documentNo?: string;
    salesExchangeID?: number;
    salesInvoiceNumber?: string;
    invoiceHeaderID?: number;
    invoiceDetailID?: number;
    invoiceSerialNo?: number;
    invoiceType?: string;
    creditSales?: boolean;
    countryID?: number;
    countryCode?: string;
    storeID?: number;
    storeCode?: string;
    posid?: number;
    posCode?: string;

    taxID?: number;
    taxAmount?: number;

    tag_Id?: string;
    skuid?: number;
    skuCode?: string;
    styleCode?: string;
    qty?: number;
    sellingPricePerQty?: number;

    isReturned?: boolean;
    returnQty?: number;

    isExchange?: boolean;
    exchangeQty?: number;
    exchangeSKU?: string;
    exchangeRemarks?: string;

    isExchanged?: boolean;
    exchangedQty?: number; // Exisiting Exchange Qty
    exchangedSKU?: string;
    newExchangeQty?: number;

    enableCell?: boolean;
    modifiedSalesEmployee?: string;
    modifiedSalesManager?: string;

    isDataSyncToCountryServer?: boolean;
    isDataSyncToMainServer?: boolean;
    countryServerSyncTime?: Date;
    mainServerSyncTime?: Date;
    syncFailedReason?: string;

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

