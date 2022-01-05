import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MManagerOverride } from 'src/app/models/m-manager-override';

@Component({
  selector: 'app-manager-override-add',
  templateUrl: './manager-override-add.component.html',
  styleUrls: ['./manager-override-add.component.css']
})
export class ManagerOverrideAddComponent implements OnInit {
  myForm: FormGroup;
  manager_override: MManagerOverride;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb:FormBuilder,
    private confirm: ConfirmService,
    public router:Router
  ) { this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      managerOverrideCode: ['', Validators.required],
      managerOverrideName: ['', Validators.required],
      changeSalesPersonInSOE:[false],
      reprintTransactionReceipt:[false],
      deleteSuspendedTransaction:[false],
      changeSalesPersonRefund:[false],
      voidItem:[false],
      salesExchange:[false],
      customerSearch:[false],
      voidSale:[false],
      transactionSearch:[false],
      productSearch:[false],
      cashOut:[false],
      suspendRecall:[false],
      transactionRefund:[false],
      cashIn:[false],
      dayInDayOut:[false],
      totalDiscount:[false],
      active:[true],
      allowEditCustomer:[false]  
    });
    this.clear_controls();
  }
  clear_controls(){
    this.manager_override = new MManagerOverride();
    this.myForm.controls['managerOverrideCode'].setValue('');
    this.myForm.controls['managerOverrideName'].setValue('');
    this.myForm.controls['changeSalesPersonInSOE'].setValue(false);
    this.myForm.controls['reprintTransactionReceipt'].setValue(false);
    this.myForm.controls['deleteSuspendedTransaction'].setValue(false);
    this.myForm.controls['changeSalesPersonRefund'].setValue(false);
    this.myForm.controls['voidItem'].setValue(false);
    this.myForm.controls['salesExchange'].setValue(false);
    this.myForm.controls['customerSearch'].setValue(false);
    this.myForm.controls['voidSale'].setValue(false);
    this.myForm.controls['transactionSearch'].setValue(false);
    this.myForm.controls['productSearch'].setValue(false);
    this.myForm.controls['cashOut'].setValue(false);
    this.myForm.controls['suspendRecall'].setValue(false);
    this.myForm.controls['transactionRefund'].setValue(false);
    this.myForm.controls['cashIn'].setValue(false);
    this.myForm.controls['dayInDayOut'].setValue(false);
    this.myForm.controls['totalDiscount'].setValue(false);
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['allowEditCustomer'].setValue(false);
  }
  ngOnInit() {
  }
  addManagerOverride(){
    if (this.manager_override == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    }  else {
      this.manager_override.id = 0;
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

     
      this.common.showSpinner();
      this.api.postAPI("manageroverride", this.manager_override).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success',  data.displayMessage);
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
