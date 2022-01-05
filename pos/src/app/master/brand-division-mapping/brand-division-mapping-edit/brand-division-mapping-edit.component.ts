import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MBrandDivisionMapping } from 'src/app/models/m-brand-division-mapping';
import { MBrandMaster } from 'src/app/models/m-brand-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-brand-division-mapping-edit',
  templateUrl: './brand-division-mapping-edit.component.html',
  styleUrls: ['./brand-division-mapping-edit.component.css']
})
export class BrandDivisionMappingEditComponent implements OnInit {
  myForm: FormGroup;
  id: any;
  brandDivisionMapping: MBrandDivisionMapping;
  brandDivisionMapplingList: Array<MBrandDivisionMapping>;
  brandDivisionMapping_Filter: Array<MBrandMaster>;
  user_details: MUserDetails = null;
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
      brandID: [''],
      //segmentationTypeListArr: new FormArray([])
    });
    this.getBrandList();
    this.brandDivisionMapping = new MBrandDivisionMapping();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      
    }

    if (this.user_details == null) {
      this.common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStyleSegmentData();
    this.myForm.controls['brandID'].setValue(this.id);
  }
  getStyleSegmentData() {
    this.common.showSpinner();
    this.api.getAPI("branddivisionmapping?brandid=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brandDivisionMapplingList = data.responseDynamicData;
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
  getBrandList() {
    this.brandDivisionMapping_Filter = null;
    this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.brandDivisionMapping_Filter = data.responseDynamicData;
            this.brandDivisionMapping_Filter = this.brandDivisionMapping_Filter.filter(x => x.active == true);
            // this.json = data.countryMasterList;
            //// .log(this.json);
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

  updateBrandDivision() {
    this.getCode();
    if (this.brandDivisionMapplingList == null) {
      this.common.showMessage("warn", "Can not Save, Brand Division Details are invalid.");
    } else {
      //this.styleSegmentation.segmentList = this.brandDivisionMapplingList;
     
      this.common.showSpinner();
      this.api.postAPI("BrandDivisionMapping", this.brandDivisionMapplingList).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.close();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }

  getCode() {
    let BrandCode = null;
    this.brandDivisionMapping_Filter = this.brandDivisionMapping_Filter.filter(x => x.id == this.id);
    for (let code of this.brandDivisionMapping_Filter) {
      BrandCode = code.brandCode;
    }
    let temp_MaxLength: number = 0;
    if (this.brandDivisionMapplingList != null && this.brandDivisionMapplingList.length > 0) {
      for (let branddivision of this.brandDivisionMapplingList) {
        if (branddivision.active == true) {
          branddivision.brandID = this.id;
          branddivision.brandCode = BrandCode;
          branddivision.createBy = this.user_details.id;
        }
      }
    }
  }

  close() {
    debugger
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['brand-division-mapping']);
    }  
    } 
    else
    {
      this.router.navigate(['brand-division-mapping']);
  }
    }

}
