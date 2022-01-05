import { MWarehouseType } from 'src/app/models/m-warehouse-type';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation,ChangeDetectorRef } from '@angular/core';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-warehouse-type-list',
  templateUrl: './warehouse-type-list.component.html',
  styleUrls: ['./warehouse-type-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseTypeListComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) table: APIDefinition;
  searchString: string = "";
  isActive: string = "1";
  pageData: Array<any> = null;
  public configuration: Config;
  public columns: Columns[];
  public columnsCopy: Columns[];
  public tblData = [];
  public tblDataCopy = [];

  json: Array<any>;
  warehousetype_list: Array<MWarehouseType>;
  warehousetype_Filter: Array<MWarehouseType>;
  myForm: FormGroup;


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
    this.api.getAPI("warehousetype?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.tblData = data.warehouseTypeMasterList;
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



  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    private readonly cdr: ChangeDetectorRef,
    public router: Router
  ) {
   // this.createForm();
  }

  /*createForm() {
    // this.myForm = this.fb.group({
    //   warehouseTypeCode: [''],
    //   warehouseTypeName: [''],
    //   description: [''],
    //   remarks: ['']
    // });
    this.dataTableDefault();
    this.getwarehousetypelist();
    // this.clear_controls();
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
      { key: 'warehouseTypeCode', title: 'WareHouse Type Code', width: '20%' }, // orderBy: 'desc' },
      { key: 'warehouseTypeName', title: 'WareHouse Type Name', width: '20%' },
      { key: 'description', title: 'Description', width: '20%' },
      { key: 'remarks', title: 'Remarks', width: '20%' },
      { key: 'active', title: 'Active', width: '20%' }, //headerActionTemplate: this.levelHeaderActionTemplate },
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }

 /* clear_controls() {
    // this.getwarehousetypelist();
    this.myForm.controls['warehouseTypeCode'].setValue('');
    this.myForm.controls['warehouseTypeName'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.warehousetype_Filter = this.warehousetype_list;
  }
  getwarehousetypelist() {

    this.json = null;
    this.warehousetype_Filter = null;
    this.warehousetype_list = null;
    this.common.showSpinner();
    this.api.getAPI("warehousetype")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // this.warehousetype_list = new Array<MWarehouseType>();
            // this.warehousetype_list = data.warehouseTypeMasterList;
            // this.warehousetype_Filter = this.warehousetype_list;
            this.tblData = data.warehouseTypeMasterList;
            this.tblDataCopy = data.warehouseTypeMasterList;
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  } */

 /* onChange(name: string): void {
    this.tblData = this.tblDataCopy.filter(
      x => x.warehouseTypeCode.toLowerCase().includes(name.toLowerCase()) ||
        x.warehouseTypeName.toLowerCase().includes(name.toLowerCase()) ||
        x.description.toLowerCase().includes(name.toLowerCase()) ||
        x.remarks.toLowerCase().includes(name.toLowerCase())
    );
  }*/

  private setClass(name: string): void {
    this.table.apiEvent({
      type: API.setTableClass,
      value: name,
    });
  }

  ngOnInit() {
    this.dataTableDefault();
    this.pageData = null;
    this.getData();
  }
  // filter() {
  //   let warehousetypeCode = this.myForm.get('warehouseTypeCode').value;
  //   let warehousetypeName = this.myForm.get('warehouseTypeName').value;
  //   let description = this.myForm.get('description').value;
  //   let remarks = this.myForm.get('remarks').value;

  //   this.warehousetype_Filter = this.warehousetype_list;

  //   if (warehousetypeCode != null && warehousetypeCode != "")
  //     this.warehousetype_Filter = this.warehousetype_Filter.filter(x => x.warehouseTypeCode.toLowerCase().includes(warehousetypeCode.toLowerCase()));

  //   if (warehousetypeName != null && warehousetypeName != "")
  //     this.warehousetype_Filter = this.warehousetype_Filter.filter(x => x.warehouseTypeName.toLowerCase().includes(warehousetypeName.toLowerCase()));

  //   if (description != null && description != "")
  //     this.warehousetype_Filter = this.warehousetype_Filter.filter(x => x.description.toLowerCase().includes(description.toLowerCase()));

  //   if (remarks != null && remarks != "")
  //     this.warehousetype_Filter = this.warehousetype_Filter.filter(x => x.remarks.toLowerCase().includes(remarks.toLowerCase()));
  // }
  /*changeGender(e) {
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
