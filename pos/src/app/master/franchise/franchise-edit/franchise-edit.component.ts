import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MFranchiseMaster } from 'src/app/models/m-franchise-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-franchise-edit',
  templateUrl: './franchise-edit.component.html',
  styleUrls: ['./franchise-edit.component.css']
})
export class FranchiseEditComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>;
  franchise: MFranchiseMaster;
  id: any;
  franchiseCode: string;
  franchiseName: string;

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
      franchiseCode: ['', Validators.required],
      franchiseName: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.franchise = new MFranchiseMaster();
  }

  ngOnInit() {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getfranchiseData();
  }

  getfranchiseData() {
    this.common.showSpinner();
    this.api.getAPI("franchise?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['franchiseCode'].setValue(data.responseDynamicData.franchiseCode);
            this.myForm.controls['franchiseName'].setValue(data.responseDynamicData.franchiseName);
            this.myForm.controls['remarks'].setValue(data.responseDynamicData.remarks);
            this.myForm.controls['active'].setValue(data.responseDynamicData.active);

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

  update() {
    if (this.franchise == null) {
      this.common.showMessage("warn", "Can not Save, Franchise-Master Data is invalid.");
    } else {
      this.franchise.id = this.id;
      this.franchise.franchiseCode = this.myForm.get('franchiseCode').value;
      this.franchise.franchiseName = this.myForm.get('franchiseName').value;
      this.franchise.active = this.myForm.get('active').value;
      this.franchise.remarks = this.myForm.get('remarks').value;

     // .log(this.franchise);
      this.common.showSpinner();
      this.api.putAPI("franchise", this.franchise).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['franchise']);
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
        this.router.navigate(['franchise']);
    }  
    } 
    else
    {
      this.router.navigate(['franchise']);
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




