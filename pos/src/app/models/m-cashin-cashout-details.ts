import { MReasonMaster } from './m-reason-master';

export class Mcashincashoutdetails {
    constructor() { }

    id?: number;
    headerID?: number;
    applicationDate?: Date;
    documentDate?: Date;
    reason?: string;
    reasonID?: number;
    receivedAmount?: number;
    paidAmount?: number;
    remarks?: number;
    type?: string;
    
    reasonMasterList?: Array<MReasonMaster>;


  
    posid?: number;
    storeID?: number;
    shiftID?: number;
    shiftCode?: string;
    posCode?: string;
    storeCode?: string;
}