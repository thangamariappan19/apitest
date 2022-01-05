import { Component,EventEmitter, Input, OnInit, Output  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MDayClosing } from 'src/app/models/m-day-closing';
import { MEmployeeMaster, MEmployeeAC } from 'src/app/models/m-employee-master';
import { QzTrayService } from 'src/app/qz-tray-service';
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import * as Rx  from 'rxjs/Rx';
import * as _ from 'lodash';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../assets/vfs_fonts.js";
import { fonts } from "src/assets/config/pdfFonts";
import {formatDate} from '@angular/common';
import { styles, defaultStyle } from "src/assets/config/customStyles";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts;

@Component({
  selector: 'app-detailed-showroom-sales-report',
  templateUrl: './detailed-showroom-sales-report.component.html',
  styleUrls: ['./detailed-showroom-sales-report.component.css']
})
export class DetailedShowroomSalesReportComponent implements OnInit {
  pdfSrc; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 0;

  // Initialize variables required for the header and this component
  fileName = "Detailed_Showroom_Sales_Report.pdf";
  // set zoom variables
  currentPage = 0;
  zoom = 0.4;// default initial zoom value
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
  current_storeName: any;
  public pageLabel: string;
  myForm: FormGroup;
  StoreList1: Array<any>;
  bindate:any;
  decimal_places:any;
  selectstoreid:any;
  ReportList:Array<any>;
  Showrroomname:string;
  groupedData:any=[];
  Returnsaleslist:any=[];
  saleslist:any=[];
  rundate:any;
  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router) {
      let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);

    }
    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
    this.current_storeName=this.user_details.storeName;
    this.decimal_places = this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;
    this.createForm();
   }
   createForm()
   {
    this.myForm = this.fb.group({
      businessdate: ['',Validators.required]
      // storeID:['',Validators.required]
    });
   }

  ngOnInit(): void {
    //this.GetStoreList();
  }
  viewreport()
  {
    this.bindate = this.common.toYMDFormat(this.myForm.get('businessdate').value);
    //this.selectstoreid=this.myForm.get('storeID').value;
    this.GetReport();

  }
  // GetStoreList()
  // {
  //   this.common.showSpinner();
  //   this.api.getAPI("Store?ID=" + this.user_details.storeID.toString() + "&dummy=" + '')
  //     .subscribe((data) => {
  //       setTimeout(() => {
  //         if (data != null && data.statusCode != null && data.statusCode == 1) {
  //            this.StoreList1 = data.storeList;
  //         }
  //         else {
  //           let msg: string = data != null
  //             && data.displayMessage != null
  //             && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
  //           this.common.showMessage('warn', msg);
  //         } this.common.hideSpinner();
  //       }, this.common.time_out_delay);
  //     });

  // }
  GetReport()
  {
    this.common.showSpinner();
    this.api.getAPI("DetailedShowroomSales?FromDate=" + this.bindate + "&StoreID="+ this.user_details.storeID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1)
          {
             this.ReportList = data.reportDataTable;
             this.Showrroomname = data.reportDataTable[0].storeName;
             Rx.Observable.from(this.ReportList)
             .filter(p => p.remarks === "SALES RETURN")
             .map(p => {
              return {
                invoiceNo: p.invoiceNo,
                totalDiscountAmount:p.totalDiscountAmount,
                netAmount: p.netAmount,
                cashReceivedAmount:p.cashReceivedAmount,
                knet:p.kNet!=null ? p.kNet:0,
                card: p.card!=null ? p.card:0,
                credit:p.credit=null?p.credit:0,
                receivedCardAmount:p.receivedCardAmount,
                subTotalAmount:p.subTotalAmount,
                cashCurrency:p.cashCurrency,
                cardCurrency:p.cardCurrency
                     }
             })
             .toArray()
            .subscribe( d => this.Returnsaleslist = d,
               err => console.error(err),
             () => console.log("Streaming is over"));
             Rx.Observable.from(this.ReportList)
             .filter(p => p.remarks === "SALES")
             .map(p => {
              return {
                      invoiceNo: p.invoiceNo,
                      totalDiscountAmount:p.totalDiscountAmount,
                      netAmount: p.netAmount,
                      cashReceivedAmount:p.cashReceivedAmount!=null ? p.cashReceivedAmount:0,
                      knet:p.kNet!=null ? p.kNet:0,
                      card: p.card!=null ? p.card:0,
                      credit:p.credit=null?p.credit:0,
                      receivedCardAmount:p.receivedCardAmount,
                      subTotalAmount:p.subTotalAmount,
                      cashCurrency:p.cashCurrency,
                      cardCurrency:p.cardCurrency

                     }
             })
             .toArray()
            .subscribe( d => this.saleslist = d,
               err => console.error(err),
             () => console.log("Streaming is over"));
         console.log(this.groupedData);
          this.getData();
          }
          else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          } this.common.hideSpinner();
        }, this.common.time_out_delay);
      });

  }
  onDownload(event: any): void {
    this.download();
  }

  onPrint(event: any): void {
    this.print();
    // this.printService.printHTML(this.printerName, printData);
  }

  zoomfuction(type: string): void {
    this.setZoom(type);
  }
   // zoom functionality for the pdf viewer
   setZoom(type: string): void {
    // console.log(type);
    if (type === "increment") {
      this.zoom += this.zoomAmt;
    } else if (type === "decrement") {
      this.zoom -= this.zoomAmt;
    }
  }

  // pdfSrc value we are taking from the pdfmake generate function in buffer type so currently this willnot work
  // after the pdf is generated it will work
  // Download functionality of the pdf
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
        this.documentDefinition = {
          pageSize: 'A4',
          pageOrientation: 'portrait',
          pageMargins: [17, 10, 10, 10],
          footer: function(pagenumber, pagecount) {
            return {
                margin: [40, 0],
                text: pagenumber + ' / ' + pagecount
               };
           },
          content: [
            {
              text: 'DETAILED SHOWROOM SALES',
              fontSize: 12,
              alignment: 'center',
              color: '#050100',
              bold:true
             },


                    {
                      table: {
                          layout: 'lightHorizontalLines',
                          margin: [0, 15, 0, 0],
                          widths: ['*','*','*','*','*'],
                          decorationStyle:'dashed',
                          body: [
                              [
                              {
                               text:'Showroom: ' +this.Showrroomname +'\n\n Run Date:\t'+formatDate(this.bindate, 'dd-MM-yyyy', 'en'),
                               bold: true,
                               fontSize: 10,
                               border: [false, true, false, true],
                               decorationStyle:'dashed'
                               },

                              {
                                text:'',
                                fontSize: 10,
                                border:[false, true, false, true],

                            },
                             {
                                text:'',

                                fontSize: 10,
                                border:[false,true,false,true]

                            },
                            {
                                text:'',
                                fontSize: 10,
                                border:[false,true,false,true]

                            },
                            {
                              text:'Date:\n\n'+formatDate(this.bindate, 'dd-MM-yyyy', 'en'),

                              fontSize: 10,
                              border: [false, true, false, true],

                          }

                           ],


                          ]
                      },
                      layout: {
                        hLineStyle: function (i, node) {
                          return {dash: {length: 5, space: 8}};
                        },
                        // vLineStyle: function (i, node) {
                        //   return {dash: {length: 4}};
                        // },
                      }

                  },
              [
                   {
                    table: {
                      margin: [0, 15, 0, 0],
                      widths: [560],
                      body: [
                          [
                          {
                           style: 'header',
                           text:'SALES',
                           border:[false, false, false, false],
                           }
                          ],
                        ]
                      }
                   },

                    {

                    table: {

                        headerRows: 1,

                        widths: ['*','*','*',40,'*',50,50,50,50],

                        body: [
                            [

                              {fillColor: '#008081',color:'#fff',bold: true,text: 'Invoice No'},
                              {fillColor: '#008081',color:'#fff',bold: true,text: 'Gross Amount'},
                              {fillColor: '#008081',color:'#fff',bold: true,text: 'Tax Amount'},
                              {fillColor: '#008081',color:'#fff',bold: true,text: 'Discount'},
                              {fillColor: '#008081',color:'#fff',bold: true,text: 'Net Amount'},
                              {fillColor: '#008081',color:'#fff',bold: true,text: 'Cash'},
                              {fillColor: '#008081',color:'#fff',bold: true,text: 'K-Net'},
                              {fillColor: '#008081',color:'#fff',bold: true,text: 'Card'},
                              {fillColor: '#008081',color:'#fff',bold: true,text: 'Credit'},

  ],


                            ...this.saleslist.map(p =>([p.invoiceNo, p.netAmount.toFixed(this.decimal_places), p.cashCurrency.toFixed(this.decimal_places), p.totalDiscountAmount.toFixed(this.decimal_places), p.netAmount.toFixed(this.decimal_places) ,p.cashReceivedAmount.toFixed(this.decimal_places) , p.knet.toFixed(this.decimal_places) ,p.card.toFixed(this.decimal_places),p.credit.toFixed(this.decimal_places)])),


                            ['Total',this.saleslist.reduce((sum,p)=> sum + (p.netAmount),0).toFixed(2),this.saleslist.reduce((sum,p)=> sum + (p.cashCurrency),0).toFixed(this.decimal_places),this.saleslist.reduce((sum,p)=> sum + (p.totalDiscountAmount),0).toFixed(this.decimal_places),this.saleslist.reduce((sum,p)=> sum + (p.netAmount),0).toFixed(this.decimal_places),this.saleslist.reduce((sum,p)=> sum + (p.cashReceivedAmount), 0).toFixed(this.decimal_places),this.saleslist.reduce((sum,p)=> sum + (p.knet), 0).toFixed(this.decimal_places),this.saleslist.reduce((sum,p)=> sum + (p.card), 0).toFixed(this.decimal_places),this.saleslist.reduce((sum,p)=> sum + (p.credit), 0).toFixed(this.decimal_places)]

                        ]
                    },

                }],
                [
                  {
                    table: {
                      margin: [0, 15, 0, 0],
                      widths: [560],
                      body: [
                          [
                          {
                           style: 'header',
                           text:'SALES RETURNS',
                           border:[false, false, false, false],
                           }
                          ],
                        ]
                      }
                   },

                {

                  table: {

                      headerRows: 1,

                      widths: ['*','*', '*','*','*', '*','*','*'],
                      body: [
                          [
                            {fillColor: '#008081',color:'#fff',bold: true,text: 'Invoice No'},
                            {fillColor: '#008081',color:'#fff',bold: true,text: 'Gross Amount'},
                            {fillColor: '#008081',color:'#fff',bold: true,text: 'Tax Amount'},
                            {fillColor: '#008081',color:'#fff',bold: true,text: 'Discount'},
                            {fillColor: '#008081',color:'#fff',bold: true,text: 'Net Amount'},
                            {fillColor: '#008081',color:'#fff',bold: true,text: 'Cash'},
                            {fillColor: '#008081',color:'#fff',bold: true,text: 'K-Net'},
                            {fillColor: '#008081',color:'#fff',bold: true,text: 'Card'}
],
                          ...this.Returnsaleslist.map(p =>([p.invoiceNo, p.netAmount.toFixed(this.decimal_places),p.cashCurrency.toFixed(this.decimal_places),p.totalDiscountAmount.toFixed(this.decimal_places),p.netAmount.toFixed(this.decimal_places),p.cashReceivedAmount.toFixed(this.decimal_places), p.knet.toFixed(this.decimal_places) ,p.card.toFixed(this.decimal_places)])),
                          ['Total',this.Returnsaleslist.reduce((sum,p)=> sum + (p.netAmount),0).toFixed(this.decimal_places),this.Returnsaleslist.reduce((sum,p)=> sum + (p.cashCurrency),0).toFixed(this.decimal_places),this.Returnsaleslist.reduce((sum,p)=> sum + (p.totalDiscountAmount),0).toFixed(this.decimal_places),this.Returnsaleslist.reduce((sum,p)=> sum + (p.netAmount),0).toFixed(this.decimal_places),this.Returnsaleslist.reduce((sum,p)=> sum + (p.cashReceivedAmount), 0).toFixed(this.decimal_places),this.Returnsaleslist.reduce((sum,p)=> sum + (p.knet), 0).toFixed(this.decimal_places),this.Returnsaleslist.reduce((sum,p)=> sum + (p.card), 0).toFixed(this.decimal_places)]

                      ]
                  },

              }],
                  [

                    {
                      text: '',
                      fontSize: 16,
                      alignment: 'center',
                      color: '#047886',
                      style: 'sectionHeader'
                    },

                  ],



          {text: 'COLLECTION SUMMARY', fontSize: 8, bold: true, decoration: 'underline', margin: [0, 0, 0, 8]},
          {
            style: 'tableExample',
            table: {
              widths: ['*','*'],
              body: [
                [

                  {
                    border: [true, true, false, true],
                    text: ' CASH \n\n KNET \n\n CARD \n\n TOTAL'
                  },
                  {
                    border: [false, true, true, true],
                    alignment: 'right',
                    text: this.saleslist.reduce((sum,p)=> sum + (p.cashReceivedAmount), 0).toFixed(this.decimal_places)
                    +'\n\n'+ this.saleslist.reduce((sum,p)=> sum + (p.knet), 0).toFixed(this.decimal_places)
                    +'\n\n'+this.saleslist.reduce((sum,p)=> sum + (p.card), 0).toFixed(this.decimal_places)
                    +'\n\n'+this.saleslist.reduce((sum,p)=> sum + (p.cashReceivedAmount) + (p.knet) + (p.card),0).toFixed(this.decimal_places)

                  }

                ]
              ]
            },
            layout: {
              defaultBorder: false,
            }
          },


    ],
    styles: {
      sectionHeader: {
        bold: true,
        decoration: 'underline',
        fontSize: 14,
        margin: [0, 15,0, 15]
      },
      header: {
        fontSize: 12,
        bold: true,
        fillColor: '#eeeeee'
    }
    },
          defaultStyle,
    };
        this.generatedPDF = pdfMake.createPdf(this.documentDefinition);
        this.generatedPDF.getBuffer((buffer) => {
          this.pdfSrc = buffer;
        });
      }

      getData(): void {
        var data=
        {
          "title": "Detailed_Showroom_Sales_Report",
          "author": "in progress dev",
          "subject": "Detailed_Showroom_Sales_Report",
          "keywords": "project",
          "creator": "pdfmake",
          "content": {
            "title": "Detailed_Showroom_Sales_Report"
          }
        }
        if (data) {
          this.pdfData = data;
          this.generatePDF();
         }
      }

}
