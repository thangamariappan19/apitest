import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-sales-return-receipt',
  templateUrl: './sales-return-receipt.component.html',
  styleUrls: ['./sales-return-receipt.component.css']
})
export class SalesReturnReceiptComponent implements OnInit {
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
  countryID:any;
  customerFullName:any;
  returnreceiptHTML : any;
  returnreceiptdetails : any = '';
  //isSkuSearched: boolean = false;
 salesInvoiceNumber :any;
 storeCode :any;
  storeID :any;
  remarks :any;
  returnAmount :any;
  returnQty :any;
  cardType :any;
  totalReturnAmount:any;
  cashReceivedAmount:any;
  itemCode:any;
  unitPrice:any;
  isShown: boolean = false ; // hidden by default
  
  constructor( private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router) { 
       //this.business_date = new Date();
    this.SalesReturnDetailsList = new Array<any>();

    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }  
    let temp_str_salret: string = localStorage.getItem('sales_return');
    if (temp_str_salret != null) {
      this.documentNo = JSON.parse(temp_str_salret);
    } 
    // this.documentNo = 'SR0212';
    this.getReturnReport();
    }


    createForm() {
      
      this.myForm = this.fb.group({
        documentNo: [''],
        storeCode: ['']
      });
      
     
    }
  ngOnInit() {
    
    this.myForm = this.fb.group({
      documentNo: [''],
      storeCode: ['']
    });
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
   
    this.myForm.get('storeCode').setValue(this.user_details.storeCode);
  }


  getReturnReport() {
    this.common.showSpinner();
    this.api.getAPI("ReturnReceipt?invoice=" + this.documentNo + "" )
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.SalesReturnDetails = data.invoiceReturnList;
            this.storeImage = data.invoiceReturnList[0].storeImage == null || data.invoiceReturnList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.invoiceReturnList[0].storeImage;  
            this.shopName = data.invoiceReturnList[0].shopName;
            this.posName = data.invoiceReturnList[0].posName;
            this.invoiceNo = data.invoiceReturnList[0].invoiceNo;
            this.date = data.invoiceReturnList[0].date;
            this.time = data.invoiceReturnList[0].time;
            this.customerName = data.invoiceReturnList[0].customerName;
            this.salesMan = data.invoiceReturnList[0].salesMan;
            this.cashier = data.invoiceReturnList[0].cashier;
            this.taxNo = data.invoiceReturnList[0].taxNo;
            this.salesinvoiceNo = data.invoiceReturnList[0].salesInvoice;
            this.totalDiscount = data.invoiceReturnList[0].totalDiscount;
            this.taxAmount = data.invoiceReturnList[0].taxAmount;
            this.netAmount = data.invoiceReturnList[0].netAmount;
            this.customerBalance = data.invoiceReturnList[0].customerBalance;
            this.cash = data.invoiceReturnList[0].cash;
            this.knet = data.invoiceReturnList[0].knet;
            this.visa = data.invoiceReturnList[0].visa;
            this.footer = data.invoiceReturnList[0].footer;
        
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
  //console.log(this.returnreceiptHTML);
  }

  
  invoice_no_changed() {
    this.isShown = true;
   let docno = this.myForm.get('documentNo').value;
   
    //let no_data: boolean = false;
    let Mode = 2;
    //if (documentno != null && documentno != "") {

    //  this.invoice_header = null;
      //this.invoice_details = null;
      this.common.showSpinner();
      this.api.getAPI("SaleReturnReceipt?InvoiceNo=" + docno.trim() + "&StoreID=" + this.user_details.storeID.toString() + "&Mode=" + Mode + "")
      .subscribe((data) => {
        setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          console.log(data);
          this.countryID = data.reportDataTable[0].countryID;
          this.customerFullName = data.reportDataTable[0].customerFullName;
          this.invoiceNo = data.reportDataTable[0].invoiceNo;
          this.date = data.reportDataTable[0].date;
          this.time = data.reportDataTable[0].time;
          this.shopName = data.reportDataTable[0].storeName;
          this.salesinvoiceNo = data.reportDataTable[0].salesInvoice;
          this.totalReturnAmount = data.reportDataTable[0].totalReturnAmount;
          this.taxAmount = data.reportDataTable[0].taxAmount;
          this.itemCode = data.reportDataTable[0].itemCode;
      
          this.cashReceivedAmount = data.reportDataTable[0].cashReceivedAmount;
          this.knet = data.reportDataTable[0].knet;
        
          this.salesInvoiceNumber = data.reportDataTable[0].salesInvoiceNumber;
          this.storeCode = data.reportDataTable[0].storeCode;
          this.storeID = data.reportDataTable[0].storeID;
          this.remarks = data.reportDataTable[0].remarks;
          this.returnAmount = data.reportDataTable[0].returnAmount;
          this.returnQty = data.reportDataTable[0].returnQty;
          this.cardType = data.reportDataTable[0].cardType;
         this.unitPrice = data.reportDataTable[0].unitPrice;

         
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


    // PrintDuplicateReceipt(invoiceNo)
    // {
    //   this.invoiceNo=invoiceNo;
    //   this.getDuplicateReport1();    
    //   this.getDuplicateReport2();
    //   this.getDuplicateReport3();
    // }
    // getDuplicateReport1()
    // {
    //     this.common.showSpinner();
    //     this.api.getAPI("InvoiceReceipt1?invoice="+ this.invoiceNo)
    //     .subscribe((data) => {
    //       setTimeout(() => {
    //         if (data != null && data.statusCode != null && data.statusCode == 1) {
    //          console.log(data.invoiceList);
    //           this.DuplicateReportList1 = data.invoiceList;
    //           this.storeImage = data.invoiceList[0].storeImage == null || data.invoiceList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.invoiceList[0].storeImage; 
    //           this.shopName =  data.invoiceList[0].shopName;
    //           console.log("shopName");
    //           this.posName = data.invoiceList[0].posName;
    //           this.invoiceNum = data.invoiceList[0].invoiceNo;
    //           this.date = this.common.toddmmmyyFormat(data.invoiceList[0].date);
    //           this.time = this.common.tohhmmaFormat(data.invoiceList[0].time);
    //           this.customerName = data.invoiceList[0].customerName;
    //           this.salesMan = data.invoiceList[0].salesMan;
    //           this.cashier = data.invoiceList[0].cashier;
    //           this.taxNo = data.invoiceList[0].taxNo;
    //           this.totalDiscount = data.invoiceList[0].totalDiscount;
    //           this.taxAmount = data.invoiceList[0].taxAmount;
    //           this.netAmount = data.invoiceList[0].netAmount;
    //           this.paidAmount = data.invoiceList[0].paidAmount;
    //           this.customerBalance = data.invoiceList[0].customerBalance;
    //           this.footer = data.invoiceList[0].footer;
    //           this.discount = data.invoiceList[0].discount;
    //           this.posTitle = data.invoiceList[0].posTitle;
    //           this.decimalPlace = data.invoiceList[0].decimalPlaces;
  
    //           this.DuplicateDetailsList = new Array<any>();
  
    //           this.totalPrice = 0;
    //           this.tottaxAmount = 0;
  
    //           for(let i=0;i<this.DuplicateReportList1.length;i++)
    //           {
    //             this.totalPrice = this.totalPrice + this.DuplicateReportList1[i].price;
    //             this.tottaxAmount = this.tottaxAmount + data.invoiceList[i].taxAmount;
  
    //             let tempdata: any = {
    //               "itemCode" : this.DuplicateReportList1[i].itemCode,
    //               "qty": this.DuplicateReportList1[i].qty,
    //               "price": this.DuplicateReportList1[i].price
    //             }
    //             this.DuplicateDetailsList.push(tempdata);
    //           }
  
    //           this.duplicatereceiptdetails = '';
  
    //           for(let i=0;i<this.DuplicateDetailsList.length;i++)
    //           {
    //               this.duplicatereceiptdetails = this.duplicatereceiptdetails +
    //               '<tr>' +
    //               '<td style="text-align: center;font-weight: 100"><h5>' + (i+1) + '</h5></td>' +
    //               '<td style="text-align: left;font-weight: 100"><h5>' + this.DuplicateDetailsList[i].itemCode + '</h5></td>' +
    //               '<td style="text-align: center;font-weight: 100"><h5>' + this.DuplicateDetailsList[i].qty + '</h5></td>' +
    //               '<td style="text-align: right;font-weight: 100"><h5>' + this.DuplicateDetailsList[i].price + '</h5></td>' +
    //               '</tr>'
    //           }
  
    //           if(this.tottaxAmount > 0)
    //           {
    //             this.header = 'فاتورة ضريبية","فاتوره';
    //           }
               
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
  
    //           this.getDuplicateReceiptHTML();
  
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
    // getDuplicateReport2()
    // {
    //     this.common.showSpinner();
    //     this.api.getAPI("InvoiceReceipt2?invoice="+ this.invoiceNo)
    //     .subscribe((data) => {
    //       setTimeout(() => {
    //         if (data != null && data.statusCode != null && data.statusCode == 1) {
    //          console.log(data);
    //           this.DuplicateReportList2 = data.invoiceSubReceiptTList;
    //           this.amount = data.invoiceSubReceiptTList[0].amount;
    //           this.knet = data.invoiceSubReceiptTList[0].knet;
    //           this.visa = data.invoiceSubReceiptTList[0].visa;
    //           this.creditcard = data.invoiceSubReceiptTList[0].creditcard;
    //           this.paymentCurrency = data.invoiceSubReceiptTList[1].paymentCurrency;
  
    //           this.paycash = 0;
  
    //           for(let i=0;i<this.DuplicateReportList2.length;i++)
    //           {
    //             this.paycash = this.paycash + this.DuplicateReportList2[i].paymentCash;
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
    // getDuplicateReport3()
    // {
    //     this.common.showSpinner();
    //     this.api.getAPI("InvoiceReceipt3?invoice="+ this.invoiceNo)
    //     .subscribe((data) => {
    //       setTimeout(() => {
    //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  
    //           this.DuplicateReportList3 = data.approvalNumReceiptList;
    //           this.cardType = data.approvalNumReceiptList[0].cardType;
              
    //           if(this.cardType == 'K-Net')
    //           {
    //             this.approvalNumberKNet = data.approvalNumReceiptList[0].approvalNumber;
    //           }
    //           else if(this.cardType == 'Visa')
    //           {
    //             this.approvalNumberVisa = data.approvalNumReceiptList[0].approvalNumber;
    //           }
    //           else if(this.cardType == 'Master')
    //           {
    //             this.approvalNumberMaster = data.approvalNumReceiptList[0].approvalNumber;
    //           }
    //           else{
    //             this.approvalNumberKNet = '';
    //             this.approvalNumberVisa  = '';
    //             this.approvalNumberMaster = '';
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
    // getDuplicateReceiptHTML()
    // {
    //   this.duplicatereceiptHTML = '<html>' +	
    //   '<div style="width: 80mm;">' +
    //     '<div style="width: 60%; text-align: center;margin-left:45px">' +
    //        '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
    //     '</div>' +
    //     '<div style="width: 100%; text-align: center;font-weight:900">' +
    //       '<h4 style="margin: 2mm 0mm">*&nbsp;DUPLICATE INVOICE&nbsp;*</h4>' +
    //     '</div>' +
    //     '<table style="width: 100%;">' +
    //       '<tr>' +
    //         '<td style="width: 30%;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight: 550;">المحل/Shop : </h5>' +
    //         '</td>' +
    //         '<td style="width: 70%;text-align: left;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.shopName +  '</h5>' +
    //         '</td>' +
    //       '</tr>' +
    //     '</table>' +
    //     '<table style="width: 100%;">' +
    //       '<tr>' +
    //         '<td style="width: 30%;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight: 550;">نقاط البيع/POS : </h5>' +
    //         '</td>' +
    //         '<td style="width: 70%;text-align:left;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.posName +  '</h5>' +
    //         '</td>' +
    //       '</tr>' +
    //     '</table>' +
    //    '<table style="width: 100%;">' +
    //       '<tr>' +
    //         '<td style="width: 40%;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight: 550;">رقم الفاتورة/Invoice : </h5>' +
    //         '</td>' +
    //         '<td style="width: 60%;text-align:left;">' +
    //           '<h5 style="margin: 2mm 0mm;">' + this.invoiceNum +  '</h5>' +
    //         '</td>' +
    //       '</tr>' +
    //     '</table>' +  
    //    '<table style="width: 100%;">' +
    //        '<tr>' +
    //          '<td style="width:25%;">' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> التاريخ/Date : </h5>' +
    //          '</td>' +
    //           '<td style="width:25%;text-align:left;">' +
    //            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.date + '</h5>' +
    //          '</td>' +
    //          '<td style="width: 25%;">' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> الوقت/Time : </h5>' +
    //          '</td>' +	
    //          '<td style="width:25%;text-align:left;">' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.time + '</h5>' +
    //          '</td>' +	
    //        '</tr>' +
    //     '</table>' +		
    //     '<table style="width: 100%;">' +
    //       '<tr>' +
    //         '<td style="width: 40%;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight: 550;">العميل/Customer : </h5>' +
    //         '</td>' +
    //         '<td style="width: 60%;text-align:left;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.customerName + '</h5>' +
    //         '</td>' +
    //       '</tr>' +
    //     '</table>' +	 	  
    //    '<table style="width: 100%;">' +
    //       '<tr>' +
    //         '<td style="width:25%;">' +
    //           '<h5 style="margin: 2mm 0mm; height: 15px;font-weight: 550;">البائع</h5>' +
    //                     '<h5 style="margin: 2mm 0mm;font-weight: 550;">/Salesman: </h5>' +
    //         '</td>' +
    //         '<td style="width:25%;text-align:left;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.salesMan + '</h5>' +
    //         '</td>' +
    //         '<td style="width:25%;">' +
    //           '<h5 style="margin: 2mm 0mm; height: 15px;font-weight: 550;">أمين الصندوق </h5>' +
    //           '<h5 style="margin: 2mm 0mm;font-weight: 550;">/Cashier: </h5>' +
    //         '</td>' +
    //         '<td style="width:25%;text-align:left;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashier + '</h5>' +
    //         '</td>' +
    //       '</tr>' +
    //    '</table>' +
    //     '<table style="width: 100%;">' +
    //       '<tr>' +
    //         '<td style="width: 50%;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight: 550;">ألرقم الضريبي للمؤسسة/Tax :</h5>' +
    //         '</td>' +
    //         '<td style="width: 50%;text-align:left;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.taxNo +  '</h5>' +
    //         '</td>' +
    //       '</tr>' +
    //     '</table>' +
    //     '<table style="width:90%; border-collapse: collapse;">' +
    //             '<thead>' +
    //                 '<tr style="border-top: 1px solid #000; border-bottom: 2px solid #000;">' +
    //                    '<th style="width: 10%;text-align: center;">م</th>' +
    //                    '<th style="width: 40%;text-align: center;">النوع</th>' +
    //                    '<th style="width: 10%;text-align: center;">العدد</th>' +
    //                    '<th style="width: 30%;text-align: right;">السعر</th>' +
    //                 '</tr>' +
    //              '</thead>' +
    //              '<tbody>' +
    //              this.duplicatereceiptdetails +
    //              '</tbody>' +
    //           '<tfoot>' +
    //         '<tr style="border-bottom: 1px solid #000;border-top: 2px solid #000;">' +
    //                   '<td></td>' +
    //           '<td style="text-align: left;font-weight: 100"><h5>اجمالي الكميه</h5></td>' +
    //           '<td style="text-align: center;font-weight: 100"><h5>' + this.discount + '</h5></td>' +
    //           '<td></td>' +
    //               '</tr>' +
    //       '</tfoot>' +
    //      '</table>' +
    //      '<table style="width: 80%;margin-left: 28px;border-collapse: collapse;">' +
    //        '<tr>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> المبلغ الاجمالي/Total Price:</h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: right;font-weight:100">' + this.totalPrice + '</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '<tr>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> ض.ق.م./Total Discount:</h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.totalDiscount + '</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '<tr style="border-bottom: 2px solid #000;">' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> 5% ضريبة القيمة  المضافة/Tax:</h5>' +
    //          '</td>' +
    //          '<td>' +
    //             '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.taxAmount + '</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '<tr style="border-bottom: 2px solid #000;">' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;">  المبلغ الصافي/Net Amount:</h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm; text-align: right;font-weight:100">' + this.netAmount + '</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '<tr style="border-bottom: 2px solid #000;">' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> المبلغ المدفوع/Paid Amount:</h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm; text-align: right; font-weight: 100">' + this.paidAmount + '</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '<tr style="border-bottom: 2px solid #000;">' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> رصيد/Balance Amount:</h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: right;font-weight: 100">' + this.customerBalance + '</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //      '</table>' +
    //     '<table style="width: 100%;">' +
    //       '<tr>' +
    //         '<td style="width: 20%;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight: 550;">المحل : </h5>' +
    //         '</td>' +
    //         '<td style="width: 80%;">' +
    //           '<h5 style="margin: 2mm 0mm;font-weight: 100">  </h5>' +
    //         '</td>' +
    //       '</tr>' +
    //     '</table>' +
    //     '<table style="width: 100%; border-collapse: collapse;">' +
    //        '<tr style="border-bottom: 2px solid #000;border-top: 1px solid #000;">' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: left;font-weight: 550;"> نوعية الدفع </h5>' +
    //          '</td>' +
    //          '<td>' +
    //             '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 550;"> المبلغ المدفوع </h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 550;"> رقم الموافقة </h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '<tr style="border-bottom: 1px solid #d0caca;">' +
    //          '<td>' +
    //           '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100"> نقدي/Cash: </h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight: 100">' + this.amount +  '</h5>' + 
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">  </h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '<tr style="border-bottom: 1px solid #d0caca;">' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100"> كي نت/Knet: </h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.knet +  '</h5>' + 
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberKNet + '</h5>' + 
    //          '</td>' +
    //        '</tr>' +
    //        '<tr style="border-bottom: 1px solid #d0caca;">' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100">بطاقة فيزا/Visa: </h5>' + 
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.visa + '</h5>' + 
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberVisa + '</h5>' + 
    //          '</td>' +
    //        '</tr>' +
    //       '<tr style="border-bottom: 1px solid #000;">' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: left;font-weight:100">بطاقة فيزا/Credit Card: </h5>' + 
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.creditcard + '</h5>' + 
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberMaster + '</h5>' + 
    //          '</td>' +
    //        '</tr>' +
    //      '</table>' +
    //     '<table style="width: 100%;height:10px">' +
    //       '<tr>' +  
    //       '</tr>' +
    //     '</table>' +
    //      '<table style="width: 100%; border-collapse: collapse;" border="1">' +
    //        '<tr>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;font-weight: 550;">' + this.paymentCurrency + '</h5>' +
    //          '</td>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.paycash + '</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //     '</table>' +
    //     '<table style="width:100%;">' +
    //        '<tr>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align:center;font-weight:100">' + this.footer + '</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '</table>' +
    //     '<table style="width:100%;height:50px">' +
    //        '<tr>' +
    //          '<td>' +
    //            '<h5 style="margin: 2mm 0mm;text-align:center;font-weight: 700;">* &nbsp;' + this.invoiceNum +  '&nbsp; *</h5>' +
    //          '</td>' +
    //        '</tr>' +
    //        '</table>' +
    // '</div>' +
    // '</html>';
    // console.log(this.duplicatereceiptHTML);
    // this.onPrintHTML();
    // }
  
    // onPrintHTML() {		
    //   var printData = [
    //     {
    //       type: 'html',
    //       format: 'plain',
    //       data: this.duplicatereceiptHTML
    //     }
    //   ];    
    //   this.printService.printHTML(this.printerName, printData);
    // }
}

