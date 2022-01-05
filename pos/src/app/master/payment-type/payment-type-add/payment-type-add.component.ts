import { Component,OnInit,ViewChild,ElementRef } from '@angular/core'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MPaymentType } from 'src/app/models/m-payment-type';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-payment-type-add',
  templateUrl: './payment-type-add.component.html',
  styleUrls: ['./payment-type-add.component.css']
})
export class PaymentTypeAddComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>;
  country_list: Array<any>;
  countryCode: string;
  paymenttype: MPaymentType;
  payment_image: any;
  payment_image_temp: any;
  user_details: MUserDetails = null;
  userid:number;
  IsCountryNeed:boolean=false;
  current_store_image: string = "assets/img/preview-image.png";
  @ViewChild('fileInput')
  myFileInput: ElementRef;
  paymentModeList:Array<any>;

  paymentModeID:number;
  paymentModeCode:string;

  // @ViewChild('takeInput', {static: false}) InputVar: ElementRef; 
  // reset()  
  // { 
  //   this.InputVar.nativeElement.value = ""; 
  // } 

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
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
    this.getStaticValues();
    this.getCountryList();
    this.paymenttype = new MPaymentType();
    this.clear_controls();
    this.paymentModeList=new Array<any>();
    this.getPaymentModeList();
  }
  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;      
    }
  }
  clear_controls() {    
    this.paymentModeID = 0;
    this.paymentModeCode = "";
    this.myForm.controls['paymentTypeCode'].setValue('');
    this.myForm.controls['paymentTypeName'].setValue('');
    this.myForm.controls['paymentType'].setValue('');
    this.myForm.controls['countryID'].setValue(0);
    this.myForm.controls['countryID'].enable();
    this.myForm.controls['address'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['order'].setValue('');
    this.myForm.controls['TransactionType'].setValue('');
    this.myForm.controls['paymentReceivedType'].setValue('');
    this.myForm.controls['paymentProcessor'].setValue(false);
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['common'].setValue(false);
    //this.myForm.controls['imgup'].reset();
    
    if(this.payment_image!=null)
    {
      this.myFileInput.nativeElement.value = '';
      this.payment_image = null;
      this.payment_image_temp = null;
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
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
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
    this.json = null;
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.json = data.countryMasterList;
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
  }

  countrycode() {
    if (this.json != null && this.json.length > 0) {
      for (let country of this.json) {
        if (country.id == this.myForm.get('countryID').value) {
          this.countryCode = country.countryCode;
          break;
        }
      }
    }
  }

  quickadd_paymenttype() {
    if (this.paymenttype == null) {
      this.common.showMessage("warn", "Can not Save, paymenttype Data is invalid.");
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

      this.paymenttype.id = 0;
      this.paymenttype.paymentCode = this.myForm.get('paymentTypeCode').value;
      this.paymenttype.paymentName = this.myForm.get('paymentTypeName').value;
      this.paymenttype.countryID = this.myForm.get('countryID').value;
      this.paymenttype.countryCode = this.countryCode;
      this.paymenttype.paymentType = this.myForm.get('paymentType').value;
      this.paymenttype.common = this.myForm.get('common').value;
      this.paymenttype.remarks = this.myForm.get('remarks').value;
      this.paymenttype.sortOrder = this.myForm.get('order').value;
      this.paymenttype.paymentReceivedType = this.myForm.get('paymentReceivedType').value;
      this.paymenttype.active = this.myForm.get('active').value;
      this.paymenttype.isPaymentProcesser = this.myForm.get('paymentProcessor').value;
      this.paymenttype.paymentImage = this.payment_image;
      this.paymenttype.createBy=this.userid;
      this.paymenttype.isCountryNeed=this.IsCountryNeed;
      this.paymenttype.paymentModeID= this.paymentModeID;
      this.paymenttype.paymentModeCode = this.paymentModeCode;
      this.paymenttype.transactionType=this.myForm.get('TransactionType').value;
      debugger;
     // .log(this.paymenttype);
      this.common.showSpinner();
      this.api.postAPI("paymenttype", this.paymenttype).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
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
  close() {
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
    // this.payment_image ="data:image/png;base64"+","+ base64result;
    this.payment_image = base64result;
    this.payment_image_temp = "data:image/png;base64"+","+ base64result;
  }
  delImage()
  {
    if(this.payment_image!=null)
    {
      // this.myFileInput.nativeElement.value = '';
      try{
        this.myFileInput.nativeElement.value = '';
      }catch(ex){

      }
      this.payment_image=null;    
      this.payment_image="assets/img/preview-image.png";
      this.payment_image_temp="assets/img/preview-image.png";
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
