import { Mcashincashoutdetails } from './m-cashin-cashout-details';

export class Mcashin {
    constructor() { }

    id?: number;
    documentDate?: Date;
    total?: number;
    storeCode?: string;
    posCode?: string;
    shiftCode?: string;
    storeID?: number;
    shiftID?: number;
    posid?: number;
    countryID?:number;

    
    cashInCashOutDetailsList?: Array<Mcashincashoutdetails>;



    // List<ShiftMaster> Shiftlist 
  
}