import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MRetailSettings } from 'src/app/models/m-retail-settings';

@Component({
  selector: 'app-retail-settings-add',
  templateUrl: './retail-settings-add.component.html',
  styleUrls: ['./retail-settings-add.component.css']
})
export class RetailSettingsAddComponent implements OnInit {
  myForm: FormGroup;
  retailSettings: MRetailSettings;
  currencyList: Array<any>;
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
    this.getCurrenctLookUpList();
  }
  clear_controls() {
    this.retailSettings = new MRetailSettings();
    this.myForm.controls['retailCode'].setValue('');
    this.myForm.controls['retailName'].setValue('');
    this.myForm.controls['defaultTransactionMode'].setValue('');
    this.myForm.controls['priceOverrideLowerLimit'].setValue('');
    this.myForm.controls['priceOverrideUpperLimit'].setValue('');
    this.myForm.controls['newRowForScan'].setValue(false);
    this.myForm.controls['changeAmountCurrency'].setValue('');
    this.myForm.controls['refundForPromotionalItem'].setValue(false);
    this.myForm.controls['printParkedTransaction'].setValue(false);
    this.myForm.controls['deleteParkedTransactionDayEnd'].setValue(false);
    this.myForm.controls['changeSalesEmployeeAtPOS'].setValue(false);
    this.myForm.controls['useQuickComplete'].setValue(false);
    this.myForm.controls['allowLoginIfBusinessDateIsNotSameAsCurrentDate'].setValue(false);
    this.myForm.controls['logVoidedTransaction'].setValue(false);
    this.myForm.controls['maxnooflinespertransaction'].setValue('');
    this.myForm.controls['maxsalediscountpercentallowed'].setValue('');
    this.myForm.controls['maxsalediscountamountallowed'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['allowRefundToExchange'].setValue(false);
    this.myForm.controls['allowSalesForNegativeStock'].setValue(false);
    this.myForm.controls['allowSalesForZeroPrice'].setValue(false);
    this.myForm.controls['isCreditCardDetailsMandatory'].setValue(false);
    this.myForm.controls['allowMultiplePromotions'].setValue(false);
    this.myForm.controls['allowWNPromotions'].setValue(false);
    
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
  }

  addRetailSettings() {
    if (this.retailSettings == null) {
      this.common.showMessage("warn", "Can not Save, Retail Settings Details are invalid.");
    } else {
      this.retailSettings.id = 0;
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
