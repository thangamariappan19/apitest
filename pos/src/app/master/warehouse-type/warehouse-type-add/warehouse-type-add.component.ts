import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MWarehouseType } from 'src/app/models/m-warehouse-type';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse-type-add',
  templateUrl: './warehouse-type-add.component.html',
  styleUrls: ['./warehouse-type-add.component.css']
})
export class WarehouseTypeAddComponent implements OnInit {

  myForm: FormGroup;
  json: Array<any>; 
  warehousetype: MWarehouseType;

  
  constructor( 
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router
  ) { this.createForm();} 

  createForm() {
    this.myForm = this.fb.group({    
      warehouseTypeCode: ['',Validators.required],
      warehouseTypeName: ['',Validators.required], 
      remarks:[''],    
      description:[''],
      active:[false]
  });
  this.warehousetype = new MWarehouseType(); 
  this.clear_controls();
}
  clear_controls() { 
   
    this.myForm.controls['warehouseTypeCode'].setValue('');
    this.myForm.controls['warehouseTypeName'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  ngOnInit() {
  }


  quickadd_warehousetype(){
    if (this.warehousetype == null) {
      this.common.showMessage("warn", "Can not Save, Warehouse-Type Data is invalid.");
    }  else {
      this.warehousetype.id = 0;
      this.warehousetype.warehouseTypeCode = this.myForm.get('warehouseTypeCode').value;
      this.warehousetype.warehouseTypeName = this.myForm.get('warehouseTypeName').value; 
      this.warehousetype.description = this.myForm.get('description').value;
      this.warehousetype.remarks = this.myForm.get('remarks').value;
      this.warehousetype.active= this.myForm.get('active').value;
   
     // .log(this.warehousetype);
      this.common.showSpinner();
      this.api.postAPI("warehousetype", this.warehousetype).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
        } else {
          setTimeout(() => {
            this.common.hideSpinner();
            this.common.showMessage('error', 'Failed to Save.');
          }, this.common.time_out_delay);
        }

      });
    }
  }

  close(){
    
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
