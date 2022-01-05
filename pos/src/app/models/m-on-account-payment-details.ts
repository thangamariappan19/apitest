export class MOnAccountPaymentDetails {
    constructor() { }

    id?: number;
    onAccountPaymentID?: number;
    storeID?: number;
    storeCode?: string;
    paymentType?: string;
    paymentCurrency?: string;
    changeCurrency?: string;
    cardType?: string;
    cardNumber?: string;
    cardHolderName?: string;
    approvalNumber?: string;
    receivedAmount?: number;
    remarks?: string;
}
