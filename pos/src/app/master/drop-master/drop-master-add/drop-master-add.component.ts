import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDropMaster } from 'src/app/models/m-drop-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-drop-master-add',
  templateUrl: './drop-master-add.component.html',
  styleUrls: ['./drop-master-add.component.css']
})
export class DropMasterAddComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>; 
  drop: MDropMaster;

  constructor(
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router
  ) { this.createForm();} 

  createForm() {
    this.myForm = this.fb.group({    
      dropCode: ['',Validators.required],
      dropName: ['',Validators.required],     
      remarks:[''],
      active:[false]
  });
  this.drop = new MDropMaster();
  this.clear_controls();
}
  clear_controls() { 
    
    this.myForm.controls['dropCode'].setValue('');
    this.myForm.controls['dropName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }

  quickadd_drop() {
    if (this.drop == null) {
      this.common.showMessage("warn", "Can not Save, Drop-Master Data is invalid.");
    }  else {
      this.drop.id = 0;
      this.drop.dropCode = this.myForm.get('dropCode').value;
      this.drop.dropName = this.myForm.get('dropName').value;      
      this.drop.active= this.myForm.get('active').value;
      this.drop.remarks = this.myForm.get('remarks').value;
   
     // .log(this.drop);
      this.common.showSpinner();
      this.api.postAPI("drop", this.drop).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
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


  close(){
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['drop-master']); 
    }  
    } 
    else
    {
     this.router.navigate(['drop-master']); 
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
