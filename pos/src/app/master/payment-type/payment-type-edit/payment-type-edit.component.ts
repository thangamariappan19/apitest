import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MPaymentType } from 'src/app/models/m-payment-type';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-payment-type-edit',
  templateUrl: './payment-type-edit.component.html',
  styleUrls: ['./payment-type-edit.component.css']
})
export class PaymentTypeEditComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>;
  country_list: Array<any>;
  countryCode: string;
  paymenttype: MPaymentType;
  payment_list: Array<any>;
  id: any;
  user_details: MUserDetails = null;
  IsCountryNeed:boolean=false;
  userid:number;
  payment_image: any;
  myFileInput: ElementRef;
  @ViewChild('fileInput')
  current_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";
  paymentModeList:Array<any>;

  paymentModeID:number;
  paymentModeCode:string;
  
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
      paymentTypeCode: ['', Validators.required],
      paymentTypeName: ['', Validators.required],
      paymentType: ['', Validators.required],
      countryID: [0],
      address: [''],
      remarks: [''],
      order: [0,Validators.required],
      paymentReceivedType: ['', Validators.required],
      paymentProcessor: [false],
      common: [false],
      active: [true],
      fileInput:[''],
      TransactionType:['',Validators.required]
    });
    this.paymentModeList=new Array<any>();
    this.getStaticValues();
    this.getCountryList();
    this.clear_controls();
    this.getPaymentModeList();    
  }
  clear_controls() {
    //this.getCountryList();
    this.paymentModeID = 0;
    this.paymentModeCode = "";

    this.paymenttype = new MPaymentType();
    this.myForm.controls['paymentTypeCode'].setValue('');
    this.myForm.controls['paymentTypeName'].setValue('');
    this.myForm.controls['paymentType'].setValue('');
    this.myForm.controls['countryID'].setValue(0);
    this.myForm.controls['address'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['order'].setValue('');
    this.myForm.controls['paymentReceivedType'].setValue('');
    this.myForm.controls['paymentProcessor'].setValue(false);
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['common'].setValue(false);
    this.myForm.controls['TransactionType'].setValue('');
    
  


  }
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;      
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
  getCommon1()
  {
    if(this.myForm.controls['common'].value== true)
    {
      this.myForm.controls['countryID'].disable();
    }
    else{
      this.myForm.controls['countryID'].enable();
    }
  }
  getCommon()
  {
    if(this.myForm.controls['common'].value== true)
    {
      this.myForm.get('countryID').setValue(0);
      this.countryCode=null;
      this.myForm.controls['countryID'].disable();
      this.IsCountryNeed=true;
    }
    else{
      this.myForm.controls['countryID'].enable();
      this.IsCountryNeed=false;
    }
  }
  getPaymentProcessor()
  {
    if(this.myForm.controls['paymentProcessor'].value== true)
    {
      if (confirm("Once Activated, Not able to Deactivate Further")) {        
      }
      else {
      }
    }
  }
  getCountryList() {
    return new Promise((resolve, reject) => {
    this.country_list = null;
    //this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
       // setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.country_list = data.countryMasterList;
            resolve(data.countryMasterList);
           // .log(this.country_list);
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
              reject(msg);
            //this.common.showMessage('warn', msg);
          }
        //   this.common.hideSpinner();
        // }, this.common.time_out_delay);
      });
    });
  }
  getPaymentModeList() {
    this.json = null;
    this.common.showSpinner();
    this.api.getAPI("PaymentModeMaster")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.paymentModeList = data.paymentModeMasterDate;
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
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.payment_list = null;
    this.common.showSpinner();
    this.getCountryList()
    .then((Countrylst) => {
    }).catch((err) => {
      this.common.showMessage('warn', err);
      this.common.hideSpinner();
    });
    this.api.getAPI("paymenttype?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['paymentTypeCode'].setValue(data.paymentTypeMasterData.paymentCode);
            this.myForm.controls['paymentTypeName'].setValue(data.paymentTypeMasterData.paymentName);
            this.myForm.controls['countryID'].setValue(data.paymentTypeMasterData.countryID);
            this.countryCode = data.paymentTypeMasterData.countryCode;
            this.myForm.controls['paymentType'].setValue(data.paymentTypeMasterData.paymentType);
            this.myForm.controls['common'].setValue(data.paymentTypeMasterData.isCountryNeed);
            if(data.paymentTypeMasterData.isCountryNeed==true)
            {
              this.myForm.controls['countryID'].disable();
            }
            this.myForm.controls['remarks'].setValue(data.paymentTypeMasterData.remarks);
            this.myForm.controls['order'].setValue(data.paymentTypeMasterData.sortOrder);
            this.myForm.controls['TransactionType'].setValue(data.paymentTypeMasterData.transactionType);
            this.myForm.controls['paymentReceivedType'].setValue(data.paymentTypeMasterData.paymentReceivedType);
            this.myForm.controls['active'].setValue(data.paymentTypeMasterData.active);
            this.myForm.controls['paymentProcessor'].setValue(data.paymentTypeMasterData.isPaymentProcesser);
            this.payment_image=data.paymentTypeMasterData.paymentImage;
            this.current_image = data.paymentTypeMasterData.paymentImage == null || data.paymentTypeMasterData.paymentImage == '' ? this.temp_image : 'data:image/png;base64,' + data.paymentTypeMasterData.paymentImage;

           // .log(this.payment_list);
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


  countrycode_changed() {
    if (this.country_list != null && this.country_list.length > 0) {
      for (let country of this.country_list) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
  }


  update_paymenttype() {
    if (this.paymenttype == null) {
      this.common.showMessage("warn", "Can not Save, Payment-Type data is invalid.");
    } else {

      this.paymentModeID = 0;
      this.paymentModeCode = "";
      let ptype:string = this.myForm.get('paymentType').value;
      if(this.paymentModeList != null && this.paymentModeList.length > 0){
        for(let item of this.paymentModeList){
          if(item.paymentModeName == ptype){
            this.paymentModeID = item.id;
            this.paymentModeCode = item.paymentModeCode;
          }
        }
      }

      this.paymenttype.id = this.id;
      this.paymenttype.paymentCode = this.myForm.get('paymentTypeCode').value;
      this.paymenttype.paymentName = this.myForm.get('paymentTypeName').value;
      this.paymenttype.countryID = this.myForm.get('countryID').value;
      this.paymenttype.countryCode=this.countryCode;
      this.paymenttype.paymentType = this.myForm.get('paymentType').value;
      this.paymenttype.common = this.myForm.get('common').value;
      this.paymenttype.remarks = this.myForm.get('remarks').value;
      this.paymenttype.sortOrder = this.myForm.get('order').value;
      this.paymenttype.paymentReceivedType = this.myForm.get('paymentReceivedType').value;
      this.paymenttype.active = this.myForm.get('active').value;
      this.paymenttype.isPaymentProcesser = this.myForm.get('paymentProcessor').value;
      this.paymenttype.updateBy=this.userid;
      this.paymenttype.paymentImage=this.payment_image;
      this.paymenttype.isCountryNeed=this.IsCountryNeed;
      this.paymenttype.transactionType=this.myForm.get('TransactionType').value;

      this.paymenttype.paymentModeID= this.paymentModeID;
      this.paymenttype.paymentModeCode = this.paymentModeCode;
      
      // if(this.payment_image==null || this.payment_image=="undefined" || this.payment_image==false)
      // {
      // this.paymenttype.paymentImage=this.current_image;
      // }
      // else
      // {
      //   this.paymenttype.paymentImage=this.payment_image;
      // }
      //this.paymenttype.countryCode=this.countryCode;

      debugger;
     // .log(this.paymenttype);
      this.common.showSpinner();
      this.api.putAPI("paymenttype", this.paymenttype).subscribe((data) => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['payment-type']);
          //this.router.navigate(['payment-type']);
        }
        else if(data != null && data.statusCode != null && data.statusCode == 2){
          this.common.hideSpinner();
          this.common.showMessage('warn', data.displayMessage);
        } 
        else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Payment Type Exists');
          }, this.common.time_out_delay);
        }

      });
    }
  }



  Close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['payment-type']);
      }
    }
    else {
      this.router.navigate(['payment-type']);
    }   
  }

  public picked(event, field) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.payment_image = file;
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
    this.payment_image = base64result;
    this.current_image="data:image/png;base64"+","+base64result;
  }
  delImage()
  {
    if(this.payment_image!=null)
    {
      try{
        this.myFileInput.nativeElement.value = '';
      }catch(ex){

      }
      this.payment_image=null; 
      this.current_image=null; 
      this.current_image= "assets/img/preview-image.png";  
    }
  }

  log() {
    // for debug
   // .log('Payment image', this.payment_image);
  }

  restrictIntegers(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return (
      // (k > 64 && k < 91)
      // || (k > 96 && k < 123)
      // || 
      k == 8
      || k == 32
      // || k == 45 
      // || k == 47
      // || k == 95
      || (k >= 48 && k <= 57)
    );
  }
}