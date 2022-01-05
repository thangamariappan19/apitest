import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MRoleMaster } from 'src/app/models/m-role-master';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css']
})
export class RoleAddComponent implements OnInit {
  myForm: FormGroup;
  role: MRoleMaster;

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
      roleCode: ['', Validators.required],
      roleName: ['', Validators.required],
      remarks: [''],
      active:[false]
  
    });
    this.clear_controls();
  }
  clear_controls(){
    this.role = new MRoleMaster();
    this.myForm.controls['roleCode'].setValue('');
    this.myForm.controls['roleName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }
  addRole(){
    if (this.role == null) {
      this.common.showMessage("warn", "Can not Save, Role Details are invalid.");
    }  else {
      this.role.id = 0;
      this.role.roleCode = this.myForm.get('roleCode').value;
      this.role.roleName = this.myForm.get('roleName').value;
      this.role.remarks = this.myForm.get('remarks').value;
      this.role.active = this.myForm.get('active').value;      
     // .log(this.role);
      this.common.showSpinner();
      this.api.postAPI("role", this.role).subscribe((data) => {
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

  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['role']);
    }  
    } 
    else
    {
      this.router.navigate(['role']);
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
}
