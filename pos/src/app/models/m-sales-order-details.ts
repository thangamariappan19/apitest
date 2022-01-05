export class MSalesOrderDetails {
    constructor() { } 
    
    
    id?: number; 
    salesOrderID?: number;    
    salesOrderDocumentNo?: string;   
    styleCode?: string; 
    skuCode?: string;
    qty?: number; 
    pickedQty?: number; 
    storeID?: number; 
    storeCode?: string;
    price?: number; 
    sellingLineTotal?: number; 
    status?: string;
    remarks?: string;
}
