import { MDocumentNumberingDetails } from './m-document-numbering-details';

export class MDocumentNumbering {
    constructor() { }
    id?:number;
    countryID?:number;    
    stateID?:number;
    storeID?:number;
    posID?:number;
    documentTypeID?:number;
    stateName?:string;
    countryName?:string;
    posName?:string;
    storeName?:string;
    documentName?:string;
    documentNumberingDetails?:Array<MDocumentNumberingDetails>;
    maxDate?:string;
    countryCode?:string;
    stateCode?:string;
    posCode?:string;
    storeCode?:string;
    active?:boolean;
}
