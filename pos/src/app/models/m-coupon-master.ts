import { MCommonUtil } from './m-common-util';


export class MCouponMaster {

  storeList: MCommonUtil[];
  customerList: MCommonUtil[];
  countryName: any;
    constructor() { }
    id?: number;
    CouponCode?: string;
    Coupondescription?: string;
    IsLimitedPeriodOffer?:any;
    objTotalMasterMasterDetails?:any;
    objCouponListDetails?:Array<any>;
    CouponName?: string;
    BarCode?: string;
    Country?: string;
    country?: string;
    countryID?: number;
    CouponType?: string;
    startDate?: Date;
    endDate?: Date;
    DiscountType?: string;
    DiscountValue?: number;
    IssuableAtPOS?: boolean;
    Serial?: boolean;
    storeCommonUtilData?: Array<MCommonUtil>;
    customerCommonUtilData?: Array<MCommonUtil>;
    productTypeList?: Array<MCommonUtil>;
    // objCouponListDetails?: Array<MCommonUtil>;
   // storeList?: Array<MCommonUtil>;
   // customerList?: Array<MCommonUtil>;
   CouponDetailsCommonUtilData?: Array<MCommonUtil>;
  //  objTotalMasterMasterDetails?: Array<MCommonUtil>;
   couponList?: Array<MCommonUtil>;
    CouponSerialCode?:string;
    PhysicalStore?:string;
    Remainingamount?:number;
    Redeemedstatus?:string;
    Issuedstatus?:boolean;


    CouponStoreType: string;
     CouponCustomerType: string;
    // CreateBy?: number;
    // CreateOn?: Date;
    // UpdateBy?: number;
    // UpdateOn?: Date;
    //SCN?: number;
    Active?: boolean;
    Remarks?:string;
    couponID?: number;
    storeID?: number;
    storeName?: string;
    storeCode?: string ;
    storeGroupID?: number;
    totalMasterCommonUtilData?: Array<any>;
    documentDate?: string;
    IsExpirable?: boolean;
    MinBillAmount?: number;
    MaxNoIssue?: number;
    MaxLimit?:number;
    RedeemType? : number;
    ExpiryDays? : number;
}
