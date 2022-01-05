import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCollectionMaster } from 'src/app/models/m-collection-master';
import { MSubCollectionMaster } from 'src/app/models/m-sub-collection-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-sub-collection-edit',
  templateUrl: './sub-collection-edit.component.html',
  styleUrls: ['./sub-collection-edit.component.css']
})
export class SubCollectionEditComponent implements OnInit {

  myForm: FormGroup;
  collectionList: Array<MCollectionMaster>;
  subCollectionList: Array<MSubCollectionMaster>;
  id: any;
  user_details: MUserDetails = null;
  userid: number;
  collectionCode: string;
  changes_done: boolean;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.changes_done = false;
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      subCollectionCode: [''],
      subCollectionName: [''],
      collectionID: ['', Validators.required],
      active: [true]
    });
    this.getStaticValues();
    this.subCollectionList = new Array<MSubCollectionMaster>();
    this.getCollection();
  }
  getStaticValues() {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid = this.user_details.id;
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
  getCollection() {
    this.collectionList = null;
    this.common.showSpinner();
    this.api.getAPI("CollectionMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            if (data.collectionMasterTypesList != null && data.collectionMasterTypesList.length > 0) {
              this.collectionList = data.collectionMasterTypesList;
            }
            // this.collectionList = data.responseDynamicData;
            // this.collectionList = this.collectionList.filter(x => x.active == true);
            //// .log(this.countryList);
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
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSubCollectionDate();
  }

  getSubCollectionDate() {
    this.common.showSpinner();
    this.api.getAPI("subcollection?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['collectionID'].setValue(data.subCollectionMasterList[0].collectionID);
            this.subCollectionList = data.subCollectionMasterList;
            this.collectionCode = data.subCollectionMasterList[0].collectionCode;
            // .log(this.subCollectionList);
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
  addSubCollectionList() {
    this.myForm.get('collectionID').disable();
    let subcol_code = this.myForm.get('subCollectionCode').value;
    let subcol_name = this.myForm.get('subCollectionName').value;
    if (subcol_code == null || subcol_code == "") {
      this.common.showMessage("warn", "Sub Collection Code is Empty");
    } else if (subcol_code.length != 4) {
      this.common.showMessage("warn", "Sub Collection Code must contain 4 digits exactly");
    } else if (subcol_name == null || subcol_name == "") {
      this.common.showMessage("warn", "Sub Collection Name is Empty");
    } else {
      let exists = this.subCollectionList.filter(x => x.subCollectionCode.toLowerCase() == subcol_code.toLowerCase());
      if (exists != null && exists.length > 0) {
        this.common.showMessage("warn", "Sub Collection Code already exists.");
      } else {
        this.changes_done = true;
        let tempSubCollection: MSubCollectionMaster = {
          id: 0,
          subCollectionCode: this.myForm.get('subCollectionCode').value,
          subCollectionName: this.myForm.get('subCollectionName').value,
          collectionID: this.myForm.get('collectionID').value,
          collectionCode: this.collectionCode,
          active: this.myForm.get('active').value,
          createBy: this.userid
        }

        this.subCollectionList.push(tempSubCollection);
        this.myForm.controls['subCollectionCode'].setValue('');
        this.myForm.controls['subCollectionName'].setValue('');
        this.myForm.controls['active'].setValue(true);
      }
    }
  }

  subCollection_code_changed(item) {
    this.changes_done = true;
    if (item.subCollectionCode != null && item.subCollectionCode != "") {
      if (item.subCollectionCode.length != 4) {
        item.subCollectionCode = "";
        this.common.showMessage("warn", "Sub Collection Code must contain 4 digits exactly");
      } else {
        const idx = this.subCollectionList.indexOf(item, 0);
        if (idx > -1) {
          for (let subItem of this.subCollectionList) {
            let idx1 = this.subCollectionList.indexOf(subItem, 0);
            if (item.subCollectionCode.toLowerCase() == subItem.subCollectionCode.toLowerCase() && idx != idx1) {
              item.subCollectionCode = "";
              this.common.showMessage("warn", "Sub Collection Code already exists.");
            }
          }
        }
      }
    }

  }

  void_item(item) {
    const idx = this.subCollectionList.indexOf(item, 0);
    if (idx > -1) {
      this.subCollectionList.splice(idx, 1);
      this.changes_done = true;
    }
  }

  clear_controls() {
    this.myForm.get('collectionID').enable();
    this.subCollectionList = new Array<MSubCollectionMaster>();
    this.myForm.controls['collectionID'].setValue('');
    this.myForm.controls['subCollectionCode'].setValue('');
    this.myForm.controls['subCollectionName'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  updateSubCollection() {
    let invalid = this.subCollectionList.filter(x => x.subCollectionCode == null || x.subCollectionCode == ""
      || x.subCollectionName == null || x.subCollectionName == "");

    if (this.subCollectionList.length == 0) {
      this.common.showMessage("warn", "Can not Save, Sub Collection List is Empty.");
    } else if (invalid != null && invalid.length > 0) {
      this.common.showMessage("warn", "Can not Save, one or more Sub Collection item(s) is invalid.");
    } else {
      this.common.showSpinner();
      this.api.postAPI("SubCollection", this.subCollectionList).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['sub-collection']);
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
    if (this.myForm.dirty || this.changes_done == true) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['sub-collection']);
      }
    }
    else {
      this.router.navigate(['sub-collection']);
    }
  }
}
