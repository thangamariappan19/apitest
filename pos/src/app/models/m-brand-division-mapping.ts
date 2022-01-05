export class MBrandDivisionMapping {
    constructor() { }
    id?:number;        
    brandID?:number;        
    divisionCode?:string;        
    divisionName?:string;
    divisionID?:number;
    brandDivisionList?: Array<MBrandDivisionMapping>;     
    brandCode?:string;
    active?:boolean;
    createBy?:number;
}
