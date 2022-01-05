export class MStylePricing {
    constructor() { }

    id?: number;
    skuid?: number;
    skuCode?: string;
    priceListID?: number;
    priceListCurrency?: number;
    price?: number;
    isManualEntry?: boolean;
    countryID?: number;
    priceCategory?: string;
    priceType?: string;
    styleCode?: string;

    importStylePricingExcelList?: Array<MStylePricing>;

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
