import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { MBarcodeMaster } from 'src/app/models/m-barcode-master';
import { Router, ActivatedRoute } from '@angular/router';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-barcode-add',
  templateUrl: './barcode-add.component.html',
  styleUrls: ['./barcode-add.component.css']
})
export class BarcodeAddComponent implements OnInit {
  
  myForm: FormGroup;
  barcode: MBarcodeMaster;
  barcodeList: Array<MBarcodeMaster>;
  id: any;

  user_details: MUserDetails = null;
  userid:number;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb: FormBuilder,
    private confirm: ConfirmService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      startNumber: ['', Validators.required],
      endNumber: ['', Validators.required],
      numberOfDigit: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      runningNo: ['', Validators.required],
      active: [false]
    });
    
    this.getStaticValues();
    this.barcodeList = new Array<MBarcodeMaster>()
    //this.clear_controls();
  }
  clear_controls() {
    if(this.id!=null || this.id!=undefined)
    {}
    else{
    this.barcode = new MBarcodeMaster();
    this.myForm.controls['startNumber'].setValue('');
    this.myForm.controls['endNumber'].setValue('');
    //this.myForm.controls['numberOfDigit'].setValue('');
    this.myForm.controls['startDate'].setValue('');
    this.myForm.controls['endDate'].setValue('');
    this.myForm.controls['runningNo'].setValue('');
    this.myForm.controls['active'].setValue('');
    }
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
    return (k >= 48 && k <= 57);
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    //alert(this.id);
    //this.barcodeList = null;
    if(this.id!=null || this.id!=undefined)
    {
    this.common.showSpinner();
    this.api.getAPI("barcode?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            //this.id = data.barcodeSettingsList[0].id;
            this.myForm.controls['startNumber'].setValue(data.barcodeSettingsRecord.startNumber);
            this.myForm.controls['endNumber'].setValue(data.barcodeSettingsRecord.endNumber);
            this.myForm.controls['numberOfDigit'].setValue(data.barcodeSettingsRecord.numberOfDigit);
            this.myForm.controls['startDate'].setValue(this.common.toYMDFormat(new Date(data.barcodeSettingsRecord.startDate)));
            this.myForm.controls['endDate'].setValue(this.common.toYMDFormat(new Date(data.barcodeSettingsRecord.endDate)));
            this.myForm.controls['runningNo'].setValue(data.barcodeSettingsRecord.runningNo);
            this.myForm.controls['active'].setValue(data.barcodeSettingsRecord.active);

           // .log(this.barcodeList);
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
    else{
      this.myForm.controls['numberOfDigit'].setValue(13);
    }
  }
  addBarcode() {
    this.addBarcodeList();
    if (this.barcodeList == null) {
      this.common.showMessage("warn", "Can not Save, Barcode Details are invalid.");
    } else {
    
      var date1:any = new Date(this.myForm.get('startDate').value);
      var date2:any = new Date(this.myForm.get('endDate').value);
      var noofdays:any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
      let startnumber = this.myForm.get('startNumber').value;
      let endnumber = this.myForm.get('endNumber').value;
             
      if(startnumber.length<13) 
      {
        this.common.showMessage("warn", "Start Number should be 13 digits");
      }
      else if(endnumber.length<13) 
      {
        this.common.showMessage("warn", "End Number should be 13 digits");
      }
      else if(startnumber>endnumber) 
      {
        this.common.showMessage("warn", "Start Nunber should be less than End number");
      }
      else if(noofdays<0)
      {
        this.common.showMessage('error', 'Start date should be less than End date');
        this.myForm.controls['startDate'].setValue('');
        this.myForm.controls['endDate'].setValue('');
      } 
      else{  

      this.common.showSpinner();
      this.api.postAPI("barcode", this.barcodeList).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          //this.common.showMessage('success', 'Barcode saved successfully.');
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          this.router.navigate(['barcode']);
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
    }
  }
  addBarcodeList() {
    this.barcodeList=new Array<MBarcodeMaster>();
    let tempbarcode: MBarcodeMaster = {

      id: this.id,
      startNumber: this.myForm.get('startNumber').value,
      endNumber: this.myForm.get('endNumber').value,
      numberOfDigit: this.myForm.get('numberOfDigit').value,
      startDate: this.myForm.get('startDate').value,
      endDate: this.myForm.get('endDate').value,
      runningNo: this.myForm.get('runningNo').value,
      active: this.myForm.get('active').value,
      createBy:this.userid
    }
    this.barcodeList.push(tempbarcode);
    console.log(this.barcodeList);
  }
  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['barcode']);
          }  
        } 
      else
        {
          this.router.navigate(['barcode']);
        }
  }  
}
