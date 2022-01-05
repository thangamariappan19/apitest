import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MStyleMaster } from 'src/app/models/m-style-master';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MDesignMaster } from 'src/app/models/m-design-master';
import { MItemImageMaster } from 'src/app/models/m-item-image-master';
import { MColorMaster } from 'src/app/models/m-color-master';

@Component({
  selector: 'app-sku-add',
  templateUrl: './sku-add.component.html',
  styleUrls: ['./sku-add.component.css']
})
export class SkuAddComponent implements OnInit {
  styleCodeData: any;
  styleName: any;
  myForm: FormGroup;
  styleMaster: MStyleMaster;
  styleMasterList: Array<any>;
  skuMasterList: Array<MSkuMasterTypes>;
  itemImageList: Array<MItemImageMaster>;
  designList: Array<MDesignMaster>;
  styleId: any;
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
  itemImage: any;
  scaleMasterList: Array<any>;
  scaleDetailList: Array<any>;
  colorList: Array<MColorMaster>;
  brandCode: any;
  divisionCode: any;
  productGroupCode: any;
  yearCode: any;
  colorCode: any;
  sizeCode: any;
  designCode: any;
  subBrandCode: any;
  collectionCode: any;
  armadaCollectionCode: any;
  seasonCode: any;
  productLineCode: any;
  styleStatusCode: any;
  designerCode: any;
  purchasePriceListCode: any;
  purchasePriceCurrencyCode: any;
  rrpCurrencyCode: any;
  scaleCode: any;
  segmentationCode: any;
  productSubGroupCode: any;
  productCode: any;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      skuCode: [''],
      skuName: [''],
      barcode: [''],
      style: ['', Validators.required],
      designCode: [''],
      styleSegmentation: [''],
      //styleCode: ['', Validators.required],      
      scale: [''],
      brand: [''],
      subBrand: [''],
      collection: [''],
      armadaCollection: [''],
      division: [''],
      productGroup: [''],
      productSubGroup: [''],
      purchasePrice: [''],
      purchaseCurrency: [''],
      season: [''],
      year: [''],
      productLine: [''],
      color: ['', Validators.required],
      size: ['', Validators.required],
      status: [''],
      designer: [''],
      rrpPriceList: [''],
      rrpCurrency: [''],
      rrpPrice: [''],
      exchangeRate: [''],
      supplierBarcode: ['', Validators.required],
      arabicSKU: [''],
      remarks: [''],
      active: [true]
    });
    this.getStyleCodeMaster();
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
    this.getcolorList();
    this.styleMaster = new MStyleMaster();
    this.itemImageList = new Array<MItemImageMaster>();
    this.skuMasterList = new Array<MSkuMasterTypes>();
  }
  getDesignList() {
    this.designList = null;
    this.common.showSpinner();
    this.api.getAPI("designmaster")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.designList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getbrand() {
    this.brandList = null;
    this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brandList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
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
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.seasonList = data.seasonMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getyear() {
    this.yearList = null;
    this.common.showSpinner();
    this.api.getAPI("year")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.yearList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getdivision() {
    this.divisionList = null;
    this.common.showSpinner();
    this.api.getAPI("division")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.divisionList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getdrop() {
    this.dropList = null;
    this.common.showSpinner();
    this.api.getAPI("drop")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.dropList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getstylestatus() {
    this.statusList = null;
    this.common.showSpinner();
    this.api.getAPI("stylestatus")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.statusList = data.styleStatusMasterTypeList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getstylesegmentation() {
    this.styleSegmentList = null;
    this.common.showSpinner();
    this.api.getAPI("stylesegmentation")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.styleSegmentList = data.responseDynamicData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getproductGroup() {
    this.productGroupList = null;
    this.common.showSpinner();
    this.api.getAPI("productgroup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productGroupList = data.productGroupList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getproductSubGroup() {
    this.productSubGroupList = null;
    this.common.showSpinner();
    this.api.getAPI("productsubgroup?ID=" + this.myForm.get('productGroup').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productSubGroupList = data.productSubGroupList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
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
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productLineList = data.productLineMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getArmadaCollection() {
    this.armadaCollectionList = null;
    this.common.showSpinner();
    this.api.getAPI("ArmadaCollection")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.armadaCollectionList = data.armadaCollectionsMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getPriceList() {
    this.priceList = null;
    this.common.showSpinner();
    this.api.getAPI("PurchasePriceListMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.priceList = data.priceListTypeData;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getSubBrand() {
    this.subBrandList = null;
    this.common.showSpinner();
    this.api.getAPI("subbrand?brandid=" + this.myForm.get('brand').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.subBrandList = data.subBrandList;
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

  getStyleCodeMaster() {
    this.employeeList = null;
    this.common.showSpinner();
    this.api.getAPI("StyleMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.styleMasterList = data.styleMasterList;
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
  }
  getScaleList() {
    this.scaleMasterList = null;
    this.common.showSpinner();
    this.api.getAPI("scale")
      .subscribe((data) => {
        setTimeout(() => {
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
  scaleDetails() {
    this.scaleDetailList = null;
    this.common.showSpinner();
    this.api.getAPI("scale?id=" + this.myForm.get('scale').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.scaleDetailList = data.scaleRecord.scaleDetailMasterList;
            for (let scale of this.scaleDetailList) {
              scale.active = false;
              scale.sizeID = scale.id;
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
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['sku-master']);
      }
    }
    else {
      this.router.navigate(['sku-master']);
    }
  }

  getStyleDateList() {
    this.common.showSpinner();
    this.api.getAPI("stylemaster?ID=" + this.myForm.get('style').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['designCode'].setValue(data.responseDynamicData.designID);
            //this.myForm.controls['styleCode'].setValue(data.responseDynamicData.styleCode);
            //this.myForm.controls['styleName'].setValue(data.responseDynamicData.styleName);
            this.myForm.controls['scale'].setValue(data.responseDynamicData.scaleID);
            this.myForm.controls['brand'].setValue(data.responseDynamicData.brandID);
            this.getSubBrand();
            this.scaleDetails();
            this.getstylesegmentation();
            this.myForm.controls['subBrand'].setValue(data.responseDynamicData.subBrandID);
            this.myForm.controls['collection'].setValue(data.responseDynamicData.collectionID);
            this.myForm.controls['armadaCollection'].setValue(data.responseDynamicData.armadaCollectionID);
            this.myForm.controls['division'].setValue(data.responseDynamicData.divisionID);
            this.myForm.controls['productGroup'].setValue(data.responseDynamicData.productGroupID);
            this.getproductSubGroup();
            this.myForm.controls['productSubGroup'].setValue(data.responseDynamicData.productSubGroupID);
            this.myForm.controls['purchasePrice'].setValue(data.responseDynamicData.purchasePrice);
            this.myForm.controls['styleSegmentation'].setValue(data.responseDynamicData.styleSegmentation);
            this.myForm.controls['purchaseCurrency'].setValue(data.responseDynamicData.purchaseCurrencyID);
            this.myForm.controls['season'].setValue(data.responseDynamicData.seasonID);
            this.myForm.controls['year'].setValue(data.responseDynamicData.yearCode);
            this.myForm.controls['productLine'].setValue(data.responseDynamicData.productLineID);
            this.myForm.controls['status'].setValue(data.responseDynamicData.styleStatusID);
            this.myForm.controls['designer'].setValue(data.responseDynamicData.designerID);
            this.myForm.controls['rrpPriceList'].setValue(data.responseDynamicData.purchasePriceListID);
            this.myForm.controls['rrpCurrency'].setValue(data.responseDynamicData.rrpCurrencyID);
            this.myForm.controls['rrpPrice'].setValue(data.responseDynamicData.rrpPrice);
            this.myForm.controls['exchangeRate'].setValue(data.responseDynamicData.exchangeRate);
            this.styleName = data.responseDynamicData.styleName;

            this.styleCodeData = data.responseDynamicData.styleCode;
            //this.myForm.controls['skuCode'].setValue(data.responseDynamicData.styleCode);
            //this.generateSkuCode();
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

  generateSkuCode() {
    let sku = this.styleCodeData;
    let skucolor;
    let skusize;
    let color = this.myForm.get('color').value;
    let size = this.myForm.get('size').value;
    for (let colorlist of this.colorList) {
      if (colorlist.id == color) {
        this.colorCode = colorlist.colorCode;
        skucolor = colorlist.colorCode;
        this.styleName = this.styleName + ':' + colorlist.description
        break;
      }
    }
    for (let sizelist of this.scaleDetailList) {
      if (sizelist.id == size) {
        this.sizeCode = sizelist.sizeCode;
        skusize = sizelist.sizeCode;
        break;
      }
    }
    this.myForm.controls['skuName'].setValue(this.styleName);
    sku = sku + '-' + skucolor + '-' + skusize;
    this.myForm.controls['skuCode'].setValue(sku);
  }

  listSKU() {
    let design = this.myForm.get('designCode').value;
    let brand = this.myForm.get('brand').value;
    let subbrand = this.myForm.get('subBrand').value;
    let collection = this.myForm.get('collection').value;
    let armadacoll = this.myForm.get('armadaCollection').value;
    let division = this.myForm.get('division').value;
    let productgroup = this.myForm.get('productGroup').value;
    let season = this.myForm.get('season').value;
    let year = this.myForm.get('year').value;
    let productline = this.myForm.get('productLine').value;
    let stylest = this.myForm.get('status').value;
    let designer = this.myForm.get('designer').value;
    //let purchaseprice = this.myForm.get('purchasePriceList').value;
    let purchasepricecurrency = this.myForm.get('purchaseCurrency').value;
    let rrpcurrency = this.myForm.get('rrpCurrency').value;
    let scale = this.myForm.get('scale').value;
    let segmentation = this.myForm.get('styleSegmentation').value;
    let productsubgroup = this.myForm.get('productSubGroup').value;
    if (design != null && design != '') {
      let arr = this.designList.filter(x => x.id == design)
      this.designCode = arr[0].designCode;
    }
    if (brand != null && brand != '') {
      let arr = this.brandList.filter(x => x.id == brand)
      this.brandCode = arr[0].brandCode;
    }
    if (subbrand != null && subbrand != '') {
      let arr = this.subBrandList.filter(x => x.id == subbrand)
      this.subBrandCode == arr[0].subBrandCode;
    }
    if (collection != null && collection != '') {
      let arr = this.collectionList.filter(x => x.id == collection)
      this.collectionCode = arr[0].collectionCode;
    }
    if (armadacoll != null && armadacoll != '') {
      let arr = this.armadaCollectionList.filter(x => x.id == armadacoll)
      this.armadaCollectionCode = arr[0].armadaCollectionCode;
    }
    if (division != null && division != '') {
      let arr = this.divisionList.filter(x => x.id == division)
      this.divisionCode = arr[0].divisionCode;
    }
    if (productgroup != null && productgroup != '') {
      let arr = this.productGroupList.filter(x => x.id == productgroup)
      this.productGroupCode = arr[0].productGroupCode;
    }
    if (season != null && season != '') {
      let arr = this.seasonList.filter(x => x.id == season)
      this.seasonCode = arr[0].seasonCode;
    }
    if (year != null && year != '') {
      let arr = this.yearList.filter(x => x.id == year)
      this.yearCode = arr[0].yearCode;
    }
    if (productline != null && productline != '') {
      let arr = this.productLineList.filter(x => x.id == productline)
      this.productLineCode = arr[0].productlineCode;
    }
    if (stylest != null && stylest != '') {
      let arr = this.statusList.filter(x => x.id == stylest)
      this.styleStatusCode = arr[0].styleStatusCode;
    }
    if (designer != null && designer != '') {
      let arr = this.employeeList.filter(x => x.id == designer)
      this.designerCode = arr[0].employeeCode;
    }
    /*if (purchaseprice != null && purchaseprice != '') {
      let arr = this.priceList.filter(x => x.id == purchaseprice)
      this.purchasePriceListCode = arr[0].purchasePriceListCode;
    }*/
    if (purchasepricecurrency != null && purchasepricecurrency != '') {
      let arr = this.pricecurrencyList.filter(x => x.id == purchasepricecurrency)
      this.purchasePriceCurrencyCode = arr[0].purchasePriceCurrencyCode;
    }
    if (rrpcurrency != null && rrpcurrency != '') {
      let arr = this.pricecurrencyList.filter(x => x.id == rrpcurrency)
      this.rrpCurrencyCode = arr[0].rrpCurrencyCode;
    }
    if (scale != null && scale != '') {
      let arr = this.scaleMasterList.filter(x => x.id == scale)
      this.scaleCode = arr[0].scaleCode;
    }
    if (segmentation != null && segmentation != '') {
      let arr = this.styleSegmentList.filter(x => x.id == segmentation)
      this.segmentationCode = arr[0].afSegamationCode;
    }
    if (productsubgroup != null && productsubgroup != '') {
      let arr = this.productSubGroupList.filter(x => x.id == productsubgroup)
      this.productSubGroupCode = arr[0].productSubGroupCode;
    }
    let tempsku: MSkuMasterTypes = {
      id: 0,
      skuName: this.myForm.get('skuName').value,
      skuCode: this.myForm.get('skuCode').value,
      styleID: this.myForm.get('style').value,
      styleCode: this.styleCodeData,
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
      purchasePriceListID: this.myForm.get('rrpPriceList').value,
      purchasePrice: this.myForm.get('purchasePrice').value,
      purchaseCurrencyID: this.myForm.get('purchaseCurrency').value,
      rrpPrice: this.myForm.get('rrpPrice').value,
      rrpCurrencyID: this.myForm.get('rrpCurrency').value,
      scaleID: this.myForm.get('scale').value,
      colorID: this.myForm.get('color').value,
      sizeID: this.myForm.get('size').value,
      supplierBarcode:this.myForm.get('supplierBarcode').value,
      arabicSKU:this.myForm.get('arabicSKU').value,
      colorCode: this.colorCode,
      sizeCode: this.sizeCode,
      segamentationID: this.myForm.get('styleSegmentation').value,
      exchangeRate: this.myForm.get('exchangeRate').value,
      active: true,
      brandCode: this.brandCode,
      divisionCode: this.divisionCode,
      productGroupCode: this.productGroupCode,
      yearCode: this.yearCode,
      designCode: this.designCode,
      subBrandCode: this.subBrandCode,
      collectionCode: this.collectionCode,
      armadaCollectionCode: this.armadaCollectionCode,
      seasonCode: this.seasonCode,
      productLineCode: this.productLineCode,
      styleStatusCode: this.styleStatusCode,
      designerCode: this.designerCode,
      purchasePriceListCode: this.purchasePriceListCode,
      purchasePriceCurrencyCode: this.purchasePriceCurrencyCode,
      rrpCurrencyCode: this.rrpCurrencyCode,
      scaleCode: this.scaleCode,
      segmentationCode: this.segmentationCode,
      productSubGroupCode: this.productSubGroupCode,
      productCode: this.productCode
    }
    this.skuMasterList.push(tempsku);
  }
  addSkuItems() {
    this.listSKU();
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
          this.common.showMessage('success', data.displayMessage);
          this.clear();
          this.router.navigate(['sku-master']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  clear() {
    this.myForm.controls['skuCode'].setValue('');
    this.myForm.controls['skuName'].setValue('');
    this.myForm.controls['barcode'].setValue('');
    this.myForm.controls['style'].setValue('');
    this.myForm.controls['designCode'].setValue('');
    this.myForm.controls['styleSegmentation'].setValue('');
    this.myForm.controls['scale'].setValue('');
    this.myForm.controls['brand'].setValue('');
    this.myForm.controls['subBrand'].setValue('');
    this.myForm.controls['collection'].setValue('');
    this.myForm.controls['armadaCollection'].setValue('');
    this.myForm.controls['division'].setValue('');
    this.myForm.controls['productGroup'].setValue('');
    this.myForm.controls['productSubGroup'].setValue('');
    this.myForm.controls['purchasePrice'].setValue('');
    this.myForm.controls['purchaseCurrency'].setValue('');
    this.myForm.controls['season'].setValue('');
    this.myForm.controls['year'].setValue('');
    this.myForm.controls['productLine'].setValue('');
    this.myForm.controls['color'].setValue('');
    this.myForm.controls['size'].setValue('');
    this.myForm.controls['status'].setValue('');
    this.myForm.controls['designer'].setValue('');
    this.myForm.controls['rrpPriceList'].setValue('');
    this.myForm.controls['rrpCurrency'].setValue('');
    this.myForm.controls['rrpPrice'].setValue('');
    this.myForm.controls['exchangeRate'].setValue('');
    this.myForm.controls['supplierBarcode'].setValue('');
    this.myForm.controls['arabicSKU'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue('true');
  }

  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPress1(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
