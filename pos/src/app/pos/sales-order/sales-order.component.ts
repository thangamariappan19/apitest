import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MInvoiceDetail } from 'src/app/models/m-invoice-detail';
import { MSalesOrderDetails } from 'src/app/models/m-sales-order-details';
import { MSalesOrderHeader } from 'src/app/models/m-sales-order-header';
import { MDayClosing } from 'src/app/models/m-day-closing';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit {
  json: Array<any>;
  myForm: FormGroup;
  item_details: Array<MInvoiceDetail>;
  sales_order_header: MSalesOrderHeader;
  user_details: MUserDetails = null;
  temp_order_list: MSalesOrderDetails;
  sales_order_details: Array<MSalesOrderDetails> = null;
  businessdate: Date;
  documentTypeDetailId: number;
  documentNo: any;

  logedpos_details: MDayClosing = null;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    localStorage.setItem('pos_mode', 'true');
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
     // .log(this.user_details);
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
    this.createForm();
    this.temp_order_list = new MSalesOrderDetails();
    this.sales_order_details = new Array<MSalesOrderDetails>();
  }
  createForm() {

    this.myForm = this.fb.group({
      sku_code: [''],
      customer: ['']
    });
    this.clear_controls();
  }
  clear_controls() {
    this.get_sales_order_documentno();
    this.getStoreList();
  }
  get_sales_order_documentno() {
    this.businessdate = new Date(this.logedpos_details.businessDate);
    // this.invoice.invoiceNo = '1234564';
    // Document Number Search
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.user_details.storeID + "&DocumentTypeID=82&business_date=" + this.common.toYMDFormat(this.businessdate))
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.myForm.controls['customerCode'].setValue(data.documentNo != null ? data.documentNo : "");
            this.documentNo = data.documentNo != null ? data.documentNo : "";
            this.documentTypeDetailId = data.documentNumberingBillNoDetailsRecord.detailID;
            this.common.showMessage('warn', this.documentNo);
            //this.invoice.invoiceNo = data.documentNo != null ? data.documentNo : "";
          } else {
            this.common.showMessage('warn', 'Failed to get Customer Code.');
            this.myForm.controls['customerCode'].setValue('');
          }

          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getStoreList() {
    this.json = null;
    //this.country_list = null;
    this.common.showSpinner();
    this.api.getAPI("StoreBasedCountryID?CountryID=" + this.user_details.countryID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<MCountryMaster> ();
            //this.country_list = data.countryMasterList;
            this.json = data.salesOrderHeaderList;
           // .log(this.json);
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
  ngOnInit() {

  }
  sku_changed() {
    this.common.showSpinner();
    this.api.getAPI("invoice?skucode=" + this.myForm.get('sku_code').value + "&storeid=" + this.user_details.storeID)
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {

          setTimeout(() => {
            // this.common.showMessage('', 'SKU Search Success');
            this.myForm.controls['sku_code'].setValue('');
            this.add_sku(data.skuMasterTypesList);
            this.common.hideSpinner();
          }, this.common.time_out_delay);

        }
      });
  }

  add_sku(sku_list: Array<any>) {
    this.temp_order_list = null;
    let styleCode: string;
    let skucode: string;
    let price: number;
    let sellingLineTotal: number;
    for (let item of sku_list) {
      //this.temp_order_list.storeID = 2;
      styleCode = item.styleCode;
      skucode = item.skuCode;
      //this.temp_order_list.qty = 0;
      price = item.stylePrice;
      sellingLineTotal = item.stylePrice;
    }
    let tempcash: MSalesOrderDetails = {
      styleCode: styleCode,
      skuCode: skucode,
      qty: 1,
      pickedQty: 0,
      storeID: 2,
      storeCode: 'N02',
      price: price,
      sellingLineTotal: price
    }
    this.sales_order_details.push(tempcash);
  }

  add_sales_order() {
    this.sales_order_header = new MSalesOrderHeader();
    this.sales_order_header.id = 0;
    this.sales_order_header.orderStatus = 'Open';
    this.sales_order_header.documentNo = this.documentNo;
    this.sales_order_header.documentDate = new Date(this.logedpos_details.businessDate);
    this.sales_order_header.deliveryDate = new Date(this.logedpos_details.businessDate);
    this.sales_order_header.totalQty = 5;
    this.sales_order_header.pickedQty = 0;
    this.sales_order_header.totalAmount = 0;
    this.sales_order_header.discountType = '';
    this.sales_order_header.discountValue = 0;
    this.sales_order_header.netAmount = 0;
    this.sales_order_header.paymentStatus = 'Pending';
    this.sales_order_header.customerCode = '';
    this.sales_order_header.salesOrderDetailsList = this.sales_order_details;
    this.sales_order_header.paymentList = null;

    this.common.showSpinner();
    this.api.postAPI("SalesOrder", this.sales_order_header).subscribe((data) => {
      //// .log(data);
      if (data != null && data.statusCode != null && data.statusCode == 1) {
        this.common.hideSpinner();
        this.common.showMessage('success', 'SalesOrder saved successfully.');
        this.clear_controls();
        this.router.navigate(['../home']);
      } else {
        setTimeout(() => {
          this.common.hideSpinner();
          this.common.showMessage('error', 'Failed to Save.');
        }, this.common.time_out_delay);
      }

    });
  }

  customer_search() { }
}
