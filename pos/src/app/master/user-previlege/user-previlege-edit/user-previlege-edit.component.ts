import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MPosScreen } from 'src/app/models/m-pos-screen';
import { MUserPrevilege } from 'src/app/models/m-user-previlege';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-user-previlege-edit',
  templateUrl: './user-previlege-edit.component.html',
  styleUrls: ['./user-previlege-edit.component.css']
})
export class UserPrevilegeEditComponent implements OnInit {

  myForm: FormGroup;
  id: any;
  selectedScreen: any;
  temp: Array<any>;
  roleList: Array<any>;
  posScrrenList: Array<MPosScreen>;
  posScrrenListFilter: Array<MPosScreen>;
  userPrevilegeList: Array<MUserPrevilege>;
  userPrevilege: MUserPrevilege;
  screenName: any;

  user_details: MUserDetails = null;
  userid:number;
  
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
      roleID: [''],
      //segmentationTypeListArr: new FormArray([])
    });
    this.getStaticValues();
    this.getRoleList();
    //this.getPOSScreen();
    this.userPrevilege = new MUserPrevilege();
    
    //this.posScrrenListFilter = Array<MPosScreen>();
  }
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;      
    }
  }
  getRoleList() {
    this.roleList = null;
    this.common.showSpinner();
    this.api.getAPI("role")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.roleList = data.roleMasterList;
            // this.json = data.countryMasterList;
            //// .log(this.json);
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

  getPOSScreen() {
    this.posScrrenList = Array<MPosScreen>();
    this.posScrrenListFilter=null;
    this.common.showSpinner();
    this.api.getAPI("UserPrivelege")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.json = new Array<MCountryMaster> ();
            this.posScrrenList = data.posScreenTypesList;
            this.posScrrenListFilter=data.posScreenTypesList;
            this.screenactive();
            // this.json = data.countryMasterList;
            //// .log(this.json);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
    //
  }


  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPOSScreen();
    this.getUserPrevilegeData();
    this.myForm.controls['roleID'].setValue(this.id);

  }
  getUserPrevilegeData() {
    this.screenName=null;
    this.temp = [];
    this.common.showSpinner();
    this.api.getAPI("UserPrivelege?id=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.screenName = data.responseDynamicData.screenName;
            //this.getPOSScreen();
            var str = new String(this.screenName)
            var splits = str.split(",")
            this.temp = splits;
           // .log(this.temp.length)
            this.screenactive();
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
  screenactive() {
    //this.posScrrenList=null;
    //this.posScrrenList=this.posScrrenListFilter;
    let arraylength = this.temp.length;
    for (var i = 0; i < arraylength; i++) {
      for (let posScreen of this.posScrrenList) {
        if (posScreen.name == this.temp[i]) {
          posScreen.active = true;
          break;
        }
       
      }
    }
  }

  close() {     
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['user-previlege']);
          }       
  }
  clear() {
    //this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.screenactive();
   this.ngOnInit();
  }

  updateUserPrevilege() {
    this.getListOfPrevilege();
    this.userPrevilege.id = 0;
    this.userPrevilege.roleID = this.id;
    this.userPrevilege.screenName = this.selectedScreen;
    this.userPrevilege.isActive = true;
    this.userPrevilege.createBy=this.userid;
    if (this.userPrevilege == null) {
      this.common.showMessage("warn", "Can not Save, style segmentation Details are invalid.");
    } else {
      //this.styleSegmentation.segmentList = this.brandDivisionMapplingList;
     // .log(this.userPrevilege);
      this.common.showSpinner();
      this.api.postAPI("UserPrivelege", this.userPrevilege).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['user-previlege']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  getListOfPrevilege() {
    this.selectedScreen = "";
    for (let selectScreen of this.posScrrenList) {
      if (selectScreen.active == true) {
        if (this.selectedScreen == "") {
          this.selectedScreen = selectScreen.name;
        }
        else {
          this.selectedScreen = this.selectedScreen + ',' + selectScreen.name;
        }
      }
    }
  }
}
