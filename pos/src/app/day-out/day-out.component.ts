import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from '../models/m-user-details';
import { MDayClosing } from '../models/m-day-closing';
import { QzTrayService } from 'src/app/qz-tray-service';
import { DomSanitizer } from '@angular/platform-browser';
import { MXReportHeader } from 'src/app/models/m-x-report-header';
import { MXReportDetails } from 'src/app/models/m-x-report-details';
import { MXReportSummary } from 'src/app/models/m-x-report-summary';
import { MZReportHeader } from 'src/app/models/m-z-report-header';
import { MZReportDetails1 } from 'src/app/models/m-z-report-details1';
import { MZReportDetails2 } from 'src/app/models/m-z-report-details2';
import * as _ from 'lodash';

@Component({
  selector: 'app-day-out',
  templateUrl: './day-out.component.html',
  styleUrls: ['./day-out.component.css']
})
export class DayOutComponent implements OnInit {

  user_details: MUserDetails = null;
  myForm: FormGroup;
  logedpos_details: MDayClosing = null;
  dayclose: MDayClosing;
  dayout: boolean;
  shiftOutMade: boolean = false;
  xReportHeaderList: MXReportHeader;
  xReportDetailsList: Array<MXReportDetails>;
  xReportSummaryList: Array<MXReportSummary>;

  business_date: any;
  xReportList: any;
  xReportList1: any;
  xReportList2: any;
  current_date: any;
  current_time: any;
  cashierID: any;
  shiftID: any;
  posid: any;
  cashier: any;
  shopName: any;
  shiftName: any;
  posName: any;
  isReturn: any;
  invoiceNo: any;
  totalAmount: any = 0;
  totalDiscount: any = 0;
  subTotal: any = 0;
  totAmount: any = 0;
  returnValue: any;
  total: any = 0;
  totCreditSale: any = 0;
  kdAmount: any = 0;
  returnAmount: any = 0;
  cashAmount: any = 0;
  exchangeAmount: any;
  knetTotal: any = 0;
  visaTotal: any = 0;
  creditCardTotal: any = 0;
  totalCashInBox: any;
  floatAmount: any;
  cashInAmount: any;
  cashOutAmount: any;
  difference: any = 0;
  storeImage: string;
  temp_image: string = "assets/img/preview-image.png";
  decimalPlace: any;
  decimalPlaces: any;
  paymentCurrency: any;
  currencyName: any;
  paymentCash: any;
  val: any = 0;
  finVal: any;
  subVal: any = 0;
  xreportHTML: any;
  xinvoiceDetails: any;
  xtotal: any;

  //business_date:any;
  zReportList1: MZReportHeader;
  zReportList2: Array<MZReportDetails1>;
  zReportList3: Array<MZReportDetails2>;
  //storeImage;
  //temp_image: string = "assets/img/preview-image.png";
  shopCode: any;
  //shopName:any;
  country: any;
  //invoiceNo:any;
  //shiftID:any;
  //paymentCurrency:any;
  cash: any;
  knet: any;
  visa: any;
  creditcard: any;
  totalSales: any;
  //totalDiscount:any;
  //totalAmount:any;
  creditSale: any;
  foreignTotal: any;
  //posid:any;
  //current_date:any;
  //subTotal:any;
  netSales: any;
  netamount: any;
  totalCash: any;
  //isReturn:any;
  //returnValue:any;
  //total:any;
  //paymentCash:any = 0;
  //returnAmount:any = 0;
  cashValue: any;
  netSalesAmount: any = 0;
  totCash: any = 0;
  totalKnet: any = 0;
  totalVisa: any = 0;
  totalCreditCard: any = 0;
  totalCardValue: any = 0;
  totalCreditSale: any = 0;
  differenceValue: any = 0;
  //decimalPlaces:any;
  //decimalPlace:any;
  zreportHTML: any;
  invoiceDetails: any;
  shiftinvoiceDetails: any;
  printerName: any;
  decimal_places: number = 0;
  time: any;
  isSales: boolean = false;
  isReturn1: boolean = false;
  Salestotal: number = 0;
  Returntotal: number = 0;
  nettotal: number = 0;
  isExchange: boolean = false;
  ETotal: number = 0;
  PosInfo: any;



  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private printService: QzTrayService,
    private domSanitizer: DomSanitizer
  ) {
    this.current_date = this.common.toddmmmyyFormat(new Date());
    this.current_time = this.common.tohhmmaFormat(new Date());
    this.shiftOutMade = false;
    localStorage.setItem('pos_mode', 'true');
    this.dayout = false;
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      // .log(this.user_details);
    }
    this.decimal_places = this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;

    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
    let temp_pos: string = localStorage.getItem('pos_details');
    if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);
      // this.common.showMessage('success', this.logedpos_details.businessDate.toString());
      // .log("POS " + this.logedpos_details);
      this.printerName = this.logedpos_details.printerDeviceName;
      //this.printerName = "EPSON TM-T88IV Receipt";

    }

    if (this.logedpos_details == null) {
      common.showMessage("warn", "Day-In / Shift-In Required");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['../home']);
    }
    console.log(this.logedpos_details);

    this.createForm();
  }
  createForm() {

    this.myForm = this.fb.group({
      posID: [0],
      businessdate: [''],
      shiftin: ['']
      // discount_value: [0],
      // current_discount_type: ['Percentage']
    });

    this.zReportList1 = new MZReportHeader();
    this.zReportList2 = new Array<MZReportDetails1>();
    this.zReportList3 = new Array<MZReportDetails2>();
    this.xReportHeaderList = new MXReportHeader();
    this.xReportDetailsList = new Array<MXReportDetails>();
    this.xReportSummaryList = new Array<MXReportSummary>();
    this.clear_controls();
  }

  clear_controls() {
    //this.getPos_ShiftCode();
    this.dayclose = new MDayClosing();
  }
  ngOnInit() {
  }
  shiftout() {
    this.dayclose.storeID = this.user_details.storeID;
    this.dayclose.shiftInUserID = this.user_details.id;
    this.dayclose.shiftInOutUserCode = this.user_details.userCode;
    this.dayclose.posid = this.logedpos_details.posid;
    this.dayclose.startingTime = this.logedpos_details.businessDate;
    this.dayclose.amount = this.myForm.get('shiftin').value;
    if (this.dayclose.amount != null && this.dayclose.amount != 0) {
      this.common.showSpinner();
      this.api.putAPI("DayIn", this.dayclose).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.shiftOutMade = true;
          this.common.hideSpinner();
          this.common.showMessage('success', 'Shift Out successfully.');

          this.cashierID = this.user_details.id;
          this.shiftID = this.logedpos_details.shiftID;
          this.posid = this.logedpos_details.posid;
          this.business_date = this.common.toYMDFormat(this.dayclose.startingTime);
          this.PrintXReport();

          this.CheckDayin();
          this.clear_controls();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Update.');
          }, this.common.time_out_delay);
        }

      });
    }
    else {
      this.common.showMessage("warn", "Fill Shift amount.");
    }
    //this.CheckDayin();
  }
  CheckDayin() {
    this.common.showSpinner();
    this.api.getAPI("dayin?StoreID=" + this.user_details.storeID + "&CountryID=" + this.user_details.countryID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.dayout = data.dayout;
            // if (this.dayout == false) {
            //   this.router.navigate(['../home']);
            // }

            //localStorage.setItem('x_rep', JSON.stringify(this.dayout));
            //this.router.navigate(['x-report']);

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
  PrintXReport() {
    this.getXReport1();
    //this.getXReport2();
  }
  getXReport1() {
    this.isSales = false;
    this.isReturn1 = false;
    this.shiftID = this.myForm.get('shiftID').value;
    this.posid = this.myForm.get('posID').value;
    this.common.showSpinner();
    this.api.getAPI("NewXReport?cashierid=" + this.cashierID + "&shiftID=" + this.shiftID + "&businessDate=" + this.business_date + "&StoreID=" + this.user_details.storeID + "&posid=" + this.posid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            if (data.xReportList != null) {
              this.storeImage = data.xReportList[0].storeImage == null || data.xReportList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.xReportList[0].storeImage;
              this.shopName = data.xReportList[0].shopName != null ? data.xReportList[0].shopName : "";
              this.posName = data.xReportList[0].posName != null ? data.xReportList[0].posName : "";
              this.cashier = data.xReportList[0].cashier != null ? data.xReportList[0].cashier : "";
              this.business_date = this.common.toddmmmyyFormat(data.xReportList[0].businessDate);
              this.shiftName = data.xReportList[0].shiftName != null ? data.xReportList[0].shiftName : "";
              this.time = data.xReportList[0].time != null ? data.xReportList[0].time : "";

            }
            if (data.xReportList1 != null) {
              this.xReportDetailsList = data.xReportList1;
              this.decimalPlace = data.xReportList1[0].decimalPlaces;
            }
            if (data.xReportList2 != null) {
              this.xReportSummaryList = data.xReportList2;
              this.kdAmount = data.xReportSummaryList[0].kdAmount;
              this.returnAmount = data.xReportSummaryList[0].returnAmount;
              this.totalCashInBox = data.xReportSummaryList[0].totalCashInBox;
              this.floatAmount = data.xReportSummaryList[0].floatAmount;
              this.cashInAmount = data.xReportSummaryList[0].cashInAmount;
              this.cashOutAmount = data.xReportSummaryList[0].cashOutAmount;
              this.paymentCurrency = data.xReportSummaryList[0].paymentCurrency != "" ? data.xReportSummaryList[0].xReportSummaryList : data.xReportSummaryList[0].currencyName;
              this.currencyName = data.xReportSummaryList[0].currencyName;
            }
            this.cashAmount = this.kdAmount + this.returnAmount;
            this.knetTotal = 0;
            this.visaTotal = 0;
            this.creditCardTotal = 0;
            //           this.xinvoiceDetails = '';
            //           this.xtotal = 0;
            //           this.totCreditSale = 0;

            this.xtotal = 0;
            this.totCreditSale = 0;
            this.Salestotal = 0;
            this.totalDiscount = 0;
            this.Returntotal = 0;
            for (let i = 0; i < this.xReportDetailsList.length; i++) {

              if (this.xReportDetailsList[i].category = "Sales") {

                this.xtotal = this.subTotal;
                this.isSales = true;
                this.Salestotal = this.Salestotal + this.xReportDetailsList[i].amount;
                this.totalDiscount = this.totalDiscount + this.xReportDetailsList[i].discountTotal;
                //this.totCreditSale = this.totCreditSale + this.xReportDetailsList[i].cre;
                this.xinvoiceDetails = this.xinvoiceDetails +
                  '<tr>' +
                  '<td style="text-align:center;">' +
                  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.xReportDetailsList[i].category + '</h5>' +
                  '</td>' +
                  '<td style="text-align: center;">' +
                  '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.xReportDetailsList[i].invoiceNo + '</h5>' +
                  '</td>' +
                  '<td style="text-align:center;">' +
                  '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.xReportDetailsList[i].amount.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>';
              }

            }
            this.xtotal = this.Salestotal + this.totalDiscount;
            if (this.isSales == true) {
              this.xinvoiceDetails = this.xinvoiceDetails +
                '<tr>' +
                '<td style="text-align:right" colspan="2">' +
                '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Total  </h5>' +
                '</td>' +
                '<td style="text-align:center;">' +
                '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.Salestotal.toFixed(this.decimal_places) + '</h5>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="text-align:right" colspan="2">' +
                '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Total Discount </h5>' +
                '</td>' +
                '<td style="text-align:center;">' +
                '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totalDiscount.toFixed(this.decimal_places) + '</h5>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="text-align:right" colspan="2">' +
                '<h5 style="margin: 2mm 0mm;font-weight: 550;">  Total Amount </h5>' +
                '</td>' +
                '<td style="text-align:center;">' +
                '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.xtotal.toFixed(this.decimal_places) + '</h5>' +
                '</td>' +
                '</tr>';


            }
            for (let i = 0; i < this.xReportDetailsList.length; i++) {

              if (this.xReportDetailsList[i].category = "Return") {

                //this.xtotal = this.totalAmount;
                this.isReturn1 = true;
                this.Returntotal = this.Returntotal + this.xReportDetailsList[i].amount;
                //this.totCreditSale = this.totCreditSale + this.xReportDetailsList[i].c;
                this.xinvoiceDetails = this.xinvoiceDetails +
                  '<tr>' +
                  '<td style="text-align:center;">' +
                  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.xReportDetailsList[i].category + '</h5>' +
                  '</td>' +
                  '<td style="text-align: center;">' +
                  '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.xReportDetailsList[i].invoiceNo + '</h5>' +
                  '</td>' +
                  '<td style="text-align:center;">' +
                  '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.xReportDetailsList[i].amount.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>';

              }
            }
            this.netSales = this.xtotal + this.Returntotal;
            if (this.isReturn1 == true) {
              this.xinvoiceDetails = this.xinvoiceDetails +
                '<tr>' +
                '<td style="text-align: right" colspan="2">' +
                '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total </h5>' +
                '</td>' +
                '<td style="text-align:center">' +
                '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.Returntotal.toFixed(this.decimal_places) + '</h5>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="text-align: right" colspan="2">' +
                '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total Amount </h5>' +
                '</td>' +
                '<td style="text-align:center">' +
                '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.netSales.toFixed(this.decimal_places) + '</h5>' +
                '</td>' +
                '</tr>';

            }

            for (let i = 0; i < this.xReportSummaryList.length; i++) {
              this.knetTotal = this.knetTotal + this.xReportSummaryList[i].knet;
              this.visaTotal = this.visaTotal + this.xReportSummaryList[i].visa;
              this.creditCardTotal = this.creditCardTotal + this.xReportSummaryList[i].creditcard;
            }

            this.total = this.floatAmount + this.cashInAmount + this.kdAmount + this.returnAmount
              - this.cashOutAmount;

            this.difference = this.total - this.totalCashInBox;

            if (this.paymentCurrency == this.currencyName) {
              this.val = (this.kdAmount + this.returnAmount) / this.exchangeAmount;
              this.finVal = this.paymentCurrency + ' @ of ' + this.val;
              this.subVal = this.val;
            }
            else {
              this.val = this.kdAmount.toFixed(this.decimalPlace);
              this.finVal = this.paymentCurrency + ' @ of ' + this.val.toFixed(this.decimalPlace);
              this.subVal = this.val / this.exchangeAmount;
            }
            // console.log(data);
            //           this.xReportList1 = data.xReportList;
            //           this.storeImage = this.user_details.storeImage == null || this.user_details.storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + this.user_details.storeImage;
            //           this.cashier = data.xReportList[0].cashier;
            //           this.shopName = data.xReportList[0].shopName;
            //           this.shiftName = data.xReportList[0].shiftName;
            //           this.posName = data.xReportList[0].posName;
            //           this.isReturn = data.xReportList[0].isReturn;
            //           this.invoiceNo = data.xReportList[0].invoiceNo;
            //           this.totalAmount = data.xReportList[0].totalAmount;
            //           this.totalDiscount = data.xReportList[0].discountTotal;
            //           this.subTotal = data.xReportList[0].subTotal;
            //           this.totAmount = data.xReportList[0].netSales;
            //           this.totalCashInBox = data.xReportList[0].totalCashInBox;
            //           this.floatAmount = data.xReportList[0].floatAmount;
            //           this.cashInAmount = data.xReportList[0].cashInAmount;
            //           this.cashOutAmount = data.xReportList[0].cashOutAmount;
            //           this.decimalPlace = data.xReportList[0].decimalPlaces;
            //           if (this.isReturn == true) {
            //             this.returnValue = "Return";
            //             this.xtotal = this.totalAmount;
            //           }
            //           else {
            //             this.returnValue = "Sales";
            //             this.xtotal = this.subTotal;
            //           }
            //           this.xtotal = 0;
            //           this.totCreditSale = 0;
            //           this.xinvoiceDetails = '';

            //           for (let i = 0; i < this.xReportList1.length; i++) {
            //             this.xtotal = this.xtotal + this.xReportList1[i].totalAmount;
            //             this.totCreditSale = this.totCreditSale + this.xReportList1[i].creditSale;
            //           }

            //           this.total = this.floatAmount + this.cashInAmount + this.kdAmount + this.returnAmount
            //             - this.cashOutAmount;

            //           this.difference = this.total - this.totalCashInBox;

            this.getXReportHTML();

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
  // getXReport1() {
  //   this.common.showSpinner();
  //   this.api.getAPI("XReport1?cashierid="+ this.cashierID + "&shiftID=" + this.shiftID + "&businessDate=" + this.business_date +"&StoreID=" + this.user_details.storeID + "&posid=" + this.posid)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {

  //           this.xReportList1 = data.xReportList;
  //           this.storeImage = data.xReportList[0].storeImage == null || data.xReportList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.xReportList[0].storeImage;  
  //           this.cashier = data.xReportList[0].cashier!= null ? data.xReportList[0].cashier : "";
  //           this.shopName = data.xReportList[0].shopName!= null ? data.xReportList[0].shopName : "";
  //           this.shiftName = data.xReportList[0].shiftName!= null ? data.xReportList[0].shiftName : "";
  //           this.posName = data.xReportList[0].posName!= null ? data.xReportList[0].posName : "";
  //           this.isReturn = data.xReportList[0].isReturn!= null ? data.xReportList[0].isReturn : "";
  //           this.invoiceNo = data.xReportList[0].invoiceNo!= null ? data.xReportList[0].invoiceNo : "";
  //           this.totalAmount = data.xReportList[0].totalAmount!= null ? data.xReportList[0].totalAmount : 0;
  //           this.totalDiscount = data.xReportList[0].discountTotal!= null ? data.xReportList[0].discountTotal : 0;
  //           this.subTotal = data.xReportList[0].subTotal!= null ? data.xReportList[0].subTotal : 0;
  //           this.totAmount = data.xReportList[0].netSales!= null ? data.xReportList[0].netSales : 0;
  //           this.totalCashInBox = data.xReportList[0].totalCashInBox!= null ? data.xReportList[0].totalCashInBox : 0;
  //           this.floatAmount = data.xReportList[0].floatAmount!= null ? data.xReportList[0].floatAmount : 0;
  //           this.cashInAmount = data.xReportList[0].cashInAmount!= null ? data.xReportList[0].cashInAmount : 0;
  //           this.cashOutAmount = data.xReportList[0].cashOutAmount!= null ? data.xReportList[0].cashOutAmount : 0;
  //           this.decimalPlace = data.xReportList[0].decimalPlaces!= null ? data.xReportList[0].decimalPlaces : 0;

  //           // for(let i=0;i<this.decimalPlace;i++)
  //           // {
  //           //   if(this.decimalPlaces==null || this.decimalPlaces=='')
  //           //   {
  //           //     this.decimalPlaces = '.' + '0';
  //           //   }
  //           //   else
  //           //   {
  //           //     this.decimalPlaces = this.decimalPlaces + '0';
  //           //   }
  //           // }


  //           this.xinvoiceDetails = '';
  //           this.xtotal = 0;
  //           this.totCreditSale = 0;

  //           for(let i=0;i<this.xReportList1.length;i++)
  //           {

  //           if(this.xReportList1[i].isReturn==true)
  //           {

  //             this.returnValue = "Return";
  //             this.xtotal = this.totalAmount;

  //             this.xtotal = this.xtotal + this.xReportList1[i].totalAmount;
  //             this.totCreditSale = this.totCreditSale + this.xReportList1[i].creditSale;
  //             this.xinvoiceDetails = this.xinvoiceDetails +
  //             '<tr>' +
  //             '<td style="text-align:center;">' +
  //             '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.returnValue + '</h5>' +				  
  //             '</td>' +
  //             '<td style="text-align: center;">' +
  //             '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.xReportList1[i].invoiceNo + '</h5>' +
  //             '</td>' +
  //             '<td style="text-align:center;">' +
  //             '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.xReportList1[i].totalAmount.toFixed(this.decimal_places) +  '</h5>' +
  //             '</td>' +			  
  //           '</tr>'
  //         '<tr>' +
  //           '<td style="text-align: right" colspan="2">' +
  //             '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total </h5>' +
  //           '</td>' +
  //            '<td style="text-align:center">' +
  //             '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.xtotal.toFixed(this.decimal_places) + '</h5>' +
  //           '</td>' +			  
  //         '</tr>';	
  //           }
  //           else
  //           {
  //             this.xtotal = 0;
  //             this.totCreditSale = 0;
  //             this.returnValue = "Sales";
  //             this.xtotal = this.subTotal;

  //             this.xtotal = this.xtotal + this.xReportList1[i].totalAmount;
  //             this.totCreditSale = this.totCreditSale + this.xReportList1[i].creditSale;
  //             this.xinvoiceDetails = this.xinvoiceDetails +
  //             '<tr>' +
  //             '<td style="text-align:center;">' +
  //             '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.returnValue + '</h5>' +				  
  //             '</td>' +
  //             '<td style="text-align: center;">' +
  //             '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.xReportList1[i].invoiceNo + '</h5>' +
  //             '</td>' +
  //             '<td style="text-align:center;">' +
  //             '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.xReportList1[i].totalAmount.toFixed(this.decimal_places) +  '</h5>' +
  //             '</td>' +			  
  //           '</tr>';	
  //           } 
  //           }     

  //           this.total = this.floatAmount + this.cashInAmount + this.kdAmount + this.returnAmount 
  //                        - this.cashOutAmount;

  //           this.difference = this.total - this.totalCashInBox;

  //          // this.getXReportHTML();

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
  // getXReport2() {
  //   this.common.showSpinner();
  //   this.api.getAPI("XReport2?cashierid="+ this.cashierID + "&shiftID=" + this.shiftID + "&businessDate=" + this.business_date +"&StoreID=" + this.user_details.storeID + "&posid=" + this.posid)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {

  //           this.xReportList2 = data.xSubReportList; 
  //           this.kdAmount =  data.xSubReportList[0].kdAmount!= null ? data.xSubReportList[0].kdAmount : 0;
  //           this.returnAmount =  data.xSubReportList[0].returnAmount!= null ? data.xSubReportList[0].returnAmount : 0;
  //           this.exchangeAmount = data.xSubReportList[0].exchangeAmount.toFixed(this.decimal_places);
  //           this.paymentCurrency = data.xSubReportList[0].paymentCurrency!= null ? data.xSubReportList[0].paymentCurrency : 0;
  //           this.currencyName = data.xSubReportList[0].currencyName!= null ? data.xSubReportList[0].currencyName : 0;
  //           this.paymentCash = data.xSubReportList[0].paymentCash!= null ? data.xSubReportList[0].paymentCash : 0;

  //           this.cashAmount = this.kdAmount + this.returnAmount;

  //           this.knetTotal = 0;
  //           this.visaTotal = 0;
  //           this.creditCardTotal = 0;

  //           for(let i=0;i<this.xReportList2.length;i++)
  //           {
  //             this.knetTotal = this.knetTotal + this.xReportList2[i].knet;
  //             this.visaTotal = this.visaTotal + this.xReportList2[i].visa;
  //             this.creditCardTotal = this.creditCardTotal + this.xReportList2[i].creditcard;
  //           }

  //           // this.total = this.floatAmount + this.cashInAmount + this.kdAmount + this.returnAmount 
  //           //              - this.cashOutAmount;

  //           // this.difference = this.total - this.totalCashInBox;

  //           if(this.paymentCurrency == this.currencyName)
  //           {
  //               this.val = (this.kdAmount + this.returnAmount) / (this.exchangeAmount);
  //               this.finVal = this.paymentCurrency + ' @ of ' + this.val.toFixed(this.decimal_places);
  //               this.subVal = this.val.toFixed(this.decimal_places);
  //           }
  //           else
  //           {
  //               this.val = this.paymentCash;
  //               this.finVal = this.paymentCurrency + ' @ of ' + this.val.toFixed(this.decimal_places);
  //               this.subVal = (this.val) / (this.exchangeAmount);
  //           }

  //          this.getXReportHTML();

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

  getXReportHTML() {
    this.xreportHTML = '<html>' +
      '<div style="width: 80mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
      '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
      '<h4 style="margin: 2mm 0mm;font-weight:900">*&nbsp;X REPORT&nbsp;*</h4>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
      '<h4 style="margin: 2mm 0mm;font-weight:900">' + this.business_date + '</h4>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
      '<h4 style="margin: 2mm 0mm;font-weight: 900">' + this.shiftName + '</h4>' +
      '</div>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style=" width: 21%;height: 34px;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Cashier: </h5>' +
      '</td>' +
      '<td style="font-weight:100;width: 31%;height: 34px;text-align:left;">' +
      '<h5 style="margin: 2mm 0mm; font-weight:100">' + this.cashier + '</h5>' +
      '</td>' +
      '<td style="width: 14%;height: 34px;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Shop: </h5>' +
      '</td>' +
      '<td style="font-weight: 100; width: 40%; height: 34px; text-align: left;">' +
      '<h5 style="margin: 2mm 0mm; font-weight:100">' + this.shopName + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 21%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Date: </h5>' +
      '</td>' +
      '<td style="font-weight:100; width: 31%;text-align:left;">' +
      '<h5 style="margin: 2mm 0mm; font-weight:100">' + this.current_date + '</h5>' +
      '</td>' +
      '<td style="width: 14%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Time: </h5>' +
      '</td>' +
      '<td style="width: 40%;text-align:left;">' +
      '<h5 style="margin: 2mm 0mm; font-weight:100">' + this.current_time + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 21%;" colspan="1">' +
      '<h5 style="margin: 2mm 0mm;;font-weight: 550;">POS:  </h5>' +
      '</td>' +
      '<td style="width: 50%;text-align:left;" colspan="3">' +
      '<h5 style="margin: 2mm 0mm; font-weight:100">' + this.posName + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 90%; border-collapse: collapse;" border="1">' +
      '<tr>' +
      '<td style="text-align:center">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Sales/Return </h5>' +
      '</td>' +
      '<td style="text-align:center">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Invoice No. </h5>' +
      '</td>' +
      '<td style="text-align:center">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Amount </h5>' +
      '</td>' +
      '</tr>' + this.xinvoiceDetails +

      '<tr>' +
      '<td style="text-align: right" colspan="2">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total </h5>' +
      '</td>' +
      '<td style="text-align:center">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.xtotal.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>'
    // '<tr>' +
    //   '<td style="text-align:center;" rowspan="3">' +
    //     '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.returnValue + '</h5>' +				  
    //   '</td>' +
    //   '<td style="text-align: center;">' +
    //     '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.invoiceNo + '</h5>' +
    //   '</td>' +
    //    '<td style="text-align:center;">' +
    //     '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.totalAmount +  '</h5>' +
    //   '</td>' +			  
    // '</tr>' +	

    '<tr>' +
      '<td style="text-align: center">' +
      '<h5 style="margin: 2mm 0mm"></h5>' +
      '</td>' +
      '<td style="text-align: right">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Total Amount </h5>' +
      '</td>' +
      '<td style="text-align:center;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%; height: 2px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 90%;border-collapse: collapse" border="1">' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">NET SALES </h5>' +
      '</td>' +
      '<td style="width: 30%; font-weight: 100; text-align: right; border-bottom: 1px solid #d0caca; ">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CREDIT </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight:100;text-align:right;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totCreditSale.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 90%;border-collapse: collapse;" border="1">' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH </h5>' +
      '</td>' +
      '<td style="width: 30%; text-align: right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">KNET CARD </h5>' +
      '</td>' +
      '<td style="width: 30%; font-weight: 100; text-align: right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.knetTotal.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%; border-bottom: 1px solid #d0caca; border-right: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">VISA CARD </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight: 100;text-align: right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.visaTotal.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CREDIT CARD </h5>' +
      '</td>' +
      '<td style="width: 30%; font-weight: 100; text-align: right;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.creditCardTotal.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;height:2px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 90%;border-collapse: collapse;" border="1">' +
      '<tr>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">' + this.finVal + '</h5>' +
      '</td>' +
      '<td style="width: 25%; font-weight: 100; text-align: center">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.exchangeAmount + '</h5>' +
      '</td>' +
      '<td style="width: 25%;font-weight:100;text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.subVal + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;height:2px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 90%;border-collapse: collapse;" border="1">' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">TOTAL CASH IN BOX </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight: 100;text-align: right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totalCashInBox.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">FLOAT AMOUNT </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.floatAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH SALES </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH IN </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashInAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH OUT </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashOutAmount.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">TOTAL </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.total.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-right:1px solid #d0caca;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">DIFFERENCE </h5>' +
      '</td>' +
      '<td style="width: 30%;font-weight:100;text-align:right;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.difference.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '</tr>' +
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
      '<table style="width: 100%;height:60px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width: 40%;text-align:center;border-top: 1px solid #000;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Cashier Signature</h5>' +
      '</td><td></td>' +
      '<td style="width: 40%;text-align:center;border-top: 1px solid #000;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Manager Signature</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '</div>' +
      '</html>';
    console.log(this.xreportHTML);
    this.onPrintHTML(this.xreportHTML);
  }

  dayOut() {
    let businessDateStr = this.common.toYMDFormat(new Date(this.logedpos_details.businessDate));
    this.dayclose.storeID = this.user_details.storeID;
    this.dayclose.shiftOutUserID = this.user_details.id;
    this.dayclose.posid = this.logedpos_details.posid;
    this.dayclose.businessDate = new Date(this.logedpos_details.businessDate);
    this.dayclose.buisnessDate = new Date(this.logedpos_details.businessDate);
    this.dayclose.businessDateStr = businessDateStr;
    this.dayclose.buisnessDateStr = businessDateStr;
    this.dayclose.countryID = this.user_details.countryID;
    // this.dayclose.amount = this.myForm.get('shiftin').value;
    // console.log(this.dayclose);
    this.common.showSpinner();
    this.api.putAPI("DayOut", this.dayclose).subscribe((data) => {
      //// .log(data);
      if (data != null && data.statusCode != null && data.statusCode == 1) {
        this.common.hideSpinner();
        this.common.showMessage('success', 'Day Out successfully.');

        this.business_date = this.common.toYMDFormat(this.dayclose.businessDate);
        this.PrintZReport();

        //localStorage.setItem('z_rep', JSON.stringify(this.dayclose.businessDate));
        //this.router.navigate(['z-report']);

        this.router.navigate(['home']);
        //this.clear_controls();
      } else {
        setTimeout(() => {
          this.common.hideSpinner();
          this.common.showMessage('error', 'Failed to Update.');
        }, this.common.time_out_delay);
      }

    });
  }
  PrintZReport() {
    this.getZReport1();
    // this.getZReport1();    
    // this.getZReport2();
    // this.getZReport3(); 
  }
  getZReport1() {
    this.isSales = false;
    this.isReturn1 = false;
    this.isExchange = false;
    this.business_date = this.myForm.get('businessdate').value;
    return new Promise((resolve, reject) => {
      this.api.getAPI("NewZReport?BusinessDate=" + this.business_date + "&StoreID=" + this.user_details.storeID)
        .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            if (data.zReportList1 != null) {
              this.zReportList1.storeImage = data.zReportList1[0].storeImage == null || data.zReportList1[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.zReportList1[0].storeImage;
              this.zReportList1.country = data.zReportList1[0].country != null ? data.zReportList1[0].country : "";
              this.zReportList1.shopCode = data.zReportList1[0].shopCode != null ? data.zReportList1[0].shopCode : "";
              this.zReportList1.shopName = data.zReportList1[0].shopName != null ? data.zReportList1[0].shopName : "";
              this.zReportList1.date = this.common.toddmmmyyFormat(data.zReportList1[0].date);
              this.zReportList1.time = data.zReportList1[0].time != null ? data.zReportList1[0].time : "";
            }
            if (data.zReportList2 != null) {
              this.zReportList2 = data.zReportList2;
              this.xtotal = 0;
              this.totCreditSale = 0;
              this.Salestotal = 0;
              this.totalDiscount = 0;
              this.Returntotal = 0;
              for (let i = 0; i < this.zReportList2.length; i++) {

                if (this.zReportList2[i].category = "Sales") {

                  this.xtotal = this.subTotal;

                  this.Salestotal = this.Salestotal + this.zReportList2[i].amount;
                  this.totalDiscount = this.totalDiscount + this.zReportList2[i].discountAmount;
                  if (this.isSales == false) {
                    this.xinvoiceDetails = this.xinvoiceDetails +
                      '<tr>' +
                      '<td style="text-align:right" colspan="2">' +
                      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> 1.Sales  </h5>' +
                      '</td>' +
                      '</tr>';
                    this.isSales = true;
                  }
                  //this.totCreditSale = this.totCreditSale + this.xReportDetailsList[i].cre;
                  this.xinvoiceDetails = this.xinvoiceDetails +
                    '<tr>' +
                    '<td style="text-align: center;">' +
                    '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.zReportList2[i].invoiceNo + '</h5>' +
                    '</td>' +
                    '<td style="text-align:center;">' +
                    '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.zReportList2[i].amount.toFixed(this.decimal_places) + '</h5>' +
                    '</td>' +
                    '</tr>';
                }

              }
              this.xtotal = this.Salestotal + this.totalDiscount;
              if (this.isSales == true) {
                this.xinvoiceDetails = this.xinvoiceDetails +
                  '<tr>' +
                  '<td style="text-align:right" colspan="2">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Total  </h5>' +
                  '</td>' +
                  '<td style="text-align:center;">' +
                  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.Salestotal.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>' +
                  '<tr>' +
                  '<td style="text-align:right" colspan="2">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Total Discount </h5>' +
                  '</td>' +
                  '<td style="text-align:center;">' +
                  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totalDiscount.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>' +
                  '<tr>' +
                  '<td style="text-align:right" colspan="2">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 550;">  Total Amount </h5>' +
                  '</td>' +
                  '<td style="text-align:center;">' +
                  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.xtotal.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>';
              }
              for (let i = 0; i < this.zReportList2.length; i++) {

                if (this.zReportList2[i].category = "Return") {

                  //this.xtotal = this.totalAmount;

                  this.Returntotal = this.Returntotal + this.zReportList2[i].amount;
                  if (this.isReturn1 == false) {
                    this.xinvoiceDetails = this.xinvoiceDetails +
                      '<tr>' +
                      '<td style="text-align:right" colspan="2">' +
                      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> 2.Return  </h5>' +
                      '</td>' +
                      '</tr>';
                    this.isReturn1 = true;
                  }
                  //this.totCreditSale = this.totCreditSale + this.xReportDetailsList[i].c;
                  this.xinvoiceDetails = this.xinvoiceDetails +
                    '<tr>' +
                    '<td style="text-align: center;">' +
                    '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.zReportList2[i].invoiceNo + '</h5>' +
                    '</td>' +
                    '<td style="text-align:center;">' +
                    '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.zReportList2[i].amount.toFixed(this.decimal_places) + '</h5>' +
                    '</td>' +
                    '</tr>';

                }
              }
              this.netSales = this.xtotal + this.Returntotal;
              if (this.isReturn1 == true) {
                this.xinvoiceDetails = this.xinvoiceDetails +
                  '<tr>' +
                  '<td style="text-align: right" colspan="2">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total </h5>' +
                  '</td>' +
                  '<td style="text-align:center">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.Returntotal.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>' +
                  '<tr>' +
                  '<td style="text-align: right" colspan="2">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total Amount </h5>' +
                  '</td>' +
                  '<td style="text-align:center">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.netSales.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>';

              }
              for (let i = 0; i < this.zReportList2.length; i++) {

                if (this.zReportList2[i].category = "Exchange") {

                  //this.xtotal = this.totalAmount;

                  this.ETotal = this.ETotal + this.zReportList2[i].amount;
                  if (this.isExchange == false) {
                    this.xinvoiceDetails = this.xinvoiceDetails +
                      '<tr>' +
                      '<td style="text-align:right" colspan="2">' +
                      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> 3.Exchange  </h5>' +
                      '</td>' +
                      '</tr>';
                    this.isExchange = true;
                  }
                  //this.totCreditSale = this.totCreditSale + this.xReportDetailsList[i].c;
                  this.xinvoiceDetails = this.xinvoiceDetails +
                    '<tr>' +
                    '<td style="text-align: center;">' +
                    '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.zReportList2[i].invoiceNo + '</h5>' +
                    '</td>' +
                    '<td style="text-align:center;">' +
                    '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.zReportList2[i].amount.toFixed(this.decimal_places) + '</h5>' +
                    '</td>' +
                    '</tr>';

                }
              }
              this.netSales = this.xtotal + this.Returntotal;
              if (this.isExchange == true) {
                this.xinvoiceDetails = this.xinvoiceDetails +
                  '<tr>' +
                  '<td style="text-align: right" colspan="2">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total </h5>' +
                  '</td>' +
                  '<td style="text-align:center">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.Returntotal.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>' +
                  '<tr>' +
                  '<td style="text-align: right" colspan="2">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total Amount </h5>' +
                  '</td>' +
                  '<td style="text-align:center">' +
                  '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.netSales.toFixed(this.decimal_places) + '</h5>' +
                  '</td>' +
                  '</tr>';

              }
            }
            if (data.zReportList3 != null) {
              this.zReportList3 = data.zReportList3;
              console.log(this.zReportList3);
              var characters = this.zReportList3;

              this.PosInfo = _.chain(characters).groupBy("posid").map(function (v, i) {
                return {
                  Posname: i,
                  shiftinfo: _.map(v)
                }
              }).value();
            }
            this.shiftinvoiceDetails = '';

            for (let i = 0; i < this.PosInfo.length; i++) {
              this.cash = this.zReportList3[i].paymentCash + this.zReportList3[i].returnAmount;

              this.shiftinvoiceDetails = this.shiftinvoiceDetails +
                '<tr>' +

                '<td style="font-weight:100">' +
                '<h5 style="margin: 2mm 0mm">' + this.zReportList3[i].shiftID + '</h5>' +
                '</td>' +
                '<td style="font-weight: 100;width: 10%">' +
                '<h5 style="margin: 2mm 0mm;">' + this.zReportList3[i].paymentCurrency + '</h5>' +
                '</td>' +
                '<td style="font-weight: 100">' +
                '<h5 style="margin: 2mm 0mm">' + this.cash + '</h5>' +
                '</td>' +
                '<td style="font-weight:100">' +
                '<h5 style="margin: 2mm 0mm;">' + this.zReportList3[i].knet + '</h5>' +
                '</td>' +
                '<td style="font-weight:100">' +
                '<h5 style="margin: 2mm 0mm">' + this.zReportList3[i].visa + '</h5>' +
                '</td>' +
                '<td style="font-weight:100">' +
                '<h5 style="margin: 2mm 0mm;">' + this.zReportList3[i].creditcard + '</h5>' +
                '</td>' +
                '</tr>';
            }
            resolve("ok");

          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            //this.common.showMessage('warn', msg);
            reject(msg);
          }


        });
    });
  }

  // getZReport1() {
  //   this.common.showSpinner();
  //   this.api.getAPI("NewZReport?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) 
  //         {
  //           if(data.zReportList1!=null)
  //           {
  //           this.storeImage=data.zReportList1[0].storeImage == null || data.zReportList1[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.zReportList1[0].storeImage;  
  //           this.country=data.zReportList1[0].country!= null ? data.zReportList1[0].country : "";
  //           this.shopCode=data.zReportList1[0].shopCode!= null ? data.zReportList1[0].shopCode : "";
  //           this.shopName=data.zReportList1[0].shopName!= null ? data.zReportList1[0].shopName : "";
  //          // this.date=this.common.toddmmmyyFormat(data.zReportList1[0].date);
  //           this.time=data.zReportList1[0].time!= null ? data.zReportList1[0].time : "";
  //           }
  //           if(data.zReportList2!=null)
  //           {
  //           this.zReportList2=data.zReportList2;
  //           }
  //           if(data.zReportList3!=null)
  //           {
  //           this.zReportList3=data.zReportList3;
  //           console.log(this.zReportList3);
  //           var characters = this.zReportList3;

  //           this.PosInfo =_.chain(characters).groupBy("posid").map(function(v, i) {
  //             return {
  //               Posname: i,
  //               shiftinfo: _.map(v)
  //             }
  //           }).value();
  //         }


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
  // getZReport2() {
  //   this.common.showSpinner();
  //   this.api.getAPI("ZReport2?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {

  //           this.getZReport2 = data.responseDynamicData;
  //           //this.shiftID = data.responseDynamicData[0].shiftID;
  //           this.paymentCurrency = data.responseDynamicData[0].paymentCurrency;
  //           // this.cash = data.responseDynamicData[0].cash;
  //           // this.knet = data.responseDynamicData[0].knet;
  //           // this.visa = data.responseDynamicData[0].visa;
  //           // this.creditcard = data.responseDynamicData[0].creditcard;
  //           // this.foreignTotal = data.responseDynamicData[0].foreignTotal;
  //           this.posid = data.responseDynamicData[0].posid;
  //           // this.totalCash = data.responseDynamicData[0].totalCash;

  //           this.paymentCash = 0;
  //           this.returnAmount = 0;
  //           this.totalKnet = 0;
  //           this.totalVisa = 0;
  //           this.totalCreditCard = 0;
  //           this.totalCash = 0;
  //           this.foreignTotal = 0;

  //           for(let i=0;i<this.getZReport2.length;i++)
  //           {
  //             this.paymentCash = this.paymentCash + this.getZReport2[i].paymentCash;
  //             this.returnAmount = this.returnAmount + this.getZReport2[i].returnAmount;
  //             this.totalKnet = this.totalKnet + this.getZReport2[i].knet;
  //             this.totalVisa = this.totalVisa + this.getZReport2[i].visa;
  //             this.totalCreditCard = this.totalCreditCard + this.getZReport2[i].creditcard;
  //             this.totalCash = this.totalCash + this.getZReport2[i].totalCash;
  //             this.foreignTotal = this.foreignTotal + this.getZReport2[i].foreignTotal;
  //           }

  //           this.shiftinvoiceDetails = '';

  //           for(let i=0;i<this.getZReport2.length;i++)
  //           {
  //             this.cash = this.getZReport2[i].paymentCash + this.getZReport2[i].returnAmount ;

  //             this.shiftinvoiceDetails = this.shiftinvoiceDetails +
  //             '<tr>' +
  //             '<td style="font-weight:100">' +
  //               '<h5 style="margin: 2mm 0mm">' + this.getZReport2[i].shiftID + '</h5>' +
  //             '</td>' +
  //             '<td style="font-weight: 100;width: 10%">' +
  //               '<h5 style="margin: 2mm 0mm;">' + this.getZReport2[i].paymentCurrency + '</h5>' +
  //             '</td>' +	
  //              '<td style="font-weight: 100">' +
  //               '<h5 style="margin: 2mm 0mm">' + this.cash + '</h5>' +
  //             '</td>' +
  //             '<td style="font-weight:100">' +
  //               '<h5 style="margin: 2mm 0mm;">' + this.getZReport2[i].knet + '</h5>' +
  //             '</td>' +
  //              '<td style="font-weight:100">' +
  //               '<h5 style="margin: 2mm 0mm">' + this.getZReport2[i].visa + '</h5>' +
  //             '</td>' +
  //             '<td style="font-weight:100">' +
  //               '<h5 style="margin: 2mm 0mm;">' + this.getZReport2[i].creditcard + '</h5>' +
  //             '</td>' +
  //             '</tr>';
  //           }
  //           //this.cashValue = this.paymentCash + this.returnAmount;
  //           this.totCash = this.totalCash + this.returnAmount;
  //           this.totalCardValue = this.totalKnet + this.totalVisa + this.totalCreditCard;

  //           this.differenceValue = this.totCash + this.foreignTotal + this.returnAmount + 
  //                               + this.totalKnet + this.totalVisa + this.totalCreditCard 
  //                               - this.netSalesAmount;

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
  // getZReport3() {
  //   this.common.showSpinner();
  //   this.api.getAPI("ZReport3?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {

  //           this.getZReport3 = data.responseDynamicData;
  //           this.invoiceNo = data.responseDynamicData[0].invoiceNo;
  //           this.totalSales = data.responseDynamicData[0].netSales;
  //           this.totalDiscount = data.responseDynamicData[0].discountTotal;
  //           this.totalAmount = data.responseDynamicData[0].totalAmount;
  //           this.creditSale = data.responseDynamicData[0].creditSale;
  //           this.subTotal = data.responseDynamicData[0].subTotal;
  //           this.netSales = data.responseDynamicData[0].netSales;
  //           this.isReturn = data.responseDynamicData[0].isReturn;

  //           if(this.isReturn==true)
  //           {
  //             this.returnValue = "Return";
  //             this.total = this.totalAmount;
  //           }
  //           else
  //           {
  //             this.returnValue = "Sales";
  //             this.total = this.subTotal - this.totalDiscount;
  //           }
  //           this.totalCreditSale = 0;

  //           for(let i=0;i<this.getZReport3.length;i++)
  //           {
  //             this.totalCreditSale = this.totalCreditSale + this.getZReport3[i].creditSale;
  //           }

  //           this.invoiceDetails = '';

  //           for(let i=0;i<this.getZReport3.length;i++)  //for(let i=0;i<5;i++)   ----change by Muniraj
  //           {
  //             this.invoiceDetails = this.invoiceDetails +
  //             '<tr style="border-left:hidden;border-right:hidden;border-bottom:hidden;">' +
  //             '<td style="width: 50%;text-align:center;font-weight:100;border-right:hidden">' +
  //             '<h5 style="margin: 2mm 0mm">' + this.getZReport3[i].invoiceNo + '</h5>' +
  //             '</td>' +
  //             '<td style="width: 50%;text-align:center;font-weight:100">' +
  //             '<h5 style="margin: 2mm 0mm;">' + this.getZReport3[i].totalAmount + '</h5>' +
  //             '</td>' +			  
  //             '</tr>';
  //           }

  //           this.getZReportHTML();

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
  // getZReport1() {
  //   this.common.showSpinner();
  //   this.api.getAPI("ZReport1?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {

  //           this.getZReport1 = data.zReportList;
  //           this.storeImage = data.zReportList[0].storeImage == null || data.zReportList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.zReportList[0].storeImage;  
  //           this.shopCode = data.zReportList[0].shopCode;
  //           this.shopName = data.zReportList[0].shopName;
  //           this.country = data.zReportList[0].country;
  //           //this.netamount = data.zReportList[0].netamount;
  //           this.decimalPlace = data.zReportList[0].decimalPlaces;

  //           // for(let i=0;i<this.decimalPlace;i++)
  //           // {
  //           //   if(this.decimalPlaces==null || this.decimalPlaces=='')
  //           //   {
  //           //     this.decimalPlaces = '.' + '0';
  //           //   }
  //           //   else
  //           //   {
  //           //     this.decimalPlaces = this.decimalPlaces + '0';
  //           //   }
  //           // }

  //           this.netSalesAmount = 0;

  //           for(let i=0;i<this.getZReport1.length;i++)
  //           {
  //             this.netSalesAmount = this.netSalesAmount + this.getZReport1[i].netamount;
  //           }            

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

  getZReportHTML() {
    this.zreportHTML = '<html>' +
      '<div style="width: 80mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
      '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
      '<h4 style="margin: 2mm 0mm;font-weight:900">*&nbsp;Z REPORT&nbsp;*</h4>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
      '<h4 style="margin: 2mm 0mm;font-weight: 900">' + this.business_date + '</h4>' +
      '</div>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width: 30%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Shop: </h5>' +
      '</td>' +
      '<td style="width: 50%; text-align: left;" colspan="3">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.shopName + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Shop Code: </h5>' +
      '</td>' +
      '<td style="width: 50%;text-align: left;">' +
      '<h5 style="margin: 2mm 0mm; font-weight: 100;">' + this.shopCode + '</h5>' +
      '</td>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Country: </h5>' +
      '</td>' +
      '<td style="width: 50%;text-align: left;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.country + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Date: </h5>' +
      '</td>' +
      '<td style="width: 50%; text-align: left;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.current_date + '</h5>' +
      '</td>' +
      '<td style="width: 50%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Time: </h5>' +
      '</td>' +
      '<td style="width: 50%; text-align: left;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.current_time + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 90%; border-collapse: collapse;" border="1">' +
      '<tr style="border-top:1px #000;border-bottom:1px #000">' +
      '<td style="width: 50%;text-align:center;border-right:hidden;border-left:hidden;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Invoice No.: </h5>' +
      '</td>' +
      '<td style="width: 50%;text-align: center;border-left: 1px solid #d0caca;border-right: hidden">' +
      '<h5 style="margin: 2mm 0mm;;font-weight: 550;"> Amount </h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 50%;text-align:center;border-left:hidden;border-right:hidden" colspan="2">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">' + this.returnValue + '</h5>' +
      '</td>' +
      '</tr>' + this.invoiceDetails +

      // '<tr style="border-left:hidden;border-right:hidden;border-bottom:1px #d0caca">' +
      //   '<td style="width: 50%;text-align:center;font-weight:100;border-right:hidden">' +
      //     '<h5 style="margin: 2mm 0mm">' + this.invoiceNo + '</h5>' +
      //   '</td>' +
      //   '<td style="width: 50%;text-align:center;font-weight:100">' +
      //     '<h5 style="margin: 2mm 0mm;">' + this.totalAmount + '</h5>' +
      //   '</td>' +			  
      // '</tr>' +

      '<tr style="border-left:hidden;border-right:hidden;border-bottom:1px #d0caca;border-top:1px #d0caca">' +
      '<td style="width: 50%;text-align:center;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Total Sales </h5>' +
      '</td>' +
      '<td style="width: 50%;text-align:center;font-weight:100">' +
      '<h5 style="margin: 2mm 0mm;">' + this.subTotal + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-left:hidden;border-right:hidden;border-bottom:1px #d0caca">' +
      '<td style="width: 50%;text-align:center;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Total Discount </h5>' +
      '</td>' +
      '<td style="width: 50%;text-align:center;font-weight:100">' +
      '<h5 style="margin: 2mm 0mm;">' + this.totalDiscount + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-left:hidden;border-right:hidden;border-bottom:1px #d0caca">' +
      '<td style="width: 50%;text-align:center;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Total </h5>' +
      '</td>' +
      '<td style="width: 50%;text-align:center;font-weight:100">' +
      '<h5 style="margin: 2mm 0mm;">' + this.total + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-left:hidden;border-right:hidden;border-bottom:1px #d0caca">' +
      '<td style="width: 50%;text-align:center;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Total Amount </h5>' +
      '</td>' +
      '<td style="width: 50%; text-align: center; font-weight: 100">' +
      '<h5 style="margin: 2mm 0mm;">' + this.netSales + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 80%; height: 2px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;border-collapse: collapse;" border="1">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">SHIFT </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm">  </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;;">KNET </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">VISA </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CREDIT </h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 20%;">' +
      '<h5 style="margin: 2mm 0mm"> </h5>' +
      '</td>' +
      '<td style="width: 80%; font-weight: 100; text-align: center" colspan="5">' +
      '<h5 style=" margin: 2mm 0mm; ">' + this.posid + '</h5>' +
      '</td>' +
      '</tr>' + this.shiftinvoiceDetails +

      // '<tr>' +
      //   '<td style="font-weight:100">' +
      //     '<h5 style="margin: 2mm 0mm">' + this.shiftID + '</h5>' +
      //   '</td>' +
      //   '<td style="font-weight: 100;width: 10%">' +
      //     '<h5 style="margin: 2mm 0mm;">' + this.paymentCurrency + '</h5>' +
      //   '</td>' +	
      //    '<td style="font-weight: 100">' +
      //     '<h5 style="margin: 2mm 0mm">' + this.cashValue + '</h5>' +
      //   '</td>' +
      //   '<td style="font-weight:100">' +
      //     '<h5 style="margin: 2mm 0mm;">' + this.knet + '</h5>' +
      //   '</td>' +
      //    '<td style="font-weight:100">' +
      //     '<h5 style="margin: 2mm 0mm">' + this.visa + '</h5>' +
      //   '</td>' +
      //   '<td style="font-weight:100">' +
      //     '<h5 style="margin: 2mm 0mm;">' + this.creditcard + '</h5>' +
      //   '</td>' +
      // '</tr>' +	

      '</table>' +
      '<table style="width: 100%;height: 2px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 90%;margin-left: 15px;border-collapse: collapse;" border="1">' +
      '<tr>' +
      '<td style="width: 70%;border-left:hidden;border-right:hidden;border-top:hidden" colspan="2">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 700;"><u>STORE COLLECTION</u></h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom:hidden;">' +
      '<td style="width: 70%;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">NET SALES </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.netSalesAmount + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom:hidden;">' +
      '<td style="width: 70%;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.totCash + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom:hidden;">' +
      '<td style="width: 70%;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">KNET </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.totalKnet + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom:hidden;">' +
      '<td style="width: 70%;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">VISA </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.totalVisa + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom:hidden;">' +
      '<td style="width: 70%;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CREDIT CARD </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.totalCreditCard + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom:hidden;">' +
      '<td style="width: 70%;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">TOTAL CARD AMOUNT </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.totalCardValue + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom:hidden;">' +
      '<td style="width: 70%;border-right:hidden">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">CREDIT SALE </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.totalCreditSale + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;border-right:hidden;border-bottom:hidden;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">FOREIGN CURRENCY VALUE </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.foreignTotal + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="width: 70%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">DIFFERENCE </h5>' +
      '</td>' +
      '<td style="width: 30%;text-align:right;border-top:1px solid #000;border-left:1px solid #000;">' +
      '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.differenceValue + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;height:60px">' +
      '<tr>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td></td>' +
      '<td style="width: 50%;text-align:center;border-top:1px solid #000">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">Manager Signature</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '</div>' +
      '</html>';
    console.log(this.zreportHTML);
    this.onPrintHTML(this.zreportHTML);
  }

  onPrintHTML(repHTML) {
    var printData = [
      {
        type: 'html',
        format: 'plain',
        data: repHTML
      }
    ];
    this.printService.printHTML(this.printerName, printData);
  }

  btn_back_click() {
    if (this.shiftOutMade == false) {
      localStorage.setItem('pos_mode', 'true');
      this.router.navigate(['pos']);
    } else {
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }

  }
  home() {
    this.router.navigate(['../home']);
  }
}
