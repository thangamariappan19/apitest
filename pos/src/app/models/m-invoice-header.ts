import { MInvoiceDetail } from './m-invoice-detail';
import { MPaymentDetails } from './m-payment-details';

export class MInvoiceHeader {
    constructor() { }

    // Invoice
    id?: number;
    countryID?: number;
    countryCode?: string;
    storeID?: number;
    storeCode?: string;
    posid?: number; 
    posCode?: string;
    shiftID?: number;
    shiftCode?: string;
    documentDate?: Date;
    businessDate?: Date;
    invoiceNo?: string;

    // Customer
    customerGroupID?: number;
    customerGroupCode?: string;
    customerID?: number;
    customerCode?: string;
    // customerName?: string;
    phoneNumber?: string;
    onAccountApplicable?:boolean;

    // Discount
    totalDiscountType?: string;
    totalDiscountAmount?: number;
    totalDiscountPercentage?: number;
    discountRemarks?: string;

    // Tax
    taxID?: number;
    taxCode?: string;
    taxAmount?: number;

    // Price
    appliedPriceListID?: number;
    appliedPriceListCode?: string;
    appliedCustomerSpecialPricesID?: number; // Null always

    totalQty?: number;
    subTotalAmount?: number;
    subTotalWithTaxAmount?: number;
    netAmount?: number;
    beforeRoundOffAmount?: number;
    roundOffAmount?: number;
    receivedAmount?: number;
    returnAmount?: number;
    salesStatus?: string; // ParkSale, Completed
    
    appliedPromotionID?: string;

    isCreditSale?: boolean;

    salesEmployeeID?: number;
    salesEmployeeCode?: string;
    salesEmployeeName?: string;
    salesManagerID?: number;
    salesManagerCode?: string;
    cashierID?: number;
    cashierCode?: string;

    emailSend?: boolean;
    smsSend?: boolean;

    // Return & Excange
    fromCountryID?: number;
    fromCountryCode?: string;
    fromStoreID?: number;
    fromStoreCode?: string;
    fromPosID?: number;
    fromPosCode?: string;
    mode?: string; // for return purpose

    // Exchange
    exchangeRefID?: number;
    exchangeRefCode?: string;
    exchangeQty?: number;

    // Return
    returnRefID?: number;
    returnRefCode?: string;
    returnQty?: number;

    // Sync
    isDataSyncToCountryServer?: boolean;
    isDataSyncToMainServer?: boolean;
    isDataSyncToOtherStores?: boolean;
    dataSyncToOtherStoresTime?: Date;
    countryServerSyncTime?: Date;
    mainServerSyncTime?: Date;
    syncFailedReason?: string;
    
    // Orjwan
    orjwanEntry?: boolean;
    isDataSyncToOrjwan?: boolean;
    orjwanServerSyncTime?: Date;

    active?: boolean;
    createBy?: number;
    createOn?: Date;
    updateBy?: number;
    updateOn?: Date;
    scn?: number;

    // Document Numbering 
    runningNo?: number;
    documentTypeID?: number;

    invoiceDetailList?: Array<MInvoiceDetail>;
    paymentList?: Array<MPaymentDetails>;
    // TransactionLogList


    // Coupon Columns
    couponID?: number;
    redeemCouponCode?: string;
    redeemCouponLineNo?: number;
    redeemCouponSerialCode?: string
    redeemCouponDiscountType?: string;
    redeemCouponDiscountValue?: number;
    redeemValue?: number;
    issuedCouponCode?: string;
    issuedCouponLineNo?: number;
    issuedCouponSerialCode?: string;
    customerName?: string;
    customerMobileNo?: string;

}
