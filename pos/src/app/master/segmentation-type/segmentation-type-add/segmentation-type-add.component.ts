import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MSegmentationTypes } from 'src/app/models/m-segmentation-types';

@Component({
  selector: 'app-segmentation-type-add',
  templateUrl: './segmentation-type-add.component.html',
  styleUrls: ['./segmentation-type-add.component.css']
})
export class SegmentationTypeAddComponent implements OnInit {
  myForm: FormGroup;
  segmentationType: MSegmentationTypes;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      segmentationName: ['', Validators.required],
      maxLength: [0, Validators.required],
      remarks: [''],
      active: [true]

    });
    this.clear_controls();
  }
  clear_controls() {
    this.segmentationType = new MSegmentationTypes();
    this.myForm.controls['segmentationName'].setValue('');
    this.myForm.controls['maxLength'].setValue(0);
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }
  addSegmentationTypes() {
    if (this.segmentationType == null) {
      this.common.showMessage("warn", "Can not Save, Segmentation Type are invalid.");
    } else {
      this.segmentationType.id = 0;
      this.segmentationType.segmentName = this.myForm.get('segmentationName').value;
      this.segmentationType.maxLength = this.myForm.get('maxLength').value;
      this.segmentationType.remarks = this.myForm.get('remarks').value;
      this.segmentationType.active = this.myForm.get('active').value;
     // .log(this.segmentationType);
      this.common.showSpinner();
      this.api.postAPI("segmentationTypes", this.segmentationType).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
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
