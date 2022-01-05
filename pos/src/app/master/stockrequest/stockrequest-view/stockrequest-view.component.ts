import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MOpeningstockdetailsMaster } from 'src/app/models/m-openingstockdetails-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MStockheaderMaster } from 'src/app/models/m-stockheader-master';
import { MStockrequestMaster } from 'src/app/models/m-stockrequest-master';

@Component({
  selector: 'app-stockrequest-view',
  templateUrl: './stockrequest-view.component.html',
  styleUrls: ['./stockrequest-view.component.css']
})
export class StockrequestViewComponent implements OnInit {
  myForm: FormGroup;
  user_details: MUserDetails = null;
  stockrequest:MStockheaderMaster;
  stockrequestDetails: Array<any>;
  stockrequestList:Array<MStockrequestMaster>;
  wareHouseList:Array<any>;
  storename:string;  
  id: any;
  countryid:number;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      barCode: [''],
      fromstore: [''],
      documentDate: [''],
      documentNo:[''],
      status:[''],
      toWareHouse:[''],
      quantity:[],
      totalqty:[],
      rem:['']
    });
    this.getStaticValues();
    this.getWarehouse();
    this.stockrequestDetails=new Array<any>();
    this.stockrequest = new MOpeningstockdetailsMaster;
    this.clear_controls();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      
    }
  }
  clear_controls() {
      }
  
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);     
      this.storename=this.user_details.storeName;  
      this.countryid=this.user_details.countryID;
    }
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStockRequestDetails();
  }
  getWarehouse()
  {
    this.common.showSpinner();
    this.api.getAPI("WarehouseLookUp?countryid="+ this.countryid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {         
            this.wareHouseList = data.warehouseMasterList;          
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getStockRequestDetails() {
    this.common.showSpinner();
    this.api.getAPI("stockrequest?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.stockrequestDetails = data.stockRequestDetailsRecord;
            this.myForm.controls['barCode'].setValue('');
          //  this.myForm.controls['fromstore'].setValue(data.responseDynamicData.fromStore);
           // this.storename=this.user_details.storeName;
            this.myForm.controls['fromstore'].setValue(this.user_details.storeName);
            this.myForm.controls['documentDate'].setValue(this.common.toYMDFormat(new Date(data.responseDynamicData.documentDate)));
            this.myForm.controls['documentNo'].setValue(data.responseDynamicData.documentNo);
            this.myForm.controls['toWareHouse'].setValue(data.responseDynamicData.wareHouseID);
            this.myForm.controls['status'].setValue(data.responseDynamicData.status);
            this.myForm.controls['rem'].setValue(data.responseDynamicData.remarks);
            this.myForm.controls['totalqty'].setValue(data.responseDynamicData.totalQuantity);
            this.stockrequestList=data.responseDynamicData.stockRequestDetailsList;

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
  close() {
    this.router.navigate(['stockrequest']);
  }
}
