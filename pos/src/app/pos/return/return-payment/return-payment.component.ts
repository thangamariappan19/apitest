import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MPaymentType } from 'src/app/models/m-payment-type';
import { MInvoiceHeader } from 'src/app/models/m-invoice-header';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MPaymentDetails } from 'src/app/models/m-payment-details';
import { MSalesReturnHeader } from 'src/app/models/m-sales-return-header';
import { QzTrayService } from 'src/app/qz-tray-service';
import { MDayClosing } from 'src/app/models/m-day-closing';


declare var jQuery: any;

@Component({
  selector: 'app-return-payment',
  templateUrl: './return-payment.component.html',
  styleUrls: ['./return-payment.component.css']
})
export class ReturnPaymentComponent implements OnInit {

  
  myForm: FormGroup;

  payment_types: Array<MPaymentType>;
  payment_mode = [];
  temp_image: string = "assets/img/preview-image.png";

  payment_return: MSalesReturnHeader = null;
  user_details: MUserDetails = null;
  payment_details: Array<MPaymentDetails> = null;

  total_due: number = 0;
  balance: number = 0;
  change: number = 0;
  decimal_places: number = 0;
  currency_code: string = '';

  cash_mode: boolean = true;
  current_mode: string = '';
  current_payment_type: MPaymentType = null;
  logedpos_details: MDayClosing = null;

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
  //temp_image: string = "assets/img/preview-image.png";
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
  printerName : any;
  barcode;

  constructor(private api: ApiService,
      private common: CommonService,
      private fb: FormBuilder,
      private confirm: ConfirmService,
      public router: Router,
      private printService: QzTrayService) {
        this.SalesReturnDetailsList = new Array<any>();
      localStorage.setItem('pos_mode', 'true');
      let inv_str: string = localStorage.getItem('payment_return');
      if (inv_str != null) {
          this.payment_return = JSON.parse(inv_str);
      }

      let usr_str: string = localStorage.getItem('user_details');
      if (usr_str != null) {
          this.user_details = JSON.parse(usr_str);
      }
      

      let temp_pos: string = localStorage.getItem('pos_details');
      if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);
      this.printerName = this.logedpos_details.printerDeviceName;
      //this.printerName = "EPSON TM-T88IV Receipt"; 
      
    }

      if (this.payment_return == null) {
          common.showMessage("warn", "Invalid Sales Return");
          localStorage.setItem('pos_mode', 'true');
          this.router.navigate(['return']);
      }

      if (this.user_details == null) {
          common.showMessage("warn", "Invalid User Details");
          localStorage.setItem('pos_mode', 'true');
          this.router.navigate(['return']);
      }

      this.decimal_places = this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;
      this.currency_code = this.user_details.currencySymbol != null ? this.user_details.currencySymbol : '';
      this.total_due = this.payment_return.totalReturnAmount != null ? this.payment_return.totalReturnAmount : 0;

      this.createForm();
      this.get_payment_types();
      this.calculate();
  }

  ngOnInit() {
    //   localStorage.setItem('pos_mode', 'true');
      (function ($) {
          /*$(document).ready(function () {
              $('#amount_received').numpad({
                  hidePlusMinusButton: true,
                  decimalSeparator: '.'
              });
          });*/
      })(jQuery);
  }

  get_payment_types() {
      
      this.payment_types = null;
      this.payment_mode = [];

      let temp_str: string = localStorage.getItem('return_payment_types');
      if (temp_str != null) {
          this.payment_types = JSON.parse(temp_str);

          let temp_str1: string = localStorage.getItem('return_payment_mode');
          if (temp_str1 != null) {
              this.payment_mode = JSON.parse(temp_str1);
          }
      } else {

          this.common.showSpinner();
          this.api.getAPI("paymenttype")
              .subscribe((data) => {
                  setTimeout(() => {
                      if (data != null && data.statusCode != null && data.statusCode == 1) {
                          if (data.paymentTypeMasterList != null) {
                              this.payment_types = data.paymentTypeMasterList;

                              for (let item of this.payment_types) {
                                if(item.refundable == true){
                                  item.paymentImage = item.paymentImage == null ? this.temp_image : 'data:image/gif;base64,' + item.paymentImage;

                                  let exists: boolean = false;
                                  if (this.payment_mode != null && this.payment_mode.length > 0) {
                                      for (let mode of this.payment_mode) {
                                          if (mode == item.paymentType) {
                                              exists = true;
                                              break;
                                          }
                                      }
                                  }

                                  if (!exists) {
                                      this.payment_mode.push(item.paymentType);
                                  }
                                }
                                  
                              }
                              if(this.payment_types != null){
                                localStorage.setItem('return_payment_types', JSON.stringify(this.payment_types));
                              }
                              
                              if(this.payment_mode != null){
                                localStorage.setItem('return_payment_mode', JSON.stringify(this.payment_mode));
                              }
                              
                          } else {
                              this.common.showMessage('warn', 'No Payment Types Found.');
                          }


                      } else {
                          this.common.showMessage('warn', 'Failed to retrieve Payment Types.');
                      }
                      this.common.hideSpinner();
                  }, this.common.time_out_delay);
              });
      }
  }

  get_payment_types_of_payment_mode(mode: string) {
    // return this.payment_types.filter(x => x.paymentType == mode);
    return this.payment_types.filter(x => x.paymentType == mode && x.refundable == true)
      .sort((a, b) => a.sortOrder.localeCompare(b.sortOrder));
  }

  createForm() {
      this.myForm = this.fb.group({
          amount_received: ['0'],
          card_number: [''],
          voucher_number: [''],
          card_holder: ['']
      });

      this.clear_controls();
  }

  clear_controls() {
      this.payment_mode_changed('cash', null);
      this.clear_payment();
  }

  payment_mode_changed(str_mode: string, type: MPaymentType) {
      if (str_mode.toLowerCase() == 'cash') {
          this.current_mode = 'CASH';
          this.cash_mode = true;
          this.current_payment_type = null;
          this.clear_payment();
      } else {
          this.current_payment_type = type;
          this.cash_mode = false;
          this.current_mode = type.paymentName;
      }
  }

  amount_changed() {
      // alert('Hello');
  }

  add_payment() {
      // let amount_received = this.myForm.get('amount_received').value;
      let amount_received = ((document.getElementById("amount_received") as HTMLInputElement).value);
      let card_number = this.myForm.get('card_number').value;
      let voucher_number = this.myForm.get('voucher_number').value;
      let card_holder = this.myForm.get('card_holder').value;
      if (amount_received == null || amount_received == '' || parseFloat(amount_received) <= 0) {
          this.common.showMessage("warn", "Invalid Amount");
      } else if (this.cash_mode == false && parseFloat(amount_received) > this.balance) {
          this.common.showMessage("warn", "Amount exceeded Total due.");
      } else if (this.cash_mode == false && (card_number == null || card_number == '')) {
          this.common.showMessage("warn", "Card number is empty");
      } else if (this.cash_mode == false && (voucher_number == null || voucher_number == '')) {
          this.common.showMessage("warn", "Voucher number is empty");
      } else {
          let payment_item: MPaymentDetails = new MPaymentDetails();
          payment_item = {
              slNo: 0,
              businessDate: this.payment_return.documentDate,
              fromCountryID: this.user_details.countryID,
              fromStoreID: this.user_details.storeID,
              mode: this.cash_mode == true ? 'CASH' : this.current_payment_type.paymentType,
              payCurrencyID: this.user_details.currencyID,
              payCurrency: this.user_details.currencyCode,
              changeCurrency: this.user_details.currencyCode,
              changeCurrencyID: this.user_details.currencyID,
              baseAmount: 0,
              receivedamount: parseFloat(amount_received),
              returnAmount: 0,
              balanceAmountToBePay: 0,

              cardType2: this.current_mode,

              cardNo: card_number,
              cardHolder: card_holder,
              approveNo: voucher_number
          };

          if (this.payment_details == null) {
              this.payment_details = new Array<MPaymentDetails>();
          }

          this.payment_details.push(payment_item);

          this.clear_controls();

          this.calculate();
      }
  }

  clear_payment() {
      this.myForm.controls['amount_received'].setValue('0');
      this.myForm.controls['card_number'].setValue('');
      this.myForm.controls['voucher_number'].setValue('');
      this.myForm.controls['card_holder'].setValue('');
  }

  remove_payment(item) {
      const idx = this.payment_details.indexOf(item, 0);
      // this.common.showMessage('', idx.toString());
      if (idx > -1) {
          this.payment_details.splice(idx, 1);
          this.calculate();
      }
  }

  calculate() {
      let paid_amount: number = 0;
      let base_amount: number = this.total_due;
      this.myForm.controls['amount_received'].setValue(base_amount);
      if (this.payment_details != null && this.payment_details.length > 0) {
          for (let item of this.payment_details) {
              item.slNo = this.payment_details.indexOf(item, 0) + 1;
              item.baseAmount = base_amount;
              item.returnAmount = item.receivedamount > base_amount ? item.receivedamount - base_amount : 0;
              item.balanceAmountToBePay = base_amount > item.receivedamount ? base_amount - item.receivedamount : 0;
              base_amount = base_amount - item.receivedamount;
              paid_amount += item.receivedamount;
          }
      }
      this.balance = this.total_due > paid_amount ? (this.total_due - paid_amount) : 0;
      this.change = paid_amount > this.total_due ? (paid_amount - this.total_due) : 0;

      if (this.balance == 0) {
          this.save_payment();
      }
  }

  save_payment() {
      if (this.payment_return == null) {
          this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
      } else if (this.payment_return.totalReturnQty == null || this.payment_return.totalReturnQty <= 0) {
          this.common.showMessage("warn", "Atleast one Return Item expected.");
      } else if (this.payment_return.totalReturnAmount == null || this.payment_return.totalReturnAmount < 0) {
          this.common.showMessage("warn", "Return Amount must be non-negative.");
      } else if (this.payment_return.shiftID == null || this.payment_return.shiftID == 0) {
          this.common.showMessage("warn", "Shift ID must be required.");
      } else {
          // this.payment_return.salesStatus = 'Completed';
          // this.payment_return.returnAmount = this.change;
          // this.payment_return.receivedAmount = this.total_due + this.change;
          // this.payment_return.totalReturnAmount = this.total_due;

          this.payment_return.salesReturnPaymentdetails = new Array<MPaymentDetails>();
          
          this.payment_return.salesReturnPaymentdetails = this.payment_details;
          
          this.common.showSpinner();
          this.api.postAPI("SalesReturn", this.payment_return).subscribe((data) => {
              
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                  this.common.hideSpinner();
                  this.common.showMessage('success', 'Sales Return saved successfully.');

                  this.documentNo = this.payment_return.documentNo;
                  this.PrintReturnReceipt();
                   
                  localStorage.setItem('return_Invoicedetails', null);
                  //localStorage.setItem('sales_return', JSON.stringify(this.payment_return.documentNo));
                  //this.router.navigate(['return-receipt']);
                  
                  this.goto_pos();
              } else {
                  setTimeout(() => {
                      this.common.hideSpinner();
                      this.common.showMessage('error', 'Failed to Save.');
                  }, this.common.time_out_delay);
              }
          });
      }
  }

  goto1_pos()
  {
    // localStorage.setItem('payment_invoice', 'true');
    localStorage.setItem('pos_mode', 'true');
    this.router.navigate(['return']);
  }

  goto_pos() {
      this.payment_return = null;
      localStorage.removeItem('payment_return');
      localStorage.setItem('return_Invoicedetails', null);
      localStorage.setItem('pos_mode', 'true');
      this.router.navigate(['return']);
  }
  PrintReturnReceipt(){
    this.getReturnReport();
  }
  getReturnReport() {
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
    this.api.getAPI("ReturnReceipt?invoice="+ this.documentNo)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.SalesReturnDetails = data.invoiceReturnList;
            this.storeImage = data.invoiceReturnList[0].storeImage == null || data.invoiceReturnList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.invoiceReturnList[0].storeImage;  
            this.shopName = data.invoiceReturnList[0].shopName != null ? data.invoiceReturnList[0].shopName : "";
            this.posName = data.invoiceReturnList[0].posName != null ? data.invoiceReturnList[0].posName : "";
            this.invoiceNo = data.invoiceReturnList[0].invoiceNo != null ? data.invoiceReturnList[0].invoiceNo : "";
            this.date = this.common.toddmmmyyFormat(data.invoiceReturnList[0].date);
            this.time = this.common.tohhmmaFormat(data.invoiceReturnList[0].time);
            this.customerName = data.invoiceReturnList[0].customerName != null ? data.invoiceReturnList[0].customerName : "";
            this.salesMan = data.invoiceReturnList[0].salesMan != null ? data.invoiceReturnList[0].salesMan : "";
            this.cashier = data.invoiceReturnList[0].cashier != null ? data.invoiceReturnList[0].cashier : "";
            this.taxNo = data.invoiceReturnList[0].taxNo != null ? data.invoiceReturnList[0].taxNo : "";
            this.salesinvoiceNo = data.invoiceReturnList[0].salesInvoice != null ? data.invoiceReturnList[0].salesInvoice : "";
            this.totalDiscount = data.invoiceReturnList[0].totalDiscount != null ? data.invoiceReturnList[0].totalDiscount : "";
            this.taxAmount = data.invoiceReturnList[0].taxAmount != null ? data.invoiceReturnList[0].taxAmount : "";
            this.netAmount = data.invoiceReturnList[0].netAmount != null ? data.invoiceReturnList[0].netAmount : "";
            this.customerBalance = data.invoiceReturnList[0].customerBalance != null ? data.invoiceReturnList[0].customerBalance : "";
            this.cash = data.invoiceReturnList[0].cash != null ? data.invoiceReturnList[0].cash : "";
            this.knet = data.invoiceReturnList[0].knet != null ? data.invoiceReturnList[0].knet : "";
            this.visa = data.invoiceReturnList[0].visa != null ? data.invoiceReturnList[0].visa : "";
            this.footer = data.invoiceReturnList[0].footer != null ? data.invoiceReturnList[0].footer : "";

            this.SalesReturnDetailsList = new Array<any>();

            // if(this.taxAmount > 0)
            // {
            //   this.header = 'فاتورة مرتجعات","فاتورة مرتجعات';
            // }else{

            // }

            this.header = "فاتورة مرتجعات";

            this.totalPrice = 0;
            this.totalQty = 0;
             
            for(let i=0;i<this.SalesReturnDetails.length;i++)
            {
              if(this.SalesReturnDetails[i] != null && this.SalesReturnDetails[i].quantity != null){
                this.totalQty = this.totalQty + this.SalesReturnDetails[i].quantity;
              }

              if(this.SalesReturnDetails[i] != null && this.SalesReturnDetails[i].price != null){
                this.totalPrice = this.totalPrice + this.SalesReturnDetails[i].price;
              }
                
              if(this.SalesReturnDetails[i] != null){
                let tempdata: any = {
                  "itemCode" : this.SalesReturnDetails[i].itemCode  + ' ' + this.SalesReturnDetails[i].arabicDetails,
                  "quantity": this.SalesReturnDetails[i].quantity != null ? this.SalesReturnDetails[i].quantity : 0,
                  "price": this.SalesReturnDetails[i].price != null ? this.SalesReturnDetails[i].price : 0
                }
                this.SalesReturnDetailsList.push(tempdata);
              }
                
            }        
            
            this.returnreceiptdetails = '';

            for(let i=0;i<this.SalesReturnDetailsList.length;i++)
            {
              if(this.SalesReturnDetailsList[i]!=null){
                this.returnreceiptdetails = this.returnreceiptdetails +
                '<tr>' +
                '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;font-weight:100;">' + (i+1) + '</h5></td>' +
                '<td style="width: 55%;text-align: left;font-weight: 100"><h5 style="margin: 5px;font-weight:100;">' + this.SalesReturnDetailsList[i].itemCode + '</h5></td>' +
                '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;font-weight:100;">' + this.SalesReturnDetailsList[i].quantity  + '</h5></td>' +
                '<td style="text-align: right;font-weight: 100"><h5 style="margin: 5px;font-weight:100;">' + this.SalesReturnDetailsList[i].price.toFixed(this.decimal_places) + '</h5></td>' +
                '</tr>';
              }                
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
    '<div style="width: 80mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
         '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
      '</div>' +
       '<div style="width: 100%; text-align: center;font-weight:100">' +
        '<h4 style="margin: 2mm 0mm">&nbsp;' + this.header + '&nbsp;</h4>' +
      '</div>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width:30%">' +
            '<h5 style="margin: 2px;font-weight:550">المحل/Shop: </h5>' +
          '</td>' +
          '<td>' +
            '<h5 style="margin: 2px;font-weight:100;">' + this.shopName + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width:30%">' +
            '<h5 style="margin: 2px;font-weight:550">نقاط البيع/POS: </h5>' +
          '</td>' +
          '<td>' +
            '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.posName + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
     '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width:30%">' +
            '<h5 style="margin: 2px;font-weight:550">رقم الفاتورة /Invoice: </h5>' +
          '</td>' +
          '<td>' +
            '<h5 style="margin: 2px;margin-right:10px;">' + this.invoiceNo + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	  
     '<table style="width: 100%;">' +
         '<tr>' +
           '<td style="width:20%">' +
             '<h5 style="margin: 2px;font-weight:550"> التاريخ /Date: </h5>' +
           '</td>' +
            '<td>' +
             '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.date + '</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 2px;font-weight:550"> الوقت/Time: </h5>' +
           '</td>' +	
           '<td>' +
             '<h5 style="margin: 2px;font-weight: 100;margin-right:10px;">' + this.time + '</h5>' +
           '</td>' +	
         '</tr>' +
      '</table>' +		
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width:30%">' +
            '<h5 style="margin: 2px;font-weight:550">العميل /Customer: </h5>' +
          '</td>' +
          '<td>' +
            '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.customerName + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	 	  
     '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width:30%">' +
            '<h5 style="margin: 2px; height: 15px;font-weight:550">البائع</h5>' +
            '<h5 style="margin: 2px;font-weight:550">/Salesman: </h5>' +
          '</td>' +
          '<td>' +
            '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.salesMan + '</h5>' +
          '</td>' +
          '<td style="width:65%;">' +
            '<h5 style="margin: 2px;width:100%;font-weight:550">أمين الصندوق </h5>' +
            '<h5 style="margin: 2px;font-weight:550">/Cashier: </h5>' +
          '</td>' +
          '<td>' +
            '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.cashier + '</h5>' +
          '</td>' +
        '</tr>' +
     '</table>' +
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width:40%;">' +
            '<h5 style="margin: 2px;font-weight:550">ألرقم الضريبي للمؤسسة /Tax :</h5>' +
          '</td>' +
          '<td>' +
            '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.taxNo + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	
      '<table style="width: 100%;">' +
        '<tr>' +
          '<td style="width: 58%;">' +
            '<h5 style="margin: 2px;font-weight:550">Reference Sales Invoice No:</h5>' +
          '</td>' +
          '<td>' +
            '<h5 style="margin: 2px;font-weight:100;margin-right:10px;">' + this.salesinvoiceNo + '</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +	
      '<table style="width:95%; border-collapse: collapse;">' +
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
            '<td style="text-align: left;font-weight: 100"><h5 style="margin: 5px;">اجمالي الكميه</h5></td>' +
            '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + this.totalQty + '</h5></td>' +
            '<td></td>' +
        '</tr>'+
        '</tfoot>' +
       '</table>' +
        '<table style="width: 88%;margin-left: 28px;border-collapse: collapse;">' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 5px;font-weight:550"> المبلغ الاجمالي/Total Price:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 5px;text-align: right;font-weight:100">' + this.totalPrice.toFixed(this.decimal_places) + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 5px;font-weight:550"> الخصم/Total Discount:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 5px; text-align: right;font-weight:100">' + this.totalDiscount.toFixed(this.decimal_places) + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 5px;font-weight:550"> 5% ض.ق.م./Tax:</h5>' +
           '</td>' +
           '<td>' +
              '<h5 style="margin: 5px;text-align: right;font-weight: 100">' + this.taxAmount.toFixed(this.decimal_places) + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 5px;font-weight:550">  المبلغ الصافي/Net Amount:</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 5px; text-align: right;font-weight:100">' + this.netAmount.toFixed(this.decimal_places) + '</h5>' +
           '</td>' +
         '</tr>' +
         '<tr style="border-bottom: 2px solid #000;">' +
           '<td>' +
             '<h5 style="margin: 5px;font-weight:550"> المدفوع/Balance Amount</h5>' +
           '</td>' +
           '<td>' +
             '<h5 style="margin: 5px;text-align: right;font-weight: 100">' + this.customerBalance.toFixed(this.decimal_places) + '</h5>' +
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
            '<h5 style="margin: 5px;text-align: left;font-weight:550"> العميل/Cash: </h5>' + 
           '</td>' +
           '<td style="border-bottom: 2px solid #000;">' +
             '<h5 style="margin: 5px;text-align: center;font-weight: 100">' + this.cash.toFixed(this.decimal_places) + '</h5>' + 
           '</td>' +			   
         '</tr>' +
         '<tr>' +
           '<td style="width:40%;">' +
             '<h5 style="margin: 5px;text-align: left;font-weight:550"> رقم الهاتف/Knet: </h5>' +
           '</td>' +
           '<td  style="border-bottom: 2px solid #000;">' +
             '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.knet.toFixed(this.decimal_places) + '</h5>' + 
           '</td>' +
         '</tr>'+
         '<tr>' +
           '<td style="width:40%;">' +
             '<h5 style="margin: 5px;text-align: left;font-weight:550">موافقة من قبل/Visa: </h5>' + 
           '</td>' +
           '<td>' +
             '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.visa.toFixed(this.decimal_places) + '</h5>' + 
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
             '<h5 style="margin: 5px;text-align:center;font-weight:550">امضاء العميل</h5>' +
           '</td>' +
           '<td>  &nbsp;&nbsp;&nbsp;&nbsp;</td>'+
           '<td style="border-top: 1px solid #000;">' +
             '<h5 style="margin: 5px;text-align:center;font-weight:550"> امضاء المدير</h5>' +
           '</td>' +
         '</tr>' +
      '</table>' +
       '<table style="width:100%;">' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 5px;text-align:center;font-weight:100;font-size:12px">' + this.footer + '</h5>' +
           '</td>' +
         '</tr>' +
         '</table>' +		 
       '<table style="width:100%;height:50px">' +
        '<tr>' +
          '<td>' +
          '<img src="' + this.barcode + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
          '</td>' +
        '</tr>' +
        '</table>' +
      /*'<table style="width:100%;height:75px;background-color:gray">' +
         '<tr>' +
           '<td>' +
             '<h5 style="margin: 2mm 0mm;text-align:center;font-weight:100">DuplicateReceipt</h5>' +
           '</td>' +
         '</tr>' +
         '</table>' +*/
  '</div>' +
  '</html>';
 console.log(this.returnreceiptHTML);
  this.onPrintHTML();
  }
  onPrintHTML() {		
    if(this.user_details.saleReturnPrintCount>0)
    {
    var printData =[];	
    for(let i=0;i < this.user_details.saleReturnPrintCount;i++)
    {
    var printcount = {
				type: 'html',
				format: 'plain',
				data: this.returnreceiptHTML
      }
      printData.push(printcount);
    }
    this.printService.printHTML(this.printerName, printData);
  }
  else{
    this.common.showMessage('info', 'No ReturnPrintCount Set.');
  }
  //   var printData = [
  //     {
  //       type: 'html',
  //       format: 'plain',
  //       data: this.returnreceiptHTML
  //     }
  //   ];    
  //   this.printService.printHTML(this.printerName, printData);
  }
}
