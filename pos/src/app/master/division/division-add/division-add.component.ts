import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MDivisionMaster } from 'src/app/models/m-division-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-division-add',
  templateUrl: './division-add.component.html',
  styleUrls: ['./division-add.component.css']
})
export class DivisionAddComponent implements OnInit {
  myForm: FormGroup;
  division: MDivisionMaster;

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
      divisionCode: ['', Validators.required],
      divisionName: ['', Validators.required],
      remarks: [''],
      active:[false]
  
    });
    this.getStaticValues();
    this.clear_controls();
  }
  clear_controls(){
    this.division = new MDivisionMaster();
    this.myForm.controls['divisionCode'].setValue('');
    this.myForm.controls['divisionName'].setValue('');
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
  ngOnInit() {
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
  addDivision(){
    if (this.division == null) {
      this.common.showMessage("warn", "Can not Save, Division Details are invalid.");
    }  else {
      this.division.id = 0;
      this.division.divisionCode = this.myForm.get('divisionCode').value;
      this.division.divisionName = this.myForm.get('divisionName').value;
      this.division.remarks = this.myForm.get('remarks').value;
      this.division.active = this.myForm.get('active').value;
      this.division.createBy=this.userid;     
     // .log(this.division);
      this.common.showSpinner();
      this.api.postAPI("division", this.division).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['division']);
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
        this.router.navigate(['division']);
          }  
        } 
      else
        {
          this.router.navigate(['division']);
        }
  }
}
