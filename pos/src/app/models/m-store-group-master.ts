import { MStoreGroupDetails } from './m-store-group-details';

export class MStoreGroupMaster {
    constructor() { }
    id?: number;
    storeGroupCode?: string;
    storeGroupName?: string;
    description?: string;
    countryID: number;
    storeGroupDetailsList?: Array<MStoreGroupDetails>;
    createBy?:number;
    active?:boolean;
}
