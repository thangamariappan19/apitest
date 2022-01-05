import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MRetailSettings } from 'src/app/models/m-retail-settings';

@Component({
  selector: 'app-retail-settings-edit',
  templateUrl: './retail-settings-edit.component.html',
  styleUrls: ['./retail-settings-edit.component.css']
})
export class RetailSettingsEditComponent implements OnInit {
  id: any;
  myForm: FormGroup;
  retailSettings: MRetailSettings;
  currencyList: Array<any>;
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
      retailCode: ['', Validators.required],
      retailName: ['', Validators.required],
      defaultTransactionMode: ['', Validators.required],
      priceOverrideLowerLimit: [''],
      priceOverrideUpperLimit: [''],
      newRowForScan: [false],
      changeAmountCurrency: ['', Validators.required],
      refundForPromotionalItem: [false],
      printParkedTransaction: [false],
      deleteParkedTransactionDayEnd: [false],
      changeSalesEmployeeAtPOS: [false],
      useQuickComplete: [false],
      allowLoginIfBusinessDateIsNotSameAsCurrentDate: [false],
      logVoidedTransaction: [false],
      maxnooflinespertransaction: [''],
      maxsalediscountpercentallowed: [''],
      maxsalediscountamountallowed: [''],
      active: [true],
      allowRefundToExchange: [false],
      allowSalesForNegativeStock: [false],
      allowSalesForZeroPrice: [false],
      isCreditCardDetailsMandatory: [false],
      allowMultiplePromotions: [false],
      allowWNPromotions: [false]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.retailSettings = new MRetailSettings();
    this.getCurrenctLookUpList();
  }

  getCurrenctLookUpList() {
    this.currencyList = null;
    this.common.showSpinner();
    this.api.getAPI("CurrencyLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.currencyList = data.currencyMasterList;
           // .log(this.currencyList);
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

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getRetailSettingsData();
  }
  getRetailSettingsData() {
    this.common.showSpinner();
    this.api.getAPI("retailsettings?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['retailCode'].setValue(data.retailRecord.retailCode);
            this.myForm.controls['retailName'].setValue(data.retailRecord.retailName);
            this.myForm.controls['defaultTransactionMode'].setValue(data.retailRecord.defaultTransMode);
            this.myForm.controls['priceOverrideLowerLimit'].setValue(data.retailRecord.priceLowerLimit);
            this.myForm.controls['priceOverrideUpperLimit'].setValue(data.retailRecord.priceUpperLimit);
            this.myForm.controls['newRowForScan'].setValue(data.retailRecord.rowforScan);
            this.myForm.controls['changeAmountCurrency'].setValue(data.retailRecord.changeAmountCurrency);
            this.myForm.controls['refundForPromotionalItem'].setValue(data.retailRecord.refundPromotinal);
            this.myForm.controls['printParkedTransaction'].setValue(data.retailRecord.printParked);
            this.myForm.controls['deleteParkedTransactionDayEnd'].setValue(data.retailRecord.deleteParkedDayEnd);
            this.myForm.controls['changeSalesEmployeeAtPOS'].setValue(data.retailRecord.changeSaleEmployee);
            this.myForm.controls['useQuickComplete'].setValue(data.retailRecord.quickComplete);
            this.myForm.controls['allowLoginIfBusinessDateIsNotSameAsCurrentDate'].setValue(data.retailRecord.loginDiffDate);
            this.myForm.controls['logVoidedTransaction'].setValue(data.retailRecord.logVoidedTransaction);
            this.myForm.controls['maxnooflinespertransaction'].setValue(data.retailRecord.maxLinesPerTransaction);
            this.myForm.controls['maxsalediscountpercentallowed'].setValue(data.retailRecord.maxDiscountPercentage);
            this.myForm.controls['maxsalediscountamountallowed'].setValue(data.retailRecord.maxDiscountAmt);
            this.myForm.controls['active'].setValue(data.retailRecord.active);
            this.myForm.controls['allowRefundToExchange'].setValue(data.retailRecord.allowRefundToExchangedItems);
            this.myForm.controls['allowSalesForNegativeStock'].setValue(data.retailRecord.allowSalesForNegativeStock);
            this.myForm.controls['allowSalesForZeroPrice'].setValue(data.retailRecord.allowSalesForZeroPrice);
            this.myForm.controls['isCreditCardDetailsMandatory'].setValue(data.retailRecord.isCreditCardDetailsMandatory);
            this.myForm.controls['allowMultiplePromotions'].setValue(data.retailRecord.allowMultiplePromotions);
            this.myForm.controls['allowWNPromotions'].setValue(data.retailRecord.allowWNPromotions);

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

  updateRetailSettings() {
    if (this.retailSettings == null) {
      this.common.showMessage("warn", "Can not Save, Retail Settings Details are invalid.");
    } else {
      this.retailSettings.id = this.id;
      this.retailSettings.retailCode = this.myForm.get('retailCode').value;
      this.retailSettings.retailName = this.myForm.get('retailName').value;
      this.retailSettings.defaultTransMode = this.myForm.get('defaultTransactionMode').value;
      this.retailSettings.priceLowerLimit = this.myForm.get('priceOverrideLowerLimit').value;
      this.retailSettings.priceUpperLimit = this.myForm.get('priceOverrideUpperLimit').value;
      this.retailSettings.rowforScan = this.myForm.get('newRowForScan').value;
      this.retailSettings.changeAmountCurrency = this.myForm.get('changeAmountCurrency').value;
      this.retailSettings.refundPromotinal = this.myForm.get('refundForPromotionalItem').value;
      this.retailSettings.printParked = this.myForm.get('printParkedTransaction').value;
      this.retailSettings.deleteParkedDayEnd = this.myForm.get('deleteParkedTransactionDayEnd').value;
      this.retailSettings.changeSaleEmployee = this.myForm.get('changeSalesEmployeeAtPOS').value;
      this.retailSettings.quickComplete = this.myForm.get('useQuickComplete').value;
      this.retailSettings.loginDiffDate = this.myForm.get('allowLoginIfBusinessDateIsNotSameAsCurrentDate').value;
      this.retailSettings.logVoidedTransaction = this.myForm.get('logVoidedTransaction').value;
      this.retailSettings.maxLinesPerTransaction = this.myForm.get('maxnooflinespertransaction').value;
      this.retailSettings.maxDiscountPercentage = this.myForm.get('maxsalediscountpercentallowed').value;
      this.retailSettings.maxDiscountAmt = this.myForm.get('maxsalediscountamountallowed').value;
      this.retailSettings.maxLieDiscountAmt=0;
      this.retailSettings.active = this.myForm.get('active').value;
      this.retailSettings.allowRefundToExchangedItems = this.myForm.get('allowRefundToExchange').value;
      this.retailSettings.allowSalesForNegativeStock = this.myForm.get('allowSalesForNegativeStock').value;
      this.retailSettings.allowSalesForZeroPrice = this.myForm.get('allowSalesForZeroPrice').value;
      this.retailSettings.isCreditCardDetailsMandatory = this.myForm.get('isCreditCardDetailsMandatory').value;
      this.retailSettings.allowMultiplePromotions = this.myForm.get('allowMultiplePromotions').value;
      this.retailSettings.allowWNPromotions = this.myForm.get('allowWNPromotions').value;
      this.common.showSpinner();
      this.api.postAPI("retailsettings", this.retailSettings).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['retail-settings']);
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
        this.router.navigate(['retail-settings']);
    }  
    } 
    else
    {
      this.router.navigate(['retail-settings']);
  }
    }

  countrycode() { }
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
  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPress1(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  priceLowerPercentChange(){
    let per = this.myForm.get('priceOverrideLowerLimit').value;
    if(per>100)
    {
      this.myForm.controls['priceOverrideLowerLimit'].setValue('');
      this.common.showMessage("warn", "Can not Save, Price Override Lower Limit Percentage should not exceed 100%.");
    }
  }

  priceUpperPercentChange(){
    let per = this.myForm.get('priceOverrideUpperLimit').value;
    if(per>100)
    {
      this.myForm.controls['priceOverrideUpperLimit'].setValue('');
      this.common.showMessage("warn", "Can not Save, Price Override Upper Limit Percentage should not exceed 100%.");
    }
  }
  maxSalesPercentage(){
    let per = this.myForm.get('maxsalediscountpercentallowed').value;
    if(per>100)
    {
      this.myForm.controls['maxsalediscountpercentallowed'].setValue('');
      this.common.showMessage("warn", "Can not Save, Manixum Sale Discount Percentage should not exceed 100%.");
    }
  }
}
