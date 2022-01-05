import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MProductlineMaster } from 'src/app/models/m-productline-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-product-line-add',
  templateUrl: './product-line-add.component.html',
  styleUrls: ['./product-line-add.component.css']
})
export class ProductLineAddComponent implements OnInit {
  
  myForm: FormGroup;
  productline: MProductlineMaster;

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
      productLineCode: ['',Validators.required],
      productLineName: ['',Validators.required],
      description: [''],
      active: [false]
    });
    this.getStaticValues();
    this.clear_controls();
  }
  clear_controls(){
    this.productline = new MProductlineMaster();
    this.myForm.controls['productLineCode'].setValue('');
    this.myForm.controls['productLineName'].setValue('');
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

  addProductLine(){
    if (this.productline == null) {
      this.common.showMessage("warn", "Can not Save, Product Group Details are invalid.");
    }  else {
      this.productline.id = 0;
      this.productline.productLineCode = this.myForm.get('productLineCode').value;
      this.productline.productLineName = this.myForm.get('productLineName').value;
      this.productline.description = this.myForm.get('description').value;
      this.productline.active = this.myForm.get('active').value;    
      this.productline.createBy=this.userid;
     // .log(this.productline);
      this.common.showSpinner();
      this.api.postAPI("productline", this.productline).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['product-line']);
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
        this.router.navigate(['product-line']);
          }  
        } 
      else
        {
          this.router.navigate(['product-line']);
        }
  }
}
