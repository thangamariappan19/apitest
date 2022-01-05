import {Mwnpromotiondetails} from './m-wnpromotion-detail'

export class Mwnpromotionheader{

    constructor(){}

    id?: number;
    promotionCode?: String;
    promotionName?:String;
    startDate?: Date;
    endDate?:Date;
    pricePointID?: number;
    priceListID?: number;
    countries?:String;
    priceListCode?: string;
    uploadType?: String;
    pricePointApplicable?: boolean;
    defaultCountryID?: number;
    active?:boolean;
    scn?: number;
    createBy?: number;
    createOn?: Date;
    updateBy?: number;
    updateOn?: Date;
    isStoreSync?: boolean;
    isCountrySync?: boolean;
    WNPromotionDetailsList?: Array<Mwnpromotiondetails>   
}