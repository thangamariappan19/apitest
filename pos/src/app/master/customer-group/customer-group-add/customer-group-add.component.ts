import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCustomerGroup } from 'src/app/models/m-customer-group';

@Component({
  selector: 'app-customer-group-add',
  templateUrl: './customer-group-add.component.html',
  styleUrls: ['./customer-group-add.component.css']
})
export class CustomerGroupAddComponent implements OnInit {
  myForm: FormGroup;
  customerGroup: MCustomerGroup;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb:FormBuilder,
    private confirm: ConfirmService,
    public router:Router
  ) {this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      groupCode: ['', Validators.required],
      groupName: ['', Validators.required],
      discountPercentage: ['',Validators.max(100)],
      remarks: [''],
      active:[false]
  
    });
    this.customerGroup = new MCustomerGroup();
    this.clear_controls();
  }
  clear_controls(){    
    this.myForm.controls['groupCode'].setValue('');
    this.myForm.controls['groupName'].setValue('');
    this.myForm.controls['discountPercentage'].setValue(0);
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }
  addCustomerGroup(){
    if (this.customerGroup == null) {
      this.common.showMessage("warn", "Can not Save, Customer Group are invalid.");
    }  else {
      this.customerGroup.id = 0;
      this.customerGroup.groupCode = this.myForm.get('groupCode').value;
      this.customerGroup.groupName = this.myForm.get('groupName').value;
      this.customerGroup.discountPercentage =this.myForm.get('discountPercentage').value;
      this.customerGroup.remarks = this.myForm.get('remarks').value;
      this.customerGroup.active = this.myForm.get('active').value;      
     // .log(this.customerGroup);
      this.common.showSpinner();
      this.api.postAPI("customergroup", this.customerGroup).subscribe((data) => {
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
        this.router.navigate(['customer-group']);
    }  
    } 
    else
    {
      this.router.navigate(['customer-group']);
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
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
