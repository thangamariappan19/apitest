import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MStateMaster } from 'src/app/models/m-state-master';
import { MCountryMaster } from 'src/app/models/m-country-master';

@Component({
  selector: 'app-state-add',
  templateUrl: './state-add.component.html',
  styleUrls: ['./state-add.component.css']
})
export class StateAddComponent implements OnInit {
  myForm: FormGroup;
  countryList: Array<MCountryMaster>;
  state: MStateMaster;
  countryName: any;
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
      stateCode: ['', Validators.required],
      stateName: ['', Validators.required],
      countryID: ['', Validators.required],
      remarks: [''],
      active: [true]

    });
    this.clear_controls();
    this.getCountry();
    this.state = new MStateMaster();
  }
  clear_controls() {
    this.myForm.controls['stateCode'].setValue('');
    this.myForm.controls['stateName'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.countryName = '';
  }
  getCountry() {
    this.countryList = null;
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
           // this.countryList = this.countryList.filter(x => x.active == true);
            //// .log(this.countryList);
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
    if (this.countryList != null && this.countryList.length > 0) {
      for (let country of this.countryList) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryName = country.countryName;
          break;
        }
      }
    }
  }
  addState() {
    if (this.state == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else {
      this.state.id = 0;
      this.state.stateCode = this.myForm.get('stateCode').value;
      this.state.stateName = this.myForm.get('stateName').value;
      this.state.countryName = this.countryName;
      this.state.countryID = this.myForm.get('countryID').value;
      this.state.remarks = this.myForm.get('remarks').value;
      this.state.active = this.myForm.get('active').value;
     // .log(this.state);
      this.common.showSpinner();
      this.api.postAPI("state", this.state).subscribe((data) => {
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
        this.router.navigate(['state']);
    }  
    } 
    else
    {
      this.router.navigate(['state']);
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
