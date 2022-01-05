import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MStyleSegmentationMaster } from 'src/app/models/m-style-segmentation-master';
import { MSegmentationTypes } from 'src/app/models/m-segmentation-types';

@Component({
  selector: 'app-style-segmentation-edit',
  templateUrl: './style-segmentation-edit.component.html',
  styleUrls: ['./style-segmentation-edit.component.css']
})
export class StyleSegmentationEditComponent implements OnInit {
  myForm: FormGroup;
  id: any;
  styleSegmentation: MStyleSegmentationMaster;
  segmentationTypeList: Array<MSegmentationTypes>;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
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
      //segmentationTypeListArr: new FormArray([])
    });
    this.styleSegmentation = new MStyleSegmentationMaster();
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStyleSegmentData();
  }

  getStyleSegmentData() {
    this.common.showSpinner();
    this.api.getAPI("stylesegmentation?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['styleSegmentCode'].setValue(data.afSegamationMasterTypesData.afSegamationCode);
            this.myForm.controls['styleSegmentName'].setValue(data.afSegamationMasterTypesData.afSegamationName);
            this.myForm.controls['codeLength'].setValue(data.afSegamationMasterTypesData.codeLength);
            this.myForm.controls['useSeperator'].setValue(data.afSegamationMasterTypesData.useSeperator);
            this.myForm.controls['remarks'].setValue(data.afSegamationMasterTypesData.remarks);
            this.myForm.controls['active'].setValue(data.afSegamationMasterTypesData.active);
            this.segmentationTypeList = data.afSegamationMasterTypesData.segmentList;

            // console.log(this.segmentationTypeList);

            // this.myForm.controls['segmentationTypeListArr'].setValue(this.segmentationTypeList);
            // this.segmentationTypeList.forEach(() => this.segmentationTypeList.push(new FormControl(false)));
            /*
            var tempArr = new FormArray([]);
            for (let segmentType of this.segmentationTypeList) {
              tempArr.push(new FormControl(segmentType.isUsed));
            }
            this.myForm.controls['segmentationTypeListArr'].setValue(tempArr);*/
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
  //checkValue(event: any) {
  //// console.log(event);
  //this.common.showMessage('warn', event);
  //  if (this.segmentationTypeList != null && this.segmentationTypeList.length > 0) {
  // for (let segmentType of this.segmentationTypeList) {
  //  if (segmentType.id == event) {
  //  if (segmentType.isUsed == true) {
  //    segmentType.isUsed = false
  //  segmentType.defaultDescription = false;
  //  }
  // else {
  //    segmentType.isUsed = true;
  //   segmentType.defaultDescription = true;
  // }
  //   break;
  //  }
  //}
  // }
  //}

  updateStyleSegmentation() {
    // this.calculateCodeLength();
    if (this.styleSegmentation == null) {
      this.common.showMessage("warn", "Can not Save, style segmentation Details are invalid.");
    } else {
      this.styleSegmentation.id = this.id;
      this.styleSegmentation.afSegamationCode = this.myForm.get('styleSegmentCode').value;
      this.styleSegmentation.afSegamationName = this.myForm.get('styleSegmentName').value;
      this.styleSegmentation.codeLength = this.myForm.get('codeLength').value;
      this.styleSegmentation.useSeperator = this.myForm.get('useSeperator').value;
      this.styleSegmentation.remarks = this.myForm.get('remarks').value;
      this.styleSegmentation.active = this.myForm.get('active').value;
      this.styleSegmentation.segmentList = this.segmentationTypeList;
      // .log(this.styleSegmentation);
      this.common.showSpinner();
      this.api.postAPI("StyleSegmentation", this.styleSegmentation).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['style-segmentation']);
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

  description_checked(item){
    this.cdRef.detectChanges();
    if(item.isUsed == false){
      item.defaultDescription = false;
    }
  }

  checkValue(item) {
    debugger;
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
