import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';

import { debounceTime,distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-searchdemos',
  templateUrl: './searchdemos.component.html',
  styleUrls: ['./searchdemos.component.css']
})
export class SearchdemosComponent implements OnInit {
  searchCustomerCtrl = new FormControl();
  filteredCustomers: any;
  isLoading = false;
  errorMsg: string;
  constructor(private api: ApiService,
    private common: CommonService,
    private confirm: ConfirmService,
    public router:Router,
    private http: HttpClient) { 
    
  }

  ngOnInit(): void {
    this.searchCustomerCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredCustomers = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(AppConstants.base_url + "api/SearchEngine?CustSearchString=" + this.searchCustomerCtrl.value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
        )
        .subscribe((data:any)  => {
          if (data.searchEngineDataList == null) 
          {
            // this.errorMsg = data['Error'];
            this.filteredCustomers = [];
          } else {
            this.errorMsg = "";
            this.filteredCustomers = data.searchEngineDataList;
          }
  
          console.log(this.filteredCustomers);
        });
  }
  customerDisplayWith (cid: number) {
    if (cid) {
      const customers = this as any as { id: number, name: string }[]
      return customers.find(cus => cus.id === cid).name
    } else {
      // when cityCode is '', display ''
      return ''
    }
  }
}
