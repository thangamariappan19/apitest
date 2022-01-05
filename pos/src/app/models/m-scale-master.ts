import { MScaleDetails } from './m-scale-details';
import { MBrandMaster } from './m-brand-master';

export class MScaleMaster {
    constructor() { }
    id?: number;
    scaleID?: number;
    sizeID?: number;
    scaleCode?: string;
    scaleName?: string;
    internalCode?: string;
    visualOrder?: string;
    scaleDetailMasterList?: Array<MScaleDetails>;
    applytoAll?: boolean;
    brandMasterList?: Array<MBrandMaster>;
    updateFlag?: number;
    active?: boolean;
    createBy?:number;
}
