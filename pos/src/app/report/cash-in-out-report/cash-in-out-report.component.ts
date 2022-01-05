import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import * as _ from 'lodash';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../assets/vfs_fonts.js";
import { fonts } from "src/assets/config/pdfFonts";
import {formatDate} from '@angular/common';
import { styles, defaultStyle } from "src/assets/config/customStyles";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts;

@Component({
  selector: 'app-cash-in-out-report',
  templateUrl: './cash-in-out-report.component.html',
  styleUrls: ['./cash-in-out-report.component.css']
})
export class CashInOutReportComponent implements OnInit {
  user_details: MUserDetails = null;
  current_storeName: any;
  myForm: FormGroup;
  CategroyType:string;
  todate: string;
  fromdate: string;
  mCashInOutList: Array<any>;
  pdfSrc; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 0;

  // Initialize variables required for the header and this component
  fileName = "CashIn_CashOut_Report.pdf";
  // set zoom variables
  currentPage = 0;
  zoom = 0.4;  // default initial zoom value
  zoomMax = 2; // max zoom value
  zoomMin = 0.5; // min zoom value
  zoomAmt = 0.2; // stepping zoom values on button click
  zoomScale = "page-width"; // zoom scale based on the page-width
  totalPages = 0; // indicates the total number of pages in the pdf document
  pdf: PDFDocumentProxy; // to access pdf information from the pdf viewer
  documentDefinition: object;
  generatedPDF: any;
  pdfData;
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
    this.current_storeName = this.user_details.storeName;
    this.createForm();
   }
   createForm() {
    this.myForm = this.fb.group({
      CategoryType: ['',Validators.required],
      FromDate:['',Validators.required],
      ToDate: ['',Validators.required]

    });
    this.mCashInOutList=new Array<any>();
  }
  ngOnInit(): void {
  }
  Get_click()
  {
    this.CategroyType = this.myForm.get('CategoryType').value;
    this.todate = this.common.toYMDFormat(this.myForm.get('ToDate').value);
    this.fromdate =this.common.toYMDFormat(this.myForm.get('FromDate').value);
    this.common.showSpinner();
    this.api.getAPI("CashInCashOut?FromDate=" + this.fromdate + "&Todate=" + this.todate + "&CategoryType="+this.CategroyType+"&Storeid="+this.user_details.storeID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.mCashInOutList=data.cashInCashOutReportList;
            // if(this.CategroyType=='CashIn')
            // {
            // for(let  item of data.cashInCashOutReportList)
            // {
            //   var item1:any={
            //     serialNo:item.serialNo,
            //     reasonName:item.reasonName,
            //     remarks:item.remarks,
            //     Amount:item.receivedAmount

            //   }
            //   this.mCashInOutList.push(item1);

            // }
            // }
            // else
            // {
            //   for(let item of data.cashInCashOutReportList)
            //   {
            //   var item1:any={
            //     serialNo:item.serialNo,
            //     reasonName:item.reasonName,
            //     remarks:item.remarks,
            //     Amount:item.paidAmount

            //   }
            //   this.mCashInOutList.push(item1);

            // }

            // }
           this.generatePDF();

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
    if(this.CategroyType=='CashIn')
    {
      this.fileName='CashIn-Summary-Report.pdf';
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
            text: 'Cash-In Summary Report',
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
                        widths: ['*','*','*','*','*'],
                        body: [
                            [
                            {
                             text:'Showroom:'+this.user_details.storeName +'\n\n Run Date:\t'+formatDate( Date(), 'dd-MM-yyyy', 'en'),
                             bold: true,
                             fontSize: 10,
                             border: [false, true, false, true],
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
                            text:'Business Date:\n\n'+formatDate(Date(), 'dd-MM-yyyy', 'en'),

                            fontSize: 10,
                            border: [false, true, false, true],

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

                      widths: [25,'*','*','*'],
                      body: [
                          [
                            {fillColor: '#dddddd',bold: true,text: 'SNo'},
                            {fillColor: '#dddddd',bold: true,text: 'Reason'},
                            {fillColor: '#dddddd',bold: true,text: 'Remark'},
                            {fillColor: '#dddddd',bold: true,text: 'Received Amount'}
                           ],

                          ...this.mCashInOutList.map(p =>([p.serialNo, p.reasonName, p.remarks, p.receivedAmount])),

                           [{text: 'Total ',alignment: 'right',bold:true, colSpan: 3},'','',this.mCashInOutList.reduce((sum,p)=> sum + (p.receivedAmount),0).toFixed(2)]
                           //[{ text: 'Total ', alignment: 'right', bold: true},1 ]
                          // ['Total',this.mCashInOutList.reduce((sum,p)=> sum + (p.Amount),0).toFixed(2)]

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
    }
    if(this.CategroyType=='CashOut')
    {
      this.fileName='CashOut-Summary-Report.pdf';
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
            text: 'Cash-Out Summary Report ',
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
                        widths: ['*','*','*','*','*'],
                        body: [
                            [
                            {
                             text:'Showroom:'+this.user_details.storeName +'\n\n Run Date:\t'+formatDate( Date(), 'dd-MM-yyyy', 'en'),
                             bold: true,
                             fontSize: 10,
                             border: [false, true, false, true],
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
                            text:'Business Date:\n\n'+formatDate(Date(), 'dd-MM-yyyy', 'en'),

                            fontSize: 10,
                            border: [false, true, false, true],

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

                      widths: [25,'*','*','*'],
                      body: [
                          [
                            {fillColor: '#dddddd',bold: true,text: 'SNo'},
                            {fillColor: '#dddddd',bold: true,text: 'Reason'},
                            {fillColor: '#dddddd',bold: true,text: 'Remark'},
                            {fillColor: '#dddddd',bold: true,text: 'PaidAmount'}
                           ],

                          ...this.mCashInOutList.map(p =>([p.serialNo, p.reasonName, p.remarks, p.paidAmount])),

                           [{text: 'Total ',alignment: 'right',bold:true, colSpan: 3},'','',this.mCashInOutList.reduce((sum,p)=> sum + (p.paidAmount),0).toFixed(2)]
                           //[{ text: 'Total ', alignment: 'right', bold: true},1 ]
                          // ['Total',this.mCashInOutList.reduce((sum,p)=> sum + (p.Amount),0).toFixed(2)]

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
    }

        // Generating the pdf
        this.generatedPDF = pdfMake.createPdf(this.documentDefinition);
        // This generated pdf buffer is used for the download, print and for viewing
        this.generatedPDF.getBuffer((buffer) => {
          this.pdfSrc = buffer;
        });
      }

}
