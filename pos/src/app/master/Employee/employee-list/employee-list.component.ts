import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MEmployeeMaster } from 'src/app/models/m-employee-master';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EmployeeListComponent implements OnInit {
  
  @ViewChild('dataTable', { static: true }) table: APIDefinition;
  recordCount: number;
  myForm: FormGroup;
  json: Array<MEmployeeMaster>;
  searchString: string = "";
  isActive: string = "1";
  pageData: Array<any> = null;
  country_list: Array<any>;
  store_List: Array<any>;
  designation_List: Array<any>;
  designation_Name?: string ="";
  countryCode: string;
  storeCode: string;
  storename: string;
  countryid?:any=0;
  storeid?: any=0;
  panelOpenState: boolean = false;
  togglePanel() {
    this.panelOpenState = !this.panelOpenState
    if(this.panelOpenState)
    {
    this.isShowfilterList=false;
    this.isShow=true;
    }
    else
    {
      this.isShowfilterList=false;
      this.isShowList=true;
      this.isShow=false;
    }
  }

  public configuration: Config;
  public columns: Columns[];
  public columnsCopy: Columns[];
  public tblData = [];
  public tblDataCopy = [];
  isShow:Boolean=false;
  isShowList:Boolean=true;
  isShowfilterList:Boolean=false;
  temp_image: string = "assets/img/customer.png";

  public pagination = {
    limit: this.common.max_rows_per_page,
    offset: 0,
    count: -1,
  };

  eventEmitted($event: { event: string; value: any }): void {
    if ($event.event !== 'onClick') {
      this.parseEvent($event);
    }
  }

  private parseEvent(obj: EventObject): void {
    let limit_changed: boolean = false;
    if(this.pagination.limit != obj.value.limit){
      limit_changed = true;
      this.pageData = null;
    }
    this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
    this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
    this.pagination = { ...this.pagination };
    // const params = `_limit=${this.pagination.limit}&_page=${this.pagination.offset}`; // see https://github.com/typicode/json-server
   
    if(this.isShowfilterList==false){
      let pageExists:boolean = false;
    if(limit_changed == false){
      if(this.pageData != null && this.pageData.length > 0){
        let pd = this.pageData.filter(x=>x.pageNo == this.pagination.offset);
        if(pd != null && pd.length > 0 && pd[0].items != null && pd[0].items.length > 0){
          this.tblData = pd[0].items;
          pageExists = true;
          this.pagination = { ...this.pagination };
              this.cdr.detectChanges();
        }
      }
    }
    if(pageExists == false){
      this.getData();
    }
  }
  else 
  {
    let pageExists:boolean = false;
    if(limit_changed == false){
      if(this.pageData != null && this.pageData.length > 0){
        let pd = this.pageData.filter(x=>x.pageNo == this.pagination.offset);
        if(pd != null && pd.length > 0 && pd[0].items != null && pd[0].items.length > 0){
          this.tblData = pd[0].items;
          pageExists = true;
          this.pagination = { ...this.pagination };
              this.cdr.detectChanges();
        }
      }
    }
    if(pageExists == false){
      this.GetfilterData();
    }

  }
    
    
  }

  CardVieweventEmitted($event: { event: string; value: any }): void {
    if ($event.event !== 'onClick') {
      this.CardViewparseEvent($event);
    }
  }

  private CardViewparseEvent(obj: any): void {
    console.log(obj);
    
    var value={
      page: parseInt(obj.pageIndex) + 1,
      limit: parseInt(obj.pageSize)
    }
    let newObj:EventObject =  {
      "value": value,
      "event": "onClick"
    };

    this.parseEvent(newObj);
    // newObj.value = value;
    // let limit_changed: boolean = false;
    // if(this.pagination.limit != obj.value.pageSize){
    //   limit_changed = true;
    //   this.pageData = null;
    // }
    // this.pagination.limit = obj.value.pageSize ? obj.value.pageSize : this.pagination.limit;
    // obj.value.pageIndex++;
    // this.pagination.offset = obj.value.pageIndex ? obj.value.pageIndex : this.pagination.offset;
    // this.pagination = { ...this.pagination };
    // // const params = `_limit=${this.pagination.limit}&_page=${this.pagination.offset}`; // see https://github.com/typicode/json-server
    // let pageExists:boolean = false;
    // if(limit_changed == false){
    //   if(this.pageData != null && this.pageData.length > 0){
    //     let pd = this.pageData.filter(x=>x.pageNo == this.pagination.offset);
    //     if(pd != null && pd.length > 0 && pd[0].items != null && pd[0].items.length > 0){
    //       this.tblData = pd[0].items;
    //       pageExists = true;
    //       this.pagination = { ...this.pagination };
    //           this.cdr.detectChanges();
    //     }
    //   }
    // }
    
    // if(pageExists == false){
    //   this.getData();
    // }
    
  }

  private getData(): void {
    this.common.showSpinner();
    this.tblData = null;
    this.json = null;
    // this.configuration.isLoading = true;
    this.api.getAPI("employee?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.tblData = data.responseDynamicData;
            this.json = data.responseDynamicData;
            this.recordCount = data.recordCount;
            for(let cusimg of this.json)
            {
              cusimg.employeeImage=cusimg.employeeImage == null || cusimg.employeeImage == '' || cusimg.employeeImage=='0' ? this.temp_image : 'data:image/gif;base64,' +cusimg.employeeImage;
            }
            this.tblData = this.json;
            this.pagination.count = data.recordCount == null ? 0 : data.recordCount;
            this.pagination = { ...this.pagination };
            if(this.pageData == null){
              this.pageData = new Array<any>();
            }
            this.pageData.push({"pageNo": this.pagination.offset == 0 ? 1 : this.pagination.offset, 
              "items": this.tblData});
            console.log(this.pageData);
            // this.configuration.isLoading = false;
            this.cdr.detectChanges();
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
          // this.configuration.isLoading = false;
        }, this.common.time_out_delay);
      });
  }

  search_click(){
    
    if (this.panelOpenState) {
      if (confirm("Additional Filter is applied. Are you sure you want to proceed with Default Filter?")) {
        this.pagination.limit = this.pagination.limit;
        this.pagination.offset = 0;
        this.pagination = { ...this.pagination };
        this.pageData = null;
        this.getData();
        this.panelOpenState=false;
        this.isShowList=true;
        this.isShow=false;
      }
    }
    else
     {
      this.pagination.limit = this.pagination.limit;
      this.pagination.offset = 0;
      this.pagination = { ...this.pagination };
      this.pageData = null;
      this.getData();
      
    }
   
  }

  clear_search(){
    this.searchString = "";
    this.search_click();
  
    
  }

  status_changed(e) {
    //alert(e.target.value);
    if (e.target.value == 'no') {
      this.isActive = "0";
    }
    else {
      this.isActive = "1";
    }
    if(this.isShowfilterList==false)
    {
    this.pagination.limit = this.pagination.limit;
    this.pagination.offset = 0;
    this.pagination = { ...this.pagination };
    this.pageData = null;
    this.getData();
    }
    else
    {
    this.pagination.limit = this.pagination.limit;
    this.pagination.offset = 0;
    this.pagination = { ...this.pagination };
    this.pageData = null;
    this.GetfilterData();

    }
  }

  ngOnInit() {
    this.dataTableDefault();
    this.pageData = null;
    this.getData();
  }
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      designationID: [''],
      countryID: [''],
      storeID: ['']
    
    });
    this.clear_controls();
  }
  clear_controls() {
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['designationID'].setValue('');
    this.getCountryList();
    // this.getStoreList();
    this.getDesignationList();
    // this.employee = new MEmployeeMaster();
  }
  dataTableDefault() {
    this.configuration = { ...DefaultConfig };
    this.configuration.rows = this.common.max_rows_per_page;
    this.configuration.paginationMaxSize = this.common.max_pagination_size;
    this.configuration.horizontalScroll = true;
    this.configuration.headerEnabled = true;
    this.configuration.orderEnabled = true;
    this.configuration.threeWaySort = true;
    this.configuration.resizeColumn = true;
    this.configuration.fixedColumnWidth = false;
    this.configuration.tableLayout.theme = 'light';
    this.columnsCopy = [
      { key: 'employeeName', title: 'Employee Name', width: '15%' },
      { key: 'employeeCode', title: 'Employee Code', width: '15%' }, // orderBy: 'desc' },
      { key:'roleName',title:'Role Name',width:'15%'},
      { key:'designation',title:'Designation',width:'15%'},
      { key:'phoneNo',title:'Phone Number',width:'10%'},
     // { key:'email',title:'Email',width:'10%'},
      { key:'storeName',title:'StoreName',width:'10%'},
     // { key:'dateofJoining',title:'Date of Joining',width:'10%'},
      { key: 'active', title: 'Active', width: '10%' }, //headerActionTemplate: this.levelHeaderActionTemplate },
      { key: '', title: '' }
      
    ];
    this.columns = this.columnsCopy;
  }

  // onChange(name: string): void {
  //   this.tblData = this.tblDataCopy.filter(
  //     x => x.employeeCode.toLowerCase().includes(name.toLowerCase()) ||
  //       x.employeeName.toLowerCase().includes(name.toLowerCase()) ||
  //       x.roleName.toLowerCase().includes(name.toLowerCase()) ||
  //       x.phoneNo.toString().includes(name.toString()) ||
  //       x.designation.toLowerCase().includes(name.toLowerCase()) ||
  //       x.storeName.toLowerCase().includes(name.toLowerCase()) 
  //   );
  // }

  // getemployeelist() {
  //   this.json = null;
  //   this.common.showSpinner();
  //   this.api.getAPI("employee")
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           //this.json = data.responseDynamicData;
  //           //this.employee_List = this.json;
  //           this.tblData = data.responseDynamicData;
  //           this.tblDataCopy = data.responseDynamicData;
  //          // .log(this.json);
  //         } else {
  //           let msg: string = data != null
  //             && data.displayMessage != null
  //             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //           this.common.showMessage('warn', msg);
  //         }
  //         this.common.hideSpinner();
  //       }, this.common.time_out_delay);
  //     });
  // }


  // ngOnInit() {
  // }
  // FilterDatadisplay()
  // {
    
  //   // this.isShowList=false;
    
  // }
  GridDisplay(e) {
    //alert(e.target.value);
    if(e.target.value=='no')
    {
      this.isShow=true;
      this.isShowList=false;
    }
    else
    {
      this.isShow=false;
      this.isShowList=true;
    }
  }
  getCountryList() {
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.country_list = data.countryMasterList;
            // this.shippingcountry_list = data.countryMasterList;
            // console.log(this.country_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getStoreList() {
    this.store_List = null;
    this.myForm.controls['storeID'].setValue('');
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          this.countryid = country.id;
          break;
        }
      }
    }
    this.common.showSpinner();
    this.api.getAPI("store?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.store_List = data.storeMasterList;
           // .log(this.store_List);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getDesignationList() {
    this.common.showSpinner();
    this.api.getAPI("designation")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.designation_List = data.designationMasterList;
           // .log(this.designation_List);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  designation() {
    if (this.designation_List != null && this.designation_List.length > 0) {
      for (let designation of this.designation_List) {
        if (designation.id == this.myForm.get('designationID').value) {
          this.designation_Name = designation.designationName;
          break;
        }
        else
        {
          this.designation_Name="";
        }
      }
    }
  }
  store() {
    if (this.store_List != null && this.store_List.length > 0) {
      for (let store of this.store_List) {
        if (store.id == this.myForm.get('storeID').value) {
          this.storeCode = store.storeCode;
          this.storeid = store.id;
          break;
        }
        else
        {
          this.storeid=0;
        }
      }
    }
  }
  GetfilterData()
  {
    this.common.showSpinner();
    this.tblData = null;
    this.json = null;
    // this.isShowfilterList=true;
    if(this.myForm.get('countryID').value!="" || this.myForm.get('storeID').value!="" || this.myForm.get('designationID').value!="" )
    {
    //this.configuration.isLoading = true;
    this.api.getAPI("employee?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&countryid=" + this.countryid + "&storeid=" + this.storeid + "&designation=" + this.designation_Name)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.tblData = data.responseDynamicData;
            this.isShowList=false;
            this.isShow=true;
            this.json = data.responseDynamicData;
            this.recordCount = data.recordCount;
            for(let cusimg of this.json)
            {
              cusimg.employeeImage=cusimg.employeeImage == null || cusimg.employeeImage == '' || cusimg.employeeImage=='0' ? this.temp_image : 'data:image/gif;base64,' +cusimg.employeeImage;
            }
            this.tblData = this.json;
            this.pagination.count = data.recordCount == null ? 0 : data.recordCount;
            this.pagination = { ...this.pagination };
            if(this.pageData == null){
              this.pageData = new Array<any>();
            }
            this.pageData.push({"pageNo": this.pagination.offset == 0 ? 1 : this.pagination.offset, 
              "items": this.tblData});
               this.cdr.detectChanges();
            
          } 
          else 
          {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
    }
    else
    {
      this.common.hideSpinner();
      this.common.showMessage('info', 'Please Select  Filter Values.');

    }
  }
  closefilterData()
  {
    this.isShowfilterList=false;
    this.isShow =false;
   
  }
  ResetfilterData()
  {
  
    this.myForm.controls['designationID'].setValue('');
    this.myForm.controls['storeID'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.isShow = true;
    this.isShowList=false;
    this.countryid=0;
    this.storeid=0;
    this.designation_Name='';
    this.tblData =null;
    this.recordCount =0;
    this.store_List=new Array<any>();
  }
  onPageChange($event) {
    this.tblData =  this.tblDataCopy.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }
}
