import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MFranchiseMaster } from 'src/app/models/m-franchise-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-franchise-add',
  templateUrl: './franchise-add.component.html',
  styleUrls: ['./franchise-add.component.css']
})
export class FranchiseAddComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>; 
  franchise: MFranchiseMaster;

  
  constructor(private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router
  ) { this.createForm();} 

  createForm() {
    this.myForm = this.fb.group({    
      franchiseCode: ['',Validators.required],
      franchiseName: ['',Validators.required],     
      remarks:[''],
      active:[true]
  });
  this.clear_controls();
}
  clear_controls() { 
    this.franchise = new MFranchiseMaster();
    this.myForm.controls['franchiseCode'].setValue('');
    this.myForm.controls['franchiseName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }

  quickadd_franchise() {
    if (this.quickadd_franchise == null) {
      this.common.showMessage("warn", "Can not Save, Franchise-Master Data is invalid.");
    }  else {
      this.franchise.id = 0;
      this.franchise.franchiseCode = this.myForm.get('franchiseCode').value;
      this.franchise.franchiseName = this.myForm.get('franchiseName').value;      
      this.franchise.active= this.myForm.get('active').value;
      this.franchise.remarks = this.myForm.get('remarks').value;
   
     // .log(this.franchise);
      this.common.showSpinner();
      this.api.postAPI("franchise", this.franchise).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', data.displayMessage);
          }, this.common.time_out_delay);
        }

      });
    }
  }

  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['franchise']);
    }  
    } 
    else
    {
      this.router.navigate(['franchise']);
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
