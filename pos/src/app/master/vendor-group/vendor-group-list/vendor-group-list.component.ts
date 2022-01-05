import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MVendorGroup } from 'src/app/models/m-vendor-group';

@Component({
  selector: 'app-vendor-group-list',
  templateUrl: './vendor-group-list.component.html',
  styleUrls: ['./vendor-group-list.component.css']
})
export class VendorGroupListComponent implements OnInit {
  vendorGroupList: Array<MVendorGroup>;
  vendorGroupList_Filter: Array<MVendorGroup>;
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
      vendorGroupCode: [''],
      vendorGroupName: [''],
      remarks: ['']
    });
    this.getDesignationList();
    this.clear_controls();
  }

  clear_controls() {
    // this.getDesignationList();
    this.myForm.controls['vendorGroupCode'].setValue('');
    this.myForm.controls['vendorGroupName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.vendorGroupList_Filter = this.vendorGroupList;
  }

  getDesignationList() {

    this.vendorGroupList = null;
    this.common.showSpinner();
    this.api.getAPI("vendorgroup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.vendorGroupList = data.responseDynamicData;
            this.vendorGroupList_Filter = this.vendorGroupList;
            // this.json = data.countryMasterList;
            //// .log(this.json);
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
  filter() {
    let vendorGroupCode = this.myForm.get('vendorGroupCode').value;
    let vendorGroupName = this.myForm.get('vendorGroupName').value;
    let remarks = this.myForm.get('remarks').value;

    this.vendorGroupList_Filter = this.vendorGroupList;

    if (vendorGroupCode != null && vendorGroupCode != "")
      this.vendorGroupList_Filter = this.vendorGroupList_Filter.filter(x => x.vendorGroupCode.toLowerCase().includes(vendorGroupCode.toLowerCase()));

    if (vendorGroupName != null && vendorGroupName != "")
      this.vendorGroupList_Filter = this.vendorGroupList_Filter.filter(x => x.vendorGroupName.toLowerCase().includes(vendorGroupName.toLowerCase()));

    if (remarks != null && remarks != "")
      this.vendorGroupList_Filter = this.vendorGroupList_Filter.filter(x => x.remarks.toLowerCase().includes(remarks.toLowerCase()));
  }
}
