import { MOnAccountPaymentDetails } from './m-on-account-payment-details';
import { MOnAccountInvoiceWisePayment } from './m-on-account-invoice-wise-payment';

export class MOnAccountPayment {

    constructor() { }

    id?: number;

    storeID?: number;
    storeCode?: string;
    customerCode?: string;
    //invoiceNo?: string;
    billingAmount?: number;
    receivedAmount?: number;
    returnAmount?: number;

    paymentDate?: Date;
    remarks?: string;

    onAccountPaymentDetailsList?: Array<MOnAccountPaymentDetails>;
    onAcInvoiceWisePaymentList?: Array<MOnAccountInvoiceWisePayment>;
    onAccountPaymentRecord?: MOnAccountPayment;
}
