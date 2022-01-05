import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MCustomer } from 'src/app/models/m-customer';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import{MCustomerSalesTransaction } from  'src/app/models/customer-sales-transaction';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  view: any[] = [700, 300];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Items';
  yAxisLabel: string = 'Count';
  timeline: boolean = true;
  salestransactionlist:Array<MCustomerSalesTransaction>;
  returntransactionlist:Array<MCustomerSalesTransaction>;
  cutomerViewReturnTransaction :Array <MCustomerSalesTransaction>;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  saleData = [
    {
      "name": "ItemOne",
      "series": [
        {
          "name": "Aug",
          "value": 14
        },
        {
          "name": "Sep",
          "value": 35
        },
        {
          "name": "Oct",
          "value": 4
        },
        {
          "name": "Nov",
          "value": 17
        },
        {
          "name": "Dec",
          "value": 14
        },
        {
          "name": "Jan",
          "value": 35
        }
      ]
    },
  
    {
      "name": "ItemTwo",
      "series": [
        {
          "name": "Aug",
          "value": 564
        },
        {
          "name": "Sep",
          "value": 412
        },
        {
          "name": "Oct",
          "value": 437
        },
        {
          "name": "Nov",
          "value": 437
        },
        {
          "name": "Dec",
          "value": 364
        },
        {
          "name": "Jan",
          "value": 412
        }
      ]
    },
    {
      "name": "ItemThree",
      "series": [
        {
          "name": "Aug",
          "value": 168
        },
        {
          "name": "Sep",
          "value": 343
        },
        {
          "name": "Oct",
          "value": 512
        },
        {
          "name": "Nov",
          "value": 591
        },
        {
          "name": "Dec",
          "value": 168
        },
        {
          "name": "Jan",
          "value": 343
        },
      ]
    }
  ];

  myForm: FormGroup;
  getdob: Date;
  createdOn: Date;
  countryCode: string;
  state_Code: string;
  customerGroupCodeFetch: string;
  businessdate: Date;
  customer_image: any;
  documentNo: any;
  customer: MCustomer;
  customer_List: Array<MCustomer>;
  current_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";
  id: any;
  customerName: string;
  phoneNumber: any;
  address1: string;
  address2: string;
  city: string;
  email: string;
  dob: string;
  remarks: string;
  active: boolean;
  windowScrolled: boolean;
  pincode:string;


  loyalityGroup: string;
  loyalityPoint: string;
  loyalityValue: string;
  loyaltyPlan: string;
  paymentTermsDays: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingCountryCode: string;
  shippingCountryID: string;
  shippingIsoCode: string;
  shippingPhoneNumber: string;
  shippingPincode: string;
  shippingStateCode: string;
  shippingStateID: string;
  shippingStateName: string;
  totalspent:number = 0;
  avgpurchase:any;
  creatonSales:string;
  creatonReturn:string;
  lastTried :string;
  countDays:string;
  //saleData:Array<any>;

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
      //customerCode: ['',Validators.required],      
      //phoneNumber:['',Validators.required],      
    });
    this.clear_controls();
    this.salestransactionlist=new Array<MCustomerSalesTransaction>();
    this.returntransactionlist=new Array<MCustomerSalesTransaction>();
    this.getsalestransaction();
    this.getreturntransaction();
    this.getreturnExchange();

   

  }
  clear_controls() {
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



  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.customer_List = null;
    this.common.showSpinner();
    this.api.getAPI("customer?id=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {

           // console.log(data);
            //this.myForm.controls['customerCode'].setValue(data.customerMasterData[0].customerCode);
            this.documentNo = data.customerMasterData[0].customerCode;
            this.customerName = data.customerMasterData[0].customerName;
            this.phoneNumber = data.customerMasterData[0].phoneNumber;
            //this.myForm.controls['alterPhoneNumber'].setValue(data.customerMasterData[0].alterPhoneNumber);
            //this.myForm.controls['customerGroupID'].setValue(data.customerMasterData[0].customerGroupID);
            //this.myForm.controls['buildingAndBlockNo'].setValue(data.customerMasterData[0].buildingAndBlockNo);
            //this.myForm.controls['streetName'].setValue(data.customerMasterData[0].streetName);
            this.address1 = data.customerMasterData[0].areaName1;
            this.address2 = (data.customerMasterData[0].areaName2);
            this.city = (data.customerMasterData[0].city);
            //this.myForm.controls['stateID'].setValue(data.customerMasterData[0].stateID);
            //this.myForm.controls['countryID'].setValue(data.customerMasterData[0].countryID);
            this.email = (data.customerMasterData[0].email);
            this.dob = ((data.customerMasterData[0].dob));
            //this.myForm.controls['gender'].setValue(data.customerMasterData[0].gender);
            //this.myForm.controls['onAccountApplicable'].setValue(data.customerMasterData[0].onAccountApplicable);
            this.remarks = (data.customerMasterData[0].remarks);
            this.active = (data.customerMasterData[0].active);
            //this.myForm.controls['creditAmount'].setValue(data.customerMasterData[0].creditAmount);
            //this.companyName=data.companySettings.companyName;
            this.countryCode = data.customerMasterData[0].countryCode;
            this.state_Code = data.customerMasterData[0].stateCode;
            this.customerGroupCodeFetch = data.customerMasterData[0].customerGroupCode;
            this.getdob = new Date(data.customerMasterData[0].dob);
            this.createdOn = data.customerMasterData[0].createOn;
            this.pincode = data.customerMasterData[0].pincode;
           // .log("DOB" + this.getdob);
            this.customer_image = data.customerMasterData[0].customerImage;
            this.current_image = data.customerMasterData[0].customerImage == null || data.customerMasterData[0].customerImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.customerMasterData[0].customerImage;
            //this.current_image = data.customerMasterData[0].customerImage;
           // .log(data.customerMasterData);
           this.shippingAddress1 = data.customerMasterData[0].shippingAddress1;
           this.shippingAddress2 = data.customerMasterData[0].shippingAddress2;
           this.shippingCity = data.customerMasterData[0].shippingCity;
           this.shippingCountryCode = data.customerMasterData[0].shippingCountryCode;
           this.shippingCountryID = data.customerMasterData[0].shippingCountryID;
           this.shippingPhoneNumber = data.customerMasterData[0].shippingPhoneNumber;
           this.shippingStateCode = data.customerMasterData[0].shippingStateCode;
           this.shippingStateID = data.customerMasterData[0].shippingStateID;
           this.shippingStateName = data.customerMasterData[0].shippingStateName;
           this.shippingPincode = data.customerMasterData[0].shippingPincode;

           this.loyalityGroup = data.customerMasterData[0].loyalityGroup;
           this.loyalityPoint = data.customerMasterData[0].loyalityPoint;
           this.loyalityValue = data.customerMasterData[0].loyalityValue;
           this.loyaltyPlan = data.customerMasterData[0].loyaltyPlan;

           
          } else {
            let msg: string = data != null
              && data.displayMessage != null
              && data.displayMessage != "" ? data.displayMessage : "Failed to retrieve Data.";
            this.common.showMessage('warn', msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
      //this.getsalestransaction();
  }
  getsalestransaction(){
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    let sum: number = 0;
    let sumavg: number = 0;
    this.api.getAPI("customerView?ID=" + this.id)
   
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
         
          this.salestransactionlist=data.customerViewTransactionList;
         //console.log(data.customerViewTransactionList);
          this.salestransactionlist.forEach(a => sum += a.receivedAmount);
          //console.log(sum);
          this.totalspent = sum;
          sumavg = sum / this.salestransactionlist.length;
          this.avgpurchase = (sumavg).toFixed(3);


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
  getreturntransaction()
  {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getAPI("customerView?CustomerID=" + this.id)
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.returntransactionlist=data.customerViewTransactionList;

          this.creatonSales = this.returntransactionlist[0].createOn;
          //console.log(data);
          this.getlasttriedDate();
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

  getreturnExchange()
  {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getAPI("customerView?CustomerID=" + this.id + "&type=sales")
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.cutomerViewReturnTransaction =data.cutomerViewReturnTransaction;
        // console.log(data);
        this.creatonReturn = this.cutomerViewReturnTransaction[0].createOn;
        this.getlasttriedDate();
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
  getlasttriedDate(){
    if(this.creatonSales != null && this.creatonReturn != null){

      if(this.creatonSales >= this.creatonReturn){
        this.lastTried = this.creatonSales
      }
      if(this.creatonReturn >= this.creatonSales){
        this.lastTried = this.creatonReturn
      }

    }else{
      if(this.creatonSales == null ){
        this.lastTried = this.creatonReturn;
      }
      if(this.creatonReturn == null ){
        this.lastTried = this.creatonSales;
      }
    }

    var date1 = new Date(this.lastTried); 
    var date2 = new Date(); 
    
    //  var Time = date2.getTime() - date1.getTime(); 
    //  var Days = Time / (1000 * 3600 * 24);
    //  console.log(Days);

      var diff = Math.abs(date1.getTime() - date2.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
     // console.log(diffDays);
     
    if(diffDays == 1)
    {
      this.countDays = diffDays + ' ' + 'day';
    }else{
      this.countDays = diffDays + ' ' + 'days';
    }

  }
}
