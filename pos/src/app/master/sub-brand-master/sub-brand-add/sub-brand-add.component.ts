import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MBrandMaster } from 'src/app/models/m-brand-master';
import { MSubBrandMaster } from 'src/app/models/m-sub-brand-master';
import { MUserDetails } from 'src/app/models/m-user-details';
import { Observable, observable} from 'rxjs';
import { map,startWith} from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-sub-brand-add',
  templateUrl: './sub-brand-add.component.html',
  styleUrls: ['./sub-brand-add.component.css']
})
export class SubBrandAddComponent implements OnInit {

  myForm: FormGroup;
  brandList: Array<MBrandMaster>;
  subBrandList:Array<MSubBrandMaster>;
  brandCode:string;
  brandName:string;
  disabled=false;
  user_details: MUserDetails = null;
  userid:number;
  changes_done : boolean;
  myControl = new FormControl();
  brandID:number;
  filteredOptions: Observable<MBrandMaster[]>;
  brandDropdownSettings: IDropdownSettings = {};
  selectedBrandList = [];
  closeDropdownSelection=false;
  
  constructor(
    private api: ApiService,
    private common: CommonService,
    private fb:FormBuilder,
    private confirm: ConfirmService,
    public router:Router
  ) {
    this.createForm();
   }
   createForm() {
    this.myForm = this.fb.group({
      subBrandCode: [''],
      subBrandName: [''],
      brandID: [''],
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
            this.brandDropdownSettings = {
              singleSelection: true,
              idField: 'id',
              textField: 'brandName',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              closeDropDownOnSelection: this.closeDropdownSelection
              
            };
            this.selectedBrandList = [];
           
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  ngOnInit(): void {
  
  }
 
  brandcode(item:any) {
    this.brandID=item.id;
    if (this.brandList != null && this.brandList.length > 0) {
      for (let brand of this.brandList) {
        if (brand.id == this.brandID) {
        this.brandCode = brand.brandCode;
         this.brandName = brand.brandName;
          break;
        }
      }
    }
  }
  addSubBrandList() {
    
    // this..get('myControl').disable();
    this.disabled=true;
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
          brandID: this.brandID,//this.myForm.get('brandID').value,
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
  /*addSubBrandList(){
    this.myForm.get('brandID').disable();
    let subcol_code = this.myForm.get('subBrandCode').value;
    let subcol_name = this.myForm.get('subBrandName').value;
    if(subcol_code!=null && subcol_code!='' && subcol_name!=null && subcol_name!='')
    {
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
  else
  {
    this.common.showMessage("warn", "Sub Brand Code & Sub Brand Name Empty");
  }
}*/

  void_item(item) {
    const idx = this.subBrandList.indexOf(item, 0);
    if (idx > -1) {
      this.subBrandList.splice(idx, 1);
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
  clear_controls(){   
    //this.myControl.enable();
    this.disabled=false;
    this.subBrandList = new Array<MSubBrandMaster>();
    this.myForm.controls['brandID'].setValue('');
    this.myForm.controls['subBrandCode'].setValue('');
    this.myForm.controls['subBrandName'].setValue('');
    this.myForm.controls['active'].setValue(true);
    }

    addSubBrand(){
      if (this.subBrandList.length==0) {
        this.common.showMessage("warn", "Can not Save, Sub Brand List is Empty.");
      }  else {
        this.common.showSpinner();
        this.api.postAPI("SubBrand", this.subBrandList).subscribe((data) => {
          //// .log(data);
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            this.common.showMessage('success', data.displayMessage);
            this.clear_controls();
            //this.router.navigate(['sub-brand']);
          } 
          else if(data != null && data.statusCode != null && data.statusCode == 0){
            this.common.hideSpinner();
            this.common.showMessage('', data.displayMessage);
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
  
    toggleCloseDropdownSelection() {
      this.closeDropdownSelection = !this.closeDropdownSelection;
      this.brandDropdownSettings = Object.assign({}, this.brandDropdownSettings,{closeDropDownOnSelection: this.closeDropdownSelection});
    }
}
