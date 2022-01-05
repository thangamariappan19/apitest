import { Component,EventEmitter, Input, OnInit, Output  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
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
  selector: 'app-cashier-wise-report',
  templateUrl: './cashier-wise-report.component.html',
  styleUrls: ['./cashier-wise-report.component.css']
})
export class CashierWiseReportComponent implements OnInit {
  pdfSrc; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 0;

  // Initialize variables required for the header and this component
  fileName = "SALES_SUMMARY_BY_CASHIER.pdf";
  // set zoom variables
  currentPage = 0;
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
  current_storeName: any;
  public pageLabel: string;
  myForm: FormGroup;
  StoreList1: Array<any>;
  bindate:any;
  selectstoreid:any;
  ReportList:Array<any>;
  Showrroomname:string;
  groupedData:any=[];
  rundate:any;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
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
    this.createForm();
  }
  createForm()
  {
   this.myForm = this.fb.group({
     businessdate: ['',Validators.required]
    //  storeID:['',Validators.required]
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
    this.api.getAPI("SalesSummaryByCashier?FromDate=" + this.bindate + "&StoreID="+  this.user_details.storeID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1)
          {
             this.ReportList = data.reportDataTable;
             this.Showrroomname = data.reportDataTable[0].storeName;
             Rx.Observable.from(this.ReportList)
            .groupBy(x => x.employeeCode) // using groupBy from Rxjs
            .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
            .map(g => {// mapping
            return {
                employeeCode: g[0].employeeCode,
                employeeName: g[0].employeeName,//take the first name because we grouped them by name
                netAmount: _.sumBy(g, 'netAmount'), // using lodash to sum quantity
                returnAMT: _.sumBy(g, 'returnAMT'), // using lodash to sum price
                returnQTY: _.sumBy(g, 'returnQTY'),
                salesAMT: _.sumBy(g, 'salesAMT'),
                salesQTY: _.sumBy(g, 'salesQTY'),
                totalQty: _.sumBy(g, 'totalQty'),
               }
           })
          .toArray() //.toArray because I guess you want to loop on it with ngFor
          .subscribe(d => this.groupedData = d);
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
    console.log(type);
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
          info: {
            title: this.pdfData.title,
            author: this.pdfData.author,
            subject: this.pdfData.subject,
            keywords: this.pdfData.keywords,
            creator: this.pdfData.creator,
            creationDate: new Date(),
          },
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
              text: 'SALES SUMMARY BY CASHIER',
              fontSize: 12,
              alignment: 'center',
              color: '#050100',
              bold:true
            },

            [
                      {
                        text: '',
                        fontSize: 16,
                        alignment: 'center',
                        color: '#047886' ,
                        style: 'sectionHeader'
                      },

                    ],
                    {
                      table: {
                          layout: 'lightHorizontalLines',
                          margin: [0, 15, 0, 0],
                          widths: ['*','*','*','*',23],
                          body: [
                              [
                              {
                               text:'Showroom:'+this.Showrroomname +'\n\n Run Date:\t'+formatDate(this.bindate, 'dd-MM-yyyy', 'en'),
                               bold: true,
                               fontSize: 10,
                               border: [false, true, false, true],
                               },
                               {
                                  text:'Business Date:\n\n'+formatDate(this.bindate, 'dd-MM-yyyy', 'en'),

                                  fontSize: 10,
                                  border: [false, true, false, true],

                              },
                              {
                                text:'From Date:',
                                fontSize: 10,
                                border:[false, true, false, true],

                            },
                             {
                                text:'To Date:',

                                fontSize: 10,
                                border:[false,true,false,true]

                            },
                            {
                                text:'Page\n\n'+this.currentPage +'/'+this.totalPages,
                                fontSize: 10,
                                border:[false,true,false,true]

                            }
                           ],


                          ]
                      }
                  },
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

                    table: {

                        headerRows: 1,

                        widths: ['*','*', '*','*','*', '*','*'],
                        body: [
                            [
                              {fillColor: '#dddddd',bold: true,text: 'Code'},
                              {fillColor: '#dddddd',bold: true,text: 'Name'},
                              {fillColor: '#dddddd',bold: true,text: 'Invoice Qty'},
                              {fillColor: '#dddddd',bold: true,text: 'Invoice Amount'},
                              {fillColor: '#dddddd',bold: true,text: 'Return inv qty'},
                              {fillColor: '#dddddd',bold: true,text: 'Return Amnt'},
                              {fillColor: '#dddddd',bold: true,text: 'Net Sale Qty'}
  ],
                            // ['sss','sss','4354','56.90','73','6474','09'],
                            // ...this.ReportList.reduce((sum,p) => [((p.employeeCode), (p.employeeName), (sum + (p.salesQTY),0),(sum + (p.netAmount),0),(sum + (p.returnQTY),0),(sum + (p.returnAMT),0),(sum + (p.returnQTY),0).toFixed(2))]),

                            ...this.groupedData.map(p => ([p.employeeCode, p.employeeName,p.salesQTY,p.netAmount.toFixed(2),p.returnQTY,p.returnAMT, p.totalQty.toFixed(2)])),
                            ['','',this.groupedData.reduce((sum,p)=> sum + (p.salesQTY),0),this.groupedData.reduce((sum,p)=> sum + (p.netAmount),0).toFixed(2),this.groupedData.reduce((sum,p)=> sum + (p.returnQTY),0),this.groupedData.reduce((sum,p)=> sum + (p.returnAMT),0),this.groupedData.reduce((sum,p)=> sum + (p.totalQty), 0)]
                            // [{text: 'Total ',alignment: 'right',bold:true, colSpan: 2}, {},'this.xtotal']
                            // [{text: 'Total Amount ',alignment: 'right',bold:true, colSpan: 2},{},'this.totAmount']

                        ]
                    },
                    layout: 'lightHorizontalLines',
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
          //         {

          //             table: {

          //                 headerRows: 1,
          //                 widths: ['*','*', '*'],
          //                 body: [

          //                    [{text: 'NET SALES ', colSpan: 2},{}, + this.totAmount ],
          //                    [{text: 'CREDIT', colSpan: 2},{}, + this.totAmount ],
          //                    [{text: 'CASH', colSpan: 2},{},+ this.cashAmount ],
          //                    [{text: 'KNET CARD ', colSpan: 2},{},+ this.knetTotal],
          //                    [{text: 'VISA CARD', colSpan: 2},{}, + this.visaTotal],
          //                    [{text: 'CREDIT CARD', colSpan: 2},{}, + this.creditCardTotal],

          //                 ]



          //         }
          //         },

          //         {

          //           table: {

          //               headerRows: 1,
          //               widths: ['*','*', '*'],
          //               body: [

          //                  [this.finVal,this.exchangeAmount,this.subVal],


          //               ]
          //       }
          //       },
          //       [

          //         {
          //           text: '',
          //           fontSize: 16,
          //           alignment: 'center',
          //           color: '#047886' ,
          //           style: 'sectionHeader'
          //         },

          //       ],
          //       {

          //         table: {

          //             headerRows: 1,
          //             widths: ['*','*', '*'],
          //             body: [

          //                [{text: 'TOTAL CASH IN BOX', colSpan: 2},{},  + this.totalCashInBox],
          //                [{text: 'FLOAT AMOUNT', colSpan: 2},{},+ this.floatAmount],
          //                [{text: 'CASH SALES', colSpan: 2},{},+ this.cashAmount],
          //                [{text: 'CASH IN ', colSpan: 2},{},+ this.cashInAmount],
          //                [{text: 'CASH OUT ', colSpan: 2},{},+ this.cashOutAmount],
          //                [{text: 'TOTAL', colSpan: 2},{},+ this.total],
          //                [{text: 'DIFFERENCE', colSpan: 2},{},+ this.difference],

          //             ]

          //     },
          //     },


                  {

                    width: 200,
                    text:'Note:- Sales return from the same shops are counted. Return from other shops are bypassed.'
                    ,bold:true,
                    fontSize:8


                  },











    ],
    styles: {
      sectionHeader: {
        bold: true,
        decoration: 'underline',
        fontSize: 14,
        margin: [0, 15,0, 15]
      }
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
          "title": "SALES_SUMMARY_BY_CASHIER",
          "author": "in progress dev",
          "subject": "SALES_SUMMARY_BY_CASHIER",
          "keywords": "project",
          "creator": "pdfmake",
          "content": {
            "title": "SALES_SUMMARY_BY_CASHIER"
          }
        }
        if (data) {
          this.pdfData = data;
          this.generatePDF();
         }
      }
}
