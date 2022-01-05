import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../assets/vfs_fonts.js";
import { fonts } from "src/assets/config/pdfFonts";
import { formatDate } from '@angular/common';
import { styles, defaultStyle } from "src/assets/config/customStyles";

@Component({
  selector: 'app-stock-receipt-report',
  templateUrl: './stock-receipt-report.component.html',
  styleUrls: ['./stock-receipt-report.component.css']
})
export class StockReceiptReportComponent implements OnInit {


  fileName = "storereturn-document.pdf";
  // set zoom variables
  currentPage = 0;
  zoom = 0.98; // default initial zoom value
  zoomMax = 2; // max zoom value
  zoomMin = 0.5; // min zoom value
  zoomAmt = 0.2; // stepping zoom values on button click
  zoomScale = "page-width"; // zoom scale based on the page-width
  totalPages = 0; // indicates the total number of pages in the pdf document
  pdf: PDFDocumentProxy; // to access pdf information from the pdf viewer
  documentDefinition: object;
  generatedPDF: any;
  pdfData;
  stockreceiptList: any;
  stockReturnHeaderList: any;
  stockReceiptDetailsList:any;
  stockretunList2: any;
  DocumentNo: any;
  Date: any;
  quantity: any;
  ToLoc: any;
  FromLoc: any;
  SendDate: any;
  user: any;

  myForm: FormGroup;
  user_details: MUserDetails = null;
  pdfSrc; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 0;
  fromdate: any;
  todate: any;
  reportselectedvalue: any;
  stockreceiptList1: any;

  constructor(

    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private printService: QzTrayService
  ) {
    {
      let temp_str: string = localStorage.getItem('user_details');
      if (temp_str != null) {
        this.user_details = JSON.parse(temp_str);

      }

      if (this.user_details == null) {
        common.showMessage("warn", "Invalid User Details");
        localStorage.setItem('pos_mode', 'false');
        this.router.navigate(['home']);
      }
      //this.current_storeName = this.user_details.storeName;
      this.createForm();
    }
  }

  ngOnInit(): void {
  }

  createForm() {
    this.myForm = this.fb.group({

      fromdate: [''],
      todate: [''],
      reportID: ['']

    });
  }


  viewXreport() {

    this.fromdate = this.common.toYMDFormat(this.myForm.get('fromdate').value);
    this.todate = this.common.toYMDFormat(this.myForm.get('todate').value);
    this.reportselectedvalue = this.myForm.get('reportID').value;
    this.getstockreturn();
    //console.log(this.reportselectedvalue);


  }
  getData(): void {
    var data =
    {

      // type: 'html',
      // format: 'plain',
      // data: repHTML

    }
    if (data) {
      this.pdfData = data;
      this.generatePDF();
    }
  }


  // after load complete of the pdf function
  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.pdf = pdf;
    this.totalPages = pdf.numPages;
  }



  generatePDF(): void {
    console.log(this.stockReceiptDetailsList);
    if (this.reportselectedvalue == "Stock Receipt Header") {
      this.documentDefinition = {
        info: {
          // title: this.pdfData.title,

          creationDate: new Date(),
        },
        content: [
          {
            text: 'STOCK RECEIPT REPORT',
            style: 'header',
            alignment: 'center'
          },
          //   {
          //   columns: [





          //   ],
          // },
          {
            table: {

              headerRows: 1,
              //widths: ['*', '*', '*', '*', '*' , '*'],
              widths: ['11.6%', '11.6%', '11.6%', '11.6%', '11.6%', '11.6%', '11.6%','11.6%', '11.6%'],
              body: [
                ['DocumentNo', 'Date', 'Received Date', 'send qty', 'Received qty', 'Loc From','Loc To', 'User name','discrepancies'],
                // ['888','hhh','hhh','uuu','uygg'],formatDate(this.business_date, 'dd-MM-yyyy', 'en')
                ...this.stockreceiptList.map(p => ([p.documentNo, formatDate(p.documentDate, 'dd-MM-yyyy', 'en'),formatDate(p.createOn, 'dd-MM-yyyy', 'en'), p.totalQuantity, p.totalReceivedQuantity, p.fromwarehousename, p.storeCode, p.dataFrom,p.discrepancies])),




              ]


            }
          }
        ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 10,
            margin: [0, 15, 0, 15]
          }
        },
        defaultStyle,

        // ],
        // {  


      };
    }

    if (this.reportselectedvalue == "Stock Receipt Details") {
      this.documentDefinition = {
        info: {
          // title: this.pdfData.title,

          creationDate: new Date(),
        },
        content: [
          {
            text: 'STOCK RECEIPT REPORT',
            style: 'header',
            alignment: 'center'
          },
          //   {
          //   columns: [





          //   ],
          // },
          {
            table: {

              headerRows: 1,
              //widths: ['*', '*', '*', '*', '*' , '*'],
              widths: ['11.6%', '11.6%', '11.6%', '11.6%', '11.6%', '11.6%', '11.6%','11.6%', '11.6%'],
              body: [
                [ 'Date','Sku code','Transfer Qty', 'Received Qty','Loc From' ,'Loc To', 'User name','Document No','discrepancies'],
                // ['888','hhh','hhh','uuu','uygg'],formatDate(this.business_date, 'dd-MM-yyyy', 'en')
                ...this.stockreceiptList1.map(p => ([ formatDate(p.documentDate, 'dd-MM-yyyy', 'en'),p.skuCode,p.transferQuantity, p.receivedQuantity,p.fromStoreID, p.brand, p.color,p.documentNo,p.discrepancies])),




              ]


            }
          }
        ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 10,
            margin: [0, 15, 0, 15]
          }
        },
        defaultStyle,

        // ],
        // {  


      };
    }
    // Generating the pdf
    this.generatedPDF = pdfMake.createPdf(this.documentDefinition);
    // This generated pdf buffer is used for the download, print and for viewing
    this.generatedPDF.getBuffer((buffer) => {
      this.pdfSrc = buffer;
    });
    // }
    //console.log(tempstockreturndetail);
  }
  getstockreturn() {

    this.common.showSpinner();
    this.api.getAPI("StockReceiptReport?fromDate=" + this.fromdate + "&toDate=" + this.todate + "&reportselectedvalue=" + this.reportselectedvalue + "")
      .subscribe((data) => {
        setTimeout(() => {
          //console.log(data);
          if (data != null) {
            if (this.reportselectedvalue == "Stock Receipt Header") {
              this.stockreceiptList = data.stockReceiptHeaderList;
            }
            if (this.reportselectedvalue == "Stock Receipt Details") {
              this.stockreceiptList1 = data.stockReceiptDetailsList;
            }

            this.getData();




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

}
