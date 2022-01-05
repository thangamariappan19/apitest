import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-exchange-receipt',
  templateUrl: './exchange-receipt.component.html',
  styleUrls: ['./exchange-receipt.component.css']
})
export class ExchangeReceiptComponent implements OnInit {

  user_details: MUserDetails = null;
  sal_excg_details: any;
  ExchangeDetailsList:Array<any>;
  store_details: Array<any> = null;
  return_exchange_details_List : Array<any> = null;
  sales_exchange_details_List : Array<any> = null;
  business_date : any;
  storeFooter:any;
  storeHeader:any;
  cashier:any;
  posName:any;
  taxCode:any;
  storeImage;
  temp_image: string = "assets/img/preview-image.png";
  customerName:any;
  documentNo: any;
  shopName: any;
  invoiceNo: any;
  salesinvoiceNo :any;
  date:any;
  time:any;
  footer:any;
  totalQty:any = 0;
  exchangereceiptHTML : any;
  exchangereceiptdetails : any;


 constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {

    this.ExchangeDetailsList = new Array<any>();

    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }  
  //   let temp_str_salexcg: string = localStorage.getItem('sales_exchange');
  //   if (temp_str_salexcg != null) {
  //    this.documentNo = JSON.parse(temp_str_salexcg);   
  //  }  
    this.documentNo = 'SE1141';
    this.getExchangeReport();    
  }
  getExchangeReport() {
    this.common.showSpinner();
    this.api.getAPI("ExchangeReceipt?invoice="+ this.documentNo)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.sal_excg_details = data.exchangeReceiptList;
            this.storeImage = data.exchangeReceiptList[0].storeImage == null || data.exchangeReceiptList[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.exchangeReceiptList[0].storeImage;  
            this.cashier = data.exchangeReceiptList[0].cashier;
            this.shopName = data.exchangeReceiptList[0].shopName;
            this.invoiceNo = data.exchangeReceiptList[0].invoiceNo;
            this.salesinvoiceNo = data.exchangeReceiptList[0].salesInvoice;
            this.date = data.exchangeReceiptList[0].date;
            this.time = data.exchangeReceiptList[0].time;
            this.posName = data.exchangeReceiptList[0].posName;
            this.customerName = data.exchangeReceiptList[0].customerName;
			this.footer = data.exchangeReceiptList[0].footer;
			
			this.ExchangeDetailsList = new Array<any>();
             
            for(let i=0;i<this.sal_excg_details.length;i++)
            {
                this.totalQty = this.totalQty + this.sal_excg_details[i].quantity;

                let tempdata: any = {
                  "skuCode" : this.sal_excg_details[i].skuCode + ' ' + this.sal_excg_details[i].arabicDetails,
                  "quantity": this.sal_excg_details[i].quantity
                }
                this.ExchangeDetailsList.push(tempdata);
            }        
            
                 
            for(let i=0;i<this.ExchangeDetailsList.length;i++)
            {
                this.exchangereceiptdetails = this.exchangereceiptdetails +
                '<tr>' +
                '<td style="text-align: center;font-weight: 100"><h5>' + (i+1) + '</h5></td>' +
                '<td style="text-align: left;font-weight: 100"><h5>' + this.ExchangeDetailsList[i].skuCode + '</h5></td>' +
                '<td style="text-align: center;font-weight: 100"><h5>' + this.ExchangeDetailsList[i].quantity + '</h5></td>' +
                '</tr>'
            }

            this.getExchangeReceiptHTML();

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
  
  getExchangeReceiptHTML(){
  this.exchangereceiptHTML = '<html>'+	
	'<div style="width: 95mm;">'+
		'<div style="width: 60%; text-align: center;margin-left:45px">' +
			// '<img src="'+ this.storeImage + '" style="height: 50px;width:50%;margin-left:45px;"/>' +
		'</div>' +	   
	  '<div style="width: 100%; text-align: center;font-weight:900">'+
		  '<h4 style="margin: 2mm 0mm;font-weight:900">*&nbsp;EXCHANGE RECEIPT&nbsp;*</h4>' +
	  '</div>' +
	  '<table style="width: 100%;">' +
		  '<tr>' +
			  '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550">Cashier: </h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align:left;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.cashier + '</h5>' +
			  '</td>' +
			   '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550">Shop: </h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align:left;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.shopName + '</h5>' +
			  '</td>' +
		  '</tr>' +
		  '<tr>' +
			  '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550">Invoice#: </h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align:left;">' +
				  '<h5 style="margin: 2mm 0mm; font-weight: 100">' + this.invoiceNo + '</h5>' +
			  '</td>' +
			   '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550">S-Invoice# </h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align: left;font-weight: 100">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.salesinvoiceNo + '</h5>' +
			  '</td>' +
		  '</tr>' +
		  '<tr>' +
			  '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550">Date: </h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align: left;font-weight: 100">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.date +  '</h5>' +
			  '</td>' +
			  '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550">Time: </h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align:left;font-weight:100">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.time + '</h5>' +
			  '</td>' +
		  '</tr>' +
		  '<tr>' +
			  '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550">POS: </h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align:left;font-weight:100">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.posName + '</h5>' +
			  '</td>' +
			  '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550">Customer: </h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align:left;font-weight:100">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:100">' + this.customerName + '</h5>' +
			  '</td>' +
		  '</tr>' +
	  '</table>' +
		'<table style="width: 100%;height:5px">' +
		  '<tr>' +  
		  '</tr>' +
	  '</table>' +
	  '<table style="width:100%; border-collapse: collapse;">' +
          '<thead>' +
			'<tr style="border-top: 1px solid #000; border-bottom: 2px solid #000;">' +
                 '<th style="width: 10%;">Sl#</th>' +
                 '<th style="width: 40%">Item Code</th>' +
                 '<th style="width: 10%;">Quantity</th>' +
              '</tr>' +
           '</thead>' +
           '<tbody>' +
                this.exchangereceiptdetails +
           '</tbody>' +
		  '<tfoot>' +
			'<tr style="border-top: 2px solid #000;border-bottom: 1px solid #000;">' +
                  '<td></td>' +
				  '<td style="text-align: left;width:40%;font-weight:550"><h5>Total Quantity</h5></td>' +
				  '<td style="text-align: center;"><h5>' + this.totalQty + '</h5></td>' +				  
              '</tr>' +				  
		  '</tfoot>' +
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
		'<table style="width: 100%;height:40px">' +
		  '<tr>' + 
		  '</tr>' +
	  '</table>' +
		'<table style="width: 100%;">' +
		  '<tr>' +
			  '<td style="width: 50%;text-align:center">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550"><u>Customer Name</u></h5>' +
			  '</td>' +
			  '<td style="width: 50%;text-align:center">' +
				  '<h5 style="margin: 2mm 0mm;font-weight:550"><u>Customer Signature</u></h5>' +
			  '</td>' +
		  '</tr>' +
	  '</table>' +
		'<table style="width: 100%;height: 50px;">' +
		  '<tr>' +
			  '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm"></h5>' +
			  '</td>' +
			  '<td style="width: 50%;">' +
				  '<h5 style="margin: 2mm 0mm;"></h5>' +
			  '</td>' +
		  '</tr>' +
	  '</table>' +
		'<div style="width: 100%; text-align: center;">' +
		  '<h4 style="margin: 2mm 0mm;font-weight:100;">This is not a sales invoice.</h4>' +
		'</div>' +
		'<table style="width: 100%;height: 15px;">' +
			'<tr>' +
				'<td style="width: 50%;">' +
					'<h5 style="margin: 2mm 0mm"></h5>' +
				'</td>' +
				'<td style="width: 50%;">' +
					'<h5 style="margin: 2mm 0mm;"></h5>' +
				'</td>' +
			'</tr>' +
		'</table>' +
		'<div style="width: 100%; text-align: center;font-weight:100">' +
		  '<h4 style="margin: 2mm 0mm;font-weight:100;">' + this.footer + '</h4>' +
		'</div>' +
		'<div style="width: 100%; text-align: center;height:50px">' +
		  '<h4 style="margin: 2mm 0mm;font-weight:700">* &nbsp;' + this.invoiceNo +  '&nbsp; *</h4>' +
		'</div>' +
   '</div>' +
'</html>';
console.log(this.exchangereceiptHTML);
}
}
