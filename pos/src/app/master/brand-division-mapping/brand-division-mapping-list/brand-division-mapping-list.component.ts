import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation,ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MBrandMaster } from 'src/app/models/m-brand-master';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-brand-division-mapping-list',
  templateUrl: './brand-division-mapping-list.component.html',
  styleUrls: ['./brand-division-mapping-list.component.css']
})
export class BrandDivisionMappingListComponent implements OnInit {
  brandDivisionMappingList: Array<MBrandMaster>;
  brandDivisionMapping_Filter: Array<MBrandMaster>;
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
    this.api.getAPI("brand?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
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



  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    private readonly cdr: ChangeDetectorRef,
    public router: Router
  ) {
    //this.createForm();
  }
  /*createForm() {
    this.myForm = this.fb.group({
      brandCode: [''],
      brandName: ['']
    });
    this.dataTableDefault();
    this.getBrandList();
    this.clear_controls();
  }

  clear_controls() {
    this.brandDivisionMapping_Filter = this.brandDivisionMappingList;
    this.myForm.controls['brandCode'].setValue('');
    this.myForm.controls['brandName'].setValue('');
  } */
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
      { key: 'brandCode', title: 'Brand Code', width: '40%' }, // orderBy: 'desc' },
      { key: 'brandName', title: 'Brand Name', width: '40%' },
      { key: 'active', title: 'Active', width: '20%' }, //headerActionTemplate: this.levelHeaderActionTemplate },
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }

  /*onChange(name: string): void {
    this.tblData = this.tblDataCopy.filter(
      x => x.brandCode.toLowerCase().includes(name.toLowerCase()) ||
        x.brandName.toLowerCase().includes(name.toLowerCase()) 
    );
  }*/

  ngOnInit(): void {
    this.dataTableDefault();
    this.pageData = null;
    this.getData();
  }
  /*getBrandList() {
    this.brandDivisionMappingList = null;
    this.brandDivisionMapping_Filter = null;
    this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.brandDivisionMappingList = data.responseDynamicData;
           // this.brandDivisionMapping_Filter = this.brandDivisionMappingList;
           // this.brandDivisionMapping_Filter = this.brandDivisionMapping_Filter.filter(x => x.active == true);
            // this.json = data.countryMasterList;
            //// .log(this.json);
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
  filter() {
    let brandCode = this.myForm.get('brandCode').value;
    let brandName = this.myForm.get('brandName').value;

    this.brandDivisionMapping_Filter = this.brandDivisionMappingList;

    if (brandCode != null && brandCode != "")
      this.brandDivisionMapping_Filter = this.brandDivisionMapping_Filter.filter(x => x.brandCode.toLowerCase().includes(brandCode.toLowerCase()));

    if (brandName != null && brandName != "")
      this.brandDivisionMapping_Filter = this.brandDivisionMapping_Filter.filter(x => x.brandName.toLowerCase().includes(brandName.toLowerCase()));
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
