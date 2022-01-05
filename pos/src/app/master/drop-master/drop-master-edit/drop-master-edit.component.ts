import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDropMaster } from 'src/app/models/m-drop-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-drop-master-edit',
  templateUrl: './drop-master-edit.component.html',
  styleUrls: ['./drop-master-edit.component.css']
})
export class DropMasterEditComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>;
  drop: MDropMaster;
  id: any;
  dropCode: string;
  dropName: string;

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
      dropCode: ['', Validators.required],
      dropName: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.drop = new MDropMaster();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getDropData();
  }

  getDropData() {
    this.common.showSpinner();
    this.api.getAPI("drop?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['dropCode'].setValue(data.dropMasterTypesData.dropCode);
            this.myForm.controls['dropName'].setValue(data.dropMasterTypesData.dropName);
            this.myForm.controls['remarks'].setValue(data.dropMasterTypesData.remarks);
            this.myForm.controls['active'].setValue(data.dropMasterTypesData.active);

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

  update() {
    if (this.drop == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    } else {
      this.drop.id = this.id;
      this.drop.dropCode = this.myForm.get('dropCode').value;
      this.drop.dropName = this.myForm.get('dropName').value;
      this.drop.active = this.myForm.get('active').value;
      this.drop.remarks = this.myForm.get('remarks').value;

     // .log(this.drop);
      this.common.showSpinner();
      this.api.putAPI("drop", this.drop).subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['drop-master']); 
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

