import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MVendorGroup } from 'src/app/models/m-vendor-group';

@Component({
  selector: 'app-vendor-group-edit',
  templateUrl: './vendor-group-edit.component.html',
  styleUrls: ['./vendor-group-edit.component.css']
})
export class VendorGroupEditComponent implements OnInit {
  myForm: FormGroup;
  vendorGroup: MVendorGroup;
  id: any;
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
      vendorGroupCode: ['', Validators.required],
      vendorGroupName: ['', Validators.required],
      remarks: [''],
      active: [false]

    });
    this.clear_controls();
  }
  clear_controls() {
    this.vendorGroup = new MVendorGroup();

  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getVendorGroupData();
  }
  getVendorGroupData() {
    this.common.showSpinner();
    this.api.getAPI("vendorgroup?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['vendorGroupCode'].setValue(data.vendorGroupRecord.vendorGroupCode);
            this.myForm.controls['vendorGroupName'].setValue(data.vendorGroupRecord.vendorGroupName);
            this.myForm.controls['remarks'].setValue(data.vendorGroupRecord.remarks);
            this.myForm.controls['active'].setValue(data.vendorGroupRecord.active);

            //.log(this.company_list);
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

  updateVendorGroup() {
    if (this.vendorGroup == null) {
      this.common.showMessage("warn", "Can not Update, Vendor Group are invalid.");
    } else {
      this.vendorGroup.id = this.id;
      this.vendorGroup.vendorGroupCode = this.myForm.get('vendorGroupCode').value;
      this.vendorGroup.vendorGroupName = this.myForm.get('vendorGroupName').value;
      this.vendorGroup.remarks = this.myForm.get('remarks').value;
      this.vendorGroup.active = this.myForm.get('active').value;
     // .log(this.vendorGroup);
      this.common.showSpinner();
      this.api.putAPI("vendorgroup", this.vendorGroup).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.close();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Update.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  close() {
    this.router.navigate(['vendor-group']);
  }
}
