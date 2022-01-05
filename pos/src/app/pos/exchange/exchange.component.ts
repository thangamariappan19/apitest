import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MInvoiceHeader } from 'src/app/models/m-invoice-header';
import { MInvoiceDetail } from 'src/app/models/m-invoice-detail';
import { MSalesExchangeHeader } from 'src/app/models/m-sales-exchange-header';
import { MSalesExchangeDetails } from 'src/app/models/m-sales-exchange-details';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MDayClosing } from 'src/app/models/m-day-closing';
import { QzTrayService } from 'src/app/qz-tray-service';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { AppConstants } from 'src/app/app-constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {

  printerName: any;

  myForm: FormGroup;

  sales_exchange_header: MSalesExchangeHeader = null;
  exchange_details_list: Array<MSalesExchangeDetails> = null;
  return_details_list: Array<MSalesExchangeDetails> = null;

  user_details: MUserDetails = null;
  invoice_header: MInvoiceHeader = null;
  invoice_details: Array<MInvoiceDetail> = null;
  current_item: MInvoiceDetail = null;

  logedpos_details: MDayClosing = null;

  isSkuSearched: boolean = false;

  currency_code: string = "";
  decimal_places: number = 0;
  taxPercentage: number = 0;
  sub_total: number = 0;

  temp_image: string = "assets/img/preview-image.png";
  current_image: string = "assets/img/preview-image.png";

  sal_excg_details: any;
  ExchangeDetailsList: Array<any>;
  store_details: Array<any> = null;
  return_exchange_details_List: Array<any> = null;
  sales_exchange_details_List: Array<any> = null;
  business_date: any;
  storeFooter: any;
  storeHeader: any;
  cashier: any;
  posName: any;
  taxCode: any;
  storeImage;
  //temp_image: string = "assets/img/preview-image.png";
  customerName: any;
  documentNo: any;
  shopName: any;
  invoiceNo: any;
  salesinvoiceNo: any;
  date: any;
  time: any;
  footer: any;
  totalQty: any = 0;
  exchangereceiptHTML: any;
  exchangereceiptdetails: any = '';

  searchExchangeCtrl = new FormControl();
  filteredExchange: any;
  searchExchangeCtrl1 = new FormControl();
  filteredExchange2: any;
  errorMsg: string;
  isLoading = false;
  barcode;

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private printService: QzTrayService,
    private http: HttpClient) {

    this.ExchangeDetailsList = new Array<any>();

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
      this.printerName = this.logedpos_details.printerDeviceName;
      //this.printerName = "EPSON TM-T88IV Receipt"; 

    }
    if (this.logedpos_details == null) {
      common.showMessage("warn", "Day-In / Shift-In Required");
      localStorage.setItem('pos_mode', 'true');
      // this.router.navigate(['home']);
      this.router.navigate(['day-in-out']);
    }

    this.decimal_places = this.user_details != null && this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;
    this.taxPercentage = parseFloat(this.user_details.taxPercentage.toString());
    this.currency_code = this.user_details.currencySymbol;

    this.createForm();
  }

  ngOnInit() {
    // localStorage.setItem('pos_mode', 'true');
    this.searchExchangeCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredExchange = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(AppConstants.base_url + "api/SearchEngine?ExchangeSearchString=" + this.searchExchangeCtrl.value + "&StoreID=" + this.user_details.storeID + "&Exchange=exchange")
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
          this.filteredExchange = [];
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
          this.filteredExchange = result;


        }


      });
    this.searchExchangeCtrl1.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredExchange2 = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(AppConstants.base_url + "api/SearchEngine?ExchangeSearchString=" + this.searchExchangeCtrl1.value + "&StoreID=" + this.user_details.storeID + "&Exchange=sku")
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
          this.filteredExchange2 = [];
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
          this.filteredExchange2 = result;


        }


      });
  }

  createForm() {
    this.myForm = this.fb.group({
      invoice_no: [''],
      sku_code: ['']
    });

    this.clear_controls();
  }
  goto_pos() {
    if (this.invoice_details != null) {
      if (confirm("Are you sure want to Close the Exchange?")) {
        localStorage.setItem('pos_mode', 'true');
        this.router.navigate(['pos']);
      }
    }
    else {
      localStorage.setItem('pos_mode', 'true');
      this.router.navigate(['pos']);
    }
  }
  /*goto_pos() {
    localStorage.setItem('pos_mode', 'true');
    this.router.navigate(['pos']);
  }*/

  clear_controls() {
    this.myForm.controls['invoice_no'].setValue('');
    this.myForm.controls['sku_code'].setValue('');

    this.isSkuSearched = false;
    this.sales_exchange_header = new MSalesExchangeHeader();
    this.sales_exchange_header = {
      countryID: this.user_details.countryID,
      countryCode: this.user_details.countryCode,
      countryName: this.user_details.countryName,
      storeID: this.user_details.storeID,
      storeCode: this.user_details.storeCode,
      storeName: this.user_details.storeName,
      posCode: this.logedpos_details.posCode, // 'NUSQPS01', 
      posid: this.logedpos_details.posid, // 2,
      posName: "", // [DEVELOPMENT PENDING]
      cashierID: this.user_details.id,

      totalExchangeQty: 0, // Calc
      exchangeWithOutInvoiceNo: false, // Calc

      invoiceHeaderID: null, // based on search
      salesInvoiceNumber: null, // based on search
      salesDate: null, // based on search 
      creditSales: false, // based on invoice payment

      exchangeMode: '', // Calc [SalesInvoice, ExchangeInvoice, WithOutInvoice]
      runningNo: 0,
      detailID: 0, // [NOT IMPLEMENTED]
      active: true
    };

    this.exchange_details_list = null;
    this.return_details_list = null;

    this.invoice_header = null;
    this.invoice_details = null;
    this.current_item = null;
    this.current_image = this.temp_image;

    this.get_invoice_no();
  }

  get_invoice_no() {
    this.sales_exchange_header.documentDate = new Date(this.logedpos_details.businessDate);
    this.sales_exchange_header.applicationDate = new Date(this.logedpos_details.businessDate);
    // Document Number Search
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.user_details.storeID.toString()
      + "&DocumentTypeID=68&business_date=" + this.common.toYMDFormat(this.sales_exchange_header.documentDate))
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.sales_exchange_header.documentNo = data.documentNo != null ? data.documentNo : "";
            if (this.sales_exchange_header.documentNo == null || this.sales_exchange_header.documentNo == "") {
              this.common.showMessage('warn', 'Document Numbering Not Found.');
            }
          } else {
            this.common.showMessage('warn', 'Failed to get Document Number.');
            this.sales_exchange_header.documentNo = '';
          }

          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  invoice_no_changed() {
    // let invoice_no = this.myForm.get('invoice_no').value;
    let invoice_no = this.searchExchangeCtrl.value;
    let no_data: boolean = false;
    if (invoice_no != null && invoice_no != "") {
      if (this.isSkuSearched == false) {
        this.invoice_details = null;
      }
      this.invoice_header = null;
      this.common.showSpinner();
      this.api.getAPI("SalesExchange?InvoiceNo=" + invoice_no.trim()
        + "&StoreID=" + this.user_details.storeID.toString()
        + "&ForceSKUSearch=" + this.isSkuSearched)

        .subscribe((data) => {
          setTimeout(() => {
            this.common.hideSpinner();

            if (data != null && data.statusCode != null && data.statusCode == 1) {
              // here need to map invoice_header and invoice_details
              if (data.invoiceHeaderDetailsList != null) {

                this.invoice_header = new MInvoiceHeader();
                this.invoice_header = data.invoiceHeaderDetailsList;

                if (this.isSkuSearched == true) {
                  if (this.invoice_details == null) {
                    this.invoice_details = new Array<MInvoiceDetail>();
                  }

                  if (this.invoice_header.invoiceDetailList != null && this.invoice_header.invoiceDetailList.length > 0) {
                    for (let detail of this.invoice_header.invoiceDetailList) {
                      this.invoice_details.push(detail);
                    }
                  } else {
                    no_data = true;
                    this.common.showMessage('warn', 'No Data found!');
                  }
                } else {
                  this.invoice_details = new Array<MInvoiceDetail>();
                  if (this.invoice_header.invoiceDetailList != null && this.invoice_header.invoiceDetailList.length > 0) {
                    this.invoice_details = this.invoice_header.invoiceDetailList;
                    for (let detail of this.invoice_details) {
                      if (detail.isExchanged == true) {
                        detail.isAlreadyExchanges = true;
                      }
                      detail.isExchanged = false;
                    }
                  } else {
                    no_data = true;
                    this.common.showMessage('warn', 'No Data found!');
                  }

                }

                // returnMode: '', // Calc [SalesInvoice, ExchangeInvoice, WithOutInvoice]
                this.sales_exchange_header.exchangeMode = this.invoice_header.mode.toLowerCase() == "invoice" ? "SalesInvoice"
                  : this.invoice_header.mode.toLowerCase() == "exchange" ? "ExchangeInvoice"
                    : this.invoice_header.mode.toLowerCase() == "exchangewithoutinvoice" ? "ExchangeInvoice"
                      : this.invoice_header.mode.toLowerCase() == "withoutinvoice" ? "WithOutInvoice"
                        : "";
                this.sales_exchange_header.invoiceHeaderID = this.invoice_header.id;
                this.sales_exchange_header.salesInvoiceNumber = this.invoice_header.invoiceNo;
                this.sales_exchange_header.salesDate = this.invoice_header.documentDate;
                // this.sales_return_header.salesDate_str = this.invoice_header.businessDate != null ? this.invoice_header.businessDate.toISOString().substring(0,10) : "";

                this.sales_exchange_header.creditSales = this.invoice_header.isCreditSale == null ? false : this.invoice_header.isCreditSale;

                this.isSkuSearched = false;
                this.sales_exchange_header.exchangeWithOutInvoiceNo = false;
                if (this.invoice_header.mode.toLowerCase() == "exchangewithoutinvoice") {
                  this.sales_exchange_header.exchangeWithOutInvoiceNo = true;
                } else if (this.invoice_header.mode.toLowerCase() == "withoutinvoice") {
                  this.sales_exchange_header.exchangeWithOutInvoiceNo = true;
                  if (no_data == false) {
                    this.isSkuSearched = true;
                    this.sales_exchange_header.creditSales = false;
                  }

                }

                this.sales_exchange_header.detailID = null; // [DOUBT]

                // if (this.invoice_details != null && this.invoice_details.length > 0) {
                //   for (let item of this.invoice_details) {
                //     item.skuImage = item.skuImage == null || item.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + item.skuImage;
                //   }
                // }
                // .log(this.invoice_header);
                // .log(this.invoice_details);
                // .log(this.sales_exchange_header);
                // this.myForm.controls['invoice_no'].setValue('');
                this.searchExchangeCtrl.patchValue('');
              }
            } else {
              this.isSkuSearched = false;
              this.common.showMessage('warn', 'No Data found!');
            }
          }, this.common.time_out_delay);
        });
    }
    else {
      this.common.showMessage('warn', "Search Text is Empty");
    }
  }

  returnItem_checkedChanged(item: MInvoiceDetail) {
    if (item.isExchanged == false) {
      item.isExchanged = true;
      // if (item.oldExchangeQty != null && item.oldExchangeQty > 0) {
      //   item.isExchanged = false;
      //   this.common.showMessage("info", "This Item Exchanged already.")
      // }

    } else {
      item.isExchanged = false;
      // this.assign_current_item(true, item);
    }
    this.addToReturnDetailsList();
  }

  addToReturnDetailsList() {
    this.return_details_list = null;
    if (this.invoice_details != null) {
      this.return_details_list = new Array<MSalesExchangeDetails>();
      for (let item of this.invoice_details) {
        // if (item.isExchanged == true && (item.oldExchangeQty == null || item.oldExchangeQty == 0)) {
        if (item.isExchanged == true) {
          let return_item: MSalesExchangeDetails = new MSalesExchangeDetails();
          return_item = {
            active: true,
            countryCode: this.user_details.countryCode,
            countryID: this.user_details.countryID,
            exchangeQty: 1,
            exchangeSKU: item.exchangedSKU,
            invoiceSerialNo: item.serialNo,
            skuCode: item.exchangedSKU != null && item.exchangedSKU != '' ? item.exchangedSKU : item.skuCode,
            invoiceDetailID: item.invoiceDetailID,
            //tag_Id: item.tag_Id,
            tag_Id: null,
            styleCode: item.styleCode,
            sellingPricePerQty: item.price,
            taxID: item.taxID,
            taxAmount: item.taxAmount,
            enableCell: false
          };
          this.return_details_list.push(return_item);
        }
      }
    }
  }

  skuCode_changed() {
    let noReturnItem: boolean = false;
    noReturnItem = this.return_details_list == null || this.return_details_list.length <= 0 ? true : false;
    if (noReturnItem) {
      this.common.showMessage('warn', 'No Return Item given.');
    } else {
      // let sku_code = this.myForm.get('sku_code').value;
      let sku_code = this.searchExchangeCtrl1.value;
      if (sku_code != null && sku_code != "") {
        this.common.showSpinner();
        this.api.getAPI("Invoice?SKUCode=" + sku_code
          + "&storeid=" + this.user_details.storeID.toString())
          .subscribe((data) => {
            setTimeout(() => {
              this.common.hideSpinner();

              if (data != null && data.statusCode != null && data.statusCode == 1) {
                if (data.skuMasterTypesList != null) {
                  let skuMasterList: Array<MSkuMasterTypes> = new Array<MSkuMasterTypes>();
                  skuMasterList = data.skuMasterTypesList;
                  this.addToExchangeDetailsList(skuMasterList);
                  // this.myForm.controls['sku_code'].setValue('');
                  this.searchExchangeCtrl1.patchValue('');
                }
              } else {
                this.isSkuSearched = false;
                this.common.showMessage('warn', 'No Data found!');
              }
            }, this.common.time_out_delay);
          });
      }
    }

  }

  addToExchangeDetailsList(skuMasterList: Array<MSkuMasterTypes>) {
    let success: boolean = false;
    let itemAssigned: boolean = false;
    if (skuMasterList != null && skuMasterList.length > 0) {
      let skuItem: MSkuMasterTypes = new MSkuMasterTypes();
      skuItem = skuMasterList[0];
      if (skuItem != null) {
        let sameItemStock: number = 0;
        if (this.exchange_details_list != null && this.exchange_details_list.length > 0) {
          let temp: Array<MSalesExchangeDetails> = new Array<MSalesExchangeDetails>();
          temp = this.exchange_details_list.filter(x => x.skuCode == skuItem.skuCode);
          if (temp != null && temp.length > 0) {
            sameItemStock = temp.length;
          }
        }
        if (skuItem.stock != null && skuItem.stock - sameItemStock > 0) {
          if (this.return_details_list != null && this.return_details_list.length > 0) {
            for (let item of this.return_details_list) {
              if (item.enableCell == false && item.styleCode == skuItem.styleCode) {
                item.enableCell = true;
                itemAssigned = true;
                success = true;
                let exchangeItem: MSalesExchangeDetails = new MSalesExchangeDetails();
                exchangeItem = {
                  active: true,
                  countryID: this.user_details.countryID,
                  countryCode: this.user_details.countryCode,
                  posid: this.logedpos_details.posid, // 2, 
                  posCode: this.logedpos_details.posCode, // 'NUSQPS01',
                  storeID: this.user_details.storeID,
                  storeCode: this.user_details.storeCode,
                  enableCell: false,
                  invoiceDetailID: item.invoiceDetailID,
                  invoiceSerialNo: item.invoiceSerialNo,
                  skuid: skuItem.id,
                  skuCode: skuItem.skuCode,
                  styleCode: skuItem.styleCode,
                  qty: 1,
                  sellingPricePerQty: item.sellingPricePerQty,
                  taxID: item.taxID,
                  taxAmount: item.taxAmount,
                  //tag_Id: skuItem.tag_Id
                  tag_Id: null
                };
                if (this.exchange_details_list == null) {
                  this.exchange_details_list = new Array<MSalesExchangeDetails>();
                }
                this.exchange_details_list.push(exchangeItem);
                break;
              }
            }
            if (itemAssigned == false) {
              success = false;
              this.common.showMessage('warn', 'Exchange-item does not match with Return-item');
              //this.common.showMessage('warn', 'Exchange-item Style is different from Return-item Style');
            }
          } else {
            success = false;
            this.common.showMessage('warn', 'No Return Item given.');
          }
        }
        else {
          success = false;
          this.common.showMessage('warn', 'Out of Stock.');
        }

      } else {
        success = false;
        this.common.showMessage('warn', 'No data found!');
      }

    } else {
      success = false;
      this.common.showMessage('warn', 'No data found!');
    }
    if (success) {
      this.myForm.controls['sku_code'].setValue('');
    }

  }

  save() {
    let isInValid: boolean = true;
    let validationError: string = "";
    if (this.return_details_list == null || this.return_details_list.length <= 0) {
      validationError = "No Return-item provided.";
    } else if (this.exchange_details_list == null || this.exchange_details_list.length <= 0) {
      validationError = "No Exchanged-item provided.";
    } else if (this.exchange_details_list.length != this.return_details_list.length) {
      validationError = "Number of Exchanged-item(s) not matching with number of Return-item(s) provided.";
    } else {
      isInValid = false;

      for (let return_item of this.return_details_list) {
        return_item.enableCell = false;
      }
      for (let exchange_item of this.exchange_details_list) {
        exchange_item.enableCell = false;
        exchange_item.invoiceDetailID = 0;
        exchange_item.invoiceSerialNo = 0;
        exchange_item.sellingPricePerQty = 0;
        exchange_item.taxID = 0;
        exchange_item.taxAmount = 0;
      }
      for (let return_item of this.return_details_list) {
        for (let exchange_item of this.exchange_details_list) {
          if (return_item.styleCode == exchange_item.styleCode && exchange_item.enableCell == false) {
            return_item.enableCell = true;
            exchange_item.enableCell = true;
            exchange_item.invoiceDetailID = return_item.invoiceDetailID;
            exchange_item.invoiceSerialNo = return_item.invoiceSerialNo;
            exchange_item.sellingPricePerQty = return_item.sellingPricePerQty;
            exchange_item.taxID = return_item.taxID;
            exchange_item.taxAmount = return_item.taxAmount;
            break;
          }
        }
      }

      let unAssigned_returnItems: Array<MSalesExchangeDetails> = new Array<MSalesExchangeDetails>();
      let unAssigned_exchangeItems: Array<MSalesExchangeDetails> = new Array<MSalesExchangeDetails>();
      unAssigned_returnItems = this.return_details_list.filter(x => x.enableCell == false);
      unAssigned_exchangeItems = this.exchange_details_list.filter(x => x.enableCell == false);

      if (isInValid == false && unAssigned_returnItems != null && unAssigned_returnItems.length > 0) {
        isInValid = true;
        validationError = "No Exchange-item matching with " + unAssigned_returnItems.length.toString() + " Return-item(s)";
      }

      if (isInValid == false && unAssigned_exchangeItems != null && unAssigned_exchangeItems.length > 0) {
        isInValid = true;
        validationError = "No Return-item matching with " + unAssigned_exchangeItems.length.toString() + " Exchange-item(s)";
      }
    }


    if (isInValid) {
      this.common.showMessage("warn", validationError);
    } else if (this.sales_exchange_header.documentNo == null || this.sales_exchange_header.documentNo == "") {
      this.common.showMessage('warn', 'Document Numbering Not Found.');
    } else {
      this.sales_exchange_header.totalExchangeQty = this.return_details_list.length;
      this.sales_exchange_header.returnExchangeDetailList = new Array<MSalesExchangeDetails>();
      this.sales_exchange_header.returnExchangeDetailList = this.return_details_list;
      this.sales_exchange_header.salesExchangeDetailList = new Array<MSalesExchangeDetails>();
      this.sales_exchange_header.salesExchangeDetailList = this.exchange_details_list;

      this.common.showSpinner();
      this.api.postAPI("SalesExchange", this.sales_exchange_header).subscribe((data) => {

        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', 'Sales Exchange saved successfully.');

          this.documentNo = this.sales_exchange_header.documentNo;
          this.PrintExchangeReceipt();

          //localStorage.setItem('sales_exchange', JSON.stringify(this.sales_exchange_header.documentNo));
          //this.router.navigate(['exchange-receipt']);

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

  PrintExchangeReceipt() {
    this.getExchangeReport();
  }
  getExchangeReport() {
    this.api.getAPI("BarcodeGeneration?invoice=" + this.documentNo)
    .subscribe((data) => {
     if(data!=null && data!='')
     {
     this.barcode = data == null || data =='' ? this.temp_image : 'data:image/gif;base64,' + data;
       
     }
     else {
     let msg: string = data != null
       && data.displayMessage != null
       && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
     this.common.showMessage('warn', msg);
   }
   this.common.hideSpinner();
   });
   
    this.common.showSpinner();
    this.api.getAPI("ExchangeReceipt?invoice=" + this.documentNo)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.sal_excg_details = data.exchangeReceiptList;
            this.storeImage = data.exchangeReceiptList[0].storeImage == null || data.exchangeReceiptList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.exchangeReceiptList[0].storeImage;
            this.cashier = data.exchangeReceiptList[0].cashier!= null ? data.exchangeReceiptList[0].cashier : "";
            this.shopName = data.exchangeReceiptList[0].shopName!= null ? data.exchangeReceiptList[0].shopName : "";
            this.invoiceNo = data.exchangeReceiptList[0].invoiceNo!= null ? data.exchangeReceiptList[0].invoiceNo : "";
            this.salesinvoiceNo = data.exchangeReceiptList[0].salesInvoice!= null ? data.exchangeReceiptList[0].salesInvoice : "";
            this.date = this.common.toddmmmyyFormat(data.exchangeReceiptList[0].date);
            this.time = this.common.tohhmmaFormat(data.exchangeReceiptList[0].time);
            this.posName = data.exchangeReceiptList[0].posName!= null ? data.exchangeReceiptList[0].posName : "";
            this.customerName = data.exchangeReceiptList[0].customerName!= null ? data.exchangeReceiptList[0].customerName : "";
            this.footer = data.exchangeReceiptList[0].footer!= null ? data.exchangeReceiptList[0].footer : "";

            this.ExchangeDetailsList = new Array<any>();

            this.totalQty = 0;

            for (let i = 0; i < this.sal_excg_details.length; i++) {
              this.totalQty = this.totalQty + this.sal_excg_details[i].quantity;

              let tempdata: any = {
                "skuCode": this.sal_excg_details[i].skuCode + ' ' + this.sal_excg_details[i].arabicDetails,
                "quantity": this.sal_excg_details[i].quantity
              }
              this.ExchangeDetailsList.push(tempdata);
            }

            this.exchangereceiptdetails = '';

            for (let i = 0; i < this.ExchangeDetailsList.length; i++) {
              this.exchangereceiptdetails = this.exchangereceiptdetails +
                '<tr>' +
                '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + (i + 1) + '</h5></td>' +
                '<td style="text-align: left;font-weight: 100"><h5 style="margin: 5px;">' + this.ExchangeDetailsList[i].skuCode + '</h5></td>' +
                '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + this.ExchangeDetailsList[i].quantity + '</h5></td>' +
                '</tr>'
            }
            

          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
          this.getExchangeReceiptHTML();
        }, this.common.time_out_delay);
      });
  }
  getExchangeReceiptHTML() {
    this.exchangereceiptHTML = '<html>' +
      '<div style="width: 80mm;">' +
      '<div style="width: 50%; margin: 0 auto;">' +
      '<img src="' + this.storeImage + '" style="height: 50px;width:50%; margin-left: 45px;"/>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
      '<h4 style="margin: 2mm 0mm;font-weight:900">*&nbsp;EXCHANGE RECEIPT&nbsp;*</h4>' +
      '</div>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin:5px;font-weight:550">Cashier: </h5>' +
      '</td>' +
      '<td style="text-align:left;">' +
      '<h5 style="margin:5px;font-weight:100">' + this.cashier + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:550">Shop: </h5>' +
      '</td>' +
      '<td style="text-align:left;">' +
      '<h5 style="margin:5px;font-weight:100">' + this.shopName + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:550">Invoice#: </h5>' +
      '</td>' +
      '<td style="text-align:left;">' +
      '<h5 style="margin:5px; font-weight: 100">' + this.invoiceNo + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin:5px;font-weight:550">S-Invoice# </h5>' +
      '</td>' +
      '<td style="text-align: left;font-weight: 100">' +
      '<h5 style="margin:5px;font-weight:100">' + this.salesinvoiceNo + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin:5px;font-weight:550">Date: </h5>' +
      '</td>' +
      '<td style="text-align: left;font-weight: 100">' +
      '<h5 style="margin:5px;font-weight:100">' + this.date + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin:5px;font-weight:550">Time: </h5>' +
      '</td>' +
      '<td style="text-align:left;font-weight:100">' +
      '<h5 style="margin:5px;font-weight:100">' + this.time + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin:5px;font-weight:550">POS: </h5>' +
      '</td>' +
      '<td style="text-align:left;font-weight:100">' +
      '<h5 style="margin:5px;font-weight:100">' + this.posName + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin:5px;font-weight:550">Customer: </h5>' +
      '</td>' +
      '<td style="text-align:left;font-weight:100">' +
      '<h5 style="margin:5px;font-weight:100">' + this.customerName + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;height:5px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width:95%; margin: 0 auto; border-collapse: collapse;">' +
      '<thead>' +
      '<tr style="border-top: 1px solid #000; border-bottom: 2px solid #000;">' +
      '<th style="width: 10%;">Sl#</th>' +
      '<th style="width: 40%">Item Code</th>' +
      '<th style="width: 10%;">Quantity</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      this.exchangereceiptdetails +
      '</tbody>' +
      '<tfoot>' +
      '<tr style="border-top: 2px solid #000;border-bottom: 1px solid #000;">' +
      '<td></td>' +
      '<td style="text-align: left;width:40%;font-weight:550"><h5>Total Quantity</h5></td>' +
      '<td style="text-align: center;"><h5 style="margin:5px;">' + this.totalQty + '</h5></td>' +
      '</tr>' +
      '</tfoot>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm"></h5>' +
      '</td>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm;"></h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;height:40px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="text-align:left">' +
      '<h5 style="margin: 2mm 0mm;font-weight:550"><u>Customer Name</u></h5>' +
      '</td>' +
      '<td style="text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:550"><u>Customer Signature</u></h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;height: 50px;">' +
      '<tr>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm"></h5>' +
      '</td>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm;"></h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<div style="width: 100%; text-align: center;">' +
      '<h4 style="margin: 2mm 0mm;font-weight:100;">This is not a sales invoice.</h4>' +
      '</div>' +
      '<table style="width: 100%;height: 15px;">' +
      '<tr>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm"></h5>' +
      '</td>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm;"></h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<div style="text-align: center;font-weight:100">' +
      '<h4 style="margin: 2mm 0mm;font-weight:100; font-size: 13px;margin-bottom: 14px;">' + this.footer + '</h4>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;height:50px">' +
      '<img src="' + this.barcode + '" />' +
      '</div>' +
      '</div>' +
      '</html>';
    this.onPrintHTML();
  }
  onPrintHTML() {
    if (this.user_details.exchangePrintCount > 0) {
      var printData = [];
      for (let i = 0; i < this.user_details.exchangePrintCount; i++) {
        var printcount = {
          type: 'html',
          format: 'plain',
          data: this.exchangereceiptHTML
        }
        printData.push(printcount);
      }
      this.printService.printHTML(this.printerName, printData);
    }
    else {
      this.common.showMessage('info', 'No ExchangePrintCount Set.');
    }
    // var printData = [
    //   {
    //     type: 'html',
    //     format: 'plain',
    //     data: this.exchangereceiptHTML
    //   }
    // ];    
    // this.printService.printHTML(this.printerName, printData);
  }
}
