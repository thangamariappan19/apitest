import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-duplicate-receipt',
  templateUrl: './duplicate-receipt.component.html',
  styleUrls: ['./duplicate-receipt.component.css']
})
export class DuplicateReceiptComponent implements OnInit {
 
  user_details: MUserDetails = null;
  invoiceNo : any;
  DuplicateReportList1 : any;
  DuplicateReportList2 : any;
  DuplicateReportList3 : any;
  DuplicateDetailsList : Array<any>;
  storeImage;
  temp_image: string = "assets/img/preview-image.png";
  shopName : any;
  posName : any;
  invoiceNum : any;
  date : any;
  time : any;
  customerName : any;
  salesMan : any;
  cashier : any;
  taxNo : any;
  totalPrice : any = 0;
  tottaxAmount : any = 0;
  totalDiscount : any;
  taxAmount : any;
  netAmount : any;
  paidAmount : any;
  customerBalance : any;
  paycash : any = 0;
  footer : any;
  amount : any;
  knet : any;
  visa : any;
  creditcard : any;
  paymentCurrency : any;
  discount : any;
  cardType : any;
  approvalNumber : any;
  approvalNumberKNet : any;
  approvalNumberVisa : any;
  approvalNumberMaster : any;
  header : any;
  posTitle : any;
  decimalPlace:any;
  decimalPlaces: any;
  duplicatereceiptHTML : any;
  duplicatereceiptdetails : any;
  
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.DuplicateDetailsList = new Array<any>();

    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }  
    // let temp_str_dupinv: string = localStorage.getItem('duplicate_invoice');
    // if (temp_str_dupinv != null) {
    // this.invoiceNo = JSON.parse(temp_str_dupinv);
    // }
    this.invoiceNo = 'DEV0000366';
    
    this.getDuplicateReport1();    
    this.getDuplicateReport2();
    this.getDuplicateReport3();     
  }

  ngOnInit(): void {
  }

  getDuplicateReport1()
  {
      this.common.showSpinner();
      this.api.getAPI("InvoiceReceipt1?invoice="+ this.invoiceNo)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.DuplicateReportList1 = data.invoiceList;
            this.storeImage = data.invoiceList[0].storeImage == null || data.invoiceList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.invoiceList[0].storeImage; 
            this.shopName =  data.invoiceList[0].shopName;
            this.posName = data.invoiceList[0].posName;
            this.invoiceNum = data.invoiceList[0].invoiceNo;
            this.date = data.invoiceList[0].date;
            this.time = data.invoiceList[0].time;
            this.customerName = data.invoiceList[0].customerName;
            this.salesMan = data.invoiceList[0].salesMan;
            this.cashier = data.invoiceList[0].cashier;
            this.taxNo = data.invoiceList[0].taxNo;
            this.totalDiscount = data.invoiceList[0].totalDiscount;
            this.taxAmount = data.invoiceList[0].taxAmount;
            this.netAmount = data.invoiceList[0].netAmount;
            this.paidAmount = data.invoiceList[0].paidAmount;
            this.customerBalance = data.invoiceList[0].customerBalance;
            this.footer = data.invoiceList[0].footer;
            this.discount = data.invoiceList[0].discount;
            this.posTitle = data.invoiceList[0].posTitle;
            this.decimalPlace = data.invoiceList[0].decimalPlaces;

            this.DuplicateDetailsList = new Array<any>();

            for(let i=0;i<this.DuplicateReportList1.length;i++)
            {
              this.totalPrice = this.totalPrice + this.DuplicateReportList1[i].price;
              this.tottaxAmount = this.tottaxAmount + data.invoiceList[i].taxAmount;

              let tempdata: any = {
                "itemCode" : this.DuplicateReportList1[i].itemCode,
                "qty": this.DuplicateReportList1[i].qty,
                "price": this.DuplicateReportList1[i].price
              }
              this.DuplicateDetailsList.push(tempdata);
            }

            for(let i=0;i<this.DuplicateDetailsList.length;i++)
            {
                this.duplicatereceiptdetails = this.duplicatereceiptdetails +
                '<tr>' +
                '<td style="text-align: center;font-weight: 100"><h5>' + (i+1) + '</h5></td>' +
                '<td style="text-align: left;font-weight: 100"><h5>' + this.DuplicateDetailsList[i].itemCode + '</h5></td>' +
                '<td style="text-align: center;font-weight: 100"><h5>' + this.DuplicateDetailsList[i].qty + '</h5></td>' +
                '<td style="text-align: right;font-weight: 100"><h5>' + this.DuplicateDetailsList[i].price + '</h5></td>' +
                '</tr>'
            }

            if(this.tottaxAmount > 0)
            {
              this.header = '???????????? ????????????","????????????';
            }
             
            for(let i=0;i<this.decimalPlace;i++)
            {
              if(this.decimalPlaces==null || this.decimalPlaces=='')
              {
                this.decimalPlaces = '.' + '0';
              }
              else
              {
                this.decimalPlaces = this.decimalPlaces + '0';
              }
            }

            this.getDuplicateReceiptHTML();

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
  getDuplicateReport2()
  {
      this.common.showSpinner();
      this.api.getAPI("InvoiceReceipt2?invoice="+ this.invoiceNo)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.DuplicateReportList2 = data.invoiceSubReceiptTList;
            this.amount = data.invoiceSubReceiptTList[0].amount;
            this.knet = data.invoiceSubReceiptTList[0].knet;
            this.visa = data.invoiceSubReceiptTList[0].visa;
            this.creditcard = data.invoiceSubReceiptTList[0].creditcard;
            this.paymentCurrency = data.invoiceSubReceiptTList[1].paymentCurrency;

            for(let i=0;i<this.DuplicateReportList2.length;i++)
            {
              this.paycash = this.paycash + this.DuplicateReportList2[i].paymentCash;
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
  getDuplicateReport3()
  {
      this.common.showSpinner();
      this.api.getAPI("InvoiceReceipt3?invoice="+ this.invoiceNo)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.DuplicateReportList3 = data.approvalNumReceiptList;
            this.cardType = data.approvalNumReceiptList[0].cardType;
            
            if(this.cardType == 'K-Net')
            {
              this.approvalNumberKNet = data.approvalNumReceiptList[0].approvalNumber;
            }
            else if(this.cardType == 'Visa')
            {
              this.approvalNumberVisa = data.approvalNumReceiptList[0].approvalNumber;
            }
            else if(this.cardType == 'Master')
            {
              this.approvalNumberMaster = data.approvalNumReceiptList[0].approvalNumber;
            }
            else{
              this.approvalNumberKNet = '';
              this.approvalNumberVisa  = '';
              this.approvalNumberMaster = '';
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
  getDuplicateReceiptHTML()
  {
    this.duplicatereceiptHTML = '<html>' +	
    '<div style="width: 95mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
        // '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
      '</div>' +
      '<div style="width: 100%; text-align: center;font-weight:900">' +
			  '<h4 style="margin: 2mm 0mm">*&nbsp;DUPLICATE INVOICE&nbsp;*</h4>' +
		  '</div>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 30%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">??????????/Shop : </h5>' +
          '</td>' +
          '<td style="width: 70%;text-align: left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.shopName +  '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 30%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">???????? ??????????/POS : </h5>' +
          '</td>' +
          '<td style="width: 70%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.posName +  '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
     '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 40%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">?????? ????????????????/Invoice : </h5>' +
          '</td>' +
          '<td style="width: 60%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;">' + this.invoiceNum +  '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +  
     '<table style="width: 100%;">' +
         '<tr>' +
           '<td style="width:25%;">' +
             '<h5 style="margin: 2mm 0mm;font-weight: 550;"> ??????????????/Date : </h5>' +
           '</td>' +
            '<td style="width:25%;text-align:left;">' +
             '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.date + '</h5>' +
           '</td>' +
           '<td style="width: 25%;">' +
             '<h5 style="margin: 2mm 0mm;font-weight: 550;"> ??????????/Time : </h5>' +
           '</td>' +	
           '<td style="width:25%;text-align:left;">' +
             '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.time + '</h5>' +
           '</td>' +	
         '</tr>' +
      '</table>' +		
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 40%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">????????????/Customer : </h5>' +
          '</td>' +
          '<td style="width: 60%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.customerName + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	 	  
     '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width:25%;">' +
            '<h5 style="margin: 2mm 0mm; height: 15px;font-weight: 550;">????????????</h5>' +
                      '<h5 style="margin: 2mm 0mm;font-weight: 550;">/Salesman: </h5>' +
          '</td>' +
          '<td style="width:25%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.salesMan + '</h5>' +
          '</td>' +
          '<td style="width:25%;">' +
            '<h5 style="margin: 2mm 0mm; height: 15px;font-weight: 550;">???????? ?????????????? </h5>' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">/Cashier: </h5>' +
          '</td>' +
          '<td style="width:25%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashier + '</h5>' +
          '</td>' +
        '</tr>' +
     '</table>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 50%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">?????????? ?????????????? ??????????????/Tax :</h5>' +
          '</td>' +
          '<td style="width: 50%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.taxNo +  '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
      '<table style="width:100%; border-collapse: collapse;">' +
              '<thead>' +
                  '<tr style="border-top: 1px solid #000; border-bottom: 2px solid #000;">' +
                     '<th style="width: 10%;text-align: center;">??</th>' +
                     '<th style="width: 40%;text-align: center;">??????????</th>' +
                     '<th style="width: 10%;text-align: center;">??????????</th>' +
                     '<th style="width: 30%;text-align: right;">??????????</th>' +
                  '</tr>' +
               '</thead>' +
               '<tbody>' +
               this.duplicatereceiptdetails +
               '</tbody>' +
            '<tfoot>' +
          '<tr style="border-bottom: 1px solid #000;border-top: 2px solid #000;">' +
                    '<td></td>' +
            '<td style="text-align: left;font-weight: 100"><h5>???????????? ????????????</h5></td>' +
            '<td style="text-align: center;font-weight: 100"><h5>' + this.discount + '</h5></td>' +
            '<td></td>' +
                '</tr>' +
        '</tfoot>' +
       '</table>' +
       '<table style="width: 80%;margin-left: 28px;border-collapse: collapse;">' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight: 550;"> ???????????? ????????????????/Total Price:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: right;font-weight:100">' + this.totalPrice + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight: 550;"> ??.??.??./Total Discount:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.totalDiscount + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight: 550;"> 5% ?????????? ????????????  ??????????????/Tax:</h5>' +
           '</td>' +
           '<td>' +
              '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.taxAmount + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight: 550;">  ???????????? ????????????/Net Amount:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.netAmount + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight: 550;"> ???????????? ??????????????/Paid Amount:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm; text-align: right; font-weight: 100">' + this.paidAmount + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight: 550;"> ????????/Balance Amount:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: right;font-weight: 100">' + this.customerBalance + '</h5>' +
           '</td>' +
         '</tr>' +
       '</table>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 20%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">?????????? : </h5>' +
          '</td>' +
          '<td style="width: 80%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 100">  </h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
      '<table style="width: 100%; border-collapse: collapse;">' +
         '<tr style="border-bottom: 2px solid #000;border-top: 1px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: left;font-weight: 550;"> ?????????? ?????????? </h5>' +
           '</td>' +
           '<td>' +
              '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 550;"> ???????????? ?????????????? </h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 550;"> ?????? ???????????????? </h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 1px solid #d0caca;">' +
           '<td>' +
            '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100"> ????????/Cash: </h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 100">' + this.amount +  '</h5>' + 
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">  </h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 1px solid #d0caca;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100"> ???? ????/Knet: </h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.knet +  '</h5>' + 
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberKNet + '</h5>' + 
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 1px solid #d0caca;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100">?????????? ????????/Visa: </h5>' + 
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.visa + '</h5>' + 
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberVisa + '</h5>' + 
           '</td>' +
         '</tr>' +
        '<tr style="border-bottom: 1px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100">?????????? ????????/Credit Card: </h5>' + 
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.creditcard + '</h5>' + 
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
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.paycash + '</h5>' +
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
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align:center;font-weight: 700;">* &nbsp;' + this.invoiceNum +  '&nbsp; *</h5>' +
           '</td>' +
         '</tr>' +
         '</table>' +
  '</div>' +
  '</html>';
  console.log(this.duplicatereceiptHTML);
  }
}
