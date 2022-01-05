export class MOnAccountInvoiceWisePayment {
    constructor() { }

    id?: number;
    onAccountPaymentID?: number;
    slNo?: number;
    businessDate?: Date;
    purchaseStoreID?: number;
    purchaseStoreCode?: string;
    invoiceNo?: string;
    customerCode?: string;
    billAmount?: number;
    cashPaid?: number;
    cardPaid?: number;
    totalPaid?: number;
    pendingAmount?: number;
    isSelect?: boolean;
    closeBill?: boolean;
    discountAmount?: number;
    paidAmount?: number;
    storeID?: number;
    storeCode?: string;
    remarks?: string;
}
