import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MStoreMaster } from 'src/app/models/m-store-master';
import { MStorebrandmappingMaster } from 'src/app/models/m-storebrandmapping-master';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { stringify } from 'querystring';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MBinConfigMaster } from 'src/app/models/m-bin-config-master';

@Component({
  selector: 'app-store-add',
  templateUrl: './store-add.component.html',
  styleUrls: ['./store-add.component.css']
})
export class StoreAddComponent implements OnInit {
  myForm: FormGroup;
  store: MStoreMaster;
  countryList: Array<any>;
  countryCode: any;
  storegroup_list: Array<any>;
  storeGroupCode: string;
  store_list: Array<any>;
  storeCode: string;
  state_list: Array<any>;
  stateCode: string;
  storeCompany_list: Array<any>;
  storeCompanycode: string;
  city_list: Array<any>;
  cityCode: string;
  price_list: Array<any>;
  priceListCode: string;
  franchise_list: Array<any>;
  franchiseCode: string;
  brand_list: Array<any>;
  brandCode: string;
  subbrand_list: Array<any>;
  subbrandCode: string;
  mappingList: Array<MStorebrandmappingMaster>;
  id: any;
  brandName: string;
  subbrandName: string;
  Store_image: any;
  License_image: any;
  shopbrand_list:Array<any>;
  //dropdownList :Array<any>;
  //selectedItems :Array<any>;
  dropdownList = [];
  shopdropdownList = [];
  selectedItems = [];
  brandDropdownSettings: IDropdownSettings = {};
  shopbrandDropdownSettings: IDropdownSettings = {};
  brandDropdownList = [];
  shopbrandDropdownList = [];
  selectedBrandList = [];
  selectedshopBrandList=[];
  //selectedItems
  requiredField: boolean;
  brandselList:string=null;
  shopbrandselList:string=null;
  user_details: MUserDetails = null;
  userid:number;
  simage:any;
  limage:any;

  binConfig: Array<MBinConfigMaster>;
  binConfigData: MBinConfigMaster;
  show: boolean = false;
  binID:any;
  isDisableBin: boolean = false;

  @ViewChild('fileInput1')
  myFileInput1: ElementRef;
  @ViewChild('fileInput2')
  myFileInput2: ElementRef;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      storeCode: ['', Validators.required],
      storeName: ['', Validators.required],
      storeSize: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      gradeID: ['', Validators.required],
      countryID: ['', Validators.required],
      stateID: ['', Validators.required],
      cityID: ['', Validators.required],
      storegroupID: ['', Validators.required],
      storecompanyID: ['', Validators.required],
      pricelistID: ['', Validators.required],
      noofoptions: ['', Validators.required],
      brandID: [''],
      subbrandID: [''],
      franchiselistID: ['', Validators.required],
      storetypeID: ['', Validators.required],
      address: ['', Validators.required],
      location: ['', Validators.required],
      remarks: [''],
      storeheader: ['', Validators.required],
      storefooter: ['', Validators.required],
      invoiceprintcount: ['', Validators.required],
      returnprintcount: ['', Validators.required],
      exchangeprintcount: ['', Validators.required],
      diskid: [''],
      cpuid: [''],
      emailtemplate: ['', Validators.required],
      smstemplate: ['', Validators.required],
      enableonlinestock: [false],
      enableorderfulfillment: [false],
      enablefingerprint: [false],
      active: [true],
      dropdownList: [],
      fileInput1:[''],
      fileInput2:[''],
      noOfLevels: [''],
      enableBin: [false]
    });

    this.binConfig = new Array<MBinConfigMaster>();
    this.getStaticValues();
    this.myForm.get('noOfLevels').disable();
    this.mappingList = new Array<MStorebrandmappingMaster>();
    //this.dropdownList= new Array<any>();
    this.clear_controls();
  }
  clear_controls() {
    this.store = new MStoreMaster();
    this.myForm.get('storeCode').setValue('');
    this.myForm.get('storeName').setValue('');
    this.myForm.get('storeSize').setValue('');
    this.myForm.get('startDate').setValue('');
    this.myForm.get('endDate').setValue('');
    this.myForm.get('gradeID').setValue('');
    this.myForm.get('countryID').setValue('');
    this.myForm.get('stateID').setValue('');
    this.myForm.get('cityID').setValue('');
    this.myForm.get('storegroupID').setValue('');
    this.myForm.get('storecompanyID').setValue('');
    this.myForm.get('pricelistID').setValue('');
    this.myForm.get('noofoptions').setValue('');
    //this.myForm.get('brandID').setValue('');
    //this.myForm.get('subbrandID').setValue('');
    this.myForm.get('franchiselistID').setValue('');
    this.myForm.get('storetypeID').setValue('');
    this.myForm.get('address').setValue('');
    this.myForm.get('location').setValue('');
    this.myForm.get('remarks').setValue('');
    this.myForm.get('storeheader').setValue('');
    this.myForm.get('storefooter').setValue('');
    this.myForm.get('invoiceprintcount').setValue('');
    this.myForm.get('returnprintcount').setValue('');
    this.myForm.get('exchangeprintcount').setValue('');
    //this.myForm.get('storeimage').setValue(0);
    //this.myForm.get('licenseimage').setValue(0);
    this.myForm.get('diskid').setValue('');
    this.myForm.get('cpuid').setValue('');
    this.myForm.get('emailtemplate').setValue('');
    this.myForm.get('smstemplate').setValue('');
    this.myForm.get('enableonlinestock').setValue(false);
    this.myForm.get('enableorderfulfillment').setValue(false);
    this.myForm.get('enablefingerprint').setValue(false);
    this.myForm.get('active').setValue(true);
    if(this.Store_image!=null)
    {
      this.myFileInput1.nativeElement.value = '';
      this.simage=null;
      }
    if(this.License_image!=null)
    {
      this.myFileInput2.nativeElement.value = '';
      this.limage=null;
      }
      this.selectedshopBrandList = [];
      this.selectedBrandList = [];
      this.Store_image=null;
      this.License_image=null;
      this.brandselList=null;
      this.shopbrandselList=null;

  }

  ngOnInit() {
    this.getCountry();
    this.getCityList();
    this.getPriceList();
    this.getFranchise();
    this.getBrand();
  }
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;      
    }
  }
  delStoreImage()
  {
    if(this.Store_image!=null)
    {
      this.myFileInput1.nativeElement.value = '';
      this.simage=null;
      this.Store_image=null;    
    }
  }
  delLicenseImage()
  {
    if(this.License_image!=null)
    {
      this.myFileInput2.nativeElement.value = '';
      this.limage=null;
      this.License_image=null
    }
  }
  
  restrictSpecialChars(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      || (k >= 48 && k <= 57));
  }
  getCountry() {
    this.countryList = null;
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.countryList = data.countryMasterList;
           // .log(this.countryList);
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
  countrycode() {
    if (this.countryList != null && this.countryList.length > 0) {
      for (let country of this.countryList) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
    this.getStateList();
    this.getStoreGroupList();
    this.getStoreCompanyList();
  }
  getStateList() {
    this.store_list = null;
    this.common.showSpinner();
    this.api.getAPI("StateMasterLookUp?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.state_list = data.stateMasterList;
           // .log(this.state_list);
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
  statecode() {
    if (this.state_list != null && this.state_list.length > 0) {
      for (let state of this.state_list) {
        if (state.id == this.myForm.get('stateID').value) {
          this.stateCode = state.stateCode;
          break;
        }
      }
    }
  }

  getStoreGroupList() {
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

  storegroupcode() {
    if (this.storegroup_list != null && this.storegroup_list.length > 0) {
      for (let storegroup of this.storegroup_list) {
        if (storegroup.id == this.myForm.get('storegroupID').value) {
          this.storeGroupCode = storegroup.storeGroupCode;
          break;
        }
      }
    }
  }

  getStoreCompanyList() {
    this.store_list = null;
    this.common.showSpinner();
    this.api.getAPI("CompanyLookUp?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.storeCompany_list = data.companySettingsList;
           // .log(this.storeCompany_list);
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
  storecompanycode() {
    if (this.storeCompany_list != null && this.storeCompany_list.length > 0) {
      for (let storecompany of this.storeCompany_list) {
        if (storecompany.id == this.myForm.get('storecompanyID').value) {
          this.storeCompanycode = storecompany.companyCode;
          break;
        }
      }
    }
  }
  getCityList() {
    this.store_list = null;
    this.common.showSpinner();
    this.api.getAPI("CityMaster?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.city_list = data.cityList;
           // .log(this.city_list);
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
  citycode() {
    if (this.city_list != null && this.city_list.length > 0) {
      for (let city of this.city_list) {
        if (city.id == this.myForm.get('cityID').value) {
          this.cityCode = city.cityCode;
          break;
        }
      }
    }
  }
  getPriceList() {
    this.store_list = null;
    this.common.showSpinner();
    this.api.getAPI("PriceListMasterLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.price_list = data.priceListTypeData;
           // .log(this.city_list);
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
  pricelistcode() {
    if (this.price_list != null && this.price_list.length > 0) {
      for (let pricelist of this.price_list) {
        if (pricelist.id == this.myForm.get('pricelistID').value) {
          this.priceListCode = pricelist.priceListCode;
          break;
        }
      }
    }
  }
  getFranchise() {
    this.store_list = null;
    this.common.showSpinner();
    this.api.getAPI("FranchiseLookup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.franchise_list = data.responseDynamicData;
            this.franchise_list = data.franchiseList;
           // .log(this.franchise_list);
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
  franchiselistcode() {
    if (this.franchise_list != null && this.franchise_list.length > 0) {
      for (let franchise of this.franchise_list) {
        if (franchise.id == this.myForm.get('franchiselistID').value) {
          this.franchiseCode = franchise.franchiseCode;
          break;
        }
      }
    }
  }
  getBrand() {
    this.brand_list = null;
    this.common.showSpinner();
    this.api.getAPI("BrandLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.brand_list = data.responseDynamicData;
            this.brand_list = data.brandList;

            // console.log(this.brand_list);

            this.brandDropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'brandName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              enableCheckAll: true,
              allowSearchFilter: true,
              itemsShowLimit:4
            };
            // itemsShowLimit: 3,

            this.shopbrandDropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'brandName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              enableCheckAll: true,
              allowSearchFilter: true,
              itemsShowLimit:4
            };
        
            this.selectedshopBrandList = [];

            // this.brandDropdownList = this.brand_list;
            this.selectedBrandList = [];
            //this.getBrandSelectedItems();
            // console.log(this.selectedBrandList);
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

  onSelectBrand(item: any) {
    // console.log(this.selectedBrandList);
  }
  onSelectAllBrand(items: any) {
    // console.log(this.selectedBrandList);
  }

  setStatus() {
    (this.selectedItems.length > 0) ? this.requiredField = true : this.requiredField = false;
  }

  setClass() {
    this.setStatus();
    if (this.selectedItems.length > 0) { return 'validField' }
    else { return 'invalidField' }
  }
 
  brandcode() {
    if (this.brand_list != null && this.brand_list.length > 0) {
      for (let brand of this.brand_list) {
        if (brand.id == this.myForm.get('brandID').value) {
          this.brandCode = brand.brandCode;
          this.brandName = brand.brandName;
          break;
        }
      }
    }
    //this.getSubBrand();
  }

  /*getSubBrand() {

       /*this.subbrand_list = null;
    this.common.showSpinner();
    this.api.getAPI("subbrand?brandid=" + this.myForm.get('brandID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.subbrand_list = data.responseDynamicData;
           // .log(this.subbrand_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });*/
  //}
  /*onSelectShopBrand(item: any) {
    console.log(this.selectedshopBrandList);
  }
  onSelectAllShopBrand(items: any) {
    console.log(this.selectedshopBrandList);
  }
  
  subbrandcode() {
    if (this.subbrand_list != null && this.subbrand_list.length > 0) {
      for (let subbrand of this.subbrand_list) {
        if (subbrand.id == this.myForm.get('subbrandID').value) {
          this.subbrandCode = subbrand.subBrandCode;
          this.subbrandName = subbrand.subBrandName;
          break;
        }
      }
    }
  }*/
  getBrandSelectedItems(){
    //this.brandselList="";
    if (this.selectedBrandList!=null)
    {
      for(let i=0;i<this.selectedBrandList.length;i++)
      {
        if(this.brandselList!=null)
        {
        this.brandselList = this.brandselList + ";" + this.selectedBrandList[i].brandName;
        }
        else
        {
          this.brandselList = this.selectedBrandList[i].brandName;
        }
      }
    }
  }
  getShopBrandSelectedItems(){
    //[his.shopbrandselList="";
    if (this.selectedshopBrandList!=null)
    {
      for(let i=0;i<this.selectedshopBrandList.length;i++)
      {
        if(this.shopbrandselList!=null)
        {
        this.shopbrandselList = this.shopbrandselList + ";" + this.selectedshopBrandList[i].brandName;
        }
        else
        {
          this.shopbrandselList = this.selectedshopBrandList[i].brandName;
        }
      }
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }  
  addBrandMappingList() {
    if(this.selectedBrandList != null){
      for(let i = 0; i < this.brand_list.length; i++)
      {
      for (let j = 0; j < this.selectedBrandList.length; j++)
        {
          if(this.selectedBrandList[j].brandName == this.brand_list[i].brandName)
          {
            let tempmappingcode: MStorebrandmappingMaster = {
            countryID: this.myForm.get('countryID').value,
            brandID: this.brand_list[i].id,
            storeCode: this.myForm.get('storeCode').value,
            countryCode: this.countryCode,
            brandCode: this.brand_list[i].brandCode,
            franchiseID: this.myForm.get('franchiselistID').value,
            franchiseCode: this.franchiseCode
            }
            this.mappingList.push(tempmappingcode);
          }
        }
      }
  }
}
  quickadd_store() {
    this.addBrandMappingList();
    this.getBrandSelectedItems();
    this.getShopBrandSelectedItems();
    
    if (this.store == null) {
      this.common.showMessage("warn", "Can not Save, Store Data is invalid.");
    }
    else if (this.binConfig.length == 0 && this.show==true) {
      this.common.showMessage("warn", "Can not Save, Bin Config are invalid.");
    } 
    else if (this.Store_image==null) {
      this.common.showMessage("warn", "Can not Save,  Please Upload Store image.");
    } 
    else if (this.License_image==null) {
      this.common.showMessage("warn", "Can not Save, Please Upload License image.");
    } 
     else {

      var date1:any = new Date(this.myForm.get('startDate').value);
      var date2:any = new Date(this.myForm.get('endDate').value);
      var noofdays:any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        
      if(noofdays<0)
      {
        this.common.showMessage('error', 'Start date should be less than End date');
        this.myForm.controls['startDate'].setValue('');
        this.myForm.controls['endDate'].setValue('');
      }  
      else{
      this.store.id = 0;
      this.store.storeCode = this.myForm.get('storeCode').value;
      this.store.storeName = this.myForm.get('storeName').value;
      this.store.storeSize = this.myForm.get('storeSize').value;
      this.store.startDate = this.myForm.get('startDate').value;
      this.store.endDate = this.myForm.get('endDate').value;
      this.store.grade = this.myForm.get('gradeID').value;
      this.store.countryID = this.myForm.get('countryID').value;
      this.store.stateID = this.myForm.get('stateID').value;
      this.store.CityID = this.myForm.get('cityID').value;
      this.store.storeGroup = this.myForm.get('storegroupID').value;
      this.store.storeCompany = this.myForm.get('storecompanyID').value;
      this.store.priceListID = this.myForm.get('pricelistID').value;
      this.store.noOfOptions = this.myForm.get('noofoptions').value;
      this.store.brand = this.brandselList;
      this.store.shopBrand = this.shopbrandselList;
      this.store.FranchiseID = this.myForm.get('franchiselistID').value;
      this.store.storeType = this.myForm.get('storetypeID').value;
      this.store.address = this.myForm.get('address').value;
      this.store.location = this.myForm.get('location').value;
      this.store.remarks = this.myForm.get('remarks').value;
      this.store.storeHeader = this.myForm.get('storeheader').value;
      this.store.storeFooter = this.myForm.get('storefooter').value;
      this.store.printCount = this.myForm.get('invoiceprintcount').value;
      this.store.returnPrintCount = this.myForm.get('returnprintcount').value;
      this.store.exchangePrintCount = this.myForm.get('exchangeprintcount').value;
      this.store.storeImage = this.Store_image;
      this.store.licenseImage = this.License_image;
      this.store.diskID = this.myForm.get('diskid').value;
      this.store.CPUID = this.myForm.get('cpuid').value;
      this.store.EmailTemplate = this.myForm.get('emailtemplate').value;
      this.store.SMSTemplate = this.myForm.get('smstemplate').value;
      this.store.EnableOnlineStock = this.myForm.get('enableonlinestock').value;
      this.store.EnableOrderFulFillment = this.myForm.get('enableorderfulfillment').value;
      this.store.EnableFingerPrint = this.myForm.get('enablefingerprint').value;
      this.store.Active = this.myForm.get('active').value;
      this.store.SelectStoreBrandMappingList = this.mappingList;
      this.store.StateCode = this.stateCode;
      this.store.CountryCode = this.countryCode;
      this.store.StoreCompanyCode = this.storeCompanycode;
      this.store.PriceListCode = this.priceListCode;
      this.store.storeGroupCode = this.storeGroupCode;
      this.store.CreateBy=this.userid;
      this.store.SelectStoreBrandMappingList=this.mappingList;


     // .log(this.store);
      this.common.showSpinner();
      this.api.postAPI("store", this.store).subscribe((data) => {
        console.log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.binID = data.iDs;
          //this.common.showMessage('success', 'Store saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.addBin();
          //this.clear_controls();
          //this.router.navigate(['store']);
        }
        else if(data != null && data.statusCode != null && data.statusCode == 2){
          this.common.hideSpinner();
          this.common.showMessage('', data.displayMessage);
        }
         else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
    }
  }

  addBin() {
    this.binConfigData = new MBinConfigMaster();
    /*if (this.binConfig.length == 0) {
      this.common.showMessage("warn", "Can not Save, Bin Config are invalid.");
    } else*/ {
      this.common.showSpinner();
      this.binConfigData.storeID=this.binID;
      this.binConfigData.binLevelMasterList=this.binConfig;

      this.api.postAPI("binlevel", this.binConfigData).subscribe((data) => {

        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', data.displayMessage);
          //this.clear_controls();
          this.clear_controls();
        } /*else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }*/
      });
    }
  }
  public picked1(event, field) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.Store_image = file;
      this.handleInputChange1(file); //turn into base64

    }
    else {
      alert("No file selected");
    }
  }
  handleInputChange1(files) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded1.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded1(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.Store_image = base64result;
    this.simage="data:image/png;base64"+","+base64result;
  }
  public picked2(event, field) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.License_image = file;
      this.handleInputChange2(file); //turn into base64

    }
    else {
      alert("No file selected");
    }
  }
  handleInputChange2(files) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded2.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded2(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.License_image = base64result;
    this.limage="data:image/png;base64"+","+base64result;
  }

  close() {    
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['store']);
          }  
        } 
      else
        {
          this.router.navigate(['store']);
        }
  }

  gridBind() {
    this.binConfig = new Array<MBinConfigMaster>();
    let level = this.myForm.get('noOfLevels').value;
    for (let i = 0; i < level; i++) {
      if(i != level-1){
      let templogdata: MBinConfigMaster = {
        id: 0,
        levelNo: i + 1,
        levelName: '',
        storeID: this.user_details.storeID,
        storeCode: this.myForm.get('storeCode').value,
        active:true,
        createBy:this.user_details.id,
        enableBin: this.myForm.get('enableBin').value
      }
      this.binConfig.push(templogdata);
      }
    else{
      let templogdata: MBinConfigMaster = {
        id: 0,
        levelNo: level,
        levelName: 'BIN',
        storeID: this.user_details.storeID,
        storeCode: this.myForm.get('storeCode').value,
        active:true,
        createBy:this.user_details.id,
        enableBin: this.myForm.get('enableBin').value
      }
      this.binConfig.push(templogdata);
      this.isDisableBin=true;
    }
  }
  }

  onCheckboxChange(e) {
    if (e.target.checked) {
      this.show=true;
      this.myForm.get('noOfLevels').enable();
    }
    else
    {
      this.show=false;
      this.myForm.get('noOfLevels').disable();
    }
  }
}