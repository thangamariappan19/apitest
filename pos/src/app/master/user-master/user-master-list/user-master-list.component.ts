import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation,ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserMaster } from 'src/app/models/m-user-master';
import { MRoleMaster } from 'src/app/models/m-role-master';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { EventObject } from 'src/app/models/event-object';

@Component({
  selector: 'app-user-master-list',
  templateUrl: './user-master-list.component.html',
  styleUrls: ['./user-master-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMasterListComponent implements OnInit {
  
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
    this.api.getAPI("usermaster?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.tblData = data.usersList;
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
      { key: 'Code', title: 'Code', width: '15%' }, // orderBy: 'desc' },
      { key: 'Name', title: 'Name', width: '25%' },
      { key: 'Employee Name', title: 'Employee Name', width: '25%' },
      { key: 'Role', title: 'Role', width: '20%' },
      { key: 'active', title: 'Active', width: '15%' }, //headerActionTemplate: this.levelHeaderActionTemplate },
      { key: '', title: '' },
    ];
    this.columns = this.columnsCopy;
  }

//   onChange(name: string): void {
//     this.tblData = this.tblDataCopy.filter(
//       x => x.userCode.toLowerCase().includes(name.toLowerCase()) ||
//         x.userName.toLowerCase().includes(name.toLowerCase()) ||
//         x.employeeName.toLowerCase().includes(name.toLowerCase()) ||
//         x.roleName.toLowerCase().includes(name.toLowerCase()) 
       
       
//     );
//   }
 
//   getUser() {
//     this.user = null;
//     this.common.showSpinner();
//     this.api.getAPI("usermaster")
//       .subscribe((data) => {
//         setTimeout(() => {
//           if (data != null && data.statusCode != null && data.statusCode == 1) {
//            // this.user = data.usersList;
//             //this.userListFilter = this.user;
//             //this.json = data.companySettingList;
//             //// console.log(this.json);
//             this.tblData = data.usersList;
//             this.tblDataCopy = data.usersList;
//           } else {
//             let msg: string = data != null
//               && data.displayMessage != null
//               && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
//             this.common.showMessage('warn', msg);
//           }
//           this.common.hideSpinner();
//         }, this.common.time_out_delay);
//       });
//   }

 
 
//   ngOnInit() {
//   }
//   getRoles() {
//     this.role_list = null;
//     this.common.showSpinner();
//     this.api.getAPI("role")
//       .subscribe((data) => {
//         setTimeout(() => {
//           if (data != null && data.statusCode != null && data.statusCode == 1) {
//             this.role_list = data.roleMasterList;
           
//           } else {
//             let msg: string = data != null
//               && data.displayMessage != null
//               && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
//             this.common.showMessage('warn', msg);
//           }
//           this.common.hideSpinner();
//         }, this.common.time_out_delay);
//       });
//   }
//   //filter() {
//    // let userCode = this.myForm.get('userCode').value;
//     //let userName = this.myForm.get('userName').value;
//    // let roleID = this.myForm.get('roleID').value;
    
//    // this.userListFilter = this.userListFilter;
//     //if (userCode != null && userCode != "")
//     //  this.userListFilter = this.userListFilter.filter(x => x.userCode.toLowerCase().includes(userCode.toLowerCase()));

//    // if (userName != null && userName != "")
//     //  this.userListFilter = this.userListFilter.filter(x => x.userName.toLowerCase().includes(userName.toLowerCase()));

//     //  if (roleID != null && roleID != "")
//     //  this.userListFilter = this.userListFilter.filter(x => x.roleName.toLowerCase().includes(roleID.toLowerCase()));

//  // }

}
