import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Columns, API, APIDefinition, DefaultConfig, Config } from 'ngx-easy-table';
import { MUserDetails } from 'src/app/models/m-user-details';
import { EventObject } from 'src/app/models/event-object';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MComboMaster, MComboOffer, MComboOfferDetails } from 'src/app/models/m-combo-master';
import { MSkuMasterTypes } from 'src/app/models/m-sku-master-types';

@Component({
  selector: 'app-combo-view',
  templateUrl: './combo-view.component.html',
  styleUrls: ['./combo-view.component.css']
})
export class ComboViewComponent implements OnInit {

  myForm: FormGroup;
  documentDate?: Date;
  productBarcode?: string;
  productSKU?: string;
  productStylecode?: string;
  Active?: boolean = true;
  PriceListCurrencyType?: any;
  user_details: MUserDetails = null;
  combo: MComboMaster;
  comboDetails: Array<MComboOfferDetails>;
  comboList: Array<MComboMaster>;
  priceList: Array<any>;
  skuList: Array<MSkuMasterTypes>;
  tempcombolist: Array<MComboOfferDetails>;
  id: any;
  data: any;
  userid: number;
  price: number;
  SearchString: any;
  priceDetailList: Array<any>;
  comboDetailslist: Array<any>;
  stylepricingList: Array<any>;
  priceTypeList: Array<any>;
  comboOfferDetailsList: Array<MComboOfferDetails>;

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
      documentDate: [''],
      productBarcode: [''],
      productSKU: [''],
      Active: ['true'],
      BarCode: [''],
      SKUCode: [''],
      styleCode: [''],
      SKUName: [''],
      price: ['']
    });


    this.getPriceList();
    this.getStaticValues();
    this.comboDetails = new Array<MComboOfferDetails>();
    this.priceList = new Array<any>();
    this.comboDetailslist = new Array<any>();
    this.combo = new MComboMaster;
    this.tempcombolist = new Array<MComboMaster>();
  }

  getStaticValues() {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.skuCode = this.activatedRoute.snapshot.paramMap.get('BarCode');
    this.getStyleDetails();
  }

  updateStyle() {
    try {
      if (this.combo == null) {
        this.common.showMessage("warn", "Can't Save, Data's not entered.");
      } else {
        this.combo.id = this.id;
        this.combo.documentDate = this.myForm.get('documentDate').value;
        this.combo.productBarcode = this.myForm.get('productBarcode').value;
        this.combo.productSKUCode = this.myForm.get('productSKU').value;
        this.combo.active = this.myForm.get('Active').value;

        var mComboMaster = new MComboOffer();
        mComboMaster.comboOfferRecord = this.combo;
        mComboMaster.priceListTypes = this.priceList;
        mComboMaster.cPOStyleDetailsRecords = new MComboOfferDetails();

        mComboMaster.cPOStyleDetailsRecords.headerID = this.combo.comboOfferDetailsList[0].headerID;
        mComboMaster.cPOStyleDetailsRecords.barcode = this.combo.comboOfferDetailsList[0].barcode;
        mComboMaster.cPOStyleDetailsRecords.skuCode = this.combo.comboOfferDetailsList[0].skuCode;
        mComboMaster.cPOStyleDetailsRecords.skuName = this.combo.comboOfferDetailsList[0].skuName;
        mComboMaster.cPOStyleDetailsRecords.styleCode = this.combo.comboOfferDetailsList[0].styleCode;

        this.common.showSpinner();
        this.api.postAPI("Combo", mComboMaster).subscribe((data) => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            this.common.showMessage('success', "Combo offer Updated Successfully.");
            this.router.navigate(['combo-list']);
          } else {
            setTimeout(() => {
              this.common.hideSpinner();
              this.common.showMessage('error', 'Failed to Save.');
            }, this.common.time_out_delay);
          }
        });
      }
    } catch (ex) {
      this.common.hideSpinner();
      console.log(ex);
    }
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

  getPriceList() {
    this.common.showSpinner();
    this.api.getAPI("Combo")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.stylepricingList = data.priceListTypeList;
          }
          else {
            this.common.showMessage('warn', 'Wrong Price value entered');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getStyleDetails() {
    this.myForm.controls['documentDate'].setValue("");
    this.myForm.controls['productBarcode'].setValue("");
    this.myForm.controls['productSKU'].setValue("");
    this.myForm.controls['Active'].setValue("");

    this.common.showSpinner();
    this.api.getAPI("combo?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.combo = data.comboOfferRecord;
            this.priceList = data.priceTypeList;
            this.myForm.controls['documentDate'].setValue(this.common.toYMDFormat(new Date(this.combo.documentDate)));
            this.myForm.controls['productBarcode'].setValue(this.combo.productBarcode);
            this.myForm.controls['productSKU'].setValue(this.combo.productSKUCode);
            this.myForm.controls['Active'].setValue(this.combo.active);
            this.getPriceDetails();
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getPriceDetails() {
    for (let price_item of this.priceList) {
      for (let style_item of this.stylepricingList) {
        if (style_item.id == price_item.id) {
          price_item.priceListCode = style_item.priceListCode;
          price_item.priceListName = style_item.priceListName;
        }
      }
    }
  }

  void_item(item) {
    const idx = this.combo.comboOfferDetailsList.indexOf(item, 0);
    if (idx > -1) {
      this.combo.comboOfferDetailsList.splice(idx, 1);
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
                this.combo.comboOfferDetailsList.push(data.comboOfferDetailsList[0]);
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

}






