import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';
import { MBinLogDetails } from 'src/app/models/m-bin-log-details';

@Component({
  selector: 'app-stocktransfer',
  templateUrl: './stocktransfer.component.html',
  styleUrls: ['./stocktransfer.component.css']
})
export class StocktransferComponent implements OnInit {

  myForm: FormGroup;
  user_details: MUserDetails = null;
  binList:any;
  binDetailsList:Array<any>;
  saveBinList:Array<MBinLogDetails>;
  fromBinNoList:Array<any>;
  toBinNoList:Array<any>;
  userid: number;
  storeid: number;
  storecode: string;
  documenttypeid: number;
  businessdate: any;
  documentnumberinglist: Array<any>;
  totQTY:any;
 
  constructor(    
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      documentNo:[''],
      documentDate: [''],      
      fromBinNo:[''],
      toBiNo:[''],
      storeCode:[],
      scanItem:[''],
      group:[''],
      totQTY:[]
    });
    this.fromBinNoList = new Array<any>();
    this.toBinNoList = new Array<any>();
    this.binDetailsList = new Array<any>();
    this.saveBinList = new Array<MBinLogDetails>();
    this.getStaticValues();
    this.getDocumentNumber();
    this.getBinDetails();
    this.clear_controls();
    this.myForm.get('group').setValue('Bar Code');
  }
  clear_controls() {
    this.binDetailsList = new Array<any>();
    this.saveBinList = new Array<MBinLogDetails>(); 
    this.myForm.get('totQTY').setValue('');
    this.myForm.get('fromBinNo').setValue('');   
    this.myForm.get('toBiNo').setValue('');
    }

  ngOnInit(): void {
  }

  getStaticValues()
  {
    let temp_str: string = localStorage.getItem('user_details');
    if (temp_str != null) {
      this.user_details = JSON.parse(temp_str);
      this.userid=this.user_details.id;
      this.storeid=this.user_details.storeID;
      this.storecode=this.user_details.storeCode;
      this.documenttypeid=114;
      this.businessdate=this.common.toYMDFormat(new Date());
    }
  }
  getDocumentNumber() {
    this.getStaticValues();
    this.common.showSpinner();
    this.api.getAPI("documentnumbering?storeid=" + this.storeid + "&DocumentTypeID=" + this.documenttypeid + "&business_date=" + this.businessdate)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.documentnumberinglist = data.documentNumberingBillNoDetailsRecord;

            this.myForm.controls['documentNo'].setValue(data.documentNumberingBillNoDetailsRecord.prefix);
            this.myForm.controls['documentDate'].setValue(this.businessdate);
            this.myForm.controls['storeCode'].setValue(this.storecode);

          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
           
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  getBinDetails(){
    this.common.showSpinner();
    this.api.getAPI("BinLevelDetails?ID=" + this.storeid)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
           
            this.binList = data.binSubLevelList;

            this.binList = this.binList.filter(x => x.levelName == "BIN")

            for(let i=0;i<this.binList.length;i++)
            {
              let tempdata: any = { "binCode" : this.binList[i].autoGeneratedCode}
              this.fromBinNoList.push(tempdata);
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

  binCodeChange()
  {
    if(this.fromBinNoList.length>0)
    {
      this.toBinNoList = new Array<any>();
      for(let i=0;i<this.fromBinNoList.length;i++)
      {
        if(this.fromBinNoList[i].binCode != this.myForm.get('fromBinNo').value)
        {
          let tempdata: any = { "binCode" : this.fromBinNoList[i].binCode}
          this.toBinNoList.push(tempdata);
        }
      }
    }
  }
  void_item(item) {
    const idx = this.saveBinList.indexOf(item, 0);
    if (idx > -1) {
      this.saveBinList.splice(idx, 1);
      this.totQTY = this.saveBinList.length;
      this.myForm.get('totQTY').setValue( this.totQTY);
    }
  }
  getBinLogDetails(){
    if(this.myForm.get('fromBinNo').value == "" || this.myForm.get('fromBinNo').value == null ||
    this.myForm.get('toBiNo').value == "" || this.myForm.get('toBiNo').value == null ){
      this.common.showMessage('warn', "Please select From and To Bin");
    }
    else{
    this.common.showSpinner();
    this.api.getAPI("BinTransfer?SKUCode=" + this.myForm.get('scanItem').value + "&frombin=" + this.myForm.get('fromBinNo').value)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
           
            this.binDetailsList = data.binDetailsList;

            for(let i=0;i<this.binDetailsList.length;i++)
             {
               let tempdata: MBinLogDetails = {
                  id : this.binDetailsList[i].id,
                  barCode: this.binDetailsList[i].barCode,
                  sKUCode: this.binDetailsList[i].skuCode,
                  rFID :this.binDetailsList[i].rFID,
                  storeID: this.binDetailsList[i].storeID,
                  storeCode : this.binDetailsList[i].storeCode,
                  binID:this.binDetailsList[i].binID,
                  binCode:this.myForm.get('toBiNo').value,
                  binSubLevelCode:this.binDetailsList[i].binSubLevelCode,
                  quantity: this.binDetailsList[i].quantity,
                  createBy: this.user_details.id,
                  updateBy:this.user_details.id,
                  status:this.binDetailsList[i].status,
                  remarks:"StockReceipt",
                  active:true
                }
               this.saveBinList.push(tempdata);
             }

             this.totQTY = this.saveBinList.length;
             this.myForm.get('totQTY').setValue( this.totQTY);
             this.myForm.get('scanItem').setValue('');
             this.myForm.get('fromBinNo').setValue('');
             this.myForm.get('toBiNo').setValue('');
             
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
  }

  saveBinTransferDetails(){
      this.common.showSpinner();    
      this.api.putAPI("BinTransfer", this.saveBinList).subscribe((data) => {
        // .log(data);
         if (data != null && data.statusCode != null && data.statusCode == 1) {
           this.common.hideSpinner();
           this.common.showMessage('success', data.displayMessage);
           this.clear_controls();
           //this.router.navigate(['home']);
         } else {
           setTimeout(() => {
             this.common.hideSpinner();
             this.common.showMessage('error', 'Failed to Save.');
           }, this.common.time_out_delay);
         }
 
       });
  }
  close() {
    if (this.myForm.dirty) {
      if (confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['home']);
      }
    }
    else {
      this.router.navigate(['home']);
    }
  }
}
