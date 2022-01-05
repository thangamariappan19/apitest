import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { style } from '@angular/animations';
import { MCommonUtil } from 'src/app/models/m-common-util';
import { MPromotionMaster } from 'src/app/models/m-promotion-master';

@Component({
  selector: 'app-promotion-edit',
  templateUrl: './promotion-edit.component.html',
  styleUrls: ['./promotion-edit.component.css']
})
export class PromotionEditComponent implements OnInit {
  id: any;
  myForm: FormGroup;
  brand_list: Array<any>;
  promotionMaster: MPromotionMaster;
  brandDropdownSettings: IDropdownSettings = {};
  subBrandDropDownSettings: IDropdownSettings = {};
  countryDropdownSettings: IDropdownSettings = {};
  storeGroupDropdownSettings: IDropdownSettings = {};
  customerGroupDropDownSettings: IDropdownSettings = {};
  customerDropDownSettings: IDropdownSettings = {};
  styleDropDownSettings: IDropdownSettings = {};
  couponDropDownSettings: IDropdownSettings = {};
  exclusionBrandGropDownSettings: IDropdownSettings = {};
  styleSegmentationDropDownSettings: IDropdownSettings = {};
  seasonDropDownSettings: IDropdownSettings = {};
  productGroupDropDownSettings: IDropdownSettings = {};
  productSubGroupDropDownSettings: IDropdownSettings = {};
  yearDropDownSettings: IDropdownSettings = {};
  storeDropDownSettings: IDropdownSettings = {};
  requiredField: boolean = false;
  selectedBrandList = [];
  selectedSubBrandList = [];
  selectedCountryList = [];
  selectedStoreGroupList = [];
  selectedExclusionBrandList = [];
  selectedStyleSegmentationList = [];
  selectedSeasonList = [];
  selectedProductGroupList = [];
  selectedProductSubGroupList = [];
  selectedYearList = [];
  selectedStoreList = [];
  selectedCustomerList = [];
  selectedCustomerGroupList = [];
  selectedStyleList = [];
  selectedCouponList = [];
  selectedItems = [];
  brandselList: string = "";
  subBrandselList: string = "";
  countryselList: string = "";
  storeGroupselList: string = "";
  exclusionBrandselList: string = "";
  styleSegmentationselList: string = "";
  seasonselList: string = "";
  productGroupselList: string = "";
  productSubGroupselList: string = "";
  yearselList: string = "";
  storeselList: string = "";
  customerselList: string = "";
  customerGroupselList: string = "";
  styleselList: string = "";
  couponselList: string = "";
  productGroupList: Array<any>;
  productSubGroupList: Array<any>;
  seasonList: Array<any>;
  yearList: Array<any>;
  divisionList: Array<any>;
  styleSegmentList: Array<any>;
  subBrandList: Array<any>;
  storegroup_list: Array<any>;
  countryList: Array<any>;
  storeList: Array<any>;
  customerGroup_List: Array<any>;
  customerList: Array<any> = null;
  styleList: Array<any>;
  coupon: Array<any>;
  BuyItemList: Array<any>;
  GetItemList: Array<any>;
  buyItemTypeList: Array<MCommonUtil>;
  getItemTypeList: Array<MCommonUtil>;
  store_List: Array<MCommonUtil>;
  customer_List: Array<MCommonUtil>;
  productTypeList: Array<MCommonUtil>;
  customerdetails: Array<any>;
  // filelist1: Array<MCommonUtil>;
  // filelist2:Array<MCommonUtil>;
  // filelist3:Array<MCommonUtil>;
  cusList = [];
  filelist1: Array<any>;
  filelist2: Array<any>;
  filelist3: Array<any>;
  Type: any;
  Value: any;
  showSpinner: boolean = false;
  btnAddstck: boolean = true;

  showBuyItem: boolean = true;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.getPromotionList();
  }
  createForm() {
    this.myForm = this.fb.group({
      promotionCode: ['', Validators.required],
      promotionName: ['', Validators.required],
      basePromotionType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      minimumBillAmount: ['', Validators.required],
      buyItemOptionalAmount: ['', Validators.required],
      minimumQuantity: ['', Validators.required],
      discountType: ['', Validators.required],
      discountValue: ['', Validators.required],
      colors: ['', Validators.required],
      promotionType: ['', Validators.required],
      allowMultiplePromotion: [false],
      lowestValue: [false],
      lowestValueWithGroup: [false],
      exculdeDiscountAmount: [false],
      prompt: [false],
      active: [true],
      promotionApply: [''],
      storeGroup: [''],
      store: [''],
      brand: [''],
      country: [''],
      customerGroup: [''],
      customer: [''],
      productStyleSegment: [''],
      productYear: [''],
      productBrand: [''],
      productSubbrand: [''],
      productSeasons: [''],
      productGroup: [''],
      productSubGroup: [''],
      productStyle: [''],
      productCoupon: [''],
      BuyitemType: [''],
      BuyitemValue: [''],
      BuyOptionalCount: ['', Validators.required],
      BuyItemAmount: [''],
      GetItemFixedPrice: [''],
      GetOptionalCount: [''],
      GetItemType: [''],
      GetItemValue: [''],
      GetItemDiscountType: [''],
      GetItemDiscountValue: [''],
      globalSearch: [''],
      BuyItemQuantity: [''],
      GetItemQuantity: [''],
      quantity: [''],
      minPromotionQty: [''],
      maxGiftPerInvoice: [''],
      giftQuantity: [''],
      giftBillAmount: [''],
      multiApplyForReceipt: ['']
    });
    this.buyItemTypeList = new Array<MCommonUtil>();
    this.getItemTypeList = new Array<MCommonUtil>();
    this.store_List = new Array<MCommonUtil>();
    this.customer_List = new Array<MCommonUtil>();
    this.productTypeList = new Array<MCommonUtil>();

    this.common.showSpinner();
    this.getPromotionList().then((x) => {
      this.common.hideSpinner();
      this.getBrand();
      this.getCountry();
      this.getStoreGroupList();
      this.getstylesegmentation();
      this.getyear();
      this.getseason();
      this.getproductGroup();
      this.getproductSubGroup();
      this.getSubBrand();
      this.getStyle();
      this.getCoupon();
      this.getCustomerGroupList();
      this.getStore();
    }).catch(() => {
      this.common.hideSpinner();
    });
  }

  getBrand() {
    this.brand_list = null;
    // this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.brand_list = data.responseDynamicData;
          this.selectedBrandList = [];
          this.selectedExclusionBrandList = [];
          this.getMappngBrand();
          this.getMappingExclGroup();
          this.brandDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'brandName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };

          this.exclusionBrandGropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'brandName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedExclusionBrandList = [];
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }

  onSelectBrand(item: any) {
    //console.log(this.selectedBrandList);
  }
  onSelectAllBrand(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectCountry(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllCountry(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectStoreGroup(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllStoreGroup(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectExclusionBrand(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllExclusionBrand(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectYear(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllYear(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectStyleSegmentation(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllStyleSegmentation(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectSeason(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllSeason(items: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectProductGroup(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllProductGroup(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectStore(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllStore(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectsubBrand(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllsubBrand(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectCustomerGroup(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllCustomerGroup(items: any) {
    // console.log(this.selectedBrandList);
  }

  onSelectProductSubGroup(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllProductSubGroup(items: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectStyle(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllStyle(items: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectCoupon(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllCoupon(items: any) {
    // console.log(this.selectedBrandList);
  }

  setStatus() {
    (this.selectedItems.length > 0) ? this.requiredField = true : this.requiredField = false;
  }

  setClass() {
    this.setStatus();
    if (this.selectedItems.length > 0) { return 'validField' }
    else { return 'invalidField' }
  }
  submission() {
    if (this.requiredField == false) {
      /* Print a message that not all required fields were filled... */
    }
    /* Do form submission... */
  }
  ngOnInit(): void {
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.getPromotionList();
  }
  getPromotionList() {
    return new Promise((resolve, reject) => {
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      this.api.getAPI("promotion?ID=" + this.id + "&qry=edit")
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // console.log(data);
            //this.myForm.controls['franchiselistID'].setValue(data.storeMasterData.franchiseID);
            this.myForm.controls['promotionCode'].setValue(data.responseDynamicData.promotionCode);
            this.myForm.controls['promotionName'].setValue(data.responseDynamicData.promotionName);
            this.myForm.controls['basePromotionType'].setValue(data.responseDynamicData.type);
            this.myForm.controls['startDate'].setValue(this.common.toYMDFormat(new Date(data.responseDynamicData.startDate)));
            this.myForm.controls['endDate'].setValue(this.common.toYMDFormat(new Date(data.responseDynamicData.endDate)));
            this.myForm.controls['minimumBillAmount'].setValue(data.responseDynamicData.minBillAmount);
            this.myForm.controls['buyItemOptionalAmount'].setValue(data.responseDynamicData.buyItemOptionalAmount);
            this.myForm.controls['minimumQuantity'].setValue(data.responseDynamicData.minQuantity);
            this.myForm.controls['discountType'].setValue(data.responseDynamicData.discount);
            this.myForm.controls['discountValue'].setValue(data.responseDynamicData.discountValue);
            this.myForm.controls['colors'].setValue(data.responseDynamicData.color);
            this.myForm.controls['promotionType'].setValue(data.responseDynamicData.promotionType);
            this.myForm.controls['allowMultiplePromotion'].setValue(data.responseDynamicData.allowMultiPromotion);
            this.myForm.controls['lowestValue'].setValue(data.responseDynamicData.lowestValue);
            this.myForm.controls['lowestValueWithGroup'].setValue(data.responseDynamicData.lowestValueWithGroup);
            this.myForm.controls['exculdeDiscountAmount'].setValue(data.responseDynamicData.exculdeDiscountItems);
            this.myForm.controls['prompt'].setValue(data.responseDynamicData.prompt);
            this.myForm.controls['active'].setValue(data.responseDynamicData.active);
            this.myForm.controls['promotionApply'].setValue(data.responseDynamicData.appliedType);
            this.myForm.controls['BuyOptionalCount'].setValue(data.responseDynamicData.buyOptionalCount);
            this.myForm.controls['GetItemFixedPrice'].setValue(data.responseDynamicData.getItematFixedPrice);
            this.myForm.controls['GetOptionalCount'].setValue(data.responseDynamicData.getOptionalCount);
            this.myForm.controls['minPromotionQty'].setValue(data.responseDynamicData.minPromotionQty);
            this.myForm.controls['maxGiftPerInvoice'].setValue(data.responseDynamicData.maxGiftPerInvoice);
            this.myForm.controls['giftQuantity'].setValue(data.responseDynamicData.giftQuantity);
            this.myForm.controls['giftBillAmount'].setValue(data.responseDynamicData.giftBillAmount);
            this.myForm.controls['multiApplyForReceipt'].setValue(data.responseDynamicData.multiApplyForReceipt);
            this.buyItemTypeList = data.responseDynamicData.buyItemTypeList;

            // console.log(this.filelist2);
            this.filelist2 = new Array<any>();
            var buytemplist = null;

            if (this.buyItemTypeList != null && this.buyItemTypeList.length > 0) {
              buytemplist = this.buyItemTypeList.filter(x => x.typeName == "StyleCode" || x.typeName == "SKUCode");
            }

            if (buytemplist != null && buytemplist.length > 0) {
              for (let item of buytemplist) {
                this.filelist2.push({
                  "Type": item.typeName,
                  "Value": item.documentCode
                });
              }
            }
            // console.log("filelist2");
            // console.log(this.filelist2);

            // this.buyItemTypeList = null;
            // if (this.buyItemTypeList != null && this.buyItemTypeList.length > 0) {
            //   this.buyItemTypeList = this.buyItemTypeList.filter(x => x.typeName != "StyleCode" && x.typeName != "SKUCode");
            // }

            this.getItemTypeList = data.responseDynamicData.getItemTypeList;
            this.filelist3 = new Array<any>();
            if (this.getItemTypeList != null && this.getItemTypeList.length > 0) {

              var gettemplist = this.getItemTypeList.filter(x => x.typeName == "StyleCode" || x.typeName == "SKUCode");
              if (gettemplist != null && gettemplist.length > 0) {
                for (let item of gettemplist) {
                  this.filelist3.push({
                    "Type": item.typeName,
                    "Value": item.documentCode
                  });
                }
              }

              this.getItemTypeList = this.getItemTypeList.filter(x => x.typeName != "StyleCode" && x.typeName != "SKUCode");
            }

            this.store_List = data.responseDynamicData.storeList;
            this.customer_List = data.responseDynamicData.customerList;
            if (data.responseDynamicData != null && data.responseDynamicData.customerList != null && data.responseDynamicData.customerList.length > 0) {
              for (let cust of data.responseDynamicData.customerList) {
                if (cust.typeName == "Customer") {
                  this.cusList.push({
                    typeName: 'Customer',
                    customerCode: cust.documentCode,
                    customerName: cust.documentName,
                    // phoneNumber:cust.phoneNumber,
                    documentID: cust.documentID
                  });
                }
              }

            }

            this.productTypeList = data.responseDynamicData.productTypeList;

            this.filelist1 = new Array<any>();
            if (this.productTypeList != null && this.productTypeList.length > 0) {


              var producttemplist = this.productTypeList.filter(x => x.typeName == "StyleCode" || x.typeName == "SKUCode");
              if (producttemplist != null && producttemplist.length > 0) {
                for (let item of producttemplist) {
                  this.filelist1.push({
                    "Type": item.typeName,
                    "Value": item.documentCode
                  });
                }
              }
              this.productTypeList = this.productTypeList.filter(x => x.typeName != "StyleCode" && x.typeName != "SKUCode");
            }
            let promotion_Type = data.responseDynamicData.promotionType;
            if (promotion_Type.toLowerCase() == "gift based promotion") {
              this.buyItemTypeList = new Array<MCommonUtil>();
              this.showBuyItem = false;
              // this.common.showMessage("info", "For Gift Promotions, Buy Items are not applicable.")
            } else {
              this.showBuyItem = true;
            }
            resolve(1);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
            reject(msg);
          }
        });
    });
  }

  getBrandSelectedItems() {
    if (this.selectedBrandList != null) {
      for (let i = 0; i < this.selectedBrandList.length; i++) {
        if (this.brandselList != "") {
          this.brandselList = this.brandselList + ";" + this.selectedBrandList[i].brandName;
        }
        else {
          this.brandselList = this.selectedBrandList[i].brandName;
        }
      }
    }
  }

  getseason() {
    this.seasonList = null;
    // this.common.showSpinner();
    this.api.getAPI("season")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.seasonList = data.seasonMasterList;
          this.selectedSeasonList = [];
          this.getMappingSeason();
          this.seasonDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'seasonName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 2
          };
          //this.selectedSeasonList = [];
        } else {
          this.common.showMessage('warn', 'Failed to retrieve Data.');
        }
        // this.common.hideSpinner();
      });
  }

  getyear() {
    this.yearList = null;
    // this.common.showSpinner();
    this.api.getAPI("year")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.yearList = data.responseDynamicData;
          this.selectedYearList = [];
          this.getMappingYear();
          this.yearDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'year',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedYearList = [];
        } else {
          this.common.showMessage('warn', 'Failed to retrieve Data.');
        }
        // this.common.hideSpinner();
      });
  }

  getstylesegmentation() {
    this.styleSegmentList = null;
    // this.common.showSpinner();
    this.api.getAPI("stylesegmentation")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.styleSegmentList = data.responseDynamicData;
          this.selectedStyleSegmentationList = [];
          this.getMappingSegmentation();
          this.styleSegmentationDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'afSegamationName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedStyleSegmentationList = [];
        } else {
          this.common.showMessage('warn', 'Failed to retrieve Data.');
        }
        // this.common.hideSpinner();
      });
  }
  getproductGroup() {
    this.productGroupList = null;
    // this.common.showSpinner();
    this.api.getAPI("productgroup")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.productGroupList = data.productGroupList;
          this.selectedProductGroupList = [];
          this.getMappingProductGroup();
          this.productGroupDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'productGroupName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedProductGroupList = [];
        } else {
          this.common.showMessage('warn', 'Failed to retrieve Data.');
        }
        // this.common.hideSpinner();
      });
  }
  getproductSubGroup() {
    this.productSubGroupList = null;
    // this.common.showSpinner();
    this.api.getAPI("ProductSubGroupLookUp")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.productSubGroupList = data.productSubGroupList;
          this.selectedProductSubGroupList = [];
          this.getMappingProductSubGroup();
          this.productSubGroupDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'productSubGroupName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedProductSubGroupList = [];
        } else {
          this.common.showMessage('warn', 'Failed to retrieve Data.');
        }
        // this.common.hideSpinner();
      });
  }

  getSubBrand() {
    this.subBrandList = null;
    // this.common.showSpinner();
    this.api.getAPI("StoreBasedCountryID")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.subBrandList = data.subBrandList;
          this.selectedSubBrandList = [];
          this.getMappingSubBrand();
          this.subBrandDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'subBrandName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedSubBrandList = [];
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }

  getStoreGroupList() {
    this.storegroup_list = null;
    // this.common.showSpinner();
    this.api.getAPI("StoreGroup")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.storegroup_list = data.storeGroupMasterList;
          this.selectedStoreGroupList = [];
          this.getMappingStoreGroup();
          this.storeGroupDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'storeGroupName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }

  getCountry() {
    this.countryList = null;
    // this.common.showSpinner();
    this.api.getAPI("country")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.countryList = data.countryMasterList;
          this.selectedCountryList = [];
          this.getMappingCountry();
          this.countryDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'countryName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedCountryList = [];
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }
  getCustomerGroupList() {
    // this.common.showSpinner();
    this.api.getAPI("customergrouplookup")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.customerGroup_List = data.customerGroupMasterList;
          this.selectedCustomerGroupList = [];
          this.getMappingCustomerGroup();
          this.customerGroupDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'groupCode',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedCustomerGroupList = [];
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }

  getStore() {
    this.storeList = null;
    // this.common.showSpinner();
    this.api.getAPI("StoreBasedCountryID?countryid=0")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.storeList = data.storeMasterList;
          this.selectedStoreList = [];
          this.getMappingStore();
          this.storeDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'storeName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }

  getStyle() {
    this.styleList = null;
    // this.common.showSpinner();
    this.api.getAPI("StyleLookUp")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.styleList = data.styleMasterList;
          this.selectedStyleList = [];
          this.getMappingStyle();
          this.styleDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'styleCode',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedStyleList = [];
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }
  getCoupon() {
    this.coupon = null;
    // this.common.showSpinner();
    this.api.getAPI("CouponLookUp")
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.coupon = data.couponMasterList;
          this.selectedCouponList = [];
          this.getMappingCoupon();
          this.couponDropDownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'couponName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableCheckAll: true,
            allowSearchFilter: true,
            itemsShowLimit: 4
          };
          //this.selectedCouponList = [];
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }
  BuyItemDetailsValue() {
    let type = this.myForm.get('BuyitemType').value;
    this.BuyItemList = [];
    if (type == "StyleSegmentation") {
      for (let stye of this.styleSegmentList) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.afSegamationName
        });
      }
    } else if (type == "Year") {
      for (let stye of this.yearList) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.year
        });
      }
    }
    else if (type == "Brand") {
      for (let stye of this.brand_list) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.brandName
        });
      }
    }
    else if (type == "SubBrand") {
      for (let stye of this.subBrandList) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.subBrandName
        });
      }
    }
    else if (type == "Seasons") {
      for (let stye of this.seasonList) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.seasonName
        });
      }
    }
    else if (type == "ProductGroup") {
      for (let stye of this.productGroupList) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.productGroupName
        });
      }
    }
    else if (type == "ProductSubGroup") {
      for (let stye of this.productSubGroupList) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.productSubGroupName
        });
      }
    }
    else if (type == "Style") {
      for (let stye of this.styleList) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.styleCode
        });
      }
    }
    else if (type == "Coupon") {
      for (let stye of this.coupon) {
        this.BuyItemList.push({
          "id": stye.id,
          "name": stye.couponName
        });
      }
    }
    else if (type == "All") {
      this.BuyItemList.push({
        "id": "All",
        "name": "All"
      });
    }
  }
  GetItemDetailsValue() {
    this.GetItemList = [];
    let type = this.myForm.get('GetItemType').value;
    if (type == "StyleSegmentation") {
      for (let stye of this.styleSegmentList) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.afSegamationName
        });
      }
    } else if (type == "Year") {
      for (let stye of this.yearList) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.year
        });
      }
    }
    else if (type == "Brand") {
      for (let stye of this.brand_list) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.brandName
        });
      }
    }
    else if (type == "SubBrand") {
      for (let stye of this.subBrandList) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.subBrandName
        });
      }
    }
    else if (type == "Seasons") {
      for (let stye of this.seasonList) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.seasonName
        });
      }
    }
    else if (type == "ProductGroup") {
      for (let stye of this.productGroupList) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.productGroupName
        });
      }
    }
    else if (type == "ProductSubGroup") {
      for (let stye of this.productSubGroupList) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.productSubGroupName
        });
      }
    }
    else if (type == "Style") {
      for (let stye of this.styleList) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.styleCode
        });
      }
    }
    else if (type == "Coupon") {
      for (let stye of this.coupon) {
        this.GetItemList.push({
          "id": stye.id,
          "name": stye.couponName
        });
      }
    }
    else if (type == "All") {
      this.GetItemList.push({
        "id": "All",
        "name": "All"
      });
    }
  }
  void_item_get(item) {
    const idx = this.getItemTypeList.indexOf(item, 0);
    if (idx > -1) {
      this.getItemTypeList.splice(idx, 1);
    }
  }

  void_item_buy(item) {
    const idx = this.buyItemTypeList.indexOf(item, 0);
    if (idx > -1) {
      this.buyItemTypeList.splice(idx, 1);
    }
  }

  addPromotion() {
    this.getListInsert();
    let fromdate = this.myForm.get('startDate').value;
    let enddate = this.myForm.get('endDate').value;
    let promotion_Type = this.myForm.get('promotionType').value;
    if (fromdate > enddate) {
      this.common.showMessage("warn", "End Date Should be Greater than Start Date.");
    }
    else {
      if (this.store_List.length == 0) {
        this.common.showMessage("warn", "Please select Store Details.");
      }
      else if (promotion_Type.toLowerCase() != "gift based promotion" && this.buyItemTypeList.length == 0) {
        this.common.showMessage("warn", "Buy Item List is Empty.");
      }
      else {
        this.promotionMaster = new MPromotionMaster();
        if (this.promotionMaster == null) {
          this.common.showMessage("warn", "Can not Save, Division Details are invalid.");
        } else {

          this.promotionMaster.id = this.id;
          this.promotionMaster.promotionCode = this.myForm.get('promotionCode').value;
          this.promotionMaster.promotionName = this.myForm.get('promotionName').value;
          this.promotionMaster.promotionType = this.myForm.get('promotionType').value;
          this.promotionMaster.appliedType = this.myForm.get('promotionApply').value;
          this.promotionMaster.type = this.myForm.get('basePromotionType').value;
          //this.promotionMaster.PriceListID = _IPromotionsView.PriceListID;
          this.promotionMaster.startDate = this.myForm.get('startDate').value;
          this.promotionMaster.endDate = this.myForm.get('endDate').value;
          this.promotionMaster.minBillAmount = this.myForm.get('minimumBillAmount').value;
          this.promotionMaster.buyItemOptionalAmount = this.myForm.get('buyItemOptionalAmount').value;
          this.promotionMaster.minQuantity = this.myForm.get('minimumQuantity').value;
          this.promotionMaster.discount = this.myForm.get('discountType').value;
          this.promotionMaster.discountValue = this.myForm.get('discountValue').value;
          this.promotionMaster.allowMultiPromotion = this.myForm.get('allowMultiplePromotion').value;
          this.promotionMaster.lowestValue = this.myForm.get('lowestValue').value;
          this.promotionMaster.lowestValueWithGroup = this.myForm.get('lowestValueWithGroup').value;
          this.promotionMaster.exculdeDiscountItems = this.myForm.get('exculdeDiscountAmount').value;
          this.promotionMaster.prompt = this.myForm.get('prompt').value;
          this.promotionMaster.color = this.myForm.get('colors').value;
          this.promotionMaster.buyOptionalCount = this.myForm.get('BuyOptionalCount').value;
          this.promotionMaster.getOptionalCount = this.myForm.get('GetOptionalCount').value;
          this.promotionMaster.getItematFixedPrice = this.myForm.get('GetItemFixedPrice').value;
          this.promotionMaster.active = this.myForm.get('active').value;
          this.promotionMaster.minPromotionQty = this.myForm.get('minPromotionQty').value;
          this.promotionMaster.maxGiftPerInvoice = this.myForm.get('maxGiftPerInvoice').value;
          this.promotionMaster.giftQuantity = this.myForm.get('giftQuantity').value;
          this.promotionMaster.giftBillAmount = this.myForm.get('giftBillAmount').value;
          this.promotionMaster.multiApplyForReceipt = this.myForm.get('multiApplyForReceipt').value;

          this.promotionMaster.storeList = this.store_List;
          this.promotionMaster.customerList = this.customer_List;
          this.promotionMaster.productTypeList = this.productTypeList;
          this.promotionMaster.buyItemTypeList = this.buyItemTypeList;
          this.promotionMaster.getItemTypeList = this.getItemTypeList;
          // this.promotionMaster.productTypeList = this.filelist1;
          // this.promotionMaster.buyItemTypeList = this.filelist2;
          // this.promotionMaster.getItemTypeList = this.filelist3;

          /*this.buyItemTypeList = new Array<MCommonUtil>();
          this.getItemTypeList = new Array<MCommonUtil>();
          this.store_List = new Array<MCommonUtil>();
          this.customer_List = new Array<MCommonUtil>();
          this.productTypeList = new Array<MCommonUtil>();*/
          //console.log(this.buyItemTypeList);
          this.common.showSpinner();
          this.api.postAPI("promotion", this.promotionMaster).subscribe((data) => {
            //console.log(data);
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.common.hideSpinner();
              this.common.showMessage('success', data.displayMessage);
              this.router.navigate(['promotion']);
            } else {
              this.common.hideSpinner();
              this.common.showMessage('error', 'Failed to Save.');
            }

          });
        }
      }
    }
  }

  getListInsert() {
    //this.buyItemTypeList = new Array<MCommonUtil>();
    // this.getItemTypeList = new Array<MCommonUtil>();
    this.store_List = new Array<MCommonUtil>();
    this.customer_List = new Array<MCommonUtil>();
    this.productTypeList = new Array<MCommonUtil>();
    this.selectedStoreGroupList = this.selectedStoreGroupList.filter((item, index) => this.selectedStoreGroupList.indexOf(item) === index);
    this.selectedStoreList = this.selectedStoreList.filter((item, index) => this.selectedStoreList.indexOf(item) === index);
    this.selectedBrandList = this.selectedBrandList.filter((item, index) => this.selectedBrandList.indexOf(item) === index);
    this.selectedCountryList = this.selectedCountryList.filter((item, index) => this.selectedCountryList.indexOf(item) === index);
    this.selectedStyleSegmentationList = this.selectedStyleSegmentationList.filter((item, index) => this.selectedStyleSegmentationList.indexOf(item) === index);
    this.selectedYearList = this.selectedYearList.filter((item, index) => this.selectedYearList.indexOf(item) === index);
    this.selectedExclusionBrandList = this.selectedExclusionBrandList.filter((item, index) => this.selectedExclusionBrandList.indexOf(item) === index);
    this.selectedSubBrandList = this.selectedSubBrandList.filter((item, index) => this.selectedSubBrandList.indexOf(item) === index);
    this.selectedSeasonList = this.selectedSeasonList.filter((item, index) => this.selectedSeasonList.indexOf(item) === index);
    this.selectedProductGroupList = this.selectedProductGroupList.filter((item, index) => this.selectedProductGroupList.indexOf(item) === index);
    this.selectedProductSubGroupList = this.selectedProductSubGroupList.filter((item, index) => this.selectedProductSubGroupList.indexOf(item) === index);
    this.selectedStyleList = this.selectedStyleList.filter((item, index) => this.selectedStyleList.indexOf(item) === index);
    this.selectedCouponList = this.selectedCouponList.filter((item, index) => this.selectedCouponList.indexOf(item) === index);
    this.selectedCustomerList = this.selectedCustomerList.filter((item, index) => this.selectedCustomerList.indexOf(item) === index);
    this.selectedCustomerGroupList = this.selectedCustomerGroupList.filter((item, index) => this.selectedCustomerGroupList.indexOf(item) === index);
    for (let storegrp of this.storegroup_list) {
      for (let storeselect of this.selectedStoreGroupList) {
        if (storegrp.id == storeselect.id) {
          let tempstore: MCommonUtil = {
            typeName: "StorGroup",
            documentCode: storeselect.storeGroupCode,
            documentName: storeselect.storeGroupName,
            documentID: storeselect.id
          }
          this.store_List.push(tempstore);
        }
      }
    }

    for (let str of this.storeList) {
      for (let storesel of this.selectedStoreList) {
        if (storesel.id == str.id) {
          let tempstore: MCommonUtil = {
            typeName: "Store",
            documentCode: str.storeCode,
            documentName: str.storeName,
            documentID: str.id
          }
          this.store_List.push(tempstore);
        }
      }
    }

    for (let bnd of this.brand_list) {
      for (let brandsel of this.selectedBrandList) {
        if (brandsel.id == bnd.id) {
          let tempstore: MCommonUtil = {
            typeName: "Brand",
            documentCode: bnd.brandCode,
            documentName: bnd.brandName,
            documentID: bnd.id
          }
          this.store_List.push(tempstore);
        }
      }
    }

    for (let cntry of this.countryList) {
      for (let countrysel of this.selectedCountryList) {
        if (countrysel.id == cntry.id) {
          let tempstore: MCommonUtil = {
            typeName: "Country",
            documentCode: cntry.countryCode,
            documentName: cntry.countryName,
            documentID: cntry.id
          }
          this.store_List.push(tempstore);
        }
      }
    }

    for (let segm of this.styleSegmentList) {
      for (let selectseg of this.selectedStyleSegmentationList) {
        if (segm.id == selectseg.id) {
          let tempstore: MCommonUtil = {
            typeName: "StyleSegmentation",
            documentCode: segm.afSegamationCode,
            documentName: segm.afSegamationName,
            documentID: segm.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }

    for (let yer of this.yearList) {
      for (let selecyear of this.selectedYearList) {
        if (yer.id == selecyear.id) {
          let tempstore: MCommonUtil = {
            typeName: "Year",
            documentCode: yer.yearCode,
            documentName: yer.year,
            documentID: yer.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }

    for (let bnd of this.brand_list) {
      for (let brandsel of this.selectedExclusionBrandList) {
        if (brandsel.id == bnd.id) {
          let tempstore: MCommonUtil = {
            typeName: "Brand",
            documentCode: bnd.brandCode,
            documentName: bnd.brandName,
            documentID: bnd.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }

    for (let subbnd of this.subBrandList) {
      for (let subbrandsel of this.selectedSubBrandList) {
        if (subbrandsel.id == subbnd.id) {
          let tempstore: MCommonUtil = {
            typeName: "SubBrand",
            documentCode: subbnd.subBrandCode,
            documentName: subbnd.subBrandName,
            documentID: subbnd.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }

    for (let sea of this.seasonList) {
      for (let selecsea of this.selectedSeasonList) {
        if (selecsea.id == sea.id) {
          let tempstore: MCommonUtil = {
            typeName: "Season",
            documentCode: sea.seasonCode,
            documentName: sea.seasonName,
            documentID: sea.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }

    for (let prodgroup of this.productGroupList) {
      for (let selecproduct of this.selectedProductGroupList) {
        if (prodgroup.id == selecproduct.id) {
          let tempstore: MCommonUtil = {
            typeName: "ProductGroup",
            documentCode: prodgroup.productGroupCode,
            documentName: prodgroup.productGroupName,
            documentID: prodgroup.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }

    for (let prodsubgroup of this.productSubGroupList) {
      for (let selecproductsub of this.selectedProductSubGroupList) {
        if (prodsubgroup.id == selecproductsub.id) {
          let tempstore: MCommonUtil = {
            typeName: "ProductSubGroup",
            documentCode: prodsubgroup.productSubGroupCode,
            documentName: prodsubgroup.productSubGroupName,
            documentID: prodsubgroup.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }

    for (let sty of this.styleList) {
      for (let selectsty of this.selectedStyleList) {
        if (sty.id == selectsty.id) {
          let tempstore: MCommonUtil = {
            typeName: "Style",
            documentCode: sty.styleCode,
            documentName: sty.styleCode,
            documentID: sty.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }
    for (let coup of this.coupon) {
      for (let selectcoupon of this.selectedCouponList) {
        if (coup.id == selectcoupon.id) {
          let tempstore: MCommonUtil = {
            typeName: "Coupon",
            documentCode: coup.couponCode,
            documentName: coup.couponName,
            documentID: coup.id
          }
          this.productTypeList.push(tempstore);
        }
      }
    }

    if (this.filelist1 != null && this.filelist1.length > 0) {
      for (let item of this.filelist1) {
        this.productTypeList.push({
          typeName: item.Type,
          documentCode: item.Value,
          //documentID: item._rowNum_

        });
      }
    }
    if (this.filelist2 != null && this.filelist2.length > 0) {
      for (let item of this.filelist2) {
        this.buyItemTypeList.push({
          typeName: item.Type,
          documentCode: item.Value,
          //documentID: item._rowNum_

        });
      }
    }
    if (this.filelist3 != null && this.filelist3.length > 0) {
      for (let item of this.filelist3) {
        this.getItemTypeList.push({
          typeName: item.Type,
          documentCode: item.Value,
          // documentID: item._rowNum_

        });
      }
    }

    for (let custgroup of this.customerGroup_List) {
      for (let selectcustomergr of this.selectedCustomerGroupList) {
        if (custgroup.id == selectcustomergr.id) {
          let tempstore: MCommonUtil = {
            typeName: "CustomerGroup",
            documentCode: custgroup.groupCode,
            documentName: custgroup.groupName,
            documentID: custgroup.id
          }
          this.customer_List.push(tempstore);
        }
      }
    }
    if (this.cusList != null && this.cusList.length > 0) {
      for (let cust of this.cusList) {
        this.customer_List.push({
          typeName: 'Customer',
          documentCode: cust.customerCode,
          documentName: cust.customerName,
          documentID: cust.id

        });
      }
    }
  }

  addfile1(e) {
    try {
      this.showSpinner = true;
      const fileName = e.target.files[0].name;
      import('xlsx').then(xlsx => {
        let workBook1 = null;
        let sheetname1 = null;
        let jsonData1 = null;
        const reader1 = new FileReader();
        reader1.onload = (event) => {
          const data = reader1.result;
          workBook1 = xlsx.read(data, { type: 'binary' });
          jsonData1 = workBook1.SheetNames.reduce((initial, name) => {
            const sheet = workBook1.Sheets[name]
            initial[name] = xlsx.utils.sheet_to_json(sheet);
            initial[name].sheets = workBook1.SheetNames;
            return initial;
          }, {});
          this.filelist1 = jsonData1[Object.keys(jsonData1)[0]];
          this.showSpinner = false;
          this.btnAddstck = false;
        };
        reader1.readAsBinaryString(e.target.files[0]);
      });

    }
    catch (e) {
      console.log('error', e);
    }

  }
  addfile2(e) {
    try {
      this.showSpinner = true;
      const fileName = e.target.files[0].name;
      import('xlsx').then(xlsx => {
        let workBook2 = null;
        let sheetname2 = null;
        let jsonData2 = null;
        const reader2 = new FileReader();
        reader2.onload = (event) => {
          const data = reader2.result;
          workBook2 = xlsx.read(data, { type: 'binary' });
          jsonData2 = workBook2.SheetNames.reduce((initial, name) => {
            const sheet = workBook2.Sheets[name]
            initial[name] = xlsx.utils.sheet_to_json(sheet);
            initial[name].sheets = workBook2.SheetNames;
            return initial;
          }, {});
          this.filelist2 = jsonData2[Object.keys(jsonData2)[0]];
          this.showSpinner = false;
          this.btnAddstck = false;
        };
        reader2.readAsBinaryString(e.target.files[0]);
      });

    }
    catch (e) {
      console.log('error', e);
    }

  }
  addfile3(e) {
    try {
      this.showSpinner = true;
      const fileName = e.target.files[0].name;
      import('xlsx').then(xlsx => {
        let workBook3 = null;
        let sheetname3 = null;
        let jsonData3 = null;
        const reader3 = new FileReader();
        reader3.onload = (event) => {
          const data = reader3.result;
          workBook3 = xlsx.read(data, { type: 'binary' });
          jsonData3 = workBook3.SheetNames.reduce((initial, name) => {
            const sheet = workBook3.Sheets[name]
            initial[name] = xlsx.utils.sheet_to_json(sheet);
            initial[name].sheets = workBook3.SheetNames;
            return initial;
          }, {});
          this.filelist3 = jsonData3[Object.keys(jsonData3)[0]];
          this.showSpinner = false;
          this.btnAddstck = false;
        };
        reader3.readAsBinaryString(e.target.files[0]);
      });

    }
    catch (e) {
      console.log('error', e);
    }

  }
  // addBuyItemList() {
  //   let subcol_code = this.myForm.get('BuyitemType').value;
  //   let subcol_name = this.myForm.get('BuyitemValue').value;
  //   if (subcol_code != null && subcol_code != '' && subcol_name != null && subcol_name != '') {
  //     let tempSubCollection: MCommonUtil = {
  //       id: 0,
  //       typeName: this.myForm.get('BuyitemType').value,
  //       documentCode: this.myForm.get('BuyitemValue').value,
  //       documentName: this.myForm.get('BuyitemValue').value,
  //       documentID: this.myForm.get('BuyitemValue').value,
  //       quantity: this.myForm.get('BuyItemQuantity').value,
  //       amount: this.myForm.get('BuyItemAmount').value
  //     }

  //     this.buyItemTypeList.push(tempSubCollection);
  //     this.myForm.controls['BuyitemType'].setValue('');
  //     this.myForm.controls['BuyitemValue'].setValue('');
  //     this.myForm.controls['BuyItemAmount'].setValue('');
  //     this.myForm.controls['BuyItemQuantity'].setValue('');
  //   }
  //   else {
  //     this.common.showMessage("warn", "Type and Value is Empty");
  //   }
  // }
  addBuyItemList() {
    let subcol_code = this.myForm.get('BuyitemType').value;
    let subcol_name = this.myForm.get('BuyitemValue').value;
    let name = '';
    if (subcol_code == "Year") {
      let tmp_year = this.yearList.filter(x => x.id == subcol_name);
      name = tmp_year[0].year;
    }
    else if (subcol_code == "StyleSegmentation") {
      let temp_SegamationName = this.styleSegmentList.filter(x => x.id == subcol_name);
      name = temp_SegamationName[0].afSegamationName;
    }
    else if (subcol_code == "Brand") {
      let tmp_brand = this.brand_list.filter(x => x.id == subcol_name);
      name = tmp_brand[0].brandName;
    }
    else if (subcol_code == "SubBrand") {
      let tmp_subbrand = this.subBrandList.filter(x => x.id == subcol_name);
      name = tmp_subbrand[0].subBrandName;
    }
    else if (subcol_code == "Seasons") {
      let tmp_season = this.seasonList.filter(x => x.id == subcol_name);
      name = tmp_season[0].seasonName;
    }
    else if (subcol_code == "ProductGroup") {
      let tmp_productgroup = this.productGroupList.filter(x => x.id == subcol_name);
      name = tmp_productgroup[0].productGroupName;
    }
    else if (subcol_code == "ProductSubGroup") {
      let tmp_productsubgroup = this.productSubGroupList.filter(x => x.id == subcol_name);
      name = tmp_productsubgroup[0].productSubGroupName;
    }
    else if (subcol_code == "Coupon") {
      let tmp_coupon = this.coupon.filter(x => x.id == subcol_name);
      name = tmp_coupon[0].couponName;
    }
    else if (subcol_code == "All") {
      let tmp_all = "All";
      name = tmp_all;
    }
    if (subcol_code != null && subcol_code != '' && subcol_name != null && subcol_name != '') {
      let checkDuplicate:Array<MCommonUtil> = null;
      let allcheckDuplicate:Array<MCommonUtil> = null;

      if(this.buyItemTypeList != null && this.buyItemTypeList.length > 0){
        checkDuplicate = this.buyItemTypeList.filter(x => x.typeName == subcol_code && x.documentCode == subcol_name);
        allcheckDuplicate = this.buyItemTypeList.filter(x => x.typeName == 'All' && x.documentCode == 'All');
      }
      
      if (allcheckDuplicate != null && allcheckDuplicate.length > 0) {
        this.common.showMessage("warn", "Given  type already exists.please choose another type");
      }
      else {
        if (checkDuplicate != null && checkDuplicate.length > 0) {
          this.common.showMessage("warn", "Given  type already exists.please choose another type");
        }
        else {
          if (subcol_code == 'All' && subcol_name == 'All') {

            this.buyItemTypeList = new Array<any>();

          }
          let tempSubCollection: MCommonUtil = {
            id: 0,
            typeName: this.myForm.get('BuyitemType').value,
            documentCode: this.myForm.get('BuyitemValue').value,
            //documentName: this.myForm.get('BuyitemValue').value,
            documentName: name,
            buyQuantity: this.myForm.get('BuyOptionalCount').value,
            documentID: this.myForm.get('BuyitemValue').value,
            quantity: this.myForm.get('BuyItemQuantity').value,
            amount: this.myForm.get('BuyItemAmount').value
          }

          this.buyItemTypeList.push(tempSubCollection);
        }
      }
      //console.log(this.buyItemTypeList);
      this.myForm.controls['BuyitemType'].setValue('');
      this.myForm.controls['BuyitemValue'].setValue('');
      this.myForm.controls['BuyItemAmount'].setValue('');
      this.myForm.controls['BuyItemQuantity'].setValue('');
    }
    else {
      this.common.showMessage("warn", "Type and Value is Empty");
    }
  }

  // addGetItemList() {
  //   let subcol_code = this.myForm.get('GetItemType').value;
  //   let subcol_name = this.myForm.get('GetItemValue').value;
  //   let filter = this.getItemTypeList.filter(x => x.id == subcol_name)
  //   if (subcol_code != null && subcol_code != '' && subcol_name != null && subcol_name != '') {
  //     let tempSubCollection: MCommonUtil = {
  //       id: 0,
  //       typeName: this.myForm.get('GetItemType').value,
  //       documentCode: this.myForm.get('GetItemValue').value,
  //       documentName: this.myForm.get('GetItemValue').value,
  //       documentID: this.myForm.get('GetItemValue').value,
  //       discountType: this.myForm.get('GetItemDiscountType').value,
  //       discountValue: this.myForm.get('GetItemDiscountValue').value,
  //       quantity: this.myForm.get('GetItemQuantity').value,


  //     }

  //     this.getItemTypeList.push(tempSubCollection);
  //     this.myForm.controls['GetItemType'].setValue('');
  //     this.myForm.controls['GetItemValue'].setValue('');
  //     this.myForm.controls['GetItemDiscountType'].setValue('');
  //     this.myForm.controls['GetItemDiscountValue'].setValue('');
  //     this.myForm.controls['GetItemQuantity'].setValue('');
  //   }
  //   else {
  //     this.common.showMessage("warn", "Type and Value is Empty");
  //   }
  // }

  addGetItemList() {
    let subcol_code = this.myForm.get('GetItemType').value;
    let subcol_name = this.myForm.get('GetItemValue').value;
    let filter = this.getItemTypeList.filter(x => x.id == subcol_name);
    let name = '';
    if (subcol_code == "Year") {
      let tmp_year = this.yearList.filter(x => x.id == subcol_name);
      name = tmp_year[0].year;
    }
    else if (subcol_code == "StyleSegmentation") {
      let temp_SegamationName = this.styleSegmentList.filter(x => x.id == subcol_name);
      name = temp_SegamationName[0].afSegamationName;
    }
    else if (subcol_code == "Brand") {
      let tmp_brand = this.brand_list.filter(x => x.id == subcol_name);
      name = tmp_brand[0].brandName;
    }
    else if (subcol_code == "SubBrand") {
      let tmp_subbrand = this.subBrandList.filter(x => x.id == subcol_name);
      name = tmp_subbrand[0].subBrandName;
    }
    else if (subcol_code == "Seasons") {
      let tmp_season = this.seasonList.filter(x => x.id == subcol_name);
      name = tmp_season[0].seasonName;
    }
    else if (subcol_code == "ProductGroup") {
      let tmp_productgroup = this.productGroupList.filter(x => x.id == subcol_name);
      name = tmp_productgroup[0].productGroupName;
    }
    else if (subcol_code == "ProductSubGroup") {
      let tmp_productsubgroup = this.productSubGroupList.filter(x => x.id == subcol_name);
      name = tmp_productsubgroup[0].productSubGroupName;
    }
    else if (subcol_code == "Coupon") {
      let tmp_coupon = this.coupon.filter(x => x.id == subcol_name);
      name = tmp_coupon[0].couponName;
    }
    else if (subcol_code == "All") {
      let tmp_all = "All";
      name = tmp_all;
    }
    if (subcol_code != null && subcol_code != '' && subcol_name != null && subcol_name != '') {
      let checkDuplicate:Array<MCommonUtil> = null;
      let allcheckDuplicate:Array<MCommonUtil> = null;

      if(this.getItemTypeList != null && this.getItemTypeList.length > 0){
        checkDuplicate = this.getItemTypeList.filter(x => x.typeName == subcol_code && x.documentCode == subcol_name);
        allcheckDuplicate = this.getItemTypeList.filter(x => x.typeName == 'All' && x.documentCode == 'All');
      }
      
      if (allcheckDuplicate != null && allcheckDuplicate.length > 0) {
        this.common.showMessage("warn", "All Type Already Exists. No other Types are required");

      }
      else {
        if (checkDuplicate != null && checkDuplicate.length > 0) {
          this.common.showMessage("warn", "All Type Already Exists. No other Types are required");
        }
        else {
          if (subcol_code == 'All' && subcol_name == 'All') {
            this.getItemTypeList = new Array<any>();
          }

          let tempSubCollection: MCommonUtil = {
            id: 0,
            typeName: this.myForm.get('GetItemType').value,
            documentCode: this.myForm.get('GetItemValue').value,
            // documentName: this.myForm.get('GetItemValue').value,
            documentName: name,
            documentID: this.myForm.get('GetItemValue').value,
            discountType: this.myForm.get('GetItemDiscountType').value,
            discountValue: this.myForm.get('GetItemDiscountValue').value,
            getQuantity: this.myForm.get('GetOptionalCount').value,
            quantity: this.myForm.get('GetItemQuantity').value,

          }

          this.getItemTypeList.push(tempSubCollection);

        }
      }
      this.myForm.controls['GetItemType'].setValue('');
      this.myForm.controls['GetItemValue'].setValue('');
      this.myForm.controls['GetItemDiscountType'].setValue('');
      this.myForm.controls['GetItemDiscountValue'].setValue('');
      this.myForm.controls['GetItemQuantity'].setValue('');

    }
    else {
      this.common.showMessage("warn", "Type and Value is Empty");
    }
  }
  onCheckboxChange(e) {
    let lowest = this.myForm.get('lowestValue').value;
    if (e.target.checked) {
      if (lowest == true) {
        if (confirm("Lowest Value is Selected. IF you Select Lowest Value with Group, the Other will get Deactivated")) {
          this.myForm.controls['lowestValue'].setValue(false);
        }
        else {
          this.myForm.controls['lowestValueWithGroup'].setValue(false);
        }
      }
    }
  }
  onCheckboxChangeLowest(e) {
    let lowest = this.myForm.get('lowestValueWithGroup').value;
    if (e.target.checked) {
      if (lowest == true) {
        if (confirm("Lowest Value with Group is Selected. IF you Select Lowest Value, the Other will get Deactivated")) {
          this.myForm.controls['lowestValueWithGroup'].setValue(false);
        }
        else {
          this.myForm.controls['lowestValue'].setValue(false);
        }
      }
    }
  }
  basePromotionValidate() {
    let selectvalue = this.myForm.get('basePromotionType').value;
    if (selectvalue == "Fixed Price") {
      this.myForm.get('GetItemFixedPrice').disable();
      this.myForm.get('GetOptionalCount').disable();
      this.myForm.get('GetItemType').disable();
      this.myForm.get('GetItemValue').disable();
      this.myForm.get('GetItemDiscountType').disable();
      this.myForm.get('GetItemDiscountValue').disable();
      this.getItemTypeList = new Array<MCommonUtil>();
    }
    else {
      this.myForm.get('GetItemFixedPrice').enable();
      this.myForm.get('GetOptionalCount').enable();
      this.myForm.get('GetItemType').enable();
      this.myForm.get('GetItemValue').enable();
      this.myForm.get('GetItemDiscountType').enable();
      this.myForm.get('GetItemDiscountValue').enable();
    }
  }

  promotionTypeChanged() {
    let promotion_Type = this.myForm.get('promotionType').value;
    if (promotion_Type.toLowerCase() == "gift based promotion") {
      this.buyItemTypeList = new Array<MCommonUtil>();
      this.showBuyItem = false;
      this.common.showMessage("info", "For Gift Promotions, Buy Items are not applicable.")
    } else {
      this.showBuyItem = true;
    }
  }

  promotionGetApply() {
    let selectvalue = this.myForm.get('promotionApply').value;
    if ((selectvalue == "Apply On Buy Items") || (selectvalue == "Apply On Bill")) {
      this.common.showMessage("warn", "Get Item not Applicable it will cleared.");
      this.getItemTypeList = new Array<MCommonUtil>();
      this.myForm.get('GetItemFixedPrice').disable();
      this.myForm.get('GetOptionalCount').disable();
      this.myForm.get('GetItemType').disable();
      this.myForm.get('GetItemValue').disable();
      this.myForm.get('GetItemDiscountType').disable();
      this.myForm.get('GetItemDiscountValue').disable();
      this.myForm.controls['GetItemFixedPrice'].setValue('');
      this.myForm.controls['GetOptionalCount'].setValue('');
      this.filelist3 = [];
    }
    else {
      this.myForm.get('GetItemFixedPrice').enable();
      this.myForm.get('GetOptionalCount').enable();
      this.myForm.get('GetItemType').enable();
      this.myForm.get('GetItemValue').enable();
      this.myForm.get('GetItemDiscountType').enable();
      this.myForm.get('GetItemDiscountValue').enable();
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

  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['promotion']);
      }
    }
    else {
      this.router.navigate(['promotion']);
    }
  }

  getMappingStore() {
    if (this.store_List != null) {
      for (let i = 0; i < this.storeList.length; i++) {
        for (let j = 0; j < this.store_List.length; j++) {
          if (this.store_List[j].documentID == this.storeList[i].id && this.store_List[j].typeName == "Store") {
            this.selectedStoreList.push({
              id: this.storeList[i].id,
              storeName: this.storeList[i].storeName
            });
          }
        }
      }
    }
  }
  getMappingStoreGroup() {
    if (this.store_List != null) {
      for (let i = 0; i < this.storegroup_list.length; i++) {
        for (let j = 0; j < this.store_List.length; j++) {
          if (this.store_List[j].documentID == this.storegroup_list[i].id && this.store_List[j].typeName == "StorGroup") {
            this.selectedStoreGroupList.push({
              id: this.storegroup_list[i].id,
              storeGroupName: this.storegroup_list[i].storeGroupName
            });
          }
        }
      }
    }
  }
  getMappngBrand() {
    if (this.store_List != null) {
      for (let i = 0; i < this.brand_list.length; i++) {
        for (let j = 0; j < this.store_List.length; j++) {
          if (this.store_List[j].documentID == this.brand_list[i].id && this.store_List[j].typeName == "Brand") {
            this.selectedBrandList.push({
              id: this.brand_list[i].id,
              brandName: this.brand_list[i].brandName
            });
          }
        }
      }
    }
  }
  getMappingExclGroup() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.brand_list.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.brand_list[i].id && this.productTypeList[j].typeName == "Brand") {
            this.selectedExclusionBrandList.push({
              id: this.brand_list[i].id,
              brandName: this.brand_list[i].brandName
            });
          }
        }
      }
    }
  }
  getMappingCountry() {
    if (this.store_List != null) {
      for (let i = 0; i < this.countryList.length; i++) {
        for (let j = 0; j < this.store_List.length; j++) {
          if (this.store_List[j].documentID == this.countryList[i].id && this.store_List[j].typeName == "Country") {
            this.selectedCountryList.push({
              id: this.countryList[i].id,
              countryName: this.countryList[i].countryName
            });
          }
        }
      }
    }
  }
  getMappingSegmentation() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.styleSegmentList.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.styleSegmentList[i].id && this.productTypeList[j].typeName == "StyleSegmentation") {
            this.selectedStyleSegmentationList.push({
              id: this.styleSegmentList[i].id,
              afSegamationName: this.styleSegmentList[i].afSegamationName
            });
          }
        }
      }
    }
  }
  getMappingYear() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.yearList.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.yearList[i].id && this.productTypeList[j].typeName == "Year") {
            this.selectedYearList.push({
              id: this.yearList[i].id,
              year: this.yearList[i].year
            });
          }
        }
      }
    }
  }
  getMappingSubBrand() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.subBrandList.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.subBrandList[i].id && this.productTypeList[j].typeName == "SubBrand") {
            this.selectedSubBrandList.push({
              id: this.subBrandList[i].id,
              subBrandName: this.subBrandList[i].subBrandName
            });
          }
        }
      }
    }
  }
  getMappingSeason() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.seasonList.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.seasonList[i].id && this.productTypeList[j].typeName == "Season") {
            this.selectedSeasonList.push({
              id: this.seasonList[i].id,
              seasonName: this.seasonList[i].seasonName
            });
          }
        }
      }
    }
  }
  getMappingProductGroup() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.productGroupList.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.productGroupList[i].id && this.productTypeList[j].typeName == "ProductGroup") {
            this.selectedProductGroupList.push({
              id: this.productGroupList[i].id,
              productGroupName: this.productGroupList[i].productGroupName
            });
          }
        }
      }
    }
  }
  getMappingProductSubGroup() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.productSubGroupList.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.productSubGroupList[i].id && this.productTypeList[j].typeName == "ProductSubGroup") {
            this.selectedProductSubGroupList.push({
              id: this.productSubGroupList[i].id,
              productSubGroupName: this.productSubGroupList[i].productSubGroupName
            });
          }
        }
      }
    }
  }
  getMappingStyle() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.styleList.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.styleList[i].id && this.productTypeList[j].typeName == "Style") {
            this.selectedStyleList.push({
              id: this.styleList[i].id,
              styleCode: this.styleList[i].styleCode
            });
          }
        }
      }
    }
  }
  getMappingCoupon() {
    if (this.productTypeList != null) {
      for (let i = 0; i < this.coupon.length; i++) {
        for (let j = 0; j < this.productTypeList.length; j++) {
          if (this.productTypeList[j].documentID == this.coupon[i].id && this.productTypeList[j].typeName == "Coupon") {
            this.selectedCouponList.push({
              id: this.coupon[i].id,
              couponName: this.coupon[i].couponName
            });
          }
        }
      }
    }
  }
  getMappingCustomerGroup() {
    if (this.customer_List != null) {
      for (let i = 0; i < this.customerGroup_List.length; i++) {
        for (let j = 0; j < this.customer_List.length; j++) {
          if (this.customer_List[j].documentID == this.customerGroup_List[i].id && this.customer_List[j].typeName == "CustomerGroup") {
            this.selectedCustomerGroupList.push({
              id: this.customerGroup_List[i].id,
              groupCode: this.customerGroup_List[i].groupCode
            });
          }
        }
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

  customersearch() {

    var searchvalue = this.myForm.get('globalSearch').value;
    if (searchvalue != "") {
      this.api.getAPI("customer?CustomerSearchString=" + searchvalue)
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.customerdetails = data.responseDynamicData;
            var alreadyexists = false;
            if (this.cusList != null && this.cusList.length > 0) {
              for (let item of this.cusList) {
                if (this.customerdetails[0].customerCode == item.customerCode) {
                  alreadyexists = true;
                }
              }
            }
            if (alreadyexists) {
              this.common.showMessage('warn', 'Already Exists');
              return false;
            }
            else {
              this.cusList.push(data.responseDynamicData[0]);
              this.myForm.controls['globalSearch'].setValue('');
              return true;
            }

            // this.cusList.push(data.responseDynamicData[0]);

            this.myForm.controls['globalSearch'].setValue('');

          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          // this.common.hideSpinner();
        });
    }
  }

  void_item(item) {
    const idx = this.cusList.indexOf(item, 0);
    if (idx > -1) {
      this.cusList.splice(idx, 1);
    }
  }
  Buyitemclear() {
    this.myForm.controls['BuyitemValue'].setValue('');
    this.myForm.controls['BuyitemType'].setValue('');
    this.myForm.controls['BuyItemAmount'].setValue('');
    this.myForm.controls['BuyItemQuantity'].setValue('');
  }
  Getitemclear() {
    this.myForm.controls['GetItemType'].setValue('');
    this.myForm.controls['GetItemValue'].setValue('');
    this.myForm.controls['GetItemDiscountType'].setValue('');
    this.myForm.controls['GetItemDiscountValue'].setValue('');
    this.myForm.controls['GetItemQuantity'].setValue('');
  }
}
