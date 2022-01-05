import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation,ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { PageEvent } from '@angular/material/paginator';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListComponent implements OnInit {
  json: Array<any>;
  recordCount: number;
  //country_list: Array<MCountryMaster>;
  myForm: FormGroup;
  isShow:Boolean=false;
  isShowList:Boolean=true;
  temp_image: string = "assets/img/customer.png";
  @ViewChild('dataTable', { static: true }) table: APIDefinition;
  searchString: string = "";
  isActive: string = "1";
  pageData: Array<any> = null;
  public configuration: Config;
  public columns: Columns[];
  public columnsCopy: Columns[];
  public tblData = [];
  public tblDataCopy = [];
  isShowfilterList:Boolean=false;

  public pagination = {
    limit: this.common.max_rows_per_page,
    offset: 0,
    count: -1,
  };

  pageEvent: PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      //this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
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
    let pageExists:boolean = false;
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
      this.getData();
    }

  }
    
  }

  CardVieweventEmitted($event: { event: string; value: any }): void {
    if ($event.event !== 'onClick') {
      this.CardViewparseEvent($event);
    }
  }

  private CardViewparseEvent(obj: any): void {
    //console.log(obj);
    
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
    this.json=null;
    // this.configuration.isLoading = true;
    this.api.getAPI("customer?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.tblData = data.CustomerMasterData;
            this.json = data.customerMasterData;
            this.recordCount = data.recordCount;
            for(let cusimg of this.json)
            {
              cusimg.customerImage=cusimg.customerImage == null || cusimg.customerImage == '' ? this.temp_image : 'data:image/gif;base64,' +cusimg.customerImage;
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
    this.pagination.limit = this.pagination.limit;
    this.pagination.offset = 0;
    this.pagination = { ...this.pagination };
    this.pageData = null;
    this.getData();
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
    this.pagination.limit = this.pagination.limit;
    this.pagination.offset = 0;
    this.pagination = { ...this.pagination };
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
      // sku_code: [''],
      // discount_value: [0],
      // current_discount_type: ['Percentage']
      globalSearch:['']
    });

//this.dataTableDefault();
    //this.clear_controls();
  }

  /*clear_controls() {
    this.myForm.controls['globalSearch'].setValue('');
    this.getCustomerList();
  }*/
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
      { key: 'customerName', title: 'Customer Name', width: '25%' },
      { key: 'customerCode', title: 'Customer Code', width: '15%' }, // orderBy: 'desc' },
      // { key:'phoneNumber',title:'Phone Number',width:'15%'},
      { key:'details',title:'Details',width:'25%'},
      // { key:'email',title:'Email ID',width:'10%'},
      //{ key:'salesDetails',title:'Sales',width:'10%'},
      // { key:'alterPhoneNumber',title:'Alternative Number',width:'15%'},
      { key:'customerGroupCode',title:'Group',width:'15%'},
      // { key:'email',title:'Email ID',width:'10%'},
      { key:'countryCode',title:'Country',width:'10%'},
      { key: 'active', title: 'Active', width: '10%' }, 
      { key: '', title: '' }, 
      //{ key: '', title: 'View' },
    ];
    this.columns = this.columnsCopy;
  }
  filter(){
    this.api.getAPI("customer?CustSearchString="+ this.myForm.get('globalSearch').value)
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
        
         this.tblData = data.responseDynamicData;
         this.tblDataCopy = data.responseDynamicData;
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

  onChange(name: string): void {
    this.api.getAPI("customer?CustSearchString="+name)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
          
           this.tblData = data.responseDynamicData;
           this.tblDataCopy = data.responseDynamicData;
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
    //alert(name);
    /*this.tblData = this.tblDataCopy.filter(
      x => x.customerCode.toLowerCase().includes(name.toLowerCase()) ||
        x.customerName.toLowerCase().includes(name.toLowerCase()) ||
        x.phoneNumber.toLowerCase().includes(name.toLowerCase()) ||
        x.alterPhoneNumber.toLowerCase().includes(name.toLowerCase()) ||
        x.customerGroupCode.toLowerCase().includes(name.toLowerCase()) ||
        x.email.toLowerCase().includes(name.toLowerCase()) ||
        x.countryCode.toLowerCase().includes(name.toLowerCase())
    );*/
  }
  

  /*getCustomerList() {
    this.json = null;
    //this.country_list = null;
    this.common.showSpinner();
    this.api.getAPI("customer")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<MCountryMaster> ();
            //this.country_list = data.countryMasterList;
            this.json = data.responseDynamicData;
            for(let cusimg of this.json)
            {
              cusimg.customerImage=cusimg.customerImage == null || cusimg.customerImage == '' ? this.temp_image : 'data:image/gif;base64,' +cusimg.customerImage;
            }
           // .log(this.json);
           //this.tblData = data.responseDynamicData;
           //this.tblDataCopy = data.responseDynamicData;
           this.tblData = this.json;
           this.tblDataCopy = this.json;
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }*/
  ngOnInit() {
    this.dataTableDefault();
    this.pageData = null;
    this.getData();
  }
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
  changeGender(e) {
    //alert(e.target.value);
    if(e.target.value=='no')
    {
      this.tblData = this.tblDataCopy.filter(
        x => x.active==false
      );
    }
    else
    {
      this.tblData = this.tblDataCopy.filter(
        x => x.active==true
      );
    }
  }

  onPageChange($event) {
    this.tblData =  this.tblDataCopy.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }
}
