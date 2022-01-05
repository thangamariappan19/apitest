import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MSegmentationTypes } from 'src/app/models/m-segmentation-types';
import { MStyleSegmentationMaster } from 'src/app/models/m-style-segmentation-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-style-segmentation-add',
  templateUrl: './style-segmentation-add.component.html',
  styleUrls: ['./style-segmentation-add.component.css']
})
export class StyleSegmentationAddComponent implements OnInit {
  myForm: FormGroup;
  styleSegmentation: MStyleSegmentationMaster;
  segmentationTypeList: Array<MSegmentationTypes>;
  segmentationTypeList_copy: Array<MSegmentationTypes>;
  user_details: MUserDetails = null;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private cdRef:ChangeDetectorRef
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      styleSegmentCode: ['', Validators.required],
      styleSegmentName: ['', Validators.required],
      useSeperator: ['', Validators.required],
      codeLength: [''],
      remarks: [''],
      active: [true]

    });
    this.getsegmentType();
    this.styleSegmentation = new MStyleSegmentationMaster();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);

    }
  }
  getsegmentType() {
    this.segmentationTypeList = null;
    this.common.showSpinner();
    this.api.getAPI("segmentationtypes")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.segmentationTypeList = data.segmentMasterList;
            this.segmentationTypeList_copy = data.segmentMasterList;
            if (this.segmentationTypeList != null && this.segmentationTypeList.length > 0) {
              for (let seg of this.segmentationTypeList) {
                seg.isUsed = false;
                seg.defaultDescription = false;
              }
            }
            // .log(this.segmentationTypeList);
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
  ngOnInit(): void {
  }
  description_checked(item){
    this.cdRef.detectChanges();
    if(item.isUsed == false){
      item.defaultDescription = false;
    }
  }
  
  checkValue(item) {
    this.cdRef.detectChanges();
    item.defaultDescription = item.isUsed;
    
    let temp_MaxLength: number = 0;
    if (this.segmentationTypeList != null && this.segmentationTypeList.length > 0) {
      for (let segmentType of this.segmentationTypeList) {
        if(segmentType.isUsed == true){
          if (item.segmentName != segmentType.segmentName) {
            if ((temp_MaxLength + parseInt(segmentType.maxLength.toString())) <= 50) {
              temp_MaxLength += parseInt(segmentType.maxLength.toString());
            } else {
              // segmentType.maxLength = 0;
              segmentType.isUsed = false;
              segmentType.defaultDescription = false;
            }
          }
        }
        
      }

      if (item.isUsed == true) {
        if ((temp_MaxLength + parseInt(item.maxLength.toString())) <= 50) {
          temp_MaxLength += parseInt(item.maxLength.toString());
        } else {
          // item.maxLength = 0;
          item.isUsed = false;
          item.defaultDescription = false;
          this.common.showMessage("warn", "Max Length should not exceed more than 50");
        }
      }
    }
    this.myForm.controls['codeLength'].setValue(temp_MaxLength);
  }

  /**add(){
    this.styleSegmentation.segmentList = this.segmentationTypeList;
   // .log(this.styleSegmentation.segmentList);
  }*/
  addstyleSegmentation() {
    // this.calculateCodeLength();
    if (this.styleSegmentation == null) {
      this.common.showMessage("warn", "Can not Save, style segmentation Details are invalid.");
    } else {
      this.styleSegmentation.id = 0;
      this.styleSegmentation.afSegamationCode = this.myForm.get('styleSegmentCode').value;
      this.styleSegmentation.afSegamationName = this.myForm.get('styleSegmentName').value;
      this.styleSegmentation.codeLength = this.myForm.get('codeLength').value;
      this.styleSegmentation.useSeperator = this.myForm.get('useSeperator').value;
      this.styleSegmentation.remarks = this.myForm.get('remarks').value;
      this.styleSegmentation.active = this.myForm.get('active').value;
      //this.styleSegmentation.createBy = this.user_details.id;
      this.styleSegmentation.segmentList = this.segmentationTypeList;

      this.common.showSpinner();
      this.api.postAPI("StyleSegmentation", this.styleSegmentation).subscribe((data) => {
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

  calculateCodeLength() {
    let temp_MaxLength: number = 0;
    if (this.segmentationTypeList != null && this.segmentationTypeList.length > 0) {
      for (let segmentType of this.segmentationTypeList) {
        if (segmentType.isUsed == true) {
          temp_MaxLength += segmentType.maxLength;
        }
      }
      this.myForm.controls['codeLength'].setValue(temp_MaxLength);
    }
  }

  clear_controls() {
    this.myForm.controls['styleSegmentCode'].setValue('');
    this.myForm.controls['styleSegmentName'].setValue('');
    this.myForm.controls['useSeperator'].setValue('');
    this.myForm.controls['codeLength'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
    // this.segmentationTypeList = new Array<MSegmentationTypes>();
    this.segmentationTypeList = this.segmentationTypeList_copy;
    if (this.segmentationTypeList != null && this.segmentationTypeList.length > 0) {
      for (let seg of this.segmentationTypeList) {
        seg.isUsed = false;
        seg.defaultDescription = false;
      }
    }
    this.getsegmentType();

  }

  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['style-segmentation']);
      }
    }
    else {
      this.router.navigate(['style-segmentation']);
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

  allowNumbers(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return (k >= 48 && k <= 57);
  }
}
