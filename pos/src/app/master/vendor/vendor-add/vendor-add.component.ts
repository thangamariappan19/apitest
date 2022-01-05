import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MVendorMaster } from 'src/app/models/m-vendor-master';

@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.css']
})
export class VendorAddComponent implements OnInit {
  myForm: FormGroup;
  vendor: MVendorMaster;
  vendorGroupList: Array<any>;
  countryList: Array<any>;
  companyList: Array<any>;
  vendorGroup_Name: string;
  country_Name: string;
  company_Name: string;
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
      vendorCode: ['', Validators.required],
      vendorName: ['', Validators.required],
      shortName: [''],
      address: [''],
      email: [''],
      phoneNumber: [''],
      vendorGroupID: [0],
      countryID: [0],
      companyID: [0],
      remarks: [''],
      active: [true]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.vendor = new MVendorMaster();
    this.myForm.controls['vendorCode'].setValue('');
    this.myForm.controls['vendorName'].setValue('');
    this.myForm.controls['shortName'].setValue('');
    this.myForm.controls['address'].setValue('');
    this.myForm.controls['email'].setValue('');
    this.myForm.controls['phoneNumber'].setValue('');
    this.myForm.controls['vendorGroupID'].setValue(0);
    this.myForm.controls['countryID'].setValue(0);
    this.myForm.controls['companyID'].setValue(0);
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);

    this.getCountryList();
    this.getVendorGroup();
  }
  getCountryList() {
    this.countryList = null;
    this.common.showSpinner();
    this.api.getAPI("country")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
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

  getVendorGroup() {
    this.vendorGroupList = null;
    this.common.showSpinner();
    this.api.getAPI("vendorgrouplookup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.vendorGroupList = data.vendorGroupList;
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

  vendorgroupcode() {
    if (this.vendorGroupList != null && this.vendorGroupList.length > 0) {
      for (let vendorGroup of this.vendorGroupList) {
        if (vendorGroup.id == this.myForm.get('vendorGroupID').value) {
          this.vendorGroup_Name = vendorGroup.vendorGroupName;
          break;
        }
      }
    }
  }

  countrycode() {
    if (this.countryList != null && this.countryList.length > 0) {
      for (let country of this.countryList) {
        if (country.id == this.myForm.get('countryID').value) {
          this.country_Name = country.countryName;
          break;
        }
      }
    }
    this.getCompanyList();
  }

  getCompanyList() {
    this.companyList = null;
    this.common.showSpinner();
    this.api.getAPI("CompanyLookUp?CountryID=" + this.myForm.controls['countryID'].value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.companyList = data.companySettingsList;
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

  companycode() {
    if (this.companyList != null && this.companyList.length > 0) {
      for (let company of this.companyList) {
        if (company.id == this.myForm.get('companyID').value) {
          this.company_Name = company.companyName;
          break;
        }
      }
    }
  }

  addVendor() {
    if (this.vendor == null) {
      this.common.showMessage("warn", "Can not Save, Vendor Details are invalid.");
    } else {
      this.vendor.id = 0;
      this.vendor.vendorCode = this.myForm.get('vendorCode').value;
      this.vendor.vendorName = this.myForm.get('vendorName').value;
      this.vendor.shortName = this.myForm.get('shortName').value;
      this.vendor.phoneNumber = this.myForm.get('phoneNumber').value;
      this.vendor.countryID = this.myForm.get('countryID').value;
      this.vendor.companyID = this.myForm.get('companyID').value;
      this.vendor.vendorGroupID = this.myForm.get('vendorGroupID').value;
      this.vendor.address = this.myForm.get('address').value;
      this.vendor.emailID = this.myForm.get('email').value;
      this.vendor.countryName = this.country_Name;
      this.vendor.companyName = this.company_Name;
      this.vendor.vendorGroupName = this.vendorGroup_Name;
      this.vendor.remarks = this.myForm.get('remarks').value;
      this.vendor.active = this.myForm.get('active').value;

      this.common.showSpinner();
      this.api.postAPI("vendor", this.vendor).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', 'Vendor saved successfully.');
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

  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['vendor']);
      }
    }
    else {
      this.router.navigate(['vendor']);
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
