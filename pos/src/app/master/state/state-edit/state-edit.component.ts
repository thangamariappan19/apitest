import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MStateMaster } from 'src/app/models/m-state-master';

@Component({
  selector: 'app-state-edit',
  templateUrl: './state-edit.component.html',
  styleUrls: ['./state-edit.component.css']
})
export class StateEditComponent implements OnInit {
  myForm: FormGroup;
  countryList: Array<any>;
  state: MStateMaster;
  countryName: any;
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
      stateCode: ['', Validators.required],
      stateName: ['', Validators.required],
      countryID: ['', Validators.required],
      remarks: [''],
      active: [false]

    });
    this.clear_controls();
  }
  clear_controls() {
    this.getCountry();
    this.state = new MStateMaster();
  }
  getCountry() {
    return new Promise((resolve, reject) => {
    this.countryList = null;
   // this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
      //  setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // this.countryList = data.countryMasterList;
            //// .log(this.countryList);          
            this.countryList = data.countryMasterList;
            resolve(data.countryMasterList);
            //this.countryList = this.countryList.filter(x => x.active == true);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            //this.common.showMessage('warn', msg);
            reject(msg);
          }
        //   this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
    });
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStateList();
    this.getCountry()
    .then((Country) => {
    }).catch((err) => {
      this.common.showMessage('warn', err);
      this.common.hideSpinner();
    });

  }
  getStateList() {
    this.common.showSpinner();
    this.api.getAPI("state?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['stateCode'].setValue(data.stateMasterRecord.stateCode);
            this.myForm.controls['stateName'].setValue(data.stateMasterRecord.stateName);
            this.myForm.controls['countryID'].setValue(data.stateMasterRecord.countryID);
            this.myForm.controls['remarks'].setValue(data.stateMasterRecord.remarks);
            this.myForm.controls['active'].setValue(data.stateMasterRecord.active);
            this.countryName = data.stateMasterRecord.countryName;

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
  getcountryName() {
    if (this.countryList != null && this.countryList.length > 0) {
      for (let country of this.countryList) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryName = country.countryName;
          break;
        }
      }
    }
  }
  updateState() {
    if (this.state == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else {
      this.state.id = this.id;
      this.state.stateCode = this.myForm.get('stateCode').value;
      this.state.stateName = this.myForm.get('stateName').value;
      this.state.countryName = this.countryName;
      this.state.countryID = this.myForm.get('countryID').value;
      this.state.remarks = this.myForm.get('remarks').value;
      this.state.active = this.myForm.get('active').value;
     // .log(this.state);
      this.common.showSpinner();
      this.api.putAPI("state", this.state).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['state']);
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
