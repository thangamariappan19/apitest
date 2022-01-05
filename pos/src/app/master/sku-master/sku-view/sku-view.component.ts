import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MColorMaster } from 'src/app/models/m-color-master';
import { MDesignMaster } from 'src/app/models/m-design-master';
import { MItemImageMaster } from 'src/app/models/m-item-image-master';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MStyleMaster } from 'src/app/models/m-style-master';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PricepopupComponent } from '../../pricepopup/pricepopup.component';


@Component({
  selector: 'app-sku-view',
  templateUrl: './sku-view.component.html',
  styleUrls: ['./sku-view.component.css']
})
export class SkuViewComponent implements OnInit {

  myForm: FormGroup;
  id: any;
  brandName: any;
  active: any;
  priceList: Array<any>;
  collectionName: any;
  divisionName: any;
  productgroupName: any;
  currencyName: any;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      skuCode: [''],
      skuName: [''],      
      brand: [''],
      brandd: [''],
      subbrand: [''],
      collection: [''],
      armadaCollection: [''],
      division: [''],
      productGroup: [''],
      productSubGroup: [''],
      purchasePrice: [''],
      purchaseCurrency: [''],      
      active: [true],
      styleHead: ['']
    });    
    this.priceList=new Array<any>();
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSKUMasterData();
  }
  getBrand(brandID){
    this.common.showSpinner();
    this.api.getAPI("brand?id=" + brandID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            
            this.brandName=data.brandRecord.brandName;
            this.myForm.controls['brand'].setValue(this.brandName);
            this.myForm.controls['brandd'].setValue(this.brandName);
           
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getCollection(collectionID){
    this.common.showSpinner();
    this.api.getAPI("collection?id=" + collectionID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            
            this.collectionName=data.collectionMasterTypesData.collectionName;
            this.myForm.controls['collection'].setValue(this.collectionName);
           
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getDivision(divisionID){
    this.common.showSpinner();
    this.api.getAPI("division?id=" + divisionID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            
            this.divisionName=data.divisionRecord.divisionName;
            this.myForm.controls['division'].setValue(this.divisionName);
           
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getProductGroup(productGroupID){
    this.common.showSpinner();
    this.api.getAPI("productgroup?id=" + productGroupID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            
            this.productgroupName=data.productGroupData.productGroupName;
            this.myForm.controls['productGroup'].setValue(this.productgroupName);
           
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getCurrency(currencyID){
    this.common.showSpinner();
    this.api.getAPI("currency?id=" + currencyID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            
            this.currencyName=data.currencyMasterRecord.currencyName;
            this.myForm.controls['purchaseCurrency'].setValue(this.currencyName);
           
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getPriceList(styleCode){
    this.common.showSpinner();
    styleCode = styleCode.substring(0,12);
    this.api.getAPI("SKUPriceByCountry?skucode=" + styleCode)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
           
            this.priceList=data.stylePricingList;
            console.log(this.priceList);
                       
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getSKUMasterData() {
    this.common.showSpinner();
    this.api.getAPI("sku?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['skuCode'].setValue(data.skuMasterTypesData.skuCode);
            this.getPriceList(data.skuMasterTypesData.skuCode);
            this.myForm.controls['skuName'].setValue(data.skuMasterTypesData.skuName);
            this.myForm.controls['styleHead'].setValue(data.skuMasterTypesData.skuName);            
            if(data.skuMasterTypesData.active==true){
              this.active="ACTIVE";
            }else{
              this.active="INACTIVE";
            }
            this.myForm.controls['active'].setValue(this.active);
            this.getBrand(data.skuMasterTypesData.brandID);
            this.myForm.controls['subbrand'].setValue(data.skuMasterTypesData.subBrandID);
            this.getCollection(data.skuMasterTypesData.collectionID);
            this.myForm.controls['armadaCollection'].setValue(data.skuMasterTypesData.armadaCollectionID);
            this.getDivision(data.skuMasterTypesData.divisionID);
            this.getProductGroup(data.skuMasterTypesData.productGroupID);
            this.myForm.controls['productSubGroup'].setValue(data.skuMasterTypesData.productSubGroupID);
            this.myForm.controls['purchasePrice'].setValue(data.skuMasterTypesData.purchasePrice);
            this.getCurrency(data.skuMasterTypesData.purchaseCurrencyID);

            
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
  openPriceDialog(): void {
    const disDialogRef = this.dialog.open(PricepopupComponent, {
      width: '5000px',
      data: {        
        priceListData: this.priceList
      }
    });
  }
}
