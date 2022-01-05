import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { MUserDetails } from '../models/m-user-details';
import { MManagerOverride } from '../models/m-manager-override';
import { MRetailSettings } from '../models/m-retail-settings';
import { AppConstants } from 'src/app/app-constants';
// Reactive Forms Approach
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  user_details: MUserDetails = null;
  userid:number;
  userroleId:number;
  userroleCode:string;
  screenName: any;
  temp: Array<any>;
  SelectedMenus:Array<any>;
  version = AppConstants.version;
  
  constructor(private api: AuthService,
    private service: ApiService,
    public router: Router,
    private common: CommonService) {
      this.loadDefault();
  }

  loadDefault(){
    localStorage.clear();
    localStorage.setItem('isAuth', 'false');
    localStorage.setItem('pos_mode', 'false');
  }

  ngOnInit() {
    
    // this.common.test();
  }

  login_submit(form: NgForm) {
    //var un = form.value.email;
    //var pwd = form.value.password;

    let un = form.value.email;
    let pwd = form.value.password;
    let ePwd = this.common.encrypt(pwd);
    let uri_un = encodeURIComponent(un);
    let uri_pwd = encodeURIComponent(ePwd);
    this.common.showSpinner();
    if(uri_un == "" && pwd == "")
    {
      this.common.showMessage("warn", "Please Enter UserName and password.");
      this.common.hideSpinner();
    }
    else if(uri_un == "")
    {
      this.common.showMessage("warn", "Please Enter UserName.");
      this.common.hideSpinner();
    }
    else if(pwd == "")
    {
      this.common.showMessage("warn", "Please Enter Password.");
      this.common.hideSpinner();
    }
    
    // if (fromdate > enddate) {
    //   this.common.showMessage("warn", "End Date Should be Greater than Start Date.");
    // }
 else{
    this.api.login_me(uri_un, uri_pwd).subscribe((data) => {
        this.common.hideSpinner();
        let token = 'Bearer ' + data.access_token;
        localStorage.clear();
        // localStorage.removeItem('token');
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('expr', data.expires_in);
        let dat1 = new Date();
        dat1.setSeconds(dat1.getSeconds() + data.expires_in);
        localStorage.setItem('expr_time', dat1.toISOString());
        // this.get_me();
        this.router.navigate(['home']);
    });
 }
  }

  get_me() {
    localStorage.setItem('user_details', null)
    this.common.showSpinner();
    this.service.getAPI("User").subscribe((data) => { 
      if (data != null && data.statusCode != null && data.statusCode == 1) {
        // setTimeout(() => {
          if(data.userInfoRecord != null){
            // let user_details: MUserDetails = new MUserDetails();
            this.user_details = data.userInfoRecord;
            //// .log(user_details);
            localStorage.setItem('user_details', JSON.stringify(this.user_details ));
            this.getManagerOverrideData(data.userInfoRecord.managerOverrideID);
            this.getRetailSettingsData(data.userInfoRecord.retailID);
            //this.getMenuScreens(data.userInfoRecord.roleID);
            this.router.navigate(['home']);
          }else{
            this.common.showMessage('error', 'Invalid User Details');
            localStorage.setItem('user_details', null);
          }

          this.common.hideSpinner();
        // }, this.common.time_out_delay);

      }
    });
  }
  getManagerOverrideData(id) {
    this.common.showSpinner();
    this.service.getAPI("manageroverride?ID=" + id)
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            let manager_OverRide_Settings : MManagerOverride= new MManagerOverride();
            manager_OverRide_Settings = data.managerOverrideRecord
            localStorage.setItem('manager_OverRide_Settings', JSON.stringify(manager_OverRide_Settings));
            if(this.user_details != null && this.user_details.managerOverrideID){
              this.getRetailSettingsData(this.user_details.retailID);
            }else{
              this.common.showMessage('error', 'Invalid Manager Override Details');
              localStorage.setItem('user_details', null);
            }
            // this.getRetailSettingsData(data.userInfoRecord.retailID);
            // this.router.navigate(['home']);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  }
  getRetailSettingsData(id) {
    this.common.showSpinner();
    this.service.getAPI("retailsettings?ID=" + id)
      .subscribe((data) => {
        // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            let retail_Settings :MRetailSettings = new MRetailSettings();
            retail_Settings = data.retailRecord;
            localStorage.setItem('retail_settings', JSON.stringify(retail_Settings));
            //this.myForm.controls['retailCode'].setValue(data.retailRecord.retailCode);
            this.router.navigate(['home']);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
  } 
  getMenuScreens(roleid)
  {
    this.screenName=null;
    this.SelectedMenus = [];
    this.common.showSpinner();
    this.service.getAPI("UserPrivelege?id=" + roleid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.screenName = data.masUserPrivilagesRecord.screenName;
            
            var str = new String(this.screenName)
            var splits = str.split(",")
            this.SelectedMenus = splits;
            
            // for(let i=0;i<this.AllMenus.length;i++)
            // {             
            //   document.getElementById(this.AllMenus[i]).setAttribute("hidden","true");
            // }  
            // for(let i=0;i<this.SelectedMenus.length;i++)
            // {             
            //   document.getElementById(this.SelectedMenus[i]).removeAttribute("hidden");
            // }
                              
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
}
