import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MBinConfigMaster } from 'src/app/models/m-bin-config-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-bin-configuration',
  templateUrl: './bin-configuration.component.html',
  styleUrls: ['./bin-configuration.component.css']
})
export class BinConfigurationComponent implements OnInit {
  myForm: FormGroup;
  binConfig: Array<MBinConfigMaster>;
  binConfigData: MBinConfigMaster;
  user_details: MUserDetails = null;
  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) { this.createForm(); }

  createForm() {
    this.myForm = this.fb.group({
      noOfLevels: ['', Validators.required],
      enableBin: [false]
    });
    this.binConfig = new Array<MBinConfigMaster>();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
  }

  ngOnInit(): void {
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

  gridBind() {
    let level = this.myForm.get('noOfLevels').value;
    for (let i = 0; i < level; i++) {
      let templogdata: MBinConfigMaster = {
        id: 0,
        levelNo: i + 1,
        levelName: '',
        storeID: this.user_details.storeID,
        storeCode: this.user_details.storeCode,
        active:true,
        createBy:this.user_details.id,
        enableBin: this.myForm.get('enableBin').value
      }
      this.binConfig.push(templogdata);
    }
  }

  addBin() {
    this.binConfigData = new MBinConfigMaster();
    if (this.binConfig.length == 0) {
      this.common.showMessage("warn", "Can not Save, Bin Config are invalid.");
    } else {
      this.common.showSpinner();
      this.binConfigData.binLevelMasterList=this.binConfig;

      this.api.postAPI("binlevel", this.binConfigData).subscribe((data) => {

        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          //this.clear_controls();
          this.router.navigate(['home']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }
      });
    }
  }

  clear(){
    this.myForm.get('noOfLevels').setValue('');
    this.myForm.get('enableBin').setValue(false);
    this.binConfig = new Array<MBinConfigMaster>();
  }
}
