import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-return-receipt',
  templateUrl: './return-receipt.component.html',
  styleUrls: ['./return-receipt.component.css']
})
export class ReturnReceiptComponent implements OnInit {

  myForm: FormGroup;
  user_details: MUserDetails = null;
  sal_ret_details: any;
  SalesReturnDetails:any;
  SalesReturnDetailsList: Array<any>;
  store_details: Array<any> = null;
  return_invoice_details_List : Array<any> = null;
  return_payment_details_List : Array<any> = null;
  business_date : any;
  storeFooter:any;
  storeHeader:any;
  cashierName:any;
  posName:any;
  taxCode:any;
  storeImage;
  temp_image: string = "assets/img/preview-image.png";
  documentNo:any;
  shopName:any;
  invoiceNo:any;
  date:any;
  time:any;
  customerName:any;
  salesMan:any;
  cashier:any;
  taxNo:any;
  salesinvoiceNo:any;
  totalDiscount:any;
  taxAmount:any;
  netAmount:any;
  customerBalance:any;
  cash:any;
  knet:any;
  visa:any;
  footer:any;
  totalQty:any = 0;
  totalPrice:any = 0;
  header:any;
  returnreceiptHTML : any;
  returnreceiptdetails : any = '';

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {

    //this.business_date = new Date();
    this.SalesReturnDetailsList = new Array<any>();

    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }  
    // let temp_str_salret: string = localStorage.getItem('sales_return');
    // if (temp_str_salret != null) {
    //   this.documentNo = JSON.parse(temp_str_salret);
    // } 
    this.documentNo = 'SR0212';
    this.getReturnReport();
  }
  getReturnReport() {
    this.common.showSpinner();
    this.api.getAPI("ReturnReceipt?invoice="+ this.documentNo)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.SalesReturnDetails = data.invoiceReturnList;
            this.storeImage = data.invoiceReturnList[0].storeImage == null || data.invoiceReturnList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.invoiceReturnList[0].storeImage;  
            this.shopName = data.invoiceReturnList[0].shopName!= null ? data.invoiceReturnList[0].shopName : "";
            this.posName = data.invoiceReturnList[0].posName!= null ? data.invoiceReturnList[0].posName : "";
            this.invoiceNo = data.invoiceReturnList[0].invoiceNo!= null ? data.invoiceReturnList[0].invoiceNo : "";
            this.date = data.invoiceReturnList[0].date!= null ? data.invoiceReturnList[0].date : "";
            this.time = data.invoiceReturnList[0].time!= null ? data.invoiceReturnList[0].time : "";
            this.customerName = data.invoiceReturnList[0].customerName!= null ? data.invoiceReturnList[0].customerName : "";
            this.salesMan = data.invoiceReturnList[0].salesMan!= null ? data.invoiceReturnList[0].salesMan : "";
            this.cashier = data.invoiceReturnList[0].cashier!= null ? data.invoiceReturnList[0].cashier : "";
            this.taxNo = data.invoiceReturnList[0].taxNo!= null ? data.invoiceReturnList[0].taxNo : "";
            this.salesinvoiceNo = data.invoiceReturnList[0].salesInvoice!= null ? data.invoiceReturnList[0].salesInvoice : "";
            this.totalDiscount = data.invoiceReturnList[0].totalDiscount!= null ? data.invoiceReturnList[0].totalDiscount : "";
            this.taxAmount = data.invoiceReturnList[0].taxAmount!= null ? data.invoiceReturnList[0].taxAmount : "";
            this.netAmount = data.invoiceReturnList[0].netAmount!= null ? data.invoiceReturnList[0].netAmount : "";
            this.customerBalance = data.invoiceReturnList[0].customerBalance!= null ? data.invoiceReturnList[0].customerBalance : "";
            this.cash = data.invoiceReturnList[0].cash!= null ? data.invoiceReturnList[0].cash : "";
            this.knet = data.invoiceReturnList[0].knet!= null ? data.invoiceReturnList[0].knet : "";
            this.visa = data.invoiceReturnList[0].visa!= null ? data.invoiceReturnList[0].visa : "";
            this.footer = data.invoiceReturnList[0].footer!= null ? data.invoiceReturnList[0].footer : "";

            this.SalesReturnDetailsList = new Array<any>();

            if(this.taxAmount > 0)
            {
              this.header = 'فاتورة مرتجعات","فاتورة مرتجعات';
            }
             
            for(let i=0;i<this.SalesReturnDetails.length;i++)
            {
                this.totalQty = this.totalQty + this.SalesReturnDetails[i].quantity;
                this.totalPrice = this.totalPrice + this.SalesReturnDetails[i].price;

                let tempdata: any = {
                  "itemCode" : this.SalesReturnDetails[i].itemCode + ' ' + this.SalesReturnDetails[i].arabicDetails,
                  "quantity": this.SalesReturnDetails[i].quantity,
                  "price": this.SalesReturnDetails[i].price
                }
                this.SalesReturnDetailsList.push(tempdata);
            }        
            // var markup = document.getElementsByTagName('html')[0].innerHTML;
            // console.log(markup);

            for(let i=0;i<this.SalesReturnDetailsList.length;i++)
            {
                this.returnreceiptdetails = this.returnreceiptdetails +
                '<tr>' +
                '<td style="text-align: center;font-weight: 100"><h5>' + (i+1) + '</h5></td>' +
                '<td style="text-align: left;font-weight: 100"><h5>' + this.SalesReturnDetailsList[i].itemCode + '</h5></td>' +
                '<td style="text-align: center;font-weight: 100"><h5>' + this.SalesReturnDetailsList[i].quantity + '</h5></td>' +
                '<td style="text-align: right;font-weight: 100"><h5>' + this.SalesReturnDetailsList[i].price + '</h5></td>' +
                '</tr>'
            }

            this.getReturnReceiptHTML();

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

  getReturnReceiptHTML(){
    this.returnreceiptHTML = '<html>' +	
    '<div style="width: 95mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
        // '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
      '</div>' +
       '<div style="width: 100%; text-align: center;font-weight:100">' +
        '<h4 style="margin: 2mm 0mm">*&nbsp;' + this.header + '&nbsp;*</h4>' +
      '</div>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 30%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:550">المحل/Shop : </h5>' +
          '</td>' +
          '<td style="width: 70%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.shopName + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 30%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:550">نقاط البيع/POS : </h5>' +
          '</td>' +
          '<td style="width: 70%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.posName + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
     '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 40%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:550">رقم الفاتورة/Invoice : </h5>' +
          '</td>' +
          '<td style="width: 60%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;">' + this.invoiceNo + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	  
     '<table style="width: 100%;">' +
         '<tr>' +
           '<td style="width: 25%;">' +
             '<h5 style="margin: 2mm 0mm;font-weight:550"> التاريخ/Date : </h5>' +
           '</td>' +
            '<td style="width:25%;text-align:left;">' +
             '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.date + '</h5>' +
           '</td>' +
           '<td style="width: 25%;">' +
             '<h5 style="margin: 2mm 0mm;font-weight:550"> الوقت/Time : </h5>' +
           '</td>' +	
           '<td style="width:25%;text-align:left;">' +
             '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.time + '</h5>' +
           '</td>' +	
         '</tr>' +
      '</table>' +		
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 40%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:550">العميل/Customer : </h5>' +
          '</td>' +
          '<td style="width: 60%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.customerName + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	 	  
     '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width:25%;">' +
            '<h5 style="margin: 2mm 0mm; height: 15px;font-weight:550">البائع</h5>' +
            '<h5 style="margin: 2mm 0mm;font-weight:550">/Salesman: </h5>' +
          '</td>' +
          '<td style="width:25%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.salesMan + '</h5>' +
          '</td>' +
          '<td style="width:25%;">' +
            '<h5 style="margin: 2mm 0mm; height: 15px;font-weight:550">أمين الصندوق </h5>' +
            '<h5 style="margin: 2mm 0mm;font-weight:550">/Cashier: </h5>' +
          '</td>' +
          '<td style="width:25%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashier + '</h5>' +
          '</td>' +
        '</tr>' +
     '</table>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 65%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:550">ألرقم الضريبي للمؤسسة/Tax :</h5>' +
          '</td>' +
          '<td style="width: 35%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.taxNo + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 50%;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:550">Reference Sales Invoice No :</h5>' +
          '</td>' +
          '<td style="width: 50%;text-align:left;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.salesinvoiceNo + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	
      '<table style="width:100%; border-collapse: collapse;">' +
            '<thead>' +
        '<tr style="border-top: 1px solid #000; border-bottom: 2px solid #000;">' +
                   '<th style="width: 10%;text-align: center;">م</th>' +
                   '<th style="width: 50%;text-align: center;">النوع</th>' +
                   '<th style="width: 10%;text-align: center;">المبلغ</th>' +
                   '<th style="width: 30%;text-align: right;">المبلغ</th>' +
                '</tr>' +
             '</thead>' +
             '<tbody>' +
             this.returnreceiptdetails +
              '</tbody>' +
        '<tfoot>' +
        '<tr style="border-top: 2px solid #000;border-bottom: 1px solid #000;">' +
            '<td></td>' +
            '<td style="text-align: left;font-weight: 100"><h5>اجمالي الكميه</h5></td>' +
            '<td style="text-align: center;font-weight: 100"><h5>' + this.totalQty + '</h5></td>' +
            '<td></td>' +
        '</tr>'+
        '</tfoot>' +
       '</table>' +
        '<table style="width: 80%;margin-left: 28px;border-collapse: collapse;">' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight:550"> المبلغ الاجمالي/Total Price:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: right;font-weight:100">' + this.totalPrice + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight:550"> الخصم/Total Discount:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.totalDiscount + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight:550"> 5% ض.ق.م./Tax:</h5>' +
           '</td>' +
           '<td>' +
              '<h5 style="margin: 2mm 0mm;text-align: right;font-weight: 100">' + this.taxAmount + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight:550">  المبلغ الصافي/Net Amount:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.netAmount + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;font-weight:550"> المدفوع/Balance Amount</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: right;font-weight: 100">' + this.customerBalance + '</h5>' +
           '</td>' +
         '</tr>' +
       '</table>' +
      '<table style="width: 100%;height:20px">' +
        '<tr>' +  
        '</tr>' +
      '</table>' +
       '<table style="width: 100%; border-collapse: collapse;">' +	   
         '<tr>' +
           '<td style="width:40%;">' +
            '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:550"> العميل/Cash: </h5>' + 
           '</td>' +
           '<td style="border-bottom: 2px solid #000;">' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 100">' + this.cash + '</h5>' + 
           '</td>' +			   
         '</tr>' +
         '<tr>' +
           '<td style="width:40%;">' +
             '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:550"> رقم الهاتف/Knet: </h5>' +
           '</td>' +
           '<td  style="border-bottom: 2px solid #000;">' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.knet + '</h5>' + 
           '</td>' +
         '</tr>'+
         '<tr>' +
           '<td style="width:40%;">' +
             '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:550">موافقة من قبل/Visa: </h5>' + 
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.visa + '</h5>' + 
           '</td>' +
         '</tr>' +		   
       '</table>' +
      '<table style="width: 100%;height:60px">' +
        '<tr>' +  
        '</tr>' +
      '</table>' +
       '<table style="width:100%;">' +
         '<tr>' +
           '<td style="border-top: 1px solid #000;">' +
             '<h5 style="margin: 2mm 0mm;text-align:center;font-weight:550">امضاء العميل</h5>' +
           '</td>' +
           '<td style="border-top: 1px solid #000;">' +
             '<h5 style="margin: 2mm 0mm;text-align:center;font-weight:550"> امضاء المدير</h5>' +
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
            '<h5 style="margin: 2mm 0mm;text-align:center;font-weight:700">* &nbsp;' + this.invoiceNo +  '&nbsp; *</h5>' +
          '</td>' +
        '</tr>' +
        '</table>' +
      '<table style="width:100%;height:75px;background-color:gray">' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align:center;font-weight:100">DuplicateReceipt</h5>' +
           '</td>' +
         '</tr>' +
         '</table>' +
  '</div>' +
  '</html>';
  console.log(this.returnreceiptHTML);
  }

  ngOnInit(): void {
  }

}
