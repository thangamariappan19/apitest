import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MWarehouseMaster } from 'src/app/models/m-warehouse-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCountryMaster } from 'src/app/models/m-country-master';
import { MCompanyMaster } from 'src/app/models/m-company-master';
import { MWarehouseType } from 'src/app/models/m-warehouse-type';

@Component({
  selector: 'app-warehouse-add',
  templateUrl: './warehouse-add.component.html',
  styleUrls: ['./warehouse-add.component.css']
})
export class WarehouseAddComponent implements OnInit {
  myForm: FormGroup;
  json: Array<any>;
  country_list: Array<MCountryMaster>;
  countryCode: string;
  company_list: Array<MCompanyMaster>;
  companyCode: string;
  warehousetype_list: Array<MWarehouseType>;
  warehousetypeCode: string;
  warehouse: MWarehouseMaster;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) { this.createForm(); }

  createForm() {

    this.myForm = this.fb.group({
      warehouseCode: ['', Validators.required],
      warehouseName: ['', Validators.required],
      countryID: ['', Validators.required],
      companyID: ['', Validators.required],
      type: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.getCountryList();
    //this.getcompanyList();
    this.getWarehouseTypeList();
    this.warehouse = new MWarehouseMaster();
    this.clear_controls();
  }

  clear_controls() {

    this.myForm.controls['warehouseCode'].setValue('');
    this.myForm.controls['warehouseName'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.company_list=null;
    this.myForm.controls['companyID'].setValue('');
    this.myForm.controls['type'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);

  }

  getCountryList() {
    this.country_list = null;
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.country_list = data.countryMasterList;
            //this.country_list = this.country_list.filter(x => x.active == true);
            
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

  getcompanyList() {
    this.company_list = null;
    this.common.showSpinner();
    this.api.getAPI("CompanyMasterLookUP?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.company_list = data.companySettingsList;
            //this.company_list = this.company_list.filter(x => x.active == true);
            
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

  getWarehouseTypeList() {
    this.warehousetype_list = null;
    this.common.showSpinner();
    this.api.getAPI("WarehouseTypeMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.warehousetype_list = data.warehouseTypeMasterList;
           // this.warehousetype_list = this.warehousetype_list.filter(x => x.active == true);
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

  countrycode_Change() {
    this.myForm.controls['companyID'].setValue('');
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          this.getcompanyList();
          break;
        }
      }
    }
    
  }


  companycode_Change() {
    if (this.company_list != null && this.company_list.length > 0) {
      for (let company of this.company_list) {
        if (company.id == this.myForm.get('companyID').value) {
          this.companyCode = company.companyCode;
          break;
        }
      }
    }
  }


  warehousetypecode_Change() {
    if (this.warehousetype_list != null && this.warehousetype_list.length > 0) {
      for (let warehousetype of this.warehousetype_list) {
        if (warehousetype.id == this.myForm.get('type').value) {
          this.warehousetypeCode = warehousetype.warehouseTypeCode;
          break;
        }
      }
    }
  }


  quickadd_warehouse() {
    if (this.warehouse == null) {
      this.common.showMessage("warn", "Can not Save, Warehouse Data is invalid.");
    } else {
      this.warehouse.id = 0;
      this.warehouse.warehouseCode = this.myForm.get('warehouseCode').value;
      this.warehouse.warehouseName = this.myForm.get('warehouseName').value;
      this.warehouse.countryID = this.myForm.get('countryID').value;
      this.warehouse.countryCode = this.countryCode;
      this.warehouse.companyID = this.myForm.get('companyID').value;
      this.warehouse.companyCode = this.companyCode;
      this.warehouse.warehousetypeID = this.myForm.get('type').value;
      this.warehouse.warehousetypeCode = this.warehousetypeCode;
      this.warehouse.remarks = this.myForm.get('remarks').value;
      this.warehouse.active = this.myForm.get('active').value;
     
     


     // .log(this.warehouse);
      this.common.showSpinner();
      this.api.postAPI("warehouse", this.warehouse).subscribe((data) => {
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

  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['warehouse']);
    }  
    } 
    else
    {
      this.router.navigate(['warehouse']);
  }
    }
  restrictSpecialChars(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) 
      || (k > 96 && k < 123) 
      || k == 8 
      || k == 32 
      // || k == 45 
      // || k == 47
      // || k == 95
      || (k >= 48 && k <= 57));
  }

}

