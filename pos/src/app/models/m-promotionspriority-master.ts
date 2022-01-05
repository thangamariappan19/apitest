export class MPromotionspriorityMaster {
    constructor(){}
    
        id?:number;
        promotionID?:number;
        promotionName?:string;
        priceListCode?:string;
        promotionCode?:string;
        priorityNo?:number;
        priceListID?:number;
        promotionPriorityTypeData?:Array<MPromotionspriorityMaster>;
        active?:boolean;
}
