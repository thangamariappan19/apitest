import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MStyleStatus } from 'src/app/models/m-style-status';

@Component({
  selector: 'app-style-status-edit',
  templateUrl: './style-status-edit.component.html',
  styleUrls: ['./style-status-edit.component.css']
})
export class StyleStatusEditComponent implements OnInit {
  myForm: FormGroup;
  styleStatus: MStyleStatus;
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
      styleStatusCode: ['', Validators.required],
      styleStatusName: ['', Validators.required],
      remarks: [''],
      active: [false]

    });
    this.clear_controls();
  }
  clear_controls() {
    this.styleStatus = new MStyleStatus();
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStyleStatusData();
  }

  getStyleStatusData() {
    this.common.showSpinner();
    this.api.getAPI("stylestatus?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['styleStatusCode'].setValue(data.styleStatusMasterTypeData.styleStatusCode);
            this.myForm.controls['styleStatusName'].setValue(data.styleStatusMasterTypeData.statusName);
            this.myForm.controls['remarks'].setValue(data.styleStatusMasterTypeData.remarks);
            this.myForm.controls['active'].setValue(data.styleStatusMasterTypeData.active);

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

  updateStyleStatus() {
    if (this.styleStatus == null) {
      this.common.showMessage("warn", "Can not Save, Style Status are invalid.");
    } else {
      this.styleStatus.id = this.id;
      this.styleStatus.styleStatusCode = this.myForm.get('styleStatusCode').value;
      this.styleStatus.statusName = this.myForm.get('styleStatusName').value;
      this.styleStatus.remarks = this.myForm.get('remarks').value;
      this.styleStatus.active = this.myForm.get('active').value;
     // .log(this.styleStatus);
      this.common.showSpinner();
      this.api.putAPI("stylestatus", this.styleStatus).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success',data.displayMessage);
          this.router.navigate(['style-status']);
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
