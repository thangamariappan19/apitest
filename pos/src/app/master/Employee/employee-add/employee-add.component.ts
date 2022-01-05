import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MEmployeeMaster } from 'src/app/models/m-employee-master';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { ApiService } from 'src/app/api.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  myForm: FormGroup;
  country_list: Array<any>;
  store_List: Array<any>;
  designation_List: Array<any>;
  role_List: Array<any>;
  role_Name: string;
  designation_Name: string;
  countryCode: string;
  storeCode: string;
  storename: string;
  businessdate: Date;
  documentTypeDetailId: number;
  employee: MEmployeeMaster;
  employee_image: any;
  temp_image: string = "assets/img/preview-image.png";
  @ViewChild('fileInput1')
  myFileInput1: ElementRef;

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
      employeeCode: ['', Validators.required],
      employeeName: ['', Validators.required],
      roleName: ['', Validators.required],
      designationID: ['', Validators.required],
      countryID: ['', Validators.required],
      storeID: ['', Validators.required],
      doj: [''],
      salary: [''],
      address: [''],
      phoneno: [''],
      remarks: [''],
      active: [true],
      fileInput1:['']
    });
    this.clear_controls();
    this.employee_image="assets/img/preview-image.png";
  }

  clear_controls() {



    this.myForm.controls['employeeCode'].setValue('');
    this.myForm.controls['employeeName'].setValue('');
    this.myForm.controls['roleName'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['designationID'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['storeID'].setValue('');
    this.myForm.controls['doj'].setValue('');
    this.myForm.controls['salary'].setValue('');
    this.myForm.controls['address'].setValue('');
    this.myForm.controls['phoneno'].setValue('');
    this.myForm.controls['remarks'].setValue('');

    if(this.employee_image!=null)
    {
      this.myFileInput1.nativeElement.value = '';
      this.employee_image = null;
      }
    this.getCountryList();
    // this.getStoreList();
    this.getRoleList();
    this.getDesignationList();
    this.employee = new MEmployeeMaster();
  }

  getDesignationList() {
    this.common.showSpinner();
    this.api.getAPI("designation")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.designation_List = data.designationMasterList;
           // .log(this.designation_List);
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

  getRoleList() {
    this.common.showSpinner();
    this.api.getAPI("role")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.role_List = data.roleMasterList;
           // .log(this.role_List);
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

  getStoreList() {
    this.store_List = null;
    this.myForm.controls['storeID'].setValue('');
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
    this.common.showSpinner();
    this.api.getAPI("store?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

            this.store_List = data.storeMasterList;
           // .log(this.store_List);
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

  getCountryList() {
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.country_list = data.countryMasterList;
           // .log(this.country_list);
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
  }
  store() {
    if (this.store_List != null && this.store_List.length > 0) {
      for (let store of this.store_List) {
        if (store.id == this.myForm.get('storeID').value) {
          this.storeCode = store.storeCode;
          break;
        }
      }
    }
  }
  designation() {
    if (this.designation_List != null && this.designation_List.length > 0) {
      for (let designation of this.designation_List) {
        if (designation.id == this.myForm.get('designationID').value) {
          this.designation_Name = designation.designationName;
          break;
        }
      }
    }
  }
  role() {
    if (this.role_List != null && this.role_List.length > 0) {
      for (let role of this.role_List) {
        if (role.id == this.myForm.get('roleName').value) {
          this.role_Name = role.roleName;
          break;
        }
      }
    }
  }
 
  add_employee() {
    if (this.employee == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    } else {
      this.employee.id = 0;
      this.employee.employeeCode = this.myForm.get('employeeCode').value;
      this.employee.employeeName = this.myForm.get('employeeName').value;
      this.employee.roleName = this.role_Name;
      this.employee.dateofJoining = this.myForm.get('doj').value;
      if(this.employee.dateofJoining.toString()=="")
      {
        this.employee.dateofJoining=new Date();
      }
      this.employee.salary = this.myForm.get('salary').value;
      this.employee.address = this.myForm.get('address').value;
      this.employee.remarks = this.myForm.get('remarks').value;
      this.employee.phoneNo = this.myForm.get('phoneno').value;
      this.employee.isSelection = this.myForm.get('active').value;
      this.employee.active = this.myForm.get('active').value;
      this.employee.designation = this.designation_Name;
      this.employee.employeeImage = this.employee_image;
      this.employee.countryID = this.myForm.get('countryID').value;
      this.employee.countryCode = this.countryCode;
      this.employee.storeID = this.myForm.get('storeID').value;
      this.employee.storeCode = this.storeCode;

     // .log(this.employee);
      this.common.showSpinner();
      this.api.postAPI("employee", this.employee).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['../home']);
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
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['Employee']);
      }
    }
    else {
      this.router.navigate(['Employee']);
    }
  }
  public picked1(event, field) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.employee_image = file;
      this.handleInputChange1(file); //turn into base64

    }
    else {
      alert("No file selected");
    }
  }
  handleInputChange1(files) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded1.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded1(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.employee_image ="data:image/png;base64"+","+ base64result;
  }

  picked($event) { }
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
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPress1(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  delEmployeeImage()
  {
    if(this.employee_image!=null)
    {
      this.myFileInput1.nativeElement.value = '';
      this.employee_image=null;    
      this.employee_image="assets/img/preview-image.png";
    }
  }
}