import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MVendorGroup } from 'src/app/models/m-vendor-group';

@Component({
  selector: 'app-vendor-group-add',
  templateUrl: './vendor-group-add.component.html',
  styleUrls: ['./vendor-group-add.component.css']
})
export class VendorGroupAddComponent implements OnInit {
  myForm: FormGroup;
  vendorGroup: MVendorGroup;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb:FormBuilder,
    private confirm: ConfirmService,
    public router:Router
  ) {this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      vendorGroupCode: ['', Validators.required],
      vendorGroupName: ['', Validators.required],
      remarks: [''],
      active:[false]
  
    });
    this.vendorGroup = new MVendorGroup();
    this.clear_controls();
  }
  clear_controls(){
    this.myForm.controls['vendorGroupCode'].setValue('');
    this.myForm.controls['vendorGroupName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }
  addVendorGroup(){
    if (this.vendorGroup == null) {
      this.common.showMessage("warn", "Can not Save, Vendor Group are invalid.");
    }  else {
      this.vendorGroup.id = 0;
      this.vendorGroup.vendorGroupCode = this.myForm.get('vendorGroupCode').value;
      this.vendorGroup.vendorGroupName = this.myForm.get('vendorGroupName').value;      
      this.vendorGroup.remarks = this.myForm.get('remarks').value;
      this.vendorGroup.active = this.myForm.get('active').value;      
     // .log(this.vendorGroup);
      this.common.showSpinner();
      this.api.postAPI("vendorgroup", this.vendorGroup).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  close(){
    this.router.navigate(['vendor-group']);
  }
}
