export class MDenominationForShiftOutType {
    id?:number;
    serialNo?:number;
    currencyCode?:string;
    currencyValue?:number;
    paymentType?:string;
    paymemtValue ?:number;
    cardType ?:string;
    totalValue ?:number;
    valueCount?:number;
    lookUpListForDenomination?:Array<any>;
   
}
export class MDenominationForShiftoutTypeHeader
{
    id?:number;
    shifLogId ?:number;
    storeCode ?:string;
    posCode ?:string;
    shiftCode?:string;
    shiftInAmount?:number;
    shiftOutAmount ?:number;
    remarks?:string;
    totalValueCount ?:number;
    totalCardValue?:number;
    grandTotalValue?:number;
}
export class MDenominationData
{
   
    denominationForShiftOutTypeList?:Array<MDenominationForShiftOutType>;
    denominationForShiftoutTypeHeader?:MDenominationForShiftoutTypeHeader;
    receivedDenominationData?:any;
    paymentTypeMasterTypeList?:Array<any>;
}