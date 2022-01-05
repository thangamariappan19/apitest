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
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {
  json: Array<any>;
  myForm: FormGroup;
  user_details: MUserDetails = null;

  searchProductCtrl = new FormControl();
  filteredProduct: any;
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
  }

  ngOnInit() {
    // localStorage.setItem('pos_mode', 'true');
    this.searchProductCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredProduct = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(AppConstants.base_url + "api/POSProductSearch?SearchValue=" + this.searchProductCtrl.value + "&StoreID=" + this.user_details.storeID)
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
          this.filteredProduct = [];
        } else {
          this.errorMsg = "";

          this.filteredProduct = data.searchEngineDataList;


        }


      });
  }

  btn_back_click() {
    localStorage.setItem('pos_mode', 'true');
    this.router.navigate(['pos']);
  }
  refresh() {
    this.myForm.controls['sku_code'].setValue('');
    this.json = null;
  }
  getProductDetail() {
    this.json = null;
    //this.country_list = null;
    // let searchstring = this.myForm.get('sku_code').value;
    let searchstring = this.searchProductCtrl.value;
    if (searchstring != null && searchstring != "") {
      this.common.showSpinner();
      // this.api.getAPI("ProductSearch?SearchValue=" + this.myForm.get('sku_code').value + "&storeid=" + this.user_details.storeID)
      this.api.getAPI("POSProductSearch?SearchValue=" + searchstring.trim() + "&storeid=" + this.user_details.storeID + "&pricelistid=" + this.user_details.priceListID)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              this.json = data.productDescList;
              this.searchProductCtrl.patchValue('');
              // .log(this.json);
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
    else {
      this.common.showMessage('warn', "Search Text is Empty");
    }

  }
}
