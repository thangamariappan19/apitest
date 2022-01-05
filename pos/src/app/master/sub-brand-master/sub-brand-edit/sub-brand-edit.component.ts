import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MBrandMaster } from 'src/app/models/m-brand-master';
import { MSubBrandMaster } from 'src/app/models/m-sub-brand-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-sub-brand-edit',
  templateUrl: './sub-brand-edit.component.html',
  styleUrls: ['./sub-brand-edit.component.css']
})
export class SubBrandEditComponent implements OnInit {

  myForm: FormGroup;
  brandList: Array<MBrandMaster>;
  subBrandList:Array<MSubBrandMaster>;
  id:any;

  user_details: MUserDetails = null;
  userid:number;

  brandName:string;
  changes_done:boolean;

  constructor(
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router ,
    private activatedRoute:ActivatedRoute
  ) { this.createForm();
  }
  createForm() {
   this.myForm = this.fb.group({
     subBrandCode: [''],
     subBrandName: [''],
     brandID: ['', Validators.required],
     active:[true]  
   });
   this.getStaticValues();
   this.subBrandList = new Array<MSubBrandMaster>();
   this.getCollection();
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
 getCollection(){
   this.brandList = null;
   this.common.showSpinner();
   this.api.getAPI("BrandLookUP")
     .subscribe((data) => {
       setTimeout(() => {
         if (data != null && data.statusCode != null && data.statusCode == 1) {         
           this.brandList = data.brandList;
           this.brandList = this.brandList.filter(x => x.active==true);
           //// .log(this.countryList);
         } else {
           this.common.showMessage('warn', 'Failed to retrieve Data.');
         }
         this.common.hideSpinner();
       }, this.common.time_out_delay);
     });
 }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSubBrandDate();
  }

  getSubBrandDate(){
    this.common.showSpinner();
    this.api.getAPI("subbrand?brandid=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['brandID'].setValue(data.subBrandList[0].brandID);            
            this.subBrandList = data.subBrandList;
            this.brandName=data.subBrandList[0].brandName;
           // .log(this.subBrandList);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

//   addSubBrandList(){
//     this.myForm.get('brandID').disable();
//     let subcol_code = this.myForm.get('subBrandCode').value;
//     let subcol_name = this.myForm.get('subBrandName').value;
//     if(subcol_code!=null && subcol_code!='' && subcol_name!=null && subcol_name!='')
//     {
//     let tempSubCollection:MSubBrandMaster = {
//       id:0,
//       subBrandCode:this.myForm.get('subBrandCode').value,
//       subBrandName:this.myForm.get('subBrandName').value,
//       brandID:this.myForm.get('brandID').value,
//       brandName:this.brandName,
//       active:this.myForm.get('active').value,
//       createBy:this.userid
//     }
      
//     this.subBrandList.push(tempSubCollection);   
//     this.myForm.controls['subBrandCode'].setValue('');
//     this.myForm.controls['subBrandName'].setValue('');
//     this.myForm.controls['active'].setValue(true);    
//   }
//   else
//   {
//     this.common.showMessage("warn", "Sub Brand Code & Sub Brand Name Empty");
//   }
// }
addSubBrandList() {
  this.myForm.get('brandID').disable();
  let subbrand_code = this.myForm.get('subBrandCode').value;
  let subbrand_name = this.myForm.get('subBrandName').value;
  if (subbrand_code == null || subbrand_code == "") {
    this.common.showMessage("warn", "Sub Brand Code is Empty");
  } else if (subbrand_code.length != 4) {
    this.common.showMessage("warn", "Sub Brand Code must contain 4 digits exactly");
  } else if (subbrand_name == null || subbrand_name == "") {
    this.common.showMessage("warn", "Sub Brand Name is Empty");
  } else {
    this.changes_done = true;
    let exists = this.subBrandList.filter(x => x.subBrandCode.toLowerCase() == subbrand_code.toLowerCase());
    if (exists != null && exists.length > 0) {
      this.common.showMessage("warn", "Sub Brand Code already exists.");
    } else {
      let tempSubCollection:MSubBrandMaster = {
        id:0,
        subBrandCode:this.myForm.get('subBrandCode').value,
        subBrandName:this.myForm.get('subBrandName').value,
        brandID:this.myForm.get('brandID').value,
        brandName:this.brandName,
        active:this.myForm.get('active').value,
        createBy:this.userid
      }
        
      this.subBrandList.push(tempSubCollection);   
      this.myForm.controls['subBrandCode'].setValue('');
      this.myForm.controls['subBrandName'].setValue('');
      this.myForm.controls['active'].setValue(true);
    }
  }

}
subBrand_code_changed(item) {
  this.changes_done = true;
  if (item.subBrandCode != null && item.subBrandCode != "") {
    if (item.subBrandCode.length != 4) {
      item.subBrandCode = "";
      this.common.showMessage("warn", "Sub Brand Code must contain 4 digits exactly");
    } else {
      const idx = this.subBrandList.indexOf(item, 0);
      if (idx > -1) {
        for (let subItem of this.subBrandList) {
          let idx1 = this.subBrandList.indexOf(subItem, 0);
          if (item.subBrandCode.toLowerCase() == subItem.subBrandCode.toLowerCase() && idx != idx1) {
            item.subBrandCode = "";
            this.common.showMessage("warn", "Sub Collection Code already exists.");
          }
        }
      }
    }
  }

}
  void_item(item) {
    const idx = this.subBrandList.indexOf(item, 0);
    if (idx > -1) {
      this.subBrandList.splice(idx, 1);
    }
  }
 
  clear_controls(){   
    // this.myForm.get('brandID').enable();
    // this.subBrandList = new Array<MSubBrandMaster>();
    // this.myForm.controls['brandID'].setValue('');
    this.myForm.controls['subBrandCode'].setValue('');
    this.myForm.controls['subBrandName'].setValue('');
    this.myForm.controls['active'].setValue(true);
    }

    updateSubBrand(){
      let invalid = this.subBrandList.filter(x => x.subBrandCode == null || x.subBrandCode == ""
      || x.subBrandName == null || x.subBrandName == "");

    if (this.subBrandList.length == 0) {
      this.common.showMessage("warn", "Can not Save, Sub Brand List is Empty.");
    } else if (invalid != null && invalid.length > 0) {
      this.common.showMessage("warn", "Can not Save, one or more Sub Brand item(s) is invalid.");
    } 
     else {
        this.common.showSpinner();
        this.api.postAPI("SubBrand", this.subBrandList).subscribe((data) => {
          //// .log(data);
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            this.common.showMessage('success', data.displayMessage);
            this.clear_controls();
            this.router.navigate(['sub-brand']);
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
          this.router.navigate(['sub-brand']);
            }  
          } 
        else
          {
            this.router.navigate(['sub-brand']);
          }
    }

}
