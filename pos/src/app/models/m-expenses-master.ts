export class MExpensesMaster {
    constructor() { }
    id?:number;
    expenseCode?:string;
    expenseName?:string;        
    remarks?:string;     
    expenseMasterTypesData?: Array<MExpensesMaster>;
    createBy?:number;
    updateBy?:number; 
    active?:boolean;
}
