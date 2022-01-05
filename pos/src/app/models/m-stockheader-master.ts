import { MStockrequestMaster } from './m-stockrequest-master';

export class MStockheaderMaster {
    constructor(){}  
   
        id?:number;        
        documentNo?:string;        
        documentDate?:Date;      
        totalQuantity?:number;        
        status?:string;        
        fromStore?:number;        
        toStore?:number;        
        wareHouseID?:number;        
        storeID?:number;        
        remarks?:string;
        stockRequestDetailsList?:Array<MStockrequestMaster>
        storeCode?:string;
        active?:boolean

}
