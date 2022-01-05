export class MBarcodeMaster {
    constructor() { }
    
        id?:number;      
        docNumID?:number;       
        documentName?:string;
        prefix?:string;
        suffix?:string;
        startNumber?:number;
        endNumber?:number; 
        numberOfDigit?:number;
        startDate?:Date;
        endDate?:Date;
        runningNo?:number;
        barCodeList?:Array<MBarcodeMaster>;
        createBy?:number;
        active?:boolean;
}
