export class MTransactionLog {
    constructor() { }

    id?: number;
    transactionType?: string;

    businessDate?: Date;
    actualDateTime?: Date;

    documentID?: number;
    documentNo?: string;
    documentLineID?: number;

    countryID?: number;
    countryCode?: string;
    storeID?: number;
    storeCode?: string;
    storeName?: string;

    posCode?: string;

    styleCode?: string;
    colorCode?: string;
    colorName?: string;
    sizeCode?: string;
    barCode?: string;
    sizeName?: string;
    visualOrder?: string;
    brandCode?: string;
    brandName?: string;
    supplierBarCode?: string;
    tag_Id?: string;
    skuImageSource?: string; //dynamic
    skuCode?: string;
    skuName?: string;

    inQty?: number;
    outQty?: number;

    transactionPrice?: number;
    currency?: number;
    exchangeRate?: number;
    documentPrice?: number;

    userID?: number;

    stockQty?: number;

    //  List<TransactionLog> TransactionLogList?:
}

