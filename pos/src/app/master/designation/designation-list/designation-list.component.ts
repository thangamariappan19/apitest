import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation ,ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MDesignationMaster } from 'src/app/models/m-designation-master';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { EventObject } from 'src/app/models/event-object';
@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.css']
})
export class DesignationListComponent implements OnInit {
  designationList: Array<MDesignationMaster>;
  designation_Filter: Array<MDesignationMaster>;
  RoleList: Array<any>;
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
    this.api.getAPI("designation?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.tblData = data.designationMasterList;
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
    //this.createForm();
  }
 /* createForm() {
    //this.myForm = this.fb.group({
      //designationCode: [''],
      //designationName: [''],
      //RoleID: ['']
    //});
    this.dataTableDefault();
    this.getRoleMasterList();
    this.getDesignationList();
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
      { key: 'designationCode', title: 'Designation Code', width: '15%' }, // orderBy: 'desc' },
      { key: 'designationName', title: 'Designation Name', width: '25%' },
      { key: 'roleCode', title: 'Role Code', width: '15%' }, 
      { key: 'description', title: 'Description', width: '15%' },
      { key: 'remarks', title: 'Remarks', width: '15%' },
      { key: 'active', title: 'Active', width: '15%' }, //headerActionTemplate: this.levelHeaderActionTemplate },
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }
  /*onChange(name: string): void {
    this.tblData = this.tblDataCopy.filter(
      x => x.designationCode.toLowerCase().includes(name.toLowerCase()) ||
        x.designationName.toLowerCase().includes(name.toLowerCase()) ||
        x.roleCode.toLowerCase().includes(name.toLowerCase()) ||
        x.description.toLowerCase().includes(name.toLowerCase()) ||
        x.remarks.toLowerCase().includes(name.toLowerCase())
    );
  }*/

  //clear_controls() {
    //this.designation_Filter = this.designationList;
    //this.myForm.controls['designationCode'].setValue('');
    //this.myForm.controls['designationName'].setValue('');
    //this.myForm.controls['RoleID'].setValue('');
 // }

  /*getDesignationList() {
    this.designationList = null;
    this.designation_Filter = null;
    this.common.showSpinner();
    this.api.getAPI("designation")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
           // this.designationList = data.designationMasterList;
           // this.designation_Filter = this.designationList;
            this.tblData = data.designationMasterList;
            this.tblDataCopy = data.designationMasterList;
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

  
 /* getRoleMasterList() {
    this.RoleList = null;
    this.common.showSpinner();
    this.api.getAPI("role")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.RoleList = data.roleMasterList;
           // .log(this.RoleList);
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
}
