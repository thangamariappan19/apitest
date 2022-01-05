import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
//import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-z-report',
  templateUrl: './z-report.component.html',
  styleUrls: ['./z-report.component.css']
})
export class ZReportComponent implements OnInit {

  user_details: MUserDetails = null;
  business_date:any;
  zReportList1 : any;
  zReportList2 : any;
  zReportList3 : any;
  storeImage;
  temp_image: string = "assets/img/preview-image.png";
  shopCode:any;
  shopName:any;
  country:any;
  invoiceNo:any;
  shiftID:any;
  paymentCurrency:any;
  cash:any;
  knet:any;
  visa:any;
  creditcard:any;
  totalSales:any;
  totalDiscount:any;
  totalAmount:any;
  creditSale:any;
  foreignTotal:any;
  posid:any;
  current_date:any;
  subTotal:any;
  netSales:any;
  netamount:any;
  totalCash:any;
  isReturn:any;
  returnValue:any;
  total:any;
  paymentCash:any = 0;
  returnAmount:any = 0;
  cashValue:any;
  netSalesAmount:any = 0;
  totCash:any = 0;
  totalKnet:any = 0;
  totalVisa:any = 0;
  totalCreditCard:any = 0;
  totalCardValue:any = 0;
  totalCreditSale:any = 0;
  differenceValue:any = 0;
  decimalPlaces:any;
  decimalPlace:any;
  zreportHTML : any;


  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    //public datepipe: DatePipe
  ) {

    //this.business_date = this.common.toDMYFormat(new Date());
    this.current_date = new Date();
    this.business_date = '11-11-2020';

    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }  
    // let temp_str_zrep: string = localStorage.getItem('z_rep');
    // if (temp_str_zrep != null) {
    // this.business_date = JSON.parse(temp_str_zrep);
    // this.business_date = this.common.toDMYFormat(this.business_date);
    // }
    
    this.getZReport1();    
    this.getZReport2();
    this.getZReport3();     
  }
  getZReport1() {
    this.common.showSpinner();
    this.api.getAPI("ZReport1?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.getZReport1 = data.zReportList;
            this.storeImage = data.zReportList[0].storeImage == null || data.zReportList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.zReportList[0].storeImage;  
            this.shopCode = data.zReportList[0].shopCode;
            this.shopName = data.zReportList[0].shopName;
            this.country = data.zReportList[0].country;
            this.netamount = data.zReportList[0].netamount;
            this.decimalPlace = data.zReportList[0].decimalPlaces;

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

            for(let i=0;i<this.getZReport1.length;i++)
            {
              this.netSalesAmount = this.netSalesAmount + this.getZReport1[i].netamount;
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
  getZReport2() {
    this.common.showSpinner();
    this.api.getAPI("ZReport2?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.getZReport2 = data.responseDynamicData;
            this.shiftID = data.responseDynamicData[0].shiftID;
            this.paymentCurrency = data.responseDynamicData[0].paymentCurrency;
            this.cash = data.responseDynamicData[0].cash;
            this.knet = data.responseDynamicData[0].knet;
            this.visa = data.responseDynamicData[0].visa;
            this.creditcard = data.responseDynamicData[0].creditcard;
            this.foreignTotal = data.responseDynamicData[0].foreignTotal;
            this.posid = data.responseDynamicData[0].posid;
            this.totalCash = data.responseDynamicData[0].totalCash;
            
            for(let i=0;i<this.getZReport2.length;i++)
            {
              this.paymentCash = this.paymentCash + this.getZReport2[i].paymentCash;
              this.returnAmount = this.returnAmount + this.getZReport2[i].returnAmount;
              this.totalKnet = this.totalKnet + this.getZReport2[i].knet;
              this.totalVisa = this.totalVisa + this.getZReport2[i].visa;
              this.totalCreditCard = this.totalCreditCard + this.getZReport2[i].creditcard;
            }
            this.cashValue = this.paymentCash + this.returnAmount;
            this.totCash = this.totalCash + this.returnAmount;
            this.totalCardValue = this.totalKnet + this.totalVisa + this.totalCreditCard;

            this.differenceValue = this.totCash + this.foreignTotal + this.returnAmount + 
                                + this.totalKnet + this.totalVisa + this.totalCreditCard 
                                - this.netSalesAmount;

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
  getZReport3() {
    this.common.showSpinner();
    this.api.getAPI("ZReport3?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.getZReport3 = data.responseDynamicData;
            this.invoiceNo = data.responseDynamicData[0].invoiceNo;
            this.totalSales = data.responseDynamicData[0].netSales;
            this.totalDiscount = data.responseDynamicData[0].discountTotal;
            this.totalAmount = data.responseDynamicData[0].totalAmount;
            this.creditSale = data.responseDynamicData[0].creditSale;
            this.subTotal = data.responseDynamicData[0].subTotal;
            this.netSales = data.responseDynamicData[0].netSales;
            this.isReturn = data.responseDynamicData[0].isReturn;

            if(this.isReturn==true)
            {
              this.returnValue = "Return";
              this.total = this.totalAmount;
            }
            else
            {
              this.returnValue = "Sales";
              this.total = this.subTotal - this.totalDiscount;
            }
            for(let i=0;i<this.getZReport3.length;i++)
            {
              this.totalCreditSale = this.totalCreditSale + this.getZReport3[i].creditSale;
            }

            this.getZReportHTML();

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

  getZReportHTML(){
    this.zreportHTML = '<html>' +		
    '<div style="width: 95mm;">' +
      '<div style="width: 60%; text-align: center;margin-left:45px">' +
        // '<img src="' + this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
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
            '<h5 style="margin: 2mm 0mm;font-weight:100;">' + this.current_date + '</h5>' +
          '</td>' +
        '</tr>' +		 
      '</table>' +
      '<table style="width: 100%; border-collapse: collapse;" border="1">' +	
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
        '</tr>' +
        '<tr style="border-left:hidden;border-right:hidden;border-bottom:1px #d0caca">' +
          '<td style="width: 50%;text-align:center;font-weight:100;border-right:hidden">' +
            '<h5 style="margin: 2mm 0mm">' + this.invoiceNo + '</h5>' +
          '</td>' +
          '<td style="width: 50%;text-align:center;font-weight:100">' +
            '<h5 style="margin: 2mm 0mm;">' + this.totalAmount + '</h5>' +
          '</td>' +			  
        '</tr>' +
        '<tr style="border-left:hidden;border-right:hidden;border-bottom:1px #d0caca">' +
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
      '<table style="width: 100%; height: 2px">' +
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
        '</tr>' +
        '<tr>' +
          '<td style="font-weight:100">' +
            '<h5 style="margin: 2mm 0mm">' + this.shiftID + '</h5>' +
          '</td>' +
          '<td style="font-weight: 100;width: 10%">' +
            '<h5 style="margin: 2mm 0mm;">' + this.paymentCurrency + '</h5>' +
          '</td>' +	
           '<td style="font-weight: 100">' +
            '<h5 style="margin: 2mm 0mm">' + this.cashValue + '</h5>' +
          '</td>' +
          '<td style="font-weight:100">' +
            '<h5 style="margin: 2mm 0mm;">' + this.knet + '</h5>' +
          '</td>' +
           '<td style="font-weight:100">' +
            '<h5 style="margin: 2mm 0mm">' + this.visa + '</h5>' +
          '</td>' +
          '<td style="font-weight:100">' +
            '<h5 style="margin: 2mm 0mm;">' + this.creditcard + '</h5>' +
          '</td>' +
        '</tr>' +	
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
  }
}
