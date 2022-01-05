import { MCurrencyDetails } from './m-currency-details';

export class MCurrencyMaster {
    constructor() { }
    id?: number;
    currencyCode?: string;
    currencyName?: string;
    internationalCode?: string;
    decimalPlaces?: number;
    currencyType?: string;
    mRoundValue?: number;
    currencySymbol?: string;
    interDescription?: string;
    hundredthName?: string;
    english?: string;
    engHundredthName?: string;
    isBaseCurrency?: boolean;
    active?: boolean;
    currencyDetailsList?: Array<MCurrencyDetails>;
    viewCurrencyDetailsList?: Array<MCurrencyDetails>;
    exchangeRate?: number;
    /*valueDate?: date;
    displayDate?: date;*/
}
