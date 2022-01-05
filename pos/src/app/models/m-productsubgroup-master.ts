import { STRING_TYPE } from '@angular/compiler';

export class MProductsubgroupMaster {
    constructor(){}
    
        id?:Number;        
        productSubGroupCode?:string;        
        productSubGroupName?:string;        
        productGroupID?:Number;       
        productGroupName ?:string; 
        productGroupCode ?:string;         
        productSubGrouplist?:Array<MProductsubgroupMaster>;
        isCollasped?:boolean;
        active?:boolean;
        createBy?:number;
}
