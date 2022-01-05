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

@Component({
  selector: 'app-detailed-sales-invoice-report',
  templateUrl: './detailed-sales-invoice-report.component.html',
  styleUrls: ['./detailed-sales-invoice-report.component.css']
})
export class DetailedSalesInvoiceReportComponent implements OnInit {
  pdfSrc; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 0;

  // Initialize variables required for the header and this component
  fileName = "Detailed_Sales_Invoice_Report.pdf";
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
  Returnsaleslist:any=[];
  saleslist:any=[];
  rundate:any;
  customerName:string;
  saleman:string;
  ReturnNo:string;
  InvoiceNo:string;
  telephone:string;
  Remark:string;
  decimal_places:any;
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
    this.decimal_places = this.user_details.decimalPlaces != null ? this.user_details.decimalPlaces : 0;
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
    // this.GetStoreList();
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
  viewreport()
  {
    this.bindate = this.myForm.get('businessdate').value;
    //this.selectstoreid=this.myForm.get('storeID').value;
    this.GetReport();
  }
  GetReport()
  {
    this.common.showSpinner();
    this.api.getAPI("DetailedSalesInvoice?InvoiceNo=" + this.bindate + "&StoreID="+ this.user_details.storeID + "&Mode="+ 1)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1)
          {
             this.ReportList = data.reportDataTable;
             this.Showrroomname = data.reportDataTable[0].storeName;
             this.InvoiceNo=data.reportDataTable[0].salesInvoiceNumber;
             this.customerName=data.reportDataTable[0].customerFullName;
             this.telephone=data.reportDataTable[0].phoneNumber;
             this.ReturnNo=data.reportDataTable[0].invoiceNo;
             this.saleman=data.reportDataTable[0].employeeFullName;
             this.Remark=data.reportDataTable[0].discountRemarks;
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
      footer: function (currentPage, pageCount) {
        return [{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'center' }];
      },

      content: [

        {
          text: 'SALES INVOICE REPORT',
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
                      widths: [200,'*','*',110],
                      body: [
                          [
                          {
                           text:'Showroom\t\t\t\t\t:\t'+this.Showrroomname +'\n\n CustomerName\t\t:\t'+this.customerName+'\n\n Saleman\t\t\t\t\t\t:\t'+this.saleman,
                           bold: true,
                           fontSize: 8,
                           border: [false, true, false, true],
                           },
                           {
                              text:'',

                              fontSize: 8,
                              border: [false, true, false, true],

                          },
                          {
                            text:'',
                            fontSize: 8,
                            border:[false, true, false, true],

                        },
                         {
                            text:'InvoiceNo:\t'+this.ReturnNo +'\n\n TelePhone:\t'+this.telephone +'\n\n Remark:\t'+this.Remark,

                            fontSize: 8,
                            border:[false,true,false,true]

                        },

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

                    widths: ['*','*', '*','*','*', '*'],
                    body: [
                        [
                          {fillColor: '#dddddd',bold: true,text: 'SKUCode'},
                          {fillColor: '#dddddd',bold: true,text: 'QTY'},
                          {fillColor: '#dddddd',bold: true,text: 'Actual Price'},
                          {fillColor: '#dddddd',bold: true,text: 'Applied Discount for Tax'},
                          {fillColor: '#dddddd',bold: true,text: 'Tax'},
                          {fillColor: '#dddddd',bold: true,text: 'Unit Price'}
                        ],
                        ...this.ReportList.map(p => ([p.skuCode, p.qty,p.item_price.toFixed(this.decimal_places),p.item_dis.toFixed(this.decimal_places),p.item_tax.toFixed(this.decimal_places),p.price.toFixed(this.decimal_places)])),


                    ]
                },
                layout: 'lightHorizontalLines',
            },

                {
                  text: '',
                  fontSize: 16,
                  alignment: 'center',
                  color: '#047886',
                  style: 'sectionHeader'
                },
            // {text: 'Return Summary', fontSize: 8, bold: true},
            {

              table: {
                widths: ['*','*','*'],
                body: [
                  [

                    {
                      border: [false, false, false,false],

                      text: 'cash:\t'+this.ReportList.reduce((sum,p)=> sum + (p.receivedAmount), 0).toFixed(this.decimal_places)+'\n\n  KNET:\t'+this.ReportList.reduce((sum,p)=> sum + (p.kNet), 0).toFixed(this.decimal_places)+' \n\n CARD:\t '+this.ReportList.reduce((sum,p)=> sum + (p.card), 0).toFixed(this.decimal_places),
                      bold:true
                    },
                    {
                      border: [false, false, false, false],

                      text: 'Total Amt Paid\t:\t'+this.ReportList.reduce((sum,p)=> sum + (p.receivedAmount), 0).toFixed(this.decimal_places)
                      +'\n\n Balance O/S\t\t:\t'+this.ReportList.reduce((sum,p)=> sum + (p.returnAmount), 0).toFixed(this.decimal_places),
                      bold:true
                    },
                    {

                      border: [false, false, false,false],
                      text:'Total Qty:\t\t\t:\t'+ this.ReportList.reduce((sum,p)=> sum + (p.qty), 0).toFixed(this.decimal_places)+
                      '\n\nGross Amt\t\t:\t'+this.ReportList.reduce((sum,p)=> sum + (p.netAmount), 0).toFixed(this.decimal_places)
                      +'\n\nDisc Amt\t\t\t:\t'+ this.ReportList.reduce((sum,p)=> sum + (p.totalDiscountAmount), 0).toFixed(this.decimal_places)
                      +'\n\n Sale Tax\t\t\t:\t'+ this.ReportList.reduce((sum,p)=> sum + (p.taxAmount), 0).toFixed(this.decimal_places)
                      +'\n\n Net Amt\t\t\t:\t'+this.ReportList.reduce((sum,p)=> sum + (p.netAmount), 0).toFixed(this.decimal_places),
                      bold:true
                      // +'\n\n Amount Returned:\t'+this.ReportList.reduce((sum,p)=> sum + (p.totalReturnAmount), 0)

                    }
                  ]
                ]
              },
              layout: {
                defaultBorder: false,
              }
            },

          ],




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
         }
      }
}
