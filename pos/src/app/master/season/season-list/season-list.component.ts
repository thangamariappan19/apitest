import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation,ChangeDetectorRef } from '@angular/core';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MSeasonMaster } from 'src/app/models/m-season-master';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.css']
})
export class SeasonListComponent implements OnInit {

  json: Array<any>;
  season: Array<MSeasonMaster>;
  season_Filter: Array<MSeasonMaster>;
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
    this.api.getAPI("season?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.tblData = data.seasonMasterList;
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
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.createForm();
   }
   createForm() {

    this.myForm = this.fb.group({
      seasonCode: [''],
      seasonName: [''],
      seasonDrop: [''],
      seasonStartDate:[''],
      seasonEndDate:[''],
      noOfWeeks:[''],
      noOfDays:[''],
      active: [false]
    });
    this.dataTableDefault();
    //this.getSeason();
    //this.clear_controls();
  }

  clear_controls(){
    this.myForm.controls['seasonCode'].setValue('');
    this.myForm.controls['seasonName'].setValue('');
    this.myForm.controls['seasonDrop'].setValue('');
    this.season_Filter = this.season;
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
      { key: 'seasonCode', title: 'Season Code', width: '20%' },
      { key: 'seasonName', title: 'Season Name', width: '20%' },      
      { key: 'seasonDrop', title: 'Season Drop', width: '10%' },
      { key: 'seasonStartDate', title: 'Start Date', width: '10%' },
      { key: 'seasonEndDate', title: 'End Date', width: '10%' },
      { key: 'noOfWeeks', title: 'No of Weeks', width: '10%' },
      { key: 'noOfDays', title: 'No of Days', width: '10%' },
      { key: 'active', title: 'Active', width: '10%' },
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }

  onChange(name: string): void {
    this.tblData = this.tblDataCopy.filter(
      x => x.seasonCode.toLowerCase().includes(name.toLowerCase()) ||
        x.seasonName.toLowerCase().includes(name.toLowerCase()) ||
        x.seasonStartDate.toString().includes(name.toString()) ||
        x.seasonEndDate.toString().includes(name.toString())  ||
        x.seasonDrop.toString().includes(name.toString()) ||
        x.noOfWeeks.toString().includes(name.toString()) ||
        x.noOfDays.toString().includes(name.toString())
    );
  }
  getSeason(){
    this.season = null;
    this.season_Filter=null;
    this.common.showSpinner();
    this.api.getAPI("season")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.season = data.seasonMasterList;
            //this.season_Filter = this.season;
            this.tblData = data.seasonMasterList;
            this.tblDataCopy = data.seasonMasterList;         
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  ngOnInit() {
    this.dataTableDefault();
    this.pageData = null;
    this.getData();
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
