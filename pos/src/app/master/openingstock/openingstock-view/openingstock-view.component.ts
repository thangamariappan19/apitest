import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MOpeningstockdetailsMaster } from 'src/app/models/m-openingstockdetails-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MOpeningstockheadermaster } from 'src/app/models/m-openingstockheadermaster';
import { MTransactionLog } from 'src/app/models/m-transaction-log';

@Component({
  selector: 'app-openingstock-view',
  templateUrl: './openingstock-view.component.html',
  styleUrls: ['./openingstock-view.component.css']
})
export class OpeningstockViewComponent implements OnInit {
  myForm: FormGroup;
  user_details: MUserDetails = null;
  openStock:MOpeningstockheadermaster;
  openingstockDetails: Array<any>;
  openingstockList:Array<MOpeningstockdetailsMaster>;
  storename:string;  
  id: any;

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
      barCode: ['', Validators.required],
      storeid: ['', Validators.required],
      documentDate: ['', Validators.required],
      documentNo:['', Validators.required],
      quantity:[],
      totalqty:[],
      rem:['']
    });
    this.getStaticValues();
    this.openingstockDetails=new Array<any>();
    this.openStock = new MOpeningstockdetailsMaster;
    this.clear_controls();
  }
  clear_controls() {
      }
  
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);     
      this.storename=this.user_details.storeName;     
    }
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getOpeningStockDetails();
  }
  getOpeningStockDetails() {
    this.common.showSpinner();
    this.api.getAPI("openingstock?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.openingstockDetails = data.responseDynamicData;
            this.myForm.controls['barCode'].setValue('');
            this.myForm.controls['storeid'].setValue(this.storename);
            this.myForm.controls['documentDate'].setValue(this.common.toYMDFormat(new Date(data.responseDynamicData.documentDate)));
            this.myForm.controls['documentNo'].setValue(data.responseDynamicData.documentNo);
            this.myForm.controls['rem'].setValue(data.responseDynamicData.remarks);
            this.myForm.controls['totalqty'].setValue(data.responseDynamicData.totalQuantity);
            this.openingstockList=data.responseDynamicData.openingStockDetailsList;

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
    this.router.navigate(['openingstock']);
  }
}
