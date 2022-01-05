import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MPromotionMapping } from 'src/app/models/m-promotion-mapping';
import { MUserDetails } from 'src/app/models/m-user-details';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-promotion-mapping-edit',
  templateUrl: './promotion-mapping-edit.component.html',
  styleUrls: ['./promotion-mapping-edit.component.css']
})
export class PromotionMappingEditComponent implements OnInit {
  myForm: FormGroup;
  promotionCode: any;
  id: any;
  countryID: any;
  promotion_List: Array<any>;
  storeList: Array<any>;
  promotionMappedList: Array<MPromotionMapping>;
  promotionMapping: MPromotionMapping;
  mappingPromotion: Array<MPromotionMapping>;
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
      wnPromotionID: ['']

    });
    this.mappingPromotion = new Array<MPromotionMapping>();
    this.promotionMapping = new MPromotionMapping();
    this.promotionMappedList = new Array<MPromotionMapping>();
    this.storeList = new Array<any>();
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
    this.getPromotionList();

    //this.myForm.controls['wnPromotionID'].setValue(this.id);
    //this.getPromotionMappingList();
    //this.getStoreList();
  }

  getPromotionList() {
    this.promotion_List = null;
    this.common.showSpinner();
    this.api.getAPI("promotionmapping")
      .subscribe((data) => {
        setTimeout(() => {
          this.common.hideSpinner();
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.promotion_List = data.wnPromotionList;
            this.myForm.controls['wnPromotionID'].setValue(this.id);
            this.getStoreList();
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
        }, this.common.time_out_delay);
      });
  }
  getStoreList() {
    for (let country of this.promotion_List) {
      if (country.id == this.id) {
        this.countryID = country.id;
        this.promotionCode = country.promotionCode;
        this.storeList = null;

        this.common.showSpinner();
        this.api.getAPI("StoreBasedCountryID?countryid=" + this.countryID)
          .subscribe((data) => {
            setTimeout(() => {
              this.common.hideSpinner();
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                this.storeList = data.storeMasterList;
                this.getPromotionMappingList();
              } else {
                let msg: string = data != null
                  && data.displayMessage != null
                  && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
                this.common.showMessage('warn', msg);
              }
            }, this.common.time_out_delay);
          });
        break;
      }
    }

  }
  getPromotionMappingList() {
    this.promotionMappedList = null;
    this.common.showSpinner();
    this.api.getAPI("PromotionMapping?countryid=" + this.countryID + "&WNPromotionID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          this.common.hideSpinner();
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.promotionMappedList = data.responseDynamicData;
            this.mapp();
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
        }, this.common.time_out_delay);
      });
  }
  mapp() {
    this.promotionMappedList = this.promotionMappedList.filter(x => x.wnPromotionID != 0);
    for (let mapped of this.promotionMappedList) {
      for (let store of this.storeList) {
        if (mapped.storeID == store.id) {
          store.active = true;
          break;
        }
      }
    }
  }

  updatePromotionMapping() {
    this.getCode();
    if (this.mappingPromotion == null) {
      this.common.showMessage("warn", "Can not Save, Details are invalid.");
    } else {
      //this.styleSegmentation.segmentList = this.brandDivisionMapplingList;
      this.promotionMapping.id = 0;
      this.promotionMapping.storeCode = null;
      this.promotionMapping.storeID = 0;
      this.promotionMapping.storeName = null;
      this.promotionMapping.wnPromotionID = 0;
      this.promotionMapping.wnPromotionCode = null;
      this.promotionMapping.promotionMappingList = this.mappingPromotion.filter(x => x.wnPromotionID != 0);
      // console.log(this.promotionMapping);
      this.common.showSpinner();
      this.api.postAPI("PromotionMapping", this.promotionMapping).subscribe((data) => {
        // .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['promotion-mapping']);
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
    for (let store of this.storeList) {
      if (store.active == true) {
        let tempdata: MPromotionMapping = {
          id: 0,
          wnPromotionID: this.id,
          wnPromotionCode: this.promotionCode,
          storeID: store.id,
          storeCode: store.storeCode,
          storeName: store.storeName,
          createBy: this.user_details.id
        }
        this.mappingPromotion.push(tempdata);
      }
    }
    //this.mappingPromotion=this.promotionMappedList;
  }
  /*getCode() {
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
  }*/
  close() {
    if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
      this.router.navigate(['promotion-mapping']);
    }
  }
}
