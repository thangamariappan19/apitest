export class MPaymentType {
    constructor() { }

    id?: number;
    paymentCode?: string;
    paymentName?: string;
    paymentType?: string;
    countRequired?: boolean;
    countryID?: number;
    countryCode?: string;
    isCountryNeed?: boolean;
    countType?: string;
    refundable?: boolean;
    requiredManageApproval?: boolean;
    openCashDraw?: boolean;
    allowOverTender?: boolean;
    allowPartialTender?: boolean;
    paymemtValue?: number;
    totalCardValue?: number;
    remarks?: string;
    paymentImage?: string; // byte[]
    isPaymentProcesser?: boolean;
    sortOrder?: string;
    paymentReceivedType?: string;
    common?: boolean;
    order?: string;
    active?: boolean;
    createBy?:number;
    updateBy?:number;
    paymentModeID?: number;
    paymentModeCode?:string;
    transactionType?:string;
    
    // public List < PaymentTypeMasterType > PaymentImageList?:
}
