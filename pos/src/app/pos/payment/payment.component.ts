import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MPaymentType } from 'src/app/models/m-payment-type';
import { MInvoiceHeader } from 'src/app/models/m-invoice-header';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MPaymentDetails } from 'src/app/models/m-payment-details';
import { QzTrayService } from 'src/app/qz-tray-service';
import { MDayClosing } from 'src/app/models/m-day-closing';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MExchangeRate } from 'src/app/models/m-exchange-rate';

declare var jQuery: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  printerName: any;

  myForm: FormGroup;

  payment_types: Array<MPaymentType>;
  payment_mode = [];
  temp_image: string = "assets/img/preview-image.png";

  payment_invoice: MInvoiceHeader;// = null;
  user_details: MUserDetails = null;
  payment_details: Array<MPaymentDetails>;// = null;

  total_due: number = 0;
  balance: number = 0;
  change: number = 0;
  decimal_places: number = 0;
  currency_code: string = '';
  currency_code1: string = '';

  cash_mode: boolean = true;
  current_mode: string = '';
  current_payment_type: MPaymentType = null;
  logedpos_details: MDayClosing = null;
  exchange_List: Array<MExchangeRate>;
  CurrencyExchangeList: Array<MExchangeRate> = null;
  RetExchangeAmount = 0;

  //user_details: MUserDetails = null;
  invoiceNo: any;
  InvoiceReportList1: any;
  InvoiceReportList2: any;
  InvoiceReportList3: any;
  InvoiceDetailsList: Array<any>;
  storeImage;
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
  billtotalQty:any = 0;
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
  decimalPlaces: any;
  invoicereceiptHTML: any;
  invoicereceiptdetails: any = '';
  isShown: boolean;
  tabIndex: number = 0;
  cashChecked: boolean = false;
  changecurreny: string;
  exchangeratecoversion: boolean = false;
  exchangebalance: any;
  paymentcurrency1: string;
  changecurrencyid: number;
  paymentcurrenyid: number;
  paymentModeList:Array<any>;
  public  active=0;
  ishide:boolean=false;
 barcode;

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private printService: QzTrayService) {

    this.InvoiceDetailsList = new Array<any>();

    localStorage.setItem('pos_mode', 'true');
    let inv_str: string = localStorage.getItem('payment_invoice');
    if (inv_str != null) {
      this.payment_invoice = JSON.parse(inv_str);
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

    if (this.payment_invoice == null) {
      common.showMessage("warn", "Invalid Invoice");
      localStorage.setItem('pos_mode', 'true');
      this.router.navigate(['pos']);
    }

    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'true');
      this.router.navigate(['pos']);
    }

    this.decimal_places = this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;
    this.currency_code = this.user_details.currencySymbol != null ? this.user_details.currencySymbol : '';
    this.total_due = this.payment_invoice.netAmount != null ? this.payment_invoice.netAmount : 0;

    this.isShown = false;

    this.createForm();
    this.getPaymentModeList();
    this.get_payment_types();
    this.calculate();
    this.ExchangeRate_details();
  }

  ngOnInit() {
    this.isShown = false;
    // localStorage.setItem('pos_mode', 'true');
    // (function ($) {
    //     $(document).ready(function () {
    //         $('#amount_received').numpad({
    //             hidePlusMinusButton: true,
    //             decimalSeparator: '.'
    //         });
    //     });
    // })(jQuery);
  }

  get_payment_types() {

    this.payment_types = null;
    this.payment_mode = [];

    let temp_str: string = localStorage.getItem('payment_types');
    if (temp_str != null) {
      this.payment_types = JSON.parse(temp_str);
      // console.log(this.payment_types);

      let temp_str1: string = localStorage.getItem('payment_mode');
      if (temp_str1 != null) {
        this.payment_mode = JSON.parse(temp_str1);
      }
      this.ishide=true;
    } else {

      this.common.showSpinner();
      this.api.getAPI("PaymentType")
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              if (data.paymentTypeMasterList != null) {
                this.payment_types = data.paymentTypeMasterList;
                //this.payment_types.filter(x=>x.active==true);
                this.payment_types = this.payment_types.filter(x => x.active == true);

                for (let item of this.payment_types) {
                  item.paymentImage = item.paymentImage == null ? this.temp_image : 'data:image/gif;base64,' + item.paymentImage;

                  // let exists: boolean = false;
                  // if (this.payment_mode != null && this.payment_mode.length > 0) {
                  //   for (let mode of this.payment_mode) {
                  //     if (mode == item.paymentType) {
                  //       exists = true;
                  //       break;
                  //     }
                  //   }
                  // }

                  // if (!exists) {
                  //   this.payment_mode.push(item.paymentType);
                  // }
                }

                localStorage.setItem('payment_types', JSON.stringify(this.payment_types));
                localStorage.setItem('payment_mode', JSON.stringify(this.payment_mode));
                this.active=0;
                this.ishide=true;
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
    if(this.payment_types!=null)
    {
      return this.payment_types.filter(x => x.paymentType == mode)
    }
      else
      {
      return '';
      }
    // this.myForm.controls['amount_received'].setValue(this.total_due.toFixed(this.decimal_places));
  }
  getPaymentModeList() {
    this.paymentModeList = null;
    this.payment_mode = [];
    this.common.showSpinner();
    this.api.getAPI("PaymentModeMaster")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.paymentModeList = data.paymentModeMasterDate;
            for(let item of this.paymentModeList)
            {
            let exists: boolean = false;
            if (this.payment_mode != null && this.payment_mode.length > 0) {
                for (let mode of this.payment_mode) {
                    if (mode == item.paymentModeName) {
                        exists = true;
                        break;
                    }
                }
            }

            if (!exists) {
                this.payment_mode.push(item.paymentModeName);
            }
          }
          localStorage.setItem('payment_mode', null);
          localStorage.setItem('payment_mode', JSON.stringify(this.payment_mode));
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
  createForm() {
    this.myForm = this.fb.group({
      amount_received: ['0'],
      card_number: [''],
      voucher_number: [''],
      card_holder: [''],
      selected_card: [''],
      changecurrency: [''],
      PaymentCurrency: ['']
    });

    this.clear_controls();
  }

  clear_controls() {
    this.payment_mode_changed('cash', null);
    this.clear_payment();
  }

  payment_mode_changed(str_mode: string, type: MPaymentType) 
  {
    

    if(type!=null)
    {
    if(type.paymentType.toLocaleLowerCase()=='cash'){
      this.current_mode = 'CASH';
      this.cash_mode = true;
      this.current_payment_type = null;
      this.cashChecked=true;
      this.clear_payment();
      
  } else {
      this.current_payment_type = type;
      this.cash_mode = false;
      this.cashChecked=false;
      this.current_mode = type.paymentName;
      if(this.payment_details!=null)
      {
        this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
      }
      else{
      this.myForm.controls['amount_received'].setValue(this.total_due.toFixed(this.decimal_places));
      // .log("Type : " + this.current_payment_type + ", mode : " + this.current_mode);
      }
}
}
else
{
  this.current_mode = 'CASH';
      this.cash_mode = true;
      this.current_payment_type = null;
      this.cashChecked=true;
      this.clear_payment();
  }
  }
  amount_changed() {
    // alert('Hello');
  }

  add_payment() {
    let amount_received = this.myForm.get('amount_received').value;
    
    let onAccountApllicaple  = this.payment_invoice.onAccountApplicable;
    
    //let amount_received = ((document.getElementById("amount_received") as HTMLInputElement).value);
    let card_number = this.myForm.get('card_number').value;
    let voucher_number = this.myForm.get('voucher_number').value;
    let card_holder = this.myForm.get('card_holder').value;
    if (amount_received == null || amount_received == '' || parseFloat(amount_received) <= 0) {
      this.common.showMessage("warn", "Invalid Amount");
    } else if (this.cash_mode == false && parseFloat(amount_received) > this.balance) {
      this.common.showMessage("warn", "Amount exceeded Total due.");
      // } else if (this.cash_mode == false && this.current_mode.toLowerCase() != 'on-account' && (card_number == null || card_number == '')) {
      //     this.common.showMessage("warn", "Card number is empty");
    } else if (this.cash_mode == false && this.current_mode.toLowerCase() != 'on-account' && (voucher_number == null || voucher_number == '')) {
      this.common.showMessage("warn", "Approval number is empty");
    } else {
      if (this.exchangeratecoversion == true) {
        this.changecurrencyid = this.myForm.get('changecurrency').value;
        this.paymentcurrenyid = this.myForm.get('PaymentCurrency').value;
        this.currency_code1 = this.paymentcurrency1;
      }
      else if (this.exchangeratecoversion == false) {
        this.paymentcurrency1 = this.user_details.currencyCode;
        this.changecurreny = this.user_details.currencyCode;
        this.paymentcurrenyid = this.user_details.currencyID;
        this.changecurrencyid = this.user_details.currencyID;
        this.currency_code1 = this.user_details.currencySymbol;
      }
      let payment_item: MPaymentDetails = new MPaymentDetails();
      payment_item = {
        slNo: 0,
        businessDate: this.payment_invoice.businessDate,
        fromCountryID: this.user_details.countryID,
        fromStoreID: this.user_details.storeID,
        mode: this.cash_mode == true ? 'Cash' : this.current_payment_type.paymentType,
        payCurrencyID: this.paymentcurrenyid,
        payCurrency: this.paymentcurrency1,
        changeCurrency: this.changecurreny,
        changeCurrencyID: this.changecurrencyid,
        baseAmount: 0,
        receivedamount: parseFloat(amount_received),
        returnAmount: 0,
        onAccountReceiveAmount: 0,
        //onAcPaymentCompleted:this.current_mode.toLowerCase() != 'on-account'?'NULL' : false,
        balanceAmountToBePay: 0,

        cardType2: this.current_mode,

        cardNo: card_number,
        cardHolder: card_holder,
        approveNo: voucher_number,
        isPaymentProcesser: false
      };

      if (this.payment_details == null) {
        this.payment_details = new Array<MPaymentDetails>();
      }

      if (payment_item.mode == "Cash") {
        let prev_cash_paid: boolean = false;

       /* for (let pd of this.payment_details) {
          if (pd.mode == "Cash") {
            prev_cash_paid = true;
            let prev_amount: string = pd.receivedamount.toString();
            let curr_amount: string = payment_item.receivedamount.toString();
            pd.receivedamount = parseFloat(prev_amount) + parseFloat(curr_amount);
          }
        }*/

        if (prev_cash_paid == false) {
          this.payment_details.push(payment_item);
        }
      } else {
        this.payment_details.push(payment_item);


      }

      // this.clear_controls();
      this.clear_payment();


      this.calculate();
      // this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
    }
  }

  clear_payment() {
    this.myForm.controls['amount_received'].setValue("0");
    this.myForm.controls['card_number'].setValue('');
    this.myForm.controls['voucher_number'].setValue('');
    this.myForm.controls['card_holder'].setValue('');
    if (this.cash_mode == true) {
      this.myForm.controls['amount_received'].setValue("0");
    }
    else {
      if (this.payment_details != null) {
        this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
      }
      else {
        this.myForm.controls['amount_received'].setValue(this.total_due.toFixed(this.decimal_places));
        // .log("Type : " + this.current_payment_type + ", mode : " + this.current_mode);
      }
    }
  }

  remove_payment(item) {
    const idx = this.payment_details.indexOf(item, 0);
    // this.common.showMessage('', idx.toString());
    if (idx > -1) {
      this.payment_details.splice(idx, 1);
      this.calculate();
      if (this.payment_details != null) {
        this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
      }
      if (this.exchangeratecoversion) {
        this.myForm.controls['amount_received'].setValue(this.exchangebalance.toFixed(this.decimal_places));
      }
      else {
        //this.myForm.controls['amount_received'].setValue(this.total_due.toFixed(this.decimal_places));
        this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
        // .log("Type : " + this.current_payment_type + ", mode : " + this.current_mode);
      }

    }
    if (idx <= 0) {
      this.isShown = !this.isShown;
    }

  }

  calculate() {
    let paid_amount: number = 0;
    let base_amount: number = this.total_due;
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

    if (!this.exchangeratecoversion) {
      this.balance = this.total_due > paid_amount ? (this.total_due - paid_amount) : 0;
      this.change = paid_amount > this.total_due ? (paid_amount - this.total_due) : 0;
      this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
    }
    else {

      this.exchangebalance = this.RetExchangeAmount > paid_amount ? (this.RetExchangeAmount - paid_amount) : 0;
      this.change = paid_amount > this.RetExchangeAmount ? (paid_amount - this.RetExchangeAmount) : 0;
      this.myForm.controls['amount_received'].setValue(this.exchangebalance.toFixed(this.decimal_places));
    }
    if (!this.isShown) {
      this.isShown = !this.isShown;
    }
    // if (this.balance == 0) {
    //     this.save_payment();
    // }
  }
  Make_payment() {
    let onAccountApllicaple  = this.payment_invoice.onAccountApplicable;
    if (!this.exchangeratecoversion) {
      if (this.balance == 0  ) {
        this.save_payment();
      }
      else if(onAccountApllicaple == true){
        this.save_payment();
      }
      else if(onAccountApllicaple == false && this.balance != 0)
      {
        this.common.showMessage("warn", "On Account Is not Applicaple for this Customer");
      }
      else {
        this.common.showMessage("warn", "Invalid Amount");
      }
    }
    else if (this.exchangeratecoversion) {
      if (this.exchangebalance.toFixed(2) == 0) {
        this.save_payment();
      }else if(onAccountApllicaple == true){
        this.save_payment();
      }
      else {
        this.common.showMessage("warn", "Invalid Amount");
      }

    }

  }
  save_payment() {
    if (this.payment_invoice == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    } else if (this.payment_invoice.customerID == null || this.payment_invoice.customerID == 0) {
      this.common.showMessage("warn", "Invalid Customer.");
    } else if (this.payment_invoice.salesEmployeeID == null || this.payment_invoice.salesEmployeeID == 0) {
      this.common.showMessage("warn", "Invalid Sales Employee.");
    } else if (this.payment_invoice.totalQty == null || this.payment_invoice.totalQty <= 0) {
      this.common.showMessage("warn", "Atleast one Invoice Item expected.");
    } else if (this.payment_invoice.subTotalAmount == null || this.payment_invoice.subTotalAmount <= 0) {
      this.common.showMessage("warn", "Sub Total must be greater than zero.");
    } else if (this.payment_invoice.netAmount == null || this.payment_invoice.netAmount < 0) {
      this.common.showMessage("warn", "Invoice Total must be non-negative.");
    } else if (this.payment_invoice.shiftID == null || this.payment_invoice.shiftID == 0) {
      this.common.showMessage("warn", "Shift ID must be required.");
    } else {
      this.payment_invoice.salesStatus = 'Completed';
      let onAccountApllicaple  = this.payment_invoice.onAccountApplicable;
      if(onAccountApllicaple==true && this.balance!=0)
      {
        this.payment_invoice.returnAmount = 0;
        this.payment_invoice.receivedAmount = this.total_due - this.balance;
        this.payment_invoice.isCreditSale=true;
      }
      else
      {
      this.payment_invoice.returnAmount = this.change;
      this.payment_invoice.receivedAmount = this.total_due + this.change;
      this.payment_invoice.isCreditSale=false;
      }
      this.payment_invoice.paymentList = new Array<MPaymentDetails>();
      if(this.balance!=0)
      {
        for(let Payment of this.payment_details)
        {
          if(Payment.mode != "Cash")
          {
            Payment.balanceAmountToBePay = this.balance;
          }
        }
      }
      this.payment_invoice.paymentList = this.payment_details;
      if (this.payment_invoice.invoiceDetailList != null && this.payment_invoice.invoiceDetailList.length > 0) {
        for (let item of this.payment_invoice.invoiceDetailList) {
          item.skuImage = '';
        }
      }
      this.common.showSpinner();
      this.api.postAPI("invoice", this.payment_invoice).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', 'Invoice saved successfully.');

          //localStorage.setItem('sales_invoice', JSON.stringify(this.payment_invoice.invoiceNo));
          //this.router.navigate(['invoice-receipt']);

          this.invoiceNo = this.payment_invoice.invoiceNo;
          this.PrintInvoiceReceipt();
          localStorage.setItem('recall_invoice', null);
         
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

  PrintInvoiceReceipt() {
    console.log(this.user_details.printCount);

    this.getInvoiceReport1();
    // this.getInvoiceReport2();
    // this.getInvoiceReport3();

  }
  getInvoiceReport1() {
    if (this.payment_invoice != null ) {
      console.log(this.payment_invoice);
      this.InvoiceReportList1 = this.payment_invoice;
      this.storeImage = this.user_details.storeImage == null || this.user_details.storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + this.user_details.storeImage;
      this.shopName = this.user_details.storeName != null ? this.user_details.storeName : "";
      this.posName = this.payment_invoice.posCode != null ? this.payment_invoice.posCode : "";
      this.invoiceNum = this.payment_invoice.invoiceNo != null ? this.payment_invoice.invoiceNo : "";
      this.date = this.common.toddmmmyyFormat(this.payment_invoice.businessDate);
      this.time = this.common.tohhmmaFormat(this.payment_invoice.businessDate);

      this.customerName = (this.logedpos_details.defaultCustomerName != null ? this.logedpos_details.defaultCustomerName : "") +''+ (this.logedpos_details.defaultPhoneNumber != null ? this.logedpos_details.defaultPhoneNumber : "");
      this.salesMan = this.payment_invoice.salesEmployeeName != null ? this.payment_invoice.salesEmployeeName  : "";
      this.cashier = this.payment_invoice.cashierCode != null ? this.payment_invoice.cashierCode : "";
      this.taxNo = this.payment_invoice.taxCode != null ? this.payment_invoice.taxCode  : "";
      this.totalDiscount = this.payment_invoice.totalDiscountAmount != null ? this.payment_invoice.totalDiscountAmount : 0;
      this.taxAmount = this.payment_invoice.taxAmount != null ? this.payment_invoice.taxAmount : 0;
      this.netAmount = this.payment_invoice.netAmount != null ? this.payment_invoice.netAmount : 0;
      this.paidAmount = this.payment_invoice.receivedAmount != null ? this.payment_invoice.receivedAmount : 0;
      this.customerBalance = this.payment_invoice.returnAmount != null ? this.payment_invoice.returnAmount : 0;
      this.footer = this.user_details.storeFooter != null ? this.user_details.storeFooter : "";
      this.discount = this.payment_invoice.invoiceDetailList[0].discountAmount != null ? this.payment_invoice.invoiceDetailList[0].discountAmount : 0;
      this.posTitle = this.user_details.posTitle != null ? this.user_details.posTitle : "";
      //this.decimalPlace = this.invoice.invoiceDetailList.decimalPlaces != null ? data.invoiceList[0].decimalPlaces : 0;

      this.InvoiceDetailsList = new Array<any>();

      this.totalPrice = 0;
      this.tottaxAmount = 0;
      this.billtotalQty = 0;

      for (let i = 0; i < this.payment_invoice.invoiceDetailList.length; i++) {
        if (this.payment_invoice.invoiceDetailList[i].qty != null) {
          this.billtotalQty = this.billtotalQty + this.payment_invoice.invoiceDetailList[i].qty;
        }
        if (this.payment_invoice.invoiceDetailList[i].price != null) {
          this.totalPrice = this.totalPrice + this.payment_invoice.invoiceDetailList[i].sellingLineTotal;
        }

        if (this.payment_invoice.invoiceDetailList[i].taxAmount != null) {
          this.tottaxAmount = this.tottaxAmount + this.payment_invoice.invoiceDetailList[i].taxAmount;
        }

        try {

          let ic = this.payment_invoice.invoiceDetailList[i].skuCode != null ? this.payment_invoice.invoiceDetailList[i].skuCode : "";
          ic += this.payment_invoice.invoiceDetailList[i].appliedPromotionID != null 
                  && this.payment_invoice.invoiceDetailList[i].appliedPromotionID != ''
                  && this.payment_invoice.invoiceDetailList[i].appliedPromotionID != '0'
                ? "\n(" + this.payment_invoice.invoiceDetailList[i].appliedPromotionID + ")"
                : "";

          ic += this.payment_invoice.invoiceDetailList[i].discountRemarks == "Free Item" ? " - Free Item" : "";

          // let tempdata: any = {
          //   "itemCode": this.payment_invoice.invoiceDetailList[i].skuCode != null ? this.payment_invoice.invoiceDetailList[i].skuCode : "",
          //   "qty": this.payment_invoice.invoiceDetailList[i].qty != null ? this.payment_invoice.invoiceDetailList[i].qty : 0,
          //   "price": this.payment_invoice.invoiceDetailList[i].sellingPrice != null ? this.payment_invoice.invoiceDetailList[i].sellingPrice : 0
          // }

          let tempdata: any = {
            "itemCode": ic,
            "qty": this.payment_invoice.invoiceDetailList[i].qty != null ? this.payment_invoice.invoiceDetailList[i].qty : 0,
            "price": this.payment_invoice.invoiceDetailList[i].sellingPrice != null ? this.payment_invoice.invoiceDetailList[i].sellingPrice : 0
          }

          this.InvoiceDetailsList.push(tempdata);
        } catch (ex1) {

        }

      }

   
      this.invoicereceiptdetails = '';
      for (let i = 0; i < this.InvoiceDetailsList.length; i++) {
        this.invoicereceiptdetails =  this.invoicereceiptdetails +
          '<tr>' +
          '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + (i + 1) + '</h5></td>' +
          '<td style="width:60%;text-align: left;font-weight: 100"><h5 style="margin: 5px;">' + this.InvoiceDetailsList[i].itemCode  + '</h5></td>' +
          '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + this.InvoiceDetailsList[i].qty  + '</h5></td>' +
          '<td style="text-align: right;font-weight: 100"><h5 style="margin: 5px;">' + this.InvoiceDetailsList[i].price.toFixed(this.decimal_places)  + '</h5></td>' +
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

      this.InvoiceReportList2 = this.payment_invoice.paymentList;
      if (this.InvoiceReportList2  != null && this.InvoiceReportList2.length > 0) {
        for (let i = 0; i < this.InvoiceReportList2.length; i++) {
        if (this.InvoiceReportList2[i].cardType2 == 'CASH') {
          this.amount = this.InvoiceReportList2[i].receivedamount != null ? this.InvoiceReportList2[i].receivedamount : 0;
        }
       else if (this.InvoiceReportList2[i].cardType2 == 'K-Net') {
        this.knet = this.InvoiceReportList2[i].receivedamount != null ? this.InvoiceReportList2[i].receivedamount : 0;
        }
        else if (this.InvoiceReportList2[i].mode == 'CREDIT CARD') 
        {
         if (this.InvoiceReportList2[i].cardType2 == 'Visa') {
          this.visa = this.InvoiceReportList2[i].receivedamount != null ? this.InvoiceReportList2[i].receivedamount : 0;
        }
        if (this.InvoiceReportList2[i].cardType2 == 'On-Account') {
          this.creditcard = 0;
        }
        else 
         {
          this.creditcard = this.creditcard + this.InvoiceReportList2[i].receivedamount;
        }
      }
      }
         //this.paymentCurrency = this.InvoiceReportList2[1].paymentCurrency;
        this.paymentCurrency = this.InvoiceReportList2.length > 0 && this.InvoiceReportList2[0].payCurrency != null ? this.InvoiceReportList2[0].payCurrency : this.InvoiceReportList2[0].payCurrency;
      }


      this.paycash = 0;

      for (let i = 0; i < this.InvoiceReportList2.length; i++) {
        
        if (this.InvoiceReportList2[i] != null && this.InvoiceReportList2[i].receivedamount != null) {
          if (this.InvoiceReportList2[i].cardType2 == 'On-Account') {
            this.paycash = 0;
          }
          else{
          this.paycash = this.paycash + this.InvoiceReportList2[i].receivedamount;
          }
        }

      }
      // getInvoiceReport2 >>

      // << getInvoiceReport3
      this.approvalNumberKNet = '';
      this.approvalNumberVisa = '';
      this.approvalNumberMaster = '';
      this.cardType = "";
      this.InvoiceReportList3 = this.payment_invoice.paymentList;
      if (this.payment_invoice.paymentList != null && this.payment_invoice.paymentList.length > 0) {
        for (let i = 0; i < this.InvoiceReportList3.length; i++) {
        this.cardType = this.payment_invoice.paymentList[i].cardType2 != null ? this.payment_invoice.paymentList[i].cardType2 : "";

        if (this.payment_invoice.paymentList[i].approveNo != null && this.payment_invoice.paymentList[i].approveNo != "undefined") {
          if (this.cardType == 'K-Net') {
            this.approvalNumberKNet = this.payment_invoice.paymentList[i].approveNo;
          }
          else if (this.cardType == 'Visa') {
            this.approvalNumberVisa = this.payment_invoice.paymentList[i].approveNo;
          }
          else if (this.cardType == 'Master') {
            this.approvalNumberMaster = this.payment_invoice.paymentList[i].approveNo;
          }
        }

      }
       if(this.invoiceNum!="")
          {
             this.api.getAPI("BarcodeGeneration?invoice=" + this.invoiceNum)
             .subscribe((data) => {
              if(data!=null && data!='')
              {
               this.barcode = data == null || data =='' ? this.temp_image : 'data:image/gif;base64,' + data;
               localStorage.removeItem('payment_invoice');
               localStorage.setItem('recall_invoice', null);
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
        
      // getInvoiceReport3 >>
    
      

    }
   } else {
      
      this.common.showMessage('warn', 'This Invoice is Null');
    }
    // this.common.showSpinner();
    // this.api.getAPI("InvoiceReceipt1?invoice=" + this.invoiceNo)
    //   .subscribe((data) => {
          // if (data != null && data.statusCode != null && data.statusCode == 1) {
            // this.InvoiceReportList1 = data.invoiceList;
            // this.storeImage = data.invoiceList[0].storeImage == null || data.invoiceList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.invoiceList[0].storeImage;
            // this.shopName = data.invoiceList[0].shopName != null ? data.invoiceList[0].shopName : "";
            // this.posName = data.invoiceList[0].posName != null ? data.invoiceList[0].posName : "";
            // this.invoiceNum = data.invoiceList[0].invoiceNo != null ? data.invoiceList[0].invoiceNo : "";
            // this.date = this.common.toddmmmyyFormat(data.invoiceList[0].date);
            // this.time = this.common.tohhmmaFormat(data.invoiceList[0].time);
  
            // this.customerName = data.invoiceList[0].customerName != null ? data.invoiceList[0].customerName : "";
            // this.salesMan = data.invoiceList[0].salesMan != null ? data.invoiceList[0].salesMan : "";
            // this.cashier = data.invoiceList[0].cashier != null ? data.invoiceList[0].cashier : "";
            // this.taxNo = data.invoiceList[0].taxNo != null ? data.invoiceList[0].taxNo : "";
            // this.totalDiscount = data.invoiceList[0].totalDiscount != null ? data.invoiceList[0].totalDiscount : 0;
            // this.taxAmount = data.invoiceList[0].taxAmount != null ? data.invoiceList[0].taxAmount : 0;
            // this.netAmount = data.invoiceList[0].netAmount != null ? data.invoiceList[0].netAmount : 0;
            // this.paidAmount = data.invoiceList[0].paidAmount != null ? data.invoiceList[0].paidAmount : 0;
            // this.customerBalance = data.invoiceList[0].customerBalance != null ? data.invoiceList[0].customerBalance : 0;
            // this.footer = data.invoiceList[0].footer != null ? data.invoiceList[0].footer : "";
            // this.discount = data.invoiceList[0].discount != null ? data.invoiceList[0].discount : 0;
            // this.posTitle = data.invoiceList[0].posTitle != null ? data.invoiceList[0].posTitle : "";
            // this.decimalPlace = data.invoiceList[0].decimalPlaces != null ? data.invoiceList[0].decimalPlaces : 0;
  
            // this.InvoiceDetailsList = new Array<any>();
  
            // this.totalPrice = 0;
            // this.tottaxAmount = 0;
  
            // for (let i = 0; i < this.InvoiceReportList1.length; i++) {
            //   if(this.InvoiceReportList1[i].price != null){
            //     this.totalPrice = this.totalPrice + this.InvoiceReportList1[i].lineTotal;
            //   }
              
            //   if(data.invoiceList[i].taxAmount != null){
            //     this.tottaxAmount = this.tottaxAmount + data.invoiceList[i].taxAmount;
            //   }
             
  
            //   try {
            //     let tempdata: any = {
            //       "itemCode": this.InvoiceReportList1[i].itemCode != null ? data.InvoiceReportList1[i].itemCode : "",
            //       "qty": this.InvoiceReportList1[i].qty != null ? data.InvoiceReportList1[i].qty : 0,
            //       "price": this.InvoiceReportList1[i].price != null ? data.InvoiceReportList1[i].price : 0
            //     }
            //     this.InvoiceDetailsList.push(tempdata);
            //   } catch (ex1) {
  
            //   }
              
            // }
  
            // this.invoicereceiptdetails = '';
  
            // for (let i = 0; i < this.InvoiceDetailsList.length; i++) {
            //   this.invoicereceiptdetails = this.invoicereceiptdetails +
            //     '<tr>' +
            //     '<td style="text-align: center;font-weight: 100"><h5>' + (i + 1) + '</h5></td>' +
            //     '<td style="text-align: left;font-weight: 100"><h5>' + this.InvoiceDetailsList[i].itemCode != null ? data.InvoiceReportList1[i].invoiceNo : "" + '</h5></td>' +
            //     '<td style="text-align: center;font-weight: 100"><h5>' + this.InvoiceDetailsList[i].qty != null ? data.InvoiceReportList1[i].invoiceNo : "" + '</h5></td>' +
            //     '<td style="text-align: right;font-weight: 100"><h5>' + this.InvoiceDetailsList[i].price != null ? data.InvoiceReportList1[i].invoiceNo : "" + '</h5></td>' +
            //     '</tr>'
            // }
  
            // if (this.tottaxAmount > 0) {
            //   this.header = 'فاتورة ضريبية","فاتوره';
            // }else{
            //   // this.header = 'فاتوره';
            //   this.header = "إيصال الفاتورة";
            // }
              
            
  
            // // for(let i=0;i<this.decimalPlace;i++)
            // // {
            // //   if(this.decimalPlaces==null || this.decimalPlaces=='')
            // //   {
            // //     this.decimalPlaces = '.' + '0';
            // //   }
            // //   else
            // //   {
            // //     this.decimalPlaces = this.decimalPlaces + '0';
            // //   }
            // // }
  
            // // << getInvoiceReport2
  
            // this.amount =  0;
            // this.knet = 0;
            // this.visa = 0;
            // this.creditcard =  0;
            // // this.paymentCurrency = data.invoiceSubReceiptTList[1].paymentCurrency;
            // this.paymentCurrency ="";
  
            // this.InvoiceReportList2 = data.invoiceSubReceiptTList;
            // if(data.invoiceSubReceiptTList != null && data.invoiceSubReceiptTList.length > 0){
            //   this.amount = data.invoiceSubReceiptTList[0].amount != null ? data.invoiceSubReceiptTList[0].amount : 0;
            //   this.knet = data.invoiceSubReceiptTList[0].knet != null ? data.invoiceSubReceiptTList[0].knet : 0;
            //   this.visa = data.invoiceSubReceiptTList[0].visa != null ? data.invoiceSubReceiptTList[0].visa : 0;
            //   this.creditcard = data.invoiceSubReceiptTList[0].creditcard != null ? data.invoiceSubReceiptTList[0].creditcard : 0;
            //   // this.paymentCurrency = data.invoiceSubReceiptTList[1].paymentCurrency;
            //   this.paymentCurrency =  data.invoiceSubReceiptTList.length > 1 && data.invoiceSubReceiptTList[1].paymentCurrency != null ? data.invoiceSubReceiptTList[1].paymentCurrency : data.invoiceSubReceiptTList[0].paymentCurrency;
            // }
  
  
            // this.paycash = 0;
  
            // for (let i = 0; i < this.InvoiceReportList2.length; i++) {
            //   if(this.InvoiceReportList2[i] != null && this.InvoiceReportList2[i].paymentCash != null){
            //     this.paycash = this.paycash + this.InvoiceReportList2[i].paymentCash;
            //   }
              
            // }
            // // getInvoiceReport2 >>
  
            // // << getInvoiceReport3
            // this.approvalNumberKNet = '';
            //   this.approvalNumberVisa = '';
            //   this.approvalNumberMaster = '';
            //   this.cardType = "";
            // this.InvoiceReportList3 = data.approvalNumReceiptList;
            // if(data.approvalNumReceiptList != null  && data.approvalNumReceiptList.length > 0){
            //   this.cardType = data.approvalNumReceiptList[0].cardType != null ?  data.approvalNumReceiptList[0].cardType : "";
  
            //   if(data.approvalNumReceiptList[0].approvalNumber != null && data.approvalNumReceiptList[0].approvalNumber != "undefined"){
            //     if (this.cardType == 'K-Net') {
            //       this.approvalNumberKNet = data.approvalNumReceiptList[0].approvalNumber;
            //     }
            //     else if (this.cardType == 'Visa') {
            //       this.approvalNumberVisa = data.approvalNumReceiptList[0].approvalNumber;
            //     }
            //     else if (this.cardType == 'Master') {
            //       this.approvalNumberMaster = data.approvalNumReceiptList[0].approvalNumber;
            //     }
            //   }
              
            // }
            
            // // getInvoiceReport3 >>
  
            // this.getInvoiceReceiptHTML();


            // this.InvoiceReportList1 = data.invoiceList;
            // this.storeImage = data.invoiceList[0].storeImage == null || data.invoiceList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.invoiceList[0].storeImage;
            // this.shopName = data.invoiceList[0].shopName;
            // this.posName = data.invoiceList[0].posName;
            // this.invoiceNum = data.invoiceList[0].invoiceNo;
            // this.date = this.common.toddmmmyyFormat(data.invoiceList[0].date);
            // this.time = this.common.tohhmmaFormat(data.invoiceList[0].time);
            // this.customerName = data.invoiceList[0].customerName;
            // this.salesMan = data.invoiceList[0].salesMan;
            // this.cashier = data.invoiceList[0].cashier;
            // this.taxNo = data.invoiceList[0].taxNo;
            // this.totalDiscount = data.invoiceList[0].totalDiscount;
            // this.taxAmount = data.invoiceList[0].taxAmount;
            // this.netAmount = data.invoiceList[0].netAmount;
            // this.paidAmount = data.invoiceList[0].paidAmount;
            // this.customerBalance = data.invoiceList[0].customerBalance;
            // this.footer = data.invoiceList[0].footer;
            // this.discount = data.invoiceList[0].discount;
            // this.posTitle = data.invoiceList[0].posTitle;
            // this.decimalPlace = data.invoiceList[0].decimalPlaces;

            // this.InvoiceDetailsList = new Array<any>();

            // this.totalPrice = 0;
            // this.tottaxAmount = 0;

            // for (let i = 0; i < this.InvoiceReportList1.length; i++) {
            //   this.totalPrice = this.totalPrice + this.InvoiceReportList1[i].price;
            //   this.tottaxAmount = this.tottaxAmount + data.invoiceList[i].taxAmount;

            //   let tempdata: any = {
            //     "itemCode": this.InvoiceReportList1[i].itemCode,
            //     "qty": this.InvoiceReportList1[i].qty,
            //     "price": this.InvoiceReportList1[i].price
            //   }
            //   this.InvoiceDetailsList.push(tempdata);
            // }

            // this.invoicereceiptdetails = '';

            // for (let i = 0; i < this.InvoiceDetailsList.length; i++) {
            //   this.invoicereceiptdetails = this.invoicereceiptdetails +
            //     '<tr>' +
            //     '<td style="text-align: center;font-weight: 100"><h5>' + (i + 1) + '</h5></td>' +
            //     '<td style="text-align: left;font-weight: 100"><h5>' + this.InvoiceDetailsList[i].itemCode + '</h5></td>' +
            //     '<td style="text-align: center;font-weight: 100"><h5>' + this.InvoiceDetailsList[i].qty + '</h5></td>' +
            //     '<td style="text-align: right;font-weight: 100"><h5>' + this.InvoiceDetailsList[i].price + '</h5></td>' +
            //     '</tr>'
            // }

            // // if (this.tottaxAmount > 0) {
            // //   this.header = 'فاتورة ضريبية","فاتوره';
            // // }

            // if (this.tottaxAmount > 0) {
            //   this.header = 'فاتورة ضريبية","فاتوره';
            // }else{
            //   // this.header = 'فاتوره';
            //   this.header = "إيصال الفاتورة";
            // }

            // // for(let i=0;i<this.decimalPlace;i++)
            // // {
            // //   if(this.decimalPlaces==null || this.decimalPlaces=='')
            // //   {
            // //     this.decimalPlaces = '.' + '0';
            // //   }
            // //   else
            // //   {
            // //     this.decimalPlaces = this.decimalPlaces + '0';
            // //   }
            // // }

            // this.InvoiceReportList2 = data.invoiceSubReceiptTList;
            // this.amount = data.invoiceSubReceiptTList[0].amount;
            // this.knet = data.invoiceSubReceiptTList[0].knet;
            // this.visa = data.invoiceSubReceiptTList[0].visa;
            // this.creditcard = data.invoiceSubReceiptTList[0].creditcard;
            // this.paymentCurrency =  data.invoiceSubReceiptTList.length > 1 && data.invoiceSubReceiptTList[1].paymentCurrency != null ? data.invoiceSubReceiptTList[1].paymentCurrency : data.invoiceSubReceiptTList[0].paymentCurrency;

            // this.paycash = 0;

            // for (let i = 0; i < this.InvoiceReportList2.length; i++) {
            //   this.paycash = this.paycash + this.InvoiceReportList2[i].paymentCash;
            // }

            // this.InvoiceReportList3 = data.approvalNumReceiptList;
            // this.cardType = data.approvalNumReceiptList[0].cardType;

            // if (this.cardType == 'K-Net') {
            //   this.approvalNumberKNet = data.approvalNumReceiptList[0].approvalNumber;
            // }
            // else if (this.cardType == 'Visa') {
            //   this.approvalNumberVisa = data.approvalNumReceiptList[0].approvalNumber;
            // }
            // else if (this.cardType == 'Master') {
            //   this.approvalNumberMaster = data.approvalNumReceiptList[0].approvalNumber;
            // }
            // else {
            //   this.approvalNumberKNet = '';
            //   this.approvalNumberVisa = '';
            //   this.approvalNumberMaster = '';
            // }

            // this.getInvoiceReceiptHTML();

      //     } else {
      //       let msg: string = data != null
      //         && data.displayMessage != null
      //         && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
      //       this.common.showMessage('warn', msg);
      //     }
      //     this.common.hideSpinner();
      // });
  }

  getInvoiceReport2() {
    this.common.showSpinner();
    this.api.getAPI("InvoiceReceipt2?invoice=" + this.invoiceNo)
      .subscribe((data) => {
        setTimeout(() => {
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
        }, this.common.time_out_delay);
      });
  }
  getInvoiceReport3() {
    this.common.showSpinner();
    this.api.getAPI("InvoiceReceipt3?invoice=" + this.invoiceNo)
      .subscribe((data) => {
        setTimeout(() => {
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
        }, this.common.time_out_delay);
      });
  }

  getInvoiceReceiptHTML() {

    // console.log(this.storeImage);
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
      '<td style="text-align: left;font-weight: 100"><h5 style="margin: 5px;">اجمالي الكميه</h5></td>' +
      '<td style="text-align: center;font-weight: 100"><h5 style="margin: 5px;">' + this.billtotalQty + '</h5></td>' +
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
      '<td style="width: 20%;">' +
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
      '<h5 style="margin: 5px;text-align: center;font-weight:100">' + this.knet.toFixed(this.decimal_places) + '</h5>' +
      '</td>' +
      '<td>' +
      '<h5 style="margin: 2mm 0mm;text-align: center;font-weight:100">' + this.approvalNumberKNet + '</h5>' +
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
      '<h5 style="margin:5px;font-weight: 550;">' + this.paymentCurrency + '</h5>' +
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
    // console.log(this.invoicereceiptHTML);
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
  }
  goto1_pos() {
    // localStorage.setItem('payment_invoice');
    this.router.navigate(['pos']);

  }
  cancel() {
    if (confirm("Are You Sure You want to Cancel the Payment?")) {
      this.payment_invoice = null;
      localStorage.removeItem('payment_invoice');
      localStorage.setItem('pos_mode', 'true');
      this.router.navigate(['pos']);
    }

  }
  goto_pos() {
    this.payment_invoice = null;
    localStorage.removeItem('payment_invoice');
    localStorage.setItem('pos_mode', 'true');
    this.router.navigate(['pos']);
  }

  allowNumbers(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return (k >= 48 && k <= 57);
  }

  restrictSpecialChars(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      // || k == 45 
      // || k == 47
      // || k == 95
      || (k >= 48 && k <= 57));
  }
  ExchangeRate_details() {
    this.common.showSpinner();
    this.api.getAPI("PaymentExchangeRate?exchangeDate=" + this.payment_invoice.businessDate)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.exchange_List = data.responseDynamicData;
            this.changecurreny = this.user_details.currencyCode;
            this.myForm.controls['PaymentCurrency'].setValue(this.user_details.currencyID);
            this.myForm.controls['changecurrency'].setValue(this.user_details.currencyID);
            this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
            //this.getInvoiceReceiptHTML();

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
  exchangeratechange(value: number) {

    let Amount = this.total_due;
    let blcAmount = this.balance;
    var baseCurrencyid = this.user_details.currencyID;
    let ObjExchangeRates = new MExchangeRate();
    var TargetCurrency: number = value;
    this.CurrencyExchangeList = new Array<MExchangeRate>();
    this.myForm.controls['changecurrency'].setValue(value);


    this.CurrencyExchangeList = this.exchange_List.filter(e => e.targetCurrencyID == TargetCurrency);
    this.paymentcurrency1 = this.CurrencyExchangeList.find((x: any) => x.targetCurrencyID == TargetCurrency).targetCurrency;
    this.changecurreny = this.CurrencyExchangeList.find((x: any) => x.targetCurrencyID == TargetCurrency).targetCurrency;
    let BaseCurrency = this.CurrencyExchangeList[0].baseCurrency;
    let TargetCurrency1 = this.CurrencyExchangeList[0].targetCurrency;
    if (BaseCurrency == TargetCurrency1) {
      //this.RetExchangeAmount = Amount;
      this.RetExchangeAmount=blcAmount;
      this.myForm.controls['amount_received'].setValue(this.RetExchangeAmount);
      this.exchangeratecoversion = false;


    }
    else if (this.CurrencyExchangeList != null && this.CurrencyExchangeList.length > 0) {
      if (this.CurrencyExchangeList.map(x => x.baseCurrencyID === baseCurrencyid && x.targetCurrencyID == TargetCurrency) != null) {
        ObjExchangeRates = this.CurrencyExchangeList.find(x => x.baseCurrencyID == baseCurrencyid && x.targetCurrencyID == TargetCurrency);
        if (ObjExchangeRates != null && ObjExchangeRates.exchangeAmount > 0) {
          let ChangeAmount = ObjExchangeRates.exchangeAmount;
         // this.RetExchangeAmount = (Amount * ChangeAmount);2
          this.RetExchangeAmount = (blcAmount * ChangeAmount);
          this.myForm.controls['amount_received'].setValue(this.RetExchangeAmount.toFixed(2));
          this.exchangeratecoversion = true;
          // this.currency_code=TargetCurrency1;
        }
        else {
          this.common.showMessage('warn', "Exchange Currency Details not available !.");
          this.myForm.controls['amount_received'].setValue('0');
        }
      }

    }
    else if (this.CurrencyExchangeList.map(x => x.baseCurrencyID == TargetCurrency && x.targetCurrencyID == baseCurrencyid) != null) {
      ObjExchangeRates = this.CurrencyExchangeList.find(x => x.baseCurrencyID == TargetCurrency && x.targetCurrencyID == baseCurrencyid);
      if (ObjExchangeRates != null && ObjExchangeRates.exchangeAmount > 0) {
        let ChangeAmount = ObjExchangeRates.exchangeAmount;
       // this.RetExchangeAmount = (Amount / ChangeAmount);
        this.RetExchangeAmount = (blcAmount / ChangeAmount);
        this.myForm.controls['amount_received'].setValue(this.RetExchangeAmount.toFixed(2));

      }
    }
    else {
      this.common.showMessage('warn', "Exchange Currency Details not available !.");
      this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
    }
  }
  onTabClick(event) {
    let lblText = event.tab.textLabel;

    if (lblText == 'CASH') {
      this.payment_mode_changed('cash', null);
      this.myForm.controls['PaymentCurrency'].setValue(this.user_details.currencyID);
      this.myForm.controls['changecurrency'].setValue(this.user_details.currencyID);
      this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
    }
    else if (lblText == 'CREDIT CARD') {
      this.exchangeratecoversion = false;
      var Type: any = this.get_payment_types_of_payment_mode("CREDIT CARD");

      this.payment_mode_changed('other', Type)
    }
    else if (lblText == 'DEBIT CARD') {
      this.exchangeratecoversion = false;
      var Type: any = this.get_payment_types_of_payment_mode("DEBIT CARD");

      this.payment_mode_changed('other', Type)
    }
    else if (lblText == 'DEBIR CARD') {
      this.exchangeratecoversion = false;
      var Type: any = this.get_payment_types_of_payment_mode("DEBIR CARD");

      this.payment_mode_changed('other', Type)
    }
  }
}
