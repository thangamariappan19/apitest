import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MBrandMaster } from 'src/app/models/m-brand-master';
import { MScaleDetails } from 'src/app/models/m-scale-details';
import { MScaleMaster } from 'src/app/models/m-scale-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-scale-add',
  templateUrl: './scale-add.component.html',
  styleUrls: ['./scale-add.component.css']
})
export class ScaleAddComponent implements OnInit {

  myForm: FormGroup;
  brandList: Array<MBrandMaster>;
  scaleDetails: Array<MScaleDetails>;
  scaleMaster: MScaleMaster;
  isReadonly: boolean;
  user_details: MUserDetails = null;
  userid:number;
  SearchValue:string='';
  
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
      scaleCode: ['', Validators.required],
      scaleName: ['', Validators.required],
      active: [true],
      applyToAll: [false],
      sizeCode: [''],
      description: [''],
      visualOrder: [''],
      active1: [true],
      
    });
   
    this.getStaticValues();
    this.scaleDetails = new Array<MScaleDetails>();
    this.scaleMaster = new MScaleMaster;
    this.getBrand();
    this.isReadonly = false;
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
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      || (k >= 48 && k <= 57));
  }
  getBrand() {
    this.brandList = null;
    this.common.showSpinner();
    this.api.getAPI("brand")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.brandList = data.responseDynamicData;
            this.brandList = this.brandList.filter(x => x.active == true);
            for (let brand of this.brandList) {
              brand.active = false;
            }
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }
  ngOnInit(): void {
  }
  addSubBrandList() {
    let allow:boolean=true;
    let alloworder:boolean=true;
    let sizecode = this.myForm.get('sizeCode').value;
    let visualorder = this.myForm.get('visualOrder').value;
    for(let size of this.scaleDetails)
    {
      if(size.sizeCode==sizecode)
      {
        allow=false;
        break;
      }
      else{
        allow=true;
      }
    }
    for(let size of this.scaleDetails)
    {
      if(size.visualOrder==visualorder)
      {
        alloworder=false;
        break;
      }
      else{
        alloworder=true;
      }
    }
    if(sizecode!="" && visualorder!="")
    {
      if(allow==true){
        if(alloworder==true)
        {
    let tempsizeCode: MScaleDetails = {
      id: 0,
      sizeCode: this.myForm.get('sizeCode').value,
      description: this.myForm.get('description').value,
      visualOrder: this.myForm.get('visualOrder').value,
      active: this.myForm.get('active1').value
    }

    this.scaleDetails.push(tempsizeCode);
    this.myForm.controls['sizeCode'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['visualOrder'].setValue('');
  }
  else
  {
    this.common.showMessage("warn", "Visual Order Already Exist.");
  }
  }
  else
  {
    this.common.showMessage("warn", "Size Code Already Exist.");
  }
  }
  else
  {
    this.common.showMessage("warn", "Size Code or Visual Order is Empty.");
  }
  }

  void_item(item) {
    const idx = this.scaleDetails.indexOf(item, 0);
    if (idx > -1) {
      this.scaleDetails.splice(idx, 1);
    }
  }

  clear_controls() {
    this.scaleDetails = new Array<MScaleDetails>();
    this.myForm.controls['scaleCode'].setValue('');
    this.myForm.controls['scaleName'].setValue('');
    this.myForm.controls['applyToAll'].setValue(false);
    this.myForm.controls['active'].setValue(true);
    this.myForm.controls['sizeCode'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['visualOrder'].setValue('');
    this.myForm.controls['active1'].setValue(true);
    this.scaleDetails = new Array<MScaleDetails>();
    for (let brand of this.brandList) {
      brand.active = false;
    }
  }

  listClear()
  {
    this.myForm.controls['sizeCode'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['visualOrder'].setValue('');
    this.myForm.controls['active1'].setValue(true);
    this.scaleDetails = new Array<MScaleDetails>();
    for (let brand of this.brandList) {
      brand.active = false;
    }
  }

  addSubBrand() {
    if (this.scaleDetails == null || this.scaleDetails.length == 0) {
      this.common.showMessage("warn", "Can not Save, Scale Details are invalid.");
    }
    else if(this.brandList.filter(x=>x.active==true).length==0)
    {
      this.common.showMessage("warn", "Can not Save, Brand Details are invalid.");
    }
     else {
      this.common.showSpinner();
      this.scaleMaster.id = 0;
      this.scaleMaster.scaleCode = this.myForm.get('scaleCode').value;
      this.scaleMaster.scaleName = this.myForm.get('scaleName').value;
      this.scaleMaster.active = this.myForm.get('active').value;
      this.scaleMaster.applytoAll = this.myForm.get('applyToAll').value;
      this.scaleMaster.scaleDetailMasterList = this.scaleDetails;
      this.scaleMaster.brandMasterList = this.brandList;
      this.scaleMaster.createBy = this.userid;
      
      this.api.postAPI("scale", this.scaleMaster).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['scale']);
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
        this.router.navigate(['scale']);
          }  
        } 
      else
        {
          this.router.navigate(['scale']);
        }
  }

  eventCheck() {
    let isselect = this.myForm.get('applyToAll').value;
    if (isselect == true) {
      this.isReadonly = !this.isReadonly;
      for (let brand of this.brandList) {
        brand.active = true;
       
      }
    }
    else {
      this.isReadonly = false;
      for (let brand of this.brandList) {
        brand.active = false;
       
      }
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  prioritynochange(item) {
    if(this.scaleDetails != null && this.scaleDetails.length > 0){
      if(item.sizeCode != null && item.sizeCode.toString() != ""){
        let filter_item = this.scaleDetails.filter(x=>x.sizeCode == item.sizeCode && x.description != item.description);
        if(filter_item != null && filter_item.length > 0){
          item.sizeCode = null;
          this.common.showMessage("warn","Size Code already exists");
        }
      }
    }
  }
  visualOrderchange(item) {
    if(this.scaleDetails != null && this.scaleDetails.length > 0){
      if(item.visualOrder != null && item.visualOrder.toString() != ""){
        let filter_item = this.scaleDetails.filter(x=>x.visualOrder == item.visualOrder && x.description != item.description);
        if(filter_item != null && filter_item.length > 0){
          item.visualOrder = null;
          this.common.showMessage("warn","Visual Order already exists");
        }
      }
    }
  }
}
