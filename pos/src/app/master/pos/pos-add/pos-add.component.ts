import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,FormControl, Validators } from '@angular/forms';
import { MPosMaster } from 'src/app/models/m-pos-master';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { debounceTime,distinctUntilChanged, tap, switchMap, finalize,startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-pos-add',
  templateUrl: './pos-add.component.html',
  styleUrls: ['./pos-add.component.css']
})
export class PosAddComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>;
  country_list: Array<any>;
  countryCode: string;
  storegroup_list: Array<any>;
  storegroupCode: string;
  store_list: Array<any>;
  storeCode: string;
  pos: MPosMaster;
  searchCustomerCtrl = new FormControl();
  filteredCustomers: any;
  filteredCustomers1: any;
  isLoading = false;
  errorMsg: string;
  defaultCustomerCode:string;
  defaultCustomerID:Number;
  

  constructor(private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private http: HttpClient
  ) { this.createForm(); }
  createForm() {

    this.myForm = this.fb.group({
      posCode: ['', Validators.required],
      posName: ['', Validators.required],
      countryID: ['', Validators.required],
      storeGroupID: ['', Validators.required],
      storeID: ['', Validators.required],
      printerDevice: [''],
      defaultCustomer: [''],
      poleDisplayPort: [''],
      posDisplayLineMessageOne: [''],
      posDisplayLineMessageTwo: [''],
      diskID: [''],
      cpuID: [''],
      active: [true]
    });
    this.getCountryList();
    this.clear_controls();
  }

  clear_controls() {
    this.storegroup_list = null;
		this.store_list = null;
    //this.getStoreGroupList();
    //this.getStoreList();
    this.pos = new MPosMaster();
    this.myForm.controls['posCode'].setValue('');
    this.myForm.controls['posName'].setValue('');
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['storeGroupID'].setValue('');
    this.myForm.controls['storeID'].setValue('');
    this.myForm.controls['printerDevice'].setValue('');
    this.myForm.controls['poleDisplayPort'].setValue('');
    this.myForm.controls['posDisplayLineMessageOne'].setValue('');
    this.myForm.controls['posDisplayLineMessageTwo'].setValue('');
    this.myForm.controls['diskID'].setValue('');
    this.myForm.controls['cpuID'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.searchCustomerCtrl.setValue('');
  }

  getCountryList() {
    this.country_list = null;
    this.common.showSpinner();
    this.api.getAPI("country")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.country_list = data.countryMasterList;
           // .log(this.country_list);
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

  getStoreGroupList() {
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }

    this.storegroup_list = null;
    this.common.showSpinner();
    this.api.getAPI("StoreGroupLookUp?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.storegroup_list = data.storeGroupMasterList;
           // .log(this.storegroup_list);
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




  getStoreList() {

    this.store_list = null;
    this.common.showSpinner();
    //this.api.getAPI("StoreLookUpOnStoreGroup?storeGroupID=" + this.myForm.get('storeGroupID').value)
    this.api.getAPI("StoreLookupOnStoreGroupandCountry?storeGroupID=" + this.myForm.get('storeGroupID').value + "&CountryId=" +this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.store_list = data.storeMasterList;
           // .log(this.store_list);
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

  ngOnInit() {
    this.getCountryList();
    this.searchCustomerCtrl.valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      tap(() => {
        this.errorMsg = "";
        this.filteredCustomers = [];
        this.isLoading = true;
      }),
      switchMap(value => this.http.get(AppConstants.base_url + "api/SearchEngine?CustomerSearchString=" + this.searchCustomerCtrl.value + "&i="+ 0)
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
        } 
        else 
          {
           this.errorMsg = "";
         
           this.filteredCustomers=data.searchEngineDataList;
           console.log(data.searchEngineDataList);

         }

       
      });

  }

  countrycode_Changed() {
    this.storegroup_list = null;
    this.store_list = null;
    this.myForm.controls['storeGroupID'].setValue('');
    this.myForm.controls['storeID'].setValue('');
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
    this.getStoreGroupList()
  }
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  storegroupcodeonchange() {
    this.store_list = null;
    this.myForm.controls['storeID'].setValue('');
    if (this.storegroup_list != null && this.storegroup_list.length > 0) {
      for (let storegroup of this.storegroup_list) {
        if (storegroup.id == this.myForm.get('storeGroupID').value) {
          this.storegroupCode = storegroup.storeGroupCode;
          break;
        }
      }
    }
    this.getStoreList()
  }

  storecode_Changed() {
    if (this.store_list != null && this.store_list.length > 0) {
      for (let store of this.store_list) {
        if (store.id == this.myForm.get('storeID').value) {
          this.storeCode = store.storeCode;
          break;
        }
      }
    }
  }

  quickadd_pos() {
    if (this.pos == null) {
      this.common.showMessage("warn", "Can not Save, Company Data is invalid.");
    }
    else if (this.searchCustomerCtrl.value == null || this.searchCustomerCtrl.value=='') 
    {
      this.common.showMessage("warn", "Can not Save, Default Customer is invalid.");
    }
    else {
      this.pos.id = 0;
      this.pos.posCode = this.myForm.get('posCode').value;
      this.pos.posName = this.myForm.get('posName').value;
      this.pos.countryID = this.myForm.get('countryID').value;
      this.pos.storegroupID = this.myForm.get('storeGroupID').value;
      this.pos.storeID = this.myForm.get('storeID').value;
      this.pos.printerdeviceName = this.myForm.get('printerDevice').value;
      this.pos.defaultCustomer=this.searchCustomerCtrl.value.id;
      this.pos.defaultcustomerCode = this.searchCustomerCtrl.value.code;
      this.pos.poledisplayPort = this.myForm.get('poleDisplayPort').value;
      this.pos.displaylinemsgOne = this.myForm.get('posDisplayLineMessageOne').value;
      this.pos.displaylinemsgTwo = this.myForm.get('posDisplayLineMessageTwo').value;
      this.pos.diskID = this.myForm.get('diskID').value;
      this.pos.cpuID = this.myForm.get('cpuID').value;
      this.pos.active = this.myForm.get('active').value;
      this.pos.countryCode = this.countryCode;
      this.pos.storeCode = this.storeCode;
      this.pos.storegroupCode = this.storegroupCode;


     // .log(this.pos);
      this.common.showSpinner();
      this.api.postAPI("pos", this.pos).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
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
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['pos-list']);
    }  
    } 
    else
    {
      this.router.navigate(['pos-list']);
  }
    }
    restrictSpecialChars(event) {
      var k;
      k = event.charCode;  //         k = event.keyCode;  (Both can be used)
      return ((k > 64 && k < 91) 
        || (k > 96 && k < 123) 
        || k == 8 
        || k == 32 
        // || k == 45 
        // || k == 47
        // || k == 95
        || (k >= 48 && k <= 57));
    }
    customerDisplayWith (customers: any) {
      if (customers) 
      {
        // const customers = this as any as { id: number, name: string ,code:string}[]
        this.defaultCustomerCode=customers.code;
        this.defaultCustomerID=customers.id;
        console.log(this.defaultCustomerCode);
        console.log(this.defaultCustomerID);
        return customers.name;
        
      } else {
        // when cityCode is '', display ''
        return ''
      }
    }
}
