//ng g class models/m_invoice_detail --skipTests=true
import { Deserializable } from './deserializable'
import { MPaymentDetails } from './m-payment-details';

export class MInvoiceDetail { //implements Deserializable {
    constructor() { }

    id?: number;
    invoiceHeaderID?: number;
    invoiceNo?: string;
    countryID?: number;
    countryCode?: string;
    storeID?: number;
    storeCode?: string;
    posid?: number;
    posCode?: string;
    invoiceDetailID?: number; // MISSING FIELD

    billNo?: string; // MISSING FIELD
    invoiceType?: string; // MISSING FIELD
    invoiceDate?: Date; // MISSING FIELD
    customerCode?: string;   // MISSING FIELD
    customerName?: string; // MISSING FIELD   

    // Serial No
    serialNo?: number;

    // RFID
    tag_Id?: string;

    // Item
    skuid?: number;
    skuCode?: string;
    styleCode?: string; // MISSING FIELD
    subBrandName?: string; // MISSING FIELD
    skuImage?: string; // MISSING FIELD
    brandID?: number;

    barCode?:string; // Temp field
    
    subBrandID?: number;
    
    category?: number;
    linkedSrlNo?: number; // MISSING FIELD

    // quantity
    // qty: { type: number };
    qty?: number;
    dummyQty?: number; // MISSING FIELD
    dummyPrice?: number; // MISSING FIELD


    // discount
    discountType?: string;
    discountAmount?: number;

    // Other Discounts ??? [LOGIC]
    discountRemarks?: string;
    familyDiscountAmount?: number;
    employeeDiscountAmount?: number;
    employeeDiscountID?: number;
    singleDiscountAmount?: number; // MISSING FIELD
    specialDiscountType?: string; // MISSING FIELD

    // Promo [NOT IMPLEMENTED]
    specialPromoDiscount?: number;
    specialPromoDiscountPercentage?: number;
    specialPromoDiscountType?: string;
    promoGroupID?: number;

    // Promotion
    appliedPromotionID?: string;
    promotionAmount?: number;
    type?: string; // item or Promotion
    promotionName?: string; // MISSING FIELD
    promtionApplied?: boolean; // MISSING FIELD
    isPromoExcludeItem?: boolean; // MISSING FIELD
    isFreeItem?: boolean; // MISSING FIELD

    // Fields necessary for applying promotion
    afSegamationName?: string;
    year?: string;
    brandCode?: string;
    subBrandCode?: string;
    seasonName?: string;
    productGroupName?: string;

    temp_color?: string;
    temp_isGetItem?: boolean;
    temp_isBuyItem?: boolean;
    temp_promotion_id?: number;
    temp_buyItemType?: string;
    temp_buyItemValue?: string;
    temp_getItemType?: string;
    temp_getItemValue?: string;
    temp_promotion_type?: string;
    temp_discount_excluded?: boolean;

    temp_getDisType?: string;
    temp_getDisVal?: number;
    
    // Tax
    taxAmount?: number;
    taxID?: number;
    taxCode?: string;

    // Price & Total ??? [CALCULATION]
    appliedPriceListID?: string;
    appliedPriceListCode?: string;
    price?: number; // based on sku code & appliedPriceListID, get it from stylePricing
    appliedCustomerSpecialPricesID?: string;
    sellingPrice?: number;
    sellingLineTotal?: number;
    lineTotal?: number;

    netAmount?: number; // MISSING FIELD

    // Applied on Exchange / Return
    fromCountryID?: number;
    fromStoreID?: number;
    fromCountryCode?: string;
    fromStoreCode?: string;

    // Exchange
    isExchanged?: boolean;
    exchangeRefID?: number;
    exchangeQty?: number;
    exchangeRefCode?: string;
    oldExchangeQty?: number; // MISSING FIELD
    exchangeRemarks?: string; // MISSING FIELD
    exchangedSKU?: string; // MISSING FIELD
    isAlreadyExchanges?:boolean;

    // Return
    isReturned?: boolean;
    returnRefID?: number;
    returnQty?: number;
    returnRefCode?: string;
    salesReturnID?: number; // MISSING FIELD
    returnAmount?: number; // MISSING FIELD
    oldReturnQty?: number; // MISSING FIELD
    returnRemarks?: string; // MISSING FIELD
    returnedSKU?: string; // MISSING FIELD

    // Cost Price ???
    costPriceKD?: number;
    costPrice?: number;

    // Sync & other details [ALWAYS NULL]
    salesStatus?: boolean;
    modifiedSalesEmployee?: string;
    modifiedSalesManager?: string;
    modifiedInvoiceDate?: Date;
    isDataSyncToCountryServer?: boolean;
    isDataSyncToMainServer?: boolean;
    countryServerSyncTime?: Date;
    mainServerSyncTime?: Date;
    syncFailedReason?: string;
    active?: boolean;
    createBy?: number;
    createOn?: Date;
    updateBy?: number;
    updateOn?: Date;
    scn?: number;
    
    isRecordVisible?: boolean; // MISSING FIELD
    paymentList?: Array<MPaymentDetails>; // MISSING FIELD
    isCombo?:boolean;
    isHeader?:boolean;
    comboGroupID?:number;
    productGroupID?:number;
       
    isGift?:boolean;
    styleSegmentationID?:number;
    yearID?:number;
    seasonID?:number;
    productSubGroupID?:number;
    styleID?:number;
}
