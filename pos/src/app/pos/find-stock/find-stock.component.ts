import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MInvoiceDetail } from 'src/app/models/m-invoice-detail';
import { MStyleColorScale } from 'src/app/models/m-style-color-scale';
import { MTempInvoiceDetail } from 'src/app/models/m-temp-invoice-detail';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { AppConstants } from 'src/app/app-constants';

@Component({
  selector: 'app-find-stock',
  templateUrl: './find-stock.component.html',
  styleUrls: ['./find-stock.component.css']
})
export class FindStockComponent implements OnInit {
  json: Array<any>;
  myForm: FormGroup;
  user_details: MUserDetails = null;
  item_details: Array<MInvoiceDetail>;
  colorList: Array<MStyleColorScale>;
  sizeList: Array<MStyleColorScale>;
  styleColorScaledetails: Array<MStyleColorScale>;
  CurrentColorList: Array<MStyleColorScale> = null;
  CurrentSizeList: Array<MStyleColorScale> = null;
  Skucode: any;
  public selectedColorName: any;
  public selectedSize: any;
  temp_Size: string;
  temp_color: string;
  // styleCode: string;
  temp_SkuCode: any;
  colorCode: any;
  sizecode: any;
  //skucode:string;

  searchfindStockCtrl = new FormControl();
  filteredfindstock: any;
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
    this.createForm();
    localStorage.setItem('pos_mode', 'true');
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
    }
  }

  createForm() {
    this.myForm = this.fb.group({
      sku_code: [''],
      sku: [''],
      style: [''],
      color: [''],
      size: [''],
      price: ['']
    });
    this.clear_controls();
  }

  clear_controls() {
  }

  ngOnInit() {
    this.colorList = new Array<MStyleColorScale>();
    this.sizeList = new Array<MStyleColorScale>();
    this.item_details = new Array<MInvoiceDetail>();
    // localStorage.setItem('pos_mode', 'true');
    localStorage.setItem('pos_mode', 'true');
    this.searchfindStockCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredfindstock = [];
          this.isLoading = true;

        }),
        switchMap(value => this.http.get(AppConstants.base_url + "api/POSProductSearch?SearchValue=" + this.searchfindStockCtrl.value + "&StoreID=" + this.user_details.storeID)
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
          this.filteredfindstock = [];
        } else {
          this.errorMsg = "";

          this.filteredfindstock = data.searchEngineDataList;


        }


      });
  }
  refresh() {
    this.json = null;
    this.myForm.controls['sku_code'].setValue('');
    this.myForm.controls['sku'].setValue('');
    this.myForm.controls['style'].setValue('');
    this.myForm.controls['color'].setValue('');
    this.myForm.controls['size'].setValue('');
    this.myForm.controls['price'].setValue('');
  }
  sku_changed() {
    this.json = null;
    //this.country_list = null;
    // let searchstring = this.myForm.get('sku_code').value;
    let searchstring = this.searchfindStockCtrl.value;
    this.myForm.controls['sku'].setValue('');
    this.myForm.controls['style'].setValue('');
    this.myForm.controls['color'].setValue('');
    this.myForm.controls['size'].setValue('');
    this.myForm.controls['price'].setValue('');
    if (searchstring != null && searchstring != "") {
      this.common.showSpinner();
      //this.get_StyleColorScale();
      this.api.getAPI("findstock?SearchValue=" + searchstring.trim() + "&countryid=" + this.user_details.countryID)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1) {
              //this.country_list = new Array<MCountryMaster> ();
              //this.country_list = data.countryMasterList;
              // console.log("stockByCountryList");
              // console.log(data.stockByCountryList);
              this.json = data.stockByCountryList;
              this.myForm.controls['sku'].setValue(data.stockByCountryList[0].skuCode + " / " + data.stockByCountryList[0].barCode);
              this.myForm.controls['style'].setValue(data.stockByCountryList[0].styleCode);
              this.myForm.controls['color'].setValue(data.stockByCountryList[0].colorCode);
              this.myForm.controls['size'].setValue(data.stockByCountryList[0].sizeCode);
              this.myForm.controls['price'].setValue(data.stockByCountryList[0].price);
              let styleCode: string = data.stockByCountryList[0].styleCode;
              let skucode: string = data.stockByCountryList[0].skuCode;
              let colorCode: string = data.stockByCountryList[0].colorCode;
              let sizeCode: string = data.stockByCountryList[0].sizeCode;


              //  console.log("styleCode");
              //  console.log(styleCode);
              //  console.log(skucode);
              //console.log(styleCode,skucode);
              this.get_StyleColorScale(styleCode, skucode, colorCode, sizeCode);
              this.searchfindStockCtrl.patchValue('');
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
  //check_item_stock(location_code: string, item_code: string) {
  get_StyleColorScale(styleCode: string, skucode: string, colorCode: string, sizeCode: string) {
    this.Skucode = skucode;
    this.api.getAPI("stylemaster?StyleCode=" + styleCode + "&X=" + "y")
      .subscribe((data) => {
        // setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          let sl = this.sizeList.filter(x => x.SKUCode == this.Skucode);
          let cl = this.colorList.filter(x => x.SKUCode == this.Skucode);
          if (data.styleColorSizeTypesList != null) {
            this.CurrentColorList = new Array<MStyleColorScale>();
            this.CurrentSizeList = new Array<MStyleColorScale>();
            for (let item of data.styleColorSizeTypesList) {
              if (item.type == "Size") {
                item.SKUCode = this.Skucode;

                if (sl == null || sl.length <= 0) {
                  this.sizeList.push(item);
                }
                this.CurrentSizeList.push(item);

              }
              else {
                item.SKUCode = this.Skucode;

                if (cl == null || cl.length <= 0) {
                  this.colorList.push(item);
                }
                this.CurrentColorList.push(item);

              }
            }

          }

          this.myForm.controls['color'].setValue(colorCode);
          this.myForm.controls['size'].setValue(sizeCode);


        } else {
          this.common.showMessage('warn', 'Failed to get StyleColorScale Details.');
          this.styleColorScaledetails = null;
          this.styleColorScaledetails = null;
        }
      });


  }

  colorname() {
    if (this.CurrentColorList != null && this.CurrentColorList.length > 0) {
      for (let color of this.CurrentColorList) {
        if (color.colorCode == this.myForm.get('color').value) {
          let selectedcolorcode = color.colorCode;
          let cc = selectedcolorcode;
          let sc = this.myForm.get('size').value;
          let style = this.myForm.get('style').value
          let fullname = style + "-" + cc + "-" + sc;
          this.myForm.controls['sku_code'].setValue(0);
          this.myForm.controls['sku_code'].setValue(fullname);
          break;
        }
      }
    }
  }


  sizename() {
    if (this.CurrentSizeList != null && this.CurrentSizeList.length > 0) {
      for (let size of this.CurrentSizeList) {
        if (size.colorCode == this.myForm.get('size').value) {
          let selectedsizecode = size.colorCode;
          let sc = selectedsizecode;
          let cc = this.myForm.get('color').value;
          let style = this.myForm.get('style').value;
          let fullname = style + "-" + cc + "-" + sc;
          this.myForm.controls['sku_code'].setValue(0);
          this.myForm.controls['sku_code'].setValue(fullname);
          break;
        }
      }
    }
  }

  btn_back_click() {
    localStorage.setItem('pos_mode', 'true');
    this.router.navigate(['pos']);
  }
}
