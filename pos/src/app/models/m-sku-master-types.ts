import { MStylePricing } from './m-style-pricing';
import { MItemImageMaster } from './m-item-image-master';

export class MSkuMasterTypes {
    constructor() { }

    id?: number;
    skuid?: number;
    serialNo?: number;
    skuCode?: string;
    barCode?: string;
    styleCode?: string;
    styleName?: string;
    designCode?: string;
    skuName?: string;
    styleID?: number;
    designID?: number;
    brandID?: number;
    subBrandID?: number;
    collectionID?: number;
    armadaCollectionID?: number;
    divisionID?: number;
    productGroupID?: number;
    productSubGroupID?: number;
    seasonID?: number;
    yearID?: number;
    productLineID?: number;
    styleStatusID?: number;
    designerID?: number;
    purchasePriceListID?: number;
    purchasePrice?: number;
    purchaseCurrencyID?: number;
    rrpPrice?: number;
    rrpCurrencyID?: number;
    exchangeRate?: number;

    remarks?: string;
    scaleID?: number;
    salesPriceListID?: number;
    salesPrice?: number;
    colorID?: number;
    scaleDetailMasterID?: number;
    segamentationID?: number;
    sizeID?: number;

    sizeCode?: string;
    colorCode?: string;
    colorName?: string;
    sizeName?: string;
    collectionName?: string;
    divisionName?: string;
    scaleName?: string;
    brandName?: string;
    afSegamationName?: string;
    year?: string;
    seasonName?: string;
    productGroupName?: string;
    productSubGroupName?: string;
    subBrandName?: string;

    promotionApplied?: boolean;
    shortDescription?: string;
    description?: string;
    brandShortCode?: string;
    origin?: string;
    defaultPrice?: number;
    supplierBarcode?: string;
    arabicSKU?: string;
    skuImage?: string;
    skuImageSource?: string; //dynamic
    priceListID?: string;
    salePriceListID?: number;
    baseEntry?: string;

    barCodeRunningNo?: number;
    barCodeID?: number;
    stylePrice?: number;
    useSeperator?: string;
    tag_Id?: string;
    isNonTrading?: boolean;
    brandCode?: string;
    subBrandCode?: string;
    stock?: number;
    quantity?: number;

    skuMasterTypesRecord?: Array<MSkuMasterTypes>;
    importExcelList?: Array<MSkuMasterTypes>;
    stylePricingList?: Array<MStylePricing>;
    itemImageMasterList?: Array<MItemImageMaster>;

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
    collectionCode?:string;
    armadaCollectionCode?:string;
    divisionCode?:string;
    productGroupCode?:string;
    seasonCode?:string;
    yearCode?:string;
    productLineCode?:string;
    styleStatusCode?:string;
    designerCode?:string;
    purchasePriceListCode?:string;
    purchasePriceCurrencyCode?:string;
    rrpCurrencyCode?:string;
    scaleCode?:string;
    segmentationCode?:string;
    productSubGroupCode?:string;
    productCode?:string;

}
