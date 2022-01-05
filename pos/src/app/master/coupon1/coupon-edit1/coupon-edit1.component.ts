import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { style } from '@angular/animations';
import { MCommonUtil } from 'src/app/models/m-common-util';
import { MCouponMaster } from 'src/app/models/m-coupon-master';
import { MCountryMaster } from 'src/app/models/m-country-master';
import { timeStamp } from 'console';
import { rejects } from 'assert';
import { resolve } from 'dns';


@Component({
  selector: 'app-coupon-edit1',
  templateUrl: './coupon-edit1.component.html',
  styleUrls: ['./coupon-edit1.component.css']
})
export class CouponEdit1Component implements OnInit {
  myForm: FormGroup;
  countryDropdownSettings: IDropdownSettings = {};
  //countryList: Array<any>;
  selectedCountryList = [];
  getItemTypeList: Array<MCommonUtil>;
  couponMaster: MCouponMaster;
  countryList: Array<MCountryMaster>;
  countryName: any;
  subBrandList: Array<any>;
  storegroup_list: Array<any>;
  // countryList: Array<any>;
  storeList: Array<any>;
  customerGroup_List: Array<any>;
  cusList = [];
  couponDetailList = [];
  styleList: Array<any>;
  coupon: Array<any>;
  selectedBrandList = [];
  selectedSubBrandList = [];
  // selectedCountryList = [];
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
  brandDropdownSettings: IDropdownSettings = {};
  subBrandDropDownSettings: IDropdownSettings = {};
  //countryDropdownSettings: IDropdownSettings = {};
  storeGroupDropdownSettings: IDropdownSettings = {};
  customerGroupDropDownSettings: IDropdownSettings = {};
  customerDropDownSettings: IDropdownSettings = {};
  styleDropDownSettings: IDropdownSettings = {};
  couponDropDownSettings: IDropdownSettings = {};
  seasonDropDownSettings: IDropdownSettings = {};
  brand_list: Array<any>;
  seasonList: Array<any>;
  yearList: Array<any>;
  divisionList: Array<any>;
  styleSegmentList: Array<any>;
  brandselList: string = "";
  yearDropDownSettings: IDropdownSettings = {};
  styleSegmentationDropDownSettings: IDropdownSettings = {};
  productGroupList: Array<any>;
  productGroupDropDownSettings: IDropdownSettings = {};
  productSubGroupList: Array<any>;
  productSubGroupDropDownSettings: IDropdownSettings = {};
  storeDropDownSettings: IDropdownSettings = {};
  exclusionBrandGropDownSettings: IDropdownSettings = {};
  buyItemTypeList: Array<MCommonUtil>;
  //getItemTypeList: Array<MCommonUtil>;
  store_List: Array<MCommonUtil>;
  customer_List: Array<MCommonUtil>;
  productTypeList: Array<MCommonUtil>;
  CustomerSearchString: string = "";
  customerdetails: Array<any>;
  couponDetails_List: Array<any>;
  //customerList: Array<any>;
  customerCode: any;
  customerName: any;
  PhoneNumber: any
  CouponList: any;
  user_details: any;
  id: any;
  BuyItemList: any[];
  GetItemList: any[];

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute) {
      this.createForm();
     }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCouponList();
    //this.getCountry1();
  }

  getCouponList() {

    this.common.showSpinner();
    this.api.getAPI("coupon?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // console.log("Coupon Data");
            //  console.log(data);
            //this.myForm.controls['franchiselistID'].setValue(data.storeMasterData.franchiseID);
            //this.getCountry1();
            this.myForm.controls['CouponCode'].setValue(data.couponMasterRecord.couponCode);
            this.myForm.controls['Coupondescription'].setValue(data.couponMasterRecord.coupondescription);
            this.myForm.controls['BarCode'].setValue(data.couponMasterRecord.barCode);
            this.myForm.controls['startDate'].setValue(this.common.toYMDFormat(new Date(data.couponMasterRecord.startDate)));
            this.myForm.controls['endDate'].setValue(this.common.toYMDFormat(new Date(data.couponMasterRecord.endDate)));
            this.myForm.controls['CouponType'].setValue(data.couponMasterRecord.couponType);
            //this.getCountry1();
            this.myForm.controls['countryID'].setValue(data.couponMasterRecord.country);
            this.countryName = data.couponMasterRecord.country;
            this.myForm.controls['DiscountType'].setValue(data.couponMasterRecord.discountType);
            this.myForm.controls['DiscountValue'].setValue(data.couponMasterRecord.discountValue);
            this.myForm.controls['Remarks'].setValue(data.couponMasterRecord.remarks);
            this.myForm.controls['IssuableAtPOS'].setValue(data.couponMasterRecord.issuableAtPOS);
            this.myForm.controls['Serial'].setValue(data.couponMasterRecord.serial);
            this.myForm.controls['Active'].setValue(data.couponMasterRecord.active);
           this.myForm.controls['CouponSerialCode'].setValue(data.couponMasterRecord.couponSerialCode);
           this.myForm.controls['PhysicalStore'].setValue(data.couponMasterRecord.physicalStore);
           this.myForm.controls['Remainingamount'].setValue(data.couponMasterRecord.remainingamount);
           this.myForm.controls['Redeemedstatus'].setValue(data.couponMasterRecord.redeemedstatus);
           this.myForm.controls['Issuedstatus'].setValue(data.couponMasterRecord.issuedstatus);

              debugger
           this.myForm.controls['IsExpirable'].setValue(data.couponMasterRecord.isExpirable);
           this.myForm.controls['MinBillAmount'].setValue(data.couponMasterRecord.minBillAmount);
           this.myForm.controls['MaxNoIssue'].setValue(data.couponMasterRecord.maxNoIssue);
           this.myForm.controls['MaxLimit'].setValue(data.couponMasterRecord.maxLimit);
           this.myForm.controls['RedeemType'].setValue(data.couponMasterRecord.redeemType);
           this.myForm.controls['ExpiryDays'].setValue(data.couponMasterRecord.expiryDays);

            this.store_List = data.couponMasterRecord.storeCommonUtilData;
            this.customer_List = data.couponMasterRecord.customerCommonUtilData;
            this.productTypeList = data.couponMasterRecord.productTypeList;
            for(let cust of data.couponMasterRecord.customerCommonUtilData)
            {
              if(cust.typeName == "Customer"){
              this.cusList.push({
                typeName: 'Customer',
                customerCode: cust.documentCode,
                customerName: cust.documentName,
                // phoneNumber:cust.phoneNumber,
                documentID: cust.documentID
              });
            }
            }



          //console.log(this.countryName);
            //this.buyItemTypeList = data.responseDynamicData.buyItemTypeList;
           // this.getItemTypeList = data.responseDynamicData.getItemTypeList;



            this.getCountry_promise().then((data1)=>{
              this. getMappingstoreCountry()
              .then((data1) => {
                //this.common.hideSpinner();
                this.getBrand_promise().then((data2)=>{
                  this. getstorebrand()
            .then((data2) => {
            this. getMappingGroup()
            .then((data3) => {
              //this.common.hideSpinner();
              this.getyear_promise().then((data4)=>{
                this.getMappingYear()
                .then((data4) => {
                  this.getseason_promise().then((data5)=>{
                    this.getMappingSeason()
                    .then((data5) => {
                      this.getproductGroup_promise().then((data6)=>{
                        this.getMappingProductGroup()
                        .then((data6) => {
                          this.getproductSubGroup_promise().then((data7)=>{
                            this.getMappingProductSubGroup()
                            .then((data7) => {
                              this.getSubBrand_promise().then((data8)=>{
                                this.getMappingSubBrand()
                                .then((data8) => {
                                  this.getStyle_promise().then((data9)=>{
                                    this.getMappingproductStyle()
                                    .then((data9) => {
                                      this.getCoupon_promise().then((data10)=>{
                                        this.getMappingproductCoupon()
                                        .then((data10) => {
                                          this.getCustomerGroupList_promise().then((data11)=>{
                                            this.getMappingCustomerGroup()
                                            .then((data11) => {
                                              this.getStore_promise().then((data12)=>{
                                                this.getMappingStore()
                                                .then((data12) => {
                                                  this.getStoreGroupList_promise().then((data13)=>{
                                                    this.getMappingStoreGroup()
                                                    .then((data13) => {
                                                      this.getstylesegmentation_promise().then((data14)=>{
                                                        this.getMappingSegmentation()
                                                        .then((data14) => {
                                                          this.common.hideSpinner();
                                                        })
                                                        .catch((err14) => {
                                                          this.common.hideSpinner();
                                                          this.common.showMessage("warn", err14);
                                                        });
                                                      })
                                                    })
                                                    .catch((err13) => {
                                                      this.common.hideSpinner();
                                                      this.common.showMessage("warn", err13);
                                                    });
                                                  })
                                                })
                                                .catch((err12) => {
                                                  this.common.hideSpinner();
                                                  this.common.showMessage("warn", err12);
                                                });
                                              })
                                            })
                                            .catch((err11) => {
                                              this.common.hideSpinner();
                                              this.common.showMessage("warn", err11);
                                            });
                                          })
                                        })
                                        .catch((err10) => {
                                          this.common.hideSpinner();
                                          this.common.showMessage("warn", err10);
                                        });
                                      })
                                    })
                                    .catch((err9) => {
                                      this.common.hideSpinner();
                                      this.common.showMessage("warn", err9);
                                    });
                                  })
                                })
                                .catch((err8) => {
                                  this.common.hideSpinner();
                                  this.common.showMessage("warn", err8);
                                });
                              })
                            })
                            .catch((err7) => {
                              this.common.hideSpinner();
                              this.common.showMessage("warn", err7);
                            });
                          })
                        })
                        .catch((err6) => {
                          this.common.hideSpinner();
                          this.common.showMessage("warn", err6);
                        });
                      })
                    })
                    .catch((err5) => {
                      this.common.hideSpinner();
                      this.common.showMessage("warn", err5);
                    });
                  })
                })
                .catch((err4) => {
                  this.common.hideSpinner();
                  this.common.showMessage("warn", err4);
                });
              })
            .catch((err3) => {
              this.common.hideSpinner();
              this.common.showMessage("warn", err3);
            });
            })
            .catch((err2) => {
              this.common.hideSpinner();
              this.common.showMessage("warn", err2);
            });
                })
              })
              .catch((err1) => {
                this.common.hideSpinner();
                this.common.showMessage("warn", err1);
              });
            })
          })
            .catch((err1)=>{
            });






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

  getstoregroup() {
    return new Promise((resolve, reject) => {
    if (this.store_List != null) {
      for (let i = 0; i < this.storeList.length; i++) {
        for (let j = 0; j < this.store_List.length; j++) {
          if (this.store_List[j].documentID == this.storeList[i].id && this.store_List[j].typeName == "Store") {
            this.selectedStoreList.push({
              id: this.storeList[i].documentID,
              storeName: this.storeList[i].documentName
            });
          }
        }
      }
    }
    resolve("ok");
  });
  }
  getstorebrand() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  createForm() {
    this.myForm = this.fb.group({
      CouponCode: ['', Validators.required],
      Coupondescription: ['', Validators.required],
      BarCode: ['', Validators.required],
      IsLimitedPeriodOffer:[''],
      countryID: ['', Validators.required],
      CouponType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      DiscountType: ['', Validators.required],
      DiscountValue: ['', Validators.required],
      Active: [true],
      IssuableAtPOS: [true],
      Serial: [true],
      Remarks: ['', Validators.required],
      globalSearch: [''],
      CouponSerialCode:[''],
        PhysicalStore:[''],
        Remainingamount:[''],
        Redeemedstatus:[''],
        Issuedstatus:[''],
      // Issuedstatus: [true],
      IsExpirable: [false],
      MinBillAmount:['', Validators.required],
      MaxNoIssue:['',Validators.required],
      MaxLimit:['',Validators.required],
      RedeemType :['',Validators.required],
      ExpiryDays:['',Validators.required]

    });
   // this.getCountry();
    // this.buyItemTypeList = new Array<MCommonUtil>();
    // this.getItemTypeList = new Array<MCommonUtil>();
    this.buyItemTypeList = new Array<MCommonUtil>();
    this.getItemTypeList = new Array<MCommonUtil>();
    this.store_List = new Array<MCommonUtil>();
    this.customer_List = new Array<MCommonUtil>();
    this.productTypeList = new Array<MCommonUtil>();
    this.couponDetailList = new Array<MCommonUtil>();

    // this.getBrand();
    // this.getCountry();
    // this.getCountry1()
    // this.getStoreGroupList();
    // this.getstylesegmentation();
    // this.getyear();
    // this.getseason();
    // this.getproductGroup();
    // this.getproductSubGroup();
    // this.getSubBrand();
    // this.getStyle();
    // //this.getCoupon();
    // this.getCustomerGroupList();
    // this.getStore();

  }

  getCountry_promise() {
    this.countryList = null;
    return new Promise((resolve, reject) => {
      this.api.getAPI("country")
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
            this.selectedCountryList = [];


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
            resolve("ok");
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            // this.common.showMessage('warn', msg);
            reject(msg);
          }
        });
    });

  }

  getMappingstoreCountry() {
    return new Promise((resolve, reject) => {
      if (this.store_List != null) {
        for (let i = 0; i < this.countryList.length; i++) {
          for (let j = 0; j < this.store_List.length; j++) {
            if (this.store_List[j].documentID == this.countryList[i].id && this.store_List[j].typeName == "Country") {
              this.selectedCountryList.push({
                id: this.countryList[i].id,
                countryName: this.countryList[i].countryName
              });
            //  console.log(this.selectedCountryList);
            }
          }
        }
      }
      resolve("ok");
    });
  }

  getBrand_promise() {
    return new Promise((resolve, reject) => {
    this.brand_list = null;
    this.api.getAPI("brand")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brand_list = data.responseDynamicData;
            // resolve(data.responseDynamicData);
            this.selectedBrandList = [];
            this.selectedExclusionBrandList = [];

            // this.getstorebrand();
            // this.getMappingGroup();
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
            //this.selectedBrandList = [];
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
            resolve("ok");
           // this.selectedExclusionBrandList = [];
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
          }
      });
    });
  });
  }

  // getstylesegmentation_promise() {
  //   return new Promise((resolve, reject) => {
  //   this.styleSegmentList = null;
  //   this.api.getAPI("stylesegmentation")
  //     .subscribe((data) => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           this.styleSegmentList = data.responseDynamicData;
  //           this.selectedStyleSegmentationList = [];
  //            //this.getMappingSegmentation() ;
  //           this.styleSegmentationDropDownSettings = {
  //             singleSelection: false,
  //             idField: 'id',
  //             textField: 'SegamationName',
  //             selectAllText: 'Select All',
  //             unSelectAllText: 'UnSelect All',
  //             enableCheckAll: true,
  //             allowSearchFilter: true,
  //             itemsShowLimit: 4
  //           };
  //           resolve("ok");
  //           // this.selectedExclusionBrandList = [];
  //          } else {
  //            let msg: string = data != null
  //              && data.displayMessage != null
  //              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //              reject(msg);
  //          }
  //     });
  //   });
  // }

  getstylesegmentation_promise() {
    return new Promise((resolve, reject) => {
    this.styleSegmentList = null;
    this.api.getAPI("stylesegmentation")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.styleSegmentList = data.responseDynamicData;
            this.selectedStyleSegmentationList = [];
            //this.getMappingSegmentation();
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
            resolve("ok");
           // this.selectedExclusionBrandList = [];
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
          }
        });
      });
  }
  getMappingSegmentation() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  // getMappingSegmentation() {
  //   return new Promise((resolve, reject) => {
  //   if (this.productTypeList != null) {
  //     for (let i = 0; i < this.styleSegmentList.length; i++) {
  //       for (let j = 0; j < this.productTypeList.length; j++) {
  //         if (this.productTypeList[j].documentID == this.styleSegmentList[i].id && this.productTypeList[j].typeName == "StyleSegmentation") {
  //           this.selectedStyleSegmentationList.push({
  //             id: this.styleSegmentList[i].id,
  //             SegamationName: this.styleSegmentList[i].SegamationName
  //           });
  //           console.log(this.selectedStyleSegmentationList);
  //         }
  //       }
  //     }
  //   }
  //   resolve("ok");
  // });
  // }
  getyear_promise() {
    return new Promise((resolve, reject) => {
    this.yearList = null;
    this.api.getAPI("year")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.yearList = data.responseDynamicData;
            this.selectedYearList = [];
            //this.getMappingYear();
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
            resolve("ok");
            // this.selectedExclusionBrandList = [];
           } else {
             let msg: string = data != null
               && data.displayMessage != null
               && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
               reject(msg);
           }
      });
    });

  }

   getseason_promise() {
    return new Promise((resolve, reject) => {
    this.seasonList = null;
    this.api.getAPI("season")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.seasonList = data.seasonMasterList;
            this.selectedSeasonList = [];
           // this.getMappingSeason();
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
            resolve("ok");
           // this.selectedSeasonList = [];
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
          }

      });
    });
  }

  getproductGroup_promise() {
    return new Promise((resolve, reject) => {
    this.productGroupList = null;
    this.api.getAPI("productgroup")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productGroupList = data.productGroupList;
            this.selectedProductGroupList = [];
            //this.getMappingProductGroup();
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
            resolve("ok");
            // this.selectedSeasonList = [];
           } else {
             let msg: string = data != null
               && data.displayMessage != null
               && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
               reject(msg);
           }
        });
      });
  }

  getproductSubGroup_promise() {
    return new Promise((resolve, reject) => {
    this.productSubGroupList = null;
    this.api.getAPI("ProductSubGroupLookUp")
      .subscribe((data) => {
           if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productSubGroupList = data.productSubGroupList;
            this.selectedProductSubGroupList = [];
           // this.getMappingProductSubGroup();
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
            resolve("ok");
            // this.selectedSeasonList = [];
           } else {
             let msg: string = data != null
               && data.displayMessage != null
               && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
               reject(msg);
           }
          });
      });
  }

  getSubBrand_promise() {
    return new Promise((resolve, reject) => {
    this.subBrandList = null;
    this.api.getAPI("StoreBasedCountryID")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.subBrandList = data.subBrandList;
            this.selectedSubBrandList = [];
           // this.getMappingSubBrand();
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
            resolve("ok");
           // this.selectedSubBrandList = [];
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
          }
        });
      });
  }
  getMappingProductSubGroup() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  getStyle_promise() {
    return new Promise((resolve, reject) => {
    this.styleList = null;
    this.api.getAPI("StyleLookUp")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.styleList = data.styleMasterList;
            this.selectedStyleList = [];
           // this. getMappingproductStyle();
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
            resolve("ok");
          //  this.selectedStyleList = [];
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
          }
        });
      });
  }

  getMappingproductStyle() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  getCustomerGroupList_promise() {
    return new Promise((resolve, reject) => {
    this.api.getAPI("customergrouplookup")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //console.log(data.customerGroupMasterList);
            this.customerGroup_List = data.customerGroupMasterList;
            this.selectedCustomerGroupList = [];
            //this.getMappingCustomerGroup();
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
            resolve("ok");
           // this.selectedCustomerGroupList = [];
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            reject(msg);
          }
        });
      });
  }

  getMappingCustomerGroup() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  getStoreGroupList_promise() {
    return new Promise((resolve, reject) => {
      this.storegroup_list = null;
      this.api.getAPI("StoreGroup")
        .subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.storegroup_list = data.storeGroupMasterList;
              // this.selectedStoreGroupList = [];
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
              resolve("ok");
            } else {
              let msg: string = data != null
                && data.displayMessage != null
                && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
             reject(msg);
            }
        });
    });
  }

  getMappingStoreGroup() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  // getstore() {
  //   if (this.store_List != null) {
  //     for (let i = 0; i < this.storeList.length; i++) {
  //       for (let j = 0; j < this.store_List.length; j++) {
  //         if (this.store_List[j].documentID == this.storeList[i].id && this.store_List[j].typeName == "Store") {
  //           this.selectedStoreList.push({
  //             id: this.storeList[i].id,
  //             storeName: this.storeList[i].storeName
  //           });
  //         }
  //       }
  //     }
  //   }
  // }

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



  // getCustomer() {
  //   return new Promise((resolve, reject) => {
  //   this.brand_list = null;
  //   this.common.showSpinner();
  //   this.api.getAPI("brand")
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           this.brand_list = data.responseDynamicData;
  //           resolve(data.responseDynamicData);
  //           this.selectedBrandList = [];
  //           this.selectedExclusionBrandList = [];
  //           this.getstorebrand();
  //           this.getMappingGroup();
  //           this.brandDropdownSettings = {
  //             singleSelection: false,
  //             idField: 'id',
  //             textField: 'brandName',
  //             selectAllText: 'Select All',
  //             unSelectAllText: 'UnSelect All',
  //             enableCheckAll: true,
  //             allowSearchFilter: true,
  //             itemsShowLimit: 4
  //           };
  //           //this.selectedBrandList = [];
  //           this.exclusionBrandGropDownSettings = {
  //             singleSelection: false,
  //             idField: 'id',
  //             textField: 'brandName',
  //             selectAllText: 'Select All',
  //             unSelectAllText: 'UnSelect All',
  //             enableCheckAll: true,
  //             allowSearchFilter: true,
  //             itemsShowLimit: 4
  //           };
  //          // this.selectedExclusionBrandList = [];
  //         } else {
  //           let msg: string = data != null
  //             && data.displayMessage != null
  //             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //             reject(msg);
  //          // this.common.showMessage('warn', msg);
  //         }
  //         this.common.hideSpinner();
  //       }, this.common.time_out_delay);
  //     });
  //   });
  // }
  getMappingGroup() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  getMappingYear() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }
  getMappingSubBrand() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  getCoupon_promise() {
    return new Promise((resolve, reject) => {
    this.coupon = null;
    this.api.getAPI("CouponLookUp")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.coupon = data.couponMasterList;
            this.selectedCouponList = [];
           // this.getMappingproductCoupon();
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
            resolve("ok");
          //  this.selectedCouponList = [];
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
         reject(msg);
          }
        });
      });
  }



  getMappingproductCoupon() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  getStore_promise() {
    return new Promise((resolve, reject) => {
    this.storeList = null;
    this.api.getAPI("StoreBasedCountryID?countryid=0")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.storeList = data.storeMasterList;
            this.selectedStoreList = [];
            //this.getMappingStore();
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
            resolve("ok");
          //  this.selectedStoreList = [];
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            reject(msg);
          }
        });
      });
  }


  getMappingStore() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }

  getProductSubGroup() {
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










  // getCountry() {
  //   this.countryList = null;
  //   this.common.showSpinner();
  //   this.api.getAPI("country")
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //          // console.log(data.countryMasterList);
  //           this.countryList = data.countryMasterList;
  //           this.selectedCountryList = [];
  //           this. getMappingstoreCountry();
  //           this.countryDropdownSettings = {
  //             singleSelection: false,
  //             idField: 'id',
  //             textField: 'countryName',
  //             selectAllText: 'Select All',
  //             unSelectAllText: 'UnSelect All',
  //             enableCheckAll: true,
  //             allowSearchFilter: true,
  //             itemsShowLimit: 4
  //           };
  //         //  this.selectedCountryList = [];
  //         } else {
  //           let msg: string = data != null
  //             && data.displayMessage != null
  //             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //           this.common.showMessage('warn', msg);
  //         }
  //         this.common.hideSpinner();
  //       }, this.common.time_out_delay);
  //     });
  // }





  // getCustomer() {
  //   this.common.showSpinner();
  //   this.api.getAPI("customer")
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           console.log(data);
  //           // this.customerGroup_List = data.customerGroupMasterList;
  //           // this.selectedCustomerGroupList = [];
  //           // this.getMappingCustomerGroup();
  //           // this.customerGroupDropDownSettings = {
  //           //   singleSelection: false,
  //           //   idField: 'id',
  //           //   textField: 'groupCode',
  //           //   selectAllText: 'Select All',
  //           //   unSelectAllText: 'UnSelect All',
  //           //   enableCheckAll: true,
  //           //   allowSearchFilter: true,
  //           //   itemsShowLimit: 4
  //           // };
  //          // this.selectedCustomerGroupList = [];
  //         } else {
  //           let msg: string = data != null
  //             && data.displayMessage != null
  //             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //           this.common.showMessage('warn', msg);
  //         }
  //         this.common.hideSpinner();
  //       }, this.common.time_out_delay);
  //     });
  // }




  // getCountry1() {
  //   this.countryList = null;
  //   this.common.showSpinner();
  //   this.api.getAPI("CountryMasterLookUP")
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           this.countryList = data.countryMasterList;
  //          // this.countryList = this.countryList.filter(x => x.active == true);
  //           //// .log(this.countryList);
  //         } else {
  //           let msg: string = data != null
  //             && data.displayMessage != null
  //             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //           this.common.showMessage('warn', msg);
  //         }
  //         this.common.hideSpinner();
  //       }, this.common.time_out_delay);
  //     });
  // }
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['coupon-list']);
      }
    }
    else {
      this.router.navigate(['coupon-list']);
    }
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

  addCoupon() {
    this.getListInsert();
    let fromdate = this.myForm.get('startDate').value;
    let enddate = this.myForm.get('endDate').value;
    if (fromdate > enddate) {
      this.common.showMessage("warn", "End Date Should be Greater than Start Date.");
    }
    else {
      if (this.store_List.length == 0) {
        this.common.showMessage("warn", "Please select Store Details.");
      }
      else if (this.customer_List.length == 0) {
        this.common.showMessage("warn", "Customer List is Empty.");
      }
      else if (this.productTypeList.length == 0) {
        this.common.showMessage("warn", "ProductType List is Empty.");
      }
      else {
        this.couponMaster = new MCouponMaster();
        if (this.couponMaster == null) {
          this.common.showMessage("warn", "Can not Save, Division Details are invalid.");
        }

        else {
          this.couponMaster= new  MCouponMaster();
          this.couponMaster.id =  this.id;
          this.couponMaster.CouponCode = this.myForm.get('CouponCode').value;
          this.couponMaster.Coupondescription = this.myForm.get('Coupondescription').value;
          this.couponMaster.BarCode = this.myForm.get('BarCode').value;
          this.couponMaster.CouponType = this.myForm.get('CouponType').value;
          this.couponMaster.Country = this.myForm.get('countryID').value  ;//this.countryName;
          this.couponMaster.countryID = 2;
          this.couponMaster.startDate = this.myForm.get('startDate').value;
          this.couponMaster.endDate = this.myForm.get('endDate').value;
          this.couponMaster.DiscountType = this.myForm.get('DiscountType').value;
          this.couponMaster.DiscountValue = this.myForm.get('DiscountValue').value;
          this.couponMaster.IssuableAtPOS = this.myForm.get('IssuableAtPOS').value;
          this.couponMaster.Serial = this.myForm.get('Serial').value;
          this.couponMaster.Active = this.myForm.get('Active').value;
          this.couponMaster.Remarks = this.myForm.get('Remarks').value;
          this.couponMaster.CouponSerialCode = this.myForm.get('CouponSerialCode').value;
          this.couponMaster.PhysicalStore = this.myForm.get('PhysicalStore').value;
          this.couponMaster.Remainingamount = this.myForm.get('Remainingamount').value;
          this.couponMaster.Redeemedstatus = this.myForm.get('Redeemedstatus').value;
          this.couponMaster.Issuedstatus = this.myForm.get('Issuedstatus').value;

          this.couponMaster.MinBillAmount = this.myForm.get('MinBillAmount').value;
          this.couponMaster.MaxNoIssue = this.myForm.get('MaxNoIssue').value;
          this.couponMaster.MaxLimit = this.myForm.get('MaxLimit').value;
          this.couponMaster.RedeemType = this.myForm.get('RedeemType').value;
          this.couponMaster.ExpiryDays = this.myForm.get('ExpiryDays').value;
          this.couponMaster.IsExpirable = this.myForm.get('IsExpirable').value;
          this.couponMaster.IsLimitedPeriodOffer=this.myForm.get('IsLimitedPeriodOffer').value;

          // console.log("update");
          // console.log(this.customer_List);
          //this.countryList = new Array<MCommonUtil>();
          // this.couponMaster.storeList = this.store_List;
          // this.couponMaster.customerList = this.customer_List;
          // this.couponMaster.productTypeList = this.productTypeList;
          this.couponMaster.storeCommonUtilData = this.store_List;
          this.couponMaster.customerCommonUtilData = this.customer_List;
          this.couponMaster.productTypeList = this.productTypeList;
          this.couponMaster.objCouponListDetails = this.couponDetailList;
          this.couponMaster.CouponDetailsCommonUtilData = this.couponDetailList;
          this.couponMaster.objTotalMasterMasterDetails = this.couponDetailList;
          this.couponMaster.totalMasterCommonUtilData=this.couponDetailList;


          /*this.buyItemTypeList = new Array<MCommonUtil>();
          this.getItemTypeList = new Array<MCommonUtil>();

          this.customer_List = new Array<MCommonUtil>();
          this.productTypeList = new Array<MCommonUtil>();*/
          // .log(this.color);
          this.common.showSpinner();
          this.api.putAPI("coupon", this.couponMaster).subscribe((data) => {
            //// .log(data);
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.common.hideSpinner();
              this.common.showMessage('success', data.displayMessage);
              this.router.navigate(['coupon-list']);
             // this.clear_controls();
            } else {
              setTimeout(() => {
                this.common.hideSpinner();
                this.common.showMessage('error', 'Failed to Save.');
              }, this.common.time_out_delay);
            }

          });
        }
      }
    }
  }
  countrycode() {
    if (this.countryList != null && this.countryList.length > 0) {
      for (let country of this.countryList) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryName = country.countryName;
          break;
        }
      }
    }
  }
  onSelectCountry(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllCountry(items: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectBrand(item: any) {
    //console.log(this.selectedBrandList);
  }
  onSelectAllBrand(items: any) {
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
    //console.log(this.selectedCustomerList);
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
            documentCode: prodsubgroup.productGroupCode,
            documentName: prodsubgroup.productGroupName,
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
    if(this.cusList != null && this.cusList.length > 0){
      for(let cust of this.cusList){
        this.customer_List.push({
          typeName: 'Customer',
          documentCode: cust.customerCode,
          documentName: cust.customerName,
          documentID: cust.id
        });
      }
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
  //       quantity: 0,
  //       amount: this.myForm.get('BuyItemAmount').value
  //     }

  //     this.buyItemTypeList.push(tempSubCollection);
  //     this.myForm.controls['BuyitemType'].setValue('');
  //     this.myForm.controls['BuyitemValue'].setValue('');
  //     this.myForm.controls['BuyItemAmount'].setValue('');
  //   }
  //   else {
  //     this.common.showMessage("warn", "Type and Value is Empty");
  //   }
  // }

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
  //       discountValue: this.myForm.get('GetItemDiscountValue').value

  //     }

  //     this.getItemTypeList.push(tempSubCollection);
  //     this.myForm.controls['GetItemType'].setValue('');
  //     this.myForm.controls['GetItemValue'].setValue('');
  //     this.myForm.controls['GetItemDiscountType'].setValue('');
  //     this.myForm.controls['GetItemDiscountValue'].setValue('');
  //   }
  //   else {
  //     this.common.showMessage("warn", "Type and Value is Empty");
  //   }
  // }
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



  getMappingSeason() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
  }
  getMappingProductGroup() {
    return new Promise((resolve, reject) => {
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
    resolve("ok");
  });
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

  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  void_item(item) {
    const idx = this.cusList.indexOf(item, 0);
    if (idx > -1) {
      this.cusList.splice(idx, 1);
    }
  }
  customersearch(){

    var searchvalue = this.myForm.get('globalSearch').value;
    if(searchvalue != ""){
    this.api.getAPI("customer?CustomerSearchString="+ searchvalue)
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.customerdetails = data.responseDynamicData;
          var alreadyexists = false;
          if(this.cusList!= null && this.cusList.length > 0){
              for(let item of this.cusList)
              {
              if( this.customerdetails[0].customerCode == item.customerCode)
               {
                alreadyexists = true;
               }
              }
            }
             if(alreadyexists){
              this.common.showMessage('warn', 'Already Exists');
               return false;
             }
             else{
              this.cusList.push(data.responseDynamicData[0]);
              this.myForm.controls['globalSearch'].setValue('');
              return true;
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
  }
}
