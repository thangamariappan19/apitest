import { MSalesOrderDetails } from './m-sales-order-details';
import { MSalesOrderPaymentDetails } from './m-sales-order-payment-details';

export class MSalesOrderHeader {
    constructor() { }     
    id?: number;         
    documentNo?: string;
    documentDate?: Date;         
    deliveryDate?: Date;         
    totalQty?: number;         
    pickedQty?: number;         
    totalAmount?: number;         
    discountType?: string;         
    discountValue?: number;         
    netAmount?: number;         
    orderStatus?: string;         
    paymentStatus?: string;         
    customerCode?: string;         
    salesOrderDetailsList?: Array<MSalesOrderDetails>;         
    paymentList?:Array<MSalesOrderPaymentDetails>;
}
