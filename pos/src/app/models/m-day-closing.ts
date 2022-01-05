export class MDayClosing {
    constructor() { }
    id?: number;
    storeID?: number;
    businessDate?: Date;
    status?: string;
    startingTime?: Date;
    closingTime?: Date;
    countryID?: number;
    countryCode?: string;
    storeCode?: string;
    shiftCode?: string;
    shiftInUserCode?: string;
    posCode?: string;
    shiftInOutUserCode?: string;
    posid?: number;
    shiftInUserID?: number;
    shiftOutUserID?: number;
    shiftID?: number;
    amount?: number;

    businessDateStr?: string;
    startingTimeStr?: string;

    buisnessDate?: Date;
    buisnessDateStr?: string;

    defaultCustomerCode?: string;
    defaultCustomerGroupCode?: string;
    defaultCustomerGroupID?: number;
    defaultCustomerID?: number;
    defaultCustomerName?: string;
    defaultPhoneNumber?: string;
    printerDeviceName?:string;
}
