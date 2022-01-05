import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MStyleStatus } from 'src/app/models/m-style-status';

@Component({
  selector: 'app-style-status-add',
  templateUrl: './style-status-add.component.html',
  styleUrls: ['./style-status-add.component.css']
})
export class StyleStatusAddComponent implements OnInit {
  myForm: FormGroup;
  styleStatus: MStyleStatus;
  constructor(private api: ApiService,
    private common: CommonService,
    private fb:FormBuilder,
    private confirm: ConfirmService,
    public router:Router
  ) {this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      styleStatusCode: ['', Validators.required],
      styleStatusName: ['', Validators.required],
      remarks: [''],
      active:[true]
  
    });
    this.clear_controls();
  }
  clear_controls(){
    this.styleStatus = new MStyleStatus();
    this.myForm.controls['styleStatusCode'].setValue('');
    this.myForm.controls['styleStatusName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }

  addStyleStatus(){
    if (this.styleStatus == null) {
      this.common.showMessage("warn", "Can not Save, Style Status are invalid.");
    }  else {
      this.styleStatus.id = 0;
      this.styleStatus.styleStatusCode = this.myForm.get('styleStatusCode').value;
      this.styleStatus.statusName = this.myForm.get('styleStatusName').value;      
      this.styleStatus.remarks = this.myForm.get('remarks').value;
      this.styleStatus.active = this.myForm.get('active').value;      
     // .log(this.styleStatus);
      this.common.showSpinner();
      this.api.postAPI("stylestatus", this.styleStatus).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', 'Style Status saved successfully.');
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
        this.router.navigate(['style-status']);
    }  
    } 
    else
    {
      this.router.navigate(['style-status']);
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
