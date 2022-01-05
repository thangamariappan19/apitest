import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MVendorMaster } from 'src/app/models/m-vendor-master';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {
  vendorList: Array<MVendorMaster>;
  myForm: FormGroup;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
    });

    this.clear_controls();
  }

  clear_controls() {
    this.getVendorList();
  }

  getVendorList() {
    this.vendorList = null;
    this.common.showSpinner();
    this.api.getAPI("vendor")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.vendorList = data.responseDynamicData;
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
  }

}
