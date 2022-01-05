import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MInvoiceDetail } from 'src/app/models/m-invoice-detail';
import { MSalesOrderDetails } from 'src/app/models/m-sales-order-details';
import { MSalesOrderHeader } from 'src/app/models/m-sales-order-header';

@Component({
  selector: 'app-sales-order-pick',
  templateUrl: './sales-order-pick.component.html',
  styleUrls: ['./sales-order-pick.component.css']
})
export class SalesOrderPickComponent implements OnInit {
  json: Array<any>;
  myForm: FormGroup;
  item_details: Array<MInvoiceDetail>;
  sales_order_header: MSalesOrderHeader;
  user_details: MUserDetails = null;
  temp_order_list: MSalesOrderDetails;
  sales_order_details: Array<MSalesOrderDetails> = null;
  businessdate: Date;
  documentTypeDetailId: number;
  documentNo: any;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    localStorage.setItem('pos_mode', 'true');
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
     // .log(this.user_details);
    }

    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
    this.createForm();
    this.temp_order_list = new MSalesOrderDetails();
    this.sales_order_details = new Array<MSalesOrderDetails>();
  }
  createForm() {

    this.myForm = this.fb.group({
      sku_code: [''],
      customer: ['']
    });
    this.clear_controls();
  }
  clear_controls() {
    //this.getStoreList();
  }

  ngOnInit() {
    this.documentNo = this.activatedRoute.snapshot.paramMap.get('id');
    this.get_sales_order();
  }

  get_sales_order() {
    this.sales_order_details = null;
    this.json = null;
    this.common.showSpinner();
    this.api.getAPI("salesorder?storeid=" + this.user_details.storeID + "&HeaderID=" + this.documentNo)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.json = data.responseDynamicData;
            this.sales_order_details = data.responseDynamicData.salesOrderDetailsList;
            /*for(let item_list in this.json)
            {
              this.sales_order_details= item_list.sa
            }*/
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

  get_sku_data() {
    this.common.showSpinner();
    this.api.getAPI("invoice?skucode=" + this.myForm.get('sku_code').value + "&storeid=" + this.user_details.storeID)
      .subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {

          setTimeout(() => {
            // this.common.showMessage('', 'SKU Search Success');
            this.myForm.controls['sku_code'].setValue('');
            this.add_sku(data.skuMasterTypesList);
            this.common.hideSpinner();
          }, this.common.time_out_delay);
        }
      });
  }
  add_sku(sku_list: Array<any>) {
    this.temp_order_list = null;
    let styleCode: string;
    let skucode: string;
    let price: number;
    let sellingLineTotal: number;
    for (let picked of this.sales_order_details) {
      for (let item of sku_list) {
        if ((item.skucode == picked.skuCode) && (picked.qty < item.stock)) {
          picked.pickedQty += picked.pickedQty;
        }
        else {
          this.common.showMessage('warn', 'Stock Not Found.');
        }
      }
    }

    //this.sales_order_details.push();
  }

  customer_search() { }
}
