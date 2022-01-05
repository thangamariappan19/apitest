import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MYearMaster } from 'src/app/models/m-year-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-year-add',
  templateUrl: './year-add.component.html',
  styleUrls: ['./year-add.component.css']
})
export class YearAddComponent implements OnInit {

  myForm: FormGroup;
  year: MYearMaster;

  user_details: MUserDetails = null;
  userid:number;

  constructor(
    private api: ApiService,
      private common: CommonService,
      private fb:FormBuilder,
      private confirm: ConfirmService,
      public router:Router
  ) {
    this.createForm();
   }

   createForm() {
    this.myForm = this.fb.group({
      yearCode: ['', Validators.required],
      yearName: ['', Validators.required],
      remarks: [''],
      active:[false]
  
    });
    this.getStaticValues();
    this.clear_controls();
  }
  clear_controls(){
    this.year = new MYearMaster();
    this.myForm.controls['yearCode'].setValue('');
    this.myForm.controls['yearName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;      
    }
  }
  restrictSpecialChars(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      || (k >= 48 && k <= 57));
  }
  ngOnInit() {
  }

  addYear(){
    if (this.year == null) {
      this.common.showMessage("warn", "Can not Save, Year Details are invalid.");
    }  else {
      this.year.id = 0;
      this.year.yearCode = this.myForm.get('yearCode').value;
      this.year.year = this.myForm.get('yearName').value;
      this.year.remarks = this.myForm.get('remarks').value;
      this.year.active = this.myForm.get('active').value;
      this.year.createBy = this.userid;      
     // .log(this.year);
      this.common.showSpinner();
      this.api.postAPI("year", this.year).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Year saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['year']);
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
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['year']);
          }  
        } 
      else
        {
          this.router.navigate(['year']);
        }
  }
}
