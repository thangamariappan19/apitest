import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation,ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { MInventorycountingdetailsMaster } from 'src/app/models/m-inventorycountingdetails-master';
import { MInventorycountingheaderMaster } from 'src/app/models/m-inventorycountingheader-master';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-inventory-counting-list',
  templateUrl: './inventory-counting-list.component.html',
  styleUrls: ['./inventory-counting-list.component.css']
})
export class InventoryCountingListComponent implements OnInit {
 
  myForm: FormGroup;
  inventoryCounting_list: Array<MInventorycountingheaderMaster>;
  inventoryCounting_Filter: Array<MInventorycountingheaderMaster>;

  @ViewChild('dataTable', { static: true }) table: APIDefinition;
  searchString: string = "";
  isActive: string = "1";
  public configuration: Config;
  pageData: Array<any> = null;
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
      // this.getData();
    }
    
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
      companyCode: [''],
      companyName: [''],
      countryID: ['']
    });
    this.dataTableDefault();
   
  }
  search_click(){
    this.pagination.limit = this.pagination.limit;
    this.pagination.offset = 0;
    this.pagination = { ...this.pagination };
    this.pageData = null;
    this.getInventoryCountingList();
  }
  clear_search(){
    this.searchString = "";
    this.search_click();
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
      { key: 'documentNo', title: 'Document No', width: '20%' },
      { key: 'documentDate', title: 'Document Date', width: '20%' },
      { key: 'createOn',title:'Created Date & Time',width:'15%'},
      { key: 'status',title:'Status',width:'10%'},
      { key: 'postingDone', title: 'Posting Done', width: '10%' },
      { key: 'postingDate', title: 'Posting Date', width: '15%' },
      { key: 'remarks', title: 'Remarks', width: '10%' },
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }

  onChange(name: string): void {
    this.tblData = this.tblDataCopy.filter(
      x => x.documentNo.toLowerCase().includes(name.toLowerCase()) ||
        x.documentDate.toLowerCase().includes(name.toLowerCase()) ||
        x.createddatetime.toLowerCase().includes(name.toLowerCase()) ||
        x.status.toLowerCase().includes(name.toLowerCase()) ||
        x.postingdone.toLowerCase().includes(name.toLowerCase()) ||
        x.postingdate.toLowerCase().includes(name.toLowerCase()) ||
        x.remarks.toLowerCase().includes(name.toLowerCase())
    );
  }

  getInventoryCountingList() {
    this.common.showSpinner();
    this.api.getAPI("inventorycounting?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.tblData = data.responseDynamicData;
            this.tblDataCopy = data.responseDynamicData;
            this.pagination.count = data.recordCount == null ? 0 : data.recordCount;
            this.pagination = { ...this.pagination };
            if(this.pageData == null){
              this.pageData = new Array<any>();
            }
            this.pageData.push({"pageNo": this.pagination.offset == 0 ? 1 : this.pagination.offset, 
              "items": this.tblData});
            this.cdr.detectChanges();
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

  ngOnInit() {
    this.dataTableDefault();
    this.pageData = null;
    this.getInventoryCountingList();
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
}
