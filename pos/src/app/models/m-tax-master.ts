export class MTaxMaster {
    constructor() { }
    id?: number;
    taxCode?: string;
    taxPercentage?: string;
    sales?: boolean;
    purchase?: boolean;
    inclusiveTax?: boolean;
    taxlist?:Array<MTaxMaster>
    active?: boolean;
    createBy?:number;
}
