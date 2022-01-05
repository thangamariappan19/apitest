export class MCustomer {
    constructor() { }
    
    id?: number;
    baseID?: number;
    customerCode?: string;
    customerName?: string;
    phoneNumber?: string;
    alterPhoneNumber?: string;
    customerGroupID?: number;
    buildingAndBlockNo?: string;
    streetName?: string;
    areaName1?: string;
    areaName2?: string;
    city?: string;
    stateID?: number;
    countryID?: number;
    email?: string;
    dob?: Date;
    gender?: string;
    groupName?: string;
    stateName?: string;
    countryName?: string;
    remarks?: string;
    creditAmount?: number;
    isDefaultCustomer?: boolean;
    customerGroupCode?: string;
    stateCode?: string;
    countryCode?: string;
    onAccountApplicable?: boolean;
    active?: boolean;
    scn?: number;
    createBy?: number;
    createOn?: Date;
    updateBy?: number;
    updateOn?: Date;
    createdByUserName?: string;
    updatedByUserName?: string;
    isStoreSync?: boolean;
    isCountrySync?: boolean;
    appVersion?: string;
    isServerSync?: boolean;
    documentNumberingID?:number;
    documentTypeID?:number;
    storeId?:number;
    customerImage?:any;
    pincode?:string;
    shippingAddress1?:string;
    shippingAddress2?:string;
    shippingPhoneNumber?:string;
    shippingStateID?:number;
    shippingStateCode?:string;
    shippingStateName?:string;
    shippingCity?:string;
    shippingPincode?:string;
    shippingCountryID?:number;
    shippingCountryCode?:string;
    storeID?:number;
    isoCode?:string;
    addressIsoCode?:string;
    shippingIsoCode?:string;
    billingPhoneNumber?:string;

    // << New Fields
    lastName?:string;
    subGroupID?:number;
    subGroupCode?:string;
    paymentTermsDays ?:string;
    creditDays ?:string;
    isLoyalty ?:boolean;
    isTaxExempt ?:boolean;
    loyaltyID ?:string;
    loyaltyPlan ?:string;
    // New Fields >>
}
