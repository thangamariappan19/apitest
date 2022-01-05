import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MStoreMaster } from 'src/app/models/m-store-master';
import { MStorebrandmappingMaster } from 'src/app/models/m-storebrandmapping-master';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MBinConfigMaster } from 'src/app/models/m-bin-config-master';

@Component({
  selector: 'app-store-edit',
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.css']
})
export class StoreEditComponent implements OnInit {
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
  shopbrandName:string;
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
  uniqueArray=[];
  selectedshopBrandList=[];
  //selectedItems
  requiredField: boolean;
  brandselList:string="";
  shopbrandselList:string="";
  uniq_values=[]
  user_details: MUserDetails = null;
  userid:number;
  current_store_image: string = "assets/img/preview-image.png";
  current_license_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";
  simage:any;
  limage:any;

  binConfig: Array<MBinConfigMaster>;
  binConfigData: MBinConfigMaster;
  show: boolean = false;
  binID:any;

  @ViewChild('fileInput1')
  myFileInput1: ElementRef;
  @ViewChild('fileInput2')
  myFileInput2: ElementRef;

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
      storeCode: ['', Validators.required],
      storeName: ['', Validators.required],
      storeSize: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      gradeID: [0, Validators.required],
      countryID: [0, Validators.required],
      stateID: [0, Validators.required],
      cityID: [0, Validators.required],
      storegroupID: [0, Validators.required],
      storecompanyID: [0, Validators.required],
      pricelistID: [0, Validators.required],
      noofoptions: [0, Validators.required],
      brandID: [0, Validators.required],
      subbrandID: [0, Validators.required],
      franchiselistID: [0, Validators.required],
      storetypeID: [0, Validators.required],
      address: ['', Validators.required],
      location: ['', Validators.required],
      remarks: [''],
      storeheader: ['', Validators.required],
      storefooter: ['', Validators.required],
      invoiceprintcount: [0, Validators.required],
      returnprintcount: [0, Validators.required],
      exchangeprintcount: [0, Validators.required],
      diskid: [0, Validators.required],
      cpuid: [0, Validators.required],
      emailtemplate: ['', Validators.required],
      smstemplate: ['', Validators.required],
      enableonlinestock: [false],
      enableorderfulfillment: [false],
      enablefingerprint: [false],
      active: [false],
      noOfLevels: [''],
      enableBin: [false]
    });
    this.getStaticValues();
    this.mappingList = new Array<MStorebrandmappingMaster>()
    this.binConfig = new Array<MBinConfigMaster>();
    this.myForm.get('noOfLevels').disable();
    this.getCountry();
    this.getCityList();
    this.getPriceList();
    this.getFranchise();
    this.getBrand();
    this.clear_controls();
  }
  clear_controls() {
    this.store = new MStoreMaster();
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
    if(this.current_store_image!=null)
    {
      this.myFileInput1.nativeElement.value = '';
      this.Store_image=null;
      this.current_store_image=null;    
    }
  }
  delLicenseImage()
  {
    if(this.current_license_image!=null)
    {
      this.myFileInput2.nativeElement.value = '';
      this.License_image=null;
      this.current_license_image=null
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
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStore();
  }
  getStore() {
    this.common.showSpinner();
    this.api.getAPI("store?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['storeCode'].setValue(data.storeMasterData.storeCode);
            this.myForm.controls['storeName'].setValue(data.storeMasterData.storeName);
            this.myForm.controls['storeSize'].setValue(data.storeMasterData.storeSize);
            this.myForm.controls['startDate'].setValue(this.common.toYMDFormat(new Date(data.storeMasterData.startDate)));
            this.myForm.controls['endDate'].setValue(this.common.toYMDFormat(new Date(data.storeMasterData.endDate)));
            this.myForm.controls['gradeID'].setValue(data.storeMasterData.grade);
            this.myForm.controls['countryID'].setValue(data.storeMasterData.countrySetting);
            this.getStateList();
            this.getStoreGroupList();
            this.getStoreCompanyList();
            this.myForm.controls['stateID'].setValue(data.storeMasterData.stateID);
            this.myForm.controls['cityID'].setValue(data.storeMasterData.cityID);
            this.myForm.controls['storegroupID'].setValue(data.storeMasterData.storeGroup);
            this.myForm.controls['storecompanyID'].setValue(data.storeMasterData.storeCompany);
            this.myForm.controls['pricelistID'].setValue(data.storeMasterData.priceListID);
            this.myForm.controls['noofoptions'].setValue(data.storeMasterData.noOfOptions);
            this.myForm.controls['brandID'].setValue(data.storeMasterData.brandID);
            this.brandName = data.storeMasterData.brand;
            this.shopbrandName=data.storeMasterData.shopBrand;
            //console.log(this.shopbrandName);
            //this.brandName
            //this.getbrandIdbyBrandName();
            //this.getSubBrand();
            //this.myForm.controls['subbrandID'].setValue(data.storeMasterData.shopBrand);
            this.myForm.controls['franchiselistID'].setValue(data.storeMasterData.franchiseID);
            this.myForm.controls['storetypeID'].setValue(data.storeMasterData.storeType);
            this.myForm.controls['address'].setValue(data.storeMasterData.address);
            this.myForm.controls['location'].setValue(data.storeMasterData.location);
            this.myForm.controls['remarks'].setValue(data.storeMasterData.remarks);
            this.myForm.controls['storeheader'].setValue(data.storeMasterData.storeHeader);
            this.myForm.controls['storefooter'].setValue(data.storeMasterData.storeFooter);
            this.myForm.controls['invoiceprintcount'].setValue(data.storeMasterData.printCount);
            this.myForm.controls['returnprintcount'].setValue(data.storeMasterData.returnPrintCount);
            this.myForm.controls['exchangeprintcount'].setValue(data.storeMasterData.exchangePrintCount);
            this.myForm.controls['diskid'].setValue(data.storeMasterData.diskID);
            this.myForm.controls['cpuid'].setValue(data.storeMasterData.cpuid);
            this.myForm.controls['emailtemplate'].setValue(data.storeMasterData.emailTemplate);
            this.myForm.controls['smstemplate'].setValue(data.storeMasterData.smsTemplate);
            this.myForm.controls['enableonlinestock'].setValue(data.storeMasterData.enableOnlineStock);
            this.myForm.controls['enableorderfulfillment'].setValue(data.storeMasterData.enableOrderFulFillment);
            this.myForm.controls['enablefingerprint'].setValue(data.storeMasterData.enableFingerPrint);
            this.myForm.controls['active'].setValue(data.storeMasterData.active);
            this.stateCode = data.storeMasterData.stateCode;
            this.countryCode = data.storeMasterData.countryCode;
            this.storeCompanycode = data.storeMasterData.storeCompanyCode;
            this.priceListCode = data.storeMasterData.priceListCode;
            this.storeGroupCode = data.storeMasterData.storeGroupCode;
            this.Store_image=data.storeMasterData.storeImage;
            this.License_image=data.storeMasterData.licenseImage;
            this.current_store_image = data.storeMasterData.storeImage == null || data.storeMasterData.storeImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.storeMasterData.storeImage;
            this.current_license_image = data.storeMasterData.licenseImage == null || data.storeMasterData.licenseImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.storeMasterData.licenseImage;
            this.getBin();

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

  getBin(){
    this.common.showSpinner();
    this.api.getAPI("BinLevel?id=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.binConfig=data.binConfigMasterList;
            this.myForm.controls['enableBin'].setValue(this.binConfig[0].enableBin);
            this.myForm.controls['noOfLevels'].setValue(this.binConfig.length);
            if(this.binConfig[0].enableBin==true)
            {
              this.show=true;
            }
          } else {
            /*let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);*/
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }  
  getBrandItems()
  {
    if(this.brandName!=null)
    {
      let item=this.brandName.split(";")
      //console.log(item[0],item[1],item[2]);
      for(let i=0;i<this.brand_list.length;i++)
      {
        for(let j=0;j<item.length;j++)
        {
          if(this.brand_list[i].brandName==item[j])    
          {     
            this.selectedBrandList.push({
            id:this.brand_list[i].id,
            brandName:item[j]
          });
        }
      }        
      }
    }
    //console.log(this.selectedBrandList);
  }
  getshopBrandItems()
  {
    if(this.shopbrandName!=null)
    {
      let item=this.shopbrandName.split(";")
      //console.log(item[0],item[1],item[2]);
      for(let i=0;i<this.brand_list.length;i++)
      {
        for(let j=0;j<item.length;j++)
        {
          if(this.brand_list[i].brandName==item[j])    
          {     
            this.selectedshopBrandList.push({
            id:this.brand_list[i].id,
            brandName:item[j]
          });
        }
      }        
    }
    }
    //console.log(this.selectedshopBrandList);
  }

  getBrandSelectedItems(){
    if (this.selectedBrandList!=null)
    {
      for(let i=0;i<this.selectedBrandList.length;i++)
      {
        if(this.brandselList!="")
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
    if (this.selectedshopBrandList!=null)
    {
      for(let i=0;i<this.selectedshopBrandList.length;i++)
      {
        if(this.shopbrandselList!="")
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
  update_store() {
    this.addBrandMappingList();
    this.getBrandSelectedItems();
    this.getShopBrandSelectedItems();
    
    if (this.store == null) {
      this.common.showMessage("warn", "Can not Update, Year is invalid.");
    } else if (this.binConfig.length == 0 && this.show==true) {
      this.common.showMessage("warn", "Can not Update, Bin Config are invalid.");
    }
    else if (this.Store_image==null) {
      this.common.showMessage("warn", "Can not Update,  Please Upload Store image.");
    } 
    else if (this.License_image==null) {
      this.common.showMessage("warn", "Can not Update, Please Upload License image.");
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

      this.store.id = this.id;
      this.store.storeCode = this.myForm.get('storeCode').value;
      this.store.storeName = this.myForm.get('storeName').value;
      this.store.storeSize = this.myForm.get('storeSize').value;
      this.store.startDate = this.myForm.get('startDate').value;
      this.store.endDate = this.myForm.get('endDate').value;
      this.store.grade = this.myForm.get('gradeID').value;
      this.store.countrySetting = this.myForm.get('countryID').value;
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
      this.store.storeHeader= this.myForm.get('storeheader').value;
      this.store.storeFooter = this.myForm.get('storefooter').value;     
      this.store.printCount = this.myForm.get('invoiceprintcount').value;
      this.store.returnPrintCount = this.myForm.get('returnprintcount').value;
      this.store.exchangePrintCount = this.myForm.get('exchangeprintcount').value;
      this.store.storeImage = this.Store_image;
      this.store.licenseImage = this.License_image;
      this.store.diskID = this.myForm.get('diskid').value;
      this.store.CPUID= this.myForm.get('cpuid').value;
      this.store.EmailTemplate= this.myForm.get('emailtemplate').value;
      this.store.SMSTemplate= this.myForm.get('smstemplate').value;
      this.store.EnableOnlineStock= this.myForm.get('enableonlinestock').value;
      this.store.EnableOrderFulFillment= this.myForm.get('enableorderfulfillment').value;
      this.store.EnableFingerPrint= this.myForm.get('enablefingerprint').value;
      this.store.Active= this.myForm.get('active').value;
      this.store.SelectStoreBrandMappingList=this.mappingList;
      this.store.StateCode=this.stateCode;
      this.store.CountryCode=this.countryCode;
      this.store.StoreCompanyCode=this.storeCompanycode;
      this.store.PriceListCode=this.priceListCode;
      this.store.storeGroupCode=this.storeGroupCode; 
      this.store.CreateBy=this.userid; 
            
     // .log(this.store);
      this.common.showSpinner();
      this.api.putAPI("store", this.store).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Updated successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.addBin();
          //this.clear_controls();
          //this.router.navigate(['store']);
        } else {
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
      let record = false;
      for (let bin of this.binConfig) {
        if(bin.id==0)
        {
          record=true;
        }
        else
        {
          record=false;
        }
      }
      if(record==true)
      {
      this.common.showSpinner();
      this.binConfigData.storeID=this.id;
      this.binConfigData.binLevelMasterList=this.binConfig;

      this.api.postAPI("binlevel", this.binConfigData).subscribe((data) => {

        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', data.displayMessage);
          //this.clear_controls();
          this.clear_controls();
          this.router.navigate(['store']);
        } /*else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }*/
      });
    }
    else
    {
      this.clear_controls();
      this.router.navigate(['store']);
    }
    }
  }

  getbrandIdbyBrandName() {
    for (let brandid of this.brand_list) {
      if (brandid.brandName == this.brandName) {
        this.myForm.controls['brandID'].setValue(brandid.id);
      }
    }
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
            //console.log(this.brand_list);

            this.selectedshopBrandList = [];
            this.selectedBrandList = [];

            this.getBrandItems();
            this.getshopBrandItems();

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
        
            console.log(this.selectedBrandList);
            console.log(this.selectedshopBrandList);

            //this.selectedshopBrandList = [];
            //this.selectedBrandList = [];
            
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
    console.log(this.selectedBrandList);
  }
  onSelectAllBrand(items: any) {
    console.log(this.selectedBrandList);
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
    this.subbrand_list = null;
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
      });
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
  }
  addBrandMappingList() {
    let tempmappingcode: MStorebrandmappingMaster = {
      countryID: this.myForm.get('countryID').value,
      brandID: this.myForm.get('brandID').value,
      storeCode: this.myForm.get('storeCode').value,
      countryCode: this.countryCode,
      brandCode: this.brandCode,
      franchiseID: this.myForm.get('franchiselistID').value,
      franchiseCode: this.franchiseCode
    }
    this.mappingList.push(tempmappingcode);
  }*/

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
    this.current_store_image="data:image/png;base64"+","+base64result;
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
    this.current_license_image="data:image/png;base64"+","+base64result;
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
    let level = this.myForm.get('noOfLevels').value;
    for (let i = 0; i < level; i++) {
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
