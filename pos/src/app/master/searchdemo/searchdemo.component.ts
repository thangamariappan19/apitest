import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';  
import { Observable, Subject } from 'rxjs'; 
import { HttpClient,HttpResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-searchdemo',
  templateUrl: './searchdemo.component.html',
  styleUrls: ['./searchdemo.component.css']
})
export class SearchdemoComponent implements OnInit {
  public clients: Observable<any[]>;  
  private searchTerms = new Subject<string>();  
  public CustomerName = '';  
  public flag: boolean = true;  
  constructor( private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router:Router,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.clients = this.searchTerms  
    .debounceTime(300)        // wait for 300ms pause in events  
    .distinctUntilChanged()   // ignore if next search term is same as previous  
    .switchMap(term => term   // switch to new observable each time  
      // return the http search observable  
      ? this.search(term)  
      // or the observable of empty heroes if no search term  
      : Observable.of<any[]>([]))  
    .catch(error => {  
      // TODO: real error handling  
      console.log(error);  
      return Observable.of<any[]>([]);  
    });  
  }
   // Push a search term into the observable stream.  
   searchClient(term: string): void {  
    this.flag = true;  
    this.searchTerms.next(term);  
  }  
  onselectClient(ClientObj) {     
    if (ClientObj.ClientId != 0) {  
      this.CustomerName = ClientObj.customerName;       
      this.flag = false;  
    }  
    else {  
      return false;  
    }  
  }  
  search(term: string): Observable<any[]> {  
    var ClientList = this.http.get(AppConstants.base_url + "api/Customer?CustSearchString=" + this.CustomerName)  
        .map((data:any) => { return (data.customerMasterData  != null ? data.customerMasterData : [{ "id": 0, "customerName": "No Record Found" }]) as any[] });  
    return ClientList;  
}  
}
