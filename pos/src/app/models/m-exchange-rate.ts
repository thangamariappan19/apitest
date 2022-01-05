export class MExchangeRate {
    constructor() { }
    id?: number;
    exchangeRatesCode?: string;
    exchangeRatesName?: string;
    baseCurrencyID?: number;
    baseCurrency?: string;
    targetCurrencyID?: number;
    targetCurrency?: string;
    exchangeRateDate?: Date;
    exchangeAmount?: number;
    exchangeRateslist?: Array<MExchangeRate>;
    createBy?:number;
    active?:boolean;
}
