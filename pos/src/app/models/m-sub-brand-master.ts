export class MSubBrandMaster {
    constructor() { }
    id?:number;    
    subBrandCode?:string;    
    subBrandName?:string;    
    brandID?:number;    
    brandName?:string;
    updateFlag?:number;
    subBrandList?:Array<MSubBrandMaster>;
    active?:boolean;
    createBy?:number;
}