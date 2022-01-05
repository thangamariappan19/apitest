import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCityMaster } from 'src/app/models/m-city-master';

declare var jQuery: any;
@Component({
  selector: 'app-city-add',
  templateUrl: './city-add.component.html',
  styleUrls: ['./city-add.component.css']
})
export class CityAddComponent implements OnInit {

  myForm: FormGroup;
  country_list :Array<any>;
  city: MCityMaster;
  state_List :Array<any>;
  stateName: string;
  countryCode:string;
  state_Code: string;
  state_name: string;
  constructor( 
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router)
     {   
         this.createForm();
     }

  createForm() {

    this.myForm = this.fb.group({
      cityCode: ['', Validators.required],
      cityName: ['', Validators.required],
      countryID: ['', Validators.required],
      remarks: [''],
      stateID: ['', Validators.required],
      active: [true]
    });
   this.clear_controls();
   this.city = new MCityMaster();
  }
  clear_controls() {
  
   
    this.myForm.controls['cityCode'].setValue('');
    this.myForm.controls['cityName'].setValue('');
    this.myForm.controls['stateID'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.getCountryList();
    this.state_List = null;
  }
  getCountryList() {
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.country_list = data.countryMasterList;
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

  countrycode() {
    this.state_List = null;
    this.myForm.controls['stateID'].setValue('');
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          this.getStateList();
          break;
        }
      }
    }
    
  }
  

  statecode() {
    if (this.state_List != null && this.state_List.length > 0) {
      for (let state of this.state_List) {
        if (state.id == this.myForm.get('stateID').value) {
          this.state_Code = state.stateCode;
          this.state_name = state.stateName;
          break;
        }
      }
    }
  }
  getStateList() {
    let countid = this.myForm.get('countryID').value
      if(countid !=null && countid !=""){
    this.common.showSpinner();
    this.state_List = null;
    this.api.getAPI("StateMasterLookUp?countryid=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.state_List = data.stateMasterList;
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
  }
  addCity() {
    if (this.city == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else {
      this.city.id = 0;
      this.city.cityCode = this.myForm.get('cityCode').value;
      this.city.cityName = this.myForm.get('cityName').value;
      this.city.stateName = this.state_name;
      this.city.countryID = this.myForm.get('countryID').value;
      this.city.stateID = this.myForm.get('stateID').value;
      this.city.remarks = this.myForm.get('remarks').value;
      this.city.active = this.myForm.get('active').value;
    
      this.common.showSpinner();
      this.api.postAPI("CityMaster", this.city).subscribe((data) => {
       // .log(data);
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

  ngOnInit() {
  }
  
  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['city']);
    }  
    } 
    else
    {
      this.router.navigate(['city']);
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
