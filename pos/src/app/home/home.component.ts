import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { MUserDetails } from 'src/app/models/m-user-details';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MDayClosing } from '../models/m-day-closing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { getLocaleDateFormat } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  areaone: any[];
  vbar: any[];
  apie: any[];
  view: any[] = [800, 300];
  businessdate: any;
  // options
  legend: boolean = true;
  legendPosition: string = 'right';
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Sales';
  xAxisLabel_vbar: string = 'Purchase';
  yAxisLabel_vbar: string = 'Country';
  timeline: boolean = true;
  gradient: boolean = true;
  isDoughnut: boolean = false;
  showLegend: boolean = true;
  Dashboard_list: Array<any>;
  logedpos_details: MDayClosing = null;
  myForm: FormGroup;
  returnamount: number = 0;
  salesNetAmount: number = 0;
  averageAmount: number = 0;
  grossProfitAmount: number = 0;
  decimalPlaces: number = 2;
  isShown: boolean = false;
  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#aae3f5']
  };
  // areaone = [
  //   {
  //     "name": "Kuwait",
  //     "series": [
  //       {
  //         "name": "2018",
  //         "value": 62000000
  //       },
  //       {
  //         "name": "2019",
  //         "value": 73000000
  //       },
  //       {
  //         "name": "2020",
  //         "value": 89400000
  //       }
  //     ]
  //   },

  //   {
  //     "name": "Qatar",
  //     "series": [
  //       {
  //         "name": "2018",
  //         "value": 250000000
  //       },
  //       {
  //         "name": "2019",
  //         "value": 309000000
  //       },
  //       {
  //         "name": "2020",
  //         "value": 311000000
  //       }
  //     ]
  //   },

  //   {
  //     "name": "Dubai",
  //     "series": [
  //       {
  //         "name": "2018",
  //         "value": 58000000
  //       },
  //       {
  //         "name": "2019",
  //         "value": 50000020
  //       },
  //       {
  //         "name": "2020",
  //         "value": 58000000
  //       }
  //     ]
  //   },
  //   {
  //     "name": "US",
  //     "series": [
  //       {
  //         "name": "2018",
  //         "value": 57000000
  //       },
  //       {
  //         "name": "2019",
  //         "value": 62000000
  //       }
  //     ]
  //   }
  // ];

  // vbar = [
  //   {
  //     "name": "Germany",
  //     "value": 8940000
  //   },
  //   {
  //     "name": "USA",
  //     "value": 5000000
  //   },
  //   {
  //     "name": "France",
  //     "value": 7200000
  //   }
  // ];

  // apie = [
  //   {
  //     "name": "Germany",
  //     "value": 8940000
  //   },
  //   {
  //     "name": "USA",
  //     "value": 5000000
  //   },
  //   {
  //     "name": "France",
  //     "value": 7200000
  //   },
  //   {
  //     "name": "UK",
  //     "value": 6200000
  //   }
  // ];

  user_details: MUserDetails = null;
  countryID: any = 0;
  currencySymbol: any = '';

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

  user_details_promise() {
    return new Promise((resolve, reject) => {
      let tkn = localStorage.getItem('token');
      if (tkn != null) {
        let temp_str: string = localStorage.getItem('user_details');
        if (temp_str != null && temp_str != "null") {
          this.user_details = JSON.parse(temp_str);
          resolve(this.user_details);
          // this.getMenuScreens();
        } else {
          localStorage.setItem('user_details', null);
          this.api.getAPI("User").subscribe((data) => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              if (data.userInfoRecord != null) {
                this.user_details = new MUserDetails();
                this.user_details = data.userInfoRecord;
                localStorage.setItem('user_details', JSON.stringify(this.user_details));
                // this.getMenuScreens();
                resolve(this.user_details);
              } else {
                localStorage.setItem('user_details', null);
                reject("Invalid User Details");
              }
            } else {
              localStorage.setItem('user_details', null);
              reject("Invalid User Details");
            }
          });
        }
      }
    });//,3000
  }

  createForm() {
    this.myForm = this.fb.group({
      fromDate: [new Date()],
      toDate: [new Date()],
      returnAmount: [''],
      salesNetAmount: [''],
      averageAmount: [''],
      grossProfitAmount: [''],
      dashboardSelect: ['today'],
      isShown: [true]
    });
    //this.myForm.controls['dashboardSelect'].setValue(this.common()));
    setTimeout(() => {
      this.user_details_promise().then(() => {
        if (this.user_details != null) {
          //console.log(this.user_details);
          this.countryID = this.user_details.countryID;
          this.currencySymbol = this.user_details.currencySymbol;
          this.dashboard_change();
        } else {
          this.countryID = 1;
          this.currencySymbol = 'KWD';
          this.createForm();
        }
      }).catch((ex) => {
        this.common.showMessage("warn", ex);
      });
    });//300
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit(): void {

  }



  dashboard_change() {
    this.isShown = true;
    let day = this.myForm.get('dashboardSelect').value;
    let fDate = new Date();
    let tDate = new Date();
    let today = new Date();


    if (day == 'today') {
      fDate = new Date();
      tDate = fDate;
      this.myForm.controls['fromDate'].setValue(this.common.toYMDFormat(new Date(fDate)));
      this.myForm.controls['toDate'].setValue(this.common.toYMDFormat(new Date(tDate)));
      this.isShown = false;
    } else if (day == 'thisWeek') {
      // let n = today.getDay();
      fDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
      tDate = new Date();
      this.myForm.controls['fromDate'].setValue(this.common.toYMDFormat(new Date(fDate)));
      this.myForm.controls['toDate'].setValue(this.common.toYMDFormat(new Date(tDate)));
      this.isShown = false;
    } else if (day == 'thisMonth') {

      fDate = new Date(today.getFullYear(), today.getMonth(), 1);
      tDate = new Date();
      this.myForm.controls['fromDate'].setValue(this.common.toYMDFormat(new Date(fDate)));
      this.myForm.controls['toDate'].setValue(this.common.toYMDFormat(new Date(tDate)));
      this.isShown = false;
    } else if (day == 'thisYear') {
      //  fDate = new Date(today.getFullYear(), -1)
      fDate = new Date(today.getFullYear(), 0, 1);
      tDate = new Date();
      this.myForm.controls['fromDate'].setValue(this.common.toYMDFormat(new Date(fDate)));
      this.myForm.controls['toDate'].setValue(this.common.toYMDFormat(new Date(tDate)));
      this.isShown = false;
    } else if (day != 'custom') {
      this.isShown = false;
    }


    if (day != 'custom') {
      this.getDashboardList();
    }
  }

  getDashboardList() {
    this.Dashboard_list = null;
    var fdate = this.myForm.get('fromDate').value;
    var tdate = this.myForm.get('toDate').value;


    if (fdate > tdate) {

      this.myForm.get('toDate').setValue('');
      this.common.showMessage('warn', "Date Field is invalid");
    } else {

      this.common.showSpinner();

      this.api.getAPI("Dashboard?Fromdate=" + fdate + "&Todate=" + tdate + "&report_type=all&country_id=" + this.countryID)
        .subscribe((data) => {
          //console.log(data);
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.returnamount = data.returnAmount;
              //console.log(data);
              this.salesNetAmount = data.salesNetAmount;
              this.salesNetAmount = this.salesNetAmount == null ? 0 : parseFloat(this.salesNetAmount.toFixed(this.decimalPlaces));
              this.averageAmount = this.returnamount / 2;
              this.averageAmount = this.averageAmount == null ? 0 : parseFloat(this.averageAmount.toFixed(this.decimalPlaces));
              this.grossProfitAmount = this.salesNetAmount - this.returnamount;
              this.grossProfitAmount = this.grossProfitAmount == null ? 0 : parseFloat(this.grossProfitAmount.toFixed(this.decimalPlaces));
              this.areaone = data.areaChart;
              this.vbar = data.purchaseChart;
              this.apie = data.pieChart;

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
}
