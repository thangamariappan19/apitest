export class MSalesReturnDetail {
    constructor() { }

    id?: number;
    salesReturnID?: number;
    invoiceDetailID?: number;
    storeID?: number;
    storeCode?: string;
    posid?: number;
    posCode?: string;
    cashierID?: number;
    countryID?: number;
    countryCode?: string;
    fromCountryID?: number;
    fromStoreID?: number;

    serialNo?: number;

    tag_Id?: string;
    skuid?: number;
    styleCode?: string;
    skuCode?: string;
    itemCode?: string;

    taxID?: number;
    taxAmount?: number;

    soldQty?: number;
    returnQty?: number;
    returnAmount?: number;

    // No field for exchanged items

    // Sync
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
