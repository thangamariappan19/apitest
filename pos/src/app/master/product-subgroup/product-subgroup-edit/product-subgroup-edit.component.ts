import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MProductgroupMaster } from 'src/app/models/m-productgroup-master';
import { MProductsubgroupMaster } from 'src/app/models/m-productsubgroup-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-product-subgroup-edit',
  templateUrl: './product-subgroup-edit.component.html',
  styleUrls: ['./product-subgroup-edit.component.css']
})
export class ProductSubgroupEditComponent implements OnInit {
  myForm: FormGroup;
  productgroupList: Array<MProductgroupMaster>;
  productsubgroupList: Array<MProductsubgroupMaster>;
  id: any;
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
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
  }
  createForm() {
    this.myForm = this.fb.group({
      productSubGroupCode: ['', Validators.required],
      productSubGroupName: ['', Validators.required],
      productGroupID: ['', Validators.required],
      active: [true]
    });
    this.productsubgroupList = new Array<MProductsubgroupMaster>();
    this.getProductsGroup();
  }
  getProductsGroup() {
    this.productgroupList = null;
    this.common.showSpinner();
    this.api.getAPI("productgroup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productgroupList = data.productGroupList;
            this.productgroupList = this.productgroupList.filter(x => x.active == true);
            //// .log(this.countryList);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getProductsSubGroupData();
  }
  getProductsSubGroupData() {
    this.common.showSpinner();
    this.api.getAPI("productsubgroup?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['productGroupID'].setValue(data.productSubGroupList[0].productGroupID);
            this.productsubgroupList = data.productSubGroupList;
            // .log(this.productsubgroupList);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  addProductSubGroupList() {
    this.myForm.get('productGroupID').disable();
    let productsubgroup = this.myForm.get('productSubGroupCode').value;
    //let productsubgroupname = this.myForm.get('productSubGroupName').value;
    if (this.productsubgroupList != null && this.productsubgroupList.length > 0) {
      if (productsubgroup != null && productsubgroup != "") {
        let filter_item = this.productsubgroupList.filter(x => x.productSubGroupCode == this.myForm.get('productSubGroupCode').value );
        if (filter_item != null && filter_item.length > 0) {
          this.myForm.controls['productSubGroupCode'].setValue('');;
          this.common.showMessage("warn", "product Sub GroupCode already exists");
        } else {
          let tempproductsubgroup: MProductsubgroupMaster = {
            id: 0,
            productSubGroupCode: this.myForm.get('productSubGroupCode').value,
            productSubGroupName: this.myForm.get('productSubGroupName').value,
            productGroupID: this.myForm.get('productGroupID').value,
            active: this.myForm.get('active').value,
            createBy: this.user_details.id
          }

          this.productsubgroupList.push(tempproductsubgroup);
          this.myForm.controls['productSubGroupCode'].setValue('');
          this.myForm.controls['productSubGroupName'].setValue('');
          this.myForm.controls['active'].setValue(true);

        }
      }
    }

  }

  void_item(item) {
    const idx = this.productsubgroupList.indexOf(item, 0);
    if (idx > -1) {
      this.productsubgroupList.splice(idx, 1);
    }
  }

  clear_controls() {
    this.myForm.get('productGroupID').enable();
    this.productsubgroupList = new Array<MProductsubgroupMaster>();
    this.myForm.controls['productGroupID'].setValue('');
    this.myForm.controls['productSubGroupCode'].setValue('');
    this.myForm.controls['productSubGroupName'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  clearsubcontrols() {
    this.myForm.controls['productSubGroupCode'].setValue('');
    this.myForm.controls['productSubGroupName'].setValue('');
    this.productsubgroupList = new Array<MProductsubgroupMaster>();
  }
  updateProductSubGroup() {
    if (this.productsubgroupList == null || this.productsubgroupList.length == 0) {
      this.common.showMessage("warn", "Can not Save,  Product Sub Group Details are invalid.");
    } else {
      this.common.showSpinner();
      this.api.postAPI("productsubgroup", this.productsubgroupList).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['product-subgroup']);
          // this.close();
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
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['product-subgroup']);
      }
    }
    else {
      this.router.navigate(['product-subgroup']);
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
  productSubGroupCodechange(item) {
    if (this.productsubgroupList != null && this.productsubgroupList.length > 0) {
      if (item.productSubGroupCode != null && item.productSubGroupCode.toString() != "") {
        let filter_item = this.productsubgroupList.filter(x => x.productSubGroupCode == item.productSubGroupCode && x.productSubGroupName != item.productSubGroupName);
        if (filter_item != null && filter_item.length > 0) {
          item.productSubGroupCode = null;
          this.common.showMessage("warn", "product Sub GroupCode already exists");
        }
      }
    }
  }

}
