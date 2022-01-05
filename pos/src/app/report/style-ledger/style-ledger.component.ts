import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { CommonService } from 'src/app/common.service';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MCardexLocationDetails } from "src/app/models/m-cardex-location-details";
import { Router } from '@angular/router';


@Component({
  selector: 'app-style-ledger',
  templateUrl: './style-ledger.component.html',
  styleUrls: ['./style-ledger.component.css']
})
export class StyleLedgerComponent implements OnInit {
  myForm: FormGroup;
  user_details: MUserDetails = null;
  mCardexLocationDetails: Array<MCardexLocationDetails>;
  searchstring: string;
  todate: string;
  fromdate: string;
  constructor(private api: ApiService,
    private confirm: ConfirmService,
    private common: CommonService,
    private fb: FormBuilder,
    public router: Router) {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      skucode: ['', Validators.required],
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
      balance: [''],
      totalOutQty: [''],
      totalInQty: ['']



    });
    this.mCardexLocationDetails = new Array<MCardexLocationDetails>();
  }
  ngOnInit(): void {

  }
  Get_click() {
    this.searchstring = this.myForm.get('skucode').value;
    this.todate = this.myForm.get('ToDate').value;
    this.fromdate = this.myForm.get('FromDate').value;
    this.common.showSpinner();
    this.api.getAPI("StyleLedger?Searchstring=" + this.searchstring + "&StoreID=" + this.user_details.storeID + "&FromDate=" + this.fromdate + "&ToDate=" + this.todate)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.mCardexLocationDetails = data.cardexLOcationData;
            console.log(data.cardexLOcationData);
            this.myForm.controls['totalInQty'].setValue(data.cardexLocationTotalData.totalInQty);
            this.myForm.controls['totalOutQty'].setValue(data.cardexLocationTotalData.totalOutQty);
            this.myForm.controls['balance'].setValue(data.cardexLocationTotalData.totalBalance);

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
  clear_controls() {
    this.createForm();
  }

}
