import { MCommonUtil } from './m-common-util';

export class MPromotionMaster {
    constructor() { }
    id?: number;
    promotionPriorityID?: number;
    promotionCode?: string;
    pricelistcode?: string;
    promotionName?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
    minBillAmount?: number;
    minQuantity?: number;
    discount?: string;
    discountValue?: number;
    allowMultiPromotion?: boolean;
    lowestValue?: boolean;
    lowestValueWithGroup?: boolean;
    exculdeDiscountItems?: boolean;
    prompt?: boolean;
    active?: boolean;
    color?: string;
    priceListID?: number;
    buyOptionalCount?: number;
    getOptionalCount?: number;
    getItematFixedPrice?: number;
    storeList?: Array<MCommonUtil>;
    customerList?: Array<MCommonUtil>;
    productTypeList?: Array<MCommonUtil>;
    buyItemTypeList?: Array<MCommonUtil>;
    getItemTypeList?: Array<MCommonUtil>;
    priorityNo?: number;
    promotionType?: string;
    appliedType?: string;
    applicablePromoList?: Array<MApplicablePromo>;
    minPromotionQty?:number;
    maxGiftPerInvoice?:number;
    giftQuantity?:number;
    giftBillAmount?:number;
    multiApplyForReceipt?:boolean;
    buyItemOptionalAmount?:number;
}
export class MApplicablePromo {
    constructor() { }
    promotionCode?: string;
    brandID?: number;
    skuCode?: string;
    skipRows?: number;
    qty?: number;
    amount?: number;
    applicableTimes?: number;
    priorityNo?: number;
    itemType?: string;
    itemDocumentID?: number;
    listType?: string;
    discountType?: string;
    discountValue?: number;
}
