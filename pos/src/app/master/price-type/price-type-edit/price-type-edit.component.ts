import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MPriceTypeMaster } from 'src/app/models/m-price-type-master';

@Component({
  selector: 'app-price-type-edit',
  templateUrl: './price-type-edit.component.html',
  styleUrls: ['./price-type-edit.component.css']
})
export class PriceTypeEditComponent implements OnInit {
  myForm: FormGroup;
  priceType: MPriceTypeMaster;
  id: any;
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
      priceTypeCode: ['', Validators.required],
      priceTypeName: ['', Validators.required],
      remarks: [''],
      active: [false]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.priceType = new MPriceTypeMaster();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPriceTypeData();
  }
  getPriceTypeData() {
    this.common.showSpinner();
    this.api.getAPI("pricetype?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['priceTypeCode'].setValue(data.priceTypeMasterData.priceCode);
            this.myForm.controls['priceTypeName'].setValue(data.priceTypeMasterData.priceName);
            this.myForm.controls['remarks'].setValue(data.priceTypeMasterData.remarks);
            this.myForm.controls['active'].setValue(data.priceTypeMasterData.active);

            //.log(this.company_list);
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

  updatePriceTypes() {
    if (this.priceType == null) {
      this.common.showMessage("warn", "Can not Save, Price Type are invalid.");
    } else {
      this.priceType.id = this.id;
      this.priceType.priceCode = this.myForm.get('priceTypeCode').value;
      this.priceType.priceName = this.myForm.get('priceTypeName').value;
      this.priceType.remarks = this.myForm.get('remarks').value;
      this.priceType.active = this.myForm.get('active').value;
     // .log(this.priceType);
      this.common.showSpinner();
      this.api.putAPI("pricetype", this.priceType).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['price-type']);
        } else {
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
