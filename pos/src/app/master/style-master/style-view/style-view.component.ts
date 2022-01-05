import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MDesignMaster } from 'src/app/models/m-design-master';
import { MStyleMaster } from 'src/app/models/m-style-master';
import { MItemImageMaster } from 'src/app/models/m-item-image-master';
import { MColorMaster } from 'src/app/models/m-color-master';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { ColorEditComponent } from '../../color/color-edit/color-edit.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PricepopupComponent } from '../../pricepopup/pricepopup.component';
import { MScaleMaster } from 'src/app/models/m-scale-master';

@Component({
  selector: 'app-style-view',
  templateUrl: './style-view.component.html',
  styleUrls: ['./style-view.component.css']
})
export class StyleViewComponent implements OnInit {

  myForm: FormGroup;
  id: any;
  current_store_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";
  itemImage: string = "assets/img/preview-image.png";
  brandName: any;
  active: any;
  styleSegmentation: any;
  collectionName: any;
  designerName: any;
  scaleDetailList:Array<any>;
  scaleMasterList:Array<any>;
  colorList:Array<any>;
  tempcolorMaster:Array<any>;
  priceList:Array<any>;


  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { this.createForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      styleCode: [''],
      styleName: [''],
      scaleID:[''],
      active: [''],
      brand: [''],
      designCode: [''],
      designName: [''],
      shortDesignCode: [''],
      styleSegmentation: [''],
      productDeptCode: [''],
      countryOfOrigin: [''],
      subBrand: [''],
      collection: [''],
      designer: [''],
      shortDescription: [''],
      styleHead: ['']      

    });
    this.scaleDetailList=new Array<any>();
    this.scaleMasterList=new Array<any>();
    this.colorList=new Array<any>();
    this.tempcolorMaster=new Array<any>();
    this.priceList=new Array<any>();
    this.getScaleList();
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStyleList();
  }

  getBrand(brandID){
    this.common.showSpinner();
    this.api.getAPI("brand?id=" + brandID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            
            this.brandName=data.brandRecord.brandName;
            this.myForm.controls['brand'].setValue(this.brandName);
           
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

  getStyleSegmentation(ssID){
    this.common.showSpinner();
    this.api.getAPI("StyleSegmentation?id=" + ssID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
           
            this.styleSegmentation=data.afSegamationMasterTypesData.afSegamationName;
            this.myForm.controls['styleSegmentation'].setValue(this.styleSegmentation);
           
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
  getScaleList() {
    this.scaleMasterList = null;
    this.common.showSpinner();
    this.api.getAPI("scale")
      .subscribe((data) => {
        setTimeout(() => {
          console.log(data);
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.scaleMasterList = data.responseDynamicData;
            // this.json = data.countryMasterList;
            //// .log(this.json);
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
  getCollection(cID){
    this.common.showSpinner();
    this.api.getAPI("collection?id=" + cID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
           
            this.collectionName=data.collectionMasterTypesData.collectionName;
            this.myForm.controls['collection'].setValue(this.collectionName);
           
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

  getDesigner(dID){
    this.common.showSpinner();
    this.api.getAPI("Employee?id=" + dID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
           
            this.designerName=data.employeeMasterRecord.employeeName;
            this.myForm.controls['designer'].setValue(this.designerName);
           
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

  getPriceList(styleCode){
    this.common.showSpinner();
    this.api.getAPI("SKUPriceByCountry?skucode=" + styleCode)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
           
            this.priceList=data.stylePricingList;
            console.log(this.priceList);
                       
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

  scaleDetails()
  {
    this.scaleDetailList=null;
    this.common.showSpinner();
    this.api.getAPI("scale?id="+this.myForm.get('scaleID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.scaleDetailList = data.scaleRecord.scaleDetailMasterList;
            for(let scale of this.scaleDetailList)
            {
              scale.active=false;
            }
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
  getcolorList() {
    this.colorList = null;
    this.common.showSpinner();
    this.api.getAPI("color")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.colorList = data.responseDynamicData;
            for(let color of this.colorList)
            {
              color.active=false;
              color.colorID=color.id;
            }
            this.colorvisible();
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
  colorvisible(){
    for(let clr of this.colorList)
    {
      clr.active=false;
    }
    for(let colorList of this.colorList)
    {
      for(let tempcolor of this.tempcolorMaster)
      {
        if(colorList.id ==tempcolor.colorID && tempcolor.active==true)
        {
          colorList.active=true;
          break;
        }
        /*else
        {
          colorList.active=false;
        }*/
      }
    }
  }

  getStyleList(){
    this.common.showSpinner();
    this.api.getAPI("stylemaster?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            console.log(data);
            this.getBrand(data.responseDynamicData.brandID);  
            this.getPriceList(data.responseDynamicData.styleCode);          
            this.myForm.controls['styleCode'].setValue(data.responseDynamicData.styleCode);
            this.myForm.controls['styleName'].setValue(data.responseDynamicData.styleName);
            this.myForm.controls['styleHead'].setValue(data.responseDynamicData.styleName);
            if(data.responseDynamicData.active==true){
              this.active="ACTIVE";
            }else{
              this.active="INACTIVE";
            }
            this.myForm.controls['active'].setValue(this.active);

            this.myForm.controls['designCode'].setValue(data.responseDynamicData.designID);
            this.myForm.controls['designName'].setValue(data.responseDynamicData.designName);            
            this.myForm.controls['shortDesignCode'].setValue(data.responseDynamicData.shortDesignName);
            this.getStyleSegmentation(data.responseDynamicData.styleSegmentation);
            this.myForm.controls['productDeptCode'].setValue(data.responseDynamicData.productDepartmentCode);
            this.myForm.controls['countryOfOrigin'].setValue(data.responseDynamicData.countryOfOrigin);
            this.myForm.controls['subBrand'].setValue(data.responseDynamicData.subBrandID);
            this.getCollection(data.responseDynamicData.collectionID);
            this.getDesigner(data.responseDynamicData.designerID);
            this.myForm.controls['shortDescription'].setValue(data.responseDynamicData.shortDescriptionn);

            this.itemImage = data.responseDynamicData.itemImageMasterList[0].skuImage == null || data.responseDynamicData.itemImageMasterList[0].skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.responseDynamicData.itemImageMasterList[0].skuImage;
            this.myForm.controls['scaleID'].setValue(data.responseDynamicData.scaleID);
            this.scaleDetailList=data.responseDynamicData.scaleDetailMasterList;
            this.tempcolorMaster = data.responseDynamicData.colorMasterList;

            this.getcolorList();

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
  close(){
    this.router.navigate(['style']);
  }
}
