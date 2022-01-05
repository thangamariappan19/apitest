import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MStockadjustmentheaderMaster } from 'src/app/models/m-stockadjustmentheader-master';
import { MStockadjustmentdetailsMaster } from 'src/app/models/m-stockadjustmentdetails-master';

@Component({
  selector: 'app-stockadjustment-view',
  templateUrl: './stockadjustment-view.component.html',
  styleUrls: ['./stockadjustment-view.component.css']
})
export class StockadjustmentViewComponent implements OnInit {
  myForm: FormGroup;
  id: any;
  stockadjustment: MStockadjustmentheaderMaster;
  stockadjustmentlist: Array<MStockadjustmentdetailsMaster>;
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

    });
    /*this.stockadjustment = new MStockadjustmentheaderMaster();
    this.stockadjustmentlist = new Array<MStockadjustmentdetailsMaster>();
    let temp_str: string = localStorage.getItem('ViewStockAdjustment');
    if (temp_str != null) {
      this.stockadjustment = JSON.parse(temp_str);
      this.stockadjustmentlist = this.stockadjustment[0].stockAdjustmentDetailList;
      //console.log(this.stockadjustmentlist);
    }*/
  }

  ngOnInit(){
    /*this.stockadjustment=new MStockadjustmentheaderMaster();
    this.stockadjustmentlist = new Array<MStockadjustmentdetailsMaster>();
    let temp_str: string = localStorage.getItem('ViewStockAdjustment');
    if (temp_str != null) {
      this.stockadjustment = JSON.parse(temp_str);
      this.stockadjustmentlist = this.stockadjustment[0].stockAdjustmentDetailList;
      console.log(this.stockadjustmentlist);
    }*/
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStockAdjustment();
  }
  getStockAdjustment() {
    this.common.showSpinner();
    this.api.getAPI("StockAdjustment?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.stockadjustmentlist = data.responseDynamicData.stockAdjustmentDetailList;
            //this.stockrequestList=data.responseDynamicData.stockRequestDetailsList;

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
  close() {
    this.router.navigate(['stockadjustment']);
  }

}
