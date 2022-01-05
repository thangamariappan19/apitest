import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup,FormControl, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MBrandMaster } from 'src/app/models/m-brand-master';
import { MScaleDetails } from 'src/app/models/m-scale-details';
import { MScaleMaster } from 'src/app/models/m-scale-master';
import { MUserDetails } from 'src/app/models/m-user-details';


@Component({
  selector: 'app-scale-edit',
  templateUrl: './scale-edit.component.html',
  styleUrls: ['./scale-edit.component.css']
})
export class ScaleEditComponent implements OnInit {

  myForm: FormGroup;
  id: any;
  brandList: Array<MBrandMaster>;
  scaleDetails: Array<MScaleDetails>;
  scaleMaster: MScaleMaster;

  user_details: MUserDetails = null;
  userid:number;
  isReadonly: boolean;
  searchbrandCtrl= new FormControl();
  SearchValue:string;
  
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
      scaleCode: ['', Validators.required],
      scaleName: ['', Validators.required],
      active: [true],
      applyToAll: [false],
      sizeCode: [''],
      description: [''],
      visualOrder: [''],
      active1: [true]

    });
    this.getStaticValues();
    this.clear_controls();
    this.isReadonly = false;
  }
  clear_controls() {
    this.scaleDetails = new Array<MScaleDetails>();
    this.scaleMaster = new MScaleMaster;
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
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStateList();
  }
  getStateList() {
    this.common.showSpinner();
    this.api.getAPI("scale?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['scaleCode'].setValue(data.scaleRecord.scaleCode);
            this.myForm.controls['scaleName'].setValue(data.scaleRecord.scaleName);
            this.myForm.controls['active'].setValue(data.scaleRecord.active);
            this.myForm.controls['applyToAll'].setValue(data.scaleRecord.applytoAll);
            this.brandList = data.scaleRecord.brandMasterList;
            this.scaleDetails=data.scaleRecord.scaleDetailMasterList;

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

  addSubBrand() {
    if (this.scaleDetails == null && this.scaleDetails.length == 0) {
      this.common.showMessage("warn", "Can not Save, State Details are invalid.");
    }
    else if(this.brandList.filter(x=>x.active==true).length==0)
    {
      this.common.showMessage("warn", "Can not Save, Brand Details are invalid.");
    } 
    else {
      this.common.showSpinner();
      this.scaleMaster.id = this.id;
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
          this.router.navigate(['scale']);
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
  listClear()
  {
    // this.myForm.controls['scaleCode'].setValue('');
    this.myForm.controls['scaleName'].setValue('');
    this.myForm.controls['sizeCode'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['visualOrder'].setValue('');
    this.myForm.controls['active1'].setValue(true);
    this.scaleDetails = new Array<MScaleDetails>();
    for (let brand of this.brandList) {
      brand.active = false;
    }
  }

}
