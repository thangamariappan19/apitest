import { DecimalPipe } from '@angular/common';

export class MPricelistMaster {
  
    constructor() {}
         ID?:number;
         PriceListCode?:string;        
         PriceListName?:string;
         Remarks?:string;
         PriceListCurrencyType?:number;
         BasePriceListID?:number;
         ConversionFactore?:number;
         CurrencyName?:string;
         BaseCurrency1?:string;
         PriceCategory?:string;
         PriceType?:string;
         Price?:number;
         CountryID?:number;
         CountryCode?:string;
         active?:boolean;
}
