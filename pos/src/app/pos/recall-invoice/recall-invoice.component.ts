import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MDayClosing } from 'src/app/models/m-day-closing';

@Component({
  selector: 'app-recall-invoice',
  templateUrl: './recall-invoice.component.html',
  styleUrls: ['./recall-invoice.component.css']
})
export class RecallInvoiceComponent implements OnInit {
  json: Array<any>;
  jsonFilter: Array<any>;
  selectrecallinvoice: Array<any>;
  myForm: FormGroup;
  logedpos_details: MDayClosing = null;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    localStorage.setItem('pos_mode', 'true');
    let temp_pos: string = localStorage.getItem('pos_details');

    if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);
    }
    if (this.logedpos_details == null) {
      common.showMessage("warn", "Day-In / Shift-In Required");
      localStorage.setItem('pos_mode', 'true');
      // this.router.navigate(['home']);
      this.router.navigate(['day-in-out']);
    }

    this.createForm();
  }

  btn_back_click(){
    localStorage.setItem('pos_mode', 'true');
    this.router.navigate(['pos']);
  }

  createForm() {

    this.myForm = this.fb.group({
      sku_code: ['']
      // discount_value: [0],
      // current_discount_type: ['Percentage']
    });
    this.getHoldIvoice();
   // this.clear_controls();
  }

  clear_controls() {
    
  }

  getHoldIvoice() {
    this.json = null;
    let bdate = new Date(this.logedpos_details.businessDate);
    //this.country_list = null;
    this.common.showSpinner();
    // this.api.getAPI("HoldReSales?businessdate=2020-05-14")
    this.api.getAPI("HoldReSales?businessdate=" + this.common.toYMDFormat(bdate))
      .subscribe((data) => {
        setTimeout(() => {
         // .log(data);
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<MCountryMaster> ();
            //this.country_list = data.countryMasterList;
            this.json = data.invoiceHeaderList;
            this.jsonFilter = this.json;
           // .log(this.json);
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
  ngOnInit() {
    // localStorage.setItem('pos_mode', 'true');
  }
  getResale(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    this.selectrecallinvoice = null;
    //this.country_list = null;
    this.common.showSpinner();
    this.api.getAPI("HoldReSales?id=" + value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<MCountryMaster> ();
            //this.country_list = data.countryMasterList;
            this.selectrecallinvoice = data.invoiceDetailsList;
            localStorage.setItem('recall_invoice', JSON.stringify(this.selectrecallinvoice));
           // .log(this.selectrecallinvoice);
           localStorage.setItem('pos_from_home',"false");
            this.router.navigate(['pos']);
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
  Filter(){
    this.jsonFilter = this.json;
    var search = this.myForm.get('sku_code').value;
    if (search != null && search != "")
      this.jsonFilter = this.jsonFilter.filter(x => x.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      x.customerName.toLowerCase().includes(search.toLowerCase()) || 
      x.phoneNumber.toLowerCase().includes(search.toLowerCase()));
  }
  refresh(){
    this.jsonFilter=this.json;
    this.myForm.controls['sku_code'].setValue('');
  }
}


