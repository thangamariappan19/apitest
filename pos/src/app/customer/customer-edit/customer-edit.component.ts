import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCustomer } from 'src/app/models/m-customer';
import { MUserDetails } from 'src/app/models/m-user-details';
import { Ng2TelInputModule } from 'ng2-tel-input';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit {
  myForm: FormGroup;
  country_list: Array<any>;
  shippingcountry_list: Array<any>;
  shippingstate_list: Array<any>;
  getdob: string;
  customerGroup_List: Array<any>;
  state_List: Array<any>;
  countryCode: string;
  state_Code: string;
  customerGroupCodeFetch: string;
  businessdate: Date;
  customer_image: any;
  isReadonly: boolean;
  windowScrolled: boolean;
  documentNo: any;
  customer: MCustomer;
  customer_List: Array<MCustomer>;
  current_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";
  id: any;
  user_details: MUserDetails = null;
  shipping_state_Code: string;
  shipping_state_name: string;
  shippingCountryCode: any;
  state_name: string;
  Phonenolenght:any;
  SPhonenolenght:any;
  BPhonenolenght:any;
  initialCountry = '';
  @ViewChild('fileInput1')
  @ViewChild('phoneInput')
  phoneInput: ElementRef;
  @ViewChild('phoneInput1')
  phoneInput1: ElementRef;
  @ViewChild('phoneInput2')
  phoneInput2: ElementRef;
  myFileInput1: ElementRef;
  iso2feild:string;
  ShippingIsoCode:string;
  AddressIsoCode:string;
  
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { this.createForm(); }
  createForm() {

    this.myForm = this.fb.group({
      // sku_code: [''],
      // discount_value: [0],
      // current_discount_type: ['Percentage']
      //order_status: ['', Validators.required],
      customerCode: [''],
      customerName: ['', Validators.required],
      //phoneNumber:['',Validators.required],
      phoneNumber: [''],
      dob: [''],
      alterPhoneNumber: [''],
      email: [''],
      gender: [''],
      buildingAndBlockNo: [''],
      streetName: [''],
      areaName1: [''],
      areaName2: [''],
      city: [''],
      customerGroupID: ['', Validators.required],
      creditAmount: [''],
      onAccountApplicable: [false],
      countryID: ['', Validators.required],
      remarks: [''],
      stateID: ['', Validators.required],
      active: [false],
      pincode: [''],
      shippingAddress1: [''],
      shippingAddress2: [''],
      shippingPhoneNumber: [''],
      shippingStateID: [''],
      shippingCity: [''],
      shippingPincode: [''],
      phone1: [''],
      shippingcountryID: [''],
      shippingcheck:[false],
      fileInput1:[''],

      lastName: [''],
      subGroupID:[''],
      subGroupCode:[''],
      paymentTermsDays:[''],
      creditDays:[''],
      isLoyalty:[true],
      isTaxExempt:[true],
      loyaltyID:[''],
      loyaltyPlan:['']
    });
    this.isReadonly = false;
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      
    }
    this.clear_controls();
  }
  clear_controls() {
    this.getCountryList();
    this.getCustomerGroupList();
    //this.getAllStateList();
    this.customer = new MCustomer();
  }

  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 1000) {
        this.windowScrolled = true;
    } 
   else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
        this.windowScrolled = false;
    }
}

  scrollToTop() {
    (function smoothscroll() {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - (currentScroll / 8));
        }
    })();
}

  getCountryList() {
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.country_list = data.countryMasterList;
            this.shippingcountry_list = data.countryMasterList;
            // console.log(this.country_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            //this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  getCustomerGroupList() {
    this.common.showSpinner();
    this.api.getAPI("customergrouplookup")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.customerGroup_List = data.customerGroupMasterList;
            // .log(this.customerGroup_List);
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
    debugger;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.customer_List = null;
    this.common.showSpinner();
    this.api.getAPI("customer?id=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.iso2feild=data.customerMasterData[0].isoCode;
            this.AddressIsoCode=data.customerMasterData[0].addressIsoCode;
            this.ShippingIsoCode=data.customerMasterData[0].shippingIsoCode ;
            if(this.iso2feild !='')
            {
              this.myForm.controls['phoneNumber'].setValue( "+" +this.iso2feild);
              this.phoneInput.nativeElement.dispatchEvent(
                new KeyboardEvent('keyup', { bubbles: true })
              );
            }
            if(this.AddressIsoCode!='')
            {
              this.myForm.controls['phone1'].setValue("+" +this.AddressIsoCode);
              this.phoneInput1.nativeElement.dispatchEvent(
                new KeyboardEvent('keyup', { bubbles: true })
              );
            }
            if(this.ShippingIsoCode!='')
            {
              this.myForm.controls['shippingPhoneNumber'].setValue( "+" +this.ShippingIsoCode);
              this.phoneInput2.nativeElement.dispatchEvent(
                new KeyboardEvent('keyup', { bubbles: true })
              );
            }
            this.myForm.controls['customerCode'].setValue(data.customerMasterData[0].customerCode);
            this.documentNo = data.customerMasterData[0].customerCode;
            this.myForm.controls['customerName'].setValue(data.customerMasterData[0].customerName);
            this.myForm.controls['phoneNumber'].setValue(data.customerMasterData[0].phoneNumber);
            this.myForm.controls['phone1'].setValue(data.customerMasterData[0].billingPhoneNumber);
            //this.myForm.controls['alterPhoneNumber'].setValue(data.customerMasterData[0].alterPhoneNumber);
            this.myForm.controls['customerGroupID'].setValue(data.customerMasterData[0].customerGroupID);
            //this.myForm.controls['buildingAndBlockNo'].setValue(data.customerMasterData[0].buildingAndBlockNo);
            //this.myForm.controls['streetName'].setValue(data.customerMasterData[0].streetName);
            this.myForm.controls['areaName1'].setValue(data.customerMasterData[0].areaName1);
            this.myForm.controls['areaName2'].setValue(data.customerMasterData[0].areaName2);

            this.myForm.controls['city'].setValue(data.customerMasterData[0].city);
            this.myForm.controls['countryID'].setValue(data.customerMasterData[0].countryID);
            this.countryCode = data.customerMasterData[0].countryCode;
            this.getStateList();
            this.myForm.controls['stateID'].setValue(data.customerMasterData[0].stateID);

            this.myForm.controls['email'].setValue(data.customerMasterData[0].email);
            //this.myForm.controls['dob'].setValue(data.customerMasterData[0].dob);
            //this.myForm.controls['gender'].setValue(data.customerMasterData[0].gender);
            this.myForm.controls['onAccountApplicable'].setValue(data.customerMasterData[0].onAccountApplicable);
            this.myForm.controls['remarks'].setValue(data.customerMasterData[0].remarks);
            this.myForm.controls['active'].setValue(data.customerMasterData[0].active);
            //this.myForm.controls['creditAmount'].setValue(data.customerMasterData[0].creditAmount);
            //this.companyName=data.companySettings.companyName;
            this.countryCode = data.customerMasterData[0].countryCode;
            this.state_Code = data.customerMasterData[0].stateCode;
            this.customerGroupCodeFetch = data.customerMasterData[0].customerGroupCode;
            let date = data.customerMasterData[0].dob;
          
            this.getdob = date == "0001-01-01T00:00:00+05:30" ? '' :  date;
            this.myForm.controls['pincode'].setValue(data.customerMasterData[0].pincode);
            this.myForm.controls['shippingAddress1'].setValue(data.customerMasterData[0].shippingAddress1);
            this.myForm.controls['shippingAddress2'].setValue(data.customerMasterData[0].shippingAddress2);
            this.myForm.controls['shippingcountryID'].setValue(data.customerMasterData[0].shippingCountryID);
            this.shippingCountryCode = data.customerMasterData[0].shippingCountryCode;
            this.getShippingStateList();
            this.myForm.controls['shippingStateID'].setValue(data.customerMasterData[0].shippingStateID);
            this.myForm.controls['shippingCity'].setValue(data.customerMasterData[0].shippingCity);
            this.myForm.controls['shippingPincode'].setValue(data.customerMasterData[0].shippingPincode);
            this.myForm.controls['shippingPhoneNumber'].setValue(data.customerMasterData[0].shippingPhoneNumber);

            this.myForm.controls['lastName'].setValue(data.customerMasterData[0].lastName);
            this.myForm.controls['subGroupID'].setValue(data.customerMasterData[0].subGroupID);
            this.myForm.controls['subGroupCode'].setValue(data.customerMasterData[0].subGroupCode);
            this.myForm.controls['paymentTermsDays'].setValue(data.customerMasterData[0].paymentTermsDays);
            this.myForm.controls['creditDays'].setValue(data.customerMasterData[0].creditDays);
            this.myForm.controls['isLoyalty'].setValue(data.customerMasterData[0].isLoyalty);
            this.myForm.controls['isTaxExempt'].setValue(data.customerMasterData[0].isTaxExempt);
            this.myForm.controls['loyaltyID'].setValue(data.customerMasterData[0].loyaltyID);
            this.myForm.controls['loyaltyPlan'].setValue(data.customerMasterData[0].loyaltyPlan);
           
            // console.log("DOB" + this.getdob);
            this.state_name = data.customerMasterData[0].stateName;
            this.shipping_state_Code = data.customerMasterData[0].shippingStateCode;
            this.shipping_state_name = data.customerMasterData[0].shippingStateName;
            this.customer_image = data.customerMasterData[0].customerImage;
            this.current_image = data.customerMasterData[0].customerImage == null || data.customerMasterData[0].customerImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.customerMasterData[0].customerImage;
           
            //this.current_image = data.customerMasterData[0].customerImage;
            // .log(data.customerMasterData);
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
  
  onCountryChange(event)
  {   
    this.iso2feild=event.dialCode;   
    this.myForm.controls['phoneNumber'].setValue("+" + event.dialCode);
    this.Phonenolenght = event.dialCode.length;
  }
  
  onCountryChange1(event)
  {   
    
    this.AddressIsoCode=event.dialCode;   
    this.myForm.controls['phone1'].setValue("+" + event.dialCode);
    
  }
  onCountryChange2(event)
  {   
    
    this.ShippingIsoCode=event.dialCode;   
    this.myForm.controls['shippingPhoneNumber'].setValue( "+" + event.dialCode);
   
  }
  countrycode() {
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if(shippingcheck ==true){
      this.myForm.controls['shippingcountryID'].setValue(this.myForm.get('countryID').value);
      this.shippingCountryCode = this.countryCode;
      this.getShippingStateList();
    }
    this.getStateList();
  }

  shippingcountrycode() {
    if (this.shippingcountry_list != null && this.shippingcountry_list.length > 0) {
      for (let country of this.shippingcountry_list) {
        if (country.id == this.myForm.get('shippingcountryID').value) {
          this.shippingCountryCode = country.countryCode;
          break;
        }
      }
    }
    this.getShippingStateList();
  }
  onCheckboxChange(e) {
    if (e.target.checked) {
      this.isReadonly = !this.isReadonly;
      this.myForm.get('shippingcountryID').disable();
      this.myForm.get('shippingStateID').disable();
      this.myForm.controls['shippingAddress1'].setValue(this.myForm.get('areaName1').value);
      this.myForm.controls['shippingAddress2'].setValue(this.myForm.get('areaName2').value);
      this.myForm.controls['shippingcountryID'].setValue(this.myForm.get('countryID').value);
      this.shippingCountryCode = this.countryCode;

      this.getShippingStateList();
      this.myForm.controls['shippingStateID'].setValue(this.myForm.get('stateID').value);
      this.shipping_state_Code = this.state_Code;
      this.shipping_state_name = this.state_name;
      this.myForm.controls['shippingCity'].setValue(this.myForm.get('city').value);
      this.myForm.controls['shippingPincode'].setValue(this.myForm.get('pincode').value);
      this.myForm.controls['shippingPhoneNumber'].setValue("+" + this.AddressIsoCode);
      this.phoneInput2.nativeElement.dispatchEvent(
        new KeyboardEvent('keyup', { bubbles: true })
      );
      this.myForm.controls['shippingPhoneNumber'].setValue(this.myForm.get('phone1').value);
      // console.log(this.customer);
    } else {
      this.myForm.controls['shippingAddress1'].setValue('');
      this.myForm.controls['shippingAddress2'].setValue('');
      this.myForm.controls['shippingcountryID'].setValue('');
      this.shippingCountryCode = null;
      this.myForm.controls['shippingStateID'].setValue('');
      this.myForm.controls['shippingCity'].setValue('');
      this.myForm.controls['shippingPincode'].setValue('');
      this.myForm.controls['shippingPhoneNumber'].setValue('');
      this.isReadonly = false;
      this.myForm.get('shippingcountryID').enable();
      this.myForm.get('shippingStateID').enable();
    }
  }


  statecode() {
    if (this.state_List != null && this.state_List.length > 0) {
      for (let state of this.state_List) {
        if (state.id == this.myForm.get('stateID').value) {
          this.state_Code = state.stateCode;
          this.state_name = state.stateName;
          break;
        }
      }
    }
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if(shippingcheck ==true){
      this.myForm.controls['shippingStateID'].setValue(this.myForm.get('stateID').value);
      this.shipping_state_Code = this.state_Code;
      this.shipping_state_name = this.state_name;
    }
  }

  shippingstatecode() {
    if (this.shippingstate_list != null && this.shippingstate_list.length > 0) {
      for (let state of this.shippingstate_list) {
        if (state.id == this.myForm.get('shippingStateID').value) {
          this.shipping_state_Code = state.stateCode;
          this.shipping_state_name = state.stateName;
          break;
        }
      }
    }
  }

  customerGroupcode() {
    if (this.customerGroup_List != null && this.customerGroup_List.length > 0) {
      for (let customergroup of this.customerGroup_List) {
        if (customergroup.id == this.myForm.get('customerGroupID').value) {
          this.customerGroupCodeFetch = customergroup.groupCode;
          break;
        }
      }
    }
  }

  getStateList() {
    this.common.showSpinner();
    this.state_List = null;
    // console.log(this.myForm.get('countryID').value);
    this.api.getAPI("StateMasterLookUp?countryID=" + this.myForm.get('countryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.state_List = data.stateMasterList;
            // .log(this.state_List);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            //this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getShippingStateList() {
    this.common.showSpinner();
    this.shippingstate_list = null;
    this.api.getAPI("StateMasterLookUp?countryid=" + this.myForm.get('shippingcountryID').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.country_list = new Array<any> ();
            //this.country_list = data.countryMasterList;
            this.shippingstate_list = data.stateMasterList;
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            //this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }



  update_customer() {
    if (this.customer == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    } else {
      this.customer.id = this.id;
      this.customer.customerCode = this.documentNo;
      this.customer.customerName = this.myForm.get('customerName').value;
      this.customer.countryID = this.myForm.get('countryID').value;
      this.customer.areaName1 = this.myForm.get('areaName1').value;
      this.customer.areaName2 = this.myForm.get('areaName2').value;
      this.customer.stateID = this.myForm.get('stateID').value;
      this.customer.phoneNumber = this.myForm.get('phoneNumber').value;
      this.customer.billingPhoneNumber=this.myForm.get('phone1').value;
      this.customer.alterPhoneNumber = "";//this.myForm.get('alterPhoneNumber').value;
      this.customer.email = this.myForm.get('email').value;
      this.customer.customerGroupID = this.myForm.get('customerGroupID').value;
      this.customer.dob = this.myForm.get('dob').value;
      this.customer.gender = "";//this.myForm.get('gender').value;
      this.customer.buildingAndBlockNo = "";//this.myForm.get('buildingAndBlockNo').value;
      this.customer.city = this.myForm.get('city').value;
      this.customer.creditAmount = 0;//this.myForm.get('creditAmount').value;
      this.customer.onAccountApplicable = false;//this.myForm.get('onAccountApplicable').value;
      this.customer.streetName = "";// this.myForm.get('streetName').value;
      //let text = event.target.options[event.target.options.selectedIndex].text;
      //this.company.countrySettingID=this.myForm.get('countryName').
      this.customer.active = this.myForm.get('active').value;
      this.customer.remarks = this.myForm.get('remarks').value;
      this.customer.countryCode = this.countryCode;
      this.customer.stateCode = this.state_Code;
      this.customer.customerGroupCode = this.customerGroupCodeFetch;
      this.customer.customerImage = this.customer_image;
      this.customer.stateName = this.state_name;
      this.customer.pincode = this.myForm.get('pincode').value;

      this.customer.shippingAddress1 = this.myForm.get('shippingAddress1').value;
      this.customer.shippingAddress2 = this.myForm.get('shippingAddress2').value;
      this.customer.shippingPhoneNumber = this.myForm.get('shippingPhoneNumber').value;
      this.customer.shippingCity = this.myForm.get('shippingCity').value;
      this.customer.shippingStateID = this.myForm.get('shippingStateID').value;
      this.customer.shippingStateCode = this.shipping_state_Code;
      this.customer.shippingStateName = this.shipping_state_name;
      this.customer.shippingPincode = this.myForm.get('shippingPincode').value;
      this.customer.shippingCountryID = this.myForm.get('shippingcountryID').value;
      this.customer.shippingCountryCode = this.shippingCountryCode;
      this.customer.isoCode=this.iso2feild;
      this.customer.shippingIsoCode=this.ShippingIsoCode;
      this.customer.addressIsoCode=this.AddressIsoCode;

      this.customer.lastName = this.myForm.get('lastName').value;
      this.customer.subGroupID = this.myForm.get('subGroupID').value;
      this.customer.subGroupCode = this.myForm.get('subGroupCode').value;
      this.customer.paymentTermsDays = this.myForm.get('paymentTermsDays').value;
      this.customer.creditDays = this.myForm.get('creditDays').value;
      this.customer.isLoyalty = this.myForm.get('isLoyalty').value;
      this.customer.isTaxExempt = this.myForm.get('isTaxExempt').value;
      this.customer.loyaltyID = this.myForm.get('loyaltyID').value;
      let loyaltyPlan = this.myForm.get('loyaltyPlan').value;
      this.customer.loyaltyPlan = loyaltyPlan == null || loyaltyPlan == "" ? 0 : loyaltyPlan; 

      // console.log(this.customer);
      this.common.showSpinner();
      this.api.putAPI("customer", this.customer).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', 'Customer Updated successfully.');
          //this.clear_controls();
          //this.router.navigate(['Customer']);
          let str: string = localStorage.getItem('from_pos');
          if (str != null && str.toLowerCase() != "null" && str.toLowerCase() == "true") {
            localStorage.setItem("New_customer_details",null);
            let defaultCustomer = {
              "defaultCustomerID":this.customer.id,
              "defaultCustomerCode":this.customer.customerCode,
              "defaultCustomerGroupCode":this.customer.customerGroupCode,
              "defaultCustomerGroupID":this.customer.customerGroupID,
              "defaultCustomerName":this.customer.customerName,
              "defaultPhoneNumber":this.customer.phoneNumber
           };
            localStorage.setItem("New_customer_details",JSON.stringify(defaultCustomer));
            localStorage.setItem('pos_mode', 'true');
            localStorage.setItem('from_pos', 'false');
            this.router.navigate(['pos']);
          } else {
            this.router.navigate(['Customer']);
          }
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Update.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
  public picked(event, field) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.customer_image = file;
      this.handleInputChange(file); //turn into base64

    }
    else {
      alert("No file selected");
    }
  }
  handleInputChange(files) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    //this.imageSrc = base64result;
    this.customer_image = base64result;
    this.current_image ="data:image/png;base64"+","+base64result;
    this.log();
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  addkeyPress(){
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if(shippingcheck ==true){
      this.myForm.controls['shippingAddress1'].setValue(this.myForm.get('areaName1').value);
     
    }

  }
  add2keyPress(){
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if(shippingcheck ==true){
    
      this.myForm.controls['shippingAddress2'].setValue(this.myForm.get('areaName2').value);
   
    }

  }
  addcitykeyPress(){
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if(shippingcheck ==true){
    
     this.myForm.controls['shippingCity'].setValue(this.myForm.get('city').value);
      
    }

  }
  addpincodekeyPress(){
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if(shippingcheck ==true){
    
       this.myForm.controls['shippingPincode'].setValue(this.myForm.get('pincode').value);
      
    }

  }
  addphonekeyPress(){
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if(shippingcheck ==true){
    
       this.myForm.controls['shippingPhoneNumber'].setValue(this.myForm.get('phone1').value);
    }

  }
  log() {
    // for debug
    // .log('Customer image', this.customer_image);
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
  clearimg()
  {
      this.myFileInput1.nativeElement.value = '';
      this.current_image =null;    
      this.current_image ="assets/img/preview-image.png";
      this.customer_image=null;
  }
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        let str: string = localStorage.getItem('from_pos');
        if (str != null && str.toLowerCase() != "null" && str.toLowerCase() == "true") {
          localStorage.setItem('pos_mode', 'true');
          localStorage.setItem('from_pos', 'false');
          this.router.navigate(['pos']);
        } else {
          this.router.navigate(['Customer']);
        }
      }
    }
    else {
      let str: string = localStorage.getItem('from_pos');
      if (str != null && str.toLowerCase() != "null" && str.toLowerCase() == "true") {
        localStorage.setItem('pos_mode', 'true');
        localStorage.setItem('from_pos', 'false');
        this.router.navigate(['pos']);
      } else {
        this.router.navigate(['Customer']);
      }
    }

  }

  keyPressupper(event) {

    var k;
    k = event.target.value;
    var newstr = k.toLowerCase(); 
    //alert(k.toLowerCase());
   // return k.toLowerCase();
    this.myForm.controls['email'].setValue(newstr);

    return newstr;
  }
}
