import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router,ActivatedRoute } from '@angular/router';
import { MInventorycountingheaderMaster } from 'src/app/models/m-inventorycountingheader-master';
import { MInventorycountingdetailsMaster, MInventoryInit } from 'src/app/models/m-inventorycountingdetails-master';
import { MSystemStock } from 'src/app/models/m-inventorycountingdetails-master';
import { MInventorySysCount } from 'src/app/models/m-inventorycountingdetails-master';
import { MDocumentNumbering } from 'src/app/models/m-document-numbering';
import { MUserDetails } from 'src/app/models/m-user-details';
import { promise } from 'protractor';
import { rejects } from 'assert';
import { start } from 'repl';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';


@Component({
  selector: 'app-inventory-counting-view',
  templateUrl: './inventory-counting-view.component.html',
  styleUrls: ['./inventory-counting-view.component.css']
})
export class InventoryCountingViewComponent implements OnInit {

  myForm: FormGroup;
  inventoryCounting:MInventorycountingheaderMaster;
  inventoryCountinglist: Array<MInventorycountingdetailsMaster>;
  documentnumberinglist:Array<MDocumentNumbering>;
  inventorySystemStockList:Array<MInventorySysCount>;
  user_details: MUserDetails = null;
  userid:number;
  storeid:number;
  storename:string;
  storecode:string;
  documenttypeid:number;
  businessdate:any;
  runningNo:number;
  detailID:number;
  stockQuantity:number=0;
  start_index:number;
  limit:number;
  TotalCount:number;
  mInventorysyscount:Array<MInventorySysCount>;
  docnumid:number;
  id:any;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router:Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute

  ) {  this.createForm();}
  createForm() {
    this.myForm = this.fb.group({
      documentDate: ['', Validators.required],
      documentNo:['', Validators.required],
      remarks:[],
      totqty:[]
      
    });
    this.inventoryCountinglist=new Array<MInventorycountingdetailsMaster>();
    this.inventoryCounting = new MInventorycountingheaderMaster;
    this.inventorySystemStockList=new Array<MInventorySysCount>();
    // this.getStaticValues();
    // this.getDocumentNumber();   
    this.myForm.controls['totqty'].setValue("Total : "+0);
  }

//  this.id = this.activatedRoute.snapshot.paramMap.get('id');
  ngOnInit(): void {
    this.getInventoryCountingRecord();
  }
  getInventoryCountingRecord()
  {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.common.showSpinner();
    this.api.getAPI("inventorycounting?id="+ this.id +"&view="+'').subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.inventorySystemStockList=data.responseDynamicData.inventoryCountingDetailList;
            this.myForm.controls['documentNo'].setValue(data.responseDynamicData.documentNumber );
            this.myForm.controls['documentDate'].setValue(this.common.toDMYFormat(data.responseDynamicData.documentDate));
        
        } else {
          let msg: string =
            data != null &&
            data.displayMessage != null &&
            data.displayMessage != ""
              ? data.displayMessage
              : "Failed to retrieve Data.";
          this.common.showMessage("warn", msg);
        }
        this.common.hideSpinner();
      }, this.common.time_out_delay);
    });
  }
  getStoctList()
  {

  }
  Close(){
    if (confirm("Are You Sure You want to close the On inventory counting?")) 
    {
      
      this.router.navigate(['inventory-counting']);
    }
  }
  Freeze_Stock()
  {

  }
}
