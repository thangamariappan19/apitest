import { MSubBrandMaster } from './m-sub-brand-master';

export class MBrandMaster {
    constructor() { }
    id?: number;
    brandID?: number;
    scaleHeaderID?: number;
    brandCode?: string;
    brandName?: string;
    brandLogo?: any;
    arbName?: string;
    brandType?: string;
    remarks?: string;
    shortDescriptionName?: string;
    subBrandList?:Array<MSubBrandMaster>;
    scaleWithBrandID?: number;
    updateFlagID?: number;
    active?:boolean;
    isCollasped?:boolean;
    createBy?:number;
    updateBy?:number;
}
