import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { style } from '@angular/animations';
import { MCommonUtil } from 'src/app/models/m-common-util';
import { MCouponMaster } from 'src/app/models/m-coupon-master';
import { MCountryMaster } from 'src/app/models/m-country-master';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-coupon-add1',
  templateUrl: './coupon-add1.component.html',
  styleUrls: ['./coupon-add1.component.css']
})
export class CouponAdd1Component implements OnInit {
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

  // subBrandList: Array<any>;
  // storegroup_list: Array<any>;
  // countryList: Array<any>;
  // storeList: Array<any>;
  // customerGroup_List: Array<any>;
  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
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
      //customerList:Array<any>

    });
    // this.getCountry();
    this.buyItemTypeList = new Array<MCommonUtil>();
    this.getItemTypeList = new Array<MCommonUtil>();
    this.store_List = new Array<MCommonUtil>();
    this.customer_List = new Array<MCommonUtil>();
    this.productTypeList = new Array<MCommonUtil>();
    this.couponDetailList = new Array<MCommonUtil>();
    // console.log("Fork Join Start");
    // let calls:Array<any>;
    // calls = new Array<any>();
    // calls.push(this.getCountry_promise());
    // calls.push(this.getBrand_promise());

    // this.common.showSpinner();
    // forkJoin(calls)
    // .subscribe((results)=>{
    //   console.log("Fork Join End");
    //   this.common.hideSpinner();
    // });

    this.common.showSpinner();
    this.getCountry_promise()
      .then((data1) => {
        this.getBrand_promise()
          .then((data2) => {
            // this.common.hideSpinner();
            this.getStoreGroupList_promise()
            .then((data3) => {
              this.getstylesegmentation_promise()
              .then((data4) => {
                this.getyear_promise()
                .then((data5) => {
                  this.getseason_promise()
                .then((data6) => {
                  this.getproductGroup_promise()
                .then((data7) => {
                  this.getproductSubGroup_promise()
                  .then((data8) => {
                    this.getSubBrand_promise()
                  .then((data9) => {
                    this.getStyle_promise()
                  .then((data10) => {
                    this.getCoupon_promise()
                    .then((data11) => {
                      this.getCustomerGroupList_promise()
                    .then((data12) => {
                      this.getStore_promise()
                    .then((data13) => {
                      this.common.hideSpinner();
                    })
                    .catch((err13) => {
                      this.common.hideSpinner();
                      this.common.showMessage("warn", err13);
                    });
                    })
                    .catch((err12) => {
                      this.common.hideSpinner();
                      this.common.showMessage("warn", err12);
                    });
                    })
                    .catch((err11) => {
                      this.common.hideSpinner();
                      this.common.showMessage("warn", err11);
                    });
                  })
                  .catch((err10) => {
                    this.common.hideSpinner();
                    this.common.showMessage("warn", err10);
                  });
                  })
                  .catch((err9) => {
                    this.common.hideSpinner();
                    this.common.showMessage("warn", err9);
                  });
                  })
                  .catch((err8) => {
                    this.common.hideSpinner();
                    this.common.showMessage("warn", err8);
                  });
                })
                .catch((err7) => {
                  this.common.hideSpinner();
                  this.common.showMessage("warn", err7);
                });
                })
                .catch((err6) => {
                  this.common.hideSpinner();
                  this.common.showMessage("warn", err6);
                });
                })
                .catch((err5) => {
                  this.common.hideSpinner();
                  this.common.showMessage("warn", err5);
                });
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
      .catch((err1) => {
        this.common.hideSpinner();
        this.common.showMessage("warn", err1);
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


  // getBrand() {
  //   this.brand_list = null;
  //   this.common.showSpinner();
  //   this.api.getAPI("brand")
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           this.brand_list = data.responseDynamicData;
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
  //           this.selectedBrandList = [];
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
  //           this.selectedExclusionBrandList = [];
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

  getCountry_promise() {
    this.countryList = null;
    return new Promise((resolve, reject) => {
      this.api.getAPI("country")
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
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
            this.selectedCountryList = [];
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

  getBrand_promise() {
    return new Promise((resolve, reject) => {
      this.brand_list = null;
      this.api.getAPI("brand")
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brand_list = data.responseDynamicData;
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
            this.selectedBrandList = [];
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
            this.selectedExclusionBrandList = [];
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

  getStoreGroupList_promise() {
    return new Promise((resolve, reject) => {
      this.storegroup_list = null;
      this.api.getAPI("StoreGroup")
        .subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.storegroup_list = data.storeGroupMasterList;
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
              this.selectedStoreGroupList = [];
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

  getstylesegmentation_promise() {
    return new Promise((resolve, reject) => {
      this.styleSegmentList = null;
      this.api.getAPI("stylesegmentation")
        .subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.styleSegmentList = data.responseDynamicData;
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
              this.selectedStyleSegmentationList = [];
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

  getyear_promise() {
    return new Promise((resolve, reject) => {
      this.yearList = null;
      this.api.getAPI("year")
        .subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.yearList = data.responseDynamicData;
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
              this.selectedYearList = [];
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

  getseason_promise() {
    return new Promise((resolve, reject) => {
      this.seasonList = null;
      this.api.getAPI("season")
        .subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.seasonList = data.seasonMasterList;
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
              this.selectedSeasonList = [];
              resolve("ok");
            }  else {
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
            this.selectedProductGroupList = [];
            resolve("ok");
          }  else {
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
            this.selectedProductSubGroupList = [];
            resolve("ok");
          }  else {
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
            this.selectedSubBrandList = [];
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

  getStyle_promise() {
    return new Promise((resolve, reject) => {
      this.styleList = null;
    this.api.getAPI("StyleLookUp")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.styleList = data.styleMasterList;
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
            this.selectedStyleList = [];
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

  getCoupon_promise() {
    return new Promise((resolve, reject) => {
      this.coupon = null;
    this.api.getAPI("CouponLookUp")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.coupon = data.couponMasterList;
            //console.log(this.coupon);
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
            this.selectedCouponList = [];
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

  getCustomerGroupList_promise() {
    return new Promise((resolve, reject) => {
    this.api.getAPI("customergrouplookup")
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.customerGroup_List = data.customerGroupMasterList;
            //console.log(this.customerGroup_List);
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
            this.selectedCustomerGroupList = [];
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

  getStore_promise() {
    return new Promise((resolve, reject) => {
      this.storeList = null;
      this.api.getAPI("StoreBasedCountryID?countryid=0")
        .subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.storeList = data.storeMasterList;
             // console.log(this.storeList);
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
              this.selectedStoreList = [];
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
  // getCountry() {
  //   this.countryList = null;
  //   this.common.showSpinner();
  //   this.api.getAPI("country")
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           this.countryList = data.countryMasterList;
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
  //           this.selectedCountryList = [];
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
  //           // this.countryList = this.countryList.filter(x => x.active == true);
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
          debugger;
          this.couponMaster = new MCouponMaster();
          this.couponMaster.id = null;
          this.couponMaster.CouponCode = this.myForm.get('CouponCode').value;
          this.couponMaster.Coupondescription = this.myForm.get('Coupondescription').value;
          this.couponMaster.BarCode = this.myForm.get('BarCode').value;
          this.couponMaster.CouponType = this.myForm.get('CouponType').value;
          this.couponMaster.IsLimitedPeriodOffer = this.myForm.get('IsLimitedPeriodOffer').value;
          this.couponMaster.country = this.countryName;
          this.couponMaster.countryID = this.myForm.get('countryID').value;
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

          // this.couponMaster.MinBillAmount = this.myForm.get('MinBillAmount').value;
          // this.couponMaster.MaxNoIssue = this.myForm.get('MaxNoIssue').value;
          // this.couponMaster.MaxLimit = this.myForm.get('MaxLimit').value;
          this.couponMaster.RedeemType = this.myForm.get('RedeemType').value;
          // this.couponMaster.ExpiryDays = this.myForm.get('ExpiryDays').value;
          // this.couponMaster.IsExpirable = this.myForm.get('IsExpirable').value;

          //this.countryList = new Array<MCommonUtil>();
          this.couponMaster.storeCommonUtilData = this.store_List;
          this.couponMaster.customerCommonUtilData = this.customer_List;
          this.couponMaster.productTypeList = this.productTypeList;
          this.couponMaster.objCouponListDetails = this.couponDetailList;
          this.couponMaster.CouponDetailsCommonUtilData = this.couponDetailList;
          this.couponMaster.objTotalMasterMasterDetails = this.couponDetailList;
          this.couponMaster.totalMasterCommonUtilData=this.couponDetailList;


          this.getItemTypeList = new Array<MCommonUtil>();

          this.customer_List = new Array<MCommonUtil>();
          this.productTypeList = new Array<MCommonUtil>();
          // .log(this.color);
          this.common.showSpinner();
          // debugger;
          this.api.postAPI("Coupon", this.couponMaster).subscribe((data) => {
            //// .log(data);
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.common.hideSpinner();
              this.common.showMessage('success', data.displayMessage);
              this.clear_controls();
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
  getListInsert() {
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

    // if (this.couponDetailList != null && this.couponDetailList.length > 0) {
    //   for (let coup of this.couponDetailList) {
    //     this.couponDetails_List.push({
    //       typeName: 'CouponList',
    //       documentCode: coup.customerCode,
    //       documentName: coup.customerName,
    //       documentID: coup.id

    //     });
    //   }
    // }


  }

  void_item(item) {
    const idx = this.cusList.indexOf(item, 0);
    if (idx > -1) {
      this.cusList.splice(idx, 1);
    }
  }
  clear_controls() {
    this.myForm.controls['CouponCode'].setValue('');
    this.myForm.controls['Coupondescription'].setValue('');
    this.myForm.controls['BarCode'].setValue('');
    this.myForm.controls['CouponType'].setValue('');
    this.myForm.controls['startDate'].setValue('');
    this.myForm.controls['endDate'].setValue('');
    this.myForm.controls['DiscountType'].setValue('');
    this.myForm.controls['DiscountValue'].setValue('');
    this.myForm.controls['IssuableAtPOS'].setValue('');
    this.myForm.controls['Serial'].setValue('');
    this.myForm.controls['Active'].setValue(true);
    this.myForm.controls['Remarks'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['globalSearch'].setValue('');
    this.myForm.controls['CouponSerialCode'].setValue('');
    this.myForm.controls['PhysicalStore'].setValue('');
    this.myForm.controls['Remainingamount'].setValue('');
    this.myForm.controls['Redeemedstatus'].setValue('');
    this.myForm.controls['Issuedstatus'].setValue('');
    this.selectedBrandList = [];
    this.selectedSubBrandList = [];
    this.selectedCountryList = [];
    this.selectedStoreGroupList = [];
    this.selectedExclusionBrandList = [];
    this.selectedStyleSegmentationList = [];
    this.selectedSeasonList = [];
    this.selectedProductGroupList = [];
    this.selectedProductSubGroupList = [];
    this.selectedYearList = [];
    this.selectedStoreList = [];
    this.selectedCustomerList = [];
    this.selectedCustomerGroupList = [];
    this.selectedStyleList = [];
    this.selectedCouponList = [];
    this.cusList = new Array<any>();

    this.myForm.controls['IsExpirable'].setValue(false);
    this.myForm.controls['MinBillAmount'].setValue('');
    this.myForm.controls['MaxNoIssue'].setValue('');
    this.myForm.controls['MaxLimit'].setValue('');
    this.myForm.controls['RedeemType'].setValue('');
    this.myForm.controls['ExpiryDays'].setValue('');
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
    if(searchvalue != ""){
    this.api.getAPI("customer?CustomerSearchString=" + searchvalue)
      .subscribe((data) => {
        setTimeout(() => {
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



          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
    }
  }

  addCouponDetails(){
    let allow: boolean = true;
      let allowSort: boolean = true;
      // this.myForm.get('countryID').disable();
      let CouponSerialCode = this.myForm.get('CouponSerialCode').value;
      let PhysicalStore = this.myForm.get('PhysicalStore').value;
      let Remainingamount = this.myForm.get('Remainingamount').value;
      let Redeemedstatus = this.myForm.get('Redeemedstatus').value;
      let Issuedstatus = this.myForm.get('Issuedstatus').value;
      // for (let shftcode of this.CouponList) {
      //   if (shftcode.CouponSerialCode == CouponSerialCode) {
      //     allow = false;
      //     break;
      //   }
      //   else {
      //     allow = true;
      //   }
      // }
      // for (let order of this.CouponList) {
      //   if (order.sortOrder == sort) {
      //     allowSort = false;
      //     break;
      //   }
      //   else {
      //     allowSort = true;
      //   }
      // }
      if (CouponSerialCode != "" && CouponSerialCode != "") {
        if (allow == true) {
          if (allowSort == true) {
            //sortorder:this.sortorder++;
            let tempShift: MCouponMaster = {
              // id: 0,
              CouponSerialCode: this.myForm.get('CouponSerialCode').value,
              PhysicalStore: this.myForm.get('PhysicalStore').value,
              Remainingamount: this.myForm.get('Remainingamount').value,
              Redeemedstatus: this.myForm.get('Redeemedstatus').value,
              Issuedstatus: this.myForm.get('Issuedstatus').value,
              // createBy: this.user_details.id,
              storeList: [],
              customerList: [],
              CouponStoreType: '',
              CouponCustomerType: '',
              countryName: undefined
            }

            this.couponDetailList.push(tempShift);
            console.log(this.couponDetailList);
            // this.CouponList.push(tempShift);
            // let count = this.CouponList.length;

            // if(this.CouponList.length == 0)
            // {
            //   this.myForm.controls['sortOrder'].setValue(0);
            // }
            // else
            // {
            //   this.myForm.controls['sortOrder'].setValue(count);
            // }

            this.myForm.controls['CouponSerialCode'].setValue('');
            this.myForm.controls['PhysicalStore'].setValue('');
            this.myForm.controls['Remainingamount'].setValue('');
            this.myForm.controls['Redeemedstatus'].setValue('');
            this.myForm.controls['Issuedstatus'].setValue(true);
          }
          else {
            this.common.showMessage('warn', 'Sort Order Already Exist, can not to be Duplicate');
          }
        }
        else {
          this.common.showMessage('warn', 'Coupon Code Already Exist');
        }
      }
      else {
        this.common.showMessage('warn', 'Coupon Code or Coupon Name is Empty');
      }
  }
}
