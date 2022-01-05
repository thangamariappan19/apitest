import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCustomerGroup } from 'src/app/models/m-customer-group';

@Component({
  selector: 'app-customer-group-edit',
  templateUrl: './customer-group-edit.component.html',
  styleUrls: ['./customer-group-edit.component.css']
})
export class CustomerGroupEditComponent implements OnInit {
  myForm: FormGroup;
  customerGroup: MCustomerGroup;
  id : any;
  constructor(
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router ,
    private activatedRoute:ActivatedRoute
  ) { this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      groupCode: ['', Validators.required],
      groupName: ['', Validators.required],
      discountPercentage: ['',Validators.max(100)],
      remarks: [''],
      active:[false]
  
    });
    this.clear_controls();
  }
  clear_controls(){
    this.customerGroup = new MCustomerGroup();
    /*this.myForm.controls['groupCode'].setValue('');
    this.myForm.controls['groupName'].setValue('');
    this.myForm.controls['discountPercentage'].setValue(0);
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(false);*/
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getcustomerGroupData();
  }
  getcustomerGroupData(){
    this.common.showSpinner();
    this.api.getAPI("customergroup?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['groupCode'].setValue(data.responseDynamicData.groupCode);
            this.myForm.controls['groupName'].setValue(data.responseDynamicData.groupName);
            this.myForm.controls['discountPercentage'].setValue(data.responseDynamicData.discountPercentage);
            this.myForm.controls['remarks'].setValue(data.responseDynamicData.remarks);
            this.myForm.controls['active'].setValue(data.responseDynamicData.active);
           
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
  updateCustomerGroup(){
    if (this.customerGroup == null) {
      this.common.showMessage("warn", "Can not Update, Customer Group are invalid.");
    }  else {
      this.customerGroup.id = this.id;
      this.customerGroup.groupCode = this.myForm.get('groupCode').value;
      this.customerGroup.groupName = this.myForm.get('groupName').value;
      this.customerGroup.discountPercentage =this.myForm.get('discountPercentage').value;
      this.customerGroup.remarks = this.myForm.get('remarks').value;
      this.customerGroup.active = this.myForm.get('active').value;      
     // .log(this.customerGroup);
      this.common.showSpinner();
      this.api.putAPI("customergroup", this.customerGroup).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['customer-group']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Update.');
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
