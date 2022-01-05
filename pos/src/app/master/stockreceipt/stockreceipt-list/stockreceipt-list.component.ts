import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MStockrequestMaster } from 'src/app/models/m-stockrequest-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MStockreceiptdetailsMaster } from 'src/app/models/m-stockreceiptdetails-master';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { EventObject } from 'src/app/models/event-object'

@Component({
  selector: 'app-stockreceipt-list',
  templateUrl: './stockreceipt-list.component.html',
  styleUrls: ['./stockreceipt-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class StockreceiptListComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) table: APIDefinition;

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
  searchString: string = "";
  isActive: string = "1";
  pageData: Array<any> = null;
  user_details: MUserDetails = null;


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
    this.api.getAPI("StockReceipt?storeCode="+ this.user_details.storeCode + "&limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.tblData = data.responseDynamicData;
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

  ngOnInit() {
    let temp_str: string = localStorage.getItem('user_details');
     if (temp_str != null) {
       this.user_details = JSON.parse(temp_str);
     }
    this.dataTableDefault();
    this.pageData = null;
    this.getData();
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
      { key:'documentNo', title: 'Document No', width: '25%' }, // orderBy: 'desc' },
      { key:'documentDate', title: 'Document Date', width: '30%' },
      { key:'status',title:'Status',width:'20%'},
      { key: 'remarks', title: 'Remarks', width: '20%' }, 
      { key: 'active', title: 'Active', width: '5%' }, 
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }

  // onChange(name: string): void {
  //   this.tblData = this.tblDataCopy.filter(
  //     x => x.documentNo.toLowerCase().includes(name.toLowerCase()) ||
  //       x.documentDate.toLowerCase().includes(name.toLowerCase()) ||
  //       x.status.toLowerCase().includes(name.toLowerCase()) 
  //   );
  // }

  // StockReceiptList() {
  //   this.stockreceipt_List = null;
  //   this.common.showSpinner();
  //   this.api.getAPI("StockReceipt?storeCode="+this.storeCode)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           //this.stockreceipt_List = data.responseDynamicData;
  //           //this.stockreceipt_Filter = this.stockreceipt_List;
  //           this.tblData = data.responseDynamicData;
  //           this.tblDataCopy = data.responseDynamicData;
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
  // filter() {
  //   let documentNo = this.myForm.get('documentNo').value;
  //   let documentDate=this.common.toYMDFormat(new Date(this.myForm.get('documentDate').value)).toString();
  //   let status = this.myForm.get('status').value;

  //   this.stockreceipt_Filter = this.stockreceipt_List;

  //   if (documentNo != null && documentNo != "")
  //     this.stockreceipt_Filter = this.stockreceipt_Filter.filter(x => x.documentNo.toLowerCase().includes(documentNo.toLowerCase()));

  //   if (documentDate != null && documentDate != "" && documentDate != "NaN-NaN-NaN")
  //     this.stockreceipt_Filter = this.stockreceipt_Filter.filter(x => this.common.toYMDFormat(new Date(x.documentDate)).toString().includes(documentDate));
      
  //     if (status != null && status != "")
  //     this.stockreceipt_Filter = this.stockreceipt_Filter.filter(x => x.status.toLowerCase().includes(status.toLowerCase()));

  //   }
  //   changeGender(e) {
  //     //alert(e.target.value);
  //     if(e.target.value=='no')
  //     {
  //       this.tblData = this.tblDataCopy.filter(
  //         x => x.active==false
  //       );
  //     }
  //     else
  //     {
  //       this.tblData = this.tblDataCopy.filter(
  //         x => x.active==true
  //       );
  //     }
  //   }
}
