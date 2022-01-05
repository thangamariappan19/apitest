import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MDivisionMaster } from 'src/app/models/m-division-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-division-edit',
  templateUrl: './division-edit.component.html',
  styleUrls: ['./division-edit.component.css']
})
export class DivisionEditComponent implements OnInit {
  myForm: FormGroup;
  division: MDivisionMaster;
  id : any;

  user_details: MUserDetails = null;
  userid:number;
  
  constructor(
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router ,
    private activatedRoute:ActivatedRoute
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
    this.getDivision();
  }
  getDivision(){
    this.common.showSpinner();
    this.api.getAPI("division?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['divisionCode'].setValue(data.divisionRecord.divisionCode);
            this.myForm.controls['divisionName'].setValue(data.divisionRecord.divisionName);
            this.myForm.controls['remarks'].setValue(data.divisionRecord.remarks);
            this.myForm.controls['active'].setValue(data.divisionRecord.active);
            //.log(this.company_list);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  updateDivision(){
    if (this.division == null) {
      this.common.showMessage("warn", "Can not Save, Language Details are invalid.");
    }  else {
      this.division.id = this.id;
      this.division.divisionCode = this.myForm.get('divisionCode').value;
      this.division.divisionName = this.myForm.get('divisionName').value;
      this.division.remarks = this.myForm.get('remarks').value;
      this.division.active = this.myForm.get('active').value;
      this.division.updateBy=this.userid;     
     // .log(this.division);
      this.common.showSpinner();
      this.api.putAPI("division", this.division).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['division']);
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
