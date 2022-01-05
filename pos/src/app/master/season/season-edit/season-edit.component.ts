import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MSeasonMaster } from 'src/app/models/m-season-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-season-edit',
  templateUrl: './season-edit.component.html',
  styleUrls: ['./season-edit.component.css']
})
export class SeasonEditComponent implements OnInit {

  myForm: FormGroup;
  season: MSeasonMaster;
  id: any;

  user_details: MUserDetails = null;
  userid: number;

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
      seasonCode: ['', Validators.required],
      seasonName: ['', Validators.required],
      seasonDrop: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      noofWeeks: [''],
      noofDays: [''],
      active: [false]
    });
    this.getStaticValues();
    this.clear_controls();
  }
  clear_controls() {
    this.season = new MSeasonMaster();
    this.myForm.controls['seasonCode'].setValue('');
    this.myForm.controls['seasonName'].setValue('');
    this.myForm.controls['seasonDrop'].setValue('');
    this.myForm.controls['startDate'].setValue('');
    this.myForm.controls['endDate'].setValue('');
    this.myForm.controls['noofWeeks'].setValue('');
    this.myForm.controls['noofDays'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSeason();
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

  calculateDaysandWeeks() {
    var dateStr1 = this.myForm.get('startDate').value;
    var dateStr2 = this.myForm.get('endDate').value;
    if (dateStr1 != null && dateStr1 != "" && dateStr2 != null && dateStr2 != "") {
      var date1: any = new Date(this.myForm.get('startDate').value);
      var date2: any = new Date(this.myForm.get('endDate').value);

      if (date2 >= date1) {
        var noofdays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        var noofweeks: any = Math.round(noofdays / 7);
        this.myForm.controls['noofDays'].setValue(noofdays);
        this.myForm.controls['noofWeeks'].setValue(noofweeks);
      } 
    }
  }

  validateDates() {
    let isValid: boolean = false;
    var dateStr1 = this.myForm.get('startDate').value;
    var dateStr2 = this.myForm.get('endDate').value;
    if (dateStr1 != null && dateStr1 != "" && dateStr2 != null && dateStr2 != "") {
      var date1: any = new Date(this.myForm.get('startDate').value);
      var date2: any = new Date(this.myForm.get('endDate').value);

      if (date2 >= date1) {
        var noofdays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        var noofweeks: any = Math.round(noofdays / 7);
        this.myForm.controls['noofDays'].setValue(noofdays);
        this.myForm.controls['noofWeeks'].setValue(noofweeks);
        isValid = true;
      } else {
        this.common.showMessage('error', 'Start date should be less than End date');
        this.myForm.controls['endDate'].setValue('');
        this.myForm.controls['noofDays'].setValue('');
        this.myForm.controls['noofWeeks'].setValue('');
      }
    }
    return isValid;
  }

  getSeason() {
    this.common.showSpinner();
    this.api.getAPI("season?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['seasonCode'].setValue(data.seasonMasterRecord.seasonCode);
            this.myForm.controls['seasonName'].setValue(data.seasonMasterRecord.seasonName);
            this.myForm.controls['seasonDrop'].setValue(data.seasonMasterRecord.seasonDrop);
            this.myForm.controls['startDate'].setValue(this.common.toYMDFormat(new Date(data.seasonMasterRecord.seasonStartDate)));
            this.myForm.controls['endDate'].setValue(this.common.toYMDFormat(new Date(data.seasonMasterRecord.seasonEndDate)));
            this.myForm.controls['noofWeeks'].setValue(data.seasonMasterRecord.noOfWeeks);
            this.myForm.controls['noofDays'].setValue(data.seasonMasterRecord.noOfDays);
            this.myForm.controls['active'].setValue(data.seasonMasterRecord.active);
            //.log(this.company_list);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  updateSeason() {
    if (this.season == null) {
      this.common.showMessage("warn", "Can not Save, Season Details are invalid.");
    } else if(this.validateDates() == false){

    } else {
      this.season.id = this.id;
      this.season.seasonCode = this.myForm.get('seasonCode').value;
      this.season.seasonName = this.myForm.get('seasonName').value;
      this.season.seasonDrop = this.myForm.get('seasonDrop').value;
      this.season.seasonStartDate = this.myForm.get('startDate').value;
      this.season.seasonEndDate = this.myForm.get('endDate').value;
      this.season.noOfWeeks = this.myForm.get('noofWeeks').value;
      this.season.noOfDays = this.myForm.get('noofDays').value;
      this.season.isSelected = this.myForm.get('active').value;
      this.season.updateBy = this.userid;
      // .log(this.season);
      this.common.showSpinner();
      this.api.putAPI("season", this.season).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['season']);
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
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['season']);
      }
    }
    else {
      this.router.navigate(['season']);
    }
  }
  keyPressD(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
