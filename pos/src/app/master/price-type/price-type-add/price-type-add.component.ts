import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MPriceTypeMaster } from 'src/app/models/m-price-type-master';

@Component({
  selector: 'app-price-type-add',
  templateUrl: './price-type-add.component.html',
  styleUrls: ['./price-type-add.component.css']
})
export class PriceTypeAddComponent implements OnInit {
  myForm: FormGroup;
  priceType: MPriceTypeMaster;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb:FormBuilder,
    private confirm: ConfirmService,
    public router:Router
  ) {this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      priceTypeCode: ['', Validators.required],
      priceTypeName: ['', Validators.required],
      remarks: [''],
      active:[true]
  
    });
    this.clear_controls();
  }
  clear_controls(){
    this.priceType = new MPriceTypeMaster();
    this.myForm.controls['priceTypeCode'].setValue('');
    this.myForm.controls['priceTypeName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }

  ngOnInit() {
  }
  addPriceTypes(){
    if (this.priceType == null) {
      this.common.showMessage("warn", "Can not Save, Price Type are invalid.");
    }  else {
      this.priceType.id = 0;
      this.priceType.priceCode = this.myForm.get('priceTypeCode').value;
      this.priceType.priceName = this.myForm.get('priceTypeName').value;      
      this.priceType.remarks = this.myForm.get('remarks').value;
      this.priceType.active = this.myForm.get('active').value;      
     // .log(this.priceType);
      this.common.showSpinner();
      this.api.postAPI("pricetype", this.priceType).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success',data.displayMessage);
          this.clear_controls();
        } else if(data.statusCode == 13)
        {
          this.common.hideSpinner();
          this.common.showMessage('warn', 'Price Type Already Exist.');
        }
        else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }
 
  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['price-type']);
    }  
    } 
    else
    {
      this.router.navigate(['price-type']);
  }
    }
  restrictSpecialChars(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) 
      || (k > 96 && k < 123) 
      || k == 8 
      || k == 32 
      // || k == 45 
      // || k == 47
      // || k == 95
      || (k >= 48 && k <= 57));
  }
}
