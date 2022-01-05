import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SoapService } from '../soap.service';
import { CommonService } from '../common.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MInvoiceDetail } from '../models/m-invoice-detail';
import { MCustomer } from '../models/m-customer';
import { MTempInvoiceDetail } from '../models/m-temp-invoice-detail';
import { MInvoiceHeader } from '../models/m-invoice-header';
import { MUserDetails } from '../models/m-user-details';
import { Router } from '@angular/router';
import { ConfirmService } from '../confirm/confirm.service';
import { MEmployeeMaster, MEmployeeAC } from '../models/m-employee-master';
import { MPaymentDetails } from '../models/m-payment-details';
import { MDayClosing } from '../models/m-day-closing';
import { MManagerOverride } from '../models/m-manager-override';
import { MRetailSettings } from '../models/m-retail-settings';

import { MatDialog } from '@angular/material/dialog';
import { ManagerLoginComponent } from '../manager-login/manager-login.component';
import { AuthService } from '../login/auth.service';
import { DiscountPopupComponent } from './discount-popup/discount-popup.component';
import { MPromotionMaster } from '../models/m-promotion-master';
import { QzTrayService } from 'src/app/qz-tray-service';
import { Observable } from 'rxjs';
import { map, startWith, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { MStyleColorScale } from '../models/m-style-color-scale';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { CouponPopupComponent } from './coupon-popup/coupon-popup.component';
//import { MatTextareaAutosize } from '@angular/material/input';

// import { promise } from 'protractor';

declare var jQuery: any;

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})

export class PosComponent implements OnInit {

  printerName = "EPSON TM-T88IV Receipt";

  myForm: FormGroup;
  hold_Document_No: any = null;
  user_details: MUserDetails = null;
  manger_detail: MUserDetails;
  manager_OverRide: MManagerOverride = null;
  retail_settings: MRetailSettings = null;
  logedpos_details: MDayClosing = null;
  getHoldInvoice: Array<any>;
  logedpos_details1: MDayClosing = null;
  employee_details: Array<MEmployeeMaster>;
  styleColorScaledetails: Array<MStyleColorScale>;
  employee_ac: Array<MEmployeeAC>;
  current_employee: MEmployeeMaster;
  payment_details: Array<MPaymentDetails>;
  colorList: Array<MStyleColorScale>;
  sizeList: Array<MStyleColorScale>;
  combogroup: number = 0;
  store_promotions: Array<MPromotionMaster>;

  invoice: MInvoiceHeader;
  item_details: Array<MInvoiceDetail>;
  temp_item_details: Array<MTempInvoiceDetail>;
  current_item: MTempInvoiceDetail = null;
  customer_info: MCustomer;
  currency_code: string;
  default_customer: MCustomer;
  temp_customer_list: Array<MCustomer>;

  storeName: string = '';
  taxPercentage: number;
  loyaltyPoint: string = '';
  loyaltyPlan: string = '';
  pos_Name: string = '';

  decimalPlaces: number = 0;
  roundOffDigits: number = 0;
  promotionRoundOff: number = 0;
  fixedDecimal: number = 0;

  current_discount_type: string = 'Amount';
  current_discount_value: number = 0;
  current_discount_remarks: string = '';

  current_coupon_code: string = "";
  current_is_partial_redeem: boolean = false;
  current_redeem_amount: number = 0;

  current_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";
  manager_OverRide_Settings: Array<MManagerOverride>;
  CurrentColorList: Array<MStyleColorScale> = null;
  CurrentSizeList: Array<MStyleColorScale> = null;
  manager_username: string;
  manager_password: string;

  promo_group_id: number;

  //user_details: MUserDetails = null;
  redeemCouponMaster: any;

  redeem_coupon_id: any;
  redeem_coupon_code: any;
  redeem_coupon_lineNo: any;
  redeem_coupon_SerialCouponCode: any;
  redeem_coupon_DiscountType: any;
  redeem_coupon_discountValue
  redeem_coupon_DiscountAmount: any;



  invoiceNo: any;
  InvoiceReportList1: any;
  InvoiceReportList2: any;
  InvoiceReportList3: any;
  InvoiceDetailsList: Array<any>;
  storeImage;
  barcode;
  //temp_image: string = "assets/img/preview-image.png";
  shopName: any;
  posName: any;
  invoiceNum: any;
  date: any;
  time: any;
  customerName: any;
  salesMan: any;
  cashier: any;
  taxNo: any;
  totalPrice: any = 0;
  tottaxAmount: any = 0;
  totalDiscount: any;
  taxAmount: any;
  netAmount: any;
  paidAmount: any;
  customerBalance: any;
  paycash: any = 0;
  footer: any;
  amount: any;
  knet: any;
  visa: any;
  creditcard: any;
  paymentCurrency: any;
  discount: any;
  cardType: any;
  approvalNumber: any;
  approvalNumberKNet: any;
  approvalNumberVisa: any;
  approvalNumberMaster: any;
  header: any;
  posTitle: any;
  decimalPlace: any;
  //decimalPlaces: any;
  invoicereceiptHTML: any;
  invoicereceiptdetails: any = '';
  temp_SkuName: string;
  employeeName: string;
  temp_Size: string;
  temp_color: string;
  styleCode: string;
  // options: string[];
  filteredOptions: Observable<MEmployeeAC[]>;
  myControl = new FormControl();
  Skucode: any;
  temp_SkuCode: any;
  public selectedColorName: any;
  public selectedSize: any;
  searchCustomerCtrl = new FormControl();
  filteredCustomers: any;

  isLoading = false;
  errorMsg: string;
  billtotalQty: any = 0;
  decimal_places: number = 0;

  public highlightColor() {
    if (this.temp_color != null) {
      this.selectedColorName = this.temp_color;
    }
    else if (this.getHoldInvoice != null) {
      var str = this.temp_SkuCode;
      let splitted = str.split("-", 4);
      this.temp_color = splitted[2];
      if (this.temp_color != null) {
        this.selectedColorName = this.temp_color;
      }
    }
    else if (this.invoice != null) {
      for (let i = 0; i < this.invoice.invoiceDetailList.length; i++) {
        var str: any = this.invoice.invoiceDetailList[i].skuCode;
        let splitted = str.split("-", 4);
        this.temp_color = splitted[2];
        if (this.temp_color != null) {
          this.selectedColorName = this.temp_color;
        }
      }

    }
  }

  public highlightSize() {
    if (this.temp_Size != null) {
      this.selectedSize = this.temp_Size;
    }
    else if (this.getHoldInvoice != null) {
      var str = this.temp_SkuCode;
      let splitted = str.split("-", 4);
      this.temp_Size = splitted[3];
      if (this.temp_Size != null) {
        this.selectedSize = this.temp_Size;
      }


    }
    else if (this.invoice != null) {
      for (let i = 0; i < this.invoice.invoiceDetailList.length; i++) {
        var str: any = this.invoice.invoiceDetailList[i].skuCode;
        let splitted = str.split("-", 4);
        this.temp_Size = splitted[3];
        if (this.temp_Size != null) {
          this.selectedSize = this.temp_Size;
        }
      }

    }
  }

  // orjwan_response: any = null;

  openDialog(type: string): void {
    if (this.manager_OverRide.totalDiscount == false && (this.invoice.totalDiscountAmount > 0 || this.invoice.totalDiscountPercentage > 0)) {
      const dialogRef = this.dialog.open(ManagerLoginComponent, {
        width: '250px',
        data: { username: this.manager_username, password: this.manager_password }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.manger_detail = new MUserDetails();
        if (result != null && result != undefined) {
          // here you can check the password.
          // And do neccessary things

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

                let tot_dis: boolean = false;
                if (mgr_settings.length > 0) {
                  tot_dis = mgr_settings[0].totalDiscount == null ||
                    mgr_settings[0].totalDiscount == undefined ? false : mgr_settings[0].totalDiscount;
                }

                if (tot_dis == true) {
                  if (type == "quick") {
                    this.quick_pay();
                  } else if (type == "payment") {
                    this.goto_payment();
                  }

                }
                else {
                  this.common.showMessage('info', 'You Dont have Permission to Give Discount.');
                }
                // if (this.manager_OverRide_Settings.length > 0 &&
                //     this.manager_OverRide_Settings[0] != {} &&
                //     this.manager_OverRide_Settings[0].totalDiscount == true) {
                //   this.quick_pay();
                // }
                // else {
                //   this.common.showMessage('info', 'You Dont have Permission to Give Discount.');
                // }
                // this.common.showMessage('', 'Customer Search Success');
                //this.myForm.controls['sku_code'].setValue('');
                //this.add_customer(data.responseDynamicData);
              }
            });
        }
      });
    }
    else {
      if (type == "quick") {
        this.quick_pay();
      } else if (type == "payment") {
        this.goto_payment();
      }

    }
  }


  openCouponDialog() {
    const couponDialogRef = this.dialog.open(CouponPopupComponent, {
      width: '310px',
      data: {
        couponCode: this.current_coupon_code,
        isPartialRedeem: this.current_is_partial_redeem,
        redeemAmount: this.current_redeem_amount
      }
    });

    let isCouponValid: Boolean = true;
    this.redeemCouponMaster = null;
    this.redeem_coupon_id = null;
    this.redeem_coupon_code = null;
    this.redeem_coupon_lineNo = null;
    this.redeem_coupon_SerialCouponCode = null;
    this.redeem_coupon_DiscountType = null;
    this.redeem_coupon_discountValue = null;
    this.redeem_coupon_DiscountAmount = null;
    let objCouponListDetail: any = null;

    this.invoice.couponID = null;
    this.invoice.redeemCouponCode = null;
    this.invoice.redeemCouponLineNo = null;
    this.invoice.redeemCouponSerialCode = null;
    this.invoice.redeemCouponDiscountType = null;
    this.invoice.redeemCouponDiscountValue = null;
    this.invoice.redeemValue =  null;
    // this.invoice.issuedCouponCode?: string;
    // this.invoice.issuedCouponLineNo?: number;
    // this.invoice.issuedCouponSerialCode?: string;

    couponDialogRef.afterClosed().subscribe(result => {
      if (result.couponCode != null && result.couponCode != '') {
        this.api.getAPI("CouponRedeem?CouponCode=" + result.couponCode)
          .subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.redeemCouponMaster = data.couponMasterRecord;
              if (this.redeemCouponMaster != null) {
                if (this.redeemCouponMaster.redeemType != null && this.redeemCouponMaster.redeemType.toLowerCase() == "coupon") {
                  if (this.redeemCouponMaster.objCouponListDetails != null && this.redeemCouponMaster.objCouponListDetails.length > 0) {
                    objCouponListDetail = this.redeemCouponMaster.objCouponListDetails[0];

                    if (this.redeemCouponMaster.storeCommonUtilData != null && this.redeemCouponMaster.storeCommonUtilData.length > 0) {
                      let store_coupon_list = this.redeemCouponMaster.storeCommonUtilData.filter(x => x.documentCode == this.user_details.storeCode && x.documentID == this.user_details.storeID);
                      if (store_coupon_list == null || store_coupon_list.length <= 0) {
                        isCouponValid = false;
                        this.common.showMessage('warn', "Entered Coupon is not Applicable for this Store!");
                      }
                    } else {
                      isCouponValid = false;
                      this.common.showMessage('warn', "Entered Coupon is not Applicable for this Store!");
                    }

                    if (isCouponValid) {
                      if (objCouponListDetail.couponSerialCode.toLowerCase() == result.couponCode.toLowerCase()) {
                        if(this.redeemCouponMaster.minAmount > this.invoice.subTotalAmount){
                          isCouponValid = false;
                          this.common.showMessage('warn', "Invoice Total is Less than Minimum Coupon amount!");
                        } else if(parseFloat(result.redeemAmount) > this.invoice.subTotalAmount){
                          isCouponValid = false;
                          this.common.showMessage('warn', "Coupon Value Exceeded Total Invoice Value!");
                        } else if(objCouponListDetail.active != true){
                          isCouponValid = false;
                          this.common.showMessage('warn', "Coupon Deactivated - Invoice against this given coupon is already refunded. Please Enter Valid Coupon!");
                        } else if(objCouponListDetail.redeemedStatus.toLowerCase() == 'fully redeemed' && objCouponListDetail.isCouponMulitpleApply != true){
                          isCouponValid = false;
                          this.common.showMessage('warn', "Given Coupon Is Already Redeemed.");
                        } else if(objCouponListDetail.redeemCount <= 0){
                          isCouponValid = false;
                          this.common.showMessage('warn', "Given Coupon Is Already Redeemed.");
                        } else if (this.redeemCouponMaster.couponType != null && this.redeemCouponMaster.couponType.toLowerCase() == "system"
                          && Date.parse(this.invoice.businessDate.toDateString()) > Date.parse(objCouponListDetail.expiredDate)) {
                          isCouponValid = false;
                          this.common.showMessage('warn', "Given Coupon Is Already expired. Please Enter Valid Coupon!");
                        } else if (!(this.redeemCouponMaster.isLimitedPeriodOffer == true
                          && Date.parse(this.redeemCouponMaster.startDate) <= Date.parse(this.invoice.businessDate.toDateString())
                          && Date.parse(this.redeemCouponMaster.endDate) >= Date.parse(this.invoice.businessDate.toDateString()))) {
                          isCouponValid = false;
                          this.common.showMessage('warn', "Given Coupon Is Already expired. Please Enter Valid Coupon!");
                        } else if (this.redeemCouponMaster.discountType.toLowerCase() == "percentage"
                          && result.redeemAmount > 0) {
                          isCouponValid = false;
                          this.common.showMessage('warn', "Partial Redeem not allowed for Percentage Discount Type !");
                        }
                        else if (this.redeemCouponMaster.discountType.toLowerCase() == "amount"
                          && this.redeemCouponMaster.isPartialRedeemAllowed != true
                          && result.redeemAmount > 0) {
                          isCouponValid = false;
                          this.common.showMessage('warn', "Partial Redeem not allowed for this Coupon!");
                        } else{
                          // Coupon is valid
                        }

                      }else{
                        isCouponValid = false;
                        this.common.showMessage('warn', "Coupon Code is Not Valid!");
                      }

                    }



                  } else {
                    isCouponValid = false;
                    this.common.showMessage('warn', "No Coupon List Data Found!");
                  }

                } else {
                  isCouponValid = false;
                  this.common.showMessage('warn', "This is Not a Coupon.. Its Voucher. Please Redeem in Voucher Page!");
                }
              } else {
                isCouponValid = false;
                this.common.showMessage('warn', "Coupon is Not Valid!");
              }
              // console.log(data);
              // this.common.showMessage('success', "success");

              if(isCouponValid){
                this.redeem_coupon_id = this.redeemCouponMaster.id;
                this.redeem_coupon_code = this.redeemCouponMaster.couponCode;
                this.redeem_coupon_lineNo = objCouponListDetail.lineNo;
                this.redeem_coupon_SerialCouponCode = result.couponCode;
                this.redeem_coupon_DiscountType = this.redeemCouponMaster.discountType;
                this.redeem_coupon_discountValue = 0;
                if(this.redeem_coupon_DiscountType.toLowerCase() == "percentage"){
                  this.redeem_coupon_discountValue = this.redeemCouponMaster.discountValue;
                }
                this.redeem_coupon_DiscountAmount = result.redeemAmount != null && result.redeemAmount > 0 ? result.redeemAmount : this.redeemCouponMaster.discountValue;

                this.current_discount_type =this.redeem_coupon_DiscountType;
                this.current_discount_value = this.redeem_coupon_DiscountAmount;
                this.current_discount_remarks = result.couponCode;

                this.invoice.couponID = this.redeemCouponMaster.id;
                this.invoice.redeemCouponCode = this.redeemCouponMaster.couponCode;
                this.invoice.redeemCouponLineNo = objCouponListDetail.lineNo;
                this.invoice.redeemCouponSerialCode = result.couponCode;
                this.invoice.redeemCouponDiscountType = this.redeemCouponMaster.discountType;
                this.invoice.redeemCouponDiscountValue = this.redeem_coupon_discountValue;
                this.invoice.redeemValue =  this.redeem_coupon_DiscountAmount;
                // this.invoice.issuedCouponCode?: string;
                // this.invoice.issuedCouponLineNo?: number;
                // this.invoice.issuedCouponSerialCode?: string;



                this.apply_discount_new();
              } else{
                this.current_discount_type = "Amount";
                this.current_discount_value = 0;
                this.current_discount_remarks = "";

                this.invoice.couponID = null;
                this.invoice.redeemCouponCode = null;
                this.invoice.redeemCouponLineNo = null;
                this.invoice.redeemCouponSerialCode = null;
                this.invoice.redeemCouponDiscountType = null;
                this.invoice.redeemCouponDiscountValue = null;
                this.invoice.redeemValue =  null;
                // this.invoice.issuedCouponCode?: string;
                // this.invoice.issuedCouponLineNo?: number;
                // this.invoice.issuedCouponSerialCode?: string;

                this.apply_discount_new();
              }

            } else {
              let msg: string = data != null
                && data.displayMessage != null
                && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              this.common.showMessage('warn', msg);
            }
          });
      }

    });
  }

  openDiscountDialog(): void {
    const disDialogRef = this.dialog.open(DiscountPopupComponent, {
      width: '310px',
      data: {
        discountType: this.current_discount_type,
        discountValue: this.current_discount_value,
        discountRemarks: this.current_discount_remarks,
        invoiceTotal: this.invoice.netAmount
      }
    });

    // data: {
    //   discountType: this.current_discount_type,
    //   discountValue: this.current_discount_value,
    //   discountRemarks: this.current_discount_remarks,
    //   invoiceTotal: this.invoice.subTotalAmount
    // }

    disDialogRef.afterClosed().subscribe(result => {

      if (result != null && result != undefined) {
        this.current_discount_type = result.discountType;
        this.current_discount_value = result.discountValue;
        if (result.discountType != null && result.discountType != "" && result.discountValue > 0) {
          this.current_discount_remarks = result.discountRemarks;
        } else {
          this.current_discount_remarks = "";
        }
        this.apply_discount_new();
      }
    });
  }

  constructor(private api: ApiService,
    private fgapi: AuthService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    public dialog: MatDialog,
    private printService: QzTrayService,
    private soap: SoapService,
    private http: HttpClient) {

    this.InvoiceDetailsList = new Array<any>();
    // , doc: HTMLDocument) {
    localStorage.setItem('pos_mode', 'true');

    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
    this.decimal_places = this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;
    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
    let temp_manageroverride: string = localStorage.getItem('manager_OverRide_Settings');
    if (temp_manageroverride != null) {
      this.manager_OverRide = JSON.parse(temp_manageroverride);
    }
    let temp_Retail: string = localStorage.getItem('retail_settings');
    if (temp_Retail != null) {
      this.retail_settings = JSON.parse(temp_Retail);
    }
    let temp_new_customer = localStorage.getItem('New_customer_details');
    localStorage.setItem("New_customer_details", null);
    let temp_pos: string = localStorage.getItem('pos_details');
    let inv_str: string = localStorage.getItem('payment_invoice');
    if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);
      this.default_customer = new MCustomer();
      this.default_customer.id = this.logedpos_details != null && this.logedpos_details.defaultCustomerID != null ? this.logedpos_details.defaultCustomerID : 0;
      if (temp_new_customer != null && temp_new_customer != "" && temp_new_customer != "null") {
        this.invoice = JSON.parse(inv_str);
        this.logedpos_details1 = JSON.parse(temp_new_customer);
        this.default_customer.id = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerID != null ? this.logedpos_details1.defaultCustomerID : 0;
        this.default_customer.customerCode = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerCode != null ? this.logedpos_details1.defaultCustomerCode : "";
        this.default_customer.customerGroupCode = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerGroupCode != null ? this.logedpos_details1.defaultCustomerGroupCode : "";
        this.default_customer.customerGroupID = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerGroupID != null ? this.logedpos_details1.defaultCustomerGroupID : 0;
        this.default_customer.customerName = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerName != null ? this.logedpos_details1.defaultCustomerName : "";
        this.default_customer.phoneNumber = this.logedpos_details1 != null && this.logedpos_details1.defaultPhoneNumber != null ? this.logedpos_details1.defaultPhoneNumber : "";
        this.logedpos_details.defaultCustomerID = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerID != null ? this.logedpos_details1.defaultCustomerID : 0;
        this.logedpos_details.defaultCustomerCode = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerCode != null ? this.logedpos_details1.defaultCustomerCode : "";
        this.logedpos_details.defaultCustomerGroupCode = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerGroupCode != null ? this.logedpos_details1.defaultCustomerGroupCode : "";
        this.logedpos_details.defaultCustomerGroupID = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerGroupID != null ? this.logedpos_details1.defaultCustomerGroupID : 0;
        this.logedpos_details.defaultCustomerName = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerName != null ? this.logedpos_details1.defaultCustomerName : "";
        this.logedpos_details.defaultPhoneNumber = this.logedpos_details1 != null && this.logedpos_details1.defaultPhoneNumber != null ? this.logedpos_details1.defaultPhoneNumber : "";
        this.invoice.customerCode = this.logedpos_details1 != null && this.logedpos_details1.defaultCustomerCode != null ? this.logedpos_details1.defaultCustomerCode : "";
        localStorage.setItem('payment_invoice', null);
        localStorage.setItem('pos_details', null);
        localStorage.setItem('pos_details', JSON.stringify(this.logedpos_details));
        localStorage.setItem('payment_invoice', JSON.stringify(this.invoice));
      }
      else {
        this.default_customer.id = this.logedpos_details != null && this.logedpos_details.defaultCustomerID != null ? this.logedpos_details.defaultCustomerID : 0;
        this.default_customer.customerCode = this.logedpos_details != null && this.logedpos_details.defaultCustomerCode != null ? this.logedpos_details.defaultCustomerCode : "";
        this.default_customer.customerGroupCode = this.logedpos_details != null && this.logedpos_details.defaultCustomerGroupCode != null ? this.logedpos_details.defaultCustomerGroupCode : "";
        this.default_customer.customerGroupID = this.logedpos_details != null && this.logedpos_details.defaultCustomerGroupID != null ? this.logedpos_details.defaultCustomerGroupID : 0;
        this.default_customer.customerName = this.logedpos_details != null && this.logedpos_details.defaultCustomerName != null ? this.logedpos_details.defaultCustomerName : "";
        this.default_customer.phoneNumber = this.logedpos_details != null && this.logedpos_details.defaultPhoneNumber != null ? this.logedpos_details.defaultPhoneNumber : "";

      }



      this.temp_customer_list = new Array<MCustomer>();
      this.temp_customer_list.push(this.default_customer);
      this.printerName = this.logedpos_details.printerDeviceName;

      //this.printerName = "EPSON TM-T88IV Receipt";
    }

    if (this.default_customer.id == null || this.default_customer.id == 0) {
      common.showMessage("info", "No Default Customer set for this POS " + this.logedpos_details.posCode);
    }

    if (this.printerName == null || this.printerName == "") {
      common.showMessage("info", "No Printer set for this POS " + this.logedpos_details.posCode);
    }

    // this.get_default_sales_employee();
    if (this.logedpos_details == null) {
      common.showMessage("warn", "Day-In / Shift-In Required");
      localStorage.setItem('pos_mode', 'true');
      // this.router.navigate(['home']);
      this.router.navigate(['day-in-out']);
    }

    let promo_str: string = localStorage.getItem('store_promotions');
    if (promo_str != null && promo_str != "null") {
      this.store_promotions = JSON.parse(promo_str);
    } else {
      let store_id: number = this.user_details != null && this.user_details.storeID != null ? this.user_details.storeID : 0;
      this.get_store_promotions(store_id);
    }

    // let temp_holdsales: string = localStorage.getItem('recall_invoice');
    this.item_details = new Array<MInvoiceDetail>();

    // Recall Invoice
    // if (this.getHoldInvoice == null) {
    // //   /*common.showMessage("warn", "Invalid pos Details");
    // //   localStorage.setItem('pos_mode', 'false');
    // //   this.router.navigate(['home']);*/
    // }

    this.taxPercentage = parseFloat(this.user_details.taxPercentage.toString());
    this.storeName = this.user_details.storeName;
    this.pos_Name = this.logedpos_details.posCode;//this.user_details.posName;
    this.currency_code = this.user_details.currencySymbol;
    this.decimalPlaces = this.user_details.decimalPlaces;
    this.myControl.setValue({ employeeName: this.user_details.employeeName });
    // this.roundOffDigits = 1;
    this.roundOffDigits = this.user_details.nearByRoundOff;
    this.promotionRoundOff = this.user_details.promotionRoundOff;
    if (this.roundOffDigits == 0.50 || this.roundOffDigits == 0.500 || this.roundOffDigits == 0.5) {
      this.fixedDecimal = 1
    }
    else if (this.roundOffDigits == 0.05 || this.roundOffDigits == 0.050) {
      this.fixedDecimal = 2;
    }
    else if (this.roundOffDigits == 0.005) {
      this.fixedDecimal = 3;
    }
    this.createForm();

    // doc.onload = function(){
    //   alert('Onload function');
    // }
  }

  createForm() {

    this.myForm = this.fb.group({
      sku_code: [''],
      discount_value: [0],
      current_discount_type: ['Percentage'],
      discount_remarks: ['']
      //myControl: ['']
    });

    this.current_coupon_code = "";
    this.current_is_partial_redeem = false;
    this.current_redeem_amount = 0;

    this.get_employees();
    this.clear_controls();
    this.getManagerOverRideList();
  }

  get_employees() {
    return new Promise((resolve, reject) => {
      this.employee_details = null;
      this.current_employee = null;
      this.api.getAPI("salesemployee?storeid=" + this.user_details.storeID.toString())
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            if (data.employeeMasterList != null) {

              this.employee_details = new Array<MEmployeeMaster>();
              this.employee_details = data.employeeMasterList;
              this.employee_ac = new Array<MEmployeeAC>();
              if (this.employee_details != null && this.employee_details.length > 0) {
                for (let emp of this.employee_details) {
                  this.employee_ac.push({
                    employeeName: emp.employeeName,
                    id: emp.id,
                    employeeCode: emp.employeeCode
                  });
                }
                this.filteredOptions = this.myControl.valueChanges
                  //this.filteredOptions = this.myForm.get('myControl').value
                  .pipe(
                    startWith(''),
                    map(value => this.filter(value))
                  );
                // let emp_ac = this.employee_ac.filter(x => x.id == this.user_details.employeeID);
                // this.myControl.setValue({ employeeName: emp_ac[0].employeeName });
                // this.invoice.salesEmployeeID = emp_ac[0].id;
                // this.invoice.salesEmployeeCode = emp_ac[0].employeeCode;
                this.get_default_sales_employee();
              }
            }
            resolve(true);
          } else {
            this.common.showMessage('warn', 'Failed to get Employee Details.');
            this.employee_details = null;
            this.current_employee = null;
            reject('Failed to get Employee Details.');
          }
        });
    });
  }

  get_default_sales_employee() {
    if (this.employee_details != null && this.employee_details.length > 0) {
      let emp_ac = this.employee_ac.filter(x => x.id == this.user_details.employeeID);
      this.myControl.setValue({ employeeName: emp_ac[0].employeeName });
      this.invoice.salesEmployeeID = emp_ac[0].id;
      this.invoice.salesEmployeeCode = emp_ac[0].employeeCode;
      this.invoice.salesEmployeeName = emp_ac[0].employeeName;
    }
  }

  clear_controls() {
    // localStorage.setItem('payment_invoice', null);
    this.colorList = new Array<MStyleColorScale>();
    this.sizeList = new Array<MStyleColorScale>();
    this.CurrentColorList = new Array<MStyleColorScale>();
    this.CurrentSizeList = new Array<MStyleColorScale>();
    this.current_image = this.temp_image;

    this.current_coupon_code = "";
    this.current_is_partial_redeem = false;
    this.current_redeem_amount = 0;

    this.current_discount_type = 'Amount';
    this.current_discount_remarks = '';
    this.invoice = new MInvoiceHeader();
    this.invoice = {
      countryCode: this.user_details.countryCode,
      countryID: this.user_details.countryID,
      storeCode: this.user_details.storeCode,
      storeID: this.user_details.storeID,

      runningNo: 0,
      documentTypeID: 66,

      //posid: 2,
      //posCode: 'NUSQPS01',
      posid: this.logedpos_details.posid,
      posCode: this.logedpos_details.posCode,

      documentDate: new Date(),

      //shiftID: 8,
      //shiftCode: 'KWTSHFT008',
      shiftID: this.logedpos_details.shiftID,
      shiftCode: this.logedpos_details.shiftCode,

      totalDiscountType: 'NULL',
      totalDiscountAmount: 0,
      totalDiscountPercentage: 0,
      discountRemarks: '',

      appliedPriceListID: this.user_details.priceListID,
      appliedPriceListCode: this.user_details.priceListCode,
      totalQty: 0,
      subTotalAmount: 0,
      subTotalWithTaxAmount: 0,
      netAmount: 0,
      beforeRoundOffAmount: 0,
      roundOffAmount: 0,

      taxID: this.user_details.taxID,
      taxCode: this.user_details.taxCode,
      taxAmount: 0,

      cashierID: this.user_details.id,
      cashierCode: this.user_details.userCode,

      emailSend: false,
      smsSend: false,
    };

    this.current_discount_type = "Amount";
    this.current_discount_value = 0;
    this.current_discount_remarks = "";

    this.item_details = null;
    this.temp_item_details = null;
    this.current_item = null;
    this.customer_info = this.default_customer;
    // this.get_employees();
    this.get_invoice_no();
    // this.get_employees();
    this.add_customer(this.temp_customer_list);

    // this.colorList = new Array<MStyleColorScale>();
    // this.sizeList = new Array<MStyleColorScale>();
  }

  get_invoice_no() {
    return new Promise((resolve, reject) => {
      // this.invoice.businessDate = new Date('2020-05-14');
      this.invoice.businessDate = new Date(this.logedpos_details.businessDate);
      // this.invoice.invoiceNo = '1234564';
      // Document Number Search
      this.api.getAPI("documentnumbering?storeid=" + this.user_details.storeID.toString()
        + "&DocumentTypeID=66&business_date=" + this.common.toYMDFormat(this.invoice.businessDate))
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.invoice.invoiceNo = data.documentNo != null ? data.documentNo : "";
            this.invoice.salesEmployeeID = this.user_details.employeeID;
            this.invoice.salesEmployeeCode = this.user_details.employeeCode;
            resolve(true);
          } else {
            this.common.showMessage('warn', 'Failed to get Document Number.');
            this.invoice.invoiceNo = '';
            reject('Failed to get Document Number.');
          }
        });
    });

  }

  add_customer(customer_list: Array<any>) {
    if (customer_list != null) {
      for (var item of customer_list) {
        this.customer_info = new MCustomer();
        this.customer_info = item;
        this.invoice.customerCode = item.customerCode;
        this.invoice.customerGroupCode = item.customerGroupCode;
        this.invoice.customerGroupID = item.customerGroupID;
        this.invoice.customerID = item.id;
        this.invoice.onAccountApplicable = item.onAccountApplicable;
        this.invoice.customerName =  item.customerName;
        this.invoice.customerMobileNo = item.phoneNumber;
        break;
      }
    }
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
    this.colorList = new Array<MStyleColorScale>();
    this.sizeList = new Array<MStyleColorScale>();
    this.printService.initQZ();
    // alert('POS Init');
    let temp_check_from_home: string = localStorage.getItem('pos_from_home');
    if (temp_check_from_home == "true") {
      localStorage.setItem('recall_invoice', null);
      this.load_PaymentItem();
    }
    else {
      // localStorage.setItem('pos_mode', 'true');
      let temp_holdsales: string = localStorage.getItem('recall_invoice');
      this.item_details = new Array<MInvoiceDetail>();
      // Recall Invoice

      if (temp_holdsales != null && temp_holdsales != "null") {
        this.load_hold_invoices();
      }
      else {
        this.load_PaymentItem();
      }
    }
    this.common.hideSpinner();
    (function ($) {
      $(document).ready(function () {

        var popupEvent = function () {

        }
        $('#disc').hunterPopup({
          width: '350px',
          height: '150px',
          title: "Enter Discount ",
          content: $('#maindisc'),
          event: popupEvent
        });
        // alert("Hello from jQuery!");
      });
    })(jQuery);
    this.searchCustomerCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        // debounceTime(0000),
        tap(() => {
          this.errorMsg = "";
          this.filteredCustomers = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(AppConstants.base_url + "api/SearchEngine?CustSearchString=" + this.searchCustomerCtrl.value)
          .pipe(
            startWith(''),
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        if (data != null && data.searchEngineDataList != null && data.searchEngineDataList.length > 0) {
          this.errorMsg = "";
          var items = data.searchEngineDataList,
            map = new Map,
            result;
          items.forEach(({ type, name, id, number, code }) => {
            map.has(type) || map.set(type, { type, values: [] });
            map.get(type).values.push({ id, name, number, code });
          });
          result = [...map.values()];
          this.filteredCustomers = result;

        }
        else {
          // this.errorMsg = data['Error'];
          this.filteredCustomers = [];

        }


      });

  }

  load_hold_invoices() {
    let temp_holdsales: string = localStorage.getItem('recall_invoice');
    this.getHoldInvoice = JSON.parse(temp_holdsales);
    if (this.getHoldInvoice != null) {
      for (let holdinvoice of this.getHoldInvoice) {
        this.Skucode = holdinvoice.skuCode;
        this.styleCode = holdinvoice.styleCode;
        this.temp_SkuCode = holdinvoice.skuCode;
        let temp_item: MTempInvoiceDetail = {
          skuCode: holdinvoice.skuCode,
          barCode: holdinvoice.barCode,
          productGroupName: holdinvoice.productGroupName
          // skuImage: this.current_image,
          //stock: enable_orjwan_stock == true ? orjwan_stock : row.stock
        };
        temp_item.skuImage = this.current_image;

        this.current_item = temp_item;
        let sku = holdinvoice.customerName;
        this.api.getAPI("customerSearchPOS?custSearchString=" + sku)
          .subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              // this.common.showMessage('', 'Customer Search Success');
              this.myForm.controls['sku_code'].setValue('');
              this.add_customer(data.customerMasterData);
            }
          });
        let item: MInvoiceDetail = {
          countryID: this.user_details.countryID,
          countryCode: this.user_details.countryCode,
          storeID: this.user_details.storeID,
          storeCode: this.user_details.storeCode,
          posid: this.logedpos_details.posid,
          posCode: this.logedpos_details.posCode, //'NUSQPS01',
          invoiceNo: '',
          skuImage: holdinvoice.skuImage == null || holdinvoice.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + holdinvoice.skuImage,
          styleCode: holdinvoice.styleCode,
          serialNo: 0,

          tag_Id: holdinvoice.tag_Id,

          skuid: holdinvoice.id,
          skuCode: holdinvoice.skuCode,
          barCode: holdinvoice.barCode != null && holdinvoice.barCode != undefined ? holdinvoice.barCode : "",
          brandID: holdinvoice.brandID,
          brandCode: holdinvoice.brandCode,
          subBrandID: holdinvoice.subBrandID,
          subBrandCode: holdinvoice.subBrandCode,
          category: holdinvoice.productGroupID,

          qty: 1,

          appliedPriceListID: this.user_details.priceListID.toString(),
          appliedCustomerSpecialPricesID: null, // [NOT IMPLEMENTED]
          appliedPriceListCode: this.user_details.priceListCode,
          price: holdinvoice.price,
          sellingPrice: holdinvoice.sellingPrice, // [CALC]
          sellingLineTotal: holdinvoice.sellingLineTotal, // [CALC]

          discountType: holdinvoice.discountType,  // [CALC]
          discountAmount: holdinvoice.discountAmount, // [CALC]
          discountRemarks: holdinvoice.discountRemarks,
          employeeDiscountID: 0, // [NOT IMPLEMENTED]
          employeeDiscountAmount: 0, // [NOT IMPLEMENTED]
          familyDiscountAmount: 0, // [NOT IMPLEMENTED]

          appliedPromotionID: "",
          promotionAmount: 0, // [CALC]
          type: 'item', // [CALC]
          syncFailedReason: '',

          taxID: this.user_details.taxID,
          taxCode: this.user_details.taxCode,
          taxAmount: 0, // [CALC]

          lineTotal: 0, // [CALC]
          isGift: false,
          costPriceKD: null, // [NOT IMPLEMENTED]
          costPrice: null, // [NOT IMPLEMENTED]
          // skuImage: holdinvoice.skuImage,
          // styleCode: holdinvoice.styleCode,
        };
        if (this.temp_item_details == null) {
          this.temp_item_details = new Array<MTempInvoiceDetail>();
        }

        this.temp_item_details.push(temp_item);
        this.current_image = holdinvoice.skuImage == null || holdinvoice.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + holdinvoice.skuImage;//holdinvoice.skuImage;

        if (this.item_details == null) {
          this.item_details = new Array<MInvoiceDetail>();

        }
        this.item_details.push(item);
        if (holdinvoice.discountType == 'Amount') {

          this.current_discount_value += holdinvoice.discountAmount;
          this.current_discount_type = holdinvoice.discountType;
          this.current_discount_remarks = holdinvoice.discountRemarks;
        }
        if (holdinvoice.discountType == 'Percentage') {
          let percentage = (holdinvoice.discountAmount / holdinvoice.price) * 100;
          this.current_discount_value = percentage;
          this.current_discount_type = holdinvoice.discountType;
        }
        // this.calculate();
        this.get_default_sales_employee();

      }
    }
    this.apply_discount_new();
    this.get_StyleColorScale1();

    localStorage.setItem('recall_invoice', null);
  }

  load_PaymentItem() {
    let inv_str: string = localStorage.getItem('payment_invoice');
    this.item_details = new Array<MInvoiceDetail>();

    if (inv_str != null && inv_str != "null") {
      this.invoice = JSON.parse(inv_str);
      let details: Array<MInvoiceDetail> = new Array<MInvoiceDetail>();
      details = this.invoice.invoiceDetailList;
      let cc = this.invoice.customerCode;
      this.api.getAPI("customerSearchPOS?custSearchString=" + cc)
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // this.common.showMessage('', 'Customer Search Success');
            this.add_customer(data.customerMasterData);
          }
        });

      if (details != null && details.length > 0) {

        let index: number = 1;
        for (let det of details) {
          this.Skucode = det.skuCode;
          // this.styleCode = det.styleCode;
          if (this.temp_item_details == null) {
            this.temp_item_details = new Array<MTempInvoiceDetail>();
          }
          this.Skucode = det.skuCode;
          this.current_image = det.skuImage == null || det.skuImage == '' ? this.temp_image : det.skuImage;
          let item: MInvoiceDetail = {
            countryID: this.user_details.countryID,
            countryCode: this.user_details.countryCode,
            storeID: this.user_details.storeID,
            storeCode: this.user_details.storeCode,
            posid: this.logedpos_details.posid,
            posCode: this.logedpos_details.posCode, //'NUSQPS01',
            invoiceNo: '',
            skuImage: det.skuImage == null || det.skuImage == '' ? this.temp_image : det.skuImage,
            serialNo: index,
            tag_Id: det.tag_Id,

            skuid: det.id,
            skuCode: det.skuCode,
            barCode: det.barCode != undefined && det.barCode != null ? det.barCode : "",
            brandID: det.brandID,
            brandCode: det.brandCode,
            subBrandID: det.subBrandID,
            subBrandCode: det.subBrandCode,
            category: det.category,


            qty: 1,
            productGroupName: det.productGroupName,
            appliedPriceListID: this.user_details.priceListID.toString(),
            appliedCustomerSpecialPricesID: null, // [NOT IMPLEMENTED]
            appliedPriceListCode: this.user_details.priceListCode,
            price: det.price,
            sellingPrice: det.sellingPrice, // [CALC]
            sellingLineTotal: det.sellingLineTotal, // [CALC]

            discountType: det.discountType,  // [CALC]
            discountAmount: det.discountAmount, // [CALC]
            discountRemarks: det.discountRemarks,
            employeeDiscountID: 0, // [NOT IMPLEMENTED]
            employeeDiscountAmount: 0, // [NOT IMPLEMENTED]
            familyDiscountAmount: 0, // [NOT IMPLEMENTED]

            appliedPromotionID: "",
            promotionAmount: 0, // [CALC]
            type: 'item', // [CALC]
            syncFailedReason: '',

            taxID: this.user_details.taxID,
            taxCode: this.user_details.taxCode,
            taxAmount: 0, // [CALC]

            lineTotal: 0, // [CALC]
            isGift: false,
            costPriceKD: null, // [NOT IMPLEMENTED]
            costPrice: null, // [NOT IMPLEMENTED]
            styleCode: det.styleCode,
          };
          if (this.temp_item_details == null) {
            this.temp_item_details = new Array<MTempInvoiceDetail>();
          }
          this.temp_item_details.push(item);
          this.current_item = item;
          this.item_details.push(item);
          // this.get_StyleColorScale();
          index++;
        }
        this.get_StyleColorScale1();
        this.calculate();

      }
      // localStorage.removeItem('payment_invoice');
      // localStorage.setItem('payment_invoice', null);
    }
    localStorage.setItem('payment_invoice', null);
  }


  filter(val: any) {
    let name = val.employeeName || val; // val can be Customer or string
    return this.employee_ac.filter(option => option.employeeName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }



  displaysaleEmployeeName(cust: PosComponent) {
    return cust ? cust.employeeName : '';
  }

  onEmpSelectionChange(e) {
    this.invoice.salesEmployeeID = e.option.value.id;
    this.invoice.salesEmployeeCode = e.option.value.employeeCode;
    this.invoice.salesEmployeeName = e.option.value.employeeName;

  }

  sku_changed() {

    let sales_employee_exists: boolean = false;
    let sku_exists: boolean = false;
    let new_item: MInvoiceDetail = null;
    let sku_code = this.searchCustomerCtrl.value;

    if (sku_code != null && sku_code != "") {

      // if (this.employee_details != null && this.employee_details.length > 0) {
      //   for (let emp of this.employee_details) {
      //     if ((emp.employeeCode != null && emp.employeeCode.toLowerCase() == sku_code.toLowerCase())
      //       || (emp.employeeName != null && emp.employeeName.toLowerCase() == sku_code.toLowerCase())
      //       || (emp.phoneNo != null && emp.phoneNo.toLowerCase() == sku_code.toLowerCase())) {

      //       this.current_employee = emp;
      //       this.invoice.salesEmployeeID = emp.id;
      //       this.invoice.salesEmployeeCode = emp.employeeCode;
      //       sales_employee_exists = true;
      //       this.myForm.controls['sku_code'].setValue('');
      //       break;
      //     }
      //   }
      // }

      if (sales_employee_exists == false) {
        if (this.item_details != null && this.item_details.length > 0) {
          for (let item of this.item_details) {
            if ((item.skuCode.toLowerCase() == sku_code.toLowerCase() ||
              (item.barCode.toLowerCase() == sku_code.toLowerCase() && item.barCode != "")) && item.isHeader == false && item.isCombo == false) {
              sku_exists = true;
              // item.qty = item.qty + 1;
              // new_item = item;
              new_item = Object.assign({}, item);
              break;
            }
          }
        }

        if (sku_exists) {
          if (this.temp_item_details != null && this.temp_item_details.length > 0) {
            for (let temp_item of this.temp_item_details) {
              if ((sku_code.toLowerCase() == temp_item.skuCode.toLowerCase()
                || (temp_item.barCode != "" && temp_item.barCode.toLowerCase() == sku_code.toLowerCase())) && temp_item.isComboItem == false) {
                let allow_negative: boolean = false;
                if (this.retail_settings != null && this.retail_settings != undefined) {
                  allow_negative = this.retail_settings.allowSalesForNegativeStock == null ? false : this.retail_settings.allowSalesForNegativeStock;
                }

                if (temp_item.stock > 0 || allow_negative == true) {
                  this.current_item = temp_item;
                  this.current_image = temp_item.skuImage;
                  // this.temp_styleCode = temp_item.skuCode;
                  // this.temp_styleCode = this.temp_styleCode.substring(0,3)

                  temp_item.stock = temp_item.stock - 1;
                  // let len: number = this.item_details.length;
                  // new_item.serialNo = len + 1;
                  new_item.serialNo = 0;
                  this.item_details.push(new_item);
                  this.myForm.controls['sku_code'].setValue('');
                  this.apply_discount_new();
                  // this.calculate();
                } else {
                  this.myForm.controls['sku_code'].setValue('');
                  this.common.showMessage('error', 'Out of Stock');
                }
                break;
              }
            }
          }

        } else {

          // SKU Search
          //SKU Search
          this.common.showSpinner();
          this.api.getAPI("SKUSearchForSales?skucode=" + sku_code + "&storeid=" + this.user_details.storeID + "&pricelistid=" + this.user_details.priceListID)
            .subscribe((data) => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                let enableOrjwanStock_str: string = localStorage.getItem('enableOrjwanStock');
                let enableOrjwanStock: boolean = enableOrjwanStock_str != null && enableOrjwanStock_str == 'false' ? true : false;
                if (enableOrjwanStock == true) {
                  let loc_code: string = this.user_details.storeCode;
                  // this.check_item_stock("15","455267")
                  this.check_item_stock(loc_code, sku_code)
                    .then((response) => {
                      // this.common.showMessage('', 'SKU Search Success');
                      this.myForm.controls['sku_code'].setValue('');
                      this.common.hideSpinner();
                      this.add_sku(data.skuMasterTypesList, response, true);

                    }).catch((err) => {
                      this.common.hideSpinner();
                      this.common.showMessage("warn", err);
                    });
                } else {
                  // this.common.showMessage('', 'SKU Search Success');
                  this.myForm.controls['sku_code'].setValue('');
                  this.common.hideSpinner();
                  this.add_sku(data.skuMasterTypesList, null, false);
                }
              } else {

                // Customer Search
                this.common.showSpinner();
                this.api.getAPI("CustomerSearchPOS?custSearchString=" + sku_code)
                  .subscribe((data) => {
                    if (data != null && data.statusCode != null && data.statusCode == 1) {
                      // this.common.showMessage('', 'Customer Search Success');

                      console.log(data);
                      this.myForm.controls['sku_code'].setValue('');
                      this.add_customer(data.customerMasterData);
                    } else {
                      this.common.showMessage('warn', 'No Data found!');
                    }
                    this.common.hideSpinner();
                  });
              }
            });
        }
      }
      this.searchCustomerCtrl.patchValue('');
    }
  }

  add_sku(sku_list: Array<any>, orjwan_response: any, enable_orjwan_stock: boolean) {
    let i = 0;
    let groupid = 0;

    let combo_validated: boolean = true;
    let combo_found: boolean = false;

    if (sku_list != null) {
      let cmb_list = sku_list.filter(x => x.isHeaderItem == true);
      combo_found = cmb_list.length > 0 ? true : false;
      for (var row of sku_list) {
        if (combo_validated == true) {


          let sno: number = 0;
          this.styleCode = row.styleCode;
          this.Skucode = row.skuCode;
          if (this.item_details != null && this.item_details.length > 0) {
            sno = this.item_details.length;
          }

          // this.current_image = row.skuImage == null || row.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + row.skuImage;
          let orjwan_stock: number = 0;
          orjwan_stock = orjwan_response != null && orjwan_response.QTY_INSTOCK != null ? orjwan_response.QTY_INSTOCK : 0;

          let temp_item: MTempInvoiceDetail = {
            skuCode: row.skuCode,
            barCode: row.barCode,
            productGroupName: row.productGroupName,
            // skuImage: this.current_image,
            stock: enable_orjwan_stock == true ? orjwan_stock : row.stock,
            isComboItem: row.isComboItem,
            isHeaderItem: row.isHeaderItem
          };

          let allow_negative: boolean = false;
          let allow_zero_price: boolean = false;
          if (this.retail_settings != null && this.retail_settings != undefined) {
            allow_negative = this.retail_settings.allowSalesForNegativeStock == null ? false : this.retail_settings.allowSalesForNegativeStock;
            allow_zero_price = this.retail_settings.allowSalesForZeroPrice == null ? false : this.retail_settings.allowSalesForZeroPrice;
          }

          let item_price: number = row.stylePrice != null ? row.stylePrice : 0;
          if (temp_item.isComboItem == true && i == 0) {
            this.combogroup = this.combogroup + 1;
          }

          if (temp_item.stock > 0 || allow_negative == true || temp_item.isHeaderItem == true) {
            if (item_price > 0 || allow_zero_price == true || (temp_item.isHeaderItem == false && temp_item.isComboItem == true)) {

              this.current_image = row.skuImage == null || row.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + row.skuImage;
              temp_item.skuImage = this.current_image;
              this.temp_SkuName = row.skuName;
              this.temp_Size = row.sizeName;
              this.temp_color = row.colorName;

              temp_item.stock = temp_item.stock - 1;

              if (this.temp_item_details == null) {
                this.temp_item_details = new Array<MTempInvoiceDetail>();
              }

              this.temp_item_details.push(temp_item);
              this.current_item = temp_item;

              let item: MInvoiceDetail = {
                countryID: this.user_details.countryID,
                countryCode: this.user_details.countryCode,
                storeID: this.user_details.storeID,
                storeCode: this.user_details.storeCode,
                posid: this.logedpos_details.posid,
                posCode: this.logedpos_details.posCode, // 'NUSQPS01',
                invoiceNo: '',
                skuImage: row.skuImage == null || row.skuImage == '' ? this.temp_image : 'data:image/gif;base64,' + row.skuImage,
                serialNo: 0,

                tag_Id: row.tag_Id,

                skuid: row.id,
                skuCode: row.skuCode,
                barCode: row.barCode != undefined && row.barCode != null ? row.barCode : "",
                brandID: row.brandID,
                // brandCode: row.brandCode,
                subBrandID: row.subBrandID,
                // subBrandCode: row.subBrandCode,
                category: row.productGroupID,

                afSegamationName: row.afSegamationName,
                year: row.year,
                brandCode: row.brandCode,
                subBrandCode: row.subBrandCode,
                seasonName: row.seasonName,
                productGroupName: row.productGroupName,
                styleCode: row.styleCode,



                qty: 1,

                appliedPriceListID: this.user_details.priceListID.toString(),
                appliedCustomerSpecialPricesID: null, // [NOT IMPLEMENTED]
                appliedPriceListCode: this.user_details.priceListCode,
                price: row.stylePrice,
                sellingPrice: 0, // [CALC]
                sellingLineTotal: 0, // [CALC]

                discountType: 'Amount',  // [CALC]
                discountAmount: 0, // [CALC]
                discountRemarks: null,
                employeeDiscountID: 0, // [NOT IMPLEMENTED]
                employeeDiscountAmount: 0, // [NOT IMPLEMENTED]
                familyDiscountAmount: 0, // [NOT IMPLEMENTED]

                appliedPromotionID: "",
                promotionAmount: 0, // [CALC]
                type: 'item', // [CALC]
                syncFailedReason: '',

                taxID: this.user_details.taxID,
                taxCode: this.user_details.taxCode,
                taxAmount: 0, // [CALC]

                lineTotal: 0, // [CALC]

                costPriceKD: null, // [NOT IMPLEMENTED]
                costPrice: null, // [NOT IMPLEMENTED]
                isCombo: temp_item.isHeaderItem == true ? false : temp_item.isComboItem,
                isHeader: temp_item.isHeaderItem,
                comboGroupID: combo_found == true ? this.combogroup : 0,
                isGift: false
              };

              if (this.item_details == null || this.item_details.length == 0) {
                this.item_details = new Array<MInvoiceDetail>();
                this.current_discount_type = "Amount";
                this.current_discount_value = 0;
              }
              this.item_details.push(item);

              if (temp_item.isHeaderItem == false) {
                this.get_StyleColorScale();
              }

              // this.apply_discount_new();

              // this.calculate();
            } else {
              combo_validated = false;
              this.common.showMessage('error', 'Item Price is Zero!.. You cannot Sell this Item');
            }
          } else {
            combo_validated = false;
            this.common.showMessage('error', 'Out of Stock');
          }

          //SHANKAR HIDE break;
          i++;
        }
      }

      if (combo_validated == true) {
        this.apply_discount_new();
      } else {
        if (combo_found == true) {
          let toBeRemoved = this.item_details.filter(x => x.comboGroupID == this.combogroup);
          this.item_details = this.item_details.filter((i) => (toBeRemoved.indexOf(i) === -1));
          this.apply_discount_new();
        }
      }

    }
  }

  get_StyleColorScale1() {
    if (this.item_details != null && this.item_details.length > 0) {
      for (var row of this.item_details) {
        this.Skucode = row.skuCode;
        this.api.getAPI("stylemaster?StyleCode=" + row.styleCode + "&X=" + "y")
          .subscribe((data) => {
            // setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              if (data.styleColorSizeTypesList != null) {
                this.styleColorScaledetails = new Array<MStyleColorScale>();
                this.styleColorScaledetails = data.styleColorSizeTypesList;
                let sl = this.sizeList.filter(x => x.SKUCode == this.Skucode);
                let cl = this.colorList.filter(x => x.SKUCode == this.Skucode);
                if (this.styleColorScaledetails != null) {
                  this.CurrentColorList = new Array<MStyleColorScale>();
                  this.CurrentSizeList = new Array<MStyleColorScale>();
                  for (let item of this.styleColorScaledetails) {
                    if (item.type == "Size") {
                      item.SKUCode = this.Skucode;

                      if (sl == null || sl.length <= 0) {
                        this.sizeList.push(item);
                      }
                      this.CurrentSizeList.push(item);
                    }
                    else {
                      item.SKUCode = this.Skucode;

                      if (cl == null || cl.length <= 0) {
                        this.colorList.push(item);
                      }
                      this.CurrentColorList.push(item);
                    }
                  }

                }
                this.highlightColor();
                this.highlightSize();
              }
            } else {
              this.common.showMessage('warn', 'Failed to get StyleColorScale Details.');
              this.styleColorScaledetails = null;
              this.styleColorScaledetails = null;
            }
          });
      }

    }

  }

  get_StyleColorScale() {
    this.api.getAPI("stylemaster?StyleCode=" + this.styleCode + "&X=" + "y")
      .subscribe((data) => {
        // setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          if (data.styleColorSizeTypesList != null) {
            this.styleColorScaledetails = new Array<MStyleColorScale>();
            this.styleColorScaledetails = data.styleColorSizeTypesList;
            let sl = this.sizeList.filter(x => x.SKUCode == this.Skucode);
            let cl = this.colorList.filter(x => x.SKUCode == this.Skucode);
            if (this.styleColorScaledetails != null) {
              this.CurrentColorList = new Array<MStyleColorScale>();
              this.CurrentSizeList = new Array<MStyleColorScale>();
              for (let item of this.styleColorScaledetails) {
                if (item.type == "Size") {
                  item.SKUCode = this.Skucode;

                  if (sl == null || sl.length <= 0) {
                    this.sizeList.push(item);
                  }
                  this.CurrentSizeList.push(item);
                }
                else {
                  item.SKUCode = this.Skucode;

                  if (cl == null || cl.length <= 0) {
                    this.colorList.push(item);
                  }
                  this.CurrentColorList.push(item);
                }
              }

            }
            this.highlightColor();
            this.highlightSize();
          }

        } else {
          this.common.showMessage('warn', 'Failed to get StyleColorScale Details.');
          this.styleColorScaledetails = null;
          this.styleColorScaledetails = null;
        }
      });
  }

  get_temp_item_info(sku_code, type) {
    if (this.temp_item_details == null || this.temp_item_details.length < 1) {
      return "";
    } else {
      let product_name: string = "";
      for (let temp_item of this.temp_item_details) {
        if (temp_item.skuCode == sku_code) {
          if (type == 'name') {
            product_name = temp_item.productGroupName;
            // this.temp_SkuName = temp_item.productGroupName;

          }
          else if (type == 'barcode') {
            product_name = temp_item.barCode;
          }
          break;
        }
      }
      return product_name;
    }
  }


  discount_type_changed(type: string) {
    this.current_discount_type = type;
    this.current_discount_value = 0;
    this.myForm.controls['discount_value'].setValue(0);
    // this.invoice.totalDiscountType = type;
    // this.myForm.controls['discount_value'].setValue(0);
    // this.invoice.totalDiscountPercentage = 0;
    // this.invoice.totalDiscountAmount = 0;
    // this.calculate();
  }

  apply_discount_new() {
    let discount_value: number = this.current_discount_value;
    this.invoice.totalDiscountType = this.current_discount_type;
    this.invoice.discountRemarks = this.current_discount_remarks;

    if (this.invoice.totalDiscountType.toLowerCase() == "percentage") {
      this.invoice.totalDiscountPercentage = discount_value;
    } else if (this.invoice.totalDiscountType.toLowerCase() == "amount") {
      this.invoice.totalDiscountAmount = discount_value;
    }

    this.calculate();
  }

  apply_discount() {
    // let discount_value: number = this.myForm.get('discount_value').value;
    // this.invoice.totalDiscountType = this.current_discount_type;

    // if (this.invoice.totalDiscountType.toLowerCase() == "percentage") {
    //   this.invoice.totalDiscountPercentage = discount_value;
    // } else if (this.invoice.totalDiscountType.toLowerCase() == "amount") {
    //   this.invoice.totalDiscountAmount = discount_value;
    // }

    // this.calculate();
  }

  cancel_discount() {
    this.current_discount_type = this.invoice.totalDiscountType;
    this.current_discount_value = 0;
    if (this.invoice.totalDiscountType.toLowerCase() == "percentage") {
      this.current_discount_value = this.invoice.totalDiscountPercentage;
    } else if (this.invoice.totalDiscountType.toLowerCase() == "amount") {
      this.current_discount_value = this.invoice.totalDiscountAmount;
    }
    this.myForm.controls['discount_value'].setValue(this.current_discount_value);
  }

  get_store_promotions(store_id: number) {
    return new Promise((resolve, reject) => {
      this.store_promotions = null;
      this.api.getAPI("StorePromotion?StoreID=" + store_id)
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            if (data.promotionsList != null && data.promotionsList != undefined) {
              this.store_promotions = data.promotionsList;
              localStorage.setItem('store_promotions', JSON.stringify(this.store_promotions));
            }
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

    // }
  }

  calculate() {

    let dis_percentage: number = 0;
    let dis_amount: number = 0;
    let dis2: number = 0;
    let sub1: number = 0;
    let sub2: number = 0;
    let b4_rnd: number = 0;
    let tax_amount: number = 0;
    let tot_qty: number = 0;


    this.clearGiftPromotion();
    // Promotions
    let current_promotion: MPromotionMaster = null;
    let allow_multiple_promotion: boolean = true;
    // b4 applying promotion to items, clear all promotion_id of items
    let total_qty: number = 0;
    let total_bill_amt: number = 0;
    if (this.item_details != null && this.item_details.length > 0) {
      for (let item of this.item_details) {
        item.qty = item.qty == null ? 0 : item.qty;
        item.price = item.price == null ? 0 : parseFloat(item.price.toFixed(this.decimalPlaces));
        item.appliedPromotionID = "";
        item.syncFailedReason = "";
        item.promoGroupID = 0;
        item.specialPromoDiscount = 0;
        item.specialPromoDiscountPercentage = 0;
        item.specialPromoDiscountType = "";
        item.promotionAmount = 0;
        item.temp_color = "";
        item.temp_promotion_id = 0;
        item.type = "Item";
        item.invoiceType = "Item";
        item.promotionName = "";
        item.promtionApplied = false;
        item.isPromoExcludeItem = false;
        item.isFreeItem = false;
        item.discountRemarks = "";

        item.temp_isGetItem = false;
        item.temp_getItemType = "";
        item.temp_getItemValue = "";

        item.temp_isBuyItem = false;
        item.temp_buyItemType = "";
        item.temp_buyItemValue = "";

        total_qty += item.qty;
        total_bill_amt += item.price;
      }
    }

    if (this.store_promotions != null && this.store_promotions.length > 0) {
      // 1. Order all Promotions based on Priority
      let ordered_promotions = this.store_promotions.sort((a, b) => (a.priorityNo < b.priorityNo ? -1 : 1));
      if (ordered_promotions != null && ordered_promotions.length > 0) {
        this.promo_group_id = 0;
        for (let promo of ordered_promotions) {
          if (allow_multiple_promotion == true) {
            // decide whether this promotion applicable based on total quantity
            if (total_qty >= promo.minQuantity) {
              // decide whether this promotion applicable based on total bill amount
              if (total_bill_amt >= promo.minBillAmount) {
                // does the Customer or Customer Group in Exclusion list?
                let customer_excluded: boolean = false;
                if (promo.customerList != null && promo.customerList.length > 0) {
                  let customer_group_x_list = promo.customerList.filter(x => x.typeName.toLowerCase() == "customergroup"
                    && x.documentCode.toLowerCase() == this.invoice.customerGroupCode.toLowerCase());
                  let customer_x_list = promo.customerList.filter(x => x.typeName.toLowerCase() == "customer"
                    && x.documentCode.toLowerCase() == this.invoice.customerCode.toLowerCase());

                  if (customer_group_x_list != null && customer_group_x_list.length > 0) {
                    customer_excluded = true;
                  }
                  if (customer_x_list != null && customer_x_list.length > 0) {
                    customer_excluded = true;
                  }
                }
                if (customer_excluded == false) {
                  if (this.item_details != null && this.item_details.length > 0) {
                    for (let item of this.item_details) {
                      if (item.appliedPromotionID == null || item.appliedPromotionID == "") {
                        let isExcluded: boolean = false;
                        if (promo.productTypeList != null && promo.productTypeList.length > 0) {
                          // does this StyleSegmentation Excluded for this promotion
                          let segmentation_x_list = promo.productTypeList.filter(x => x.typeName.toLowerCase() == "stylesegmentation"
                            && x.documentName.toLowerCase() == item.afSegamationName.toLowerCase());
                          if (segmentation_x_list != null && segmentation_x_list.length > 0) {
                            isExcluded = true;
                          }
                          // does this Year for this promotion
                          if (isExcluded == false) {
                            let year_x_list = promo.productTypeList.filter(x => x.typeName.toLowerCase() == "year"
                              && x.documentName.toLowerCase() == item.year.toLowerCase());
                            if (year_x_list != null && year_x_list.length > 0) {
                              isExcluded = true;
                            }
                          }
                          // does this Brand for this promotion
                          if (isExcluded == false) {
                            let brand_x_list = promo.productTypeList.filter(x => x.typeName.toLowerCase() == "brand"
                              && x.documentCode.toLowerCase() == item.brandCode.toLowerCase());
                            if (brand_x_list != null && brand_x_list.length > 0) {
                              isExcluded = true;
                            }
                          }
                          // does this Sub Brand for this promotion
                          if (isExcluded == false) {
                            let subBrand_x_list = promo.productTypeList.filter(x => x.typeName.toLowerCase() == "subbrand"
                              && x.documentCode.toLowerCase() == item.subBrandCode.toLowerCase());
                            if (subBrand_x_list != null && subBrand_x_list.length > 0) {
                              isExcluded = true;
                            }
                          }
                          // does this Seasons for this promotion
                          if (isExcluded == false) {
                            let season_x_list = promo.productTypeList.filter(x => x.typeName.toLowerCase() == "seasons"
                              && x.documentName.toLowerCase() == item.seasonName.toLowerCase());
                            if (season_x_list != null && season_x_list.length > 0) {
                              isExcluded = true;
                            }
                          }
                          // does this ProductGroup for this promotion
                          if (isExcluded == false) {
                            let productGroup_x_list = promo.productTypeList.filter(x => x.typeName.toLowerCase() == "productgroup"
                              && x.documentName.toLowerCase() == item.productGroupName.toLowerCase());
                            if (productGroup_x_list != null && productGroup_x_list.length > 0) {
                              isExcluded = true;
                            }
                          }
                          // does this Style for this promotion
                          if (isExcluded == false) {
                            let style_x_list = promo.productTypeList.filter(x => x.typeName.toLowerCase() == "style"
                              && x.documentCode.toLowerCase() == item.styleCode.toLowerCase());
                            if (style_x_list != null && style_x_list.length > 0) {
                              isExcluded = true;
                            }
                          }
                          // does this Coupon for this promotion
                          // Not Implemented
                        }

                        if (isExcluded == false) {
                          // decide whether this item falls under get item
                          if (promo.buyItemTypeList != null && promo.buyItemTypeList.length > 0) {
                            for (let buyItem of promo.buyItemTypeList) {
                              if (buyItem != null && item.temp_isBuyItem == false) {

                                if (buyItem.typeName != null && buyItem.typeName.toLowerCase() == "all"
                                  && buyItem.documentCode.toLowerCase() == "all") {
                                  item.temp_promotion_id = promo.id;
                                  item.temp_isBuyItem = true;
                                  item.temp_buyItemType = buyItem.typeName;
                                  item.temp_buyItemValue = buyItem.documentCode;
                                } else if (buyItem.typeName != null && buyItem.typeName.toLowerCase() == "stylesegmentation"
                                  && buyItem.documentName.toLowerCase() == item.afSegamationName.toLowerCase()) {
                                  item.temp_promotion_id = promo.id;
                                  item.temp_isBuyItem = true;
                                  item.temp_buyItemType = buyItem.typeName;
                                  item.temp_buyItemValue = buyItem.documentCode;
                                } else if (buyItem.typeName != null && buyItem.typeName.toLowerCase() == "year"
                                  && buyItem.documentName.toLowerCase() == item.year.toLowerCase()) {
                                  item.temp_promotion_id = promo.id;
                                  item.temp_isBuyItem = true;
                                  item.temp_buyItemType = buyItem.typeName;
                                  item.temp_buyItemValue = buyItem.documentCode;
                                } else if (buyItem.typeName != null && buyItem.typeName.toLowerCase() == "brand"
                                  && buyItem.documentCode.toLowerCase() == item.brandCode.toLowerCase()) {
                                  item.temp_promotion_id = promo.id;
                                  item.temp_isBuyItem = true;
                                  item.temp_buyItemType = buyItem.typeName;
                                  item.temp_buyItemValue = buyItem.documentCode;
                                } else if (buyItem.typeName != null && buyItem.typeName.toLowerCase() == "subbrand"
                                  && buyItem.documentCode.toLowerCase() == item.subBrandCode.toLowerCase()) {
                                  item.temp_promotion_id = promo.id;
                                  item.temp_isBuyItem = true;
                                  item.temp_buyItemType = buyItem.typeName;
                                  item.temp_buyItemValue = buyItem.documentCode;
                                } else if (buyItem.typeName != null && buyItem.typeName.toLowerCase() == "seasons"
                                  && buyItem.documentName.toLowerCase() == item.seasonName.toLowerCase()) {
                                  item.temp_promotion_id = promo.id;
                                  item.temp_isBuyItem = true;
                                  item.temp_buyItemType = buyItem.typeName;
                                  item.temp_buyItemValue = buyItem.documentCode;
                                } else if (buyItem.typeName != null && buyItem.typeName.toLowerCase() == "productgroup"
                                  && buyItem.documentName.toLowerCase() == item.productGroupName.toLowerCase()) {
                                  item.temp_promotion_id = promo.id;
                                  item.temp_isBuyItem = true;
                                  item.temp_buyItemType = buyItem.typeName;
                                  item.temp_buyItemValue = buyItem.documentCode;
                                } else if (buyItem.typeName != null && buyItem.typeName.toLowerCase() == "style"
                                  && buyItem.documentName.toLowerCase() == item.styleCode.toLowerCase()) {
                                  item.temp_promotion_id = promo.id;
                                  item.temp_isBuyItem = true;
                                  item.temp_buyItemType = buyItem.typeName;
                                  item.temp_buyItemValue = buyItem.documentCode;
                                }
                                // coupon does not implemented
                              }
                            }

                          }
                          // decide whether this item falls under buy item
                          if (promo.promotionType.toLowerCase() == "quantity based promotion") {
                            if (promo.getItemTypeList != null && promo.getItemTypeList.length > 0) {
                              for (let getItem of promo.getItemTypeList) {
                                if (getItem != null && item.temp_isGetItem == false) {

                                  if (getItem.typeName != null && getItem.typeName.toLowerCase() == "all"
                                    && getItem.documentCode.toLowerCase() == "all") {
                                    item.temp_promotion_id = promo.id;
                                    item.temp_isGetItem = true;
                                    item.temp_getItemType = getItem.typeName;
                                    item.temp_getItemValue = getItem.documentCode;
                                    item.temp_getDisVal = getItem.discountValue == null ? 0 : getItem.discountValue;
                                    item.temp_getDisType = getItem.discountType == null || getItem.discountType == "" ? "Percentage" : getItem.discountType;
                                  } else if (getItem.typeName != null && getItem.typeName.toLowerCase() == "stylesegmentation"
                                    && getItem.documentName.toLowerCase() == item.afSegamationName.toLowerCase()) {
                                    item.temp_promotion_id = promo.id;
                                    item.temp_isGetItem = true;
                                    item.temp_getItemType = getItem.typeName;
                                    item.temp_getItemValue = getItem.documentCode;
                                    item.temp_getDisVal = getItem.discountValue == null ? 0 : getItem.discountValue;
                                    item.temp_getDisType = getItem.discountType == null || getItem.discountType == "" ? "Percentage" : getItem.discountType;
                                  } else if (getItem.typeName != null && getItem.typeName.toLowerCase() == "year"
                                    && getItem.documentName.toLowerCase() == item.year.toLowerCase()) {
                                    item.temp_promotion_id = promo.id;
                                    item.temp_isGetItem = true;
                                    item.temp_getItemType = getItem.typeName;
                                    item.temp_getItemValue = getItem.documentCode;
                                    item.temp_getDisVal = getItem.discountValue == null ? 0 : getItem.discountValue;
                                    item.temp_getDisType = getItem.discountType == null || getItem.discountType == "" ? "Percentage" : getItem.discountType;
                                  } else if (getItem.typeName != null && getItem.typeName.toLowerCase() == "brand"
                                    && getItem.documentCode.toLowerCase() == item.brandCode.toLowerCase()) {
                                    item.temp_promotion_id = promo.id;
                                    item.temp_isGetItem = true;
                                    item.temp_getItemType = getItem.typeName;
                                    item.temp_getItemValue = getItem.documentCode;
                                    item.temp_getDisVal = getItem.discountValue == null ? 0 : getItem.discountValue;
                                    item.temp_getDisType = getItem.discountType == null || getItem.discountType == "" ? "Percentage" : getItem.discountType;
                                  } else if (getItem.typeName != null && getItem.typeName.toLowerCase() == "subbrand"
                                    && getItem.documentCode.toLowerCase() == item.subBrandCode.toLowerCase()) {
                                    item.temp_promotion_id = promo.id;
                                    item.temp_isGetItem = true;
                                    item.temp_getItemType = getItem.typeName;
                                    item.temp_getItemValue = getItem.documentCode;
                                    item.temp_getDisVal = getItem.discountValue == null ? 0 : getItem.discountValue;
                                    item.temp_getDisType = getItem.discountType == null || getItem.discountType == "" ? "Percentage" : getItem.discountType;
                                  } else if (getItem.typeName != null && getItem.typeName.toLowerCase() == "seasons"
                                    && getItem.documentName.toLowerCase() == item.seasonName.toLowerCase()) {
                                    item.temp_promotion_id = promo.id;
                                    item.temp_isGetItem = true;
                                    item.temp_getItemType = getItem.typeName;
                                    item.temp_getItemValue = getItem.documentCode;
                                    item.temp_getDisVal = getItem.discountValue == null ? 0 : getItem.discountValue;
                                    item.temp_getDisType = getItem.discountType == null || getItem.discountType == "" ? "Percentage" : getItem.discountType;
                                  } else if (getItem.typeName != null && getItem.typeName.toLowerCase() == "productgroup"
                                    && getItem.documentName.toLowerCase() == item.productGroupName.toLowerCase()) {
                                    item.temp_promotion_id = promo.id;
                                    item.temp_isGetItem = true;
                                    item.temp_getItemType = getItem.typeName;
                                    item.temp_getItemValue = getItem.documentCode;
                                    item.temp_getDisVal = getItem.discountValue == null ? 0 : getItem.discountValue;
                                    item.temp_getDisType = getItem.discountType == null || getItem.discountType == "" ? "Percentage" : getItem.discountType;
                                  } else if (getItem.typeName != null && getItem.typeName.toLowerCase() == "style"
                                    && getItem.documentName.toLowerCase() == item.styleCode.toLowerCase()) {
                                    item.temp_promotion_id = promo.id;
                                    item.temp_isGetItem = true;
                                    item.temp_getItemType = getItem.typeName;
                                    item.temp_getItemValue = getItem.documentCode;
                                    item.temp_getDisVal = getItem.discountValue == null ? 0 : getItem.discountValue;
                                    item.temp_getDisType = getItem.discountType == null || getItem.discountType == "" ? "Percentage" : getItem.discountType;
                                  }
                                  // coupon does not implemented
                                }
                              }
                            }
                          }
                        }
                      }
                    }

                    let item_buyItem = this.item_details.filter(x => x.temp_promotion_id == promo.id
                      && x.temp_isBuyItem == true && (x.appliedPromotionID == null || x.appliedPromotionID == ""));

                    let temp_subTotal = item_buyItem
                      .filter(x => x.invoiceType.toLowerCase() != "promotion" && x.isFreeItem == false && x.temp_isBuyItem == true)
                      .reduce((sum, current) => sum + current.price, 0);

                    if (temp_subTotal >= promo.buyItemOptionalAmount) {
                      if (promo.type.toLowerCase() == "fixed price") {
                        allow_multiple_promotion = this.fixed_price_promotion(item_buyItem, promo, this.promo_group_id);
                      } else if (promo.type.toLowerCase() == "bonus buys") {
                        if (promo.promotionType.toLowerCase() == "amount based promotion") {
                          allow_multiple_promotion = this.amount_based_promotion(item_buyItem, promo, this.promo_group_id);

                        } else if (promo.promotionType.toLowerCase() == "quantity based promotion") {
                          if (item_buyItem != null && item_buyItem.length >= promo.buyOptionalCount) {
                            let item_getItem = this.item_details.filter(x => x.temp_promotion_id == promo.id
                              && x.temp_isGetItem == true && (x.appliedPromotionID == null || x.appliedPromotionID == ""));

                            if (item_getItem != null && item_getItem.length >= promo.getOptionalCount) {
                              let buy_count: number = 0, get_count: number = 0;
                              let buy_length: number = 0, get_length: number = 0, temp_length: number = 0;

                              temp_length = promo.buyOptionalCount == null || promo.buyOptionalCount == 0 ? 1 : promo.buyOptionalCount;
                              buy_length = item_buyItem.length / temp_length;
                              temp_length = promo.getOptionalCount == null || promo.getOptionalCount == 0 ? 1 : promo.getOptionalCount;
                              get_length = item_getItem.length / temp_length;

                              if (promo.lowestValue == false && promo.lowestValueWithGroup == false) {
                                allow_multiple_promotion = this.quantity_based_simple(buy_length, get_length
                                  , item_buyItem, item_getItem, promo, this.promo_group_id);

                              } else if (promo.lowestValue == true && promo.lowestValueWithGroup == false) {
                                allow_multiple_promotion = this.quantity_based_lowest_value(buy_length, get_length
                                  , item_buyItem, item_getItem, promo, this.promo_group_id);
                              } else if (promo.lowestValue == false && promo.lowestValueWithGroup == true) {
                                allow_multiple_promotion = this.quantity_based_lowest_value_group(buy_length, get_length
                                  , item_buyItem, item_getItem, promo, this.promo_group_id);
                              }
                            }
                          }
                        }
                      }
                    } else {
                      this.item_details = this.item_details.map((o, i) => ({
                        ...o,
                        temp_promotion_id: 0,
                        temp_isBuyItem: false,
                        temp_buyItemType: "",
                        temp_buyItemValue: ""
                      }));
                    }
                  }

                }
              }
            }
          }
          if (this.item_details != null && this.item_details.length > 0) {
            for (let item of this.item_details) {
              if (item.temp_promotion_type == "bbb" || item.temp_promotion_type == "ggg"
                || item.temp_promotion_type == "ppp") {
                // if (item.appliedPromotionID == null || item.appliedPromotionID == "") {
                item.appliedPromotionID = "";
                item.syncFailedReason = "";
                item.promoGroupID = 0;
                item.specialPromoDiscount = 0;
                item.specialPromoDiscountPercentage = 0;
                item.specialPromoDiscountType = "";
                item.promotionAmount = 0;
                item.temp_color = "";
                item.temp_promotion_id = 0;
                item.type = "Item";
                item.invoiceType = "Item";
                item.promotionName = "";
                item.promtionApplied = false;
                item.isPromoExcludeItem = false;
                item.isFreeItem = false;

                item.temp_isGetItem = false;
                item.temp_getItemType = "";
                item.temp_getItemValue = "";

                item.temp_isBuyItem = false;
                item.temp_buyItemType = "";
                item.temp_buyItemValue = "";
                item.temp_promotion_type = "";
                // }
              }
            }
          }
        }
      }
    }


    // Promotion Discount logic
    if (this.item_details != null && this.item_details.length > 0) {
      // this.item_details = this.item_details.sort((a, b) => (a.promoGroupID < b.promoGroupID ? -1 : 1));
      let discount_excluded_items: number = 0;
      let discount_applied: boolean = false;
      let discount_exceeded: boolean = false;
      this.invoice.appliedPromotionID = "";

      for (let item of this.item_details) {
        item.serialNo = this.item_details.indexOf(item, 0) + 1;
        item.price = item.price == null ? 0 : parseFloat(item.price.toFixed(this.decimalPlaces));
        item.discountType = this.invoice.totalDiscountType == null ? 'Amount' : this.invoice.totalDiscountType;
        item.discountAmount = 0;

        if (item.appliedPromotionID != null && item.appliedPromotionID != "") {
          let pl = this.store_promotions.filter(x => x.promotionCode == item.appliedPromotionID);
          this.invoice.appliedPromotionID += this.invoice.appliedPromotionID == "" ? item.appliedPromotionID : "," + item.appliedPromotionID;
        if (pl != null && pl.length > 0) {
            let promo = pl[0];
            let exclude_discount: boolean = promo != null && promo.exculdeDiscountItems != null ? promo.exculdeDiscountItems : false;
            if (exclude_discount == true) {
              discount_excluded_items += 1;
              item.temp_discount_excluded = true;
            } else {
              item.temp_discount_excluded = false;
            }
            if (item.temp_promotion_type == "fixed") {
              item.lineTotal = parseFloat((item.promotionAmount).toFixed(this.decimalPlaces));
              item.discountRemarks = item.discountRemarks == null ? "" : item.discountRemarks;
              item.discountRemarks += " Price fixed : " + item.lineTotal.toFixed(this.decimalPlaces) + " " + this.user_details.currencyCode;
            } else if (item.temp_promotion_type == "amount") {

              if (item.specialPromoDiscountType == "Amount") {
                let temp_subTotal: number = this.invoice.subTotalAmount;

                if (promo.appliedType.toLowerCase() == "apply on buy items") {
                  temp_subTotal = this.item_details
                    .filter(x => x.appliedPromotionID.toLowerCase() == item.appliedPromotionID.toLowerCase()
                      && x.invoiceType.toLowerCase() != "promotion" && x.isFreeItem == false)
                    .reduce((sum, current) => sum + current.price, 0);
                } else {
                  temp_subTotal = this.item_details
                    .filter(x => x.invoiceType.toLowerCase() != "promotion" && x.isFreeItem == false)
                    .reduce((sum, current) => sum + current.price, 0);
                }

                let temp_disc_percent = parseFloat(((item.specialPromoDiscount / temp_subTotal) * 100).toFixed(2));
                let line_dis = (item.price / 100) * temp_disc_percent;

                item.lineTotal = parseFloat((item.price - line_dis).toFixed(this.decimalPlaces));
                item.specialPromoDiscountPercentage = line_dis;
                if(line_dis != 0){
                  item.discountRemarks = item.discountRemarks == null ? "" : item.discountRemarks;
                  item.discountRemarks += " Promo discount : " + line_dis.toFixed(this.decimalPlaces) + " " + this.user_details.currencyCode;
                }

              } else {
                item.lineTotal = parseFloat((item.price - ((item.price * item.specialPromoDiscount) / 100)).toFixed(this.decimalPlaces));
                item.specialPromoDiscountPercentage = parseFloat((item.specialPromoDiscount).toFixed(2));
                if(item.price - item.lineTotal != 0){
                  item.discountRemarks = item.discountRemarks == null ? "" : item.discountRemarks;
                  item.discountRemarks += " Promo discount : " + (item.price - item.lineTotal).toFixed(this.decimalPlaces) + " " + this.user_details.currencyCode ;
                }
              }


            } else if (item.temp_promotion_type == "quantity") {
              if (item.isFreeItem == true) {
                if (item.specialPromoDiscountType == "Amount") {
                  item.lineTotal = parseFloat((item.price - item.specialPromoDiscount).toFixed(this.decimalPlaces));
                  item.specialPromoDiscountPercentage = parseFloat(((item.specialPromoDiscount / item.price) * 100).toFixed(2));
                  if(item.specialPromoDiscount != 0){
                    item.discountRemarks = item.discountRemarks == null ? "" : item.discountRemarks;
                    item.discountRemarks += " Promo discount : " + item.specialPromoDiscount.toFixed(this.decimalPlaces) + " " + this.user_details.currencyCode ;
                  }

                } else {
                  item.lineTotal = parseFloat((item.price - ((item.price * item.specialPromoDiscount) / 100)).toFixed(this.decimalPlaces));
                  item.specialPromoDiscountPercentage = parseFloat((item.specialPromoDiscount).toFixed(2));

                  if(item.price - item.lineTotal != 0){
                    item.discountRemarks = item.discountRemarks == null ? "" : item.discountRemarks;
                    item.discountRemarks += " Promo discount : " + (item.price - item.lineTotal).toFixed(this.decimalPlaces) + " " + this.user_details.currencyCode ;
                  }

                  if(item.specialPromoDiscount == 100){
                    item.discountRemarks = "Free Item";
                  }
                }
              } else {
                item.lineTotal = item.price;
              }
            } else {
              item.lineTotal = parseFloat((item.price).toFixed(this.decimalPlaces));
            }
          }
          else {
            item.lineTotal = parseFloat((item.price).toFixed(this.decimalPlaces));
          }
        } else {
          item.lineTotal = parseFloat((item.price).toFixed(this.decimalPlaces));
          item.temp_discount_excluded = false;
        }
      }

      // Discount logic
      if (this.invoice.totalDiscountType != null && this.invoice.totalDiscountType.toLowerCase() == "percentage") {
        dis_percentage = this.invoice.totalDiscountPercentage == null ? 0 : this.invoice.totalDiscountPercentage;
        if (dis_percentage > 0) {
          discount_applied = true;
        }
      } else if (this.invoice.totalDiscountType != null && this.invoice.totalDiscountType.toLowerCase() == "amount") {
        dis_amount = this.invoice.totalDiscountAmount == null ? 0 : this.invoice.totalDiscountAmount;
        if (dis_amount > 0) {
          discount_applied = true;
        }
        if (this.item_details != null && this.item_details.length > 0) {
          for (let item of this.item_details) {
            if (item.temp_discount_excluded != true) {
              sub1 += item.lineTotal == null ? 0 : item.lineTotal;
            }
          }
        }
        if (sub1 > 0 && dis_amount > 0) {
          if (sub1 >= dis_amount) {
            // dis_percentage = parseFloat(((dis_amount * 100) / sub1).toFixed(2));
            dis_percentage = (dis_amount * 100) / sub1;
          } else {
            discount_applied = false;
            discount_exceeded = true;
            this.invoice.totalDiscountAmount = 0;
            this.current_discount_type = "Amount";
            this.current_discount_value = 0;
            this.current_discount_remarks = "";
          }
        }
      }



      for (let item of this.item_details) {
        let exclude_discount: boolean = false;
        if (item.appliedPromotionID != null && item.appliedPromotionID != "") {
          let pl = this.store_promotions.filter(x => x.promotionCode == item.appliedPromotionID);
          if (pl != null && pl.length > 0) {
            let promo = pl[0];
            exclude_discount = promo != null && promo.exculdeDiscountItems != null ? promo.exculdeDiscountItems : false;
          }
        }
        if (exclude_discount == false) {
          item.discountType = this.invoice.totalDiscountType == null ? 'Amount' : this.invoice.totalDiscountType;
          item.discountAmount = parseFloat(((item.lineTotal * dis_percentage) / 100).toFixed(this.decimalPlaces));
          item.lineTotal = parseFloat((item.lineTotal - item.discountAmount).toFixed(this.decimalPlaces));

          if(item.discountAmount > 0){
            item.discountRemarks = item.discountRemarks == null ? "" : item.discountRemarks;
            item.discountRemarks += " Line discount : " + (item.discountAmount).toFixed(this.decimalPlaces) + " " + this.user_details.currencyCode;
          }

        }
        item.sellingPrice = parseFloat(((item.lineTotal * 100) / (100 + this.taxPercentage)).toFixed(this.decimalPlaces));
        // item.sellingPrice = (item.lineTotal * 100) / (100 + this.taxPercentage);

        // item.sellingPrice = this.taxPercentage == null || this.taxPercentage == 0 ? parseFloat(item.lineTotal.toFixed(this.decimalPlaces))
        //   : parseFloat(((item.lineTotal * 100) / (100 + this.taxPercentage)).toFixed(this.decimalPlaces));

        /* Shankar Removed Decimal Places*/
        item.taxAmount = this.taxPercentage == null || this.taxPercentage == 0 ? 0
          : parseFloat((item.lineTotal - item.sellingPrice).toFixed(this.decimalPlaces));
        item.qty = item.qty == null ? 0 : item.qty;

        // "Senthamil_Changes"
        // let dFloor: number = Math.floor(item.sellingPrice / this.promotionRoundOff) * this.promotionRoundOff;

        if (item.appliedPromotionID != null && item.appliedPromotionID != "") {
          let dFloor: number = 0;

          if(this.promotionRoundOff != null && this.promotionRoundOff != 0){
            dFloor = Math.floor(item.sellingPrice / this.promotionRoundOff) * this.promotionRoundOff;
            item.lineTotal = Math.floor(item.lineTotal / this.promotionRoundOff) * this.promotionRoundOff;
          }else{
            dFloor = item.sellingPrice;
          }

          if (item.specialPromoDiscountPercentage != 100 && item.promtionApplied == true && item.discountAmount == 0) {
            item.sellingPrice = parseFloat((dFloor).toFixed(this.decimalPlaces));
          }
          item.sellingLineTotal = parseFloat((item.sellingPrice * item.qty).toFixed(this.decimalPlaces));

          if(item.sellingPrice != dFloor){
            let diff: number = dFloor - item.sellingPrice;
            if(diff != 0){
              item.specialPromoDiscount = item.specialPromoDiscount == null ? diff : item.specialPromoDiscount + diff;
              item.discountRemarks = item.discountRemarks == null ? "" : item.discountRemarks;
              item.discountRemarks += " Promo RoundOff :  " + diff.toFixed(this.decimalPlaces);
            }
          }
        }

        //item.lineTotal = parseFloat((item.lineTotal - item.taxAmount).toFixed(this.decimalPlaces));
        tot_qty += item.qty;
        sub2 += item.price;
        b4_rnd += item.lineTotal;
        //b4_rnd += item.sellingLineTotal
        dis2 += item.discountAmount;
        tax_amount += item.taxAmount;

        /*item.taxAmount = this.taxPercentage == null || this.taxPercentage == 0 ? 0
          : (item.lineTotal - item.sellingPrice);//.toFixed(this.decimalPlaces));
        item.qty = item.qty == null ? 0 : item.qty;
        item.sellingLineTotal = ((item.sellingPrice * item.qty));//.toFixed(this.decimalPlaces));

        tot_qty += item.qty;
        sub2 += item.price;
        b4_rnd += item.lineTotal;
        dis2 += item.discountAmount;
        tax_amount += item.taxAmount;*/

      }

      if (discount_excluded_items > 0 && discount_applied == true) {
        this.common.showMessage("info", "Discount not applicable for " + discount_excluded_items.toString() + " Promotion Items.")
      }
      if (discount_exceeded == true) {
        this.common.showMessage("warn", "Discount Exceeded Invoice Total");
      }
    }

    this.invoice.totalQty = tot_qty;
    this.invoice.subTotalAmount = Number(sub2.toFixed(this.decimalPlaces));
    this.invoice.subTotalWithTaxAmount = parseFloat((sub2 - tax_amount).toFixed(this.decimalPlaces));
    this.invoice.beforeRoundOffAmount = parseFloat(b4_rnd.toFixed(this.decimalPlaces));
    this.invoice.totalDiscountAmount = parseFloat(dis2.toFixed(this.decimalPlaces));
    this.invoice.taxAmount = parseFloat(tax_amount.toFixed(this.decimalPlaces));
    //this.invoice.netAmount = parseFloat(parseFloat(this.invoice.beforeRoundOffAmount.toFixed(this.roundOffDigits)).toFixed(this.decimalPlaces));

    let temp = parseFloat(this.invoice.beforeRoundOffAmount.toFixed(this.fixedDecimal));//.toFixed(this.decimalPlaces);
    let x = temp - this.invoice.beforeRoundOffAmount;
    // "Senthamil_Changes"
    let y: number = parseFloat((Math.floor(this.invoice.beforeRoundOffAmount / 1) * 1).toFixed(this.fixedDecimal));
    if(this.roundOffDigits != null && this.roundOffDigits > 0){
      y = parseFloat((Math.floor(this.invoice.beforeRoundOffAmount / this.roundOffDigits) * this.roundOffDigits).toFixed(this.fixedDecimal));
    }

    // let y = x > 0 ? parseFloat((Math.floor(this.invoice.beforeRoundOffAmount / this.roundOffDigits) * this.roundOffDigits).toFixed(this.fixedDecimal)) : this.invoice.beforeRoundOffAmount;
    // if (x < 0) {
    //   y = parseFloat((Math.floor(this.invoice.beforeRoundOffAmount / this.roundOffDigits) * this.roundOffDigits).toFixed(this.fixedDecimal));
    // }


    this.invoice.netAmount = parseFloat(y.toFixed(this.decimalPlaces));
    this.invoice.roundOffAmount = parseFloat((this.invoice.netAmount - this.invoice.beforeRoundOffAmount).toFixed(this.decimalPlaces));

    /*let dFloor = Math.floor(this.invoice.beforeRoundOffAmount/this.roundOffDigits)*this.roundOffDigits;
    this.invoice.netAmount = parseFloat(dFloor.toFixed(this.decimalPlaces));
    this.invoice.roundOffAmount =  parseFloat((this.invoice.netAmount - this.invoice.beforeRoundOffAmount).toFixed(this.decimalPlaces));*/

    // shankar Hide for round off calculation
    //this.invoice.netAmount = parseFloat(this.invoice.beforeRoundOffAmount.toFixed(this.roundOffDigits));
    //this.invoice.roundOffAmount = parseFloat((this.invoice.netAmount - this.invoice.beforeRoundOffAmount).toFixed(this.decimalPlaces));
    let remainingamount = parseFloat((this.invoice.beforeRoundOffAmount - this.invoice.netAmount).toFixed(this.decimalPlaces));
    let tempitemcount = this.item_details.length;
    let tempdiscount = remainingamount / tempitemcount;
    //let tempitem = this.item_details.sort(x=>x.price).reverse;
    // Descending Order
    let cloned = this.item_details.map(x => Object.assign({}, x));
    let tempitem = cloned.sort((a, b) => (a.price > b.price ? -1 : 1));
    // let tempitem = this.item_details;
    // tempitem
    if (tempitem != null && tempitem.length > 0) {
      let tempSerialNo = tempitem[0].serialNo;
      for (let item of this.item_details) {
        /*if(item.discountType==''){
          item.discountRemarks = "RoundOff discount";
          //item.lineTotal = item.lineTotal - tempdiscount;
        }
        else {
          item.discountRemarks = item.discountRemarks + " & RoundOff discount";
          //item.lineTotal = item.lineTotal - tempdiscount;
        }

        if (item.discountType == '') {
          item.discountType = "Amount";
        }*/
        if (item.serialNo == tempSerialNo) {
          item.discountAmount = item.discountAmount + parseFloat((tempdiscount).toFixed(this.decimalPlaces));
          //item.lineTotal = item.lineTotal - tempdiscount
          item.sellingPrice = item.sellingPrice - tempdiscount;
        }
      }
    }
    this.CalculateGiftPromotion();
  }

  clearGiftPromotion() {
    //this.item_details
    for (let item of this.item_details) {
      if (item.isGift == true) {
        item.appliedPromotionID = null;
        item.syncFailedReason = "";
        item.isGift = false;
        item.promtionApplied = false;
      }
    }
  }

  CalculateGiftPromotion() {
    let checkdiscount = false;
    //var _UIProcess = new UIProcess();
    if (this.store_promotions != null) {
      var PromoRecord1 = this.store_promotions.filter(x => x.promotionType == "Gift Based Promotion");//.FirstOrDefault();
      if (PromoRecord1.length > 0) {
        let tempNetAmount = this.invoice.netAmount;
        let tempGiftBillAmount = PromoRecord1[0].giftBillAmount;
        let tempGiftQty = PromoRecord1[0].giftQuantity;
        let tempMaxGift = PromoRecord1[0].maxGiftPerInvoice;
        let tempMultiGift = PromoRecord1[0].multiApplyForReceipt;
        let tempTotalPrice = 0;
        let tempTotalTax = 0;

        /*tempInvoice: Array<MInvoiceDetail>();
        tempInvoiceOrder: Array<MInvoiceDetail>();*/
        let tempInvoice = this.item_details;

        tempInvoice = this.item_details;
        let tempInvoiceOrder = tempInvoice.filter(x => x.invoiceType == "Item");
        tempInvoiceOrder.sort((a, b) => (a.price > b.price ? -1 : 1));

        if (tempNetAmount > tempGiftBillAmount) {

          // does the Customer or Customer Group in Exclusion list?
          let customer_excluded: boolean = false;
          if (PromoRecord1[0].customerList != null && PromoRecord1[0].customerList.length > 0) {
            let customer_group_x_list = PromoRecord1[0].customerList.filter(x => x.typeName.toLowerCase() == "customergroup"
              && x.documentCode.toLowerCase() == this.invoice.customerGroupCode.toLowerCase());
            let customer_x_list = PromoRecord1[0].customerList.filter(x => x.typeName.toLowerCase() == "customer"
              && x.documentCode.toLowerCase() == this.invoice.customerCode.toLowerCase());

            if (customer_group_x_list != null && customer_group_x_list.length > 0) {
              customer_excluded = true;
            }
            if (customer_x_list != null && customer_x_list.length > 0) {
              customer_excluded = true;
            }
          }
          if (customer_excluded == false) {
            let GiftitemCount = this.item_details.filter(x => x.invoiceType == "Gift Item").length;

            for (let j = 0; j < tempInvoiceOrder.length; j++) {
              for (let i = 0; i < PromoRecord1[0].getItemTypeList.length; i++) {

                let temptax = tempInvoiceOrder[j].taxAmount;

                if (tempInvoiceOrder[j].promtionApplied == false && tempInvoiceOrder[j].isGift == false
                  && ((PromoRecord1[0].getItemTypeList[i].typeName.toLowerCase() == "all"
                    && PromoRecord1[0].getItemTypeList[i].documentCode.toLowerCase() == "all"))
                  || (PromoRecord1[0].getItemTypeList[i].typeName.toLowerCase() == "year"
                    && tempInvoiceOrder[j].year.toLowerCase() == PromoRecord1[0].getItemTypeList[i].documentName.toLowerCase())
                  || (PromoRecord1[0].getItemTypeList[i].typeName.toLowerCase() == "brand"
                    && tempInvoiceOrder[j].brandID.toString().toLowerCase() == PromoRecord1[0].getItemTypeList[i].documentID.toString().toLowerCase())
                  || (PromoRecord1[0].getItemTypeList[i].typeName.toLowerCase() == "subbrand"
                    && tempInvoiceOrder[j].subBrandCode.toLowerCase() == PromoRecord1[0].getItemTypeList[i].documentCode.toLowerCase())
                  || (PromoRecord1[0].getItemTypeList[i].typeName.toLowerCase() == "seasons"
                    && tempInvoiceOrder[j].seasonName.toLowerCase() == PromoRecord1[0].getItemTypeList[i].documentName.toLowerCase())
                  || (PromoRecord1[0].getItemTypeList[i].typeName.toLowerCase() == "productgroup"
                    && tempInvoiceOrder[j].productGroupName.toLowerCase() == PromoRecord1[0].getItemTypeList[i].documentName.toLowerCase())
                  || (PromoRecord1[0].getItemTypeList[i].typeName.toLowerCase() == "style"
                    && tempInvoiceOrder[j].styleCode.toLowerCase() == PromoRecord1[0].getItemTypeList[i].documentName.toLowerCase())
                  || (PromoRecord1[0].getItemTypeList[i].typeName.toLowerCase() == "sku"
                    && tempInvoiceOrder[j].skuCode.toLowerCase() == PromoRecord1[0].getItemTypeList[i].documentName.toLowerCase())) {


                  GiftitemCount = GiftitemCount + 1;
                  let price = tempInvoiceOrder[j].price;
                  let tempremainingamount = tempNetAmount - price;
                  if (tempremainingamount >= (GiftitemCount * tempGiftBillAmount) && tempMaxGift >= GiftitemCount) {
                    tempInvoiceOrder[j].taxAmount = 0;
                    tempInvoiceOrder[j].sellingLineTotal = tempInvoiceOrder[j].price;
                    tempInvoiceOrder[j].sellingPrice = tempInvoiceOrder[j].price;
                    tempInvoiceOrder[j].appliedPromotionID = PromoRecord1[0].promotionCode;
                    tempInvoiceOrder[j].syncFailedReason = PromoRecord1[0].promotionName;
                    tempInvoiceOrder[j].isGift = true;
                    tempInvoiceOrder[j].discountAmount = 0;
                    tempInvoiceOrder[j].discountRemarks = "Gift Item";
                    tempInvoiceOrder[j].temp_color = PromoRecord1[0].color;

                    this.invoice.netAmount = this.invoice.netAmount - tempInvoiceOrder[j].price;
                    this.invoice.taxAmount = this.invoice.taxAmount - temptax;
                    tempNetAmount = this.invoice.netAmount;
                    this.item_details = tempInvoice;
                    checkdiscount = true;
                  }
                  else {
                    break;
                  }
                }

              }
            }
          }

        }

      }
      if (checkdiscount == true) {
        //DiscountCalculation1();
      }
    }
    /*Decimal TaxAmt = InvoiceDetailsList.Where(x => x.IsFreeItem == false && x.IsGift == false).Sum(x => x.TaxAmount);
    txtTaxAmount.Text = _UIProcess.DisplayNumberingFormat(TaxAmt);*/
  }

  fixed_price_promotion(item_buyItem: Array<MInvoiceDetail>, promo: MPromotionMaster, promo_group_id: number) {
    let allow_multiple_promotion: boolean = true;
    let buy_count: number = 0;
    let promo_group: Array<any> = new Array<any>();
    if (item_buyItem != null && item_buyItem.length >= promo.buyOptionalCount) {
      this.promo_group_id = this.promo_group_id + 1;
      for (let buy of item_buyItem) {
        // "Senthamil_Changes"
        // if (buy_count < promo.buyOptionalCount) {
        buy_count += 1;
        let pItem = {
          appliedPromotionID: promo.promotionCode,
          syncFailedReason: promo.promotionName,
          temp_promotion_type: "fixed",
          temp_isBuyItem: buy.temp_isBuyItem,
          temp_isGetItem: buy.temp_isGetItem,
          price: buy.price,
          serialNo: buy.serialNo
        }
        promo_group.push(pItem);
        // }

        // "Senthamil_Changes"
        // if (buy_count == promo.buyOptionalCount) {
        // this.promo_group_id = this.promo_group_id + 1;
        buy_count = 0;
        allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
        if (promo_group != null && promo_group.length > 0) {
          for (let pg of promo_group) {
            let itemExists = this.item_details.filter(x => x.serialNo == pg.serialNo);
            if (itemExists != null && itemExists.length > 0) {
              let item0 = itemExists[0];
              if (item0.appliedPromotionID == null || item0.appliedPromotionID == "") {
                item0.appliedPromotionID = promo.promotionCode;
                item0.syncFailedReason = promo.promotionName;
                item0.promoGroupID = this.promo_group_id;
                item0.specialPromoDiscount = 0;
                item0.specialPromoDiscountPercentage = 0;
                item0.specialPromoDiscountType = "";
                item0.promotionAmount = promo.getItematFixedPrice != null ? promo.getItematFixedPrice : 0;
                item0.temp_color = promo.color;
                item0.type = "Item";
                item0.invoiceType = "Item";
                item0.promotionName = promo.promotionName;
                item0.promtionApplied = true;
                item0.isPromoExcludeItem = false;
                item0.isFreeItem = false;
                item0.temp_promotion_type = "fixed";
              }
            }
          }
          promo_group = new Array<any>();
        }
        // }
      }
    }
    return allow_multiple_promotion;
  }

  amount_based_promotion(item_buyItem: Array<MInvoiceDetail>, promo: MPromotionMaster, promo_group_id: number) {
    let allow_multiple_promotion: boolean = true;
    let buy_count: number = 0;
    let promo_group: Array<any> = new Array<any>();
    if (item_buyItem != null && item_buyItem.length >= promo.buyOptionalCount) {
      this.promo_group_id = this.promo_group_id + 1;
      for (let buy of item_buyItem) {
        // "Senthamil_Changes"
        // if (buy_count < promo.buyOptionalCount) {
        buy_count += 1;
        let pItem = {
          appliedPromotionID: promo.promotionCode,
          syncFailedReason: promo.promotionName,
          temp_promotion_type: "amount",
          temp_isBuyItem: buy.temp_isBuyItem,
          temp_isGetItem: buy.temp_isGetItem,
          price: buy.price,
          serialNo: buy.serialNo
        }
        promo_group.push(pItem);
        // }

        // "Senthamil_Changes"
        // if (buy_count == promo.buyOptionalCount) {
        this.promo_group_id = this.promo_group_id + 1;
        buy_count = 0;
        allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
        if (promo_group != null && promo_group.length > 0) {
          for (let pg of promo_group) {
            let itemExists = this.item_details.filter(x => x.serialNo == pg.serialNo);
            if (itemExists != null && itemExists.length > 0) {
              let item0 = itemExists[0];
              if (item0.appliedPromotionID == null || item0.appliedPromotionID == "") {
                item0.appliedPromotionID = promo.promotionCode;
                item0.syncFailedReason = promo.promotionName;
                item0.promoGroupID = this.promo_group_id;
                item0.specialPromoDiscount = promo.discountValue == null ? 0 : promo.discountValue;
                item0.specialPromoDiscountPercentage = 0;
                item0.specialPromoDiscountType = promo.discount == null ? "Amount" : promo.discount;
                item0.promotionAmount = 0;
                item0.temp_color = promo.color;
                item0.type = "Item";
                item0.invoiceType = "Item";
                item0.promotionName = promo.promotionName;
                item0.promtionApplied = true;
                item0.isPromoExcludeItem = false;
                item0.isFreeItem = false;
                item0.temp_promotion_type = "amount";
              }
            }
          }
          promo_group = new Array<any>();
        }
        // }
      }
    }
    return allow_multiple_promotion;
  }

  quantity_based_simple(buy_length: number, get_length: number, item_buyItem: Array<MInvoiceDetail>
    , item_getItem: Array<MInvoiceDetail>, promo: MPromotionMaster, promo_group_id: number) {

    let allow_multiple_promotion: boolean = true;
    let buy_count: number = 0, get_count: number = 0;
    if (buy_length == get_length) {
      for (let buy of item_buyItem) {
        let itemFound1 = item_getItem.filter(x => x.serialNo == buy.serialNo
          && x.appliedPromotionID == promo.promotionCode);
        let isInGetItem1: boolean = itemFound1 != null && itemFound1.length > 0 ? true : false;
        if (isInGetItem1 == false) {
          if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
            if (buy_count < promo.buyOptionalCount) {
              buy_count += 1
              buy.appliedPromotionID = promo.promotionCode;
              buy.syncFailedReason = promo.promotionName;
              buy.temp_promotion_type = "bbb";
            }
            if (buy_count == promo.buyOptionalCount) {
              for (let gett of item_getItem) {
                let itemFound = item_buyItem.filter(x => x.serialNo == gett.serialNo
                  && x.appliedPromotionID == promo.promotionCode);
                let isInBuyItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                if (gett.appliedPromotionID == null || gett.appliedPromotionID == "") {
                  if (isInBuyItem == false) {
                    if (get_count < promo.getOptionalCount) {
                      get_count += 1
                      gett.appliedPromotionID = promo.promotionCode;
                      gett.syncFailedReason = promo.promotionName;
                      gett.temp_promotion_type = "ggg";
                    }
                    if (get_count == promo.getOptionalCount && buy_count == promo.buyOptionalCount) {
                      get_count = 0;
                      buy_count = 0;
                      this.promo_group_id = this.promo_group_id + 1;
                      allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                      for (let buyApp of item_buyItem) {
                        if (buyApp.temp_promotion_type == "bbb" && buyApp.appliedPromotionID == promo.promotionCode) {
                          buyApp.appliedPromotionID = promo.promotionCode;
                          buyApp.syncFailedReason = promo.promotionName;
                          buyApp.promoGroupID = this.promo_group_id;
                          buyApp.specialPromoDiscount = 0;
                          buyApp.specialPromoDiscountPercentage = 0;
                          buyApp.specialPromoDiscountType = "";
                          buyApp.promotionAmount = 0;
                          buyApp.temp_color = promo.color;
                          buyApp.type = "Item";
                          buyApp.invoiceType = "Item";
                          buyApp.promotionName = promo.promotionName;
                          buyApp.promtionApplied = true;
                          buyApp.isPromoExcludeItem = false;
                          buyApp.isFreeItem = false;
                          buyApp.temp_promotion_type = "quantity";
                        }
                      }
                      for (let getApp of item_getItem) {
                        if (getApp.temp_promotion_type == "ggg" && getApp.appliedPromotionID == promo.promotionCode) {
                          getApp.appliedPromotionID = promo.promotionCode;
                          getApp.syncFailedReason = promo.promotionName;
                          getApp.promoGroupID = this.promo_group_id;
                          getApp.specialPromoDiscount = getApp.temp_getDisVal;
                          getApp.specialPromoDiscountPercentage = 0;
                          getApp.specialPromoDiscountType = getApp.temp_getDisType;
                          getApp.promotionAmount = 0;
                          getApp.temp_color = promo.color;
                          getApp.type = "Promotion";
                          getApp.invoiceType = "Promotion";
                          getApp.promotionName = promo.promotionName;
                          getApp.promtionApplied = true;
                          getApp.isPromoExcludeItem = false;
                          getApp.isFreeItem = true;
                          getApp.temp_promotion_type = "quantity";
                        }
                      }
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }

    } else if (buy_length < get_length) {
      for (let buy of item_buyItem) {
        let itemFound1 = item_getItem.filter(x => x.serialNo == buy.serialNo
          && x.appliedPromotionID == promo.promotionCode);
        let isInGetItem1: boolean = itemFound1 != null && itemFound1.length > 0 ? true : false;
        if (isInGetItem1 == false) {
          if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
            if (buy_count < promo.buyOptionalCount) {
              buy_count += 1
              buy.appliedPromotionID = promo.promotionCode;
              buy.syncFailedReason = promo.promotionName;
              buy.temp_promotion_type = "bbb";
            }
            if (buy_count == promo.buyOptionalCount) {
              for (let gett of item_getItem) {
                if (gett.temp_isBuyItem == false) {
                  let itemFound = item_buyItem.filter(x => x.serialNo == gett.serialNo
                    && x.appliedPromotionID == promo.promotionCode);
                  let isInBuyItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                  if (gett.appliedPromotionID == null || gett.appliedPromotionID == "") {
                    if (isInBuyItem == false) {
                      if (get_count < promo.getOptionalCount) {
                        get_count += 1
                        gett.appliedPromotionID = promo.promotionCode;
                        gett.syncFailedReason = promo.promotionName;
                        gett.temp_promotion_type = "ggg";
                      }
                      if (get_count == promo.getOptionalCount && buy_count == promo.buyOptionalCount) {
                        get_count = 0;
                        buy_count = 0;
                        this.promo_group_id = this.promo_group_id + 1;
                        allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                        for (let buyApp of item_buyItem) {
                          if (buyApp.temp_promotion_type == "bbb" && buyApp.appliedPromotionID == promo.promotionCode) {
                            buyApp.appliedPromotionID = promo.promotionCode;
                            buyApp.syncFailedReason = promo.promotionName;
                            buyApp.promoGroupID = this.promo_group_id;
                            buyApp.specialPromoDiscount = 0;
                            buyApp.specialPromoDiscountPercentage = 0;
                            buyApp.specialPromoDiscountType = "";
                            buyApp.promotionAmount = 0;
                            buyApp.temp_color = promo.color;
                            buyApp.type = "Item";
                            buyApp.invoiceType = "Item";
                            buyApp.promotionName = promo.promotionName;
                            buyApp.promtionApplied = true;
                            buyApp.isPromoExcludeItem = false;
                            buyApp.isFreeItem = false;
                            buyApp.temp_promotion_type = "quantity";
                          }
                        }
                        for (let getApp of item_getItem) {
                          if (getApp.temp_promotion_type == "ggg" && getApp.appliedPromotionID == promo.promotionCode) {
                            getApp.appliedPromotionID = promo.promotionCode;
                            getApp.syncFailedReason = promo.promotionName;
                            getApp.promoGroupID = this.promo_group_id;
                            getApp.specialPromoDiscount = getApp.temp_getDisVal;
                            getApp.specialPromoDiscountPercentage = 0;
                            getApp.specialPromoDiscountType = getApp.temp_getDisType;
                            getApp.promotionAmount = 0;
                            getApp.temp_color = promo.color;
                            getApp.type = "Promotion";
                            getApp.invoiceType = "Promotion";
                            getApp.promotionName = promo.promotionName;
                            getApp.promtionApplied = true;
                            getApp.isPromoExcludeItem = false;
                            getApp.isFreeItem = true;
                            getApp.temp_promotion_type = "quantity";
                          }
                        }
                        break;
                      }
                    }
                  }
                }
              }

              if (get_count < promo.getOptionalCount) {
                for (let gett of item_getItem) {
                  if (gett.temp_isBuyItem == true) {
                    let itemFound = item_buyItem.filter(x => x.serialNo == gett.serialNo
                      && x.appliedPromotionID == promo.promotionCode);
                    let isInBuyItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                    if (gett.appliedPromotionID == null || gett.appliedPromotionID == "") {
                      if (isInBuyItem == false) {
                        if (get_count < promo.getOptionalCount) {
                          get_count += 1
                          gett.appliedPromotionID = promo.promotionCode;
                          gett.syncFailedReason = promo.promotionName;
                          gett.temp_promotion_type = "ggg";
                        }
                        if (get_count == promo.getOptionalCount && buy_count == promo.buyOptionalCount) {
                          get_count = 0;
                          buy_count = 0;
                          this.promo_group_id = this.promo_group_id + 1;
                          allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                          for (let buyApp of item_buyItem) {
                            if (buyApp.temp_promotion_type == "bbb" && buyApp.appliedPromotionID == promo.promotionCode) {
                              buyApp.appliedPromotionID = promo.promotionCode;
                              buyApp.syncFailedReason = promo.promotionName;
                              buyApp.promoGroupID = this.promo_group_id;
                              buyApp.specialPromoDiscount = 0;
                              buyApp.specialPromoDiscountPercentage = 0;
                              buyApp.specialPromoDiscountType = "";
                              buyApp.promotionAmount = 0;
                              buyApp.temp_color = promo.color;
                              buyApp.type = "Item";
                              buyApp.invoiceType = "Item";
                              buyApp.promotionName = promo.promotionName;
                              buyApp.promtionApplied = true;
                              buyApp.isPromoExcludeItem = false;
                              buyApp.isFreeItem = false;
                              buyApp.temp_promotion_type = "quantity";
                            }
                          }
                          for (let getApp of item_getItem) {
                            if (getApp.temp_promotion_type == "ggg" && getApp.appliedPromotionID == promo.promotionCode) {
                              getApp.appliedPromotionID = promo.promotionCode;
                              getApp.syncFailedReason = promo.promotionName;
                              getApp.promoGroupID = this.promo_group_id;
                              getApp.specialPromoDiscount = getApp.temp_getDisVal;
                              getApp.specialPromoDiscountPercentage = 0;
                              getApp.specialPromoDiscountType = getApp.temp_getDisType;
                              getApp.promotionAmount = 0;
                              getApp.temp_color = promo.color;
                              getApp.type = "Promotion";
                              getApp.invoiceType = "Promotion";
                              getApp.promotionName = promo.promotionName;
                              getApp.promtionApplied = true;
                              getApp.isPromoExcludeItem = false;
                              getApp.isFreeItem = true;
                              getApp.temp_promotion_type = "quantity";
                            }
                          }
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

    } else if (buy_length > get_length) {

      for (let get1 of item_getItem) {
        let itemFound1 = item_buyItem.filter(x => x.serialNo == get1.serialNo
          && x.appliedPromotionID == promo.promotionCode);
        let isInBuyItem1: boolean = itemFound1 != null && itemFound1.length > 0 ? true : false;
        if (isInBuyItem1 == false) {
          if (get1.appliedPromotionID == null || get1.appliedPromotionID == "") {
            if (get_count < promo.getOptionalCount) {
              get_count += 1
              get1.appliedPromotionID = promo.promotionCode;
              get1.syncFailedReason = promo.promotionName;
              get1.temp_promotion_type = "ggg";
            }
            if (get_count == promo.getOptionalCount) {
              for (let buy of item_buyItem) {
                if (buy.temp_isGetItem == false) {
                  let itemFound = item_getItem.filter(x => x.serialNo == buy.serialNo
                    && x.appliedPromotionID == promo.promotionCode);
                  let isInGetItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                  if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
                    if (isInGetItem == false) {
                      if (buy_count < promo.buyOptionalCount) {
                        buy_count += 1
                        buy.appliedPromotionID = promo.promotionCode;
                        buy.syncFailedReason = promo.promotionName;
                        buy.temp_promotion_type = "bbb";
                      }
                      if (buy_count == promo.buyOptionalCount && get_count == promo.getOptionalCount) {
                        get_count = 0;
                        buy_count = 0;
                        this.promo_group_id = this.promo_group_id + 1;
                        allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                        for (let buyApp of item_buyItem) {
                          if (buyApp.temp_promotion_type == "bbb" && buyApp.appliedPromotionID == promo.promotionCode) {
                            buyApp.appliedPromotionID = promo.promotionCode;
                            buyApp.syncFailedReason = promo.promotionName;
                            buyApp.promoGroupID = this.promo_group_id;
                            buyApp.specialPromoDiscount = 0;
                            buyApp.specialPromoDiscountPercentage = 0;
                            buyApp.specialPromoDiscountType = "";
                            buyApp.promotionAmount = 0;
                            buyApp.temp_color = promo.color;
                            buyApp.type = "Item";
                            buyApp.invoiceType = "Item";
                            buyApp.promotionName = promo.promotionName;
                            buyApp.promtionApplied = true;
                            buyApp.isPromoExcludeItem = false;
                            buyApp.isFreeItem = false;
                            buyApp.temp_promotion_type = "quantity";
                          }
                        }
                        for (let getApp of item_getItem) {
                          if (getApp.temp_promotion_type == "ggg" && getApp.appliedPromotionID == promo.promotionCode) {
                            getApp.appliedPromotionID = promo.promotionCode;
                            getApp.syncFailedReason = promo.promotionName;
                            getApp.promoGroupID = this.promo_group_id;
                            getApp.specialPromoDiscount = getApp.temp_getDisVal;
                            getApp.specialPromoDiscountPercentage = 0;
                            getApp.specialPromoDiscountType = getApp.temp_getDisType;
                            getApp.promotionAmount = 0;
                            getApp.temp_color = promo.color;
                            getApp.type = "Promotion";
                            getApp.invoiceType = "Promotion";
                            getApp.promotionName = promo.promotionName;
                            getApp.promtionApplied = true;
                            getApp.isPromoExcludeItem = false;
                            getApp.isFreeItem = true;
                            getApp.temp_promotion_type = "quantity";
                          }
                        }
                        break;
                      }
                    }
                  }
                }
              }

              if (buy_count < promo.buyOptionalCount) {
                for (let buy of item_buyItem) {
                  if (buy.temp_isGetItem == true) {
                    let itemFound = item_getItem.filter(x => x.serialNo == buy.serialNo
                      && x.appliedPromotionID == promo.promotionCode);
                    let isInGetItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                    if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
                      if (isInGetItem == false) {
                        if (buy_count < promo.buyOptionalCount) {
                          buy_count += 1
                          buy.appliedPromotionID = promo.promotionCode;
                          buy.syncFailedReason = promo.promotionName;
                          buy.temp_promotion_type = "bbb";
                        }
                        if (buy_count == promo.buyOptionalCount && get_count == promo.getOptionalCount) {
                          get_count = 0;
                          buy_count = 0;
                          this.promo_group_id = this.promo_group_id + 1;
                          allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                          for (let buyApp of item_buyItem) {
                            if (buyApp.temp_promotion_type == "bbb" && buyApp.appliedPromotionID == promo.promotionCode) {
                              buyApp.appliedPromotionID = promo.promotionCode;
                              buyApp.syncFailedReason = promo.promotionName;
                              buyApp.promoGroupID = this.promo_group_id;
                              buyApp.specialPromoDiscount = 0;
                              buyApp.specialPromoDiscountPercentage = 0;
                              buyApp.specialPromoDiscountType = "";
                              buyApp.promotionAmount = 0;
                              buyApp.temp_color = promo.color;
                              buyApp.type = "Item";
                              buyApp.invoiceType = "Item";
                              buyApp.promotionName = promo.promotionName;
                              buyApp.promtionApplied = true;
                              buyApp.isPromoExcludeItem = false;
                              buyApp.isFreeItem = false;
                              buyApp.temp_promotion_type = "quantity";
                            }
                          }
                          for (let getApp of item_getItem) {
                            if (getApp.temp_promotion_type == "ggg" && getApp.appliedPromotionID == promo.promotionCode) {
                              getApp.appliedPromotionID = promo.promotionCode;
                              getApp.syncFailedReason = promo.promotionName;
                              getApp.promoGroupID = this.promo_group_id;
                              getApp.specialPromoDiscount = getApp.temp_getDisVal;
                              getApp.specialPromoDiscountPercentage = 0;
                              getApp.specialPromoDiscountType = getApp.temp_getDisType;
                              getApp.promotionAmount = 0;
                              getApp.temp_color = promo.color;
                              getApp.type = "Promotion";
                              getApp.invoiceType = "Promotion";
                              getApp.promotionName = promo.promotionName;
                              getApp.promtionApplied = true;
                              getApp.isPromoExcludeItem = false;
                              getApp.isFreeItem = true;
                              getApp.temp_promotion_type = "quantity";
                            }
                          }
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return allow_multiple_promotion;
  }

  quantity_based_lowest_value(buy_length: number, get_length: number, item_buyItem: Array<MInvoiceDetail>
    , item_getItem: Array<MInvoiceDetail>, promo: MPromotionMaster, promo_group_id: number) {

    let allow_multiple_promotion: boolean = true;
    let buy_count: number = 0, get_count: number = 0;
    let item_getItem_asc = item_getItem.sort((a, b) => (a.price < b.price ? -1 : 1));
    if (item_getItem_asc != null && item_getItem_asc.length > 0) {
      for (let get1 of item_getItem_asc) {
        let itemFound1 = item_buyItem.filter(x => x.serialNo == get1.serialNo
          && x.appliedPromotionID == promo.promotionCode);
        let isInBuyItem: boolean = itemFound1 != null && itemFound1.length > 0 ? true : false;
        if (isInBuyItem == false) {
          if (get1.appliedPromotionID == null || get1.appliedPromotionID == "") {
            if (get_count < promo.getOptionalCount) {
              get_count += 1
              get1.appliedPromotionID = promo.promotionCode;
              get1.syncFailedReason = promo.promotionName;
              get1.temp_promotion_type = "ggg";
            }
            if (get_count == promo.getOptionalCount) {
              for (let buy of item_buyItem) {
                if (buy.temp_isGetItem == false) {
                  let itemFound = item_getItem.filter(x => x.serialNo == buy.serialNo
                    && x.appliedPromotionID == promo.promotionCode);
                  let isInGetItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                  if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
                    if (isInGetItem == false) {
                      if (buy_count < promo.buyOptionalCount) {
                        buy_count += 1
                        buy.appliedPromotionID = promo.promotionCode;
                        buy.syncFailedReason = promo.promotionName;
                        buy.temp_promotion_type = "bbb";
                      }
                      if (buy_count == promo.buyOptionalCount && get_count == promo.getOptionalCount) {
                        get_count = 0;
                        buy_count = 0;
                        this.promo_group_id = this.promo_group_id + 1;
                        allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                        for (let buyApp of item_buyItem) {
                          if (buyApp.temp_promotion_type == "bbb" && buyApp.appliedPromotionID == promo.promotionCode) {
                            buyApp.appliedPromotionID = promo.promotionCode;
                            buyApp.syncFailedReason = promo.promotionName;
                            buyApp.promoGroupID = this.promo_group_id;
                            buyApp.specialPromoDiscount = 0;
                            buyApp.specialPromoDiscountPercentage = 0;
                            buyApp.specialPromoDiscountType = "";
                            buyApp.promotionAmount = 0;
                            buyApp.temp_color = promo.color;
                            buyApp.type = "Item";
                            buyApp.invoiceType = "Item";
                            buyApp.promotionName = promo.promotionName;
                            buyApp.promtionApplied = true;
                            buyApp.isPromoExcludeItem = false;
                            buyApp.isFreeItem = false;
                            buyApp.temp_promotion_type = "quantity";
                          }
                        }
                        for (let getApp of item_getItem) {
                          if (getApp.temp_promotion_type == "ggg" && getApp.appliedPromotionID == promo.promotionCode) {
                            getApp.appliedPromotionID = promo.promotionCode;
                            getApp.syncFailedReason = promo.promotionName;
                            getApp.promoGroupID = this.promo_group_id;
                            getApp.specialPromoDiscount = getApp.temp_getDisVal;
                            getApp.specialPromoDiscountPercentage = 0;
                            getApp.specialPromoDiscountType = getApp.temp_getDisType;
                            getApp.promotionAmount = 0;
                            getApp.temp_color = promo.color;
                            getApp.type = "Promotion";
                            getApp.invoiceType = "Promotion";
                            getApp.promotionName = promo.promotionName;
                            getApp.promtionApplied = true;
                            getApp.isPromoExcludeItem = false;
                            getApp.isFreeItem = true;
                            getApp.temp_promotion_type = "quantity";
                          }
                        }
                        break;
                      }
                    }
                  }
                }
              }

              if (buy_count < promo.buyOptionalCount) {
                let item_buyItem_desc = item_buyItem.sort((a, b) => (a.price > b.price ? -1 : 1));
                if (item_buyItem_desc != null && item_buyItem_desc.length > 0) {
                  for (let buy of item_buyItem_desc) {
                    if (buy.temp_isGetItem == true) {
                      let itemFound = item_getItem.filter(x => x.serialNo == buy.serialNo
                        && x.appliedPromotionID == promo.promotionCode);
                      let isInGetItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                      if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
                        if (isInGetItem == false) {
                          if (buy_count < promo.buyOptionalCount) {
                            buy_count += 1
                            buy.appliedPromotionID = promo.promotionCode;
                            buy.syncFailedReason = promo.promotionName;
                            buy.temp_promotion_type = "bbb";
                          }
                          if (buy_count == promo.buyOptionalCount && get_count == promo.getOptionalCount) {
                            get_count = 0;
                            buy_count = 0;
                            this.promo_group_id = this.promo_group_id + 1;
                            allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                            for (let buyApp of item_buyItem) {
                              if (buyApp.temp_promotion_type == "bbb" && buyApp.appliedPromotionID == promo.promotionCode) {
                                buyApp.appliedPromotionID = promo.promotionCode;
                                buyApp.syncFailedReason = promo.promotionName;
                                buyApp.promoGroupID = this.promo_group_id;
                                buyApp.specialPromoDiscount = 0;
                                buyApp.specialPromoDiscountPercentage = 0;
                                buyApp.specialPromoDiscountType = "";
                                buyApp.promotionAmount = 0;
                                buyApp.temp_color = promo.color;
                                buyApp.type = "Item";
                                buyApp.invoiceType = "Item";
                                buyApp.promotionName = promo.promotionName;
                                buyApp.promtionApplied = true;
                                buyApp.isPromoExcludeItem = false;
                                buyApp.isFreeItem = false;
                                buyApp.temp_promotion_type = "quantity";
                              }
                            }
                            for (let getApp of item_getItem) {
                              if (getApp.temp_promotion_type == "ggg" && getApp.appliedPromotionID == promo.promotionCode) {
                                getApp.appliedPromotionID = promo.promotionCode;
                                getApp.syncFailedReason = promo.promotionName;
                                getApp.promoGroupID = this.promo_group_id;
                                getApp.specialPromoDiscount = getApp.temp_getDisVal;
                                getApp.specialPromoDiscountPercentage = 0;
                                getApp.specialPromoDiscountType = getApp.temp_getDisType;
                                getApp.promotionAmount = 0;
                                getApp.temp_color = promo.color;
                                getApp.type = "Promotion";
                                getApp.invoiceType = "Promotion";
                                getApp.promotionName = promo.promotionName;
                                getApp.promtionApplied = true;
                                getApp.isPromoExcludeItem = false;
                                getApp.isFreeItem = true;
                                getApp.temp_promotion_type = "quantity";
                              }
                            }
                            break;
                          }
                        }
                      }
                    }

                  }
                }
              }

            }
          }
        }

      }
    }
    return allow_multiple_promotion;
  }

  quantity_based_lowest_value_group(buy_length: number, get_length: number, item_buyItem: Array<MInvoiceDetail>
    , item_getItem: Array<MInvoiceDetail>, promo: MPromotionMaster, promo_group_id: number) {

    let allow_multiple_promotion: boolean = true;
    let buy_count: number = 0, get_count: number = 0, temp_length: number = 0;
    let iterate: boolean = true;
    let isAllocated: boolean = false;
    while (iterate) {
      let item_getItem_new = item_getItem.filter(x => x.temp_promotion_id == promo.id
        && x.temp_isGetItem == true && (x.appliedPromotionID == null || x.appliedPromotionID == ""));

      let item_buyItem_new = item_buyItem.filter(x => x.temp_promotion_id == promo.id
        && x.temp_isBuyItem == true && (x.appliedPromotionID == null || x.appliedPromotionID == ""));

      if (item_getItem_new == null || item_getItem_new.length <= 0) {
        iterate = false;
      } else if (item_buyItem_new == null || item_buyItem_new.length <= 0) {
        iterate = false;
      } else {
        temp_length = promo.buyOptionalCount == null || promo.buyOptionalCount == 0 ? 1 : promo.buyOptionalCount;
        buy_length = item_buyItem.length / temp_length;
        temp_length = promo.getOptionalCount == null || promo.getOptionalCount == 0 ? 1 : promo.getOptionalCount;
        get_length = item_getItem.length / temp_length;
        isAllocated = false;
        if (get_length <= buy_length) {
          // For Each Get Item [Method 1]
          for (let get1 of item_getItem) {
            let itemFound1 = item_buyItem.filter(x => x.serialNo == get1.serialNo
              && x.appliedPromotionID == promo.promotionCode);
            let isInBuyItem1: boolean = itemFound1 != null && itemFound1.length > 0 ? true : false;
            if (isInBuyItem1 == false) {
              if (get1.appliedPromotionID == null || get1.appliedPromotionID == "") {
                if (get_count < promo.getOptionalCount) {
                  get_count += 1
                  get1.appliedPromotionID = promo.promotionCode;
                  get1.syncFailedReason = promo.promotionName;
                  get1.temp_promotion_type = "ppp";
                }

                if (get_count == promo.getOptionalCount) {
                  // For Each Buy Item [Method 1] => BuyItem not in GetItemList
                  for (let buy of item_buyItem) {
                    if (buy.temp_isGetItem == false) {
                      let itemFound = item_getItem.filter(x => x.serialNo == buy.serialNo
                        && x.appliedPromotionID == promo.promotionCode);
                      let isInGetItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                      if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
                        if (isInGetItem == false) {
                          if (buy_count < promo.buyOptionalCount) {
                            buy_count += 1;
                            buy.appliedPromotionID = promo.promotionCode;
                            buy.syncFailedReason = promo.promotionName;
                            buy.temp_promotion_type = "ppp";
                          }

                          if (buy_count == promo.buyOptionalCount && get_count == promo.getOptionalCount) {
                            // If both BuyOptionalCount & GetOptionalCount satisfied [Method 1] => BuyItem not in GetItemList
                            get_count = 0;
                            buy_count = 0;
                            this.promo_group_id = this.promo_group_id + 1;
                            allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                            isAllocated = true;
                            // Find minimum in this group [Method 1]
                            let get_items_temp = this.item_details.filter(x => x.temp_isGetItem == true
                              && x.appliedPromotionID == promo.promotionCode && x.temp_promotion_type == "ppp");
                            let get_items = get_items_temp.sort((a, b) => (a.price < b.price ? -1 : 1));
                            if (get_items != null && get_items.length > 0) {
                              for (let get2 of get_items) {
                                if (get_count < promo.getOptionalCount) {
                                  get_count += 1;
                                  get2.appliedPromotionID = promo.promotionCode;
                                  get2.syncFailedReason = promo.promotionName;
                                  get2.promoGroupID = this.promo_group_id;
                                  get2.specialPromoDiscount = get2.temp_getDisVal;
                                  get2.specialPromoDiscountPercentage = 0;
                                  get2.specialPromoDiscountType = get2.temp_getDisType;
                                  get2.promotionAmount = 0;
                                  get2.temp_color = promo.color;
                                  get2.type = "Promotion";
                                  get2.invoiceType = "Promotion";
                                  get2.promotionName = promo.promotionName;
                                  get2.promtionApplied = true;
                                  get2.isPromoExcludeItem = false;
                                  get2.isFreeItem = true;
                                  get2.temp_promotion_type = "quantity";
                                }
                                if (get_count == promo.getOptionalCount) {
                                  get_count = 0;
                                  for (let pg of this.item_details) {
                                    if (pg.appliedPromotionID == promo.promotionCode && pg.temp_promotion_type == "ppp") {
                                      pg.appliedPromotionID = promo.promotionCode;
                                      pg.syncFailedReason = promo.promotionName;
                                      pg.promoGroupID = this.promo_group_id;
                                      pg.specialPromoDiscount = 0;
                                      pg.specialPromoDiscountPercentage = 0;
                                      pg.specialPromoDiscountType = "";
                                      pg.promotionAmount = 0;
                                      pg.temp_color = promo.color;
                                      pg.type = "Item";
                                      pg.invoiceType = "Item";
                                      pg.promotionName = promo.promotionName;
                                      pg.promtionApplied = true;
                                      pg.isPromoExcludeItem = false;
                                      pg.isFreeItem = false;
                                      pg.temp_promotion_type = "quantity";
                                    }
                                  }
                                  break;
                                }
                              }
                            }
                            if (isAllocated == true) {
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                  // If BuyOptionalCount not satisfied [Method 1] => BuyItem also in GetItems list
                  if (buy_count < promo.buyOptionalCount) {
                    for (let buy of item_buyItem) {
                      if (buy.temp_isGetItem == true) {
                        let itemFound = item_getItem.filter(x => x.serialNo == buy.serialNo
                          && x.appliedPromotionID == promo.promotionCode);
                        let isInGetItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                        if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
                          if (isInGetItem == false) {
                            if (buy_count < promo.buyOptionalCount) {
                              buy_count += 1;
                              buy.appliedPromotionID = promo.promotionCode;
                              buy.syncFailedReason =promo.promotionName;
                              buy.temp_promotion_type = "ppp";
                            }


                            if (buy_count == promo.buyOptionalCount && get_count == promo.getOptionalCount) {
                              // BuyOptionalCount & GetOptionalCount Satisfied [Method 1] => BuyItem also in GetItems list
                              get_count = 0;
                              buy_count = 0;
                              this.promo_group_id = this.promo_group_id + 1;
                              allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                              isAllocated = true;
                              // Find minimum in this group [Method 2] New
                              let get_items_temp = this.item_details.filter(x => x.temp_isGetItem == true
                                && x.appliedPromotionID == promo.promotionCode && x.temp_promotion_type == "ppp");
                              let get_items = get_items_temp.sort((a, b) => (a.price < b.price ? -1 : 1));
                              if (get_items != null && get_items.length > 0) {
                                for (let get2 of get_items) {
                                  if (get_count < promo.getOptionalCount) {
                                    get_count += 1;
                                    get2.appliedPromotionID = promo.promotionCode;
                                    get2.syncFailedReason = promo.promotionName;
                                    get2.promoGroupID = this.promo_group_id;
                                    get2.specialPromoDiscount = get2.temp_getDisVal;
                                    get2.specialPromoDiscountPercentage = 0;
                                    get2.specialPromoDiscountType = get2.temp_getDisType;
                                    get2.promotionAmount = 0;
                                    get2.temp_color = promo.color;
                                    get2.type = "Promotion";
                                    get2.invoiceType = "Promotion";
                                    get2.promotionName = promo.promotionName;
                                    get2.promtionApplied = true;
                                    get2.isPromoExcludeItem = false;
                                    get2.isFreeItem = true;
                                    get2.temp_promotion_type = "quantity";
                                  }
                                  if (get_count == promo.getOptionalCount) {
                                    get_count = 0;
                                    for (let pg of this.item_details) {
                                      if (pg.appliedPromotionID == promo.promotionCode && pg.temp_promotion_type == "ppp") {
                                        pg.appliedPromotionID = promo.promotionCode;
                                        pg.syncFailedReason = promo.promotionName;
                                        pg.promoGroupID = this.promo_group_id;
                                        pg.specialPromoDiscount = 0;
                                        pg.specialPromoDiscountPercentage = 0;
                                        pg.specialPromoDiscountType = "";
                                        pg.promotionAmount = 0;
                                        pg.temp_color = promo.color;
                                        pg.type = "Item";
                                        pg.invoiceType = "Item";
                                        pg.promotionName = promo.promotionName;
                                        pg.promtionApplied = true;
                                        pg.isPromoExcludeItem = false;
                                        pg.isFreeItem = false;
                                        pg.temp_promotion_type = "quantity";
                                      }
                                    }
                                    break;
                                  }
                                }
                              }
                              if (isAllocated == true) {
                                break;
                              }
                            }
                          }
                        }
                      }
                    }

                    // BuyOptionalCount not satisfying any case
                    if (buy_count == promo.buyOptionalCount && isAllocated == false) {
                      iterate = false;
                    }
                  }

                  if (isAllocated == true) {
                    break;
                  }
                }
              }
            }
          }
          if (get_count < promo.getOptionalCount && isAllocated == false) {
            iterate = false;
          }
        } else if (get_length > buy_length) {
          // For Each Buy Item [Method 2]
          for (let buy of item_buyItem) {
            let itemFound2 = item_getItem.filter(x => x.serialNo == buy.serialNo
              && x.appliedPromotionID == promo.promotionCode);
            let isInGetItem2: boolean = itemFound2 != null && itemFound2.length > 0 ? true : false;
            if (isInGetItem2 == false) {
              if (buy.appliedPromotionID == null || buy.appliedPromotionID == "") {
                if (buy_count < promo.buyOptionalCount) {
                  buy_count += 1;
                  buy.appliedPromotionID = promo.promotionCode;
                  buy.syncFailedReason = promo.promotionName;
                  buy.temp_promotion_type = "ppp";
                }

                if (buy_count == promo.buyOptionalCount) {
                  // For Each get Item [Method 2] => Get Item not in BuyItemList
                  for (let get1 of item_getItem) {
                    if (get1.temp_isBuyItem == false) {
                      let itemFound = item_buyItem.filter(x => x.serialNo == get1.serialNo
                        && x.appliedPromotionID == promo.promotionCode);
                      let isInBuyItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                      if (get1.appliedPromotionID == null || get1.appliedPromotionID == "") {
                        if (isInBuyItem == false) {
                          if (get_count < promo.getOptionalCount) {
                            get_count += 1;
                            get1.appliedPromotionID = promo.promotionCode;
                            get1.syncFailedReason = promo.promotionName;
                            get1.temp_promotion_type = "ppp";
                          }
                          if (get_count == promo.getOptionalCount && buy_count == promo.buyOptionalCount) {
                            // If BuyOptionalCount, GetOptionalCount satisfied [Method 2] => GetItem not in BuyItemsList
                            get_count = 0;
                            buy_count = 0;
                            this.promo_group_id = this.promo_group_id + 1;
                            allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                            isAllocated = true;
                            // Find minimum in this group [Method 2] New
                            let get_items_temp = this.item_details.filter(x => x.temp_isGetItem == true
                              && x.appliedPromotionID == promo.promotionCode && x.temp_promotion_type == "ppp");
                            let get_items = get_items_temp.sort((a, b) => (a.price < b.price ? -1 : 1));
                            if (get_items != null && get_items.length > 0) {
                              for (let get2 of get_items) {
                                if (get_count < promo.getOptionalCount) {
                                  get_count += 1;
                                  get2.appliedPromotionID = promo.promotionCode;
                                  get2.syncFailedReason = promo.promotionName;
                                  get2.promoGroupID = this.promo_group_id;
                                  get2.specialPromoDiscount = get2.temp_getDisVal;
                                  get2.specialPromoDiscountPercentage = 0;
                                  get2.specialPromoDiscountType = get2.temp_getDisType;
                                  get2.promotionAmount = 0;
                                  get2.temp_color = promo.color;
                                  get2.type = "Promotion";
                                  get2.invoiceType = "Promotion";
                                  get2.promotionName = promo.promotionName;
                                  get2.promtionApplied = true;
                                  get2.isPromoExcludeItem = false;
                                  get2.isFreeItem = true;
                                  get2.temp_promotion_type = "quantity";
                                }
                                if (get_count == promo.getOptionalCount) {
                                  get_count = 0;
                                  for (let pg of this.item_details) {
                                    if (pg.appliedPromotionID == promo.promotionCode && pg.temp_promotion_type == "ppp") {
                                      pg.appliedPromotionID = promo.promotionCode;
                                      pg.syncFailedReason = promo.promotionName;
                                      pg.promoGroupID = this.promo_group_id;
                                      pg.specialPromoDiscount = 0;
                                      pg.specialPromoDiscountPercentage = 0;
                                      pg.specialPromoDiscountType = "";
                                      pg.promotionAmount = 0;
                                      pg.temp_color = promo.color;
                                      pg.type = "Item";
                                      pg.invoiceType = "Item";
                                      pg.promotionName = promo.promotionName;
                                      pg.promtionApplied = true;
                                      pg.isPromoExcludeItem = false;
                                      pg.isFreeItem = false;
                                      pg.temp_promotion_type = "quantity";
                                    }
                                  }
                                  break;
                                }
                              }
                            }
                            if (isAllocated == true) {
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                  if (get_count < promo.getOptionalCount) {
                    // For Each get Item [Method 2] => Get Item also in BuyItemList
                    for (let get1 of item_getItem) {
                      if (get1.temp_isBuyItem == true) {
                        let itemFound = item_getItem.filter(x => x.serialNo == get1.serialNo
                          && x.appliedPromotionID == promo.promotionCode);
                        let isInBuyItem: boolean = itemFound != null && itemFound.length > 0 ? true : false;
                        if (get1.appliedPromotionID == null || get1.appliedPromotionID == "") {
                          if (isInBuyItem == false) {
                            if (get_count < promo.getOptionalCount) {
                              get_count += 1;
                              get1.appliedPromotionID = promo.promotionCode;
                              get1.syncFailedReason = promo.promotionName;
                              get1.temp_promotion_type = "ppp";
                            }

                            if (get_count == promo.getOptionalCount && buy_count == promo.buyOptionalCount) {
                              // If BuyOptionalCount, GetOptionalCount satisfied [Method 2] => GetItem also in BuyItemsList
                              get_count = 0;
                              buy_count = 0;
                              this.promo_group_id = this.promo_group_id + 1;
                              allow_multiple_promotion = promo.allowMultiPromotion == null ? false : promo.allowMultiPromotion;
                              isAllocated = true;

                              // Find minimum in this group [Method 2] New
                              let get_items_temp = this.item_details.filter(x => x.temp_isGetItem == true
                                && x.appliedPromotionID == promo.promotionCode && x.temp_promotion_type == "ppp");
                              let get_items = get_items_temp.sort((a, b) => (a.price < b.price ? -1 : 1));
                              if (get_items != null && get_items.length > 0) {
                                for (let get2 of get_items) {
                                  if (get_count < promo.getOptionalCount) {
                                    get_count += 1;
                                    get2.appliedPromotionID = promo.promotionCode;
                                    get2.syncFailedReason = promo.promotionName;
                                    get2.promoGroupID = this.promo_group_id;
                                    get2.specialPromoDiscount = get2.temp_getDisVal;
                                    get2.specialPromoDiscountPercentage = 0;
                                    get2.specialPromoDiscountType = get2.temp_getDisType;
                                    get2.promotionAmount = 0;
                                    get2.temp_color = promo.color;
                                    get2.type = "Promotion";
                                    get2.invoiceType = "Promotion";
                                    get2.promotionName = promo.promotionName;
                                    get2.promtionApplied = true;
                                    get2.isPromoExcludeItem = false;
                                    get2.isFreeItem = true;
                                    get2.temp_promotion_type = "quantity";
                                  }
                                  if (get_count == promo.getOptionalCount) {
                                    get_count = 0;
                                    for (let pg of this.item_details) {
                                      if (pg.appliedPromotionID == promo.promotionCode && pg.temp_promotion_type == "ppp") {
                                        pg.appliedPromotionID = promo.promotionCode;
                                        pg.syncFailedReason = promo.promotionName;
                                        pg.promoGroupID = this.promo_group_id;
                                        pg.specialPromoDiscount = 0;
                                        pg.specialPromoDiscountPercentage = 0;
                                        pg.specialPromoDiscountType = "";
                                        pg.promotionAmount = 0;
                                        pg.temp_color = promo.color;
                                        pg.type = "Item";
                                        pg.invoiceType = "Item";
                                        pg.promotionName = promo.promotionName;
                                        pg.promtionApplied = true;
                                        pg.isPromoExcludeItem = false;
                                        pg.isFreeItem = false;
                                        pg.temp_promotion_type = "quantity";
                                      }
                                    }
                                    break;
                                  }

                                }
                              }
                              if (isAllocated == true) {
                                break;
                              }
                            }
                          }
                        }
                      }
                    }
                    // If BuyOptionalCount, GetOptionalCount not satisfied for all the cases [Method 2]
                    if (get_count == promo.getOptionalCount && isAllocated == false) {
                      iterate = false;
                    }
                  }
                }
              }
            }
          }
          if (buy_count < promo.buyOptionalCount && isAllocated == false) {
            iterate = false;
          }
        }
      }
    }
    return allow_multiple_promotion;
  }

  void_item(item) {
    if (this.manager_OverRide.voidItem == true) {

      this.CurrentColorList = new Array<MStyleColorScale>();
      this.CurrentSizeList = new Array<MStyleColorScale>();
      this.current_item = new MInvoiceDetail();
      this.current_image = null;
      if (item.isCombo) {
        this.common.showMessage('info', 'You Cannot remove combo item in the List .');
      }
      else if (item.isHeader) {
        let cmbGrpID = item.comboGroupID;
        let toBeRemoved = this.item_details.filter(x => x.comboGroupID == cmbGrpID);
        if (toBeRemoved != null && toBeRemoved.length > 0) {
          for (let removing_item of toBeRemoved) {
            let items = this.item_details.filter(x => x.skuCode == removing_item.skuCode);
            let items_count = items != null ? items.length : 0;

            for (let temp_item of this.temp_item_details) {
              if (item.skuCode == temp_item.skuCode) {
                if (items_count > 1) {
                  temp_item.stock = temp_item.stock + 1;
                  break;
                } else {
                  const idx2 = this.temp_item_details.indexOf(temp_item, 0);
                  if (idx2 > -1) {
                    this.temp_item_details.splice(idx2, 1);
                    break;
                  }
                }
              }
            }

          }

          this.item_details = this.item_details.filter((i) => (toBeRemoved.indexOf(i) === -1));
          this.calculate();
          this.getLastItem();
        }
      }
      else {
        const idx = this.item_details.indexOf(item, 0);
        let items = this.item_details.filter(x => x.skuCode == item.skuCode);
        let items_count = items != null ? items.length : 0;

        for (let temp_item of this.temp_item_details) {
          if (item.skuCode == temp_item.skuCode) {
            if (items_count > 1) {
              temp_item.stock = temp_item.stock + 1;
              break;
            } else {
              const idx2 = this.temp_item_details.indexOf(temp_item, 0);
              if (idx2 > -1) {
                this.temp_item_details.splice(idx2, 1);
                break;
              }
            }
          }
        }

        if (idx > -1) {
          this.item_details.splice(idx, 1);
          this.calculate();
          this.getLastItem();
        }
      }

    }
    else {
      this.common.showMessage('info', 'You Dont have Permission to Delete item in list.');
    }
  }

  getLastItem() {
    let item: MInvoiceDetail = new MInvoiceDetail();
    if (this.item_details != null && this.item_details.length > 0) {
      for (let x of this.item_details) {
        item = x;

      }
      if (item != null) {
        this.current_image = item.skuImage;// == null || item.skuImage == '' ? this.temp_image : item.skuImage;

        let temp_item: MTempInvoiceDetail = {
          skuCode: item.skuCode,
          barCode: item.barCode,
          productGroupName: item.productGroupName,
          // skuImage: this.current_image,
          stock: 0
        };
        temp_item.skuImage = this.current_image;
        this.temp_SkuName = "";// item.skuName;
        this.temp_Size = ""; //item.sizeName;
        this.temp_color = ""; // item.colorName;

        this.current_item = temp_item;

        if (this.colorList != null && this.colorList.length > 0) {
          for (let cl of this.colorList) {
            if (cl.SKUCode === item.skuCode) {
              this.CurrentColorList.push(cl);
            }
          }
        }

        if (this.sizeList != null && this.sizeList.length > 0) {
          for (let cl of this.sizeList) {
            if (cl.SKUCode === item.skuCode) {
              this.CurrentSizeList.push(cl);
            }
          }
        }

      }

    }

  }

  hold_invoice() {
    // this.get_HoldDocumentNo();
    this.invoice.businessDate = new Date(this.logedpos_details.businessDate);
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.user_details.storeID.toString()
      + "&DocumentTypeID=69&business_date=" + this.common.toYMDFormat(this.invoice.businessDate))
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.hold_Document_No = data.documentNo != null ? data.documentNo : "";
          this.sales_hold_logic();
        } else {
          this.common.showMessage('warn', 'Failed to get Document Number.');
          this.hold_Document_No = '';
        }

        this.common.hideSpinner();
      });

  }

  sales_hold_logic() {
    if (this.hold_Document_No != null && this.hold_Document_No != "") {
      if (this.invoice == null) {
        this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
      }
      // else if (this.invoice.invoiceNo == null || this.invoice.invoiceNo == '') {
      //   this.common.showMessage("warn", "Can not Save, Document Number is empty.");
      // }
      else if (this.invoice.customerID == null || this.invoice.customerID == 0) {
        this.common.showMessage("warn", "Invalid Customer.");
      } else if (this.invoice.salesEmployeeID == null || this.invoice.salesEmployeeID == 0) {
        this.common.showMessage("warn", "Invalid Sales Employee.");
      } else if (this.invoice.totalQty == null || this.invoice.totalQty <= 0) {
        this.common.showMessage("warn", "Atleast one Invoice Item expected.");
        // } else if (this.invoice.subTotalAmount == null || this.invoice.subTotalAmount <= 0) {
        //   this.common.showMessage("warn", "Sub Total must be greater than zero.");
        // } else if (this.invoice.netAmount == null || this.invoice.netAmount < 0) {
        //   this.common.showMessage("warn", "Invoice Total must be non-negative.");
        // } else if (this.invoice.shiftID == null || this.invoice.shiftID == 0) {
        //   this.common.showMessage("warn", "Shift ID must be required.");
      }
      else if (confirm("Are You Sure You want to Hold this Invoice?")) {
        localStorage.setItem('payment_invoice', null);
        this.invoice.salesStatus = 'ParkSale';
        this.invoice.documentTypeID = 69; // Hold Invoice
        this.invoice.returnAmount = 0;
        this.invoice.receivedAmount = this.invoice.netAmount;
        this.invoice.invoiceDetailList = new Array<MInvoiceDetail>();
        this.invoice.invoiceDetailList = this.item_details;
        if (this.item_details != null && this.item_details.length > 0) {
          for (let item of this.item_details) {
            item.skuImage = '';
          }
        }
        this.common.showSpinner();
        this.api.postAPI("invoice", this.invoice).subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            this.common.showMessage('success', 'Invoice Holded.');
            //this.common.showMessage('success', data.displayMessage);
            this.PrintHoldInvoiceReceipt();
            this.clear_controls();
            localStorage.setItem('recall_invoice', null);
          } else {
            this.common.hideSpinner();
            let msg: string = data != null && data.displayMessage != null ? data.displayMessage : 'Failed to Save.';
            this.common.showMessage('error', msg);
          }

        });
      }
    }
    else {
      this.common.showMessage("warn", "Sales hold Document Number is Empty.");
    }
  }

  validate_price() {
    let isValid: boolean = false;
    if (this.invoice != null) {
      if (this.invoice.subTotalAmount != null && this.invoice.subTotalAmount > 0 &&
        this.invoice.netAmount != null && this.invoice.netAmount > 0) {
        isValid = true;
      } else {
        let allow_zero_price: boolean = false;
        if (this.retail_settings != null && this.retail_settings != undefined) {
          allow_zero_price = this.retail_settings.allowSalesForZeroPrice == null ? false : this.retail_settings.allowSalesForZeroPrice;
        }
        isValid = allow_zero_price;
      }
    }
    return isValid;
  }

  quick_pay() {
    if (this.invoice == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    } else if (this.invoice.invoiceNo == null || this.invoice.invoiceNo == '') {
      this.common.showMessage("warn", "Can not Save, Document Number is empty.");
    } else if (this.invoice.customerID == null || this.invoice.customerID == 0) {
      this.common.showMessage("warn", "Invalid Customer.");
    } else if (this.invoice.salesEmployeeID == null || this.invoice.salesEmployeeID == 0) {
      this.common.showMessage("warn", "Invalid Sales Employee.");
    }
    else if (this.myControl.value == "") {
      this.common.showMessage("warn", "Invalid Sales Employee.");
    }
    else if (this.invoice.totalQty == null || this.invoice.totalQty <= 0) {
      this.common.showMessage("warn", "Atleast one Invoice Item expected.");
    }

    // else if (this.invoice.subTotalAmount == null || this.invoice.subTotalAmount <= 0) {
    //   this.common.showMessage("warn", "Sub Total must be greater than zero.");
    // } else if (this.invoice.netAmount == null || this.invoice.netAmount < 0) {
    //   this.common.showMessage("warn", "Invoice Total must be non-negative.");
    // }

    else if (this.validate_price() == false) {
      this.common.showMessage("warn", "Invoice Total is zero.");
    }

    else if (this.invoice.shiftID == null || this.invoice.shiftID == 0) {
      this.common.showMessage("warn", "Shift ID must be required.");
    } else {
      localStorage.setItem('payment_invoice', null);
      this.invoice.salesStatus = 'Completed';
      this.invoice.returnAmount = 0;
      this.invoice.receivedAmount = this.invoice.netAmount;
      if (this.item_details != null && this.item_details.length > 0) {
        for (let item of this.item_details) {
          item.skuImage = '';
        }
      }


      this.invoice.invoiceDetailList = new Array<MInvoiceDetail>();
      this.invoice.invoiceDetailList = this.item_details;
      //this.invoice.businessDate

      let payment_details: MPaymentDetails = new MPaymentDetails();
      payment_details = {
        slNo: 1,
        businessDate: this.invoice.businessDate,
        fromCountryID: this.user_details.countryID,
        fromStoreID: this.user_details.storeID,
        mode: 'Cash',
        payCurrencyID: this.user_details.currencyID,
        payCurrency: this.user_details.currencyCode,
        changeCurrency: this.user_details.currencyCode,
        changeCurrencyID: this.user_details.currencyID,
        baseAmount: this.invoice.netAmount,
        receivedamount: this.invoice.netAmount,
        returnAmount: 0,
        balanceAmountToBePay: 0,
        isPaymentProcesser: false
      };

      this.invoice.paymentList = new Array<MPaymentDetails>();
      this.invoice.paymentList.push(payment_details);
      // this.payment_details= new Array<MPaymentDetails>();
      // this.payment_details= this.invoice.paymentList;
      this.common.showSpinner();
      this.api.postAPI("invoice", this.invoice).subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Invoice saved successfully.');
          this.common.showMessage('success', data.displayMessage);

          this.invoiceNo = this.invoice.invoiceNo;
          this.PrintInvoiceReceipt();

          //this.clear_controls();
          localStorage.setItem('recall_invoice', null);
        } else {
          this.common.hideSpinner();
          this.common.showMessage('error', 'Failed to Save.');
        }

      });
    }
  }

  PrintInvoiceReceipt() {
    this.getInvoiceReport1();
    // this.getInvoiceReport2();
    // this.getInvoiceReport3();
  }

  getInvoiceReport1() {

    // this.common.showSpinner();
    // this.api.getAPI("InvoiceReceipt1?invoice=" + this.invoiceNo)
    //   .subscribe((data) => {
    if (this.invoice != null) {

      this.InvoiceReportList1 = this.invoice;
      this.storeImage = this.user_details.storeImage == null || this.user_details.storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + this.user_details.storeImage;
      this.shopName = this.user_details.storeName != null ? this.user_details.storeName : "";
      this.posName = this.invoice.posCode != null ? this.invoice.posCode : "";
      this.invoiceNum = this.invoice.invoiceNo != null ? this.invoice.invoiceNo : "";
      this.date = this.common.toddmmmyyFormat(this.invoice.businessDate);
      this.time = this.common.tohhmmaFormat(this.invoice.businessDate);
      this.customerName = (this.logedpos_details.defaultCustomerName != null ? this.logedpos_details.defaultCustomerName : "") + '' + (this.logedpos_details.defaultPhoneNumber != null ? this.logedpos_details.defaultPhoneNumber : "");
      this.salesMan = this.invoice.salesEmployeeName != null ? this.invoice.salesEmployeeName : "";
      this.cashier = this.invoice.cashierCode != null ? this.invoice.cashierCode : "";
      this.taxNo = this.invoice.taxCode != null ? this.invoice.taxCode : "";
      this.totalDiscount = this.invoice.totalDiscountAmount != null ? this.invoice.totalDiscountAmount : 0;
      this.taxAmount = this.invoice.taxAmount != null ? this.invoice.taxAmount : 0;
      this.netAmount = this.invoice.netAmount != null ? this.invoice.netAmount : 0;
      this.paidAmount = this.invoice.paymentList[0].receivedamount != null ? this.invoice.paymentList[0].receivedamount : 0;
      this.customerBalance = this.invoice.paymentList[0].balanceAmountToBePay != null ? this.invoice.paymentList[0].balanceAmountToBePay : 0;
      this.footer = this.user_details.storeFooter != null ? this.user_details.storeFooter : "";
      this.discount = this.invoice.invoiceDetailList[0].discountAmount != null ? this.invoice.invoiceDetailList[0].discountAmount : 0;
      this.posTitle = this.user_details.posTitle != null ? this.user_details.posTitle : "";
      //this.decimalPlace = this.invoice.invoiceDetailList.decimalPlaces != null ? data.invoiceList[0].decimalPlaces : 0;

      this.InvoiceDetailsList = new Array<any>();

      this.totalPrice = 0;
      this.tottaxAmount = 0;
      this.billtotalQty = 0;

      for (let i = 0; i < this.invoice.invoiceDetailList.length; i++) {
        if (this.invoice.invoiceDetailList[i].qty != null) {
          this.billtotalQty = this.billtotalQty + this.invoice.invoiceDetailList[i].qty;
        }
        if (this.invoice.invoiceDetailList[i].price != null) {
          this.totalPrice = this.totalPrice + this.invoice.invoiceDetailList[i].sellingLineTotal;
        }

        if (this.invoice.invoiceDetailList[i].taxAmount != null) {
          this.tottaxAmount = this.tottaxAmount + this.invoice.invoiceDetailList[i].taxAmount;
        }

        try {
          let ic = this.invoice.invoiceDetailList[i].skuCode != null ? this.invoice.invoiceDetailList[i].skuCode : "";
          ic += this.invoice.invoiceDetailList[i].appliedPromotionID != null
                  && this.invoice.invoiceDetailList[i].appliedPromotionID != ''
                  && this.invoice.invoiceDetailList[i].appliedPromotionID != '0'
                ? "\n(" + this.invoice.invoiceDetailList[i].appliedPromotionID + ")"
                : "";

          ic += this.invoice.invoiceDetailList[i].discountRemarks == "Free Item" ? " - Free Item" : "";

          // let tempdata: any = {
          //   "itemCode": this.invoice.invoiceDetailList[i].skuCode != null ? this.invoice.invoiceDetailList[i].skuCode : "",
          //   "qty": this.invoice.invoiceDetailList[i].qty != null ? this.invoice.invoiceDetailList[i].qty : 0,
          //   "price": this.invoice.invoiceDetailList[i].sellingPrice != null ? this.invoice.invoiceDetailList[i].sellingPrice : 0
          // }

          let tempdata: any = {
            "itemCode": ic,
            "qty": this.invoice.invoiceDetailList[i].qty != null ? this.invoice.invoiceDetailList[i].qty : 0,
            "price": this.invoice.invoiceDetailList[i].sellingPrice != null ? this.invoice.invoiceDetailList[i].sellingPrice : 0
          }

          this.InvoiceDetailsList.push(tempdata);
        } catch (ex1) {

        }

      }

      this.invoicereceiptdetails = '';

      for (let i = 0; i < this.InvoiceDetailsList.length; i++) {
        this.invoicereceiptdetails = this.invoicereceiptdetails +
          '<tr>' +
          '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;font-weight:100">' + (i + 1) + '</h5></td>' +
          '<td style="width: 55%;text-align: left;font-weight: 100"><h5 style="margin: 5px;font-weight:100">' + this.InvoiceDetailsList[i].itemCode + '</h5></td>' +
          '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;font-weight:100">' + this.InvoiceDetailsList[i].qty + '</h5></td>' +
          '<td style="text-align: right;font-weight: 100"><h5 style="margin: 5px;font-weight:100">' + this.InvoiceDetailsList[i].price.toFixed(this.decimal_places) + '</h5></td>' +
          '</tr>'
      }

      if (this.tottaxAmount > 0) {
        this.header = 'فاتورة ضريبية","فاتوره';
      } else {
        // this.header = 'فاتوره';
        this.header = "إيصال الفاتورة";
      }



      // for(let i=0;i<this.decimalPlace;i++)
      // {
      //   if(this.decimalPlaces==null || this.decimalPlaces=='')
      //   {
      //     this.decimalPlaces = '.' + '0';
      //   }
      //   else
      //   {
      //     this.decimalPlaces = this.decimalPlaces + '0';
      //   }
      // }

      // << getInvoiceReport2

      this.amount = 0;
      this.knet = 0;
      this.visa = 0;
      this.creditcard = 0;
      // this.paymentCurrency = data.invoiceSubReceiptTList[1].paymentCurrency;
      this.paymentCurrency = "";

      this.InvoiceReportList2 = this.invoice.paymentList;
      if (this.InvoiceReportList2 != null && this.InvoiceReportList2.length > 0) {
        this.amount = this.InvoiceReportList2[0].baseAmount != null ? this.InvoiceReportList2[0].baseAmount : 0;
        this.knet = this.InvoiceReportList2[0].knet != null ? this.InvoiceReportList2[0].knet : 0;
        this.visa = this.InvoiceReportList2[0].visa != null ? this.InvoiceReportList2[0].visa : 0;
        this.creditcard = this.InvoiceReportList2[0].creditcard != null ? this.InvoiceReportList2[0].creditcard : 0;
        //this.paymentCurrency = this.InvoiceReportList2[1].paymentCurrency;
        this.paymentCurrency = this.InvoiceReportList2.length > 0 && this.InvoiceReportList2[0].payCurrency != null ? this.InvoiceReportList2[0].payCurrency : this.InvoiceReportList2[0].payCurrency;
      }


      this.paycash = 0;

      for (let i = 0; i < this.InvoiceReportList2.length; i++) {
        if (this.InvoiceReportList2[i] != null && this.InvoiceReportList2[i].receivedamount != null) {
          this.paycash = this.paycash + this.InvoiceReportList2[i].receivedamount;
        }

      }
      // getInvoiceReport2 >>

      // << getInvoiceReport3
      this.approvalNumberKNet = '';
      this.approvalNumberVisa = '';
      this.approvalNumberMaster = '';
      this.cardType = "";
      this.InvoiceReportList3 = this.invoice.paymentList;
      if (this.invoice.paymentList != null && this.invoice.paymentList.length > 0) {
        this.cardType = this.invoice.paymentList[0].cardType2 != null ? this.invoice.paymentList[0].cardType2 : "";

        if (this.invoice.paymentList[0].approveNo != null && this.invoice.paymentList[0].approveNo != "undefined") {
          if (this.cardType == 'K-Net') {
            this.approvalNumberKNet = this.invoice.paymentList[0].approveNo;
          }
          else if (this.cardType == 'Visa') {
            this.approvalNumberVisa = this.invoice.paymentList[0].approveNo;
          }
          else if (this.cardType == 'Master') {
            this.approvalNumberMaster = this.invoice.paymentList[0].approveNo;
          }
        }

      }
      if (this.invoiceNum != "") {
        this.api.getAPI("BarcodeGeneration?invoice=" + this.invoiceNum)
          .subscribe((data) => {
            if (data != null && data != '') {
              this.barcode = data == null || data == '' ? this.temp_image : 'data:image/gif;base64,' + data;
              this.clear_controls();
              this.getInvoiceReceiptHTML();
            }
            else {
              let msg: string = data != null
                && data.displayMessage != null
                && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              this.common.showMessage('warn', msg);
            }
          });
        // getInvoiceReport3 >>

      }


    } else {

      this.common.showMessage('warn', 'This Invoice is Null');
    }
    //   this.common.hideSpinner();
    // });
  }

  getInvoiceReport2() {
    this.common.showSpinner();
    this.api.getAPI("InvoiceReceipt2?invoice=" + this.invoiceNo)
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {

          this.InvoiceReportList2 = data.invoiceSubReceiptTList;
          this.amount = data.invoiceSubReceiptTList[0].amount;
          this.knet = data.invoiceSubReceiptTList[0].knet;
          this.visa = data.invoiceSubReceiptTList[0].visa;
          this.creditcard = data.invoiceSubReceiptTList[0].creditcard;
          this.paymentCurrency = data.invoiceSubReceiptTList[1].paymentCurrency;

          this.paycash = 0;

          for (let i = 0; i < this.InvoiceReportList2.length; i++) {
            this.paycash = this.paycash + this.InvoiceReportList2[i].paymentCash;
          }

        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        this.common.hideSpinner();
      });
  }

  getInvoiceReport3() {
    this.common.showSpinner();
    this.api.getAPI("InvoiceReceipt3?invoice=" + this.invoiceNo)
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {

          this.InvoiceReportList3 = data.approvalNumReceiptList;
          this.cardType = data.approvalNumReceiptList[0].cardType;

          if (this.cardType == 'K-Net') {
            this.approvalNumberKNet = data.approvalNumReceiptList[0].approvalNumber;
          }
          else if (this.cardType == 'Visa') {
            this.approvalNumberVisa = data.approvalNumReceiptList[0].approvalNumber;
          }
          else if (this.cardType == 'Master') {
            this.approvalNumberMaster = data.approvalNumReceiptList[0].approvalNumber;
          }
          else {
            this.approvalNumberKNet = '';
            this.approvalNumberVisa = '';
            this.approvalNumberMaster = '';
          }

          //this.getInvoiceReceiptHTML();

        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        this.common.hideSpinner();
      });
  }

  PrintHoldInvoiceReceipt() {
    this.getHoldInvoiceReport();
  }
  getHoldInvoiceReport() {
    if (this.invoice != null) {

      this.InvoiceReportList1 = this.invoice;
      this.storeImage = this.user_details.storeImage == null || this.user_details.storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + this.user_details.storeImage;
      this.shopName = this.user_details.storeName != null ? this.user_details.storeName : "";
      this.posName = this.invoice.posCode != null ? this.invoice.posCode : "";
      this.invoiceNum = this.hold_Document_No != null ? this.hold_Document_No : "";
      this.date = this.common.toddmmmyyFormat(this.invoice.businessDate);
      this.time = this.common.tohhmmaFormat(this.invoice.businessDate);
      this.customerName = (this.logedpos_details.defaultCustomerName != null ? this.logedpos_details.defaultCustomerName : "") + '' + (this.logedpos_details.defaultPhoneNumber != null ? this.logedpos_details.defaultPhoneNumber : "");
      this.salesMan = this.invoice.salesEmployeeName != null ? this.invoice.salesEmployeeName : "";
      this.cashier = this.invoice.cashierCode != null ? this.invoice.cashierCode : "";
      // this.customerBalance = this.invoice.paymentList[0].balanceAmountToBePay != null ? this.invoice.paymentList[0].balanceAmountToBePay : 0;
      this.footer = this.user_details.storeFooter != null ? this.user_details.storeFooter : "";
      //this.discount = this.invoice.invoiceDetailList[0].discountAmount != null ? this.invoice.invoiceDetailList[0].discountAmount : 0;
      this.posTitle = this.user_details.posTitle != null ? this.user_details.posTitle : "";

      this.InvoiceDetailsList = new Array<any>();

      this.totalPrice = 0;
      this.tottaxAmount = 0;
      this.billtotalQty = 0;

      for (let i = 0; i < this.invoice.invoiceDetailList.length; i++) {
        this.billtotalQty = this.billtotalQty + this.invoice.invoiceDetailList[i].qty;

        let tempdata: any = {
          "skuCode": this.invoice.invoiceDetailList[i].skuCode,
          "quantity": this.invoice.invoiceDetailList[i].qty
        }
        this.InvoiceDetailsList.push(tempdata);
      }

      this.invoicereceiptdetails = '';

      for (let i = 0; i < this.InvoiceDetailsList.length; i++) {
        this.invoicereceiptdetails = this.invoicereceiptdetails +
          '<tr>' +
          '<td style="text-align: center;font-weight: 100"><h5>' + (i + 1) + '</h5></td>' +
          '<td style="text-align: left;font-weight: 100"><h5>' + this.InvoiceDetailsList[i].skuCode + '</h5></td>' +
          '<td style="text-align: center;font-weight: 100"><h5>' + this.InvoiceDetailsList[i].quantity + '</h5></td>' +
          '</tr>'
      }

    }

    this.api.getAPI("BarcodeGeneration?invoice=" + this.hold_Document_No)
      .subscribe((data) => {
        if (data != null && data != '') {
          this.barcode = data == null || data == '' ? this.temp_image : 'data:image/gif;base64,' + data;
          this.getHoldInvoiceReceiptHTML();
          this.clear_controls();
        }
        else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        this.common.hideSpinner();
      });
  }
  getHoldInvoiceReceiptHTML() {
    this.invoicereceiptHTML = '<html>' +
      '<div style="width: 80mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
      '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
      '<h4 style="margin: 2mm 0mm;font-weight:900">*&nbsp;HOLD RECEIPT&nbsp;*</h4>' +
      '</div>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:550">Cashier: </h5>' +
      '</td>' +
      '<td style="text-align:left;">' +
      '<h5 style="margin: 5px;font-weight:100">' + this.cashier + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:550">Shop: </h5>' +
      '</td>' +
      '<td style="text-align:left;">' +
      '<h5 style="margin: 5px;font-weight:100">' + this.shopName + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:550">POS: </h5>' +
      '</td>' +
      '<td style="text-align:left;">' +
      '<h5 style="margin: 5px; font-weight: 100">' + this.posName + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:550">Invoice# </h5>' +
      '</td>' +
      '<td style="text-align: left;font-weight: 100">' +
      '<h5 style="margin: 5px;font-weight:100">' + this.invoiceNum + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:550">Date: </h5>' +
      '</td>' +
      '<td style="text-align: left;font-weight: 100">' +
      '<h5 style="margin: 5px;font-weight:100">' + this.date + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:550">Time: </h5>' +
      '</td>' +
      '<td style="text-align:left;font-weight:100">' +
      '<h5 style="margin: 5px;font-weight:100">' + this.time + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;height:5px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width:95%; border-collapse: collapse; margin: 0 auto;">' +
      '<thead>' +
      '<tr style="border-top: 1px solid #000; border-bottom: 2px solid #000;">' +
      '<th style="width: 10%;">Sl#</th>' +
      '<th style="width: 40%">Item Code</th>' +
      '<th style="width: 10%;">Quantity</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      this.invoicereceiptdetails +
      '</tbody>' +
      '<tfoot>' +
      '<tr style="border-top: 2px solid #000;border-bottom: 1px solid #000;">' +
      '<td></td>' +
      '<td style="text-align: left;width:40%;font-weight:550"><h5>Total Quantity</h5></td>' +
      '<td style="text-align: center;"><h5>' + this.billtotalQty + '</h5></td>' +
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
      '<td style="width: 50%;text-align:left">' +
      '<h5 style="margin: 2mm 0mm;font-weight:550"><u>Manager Name</u></h5>' +
      '</td>' +
      '<td style="width: 50%;text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:550"><u>Manager Signature</u></h5>' +
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
      '<div style="width: 100%; text-align: center;font-weight:100">' +
      '<h4 style="margin: 2mm 0mm;font-weight:100; font-size: 13px; margin-bottom: 14px;">' + this.footer + '</h4>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;height:50px">' +
      '<img src="' + this.barcode + '" />' +
      '</div>' +
      '</div>' +
      '</html>';
    //console.log(this.invoicereceiptHTML);
    this.onPrintHTML();
  }
  getInvoiceReceiptHTML() {
    this.invoicereceiptHTML = '<html>' +
      '<div style="width: 80mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
      '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:100">' +
      '<h4 style="margin: 5px">&nbsp;' + this.header + '&nbsp;</h4>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:100">' +
      '<h4 style="margin: 5px">*&nbsp;' + this.posTitle + '&nbsp;*</h4>' +
      '</div>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width: 30%;">' +
      '<h5 style="margin: 2px;font-weight: 550;">المحل/Shop : </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.shopName + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width:30%">' +
      '<h5 style="margin: 2px;font-weight: 550;">نقاط البيع/POS : </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.posName + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width:30%">' +
      '<h5 style="margin: 2px;font-weight: 550;">رقم الفاتورة /Invoice: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2px;;margin-right:10px;">' + this.invoiceNum + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width:20%">' +
      '<h5 style="margin: 2px;font-weight: 550;"> التاريخ /Date: </h5>' +
      '</td>' +
      '<td style="text-align:right;">' +
      '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.date + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2px;font-weight: 550;"> الوقت/Time: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin:2px;font-weight: 100;margin-right:10px;">' + this.time + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width:30%">' +
      '<h5 style="margin: 5px;font-weight: 550;">العميل /Customer: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight:100;margin-right:10px;">' + this.customerName + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width:30%">' +
      '<h5 style="margin: 2px; height: 15px;font-weight: 550;">البائع</h5>' +
      '<h5 style="margin: 2px;font-weight: 550;">/Salesman: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.salesMan + '</h5>' +
      '</td>' +
      '<td style="width:65%;">' +
      '<h5 style="margin: 2px;width:100%;font-weight: 550;">أمين الصندوق </h5>' +
      '<h5 style="margin: 2px;font-weight: 550;">/Cashier: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.cashier + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width:40%;">' +
      '<h5 style="margin: 2px;font-weight: 550;">ألرقم الضريبي للمؤسسة /Tax :</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.taxNo + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width:95%; border-collapse: collapse;">' +
      '<thead>' +
      '<tr style="border-top: 1px solid #000; border-bottom: 2px solid #000;">' +
      '<th style="width: 10%;text-align: center;">م</th>' +
      '<th style="width: 40%;text-align: center;">النوع</th>' +
      '<th style="width: 10%;text-align: center;">العدد</th>' +
      '<th style="width: 30%;text-align: right;">السعر</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      this.invoicereceiptdetails +
      '</tbody>' +
      '<tfoot>' +
      '<tr style="border-bottom: 1px solid #000;border-top: 2px solid #000;">' +
      '<td></td>' +
      '<td style="text-align: left;font-weight: 100"><h5  style="margin: 5px">اجمالي الكميه</h5></td>' +
      '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px">' + this.billtotalQty + '</h5></td>' +
      '<td></td>' +
      '</tr>' +
      '</tfoot>' +
      '</table>' +
      '<table style="width: 88%;margin-left: 28px;border-collapse: collapse;">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight: 550;"> المبلغ الاجمالي/Total Price:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: right;font-weight:100">' + this.totalPrice.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight: 550;"> ض.ق.م./Total Discount:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px; text-align: right;font-weight:100">' + this.totalDiscount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 2px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight: 550;"> 5% ضريبة القيمة  المضافة/Tax:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px; text-align: right;font-weight:100">' + this.taxAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 2px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight: 550;">  المبلغ الصافي/Net Amount:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px; text-align: right;font-weight:100">' + this.netAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 2px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight: 550;"> المبلغ المدفوع/Paid Amount:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px; text-align: right; font-weight: 100">' + this.paidAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 2px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight: 550;"> رصيد/Balance Amount:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: right;font-weight: 100">' + this.customerBalance.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight: 550;">المحل : </h5>' +
      '</td>' +
      '<td style="width: 80%;">' +
      '<h5 style="margin: 5px;font-weight: 100">  </h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%; border-collapse: collapse;">' +
      '<tr style="border-bottom: 2px solid #000;border-top: 1px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: left;font-weight: 550;"> نوعية الدفع </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight: 550;"> المبلغ المدفوع </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight: 550;"> رقم الموافقة </h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 1px solid #d0caca;">' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: left;font-weight:100"> نقدي/Cash: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight: 100">' + this.amount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight:100">  </h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 1px solid #d0caca;">' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: left;font-weight:100"> كي نت/Knet: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.knet.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.approvalNumberKNet + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 1px solid #d0caca;">' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: left;font-weight:100">بطاقة فيزا/Visa: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.visa.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.approvalNumberVisa + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 1px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: left;font-weight:100">بطاقة فيزا/Credit Card: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.creditcard.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.approvalNumberMaster + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;height:10px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%; border-collapse: collapse;" border="1">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;font-weight: 550;">' + this.paymentCurrency + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.paycash.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width:100%;">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 5px;text-align:center;font-weight:100">' + this.footer + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width:100%;height:50px">' +
      '<tr>' +
      '<td style="width: 100%; text-align: center;height:50px">' +
      '<img src="' + this.barcode + '" />' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '</div>' +
      '</html>';
    //console.log(this.invoicereceiptHTML);
    this.onPrintHTML();
  }

  onPrintHTML() {
    if (this.user_details.printCount > 0) {
      var printData = [];
      for (let i = 0; i < this.user_details.printCount; i++) {
        var printcount = {
          type: 'html',
          format: 'plain',
          data: this.invoicereceiptHTML
        }
        printData.push(printcount);
      }
      this.printService.printHTML(this.printerName, printData);
    }
    else {
      this.common.showMessage('info', 'No PrintCount Set.');
    }
    // var printData = [
    //   {
    //     type: 'html',
    //     format: 'plain',
    //     data: this.invoicereceiptHTML
    //   }
    // ];
    // this.printService.printHTML(this.printerName, printData);
  }

  goto_payment() {

    if (this.invoice == null) {
      this.common.showMessage("warn", "Invoice is invalid.");
    } else if (this.invoice.invoiceNo == null || this.invoice.invoiceNo == '') {
      this.common.showMessage("warn", "Can not Save, Document Number is empty.");
    } else if (this.invoice.customerID == null || this.invoice.customerID == 0) {
      this.common.showMessage("warn", "Invalid Customer.");
    } else if (this.invoice.salesEmployeeID == null || this.invoice.salesEmployeeID == 0) {
      this.common.showMessage("warn", "Invalid Sales Employee.");
    }
    else if (this.myControl.value == "") {
      this.common.showMessage("warn", "Invalid Sales Employee.");
    } else if (this.invoice.totalQty == null || this.invoice.totalQty <= 0) {
      this.common.showMessage("warn", "Atleast one Invoice Item expected.");
    } else if (this.invoice.subTotalAmount == null || this.invoice.subTotalAmount <= 0) {
      this.common.showMessage("warn", "Sub Total must be greater than zero.");
    } else if (this.invoice.netAmount == null || this.invoice.netAmount <= 0) {
      this.common.showMessage("warn", "Invoice Total must be greater than zero.");
    } else if (this.invoice.shiftID == null || this.invoice.shiftID == 0) {
      this.common.showMessage("warn", "Shift ID must be required.");
    } else {
      this.invoice.salesStatus = 'Completed';
      this.invoice.returnAmount = 0;
      this.invoice.receivedAmount = this.invoice.netAmount;
      this.invoice.invoiceDetailList = new Array<MInvoiceDetail>();
      this.invoice.invoiceDetailList = this.item_details;

      localStorage.setItem('payment_invoice', JSON.stringify(this.invoice));


      this.router.navigate(['payment']);
    }
  }

  goto_return() {
    localStorage.setItem('payment_invoice', null);
    this.router.navigate(['return']);
  }

  goto_exchange() {
    localStorage.setItem('payment_invoice', null);
    this.router.navigate(['exchange']);
  }

  create_customer() {
    localStorage.setItem('pos_mode', 'false');
    localStorage.setItem('from_pos', 'true');
    this.invoice.returnAmount = 0;
    this.invoice.receivedAmount = this.invoice.netAmount;
    this.invoice.invoiceDetailList = new Array<MInvoiceDetail>();
    this.invoice.invoiceDetailList = this.item_details;
    localStorage.setItem('payment_invoice', JSON.stringify(this.invoice));
    this.router.navigate(['CustomerAdd']);
  }

  edit_customer() {
    if (this.customer_info != null && this.customer_info.id != null && this.customer_info.id != 0) {
      localStorage.setItem('pos_mode', 'false');
      localStorage.setItem('from_pos', 'true');
      this.invoice.returnAmount = 0;
      this.invoice.receivedAmount = this.invoice.netAmount;
      this.invoice.invoiceDetailList = new Array<MInvoiceDetail>();
      this.invoice.invoiceDetailList = this.item_details;
      localStorage.setItem('payment_invoice', JSON.stringify(this.invoice));
      this.router.navigate(['CustomerEdit/' + this.customer_info.id.toString()]);
    } else {
      this.common.showMessage('warn', 'No Customer selected.');
    }

  }

  goto_stock() {
    localStorage.setItem('payment_invoice', null);
    this.router.navigate(['stock']);
  }

  goto_recall() {
    if (this.manager_OverRide.suspendRecall == true) {
      localStorage.setItem('payment_invoice', null);
      this.router.navigate(['recall-invoice']);
    }
    else {
      this.common.showMessage('info', 'You Dont have Permission to access Recall Suspend invoice.');
    }
  }

  goto_findStock() {
    localStorage.setItem('payment_invoice', null);
    this.router.navigate(['findStock']);
  }

  goto_invoice() {
    if (this.manager_OverRide.productSearch == true) {
      localStorage.setItem('payment_invoice', null);
      this.router.navigate(['searchInvoice']);
    }
    else {
      this.common.showMessage('info', 'You Dont have Permission to access Transaction Invoice Search.');
    }
  }

  goto_shiftOut() {
    localStorage.setItem('payment_invoice', null);
    this.router.navigate(['shiftout']);
  }

  goto_productsearch() {
    if (this.manager_OverRide.productSearch == true) {
      localStorage.setItem('payment_invoice', null);
      this.router.navigate(['productSearch']);
    }
    else {
      this.common.showMessage('info', 'You Dont have Permission to access Product Search.');
    }
  }

  goto_cashinsearch() {
    localStorage.setItem('pos_mode', 'false');
    localStorage.setItem('from_pos', 'true');
    this.router.navigate(['cash-in']);
  }

  goto_cashoutsearch() {
    localStorage.setItem('pos_mode', 'false');
    localStorage.setItem('from_pos', 'true');
    this.router.navigate(['cash-out']);
  }

  confirm_test() {
    this.common.showMessage('info', 'hi');
    this.confirm.confirm('Confirm', 'Do you realy want to cancel this Order?')
      .then((confirmed) => {
        if (confirmed == true) {
          this.common.showMessage('info', 'You Confirmed this Action.');
        }
      })
      .catch(() => {
        this.common.showMessage('info', 'You Cancelled this Action.');
      });

  }

  get_HoldDocumentNo() {
    this.invoice.businessDate = new Date(this.logedpos_details.businessDate);
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.user_details.storeID.toString()
      + "&DocumentTypeID=69&business_date=" + this.common.toYMDFormat(this.invoice.businessDate))
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.hold_Document_No = data.documentNo != null ? data.documentNo : "";
        } else {
          this.common.showMessage('warn', 'Failed to get Document Number.');
          this.hold_Document_No = '';
        }

        this.common.hideSpinner();
      });
  }



  soap_test() {
    // var stock = this.check_item_stock("15","455267");
    // console.log("stock");
    // console.log(stock);

    // this.getValueWithPromise();
    // this.getValueWithAsync();
  }

  // async async_check_item_stock

  check_item_stock(location_code: string, item_code: string) {
    // this.orjwan_checkItemStock_response = {};
    // this.soap.checkItemStock("455267", "15")
    return new Promise((resolve, reject) => {
      this.soap.checkItemStock(item_code, location_code)
        .subscribe((data) => {
          try {
            // alert("API call succeeded");
            var idx = data.indexOf('<?xml');
            if (idx != null && idx > 0) {
              var json_b4 = data.substring(0, idx);
              json_b4 = json_b4.replace('"{', '{').replace('}"', '}').replace('"[', '[').replace(']"', ']');
              // console.log(json_b4);
              var json = JSON.parse(json_b4);
              // console.log(json);
              if (json.Status != null && json.Status.toLowerCase() == "success") {
                if (json.Message != null && json.Message.length > 0) {
                  // var stock = json.Message[0].QTY_INSTOCK != null ? json.Message[0].QTY_INSTOCK : 0;
                  // return stock;
                  // orjwan_checkItemStock_response = json.Message[0];
                  resolve(json.Message[0]);
                } else {
                  // this.common.showMessage('warn', "Failed to parse Output");
                  reject("Failed to parse Output");
                  // return 0;
                }
              } else {
                var msg = json.Message != null && json.Message != "" ? json.Message : "Unknown Response from Server";
                reject(msg);
                // this.common.showMessage('warn', "Error : " + msg);
                //  return 0;
              }
            }
          } catch (except) {
            // this.common.showMessage('warn', except);
            // return 0;
            reject(except);
          }
        });
    });
  }

  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

  resolveAfter5Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 5000);
    });
  }

  getValueWithPromise() {
    this.resolveAfter2Seconds(20).then(value => {
      //  console.log(`promise result: ${value}`);
    });
    // console.log('I will not wait until promise is resolved');
  }

  async getValueWithAsync() {
    let value1 = <number>await this.resolveAfter2Seconds(20);
    let v2 = <number>await this.resolveAfter5Seconds(30);
    // console.log(`async result: ${value1 + v2}`);
  }
  Saleemployeeclear_search() {
    this.myControl.patchValue('');
  }
  // customerDisplayWith (cid: number) {
  //   if (cid) {
  //     const customers = this as any as { id: number, name: string }[]
  //     return customers.find(cus => cus.id === cid).name
  //     this.sku_changed();
  //   } else {
  //     // when cityCode is '', display ''
  //     return ''
  //   }
  // }
}
