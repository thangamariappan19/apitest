import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MSegmentationTypes } from 'src/app/models/m-segmentation-types';

@Component({
  selector: 'app-segmentation-type-edit',
  templateUrl: './segmentation-type-edit.component.html',
  styleUrls: ['./segmentation-type-edit.component.css']
})
export class SegmentationTypeEditComponent implements OnInit {
  myForm: FormGroup;
  segmentationType: MSegmentationTypes;
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
      segmentationName: ['', Validators.required],
      maxLength: [0, Validators.required],
      remarks: [''],
      active: [false]

    });
    this.clear_controls();
  }
  clear_controls() {
    this.segmentationType = new MSegmentationTypes();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSegmentationData();
  }
  getSegmentationData() {
    this.common.showSpinner();
    this.api.getAPI("segmentationTypes?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['segmentationName'].setValue(data.segmentMasterRecord.segmentName);
            this.myForm.controls['maxLength'].setValue(data.segmentMasterRecord.maxLength);
            this.myForm.controls['remarks'].setValue(data.segmentMasterRecord.remarks);
            this.myForm.controls['active'].setValue(data.segmentMasterRecord.active);

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

  updateSegmentationTypes() {
    if (this.segmentationType == null) {
      this.common.showMessage("warn", "Can not Save, Segmentation Type are invalid.");
    } else {
      this.segmentationType.id = this.id;
      this.segmentationType.segmentName = this.myForm.get('segmentationName').value;
      this.segmentationType.maxLength = this.myForm.get('maxLength').value;
      this.segmentationType.remarks = this.myForm.get('remarks').value;
      this.segmentationType.active = this.myForm.get('active').value;
     // .log(this.segmentationType);
      this.common.showSpinner();
      this.api.putAPI("segmentationTypes", this.segmentationType).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['segmentation-type']);
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
        this.router.navigate(['segmentation-type']);
    }  
    } 
    else
    {
      this.router.navigate(['segmentation-type']);
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
