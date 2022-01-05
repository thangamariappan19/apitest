import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MTaxMaster } from 'src/app/models/m-tax-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-tax-add',
  templateUrl: './tax-add.component.html',
  styleUrls: ['./tax-add.component.css']
})
export class TaxAddComponent implements OnInit {
  myForm: FormGroup;
  tax: MTaxMaster;
  taxList: Array<MTaxMaster>;
  user_details: MUserDetails = null;
  id : any;

  constructor(
    private api: ApiService,
      private common: CommonService,
      private fb:FormBuilder,
      private confirm: ConfirmService,
      public router:Router
  ) { 
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      taxCode: ['', Validators.required],
      taxPercentage: ['', Validators.required],
      sales: [false],
      purchase:[false],
      inclusiveTax:[false],
      active:[true]
  
    });
    this.taxList = new Array<MTaxMaster>()
    this.clear_controls();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
     // .log(this.user_details);
    }

    if (this.user_details == null) {
      this.common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
  }
  clear_controls(){
    this.tax = new MTaxMaster();
    this.myForm.controls['taxCode'].setValue('');
    this.myForm.controls['taxPercentage'].setValue('');
    this.myForm.controls['sales'].setValue(false);
    this.myForm.controls['purchase'].setValue(false);
    this.myForm.controls['inclusiveTax'].setValue(false);
    this.myForm.controls['active'].setValue(true);
  }
  addTax(){
    this.addTaxList();
    if (this.taxList == null) {
      this.common.showMessage("warn", "Can not Save, Role Details are invalid.");
    }  else {      
     
      this.common.showSpinner();
      this.api.postAPI("tax", this.taxList).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Role saved successfully.');
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
  addTaxList()
  {this.taxList = new Array<MTaxMaster>();
    let temptaxcode:MTaxMaster = {    
      id:this.id,
      taxCode:this.myForm.get('taxCode').value,
      taxPercentage:this.myForm.get('taxPercentage').value,
      sales:this.myForm.get('sales').value,
      purchase:this.myForm.get('purchase').value,
      inclusiveTax:this.myForm.get('inclusiveTax').value,
      active:this.myForm.get('active').value ,
      createBy:this.user_details.id
      
    }      
    this.taxList.push(temptaxcode);
  }
 
  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['tax']);
    }  
    } 
    else
    {
      this.router.navigate(['tax']);
  }
    }
  ngOnInit() {
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
  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  TaxPercentChange(){
    let per = this.myForm.get('taxPercentage').value;
    if(per>100)
    {
      this.myForm.controls['taxPercentage'].setValue('');
      this.common.showMessage("warn", "Can not Save, Tax Percentage should not exceed 100%.");
    }
  }
}
