import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MTransactionLog } from 'src/app/models/m-transaction-log';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MDocumentNumbering } from 'src/app/models/m-document-numbering';
import { MStockreturnheaderMaster } from 'src/app/models/m-stockreturnheader-master';
import { MStockreturndetailsMaster } from 'src/app/models/m-stockreturndetails-master';
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "src/assets/vfs_fonts.js";
import { fonts } from "src/assets/config/pdfFonts";
import { formatDate } from '@angular/common';
import { styles, defaultStyle } from "src/assets/config/customStyles";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts;

@Component({
  selector: 'app-stockreturn-view',
  templateUrl: './stockreturn-view.component.html',
  styleUrls: ['./stockreturn-view.component.css']
})
export class StockreturnViewComponent implements OnInit {

  pdfSrc; // this sample, dynamic one we will generate with the pdfmake
  pageVariable = 0;

  myForm: FormGroup;
  skuList: Array<MSkuMasterTypes>;
  user_details: MUserDetails = null;
  stockreturn: MStockreturnheaderMaster;
  stockreturndetails: Array<any>;
  stockreturnlist: Array<MStockreturndetailsMaster>;
  tempstockreturndetail:Array<any>;
  documentnumberinglist: Array<MDocumentNumbering>;
  transactionLogList: Array<MTransactionLog>;
  wareHouseList: Array<any>;
  id: any;
  countryid: number;
  StoreFullName: any;
  WarehouseCode: any;
  WarehouseName: any;
  DocumentDate: any;
  DocumentNo: any;
  Remarks: any;
  stock_return = null;
  generatedPDF: any;
  totalPages = 0;
  pdf: PDFDocumentProxy;
  pdfData;
  documentDefinition: object;
  totalqty:any;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      barCode: ['', Validators.required],
      fromstore: ['', Validators.required],
      documentDate: ['', Validators.required],
      documentNo: ['', Validators.required],
      status: ['', Validators.required],
      toWareHouse: ['', Validators.required],
      returnquantity: [],
      totalqty: [],
      rem: [''],
      group: [''],
      stockqty: []
    });
  }
  ngOnInit(): void {
    this.getStaticValues();
    this.getWarehouse();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStockReturnDetails();
    //this. getData();
  }




  getStaticValues() {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.countryid = this.user_details.countryID;


      localStorage.setItem('stockreturnlist', 'true');
      let inv_str: string = localStorage.getItem('stock_return');
      if (inv_str != null) {
        this.stockreturnlist = JSON.parse(inv_str);
      }
    }
  }


  getWarehouse() {
    this.common.showSpinner();
    this.api.getAPI("WarehouseLookUp?countryid=" + this.countryid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.wareHouseList = data.warehouseMasterList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
            //this.productgroupList=null;
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.pdf = pdf;
    this.totalPages = pdf.numPages;
  }

  onPrint(event: any): void {
    this.print();
    // this.getData();
    // this.printService.printHTML(this.printerName, printData);
  }
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
    frame.contentWindow.print();
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
  getData(): void {
    var data =
    {

      // type: 'html',
      // format: 'plain',
      // data: repHTML

    }
    if (data) {
      this.pdfData = data;
      let tempname = this.wareHouseList.filter(x=>x.id == this.WarehouseName);
      this.WarehouseName = this.WarehouseName + '-' + tempname[0].warehouseName;
      this.generatePDF();
    }
  }
  generatePDF(): void {
console.log(this.tempstockreturndetail);
    this.documentDefinition = {
      info: {
        // title: this.pdfData.title,

        creationDate: new Date(),
      },
      content: [
        {
          text: 'DETAILED STOCK RETURN',
          style: 'header',
          alignment: 'center'
        },
        {
        columns: [


          [

            {
              text: 'Showroom: ' + '\t' + this.user_details.storeCode+'-'+ this.user_details.storeName,
              bold: true,
              fontSize: 8,
            },
            { text: 'Run Date:' + '\t\t' + formatDate(Date(), 'dd-MM-yyyy', 'en'), fontSize: 8, bold: true },
            { text: 'To Warehouse: ' + '\t\t'+ this.WarehouseName, fontSize: 8, bold: true }

          ],
          [

            {
              text: `Return Date:` + '\t\t' + formatDate(this.DocumentDate, 'dd-MM-yyyy', 'en'),
              alignment: 'right',
              fontSize: 8
            },
            {
              text: 'Return No:' + '\t\t' + this.DocumentNo,
              alignment: 'right',
              fontSize: 8

            }



          ],

        ],
      },
  {
        table: {

          headerRows: 1,
          widths: ['*', '*', '*', '*', '*'],
          body: [
            ['SKUCode', 'SKUName', 'Quantity', 'Color', 'Size'],
           // ['888','hhh','hhh','uuu','uygg'],
             ...this.tempstockreturndetail.map(p => ([p.skuCode, p.skuName, p.quantity, p.color, p.size])),


            // [{text: 'Total Discount',alignment: 'right',bold:true, colSpan: 2},{},this.totalDiscount],
           // [{ text: 'Total ', alignment: 'right', bold: true, colSpan: 3 }, {}, this.totalqty],
          // [{ text: 'Remarks ', alignment: 'left', bold: true, colSpan: 2 }, {}, this.Remarks]

          ]


        }
      }
    ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          }
        },
        defaultStyle,

      // ],
      // {


    };
    // Generating the pdf
    this.generatedPDF = pdfMake.createPdf(this.documentDefinition);
    // This generated pdf buffer is used for the download, print and for viewing
    this.generatedPDF.getBuffer((buffer) => {
      this.pdfSrc = buffer;
    });
    // }
 //console.log(tempstockreturndetail);
  }






  /*warehousecode() {
    if (this.wareHouseList != null && this.wareHouseList.length > 0) {
      for (let warehouse of this.wareHouseList) {
        if (warehouse.id == this.myForm.get('toWareHouse').value) {
          this.warehouseCode = warehouse.warehouseCode;
          break;
        }
      }
    }
  }*/


  getQuantity() {
    let dis_totalamount: number = 0;
    for (let i = 0; i < this.stockreturnlist.length; i++) {
      dis_totalamount = dis_totalamount + parseInt(this.stockreturnlist[i].quantity.toString());
    }
    this.myForm.get('totalqty').setValue("Total : " + dis_totalamount);
    this.totalqty = dis_totalamount;
    this.myForm.get('stockqty').setValue("Total : " + 0);
  }
  getStockReturnDetails() {
    this.tempstockreturndetail = new Array<any>();
    this.common.showSpinner();
    this.api.getAPI("stockreturn?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.stockreturndetails = data.responseDynamicData;
            this.myForm.controls['documentNo'].setValue(data.responseDynamicData.documentNo);
            this.DocumentNo = data.responseDynamicData.documentNo;
            this.myForm.controls['documentDate'].setValue(this.common.toYMDFormat(new Date(data.responseDynamicData.documentDate)));
            this.DocumentDate = this.common.toYMDFormat(new Date(data.responseDynamicData.documentDate));
            this.myForm.controls['toWareHouse'].setValue(data.responseDynamicData.toWareHouseID);
            this.WarehouseName = data.responseDynamicData.toWareHouseID;
            this.myForm.controls['status'].setValue(data.responseDynamicData.status);
            this.myForm.controls['rem'].setValue(data.responseDynamicData.remarks);
            this.myForm.controls['totalqty'].setValue(data.responseDynamicData.totalQuantity);
            this.myForm.controls['group'].setValue(data.responseDynamicData.returnType);
            this.stockreturnlist = data.responseDynamicData.stockReturnDetailsList;
            this.tempstockreturndetail = this.stockreturnlist;
            this.getQuantity();
            this. getData();
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
  close() {
    this.router.navigate(['stockreturn']);
  }
}
