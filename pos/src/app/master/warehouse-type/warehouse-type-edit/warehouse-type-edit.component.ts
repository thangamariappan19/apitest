import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MWarehouseType } from 'src/app/models/m-warehouse-type';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-warehouse-type-edit',
  templateUrl: './warehouse-type-edit.component.html',
  styleUrls: ['./warehouse-type-edit.component.css']
})
export class WarehouseTypeEditComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>;
  warehousetype: MWarehouseType;
  id: any;
  warehousetypeCode: string;
  warehousetypeName: string;


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
      warehouseTypeCode: ['', Validators.required],
      warehouseTypeName: ['', Validators.required],
      description: [''],
      remarks: [''],
      active: [false]
    });
    this.clear_controls();
  }
  clear_controls() {
    this.warehousetype = new MWarehouseType();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getwarehousetypeData();
  }

  getwarehousetypeData() {
    this.common.showSpinner();
    this.api.getAPI("warehousetype?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['warehouseTypeCode'].setValue(data.warehouseTypeMasterRecord.warehouseTypeCode);
            this.myForm.controls['warehouseTypeName'].setValue(data.warehouseTypeMasterRecord.warehouseTypeName);
            this.myForm.controls['description'].setValue(data.warehouseTypeMasterRecord.description);
            this.myForm.controls['remarks'].setValue(data.warehouseTypeMasterRecord.remarks);
            this.myForm.controls['active'].setValue(data.warehouseTypeMasterRecord.active);

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


  updatewarehousetype() {
    if (this.warehousetype == null) {
      this.common.showMessage("warn", "Can not Save, Warehouse-Type is invalid.");
    } else {
      this.warehousetype.id = this.id;
      this.warehousetype.warehouseTypeCode = this.myForm.get('warehouseTypeCode').value;
      this.warehousetype.warehouseTypeName = this.myForm.get('warehouseTypeName').value;
      this.warehousetype.remarks = this.myForm.get('remarks').value;
      this.warehousetype.description = this.myForm.get('description').value;
      this.warehousetype.active = this.myForm.get('active').value;

     // .log(this.warehousetype);
      this.common.showSpinner();
      this.api.putAPI("warehousetype", this.warehousetype).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['warehouse-type']);
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
        this.router.navigate(['warehouse-type']);
    }  
    } 
    else
    {
      this.router.navigate(['warehouse-type']);

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

