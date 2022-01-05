import { MStorebrandmappingMaster } from './m-storebrandmapping-master';

export class MStoreMaster {
    constructor() { }
        id?:number;        
        storeCode?:string;
        IDs?:string;
        storeName?:string;
        countrySetting?:number;
        stateID?:number;
        countryID?:number;
        storeGroup?:number;       
        storeCompany?:number;        
        brand?:string;        
        shopBrand?:string;
        storeGroupCode?:string;        
        storeType?:string;        
        countryName?:string;        
        storeGroupName?:string;        
        companyName?:string;       
        remarks?:string;        
        priceListID?:number;        
        retailID?:number;        
        taxID?:number;
        address?:string;
        location?:string;
        storeSize?:number;
        noOfOptions?:number;
        startDate?:Date;
        endDate?:Date;        
        grade?:string;        
        storeHeader?:string;        
        storeFooter?:string;        
        printCount?:string;        
        returnPrintCount?:string;        
        exchangePrintCount?:string;        
        storeImage?:any;      
        licenseImage?:any;        
        diskID?:string;        
        CPUID?:string;
        StoreImageList?:Array<MStoreMaster>;        
        ToMailID?:string;        
        CCMailID?:string;        
        BrandCode?:string;        
        BrandID?:string;        
        BrandName?:string;
        SelectStoreBrandMappingList?:Array<MStorebrandmappingMaster>;        
        EmailTemplate?:string;        
        SMSTemplate?:string;        
        FranchiseCode?:string;        
        FranchiseID?:number;
        StateCode?:string;        
        CountryCode?:string;       
        StoreCompanyCode?:string;        
        PriceListCode?:string;
        EnableOnlineStock?:boolean;        
        EnableOrderFulFillment?:boolean;
        EnableFingerPrint?:boolean;        
        CityID?:number;
        Active?:boolean;
        CreateBy?:number;
        enableBin?:number;
}