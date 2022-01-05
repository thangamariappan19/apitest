export class MPricePoint {
    constructor() { }
    
    id?:number;        
    pricePointCode?:string;        
    pricePointName?:string;        
    brandID?:number;        
    baseCurrencyID?:number;        
    brandCode?:string;        
    baseCurrencyCode?:string;        
    remarks?:string;        
    brandName?:string;        
    currencyName?:string;
    pricePointRangeList?: Array<MPricePointRange>;      
    active?:boolean;  
    pricePointList?:Array<MPricePoint>;
    createBy?:number;
}
export class MPricePointRange {
    constructor() { }
    
   id?:number;    
   pricePointID?:number;    
   rangeFrom?:number;    
   rangeTo?:number;    
   currencyID?:number;    
   internationalCode?:string;    
   price?:number;
   pricePointCode?:string;
   brandCode?:string;
}
