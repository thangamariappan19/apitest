import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { AppConstants } from 'src/app/app-constants';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  json: Array<any>;
  myForm: FormGroup;
  totalQty: number;
  user_details: MUserDetails = null;
  temp_image: string = "assets/img/preview-image.png";
  searchStockCtrl = new FormControl();
  filteredstock: any;
  errorMsg: string;
  isLoading = false;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private http: HttpClient
  ) {
    localStorage.setItem('pos_mode', 'true');
    this.createForm();
  }
  createForm() {

    this.myForm = this.fb.group({
      sku_code: ['']
      // discount_value: [0],
      // current_discount_type: ['Percentage']
    });


    this.clear_controls();
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
  }

  clear_controls() {
    //this.getStockList();
  }

  ngOnInit() {
    this.searchStockCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredstock = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(AppConstants.base_url + "api/POSProductSearch?SearchValue=" + this.searchStockCtrl.value + "&StoreID=" + this.user_details.storeID)
          .pipe(
            startWith(''),
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        if (data.searchEngineDataList == null) {
          // this.errorMsg = data['Error'];
          this.filteredstock = [];
        } else {
          this.errorMsg = "";

          this.filteredstock = data.searchEngineDataList;


        }


      });
  }

  sku_changed() {
    this.json = null;
    this.totalQty = 0;
    // let searchstring = this.myForm.get('sku_code').value;
    let searchstring = this.searchStockCtrl.value;
    if (searchstring != null && searchstring != "") {
      this.common.showSpinner();
      this.api.getAPI("stock?SearchValue=" + searchstring + "&storeid=" + this.user_details.storeID + "&fromFormName=stock")
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              //this.country_list = new Array<MCountryMaster> ();
              //this.country_list = data.countryMasterList;
              this.json = data.stockList;
              this.searchStockCtrl.patchValue('');
              if (this.json != null && this.json.length > 0) {
                for (let stock of this.json) {
                  this.totalQty = this.totalQty + stock.stockQty;
                  stock.skuImageSource = stock.skuImageSource == null || stock.skuImageSource == '' ? this.temp_image : 'data:image/gif;base64,' + stock.skuImageSource;
                }
              }
              // .log(this.json);
            } else {
              let msg: string = data != null
                && data.displayMessage != null
                && data.displayMessage != "" ? data.displayMessage : "Item not Found.";
              this.common.showMessage('warn', msg);
            }
            this.common.hideSpinner();
          }, this.common.time_out_delay);
        });
    }
    else {
      this.common.showMessage('warn', "Search Text is Empty");
    }
  }
  refresh() {
    this.json = null;
    this.myForm.controls['sku_code'].setValue('');
  }
  btn_back_click() {
    localStorage.setItem('pos_mode', 'true');
    this.router.navigate(['pos']);
  }
}
