import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MDayClosing } from 'src/app/models/m-day-closing';
import { MXReportHeader } from 'src/app/models/m-x-report-header';
import { MXReportDetails } from 'src/app/models/m-x-report-details';
import { MXReportSummary } from 'src/app/models/m-x-report-summary';
import { MEmployeeMaster, MEmployeeAC } from 'src/app/models/m-employee-master';
import { QzTrayService } from 'src/app/qz-tray-service';
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../assets/vfs_fonts.js";
import { fonts } from "src/assets/config/pdfFonts";
import { formatDate } from '@angular/common';
import { styles, defaultStyle } from "src/assets/config/customStyles";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts;
@Component({
  selector: 'app-x-report',
  templateUrl: './x-report.component.html',
  styleUrls: ['./x-report.component.css']
})
export class XReportComponent implements OnInit {

  pdfSrc; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 0;

  // Initialize variables required for the header and this component
  fileName = "XReport-document.pdf";
  // set zoom variables
  currentPage = 0;
  zoom = 0.4; // default initial zoom value
  zoomMax = 2; // max zoom value
  zoomMin = 0.5; // min zoom value
  zoomAmt = 0.2; // stepping zoom values on button click
  zoomScale = "page-width"; // zoom scale based on the page-width
  totalPages = 0; // indicates the total number of pages in the pdf document
  pdf: PDFDocumentProxy; // to access pdf information from the pdf viewer
  documentDefinition: object;
  generatedPDF: any;
  pdfData;

  User_List: Array<any>;
  employee_details: Array<MEmployeeMaster>;
  employee_ac: Array<MEmployeeAC>;
  posList: Array<any>;
  shiftList: Array<any>;
  json: Array<any>;
  myForm: FormGroup;
  user_details: MUserDetails = null;
  xreportHTML: any;
  business_date: any;
  xReportHeaderList: MXReportHeader;
  xReportDetailsList: Array<MXReportDetails>;
  xReportSummaryList: Array<MXReportSummary>;
  cashierID: any;
  shiftID: any;
  posID: any;
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
  xinvoiceDetails: any;
  xtotal: any;
  // zReportList1: any;
  // zReportList2: any;
  // zReportList3: any;
  shopCode: any;
  country: any;
  cash: any;
  knet: any;
  visa: any;
  creditcard: any;
  totalSales: any;
  creditSale: any;
  foreignTotal: any;
  netSales: any;
  netamount: any;
  totalCash: any;
  cashValue: any;
  netSalesAmount: any = 0;
  totCash: any = 0;
  totalKnet: any = 0;
  totalVisa: any = 0;
  totalCreditCard: any = 0;
  totalCardValue: any = 0;
  totalCreditSale: any = 0;
  differenceValue: any = 0;
  current_date: any;
  current_time: any;
  pos_details: MDayClosing;
  current_storeName: any;
  comment: any;
  isSales: boolean = false;

  public pageLabel: string;
  Urlstring: any;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private printService: QzTrayService
  ) {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);

    }

    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
    this.current_storeName = this.user_details.storeName;
    // this.serviceUrl = 'https://demos.boldreports.com/services/api/ReportViewer';
    // this.reportPath = '~/Resource/docs/sales-order-detail.rdl';
    this.createForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      posID: ['', Validators.required],
      businessdate: ['', Validators.required],
      shiftID: ['', Validators.required],
      cashierID: ['', Validators.required]
    });
    this.xReportHeaderList = new MXReportHeader();
    this.xReportDetailsList = new Array<MXReportDetails>();
    this.xReportSummaryList = new Array<MXReportSummary>();
  }
  ngOnInit() {

    this.getPos_ShiftCode();
    this.GetShiftByCountry();
    this.get_employees();
    //  this.getData();
  }
  viewXreport() {
    this.cashierID = this.myForm.get('cashierID').value;
    this.shiftID = 0;
    this.posid = 0;
    this.business_date = this.common.toYMDFormat(this.myForm.get('businessdate').value);
    this.shiftID = this.myForm.get('shiftID').value;
    this.posid = this.myForm.get('posID').value;
    this.getXReport1();


  }

  get_employees() {
    this.common.showSpinner();
    this.api.getAPI("User?storeid=" + this.user_details.storeID.toString())
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.User_List = data.usersList;
          }
          else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          } this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  GetShiftByCountry() {
    this.json = null;
    this.common.showSpinner();
    this.api.getAPI("Shift?CountryID=" + this.user_details.countryID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // this.json = data.shiftList;
            this.shiftList = data.shiftList;
            //localStorage.setItem('pos_details', JSON.stringify(this.pos_details));
            // localStorage.setItem('getpos_shift', JSON.stringify(this.pos_details));
          }
          else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getPos_ShiftCode() {
    this.json = null;
    this.common.showSpinner();
    this.api.getAPI("POS?StoreID=" + this.user_details.storeID + "&len=" + '')
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.json = data.posMasterList;
            this.posList = data.posMasterList;
            // this.shiftList = data.shiftMasterList;
            // this.pos_details = new MDayClosing();
            // this.pos_details = data.logShiftList;
            // localStorage.setItem('pos_details', JSON.stringify(this.pos_details));
            //localStorage.setItem('getpos_shift', data);
          }
          else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getXReport1() {
    this.shiftID = this.myForm.get('shiftID').value;
    this.posid = this.myForm.get('posID').value;
    this.common.showSpinner();
    this.api.getAPI("NewXReport?cashierid=" + this.cashierID + "&shiftID=" + this.shiftID + "&businessDate=" + this.business_date + "&StoreID=" + this.user_details.storeID + "&posid=" + this.posid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            if (data.xReportList != null) {
              this.xReportHeaderList.storeImage = data.xReportList[0].storeImage == null || data.xReportList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.xReportList[0].storeImage;
              this.xReportHeaderList.shopName = data.xReportList[0].shopName != null ? data.xReportList[0].shopName : "";
              this.xReportHeaderList.posName = data.xReportList[0].posName != null ? data.xReportList[0].posName : "";
              this.xReportHeaderList.cashier = data.xReportList[0].cashier != null ? data.xReportList[0].cashier : "";
              this.xReportHeaderList.businessDate = this.common.toddmmmyyFormat(data.xReportList[0].businessDate);
              this.xReportHeaderList.shiftName = data.xReportList[0].shiftName != null ? data.xReportList[0].shiftName : "";
              this.xReportHeaderList.time = data.xReportList[0].time != null ? data.xReportList[0].time : "";

            }
            if (data.xReportList1 != null && data.xReportList1.length > 0) {
              this.xReportDetailsList = data.xReportList1;
              this.decimalPlace = data.xReportList1[0].decimalPlaces;
              this.decimalPlaces = data.xReportList1[0].decimalPlaces;
              // alert("dp" + data.xReportList1[0].decimalPlaces);
            }
            if (data.xReportList2 != null && data.xReportList2.length > 0) {
              this.xReportSummaryList = data.xReportList2;
              this.kdAmount = this.xReportSummaryList[0].kdAmount;
              this.returnAmount = this.xReportSummaryList[0].returnAmount;
              this.totalCashInBox = this.xReportSummaryList[0].totalCashInBox;
              this.floatAmount = this.xReportSummaryList[0].floatAmount;
              this.cashInAmount = this.xReportSummaryList[0].cashInAmount;
              this.cashOutAmount = this.xReportSummaryList[0].cashOutAmount;
              this.paymentCurrency = this.xReportSummaryList[0].paymentCurrency != "" ? this.xReportSummaryList[0].paymentCurrency : this.xReportSummaryList[0].currencyName;
              this.currencyName = this.xReportSummaryList[0].currencyName;
            }
            this.cashAmount = this.kdAmount + this.returnAmount;
            this.knetTotal = 0;
            this.visaTotal = 0;
            this.creditCardTotal = 0;

            for (let i = 0; i < this.xReportSummaryList.length; i++) {
              this.knetTotal = this.knetTotal + this.xReportSummaryList[i].knet;
              this.visaTotal = this.visaTotal + this.xReportSummaryList[i].visa;
              this.creditCardTotal = this.creditCardTotal + this.xReportSummaryList[i].creditcard;
            }

            this.total = this.floatAmount + this.cashInAmount + this.kdAmount + this.returnAmount
              - this.cashOutAmount;

            this.difference = this.total - this.totalCashInBox;

            let redo : boolean = false;
            if(this.exchangeAmount == null || this.exchangeAmount == undefined){
              this.exchangeAmount = 1;
              redo = true;
            }

            if (this.paymentCurrency == this.currencyName) {
              this.val = (this.kdAmount + this.returnAmount) / this.exchangeAmount;
              this.finVal = this.paymentCurrency + ' @ of ' + this.val;
              this.subVal = this.val;
            }
            else {
              this.val = this.kdAmount.toFixed(this.decimalPlace);
              this.finVal = this.paymentCurrency + ' @ of ' + this.val.toFixed(this.decimalPlaces);
              this.subVal = this.val / this.exchangeAmount;
            }

            if(redo){
              this.exchangeAmount = 0;
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

            this.getData();

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
  // getXReport2() {
  //   this.common.showSpinner();
  //   this.shiftID = this.myForm.get('shiftID').value;
  //   this.posid = this.myForm.get('posID').value;
  //   this.api.getAPI("XReport2?cashierid=" + this.cashierID + "&shiftID=" + this.shiftID + "&businessDate=" + this.business_date + "&StoreID=" + this.user_details.storeID + "&posid=" + this.posid)
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {

  //           this.xReportList2 = data.xSubReportList;
  //           this.kdAmount = data.xSubReportList[0].kdAmount;
  //           this.returnAmount = data.xSubReportList[0].returnAmount;
  //           this.exchangeAmount = data.xSubReportList[0].exchangeAmount;
  //           this.paymentCurrency = data.xSubReportList[0].paymentCurrency!="" ? data.xSubReportList[0].paymentCurrency:data.xSubReportList[0].currencyName;
  //           this.currencyName = data.xSubReportList[0].currencyName;
  //           this.paymentCash = data.xSubReportList[0].paymentCash;

  //           this.cashAmount = this.kdAmount + this.returnAmount;

  //           this.knetTotal = 0;
  //           this.visaTotal = 0;
  //           this.creditCardTotal = 0;

  //           for (let i = 0; i < this.xReportList2.length; i++) {
  //             this.knetTotal = this.knetTotal + this.xReportList2[i].knet;
  //             this.visaTotal = this.visaTotal + this.xReportList2[i].visa;
  //             this.creditCardTotal = this.creditCardTotal + this.xReportList2[i].creditcard;
  //           }

  //           // this.total = this.floatAmount + this.cashInAmount + this.kdAmount + this.returnAmount
  //           //              - this.cashOutAmount;

  //           // this.difference = this.total - this.totalCashInBox;

  //           if (this.paymentCurrency == this.currencyName) {
  //             this.val = (this.kdAmount + this.returnAmount) / this.exchangeAmount;
  //             this.finVal = this.paymentCurrency + ' @ of ' + this.val;
  //             this.subVal = this.val;
  //           }
  //           else {
  //             this.val = this.kdAmount.toFixed(this.decimalPlace);
  //             this.finVal = this.paymentCurrency + ' @ of ' + this.val.toFixed(this.decimalPlace);
  //             this.subVal = this.val / this.exchangeAmount;
  //           }

  //           this.getData();

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

  onDownload(event: any): void {
    this.download();
  }

  onPrint(event: any): void {
    this.print();
    // this.printService.printHTML(this.printerName, printData);
  }

  zoomfuction(type: string): void {
    this.setZoom(type);
  }
  // zoom functionality for the pdf viewer
  setZoom(type: string): void {
    console.log(type);
    if (type === "increment") {
      this.zoom += this.zoomAmt;
    } else if (type === "decrement") {
      this.zoom -= this.zoomAmt;
    }
  }

  // pdfSrc value we are taking from the pdfmake generate function in buffer type so currently this willnot work
  // after the pdf is generated it will work
  // Download functionality of the pdf
  download(): void {
    const blob = new Blob([this.pdfSrc], { type: "application/pdf" });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //   window.navigator.msSaveOrOpenBlob(blob);
    //   return;
    // }

    const data = window.URL.createObjectURL(blob);
    const link = document.createElement("a"); // creating an anchor tag
    link.href = data; // setting href value to anchor
    link.download = this.fileName; // giving the download attr to the anchor with the filename that we are giving
    link.click(); // fake click using the js to download it.

    // For firefox it is necessary to delay revoking the ObjectURl
    setTimeout(() => {
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  // pdfSrc value we are taking from the pdfmake generate function in buffer type so currently this willnot work
  // after the pdf is generated it will work
  // Print functionlaity of the pdf
  print(): void {
    // Remove previously added iframes
    const prevFrames = document.querySelectorAll('iframe[name="pdf-frame"]');
    if (prevFrames.length) {
      prevFrames.forEach((item) => item.remove());
    }
    // just like download , we are using the blob
    const blob = new Blob([this.pdfSrc], { type: "application/pdf" });
    const objectURl = URL.createObjectURL(blob);

    // create iframe element in dom
    const frame = document.createElement("iframe");
    frame.style.display = "none"; // hiding the iframe
    frame.src = objectURl; // setting the source for that iframe
    // appending this iframe to body
    document.body.appendChild(frame);
    frame.name = "pdf-frame";
    frame.focus();

    // in edge or IE we are using different methods to print
    // if (this.isIE() || this.isEdge()) {
    //   frame.contentWindow.document.execCommand("print", false, null);
    // } else {
    //   // all other browsers will use this method
    //   frame.contentWindow.print();
    // }
  }

  // to know the browser is IE or not
  isIE(): boolean {
    return navigator.userAgent.lastIndexOf("MSIE") !== -1;
  }

  // to know the browser is Edge or not
  // isEdge(): boolean {
  //   return !this.isIE() && !!window.StyleMedia;
  // }

  // after load complete of the pdf function
  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.pdf = pdf;
    this.totalPages = pdf.numPages;
  }

  generatePDF(): void {
    // alert(this.decimalPlaces);
    var tbl = {
      //headerRows: 1,
      widths: [60, 60, 50],
      body: []
    };
    var body = [];
    var headerSec = [
      { text: 'Sales/Return', style: 'tableHeader', alignment: 'center' },
      { text: 'Invoice No', style: 'tableHeader', alignment: 'center' },
      { text: 'Amount', style: 'tableHeader', alignment: 'center' },
    ]
    body.push(headerSec);
    var headerCat = [];
    var totalsales = 0;
    var totalDis = 0;
    var stotal = 0;
    var totalReturn = 0;
    var totalAmount = 0;

    for (let item of this.xReportDetailsList) {
      if (item.category == 'Sales') {
        var arr1 = [];
        arr1.push({
          // left, top, right, bottom
          // border: [false, false,false, false],
          text: item.category, style: 'textBlack', alignment: 'center'
        });
        arr1.push({
          // left, top, right, bottom
          // border: [false, false,false, false],
          text: item.invoiceNo, style: 'textBlack', alignment: 'center'
        });
        arr1.push({
          // left, top, right, bottom
          // border: [false, false,false, false],
          text: item.amount.toFixed(this.decimalPlaces), alignment: "center", style: 'textBlack'
        });
        body.push(arr1);
        totalsales = totalsales + item.amount;
        totalDis = totalDis + item.discountTotal;
        stotal = totalsales + totalDis;
      }

    }
    var salesfooter = []
    var salesfooter1 = []
    salesfooter.push(
      {
        // left, top, right, bottom
        border: [true, true, false, true],
        text: '', style: 'tableHeader', alignment: "center", bold: true
      },
      {
        // left, top, right, bottom
        border: [false, true, true, true],
        text: 'Total Discount', style: 'tableHeader', alignment: "center", bold: true
      },
      { text: totalDis.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center", bold: true }),
      salesfooter1.push(
        {
          // left, top, right, bottom
          border: [true, true, false, true],
          text: '', style: 'tableHeader', alignment: "center", bold: true
        },
        {
          border: [false, true, true, true],
          text: 'Total', style: 'tableHeader', alignment: "center", bold: true
        },
        { text: stotal.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center", bold: true })

    body.push(salesfooter);
    body.push(salesfooter1);
    for (let item of this.xReportDetailsList) {

      if (item.category == 'Return') {

        var arr2 = [];
        arr2.push({
          // left, top, right, bottom
          // border: [false, false,false, false],
          text: item.category, style: 'textBlack', alignment: 'center'
        });
        arr2.push({
          // left, top, right, bottom
          // border: [false, false,false, false],
          text: item.invoiceNo, style: 'textBlack', alignment: 'center'
        });
        arr2.push({
          // left, top, right, bottom
          // border: [false, false,false, false],
          text: item.amount.toFixed(this.decimalPlaces), alignment: "center", style: 'textBlack'
        });
        body.push(arr2);
        totalReturn = totalReturn + item.amount;
      }
    }
    var netamount = stotal + totalReturn;
    this.netSalesAmount = netamount;
    var Retournfooter = []
    var Retournfooter1 = []
    Retournfooter.push(
      {
        // left, top, right, bottom
        border: [true, true, false, true],
        text: '', style: 'tableHeader', alignment: "center", bold: true
      },
      {
        // left, top, right, bottom
        border: [false, true, true, true],
        text: 'Total', style: 'tableHeader', alignment: "center", bold: true
      },
      { text: totalReturn.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center", bold: true }),
      Retournfooter1.push(
        {
          // left, top, right, bottom
          border: [true, true, false, true],
          text: '', style: 'tableHeader', alignment: "center", bold: true
        },
        {
          border: [false, true, true, true],
          text: 'Total Amount', style: 'tableHeader', alignment: "center", bold: true
        },
        { text: netamount.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center", bold: true })
    body.push(Retournfooter);
    body.push(Retournfooter1);
    tbl.body = body;

    this.documentDefinition = {
      pageSize: {
        width: 224,
        height: 'auto'
      },
      pageOrientation: 'portrait',
      pageMargins: [17, 10, 10, 10],
      content: [

        { image: this.xReportHeaderList.storeImage, width: 50, height: 30, alignment: 'center' },
        { text: '*X REPORT*', style: 'ReportHeader' },
        { text: this.xReportHeaderList.businessDate, style: 'ReportHeader' },
        { text: this.xReportHeaderList.shiftName, style: 'ReportHeader' },
        {
          columns: [
            [

              { text: 'Cashier:', style: 'Headerdetails1' },
              { text: 'Date:', style: 'Headerdetails1' },
              { text: 'POS: ', style: 'Headerdetails1' }

            ],
            [
              { text: this.xReportHeaderList.cashier, style: 'Headerdetails' },
              { text: this.xReportHeaderList.businessDate, style: 'Headerdetails' },
              { text: this.xReportHeaderList.posName, style: 'Headerdetails' }
            ],
            [
              { text: 'Shop:', style: 'Headerdetailsright' },
              { text: `Time:`, style: 'Headerdetailsright' }


            ],
            [
              { text: this.xReportHeaderList.shopName, style: 'Headerdetailsright' },
              { text: this.xReportHeaderList.time, style: 'Headerdetailsright' }


            ],

          ]

        },
        [
          {

            table: tbl
          }

        ],

        [

          {
            text: '',
            fontSize: 16,
            alignment: 'center',
            color: '#047886',
            style: 'sectionHeader'
          },

        ],
        {

          table: {

            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [

              [{ text: 'NET SALES ', style: 'textBlack', colSpan: 2 }, {}, { text: this.netSalesAmount.toFixed(this.decimalPlaces).toString(), style: 'textBlack', alignment: 'center'}],
              [{ text: 'CREDIT', style: 'textBlack', colSpan: 2 }, {}, { text:this.xReportSummaryList[0].credit.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'CASH', style: 'textBlack', colSpan: 2 }, {}, { text:this.xReportSummaryList[0].cash.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'KNET CARD ', style: 'textBlack', colSpan: 2 }, {}, { text:this.xReportSummaryList[0].knet.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'VISA CARD', style: 'textBlack', colSpan: 2 }, {}, { text:this.xReportSummaryList[0].visa.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'CREDIT CARD', style: 'textBlack', colSpan: 2 }, {}, { text:this.xReportSummaryList[0].creditcard.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],

            ]



          }
        },

        {

          table: {

            headerRows: 1,
            widths: [70, 45, '*'],
            body: [

              [{text:this.finVal, style: 'textBlack'}, {text:this.exchangeAmount.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}, { text:this.subVal.toFixed(this.decimalPlaces), style: 'textBlack', alignment:'center'}],


            ]
          }
        },
        [

          {
            text: '',
            fontSize: 16,
            alignment: 'center',
            color: '#047886',
            style: 'sectionHeader'
          },

        ],
        {

          table: {

            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [

              [{ text: 'TOTAL CASH IN BOX', style: 'textBlack', colSpan: 2 }, {}, { text:this.totalCashInBox.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'FLOAT AMOUNT', style: 'textBlack', colSpan: 2 }, {}, { text:this.floatAmount.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'CASH SALES', style: 'textBlack', colSpan: 2 }, {}, { text:this.cashAmount.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'CASH IN ', style: 'textBlack', colSpan: 2 }, {}, { text:this.cashInAmount.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'CASH OUT ', style: 'textBlack', colSpan: 2 }, {}, { text:this.cashOutAmount.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'TOTAL', style: 'textBlack', colSpan: 2 }, {}, { text:this.total.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],
              [{ text: 'DIFFERENCE', style: 'textBlack', colSpan: 2 }, {}, { text:this.difference.toFixed(this.decimalPlaces), style: 'textBlack', alignment: 'center'}],

            ]

          },
        },
        {
          columns: [
            {

              width: 60,
              text: 'Cashier Signature', bold: true, fontSize: 8, style: 'sectionHeader',

            },
            {

              width: 80,

              text: 'Manager Signature', bold: true, fontSize: 8, style: 'sectionHeader',
            },


          ],
          columnGap: 80
        }





      ],
      styles: {
        ReportHeader:
        {
          fontSize: 8,
          alignment: 'center',
          bold: true

        },
        Headerdetails1:
        {
          fontSize: 6,
          bold: true
        },
        Headerdetails:
        {
          fontSize: 6,
          width: 100
        },
        Headerdetailsright:
        {
          alignment: 'right',
          fontSize: 6,
          bold: true
        },
        Headerdetailsright1:
        {
          alignment: 'right',
          fontSize: 6
        },
        textBlack: {
          fontSize: 7,
          bold: false,

        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          border: [false, true, false, true]

        },
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      },
      defaultStyle,
    };

    // Generating the pdf
    this.generatedPDF = pdfMake.createPdf(this.documentDefinition);
    // This generated pdf buffer is used for the download, print and for viewing
    this.generatedPDF.getBuffer((buffer) => {
      this.pdfSrc = buffer;
    });
  }

  getData(): void {
    var data =
    {

      // type: 'html',
      // format: 'plain',
      // data: repHTML

    }
    if (data) {
      this.pdfData = data;
      this.generatePDF();
    }
  }

}
