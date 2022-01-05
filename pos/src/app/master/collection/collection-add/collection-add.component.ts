import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCollectionMaster } from 'src/app/models/m-collection-master';

@Component({
  selector: 'app-collection-add',
  templateUrl: './collection-add.component.html',
  styleUrls: ['./collection-add.component.css']
})
export class CollectionAddComponent implements OnInit {

  myForm: FormGroup;
  collection: MCollectionMaster;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb:FormBuilder,
    private confirm: ConfirmService,
    public router:Router
  ) {this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      collectionCode: ['', Validators.required],
      collectionName: ['', Validators.required],
      remarks: [''],
      active:[true]
  
    });
    this.clear_controls();
    this.collection = new MCollectionMaster();
  }
  clear_controls(){
    
    this.myForm.controls['collectionCode'].setValue('');
    this.myForm.controls['collectionName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }
  addCollection(){
    if (this.collection == null) {
      this.common.showMessage("warn", "Can not Save, collection are invalid.");
    }  else {
      this.collection.id = 0;
      this.collection.collectionCode = this.myForm.get('collectionCode').value;
      this.collection.collectionName = this.myForm.get('collectionName').value;      
      this.collection.remarks = this.myForm.get('remarks').value;
      this.collection.active = this.myForm.get('active').value;      
      
      this.common.showSpinner();
      this.api.postAPI("collection", this.collection).subscribe((data) => {
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
  

  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['collection']);
    }  
    } 
    else
    {
      this.router.navigate(['collection']);
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
