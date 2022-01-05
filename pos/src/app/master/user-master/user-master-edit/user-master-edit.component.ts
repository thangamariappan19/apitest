import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MUserMaster } from 'src/app/models/m-user-master';
import { MRoleMaster } from 'src/app/models/m-role-master';

@Component({
  selector: 'app-user-master-edit',
  templateUrl: './user-master-edit.component.html',
  styleUrls: ['./user-master-edit.component.css']
})
export class UserMasterEditComponent implements OnInit {
  myForm: FormGroup;
  user: MUserMaster;
  id: any;
  employee_list: Array<any>;
  employeeCode: string;
  role_list: Array<MRoleMaster>;
  role_Code: string;
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
    public router: Router,
    private activatedRoute: ActivatedRoute
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
      active: [false],
      passwordReset: [false],
      allowStockEdit: [false],
      mobileUser: [false],
      Confirmpassword:['',Validators.required]
    });
    // this.getEmployees();
    // this.getRoles();
    // this.getManageroverride();
    // this.getRetailsettings();
    this.clear_controls();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.getEmployees();
    // this.getRoles();
    // this.getManageroverride();
    // this.getRetailsettings();
    // this.getUser();
    this.common.showSpinner();
    this.getEmployees()
      .then((emp) => {
        this.getRoles()
          .then((role) => {
            this.getManageroverride()
              .then((ord) => {
                this.getRetailsettings()
                  .then((rst) => {
                    this.getUser()
                      .then((usr) => {
                        this.common.hideSpinner();
                      }).catch((err5) => {
                        this.common.showMessage('warn', err5);
                        this.common.hideSpinner();
                      });
                  }).catch((err4) => {
                    this.common.showMessage('warn', err4);
                    this.common.hideSpinner();
                  });
              }).catch((err3) => {
                this.common.showMessage('warn', err3);
                this.common.hideSpinner();
              });
          }).catch((err2) => {
            this.common.showMessage('warn', err2);
            this.common.hideSpinner();
          });
      }).catch((err) => {
        this.common.showMessage('warn', err);
        this.common.hideSpinner();
      });
  }

  getEmployees() {
    return new Promise((resolve, reject) => {
      this.employee_list = null;
      // this.common.showSpinner();
      this.api.getAPI("EmployeeMasterLookUp")
        .subscribe((data) => {
          // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.employee_list = data.employeeList;
            // .log(this.employee_list);
            resolve(data.employeeList);
          }
          else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            // this.common.showMessage('warn', msg);
            reject(msg);
          }
          // this.common.hideSpinner();
          // }, this.common.time_out_delay);
        });
    });

  }

  getRoles() {
    return new Promise((resolve, reject) => {
      this.role_list = null;
      // this.common.showSpinner();
      this.api.getAPI("role")
        .subscribe((data) => {
          // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.role_list = data.roleMasterList;
            // .log(this.role_list);
            resolve(data.roleMasterList);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            // this.common.showMessage('warn', msg);
            reject(msg);
          }
          // this.common.hideSpinner();
          // }, this.common.time_out_delay);
        });
    });

  }

  getManageroverride() {
    return new Promise((resolve, reject) => {
      this.manager_override_list = null;
      // this.common.showSpinner();
      this.api.getAPI("manageroverride")
        .subscribe((data) => {
          // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.manager_override_list = data.responseDynamicData;
            // .log(this.manager_override_list);
            resolve(data.responseDynamicData);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            // this.common.showMessage('warn', msg);
            reject(msg);
          }
          // this.common.hideSpinner();
          // }, this.common.time_out_delay);
        });
    });

  }

  getRetailsettings() {
    return new Promise((resolve, reject) => {
      this.retailsettings_list = null;
      // this.common.showSpinner();
      this.api.getAPI("retailsettings")
        .subscribe((data) => {
          // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.retailsettings_list = data.responseDynamicData;
            // .log(this.retailsettings_list);
            resolve(data.responseDynamicData);

          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            // this.common.showMessage('warn', msg);
            reject(msg);
          }
          // this.common.hideSpinner();
          // }, this.common.time_out_delay);
        });
    });

  }

  getUser() {
    return new Promise((resolve, reject) => {
      // this.common.showSpinner();
      this.api.getAPI("usermaster?ID=" + this.id)
        .subscribe((data) => {
          // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // let temp = this.common.decrypt(data.usersRecord.password);
            // console.log(data.usersRecord.password);
            // console.log(temp);
            try {
              debugger;
              this.myForm.controls['userCode'].setValue(data.usersRecord.userCode);
              this.myForm.controls['userName'].setValue(data.usersRecord.userName);

              this.myForm.controls['employeeID'].setValue(data.usersRecord.employeeID);
              this.myForm.controls['roleID'].setValue(data.usersRecord.roleID);
              // this.getManageroverride();
              this.myForm.controls['managerOverrideID'].setValue(data.usersRecord.managerOverrideID);
              this.myForm.controls['retailSettingsID'].setValue(data.usersRecord.retailID);
              this.myForm.controls['active'].setValue(data.usersRecord.active);
              this.myForm.controls['passwordReset'].setValue(data.usersRecord.passwordReset);
              this.myForm.controls['allowStockEdit'].setValue(data.usersRecord.allowStockEdit);
              this.myForm.controls['mobileUser'].setValue(data.usersRecord.mobileUser);
              this.employeeCode = data.usersRecord.employeeCode;
              this.role_Code = data.usersRecord.roleCode;
              this.retailCode = data.usersRecord.retailSettingCode;
              this.manageroverrideCode = data.usersRecord.managerOverrideCode;
              this.myForm.controls['password'].setValue(this.common.decrypt(data.usersRecord.password));
              this.myForm.controls['Confirmpassword'].setValue(this.common.decrypt(data.usersRecord.password));
            }
            catch (err) {
              this.common.showMessage('info', 'Please Change your Password.');

            }
            resolve(data.usersRecord);

            // console.log(this.common.decrypt(data.usersRecord.password));
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            // this.common.showMessage('warn', msg);
            reject(msg);
          }
          // this.common.hideSpinner();
          // }, this.common.time_out_delay);
        });
    });

  }

  clear_controls() {
    this.user = new MUserMaster();
  }




  update_user() {
    this.getRoleCode();
    if (this.user == null) {
      this.common.showMessage("warn", "Can not Save, User is invalid.");
    } 
    else if (this.myForm.get('password').value != this.myForm.get('Confirmpassword').value) 
    {
      this.common.showMessage("info", "Password and Confirm Password must be match.");
    }
    else {
      this.user.id = this.id;
      this.user.userCode = this.myForm.get('userCode').value;
      this.user.userName = this.myForm.get('userName').value;
      this.user.password = this.common.encrypt(this.myForm.get('password').value);
      this.user.employeeID = this.myForm.get('employeeID').value;
      this.user.roleID = this.myForm.get('roleID').value;

      this.user.managerOverrideID = this.myForm.get('managerOverrideID').value;
      this.user.retailID = this.myForm.get('retailSettingsID').value;
      this.user.active = this.myForm.get('active').value;
      this.user.passwordReset = this.myForm.get('passwordReset').value;
      this.user.allowStockEdit = this.myForm.get('allowStockEdit').value;
      this.user.mobileUser = this.myForm.get('mobileUser').value;
      this.user.employeeCode = this.employeeCode;
      this.user.retailSettingCode = this.retailCode;
      this.user.managerOverrideCode = this.manageroverrideCode;
      this.user.roleCode = this.role_Code;

      // .log(this.user);
      this.common.showSpinner();
      this.api.putAPI("usermaster", this.user).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Year saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['user-master']);
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
      this.role_Code = role.roleCode;
      this.roleID = role.id;
    }
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


  rolecode() {
    if (this.role_list != null && this.role_list.length > 0) {
      for (let role of this.role_list) {
        if (role.id == this.myForm.get('roleID').value) {
          this.role_Code = role.roleCode;
          break;
        }
      }
    }
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
