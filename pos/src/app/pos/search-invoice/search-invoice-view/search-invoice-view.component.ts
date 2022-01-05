import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { QzTrayService } from 'src/app/qz-tray-service';
import { MDayClosing } from 'src/app/models/m-day-closing';

@Component({
  selector: 'app-search-invoice-view',
  templateUrl: './search-invoice-view.component.html',
  styleUrls: ['./search-invoice-view.component.css']
})
export class SearchInvoiceViewComponent implements OnInit {
  json: Array<any>;
  myForm: FormGroup;
  user_details: MUserDetails = null;
  logedpos_details: MDayClosing = null;

  invoiceNo: any;
  DuplicateReportList1: any;
  DuplicateReportList2: any;
  DuplicateReportList3: any;
  DuplicateDetailsList: Array<any>;
  storeImage;
  temp_image: string = "assets/img/preview-image.png";
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
  footer1: any;
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
  decimalPlaces: any;
  duplicatereceiptHTML: any;
  duplicatereceiptdetails: any = '';
  printerName: any;
  isShow: boolean = false;
  ispopupShow: boolean = true;
  billtotalQty: any = 0;
  decimal_places: number = 0;
  barcode;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    public disDialogRef: MatDialogRef<SearchInvoiceViewComponent>,
    private printService: QzTrayService

  ) {
    this.DuplicateDetailsList = new Array<any>();
    localStorage.setItem('pos_mode', 'true');
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
    this.decimal_places = this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;
    let temp_pos: string = localStorage.getItem('pos_details');
    if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);
      this.printerName = this.logedpos_details.printerDeviceName;
      //this.printerName = "EPSON TM-T88IV Receipt"; 

    }

    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    let invNo = localStorage.getItem('SearchInvoice_InvoiceNo');
    // console.log("invNo");
    // console.log(invNo);
    this.PrintDuplicateReceipt(invNo);
    // var invoice = this.myForm.get('invoice').value;
    this.myForm = this.fb.group({
      invoice: ['']
      // discount_value: [0],
      // current_discount_type: ['Percentage']
    });


    this.clear_controls();
  }

  clear_controls() {
    this.getInvoiceList();
  }


  getInvoiceList() {
    //debugger;
    this.json = null;
    //this.country_list = null;
    this.common.showSpinner();
    // this.api.getAPI("searchinvoice?SearchValue=null&SalesStatus=completed&requestFrom=DefaultLoad&storeid="+this.user_details.storeID)
    this.api.getAPI("POSSearchAllInvoice?SalesStatus=completed&requestFrom=DefaultLoad&storeid=" + this.user_details.storeID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.json = data.invoiceHeaderList;
            // console.log("json");
            // console.log(this.json);
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
  PrintDuplicateReceipt(invoiceNo) {

    this.invoiceNo = invoiceNo;
    this.getDuplicateReport1();
    /*this.getDuplicateReport2();
    this.getDuplicateReport3();*/

  }

  getDuplicateReport1() {
    this.api.getAPI("BarcodeGeneration?invoice=" + this.invoiceNo)
      .subscribe((data) => {
        if (data != null && data != '') {
          this.barcode = data == null || data == '' ? this.temp_image : 'data:image/gif;base64,' + data;

        }
        else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
      });
    this.isShow = false;
    this.ispopupShow = true;
    this.common.showSpinner();
    this.api.getAPI("InvoiceReceipt1?invoice=" + this.invoiceNo)
      .subscribe((data) => {

        if (data != null && data.statusCode != null && data.statusCode == 1) {
          //console.log(data.invoiceList);
          this.DuplicateReportList1 = data.invoiceList;
          this.storeImage = data.invoiceList[0].storeImage == null || data.invoiceList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.invoiceList[0].storeImage;
          this.shopName = data.invoiceList[0].shopName != null ? data.invoiceList[0].shopName : "";

          this.posName = data.invoiceList[0].posName != null ? data.invoiceList[0].posName : "";
          this.invoiceNum = data.invoiceList[0].invoiceNo != null ? data.invoiceList[0].invoiceNo : "";
          this.date = this.common.toddmmmyyFormat(data.invoiceList[0].date);
          this.time = this.common.tohhmmaFormat(data.invoiceList[0].time);
          this.customerName = data.invoiceList[0].customerName != null ? data.invoiceList[0].customerName : "";
          this.salesMan = data.invoiceList[0].salesMan != null ? data.invoiceList[0].salesMan : "";
          this.cashier = data.invoiceList[0].cashier != null ? data.invoiceList[0].cashier : "";
          this.taxNo = data.invoiceList[0].taxNo != null ? data.invoiceList[0].taxNo : "";
          this.totalDiscount = data.invoiceList[0].totalDiscount != null ? data.invoiceList[0].totalDiscount : 0;
          this.taxAmount = data.invoiceList[0].taxAmount != null ? data.invoiceList[0].taxAmount : 0;
          this.netAmount = data.invoiceList[0].netAmount != null ? data.invoiceList[0].netAmount : 0;
          this.paidAmount = data.invoiceList[0].paidAmount != null ? data.invoiceList[0].paidAmount : 0;
          this.customerBalance = data.invoiceList[0].customerBalance != null ? data.invoiceList[0].customerBalance : 0;
          this.footer = data.invoiceList[0].footer != null ? data.invoiceList[0].footer : "";
          this.discount = data.invoiceList[0].discount != null ? data.invoiceList[0].discount : "";
          this.posTitle = data.invoiceList[0].posTitle != null ? data.invoiceList[0].posTitle : "";
          this.decimalPlace = data.invoiceList[0].decimalPlaces != null ? data.invoiceList[0].decimalPlaces : 0;
          var str = this.footer;
          var cleanStr = str.replace(/<br>/g, ",");
          this.footer1 = cleanStr;
          this.DuplicateDetailsList = new Array<any>();

          this.totalPrice = 0;
          this.tottaxAmount = 0;
          this.billtotalQty = 0;

          for (let i = 0; i < this.DuplicateReportList1.length; i++) {
            if (this.DuplicateReportList1[i] != null && this.DuplicateReportList1[i].qty != null) {
              this.billtotalQty = this.billtotalQty + this.DuplicateReportList1[i].qty;
            }
            if (this.DuplicateReportList1[i] != null && this.DuplicateReportList1[i].price != null) {
              this.totalPrice = this.totalPrice + this.DuplicateReportList1[i].price;
            }
            if (data.invoiceList[i] != null && data.invoiceList[i].taxAmount != null) {
              this.tottaxAmount = this.tottaxAmount + data.invoiceList[i].taxAmount;
            }

            let ic = this.DuplicateReportList1[i].itemCode != null ? this.DuplicateReportList1[i].itemCode : "";
            ic += this.DuplicateReportList1[i].appliedPromotionID != null 
                    && this.DuplicateReportList1[i].appliedPromotionID != ''
                    && this.DuplicateReportList1[i].appliedPromotionID != '0'
                  ? "\n(" + this.DuplicateReportList1[i].appliedPromotionID + ")"
                  : "";

            ic += this.DuplicateReportList1[i].discountRemarks == "Free Item" ? " - Free Item" : "";

            // let tempdata: any = {
            //   "itemCode": this.DuplicateReportList1[i].itemCode,
            //   "qty": this.DuplicateReportList1[i].qty,
            //   "price": this.DuplicateReportList1[i].price
            // }

            let tempdata: any = {
              "itemCode": ic,
              "qty": this.DuplicateReportList1[i].qty,
              "price": this.DuplicateReportList1[i].price
            }

            this.DuplicateDetailsList.push(tempdata);

          }

          this.duplicatereceiptdetails = '';

          for (let i = 0; i < this.DuplicateDetailsList.length; i++) {
            this.duplicatereceiptdetails = this.duplicatereceiptdetails +
              '<tr>' +
              '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + (i + 1) + '</h5></td>' +
              '<td style="width: 55%;text-align: left;font-weight: 100"><h5 style="margin: 5px;">' + this.DuplicateDetailsList[i].itemCode + '</h5></td>' +
              '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + this.DuplicateDetailsList[i].qty + '</h5></td>' +
              '<td style="text-align: right;font-weight: 100"><h5 style="margin: 5px;">' + this.DuplicateDetailsList[i].price.toFixed(this.decimal_places) + '</h5></td>' +
              '</tr>'
          }

          if (this.tottaxAmount > 0) {
            this.header = 'فاتورة ضريبية","فاتوره';
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

          //this.getDuplicateReceiptHTML();
          this.DuplicateReportList2 = data.invoiceSubReceiptTList;
          this.amount = data.invoiceSubReceiptTList[0].amount;
          this.knet = data.invoiceSubReceiptTList[0].knet;
          this.visa = data.invoiceSubReceiptTList[0].visa;
          this.creditcard = data.invoiceSubReceiptTList[0].creditcard;


          this.paycash = 0;

          for (let i = 0; i < this.DuplicateReportList2.length; i++) {

            this.paycash = this.paycash + this.DuplicateReportList2[i].paymentCash + this.DuplicateReportList2[i].knet + this.DuplicateReportList2[i].visa + this.DuplicateReportList2[i].creditcard;
            this.paymentCurrency = this.DuplicateReportList2[i].paymentCurrency != '' ? this.DuplicateReportList2[i].paymentCurrency : this.DuplicateReportList1[0].currency;

          }
          this.approvalNumberKNet = '';
          this.approvalNumberVisa = '';
          this.approvalNumberMaster = '';
          this.DuplicateReportList3 = data.approvalNumReceiptList;
          if (this.DuplicateReportList3 != null && this.DuplicateReportList3.length > 0) {
            for (let i = 0; i < this.DuplicateReportList3.length; i++) {

              this.cardType = data.approvalNumReceiptList[i].cardType;

              if (this.cardType == 'K-Net') {
                this.approvalNumberKNet = data.approvalNumReceiptList[i].approvalNumber;
              }
              else if (this.cardType == 'Visa') {
                this.approvalNumberVisa = data.approvalNumReceiptList[i].approvalNumber;
              }
              else if (this.cardType == 'Master') {
                this.approvalNumberMaster = data.approvalNumReceiptList[i].approvalNumber;
              }
              // else{
              //   this.approvalNumberKNet = '';
              //   this.approvalNumberVisa  = '';
              //   this.approvalNumberMaster = '';
              // }
            }
          }
        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        //this.getDuplicateReceiptHTML(); 

        this.isShow = true;
        this.ispopupShow = false;
      });
    this.common.hideSpinner();
  }

  getDuplicateReport2() {
    this.common.showSpinner();
    this.api.getAPI("InvoiceReceipt2?invoice=" + this.invoiceNo)
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          // console.log(data);
          this.DuplicateReportList2 = data.invoiceSubReceiptTList;
          this.amount = data.invoiceSubReceiptTList[0].amount;
          this.knet = data.invoiceSubReceiptTList[0].knet;
          this.visa = data.invoiceSubReceiptTList[0].visa;
          this.creditcard = data.invoiceSubReceiptTList[0].creditcard;


          this.paycash = 0;

          for (let i = 0; i < this.DuplicateReportList2.length; i++) {
            this.paycash = this.paycash + this.DuplicateReportList2[i].paymentCash;
            this.paymentCurrency = this.DuplicateReportList2[i].paymentCurrency;
          }

        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        // this.common.hideSpinner();
      });
  }
  getDuplicateReport3() {
    this.common.showSpinner();
    this.api.getAPI("InvoiceReceipt3?invoice=" + this.invoiceNo)
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {

          this.DuplicateReportList3 = data.approvalNumReceiptList;
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


        } else {
          let msg: string = data != null
            && data.displayMessage != null
            && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
          this.common.showMessage('warn', msg);
        }
        this.common.hideSpinner();
      });
  }
  getDuplicateReceiptHTML() {
    //alert('hai this Org');
    //alert('hai this Org');
    this.duplicatereceiptHTML = '<html>' +
      '<div style="width: 80mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
      '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
      '<h4 style="margin: 2mm 0mm">*&nbsp;DUPLICATE INVOICE&nbsp;*</h4>' +
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
      '<table style="width:95%; border-collapse: collapse; margin: 0 auto;">' +
      '<thead>' +
      '<tr style="border-top: 1px solid #000; border-bottom: 2px solid #000;">' +
      '<th style="width: 10%;text-align: center;">م</th>' +
      '<th style="width: 40%;text-align: center;">النوع</th>' +
      '<th style="width: 10%;text-align: center;">العدد</th>' +
      '<th style="width: 30%;text-align: right;">السعر</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      this.duplicatereceiptdetails +
      '</tbody>' +
      '<tfoot>' +
      '<tr style="border-bottom: 1px solid #000;border-top: 2px solid #000;">' +
      '<td></td>' +
      '<td style="text-align: left;font-weight: 100"><h5 style="margin: 5px;">اجمالي الكميه</h5></td>' +
      '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + this.billtotalQty + '</h5></td>' +
      '<td></td>' +
      '</tr>' +
      '</tfoot>' +
      '</table>' +
      '<table style="width: 88%;margin-left: 28px;border-collapse: collapse;">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> المبلغ الاجمالي/Total Price:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: right;font-weight:100">' + this.totalPrice.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> ض.ق.م./Total Discount:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.totalDiscount.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 2px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> 5% ضريبة القيمة  المضافة/Tax:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.taxAmount.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 2px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">  المبلغ الصافي/Net Amount:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.netAmount.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 2px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> المبلغ المدفوع/Paid Amount:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm; text-align: right; font-weight: 100">' + this.paidAmount.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 2px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;"> رصيد/Balance Amount:</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: right;font-weight: 100">' + this.customerBalance.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
      '<tr>' +
      '<td style="width: 20%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">المحل : </h5>' +
      '</td>' +
      '<td style="width: 80%;">' +
      '<h5 style="margin: 2mm 0mm;font-weight: 100">  </h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width: 100%; border-collapse: collapse;">' +
      '<tr style="border-bottom: 2px solid #000;border-top: 1px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: left;font-weight: 550;"> نوعية الدفع </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 550;"> المبلغ المدفوع </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 550;"> رقم الموافقة </h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 1px solid #d0caca;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100"> نقدي/Cash: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 100">' + this.amount.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">  </h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 1px solid #d0caca;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100"> كي نت/Knet: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.knet.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberKNet + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 1px solid #d0caca;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100">بطاقة فيزا/Visa: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.visa.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberVisa + '</h5>' +
      '</td>' +
      '</tr>' +
      '<tr style="border-bottom: 1px solid #000;">' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100">بطاقة فيزا/Credit Card: </h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.creditcard.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberMaster + '</h5>' +
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
      '<h5 style="margin: 2mm 0mm;font-weight: 550;">' + this.paymentCurrency + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.paycash.toFixed(this.decimalPlace) + '</h5>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '<table style="width:100%;">' +
      '<tr>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align:center;font-weight:100">' + this.footer + '</h5>' +
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
    //console.log(this.duplicatereceiptHTML);
    this.onPrintHTML();
  }

  onPrintHTML() {
    var printData = [
      {
        type: 'html',
        format: 'plain',
        data: this.duplicatereceiptHTML
      }
    ];
    this.printService.printHTML(this.printerName, printData);
  }

  onNoClick(): void {
    this.disDialogRef.close();
  }

}
