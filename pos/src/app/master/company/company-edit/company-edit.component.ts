import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCompanyMaster } from 'src/app/models/m-company-master';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.css']
})
export class CompanyEditComponent implements OnInit {
  myForm: FormGroup;
  json: Array<any>;
  country_list: Array<any>;
  countryCode: string;
  company: MCompanyMaster;
  id: any;
  company_list: Array<any>;
  companyCode: string;
  companyName: string;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
    this.getCountryList();
  }

  createForm() {

    this.myForm = this.fb.group({
      // sku_code: [''],
      // discount_value: [0],
      // current_discount_type: ['Percentage']
      //order_status: ['', Validators.required],
      companyCode: ['', Validators.required],
      companyName: ['', Validators.required],
      countryID:  ['', Validators.required],
      address: [''],
      remarks: [''],
      active: [false]
    });
    this.clear_controls();
  }

  clear_controls() {
    // this.getCountryList();
    this.company = new MCompanyMaster();
  }

  getCountryList() {
    return new Promise((resolve, reject) => {
    this.json = null;
    // this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
      //  setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.json = data.countryMasterList;
            resolve(data.countryMasterList);
           // this.json = this.json.filter(x => x.active == true);
           // .log(this.json);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
           // this.common.showMessage('warn', msg);
           reject(msg);
          }
        //   this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
    });
  }

  ngOnInit() {
    this.retrieveData();
    this.getCountryList()
    .then((Country) => {
    }).catch((err) => {
      this.common.showMessage('warn', err);
      this.common.hideSpinner();
    });
  }

  retrieveData(){
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.company_list = null;
    this.common.showSpinner();
    this.api.getAPI("company?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['companyCode'].setValue(data.companySettings.companyCode);
            this.myForm.controls['companyName'].setValue(data.companySettings.companyName);
            this.myForm.controls['address'].setValue(data.companySettings.address);
            this.myForm.controls['countryID'].setValue(data.companySettings.countrySettingID);
            this.myForm.controls['remarks'].setValue(data.companySettings.remarks);
            this.myForm.controls['active'].setValue(data.companySettings.active);
            this.countryCode = data.companySettings.countrySettingCode;

           // .log(this.company_list);
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

  update_company() {
    if (this.company == null) {
      this.common.showMessage("warn", "Can not Save, Company data is invalid.");
    } else {
      this.company.id = this.id;
      this.company.companyCode = this.myForm.get('companyCode').value;
      this.company.companyName = this.myForm.get('companyName').value;
      this.company.countrySettingID = this.myForm.get('countryID').value;
      this.company.address = this.myForm.get('address').value;
      //let text = event.target.options[event.target.options.selectedIndex].text;
      //this.company.countrySettingID=this.myForm.get('countryName').value;
      this.company.active = this.myForm.get('active').value;
      this.company.remarks = this.myForm.get('remarks').value;
      this.company.countrySettingCode = this.countryCode;


     // .log(this.company);
      this.common.showSpinner();
      this.api.putAPI("company", this.company).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['Company']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }

  countrycode() {
    if (this.json != null && this.json.length > 0) {
      for (let country of this.json) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
  }

  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['Company']);
    }  
    } 
    else
    {
      this.router.navigate(['Company']);
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
