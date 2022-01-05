import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCompanyMaster } from 'src/app/models/m-company-master';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.css']
})
export class CompanyAddComponent implements OnInit {
  myForm: FormGroup;
  json: Array<any>;
  country_list: Array<any>;
  countryCode: string;
  company: MCompanyMaster;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) { this.createForm(); }
  createForm() {

    this.myForm = this.fb.group({
      companyCode: ['', Validators.required],
      companyName: ['', Validators.required],
      countryID: ['', Validators.required],
      address: [''],
      remarks: [''],
      active: [false]
    });
    this.getCountryList();
    this.company = new MCompanyMaster();
    this.clear_controls();
  }
  clear_controls() {

    this.myForm.controls['companyCode'].setValue('');
    this.myForm.controls['companyName'].setValue('');
    this.myForm.controls['address'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  getCountryList() {
    this.json = null;
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.json = data.countryMasterList;
           // this.json = this.json.filter(x => x.active == true);
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


  quickadd_company() {
    if (this.company == null) {
      this.common.showMessage("warn", "Can not Save, Company Data is invalid.");
    } else {
      this.company.id = 0;
      this.company.companyCode = this.myForm.get('companyCode').value;
      this.company.companyName = this.myForm.get('companyName').value;
      this.company.countrySettingID = this.myForm.get('countryID').value;
      this.company.address = this.myForm.get('address').value;
      //let text = event.target.options[event.target.options.selectedIndex].text;
      //this.company.countrySettingID=this.myForm.get('countryName').
      this.company.active = this.myForm.get('active').value;
      this.company.remarks = this.myForm.get('remarks').value;
      this.company.countrySettingCode = this.countryCode;


     // .log(this.company);
      this.common.showSpinner();
      this.api.postAPI("company", this.company).subscribe((data) => {
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
