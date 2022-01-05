export class MShiftMaster {
    constructor(){}
    
        id?:number;
        shiftCode?:string;
        shiftName?:string;
        countryID?:number;
        sortOrder?:number;
        countryName?:string;
        countryCode?:string;
        shiftID?:number;
        storeID?:number;
        pOSID?:number;
        pOSCode?:string;
        shiftInUserID?:number;
        shiftOutUserID?:number;
        businessDate?:Date;
        shiftInDateTime?:Date;
        shiftOutDateTime?:Date;
        status?:string;
        shiftStatus?:string;
        originalDayInStatus?:string;
        originalShiftInStatus?:string;
        shiftlist?:Array<MShiftMaster>;
        shiftLogID?:number;
        shiftInAmount?:number;
        pOSName?:string;
        dayin?:boolean;
        shiftin?:boolean;
        isCollasped?:boolean;
        active?:boolean;
        createBy?:number;
}
