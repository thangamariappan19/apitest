export class MItemImageMaster {
    constructor() { }

    id?: number;
    styleID?: number;
    skuid?: number;
    designID?: number;
    isDefaultImage?: boolean;
    skuImage?: string;
    styleCode?: string;

    active?: boolean;
    scn?: number;
    createBy?: number;
    createOn?: Date;
    updateBy?: number;
    updateOn?: Date;
    createdByUserName?: string;
    updatedByUserName?: string;
    isStoreSync?: boolean;
    isCountrySync?: boolean;
    appVersion?: string;
    isServerSync?: boolean;
}
