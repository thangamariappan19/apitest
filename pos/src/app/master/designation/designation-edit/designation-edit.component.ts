import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MDesignationMaster } from 'src/app/models/m-designation-master';
import { min } from 'rxjs/operators';

@Component({
  selector: 'app-designation-edit',
  templateUrl: './designation-edit.component.html',
  styleUrls: ['./designation-edit.component.css']
})
export class DesignationEditComponent implements OnInit {
  myForm: FormGroup;
  RoleList: Array<any>;
  designation: MDesignationMaster;
  roleName: any;
  role_Code: any;
  id: any;
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
      designationCode: ['', Validators.required],
      designationName: ['', Validators.required],
      RoleID: [null, Validators.required],
      description: [''],
      remarks: [''],
      active: [false]

    });
    this.clear_controls();
  }
  clear_controls() {
    this.getRoleMasterList();
    this.designation = new MDesignationMaster();
  }
  getRoleMasterList() {
    this.RoleList = null;
    this.common.showSpinner();
    this.api.getAPI("RoleMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.RoleList = data.roleMasterList;
           // this.RoleList = this.RoleList.filter(x => x.active == true);
           // .log(this.RoleList);
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

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getDesignationData();
  }
  getDesignationData() {
    this.common.showSpinner();
    this.api.getAPI("designation?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['designationCode'].setValue(data.designationMasterRecord.designationCode);
            this.myForm.controls['designationName'].setValue(data.designationMasterRecord.designationName);
            if(data.designationMasterRecord.roleId > 0)
              this.myForm.controls['RoleID'].setValue(data.designationMasterRecord.roleId);
            this.myForm.controls['description'].setValue(data.designationMasterRecord.description);
            this.myForm.controls['remarks'].setValue(data.designationMasterRecord.remarks);
            this.myForm.controls['active'].setValue(data.designationMasterRecord.active);
            this.roleName = data.designationMasterRecord.roleName;
            this.role_Code = data.designationMasterRecord.roleCode;

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

  rolecode() {
    if (this.RoleList != null && this.RoleList.length > 0) {
      for (let role of this.RoleList) {
        if (role.id == this.myForm.get('RoleID').value) {
          this.role_Code = role.roleCode;
          this.roleName = role.roleName;
          break;
        }
      }
    }
  }

  updateDesignation() {
    if (this.designation == null) {
      this.common.showMessage("warn", "Can not Update, Designation Details are invalid.");
    } else {
      this.designation.id = this.id;
      this.designation.designationCode = this.myForm.get('designationCode').value;
      this.designation.designationName = this.myForm.get('designationName').value;
      this.designation.roleId = this.myForm.get('RoleID').value;
      this.designation.roleCode = this.role_Code;
      this.designation.roleName = this.roleName;
      this.designation.description = this.myForm.get('description').value;
      this.designation.remarks = this.myForm.get('remarks').value;
      this.designation.active = this.myForm.get('active').value;
     // .log(this.designation);
      this.common.showSpinner();
      this.api.putAPI("designation", this.designation).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['designation']);
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
        this.router.navigate(['designation']);
    }  
    } 
    else
    {
      this.router.navigate(['designation']);
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
