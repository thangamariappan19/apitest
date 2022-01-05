import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MPaymentModeMaster } from 'src/app/models/m-payment-mode-master';

@Component({
  selector: 'app-payment-mode-add',
  templateUrl: './payment-mode-add.component.html',
  styleUrls: ['./payment-mode-add.component.css']
})
export class PaymentModeAddComponent implements OnInit {
  myForm: FormGroup;
  paymentmodeMaster: MPaymentModeMaster;
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
      PaymentmodeCode: ['', Validators.required],
      PaymentModeName:['',Validators.required],
      SortOrder: ['', Validators.required],
      remarks:[''],
      active:[true]
      
    });
    // this.getStaticValues();
    this.clear_controls();
    
  }
  ngOnInit(): void {
  }
  clear_controls()
  {
    this.paymentmodeMaster = new MPaymentModeMaster();
    this.myForm.controls['PaymentmodeCode'].setValue('');
    this.myForm.controls['PaymentModeName'].setValue('');
    this.myForm.controls['SortOrder'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  addPaymentmode()
  {
    this.paymentmodeMaster.paymentModeCode=this.myForm.get('PaymentmodeCode').value;
    this.paymentmodeMaster.paymentModeName=this.myForm.get('PaymentModeName').value;
    this.paymentmodeMaster.sortOrder=this.myForm.get('SortOrder').value;
    this.paymentmodeMaster.remarks=this.myForm.get('remarks').value;
    this.paymentmodeMaster.active = this.myForm.get('active').value;
    this.common.showSpinner();
      this.api.postAPI("PaymentModeMaster", this.paymentmodeMaster).subscribe((data) => {
      
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
  
  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['payment-mode-master']);
          }  
        } 
      else
        {
          this.router.navigate(['payment-mode-master']);
        }
  }  

  restrictIntegers(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return (
      // (k > 64 && k < 91)
      // || (k > 96 && k < 123)
      // || 
      k == 8
      || k == 32
      // || k == 45 
      // || k == 47
      // || k == 95
      || (k >= 48 && k <= 57)
    );
  }
}
