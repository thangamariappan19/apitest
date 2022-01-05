import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { MSalesReturnHeader } from 'src/app/models/m-sales-return-header';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MInvoiceHeader } from 'src/app/models/m-invoice-header';
import { MInvoiceDetail } from 'src/app/models/m-invoice-detail';
import { MSalesReturnDetail } from 'src/app/models/m-sales-return-detail';
import { MPaymentDetails } from 'src/app/models/m-payment-details';
import { MOnAccountInvoiceWisePayment } from 'src/app/models/m-on-account-invoice-wise-payment';
import { MOnAccountPayment } from 'src/app/models/m-on-account-payment';
import { MOnAccountPaymentDetails } from 'src/app/models/m-on-account-payment-details';
import { MDayClosing } from 'src/app/models/m-day-closing';
import { MManagerOverride } from 'src/app/models/m-manager-override';
import { MRetailSettings } from 'src/app/models/m-retail-settings';
import { ManagerLoginComponent } from 'src/app/manager-login/manager-login.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { AppConstants } from 'src/app/app-constants';


@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {

  myForm: FormGroup;
  manager_OverRide_Settings: Array<MManagerOverride>;
  manger_detail: MUserDetails;
  manager_OverRide: MManagerOverride = null;
  retail_settings: MRetailSettings = null;
  user_details: MUserDetails = null;
  sales_return_header: MSalesReturnHeader;
  sales_return_details: Array<MSalesReturnDetail>;
  manager_username: string;
  manager_password: string;
  logedpos_details: MDayClosing = null;

  invoice_header: MInvoiceHeader = null;
  invoice_details: Array<MInvoiceDetail> = null;
  current_item: MInvoiceDetail = null;
  paymentList: Array<MPaymentDetails> = null;

  on_account_invoice_payment: MOnAccountInvoiceWisePayment = null;

  isInvoiceSearched: boolean = false;
  isSkuSearched: boolean = false;

  currency_code: string = "";
  decimal_places: number = 0;
  taxPercentage: number = 0;
  sub_total: number = 0;

  temp_image: string = "assets/img/preview-image.png";
  current_image: string = "assets/img/preview-image.png";

  searchSaleReturnCtrl = new FormControl();
  filteredSalesReturn: any;
  errorMsg: string;
  isLoading = false;

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    public dialog: MatDialog,
    private http: HttpClient) {

    localStorage.setItem('pos_mode', 'true');
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }

    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }

    let temp_pos: string = localStorage.getItem('pos_details');
    if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);
    }
    if (this.logedpos_details == null) {
      common.showMessage("warn", "Day-In / Shift-In Required");
      localStorage.setItem('pos_mode', 'true');
      // this.router.navigate(['home']);
      this.router.navigate(['day-in-out']);
    }

    let temp_manageroverride: string = localStorage.getItem('manager_OverRide_Settings');
    if (temp_manageroverride != null) {
      this.manager_OverRide = JSON.parse(temp_manageroverride);
    }
    let temp_Retail: string = localStorage.getItem('retail_settings');
    if (temp_Retail != null) {
      this.retail_settings = JSON.parse(temp_Retail);
    }

    this.decimal_places = this.user_details != null && this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;
    this.taxPercentage = parseFloat(this.user_details.taxPercentage.toString());
    this.currency_code = this.user_details.currencySymbol;

    this.createForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      invoice_no: [''],
      discount_value: [0],
      current_discount_type: ['Percentage']
    });

    this.clear_controls();
    this.getManagerOverRideList();
  }

  clear_controls() {
    this.isInvoiceSearched = false;
    this.isSkuSearched = false;
    this.sales_return_header = new MSalesReturnHeader();
    this.sales_return_header = {
      countryID: this.user_details.countryID,
      countryCode: this.user_details.countryCode,
      countryName: this.user_details.countryName,
      storeID: this.user_details.storeID,
      storeCode: this.user_details.storeCode,
      storeName: this.user_details.storeName,

      cashierID: this.user_details.id,

      shiftID: this.logedpos_details.shiftID, // 8, 
      posCode: this.logedpos_details.posCode, // 'NUSQPS01', 
      posid: this.logedpos_details.posid, // 2, 
      posName: "", // [DEVELOPMENT PENDING]

      totalReturnQty: 0, // Calc
      totalReturnAmount: 0, // Calc
      paymentMode: 'CASH', // Default

      invoiceHeaderID: null, // based on search
      salesInvoiceNumber: null, // based on search
      salesDate: null, // based on search 

      taxID: this.user_details.taxID,
      totalTaxAmount: 0, // Calc

      returnWithOutInvoiceNo: false, // based on search mode
      creditSales: false, // based on invoice payment

      returnMode: '', // Calc [SalesInvoice, ExchangeInvoice, WithOutInvoice]
      runningNo: 0,
      detailID: 0, // [NOT IMPLEMENTED]
      active: true
    };

    this.sales_return_details = null;
    this.invoice_header = null;
    this.invoice_details = null;
    this.current_item = null;
    this.current_image = this.temp_image;

    this.get_invoice_no();
  }

  get_invoice_no() {
    this.sales_return_header.documentDate = new Date(this.logedpos_details.businessDate);
    this.sales_return_header.applicationDate = new Date(this.logedpos_details.businessDate);
    // this.sales_return_header.documentDate_str = this.sales_return_header.documentDate.toISOString().substring(0,10);
    // this.sales_return_header.applicationDate_str = this.sales_return_header.applicationDate.toISOString().substring(0,10);
    // Document Number Search
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.user_details.storeID.toString()
      + "&DocumentTypeID=67&business_date=" + this.common.toYMDFormat(this.sales_return_header.documentDate))
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.sales_return_header.documentNo = data.documentNo != null ? data.documentNo : "";
          if (this.sales_return_header.documentNo == null || this.sales_return_header.documentNo == "") {
            this.common.showMessage('warn', 'Document Numbering Not Found.');
          }
        } else {
          this.common.showMessage('warn', 'Failed to get Document Number.');
          this.sales_return_header.documentNo = '';
        }
        this.common.hideSpinner();
      });
  }

  getManagerOverRideList() {
    return new Promise((resolve, reject) => {
      this.manager_OverRide_Settings = null;
      this.api.getAPI("ManagerOverride")
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.manager_OverRide_Settings = data.responseDynamicData;
            resolve(true);
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

  ngOnInit() {
    let inv_str: string = localStorage.getItem('return_Invoicedetails');
    if (inv_str != null && inv_str!="null") {
      this.invoice_details = JSON.parse(inv_str);
      for(let item of this.invoice_details)
      {
       item.isReturned=false; 
      this.return_checked_changed(item);
      }
    }
    this.searchSaleReturnCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredSalesReturn = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(AppConstants.base_url + "api/SearchEngine?SalesReturnSearchString=" + this.searchSaleReturnCtrl.value + "&StoreID=" + this.user_details.storeID + "&SaleReturn=" + 0)
          .pipe(
            startWith(''),
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        if (data.searchEngineDataList == null) {
          // this.errorMsg = data['Error'];
          this.filteredSalesReturn = [];
        } else {
          this.errorMsg = "";
          var items = data.searchEngineDataList,
            map = new Map,
            result;
          items.forEach(({ type, name, number, code, date }) => {
            map.has(type) || map.set(type, { type, values: [] });
            map.get(type).values.push({ name, number, code, date });
          });
          result = [...map.values()];
          this.filteredSalesReturn = result;


        }
      });
  }



  goto_pos() {
    if (this.invoice_details != null) {
      if (confirm("Are you sure want to Close the Return?")) {
        localStorage.setItem('pos_mode', 'true');
        localStorage.setItem('return_Invoicedetails', null);
        this.router.navigate(['pos']);
      }
    }
    else {
      localStorage.setItem('pos_mode', 'true');
      this.router.navigate(['pos']);
    }
  }





  invoice_no_changed() {
    debugger;
    // let invoice_no = this.myForm.get('invoice_no').value;
    let invoice_no = this.searchSaleReturnCtrl.value;
    let no_data: boolean = false;

    if (invoice_no != null && invoice_no != "") {
      if (this.isSkuSearched == false) {
        this.invoice_header = null;
        this.invoice_details = null;
      }
      this.invoice_header = null;
      this.common.showSpinner();
      this.api.getAPI("SalesReturn?InvoiceNo=" + invoice_no.trim()
        + "&StoreID=" + this.user_details.storeID.toString()
        + "&ForceSKUSearch=" + this.isSkuSearched)

        .subscribe((data) => {
          // this.common.hideSpinner();
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // here need to map invoice_header and invoice_details
            if (data.invoiceHeaderDetailsList != null) {
              // .log(data);
              this.invoice_header = new MInvoiceHeader();
              this.paymentList = new Array<MPaymentDetails>();
              this.invoice_header = data.invoiceHeaderDetailsList;
              this.paymentList = data.paymentList;
              // console.log(this.paymentList);
              if (this.isSkuSearched == true) {
                if (this.invoice_details == null) {
                  this.invoice_details = new Array<MInvoiceDetail>();
                }
                if (this.invoice_header.invoiceDetailList != null && this.invoice_header.invoiceDetailList.length > 0) {
                  for (let detail of this.invoice_header.invoiceDetailList) {
                    this.invoice_details.push(detail);
                  }
                }
                else {
                  no_data = true;
                  this.common.showMessage('warn', 'No Data found!');
                }
              } else {
                this.invoice_details = new Array<MInvoiceDetail>();
                if (this.invoice_header.invoiceDetailList != null && this.invoice_header.invoiceDetailList.length > 0) {
                  this.invoice_details = this.invoice_header.invoiceDetailList;
                } else {
                  no_data = true;
                  this.common.showMessage('warn', 'No Data found!');
                }

              }

              // returnMode: '', // Calc [SalesInvoice, ExchangeInvoice, WithOutInvoice]
              this.sales_return_header.returnMode = this.invoice_header.mode.toLowerCase() == "invoice" ? "SalesInvoice"
                : this.invoice_header.mode.toLowerCase() == "exchange" ? "ExchangeInvoice"
                  : this.invoice_header.mode.toLowerCase() == "exchangewithoutinvoice" ? "ExchangeInvoice"
                    : this.invoice_header.mode.toLowerCase() == "withoutinvoice" ? "WithOutInvoice"
                      : "";
              this.sales_return_header.invoiceHeaderID = this.invoice_header.id;
              this.sales_return_header.salesInvoiceNumber = this.invoice_header.invoiceNo;
              this.sales_return_header.salesDate = this.invoice_header.documentDate;
              // this.sales_return_header.salesDate_str = this.invoice_header.businessDate != null ? this.invoice_header.businessDate.toISOString().substring(0,10) : "";

              this.sales_return_header.creditSales = this.invoice_header.isCreditSale == null ? false : this.invoice_header.isCreditSale;

              this.isSkuSearched = false;
              this.sales_return_header.returnWithOutInvoiceNo = false;
              if (this.invoice_header.mode.toLowerCase() == "exchangewithoutinvoice") {
                this.sales_return_header.returnWithOutInvoiceNo = true;
              } else if (this.invoice_header.mode.toLowerCase() == "withoutinvoice") {
                this.sales_return_header.returnWithOutInvoiceNo = true;
                if (no_data == false) {
                  this.isSkuSearched = true;
                  this.sales_return_header.creditSales = false;
                }

              }


              this.sales_return_header.detailID = null; // [DOUBT]

              if (this.invoice_details != null && this.invoice_details.length > 0) {
                for (let item of this.invoice_details) {
                  item.skuImage = item.skuImage == null || item.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + item.skuImage;
                  //this.current_image=item[0].skuImage;
                }
              }
              //this.current_image = this.temp_image;
              this.assign_current_item(false, null);
              // this.current_image = this.invoice_details[0].skuImage;
              // this.myForm.controls['invoice_no'].setValue('');
              if (this.invoice_details.length != 0) {
                this.current_image = this.invoice_details[0].skuImage;
              }
              this.searchSaleReturnCtrl.setValue('');

              if (this.sales_return_header.creditSales == true) {
                this.get_on_account_info();
              }
            }
          } else {
            this.isInvoiceSearched = false;
            this.isSkuSearched = false;
            this.common.showMessage('warn', 'No Data found!');
          }
          this.common.hideSpinner();
        });

    }
    else {
      this.common.showMessage('warn', "Search Text is Empty");
    }
  }


  get_on_account_info() {
    this.on_account_invoice_payment = null;
    let mode: string = this.sales_return_header.returnMode == 'SalesInvoice' ? 'Invoice' : 'Exchange';
    if (this.invoice_header != null) {
      this.common.showSpinner();
      this.api.getAPI("OnAccount?Mode=" + mode + "&SearchString=" + this.invoice_header.invoiceNo)
        .subscribe((data) => {
          this.common.hideSpinner();
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.on_account_invoice_payment = new MOnAccountInvoiceWisePayment();
            if (data.onAccountPaymentDetails != null) {
              this.on_account_invoice_payment = data.onAccountPaymentDetails;
            }
          }
        });
    }
  }

  // invoice_no_changed() {
  //   
  //   let invoice_no = this.myForm.get('invoice_no').value;

  //   if (invoice_no != null && invoice_no != "") {
  //     if (this.isSkuSearched) {
  //       this.common.showSpinner();
  //       this.api.getAPI("Invoice?SKUCode=" + invoice_no)
  //         .subscribe((data) => {
  //           setTimeout(() => {
  //             this.common.hideSpinner();
  //             if (data != null && data.statusCode != null && data.statusCode == 1) {
  //               this.sales_return_header.returnWithOutInvoiceNo = true;
  //               // here need to map response to invoice_details
  //               this.sales_return_header.returnMode = "WithOutInvoice";
  //               this.sales_return_header.invoiceHeaderID = null;
  //               this.sales_return_header.salesInvoiceNumber = null;
  //               this.sales_return_header.salesDate = null;
  //               this.sales_return_header.salesDate_str = null;
  //               this.sales_return_header.returnWithOutInvoiceNo = false;
  //               this.sales_return_header.creditSales = false;
  //               this.sales_return_header.detailID = null;
  //               this.isInvoiceSearched = false;
  //               this.isSkuSearched = true;

  //               this.myForm.controls['invoice_no'].setValue('');
  //             } else {
  //               this.common.showMessage('warn', 'No Data found!');
  //             }
  //           }, this.common.time_out_delay);
  //         });
  //     } else {
  //       this.invoice_header = null;
  //       this.common.showSpinner();
  //       this.api.getAPI("SalesReturn?InvoiceNo=" + invoice_no + "&StoreID=" + this.user_details.storeID.toString())
  //         .subscribe((data) => {
  //           if (data != null && data.statusCode != null && data.statusCode == 1) {
  //             setTimeout(() => {
  //               this.common.hideSpinner();
  //               // here need to map invoice_header and invoice_details
  //               if (data.invoiceHeaderDetailsList != null) {

  //                 this.invoice_header = new MInvoiceHeader();
  //                 this.invoice_header = data.invoiceHeaderDetailsList;
  //                 this.invoice_details = new Array<MInvoiceDetail>();
  //                 this.invoice_details = this.invoice_header.invoiceDetailList;
  //                 this.isInvoiceSearched = true;
  //                 this.isSkuSearched = false;

  //                 // returnMode: '', // Calc [SalesInvoice, ExchangeInvoice, WithOutInvoice]
  //                 this.sales_return_header.returnMode = this.invoice_header.mode.toLowerCase() == "invoice" ? "SalesInvoice" 
  //                   : this.invoice_header.mode.toLowerCase() == "exchange" ? "ExchangeInvoice" 
  //                   : this.invoice_header.mode.toLowerCase() == "exchangewithoutinvoice" ? "ExchangeInvoice" 
  //                   : "";
  //                 this.sales_return_header.invoiceHeaderID = this.invoice_header.id;
  //                 this.sales_return_header.salesInvoiceNumber = this.invoice_header.invoiceNo;
  //                 this.sales_return_header.salesDate = this.invoice_header.documentDate;
  //                 // this.sales_return_header.salesDate_str = this.invoice_header.businessDate != null ? this.invoice_header.businessDate.toISOString().substring(0,10) : "";

  //                 this.sales_return_header.returnWithOutInvoiceNo = false;
  //                 if(this.invoice_header.mode.toLowerCase() == "exchangewithoutinvoice"){
  //                   this.sales_return_header.returnWithOutInvoiceNo = true;
  //                 }

  //                 this.sales_return_header.creditSales = this.invoice_header.isCreditSale;
  //                 this.sales_return_header.detailID = null; // [DOUBT]

  //                 if (this.invoice_details != null && this.invoice_details.length > 0) {
  //                   for (let item of this.invoice_details) {
  //                     item.skuImage = item.skuImage == null || item.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + item.skuImage;
  //                   }
  //                 }

  //                // .log(this.invoice_details);
  //                 this.assign_current_item(true, null);

  //                 this.myForm.controls['invoice_no'].setValue('');

  //               }

  //             }, this.common.time_out_delay);

  //           } else {
  //             this.common.showSpinner();
  //             this.api.getAPI("Invoice?SKUCode=" + invoice_no)
  //               .subscribe((data) => {
  //                 setTimeout(() => {
  //                   this.common.hideSpinner();
  //                   if (data != null && data.statusCode != null && data.statusCode == 1) {
  //                     // here need to map response to invoice_details
  //                     this.sales_return_header.returnWithOutInvoiceNo = true;
  //                     this.sales_return_header.returnMode = "WithOutInvoice";
  //                     this.sales_return_header.invoiceHeaderID = null;
  //                     this.sales_return_header.salesInvoiceNumber = null;
  //                     this.sales_return_header.salesDate = null;
  //                     this.sales_return_header.salesDate_str = null;
  //                     this.sales_return_header.returnWithOutInvoiceNo = false;
  //                     this.sales_return_header.creditSales = false;
  //                     this.isInvoiceSearched = false;
  //                     this.isSkuSearched = true;

  //                     this.myForm.controls['invoice_no'].setValue('');
  //                   } else {
  //                     this.isInvoiceSearched = false;
  //                     this.isSkuSearched = false;
  //                     this.common.showMessage('warn', 'No Data found!');
  //                   }
  //                 }, this.common.time_out_delay);
  //               });
  //           }
  //         });
  //     }
  //   }
  // }

  assign_current_item(isLastItem: boolean, item: MInvoiceDetail) {
    this.current_item = null;
    this.current_image = this.temp_image;
    if (this.invoice_details != null && this.invoice_details.length > 0) {
      if (isLastItem) {
        this.current_item = this.invoice_details[this.invoice_details.length - 1];
      } else {
        if (item != null) {
          this.current_item = item;
        }
      }
    }
    if (this.current_item != null && this.current_item.skuImage != null) {
      this.current_image = this.current_item.skuImage;
    }
  }

  return_checked_changed(item: MInvoiceDetail) {
    if (item.isReturned == false) {
      item.isReturned = true;
      let gift = false;
      let ret = this.invoice_details.filter(x => x.isGift == true);
      if (ret != null && ret.length > 0) {
        gift = true;
      }
      if (item.oldReturnQty != null && item.oldReturnQty > 0) {
        item.isReturned = false;
        this.common.showMessage("info", "This Item Returned already.")
      } else {
        if (item.promoGroupID > 0) {
          if (this.invoice_details != null && this.invoice_details.length > 0) {
            for (let i of this.invoice_details) {
              if (i.promoGroupID == item.promoGroupID) {
                i.isReturned = true;
              }
            }
          }
        }
        else if (item.isHeader == true || item.isCombo == true) {
          if (this.invoice_details != null && this.invoice_details.length > 0) {
            for (let i of this.invoice_details) {
              if (i.comboGroupID == item.comboGroupID) {
                i.isReturned = true;
              }
            }
          }
        }
        else if (gift == true) {
          if (this.invoice_details != null && this.invoice_details.length > 0) {
            for (let i of this.invoice_details) {
              i.isReturned = true;
            }
          }
        }
        this.assign_current_item(false, item);
      }

    } else {
      item.isReturned = false;
      let gift = false;
      let ret = this.invoice_details.filter(x => x.isGift == true);
      if (ret != null && ret.length > 0) {
        gift = true;
      }
      if (item.promoGroupID > 0) {
        if (this.invoice_details != null && this.invoice_details.length > 0) {
          for (let i of this.invoice_details) {
            if (i.promoGroupID == item.promoGroupID) {
              i.isReturned = false;
            }
          }
        }
      }
      else if (item.isHeader == true || item.isCombo == true) {
        if (this.invoice_details != null && this.invoice_details.length > 0) {
          for (let i of this.invoice_details) {
            if (i.comboGroupID == item.comboGroupID) {
              i.isReturned = false;
            }
          }
        }
      }
      else if (gift == true) {
        if (this.invoice_details != null && this.invoice_details.length > 0) {
          for (let i of this.invoice_details) {
            i.isReturned = false;
          }
        }
      }
      this.assign_current_item(true, item);
    }

    this.calculate();

  }

  calculate() {
    this.sales_return_header.onAccountPaymentRecord = null;

    let atLeastOneItem: boolean = false;
    this.sales_return_details = new Array<MSalesReturnDetail>();
    this.sub_total = 0;
    let idx: number = 0;

    this.sales_return_header.totalReturnQty = 0;
    this.sales_return_header.totalReturnAmount = 0;
    this.sales_return_header.totalTaxAmount = 0;


    if (this.invoice_details != null && this.invoice_details.length > 0) {

      for (let item of this.invoice_details) {
        if (item.isReturned == true && (item.oldReturnQty == null || item.oldReturnQty <= 0)) {
          atLeastOneItem = true;
          this.sub_total += item.price;
          this.sales_return_header.totalReturnQty += 1;
          if (item.isGift == false) {
            this.sales_return_header.totalReturnAmount += item.lineTotal;
            this.sales_return_header.totalTaxAmount += item.taxAmount;
          }
          let return_det: MSalesReturnDetail = new MSalesReturnDetail();
          return_det = {
            storeID: this.user_details.storeID,
            storeCode: this.user_details.storeCode,
            posid: this.logedpos_details.posid, // 2, 
            posCode: this.logedpos_details.posCode, // 'NUSQPS01',
            cashierID: this.user_details.id,
            countryID: this.user_details.countryID,
            countryCode: this.user_details.countryCode,
            fromCountryID: item.countryID,
            fromStoreID: item.storeID,
            serialNo: idx + 1,
            tag_Id: item.tag_Id,
            skuid: item.skuid,
            skuCode: item.exchangedSKU != null && item.exchangedSKU != "" ? item.exchangedSKU : item.skuCode,
            styleCode: item.styleCode,
            itemCode: item.exchangedSKU != null && item.exchangedSKU != "" ? item.exchangedSKU : item.skuCode,
            taxID: this.user_details.taxID,
            taxAmount: item.taxAmount,
            soldQty: item.qty,
            returnQty: 1,
            returnAmount: item.lineTotal,
            invoiceDetailID: item.invoiceDetailID,
            active: true
          };
          this.sales_return_details.push(return_det);
          idx += 1;
        }

      }
    }

    if (atLeastOneItem) {
      if (this.paymentList != null && this.paymentList.length > 0 && this.paymentList[0].mode == 'On-Account' && this.paymentList[0].receivedamount != this.paymentList[0].onAccountReceiveAmount) {
        this.sales_return_header.creditSales = true;
      }
      else {
        this.sales_return_header.creditSales = false;
      }
      //if (this.sales_return_header.creditSales == true && this.on_account_invoice_payment != null) {
      if (this.sales_return_header.creditSales == true && this.paymentList != null) {
        //let billAmount: number = this.on_account_invoice_payment.billAmount != null ? this.on_account_invoice_payment.billAmount : 0;
        //let paidAmount: number = this.on_account_invoice_payment.totalPaid != null ? this.on_account_invoice_payment.totalPaid : 0;
        //let returnAmount: number = this.sales_return_header.totalReturnAmount != null ? this.sales_return_header.totalReturnAmount : 0;
        //let toPay: number = billAmount - (paidAmount + returnAmount);
        let billAmount: number = this.paymentList[0].receivedamount != null ? this.paymentList[0].receivedamount : 0;
        let paidAmount: number = this.paymentList[0].onAccountReceiveAmount != null ? this.paymentList[0].onAccountReceiveAmount : 0;
        let returnAmount: number = this.sales_return_header.totalReturnAmount != null ? this.sales_return_header.totalReturnAmount : 0;
        let toPay: number = billAmount - (paidAmount + returnAmount);

        this.sales_return_header.onAccountPaymentRecord = new MOnAccountPayment();
        let onAccountPaymentRecord: MOnAccountPayment = new MOnAccountPayment();
        onAccountPaymentRecord = {
          billingAmount: billAmount,
          customerCode: this.invoice_header != null && this.invoice_header.customerCode != null ? this.invoice_header.customerCode : '',
          paymentDate: this.sales_return_header.documentDate,
          receivedAmount: returnAmount,
          remarks: 'Payment received through Sales Return',
          returnAmount: 0,
          storeCode: this.sales_return_header.storeCode,
          storeID: this.sales_return_header.storeID,
          onAccountPaymentDetailsList: new Array<MOnAccountPaymentDetails>(),
          onAcInvoiceWisePaymentList: new Array<MOnAccountInvoiceWisePayment>()
        };

        let onAccountPaymentDetails: MOnAccountPaymentDetails = new MOnAccountPaymentDetails();
        onAccountPaymentDetails = {
          approvalNumber: '',
          cardHolderName: '',
          cardNumber: '',
          cardType: 'CASH',
          changeCurrency: this.user_details != null && this.user_details.currencyCode != null ? this.user_details.currencyCode : '',
          paymentCurrency: this.user_details != null && this.user_details.currencyCode != null ? this.user_details.currencyCode : '',
          paymentType: 'CASH',
          receivedAmount: returnAmount,
          remarks: 'Payment received through Sales Return',
          storeCode: this.sales_return_header.storeCode,
          storeID: this.sales_return_header.storeID,
        };

        let onAcInvoiceWisePayment: MOnAccountInvoiceWisePayment = new MOnAccountInvoiceWisePayment();
        onAcInvoiceWisePayment = {
          billAmount: billAmount,
          businessDate: this.sales_return_header.documentDate,
          cardPaid: 0,
          cashPaid: returnAmount,
          closeBill: toPay == 0 ? true : false,
          customerCode: this.invoice_header != null && this.invoice_header.customerCode != null ? this.invoice_header.customerCode : '',
          discountAmount: 0,
          invoiceNo: this.sales_return_header.salesInvoiceNumber,
          isSelect: true,
          paidAmount: returnAmount,
          pendingAmount: toPay > 0 ? toPay : 0,
          purchaseStoreCode: this.invoice_header != null && this.invoice_header.storeCode != null ? this.invoice_header.storeCode : '',
          purchaseStoreID: this.invoice_header != null && this.invoice_header.storeID != null ? this.invoice_header.storeID : 0,
          remarks: 'Payment received through Sales Return',
          slNo: 1,
          storeCode: this.sales_return_header.storeCode,
          storeID: this.sales_return_header.storeID,
          totalPaid: toPay > 0 ? billAmount : billAmount - toPay,
        };

        onAccountPaymentRecord.onAccountPaymentDetailsList.push(onAccountPaymentDetails);
        onAccountPaymentRecord.onAcInvoiceWisePaymentList.push(onAcInvoiceWisePayment);

        this.sales_return_header.onAccountPaymentRecord = onAccountPaymentRecord;

        if (toPay < 0) {
          // here we need to return balance amount to the Customer
          this.sales_return_header.totalReturnAmount = Math.abs(toPay);
        } else {
          this.sales_return_header.totalReturnAmount = 0;
        }
      }
    }
  }

  checkPromoGroup() {
    let isValid: boolean = true;

    return isValid;
  }


  goto_payment() {
    //if (this.manager_OverRide.transactionRefund == true) {
    //if (this.sales_return_header.returnMode == 'Exchange' && this.retail_settings.allowRefundToExchangedItems == true) {

    // let promoValid = this.checkPromoGroup();
    if (this.sales_return_header.documentNo == null || this.sales_return_header.documentNo == "") {
      this.common.showMessage('warn', 'Document Numbering Not Found.');
    }
    else if (this.sales_return_header.totalReturnQty <= 0) {
      this.common.showMessage("warn", "Atleast one Return Item expected.");
    } else if (this.sales_return_header.totalReturnAmount == null || this.sales_return_header.totalReturnAmount < 0) {
      this.common.showMessage("warn", "Return Amount must be non-negative.");
    } else if (this.sales_return_header.shiftID == null || this.sales_return_header.shiftID == 0) {
      this.common.showMessage("warn", "Shift ID must be required.");
    } else {
      this.sales_return_header.salesReturnDetailList = new Array<MSalesReturnDetail>();
      this.sales_return_header.salesReturnDetailList = this.sales_return_details;
      if (this.sales_return_header.totalReturnAmount <= 0) {
        let payment_detail: MPaymentDetails = new MPaymentDetails();
        payment_detail = {
          slNo: 1,
          businessDate: this.sales_return_header.documentDate,
          fromCountryID: this.user_details.countryID,
          fromStoreID: this.user_details.storeID,
          mode: 'Cash',
          payCurrencyID: this.user_details.currencyID,
          payCurrency: this.user_details.currencyCode,
          changeCurrency: this.user_details.currencyCode,
          changeCurrencyID: this.user_details.currencyID,
          baseAmount: this.sales_return_header.totalReturnAmount,
          receivedamount: this.sales_return_header.totalReturnAmount,
          returnAmount: 0,
          balanceAmountToBePay: 0,
        };
        this.sales_return_header.salesReturnPaymentdetails = new Array<MPaymentDetails>();
        this.sales_return_header.salesReturnPaymentdetails.push(payment_detail);
        this.common.showSpinner();
        this.api.postAPI("SalesReturn", this.sales_return_header).subscribe((data) => {

          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            this.common.showMessage('success', 'Sales Return saved successfully.');
            this.clear_controls();
          } else {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }
        });

      } else {
        localStorage.setItem('payment_return', JSON.stringify(this.sales_return_header));
        localStorage.setItem('return_Invoicedetails', JSON.stringify(this.invoice_details));
        this.router.navigate(['returnPayment']);
      }

    }
    /*}
    else {
      this.common.showMessage('info', 'You Dont have Permission to Return Exchanged Items.');
    }
    /*}
    else {
      this.common.showMessage('info', 'You Dont have Permission to Return Items.');
    }*/

  }


  openDialog(): void {
    if (this.sales_return_header.documentNo == null || this.sales_return_header.documentNo == "") {
      this.common.showMessage('warn', 'Document Numbering Not Found.');
    }
    else if (this.sales_return_header.totalReturnQty <= 0) {
      this.common.showMessage("warn", "Atleast one Return Item expected.");
    }
    else if (this.manager_OverRide.transactionRefund == false) {

      const dialogRef = this.dialog.open(ManagerLoginComponent, {
        width: '250px',
        data: { username: this.manager_username, password: this.manager_password }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.manger_detail = new MUserDetails();
        if (result != null && result != undefined) {
          // here you can check the password.
          // And do neccessary things
          //console.log(result[0].username);

          let un = result.username;
          let pwd = result.password;
          let ePwd = this.common.encrypt(pwd);
          let uri_un = encodeURIComponent(un);
          let uri_pwd = encodeURIComponent(ePwd);

          this.api.getAPI("user?UserName=" + uri_un + "&Password=" + uri_pwd + "&StoreID=" + this.user_details.storeID + "&StoreCode=" + this.user_details.storeCode)
            .subscribe((data) => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                this.manger_detail = data.usersRecord;

                let mgr_settings = this.manager_OverRide_Settings.filter(x => x.id == this.manger_detail.managerOverrideID);

                let return_per: boolean = false;
                if (mgr_settings.length > 0) {
                  return_per = mgr_settings[0].transactionRefund == null ||
                    mgr_settings[0].transactionRefund == undefined ? false : mgr_settings[0].transactionRefund;
                }

                //this.manager_OverRide_Settings = this.manager_OverRide_Settings.filter(x => x.id == this.manger_detail.managerOverrideID);
                if (return_per == true) {
                  this.goto_payment();
                }
                else {
                  this.common.showMessage('info', 'You Dont have Permission to Return Item.');
                }
              }
            });
        }
      });
    }
    else {
      this.goto_payment();
    }
  }
}
