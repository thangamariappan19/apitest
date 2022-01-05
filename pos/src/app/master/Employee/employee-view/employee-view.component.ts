import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MEmployeeMaster } from 'src/app/models/m-employee-master';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { ApiService } from 'src/app/api.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent implements OnInit {

  id: any;
  employeeCode : string;
  employeeName : string;
  countryCode : string;
  designation_Name : string;
  role_Name : string;
  storeCode : string;
  salary : string;
  phoneNo : string;
  remarks : string;         
  employee_image : any;
  active: any;
  current_store_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    //this.createForm();
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.GetEmployeeData();
  }

  GetEmployeeData(){
    this.common.showSpinner();
    this.api.getAPI("employee?id=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.employeeCode = data.employeeMasterRecord.employeeCode;
            this.employeeName = data.employeeMasterRecord.employeeName;
            this.countryCode = data.employeeMasterRecord.countryCode;
            this.designation_Name = data.employeeMasterRecord.designation;
            this.role_Name = data.employeeMasterRecord.roleName;
            this.storeCode = data.employeeMasterRecord.storeCode;
            this.salary = data.employeeMasterRecord.salary;
            this.phoneNo = data.employeeMasterRecord.phoneNo;
            this.remarks = data.employeeMasterRecord.remarks;            
            this.employee_image=data.employeeMasterRecord.employeeImage;
            if(data.employeeMasterRecord.active==true){
              this.active="ACTIVE";
            }else{
              this.active="INACTIVE";
            }
            this.current_store_image = data.employeeMasterRecord.employeeImage == null || data.employeeMasterRecord.employeeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.employeeMasterRecord.employeeImage;
            
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

}
