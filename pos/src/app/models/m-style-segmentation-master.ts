import { MSegmentationTypes } from './m-segmentation-types';

export class MStyleSegmentationMaster {
    constructor() { }
    id?:number;
    afSegamationCode?:number;
    afSegamationName?:string;
    styleName?:string;
    colorName?:string;
    scaleName?:string;
    size?:string;
    styleUse?:boolean;
    styleMaxLength?:number;
    styleDefDescription
    colorUse?:boolean;
    colorMaxLength?:number;
    colorDefDescription?:boolean;
    scaleUse?:boolean;
    scaleMaxLength?:number;
    scaleDefDescription
    use?:boolean;
    segmentName?:string;
    maxLength?:string;
    defaultDescription?:boolean;
    remarks?:string;
    codeLength?:number;
    useSeperator?:string;
    segmentList?: Array<MSegmentationTypes>; 
    active?:boolean;
    isCollasped?:boolean;
}
