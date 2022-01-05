import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MExpensesMaster } from 'src/app/models/m-expenses-master';
import { empty } from 'rxjs';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-expense-master-edit',
  templateUrl: './expense-master-edit.component.html',
  styleUrls: ['./expense-master-edit.component.css']
})
export class ExpenseMasterEditComponent implements OnInit {
  
  myForm: FormGroup;
  id: any;
  expensesMaster: Array<MExpensesMaster>;
  user_details: MUserDetails = null;
  userid:number;

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { this.createForm(); }

  createForm() {
    this.myForm = this.fb.group({
      expenseCode: ['', Validators.required],
      expenseName: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.getStaticValues();
    this.expensesMaster = new Array<MExpensesMaster>();
    this.clear_controls();
  }
  clear_controls() {

    /*this.myForm.controls['expenseCode'].setValue('');
    this.myForm.controls['expenseName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);*/
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
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getexpenseData();
  }
  getexpenseData() {
    this.common.showSpinner();
    this.api.getAPI("expensemaster?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['expenseCode'].setValue(data.expenseMasterTypesList[0].expenseCode);
            this.myForm.controls['expenseName'].setValue(data.expenseMasterTypesList[0].expenseName);
            this.myForm.controls['remarks'].setValue(data.expenseMasterTypesList[0].remarks);
            this.myForm.controls['active'].setValue(data.expenseMasterTypesList[0].active);

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

  updateExpenseMaster() {
    this.addexpenseslist();
    if (this.expensesMaster == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    } else {

     // .log(this.expensesMaster);
      this.common.showSpinner();
      this.api.postAPI("ExpenseMaster", this.expensesMaster).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Updated successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['expense-master']);
        }               
        else {
          setTimeout(() => {
           // .log(data);
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
        this.router.navigate(['expense-master']);
          }  
        } 
      else
        {
          this.router.navigate(['expense-master']);
        }
  }

  addexpenseslist() {
    this.expensesMaster = new Array<MExpensesMaster>();
    let tempexpensesMaster: MExpensesMaster = {
      id: this.id,
      expenseCode: this.myForm.get('expenseCode').value,
      expenseName: this.myForm.get('expenseName').value,
      remarks: this.myForm.get('remarks').value,
      active: this.myForm.get('active').value,
      createBy: this.userid,
      updateBy: this.userid
    }
    this.expensesMaster.push(tempexpensesMaster);

  }

}
