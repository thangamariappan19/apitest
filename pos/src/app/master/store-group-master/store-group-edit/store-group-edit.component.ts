import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MStoreGroupMaster } from 'src/app/models/m-store-group-master';
import { MStoreGroupDetails } from 'src/app/models/m-store-group-details';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-store-group-edit',
  templateUrl: './store-group-edit.component.html',
  styleUrls: ['./store-group-edit.component.css']
})
export class StoreGroupEditComponent implements OnInit {

  myForm: FormGroup;
  storeGroupMaster: MStoreGroupMaster;
  storeGroupDetails: Array<MStoreGroupDetails>
  productGroupList: Array<any>;
  id:any;

  user_details: MUserDetails = null;
  userid:number;
  
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
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      active: [true]
    });
    this.getStaticValues();
    this.storeGroupDetails = new Array<MStoreGroupDetails>();
    this.storeGroupMaster = new MStoreGroupMaster();
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSubCollectionDate();
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
  getSubCollectionDate(){
    this.common.showSpinner();
    this.api.getAPI("storegroup?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['code'].setValue(data.storeGroupMasterRecord.storeGroupCode);
            this.myForm.controls['name'].setValue(data.storeGroupMasterRecord.storeGroupName);
            this.myForm.controls['description'].setValue(data.storeGroupMasterRecord.description);
            this.myForm.controls['active'].setValue(data.storeGroupMasterRecord.active);
            this.storeGroupDetails = data.storeGroupMasterRecord.storeGroupDetailsList;
           // .log(this.storeGroupDetails);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  updateStoreGroup() {
    if (this.storeGroupMaster == null) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    } else {
      this.storeGroupMaster.id = this.id;
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
          this.common.showMessage('success', 'Store Group Updated successfully.');
          //this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['store-group']);
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

}
