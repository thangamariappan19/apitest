export class MBinConfigMaster {
    constructor() {}
    id?: number;
    storeID?:number;
    storeCode?: string;
    levelNo?:number;
    levelName?: string;
    //remarks?: string;
    enableBin?: boolean;
    createBy?:number;
    active?:boolean;
    binLevelMasterList?: Array<MBinConfigMaster>;
}
