import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-x-report',
  templateUrl: './x-report.component.html',
  styleUrls: ['./x-report.component.css']
})
export class XReportComponent implements OnInit {

  user_details: MUserDetails = null;
  business_date:any;
  xReportList : any;
  xReportList1 : any;
  xReportList2 : any;
  current_date: any;
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
  total :any = 0;
  totCreditSale: any = 0;
  kdAmount: any = 0;
  returnAmount: any = 0;
  cashAmount: any = 0;
  exchangeAmount : any;
  knetTotal : any = 0;
  visaTotal: any = 0;
  creditCardTotal: any = 0;
  totalCashInBox : any;
  floatAmount : any;
  cashInAmount : any;
  cashOutAmount : any;
  difference : any = 0;
  storeImage;
  temp_image: string = "assets/img/preview-image.png";
  decimalPlace:any;
  decimalPlaces: any;
  paymentCurrency: any;
  currencyName: any;
  paymentCash: any;
  val:any = 0;
  finVal:any;
  subVal: any = 0;
  xreportHTML : any;


  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {

    //this.business_date = this.common.toDMYFormat(new Date());
    this.current_date = new Date();
   
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);      
    }

    // let temp_str_xrep: string = localStorage.getItem('x_rep');
    // if (temp_str_xrep != null) {
    // this.xReportList = JSON.parse(temp_str_xrep);
    // this.cashierID = this.user_details.id;
    // this.shiftID = this.xReportList.allShiftLOGandTypesList[0].shiftID;
    // this.posid = this.xReportList.allShiftLOGandTypesList[0].posid;
    // this.business_date = this.common.toDMYFormat(this.xReportList.allShiftLOGandTypesList[0].businessDate);
    // }

    this.cashierID = this.user_details.id;
    this.shiftID = 1;
    this.posid = 64;
    this.business_date = '11-11-2020';

    this.getXReport1();    
    this.getXReport2();
  }

  getXReport1() {
    this.common.showSpinner();
    this.api.getAPI("XReport1?cashierid="+ this.cashierID + "&shiftID=" + this.shiftID + "&businessDate=" + this.business_date +"&StoreID=" + this.user_details.storeID + "&posid=" + this.posid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.xReportList1 = data.xReportList[0];
            this.storeImage = data.xReportList[0].storeImage == null || data.xReportList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.xReportList[0].storeImage;  
            this.cashier = data.xReportList[0].cashier;
            this.shopName = data.xReportList[0].shopName;
            this.shiftName = data.xReportList[0].shiftName;
            this.posName = data.xReportList[0].posName;
            this.isReturn = data.xReportList[0].isReturn;
            this.invoiceNo = data.xReportList[0].invoiceNo;
            this.totalAmount = data.xReportList[0].totalAmount;
            this.totalDiscount = data.xReportList[0].discountTotal;
            this.subTotal = data.xReportList[0].subTotal;
            this.totAmount = data.xReportList[0].netSales;
            this.totalCashInBox = data.xReportList[0].totalCashInBox;
            this.floatAmount = data.xReportList[0].floatAmount;
            this.cashInAmount = data.xReportList[0].cashInAmount;
            this.cashOutAmount = data.xReportList[0].cashOutAmount;
            this.decimalPlace = data.xReportList[0].decimalPlaces;
           
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

            if(this.isReturn==true)
            {
              this.returnValue = "Return";
              this.total = this.totalAmount;
            }
            else
            {
              this.returnValue = "Sales";
              this.total = this.subTotal;
            }

            for(let i=0;i<this.xReportList1.length;i++)
            {
                this.totCreditSale = this.totCreditSale + this.xReportList1[0].creditSale;
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
  getXReport2() {
    this.common.showSpinner();
    this.api.getAPI("XReport2?cashierid="+ this.cashierID + "&shiftID=" + this.shiftID + "&businessDate=" + this.business_date +"&StoreID=" + this.user_details.storeID + "&posid=" + this.posid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.xReportList2 = data.xSubReportList[0]; 
            this.kdAmount =  data.xSubReportList[0].kdAmount;
            this.returnAmount =  data.xSubReportList[0].returnAmount;
            this.exchangeAmount = data.xSubReportList[0].exchangeAmount;
            this.paymentCurrency = data.xSubReportList[0].paymentCurrency;
            this.currencyName = data.xSubReportList[0].currencyName;
            this.paymentCash = data.xSubReportList[0].paymentCash;
            
            this.cashAmount = this.kdAmount + this.returnAmount;

            for(let i=0;i<this.xReportList2.length;i++)
            {
              this.knetTotal = this.knetTotal + this.xReportList2[0].knet;
              this.visaTotal = this.visaTotal + this.xReportList2[0].visa;
              this.creditCardTotal = this.creditCardTotal + this.xReportList2[0].creditcard;
            }

            this.total = this.floatAmount + this.cashInAmount + this.kdAmount + this.returnAmount 
                         - this.cashOutAmount;

            this.difference = this.total - this.totalCashInBox;

            if(this.paymentCurrency == this.currencyName)
            {
                this.val = (this.kdAmount + this.returnAmount)/this.exchangeAmount;
                this.finVal = this.paymentCurrency + ' @ of ' + this.val;
                this.subVal = this.val;
            }
            else
            {
                this.val = this.paymentCash;
                this.finVal = this.paymentCurrency + ' @ of ' + this.val;
                this.subVal = this.val/this.exchangeAmount;
            }
            
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

  ngOnInit(): void {
  }

  getXReportHTML(){
    this.xreportHTML = '<html>' +		
    '<div style="width: 95mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
        // '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
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
          '</td>'+
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
            '<h5 style="margin: 2mm 0mm; font-weight:100">' + this.current_date + '</h5>' +
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
     '<table style="width: 100%; border-collapse: collapse;" border="1">' +
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
        '</tr>' +		  
        '<tr>' +
          '<td style="text-align:center;" rowspan="3">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.returnValue + '</h5>' +				  
          '</td>' +
          '<td style="text-align: center;">' +
            '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.invoiceNo + '</h5>' +
          '</td>' +
           '<td style="text-align:center;">' +
            '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.totalAmount +  '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="text-align:right">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Total Discount </h5>' +
          '</td>' +
           '<td style="text-align:center;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totalDiscount + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="text-align: right">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550; "> Total </h5>' +
          '</td>' +
           '<td style="text-align:center">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.total + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="text-align: center">' +
            '<h5 style="margin: 2mm 0mm"></h5>' +
          '</td>' +
          '<td style="text-align: right">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;"> Total Amount </h5>' +
          '</td>' +
           '<td style="text-align:center;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totAmount + '</h5>' +
          '</td>' +			  
        '</tr>' +	
      '</table>' +
      '<table style="width: 100%; height: 2px">' +
        '<tr>' +  
        '</tr>' +
      '</table>' +  
      '<table style="width: 80%;margin-left:28px;border-collapse: collapse" border="1">' +
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">NET SALES </h5>' +
          '</td>' +
          '<td style="width: 30%; font-weight: 100; text-align: right; border-bottom: 1px solid #d0caca; ">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totAmount + '</h5>' +
          '</td>' +			  
        '</tr>' +		  
        '<tr>' +
          '<td style="width: 70%;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">CREDIT </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight:100;text-align:right;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totCreditSale + '</h5>' +
          '</td>' +			  
        '</tr>' +				  
      '</table>' +
      '<table style="width: 80%; margin-left: 28px; border-collapse: collapse;" border="1">' +
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH </h5>' +
          '</td>' +
          '<td style="width: 30%; text-align: right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashAmount + '</h5>' +
          '</td>' +			  
        '</tr>' +		  
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">KNET CARD </h5>' +
          '</td>' +
          '<td style="width: 30%; font-weight: 100; text-align: right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.knetTotal + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="width: 70%; border-bottom: 1px solid #d0caca; border-right: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">VISA CARD </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight: 100;text-align: right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.visaTotal + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="width: 70%;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">CREDIT CARD </h5>' +
          '</td>' +
          '<td style="width: 30%; font-weight: 100; text-align: right;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 100">' + this.creditCardTotal + '</h5>' +
          '</td>' +			  
        '</tr>' +	
      '</table>' +
      '<table style="width: 100%;height:2px">' +
        '<tr>' +  
        '</tr>' +
      '</table>' +
       '<table style="width: 80%;margin-left:28px;border-collapse: collapse;" border="1">' +
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
      '<table style="width: 80%;margin-left:28px;border-collapse: collapse;" border="1">' +
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">TOTAL CASH IN BOX </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight: 100;text-align: right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.totalCashInBox + '</h5>' +
          '</td>' +			  
        '</tr>' +		  
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">FLOAT AMOUNT </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.floatAmount + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH SALES </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashAmount + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH IN </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashInAmount + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">CASH OUT </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashOutAmount + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="width: 70%;border-bottom: 1px solid #d0caca;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">TOTAL </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight:100;text-align:right;border-bottom: 1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.total + '</h5>' +
          '</td>' +			  
        '</tr>' +	
        '<tr>' +
          '<td style="width: 70%;border-right:1px solid #d0caca;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">DIFFERENCE </h5>' +
          '</td>' +
          '<td style="width: 30%;font-weight:100;text-align:right;">' +
            '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.difference + '</h5>' +
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
          '<td style="width: 50%;text-align:center;border-top: 1px solid #000;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">Cashier Signature</h5>' +
          '</td>' +
          '<td style="width: 50%;text-align:center;border-top: 1px solid #000;">' +
            '<h5 style="margin: 2mm 0mm;font-weight: 550;">Manager Signature</h5>' +
          '</td>' +
        '</tr>' +
      '</table>' +
    '</div>' +
  '</html>';
  console.log(this.xreportHTML);
  }

}
