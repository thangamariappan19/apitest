import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { MPriceChange } from 'src/app/models/m-price-change';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-price-change-list',
  templateUrl: './price-change-list.component.html',
  styleUrls: ['./price-change-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PriceChangeListComponent implements OnInit {
  
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
    this.api.getAPI("PriceChange?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.tblData = data.responseDynamicData;
            this.tblDataCopy = data.responseDynamicData;
            for(let tb of this.tblData)
            {
               tb.documentDate = this.common.toYMDFormat(new Date(tb.documentDate));
               tb.priceChangeDate = this.common.toYMDFormat(new Date(tb.priceChangeDate));
            }

             for(let tbcpy of this.tblDataCopy)
            {
              tbcpy.documentDate = this.common.toYMDFormat(new Date(tbcpy.documentDate));
              tbcpy.priceChangeDate = this.common.toYMDFormat(new Date(tbcpy.priceChangeDate));
            }

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
    // this.createForm();
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
      { key: 'documentNo', title: 'Document No', width: '15%' }, // orderBy: 'desc' },
      { key: 'documentDate', title: 'Document Date', width: '15%' },
      { key: 'priceChangeDate', title: 'Price Change Date', width: '20%' },
      { key: 'priceChangeType', title: 'Price Change Type', width: '15%' },
      //{ key: 'multipleCountry', title: 'Multi Country', width: '10%' },
      { key: 'sourceCountryCode', title: 'Source Country', width: '15%' },
      { key: 'status', title: 'Status', width: '10%' },
      { key: 'remarks', title: 'Remarks', width: '10%' },
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }

  // onChange(name: string): void {
  //   this.tblData = this.tblDataCopy.filter(
  //     x => x.documentNo.toLowerCase().includes(name.toLowerCase()) ||
  //       x.documentDate.toString().includes(name.toLowerCase()) ||
  //       x.priceChangeDate.toString().includes(name.toLowerCase()) ||
  //       x.priceChangeType.toLowerCase().includes(name.toLowerCase())||
  //       //x.multipleCountry.toString().includes(name.toLowerCase())||
  //       x.sourceCountryCode.toLowerCase().includes(name.toLowerCase())||
  //       x.status.toLowerCase().includes(name.toLowerCase())
  //   );
  // }

  // getPriceChangeList() {
  //   //this.promotionList = null;
  //   //this.promotionListFilter = null;
  //   this.common.showSpinner();
  //   this.api.getAPI("PriceChange")
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           //this.json = new Array<MCountryMaster> ();
  //           //this.promotionList = data.promotionsList;
  //           //this.promotionListFilter = this.promotionList;
  //           this.tblData = data.responseDynamicData;
  //           this.tblDataCopy = data.responseDynamicData;
  //           for(let tb of this.tblData)
  //           {
  //             tb.documentDate = this.common.toYMDFormat(new Date(tb.documentDate));
  //             tb.priceChangeDate = this.common.toYMDFormat(new Date(tb.priceChangeDate));
  //           }

  //           for(let tbcpy of this.tblDataCopy)
  //           {
  //             tbcpy.documentDate = this.common.toYMDFormat(new Date(tbcpy.documentDate));
  //             tbcpy.priceChangeDate = this.common.toYMDFormat(new Date(tbcpy.priceChangeDate));
  //           }
  //           // this.json = data.countryMasterList;
  //           //// .log(this.json);
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
  // ngOnInit(): void {
  // }
  handleClick(status: string, id: number) {
     if (status == "Completed") {
       this.common.showMessage('warn', "You can't edit this, It's Already Completed");
     }
     else {
       this.router.navigate(['/price-change-edit/' + id.toString()]);
     }

  // }
  // changeGender(e) {
  //   //alert(e.target.value);
  //   if(e.target.value=='no')
  //   {
  //     this.tblData = this.tblDataCopy.filter(
  //       x => x.active==false
  //     );
  //   }
  //   else
  //   {
  //     this.tblData = this.tblDataCopy.filter(
  //       x => x.active==true
  //     );
  //   }
  }
}
