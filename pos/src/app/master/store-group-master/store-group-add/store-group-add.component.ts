import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MStoreGroupMaster } from 'src/app/models/m-store-group-master';
import { MStoreGroupDetails } from 'src/app/models/m-store-group-details';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-store-group-add',
  templateUrl: './store-group-add.component.html',
  styleUrls: ['./store-group-add.component.css']
})
export class StoreGroupAddComponent implements OnInit {

  myForm: FormGroup;
  storeGroupMaster: MStoreGroupMaster;
  storeGroupDetails: Array<MStoreGroupDetails>
  productGroupList: Array<any>;

  user_details: MUserDetails = null;
  userid:number;

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
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      active: [true]
    });
    this.getStaticValues();
    this.storeGroupDetails = new Array<MStoreGroupDetails>();
    this.storeGroupMaster = new MStoreGroupMaster();
    this.getProductGroupList();
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
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getProductGroupList() {
    this.productGroupList = null;
    this.common.showSpinner();
    this.api.getAPI("productgroup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.productGroupList = data.productGroupList;
            this.storegrouplistmap();
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  storegrouplistmap() {
    for (let productgroup of this.productGroupList) {
      let tempstoregroupdetails: MStoreGroupDetails = {
        productGroupID: productgroup.id,
        productGroupCode: productgroup.productGroupCode,
        productGroupName: productgroup.productGroupName,
        min: 0,
        max: 0,
        avg: 0,
        createBy:this.userid
      }
      this.storeGroupDetails.push(tempstoregroupdetails);
    }
  }

  ngOnInit(): void {
  }
  addStoreGroup() {
    if (this.storeGroupMaster == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else {
      this.storeGroupMaster.id = 0;
      this.storeGroupMaster.storeGroupCode = this.myForm.get('code').value;
      this.storeGroupMaster.storeGroupName = this.myForm.get('name').value;
      this.storeGroupMaster.description = this.myForm.get('description').value;
      this.storeGroupMaster.active = this.myForm.get('active').value;
      this.storeGroupMaster.storeGroupDetailsList = this.storeGroupDetails;
      this.storeGroupMaster.createBy=this.userid;
      this.common.showSpinner();
      this.api.postAPI("storegroup", this.storeGroupMaster).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['store-group']);
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
  close() {    
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['store-group']);
          }  
        } 
      else
        {
          this.router.navigate(['store-group']);
        }
  }
  clear_controls(){
    this.myForm.controls['code'].setValue('');
    this.myForm.controls['name'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['active'].setValue(true);
    for(let storedetail of this.storeGroupDetails)
    {
      storedetail.min=0;
      storedetail.max=0;
      storedetail.avg=0;
    }
  }
}
