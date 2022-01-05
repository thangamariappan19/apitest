import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MProductlineMaster } from 'src/app/models/m-productline-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-product-line-edit',
  templateUrl: './product-line-edit.component.html',
  styleUrls: ['./product-line-edit.component.css']
})
export class ProductLineEditComponent implements OnInit {

  myForm: FormGroup;
  productline: MProductlineMaster;
  id : any;

  
  user_details: MUserDetails = null;
  userid:number;

  constructor(
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router ,
    private activatedRoute:ActivatedRoute
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
    this.myForm.controls['active'].setValue(true)
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getProductLine();
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
  getProductLine(){
    this.common.showSpinner();
    this.api.getAPI("productline?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['productLineCode'].setValue(data.responseDynamicData.productLineCode);
            this.myForm.controls['productLineName'].setValue(data.responseDynamicData.productLineName);
            this.myForm.controls['description'].setValue(data.responseDynamicData.description);
            this.myForm.controls['active'].setValue(data.responseDynamicData.active);
            //.log(this.company_list);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  updateProductLine(){
    if (this.productline == null) {
      this.common.showMessage("warn", "Can not Save, Language Details are invalid.");
    }  else {
      this.productline.id = this.id;
      this.productline.productLineCode = this.myForm.get('productLineCode').value;
      this.productline.productLineName = this.myForm.get('productLineName').value;
      this.productline.description = this.myForm.get('description').value;
      this.productline.active = this.myForm.get('active').value;  
      this.productline.updateBy=this.userid;
     // .log(this.productline);
      this.common.showSpinner();
      this.api.putAPI("productline", this.productline).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['product-line']);
        } else {
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
