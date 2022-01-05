import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserMaster } from 'src/app/models/m-user-master';
import { MRoleMaster } from 'src/app/models/m-role-master';


@Component({
  selector: 'app-user-master-add',
  templateUrl: './user-master-add.component.html',
  styleUrls: ['./user-master-add.component.css']
})
export class UserMasterAddComponent implements OnInit {
  myForm: FormGroup;
  user: MUserMaster;
  id: any;
  employee_list: Array<any>;
  employeeCode: string;
  role_list: Array<MRoleMaster>;
  roleCode: string;
  manager_override_list: Array<any>;
  manageroverrideCode: string;
  retailsettings_list: Array<any>;
  retailCode: string;
  roleID: any;
  hide = true;
  hide1=true;

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
      userCode: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      employeeID: ['', Validators.required],
      roleID: [''],
      managerOverrideID: ['', Validators.required],
      retailSettingsID: ['', Validators.required],
      active: [true],
      passwordReset: [false],
      allowStockEdit: [false],
      mobileUser: [false],
      Confirmpassword:['',Validators.required]
    });
    this.getEmployees();
    this.getRoles();
    this.getManageroverride();
    this.getRetailsettings();
    this.clear_controls();
  }
  ngOnInit(){
    
  }
  clear_controls() {
    this.user = new MUserMaster();
    this.myForm.controls['userCode'].setValue('');
    this.myForm.controls['userName'].setValue('');
    this.myForm.controls['password'].setValue('');
    this.myForm.controls['employeeID'].setValue('');
    this.myForm.controls['roleID'].setValue(0);
    this.myForm.controls['managerOverrideID'].setValue('');
    this.myForm.controls['retailSettingsID'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['passwordReset'].setValue('');
    this.myForm.controls['allowStockEdit'].setValue('');
    this.myForm.controls['mobileUser'].setValue('');
    this.myForm.controls['Confirmpassword'].setValue('');
  }
  addUser() {
    this.getRoleCode();
    if (this.user == null) {
      this.common.showMessage("warn", "Can not Save, Role Details are invalid.");
    }
    else if (this.myForm.get('password').value != this.myForm.get('Confirmpassword').value) 
    {
      this.common.showMessage("info", "Password and Confirm Password must be match.");
    }
    else {
      this.user.id = 0;
      this.user.userCode = this.myForm.get('userCode').value;
      this.user.userName = this.myForm.get('userName').value;
      this.user.password = this.common.encrypt(this.myForm.get('password').value);
      this.user.employeeID = this.myForm.get('employeeID').value;
      this.user.roleID = this.roleID;
      this.user.managerOverrideID = this.myForm.get('managerOverrideID').value;
      this.user.retailID = this.myForm.get('retailSettingsID').value;
      this.user.active = this.myForm.get('active').value;
      this.user.passwordReset = this.myForm.get('passwordReset').value;
      this.user.allowStockEdit = this.myForm.get('allowStockEdit').value;
      this.user.mobileUser = this.myForm.get('mobileUser').value;
      this.user.employeeCode = this.employeeCode;
      this.user.retailSettingCode = this.retailCode;
      this.user.managerOverrideCode = this.manageroverrideCode;
      this.user.roleCode = this.roleCode;

     // .log(this.user);
      this.common.showSpinner();
      this.api.postAPI("usermaster", this.user).subscribe((data) => {
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
  getRoleCode() {
    let roleID = this.myForm.get('roleID').value;
    this.role_list = this.role_list.filter(x => x.roleName == roleID)
    for (let role of this.role_list) {
      this.roleCode = role.roleCode;
      this.roleID = role.id;
    }
  }
  getEmployees() {
    this.employee_list = null;
    this.common.showSpinner();
    this.api.getAPI("EmployeeMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.employee_list = data.employeeList;
           // .log(this.employee_list);
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
  empRolename() {
    if (this.employee_list != null && this.employee_list.length > 0) {
      for (let emp of this.employee_list) {
        if (emp.id == this.myForm.get('employeeID').value) {
          this.employeeCode = emp.employeeCode;
          this.myForm.get('roleID').setValue(emp.roleName);
          break;
        }
      }
    }
  }
  getRoles() {
    this.role_list = null;
    this.common.showSpinner();
    this.api.getAPI("role")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.role_list = data.roleMasterList;
           // .log(this.role_list);
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
  rolecode() {
    if (this.role_list != null && this.role_list.length > 0) {
      for (let role of this.role_list) {
        if (role.id == this.myForm.get('roleID').value) {
          this.roleCode = role.roleCode;
          break;
        }
      }
    }
  }
  getManageroverride() {
    this.manager_override_list = null;
    this.common.showSpinner();
    this.api.getAPI("manageroverride")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.manager_override_list = data.responseDynamicData;
           // .log(this.manager_override_list);
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
  manageroverridecode() {
    if (this.manager_override_list != null && this.manager_override_list.length > 0) {
      for (let mgrover of this.manager_override_list) {
        if (mgrover.id == this.myForm.get('managerOverrideID').value) {
          this.manageroverrideCode = mgrover.code;
          break;
        }
      }
    }
  }
  getRetailsettings() {
    this.retailsettings_list = null;
    this.common.showSpinner();
    this.api.getAPI("retailsettings")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.retailsettings_list = data.responseDynamicData;
           // .log(this.retailsettings_list);
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
  retailsettingscode() {
    if (this.retailsettings_list != null && this.retailsettings_list.length > 0) {
      for (let retset of this.retailsettings_list) {
        if (retset.id == this.myForm.get('retailSettingsID').value) {
          this.retailCode = retset.retailCode;
          break;
        }
      }
    }
  }
 
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['user-master']);
      }
    }
    else {
      this.router.navigate(['user-master']);
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
