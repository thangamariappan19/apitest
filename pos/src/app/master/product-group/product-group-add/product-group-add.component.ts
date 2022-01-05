import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MProductgroupMaster } from 'src/app/models/m-productgroup-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-product-group-add',
  templateUrl: './product-group-add.component.html',
  styleUrls: ['./product-group-add.component.css']
})
export class ProductGroupAddComponent implements OnInit {

  myForm: FormGroup;
  productgroup: MProductgroupMaster;

  user_details: MUserDetails = null;
  userid:number;


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
      productGroupCode: ['',Validators.required],
      productGroupName: ['',Validators.required],
      description: [''],
      active: [false]
    });
    this.getStaticValues();
    this.clear_controls();
  }
  clear_controls(){
    this.productgroup = new MProductgroupMaster();
    this.myForm.controls['productGroupCode'].setValue('');
    this.myForm.controls['productGroupName'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;      
    }
  }
  restrictSpecialChars(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      || (k >= 48 && k <= 57));
  }
  addProductGroup(){
    if (this.productgroup == null) {
      this.common.showMessage("warn", "Can not Save, Product Group Details are invalid.");
    }  else {
      this.productgroup.id = 0;
      this.productgroup.productGroupCode = this.myForm.get('productGroupCode').value;
      this.productgroup.productGroupName = this.myForm.get('productGroupName').value;
      this.productgroup.description = this.myForm.get('description').value;
      this.productgroup.active = this.myForm.get('active').value;  
      this.productgroup.createBy=this.userid;    
     // .log(this.productgroup);
      this.common.showSpinner();
      this.api.postAPI("productgroup", this.productgroup).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['product-group']);
        } 
        else if(data != null && data.statusCode != null && data.statusCode == 2){
          this.common.hideSpinner();
          this.common.showMessage('', data.displayMessage);
        }  
        else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  close(){
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['product-group']);
          }  
        } 
      else
        {
          this.router.navigate(['product-group']);
        }
  }
}
