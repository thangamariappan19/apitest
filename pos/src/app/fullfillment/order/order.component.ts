import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonService } from '../../common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from '../../confirm/confirm.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  myForm: FormGroup;
  city_orders_list: any[];
  order_status_temp: null;
  reAllocation: boolean;
  reAllocationOrder: any;

  city_order: any;
  city_order_details: any[];
  noAllocationMade: boolean;
  city_store_stock_list: any;

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService) {
    this.createForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      from_date: [this.common.currentDate(), Validators.required],
      to_date: [this.common.currentDate(), Validators.required],
      order_status: ['', Validators.required],
      order_no: [''],
      order_reference: ['']
    });
  }

  ngOnInit() {
    // var dt = this.common.currentDate();
    //// .log(dt);
    // this.myForm.controls['from_date'].setValue(dt);
  }

  order_status_changed() {
    this.order_status_temp = this.myForm.get('order_status').value;
    // this.common.showMessage('info', this.order_status_temp);
  }

  collapse_item(item) {
    if (item.isCollasped == true) {
      item.isCollasped = false;
    } else {
      item.isCollasped = true;
    }
  }

  collapse_store_order(sd) {
    if (sd.isCollasped == true) {
      sd.isCollasped = false;
    } else {
      sd.isCollasped = true;
    }
  }

  clear_controls() {
    this.city_orders_list = [];
    this.reAllocation = false;
    this.reAllocationOrder = null;
    this.city_order = {};
    this.city_order_details = [];
    this.noAllocationMade = true;
    this.city_store_stock_list = {};
  }

  searchCityOrder() {
    this.clear_controls();
    //// .log("2====");
    //// .log(localStorage.getItem('token'));
    let dat1 = this.myForm.get('from_date').value;
    let dat2 = this.myForm.get('to_date').value;
    let status = this.myForm.get('order_status').value;
    let order_no = this.myForm.get('order_no').value;
    let order_reference = this.myForm.get('order_reference').value;
    this.order_status_temp = this.myForm.get('order_status').value;
    let statusTxt = status == 1 ? "OPEN" : status == 2 ? "INPROGRESS" : status == 3 ? "CLOSED" : status == 4 ? "CANCELLED" : "";
    //// .log(dat1 + '=>' + dat2 + '=>' + statusTxt);
    this.common.showSpinner();
    this.api.getAPI("cityorder?from_date=" + dat1 + "&to_date=" + dat2 + "&status=" + statusTxt
      + "&order_no=" + order_no + "&order_reference=" + order_reference).subscribe((data) => {
        setTimeout(() => {
          this.common.hideSpinner();
          
          if (data != null && data.responseData != null) {
            this.city_orders_list = data.responseData;
           // .log(this.city_orders_list);
          }
          if (this.city_orders_list.length <= 0) {
            this.common.showMessage('warn', 'No Orders found!');
          }
        }, 1000);
      });
  }

  cancel_store_order(sd) {
    this.confirm.confirm('Confirm', 'Do you realy want to cancel this Order?')
      .then((confirmed) => {
        //// .log(confirmed);
        if (confirmed == true) {
          let document_no = sd.documentNo;
          this.common.showSpinner();
          this.api.deleteAPI("cityorder?document_no=" + document_no)
            .subscribe((data) => {
              setTimeout(() => {
                this.common.hideSpinner();
                if (data != null && data.statusCode != null && data.statusCode == 200) {
                  this.common.showMessage('success', 'Store Order Cancelled Successfully.');
                  this.clear_controls();
                } else {
                  if (data != null && data.errorMessage != null) {
                    this.common.showMessage('error', data.errorMessage);
                  }
                }
              }, 1000);
            });
        }
      })
      .catch(() => {
        // this.common.showMessage('info', 'You Cancelled this Action.');
      });

  }

  getCityOrderAllocation(item: any, re_allocation: boolean, storeOrder: any) {
    this.common.showSpinner();
    this.reAllocation = false;
    if (re_allocation == true) {
      this.reAllocation = true;
      this.reAllocationOrder = storeOrder;
    }
    this.city_store_stock_list = {};
    this.city_order_details = [];
    this.city_order = item;
    this.noAllocationMade = true;
    if (item.cityOrderDetails != null && item.cityOrderDetails.length > 0) {
      for (var value of item.cityOrderDetails) {
        var itm = {
          id: value.id,
          skuCode: value.skuCode,
          qty: value.qty,
          price: value.price,
          statusCode: value.statusCode,
          allocatedNow: 0,
          allocatedQty: value.allocatedQty,
          openQty: parseInt(value.qty) - parseInt(value.allocatedQty)
        };
        this.city_order_details.push(itm);
      }
    }

    this.api.getAPI("cityorder?city_order_id=" + item.id).subscribe((data) => {
      setTimeout(() => {
        this.common.hideSpinner();
        if (data != null && data.responseData != null) {
          this.city_store_stock_list = data.responseData;
          if (this.city_store_stock_list != null && this.city_store_stock_list.stores != null
            && this.city_store_stock_list.stores.length > 0) {
            for (var store of this.city_store_stock_list.stores) {
              store.allocated = false;
            }
          }
        }
        if (this.city_store_stock_list.length <= 0) {
          this.common.showMessage('warn', 'No Stores found.')
        }
      }, 1000);
    });
  }

  allocateStore(stock: any) {
    if (stock.availableQty <= 0) {
      this.common.showMessage('warn', 'Can not allocate, No Stock Availalble.');
    } else if (stock.openQty <= 0) {
      this.common.showMessage('warn', 'Can not allocate, Open qty. is zero.');
    } else {
      this.noAllocationMade = true;
      let allocatedQty = parseInt(stock.availableQty) >= parseInt(stock.openQty)
        ? parseInt(stock.openQty) : parseInt(stock.availableQty);
      stock.allocatedQty = allocatedQty;
      stock.openQty = parseInt(stock.openQty) - allocatedQty;
      stock.availableQty = parseInt(stock.availableQty) - allocatedQty;
      var sku = stock.skuCode;
      if (this.city_order_details != null && this.city_order_details.length > 0) {
        for (var v1 of this.city_order_details) {
          if (v1.skuCode == sku) {
            var total_allocated_qty = 0;
            var open_qty = parseInt(v1.qty) - parseInt(v1.allocatedQty);
            if (this.city_store_stock_list != null
              && this.city_store_stock_list.stores != null
              && this.city_store_stock_list.stores.length > 0) {
              for (var v2 of this.city_store_stock_list.stores) {
                if (v2.stocks != null && v2.stocks.length > 0) {
                  var anyOneAllocated = false;
                  for (var v3 of v2.stocks) {
                    if (parseInt(v3.allocatedQty) > 0) {
                      anyOneAllocated = true;
                      this.noAllocationMade = false;
                    }
                    if (v3.skuCode == sku) {
                      if (parseInt(v3.allocatedQty) > 0) {
                        total_allocated_qty += parseInt(v3.allocatedQty);
                      }
                    }
                  }
                  v2.allocated = anyOneAllocated;
                }
              }
              v1.allocatedNow = total_allocated_qty;
              open_qty = open_qty - total_allocated_qty;
              v1.openQty = open_qty;

              for (var v4 of this.city_store_stock_list.stores) {
                if (v4.stocks != null && v4.stocks.length > 0) {
                  for (var v5 of v4.stocks) {
                    if (v5.skuCode == sku) {
                      v5.openQty = open_qty;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  cancelAllocation(stock: any) {
    this.noAllocationMade = true;
    stock.openQty = parseInt(stock.openQty) + parseInt(stock.allocatedQty);
    stock.availableQty = parseInt(stock.availableQty) + parseInt(stock.allocatedQty);
    stock.allocatedQty = 0;
    var sku = stock.skuCode;
    if (this.city_order_details != null && this.city_order_details.length > 0) {
      for (var v1 of this.city_order_details) {
        if (v1.skuCode == sku) {
          var total_allocated_qty = 0;
          var open_qty = parseInt(v1.qty) - parseInt(v1.allocatedQty);
          if (this.city_store_stock_list != null
            && this.city_store_stock_list.stores != null
            && this.city_store_stock_list.stores.length > 0) {
            for (var v2 of this.city_store_stock_list.stores) {
              if (v2.stocks != null && v2.stocks.length > 0) {
                var anyOneAllocated = false;
                for (var v3 of v2.stocks) {
                  if (parseInt(v3.allocatedQty) > 0) {
                    anyOneAllocated = true;
                    this.noAllocationMade = false;
                  }
                  if (v3.skuCode == sku) {
                    if (parseInt(v3.allocatedQty) > 0) {
                      total_allocated_qty += parseInt(v3.allocatedQty);
                    }
                  }
                }
                v2.allocated = anyOneAllocated;
              }
            }
            v1.allocatedNow = total_allocated_qty;
            open_qty = open_qty - total_allocated_qty;
            v1.openQty = open_qty;

            for (var v4 of this.city_store_stock_list.stores) {
              if (v4.stocks != null && v4.stocks.length > 0) {
                for (var v5 of v4.stocks) {
                  if (v5.skuCode == sku) {
                    v5.openQty = open_qty;
                  }
                }
              }
            }
          }
        }
      }

    }
  }

  saveAllocation() {
    var store_order_list = [];
    if (this.city_order != null) {
      if (this.city_store_stock_list != null
        && this.city_store_stock_list.stores != null
        && this.city_store_stock_list.stores.length > 0) {
        for (var v of this.city_store_stock_list.stores) {
          if (v.allocated == true) {
            var store_order_details = [];
            for (var v1 of v.stocks) {
              if (parseInt(v1.allocatedQty) > 0) {
                var item = {
                  skuid: v1.skuid,
                  skuCode: v1.skuCode,
                  orderQty: v1.allocatedQty,
                  issuedQty: 0,
                  price: v1.price,
                  statusID: 1,
                  statusCode: 'OPEN'
                };
                store_order_details.push(item);
              }
            }
            var store_order = {
              cityOrderID: this.city_order.id,
              storeID: v.storeID,
              totalQty: this.city_order.totalQty,
              totalAmount: this.city_order.totalAmount,
              discountType: this.city_order.discountType,
              discountValue: this.city_order.discountValue,
              netAmount: this.city_order.netAmount,
              customerCode: this.city_order.customerCode,
              customerPhoneNo: this.city_order.customerPhoneNo,
              statusID: 1,
              statusCode: 'OPEN',
              storeOrderDetails: store_order_details
            };
            store_order_list.push(store_order);
          }
        }
      }
    }

    if (store_order_list != null && store_order_list.length > 0) {
      this.common.showSpinner();
      this.api.postAPI("cityorder", store_order_list).subscribe((data) => {
        if (data != null && data.statusCode != null && (data.statusCode == 200 || data.statusCode == 201)) {
          if (this.reAllocation == true) {
            this.common.showMessage('success', 'Order Allocation saved, Reallocating Store Order is in progress.')
            this.reAllocationOrder.statusID = 8;
            this.reAllocationOrder.statusCode = 'REALLOCATED';
            if (this.reAllocationOrder.storeOrderDetails != null) {
              for (var v of this.reAllocationOrder.storeOrderDetails) {
                v.statusID = 8;
                v.statusCode = 'REALLOCATED';
              }
            }
            this.api.putAPI("cityorder?document_no=" + this.reAllocationOrder.id, this.reAllocationOrder).subscribe((data2) => {
              if (data2 != null && data2.statusCode != null && (data2.statusCode == 200 || data2.statusCode == 201)) {
                setTimeout(() => {
                  this.clear_controls();
                  this.common.hideSpinner();
                  this.common.showMessage('success', 'Store Order reallocated successfully.');
                }, 1000);
              }
              else {
                setTimeout(() => {
                  this.clear_controls();
                  this.common.hideSpinner();
                  this.common.showMessage('error', 'Failed to update reallocation.');
                }, 1000);
              }
            });

          } else {
            setTimeout(() => {
              this.clear_controls();
              this.common.hideSpinner();
              this.common.showMessage('success', 'Order Allocation saved successfully.');
            }, 1000);
          }
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to save Order Allocation.');
          }, 1000);
        }

      });
    }
  }
}
