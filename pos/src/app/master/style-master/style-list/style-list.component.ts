import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, Inject } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MStyleMaster } from 'src/app/models/m-style-master';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { EventObject } from 'src/app/models/event-object';
import { MItemImageMaster } from 'src/app/models/m-item-image-master';


@Component({
  selector: 'app-style-list',
  templateUrl: './style-list.component.html',
  styleUrls: ['./style-list.component.css']
})
export class StyleListComponent implements OnInit {
  slides = [{ 'image': 'assets/img/ST4.jpg' }, { 'image': 'assets/img/ST5.jpg' }];
  recordCount: number;
  styleMasterList: Array<MStyleMaster>;
  styleMaster_Filter: Array<MStyleMaster>;
  myForm: FormGroup;
  isShow: Boolean = false;
  isShowList: Boolean = true;
  temp_image: string = "assets/img/preview-image.png";
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
    if (this.pagination.limit != obj.value.limit) {
      limit_changed = true;
      this.pageData = null;
    }
    this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
    this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
    this.pagination = { ...this.pagination };
    // const params = `_limit=${this.pagination.limit}&_page=${this.pagination.offset}`; // see https://github.com/typicode/json-server
    let pageExists: boolean = false;
    if (limit_changed == false) {
      if (this.pageData != null && this.pageData.length > 0) {
        let pd = this.pageData.filter(x => x.pageNo == this.pagination.offset);
        if (pd != null && pd.length > 0 && pd[0].items != null && pd[0].items.length > 0) {
          this.tblData = pd[0].items;
          pageExists = true;
          this.pagination = { ...this.pagination };
          this.cdr.detectChanges();
        }
      }
    }

    if (pageExists == false) {
      this.getData();
    }

  }

  CardVieweventEmitted($event: { event: string; value: any }): void {
    if ($event.event !== 'onClick') {
      this.CardViewparseEvent($event);
    }
  }

  private CardViewparseEvent(obj: any): void {
    //console.log(obj);

    var value = {
      page: parseInt(obj.pageIndex) + 1,
      limit: parseInt(obj.pageSize)
    }
    let newObj: EventObject = {
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
    // this.configuration.isLoading = true;
    this.api.getAPI("stylemaster?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + this.isActive + "&searchString=" + this.searchString)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.tblData = data.styleList;
            this.styleMasterList = data.styleList;
            this.recordCount = data.recordCount;
            for (let sty of this.styleMasterList) {
              if (sty.itemImageMasterList.length != 0) {
                for (let img of sty.itemImageMasterList) {
                  img.skuImage = img.skuImage == null || img.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + img.skuImage;
                }
              }
              else {
                let tempimage: MItemImageMaster = {
                  id: 0,
                  styleID: sty.id,
                  skuImage: null,
                }
                sty.itemImageMasterList.push(tempimage);
              }
              for (let clr of sty.colorMasterList) {
                if (clr.colors <= 0) {
                  clr.shade = null;
                }
                else {
                  clr.shade = "#" + (clr.colors).toString(16)
                }
              }
            }
            this.tblData = this.styleMasterList;
            this.pagination.count = data.recordCount == null ? 0 : data.recordCount;
            this.pagination = { ...this.pagination };
            if (this.pageData == null) {
              this.pageData = new Array<any>();
            }
            this.pageData.push({
              "pageNo": this.pagination.offset == 0 ? 1 : this.pagination.offset,
              "items": this.tblData
            });
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

  search_click() {
    this.pagination.limit = this.pagination.limit;
    this.pagination.offset = 0;
    this.pagination = { ...this.pagination };
    this.pageData = null;
    this.getData();
  }

  clear_search() {
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
      code: [''],
      name: ['']
    });
    this.dataTableDefault();
    //this.getStyleList();
    //this.clear_controls();
  }

  clear_controls() {
    this.myForm.controls['code'].setValue('');
    this.myForm.controls['name'].setValue('');
    this.styleMaster_Filter = this.styleMasterList;
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
      { key: '', title: 'Products', width: '20%' }, // orderBy: 'desc' },
      { key: 'styleCode', title: 'Style Code', width: '20%' }, // orderBy: 'desc' },
      // { key: 'styleName', title: 'style Name', width: '35%' },
      { key: 'styleName', title: 'Season', width: '20%' },
      { key: 'styleName', title: 'Size', width: '20%' },
      /*{ key: 'styleName', title: 'Stock', width: '10%' },*/
      { key: 'active', title: 'Color', width: '20%' }, //headerActionTemplate: this.levelHeaderActionTemplate },
      { key: '', title: '', width: '20%' },
    ];
    this.columns = this.columnsCopy;
  }

  onChange(name: string): void {
    this.tblData = this.tblDataCopy.filter(
      x => x.styleCode.toLowerCase().includes(name.toLowerCase()) ||
        x.styleName.toLowerCase().includes(name.toLowerCase())

    );
  }
  getStyleList() {
    this.styleMasterList = new Array<MStyleMaster>();
    this.styleMaster_Filter = null;
    this.common.showSpinner();
    this.api.getAPI("stylemaster")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.styleMasterList = data.styleList;
            console.log(this.styleMasterList);
            // this.styleMaster_Filter = this.styleMasterList;
            for (let sty of this.styleMasterList) {
              if (sty.itemImageMasterList.length != 0) {
                for (let img of sty.itemImageMasterList) {
                  img.skuImage = img.skuImage == null || img.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + img.skuImage;
                }

              }
              else {

              }
              for (let clr of sty.colorMasterList) {
                if (clr.colors <= 0) {
                  clr.shade = null;
                }
                else {
                  clr.shade = "#" + (clr.colors).toString(16)
                }
              }
            }
            this.tblData = this.styleMasterList;
            this.tblDataCopy = this.styleMasterList;
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
  ngOnInit(): void {
    this.dataTableDefault();
    this.pageData = null;
    this.getData();
  }

  GridDisplay(e) {
    //alert(e.target.value);
    if (e.target.value == 'no') {
      this.isShow = true;
      this.isShowList = false;
    }
    else {
      this.isShow = false;
      this.isShowList = true;
    }
  }
  onPageChange($event) {
    this.tblData = this.tblDataCopy.slice($event.pageIndex * $event.pageSize, $event.pageIndex * $event.pageSize + $event.pageSize);
  }
  refresh_click() {
    window.location.reload();
  }

}
