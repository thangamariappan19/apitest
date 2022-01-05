export class MProductgroupMaster {
    constructor(){}
    
        id?:number;        
        productGroupCode?:string;        
        productGroupName?:string;        
        description?:string;
        productSubGroupList?:Array<any>;
        updateFlag?:number;
        createBy:number;
        updateBy:number;
        active?:boolean;
}
