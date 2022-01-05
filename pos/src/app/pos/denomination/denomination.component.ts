import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MPaymentType } from 'src/app/models/m-payment-type';
import { MCurrencyDetails } from 'src/app/models/m-currency-details';
import { MDenominationForShiftOutType,MDenominationData,MDenominationForShiftoutTypeHeader } from 'src/app/models/m-denomination-for-shift-out-type';
import { MDayClosing } from 'src/app/models/m-day-closing';

@Component({
  selector: 'app-denomination',
  templateUrl: './denomination.component.html',
  styleUrls: ['./denomination.component.css']
})
export class DenominationComponent implements OnInit {
  myForm: FormGroup;
  user_details: MUserDetails = null;
  mcurrencyDetailsList:Array<MCurrencyDetails>;
  mpaymentType:MPaymentType;
  mpaymentTypeList:Array<MPaymentType>;
  objCashInCashOutDetailsList:Array<MDenominationForShiftOutType>;
  objCardDetailsList:Array<MPaymentType>;
  ShowEditable :boolean=false;
  editField: number;
  sumofTotalvalue:any;
  sumofpaymemtValue:any;
  CurrencyValue:number;
  sumofCardpaymemtValue:any;
  logedpos_details: MDayClosing = null;
  
  constructor( private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router) {  
      localStorage.setItem('pos_mode', 'true');
      let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);

    }
    let temp_pos: string = localStorage.getItem('pos_details');
    if (temp_pos != null) {
      this.logedpos_details = JSON.parse(temp_pos);
    }
    this.createForm();
   
  }
  createForm() {
    this.myForm = this.fb.group({
    
      remarks:[]
  
    });
    this.mcurrencyDetailsList=new Array<any>();
    this.mpaymentType=new MPaymentType();
    this.mpaymentTypeList=new Array<MPaymentType>();
    this.GetPaymentTypeList();
    this.GetCashList();
    this.sumofpaymemtValue=0;
    this.sumofTotalvalue=0;
    this.sumofCardpaymemtValue=0;
  }
  ngOnInit(): void {
  }
  GetPaymentTypeList()
  {
    this.common.showSpinner();
    this.api.getAPI("Denomination?CountyID=" + this.user_details.countryID)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            // this.mpaymentType=data.paymentTypeCountryRecord;
            this.mpaymentTypeList=data.paymentDetailsList;
           this.objCardDetailsList = new Array<MPaymentType>();
            for (var objCashInCashOutDetails of this.mpaymentTypeList)
            {
                var TempCashInCashOutDetails = new MPaymentType();
                TempCashInCashOutDetails.id = 0;
                TempCashInCashOutDetails.paymentCode = objCashInCashOutDetails.paymentCode;
                TempCashInCashOutDetails.paymentName = objCashInCashOutDetails.paymentName;
                TempCashInCashOutDetails.paymemtValue = 0;
                this.objCardDetailsList.push(TempCashInCashOutDetails);
            }

            
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
  GetCashList()
  {
    this.common.showSpinner();
    this.api.getAPI("Denomination?PayCurrencyCode=" + this.user_details.currencyCode)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
             this.mcurrencyDetailsList=data.currencyDetailsList;
             this.objCashInCashOutDetailsList = new Array<MDenominationForShiftOutType>();
             for(var objCashInCashOutDetails of this.mcurrencyDetailsList)
             {
                 
                 var TempCashInCashOutDetails = new MDenominationForShiftOutType();
                 TempCashInCashOutDetails.id = 0;
                 TempCashInCashOutDetails.currencyCode = objCashInCashOutDetails.currencyCode;
                 TempCashInCashOutDetails.currencyValue = objCashInCashOutDetails.currencyValue;
                 TempCashInCashOutDetails.paymemtValue = 0;
                 TempCashInCashOutDetails.totalValue = 0;
                 this.objCashInCashOutDetailsList.push(TempCashInCashOutDetails);
             }
            
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
  updateList(id: number, property: string, event: any) {
    if(property=='totalValue')
    {
    const editField = parseFloat(event.target.textContent);
    var y: number = editField;
    this.objCashInCashOutDetailsList[id][property] = editField;
    this.sumofTotalvalue=this.objCashInCashOutDetailsList.reduce((sum,p) => sum + (p.totalValue),0).toFixed(2);
    }
    else if(property=='paymemtValue')
    {
      const editField = parseFloat(event.target.textContent);
      var y: number = editField;
      this.objCashInCashOutDetailsList[id][property] = editField;
      this.CurrencyValue=this.objCashInCashOutDetailsList[id]['currencyValue'];
      this.objCashInCashOutDetailsList[id]['totalValue']=this.CurrencyValue * editField;
      this.sumofpaymemtValue=this.objCashInCashOutDetailsList.reduce((sum,p) => sum + (p.paymemtValue),0).toFixed(2);
      this.sumofTotalvalue=this.objCashInCashOutDetailsList.reduce((sum,p) => sum + (p.totalValue),0).toFixed(2);
    }
  }

  changeValue(id: number, property: string, event: any) 
  {
    this.editField = event.target.textContent;
  }
  updateList1(id: number, property: string, event: any)
  {
  const editField = parseFloat(event.target.textContent);
  this.objCardDetailsList[id][property] = editField;
  this.sumofCardpaymemtValue=this.objCardDetailsList.reduce((sum,p) => sum + (p.paymemtValue),0).toFixed(2);
  }
  changeValue1(id: number, property: string, event: any) 
  {
   
    this.editField = event.target.textContent;
  }
  Savedenomination()
  {
    var mdenominationdata=new MDenominationData();
    mdenominationdata.paymentTypeMasterTypeList=new Array<MPaymentType>();
    mdenominationdata.paymentTypeMasterTypeList= this.objCardDetailsList;
    mdenominationdata.denominationForShiftOutTypeList=new Array<MDenominationForShiftOutType>();
    mdenominationdata.denominationForShiftOutTypeList=this.objCashInCashOutDetailsList;
    mdenominationdata.denominationForShiftoutTypeHeader=new MDenominationForShiftoutTypeHeader();
    mdenominationdata.denominationForShiftoutTypeHeader.id=0;
    mdenominationdata.denominationForShiftoutTypeHeader.posCode=this.logedpos_details.posCode;
    mdenominationdata.denominationForShiftoutTypeHeader.storeCode=this.user_details.storeCode;
    mdenominationdata.denominationForShiftoutTypeHeader.shifLogId=this.logedpos_details.shiftInUserID;
    mdenominationdata.denominationForShiftoutTypeHeader.shiftCode=this.logedpos_details.shiftCode;
    mdenominationdata.denominationForShiftoutTypeHeader.shiftInAmount=0;
    mdenominationdata.denominationForShiftoutTypeHeader.shiftOutAmount=0;
    mdenominationdata.denominationForShiftoutTypeHeader.remarks=this.myForm.get('remarks').value;
    mdenominationdata.denominationForShiftoutTypeHeader.totalCardValue=this.sumofCardpaymemtValue;
    mdenominationdata.denominationForShiftoutTypeHeader.totalValueCount=this.sumofpaymemtValue;
    mdenominationdata.denominationForShiftoutTypeHeader.grandTotalValue=this.sumofTotalvalue;
    this.common.showSpinner();
    this.api.postAPI("Denomination", mdenominationdata).subscribe((data) => {
     if (data != null && data.statusCode != null && data.statusCode == 1) {
       this.common.hideSpinner();
       this.common.showMessage('success', data.displayMessage);
       this.createForm();
      
     } 
     else {
       setTimeout(() => {
         this.common.hideSpinner();
         this.common.showMessage('error', 'Failed to Save.');
       }, this.common.time_out_delay);
     }
   })



  }
}
