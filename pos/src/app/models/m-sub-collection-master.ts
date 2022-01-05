export class MSubCollectionMaster {
    constructor() { }
    id?: number;
    subCollectionCode?: string;
    subCollectionName?: string;
    collectionID?: number;
    collectionCode?:string;
    collectionName?: string;
    active?:boolean;
    isCollasped?:boolean;
    subCollectionMasterlist?: Array<MSubCollectionMaster>;
    createBy?:number;
}
