import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router,ActivatedRoute } from '@angular/router';
import { MOnAccountInvoiceWisePayment } from 'src/app/models/m-on-account-invoice-wise-payment';
import { MOnAccountPayment } from 'src/app/models/m-on-account-payment';
import { MOnAccountPaymentDetails } from 'src/app/models/m-on-account-payment-details';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MCurrencyMaster } from 'src/app/models/m-currency-master';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { CustomerlistPopupComponent } from '../customerlist-popup/customerlist-popup.component';
import { PageEvent } from '@angular/material/paginator';
// import { MOnaccountPayment } from 'src/app/models/m-onaccount-payment';

@Component({
  selector: 'app-onaccount-payment-view',
  templateUrl: './onaccount-payment-view.component.html',
  styleUrls: ['./onaccount-payment-view.component.css']
})
export class OnaccountPaymentViewComponent implements OnInit {
  myForm: FormGroup;
  Type:any;
  OnAccountpaymentpendingList:Array<MOnAccountInvoiceWisePayment>=null;
  value:Array<MOnAccountInvoiceWisePayment>=null;
  SearchString:any;
  UserInfo: MUserDetails = null;
  PayingAmount: number = 0;
  ReceivedAmount: any;
  BalanceToPay: number = 0;
  CurrencyList:Array<MCurrencyMaster>=null;
  PaymentCurrency:any;
  ChangeCurrency:any;
  CardPaymentCurrency:any;
  CardRecievedAmount:any;
  PaymentMode:any;
  objOnAccountPayment:MOnAccountPayment;
  decimal_places: number = 0;
  BalanceAmount:number;
  DiscountAmount:number;
  PaymentAmount:number;
  TotalPaid:number;
  IsSelect:boolean;
  PayAmount:number;
  Currencyid:number;
  balanceAmount:any;
  paymentAmountbillAmount:any;
  returnAmount:any;
  id:any;
  OnAccountPaymentDetailsList: Array<MOnAccountPaymentDetails>=null;
  public pagination = {
    limit: this.common.max_rows_per_page,
    offset: 0,
    count: -1,
  };
  pageEvent: PageEvent;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) 
  { 
    let temp_str: string = localStorage.getItem('user_details'); 
    if (temp_str != null) {
      this.UserInfo = JSON.parse(temp_str);
      
    }
    if (this.UserInfo == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
     this.decimal_places = this.UserInfo != null && this.UserInfo.decimalPlaces != null ? this.UserInfo.decimalPlaces : 0;
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      CustomerCode: ["", Validators.required],
      InvoiceNo: ["", Validators.required],
      BillAmount: ["", Validators.required],
      PaymentCurrency:["", Validators.required],
      ChangeCurrency:["", Validators.required],
      // ReturnAmount:[""],
      // BalencetoPay:[""],
      // PayingBillAmount:[""],
      CashReceivedAmount:["",Validators.required],
      CardType:["",Validators.required],
      CardPaymentCurrency:["",Validators.required],
      CardRecievedAmount:["",Validators.required],
      CardNumber:["",Validators.required],
      CardHolderName:["",Validators.required],
      ApprovalNo:["",Validators.required]

    });
  this.SelectCurrencyLookUp();
  this.OnAccountPaymentDetailsList=new Array<MOnAccountPaymentDetails>();
  this.PaymentMode ='Cash';
  }
  ngOnInit(): void {
    this.GetOnAccountPaymentRecord();
  }
  GetOnAccountPaymentRecord()
  {
    let objOnAccountPaymentDetailsList = new Array<MOnAccountPaymentDetails>();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.common.showSpinner();
    this.api.getAPI("OnAccountPayment?ID="+this.id).subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
         
          this.objOnAccountPayment=data.onAccountPaymentRecord;
          this.OnAccountpaymentpendingList=this.objOnAccountPayment.onAcInvoiceWisePaymentList;
          console.log("this.objOnAccountPayment");
          console.log(this.objOnAccountPayment);
          console.log("this.OnAccountpaymentpendingList");
          console.log(this.OnAccountpaymentpendingList);
          // this.Couponid=this.mCouponReceiptMaster.couponCode;
         
          this.myForm.controls['CustomerCode'].setValue(this.objOnAccountPayment.customerCode);
          this.myForm.controls['InvoiceNo'].setValue(this.OnAccountpaymentpendingList[0].invoiceNo);
          this.myForm.controls['BillAmount'].setValue(this.OnAccountpaymentpendingList.reduce((sum,x) => sum + x.pendingAmount,0).toFixed(3));
          this.OnAccountPaymentDetailsList=this.objOnAccountPayment.onAccountPaymentDetailsList;
           this.paymentAmountbillAmount=this.objOnAccountPayment.billingAmount;
           this.balanceAmount=0;
           this.returnAmount=this.objOnAccountPayment.returnAmount;
          // this.myForm.controls['BalencetoPay'].setValue('0');
          // this.myForm.controls['ReturnAmount'].setValue();

          // this.myForm.controls['ToSerialNum'].setValue(this.mCouponReceiptMaster.toSerialNum);
          // this.myForm.controls['active'].setValue(this.mCouponReceiptMaster.active);
          // this.tablelist = data.responseDynamicData.couponTranferDetailsList;
        
        } else {
          let msg: string =
            data != null &&
            data.displayMessage != null &&
            data.displayMessage != ""
              ? data.displayMessage
              : "Failed to retrieve Data.";
          this.common.showMessage("warn", msg);
        }
        this.common.hideSpinner();
      }, this.common.time_out_delay);
    });
  }
  SelectCurrencyLookUp()
  {

    this.common.showSpinner();
    this.api.getAPI("CurrencyLookUp")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1)
           {
            this.CurrencyList= data.currencyMasterList;
           } 
          else {
            let msg: string =
              data != null &&
              data.displayMessage != null &&
              data.displayMessage != ""
                ? data.displayMessage
                : "Failed to retrieve Data.";
            this.common.showMessage("warn", msg);
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  txtSrchInvoiceNo_KeyDown(event)
  {
    this.Type = "INVOICENO";
    this.SearchString = this.myForm.get('InvoiceNo').value;
    console.log(this.SearchString);
    if(this.SearchString)
    {
    if (event.key === "Enter" || event.key === "Tab") 
    {
     
      this.common.showSpinner();
      this.api.getAPI("OnAccountPayment?type=" +this.Type + "&SearchString=" + this.SearchString )
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1)
             {
              this.value = data.onAcInvoiceWisePaymentList;
              var StoreWiseList = new Array<MOnAccountInvoiceWisePayment>();
              if (this.UserInfo.storeCode != null && this.UserInfo.storeCode != "")
                {

                   StoreWiseList.push(this.value.find(x => x.purchaseStoreCode == this.UserInfo.storeCode));
                  if (StoreWiseList != null && StoreWiseList.length > 0)
                  {
                   
                    this.myForm.controls['BillAmount'].setValue(StoreWiseList.reduce((sum,x) => sum + x.pendingAmount,0).toFixed(3));
                  
                   
                  }
                  this.OnAccountpaymentpendingList=StoreWiseList;
               
                }
               else
               {
                this.OnAccountpaymentpendingList=null;
               }
             } 
            else {
              let msg: string =
                data != null &&
                data.displayMessage != null &&
                data.displayMessage != ""
                  ? data.displayMessage
                  : "Failed to retrieve Data.";
              this.common.showMessage("warn", msg);
            }
            this.common.hideSpinner();
          }, this.common.time_out_delay);
        });
    }
  }
  }
  txtSrchCustomer_KeyDown(event)
  {
    this.Type = "CUSTOMER";
    this.SearchString = this.myForm.get('CustomerCode').value;
    if(this.SearchString)
    {
    if (event.key === "Enter" || event.key === "Tab") 
    {
      
      this.common.showSpinner();
      this.api.getAPI("customer?limit=" + this.pagination.limit + "&offset=" + this.pagination.offset + "&isActive=" + '1' + "&searchString=" + this.SearchString)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1)
             {
               const dialogConfig=new MatDialogConfig();
              dialogConfig.disableClose=true;
              dialogConfig.autoFocus=true;
              dialogConfig.width="80%";
              dialogConfig.data=data.customerMasterData;
              this.dialog.open(CustomerlistPopupComponent,dialogConfig);
              //  this.OnAccountpaymentpendingList=
             } 
            else {
              let msg: string =
                data != null &&
                data.displayMessage != null &&
                data.displayMessage != ""
                  ? data.displayMessage
                  : "Failed to retrieve Data.";
              this.common.showMessage("warn", msg);
            }
            this.common.hideSpinner();
          }, this.common.time_out_delay);
        });
    }
  }
  }
 
addPayment()
{
  if(this.PaymentMode=='Cash')
  {
    this.AddCashPayment();
    this.CalculatePayments();
  }
  else if(this.PaymentMode=='Card')
  {
    this.AddCardPayment();
    this.CalculatePayments();
    
  }

}
CalculatePayments()
{
      
      if ((this.OnAccountPaymentDetailsList.length > 0)) {
          this.PayingAmount =this.myForm.get('PayingBillAmount').value;
          this.ReceivedAmount = this.OnAccountPaymentDetailsList.reduce((sum,x) => sum + x.receivedAmount,0);
          this.BalanceToPay = (this.PayingAmount - this.ReceivedAmount);
          let ReturnAmount: number = (this.ReceivedAmount - this.PayingAmount);
          if ((this.BalanceToPay > 0)) {
              this.myForm.controls['BalencetoPay'].setValue(this.BalanceToPay);
              this.myForm.controls['CashReceivedAmount'].setValue(this.BalanceToPay);
              this.myForm.controls['CardRecievedAmount'].setValue(this.BalanceToPay);
          }
          else {
            this.myForm.controls['BalencetoPay'].setValue('0');
            this.myForm.controls['CashReceivedAmount'].setValue('0');
            this.myForm.controls['CardRecievedAmount'].setValue('0');
          }
          
          if ((ReturnAmount > 0)) 
          {
            this.myForm.controls['ReturnAmount'].setValue(ReturnAmount);
             
          }
          else 
          {
            this.myForm.controls['ReturnAmount'].setValue('0');
          }
     }
}
AddCashPayment()
{
 
           if(this.myForm.get('PayingBillAmount').value == '')
            {
              this.common.showMessage('warn', 'Please Select the invoice to pay !.');
               
            }
            else if (this.PaymentCurrency == '')
            {
              this.common.showMessage('warn','Please Select the payment Currency !.');
         
            }
            else if (this.myForm.get('CashReceivedAmount').value == '')
            {
              this.common.showMessage('warn','Please enter the received cash amount !.');
             
               
            }
            else if (this.ChangeCurrency== '')
            {
              this.common.showMessage('warn','Please Select the Change Currency !.');
              
                
            }
            else{
    let objOnAccountPaymentDetailsList = new Array<MOnAccountPaymentDetails>();
    let objOnAccountPaymentDetails = new MOnAccountPaymentDetails();
    objOnAccountPaymentDetails.id = 0;
    objOnAccountPaymentDetails.storeID = this.UserInfo.storeID;
    objOnAccountPaymentDetails.storeCode = this.UserInfo.storeCode;
    objOnAccountPaymentDetails.paymentType = "Cash";
    objOnAccountPaymentDetails.paymentCurrency = this.PaymentCurrency;
    objOnAccountPaymentDetails.receivedAmount = this.myForm.get('CashReceivedAmount').value; 
    objOnAccountPaymentDetails.changeCurrency =this.ChangeCurrency;
    objOnAccountPaymentDetails.cardType = "";
    objOnAccountPaymentDetails.cardNumber = "";
    objOnAccountPaymentDetails.cardHolderName = "";
    objOnAccountPaymentDetails.approvalNumber = "";
    if ((objOnAccountPaymentDetailsList.length > 0)) {
      let PaymentData:any;
      PaymentData = objOnAccountPaymentDetailsList.filter(x=> (x.paymentCurrency == this.PaymentCurrency) && (x.changeCurrency == this.ChangeCurrency));
        if ((PaymentData != null)) {
            let TotalReceivedAmount = ((this.myForm.get('CashReceivedAmount').value) + PaymentData.receivedAmount);
            objOnAccountPaymentDetailsList.filter(x=> (x.paymentCurrency == this.PaymentCurrency) 
                            && (x.changeCurrency == this.ChangeCurrency)).some(x=> x.receivedAmount=TotalReceivedAmount);
        }
        else {
            objOnAccountPaymentDetailsList.push(objOnAccountPaymentDetails);
        }
        
    }
    else {
        objOnAccountPaymentDetailsList.push(objOnAccountPaymentDetails);
    }
    this.OnAccountPaymentDetailsList.push(objOnAccountPaymentDetails);

    this.ClearPaymentEntry();

  }


}
AddCardPayment()
{
  
    let objOnAccountPaymentDetailsList = new Array<MOnAccountPaymentDetails>();
    let objOnAccountPaymentDetails = new MOnAccountPaymentDetails();
    objOnAccountPaymentDetails.id = 0;
    objOnAccountPaymentDetails.storeID = this.UserInfo.storeID;
    objOnAccountPaymentDetails.storeCode = this.UserInfo.storeCode;
    objOnAccountPaymentDetails.paymentType = "Card";
    objOnAccountPaymentDetails.paymentCurrency =this.CardPaymentCurrency;
    objOnAccountPaymentDetails.receivedAmount =this.myForm.get('CardRecievedAmount').value ;
    objOnAccountPaymentDetails.changeCurrency = "";
    objOnAccountPaymentDetails.cardType =this.myForm.get('CardType').value;
    objOnAccountPaymentDetails.cardNumber =this.myForm.get('CardNumber').value; 
    objOnAccountPaymentDetails.cardHolderName =this.myForm.get('CardHolderName').value; 
    objOnAccountPaymentDetails.approvalNumber =this.myForm.get('ApprovalNo').value;
    let BalanceToPay: any = this.myForm.get('BalencetoPay').value;
    let NewReceivedAmount: any = this.myForm.get('CardRecievedAmount').value;
    if ((BalanceToPay >= NewReceivedAmount)) {
        if ((objOnAccountPaymentDetailsList.length > 0)) {
            let PaymentData:any = objOnAccountPaymentDetailsList.filter(x=>(x.paymentCurrency.trim() == this.CardPaymentCurrency) 
                            && ((x.cardType == this.myForm.get('CardType').value) 
                            && (x.cardNumber == this.myForm.get('CardNumber').value)));
            if ((PaymentData != null)) {
                let TotalReceivedAmount = (this.myForm.get('CardRecievedAmount').value + PaymentData.receivedAmount);
                objOnAccountPaymentDetailsList.filter(x=>(x.paymentCurrency.trim() ==this.CardPaymentCurrency) 
                                && ((x.cardType == this.myForm.get('CardType').value) 
                                && (x.cardNumber == this.myForm.get('CardNumber').value))).some(x=>x.receivedAmount=TotalReceivedAmount);
            }
            else {
                objOnAccountPaymentDetailsList.push(objOnAccountPaymentDetails);
            }
            
        }
        else {
            objOnAccountPaymentDetailsList.push(objOnAccountPaymentDetails);
        }
        this.OnAccountPaymentDetailsList.push(objOnAccountPaymentDetails);
        // OnAccountPaymentDetailsList = DeepCopyCreator.OnAccountPaymentDetailsListDeepCopy(objOnAccountPaymentDetailsList);
        this.ClearPaymentEntry();
    }
    // else {
    //     // Message = "Excess card payment not allowed !.";
    // }
    



}
 ClearPaymentEntry()
{
    this.myForm.controls['PaymentCurrency'].setValue('');
    this.myForm.controls['CashReceivedAmount'].setValue('');
    this.myForm.controls['CardRecievedAmount'].setValue('');
    this.myForm.controls['CardType'].setValue('');
    this.myForm.controls['CardNumber'].setValue('');
    this.myForm.controls['ApprovalNo'].setValue('');
    this.myForm.controls['CardNumber'].setValue('');
    this.ChangeCurrency='';
    this.PaymentCurrency='';
}
ResetAll()
 {
          this.myForm.controls['CustomerCode'].setValue('');
          this.myForm.controls['InvoiceNo'].setValue('');
          this.myForm.controls['BillAmount'].setValue('');
          this.myForm.controls['PayingBillAmount'].setValue('0');
          this.myForm.controls['BalencetoPay'].setValue('0');
          this.myForm.controls['ReturnAmount'].setValue('0');
          this.OnAccountpaymentpendingList = Array<MOnAccountInvoiceWisePayment>();
          this.OnAccountPaymentDetailsList = Array<MOnAccountInvoiceWisePayment>();
          
 }
onTabClick(event) {
 
  this.PaymentMode=event.tab.textLabel;
}
OnPaymentCurrency(event: Event)
{
  let selectElementText = event.target['options']
  [event.target['options'].selectedIndex].text;
  this.PaymentCurrency=selectElementText;

}
OnChangeCurrency(event: Event)
{
  let selectElementText = event.target['options']
  [event.target['options'].selectedIndex].text;
  this.ChangeCurrency=selectElementText;
}
openDialog() {
  const dialogRef = this.dialog.open(CustomerlistPopupComponent);

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}
SavePayment()
{
  let ReceivedAmount =this.OnAccountPaymentDetailsList.reduce((sum,x) => sum + x.receivedAmount,0);
  this.objOnAccountPayment = new MOnAccountPayment();
  this.objOnAccountPayment.storeID = this.UserInfo.storeID;
  this.objOnAccountPayment.storeCode = this.UserInfo.storeCode;
  this.objOnAccountPayment.customerCode =this.myForm.get('CustomerCode').value;;
  this.objOnAccountPayment.paymentDate = new Date();
  this.objOnAccountPayment.billingAmount = this.myForm.get('PayingBillAmount').value;
  this.objOnAccountPayment.receivedAmount = ReceivedAmount;
  this.objOnAccountPayment.returnAmount = this.myForm.get('ReturnAmount').value;
  this.objOnAccountPayment.onAccountPaymentDetailsList = this.OnAccountPaymentDetailsList;
  this.objOnAccountPayment.onAcInvoiceWisePaymentList =this.value;
  var mOnAccountPayment=new MOnAccountPayment();
  mOnAccountPayment.onAccountPaymentRecord= this.objOnAccountPayment;
      this.common.showSpinner();
            this.api.postAPI("OnAccountPayment", mOnAccountPayment).subscribe((data) => {
                //// .log(data);
                if (data != null && data.statusCode != null && data.statusCode == 1) {
                    this.common.hideSpinner();
                    this.common.showMessage('success', 'On Account saved successfully.');
                } else {
                    setTimeout(() => {
                        this.common.hideSpinner();
                        this.common.showMessage('error', 'Failed to Save.');
                    }, this.common.time_out_delay);
                }
            });
}
SelectItem_checkedChanged(item: MOnAccountInvoiceWisePayment)
{
  this.TotalPaid = 0;
  // int SlNo = ((OnAcInvoiceWisePayment)(e.Row)).SlNo;

  this.BalanceAmount = item.pendingAmount;
  this.DiscountAmount = item.discountAmount;
  this.PaymentAmount = item.paidAmount;
  this.IsSelect = item.isSelect;
  // if (this.DiscountAmount >  this.BalanceAmount)
  //    {
  //     this.common.showMessage('warn','Discount Amount must be Equal or less than Balance Amount !.');
  //     this.OnAccountpaymentpendingList[0].discountAmount = 0;
  //     this.DiscountAmount = 0; // Re-Assign Value
  //     }
  //     else
  //      {
  //       this.PayAmount = this.BalanceAmount - this.DiscountAmount;
  //       this.OnAccountpaymentpendingList[0].paidAmount = this.PayAmount;
  //       this.PaymentAmount = this.OnAccountpaymentpendingList[0].paidAmount; // Re-Assign Value
  //       this.OnAccountpaymentpendingList[0].isSelect = true;
  //     }
     
         if (!this.IsSelect && this.PaymentAmount == 0)
          {
             this.PayAmount = this.BalanceAmount - this.DiscountAmount;
             this.OnAccountpaymentpendingList[0].paidAmount = this.PayAmount;
             this.PaymentAmount = this.OnAccountpaymentpendingList[0].paidAmount;  // Re-Assign Value
          }
          else
          {
            this.OnAccountpaymentpendingList[0].paidAmount = 0;
            this.OnAccountpaymentpendingList[0].discountAmount = 0;
          }
          this.OnAccountpaymentpendingList[0].isSelect = true;
          this.TotalPaid =  this.DiscountAmount +  this.PaymentAmount;

          if ( this.TotalPaid >  this.BalanceAmount)
          {
            this.common.showMessage('warn','Paid Amount must be Equal or less than Balance Amount!.');
    
              this.OnAccountpaymentpendingList[0].paidAmount = 0;
              this.PaymentAmount = 0; // Re-Assign Value
              this.TotalPaid = this.DiscountAmount + this.PaymentAmount;  // Re-Assign Value
          }

  if ( this.TotalPaid ==this.BalanceAmount && this.IsSelect == true)
  {
    this.OnAccountpaymentpendingList[0].closeBill = true;
  }
  else
  {
    this.OnAccountpaymentpendingList[0].closeBill = false;
  }
  if (this.OnAccountpaymentpendingList.length > 0)
  {
      var SelectedList = this.OnAccountpaymentpendingList.filter(x => x.isSelect == true);
      if (SelectedList != null && SelectedList.length > 0)
      {
         this.myForm.controls['PayingBillAmount'].setValue(SelectedList.reduce((sum,x) => sum + x.paidAmount,0).toFixed(3));
         this.myForm.controls['BalencetoPay'].setValue(SelectedList.reduce((sum,x) => sum + x.paidAmount,0).toFixed(3));
         this.myForm.controls['ReturnAmount'].setValue('0');
        
         this.myForm.controls['CashReceivedAmount'].setValue(SelectedList.reduce((sum,x) => sum + x.paidAmount,0).toFixed(3));
         this.myForm.controls['CardRecievedAmount'].setValue(SelectedList.reduce((sum,x) => sum + x.paidAmount,0).toFixed(3));
      }
      else
      {
        this.myForm.controls['PayingBillAmount'].setValue('0');
        this.myForm.controls['BalencetoPay'].setValue('0');
        this.myForm.controls['ReturnAmount'].setValue('0');
        this.myForm.controls['CashReceivedAmount'].setValue('0');
        this.myForm.controls['CardRecievedAmount'].setValue('0');
      }
  }
  else
  {
    this.myForm.controls['PayingBillAmount'].setValue('0');
    this.myForm.controls['BalencetoPay'].setValue('0');
    this.myForm.controls['ReturnAmount'].setValue('0');
    this.myForm.controls['CashReceivedAmount'].setValue('0');
    this.myForm.controls['CardRecievedAmount'].setValue('0');
  }

}
close()
{
  this.router.navigate(['onaccount-payment']);
}
remove_payment(item) {
  const idx = this.OnAccountPaymentDetailsList.indexOf(item, 0);
  if (idx == -1) 
  {
      this.OnAccountPaymentDetailsList.splice(idx, 1);
      this.CalculatePayments();
      if(this.OnAccountPaymentDetailsList.length>0)
      {
        // this.myForm.controls['amount_received'].setValue(this.balance.toFixed(this.decimal_places));
      }
      else
      {
        this.ReceivedAmount = this.OnAccountPaymentDetailsList.reduce((sum,x) => sum + x.receivedAmount,0);
        this.BalanceToPay = (this.PayingAmount - this.ReceivedAmount);
        this.balanceAmount=this.BalanceToPay.toFixed(this.decimal_places);
        // this.myForm.controls['BalencetoPay'].setValue(this.BalanceToPay.toFixed(this.decimal_places));
      }
     
  }
  // if(idx <= 0)
  // {
  //   this.isShown = ! this.isShown;
  // }

}
}
