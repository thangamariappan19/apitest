import { MInventorycountingdetailsMaster } from './m-inventorycountingdetails-master';

export class MInventorycountingheaderMaster {
    constructor(){}

        id?:number;        
        documentNumber?:string;        
        documentDate?:Date;        
        storeID?:number;        
        postingDone?:boolean;        
        postingDate?:Date;        
        inventoryCountingDetailList?:Array<MInventorycountingdetailsMaster>;
        storeCode?:string;
        active?:boolean;
}
