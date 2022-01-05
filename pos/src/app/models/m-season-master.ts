export class MSeasonMaster {
    constructor() { }

    id?:number;
    seasonCode?:string;
    seasonName?:string;
    seasonDrop?:number;
    seasonStartDate?:Date;
    seasonEndDate?:Date;
    noOfWeeks?:number;
    noOfDays?:number;
    isSelected?:boolean;
    subSeasonList?:Array<MSeasonMaster>;
    seasonCodeName?:string;
    updateFlag?:number;
    createBy?:number;
    updateBy?:number;
    active?:boolean;
}
