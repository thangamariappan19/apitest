import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/api.service";
import { CommonService } from "src/app/common.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmService } from "src/app/confirm/confirm.service";
import { Router,ActivatedRoute } from "@angular/router";
import { MCouponReceiptDetails } from "src/app/models/m-coupon-receipt-details";
import { MCouponMaster } from "src/app/models/m-coupon-master";
import { MCouponTransaction } from "src/app/models/m-coupon-transaction";
import{ DocumentType } from "src/app/models/enums";
import { MUserDetails } from 'src/app/models/m-user-details';
import{MCouponTransferMaster} from 'src/app/models/m-coupon-transfer-master';
import{MCouponTransferDetails} from 'src/app/models/m-coupon-transfer-details';

@Component({
  selector: 'app-coupon-transfer-edit',
  templateUrl: './coupon-transfer-edit.component.html',
  styleUrls: ['./coupon-transfer-edit.component.css']
})
export class CouponTransferEditComponent implements OnInit {
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
  id:any;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
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
    

  ngOnInit(): void {
    this.GetCouponLookUp();
    this.GetCouponTransferRecord();
    this.SelectCouponTransferDetails();
    this.CouponReceiptDetailsList = new Array<MCouponReceiptDetails>();
    // this.tablelist = new Array<MCouponReceiptDetails>();  
  }
  GetCouponTransferRecord()
  {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.common.showSpinner();
    this.api.getAPI("CouponTransfer?ID="+this.id).subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.mCouponTransferMaster=data.couponTransferMasterRecord;
          this.tablelist=data.couponTransferMasterRecord.couponTransferDetailsList;
          this.myForm.controls['CouponCode'].setValue(data.couponTransferMasterRecord.couponID);
          this.myForm.controls['Fromlocation'].setValue(data.couponTransferMasterRecord.fromloaction);
          this.myForm.controls['FromSerialNum'].setValue(data.couponTransferMasterRecord.fromSerialNum);
          this.myForm.controls['ToSerialNum'].setValue(data.couponTransferMasterRecord.toSerialNum);
          this.myForm.controls['ToCountry'].setValue(data.couponTransferMasterRecord.fromCountryID);
          this.Onchangecountry(data.couponTransferMasterRecord.fromCountryID);
          this.myForm.controls['ToStore'].setValue(data.couponTransferMasterRecord.toStoreID);
          this.myForm.controls['active'].setValue(data.couponTransferMasterRecord.active);
          this.ToStoreCode=data.couponTransferMasterRecord.toStoreCode;
        
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
  SelectCouponTransferDetails()
  {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.common.showSpinner();
    this.api.getAPI("CouponTransfer?id="+this.id).subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
           this.CouponTransactionList = data.responseDynamicData;
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
  GetCountryList() {
    this.common.showSpinner();
    this.api.getAPI("CountryMasterLookUP").subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.ToCountryList = data.countryMasterList;
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
  Onchangecountry(id) {
    let cntrycode=this.ToCountryList.find(x=>x.id==id).countryCode;
    this.FromCountryCode=cntrycode;
    this.common.showSpinner();
    this.api.getAPI("Store?countryID=" + id).subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.ToStoreList = data.storeMasterList;
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
          // this.tblDataCopy = data.responseDynamicData;
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
  btnGenerate_Click() {
    this.FromSerialNum=this.myForm.get('FromSerialNum').value;
    this.ToSerialNum=this.myForm.get('ToSerialNum').value;
    if (this.FromCountryID != 0 && this.ToStoreID != 0) {
      this.common.showSpinner();
      this.api
        .getAPI(
          "CouponTransfer?CouponCode=" +
            this.CouponCode +
            "&FromSerialNum=" +
            this.FromSerialNum +
            "&ToSerialNum=" +
            this.ToSerialNum
        )
        .subscribe((data) => {
          setTimeout(() => {
            if (
              data != null &&
              data.statusCode != null &&
              data.statusCode == 1
            ) {
              if(!this.tablelist.length)
              {
                this.CouponReceiptDetails=data.couponReceiptDetailsRecord;
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
              else{
                this.CouponReceiptDetailsRecord = data.couponReceiptDetailsRecord;
              }
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
    } else {
      this.common.showMessage("warn", "Must select Country and store..");
    }
  }
  get CouponReceiptDetailsRecord(): Array<MCouponReceiptDetails>
  {
    return Array<MCouponReceiptDetails>()
  }
  set CouponReceiptDetailsRecord(value: Array<MCouponReceiptDetails>) 
  {
    if (value.length > 0) {
      let  DayInData = value.find(x => x.couponSerialCode === this.FromSerialNum || x.couponSerialCode === this.ToSerialNum);
      if (DayInData == null) {
        for (let objCouponReceiptDetailsList of value) 
        {
          let DayInData1 = value.find(
              (x) =>
              x.couponSerialCode ===
                objCouponReceiptDetailsList.couponSerialCode ||
              x.couponSerialCode ===
                objCouponReceiptDetailsList.couponSerialCode
          );
          if (DayInData1 != null) {
          } else {
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
      } else {
        this.common.showMessage(
          "warn",
          "This serialcode already allocated to another store"
        );
      }
    } else {
      for (let objCouponReceiptDetailsList of this.CouponReceiptDetailsList)
       {
       
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
  btnUpdate_Click()
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
          // this.CouponReceiptDetailsList(item);

      }
            
            
            this.mCouponTransferMaster =new MCouponTransferMaster();
            this.mCouponTransferMaster.couponCode=this.CouponCode;
            this.mCouponTransferMaster.id=this.id;
            this.mCouponTransferMaster.couponID=this.myForm.get('CouponCode').value;
            this.mCouponTransferMaster.fromCountryID=this.FromCountryID;
            this.mCouponTransferMaster.fromCountryCode=this.FromCountryCode;
            this.mCouponTransferMaster.fromSerialNum=this.myForm.get('FromSerialNum').value;
            this.mCouponTransferMaster.toSerialNum=this.myForm.get('ToSerialNum').value;
            this.mCouponTransferMaster.fromloaction=this.myForm.get('Fromlocation').value;
            this.mCouponTransferMaster.toStoreID=this.ToStoreID;
            this.mCouponTransferMaster.toStoreCode=this.ToStoreCode;
            this.mCouponTransferMaster.active=true;
             var mcoupontranferMaster1=new MCouponTransferMaster();
             mcoupontranferMaster1.couponReceiptDetailsList=this.CouponReceiptDetailsList1;
             mcoupontranferMaster1.couponTransferDetailsList=this.couponTransferDetails;
             mcoupontranferMaster1.couponTransferRecord=this.mCouponTransferMaster;
             

            this.api.postAPI("CouponTransfer", mcoupontranferMaster1).subscribe((data) => {
              if (data != null && data.statusCode != null && data.statusCode == 1) {
                // this.CouponTransactionsLog();
                this.common.hideSpinner();
                this.common.showMessage('success', data.displayMessage);
                this.router.navigate(['coupon-transfer']);
                this.clearForm();
              } else {
                setTimeout(() => {
                  this.common.hideSpinner();
                  this.common.showMessage('error', 'Failed to Save.');
                }, this.common.time_out_delay);
              }
            })
            
  }
  // CouponTransactionsLog()
  // {
  //   var mcouponTransactionList=new Array<MCouponTransaction>();
  //   mcouponTransactionList=this.CouponTransactionList;
  //   // this.CoupontransactionDetails();
  //   this.api.postAPI("CouponTransactionlog", mcouponTransactionList).subscribe((data) => {
  //     //// .log(data);
  //     if (data != null && data.statusCode != null && data.statusCode == 1) {
  //       this.common.hideSpinner();
  //       //this.common.showMessage('success', 'Design Data saved successfully.');
  //       this.common.showMessage('success', data.displayMessage);
  //     // this.clearForm();
  //        this.router.navigate(['coupon-transfer']);
  //     } else {
  //       setTimeout(() => {
  //         this.common.hideSpinner();
  //         this.common.showMessage('error', 'Failed to Save.');
  //       }, this.common.time_out_delay);
  //     }
  //   })

  // }
  // CouponTransferDetails()
  // {

  // }
  btnReset_Click()
  {
    this.createForm();

  }
  btnClose_Click(){
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['coupon-transfer']);
        this.clearForm();
    }  
    } 
    else
    {
      this.router.navigate(['coupon-transfer']);
  }
  }
  // CouponTransferTraverse( Index:number,  IsLastRecord:boolean)
  // {
  //           // List<CouponTransferMaster> CouponTransfer = ApplicationState.GetValue<List<CouponTransferMaster>>("CouponTransferView", "CouponTransferMasterList");

  //           // if (Index <= CouponTransfer.Count - 1 && Index >= 0)
  //           // {
  //           //     if (IsLastRecord)
  //           //     {
  //           //         Index = CouponTransfer.Count - 1;
  //           //     }
  //           //     ID = CouponTransfer[Index].ID;
  //           //     CouponID = CouponTransfer[Index].CouponID;
  //           //     FromCountryID = CouponTransfer[Index].FromCountryID;
  //           //     ToStoreID = CouponTransfer[Index].ToStoreID;
  //           //     FromSerialNum = CouponTransfer[Index].FromSerialNum;
  //           //     ToSerialNum = CouponTransfer[Index].ToSerialNum;
  //           //     Fromloaction = CouponTransfer[Index].Fromloaction;

  //           //     Active = CouponTransfer[Index].Active;
  //           //     _Index = Index;
  //           // }
  //  }
  // CoupontransactionDetails()
  // {
  //   this.CouponTransactionList = new Array<MCouponTransaction>();
  //   // this.CouponReceiptDetailsList1 = new Array<MCouponReceiptDetails>();
  //   // this.CouponReceiptDetailsList1 = this.CouponReceiptDetailsList;
  //   this.CouponReceiptDetails  = new MCouponReceiptDetails();
  //   this.CouponTransaction  = new MCouponTransaction();
  //   for (let objcouponTransferDetails of this.CouponReceiptDetailsList1)
  //   {
      
  //      let item:MCouponTransaction={
  //       couponID : this.myForm.get('CouponCode').value,
  //       couponCode : this.CouponCode,
  //       fromLocation : this.mCouponTransferMaster.fromloaction,
  //       documentID : DocumentType.COUPONTRANSACTION,
  //       couponSerialCode : objcouponTransferDetails.couponSerialCode,
  //       issuedStatus : objcouponTransferDetails.issuedStatus,
  //       physicalStore :  objcouponTransferDetails.physicalStore,
  //       redeemedStatus : objcouponTransferDetails.redeemedStatus,
  //       toStore : objcouponTransferDetails.toStore,
  //       transactionDate : new Date().toDateString()

  //       }
  //       this.CouponTransactionList.push(item);
  //         // this.CouponReceiptDetailsList(item);

  //     }
  //   // for (let i = 0; i < this.CouponReceiptDetailsList1.length; i++)
  //   // {
  //   //   this.CouponTransaction.id = 0;
  //   //   this.CouponTransaction.couponID = this.myForm.get('CouponCode').value;
  //   //   this.CouponTransaction.couponCode = this.CouponCode;
  //   //   this.CouponTransaction.fromLocation = this.mCouponTransferMaster.fromloaction;
  //   //   this.CouponTransaction.documentID = DocumentType.COUPONTRANSACTION;
  //   //   this.CouponTransaction.couponSerialCode = this.CouponReceiptDetailsList1[i].couponSerialCode;
  //   //   this.CouponTransaction.issuedStatus = this.CouponReceiptDetailsList1[i].issuedStatus;
  //   //   this.CouponTransaction.physicalStore =  this.CouponReceiptDetailsList1[i].physicalStore;
  //   //   this.CouponTransaction.redeemedStatus = this.CouponReceiptDetailsList1[i].redeemedStatus;
  //   //   this.CouponTransaction.toStore = this.CouponReceiptDetailsList1[i].toStore;
  //   //   this.CouponTransaction.transactionDate = new Date().toDateString();
  //   //   let CouponTransactionType: MCouponTransaction = this.CouponTransactionDeepCopy(this.CouponTransaction);
  //   //   this.CouponTransactionList.push(CouponTransactionType);
  //   // }
  //   this.CouponTransactionsLog();
  // }
  //  CouponTransactionDeepCopy(objCouponTransaction: MCouponTransaction): MCouponTransaction
  //  {
  //           let TempCouponTransaction: MCouponTransaction = new MCouponTransaction();
  //           TempCouponTransaction.couponID = objCouponTransaction.couponID;
  //           TempCouponTransaction.couponCode = objCouponTransaction.couponCode;
  //           TempCouponTransaction.fromLocation = objCouponTransaction.fromLocation;
  //           TempCouponTransaction.transactionDate = objCouponTransaction.transactionDate;
  //           TempCouponTransaction.documentID = objCouponTransaction.documentID;

  //           TempCouponTransaction.couponSerialCode = objCouponTransaction.couponSerialCode;
  //           TempCouponTransaction.issuedStatus = objCouponTransaction.issuedStatus;
  //           TempCouponTransaction.physicalStore = objCouponTransaction.physicalStore;
  //           TempCouponTransaction.redeemedStatus = objCouponTransaction.redeemedStatus;
  //           TempCouponTransaction.isSaved = objCouponTransaction.isSaved;
  //           TempCouponTransaction.toStore = objCouponTransaction.toStore;
  //           return TempCouponTransaction;
  //  }
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
