import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { QzTrayService } from 'src/app/qz-tray-service';
import { MZReportHeader } from 'src/app/models/m-z-report-header';
import { MZReportDetails1 } from 'src/app/models/m-z-report-details1';
import { MZReportDetails2 } from 'src/app/models/m-z-report-details2';
import * as _ from 'lodash';
//import { DatePipe } from '@angular/common';
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../assets/vfs_fonts.js";
import { fonts } from "src/assets/config/pdfFonts";
import { styles, defaultStyle } from "src/assets/config/customStyles";
import {formatDate} from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { jsPDF } from "jspdf";
pdfMake.fonts = fonts;
@Component({
  selector: 'app-z-report',
  templateUrl: './z-report.component.html',
  styleUrls: ['./z-report.component.css']
})
export class ZReportComponent implements OnInit {
  pdfSrc; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 0;

  // Initialize variables required for the header and this component
  fileName = "ZReport-document.pdf";
  // set zoom variables
  currentPage:number;
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

  user_details: MUserDetails = null;
  business_date:any;
  zReportList1 : MZReportHeader;
  zReportList2 : Array<MZReportDetails1>;
  zReportList3 : Array<MZReportDetails2>;
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
  current_storeName:any;
  myForm: FormGroup;
  printerName : any;
  CurrentDate:any;
  getZReport1:any;
  getZReport2:any;
  getZReport3:any;
  isSales:boolean=false;
  isreturns:boolean=false;
  isExchange:boolean=false;
  PosInfo:any;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private printService: QzTrayService
  ) {

    this.current_date = new Date();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
    this.current_storeName=this.user_details.storeName.toString();
    this.decimalPlaces = this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;

    this.createForm();
  }
  createForm()
     {
      this.myForm = this.fb.group({
        businessdate: ['',Validators.required],
      });
      this.zReportList1=new MZReportHeader();
      this.zReportList2=new Array<MZReportDetails1>();
      this.zReportList3=new Array<MZReportDetails2>();
     }
  viewZreport()
  {
    this.getZReportView1()
    .then((data1) => {
      this.generatePDF();
      this.common.hideSpinner();
    })
    .catch((err1) => {
      this.common.hideSpinner();
      this.common.showMessage("warn", err1);
    });

  }
  getZReportView1() {
    this.isSales=false;
    this.isreturns=false;
    this.isExchange=false;
    this.business_date = this.myForm.get('businessdate').value;
    return new Promise((resolve, reject) => {
    this.api.getAPI("NewZReport?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
      .subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1)
          {
            if(data.zReportList1!=null)
            {
            this.zReportList1.storeImage=data.zReportList1[0].storeImage == null || data.zReportList1[0].storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.zReportList1[0].storeImage;
            this.zReportList1.country=data.zReportList1[0].country!= null ? data.zReportList1[0].country : "";
            this.zReportList1.shopCode=data.zReportList1[0].shopCode!= null ? data.zReportList1[0].shopCode : "";
            this.zReportList1.shopName=data.zReportList1[0].shopName!= null ? data.zReportList1[0].shopName : "";
            this.zReportList1.date=this.common.toddmmmyyFormat(data.zReportList1[0].date);
            this.zReportList1.time=data.zReportList1[0].time!= null ? data.zReportList1[0].time : "";
            }
            if(data.zReportList2!=null)
            {
            this.zReportList2=data.zReportList2;
            }
            if(data.zReportList3!=null)
            {
            this.zReportList3=data.zReportList3;
            console.log(this.zReportList3);
            var characters = this.zReportList3;

            this.PosInfo =_.chain(characters).groupBy("posid").map(function(v, i) {
              return {
                Posname: i,
                shiftinfo: _.map(v)
              }
            }).value();
          }
            resolve("ok");

          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            //this.common.showMessage('warn', msg);
            reject(msg);
          }


      });
    });
  }
  // getZReportView2() {

  //   this.business_date = this.myForm.get('businessdate').value;
  //   return new Promise((resolve, reject) => {
  //   this.api.getAPI("ZReport2?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
  //     .subscribe((data) => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {

  //           this.getZReport2 = data.responseDynamicData;
  //           this.shiftID = data.responseDynamicData[0].shiftID;
  //           this.paymentCurrency = data.responseDynamicData[0].paymentCurrency;
  //           this.cash = data.responseDynamicData[0].cash;
  //           this.knet = data.responseDynamicData[0].knet;
  //           this.visa = data.responseDynamicData[0].visa;
  //           this.creditcard = data.responseDynamicData[0].creditcard;
  //           this.foreignTotal = data.responseDynamicData[0].foreignTotal;
  //           this.posid = data.responseDynamicData[0].posid;
  //           this.totalCash = data.responseDynamicData[0].totalCash;
  //           this.zReportList2 = data.responseDynamicData;
  //           for(let i=0;i<this.getZReport2.length;i++)
  //           {
  //             this.paymentCash = this.paymentCash + this.getZReport2[i].paymentCash;
  //             this.returnAmount = this.returnAmount + this.getZReport2[i].returnAmount;
  //             this.totalKnet = this.totalKnet + this.getZReport2[i].knet;
  //             this.totalVisa = this.totalVisa + this.getZReport2[i].visa;
  //             this.totalCreditCard = this.totalCreditCard + this.getZReport2[i].creditcard;
  //           }
  //           this.cashValue = this.paymentCash + this.returnAmount;
  //           this.totCash = this.totalCash + this.returnAmount;
  //           this.totalCardValue = this.totalKnet + this.totalVisa + this.totalCreditCard;

  //           this.differenceValue = this.totCash + this.foreignTotal + this.returnAmount +
  //                               + this.totalKnet + this.totalVisa + this.totalCreditCard
  //                               - this.netSalesAmount;
  //                               resolve("ok");
  //                               console.log(this.getZReport2);

  //         } else {
  //           let msg: string = data != null
  //             && data.displayMessage != null
  //             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //             //this.common.showMessage('warn', msg);
  //             reject(msg);

  //         }

  //     });
  //   });
  // }
  // getZReportView3() {

  //   this.business_date = this.myForm.get('businessdate').value;
  //   return new Promise((resolve, reject) => {
  //   this.api.getAPI("ZReport3?BusinessDate="+ this.business_date +"&StoreID=" + this.user_details.storeID)
  //     .subscribe((data) => {

  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //           this.zReportList3=data.responseDynamicData;
  //           this.getZReport3 = data.responseDynamicData;
  //           this.invoiceNo = data.responseDynamicData[0].invoiceNo;
  //           this.totalSales = data.responseDynamicData[0].netSales;
  //           this.totalDiscount = data.responseDynamicData[0].discountTotal;
  //           this.totalAmount = data.responseDynamicData[0].totalAmount;
  //           this.creditSale = data.responseDynamicData[0].creditSale;
  //           this.subTotal = data.responseDynamicData[0].subTotal;
  //           this.netSales = data.responseDynamicData[0].netSales;
  //           this.isReturn = data.responseDynamicData[0].isReturn;

  //           if(this.isReturn==true)
  //           {
  //             this.returnValue = "Return";
  //             this.total = this.totalAmount;
  //           }
  //           else
  //           {
  //             this.returnValue = "Sales";
  //             this.total = this.subTotal - this.totalDiscount;
  //           }
  //           for(let i=0;i<this.getZReport3.length;i++)
  //           {
  //             this.totalCreditSale = this.totalCreditSale + this.getZReport3[i].creditSale;
  //           }
  //           console.log(this.getZReport3);
  //           resolve("ok");

  //         } else {
  //           let msg: string = data != null
  //             && data.displayMessage != null
  //             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //           //this.common.showMessage('warn', msg);
  //           reject(msg);
  //         }

  //     });
  //   });

  // }

  ngOnInit(): void {
  }

  onDownload(event: any): void {
    this.download();
  }

  onPrint(event: any): void {
    this.print();
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
    //   // this.printService.printData(this.printerName,this.pdfData);
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
    var  tbl = {
     // headerRows: 1,
      // left, top, right, bottom
      widths: [90,90, 90],
      body:[]
      };

          var body = [];
          var headerSec  = [
            {
               // left, top, right, bottom
              border: [false, true,false, true],
              text: 'Invoice No', style: 'tableHeader',alignment: 'center'},
            {
               // left, top, right, bottom
              border: [false, true,false, true],
              text: 'Amount', style: 'tableHeader',alignment: 'center'}];
          var headerCat = [];
          var headerCat2 = [];
          var headerCat3 = [];
          var  footer = [];

          var totalsales = 0;
          var totalDis = 0;
          var stotal = 0;

          var totalReturn = 0;
          var totalRetunDis = 0;
          var rtotal = 0;

          var totalExchange = 0;
          var totalExchange = 0;
          var Etotal = 0;
          body.push(headerSec);


          for(let item of this.zReportList2)
          {


            if(item.category =='Sales'){


              if(this.isSales == false){
                headerCat = [
                {
                  // left, top, right, bottom
                   border: [false, false,false, true],
                   text: '1.'+ item.category, style: 'tableHeader',colSpan: 2, alignment: 'center'}

              ];
                body.push(headerCat);
                this.isSales = true;
              }

              var arr1 = [];
              arr1.push({
                // left, top, right, bottom
                border: [false, false,false, false],
                text: item.invoiceNo, style: 'textBlack',  alignment: 'center' });
              arr1.push({
                // left, top, right, bottom
                border: [false, false,false, false],
                text: item.amount.toFixed(this.decimalPlaces), alignment: "center", style: 'textBlack' });
              body.push(arr1);
              // this.subTotal=0;
               totalsales = totalsales + item.amount;
               totalDis = totalDis + item.discountAmount;
               stotal = totalsales + totalDis;


            }


          }
          var salesfooter = []
          var salesfooter1 = []
          var salesfooter2 = []
            salesfooter.push(
              {
                // left, top, right, bottom
                border: [false, false,false, false],
                text: 'Total Sales', style: 'tableHeader', alignment: "center",  },
              {
                 border: [false, false,false, false],
                text: totalsales.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center",bold:true  }),
              salesfooter1.push(
              {
                // left, top, right, bottom
                border: [false, false,false, false],
                text: 'Total Discount', style: 'tableHeader', alignment: "center",bold:true  },
              { border: [false, false,false, false],
                text: totalDis.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center", bold:true }),
              salesfooter2.push(
              {
                // left, top, right, bottom
                border: [false, false,false, true],
                text: 'Total', style: 'tableHeader', alignment: "center",bold:true  },
              {
                border: [false, false,false, true],
                text: stotal.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center",bold:true  })


          body.push(salesfooter);
          body.push(salesfooter1);
          body.push(salesfooter2);
          if(this.zReportList2!=null && this.zReportList2.length>0)
          {
          for(let item of this.zReportList2)
          {
            if(item.category =='Return'){
              if(this.isreturns == false){
                headerCat2 = [
                {
                  // left, top, right, bottom
                  border: [false, false,false, true],
                  text: '2.'+ item.category, style: 'tableHeader',colSpan: 2, alignment: 'center'}
                // { text: '', style: 'tableHeader',alignment: 'center'}
              ];
                body.push(headerCat2);
                this.isreturns = true;
              }

              var arr2 = [];
              arr2.push({
                // left, top, right, bottom
                border: [false, false,false, false],
                text: item.invoiceNo, style: 'textBlack',alignment: 'center'  });
              arr2.push({
                //left, top, right, bottom
                border: [false, false,false, false],
                text: item.amount.toFixed(this.decimalPlaces), alignment: "center", style: 'textBlack' });
                body.push(arr2);

                totalReturn = totalReturn + item.amount;
                rtotal = totalReturn;

            }

          }
          if(this.isreturns == true){
            var returnfooter = []
            var returnfooter1 = []

              returnfooter1.push(
              {
                border: [false, false,false, false],
                text: 'Total', style: 'tableHeader', alignment: "center",bold:true  },
              {
                border: [false, false,false, false],
                text: rtotal.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center",bold:true  })

                body.push(returnfooter1);
          }
        }
         if(this.zReportList2!=null && this.zReportList2.length>0)
         {
          for(let item of this.zReportList2)
          {
            if(item.category =='Exchange'){
              if(this.isExchange == false){
                headerCat3 = [
                {
                  border: [false, true,false, true],
                  text: '3.'+ item.category, style: 'tableHeader',colSpan: 2, alignment: 'center'}
                ];
                body.push(headerCat3);
                this.isExchange = true;
              }
              var arr3 = [];
              arr3.push({
                border: [false, false,false, false],
                text: item.invoiceNo, style: 'textBlack',alignment: 'center'  });
              arr3.push({
                border: [false, false,false, false],
                text: item.amount.toFixed(this.decimalPlaces), alignment: "center", style: 'textBlack' });
              body.push(arr3);
              Etotal=Etotal + item.amount;

            }

          }

          var Exchangefooter1 = []
          if(this.isExchange == true){
          Exchangefooter1.push(
            {
              border: [false, false,false, false],
              text: 'Total', style: 'tableHeader', alignment: "center",bold:true  },
            {
              border: [false, false,false, false],
              text: Etotal.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center",bold:true  })

              body.push(Exchangefooter1);
            }
          }
          var netamount = stotal + rtotal;
          this.netSalesAmount = netamount.toFixed(this.decimalPlaces);

 var footer3 = []

  footer3.push(
  {
    border: [false, false,false, true],
    text: 'Total Amount', style: 'tableHeader', alignment: "center",  },
  {
    border: [false, false,false, true],
    text: netamount.toFixed(this.decimalPlaces), style: 'tableHeader', alignment: "center",  }),




body.push(footer3);

tbl.body = body;
var  tbl1 = {
   widths: [30,'*',28, 25, 23, 27,30],
   body:[]
   };
   var body1 = [];

   var tbl1headerSec  = [
               {
                  // left, top, right, bottom
                 border: [false, true,true, true],
                 text: 'SHIFT', style: 'tableHeader'},
               {text: '', style: 'tableHeader'},
               {text: 'CASH', style: 'tableHeader'},
               {text: 'KNET', style: 'tableHeader'},
               {text: 'VISA', style: 'tableHeader'},
               { // left, top, right, bottom
                 border: [true, true,false, true],
                 text:'CREDIT', style: 'tableHeader'}];

               body1.push(tbl1headerSec);
               var tbl1headerCat2 = [];
               var totalCash1=0;
               var totatalvisa=0;
               var totalCredit=0;
               var totalKNET=0;
               var totalcreditcard=0;
               var totalforeignTotal=0;
               var totalreturnAmount=0;
               if(this.PosInfo!=null)
               {
               for(let item of this.PosInfo)
               {
                tbl1headerCat2 = [
                  {
                    border: [false, true,false, true],
                    text: item.Posname, style: 'tableBody', colSpan: 6, alignment: 'center'}
                  ];
                  body1.push(tbl1headerCat2);

                  for(let item1 of item.shiftinfo)
                  {

                 var arr5 = [];
                  arr5.push({
                   // left, top, right, bottom
                    border: [false, true,true, true],
                    text: item1.shiftID, style: 'tableBody'});
                  arr5.push({
                    text: item1.paymentCurrency,  style: 'tableBody' });
                    arr5.push({
                      text: item1.paymentCash.toFixed(this.decimalPlaces),  style: 'tableBody' });
                  arr5.push({
                       text: item1.knet.toFixed(this.decimalPlaces),  style: 'tableBody' });
                  arr5.push({
                       text: item1.visa.toFixed(this.decimalPlaces),  style: 'tableBody' });
                  arr5.push({
                    // left, top, right, bottom
                       border: [true, true,false, true],
                        text: item1.credit.toFixed(this.decimalPlaces),  style: 'tableBody' });
                  body1.push(arr5);
                  totalCash1=totalCash1 + item1.paymentCash;
                  totalCredit=totalCredit + item1.credit;
                  totalKNET=totalKNET + item1.knet;
                  totalcreditcard=totalcreditcard + item1.creditcard;
                  totatalvisa=totatalvisa + item1.visa;
                  totalforeignTotal=totalforeignTotal+ item1.foreignTotal;
                  totalreturnAmount =totalreturnAmount + item1.returnAmount;
                  }
                  this.totalCash=totalCash1.toFixed(this.decimalPlaces);
                  this.totalCreditSale=totalCredit.toFixed(this.decimalPlaces);
                  this.totalKnet=totalKNET.toFixed(this.decimalPlaces);
                  this.totalCreditCard=totalcreditcard.toFixed(this.decimalPlaces);
                  this.totalVisa=totatalvisa.toFixed(this.decimalPlaces);
                  this.totalCardValue=totalcreditcard + totalKNET + totatalvisa;
                  this.returnAmount=totalreturnAmount;
                  this.foreignTotal=totalforeignTotal.toFixed(this.decimalPlaces);
                  this.differenceValue = totalCash1 + totalforeignTotal + totalreturnAmount +
                                + totalKNET + totatalvisa + totalcreditcard
                                -  netamount;
               }
              }
     tbl1.body = body1;
     this.documentDefinition = {

         pageSize: { width: 224,height: 'auto'},
          pageOrientation: 'portrait',
          pageMargins: [17, 10, 10, 10],

      content: [
             {image: this.zReportList1.storeImage, width: 50,height: 30,alignment: 'center'},
             {text: '*Z REPORT*',style: 'ReportHeader'},
             {text: this.zReportList1.date,style:'ReportHeader'},
             {
       columns: [
               [
                { text: 'Shop:' ,style: 'Headerdetails1'},
                { text: 'ShopCode:',style:'Headerdetails1'},
                { text: 'Date:',style:'Headerdetails1'}
                ],
                [
                  {text:this.zReportList1.shopName,style: 'Headerdetails'},
                  {text:this.zReportList1.shopCode,style: 'Headerdetails'},
                  {text: this.zReportList1.date,style: 'Headerdetails'}
                ],
               [
                {text:'',style: 'Headerdetailsright'},
                {text:'Country:',style: 'Headerdetailsright'},
                {text:'Time :',style: 'Headerdetailsright'}
              ],
              [
                {text:'',style: 'Headerdetailsright'},
                {text: this.zReportList1.country,style: 'Headerdetailsright'},
                {text: this.zReportList1.time,style: 'Headerdetailsright'}
              ],

          ]

        },


        [
              {

               table:tbl


            },

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
          [
            {

             table:tbl1


          },

        ],
            {text: 'STORE COLLECTION', fontSize: 8, bold: true, decoration: 'underline', margin: [0, 0, 0, 2]},
            {
              style: 'tableExample',
              table: {
                widths: ['*','*'],
                body: [
                  [

                    {
                      border: [true, true, false, true],
                      fontSize: 8,
                      text: 'NET SALES:\n\n CASH \n\n KNET \n\n VISA \n\n CREDIT CARD \n\n TOTAL CARD AMOUNT \n\n CREDIT SALE \n\n FOREIGN CURRENCY VALUE \n\n DIFFERENCE VALUE'
                    },
                    {
                      border: [false, true, true, true],
                      alignment: 'right',
                      fontSize: 8,
                      text:this.netSalesAmount
                      +'\n\n'+ this.totalCash
                      +'\n\n'+this.totalKnet
                      +'\n\n'+this.totalVisa
                      +'\n\n'+this.totalCreditCard
                      +'\n\n'+ this.totalCardValue.toFixed(this.decimalPlaces)
                      +'\n\n'+this.totalCreditSale
                      +'\n\n'+this.foreignTotal
                      +'\n\n\n'+this.differenceValue.toFixed(this.decimalPlaces)
                    }
                  ]
                ]
              },
              layout: {
                defaultBorder: false,
              }
            },

          {
            columns:[

                  {text: 'Manager Signature', alignment: 'right',bold:true,fontSize:8, style: 'sectionHeader'   },
            ]
          }
],
styles: {
  ReportHeader:
  {
    fontSize: 10,
    alignment: 'center',
    bold:true

  },
  Headerdetails:
  {
    fontSize: 8,
    width: 50
  },
  Headerdetails1:
  {
    fontSize: 8,
     bold: true
  },
  Headerdetailsright:
  {
    alignment: 'right',
    fontSize: 8,
    bold: true
  },
  Headerdetailsright1:
  {
    alignment: 'right',
    fontSize: 8
  },
  HeaderImage:
  {
    width: 50,
    height: 30,
    alignment: 'center'
  },
  sectionHeader: {
    bold: true,
    decoration: 'underline',
    fontSize: 2,
    margin: [0, 1,0, 1] ,

  },

  tableHeader: {
    bold: true,
    fontSize: 8,
    border: [false, true,false, true]

  },
  tableBody: {
    bold: false,
    fontSize: 6,
  },
  textBlack:{
    fontSize: 7,
    bold: false,

  },
  header: {
    fontSize: 12,
    bold: true,
    margin: [0, 20, 0, 10],
    decoration: 'underline'
  },
  name: {
    fontSize: 16,
    bold: true
  },
  jobTitle: {
    fontSize: 14,
    bold: true,
    italics: true
  },
  sign: {
    margin: [0, 50, 0, 10],
    alignment: 'right',
    italics: true
  },
  tableExample: {
    margin: [0, 5, 0, 15]
  },

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
    var data=
    {
      "title": "Z Report",
      "author": "in progress dev",
      "subject": "Z Report",
      "keywords": "project",
      "creator": "pdfmake",
      "content": {
        "title": "Z Report"
      }
    }
    if (data) {
      this.pdfData = data;
      this.generatePDF();
     };
  }
}
