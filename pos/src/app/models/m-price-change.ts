export class MPriceChange {
    constructor() { }

    id?: number;
    documentNo?: string;
    documentDate?: Date;
    priceChangeDate?: Date;
    priceChangeType?: string;
    multipleCountry?: boolean;
    sourceCountryID?: number;
    sourceCountryCode?: string;
    status?: string;
    remarks?: string;
    isPriceUpdated?: boolean;
    isInProgress?: boolean;
    isNotApplicable?: boolean;
    active?: boolean;
    priceChangeDetailsList?: Array<MPriceChangeDetails>;
    priceChangeCountriesList?: Array<MPriceChangeCountries>;
}
export class MPriceChangeCountries {
    constructor() { }

    id?: number;
    headerID?: number;
    select?: boolean;
    countryID?: number;
    countryCode?: string;
    countryName?: string;
    pricePointApplicable?: boolean;
    currencyID?: number;
    currencyCode?: string;
}
export class MPriceChangeDetails {
    constructor() { }

    id?: number;
    headerID?: number;
    styleID?: number;
    styleCode?: string;
    brandID?: number;
    brandCode?: string;
    brandName?: string;
    countryID?: number;
    countryCode?: string;
    currencyID?: number;
    priceListID?: number;
    currencyCode?: string;
    priceListCode?: string;
    pricePointApplicable?: boolean;
    oldPrice?: number;
    newPrice?: number;
    status?: string;
    remarks?: string;
    style_serialNo?: number;
    baseCurrencyID?:number;
    priceType?:string;
}
