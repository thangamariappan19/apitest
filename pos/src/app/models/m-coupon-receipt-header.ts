import { MCouponReceiptDetails } from "./m-coupon-receipt-details";

export class MCouponReceiptHeader {
    id?:number;
    couponID?:number; 
    couponCode?:string; 
    currentLocation?:string;  
    fromSerialNum?:string;  
    toSerialNum?:string;  
    active?:boolean;
    couponReceiptDetailsList?:Array<MCouponReceiptDetails>;
    couponReceiptHeaderRecord:MCouponReceiptHeader;
}
