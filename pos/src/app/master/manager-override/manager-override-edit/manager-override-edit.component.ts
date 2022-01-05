import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MManagerOverride } from 'src/app/models/m-manager-override';

@Component({
  selector: 'app-manager-override-edit',
  templateUrl: './manager-override-edit.component.html',
  styleUrls: ['./manager-override-edit.component.css']
})
export class ManagerOverrideEditComponent implements OnInit {
  myForm: FormGroup;
  manager_override: MManagerOverride;
  id: any;
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
      managerOverrideCode: ['', Validators.required],
      managerOverrideName: ['', Validators.required],
      changeSalesPersonInSOE: [false],
      reprintTransactionReceipt: [false],
      deleteSuspendedTransaction: [false],
      changeSalesPersonRefund: [false],
      voidItem: [false],
      salesExchange: [false],
      customerSearch: [false],
      voidSale: [false],
      transactionSearch: [false],
      productSearch: [false],
      cashOut: [false],
      suspendRecall: [false],
      transactionRefund: [false],
      cashIn: [false],
      dayInDayOut: [false],
      totalDiscount: [false],
      active: [false],
      allowEditCustomer: [false]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.manager_override = new MManagerOverride();

  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getManagerOverrideData();
  }
  getManagerOverrideData() {
    this.common.showSpinner();
    this.api.getAPI("manageroverride?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['managerOverrideCode'].setValue(data.managerOverrideRecord.code);
            this.myForm.controls['managerOverrideName'].setValue(data.managerOverrideRecord.name);
            this.myForm.controls['changeSalesPersonInSOE'].setValue(data.managerOverrideRecord.changeSalesPersoninSOE);
            this.myForm.controls['reprintTransactionReceipt'].setValue(data.managerOverrideRecord.reprintTransReceipt);
            this.myForm.controls['deleteSuspendedTransaction'].setValue(data.managerOverrideRecord.delSuspendedTransaction);
            this.myForm.controls['changeSalesPersonRefund'].setValue(data.managerOverrideRecord.changeSalesPersonRefund);
            this.myForm.controls['voidItem'].setValue(data.managerOverrideRecord.voidItem);
            this.myForm.controls['salesExchange'].setValue(data.managerOverrideRecord.transModeChange);
            this.myForm.controls['customerSearch'].setValue(data.managerOverrideRecord.customerSearch);
            this.myForm.controls['voidSale'].setValue(data.managerOverrideRecord.voidSale);
            this.myForm.controls['transactionSearch'].setValue(data.managerOverrideRecord.transactionSearch);
            this.myForm.controls['productSearch'].setValue(data.managerOverrideRecord.productSearch);
            this.myForm.controls['cashOut'].setValue(data.managerOverrideRecord.cashOut);
            this.myForm.controls['suspendRecall'].setValue(data.managerOverrideRecord.suspendRecall);
            this.myForm.controls['transactionRefund'].setValue(data.managerOverrideRecord.transactionRefund);
            this.myForm.controls['cashIn'].setValue(data.managerOverrideRecord.cashIn);
            this.myForm.controls['dayInDayOut'].setValue(data.managerOverrideRecord.dayInDayOut);
            this.myForm.controls['totalDiscount'].setValue(data.managerOverrideRecord.totalDiscount);
            this.myForm.controls['active'].setValue(data.managerOverrideRecord.active);
            this.myForm.controls['allowEditCustomer'].setValue(data.managerOverrideRecord.allowEditcustomer);
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
  updateManagerOverride() {
    if (this.manager_override == null) {
      this.common.showMessage("warn", "Can not Save, Manager Override are invalid.");
    } else {
      this.manager_override.id = this.id;
      this.manager_override.code = this.myForm.get('managerOverrideCode').value;
      this.manager_override.name = this.myForm.get('managerOverrideName').value;
      this.manager_override.changeSalesPersoninSOE = this.myForm.get('changeSalesPersonInSOE').value;
      this.manager_override.reprintTransReceipt = this.myForm.get('reprintTransactionReceipt').value;
      this.manager_override.delSuspendedTransaction = this.myForm.get('deleteSuspendedTransaction').value;
      this.manager_override.changeSalesPersonRefund = this.myForm.get('changeSalesPersonRefund').value;
      this.manager_override.voidItem = this.myForm.get('voidItem').value;
      this.manager_override.transModeChange = this.myForm.get('salesExchange').value;
      this.manager_override.customerSearch = this.myForm.get('customerSearch').value;
      this.manager_override.voidSale = this.myForm.get('voidSale').value;
      this.manager_override.transactionSearch = this.myForm.get('transactionSearch').value;
      this.manager_override.productSearch = this.myForm.get('productSearch').value;
      this.manager_override.cashOut = this.myForm.get('cashOut').value;
      this.manager_override.suspendRecall = this.myForm.get('suspendRecall').value;
      this.manager_override.transactionRefund = this.myForm.get('transactionRefund').value;
      this.manager_override.cashIn = this.myForm.get('cashIn').value;
      this.manager_override.dayInDayOut = this.myForm.get('dayInDayOut').value;
      this.manager_override.totalDiscount = this.myForm.get('totalDiscount').value;
      this.manager_override.active = this.myForm.get('active').value;
      this.manager_override.allowEditcustomer = this.myForm.get('allowEditCustomer').value;

     // .log(this.manager_override);
      this.common.showSpinner();
      this.api.putAPI("manageroverride", this.manager_override).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['manager-override']);
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
        this.router.navigate(['manager-override']);
    }  
    } 
    else
    {
      this.router.navigate(['manager-override']);
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
