import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MSubCollectionMaster } from 'src/app/models/m-sub-collection-master';
import { MCollectionMaster } from 'src/app/models/m-collection-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-sub-collection-add',
  templateUrl: './sub-collection-add.component.html',
  styleUrls: ['./sub-collection-add.component.css']
})
export class SubCollectionAddComponent implements OnInit {

  myForm: FormGroup;
  collectionList: Array<MCollectionMaster>;
  subCollectionList: Array<MSubCollectionMaster>;
  user_details: MUserDetails = null;
  userid: number;
  collectionCode: string;
  changes_done : boolean;
  SubCollectiondownSettings:IDropdownSettings={};
  selectedCollectionList=[];
  closeDropdownSelection=false;
  collectionid:number;
  disabled=false;

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
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
  collectioncode(item:any) {
    this.collectionid=item.id;
    if (this.collectionList != null && this.collectionList.length > 0) {
      for (let collection of this.collectionList) {
        if (collection.id == this.collectionid) {
          this.collectionCode = collection.collectionCode;
          break;
        }
      }
    }
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
           this.SubCollectiondownSettings = {
              singleSelection: true,
              idField: 'id',
              textField: 'collectionName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              closeDropDownOnSelection: this.closeDropdownSelection
              
            };
            this.selectedCollectionList = [];
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
  }
  addSubCollectionList() {
    this.disabled=true;
    //this.myForm.get('collectionID').disable();
    let subcol_code = this.myForm.get('subCollectionCode').value;
    let subcol_name = this.myForm.get('subCollectionName').value;
    if (subcol_code == null || subcol_code == "") {
      this.common.showMessage("warn", "Sub Collection Code is Empty");
    } else if (subcol_code.length != 4) {
      this.common.showMessage("warn", "Sub Collection Code must contain 4 digits exactly");
    } else if (subcol_name == null || subcol_name == "") {
      this.common.showMessage("warn", "Sub Collection Name is Empty");
    } else {
      this.changes_done = true;
      let exists = this.subCollectionList.filter(x => x.subCollectionCode.toLowerCase() == subcol_code.toLowerCase());
      if (exists != null && exists.length > 0) {
        this.common.showMessage("warn", "Sub Collection Code already exists.");
      } else {
        let tempSubCollection: MSubCollectionMaster = {
          id: 0,
          subCollectionCode: this.myForm.get('subCollectionCode').value,
          subCollectionName: this.myForm.get('subCollectionName').value,
          collectionID: this.collectionid,
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
    // this.myForm.get('collectionID').enable();
    this.disabled=false;
    this.subCollectionList = new Array<MSubCollectionMaster>();
    this.myForm.controls['collectionID'].setValue('');
    this.myForm.controls['subCollectionCode'].setValue('');
    this.myForm.controls['subCollectionName'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.changes_done = false;
  }

  addSubCollection() {
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
          this.clear_controls();
          //this.router.navigate(['sub-collection']);
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
  toggleCloseDropdownSelection() {
    this.closeDropdownSelection = !this.closeDropdownSelection;
    this.SubCollectiondownSettings = Object.assign({}, this.SubCollectiondownSettings,{closeDropDownOnSelection: this.closeDropdownSelection});
  }
}
