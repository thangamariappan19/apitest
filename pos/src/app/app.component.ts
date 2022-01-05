import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { $ } from 'protractor';
import { MUserDetails } from './models/m-user-details';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { MDayClosing } from './models/m-day-closing';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { MMenuModel } from './models/m-menu-model';
import { MManagerOverride } from './models/m-manager-override';
import { MRetailSettings } from './models/m-retail-settings';
import { MPromotionMaster } from './models/m-promotion-master';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { TranslateService } from '@ngx-translate/core';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { AppConstants } from 'src/app/app-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  panelOpenState = false;
  name: string;
  title = 'POS Application';
  isAuth = 'false';
  expand: boolean;
  customer_expand: boolean;
  master_expand: boolean;
  financials_expand: boolean;
  administrator_expand: boolean;
  retail_expand: boolean;
  design_concept_expand: boolean;
  stock_expand: boolean;
  pos_expand: boolean;
  pricingandpromotions_expand: boolean;
  log_expand: boolean;
  system_expand: boolean;
  product_expand: boolean;
  business_expand: boolean;
  partners_expand: boolean;
  pricing_expand: boolean;
  user_expand: boolean;
  reports_expand: boolean;
  user_details: MUserDetails = null;
  manager_OverRide_Settings: MManagerOverride = null;
  retail_Settings: MRetailSettings = null;
  config_expand: boolean;
  finance_expand: boolean;
  retails_expand: boolean;
  products_expand: boolean;

  userid: number;
  userroleId: number;
  userroleCode: string;
  screenName: any;
  screenNameAll: any;
  AllMenus: Array<any>;
  SelectedMenus: Array<any>;
  SelectedMenusCopy: Array<any>;
  test_var: number = 0;
  searchkey: string;
  json: Array<any>;
  accessibleMenus: Array<string>;
  // pos_mode: boolean;

  menuJson: Array<MMenuModel> = null;
  system_menu: Array<MMenuModel> = null;
  config_menu: Array<MMenuModel> = null;
  financials_menu: Array<MMenuModel> = null;
  retailsetups_menu: Array<MMenuModel> = null;
  product_menu: Array<MMenuModel> = null;
  products_menu: Array<MMenuModel> = null;
  business_menu: Array<MMenuModel> = null;
  partners_menu: Array<MMenuModel> = null;
  pricing_menu: Array<MMenuModel> = null;
  users_menu: Array<MMenuModel> = null;
  reports_menu: Array<MMenuModel> = null;

  system_menu_view: boolean = false;
  config_menu_view: boolean = false;
  financials_menu_view: boolean = false;
  retailsetups_menu_view: boolean = false;
  product_menu_view: boolean = false;
  products_menu_view: boolean = false;
  business_menu_view: boolean = false;
  partners_menu_view: boolean = false;
  pricing_menu_view: boolean = false;
  users_menu_view: boolean = false;
  reports_menu_view: boolean = false;

  buttonLanguage: string = "Arabic";
  version = AppConstants.version;
  constructor(
    private api: ApiService,
    private common: CommonService,
    public router: Router,
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // console.log(event.url);
       
        //console.log("Calling isAuthenticated_promise");
        this.isAuthenticated_promise()
          .then((data1) => {
            //console.log("result isAuthenticated_promise");
            if (event != null && event.url != null) {
              if (event.url == "/" || event.url == "/home") {
                localStorage.setItem('pos_mode', 'false');
                document.body.classList.add('sidebar-collapse');
                this.changeLangage_promise("en")
                  .then((data1) => {
                    if(this.isAuth == "true"){
                      this.loadDefault_promise();
                    // this.loadDefault();
                    }
                  })
                  .catch((ex1) => {
                    this.common.showMessage("warn", ex1);
                  });

              } else if (event.url == "/login") {

              } else {
                // this.loadDefault();
                this.changeLangage_promise("en")
                  .then((data1) => {
                    if(this.isAuth == "true"){
                      this.loadDefault_promise();
                    // this.loadDefault();
                    }
                  })
                  .catch((ex1) => {
                    this.common.showMessage("warn", ex1);
                  });
              }
              document.body.classList.add('sidebar-collapse');
            }
            // document.body.classList.add('sidebar-collapse');
          })
          .catch((ex1) => {
            this.common.showMessage("warn", ex1);
          });

      }
    });

    // this.isAuthenticated();

    // // Translate Service
    // // translate.addLangs(['en', 'ar']);
    // // translate.setDefaultLang('ar');
    // // translate.use('ar');
    // this.changeLangage("en");
    // // let temp_str: string = localStorage.getItem('pos_mode');
    // // this.pos_mode = temp_str != null && temp_str == 'true' ? true : false;

  }

  loadDefault_promise() {
  
    localStorage.setItem('enableOrjwanStock', "true");
    this.common.showSpinner();
    //console.log("begin user_details_promise");
    // <<1
    this.user_details_promise()
      .then((data1) => {
        //console.log("end user_details_promise");
        // <<2
        //console.log("begin getMenuScreens_promise");
        this.getMenuScreens_promise()
          .then((data2) => {
            //console.log("end getMenuScreens_promise");
            // <<3
            //console.log("begin getMenuJson_promise");
            this.getMenuJson_promise()
              .then((data3) => {
                //console.log("end getMenuJson_promise");
                // <<4
                //console.log("begin assignUserRights_promise");
                this.assignUserRights_promise("")
                  .then((data4) => {
                    //console.log("end assignUserRights_promise");
                    // <<5
                    //console.log("begin getManagerOverrideData_promise");
                    this.getManagerOverrideData_promise()
                      .then((data5) => {
                        //console.log("end getManagerOverrideData_promise");
                        // <<6
                        //console.log("begin getRetailSettingsData_promise");
                        this.getRetailSettingsData_promise()
                          .then((data6) => {
                            //console.log("end getRetailSettingsData_promise");
                            this.common.hideSpinner();
                            // // <<7
                            // //console.log("begin store_promotions_promise");
                            // this.store_promotions_promise()
                            //   .then((data7) => {
                            //     //console.log("end store_promotions_promise");
                            //     this.common.hideSpinner();
                            //   })
                            //   .catch((ex7) => {
                            //     this.common.hideSpinner();
                            //     this.common.showMessage("warn", ex7);
                            //     //console.log("Error store_promotions_promise");
                            //   });
                            // // 7>>

                          })
                          .catch((ex6) => {
                            this.common.hideSpinner();
                            this.common.showMessage("warn", ex6);
                            //console.log("Error getRetailSettingsData_promise");
                          });
                        // 6>>

                      })
                      .catch((ex5) => {
                        this.common.hideSpinner();
                        this.common.showMessage("warn", ex5);
                        //console.log("Error getManagerOverrideData_promise");
                      });
                    // 5>>

                  })
                  .catch((ex4) => {
                    this.common.hideSpinner();
                    this.common.showMessage("warn", ex4);
                    //console.log("Error assignUserRights_promise");
                  });
                // 4>>

              })
              .catch((ex3) => {
                this.common.hideSpinner();
                this.common.showMessage("warn", ex3);
                //console.log("Error getMenuJson_promise");
              });
            // 3>>

          })
          .catch((ex2) => {
            this.common.hideSpinner();
            this.common.showMessage("warn", ex2);
           // console.log("Error getMenuScreens_promise");
          });
        // 2>>

      })
      .catch((ex1) => {
        this.common.hideSpinner();
        this.common.showMessage("warn", ex1);
        //console.log("Error user_details_promise");
      });
    // 1>>

    // this.getMenuJson();


  }

  isAuthenticated_promise() {
    return new Promise((resolve, reject) => {
      try {
        this.isAuth = localStorage.getItem('isAuth');
        if (this.isAuth == null) {
          this.isAuth = 'false';
        }
        if (this.isAuth == 'true') {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log("Error : isAuthenticated_promise -> " + err);
        this.isAuth = 'false';
        resolve(false);
      }
    });

  }

  changeLangage_promise(lang: string) {
    return new Promise((resolve, reject) => {
      try {
        let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
        htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
        //  this.changeCssFile(lang);
        resolve("ok");
      } catch (err) {
        console.log("Error : isAuthenticated_promise -> " + err);
        resolve(err);
      }
    });

  }

  user_details_promise() {
    return new Promise((resolve, reject) => {
      let tkn = localStorage.getItem('token');
      if (tkn != null) {
        let temp_str: string = localStorage.getItem('user_details');
        if (temp_str != null && temp_str != "null") {
          this.user_details = JSON.parse(temp_str);
          resolve(this.user_details);
          // this.getMenuScreens();
        } else {
          localStorage.setItem('user_details', null);
          this.api.getAPI("User").subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              if (data.userInfoRecord != null) {
                this.user_details = new MUserDetails();
                this.user_details = data.userInfoRecord;
                localStorage.setItem('user_details', JSON.stringify(this.user_details));
                // this.getMenuScreens();
                resolve(this.user_details);
              } else {
                localStorage.setItem('user_details', null);
                reject("Invalid User Details");
              }
            } else {
              localStorage.setItem('user_details', null);
              reject("Invalid User Details");
            }
          });
        }
      }
    });
  }

  getMenuScreens_promise() {
    return new Promise((resolve, reject) => {
      let menu_str: string = localStorage.getItem('SelectedMenus');
      if (menu_str != null && menu_str != "null") {
        // console.log("=> Menu details exists");
        // this.getMenuJson();
        this.SelectedMenus = JSON.parse(menu_str);
        // this.assignUserRights("");
        // this.getManagerOverrideData();
        resolve(this.SelectedMenus);
      } else {
        if (this.user_details != null && this.user_details != {}) {
          // console.log("=> Menu details not exists");
          localStorage.setItem('SelectedMenus', null);
          this.userid = this.user_details.id;
          this.userroleId = this.user_details.roleID;
          // this.userroleId = 12;
          this.userroleCode = this.user_details.roleCode;
          this.screenName = null;
          this.SelectedMenus = [];
          this.api.getAPI("UserPrivelege?id=" + this.userroleId)
            .subscribe((data) => {
              // this.getMenuJson();
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                this.screenName = data.masUserPrivilagesRecord.screenName;
                var str = new String(this.screenName)
                var splits = str.split(",")
                this.SelectedMenus = splits;
                this.SelectedMenusCopy = this.SelectedMenus;
                localStorage.setItem('SelectedMenus', JSON.stringify(this.SelectedMenus));
                // this.assignUserRights("");
                // this.getManagerOverrideData();
                resolve(this.SelectedMenus);
              } else {
                let msg: string = data != null
                  && data.displayMessage != null
                  && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
                reject(msg)
              }
            });
        }
      }
    });
  }

  getMenuJson_promise() {
    return new Promise((resolve, reject) => {
      try {
        this.menuJson = new Array<MMenuModel>();
        this.system_menu = new Array<MMenuModel>();
        this.config_menu = new Array<MMenuModel>();
        this.financials_menu = new Array<MMenuModel>();
        this.retailsetups_menu = new Array<MMenuModel>();
        this.product_menu = new Array<MMenuModel>();
        this.products_menu = new Array<MMenuModel>();
        this.business_menu = new Array<MMenuModel>();
        this.partners_menu = new Array<MMenuModel>();
        this.pricing_menu = new Array<MMenuModel>();
        this.users_menu = new Array<MMenuModel>();
        this.reports_menu = new Array<MMenuModel>();
        this.accessibleMenus = new Array<any>();

        this.config_menu.push({ code: "Country", menuName: "Country", view: false });
        this.config_menu.push({ code: "State", menuName: "State", view: false });
        this.config_menu.push({ code: "City Master", menuName: "City", view: false });
        this.config_menu.push({ code: "Language Settings", menuName: "Language", view: false });
        this.config_menu.push({ code: "Company Settings", menuName: "Company", view: false });
        this.config_menu.push({ code: "Warehouse", menuName: "Warehouse", view: false });
        this.config_menu.push({ code: "Warehouse Types", menuName: "Warehouse Types", view: false });
        this.config_menu.push({ code: "Document Numbering", menuName: "Document Numbering", view: false });
        this.config_menu.push({ code: "Brand Division Mapping", menuName: "Brand Division Mapping", view: false });
        this.config_menu.push({ code: "Style Status", menuName: "Style Status", view: false });
        this.config_menu.push({ code: "Style Segmentation", menuName: "Style Segmentation", view: false });
        this.config_menu.push({ code: "Segamentation Types", menuName: "Segmentation Type", view: false });
        this.config_menu.push({ code: "Drop Master", menuName: "Drop Master", view: false });
        this.config_menu.push({ code: "Collection Master", menuName: "Collection", view: false });
        this.config_menu.push({ code: "SubCollection Master", menuName: "Sub Collection", view: false });
        this.config_menu.push({ code: "Agent Master", menuName: "Agent Master", view: false });

        this.system_menu.push({ code: "Config", menuName: "Config", view: false, items: this.config_menu });

        this.financials_menu.push({ code: "Currency", menuName: "Currency", view: false });
        this.financials_menu.push({ code: "Exchange Rate", menuName: "Exchange Rate", view: false });
        this.financials_menu.push({ code: "Expense Master", menuName: "Expense Master", view: false });
        this.financials_menu.push({ code: "On-Account Payment", menuName: "On Account Payment", view: false });
        this.financials_menu.push({ code: "Payment Mode", menuName: "Payment Mode", view: false });
        this.financials_menu.push({ code: "Payment Type", menuName: "Payment Type", view: false });
        this.financials_menu.push({ code: "Tax Master", menuName: "Tax", view: false });

        this.system_menu.push({ code: "Financials", menuName: "Financials", view: false, items: this.financials_menu });

        this.retailsetups_menu.push({ code: "ManagerOverride", menuName: "Manage Override", view: false });
        this.retailsetups_menu.push({ code: "Retail Settings", menuName: "Retail Settings", view: false });
        this.retailsetups_menu.push({ code: "Store", menuName: "Store", view: false });
        this.retailsetups_menu.push({ code: "Store Group", menuName: "Store Group", view: false });
        this.retailsetups_menu.push({ code: "Franchise", menuName: "Franchise", view: false });
        this.retailsetups_menu.push({ code: "Shift", menuName: "Shift Master", view: false });
        this.retailsetups_menu.push({ code: "POS", menuName: "POS Master", view: false });

        this.system_menu.push({ code: "Retail Setups", menuName: "Retail Setups", view: false, items: this.retailsetups_menu });

        this.product_menu.push({ code: "Brand", menuName: "Brand", view: false });
        this.product_menu.push({ code: "Sub Brand", menuName: "Sub Brand", view: false });
        this.product_menu.push({ code: "Scale Master", menuName: "Scale", view: false });
        this.product_menu.push({ code: "Color Master", menuName: "Color", view: false });
        this.product_menu.push({ code: "Design Master", menuName: "Design", view: false });
        this.product_menu.push({ code: "ProductLine", menuName: "Product Line", view: false });
        this.product_menu.push({ code: "Product Group", menuName: "Product Group", view: false });
        this.product_menu.push({ code: "Product SubGroup", menuName: "Product Sub Group", view: false });
        this.product_menu.push({ code: "Season", menuName: "Season", view: false });
        this.product_menu.push({ code: "Division", menuName: "Division", view: false });
        this.product_menu.push({ code: "Reason", menuName: "Reason", view: false });
        this.product_menu.push({ code: "Year", menuName: "Year", view: false });

        this.system_menu.push({ code: "Product", menuName: "Product", view: false, items: this.product_menu });

        this.menuJson.push({ code: "System", menuName: "System", view: false, items: this.system_menu });
        this.menuJson.push({ code: "POS", menuName: "POS", view: false, items: [] });

        this.products_menu.push({ code: "Style Master", menuName: "Style", view: false, items: [] });
        this.products_menu.push({ code: "SKU Master", menuName: "SKU", view: false, items: [] });
        this.products_menu.push({ code: "Bar Code", menuName: "Barcode List", view: false, items: [] });

        this.menuJson.push({ code: "Products", menuName: "Products", view: false, items: this.products_menu });

        this.business_menu.push({ code: "Stock Request", menuName: "Stock Request", view: false, items: [] });
        this.business_menu.push({ code: "Stock Receipt", menuName: "Stock Receipt", view: false, items: [] });
        this.business_menu.push({ code: "Stock Return", menuName: "Stock Return", view: false, items: [] });
        this.business_menu.push({ code: "Inventory Counting", menuName: "Inventory Counting", view: false, items: [] });
        this.business_menu.push({ code: "Stock Adjustment", menuName: "Stock Adjustment", view: false, items: [] });
        this.business_menu.push({ code: "Opening Stock", menuName: "Opening Stock", view: false, items: [] });
        this.business_menu.push({ code: "Non Trading Stock Distribution", menuName: "Non-Trading Stock Distribution", view: false, items: [] });
        this.business_menu.push({ code: "Tailoring", menuName: "Tailoring", view: false, items: [] });
        this.business_menu.push({ code: "Bin Config", menuName: "Bin Config", view: false, items: [] });
        this.business_menu.push({ code: "Bin Transfer", menuName: "Bin Transfer", view: false, items: [] });

        this.menuJson.push({ code: "Business", menuName: "Business", view: false, items: this.business_menu });

        this.partners_menu.push({ code: "Customer Master", menuName: "Customer Master", view: false, items: [] });
        this.partners_menu.push({ code: "Customer Group", menuName: "Customer Group", view: false, items: [] });
        this.partners_menu.push({ code: "Vendor", menuName: "Vendor Master", view: false, items: [] });
        this.partners_menu.push({ code: "VendorGroup", menuName: "Vendor Group", view: false, items: [] });

        this.menuJson.push({ code: "Partners", menuName: "Partners", view: false, items: this.partners_menu });

        this.pricing_menu.push({ code: "Price List", menuName: "Price List", view: false, items: [] });
        this.pricing_menu.push({ code: "Price Point", menuName: "Price Point", view: false, items: [] });
        this.pricing_menu.push({ code: "Price Type Master", menuName: "Price Type", view: false, items: [] });
        this.pricing_menu.push({ code: "Promotions", menuName: "Promotions", view: false, items: [] });
        this.pricing_menu.push({ code: "PromotionsPriority", menuName: "Promotion Priority", view: false, items: [] });
        this.pricing_menu.push({ code: "WN Promotion", menuName: "WNPromotion", view: false, items: [] });
        this.pricing_menu.push({ code: "Promotion Mapping", menuName: "PromotionMapping", view: false, items: [] });
        this.pricing_menu.push({ code: "Coupon", menuName: "Coupon", view: false, items: [] });
        this.pricing_menu.push({ code: "CouponTransfer", menuName: "Coupon Transfer", view: false, items: [] });
        this.pricing_menu.push({ code: "CouponReceipt", menuName: "Coupon Receipt", view: false, items: [] });
        this.pricing_menu.push({ code: "Armada Discount", menuName: "Armada Discount", view: false, items: [] });
        this.pricing_menu.push({ code: "Price Change", menuName: "Price Change", view: false, items: [] });

        this.menuJson.push({ code: "Pricing", menuName: "Pricing", view: false, items: this.pricing_menu });

        this.users_menu.push({ code: "Designation", menuName: "Designation", view: false, items: [] });
        this.users_menu.push({ code: "Employees", menuName: "Employees", view: false, items: [] });
        this.users_menu.push({ code: "Role Master", menuName: "User Roles", view: false, items: [] });
        this.users_menu.push({ code: "Login Users", menuName: "User Master", view: false, items: [] });
        this.users_menu.push({ code: "Users - Previlege", menuName: "Users Previleges", view: false, items: [] });

        this.menuJson.push({ code: "Users", menuName: "Users", view: false, items: this.users_menu });

        this.reports_menu.push({ code: "Duplicate Receipt", menuName: "Duplicate Receipt", view: false, items: [] });
        this.reports_menu.push({ code: "Exchange Receipt", menuName: "Exchange Receipt", view: false, items: [] });
        this.reports_menu.push({ code: "Hold Receipt", menuName: "Hold Receipt", view: false, items: [] });
        this.reports_menu.push({ code: "Invoice Receipt", menuName: "Invoice Receipt", view: false, items: [] });
        this.reports_menu.push({ code: "Return Receipt", menuName: "Return Receipt", view: false, items: [] });
        this.reports_menu.push({ code: "Xreport", menuName: "X Report", view: false, items: [] });
        this.reports_menu.push({ code: "ZReport", menuName: "Z Report", view: false, items: [] });

        this.menuJson.push({ code: "Reports", menuName: "Reports", view: false, items: this.reports_menu });
        resolve("ok");
      } catch (ex) {
        console.log("Error : getMenuJson_promise -> " + ex);
        resolve("ok");
      }
    });

  }

  assignUserRights_promise(searchString: string) {
    return new Promise((resolve, reject) => {
      try {
        this.system_menu_view = false;
        this.config_menu_view = false;
        this.financials_menu_view = false;
        this.retailsetups_menu_view = false;
        this.product_menu_view = false;
        this.products_menu_view = false;
        this.business_menu_view = false;
        this.partners_menu_view = false;
        this.pricing_menu_view = false;
        this.users_menu_view = false;
        this.reports_menu_view = false;

        if (this.SelectedMenus != null && this.SelectedMenus.length > 0) {
          for (let menu of this.SelectedMenus) {
            // System 
            // Config
            if (this.config_menu != null && this.config_menu.length > 0) {
              for (let cm of this.config_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.config_menu_view = true;
                  this.system_menu_view = true;
                }
              }
              let cm_view = this.config_menu.filter(x => x.view == true);
              if (this.system_menu != null && this.system_menu.length > 0) {
                let config = this.system_menu.filter(x => x.code.toLowerCase() == "config");
                if (config != null && config.length > 0) {
                  config[0].view = cm_view != null && cm_view.length > 0 ? true : false;
                }
              }
            }
            // Financials
            if (this.financials_menu != null && this.financials_menu.length > 0) {
              for (let cm of this.financials_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.financials_menu_view = true;
                  this.system_menu_view = true;
                }
              }
              let cm_view = this.financials_menu.filter(x => x.view == true);
              if (this.system_menu != null && this.system_menu.length > 0) {
                let financials = this.system_menu.filter(x => x.code.toLowerCase() == "financials");
                if (financials != null && financials.length > 0) {
                  financials[0].view = cm_view != null && cm_view.length > 0 ? true : false;
                }
              }
            }
            //Retail Setups
            if (this.retailsetups_menu != null && this.retailsetups_menu.length > 0) {
              for (let cm of this.retailsetups_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.retailsetups_menu_view = true;
                  this.system_menu_view = true;
                }
              }
              let cm_view = this.retailsetups_menu.filter(x => x.view == true);
              if (this.system_menu != null && this.system_menu.length > 0) {
                let retailsetups = this.system_menu.filter(x => x.code.toLowerCase() == "retail setups");
                if (retailsetups != null && retailsetups.length > 0) {
                  retailsetups[0].view = cm_view != null && cm_view.length > 0 ? true : false;
                }
              }
            }
            //Product
            if (this.product_menu != null && this.product_menu.length > 0) {
              for (let cm of this.product_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.product_menu_view = true;
                  this.system_menu_view = true;
                }
              }
              let cm_view = this.product_menu.filter(x => x.view == true);
              if (this.system_menu != null && this.system_menu.length > 0) {
                let product = this.system_menu.filter(x => x.code.toLowerCase() == "product");
                if (product != null && product.length > 0) {
                  product[0].view = cm_view != null && cm_view.length > 0 ? true : false;
                }
              }
            }

            // Products
            if (this.products_menu != null && this.products_menu.length > 0) {
              for (let cm of this.products_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.products_menu_view = true;
                }
              }
            }
            //Business
            if (this.business_menu != null && this.business_menu.length > 0) {
              for (let cm of this.business_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.business_menu_view = true;
                }
              }
            }
            //Partners
            if (this.partners_menu != null && this.partners_menu.length > 0) {
              for (let cm of this.partners_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.partners_menu_view = true;
                }
              }
            }
            //Pricing
            if (this.pricing_menu != null && this.pricing_menu.length > 0) {
              for (let cm of this.pricing_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.pricing_menu_view = true;
                }
              }
            }
            //Users
            if (this.users_menu != null && this.users_menu.length > 0) {
              for (let cm of this.users_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.users_menu_view = true;
                }
              }
            }
            //Reports
            if (this.reports_menu != null && this.reports_menu.length > 0) {
              for (let cm of this.reports_menu) {
                if (cm.code.toLowerCase() == menu.toLowerCase()) {
                  cm.view = true;
                  this.reports_menu_view = true;
                }
              }
            }

            if (this.menuJson != null && this.menuJson.length > 0) {
              let sys_view = this.system_menu.filter(x => x.view == true);
              let prd_view = this.products_menu.filter(x => x.view == true);
              let bus_view = this.business_menu.filter(x => x.view == true);
              let par_view = this.partners_menu.filter(x => x.view == true);
              let pri_view = this.pricing_menu.filter(x => x.view == true);
              let use_view = this.users_menu.filter(x => x.view == true);
              let rep_view = this.reports_menu.filter(x => x.view == true);

              for (let m of this.menuJson) {
                if (m.code.toLowerCase() == "pos") {

                } else if (m.code.toLowerCase() == "system") {
                  m.view = sys_view != null && sys_view.length > 0 ? true : false;
                }
                else if (m.code.toLowerCase() == "products") {
                  m.view = prd_view != null && prd_view.length > 0 ? true : false;
                }
                else if (m.code.toLowerCase() == "business") {
                  m.view = bus_view != null && bus_view.length > 0 ? true : false;
                }
                else if (m.code.toLowerCase() == "partners") {
                  m.view = par_view != null && par_view.length > 0 ? true : false;
                }
                else if (m.code.toLowerCase() == "pricing") {
                  m.view = pri_view != null && pri_view.length > 0 ? true : false;
                }
                else if (m.code.toLowerCase() == "users") {
                  m.view = use_view != null && use_view.length > 0 ? true : false;
                }
                else if (m.code.toLowerCase() == "reports") {
                  m.view = rep_view != null && rep_view.length > 0 ? true : false;
                }
              }
            }
            //
          }

          if (searchString == null || searchString == "") {
            this.accessibleMenus = new Array<string>();
            for (let menu of this.SelectedMenus) {
              this.accessibleMenus.push(menu);
            }
          } else {
            // this.system_menu_view = false;
            // this.config_menu_view = false;
            // this.financials_menu_view = false;
            // this.retailsetups_menu_view = false;
            // this.product_menu_view = false;
            // this.products_menu_view = false;
            // this.business_menu_view = false;
            // this.partners_menu_view = false;
            // this.pricing_menu_view = false;
            // this.users_menu_view = false;
            // this.reports_menu_view = false;

            // let config_has_menu: boolean = false, finance_has_menu: boolean = false, retail_has_menu: boolean = false,
            //   product_has_menu: boolean = false, products_has_menu: boolean = false, business_has_menu: boolean = false,
            //   partner_has_menu: boolean = false, pricing_has_menu: boolean = false, user_has_menu: boolean = false,
            //   reports_has_menu: boolean = false;

            // this.accessibleMenus = new Array<string>();

            // // Config
            // if (this.config_menu != null && this.config_menu.length > 0) {
            //   for (let cm of this.config_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.config_menu_view = true;
            //       this.system_menu_view = true;
            //       config_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // // Financials
            // if (this.financials_menu != null && this.financials_menu.length > 0) {
            //   for (let cm of this.financials_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.financials_menu_view = true;
            //       this.system_menu_view = true;
            //       finance_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // //Retail Setups
            // if (this.retailsetups_menu != null && this.retailsetups_menu.length > 0) {
            //   for (let cm of this.retailsetups_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.retailsetups_menu_view = true;
            //       this.system_menu_view = true;
            //       retail_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // //Product
            // if (this.product_menu != null && this.product_menu.length > 0) {
            //   for (let cm of this.product_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.product_menu_view = true;
            //       this.system_menu_view = true;
            //       product_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // // Products
            // if (this.products_menu != null && this.products_menu.length > 0) {
            //   for (let cm of this.products_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.products_menu_view = true;
            //       products_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // //Business
            // if (this.business_menu != null && this.business_menu.length > 0) {
            //   for (let cm of this.business_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.business_menu_view = true;
            //       business_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // //Partners
            // if (this.partners_menu != null && this.partners_menu.length > 0) {
            //   for (let cm of this.partners_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.partners_menu_view = true;
            //       partner_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // //Pricing
            // if (this.pricing_menu != null && this.pricing_menu.length > 0) {
            //   for (let cm of this.pricing_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.pricing_menu_view = true;
            //       pricing_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // //Users
            // if (this.users_menu != null && this.users_menu.length > 0) {
            //   for (let cm of this.users_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.users_menu_view = true;
            //       user_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // //Reports
            // if (this.reports_menu != null && this.reports_menu.length > 0) {
            //   for (let cm of this.reports_menu) {
            //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
            //       this.reports_menu_view = true;
            //       reports_has_menu = true;
            //       this.accessibleMenus.push(cm.code);
            //     }
            //   }
            // }

            // debugger;

            // this.system_expand = false;
            // this.products_expand = false;
            // this.config_expand = false;
            // this.finance_expand = false;
            // this.retails_expand = false;

            // this.product_expand = false;
            // this.business_expand = false;
            // this.partners_expand = false;
            // this.pricing_expand = false;
            // this.user_expand = false;
            // this.reports_expand = false;

            // if (config_has_menu == true) {
            //   this.system_expand = true;
            //   this.config_expand = true;
            // } else if (finance_has_menu == true) {
            //   this.system_expand = true;
            //   this.finance_expand = true;
            // } else if (retail_has_menu == true) {
            //   this.system_expand = true;
            //   this.retails_expand = true;
            // } else if (product_has_menu == true) {
            //   this.system_expand = true;
            //   this.products_expand = true;
            // } else if (products_has_menu == true) {
            //   this.product_expand = true;
            // } else if (business_has_menu == true) {
            //   this.business_expand = true;
            // } else if (partner_has_menu == true) {
            //   this.partners_expand = true;
            // } else if (pricing_has_menu == true) {
            //   this.pricing_expand = true;
            // } else if (user_has_menu == true) {
            //   this.user_expand = true;
            // } else if (reports_has_menu == true) {
            //   this.reports_expand = true;
            // }

            // document.body.classList.add('sidebar-collapse');
            // if (this.system_expand == true || this.product_expand == true || this.business_expand == true
            //   || this.partners_expand == true || pricing_has_menu == true || this.user_expand == true
            //   || this.reports_expand == true) {
            //   document.body.classList.remove('sidebar-collapse');
            // }
          }
        }

        // this.system_expand = true;
        // this.product_expand = false;
        // this.business_expand = false;
        // this.partners_expand = false;
        // this.pricing_expand = false;
        // this.user_expand = false;
        // this.reports_expand = false

        // this.products_expand = true;
        // this.config_expand = false;
        // this.finance_expand = false;
        // this.retails_expand = false;
        resolve("ok");
      } catch (ex) {
        console.log("Error : assignUserRights_promise -> " + ex);
        resolve("ok");
      }
    });

  }

  getManagerOverrideData_promise() {
    return new Promise((resolve, reject) => {
      let mgr_str: string = localStorage.getItem('manager_OverRide_Settings');
      if (mgr_str != null && mgr_str != "null") {
        // console.log("=> Mgr details exists");
        this.manager_OverRide_Settings = JSON.parse(mgr_str);
        // this.getRetailSettingsData();
        resolve(this.manager_OverRide_Settings);
      } else {
        if (this.user_details != null && this.user_details != {} && this.user_details.managerOverrideID != null) {
          localStorage.setItem('manager_OverRide_Settings', null);
          // console.log("=> Mgr details not exists");
          this.api.getAPI("manageroverride?ID=" + this.user_details.managerOverrideID)
            .subscribe((data) => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                this.manager_OverRide_Settings = new MManagerOverride();
                this.manager_OverRide_Settings = data.managerOverrideRecord
                localStorage.setItem('manager_OverRide_Settings', JSON.stringify(this.manager_OverRide_Settings));
                // this.getRetailSettingsData();
                resolve(this.manager_OverRide_Settings);
              } else {
                let msg: string = data != null
                  && data.displayMessage != null
                  && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
                // this.common.showMessage('warn', msg);
                reject(msg);
              }
            });
        }
      }
    });
  }

  getRetailSettingsData_promise() {
    return new Promise((resolve, reject) => {
      let retail_str: string = localStorage.getItem('retail_settings');
      if (retail_str != null && retail_str != "null") {
        // console.log("=> Retail details exists");
        this.retail_Settings = JSON.parse(retail_str);
        resolve(this.retail_Settings);
        //this.store_promotions();
      } else {
        if (this.user_details != null && this.user_details != {} && this.user_details.retailID != null) {
          // console.log("=> Retail details not exists");
          localStorage.setItem('retail_settings', null);
          this.api.getAPI("retailsettings?ID=" + this.user_details.retailID)
            .subscribe((data) => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                this.retail_Settings = new MRetailSettings();
                this.retail_Settings = data.retailRecord;
                localStorage.setItem('retail_settings', JSON.stringify(this.retail_Settings));
                resolve(this.retail_Settings);
              } else {
                let msg: string = data != null
                  && data.displayMessage != null
                  && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
                reject(msg);
              }
            });
        }
      }
    });

  }

  store_promotions_promise() {
  
    return new Promise((resolve, reject) => {
      let promo_str: string = localStorage.getItem('store_promotions');
      if (promo_str != null && promo_str != "null") {
      } else {
        if (this.user_details != null && this.user_details != {} && this.user_details.storeID != null) {
          // console.log("=> Promotions details not exists");
          localStorage.setItem('store_promotions', null);
          let store_promotions: Array<MPromotionMaster> = new Array<MPromotionMaster>();
          this.api.getAPI("StorePromotion?StoreID=" + this.user_details.storeID)
            .subscribe((data) => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                if (data.promotionsList != null && data.promotionsList != undefined) {
                  store_promotions = data.promotionsList;
                  localStorage.setItem('store_promotions', JSON.stringify(store_promotions));
                  resolve("ok");
                }
              } else {
                let msg: string = data != null
                  && data.displayMessage != null
                  && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
                //this.common.showMessage('warn', msg);
                reject(msg);
              }
            });
        }
      }
    });


    // }
  }
















  changeLangage(lang: string) {
    let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    //  this.changeCssFile(lang);
  }

  changeSiteLanguage() {

    if (this.buttonLanguage == "English") {
      this.buttonLanguage = "Arabic";
      this.changeLangage("en");
    } else {
      this.buttonLanguage = "English";
      this.changeLangage("ar");
    }
  }

  loadDefault() {
    // this.getMenuJson();
    localStorage.setItem('enableOrjwanStock', "true");
    let tkn = localStorage.getItem('token');
    if (tkn != null) {
      let temp_str: string = localStorage.getItem('user_details');
      if (temp_str != null && temp_str != "null") {
        // console.log("=> User details exists");
        this.user_details = JSON.parse(temp_str);
        this.getMenuScreens();
      } else {
        // console.log("=> User details not exists");
        this.get_me();
      }
    }

  }

  /*loadDefault() {
    this.getMenuJson();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null && temp_str != "null") {
      // console.log("=> User details exists");
      this.user_details = JSON.parse(temp_str);
      this.getMenuScreens();
    } else {
      // console.log("=> User details not exists");
      this.get_me();
    }
  }*/

  get_me() {

    localStorage.setItem('user_details', null);
    this.common.showSpinner();
    this.api.getAPI("User").subscribe((data) => {
      if (data != null && data.statusCode != null && data.statusCode == 1) {
        // setTimeout(() => {
        if (data.userInfoRecord != null) {
          this.user_details = new MUserDetails();
          this.user_details = data.userInfoRecord;
          localStorage.setItem('user_details', JSON.stringify(this.user_details));
          this.getMenuScreens();
        } else {
          this.common.showMessage('error', 'Invalid User Details');
          localStorage.setItem('user_details', null);
        }
        this.common.hideSpinner();
        // }, this.common.time_out_delay);
      }
    });
  }

  getMenuScreens() {
    let menu_str: string = localStorage.getItem('SelectedMenus');
    if (menu_str != null && menu_str != "null") {
      // console.log("=> Menu details exists");
      this.getMenuJson();
      this.SelectedMenus = JSON.parse(menu_str);
      this.assignUserRights("");
      this.getManagerOverrideData();
    } else {
      if (this.user_details != null && this.user_details != {}) {
        // console.log("=> Menu details not exists");
        localStorage.setItem('SelectedMenus', null);
        this.userid = this.user_details.id;
        this.userroleId = this.user_details.roleID;
        // this.userroleId = 12;
        this.userroleCode = this.user_details.roleCode;

        this.screenName = null;
        this.SelectedMenus = [];
        this.common.showSpinner();
        this.api.getAPI("UserPrivelege?id=" + this.userroleId)
          .subscribe((data) => {
            this.getMenuJson();
            // setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.screenName = data.masUserPrivilagesRecord.screenName;
              var str = new String(this.screenName)
              var splits = str.split(",")
              this.SelectedMenus = splits;
              this.SelectedMenusCopy = this.SelectedMenus;
              localStorage.setItem('SelectedMenus', JSON.stringify(this.SelectedMenus));
              this.assignUserRights("");
              this.getManagerOverrideData();
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
    }

  }

  getManagerOverrideData() {
    let mgr_str: string = localStorage.getItem('manager_OverRide_Settings');
    if (mgr_str != null && mgr_str != "null") {
      // console.log("=> Mgr details exists");
      this.manager_OverRide_Settings = JSON.parse(mgr_str);
      this.getRetailSettingsData();
    } else {
      if (this.user_details != null && this.user_details != {} && this.user_details.managerOverrideID != null) {
        localStorage.setItem('manager_OverRide_Settings', null);
        // console.log("=> Mgr details not exists");
        this.common.showSpinner();
        this.api.getAPI("manageroverride?ID=" + this.user_details.managerOverrideID)
          .subscribe((data) => {
            // setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.manager_OverRide_Settings = new MManagerOverride();
              this.manager_OverRide_Settings = data.managerOverrideRecord
              localStorage.setItem('manager_OverRide_Settings', JSON.stringify(this.manager_OverRide_Settings));
              this.getRetailSettingsData();
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
    }

  }

  getRetailSettingsData() {
    let retail_str: string = localStorage.getItem('retail_settings');
    if (retail_str != null && retail_str != "null") {
      // console.log("=> Retail details exists");
      this.retail_Settings = JSON.parse(retail_str);
      //this.store_promotions();
    } else {
      if (this.user_details != null && this.user_details != {} && this.user_details.retailID != null) {
        // console.log("=> Retail details not exists");
        localStorage.setItem('retail_settings', null);
        this.common.showSpinner();
        this.api.getAPI("retailsettings?ID=" + this.user_details.retailID)
          .subscribe((data) => {
            // setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.retail_Settings = new MRetailSettings();
              this.retail_Settings = data.retailRecord;
              localStorage.setItem('retail_settings', JSON.stringify(this.retail_Settings));
              //this.store_promotions();
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
    }
  }

  store_promotions() {
    let promo_str: string = localStorage.getItem('store_promotions');
    if (promo_str != null && promo_str != "null") {
    } else {
      if (this.user_details != null && this.user_details != {} && this.user_details.storeID != null) {
        // console.log("=> Promotions details not exists");
        localStorage.setItem('store_promotions', null);
        let store_promotions: Array<MPromotionMaster> = new Array<MPromotionMaster>();
        this.common.showSpinner();
        this.api.getAPI("StorePromotion?StoreID=" + this.user_details.storeID)
          .subscribe((data) => {
            setTimeout(() => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                if (data.promotionsList != null && data.promotionsList != undefined) {
                  store_promotions = data.promotionsList;
                  localStorage.setItem('store_promotions', JSON.stringify(store_promotions));
                }
              } else {
                let msg: string = data != null
                  && data.displayMessage != null
                  && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
                //this.common.showMessage('warn', msg);
              }
              this.common.hideSpinner();
            }, this.common.time_out_delay);
          });
      }
    }

    // }
  }

  ngOnInit() {

  }

  getMenuJson() {
    this.menuJson = new Array<MMenuModel>();
    this.system_menu = new Array<MMenuModel>();
    this.config_menu = new Array<MMenuModel>();
    this.financials_menu = new Array<MMenuModel>();
    this.retailsetups_menu = new Array<MMenuModel>();
    this.product_menu = new Array<MMenuModel>();
    this.products_menu = new Array<MMenuModel>();
    this.business_menu = new Array<MMenuModel>();
    this.partners_menu = new Array<MMenuModel>();
    this.pricing_menu = new Array<MMenuModel>();
    this.users_menu = new Array<MMenuModel>();
    this.reports_menu = new Array<MMenuModel>();
    this.accessibleMenus = new Array<any>();

    this.config_menu.push({ code: "Country", menuName: "Country", view: false });
    this.config_menu.push({ code: "State", menuName: "State", view: false });
    this.config_menu.push({ code: "City Master", menuName: "City", view: false });
    this.config_menu.push({ code: "Language Settings", menuName: "Language", view: false });
    this.config_menu.push({ code: "Company Settings", menuName: "Company", view: false });
    this.config_menu.push({ code: "Warehouse", menuName: "Warehouse", view: false });
    this.config_menu.push({ code: "Warehouse Types", menuName: "Warehouse Types", view: false });
    this.config_menu.push({ code: "Document Numbering", menuName: "Document Numbering", view: false });
    this.config_menu.push({ code: "Brand Division Mapping", menuName: "Brand Division Mapping", view: false });
    this.config_menu.push({ code: "Style Status", menuName: "Style Status", view: false });
    this.config_menu.push({ code: "Style Segmentation", menuName: "Style Segmentation", view: false });
    this.config_menu.push({ code: "Segamentation Types", menuName: "Segmentation Type", view: false });
    this.config_menu.push({ code: "Drop Master", menuName: "Drop Master", view: false });
    this.config_menu.push({ code: "Collection Master", menuName: "Collection", view: false });
    this.config_menu.push({ code: "SubCollection Master", menuName: "Sub Collection", view: false });

    this.system_menu.push({ code: "Config", menuName: "Config", view: false, items: this.config_menu });

    this.financials_menu.push({ code: "Currency", menuName: "Currency", view: false });
    this.financials_menu.push({ code: "Exchange Rate", menuName: "Exchange Rate", view: false });
    this.financials_menu.push({ code: "Expense Master", menuName: "Expense Master", view: false });
    this.financials_menu.push({ code: "On-Account Payment", menuName: "On Account Payment", view: false });
    this.financials_menu.push({ code: "Payment Mode", menuName: "Payment Mode", view: false });
    this.financials_menu.push({ code: "Payment Type", menuName: "Payment Type", view: false });
    this.financials_menu.push({ code: "Tax Master", menuName: "Tax", view: false });

    this.system_menu.push({ code: "Financials", menuName: "Financials", view: false, items: this.financials_menu });

    this.retailsetups_menu.push({ code: "ManagerOverride", menuName: "Manage Override", view: false });
    this.retailsetups_menu.push({ code: "Retail Settings", menuName: "Retail Settings", view: false });
    this.retailsetups_menu.push({ code: "Store", menuName: "Store", view: false });
    this.retailsetups_menu.push({ code: "Store Group", menuName: "Store Group", view: false });
    this.retailsetups_menu.push({ code: "Franchise", menuName: "Franchise", view: false });
    this.retailsetups_menu.push({ code: "Shift", menuName: "Shift Master", view: false });
    this.retailsetups_menu.push({ code: "POS", menuName: "POS Master", view: false });

    this.system_menu.push({ code: "Retail Setups", menuName: "Retail Setups", view: false, items: this.retailsetups_menu });

    this.product_menu.push({ code: "Brand", menuName: "Brand", view: false });
    this.product_menu.push({ code: "Sub Brand", menuName: "Sub Brand", view: false });
    this.product_menu.push({ code: "Scale Master", menuName: "Scale", view: false });
    this.product_menu.push({ code: "Color Master", menuName: "Color", view: false });
    this.product_menu.push({ code: "Design Master", menuName: "Design", view: false });
    this.product_menu.push({ code: "ProductLine", menuName: "Product Line", view: false });
    this.product_menu.push({ code: "Product Group", menuName: "Product Group", view: false });
    this.product_menu.push({ code: "Product SubGroup", menuName: "Product Sub Group", view: false });
    this.product_menu.push({ code: "Season", menuName: "Season", view: false });
    this.product_menu.push({ code: "Division", menuName: "Division", view: false });
    this.product_menu.push({ code: "Reason", menuName: "Reason", view: false });
    this.product_menu.push({ code: "Year", menuName: "Year", view: false });

    this.system_menu.push({ code: "Product", menuName: "Product", view: false, items: this.product_menu });

    this.menuJson.push({ code: "System", menuName: "System", view: false, items: this.system_menu });
    this.menuJson.push({ code: "POS", menuName: "POS", view: false, items: [] });

    this.products_menu.push({ code: "Style Master", menuName: "Style", view: false, items: [] });
    this.products_menu.push({ code: "SKU Master", menuName: "SKU", view: false, items: [] });
    this.products_menu.push({ code: "Bar Code", menuName: "Barcode List", view: false, items: [] });

    this.menuJson.push({ code: "Products", menuName: "Products", view: false, items: this.products_menu });

    this.business_menu.push({ code: "Stock Request", menuName: "Stock Request", view: false, items: [] });
    this.business_menu.push({ code: "Stock Receipt", menuName: "Stock Receipt", view: false, items: [] });
    this.business_menu.push({ code: "Stock Return", menuName: "Stock Return", view: false, items: [] });
    this.business_menu.push({ code: "Inventory Counting", menuName: "Inventory Counting", view: false, items: [] });
    this.business_menu.push({ code: "Stock Adjustment", menuName: "Stock Adjustment", view: false, items: [] });
    this.business_menu.push({ code: "Opening Stock", menuName: "Opening Stock", view: false, items: [] });
    this.business_menu.push({ code: "Non Trading Stock Distribution", menuName: "Non-Trading Stock Distribution", view: false, items: [] });
    this.business_menu.push({ code: "Tailoring", menuName: "Tailoring", view: false, items: [] });
    this.business_menu.push({ code: "Bin Config", menuName: "Bin Config", view: false, items: [] });
    this.business_menu.push({ code: "Bin Transfer", menuName: "Bin Transfer", view: false, items: [] });

    this.menuJson.push({ code: "Business", menuName: "Business", view: false, items: this.business_menu });

    this.partners_menu.push({ code: "Customer Master", menuName: "Customer Master", view: false, items: [] });
    this.partners_menu.push({ code: "Customer Group", menuName: "Customer Group", view: false, items: [] });
    this.partners_menu.push({ code: "Vendor", menuName: "Vendor Master", view: false, items: [] });
    this.partners_menu.push({ code: "VendorGroup", menuName: "Vendor Group", view: false, items: [] });

    this.menuJson.push({ code: "Partners", menuName: "Partners", view: false, items: this.partners_menu });

    this.pricing_menu.push({ code: "Price List", menuName: "Price List", view: false, items: [] });
    this.pricing_menu.push({ code: "Price Point", menuName: "Price Point", view: false, items: [] });
    this.pricing_menu.push({ code: "Price Type Master", menuName: "Price Type", view: false, items: [] });
    this.pricing_menu.push({ code: "Promotions", menuName: "Promotions", view: false, items: [] });
    this.pricing_menu.push({ code: "PromotionsPriority", menuName: "Promotion Priority", view: false, items: [] });
    this.pricing_menu.push({ code: "WN Promotion", menuName: "WNPromotion", view: false, items: [] });
    this.pricing_menu.push({ code: "Promotion Mapping", menuName: "PromotionMapping", view: false, items: [] });
    this.pricing_menu.push({ code: "Coupon", menuName: "Coupon", view: false, items: [] });
    this.pricing_menu.push({ code: "CouponTransfer", menuName: "Coupon Transfer", view: false, items: [] });
    this.pricing_menu.push({ code: "CouponReceipt", menuName: "Coupon Receipt", view: false, items: [] });
    this.pricing_menu.push({ code: "Armada Discount", menuName: "Armada Discount", view: false, items: [] });
    this.pricing_menu.push({ code: "Price Change", menuName: "Price Change", view: false, items: [] });
    // this.pricing_menu.push({ code: "Coupon Master", menuName: "Coupon Master", view: false, items: []})
    this.pricing_menu.push({ code: "Combo Master", menuName: "Combo Master", view: false, items: [] });


    this.menuJson.push({ code: "Pricing", menuName: "Pricing", view: false, items: this.pricing_menu });

    this.users_menu.push({ code: "Designation", menuName: "Designation", view: false, items: [] });
    this.users_menu.push({ code: "Employees", menuName: "Employees", view: false, items: [] });
    this.users_menu.push({ code: "Role Master", menuName: "User Roles", view: false, items: [] });
    this.users_menu.push({ code: "Login Users", menuName: "User Master", view: false, items: [] });
    this.users_menu.push({ code: "Users - Previlege", menuName: "Users Previleges", view: false, items: [] });
    
    
    this.menuJson.push({ code: "Users", menuName: "Users", view: false, items: this.users_menu });

    this.reports_menu.push({ code: "Duplicate Receipt", menuName: "Duplicate Receipt", view: false, items: [] });
    this.reports_menu.push({ code: "Exchange Receipt", menuName: "Exchange Receipt", view: false, items: [] });
    this.reports_menu.push({ code: "Hold Receipt", menuName: "Hold Receipt", view: false, items: [] });
    this.reports_menu.push({ code: "Invoice Receipt", menuName: "Invoice Receipt", view: false, items: [] });
    this.reports_menu.push({ code: "Return Receipt", menuName: "Return Receipt", view: false, items: [] });
    this.reports_menu.push({ code: "Xreport", menuName: "X Report", view: false, items: [] });
    this.reports_menu.push({ code: "ZReport", menuName: "Z Report", view: false, items: [] });

    this.menuJson.push({ code: "Reports", menuName: "Reports", view: false, items: this.reports_menu });
  }

  menu_system_click() {
    // var anchor = $('#a_customer');
    if (this.system_expand == true) {
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false;
      document.body.classList.add('sidebar-collapse');
    } else {
      this.system_expand = true;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false;
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  menu_business_click() {
    // var anchor = $('#a_customer');
    if (this.business_expand == true) {
      this.business_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false;
      document.body.classList.add('sidebar-collapse');
    } else {
      this.business_expand = true;
      this.system_expand = false;
      this.product_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false;
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  menu_partners_click() {
    // var anchor = $('#a_customer');
    if (this.partners_expand == true) {
      this.partners_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;

      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false;
      document.body.classList.add('sidebar-collapse');
    } else {
      this.partners_expand = true;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;

      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false;
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  menu_pricing_click() {
    // var anchor = $('#a_customer');
    if (this.pricing_expand == true) {
      this.pricing_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;

      this.user_expand = false;
      this.reports_expand = false;
      document.body.classList.add('sidebar-collapse');
    } else {
      this.pricing_expand = true;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;

      this.user_expand = false;
      this.reports_expand = false;
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  menu_user_click() {
    // var anchor = $('#a_customer');
    if (this.user_expand == true) {
      this.user_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;

      this.reports_expand = false;
      document.body.classList.add('sidebar-collapse');
    } else {
      this.user_expand = true;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;

      this.reports_expand = false;
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  menu_reports_click() {
    // var anchor = $('#a_customer');
    if (this.reports_expand == true) {
      this.reports_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;

      document.body.classList.add('sidebar-collapse');
    } else {
      this.reports_expand = true;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;

      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  Menu_product_click() {

    if (this.product_expand == true) {
      this.product_expand = false;
      this.system_expand = false;

      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      document.body.classList.add('sidebar-collapse');
    } else {
      this.product_expand = true;
      this.system_expand = false;

      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  span_log_click() {
    // var anchor = $('#a_customer');
    if (this.log_expand == true) {
      this.log_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.log_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  get_pos_mode() {
    let temp_str: string = localStorage.getItem('pos_mode');
    return temp_str != null && temp_str == 'true' ? true : false;
  }

  get_pos_title() {
    let title = "";
    if (this.user_details != null && this.user_details.posTitle != null) {
      title = this.user_details.posTitle;
    }
    return title;
  }

  posClick() {
    let store_id: number = this.user_details != null && this.user_details.storeID != null ? this.user_details.storeID : 0;
    let user_id: number = this.user_details != null && this.user_details.id != null ? this.user_details.id : 0;
    let country_id: number = this.user_details != null && this.user_details.countryID != null ? this.user_details.countryID : 0;

    if (country_id == null || country_id == 0) {
      this.common.showMessage("warn", "User Country Info is invalid");
    } else if (user_id == null || user_id == 0) {
      this.common.showMessage("warn", "User Info is invalid");
    } else if (store_id == null || store_id == 0) {
      this.common.showMessage("warn", "User Store Info is invalid");
    } else {
      // this.store_promotions(store_id);
      this.check_dayIn_shiftIn(country_id, user_id, store_id);
    }
  }

  check_dayIn_shiftIn(country_id: number, user_id: number, store_id: number) {
    this.common.showSpinner();
    this.api.getAPI("DayIn?StoreID=" + store_id + "&UserID=" + user_id + "&CountryID=" + country_id)
      .subscribe((data) => {
        setTimeout(() => {
          localStorage.setItem('pos_mode', 'true');
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            let pos_details: MDayClosing = new MDayClosing();
            pos_details = data.logShiftList;
            localStorage.setItem('pos_details', JSON.stringify(pos_details));

            if (data.dayIn != null && data.shiftIn != null
              && data.dayIn != undefined && data.shiftIn != undefined) {
              if (data.dayIn == true && data.shiftIn == true) {
                this.router.navigate(['pos']);
                localStorage.setItem('pos_from_home', "true");
              }
              else {
                this.router.navigate(['day-in-out']);
              }
            } else {
              this.router.navigate(['day-in-out']);
            }
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
            this.router.navigate(['day-in-out']);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  homeClick() {
    localStorage.setItem('pos_mode', 'false');
    // alert('app');
    // this.pos_mode = false;
    this.router.navigate(['home']);

  }

  isAuthenticated() {
    this.isAuth = localStorage.getItem('isAuth');
    if (this.isAuth == null) {
      this.isAuth = 'false';
    }
    if (this.isAuth == 'true') {
      return true;
    } else {
      return false;
    }
  }

  span_system_click() {
    // var anchor = $('#a_customer');
    if (this.system_expand == true) {
      this.system_expand = false;

      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false
      document.body.classList.add('sidebar-collapse');
    } else {
      this.system_expand = true;

      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  span_product_click() {
    // var anchor = $('#a_customer');
    if (this.product_expand == true) {
      this.product_expand = false;
      this.system_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false
      document.body.classList.add('sidebar-collapse');
    } else {
      this.product_expand = true;
      this.system_expand = false;

      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  span_business_click() {
    // var anchor = $('#a_customer');
    if (this.business_expand == true) {
      this.business_expand = false;
      this.system_expand = false;
      this.product_expand = false;

      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false
      document.body.classList.add('sidebar-collapse');
    } else {
      this.business_expand = true;
      this.system_expand = false;
      this.product_expand = false;

      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  span_partners_click() {
    // var anchor = $('#a_customer');
    if (this.partners_expand == true) {
      this.partners_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;

      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false
      document.body.classList.add('sidebar-collapse');
    } else {
      this.partners_expand = true;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;

      this.pricing_expand = false;
      this.user_expand = false;
      this.reports_expand = false
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  span_pricing_click() {
    // var anchor = $('#a_customer');
    if (this.pricing_expand == true) {
      this.pricing_expand = false;

      this.user_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.reports_expand = false
      document.body.classList.add('sidebar-collapse');
    } else {
      this.pricing_expand = true;
      this.user_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.reports_expand = false
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  span_user_click() {
    // var anchor = $('#a_customer');
    if (this.user_expand == true) {
      this.user_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;

      this.reports_expand = false
      document.body.classList.add('sidebar-collapse');
    } else {
      this.user_expand = true;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;

      this.reports_expand = false
      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  span_reports_click() {
    // var anchor = $('#a_customer');
    if (this.reports_expand == true) {
      this.reports_expand = false;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;

      document.body.classList.add('sidebar-collapse');
    } else {
      this.reports_expand = true;
      this.system_expand = false;
      this.product_expand = false;
      this.business_expand = false;
      this.partners_expand = false;
      this.pricing_expand = false;
      this.user_expand = false;

      document.body.classList.remove('sidebar-collapse');
      // anchor.classList.remove('menu-open');
    }
  }

  span_click() {
    // window.alert(this.expand);
    if (this.expand == true) {
      this.expand = false;
      document.body.classList.add('sb-l-m');
      document.body.classList.add('sb-l-disable-animation');
    } else {
      this.expand = true;
      document.body.classList.remove('sb-l-m');
      document.body.classList.remove('sb-l-disable-animation');
    }
    // window.alert(this.expand);
    // $('body').removeClass('sb-l-m sb-l-disable-animation');
  }

  span_clicks() {
    // window.alert(this.expand);
    if (this.expand == null || this.expand == undefined) {
      if (this.SelectedMenus != null && this.SelectedMenus.length == 1 && this.SelectedMenus[0].toLowerCase() == "sales") {
        // console.log(this.SelectedMenus);
        this.expand = false;
      } else {
        this.expand = true;
      }

    }
    // if (this.expand == true) {
    //   // if (this.SelectedMenus != null && this.SelectedMenus.length == 1 && this.SelectedMenus[0].toLowerCase() == "sales") {
    //   //   // console.log(this.SelectedMenus);
    //   //   // this.expand = false;
    //   //   this.expand = false;
    //   //     document.body.classList.add('sidebar-collapse');
    //   // }else{
    //   //     this.expand = false;
    //   //     document.body.classList.add('sidebar-collapse');
    //   //   }
    //     this.expand = false;
    //     document.body.classList.add('sidebar-collapse');
    // } else {
    //   this.expand = true;
    //   document.body.classList.remove('sidebar-collapse');
    // }
    // window.alert(this.expand);
    // $('body').removeClass('sb-l-m sb-l-disable-animation');
  }

  span_customer_click() {
    // var anchor = $('#a_customer');
    if (this.customer_expand == true) {
      this.customer_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.customer_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_master_click() {
    // var anchor = $('#a_customer');
    if (this.master_expand == true) {
      this.master_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.master_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_administrator_click() {
    // var anchor = $('#a_customer');
    if (this.administrator_expand == true) {
      this.administrator_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.administrator_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_financials_click() {
    if (this.financials_expand == true) {
      this.financials_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.financials_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_retail_click() {
    if (this.retail_expand == true) {
      this.retail_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.retail_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_design_concept_click() {
    if (this.design_concept_expand == true) {
      this.design_concept_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.design_concept_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_stock_click() {
    if (this.stock_expand == true) {
      this.stock_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.stock_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_pos_click() {
    if (this.pos_expand == true) {
      this.pos_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.pos_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_pricing_promotions_click() {
    if (this.pricingandpromotions_expand == true) {
      this.pricingandpromotions_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.pricingandpromotions_expand = true;
      // anchor.classList.remove('menu-open');
    }
  }

  span_config_click() {
    // var anchor = $('#a_customer');
    if (this.config_expand == true) {
      this.config_expand = false;
      this.finance_expand = false;
      this.retails_expand = false;
      this.products_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.config_expand = true;
      this.finance_expand = false;
      this.retails_expand = false;
      this.products_expand = false;
      // anchor.classList.remove('menu-open');
    }
  }

  span_finance_click() {
    // var anchor = $('#a_customer');
    if (this.finance_expand == true) {
      this.config_expand = false;
      this.finance_expand = false;
      this.retails_expand = false;
      this.products_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.finance_expand = true;
      this.config_expand = false;
      this.retails_expand = false;
      this.products_expand = false;
      // anchor.classList.remove('menu-open');
    }
  }

  span_retails_click() {
    // var anchor = $('#a_customer');
    if (this.retails_expand == true) {
      this.config_expand = false;
      this.finance_expand = false;
      this.retails_expand = false;
      this.products_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.retails_expand = true;
      this.config_expand = false;
      this.products_expand = false;
      this.finance_expand = false;
      // anchor.classList.remove('menu-open');
    }
  }

  span_products_click() {
    // var anchor = $('#a_customer');
    if (this.products_expand == true) {
      this.finance_expand = false;
      this.config_expand = false;
      this.products_expand = false;
      this.retails_expand = false;
      // anchor.classList.add('menu-open');
    } else {
      this.products_expand = true;
      this.config_expand = false;
      this.finance_expand = false;
      this.retails_expand = false;
      // anchor.classList.remove('menu-open');
    }
  }



  onSearch(name: string) {
    this.assignUserRights(name);
  }

  assignUserRights(searchString: string) {
    this.system_menu_view = false;
    this.config_menu_view = false;
    this.financials_menu_view = false;
    this.retailsetups_menu_view = false;
    this.product_menu_view = false;
    this.products_menu_view = false;
    this.business_menu_view = false;
    this.partners_menu_view = false;
    this.pricing_menu_view = false;
    this.users_menu_view = false;
    this.reports_menu_view = false;

    if (this.SelectedMenus != null && this.SelectedMenus.length > 0) {
      for (let menu of this.SelectedMenus) {
        // System 
        // Config
        if (this.config_menu != null && this.config_menu.length > 0) {
          for (let cm of this.config_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.config_menu_view = true;
              this.system_menu_view = true;
            }
          }
          let cm_view = this.config_menu.filter(x => x.view == true);
          if (this.system_menu != null && this.system_menu.length > 0) {
            let config = this.system_menu.filter(x => x.code.toLowerCase() == "config");
            if (config != null && config.length > 0) {
              config[0].view = cm_view != null && cm_view.length > 0 ? true : false;
            }
          }
        }
        // Financials
        if (this.financials_menu != null && this.financials_menu.length > 0) {
          for (let cm of this.financials_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.financials_menu_view = true;
              this.system_menu_view = true;
            }
          }
          let cm_view = this.financials_menu.filter(x => x.view == true);
          if (this.system_menu != null && this.system_menu.length > 0) {
            let financials = this.system_menu.filter(x => x.code.toLowerCase() == "financials");
            if (financials != null && financials.length > 0) {
              financials[0].view = cm_view != null && cm_view.length > 0 ? true : false;
            }
          }
        }
        //Retail Setups
        if (this.retailsetups_menu != null && this.retailsetups_menu.length > 0) {
          for (let cm of this.retailsetups_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.retailsetups_menu_view = true;
              this.system_menu_view = true;
            }
          }
          let cm_view = this.retailsetups_menu.filter(x => x.view == true);
          if (this.system_menu != null && this.system_menu.length > 0) {
            let retailsetups = this.system_menu.filter(x => x.code.toLowerCase() == "retail setups");
            if (retailsetups != null && retailsetups.length > 0) {
              retailsetups[0].view = cm_view != null && cm_view.length > 0 ? true : false;
            }
          }
        }
        //Product
        if (this.product_menu != null && this.product_menu.length > 0) {
          for (let cm of this.product_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.product_menu_view = true;
              this.system_menu_view = true;
            }
          }
          let cm_view = this.product_menu.filter(x => x.view == true);
          if (this.system_menu != null && this.system_menu.length > 0) {
            let product = this.system_menu.filter(x => x.code.toLowerCase() == "product");
            if (product != null && product.length > 0) {
              product[0].view = cm_view != null && cm_view.length > 0 ? true : false;
            }
          }
        }

        // Products
        if (this.products_menu != null && this.products_menu.length > 0) {
          for (let cm of this.products_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.products_menu_view = true;
            }
          }
        }
        //Business
        if (this.business_menu != null && this.business_menu.length > 0) {
          for (let cm of this.business_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.business_menu_view = true;
            }
          }
        }
        //Partners
        if (this.partners_menu != null && this.partners_menu.length > 0) {
          for (let cm of this.partners_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.partners_menu_view = true;
            }
          }
        }
        //Pricing
        if (this.pricing_menu != null && this.pricing_menu.length > 0) {
          for (let cm of this.pricing_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.pricing_menu_view = true;
            }
          }
        }
        //Users
        if (this.users_menu != null && this.users_menu.length > 0) {
          for (let cm of this.users_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.users_menu_view = true;
            }
          }
        }
        //Reports
        if (this.reports_menu != null && this.reports_menu.length > 0) {
          for (let cm of this.reports_menu) {
            if (cm.code.toLowerCase() == menu.toLowerCase()) {
              cm.view = true;
              this.reports_menu_view = true;
            }
          }
        }

        if (this.menuJson != null && this.menuJson.length > 0) {
          let sys_view = this.system_menu.filter(x => x.view == true);
          let prd_view = this.products_menu.filter(x => x.view == true);
          let bus_view = this.business_menu.filter(x => x.view == true);
          let par_view = this.partners_menu.filter(x => x.view == true);
          let pri_view = this.pricing_menu.filter(x => x.view == true);
          let use_view = this.users_menu.filter(x => x.view == true);
          let rep_view = this.reports_menu.filter(x => x.view == true);

          for (let m of this.menuJson) {
            if (m.code.toLowerCase() == "pos") {

            } else if (m.code.toLowerCase() == "system") {
              m.view = sys_view != null && sys_view.length > 0 ? true : false;
            }
            else if (m.code.toLowerCase() == "products") {
              m.view = prd_view != null && prd_view.length > 0 ? true : false;
            }
            else if (m.code.toLowerCase() == "business") {
              m.view = bus_view != null && bus_view.length > 0 ? true : false;
            }
            else if (m.code.toLowerCase() == "partners") {
              m.view = par_view != null && par_view.length > 0 ? true : false;
            }
            else if (m.code.toLowerCase() == "pricing") {
              m.view = pri_view != null && pri_view.length > 0 ? true : false;
            }
            else if (m.code.toLowerCase() == "users") {
              m.view = use_view != null && use_view.length > 0 ? true : false;
            }
            else if (m.code.toLowerCase() == "reports") {
              m.view = rep_view != null && rep_view.length > 0 ? true : false;
            }
          }
        }
        //
      }

      if (searchString == null || searchString == "") {
        this.accessibleMenus = new Array<string>();
        for (let menu of this.SelectedMenus) {
          this.accessibleMenus.push(menu);
        }
      } else {
        // this.system_menu_view = false;
        // this.config_menu_view = false;
        // this.financials_menu_view = false;
        // this.retailsetups_menu_view = false;
        // this.product_menu_view = false;
        // this.products_menu_view = false;
        // this.business_menu_view = false;
        // this.partners_menu_view = false;
        // this.pricing_menu_view = false;
        // this.users_menu_view = false;
        // this.reports_menu_view = false;

        // let config_has_menu: boolean = false, finance_has_menu: boolean = false, retail_has_menu: boolean = false,
        //   product_has_menu: boolean = false, products_has_menu: boolean = false, business_has_menu: boolean = false,
        //   partner_has_menu: boolean = false, pricing_has_menu: boolean = false, user_has_menu: boolean = false,
        //   reports_has_menu: boolean = false;

        // this.accessibleMenus = new Array<string>();

        // // Config
        // if (this.config_menu != null && this.config_menu.length > 0) {
        //   for (let cm of this.config_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.config_menu_view = true;
        //       this.system_menu_view = true;
        //       config_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // // Financials
        // if (this.financials_menu != null && this.financials_menu.length > 0) {
        //   for (let cm of this.financials_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.financials_menu_view = true;
        //       this.system_menu_view = true;
        //       finance_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // //Retail Setups
        // if (this.retailsetups_menu != null && this.retailsetups_menu.length > 0) {
        //   for (let cm of this.retailsetups_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.retailsetups_menu_view = true;
        //       this.system_menu_view = true;
        //       retail_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // //Product
        // if (this.product_menu != null && this.product_menu.length > 0) {
        //   for (let cm of this.product_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.product_menu_view = true;
        //       this.system_menu_view = true;
        //       product_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // // Products
        // if (this.products_menu != null && this.products_menu.length > 0) {
        //   for (let cm of this.products_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.products_menu_view = true;
        //       products_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // //Business
        // if (this.business_menu != null && this.business_menu.length > 0) {
        //   for (let cm of this.business_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.business_menu_view = true;
        //       business_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // //Partners
        // if (this.partners_menu != null && this.partners_menu.length > 0) {
        //   for (let cm of this.partners_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.partners_menu_view = true;
        //       partner_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // //Pricing
        // if (this.pricing_menu != null && this.pricing_menu.length > 0) {
        //   for (let cm of this.pricing_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.pricing_menu_view = true;
        //       pricing_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // //Users
        // if (this.users_menu != null && this.users_menu.length > 0) {
        //   for (let cm of this.users_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.users_menu_view = true;
        //       user_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // //Reports
        // if (this.reports_menu != null && this.reports_menu.length > 0) {
        //   for (let cm of this.reports_menu) {
        //     if (cm.menuName.toLowerCase().includes(searchString.toLowerCase()) && cm.view == true) {
        //       this.reports_menu_view = true;
        //       reports_has_menu = true;
        //       this.accessibleMenus.push(cm.code);
        //     }
        //   }
        // }

        // debugger;

        // this.system_expand = false;
        // this.products_expand = false;
        // this.config_expand = false;
        // this.finance_expand = false;
        // this.retails_expand = false;

        // this.product_expand = false;
        // this.business_expand = false;
        // this.partners_expand = false;
        // this.pricing_expand = false;
        // this.user_expand = false;
        // this.reports_expand = false;

        // if (config_has_menu == true) {
        //   this.system_expand = true;
        //   this.config_expand = true;
        // } else if (finance_has_menu == true) {
        //   this.system_expand = true;
        //   this.finance_expand = true;
        // } else if (retail_has_menu == true) {
        //   this.system_expand = true;
        //   this.retails_expand = true;
        // } else if (product_has_menu == true) {
        //   this.system_expand = true;
        //   this.products_expand = true;
        // } else if (products_has_menu == true) {
        //   this.product_expand = true;
        // } else if (business_has_menu == true) {
        //   this.business_expand = true;
        // } else if (partner_has_menu == true) {
        //   this.partners_expand = true;
        // } else if (pricing_has_menu == true) {
        //   this.pricing_expand = true;
        // } else if (user_has_menu == true) {
        //   this.user_expand = true;
        // } else if (reports_has_menu == true) {
        //   this.reports_expand = true;
        // }

        // document.body.classList.add('sidebar-collapse');
        // if (this.system_expand == true || this.product_expand == true || this.business_expand == true
        //   || this.partners_expand == true || pricing_has_menu == true || this.user_expand == true
        //   || this.reports_expand == true) {
        //   document.body.classList.remove('sidebar-collapse');
        // }
      }
    }

    // this.system_expand = true;
    // this.product_expand = false;
    // this.business_expand = false;
    // this.partners_expand = false;
    // this.pricing_expand = false;
    // this.user_expand = false;
    // this.reports_expand = false

    // this.products_expand = true;
    // this.config_expand = false;
    // this.finance_expand = false;
    // this.retails_expand = false;
  }
}

