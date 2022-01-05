import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MReasonMaster } from 'src/app/models/m-reason-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-reason-edit',
  templateUrl: './reason-edit.component.html',
  styleUrls: ['./reason-edit.component.css']
})
export class ReasonEditComponent implements OnInit {

  myForm: FormGroup;
  reason: MReasonMaster;
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
      reasonCode: ['', Validators.required],
      reasonName: ['', Validators.required],
      description: [''],
      active: [false]
    });
    this.getStaticValues();
    this.clear_controls();
  }

  clear_controls() {
    this.reason = new MReasonMaster();
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getReasonList();
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
  getReasonList() {
    this.common.showSpinner();
    this.api.getAPI("reason?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['reasonCode'].setValue(data.reasonMasterRecord.reasonCode);
            this.myForm.controls['reasonName'].setValue(data.reasonMasterRecord.reasonName);
            this.myForm.controls['description'].setValue(data.reasonMasterRecord.description);
            this.myForm.controls['active'].setValue(data.reasonMasterRecord.active);

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
  update_reason() {
    if (this.reason == null) {
      this.common.showMessage("warn", "Can not Save, Reason is invalid.");
    } else {
      this.reason.reasonID = this.id;
      this.reason.reasoncode = this.myForm.get('reasonCode').value;
      this.reason.reasonname = this.myForm.get('reasonName').value;
      this.reason.description = this.myForm.get('description').value;
      this.reason.active = this.myForm.get('active').value;
      this.reason.updateBy = this.userid;

     // .log(this.reason);
      this.common.showSpinner();
      this.api.putAPI("reason", this.reason).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Reason saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          this.router.navigate(['reason']);
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
        this.router.navigate(['reason']);
          }  
        } 
      else
        {
          this.router.navigate(['reason']);
        }
  }
}
