import { MPricelistMaster } from "./m-pricelist-master";
import { MSkuMasterTypes } from "./m-sku-master-types";
import { MUserDetails } from "./m-user-details";

export class MComboMaster 
{
       
    id?:number;
    // storeid?:number;
    // SKUID?:number;
    documentDate?:string;
    productBarcode?:string;
    productSKUCode?:string;
    active?:boolean;
    // SKUBarcode?:number;
    // createdBy?:number;
    productStylecode?:string;  
    updateBy?:number;      
    // SKUCode?:string;        
    // styleCode?:string;        
    // SKUName?:string;        
    // priceListCode?:string;
    // priceListName?:string;
    // price?:number;
    // SKUMasterList?:Array<MSkuMasterTypes>;
    // comboDetailsList?:Array<MComboMaster>;
    // userdetails?:Array<MUserDetails>;
    comboOfferDetailsList:Array<MComboOfferDetails>;
    transactionLogList:Array<any>;
  
}
export class MComboOffer
{
      comboOfferRecord?:MComboMaster;
      cPOStyleDetailsRecords?:MComboOfferDetails;
      priceListTypes?:Array<MPricelistMaster>;

}
export class MComboOfferDetails{
    id?:number;
    headerID?:number;
     barcode?:string;
     skuCode?:string;        
     styleCode?:string;        
     skuName?:string;    
}

