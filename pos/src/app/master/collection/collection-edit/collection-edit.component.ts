import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCollectionMaster } from 'src/app/models/m-collection-master';

@Component({
  selector: 'app-collection-edit',
  templateUrl: './collection-edit.component.html',
  styleUrls: ['./collection-edit.component.css']
})
export class CollectionEditComponent implements OnInit {
  myForm: FormGroup;
  collection: MCollectionMaster;
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
      collectionCode: ['', Validators.required],
      collectionName: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.clear_controls();
   
  }
  clear_controls() {
    this.collection = new MCollectionMaster();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCollectionData();
  }
  getCollectionData() {
    this.common.showSpinner();
    this.api.getAPI("collection?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['collectionCode'].setValue(data.collectionMasterTypesData.collectionCode);
            this.myForm.controls['collectionName'].setValue(data.collectionMasterTypesData.collectionName);
            this.myForm.controls['remarks'].setValue(data.collectionMasterTypesData.remarks);
            this.myForm.controls['active'].setValue(data.collectionMasterTypesData.active);

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
  updateCollection() {
    if (this.collection == null) {
      this.common.showMessage("warn", "Can not Save, collection are invalid.");
    } else {
      this.collection.id = this.id;
      this.collection.collectionCode = this.myForm.get('collectionCode').value;
      this.collection.collectionName = this.myForm.get('collectionName').value;
      this.collection.remarks = this.myForm.get('remarks').value;
      this.collection.active = this.myForm.get('active').value;
      
      this.common.showSpinner();
      this.api.putAPI("collection", this.collection).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['collection']);
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
