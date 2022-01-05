import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/api.service";
import { CommonService } from "src/app/common.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmService } from "src/app/confirm/confirm.service";
import { Router } from "@angular/router";
import { MCouponTransaction } from "src/app/models/m-coupon-transaction";
import{MCouponReceiptHeader} from 'src/app/models/m-coupon-receipt-header';
import{ DocumentType} from "src/app/models/enums";
import { MUserDetails } from 'src/app/models/m-user-details';
import { MCouponReceiptDetails } from 'src/app/models/m-coupon-receipt-details';
// import indexOfAny from "index-of-any";
// import { isNumeric } from 'rxjs/util/isNumeric';


@Component({
  selector: 'app-coupon-receipt-add',
  templateUrl: './coupon-receipt-add.component.html',
  styleUrls: ['./coupon-receipt-add.component.css']
})
export class CouponReceiptAddComponent implements OnInit {
  user_details: MUserDetails = null;
  myForm: FormGroup;
  ToStoreID: any;
  CouponCode: any;
  FromSerialNum: any;
  ToSerialNum: any;
  CouponCodeList: Array<any>;
  tablelist: Array<MCouponReceiptDetails> = null;
  CouponReceiptDetailsList1: Array<MCouponReceiptDetails>=null;
  mCouponReceiptMaster:MCouponReceiptHeader;
  CouponTransactionList:Array<MCouponTransaction>;
  
  constructor( private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router) {  
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
        Currentlocation: ["", Validators.required],
        FromSerialNum: ["", Validators.required],
        ToSerialNum: ["",Validators.required],
        active: [""],
      });
      this.GetCouponLookUp();
      // this.CouponReceiptDetailsList = new Array<MCouponReceiptDetails>();
      // this.tablelist = new Array<MCouponReceiptDetails>();
    }

  ngOnInit(): void {
  }
  GetCouponLookUp() {
    this.common.showSpinner();
    this.api.getAPI("CouponLookUp?i=" + 0).subscribe((data) => {
      setTimeout(() => {
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.CouponCodeList = data.couponMasterList;
          // this.CouponMasterList = data.couponMasterList;
          this.myForm.controls['Currentlocation'].setValue('MainServer');
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
  isNumeric(val)
  {
    return !isNaN(val)
  }
  btnGenerate_Click()
  {
    this.FromSerialNum=this.myForm.get('FromSerialNum').value;
    this.ToSerialNum=this.myForm.get('ToSerialNum').value;
    if (this.FromSerialNum != "" && this.ToSerialNum != "")
      {
      this.common.showSpinner();
      this.api
        .getAPI(
          "CouponReceipt?CouponCode=" +
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
            )
             {
              // if(this.tablelist.length>0)
              // {
                this.tablelist = data.couponReceiptDetailsRecord;
                this.CouponReceiptDetailsList1=data.couponReceiptDetailsRecord;
              // }
              // else{
              //   this.CouponReceiptDetails=data.couponReceiptDetailsRecord;
              //   this.CouponReceiptDetailsList1= new Array<MCouponReceiptDetails>();
              //   for (let couponReceiptDetails of this.CouponReceiptDetails)
              //   {
                  
              //     let item:MCouponReceiptDetails={
              //       couponSerialCode:couponReceiptDetails.couponSerialCode,
              //       issuedStatus:couponReceiptDetails.issuedStatus,
              //       physicalStore:this.ToStoreCode,
              //       toStore:this.ToStoreCode,
              //       redeemedStatus:couponReceiptDetails.redeemedStatus,
              //       isSaved:couponReceiptDetails.isSaved

              //     }
              //     this.CouponReceiptDetailsList1.push(item);
         
              //   }
              //   this.tablelist=this.CouponReceiptDetailsList1;
              // }
              
             
              // this.tablelist.push(this.CouponReceiptDetailsList);
             
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
//     this.ToSerialNum=this.myForm.get('ToSerialNum').value;
//     this.FromSerialNum=this.myForm.get('FromSerialNum').value;
//     if (((this.FromSerialNum != "") && (this.ToSerialNum != ""))) 
//     {
//     let indexofnum = ['0','1','2','3','4','5','6','7','8','9'];
//     let index: number =indexofnum.indexOf(this.FromSerialNum); 
//     let chars: string = this.FromSerialNum.substring(0, index);
//     let num: number = this.FromSerialNum.substring(index);
//     let index1: number =indexofnum.indexOf(this.ToSerialNum) //this.ToSerialNum.IndexOfAny(['0','1','2','3','4','5','6','7','8','9']);
//     let chars1: string = this.ToSerialNum.substring(0, index1);
//     let num1: number = this.ToSerialNum.substring(index1);
//     let Fromlength: number =this.FromSerialNum.length;
//     let Tolength: number = this.ToSerialNum.length;
//     if (((chars == chars1) && (Fromlength <= Tolength))) 
//     {
//         this.AddSubBrandRow();
//     }
//     else {
//       this.common.showMessage("warn","This serialcode already allocated to another store");
//     }
    
// }



  }
//   AddSubBrandRow(){
//     let TempCouponReceiptDetailsList: Array<MCouponReceiptDetails> = new Array<MCouponReceiptDetails>();
//     // if (((ApplicationState.GetValue < (List < this.CouponReceiptDetails))  + "CouponReceiptView")) 
//     // {
//     // }
    
//     let indexofnum = ['0','1','2','3','4','5','6','7','8','9'];
//     let row: number;
//     let a: number;
//     var cell = this.FromSerialNum;
//     a = this.getIndexofNumber(cell);
//     row = this.getIndexofNumber(cell);
//     let Numberpart: any = cell.substring(a, (cell.Length - a));
//     row = Numberpart;
//     var cell1 = this.ToSerialNum;
//     let row1: number;
//     let a1:number;
//     a1 = this.getIndexofNumber(cell1);
//     row1 = this.getIndexofNumber(cell1);
//     let Numberpart1: any = cell1.substring(a1, (cell1.Length - a1));
//     row1 = Numberpart1;
//     let index: number = indexofnum.indexOf(this.FromSerialNum); 
//     let chars: string = this.FromSerialNum.substring(0, index);
//     let num: number = this.FromSerialNum.substring(index);
//     let index1: number = indexofnum.indexOf(this.ToSerialNum) 
//     let chars1: string = this.FromSerialNum.substring(0, index1);
//     let num1: number =this.ToSerialNum.substring(index1);
//     for (let num2: number; (num <= num1); num++) 
//     {
//         let objCashInCashOutDetails = new MCouponReceiptDetails();
//         let length: number = Numberpart.length;
//         let str: string = ("D" + length);
//         let Serailcode: String = (chars + (num.toString()));
//         let DayInData = TempCouponReceiptDetailsList.find(x=> x.couponSerialCode == Serailcode);
//         if ((DayInData == null)) {
//             objCashInCashOutDetails.couponSerialCode = (chars + (num.toString()));
//             objCashInCashOutDetails.issuedStatus = false;
//             objCashInCashOutDetails.physicalStore = "MainServer";
//             objCashInCashOutDetails.redeemedStatus = false;
//             TempCouponReceiptDetailsList.push(objCashInCashOutDetails);
//         }
//         else {
            
//         }
        
//     }
//     this.tablelist=TempCouponReceiptDetailsList;
    
//   }
 
//   getIndexofNumber(cell: string): number {
//     let indexofNum: number = -1;
//     for (var c of cell) {
//         indexofNum++;
//         if (Number.isFinite(c)==true) 
//         {
//           return indexofNum;
//         }
      
        
        
//     }
    
//     return indexofNum;
// }
btnClose_Click()
{
         
}
btnReset_Click(){

}
btnSave_Click()
{
  this.mCouponReceiptMaster =new MCouponReceiptHeader();
  this.mCouponReceiptMaster.couponCode=this.CouponCode;
  this.mCouponReceiptMaster.id=0;
  this.mCouponReceiptMaster.couponID=this.myForm.get('CouponCode').value;
  this.mCouponReceiptMaster.fromSerialNum=this.myForm.get('FromSerialNum').value;
  this.mCouponReceiptMaster.toSerialNum=this.myForm.get('ToSerialNum').value;
  this.mCouponReceiptMaster.currentLocation=this.myForm.get('Currentlocation').value;
  this.mCouponReceiptMaster.active=true;
  this.mCouponReceiptMaster.couponReceiptDetailsList=this.CouponReceiptDetailsList1;
  var mCouponReceiptMaster1=new MCouponReceiptHeader();
  mCouponReceiptMaster1.couponReceiptDetailsList=this.CouponReceiptDetailsList1;
  mCouponReceiptMaster1.couponReceiptHeaderRecord=this.mCouponReceiptMaster;

this.api.postAPI("CouponReceipt", mCouponReceiptMaster1).subscribe((data) => {
if (data != null && data.statusCode != null && data.statusCode == 1) {
//this.CouponTransactionsLog();
this.common.hideSpinner();
this.common.showMessage('success', data.displayMessage);
this.CouponTransactionsLog();
this.router.navigate(['coupon-receipt']);
// this.clearForm();
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
  // this.CouponReceiptDetailsList1 = this.CouponReceiptDetailsList;

  for (let objcouponTransferDetails of this.CouponReceiptDetailsList1)
    {
      
       let item: MCouponTransaction={
        couponID : this.myForm.get('CouponCode').value,
        couponCode : this.CouponCode,
        fromLocation : this.mCouponReceiptMaster.currentLocation,
        documentID : DocumentType.COUPONRECEIPT,
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
 
  this.api.postAPI("CouponReceiptTransactionLog", mTransaction).subscribe((data) => {
    //// .log(data);
    if (data != null && data.statusCode != null && data.statusCode == 1) {
      this.common.hideSpinner();
      //this.common.showMessage('success', 'Design Data saved successfully.');
      this.common.showMessage('success', data.displayMessage);
      // this.CouponTransactionsLog();

      // this.clearForm();
    } else {
      setTimeout(() => {
        this.common.hideSpinner();
        this.common.showMessage('error', 'Failed to Save.');
      }, this.common.time_out_delay);
    }
  })

}
getSelectedOptionText(event: Event) {
  let selectElementText = event.target['options']
     [event.target['options'].selectedIndex].text;
     
     this.CouponCode=selectElementText;
                                    
}
}
