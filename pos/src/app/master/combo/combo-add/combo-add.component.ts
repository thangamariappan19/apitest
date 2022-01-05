import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MComboMaster, MComboOfferDetails, MComboOffer } from 'src/app/models/m-combo-master';
import { MPricelistMaster } from 'src/app/models/m-pricelist-master';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';
import { MUserDetails } from 'src/app/models/m-user-details';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-combo-add',
  templateUrl: './combo-add.component.html',
  styleUrls: ['./combo-add.component.css']
})
export class ComboAddComponent implements OnInit {

  myForm: FormGroup;
  skuList: Array<MSkuMasterTypes>;
  combo: MComboMaster = null;
  id?: number;
  documentDate?: string;
  stylepricingList: Array<MPricelistMaster>;
  comboList: Array<MComboOfferDetails>;
  tempcombolist: Array<MComboOfferDetails>;
  user_details: MUserDetails = null;
  negative: boolean;
  SearchString: any;


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
      documentDate: [''],
      productBarcode: ['', Validators.required],
      productSKU: ['', Validators.required],
      Active: ['true'],
      BarCode: [''],
      SKUCode: [''],
      syleCode: [''],
      SKUName: [''],
      price: ['']
    });

    this.comboList = new Array<MComboMaster>();
    this.stylepricingList = new Array<MSkuMasterTypes>();
    this.myForm.controls['documentDate'].setValue(this.common.toYMDFormat(new Date()));
    this.tempcombolist = new Array<MComboMaster>();
    this.stylepricingList = Array<MSkuMasterTypes>();
    this.getPriceList();

  }

  clear_controls() {
    this.myForm.controls['productBarcode'].setValue('');
    this.myForm.controls['productSKU'].setValue('');
    this.myForm.controls['Active'].setValue(true);
    this.comboList = new Array<MComboMaster>();
    this.getPriceList();
  }

  getPriceList() {
    this.common.showSpinner();
    this.api.getAPI("Combo")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.stylepricingList = data.priceListTypeList;
          }
          else {
            this.common.showMessage('warn', 'Wrong Price Entered');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['combo-list']);
      }
    }
    else {
      this.router.navigate(['combo-list']);
    }
  }

  void_item(item) {
    const idx = this.comboList.indexOf(item, 0);
    if (idx > -1) {
      this.comboList.splice(idx, 1);
    }
  }


  getStaticValues() {
    let temp_str: string = localStorage.getItem('combo_details');
    if (temp_str != null) {
      this.documentDate = this.common.toYMDFormat(new Date(this.documentDate));
    }
  }

  getSKUData(event) {
    this.SearchString = this.myForm.get('BarCode').value;
    if (this.SearchString) {
      if (event.key === "Enter" || event.key === "Tab") {
        this.common.showSpinner();
        this.api.getAPI("Combo?itemcode=" + this.SearchString)
          .subscribe((data) => {
            setTimeout(() => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                this.comboList.push(data.comboOfferDetailsList[0]);
                this.myForm.get('BarCode').setValue('');
              } else {
                this.common.showMessage('warn', 'Wrong SKU Scanned');
                this.myForm.get('BarCode').setValue('');
              }
              this.common.hideSpinner();
            }, this.common.time_out_delay);
          });
      }
    }
  }

  addComboOfferDetails() {

    if (this.comboList == null || this.comboList.length == 0) {
      this.common.showMessage("warn", "Can't Save, Combo Offer Details are invalid.");
    } else {
      this.common.showSpinner();
      this.combo = new MComboMaster();

      this.combo.id = 0;
      this.combo.documentDate = this.myForm.get('documentDate').value;
      this.combo.productBarcode = this.myForm.get('productBarcode').value;
      this.combo.productSKUCode = this.myForm.get('productSKU').value;
      this.combo.active = this.myForm.get('Active').value;
      this.combo.comboOfferDetailsList = new Array<MComboOfferDetails>();
      this.combo.comboOfferDetailsList = this.comboList;

      var mComboMaster = new MComboOffer();
      mComboMaster.comboOfferRecord = this.combo;
      mComboMaster.priceListTypes = this.stylepricingList;
      mComboMaster.cPOStyleDetailsRecords = new MComboOfferDetails();
      mComboMaster.cPOStyleDetailsRecords.headerID = this.comboList[0].headerID;
      mComboMaster.cPOStyleDetailsRecords.barcode = this.comboList[0].barcode;
      mComboMaster.cPOStyleDetailsRecords.skuCode = this.comboList[0].skuCode;
      mComboMaster.cPOStyleDetailsRecords.skuName = this.comboList[0].skuName;
      mComboMaster.cPOStyleDetailsRecords.styleCode = this.comboList[0].styleCode;

      this.api.postAPI("Combo", mComboMaster).subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          this.router.navigate(['combo-list']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }
      });
    }
  }

  ngOnInit(): void {

  }

}
