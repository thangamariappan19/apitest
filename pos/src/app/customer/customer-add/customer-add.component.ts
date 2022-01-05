import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MCustomer } from 'src/app/models/m-customer';
import { MDayClosing } from 'src/app/models/m-day-closing';
import { MUserDetails } from 'src/app/models/m-user-details';
import { Ng2TelInputModule } from 'ng2-tel-input';


declare var jQuery: any;
@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css']
})
export class CustomerAddComponent implements OnInit {

  //For commit
  myForm: FormGroup;
  country_list: Array<any>;
  customerGroup_List: Array<any>;
  shippingcountry_list: Array<any>;
  shippingstate_list: Array<any>;
  state_List: Array<any>;
  countryCode: string;
  state_Code: string;
  state_name: string;
  isReadonly: boolean;
  windowScrolled: boolean;
  customerGroupCodeFetch: string;
  businessdate: Date;
  documentTypeDetailId: number;
  customer: MCustomer;
  customer_image: any;
  documentNo: any;
  shipping_state_Code: string;
  shipping_state_name: string;
  shippingCountryCode: any;
  logedpos_details: MDayClosing = null;
  user_details: MUserDetails = null;
  current_store_image: string = "assets/img/preview-image.png";
  initialCountry = '';
  initialCountry1 = '';
  placeHolder = 'Default Value';
  Phonenolenght: any;
  SPhonenolenght: any;
  BPhonenolenght: any;
  Ng2TelInputModule;
  @ViewChild('fileInput1')
  myFileInput1: ElementRef;
  @ViewChild('phoneInput')
  phoneInput: ElementRef;
  iso2feild: string;
  ShippingIsoCode: string;
  AddressIsoCode: string;

  @ViewChild('intlInput4')
  myFileInput2: ElementRef;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router)
     { 
       this.createForm(); 
      }
  createForm() {

    this.myForm = this.fb.group({
      // sku_code: [''],
      // discount_value: [0],
      // current_discount_type: ['Percentage']
      //order_status: ['', Validators.required],
      customerCode: [''],
      customerName: ['', Validators.required],
      //phoneNumber:['',Validators.required],
      phoneNumber: ['', Validators.required],
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
      countryID: [''],
      remarks: [''],
      stateID: [''],
      active: [true],
      onAccount: [false],
      pincode: [''],
      shippingAddress1: [''],
      shippingAddress2: [''],
      shippingPhoneNumber: [''],
      shippingStateID: [''],
      shippingCity: [''],
      shippingPincode: [''],
      phone1: [''],
      shippingcountryID: [''],
      shippingcheck: [false],
      fileInput1: [''],

      lastName: [''],
      subGroupID: [''],
      subGroupCode: [''],
      paymentTermsDays: [''],
      creditDays: [''],
      isLoyalty: [true],
      isTaxExempt: [true],
      loyaltyID: [''],
      loyaltyPlan: ['']
    });
    this.isReadonly = false;
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);

    }
    let temp_pos: string = localStorage.getItem('pos_details');
    if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);
    }

    this.clear_controls();
    this.get_Customer_Code();
    this.getCountryList();
    this.getCustomerGroupList();
  }
  hasError(event: any): void {
    if (!event && this.myForm.value.phone !== '') {
      this.myForm.get('phone').setErrors(['invalid_cell_phone', true]);
    }
  }

  hasOutPut(event: any): void {
    this.myForm.patchValue({ phone: event });
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

  clear_controls() {


    this.myForm.controls['customerName'].setValue('');
    this.myForm.controls['dob'].setValue('');
    this.myForm.controls['alterPhoneNumber'].setValue('');
    this.myForm.controls['email'].setValue('');
    this.myForm.controls['gender'].setValue('');
    this.myForm.controls['buildingAndBlockNo'].setValue('');
    this.myForm.controls['streetName'].setValue('');
    this.myForm.controls['areaName1'].setValue('');
    this.myForm.controls['areaName2'].setValue('');
    this.myForm.controls['phoneNumber'].setValue('');
    this.myForm.controls['city'].setValue('');
    this.myForm.controls['customerGroupID'].setValue('');
    this.myForm.controls['creditAmount'].setValue('');
    this.myForm.controls['onAccountApplicable'].setValue(false);
    this.myForm.controls['countryID'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['stateID'].setValue('');
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['onAccount'].setValue(false);
    this.myForm.controls['pincode'].setValue('');
    this.myForm.controls['shippingAddress1'].setValue('');
    this.myForm.controls['shippingAddress2'].setValue('');
    this.myForm.controls['shippingPhoneNumber'].setValue('');
    this.myForm.controls['shippingStateID'].setValue('');
    this.myForm.controls['shippingCity'].setValue('');
    this.myForm.controls['shippingPincode'].setValue('');
    this.myForm.controls['phone1'].setValue('');
    this.myForm.controls['shippingcountryID'].setValue('');

    this.myForm.controls['lastName'].setValue('');
    this.myForm.controls['subGroupID'].setValue('');
    this.myForm.controls['subGroupCode'].setValue('');
    this.myForm.controls['paymentTermsDays'].setValue('');
    this.myForm.controls['creditDays'].setValue('');
    this.myForm.controls['isLoyalty'].setValue(true);
    this.myForm.controls['isTaxExempt'].setValue(true);
    this.myForm.controls['loyaltyID'].setValue('');
    this.myForm.controls['loyaltyPlan'].setValue('');

    //this.isReadOnly = true;
    this.customer = new MCustomer();

  }
  get_Customer_Code() {
    //this.businessdate = new Date('2020-05-14');
    let str: string = localStorage.getItem('from_pos');
    if (str != null && str.toLowerCase() != "null" && str.toLowerCase() == "true") {
      //localStorage.setItem('pos_mode', 'true');
      //localStorage.setItem('from_pos', 'false');
      this.businessdate = new Date(this.logedpos_details.businessDate);
    } else {
      this.businessdate = new Date();
    }

    // this.invoice.invoiceNo = '1234564';
    // Document Number Search
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.user_details.storeID + "&DocumentTypeID=15&business_date=" + this.common.toYMDFormat(this.businessdate))
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.myForm.controls['customerCode'].setValue(data.documentNo != null ? data.documentNo : "");
            this.documentNo = data.documentNo != null ? data.documentNo : "";
            this.myForm.controls['customerCode'].setValue(this.documentNo);
            this.documentTypeDetailId = data.documentNumberingBillNoDetailsRecord.detailID;
            //this.invoice.invoiceNo = data.documentNo != null ? data.documentNo : "";
          } else {
            this.common.showMessage('warn', data.displayMessage);
            this.myForm.controls['customerCode'].setValue('');
          }

          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();

    }
  }

  addkeyPress() {
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if (shippingcheck == true) {
      this.myForm.controls['shippingAddress1'].setValue(this.myForm.get('areaName1').value);

    }

  }
  add2keyPress() {
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if (shippingcheck == true) {

      this.myForm.controls['shippingAddress2'].setValue(this.myForm.get('areaName2').value);

    }

  }
  addcitykeyPress() {
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if (shippingcheck == true) {

      this.myForm.controls['shippingCity'].setValue(this.myForm.get('city').value);

    }

  }
  addpincodekeyPress() {
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if (shippingcheck == true) {

      this.myForm.controls['shippingPincode'].setValue(this.myForm.get('pincode').value);

    }

  }

  addphonekeyPress() {
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if (shippingcheck == true) {

      this.myForm.controls['shippingPhoneNumber'].setValue(this.myForm.get('phone1').value);
    }

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
            this.common.showMessage('warn', msg);
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

    // this.myForm.controls['phoneNumber'].setValue("+" + Ng2TelInputModule. event.dialCode);


  }
  telInputObject(obj) {
    let testStr = this.user_details.countryCode;
    testStr = testStr.toLowerCase();
    if (testStr == 'uae' || testStr == 'ksa') {

      obj.setCountry(testStr.substring(1, 3));

    }
    else if (testStr == 'bah') {
      obj.setCountry('bh');
    }
    else {

      obj.setCountry(testStr.substring(0, 2));

    }
  }
  onCountryChange(event) {

    this.myForm.controls['phoneNumber'].setValue("+" + event.dialCode);
    this.Phonenolenght = event.dialCode.length;
    this.iso2feild = event.dialCode;


  }

  onCountryChange1(event) {

    this.AddressIsoCode = event.dialCode;
    // this.myForm.controls['shippingPhoneNumber'].setValue( "+" + event.dialCode);
    this.myForm.controls['phone1'].setValue("+" + event.dialCode);

  }
  onCountryChange2(event) {

    this.ShippingIsoCode = event.dialCode;
    this.myForm.controls['shippingPhoneNumber'].setValue("+" + event.dialCode);

  }
  countrycode() {
    this.myForm.controls['stateID'].setValue('');
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
    let shippingcheck = this.myForm.get('shippingcheck').value;
    if (shippingcheck == true) {
      this.myForm.controls['shippingcountryID'].setValue(this.myForm.get('countryID').value);
      this.shippingCountryCode = this.countryCode;
      this.getShippingStateList();
    }
    this.getStateList();
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
      //this.myForm.controls['stateID'].setValue('');
      this.getShippingStateList();
      this.myForm.controls['shippingStateID'].setValue(this.myForm.get('stateID').value);
      this.shipping_state_Code = this.state_Code;
      this.shipping_state_name = this.state_name;
      this.myForm.controls['shippingCity'].setValue(this.myForm.get('city').value);
      this.myForm.controls['shippingPincode'].setValue(this.myForm.get('pincode').value);
      this.myForm.controls['shippingPhoneNumber'].setValue("+" + this.iso2feild);
      this.phoneInput.nativeElement.dispatchEvent(
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
    if (shippingcheck == true) {
      this.myForm.controls['shippingStateID'].setValue(this.myForm.get('stateID').value);
      this.shipping_state_Code = this.state_Code;
      this.shipping_state_name = this.state_name;
    }
  }

  shippingstatecode() {
    if (this.state_List != null && this.state_List.length > 0) {
      for (let state of this.state_List) {
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
    this.api.getAPI("StateMasterLookUp?countryid=" + this.myForm.get('countryID').value)
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
            this.common.showMessage('warn', msg);
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
            // console.log(this.state_List);
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

  add_customer() {
    if (this.customer == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    }
    else if (this.documentNo == null || this.documentNo == '') {
      this.common.showMessage("warn", "Customer Code Not Found.");
    }
    else if (this.Phonenolenght < 4) {
      this.common.showMessage("warn", "Customer phoneNumber Not Found.");
    }
    else {
      this.customer.id = 0;
      this.customer.storeId = 2;
      this.customer.customerCode = this.documentNo;
      this.customer.customerName = this.myForm.get('customerName').value;
      this.customer.countryID = this.myForm.get('countryID').value;
      this.customer.areaName1 = this.myForm.get('areaName1').value;
      this.customer.areaName2 = this.myForm.get('areaName2').value;
      this.customer.stateID = this.myForm.get('stateID').value;
      this.customer.phoneNumber = this.myForm.get('phoneNumber').value;
      this.customer.billingPhoneNumber = this.myForm.get('phone1').value;
      this.customer.alterPhoneNumber = null;
      this.customer.email = this.myForm.get('email').value;
      this.customer.customerGroupID = this.myForm.get('customerGroupID').value;
      this.customer.dob = this.myForm.get('dob').value;
      this.customer.gender = "";//this.myForm.get('gender').value;
      this.customer.buildingAndBlockNo = "";//this.myForm.get('buildingAndBlockNo').value;
      this.customer.city = this.myForm.get('city').value;
      this.customer.creditAmount = 0;//this.myForm.get('creditAmount').value;
      this.customer.onAccountApplicable = this.myForm.get('onAccountApplicable').value;
      this.customer.streetName = "";// this.myForm.get('streetName').value;
      //let text = event.target.options[event.target.options.selectedIndex].text;
      //this.company.countrySettingID=this.myForm.get('countryName').
      this.customer.active = this.myForm.get('active').value;
      this.customer.remarks = this.myForm.get('remarks').value;
      this.customer.countryCode = this.countryCode;
      this.customer.stateCode = this.state_Code;
      this.customer.customerGroupCode = this.customerGroupCodeFetch;
      this.customer.documentTypeID = 15;
      this.customer.documentNumberingID = this.documentTypeDetailId;
      this.customer.customerImage = this.customer_image;
      this.customer.stateName = this.state_name;
      this.customer.pincode = this.myForm.get('pincode').value;
      this.customer.storeID = this.user_details.storeID;
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
      this.customer.isoCode = this.iso2feild;
      this.customer.addressIsoCode = this.AddressIsoCode;
      this.customer.shippingIsoCode = this.ShippingIsoCode;

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

      // .log(this.customer);
      this.common.showSpinner();
      this.api.postAPI("customer", this.customer).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          let str: string = localStorage.getItem('from_pos');
          if (str != null && str.toLowerCase() != "null" && str.toLowerCase() == "true") {
            // this.NewCustomerPos();
            let defaultCustomer = {
              "defaultCustomerID": data.iDs,
              "defaultCustomerCode": this.customer.customerCode,
              "defaultCustomerGroupCode": this.customer.customerGroupCode,
              "defaultCustomerGroupID": this.customer.customerGroupID,
              "defaultCustomerName": this.customer.customerName,
              "defaultPhoneNumber": this.customer.phoneNumber
            };
           // console.log(defaultCustomer);
            localStorage.setItem("New_customer_details", JSON.stringify(defaultCustomer));
            localStorage.setItem('pos_mode', 'true');
            localStorage.setItem('from_pos', 'false');
            this.router.navigate(['pos']);

          } else {
            this.router.navigate(['Customer']);
          }
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', data.displayMessage);
          }, this.common.time_out_delay);
        }

      });
    }
  }
  NewCustomerPos() {
    this.api.getAPI("customer?CustomerSearchString=" + this.customer.customerCode + "&last=" + 'pos')
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // this.customerGroup_List = data.customerMasterData;

            let defaultCustomer = {
              "defaultCustomerID": data.customerMasterData[0].id,
              "defaultCustomerCode": this.customer.customerCode,
              "defaultCustomerGroupCode": this.customer.customerGroupCode,
              "defaultCustomerGroupID": this.customer.customerGroupID,
              "defaultCustomerName": this.customer.customerName,
              "defaultPhoneNumber": this.customer.phoneNumber
            };
            localStorage.setItem("New_customer_details", JSON.stringify(defaultCustomer));
            localStorage.setItem('pos_mode', 'true');
            localStorage.setItem('from_pos', 'false');
            this.router.navigate(['pos']);

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
  clearall() {
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
    this.current_store_image = "data:image/png;base64" + "," + base64result;
    this.log();
  }
  log() {
    // for debug
    // .log('Customer image', this.customer_image);
  }
  onKeyUp(e) {
    this.Phonenolenght = e.target.value.length;
    // console.log(this.Phonenolenght);

  }
  onKeyUp1(e) {
    this.SPhonenolenght = e.target.value.length;
    // console.log(this.Phonenolenght);

  }
  onKeyUp2(e) {
    this.BPhonenolenght = e.target.value.length;
    // console.log(this.Phonenolenght);

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
  clearimg() {
    if (this.current_store_image != null) {
      this.myFileInput1.nativeElement.value = '';
      this.current_store_image = null;
      this.current_store_image = "assets/img/preview-image.png";
      this.customer_image = null;
    }
  }
  onBackspaceKeydown($event) {
    if (this.Phonenolenght <= 4 || this.BPhonenolenght <= 4 || this.SPhonenolenght <= 4) {
      $event.cancelBubble = true;
      $event.returnValue = false;

    }
    else {
      $event.cancelBubble = false;
      $event.returnValue = true;
    }
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
  valuechange(newValue) {
   //alert(newValue);
   var str = newValue; 
  
   // use of String toUpperCase() Method
   var newstr = str.toLowerCase(); 
   console.log(newstr);
   this.myForm.controls['email'].setValue(newstr);
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
