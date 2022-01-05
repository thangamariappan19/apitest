import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MYearMaster } from 'src/app/models/m-year-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-year-edit',
  templateUrl: './year-edit.component.html',
  styleUrls: ['./year-edit.component.css']
})
export class YearEditComponent implements OnInit {
  
  myForm: FormGroup;
  year: MYearMaster;
  id: any;

  user_details: MUserDetails = null;
  userid:number;

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
      yearCode: ['', Validators.required],
      yearName: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.getStaticValues();
    this.clear_controls();
  }

  clear_controls() {
    this.year = new MYearMaster();
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
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getYearList();
  }
  getYearList() {
    this.common.showSpinner();
    this.api.getAPI("year?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['yearCode'].setValue(data.yearRecord.yearCode);
            this.myForm.controls['yearName'].setValue(data.yearRecord.year);
            this.myForm.controls['remarks'].setValue(data.yearRecord.remarks);
            this.myForm.controls['active'].setValue(data.yearRecord.active);

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
  update_year() {
    if (this.year == null) {
      this.common.showMessage("warn", "Can not Save, Year is invalid.");
    } else {
      this.year.id = this.id;
      this.year.yearCode = this.myForm.get('yearCode').value;
      this.year.year = this.myForm.get('yearName').value;
      this.year.active = this.myForm.get('active').value;
      this.year.remarks = this.myForm.get('remarks').value;
      this.year.updateBy = this.userid;

     // .log(this.year);
      this.common.showSpinner();
      this.api.putAPI("year", this.year).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Year saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          this.router.navigate(['year']);
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
        this.router.navigate(['year']);
          }  
        } 
      else
        {
          this.router.navigate(['year']);
        }
  }
}