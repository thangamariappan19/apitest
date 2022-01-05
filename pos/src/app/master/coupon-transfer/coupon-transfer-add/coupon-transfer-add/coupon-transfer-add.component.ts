import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/api.service";
import { CommonService } from "src/app/common.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmService } from "src/app/confirm/confirm.service";
import { Router } from "@angular/router";
import { MCouponReceiptDetails } from "src/app/models/m-coupon-receipt-details";
import { MCouponMaster } from "src/app/models/m-coupon-master";
import { MCouponTransaction } from "src/app/models/m-coupon-transaction";
import{ DocumentType} from "src/app/models/enums";
import { MUserDetails } from 'src/app/models/m-user-details';
import{MCouponTransferMaster} from 'src/app/models/m-coupon-transfer-master';
import{MCouponTransferDetails} from 'src/app/models/m-coupon-transfer-details';

@Component({
  selector: 'app-coupon-transfer-add',
  templateUrl: './coupon-transfer-add.component.html',
  styleUrls: ['./coupon-transfer-add.component.css']
})
export class CouponTransferAddComponent implements OnInit {
  myForm: FormGroup;
  ToStoreList: Array<any>;
  ToCountryList: Array<any>;
  CouponCodeList: Array<any>;
  FromCountryID: any;
  ToStoreID: any;
  CouponCode: any;
  FromSerialNum: any;
  ToSerialNum: any;
  CouponReceiptDetailsList: Array<MCouponReceiptDetails>=null;
  CouponReceiptDetailsList1: Array<MCouponReceiptDetails>=null;
  CouponTransaction:MCouponTransaction;
  CouponMasterList: Array<MCouponMaster>;
  CouponReceiptDetails: any;
  mCouponTransferMaster:MCouponTransferMaster;
  ToStoreCode: string;
  FromCountryCode:string;
  CouponTransactionList:Array<MCouponTransaction>;
  tablelist: Array<MCouponReceiptDetails> = null;
  CouponID:any;
  Fromloaction:any;
  user_details: MUserDetails = null;
  couponTransferDetails: Array<MCouponTransferDetails>=null;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);

    }
    if (this.user_details == null) {
      common.showMessage("warn", "Invalid User Details");
      localStorage.setItem('pos_mode', 'false');
      this.router.navigate(['home']);
    }
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      CouponCode: ["", Validators.required],
      Fromlocation: ["", Validators.required],
      FromSerialNum: ["", Validators.required],
      ToSerialNum: [""],
      ToCountry: [""],
      ToStore: [""],
      active: [""],
    });

    this.GetCountryList();
    this.GetCouponLookUp();
    this.CouponReceiptDetailsList = new Array<MCouponReceiptDetails>();
    this.tablelist = new Array<MCouponReceiptDetails>();
  }
  ngOnInit(): void
  {

  }
  GetCountryList()
  {
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP")
    .subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1)
        {
          this.ToCountryList = data.countryMasterList;

         }
        else {
          let msg: string = data != null && data.displayMessage != null
          && data.displayMessage != ""? data.displayMessage: "Failed to retrieve Data.";
          this.common.showMessage("warn", msg);
        }
        this.common.hideSpinner();
      }, this.common.time_out_delay);
    });
  }
  Onchangecountry(id) {
    let cntrycode=this.ToCountryList.find(x=>x.id==id).countryCode;
    this.FromCountryCode=cntrycode;
    this.common.showSpinner();
    this.api.getAPI("Store?countryID=" + id).subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.ToStoreList = data.storeMasterList;
        }
        else
         {
          let msg: string = data != null && data.displayMessage != null
          && data.displayMessage != "" ? data.displayMessage: "Failed to retrieve Data.";
          this.common.showMessage("warn", msg);
        }
        this.common.hideSpinner();
      }, this.common.time_out_delay);
    });
  }
  OnchangeStore(id)
  {
    let stcode = this.ToStoreList.find(x=> x.id == id);
    this.ToStoreCode=stcode.storeCode;
    this.FromCountryID=id;
    this.ToStoreID=stcode.id;
  }
  GetCouponLookUp() {
    this.common.showSpinner();
    this.api.getAPI("CouponLookUp?i=" + 0).subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.CouponCodeList = data.couponMasterList;
          this.CouponMasterList = data.couponMasterList;
          this.myForm.controls['Fromlocation'].setValue('MainServer');
        }
        else
        {
          let msg: string =data != null && data.displayMessage != null
          && data.displayMessage != ""? data.displayMessage: "Failed to retrieve Data.";
          this.common.showMessage("warn", msg);
        }
        this.common.hideSpinner();
      }, this.common.time_out_delay);
    });
  }
  btnGenerate_Click() {
    this.FromSerialNum=this.myForm.get('FromSerialNum').value;
    this.ToSerialNum=this.myForm.get('ToSerialNum').value;
    if (this.FromCountryID != 0 && this.ToStoreID != 0) {
      this.common.showSpinner();
      this.api.getAPI("CouponTransfer?CouponCode="+ this.CouponCode + "&FromSerialNum=" + this.FromSerialNum + "&ToSerialNum=" + this.ToSerialNum)
        .subscribe((data) => {
          setTimeout(() => {
            if (data != null && data.statusCode != null && data.statusCode == 1)
             {
              if(this.tablelist.length>0)
              {
                this.CouponReceiptDetailsRecord = data.couponReceiptDetailsRecord;
              }
              else
              {
                this.CouponReceiptDetails=data.couponReceiptDetailsRecord?data.couponReceiptDetailsRecord:[];
                this.CouponReceiptDetailsList1= new Array<MCouponReceiptDetails>();
                for (let couponReceiptDetails of this.CouponReceiptDetails)
                {

                  let item:MCouponReceiptDetails={
                    couponSerialCode:couponReceiptDetails.couponSerialCode,
                    issuedStatus:couponReceiptDetails.issuedStatus,
                    physicalStore:this.ToStoreCode,
                    toStore:this.ToStoreCode,
                    redeemedStatus:couponReceiptDetails.redeemedStatus,
                    isSaved:couponReceiptDetails.isSaved

                  }
                  this.CouponReceiptDetailsList1.push(item);

                }
                this.tablelist=this.CouponReceiptDetailsList1;
              }

            }
            else
            {
              let msg: string =data != null && data.displayMessage != null
              && data.displayMessage != ""? data.displayMessage: "Failed to retrieve Data.";
              this.common.showMessage("warn", msg);
            }
            this.common.hideSpinner();
          }, this.common.time_out_delay);
        });
      }
      else
       {
      this.common.showMessage("warn", "Must select Country and store..");
    }
  }
  get CouponReceiptDetailsRecord(): Array<MCouponReceiptDetails>
  {
    return Array<MCouponReceiptDetails>()
  }
  set CouponReceiptDetailsRecord(value: Array<MCouponReceiptDetails>)
  {
    if (value.length > 0)
    {
      let  DayInData = value.find(x => x.couponSerialCode === this.FromSerialNum || x.couponSerialCode === this.ToSerialNum);
      if (DayInData == null)
      {
        for (let objCouponReceiptDetailsList of value)
        {
          let DayInData1 = value.find(x => x.couponSerialCode === objCouponReceiptDetailsList.couponSerialCode || x.couponSerialCode === objCouponReceiptDetailsList.couponSerialCode);
          if (DayInData1 != null)
           {

           }
          else
          {
            for (let objCouponReceiptDetailsList of value) {
              let item:MCouponReceiptDetails={
                couponSerialCode:objCouponReceiptDetailsList.couponSerialCode,
                issuedStatus:objCouponReceiptDetailsList.issuedStatus,
                physicalStore:objCouponReceiptDetailsList.physicalStore,
                toStore:this.ToStoreCode,
                redeemedStatus:objCouponReceiptDetailsList.redeemedStatus,
                isSaved:objCouponReceiptDetailsList.isSaved
              }
              this.CouponReceiptDetailsList.push(item);
            }
          }

          this.tablelist=this.CouponReceiptDetailsList;
        }
      }
      else
       {
        this.common.showMessage( "warn","This serialcode already allocated to another store" );
        }
       }
     else
     {
        for (let objCouponReceiptDetailsList of this.CouponReceiptDetailsList) {
          let item:MCouponReceiptDetails={
            couponSerialCode:objCouponReceiptDetailsList.couponSerialCode,
            issuedStatus:objCouponReceiptDetailsList.issuedStatus,
            physicalStore:objCouponReceiptDetailsList.physicalStore,
            toStore:this.ToStoreCode,
            redeemedStatus:objCouponReceiptDetailsList.redeemedStatus,
            isSaved:objCouponReceiptDetailsList.isSaved
          }
          this.CouponReceiptDetailsList.push(item);
     }
   }
  }
  btnSave_Click()
  {

      this.couponTransferDetails = new Array<MCouponTransferDetails>();
      for (let objcouponTransferDetails of this.tablelist)
      {

       let item:MCouponTransferDetails={
        couponSerialCode:objcouponTransferDetails.couponSerialCode,
        issuedStatus:objcouponTransferDetails.issuedStatus,
        physicalStore:objcouponTransferDetails.physicalStore,
        redeemedStatus:objcouponTransferDetails.redeemedStatus,
        isSaved:objcouponTransferDetails.isSaved,
        toStore:objcouponTransferDetails.toStore
         }
          this.couponTransferDetails.push(item);
       }


            this.mCouponTransferMaster =new MCouponTransferMaster();
            this.mCouponTransferMaster.couponCode=this.CouponCode;

            this.mCouponTransferMaster.couponID=this.myForm.get('CouponCode').value;
            this.mCouponTransferMaster.fromCountryID=this.FromCountryID;
            this.mCouponTransferMaster.fromCountryCode=this.FromCountryCode;
            this.mCouponTransferMaster.fromSerialNum=this.myForm.get('FromSerialNum').value;
            this.mCouponTransferMaster.toSerialNum=this.myForm.get('ToSerialNum').value;
            this.mCouponTransferMaster.fromloaction=this.myForm.get('Fromlocation').value;
            this.mCouponTransferMaster.toStoreID=this.ToStoreID;
            this.mCouponTransferMaster.toStoreCode=this.ToStoreCode;
            this.mCouponTransferMaster.active=true;
            this.mCouponTransferMaster.couponReceiptDetailsList=this.CouponReceiptDetailsList1;
            this.mCouponTransferMaster.couponTransferDetailsList=this.couponTransferDetails;
             var mcoupontranferMaster1=new MCouponTransferMaster();
             mcoupontranferMaster1.couponReceiptDetailsList=this.CouponReceiptDetailsList1?this.CouponReceiptDetailsList1:[];
             mcoupontranferMaster1.couponTransferDetailsList=this.couponTransferDetails;
             mcoupontranferMaster1.couponTransferRecord=this.mCouponTransferMaster;
            this.api.postAPI("CouponTransfer", mcoupontranferMaster1).subscribe((data) => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                // this.CouponTransactionsLog();
                this.common.hideSpinner();
                this.common.showMessage('success', data.displayMessage);
                this.CouponTransactionsLog();
                this.router.navigate(['coupon-transfer']);

              } else {
                setTimeout(() => {
                  this.common.hideSpinner();
                  this.common.showMessage('error', 'Failed to Save.');
                }, this.common.time_out_delay);
              }
             })

    }
  CouponTransactionsLog()
  {
    this.CouponTransactionList = new Array<MCouponTransaction>();
     for (let objcouponTransferDetails of this.CouponReceiptDetailsList1)
      {

         let item:MCouponTransaction={
          couponID : this.myForm.get('CouponCode').value,
          couponCode : this.CouponCode,
          fromLocation : this.mCouponTransferMaster.fromloaction,
          documentID : DocumentType.COUPONTRANSFER,
          couponSerialCode : objcouponTransferDetails.couponSerialCode,
          issuedStatus : objcouponTransferDetails.issuedStatus,
          physicalStore :  objcouponTransferDetails.physicalStore,
          redeemedStatus : objcouponTransferDetails.redeemedStatus,
          toStore : objcouponTransferDetails.toStore,
          transactionDate : new Date().toDateString(),
          couponTransactionList:Array<MCouponTransaction>()
          }
          this.CouponTransactionList.push(item);
        }
        var mTransaction=new MCouponTransaction();
      mTransaction.couponTransactionList=this.CouponTransactionList;
      this.api.postAPI("CouponTransactionlog",mTransaction).subscribe((data) => {
      if (data != null && data.statusCode != null && data.statusCode == 1) {
        this.common.hideSpinner();
        this.common.showMessage('success', data.displayMessage);
        this.clearForm();
      } else {
        setTimeout(() => {
          this.common.hideSpinner();
          this.common.showMessage('error', 'Failed to Save.');
        }, this.common.time_out_delay);
      }
    })

  }
  btnReset_Click()
  {

  }
  btnClose_Click(){
    if(this.myForm.dirty){
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['coupon-transfer']);
    }
    }
    else
    {
      this.router.navigate(['coupon-transfer']);
  }
  }

  CoupontransactionDetails()
  {
    this.CouponTransactionList = new Array<MCouponTransaction>();
    this.CouponReceiptDetailsList1 = this.CouponReceiptDetailsList;

    for (let objcouponTransferDetails of this.CouponReceiptDetailsList1)
      {

         let item:MCouponTransaction={
          couponID : this.myForm.get('CouponCode').value,
          couponCode : this.CouponCode,
          fromLocation : this.mCouponTransferMaster.fromloaction,
          documentID : DocumentType.COUPONTRANSACTION,
          couponSerialCode : objcouponTransferDetails.couponSerialCode,
          issuedStatus : objcouponTransferDetails.issuedStatus,
          physicalStore :  objcouponTransferDetails.physicalStore,
          redeemedStatus : objcouponTransferDetails.redeemedStatus,
          toStore : objcouponTransferDetails.toStore,
          transactionDate : new Date().toDateString(),
          couponTransactionList:Array<MCouponTransaction>()

          }
          this.CouponTransactionList.push(item);


        }
    }
         CouponTransactionDeepCopy(objCouponTransaction: MCouponTransaction): MCouponTransaction
        {
            let TempCouponTransaction: MCouponTransaction = new MCouponTransaction();
            TempCouponTransaction.couponID = objCouponTransaction.couponID;
            TempCouponTransaction.couponCode = objCouponTransaction.couponCode;
            TempCouponTransaction.fromLocation = objCouponTransaction.fromLocation;
            TempCouponTransaction.transactionDate = objCouponTransaction.transactionDate;
            TempCouponTransaction.documentID = objCouponTransaction.documentID;

            TempCouponTransaction.couponSerialCode = objCouponTransaction.couponSerialCode;
            TempCouponTransaction.issuedStatus = objCouponTransaction.issuedStatus;
            TempCouponTransaction.physicalStore = objCouponTransaction.physicalStore;
            TempCouponTransaction.redeemedStatus = objCouponTransaction.redeemedStatus;
            TempCouponTransaction.isSaved = objCouponTransaction.isSaved;
            TempCouponTransaction.toStore = objCouponTransaction.toStore;
            return TempCouponTransaction;
        }
        clearForm()
        {
          this.myForm.controls['FromSerialNum'].setValue('');
          this.myForm.controls['description'].setValue('');
          this.myForm.controls['ToSerialNum'].setValue('');
          this.myForm.controls['Fromlocation'].setValue('');
          this.myForm.controls['CouponCode'].setValue('');
          this.myForm.controls['attribute1'].setValue('');
          this.myForm.controls['active'].setValue(true);
          this.FromCountryID=null;
          this.ToStoreCode=null;
          this.FromCountryID=null;
          this.ToStoreCode=null;
          this.CouponTransactionList=new Array<MCouponTransaction>();
          this.tablelist=new Array<MCouponReceiptDetails>();

        }
        getSelectedOptionText(event: Event) {
          let selectElementText = event.target['options']
             [event.target['options'].selectedIndex].text;

             this.CouponCode=selectElementText;

       }

}
