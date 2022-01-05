import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MReasonMaster } from 'src/app/models/m-reason-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-reason-add',
  templateUrl: './reason-add.component.html',
  styleUrls: ['./reason-add.component.css']
})
export class ReasonAddComponent implements OnInit {

  myForm: FormGroup;
  reason: MReasonMaster;

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
      reasonCode: ['', Validators.required],
      reasonName: ['', Validators.required],
      description: [''],
      active:[false]
  
    });
    this.getStaticValues();
    this.clear_controls();
  }
  clear_controls(){
    this.reason = new MReasonMaster();
    this.myForm.controls['reasonCode'].setValue('');
    this.myForm.controls['reasonName'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  ngOnInit() {
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
  addReason(){
    if (this.reason == null) {
      this.common.showMessage("warn", "Can not Save, Reason Details are invalid.");
    }  else {
      this.reason.reasonID = 0;
      this.reason.reasoncode = this.myForm.get('reasonCode').value;
      this.reason.reasonname = this.myForm.get('reasonName').value;
      this.reason.description = this.myForm.get('description').value;
      this.reason.active = this.myForm.get('active').value;  
      this.reason.createBy = this.userid;    
     // .log(this.reason);
      this.common.showSpinner();
      this.api.postAPI("reason", this.reason).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Reason saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['reason']);
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
        this.router.navigate(['reason']);
          }  
        } 
      else
        {
          this.router.navigate(['reason']);
        }
  }
}
