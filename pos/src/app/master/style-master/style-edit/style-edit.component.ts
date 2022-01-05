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
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';

@Component({
  selector: 'app-style-edit',
  templateUrl: './style-edit.component.html',
  styleUrls: ['./style-edit.component.css']
})
export class StyleEditComponent implements OnInit {
  myForm: FormGroup;
  id: any;
  tempcolorMaster: Array<any>;
  styleMaster:MStyleMaster;
  skuMasterList:Array<MSkuMasterTypes>;
  itemImageList:Array<MItemImageMaster>;
  designList: Array<MDesignMaster>;
  styleId:any;
  armadaCollectionList: Array<any>;
  styleSegmentList: Array<any>;
  brandList: Array<any>;
  subBrandList: Array<any>;
  collectionList: Array<any>;
  statusList: Array<any>;
  employeeList: Array<any>;
  priceList: Array<any>;
  pricecurrencyList: Array<any>;
  productGroupList: Array<any>;
  productSubGroupList: Array<any>;
  seasonList: Array<any>;
  yearList: Array<any>;
  divisionList: Array<any>;
  productLineList: Array<any>;
  dropList: Array<any>;
  developmentOfficeList: Array<any>;
  itemImage:any;
  scaleMasterList:Array<any>;
  scaleDetailList:Array<any>;
  colorList:Array<MColorMaster>;
  brandCode:any;
  divisionCode:any;
  productGroupCode:any;
  yearCode:any;
  designCode:any;
  subBrandCode:any;
  collectionCode:any;
  armadaCollectionCode:any;
  seasonCode:any;
  productLineCode:any;
  styleStatusCode:any;
  designerCode:any;
  purchasePriceListCode:any;
  purchasePriceCurrencyCode:any;
  rrpCurrencyCode:any;
  scaleCode:any;
  segmentationCode:any;
  productSubGroupCode:any;
  productCode:any;
  current_store_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      designCode: ['', Validators.required],
      designName: ['', Validators.required],
      styleCode: ['', Validators.required],
      styleName: [''],
      scaleID:[''],
      styleSegmentation: [''],
      productDeptCode: [''],
      shortDesignCode: [''],
      brand: [''],
      subBrand: [''],
      collection: [''],
      armadaCollection: ['',[Validators.required, Validators.min(1)]],
      status: [''],
      exchangeRate: [''],
      designer: [''],
      purchasePriceList: [''],
      purchasePrice: [''],
      purchaseCurrency: [''],
      composition: [''],
      symbolGroup: [''],
      owner: [''],
      countryOfOrigin: [''],
      shortDescription: [''],
      productGroup: [''],
      productSubGroup: [''],
      season: [''],
      year: [''],
      division: [''],
      productLine: [''],
      rrpCurrency: [''],
      rrpPrice: [''],
      drop: [''],
      grade: [''],
      salesType: [''],
      developmentOffice: [''],
      arabicStyleDescription: [''],
      active: [true],
      franchise: [false]
    });
    this.getArmadaCollection();
    this.getDesignList();
    this.getDesigner();
    this.getDevelopmentOffice();
    this.getPriceCurrency();
    this.getbrand();
    this.getdivision();
    this.getproductGroup();
    this.getproductLine();
    //this.getproductSubGroup();
    this.getseason();
    this.getstylesegmentation();
    this.getstylestatus();
    this.getyear();
    this.getCollection();
    this.getstylestatus();
    this.getdrop();
    this.getPriceList();
    this.getScaleList();
   // this.getcolorList();
  //  this.getloadData();
    this.styleMaster = new MStyleMaster();
    this.itemImageList= new Array<MItemImageMaster>();
  }

  getloadData()
  {
    this.common.showSpinner();
    this.getArmadaCollection1()
    .then((data1:any) => {
      let calls: Array<any>;
      calls = new Array<any>();
  
      calls.push(this.api.getAPI("designmaster"));
      calls.push(this.api.getAPI("EmployeeMasterLookUp"));
      calls.push(this.api.getAPI("DevelopmentOfficeLookUp"));
      calls.push(this.api.getAPI("currency"));
      calls.push(this.api.getAPI("brand"));
      calls.push(this.api.getAPI("division"));
      calls.push(this.api.getAPI("productgroup"));
      calls.push(this.api.getAPI("productline"));
      calls.push(this.api.getAPI("season"));
      calls.push(this.api.getAPI("stylesegmentation"));
      calls.push(this.api.getAPI("stylestatus"));
      calls.push(this.api.getAPI("year"));
      calls.push(this.api.getAPI("collection"));
      calls.push(this.api.getAPI("drop"));
      calls.push(this.api.getAPI("PurchasePriceListMasterLookUp"));
      calls.push(this.api.getAPI("scale"));
      // calls.push(this.api.getAPI("scale"));
      

      forkJoin(calls).subscribe((result:Array<any>)=>{
        this.common.hideSpinner();
        if(result != null && result.length > 0){
          console.log(result);
          for(let data of result)
          {
            if (data != null && data.statusCode != null && data.statusCode == 1) { 
               if(this.designList == null){
                this.designList = new Array<MDesignMaster>();
              }
              if(data.designMasterTypesList != null && data.designMasterTypesList.length > 0){

                  for(let item of data.designMasterTypesList){
                    this.designList.push(item);
                  }
                 }
                 if(this.employeeList == null){
                  this.employeeList = new Array<any>();
                }
                 if(data.employeeList != null && data.employeeList.length > 0){
                  for(let item of data.employeeList){
                    if(item.roleName == "Designer")
                    {
                    this.employeeList.push(item);
                    }
                  }
                 }
                 if(this.developmentOfficeList == null){
                  this.developmentOfficeList = new Array<any>();
                }
                 if(data.developmentOfficeList != null && data.developmentOfficeList.length > 0){
                  for(let item of data.developmentOfficeList){
                    this.developmentOfficeList.push(item);
                  }
                 }
                 if(this.pricecurrencyList == null){
                  this.pricecurrencyList = new Array<any>();
                }
                 if(data.pricecurrencyList != null && data.pricecurrencyList.length > 0){
                  for(let item of data.pricecurrencyList){
                    this.pricecurrencyList.push(item);
                  }
                 }
                 if(this.brandList == null){
                  this.brandList = new Array<any>();
                }
                 if(data.brandList != null && data.brandList.length > 0){
                  for(let item of data.brandList){
                    this.brandList.push(item);
                  }
                 }
                 if(this.divisionList == null){
                  this.divisionList = new Array<any>();
                }
                 if(data.divisionList != null && data.divisionList.length > 0){
                  for(let item of data.divisionList){
                    this.divisionList.push(item);
                  }
                 }
                 if(this.productGroupList == null){
                  this.productGroupList = new Array<any>();
                }
                 if(data.productGroupList != null && data.productGroupList.length > 0){
                  for(let item of data.productGroupList){
                    this.productGroupList.push(item);
                  }
                 }
                 if(this.productLineList == null){
                  this.productLineList = new Array<any>();
                }
                 if(data.productLineList != null && data.productLineList.length > 0){
                  for(let item of data.productLineList){
                    this.productLineList.push(item);
                  }
                 }
                 if(this.productSubGroupList == null){
                  this.productSubGroupList = new Array<any>();
                }
                 if(data.productSubGroupList != null && data.productSubGroupList.length > 0){
                  for(let item of data.productSubGroupList){
                    this.productSubGroupList.push(item);
                  }
                 }
                 if(this.seasonList == null){
                  this.seasonList = new Array<any>();
                }
                 if(data.seasonList != null && data.seasonList.length > 0){
                  for(let item of data.seasonList){
                    this.seasonList.push(item);
                  }
                 }
                 if(this.styleSegmentList == null){
                  this.styleSegmentList = new Array<any>();
                }
                 if(data.styleSegmentList != null && data.styleSegmentList.length > 0){
                  for(let item of data.styleSegmentList){
                    this.styleSegmentList.push(item);
                  }
                 }
                 if(this.statusList == null){
                  this.statusList = new Array<any>();
                }
                 if(data.statusList != null && data.statusList.length > 0){
                  for(let item of data.statusList){
                    this.statusList.push(item);
                  }
                 }

                 if(this.statusList == null){
                  this.statusList = new Array<any>();
                }
                 if(data.statusList != null && data.statusList.length > 0){
                  for(let item of data.statusList){
                    this.statusList.push(item);
                  }
                 }

                 if(this.yearList == null){
                  this.yearList = new Array<any>();
                }
                 if(data.yearList != null && data.yearList.length > 0){
                  for(let item of data.yearList){
                    this.yearList.push(item);
                  }
                 }

                 if(this.collectionList == null){
                  this.collectionList = new Array<any>();
                }
                 if(data.collectionMasterTypesList != null && data.collectionMasterTypesList.length > 0){
                  for(let item of data.collectionMasterTypesList){
                    this.collectionList.push(item);
                  }
                 }

                 if(this.dropList == null){
                  this.dropList = new Array<any>();
                }
                 if(data.dropMasterTypesList != null && data.dropMasterTypesList.length > 0){
                  for(let item of data.dropMasterTypesList){
                    this.dropList.push(item);
                  }
                 }
                 if(this.priceList == null){
                  this.priceList = new Array<any>();
                }
                 if(data.priceListTypeData != null && data.priceListTypeData.length > 0){
                  for(let item of data.priceListTypeData){
                    this.priceList.push(item);
                  }
                 }

                 if(this.scaleMasterList == null){
                  this.scaleMasterList = new Array<any>();
                }
                 if(data.scaleList != null && data.scaleList.length > 0){
                  for(let item of data.scaleList){
                    this.scaleMasterList.push(item);
                  }
                 }
              // this.designList = data.designMasterTypesList;
              // this.employeeList = data.employeeList;
              // this.developmentOfficeList = data.designDevelopmentOfficeList;
              // this.pricecurrencyList = data.currencyMasterList;
              // this.brandList = data.brandList;
              // this.divisionList = data.divisionList;
             // this.productGroupList = data.productGroupList;
              //this.productLineList = data.productLineMasterList;
              //this.productSubGroupList = data.productSubGroupList;
              //this.seasonList = data.seasonMasterList;
              //this.styleSegmentList = data.aFSegamationMasterTypesList;
              //this.statusList = data.styleStatusMasterTypeList;
              //this.yearList=data.yearList;
              //this.collectionList=data.collectionMasterTypesList;
             // this.dropList=data.dropMasterTypesList;
              //this.priceList = data.priceListTypeData;
              // this.scaleMasterList=data.scaleList;
              // if(this.inventorySystemStockList == null){
              //   this.inventorySystemStockList = new Array<MInventorySysCount>();
              // }
              // if(data.inventorySysCountList != null && data.inventorySysCountList.length > 0){
              //   for(let item of data.inventorySysCountList){
              //     this.inventorySystemStockList.push(item);
              //   }
              // }
            } 
            
          }
           
        }
        else {
          let msg: string = "Failed to retrieve Data.";
            this.common.showMessage("warn",msg);
        }  
       
      });
    }).catch((err) => {
      console.log(err);
      this.common.showMessage('warn', err);
      this.common.hideSpinner();
    });

  }
  getArmadaCollection1() {
    return new Promise((resolve, reject) => {
    this.armadaCollectionList = null;
    this.common.showSpinner();
    this.api.getAPI("ArmadaCollection")
      .subscribe((data) => {
        //setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.armadaCollectionList = data.armadaCollectionsMasterList;
            resolve(data);
          } else {
           let msg= this.common.showMessage('warn', 'Failed to retrieve Data.');
            reject(msg);
          }
          this.common.hideSpinner();
        //}, this.common.time_out_delay);
      });
    })
  }

  getDesignList() {
    this.designList = null;
    this.common.showSpinner();
    this.api.getAPI("designmaster")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.designList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }

  getbrand() {
    this.brandList = null;
    this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brandList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }

  getCollection() {
    this.collectionList = null;
    this.common.showSpinner();
    this.api.getAPI("collection")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.collectionList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getseason() {
    this.seasonList = null;
    this.common.showSpinner();
    this.api.getAPI("season")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.seasonList = data.seasonMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }

  getyear() {
    this.yearList = null;
    this.common.showSpinner();
    this.api.getAPI("year")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.yearList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }
  getdivision() {
    this.divisionList = null;
    this.common.showSpinner();
    this.api.getAPI("division")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.divisionList = data.divisionList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }
  getdrop() {
    this.dropList = null;
    this.common.showSpinner();
    this.api.getAPI("drop")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.dropList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }

  getstylestatus() {
    this.statusList = null;
    this.common.showSpinner();
    this.api.getAPI("stylestatus")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.statusList = data.styleStatusMasterTypeList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }

  getstylesegmentation() {
    this.styleSegmentList = null;
    this.common.showSpinner();
    this.api.getAPI("stylesegmentation")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.styleSegmentList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }
  getproductGroup() {
    this.productGroupList = null;
    this.common.showSpinner();
    this.api.getAPI("productgroup")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productGroupList = data.productGroupList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }
  getproductSubGroup() {
    this.productSubGroupList = null;
    this.common.showSpinner();
    this.api.getAPI("productsubgroup?ID=" + this.myForm.get('productGroup').value)
      .subscribe((data) => {
        //setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productSubGroupList = data.productSubGroupList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        //}, this.common.time_out_delay);
      });
  }
  getPriceCurrency() {
    this.pricecurrencyList = null;
    this.common.showSpinner();
    this.api.getAPI("currency")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.pricecurrencyList = data.currencyMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getproductLine() {
    this.productLineList = null;
    this.common.showSpinner();
    this.api.getAPI("productline")
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productLineList = data.productLineMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        //}, this.common.time_out_delay);
      });
  }

  getArmadaCollection() {
    this.armadaCollectionList = null;
    this.common.showSpinner();
    this.api.getAPI("ArmadaCollection")
      .subscribe((data) => {
        //setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.armadaCollectionList = data.armadaCollectionsMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        //}, this.common.time_out_delay);
      });
  }

  getPriceList() {
    this.priceList = null;
    this.common.showSpinner();
    this.api.getAPI("PurchasePriceListMasterLookUp")
      .subscribe((data) => {
        //setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.priceList = data.priceListTypeData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        //}, this.common.time_out_delay);
      });
  }
  getSubBrand() {
    this.subBrandList = null;
    this.common.showSpinner();
    this.api.getAPI("subbrand?brandid=" + this.myForm.get('brand').value)
      .subscribe((data) => {
        //setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.subBrandList = data.subBrandList;
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        //}, this.common.time_out_delay);
      });
  }

  getDevelopmentOffice() {
    this.developmentOfficeList = null;
    this.common.showSpinner();
    this.api.getAPI("DevelopmentOfficeLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.developmentOfficeList = data.responseDynamicData;
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
  getDesigner() {
    this.employeeList = null;
    this.common.showSpinner();
    this.api.getAPI("EmployeeMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.employeeList = data.employeeList;
            this.employeeList = this.employeeList.filter(x => x.roleName == "Designer")
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
  public picked1(event, field) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.itemImage = file;
      this.handleInputChange1(file); //turn into base64

    }
    else {
      alert("No file selected");
    }
  }
  handleInputChange1(files) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded1.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded1(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.itemImage = base64result;
    this.current_store_image="data:image/png;base64"+","+base64result;
  }
  
  getScaleList() {
    this.scaleMasterList = null;
    this.common.showSpinner();
    this.api.getAPI("scale")
      .subscribe((data) => {
        // setTimeout(() => {
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
        // }, this.common.time_out_delay);
      });
  }
  scaleDetails()
  {
    this.scaleDetailList=null;
    this.common.showSpinner();
    this.api.getAPI("scale?id="+this.myForm.get('scaleID').value)
      .subscribe((data) => {
        // setTimeout(() => {
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
        // }, this.common.time_out_delay);
      });
  }
  getcolorList() {
    this.colorList = null;
    this.common.showSpinner();
    this.api.getAPI("color")
      .subscribe((data) => {
        // setTimeout(() => {
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
        // }, this.common.time_out_delay);
      });
  }

  
  addStyleCode(){
    this.getCodeDate();
    if (this.scaleDetailList == null) {
      this.common.showMessage("warn", "Can not Save, Scale Details is Empty.");
    } else if (this.colorList.filter(x => x.active == true).length == 0) {
      this.common.showMessage("warn", "Can not Save, Color Details is Empty.");
    }
    else {
      this.addImageList();
      if(this.itemImageList.length>0)
      {
      this.styleMaster.id = this.id;
      this.styleMaster.designID = this.myForm.get('designCode').value;
      this.styleMaster.designName = this.myForm.get('designName').value;
      this.styleMaster.styleCode = this.myForm.get('styleCode').value;
      this.styleMaster.styleName = this.myForm.get('styleName').value;
      this.styleMaster.shortDesignName = this.myForm.get('shortDesignCode').value;
      this.styleMaster.styleSegmentation = this.myForm.get('styleSegmentation').value;
      this.styleMaster.productDepartmentCode = this.myForm.get('productDeptCode').value;
      this.styleMaster.brandID = this.myForm.get('brand').value;
      this.styleMaster.subBrandID = this.myForm.get('subBrand').value;
      this.styleMaster.collectionID = this.myForm.get('collection').value;
      this.styleMaster.armadaCollectionID = this.myForm.get('armadaCollection').value;
      this.styleMaster.divisionID = this.myForm.get('division').value;
      this.styleMaster.productGroupID = this.myForm.get('productGroup').value;
      this.styleMaster.productSubGroupID = this.myForm.get('productSubGroup').value;
      this.styleMaster.seasonID = this.myForm.get('season').value;
      this.styleMaster.yearCode = this.myForm.get('year').value;
      this.styleMaster.productLineID = this.myForm.get('productLine').value;
      this.styleMaster.styleStatusID = this.myForm.get('status').value;
      this.styleMaster.designerID = this.myForm.get('designer').value;
      this.styleMaster.purchasePriceListID = this.myForm.get('purchasePriceList').value;
      this.styleMaster.purchasePrice = this.myForm.get('purchasePrice').value;
      this.styleMaster.purchaseCurrencyID = this.myForm.get('purchaseCurrency').value;
      this.styleMaster.rrpPrice = this.myForm.get('rrpPrice').value;
      this.styleMaster.rrpCurrencyID = this.myForm.get('rrpCurrency').value;
      this.styleMaster.scaleID = this.myForm.get('scaleID').value;
      this.styleMaster.active = this.myForm.get('active').value;
      this.styleMaster.franchise = this.myForm.get('franchise').value;
      this.styleMaster.exchangeRate = this.myForm.get('exchangeRate').value;
      this.styleMaster.itemImage = this.itemImage;
      this.styleMaster.salesPriceListID = this.myForm.get('rrpCurrency').value;
      this.styleMaster.salesPrice = this.myForm.get('rrpPrice').value;
      this.styleMaster.salesType = this.myForm.get('salesType').value;
      this.styleMaster.composition = this.myForm.get('composition').value;
      this.styleMaster.symbolGroup = this.myForm.get('symbolGroup').value;
      this.styleMaster.owner = this.myForm.get('owner').value;
      this.styleMaster.countryOfOrigin = this.myForm.get('countryOfOrigin').value;
      this.styleMaster.shortDescriptionn = this.myForm.get('shortDescription').value;
      this.styleMaster.dropID = this.myForm.get('drop').value;
      this.styleMaster.grade = this.myForm.get('grade').value;
      this.styleMaster.developmentOffice = this.myForm.get('developmentOffice').value;
      this.styleMaster.arabicStyle = this.myForm.get('arabicStyleDescription').value;
      this.styleMaster.colorMasterList = this.colorList.filter(x => x.active == true);
      this.styleMaster.scaleDetailMasterList = this.scaleDetailList;
      this.styleMaster.itemImageMasterList = this.itemImageList;
      this.styleMaster.brandCode=this.brandCode;
      this.styleMaster.subBrandCode = this.subBrandCode;
      this.styleMaster.collectionCode=this.collectionCode;
      this.styleMaster.armadaCollectionCode = this.armadaCollectionCode;
      this.styleMaster.divisionCode=this.divisionCode;
      this.styleMaster.productGroupCode=this.productGroupCode;
      this.styleMaster.seasonCode=this.seasonCode;
      this.styleMaster.productLineCode=this.productLineCode;
      this.styleMaster.styleStatusCode=this.styleStatusCode;
      this.styleMaster.designCode=this.designerCode;
      this.styleMaster.purchasePriceListCode=this.purchasePriceListCode;
      this.styleMaster.purchaseCurrencyCode=this.purchasePriceCurrencyCode;
      this.styleMaster.rrpCurrencyCode=this.rrpCurrencyCode;
      this.styleMaster.scaleCode=this.scaleCode;
      this.styleMaster.segmentationCode=this.segmentationCode;
      this.styleMaster.designCode=this.designCode;
      this.styleMaster.productSubGroupCode=this.productSubGroupCode;
      // .log(this.styleMaster);
      this.common.showSpinner();
      this.api.postAPI("stylemaster", this.styleMaster).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          // this.common.hideSpinner();
          //this.common.showMessage('success', 'Design Data saved successfully.');
          //this.common.showMessage('success', data.displayMessage);
          this.styleId = data.iDs;
          this.addSKUMaster();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
    else
    {
      this.common.showMessage("warn", "Can not Save, Style Image Is Empty.");
    }
    }
  }
  getCodeDate(){
    let design=this.myForm.get('designCode').value;
    let brand=this.myForm.get('brand').value;
    let subbrand=this.myForm.get('subBrand').value;
    let collection=this.myForm.get('collection').value;
    let armadacoll=this.myForm.get('armadaCollection').value;
    let division=this.myForm.get('division').value;
    let productgroup=this.myForm.get('productGroup').value;
    let season=this.myForm.get('season').value;
    let year=this.myForm.get('year').value;
    let productline=this.myForm.get('productLine').value;
    let stylest=this.myForm.get('status').value;
    let designer=this.myForm.get('designer').value;
    let purchaseprice=this.myForm.get('purchasePriceList').value;
    let purchasepricecurrency=this.myForm.get('purchaseCurrency').value;
    let rrpcurrency=this.myForm.get('rrpCurrency').value;
    let scale=this.myForm.get('scaleID').value;
    let segmentation=this.myForm.get('styleSegmentation').value;
    let productsubgroup=this.myForm.get('productSubGroup').value;
    if(design!=null && design!='')
    {
      let arr = this.designList.filter(x=>x.id==design)
      this.designCode=arr[0].designCode;
    }
    if(brand!=null && brand!=''){
      let arr = this.brandList.filter(x=>x.id==brand)
      this.brandCode=arr[0].brandCode;
    }
  if(subbrand!=null && subbrand!=''){
    let arr = this.subBrandList.filter(x=>x.id==subbrand)
    this.subBrandCode==arr[0].subBrandCode;
  }
  if(collection!=null && collection!=''){
    let arr = this.collectionList.filter(x=>x.id==collection)
    this.collectionCode=arr[0].collectionCode;
  }
  if(armadacoll!=null && armadacoll!=''){
    let arr = this.armadaCollectionList.filter(x=>x.id==armadacoll)
    this.armadaCollectionCode=arr[0].armadaCollectionCode;
  }
  if(division!=null && division!=''){
    let arr = this.divisionList.filter(x=>x.id==division)
    this.divisionCode=arr[0].divisionCode;
  }
  if(productgroup!=null && productgroup!=''){
    let arr = this.productGroupList.filter(x=>x.id==productgroup)
    this.productGroupCode=arr[0].productGroupCode;
  }
  if(season!=null && season!=''){
    let arr = this.seasonList.filter(x=>x.id==season)
    this.seasonCode=arr[0].seasonCode;
  }
  if(year!=null && year!=''){
    let arr = this.yearList.filter(x=>x.id==year)
    this.yearCode=arr[0].yearCode;
  }
  if(productline!=null && productline!=''){
    let arr = this.productLineList.filter(x=>x.id==productline)
    this.productLineCode=arr[0].productlineCode;
  }
  if(stylest!=null && stylest!=''){
    let arr = this.statusList.filter(x=>x.id==stylest)
    this.styleStatusCode=arr[0].styleStatusCode;
  }
  if(designer!=null && designer!=''){
    let arr = this.employeeList.filter(x=>x.id==designer)
    this.designerCode=arr[0].employeeCode;
  }
  if(purchaseprice!=null && purchaseprice!=''){
    let arr = this.priceList.filter(x=>x.id==purchaseprice)
    this.purchasePriceListCode=arr[0].purchasePriceListCode;
  }
  if(purchasepricecurrency!=null && purchasepricecurrency!=''){
    let arr = this.pricecurrencyList.filter(x=>x.id==purchasepricecurrency)
    this.purchasePriceCurrencyCode=arr[0].purchasePriceCurrencyCode;
  }
  if(rrpcurrency!=null && rrpcurrency!=''){
    let arr = this.pricecurrencyList.filter(x=>x.id==rrpcurrency)
    this.rrpCurrencyCode=arr[0].rrpCurrencyCode;
  }
  if(scale!=null && scale!=''){
    let arr = this.scaleMasterList.filter(x=>x.id==scale)
    this.scaleCode = arr[0].scaleCode;
  }
  if(segmentation!=null && segmentation!=''){
    let arr = this.styleSegmentList.filter(x=>x.id==segmentation)
    this.segmentationCode=arr[0].afSegamationCode;
  }
  if(productsubgroup!=null && productsubgroup!=''){
    let arr = this.productSubGroupList.filter(x=>x.id==productsubgroup)
    this.productSubGroupCode=arr[0].productSubGroupCode;
  }
  }
  addImageList() {
    let tempimage: MItemImageMaster = {
      id: 0,
      styleID: 0,
      styleCode: this.myForm.get('styleCode').value,
      designID: this.myForm.get('designCode').value,
      skuImage:this.itemImage,
      isDefaultImage:true
    } 
    this.itemImageList.push(tempimage);
  }

  addSKUMaster()
  {
    /*let design=this.myForm.get('designCode').value;
    let brand=this.myForm.get('brand').value;
    let subbrand=this.myForm.get('subBrand').value;
    let collection=this.myForm.get('collection').value;
    let armadacoll=this.myForm.get('armadaCollection').value;
    let division=this.myForm.get('division').value;
    let productgroup=this.myForm.get('productGroup').value;
    let season=this.myForm.get('season').value;
    let year=this.myForm.get('year').value;
    let productline=this.myForm.get('productLine').value;
    let stylest=this.myForm.get('status').value;
    let designer=this.myForm.get('designer').value;
    let purchaseprice=this.myForm.get('purchasePriceList').value;
    let purchasepricecurrency=this.myForm.get('purchaseCurrency').value;
    let rrpcurrency=this.myForm.get('rrpCurrency').value;
    let scale=this.myForm.get('scaleID').value;
    let segmentation=this.myForm.get('styleSegmentation').value;
    let productsubgroup=this.myForm.get('productSubGroup').value;
    if(design!=null && design!='')
    {
      let arr = this.designList.filter(x=>x.id==design)
      this.designCode=arr[0].designCode;
    }
    if(brand!=null && brand!=''){
      let arr = this.brandList.filter(x=>x.id==brand)
      this.brandCode=arr[0].brandCode;
    }
  if(subbrand!=null && subbrand!=''){
    let arr = this.subBrandList.filter(x=>x.id==subbrand)
    this.subBrandCode==arr[0].subBrandCode;
  }
  if(collection!=null && collection!=''){
    let arr = this.collectionList.filter(x=>x.id==collection)
    this.collectionCode=arr[0].collectionCode;
  }
  if(armadacoll!=null && armadacoll!=''){
    let arr = this.armadaCollectionList.filter(x=>x.id==armadacoll)
    this.armadaCollectionCode=arr[0].armadaCollectionCode;
  }
  if(division!=null && division!=''){
    let arr = this.divisionList.filter(x=>x.id==division)
    this.divisionCode=arr[0].divisionCode;
  }
  if(productgroup!=null && productgroup!=''){
    let arr = this.productGroupList.filter(x=>x.id==productgroup)
    this.productGroupCode=arr[0].productGroupCode;
  }
  if(season!=null && season!=''){
    let arr = this.seasonList.filter(x=>x.id==season)
    this.seasonCode=arr[0].seasonCode;
  }
  if(year!=null && year!=''){
    let arr = this.yearList.filter(x=>x.id==year)
    this.yearCode=arr[0].yearCode;
  }
  if(productline!=null && productline!=''){
    let arr = this.productLineList.filter(x=>x.id==productline)
    this.productLineCode=arr[0].productlineCode;
  }
  if(stylest!=null && stylest!=''){
    let arr = this.statusList.filter(x=>x.id==stylest)
    this.styleStatusCode=arr[0].styleStatusCode;
  }
  if(designer!=null && designer!=''){
    let arr = this.employeeList.filter(x=>x.id==designer)
    this.designerCode=arr[0].employeeCode;
  }
  if(purchaseprice!=null && purchaseprice!=''){
    let arr = this.priceList.filter(x=>x.id==purchaseprice)
    this.purchasePriceListCode=arr[0].purchasePriceListCode;
  }
  if(purchasepricecurrency!=null && purchasepricecurrency!=''){
    let arr = this.pricecurrencyList.filter(x=>x.id==purchasepricecurrency)
    this.purchasePriceCurrencyCode=arr[0].purchasePriceCurrencyCode;
  }
  if(rrpcurrency!=null && rrpcurrency!=''){
    let arr = this.pricecurrencyList.filter(x=>x.id==rrpcurrency)
    this.rrpCurrencyCode=arr[0].rrpCurrencyCode;
  }
  if(scale!=null && scale!=''){
    let arr = this.scaleMasterList.filter(x=>x.id==scale)
    this.scaleCode = arr[0].scaleCode;
  }
  if(segmentation!=null && segmentation!=''){
    let arr = this.styleSegmentList.filter(x=>x.id==segmentation)
    this.segmentationCode=arr[0].afSegamationCode;
  }
  if(productsubgroup!=null && productsubgroup!=''){
    let arr = this.productSubGroupList.filter(x=>x.id==productsubgroup)
    this.productSubGroupCode=arr[0].productSubGroupCode;
  }*/
    this.skuMasterList = new Array<MSkuMasterTypes>();
    for(let color of this.colorList.filter(x => x.active == true))
      {
       for(let size of this.scaleDetailList.filter(x => x.active == true)) 
       {
        let tempsku: MSkuMasterTypes={
          id:0,
          skuName: this.myForm.get('styleName').value +' '+ color.description,
          skuCode: this.myForm.get('styleCode').value + '-' + color.colorCode + '-' + size.sizeCode,
          styleID:this.styleId,
          styleCode:this.myForm.get('styleCode').value,
          designID: this.myForm.get('designCode').value,
          brandID: this.myForm.get('brand').value,
          subBrandID: this.myForm.get('subBrand').value,
          collectionID: this.myForm.get('collection').value,
          armadaCollectionID: this.myForm.get('armadaCollection').value,
          divisionID: this.myForm.get('division').value,
          productGroupID: this.myForm.get('productGroup').value,
          productSubGroupID: this.myForm.get('productSubGroup').value,
          seasonID: this.myForm.get('season').value,
          yearID: this.myForm.get('year').value,
          productLineID: this.myForm.get('productLine').value,
          styleStatusID: this.myForm.get('status').value,
          designerID: this.myForm.get('designer').value,
          purchasePriceListID: this.myForm.get('purchasePriceList').value,
          purchasePrice: this.myForm.get('purchasePrice').value,
          purchaseCurrencyID: this.myForm.get('purchaseCurrency').value,
          rrpPrice: this.myForm.get('rrpPrice').value,
          rrpCurrencyID: this.myForm.get('rrpCurrency').value,
          scaleID: this.myForm.get('scaleID').value,
          colorID:color.id,
          sizeID:size.id,
          colorCode:color.colorCode,
          sizeCode:size.sizeCode,
          segamentationID: this.myForm.get('styleSegmentation').value,
          exchangeRate: this.myForm.get('exchangeRate').value,
          active:true,
          brandCode: this.brandCode,
          divisionCode: this.divisionCode,
          productGroupCode: this.productGroupCode,
          yearCode: this.yearCode,
          designCode:this.designCode,
          subBrandCode:this.subBrandCode,
          collectionCode:this.collectionCode,
          armadaCollectionCode:this.armadaCollectionCode,
          seasonCode:this.seasonCode,
          productLineCode:this.productLineCode,
          styleStatusCode:this.styleStatusCode,
          designerCode:this.designerCode,
          purchasePriceListCode:this.purchasePriceListCode,
          purchasePriceCurrencyCode:this.purchasePriceCurrencyCode,
          rrpCurrencyCode:this.rrpCurrencyCode,
          scaleCode:this.scaleCode,
          segmentationCode:this.segmentationCode,
          productSubGroupCode:this.productSubGroupCode,
          productCode:this.productCode
        }
        this.skuMasterList.push(tempsku);
       }
      }
   // .log(this.skuMasterList);
    this.addSkuItems();
  }
  addSkuItems(){
    if (this.skuMasterList == null) {
      this.common.showMessage("warn", "Can not Save, Style Data is invalid.");
    } else {
      
      //this.styleMaster.itemImageMasterList=this.itemImageList;
     // .log(this.styleMaster);
      this.common.showSpinner();
      this.api.postAPI("sku", this.skuMasterList).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Design Data saved successfully.');
          this.common.showMessage('success', 'Style Master Updated Successfully.');
          this.router.navigate(['style']);
          this.styleId=data.iDs;
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
 
  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['style']);
    }  
    } 
    else
    {
      this.router.navigate(['style']);
  }
    }

  restrictSpecialChars(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) 
      || (k > 96 && k < 123) 
      || k == 8 
      || k == 32 
      // || k == 45 
      // || k == 47
      // || k == 95
      || (k >= 48 && k <= 57));
  }
  ngOnInit(): void {
    this.getcolorList();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStyleDateList();
  }

  getStyleDateList(){
    this.common.showSpinner();
    this.api.getAPI("stylemaster?ID=" + this.id)
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            console.log(data);
            this.myForm.controls['designCode'].setValue(data.responseDynamicData.designID);
            this.myForm.controls['designName'].setValue(data.responseDynamicData.designName);
            this.myForm.controls['styleCode'].setValue(data.responseDynamicData.styleCode);
            this.myForm.controls['styleName'].setValue(data.responseDynamicData.styleName);
            this.myForm.controls['productDeptCode'].setValue(data.responseDynamicData.productDepartmentCode);
            this.myForm.controls['shortDesignCode'].setValue(data.responseDynamicData.shortDesignName);
            this.myForm.controls['brand'].setValue(data.responseDynamicData.brandID);
            this.getSubBrand();
            this.myForm.controls['subBrand'].setValue(data.responseDynamicData.subBrandID);
            this.myForm.controls['collection'].setValue(data.responseDynamicData.collectionID);
            this.myForm.controls['armadaCollection'].setValue(data.responseDynamicData.armadaCollectionID);
            this.myForm.controls['exchangeRate'].setValue(data.responseDynamicData.exchangeRate);
            this.myForm.controls['designer'].setValue(data.responseDynamicData.designerID);
            this.myForm.controls['productGroup'].setValue(data.responseDynamicData.productGroupID);
            this.getproductSubGroup();
            this.myForm.controls['productSubGroup'].setValue(data.responseDynamicData.productSubGroupID);
            this.myForm.controls['season'].setValue(data.responseDynamicData.seasonID);
            this.myForm.controls['year'].setValue(data.responseDynamicData.yearCode);
            this.myForm.controls['division'].setValue(data.responseDynamicData.divisionID);
            this.getproductLine();
            this.myForm.controls['productLine'].setValue(data.responseDynamicData.productLineID);
            this.myForm.controls['salesType'].setValue(data.responseDynamicData.salesType);
            this.myForm.controls['styleSegmentation'].setValue(data.responseDynamicData.styleSegmentation);
            this.myForm.controls['status'].setValue(data.responseDynamicData.styleStatusID);
            this.myForm.controls['purchasePriceList'].setValue(data.responseDynamicData.purchasePriceListID);
            this.myForm.controls['purchasePrice'].setValue(data.responseDynamicData.purchasePrice);
            this.myForm.controls['purchaseCurrency'].setValue(data.responseDynamicData.purchaseCurrencyID);
            this.myForm.controls['composition'].setValue(data.responseDynamicData.composition);
            this.myForm.controls['symbolGroup'].setValue(data.responseDynamicData.symbolGroup);
            this.myForm.controls['owner'].setValue(data.responseDynamicData.owner);
            this.myForm.controls['countryOfOrigin'].setValue(data.responseDynamicData.countryOfOrigin);
            this.myForm.controls['shortDescription'].setValue(data.responseDynamicData.shortDescriptionn);
            this.myForm.controls['rrpCurrency'].setValue(data.responseDynamicData.rrpCurrencyID);
            this.myForm.controls['rrpPrice'].setValue(data.responseDynamicData.rrpPrice);
            this.myForm.controls['drop'].setValue(data.responseDynamicData.dropID);
            this.myForm.controls['grade'].setValue(data.responseDynamicData.grade);
            this.myForm.controls['developmentOffice'].setValue(data.responseDynamicData.developmentOffice);
            this.myForm.controls['arabicStyleDescription'].setValue(data.responseDynamicData.arabicStyle);
            this.myForm.controls['active'].setValue(data.responseDynamicData.active);
            this.myForm.controls['franchise'].setValue(data.responseDynamicData.franchise);
            this.myForm.controls['scaleID'].setValue(data.responseDynamicData.scaleID);
           // this.current_store_image = data.responseDynamicData.itemImageMasterList[0].skuImage;
           
           this.itemImageList = data.responseDynamicData.itemImageMasterList;
           this.itemImage = data.responseDynamicData.itemImageMasterList[0].skuImage;
            this.current_store_image = data.responseDynamicData.itemImageMasterList[0].skuImage == null || data.responseDynamicData.itemImageMasterList[0].skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.responseDynamicData.itemImageMasterList[0].skuImage;
            this.scaleDetailList=data.responseDynamicData.scaleDetailMasterList;
            this.tempcolorMaster = data.responseDynamicData.colorMasterList;
            //this.colorList = data.responseDynamicData.colorMasterList;
            this.brandCode = data.responseDynamicData.brandCode;
            this.divisionCode = data.responseDynamicData.divisionCode;
            this.productGroupCode = data.responseDynamicData.productGroupCode;
            this.yearCode = data.responseDynamicData.yearCode;
            //this.colorvisible();
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        //}, this.common.time_out_delay);
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
  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
