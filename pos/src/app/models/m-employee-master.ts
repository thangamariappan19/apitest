export class MEmployeeMaster {
    constructor() { }
    id?: number;
    baseID?: number;
    employeeCode?: string;
    employeeName?: string;
    roleName?: string;
    dateofJoining?: Date;
    salary?: number;
    address?: string;
    phoneNo?: string;
    countryCode?: string;
    storeCode?: string;
    isSelection?: boolean;
    remarks?: string;
    roleID?: number;
    designation?: string;
    employeeImage?: string;
    storeID?: number;
    countryID?: number;
    countryName?: string;
    updateFlag?: number;
    storeName?: string;
    comboempcodename?: string;
    active?: boolean;
    
    // Base Type
    // active?: boolean;
    // scn?: number;
    // createBy?: number;
    // createOn?: Date;
    // updateBy?: number;
    // updateOn?: Date;
    // createdByUserName?: string;
    // updatedByUserName?: string;
    // isStoreSync?: boolean;
    // isCountrySync?: boolean;
    // appVersion?: boolean;
    // isServerSync?: boolean;
}

export class MEmployeeAC {
    constructor() { }
    id?: number;
    employeeName?: string;
    employeeCode?: string;
}