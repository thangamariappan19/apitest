import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MProductgroupMaster } from 'src/app/models/m-productgroup-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-product-group-edit',
  templateUrl: './product-group-edit.component.html',
  styleUrls: ['./product-group-edit.component.css']
})
export class ProductGroupEditComponent implements OnInit {

  myForm: FormGroup;
  productgroup: MProductgroupMaster;
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
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getProductGroup();
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
  getProductGroup(){
    this.common.showSpinner();
    this.api.getAPI("productgroup?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['productGroupCode'].setValue(data.productGroupData.productGroupCode);
            this.myForm.controls['productGroupName'].setValue(data.productGroupData.productGroupName);
            this.myForm.controls['description'].setValue(data.productGroupData.description);
            this.myForm.controls['active'].setValue(data.productGroupData.active);
            //.log(this.company_list);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  updateProductGroup(){
    if (this.productgroup == null) {
      this.common.showMessage("warn", "Can not Save, Language Details are invalid.");
    }  else {
      this.productgroup.id = this.id;
      this.productgroup.productGroupCode = this.myForm.get('productGroupCode').value;
      this.productgroup.productGroupName = this.myForm.get('productGroupName').value;
      this.productgroup.description = this.myForm.get('description').value;
      this.productgroup.active = this.myForm.get('active').value;
      this.productgroup.updateBy=this.userid;       
     // .log(this.productgroup);
      this.common.showSpinner();
      this.api.putAPI("productgroup", this.productgroup).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['product-group']);
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
        this.router.navigate(['product-group']);
          }  
        } 
      else
        {
          this.router.navigate(['product-group']);
        }
  }
}
