export class MCommonUtil {
    constructor() { }
    PromotionHeaderID?: number;
    id?: number;
    typeID?: number;
    typeName?: string;
    documentID?: number;
    documentCode?: string;
    documentName?: string;
    styleCode?: string;
    quantity?: number;
    getQuantity?: number;
    buyQuantity?: number;
    amount?: number;
    discountValue?: number;
    discountType?: string;
    prompt?: boolean;
    active?: boolean;
    updateFlag?: boolean;
    promotionFrom?: string;
    baseLookUpList?: Array<MBaseLookUp>;
    lookUpList?: Array<MLookUp>;
    discountTypeLookupList?: Array<MBaseLookUp>;
    styleCodeLookUp?: Array<MStyleCodeLookUp>;
    isMandatory?: boolean;
    customerCode?:number;
    customerName?:string;
    phoneNumber?:number;

}
export class MBaseLookUp {
    constructor() { }
    typeID?: number;
    typeName?: string;
}
export class MStyleCodeLookUp {
    constructor() { }
    styleID?: number;
    styleCode?: string;
}
export class MLookUp {
    constructor() { }
    ID?: number;
    typeID?: number;
    typeName?: string;
    documentID?: number;
    documentCode?: string;
    documentName?: string;
    active?: boolean;
}
