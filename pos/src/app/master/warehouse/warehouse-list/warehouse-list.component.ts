import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation,ChangeDetectorRef } from '@angular/core';
import { MWarehouseMaster } from 'src/app/models/m-warehouse-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCountryMaster } from 'src/app/models/m-country-master';
import { MWarehouseType } from 'src/app/models/m-warehouse-type';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {



  json: Array<any>;
  warehouse_list: Array<MWarehouseMaster>;
  warehouse_Filter: Array<MWarehouseMaster>;
  countryList: Array<MCountryMaster>;
  warehousetype_list: Array<MWarehouseType>;
  myForm: FormGroup;

  @ViewChild('dataTable', { static: true }) table: APIDefinition;
  searchString: string = "";
  isActive: string = "1";
  pageData: Array<any> = null;
  public configuration: Config;
  public columns: Columns[];
  public columnsCopy: Columns[];
  public tblData = [];
  public tblDataCopy = [];
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

  private getData(): void {
    this.common.showSpinner();
    this.tblData = null;
    // this.configuration.isLoading = true;
    this.api.getAPI("warehouse?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.tblData = data.warehouseMasterList;
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
   // this.createForm();
  }

 /* createForm() {

    this.myForm = this.fb.group({
      warehouseCode: [''],
      warehouseName: [''],
      countryID: [''],
      type: [''],
    });
    this.dataTableDefault();
    this.getwarehouselist();
    this.getCountry();
    this.getWarehouseTypeList();
    this.clear_controls();
  }
  clear_controls() {
    this.warehouse_Filter = this.warehouse_list;
    this.myForm.controls['warehouseCode'].setValue('');
    this.myForm.controls['warehouseName'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['type'].setValue('');
  }
*/
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
      { key: 'warehouseCode', title: 'Warehouse Code', width: '15%' }, // orderBy: 'desc' },
      { key: 'warehouseName', title: 'Warehouse Name', width: '15%' },
      { key: 'warehouseTypeName', title: 'Warehouse Type Name', width: '15%' },
      { key: 'countryName', title: 'Country Name', width: '15%' },
      { key: 'companyName', title: 'Company', width: '15%' },
      { key: 'remarks', title: 'Remarks', width: '15%' },
      { key: 'active', title: 'Active', width: '10%' }, //headerActionTemplate: this.levelHeaderActionTemplate },
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }

  /*onChange(name: string): void {
    this.tblData = this.tblDataCopy.filter(
      x => x.warehouseCode.toLowerCase().includes(name.toLowerCase()) ||
        x.warehouseName.toLowerCase().includes(name.toLowerCase()) ||
        x.warehouseTypeName.toLowerCase().includes(name.toLowerCase()) ||
        x.countryName.toLowerCase().includes(name.toLowerCase()) ||
        x.companyName.toLowerCase().includes(name.toLowerCase()) ||
        x.remarks.toLowerCase().includes(name.toLowerCase()) 
       
    );
  }*/


  /*getwarehouselist() {
    this.warehouse_list = null;
    this.warehouse_Filter = null;
    this.common.showSpinner();
    this.api.getAPI("warehouse")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.warehouse_list = new Array<MWarehouseMaster> ();
            //this.warehouse_list = data.warehouseMasterList;
           // this.warehouse_Filter = this.warehouse_list;
            this.tblData = data.warehouseMasterList;
            this.tblDataCopy = data.warehouseMasterList;
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

  

  /*getCountry() {
    this.countryList = null;
    this.common.showSpinner();
    this.api.getAPI("country")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
            this.countryList = this.countryList.filter(x => x.active == true);
           // .log(this.countryList);
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

  getWarehouseTypeList() {
    this.warehousetype_list = null;
    this.common.showSpinner();
    this.api.getAPI("warehousetype")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.warehousetype_list = data.warehouseTypeMasterList;
            this.warehousetype_list = this.warehousetype_list.filter(x => x.active == true);
           // .log(this.warehousetype_list);
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
  }*/
}
