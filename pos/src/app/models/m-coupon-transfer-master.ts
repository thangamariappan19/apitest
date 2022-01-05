import { MCouponReceiptDetails } from "./m-coupon-receipt-details";
import { MCouponTransferDetails } from "./m-coupon-transfer-details";

export class MCouponTransferMaster {
    constructor() { }
    id?:number;
    couponID?:number;
    couponCode ?:string;
    fromCountryID?:number;
    fromCountryCode:string;
    toLocation ?:string;
    fromSerialNum ?:string;
    toSerialNum ?:string;
    active?:boolean;
    toStoreID?:number;
    toStoreCode?:string;
    fromloaction?:string;
    couponReceiptDetailsList:Array<MCouponReceiptDetails>;
    couponTransferDetailsList:Array<MCouponTransferDetails>;
    couponTransferRecord:MCouponTransferMaster;
}