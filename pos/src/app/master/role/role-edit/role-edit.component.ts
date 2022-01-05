import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MRoleMaster } from 'src/app/models/m-role-master';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.css']
})
export class RoleEditComponent implements OnInit {
  myForm: FormGroup;
  role: MRoleMaster;
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
      roleCode: ['', Validators.required],
      roleName: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.clear_controls();
  }

  clear_controls() {
    this.role = new MRoleMaster();
    this.myForm.controls['roleCode'].setValue('');
    this.myForm.controls['roleName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue('');
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getrole();
  }
  getrole() {
    this.common.showSpinner();
    this.api.getAPI("role?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['roleCode'].setValue(data.roleMasterRecord.roleCode);
            this.myForm.controls['roleName'].setValue(data.roleMasterRecord.roleName);
            this.myForm.controls['remarks'].setValue(data.roleMasterRecord.remarks);
            this.myForm.controls['active'].setValue(data.roleMasterRecord.active);

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
  update_role() {
    if (this.role == null) {
      this.common.showMessage("warn", "Can not Save, Year is invalid.");
    } else {
      this.role.id = this.id;
      this.role.roleCode = this.myForm.get('roleCode').value;
      this.role.roleName = this.myForm.get('roleName').value;
      this.role.remarks = this.myForm.get('remarks').value;
      this.role.active = this.myForm.get('active').value;

     // .log(this.role);
      this.common.showSpinner();
      this.api.putAPI("role", this.role).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Year saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['role']);
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
