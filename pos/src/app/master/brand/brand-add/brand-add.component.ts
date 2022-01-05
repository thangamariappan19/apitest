import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MBrandMaster } from 'src/app/models/m-brand-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.css']
})
export class BrandAddComponent implements OnInit {

  myForm: FormGroup;
  brand: MBrandMaster;
  brand_Image: any;
  image: any;

  user_details: MUserDetails = null;
  userid:number;
  @ViewChild('fileInput')
  myFileInput: ElementRef;
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
      brandCode: ['', Validators.required],
      brandName: ['', Validators.required],
      shortBrandName: [''],
      arabicName: [''],
      brandTypeID: ['',Validators.required],
      remarks: [''],
      active:[true],
      fileInput:['']
    });
    this.getStaticValues();
    this.clear_controls();
    
  }
  clear_controls() {
    this.brand = new MBrandMaster();
    this.myForm.controls['brandCode'].setValue('');
    this.myForm.controls['brandName'].setValue('');
    this.myForm.controls['shortBrandName'].setValue('');
    this.myForm.controls['arabicName'].setValue('');
    this.myForm.controls['brandTypeID'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
    if(this.brand_Image!=null)
    {
      this.myFileInput.nativeElement.value = '';
      this.image=null;
      }
  }
  ngOnInit() {
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
  public picked(event, field) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.brand_Image = file;
      this.handleInputChange(file); //turn into base64

    }
    else {
      alert("No file selected");
    }
  }
  handleInputChange(files) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    //this.imageSrc = base64result;
    this.brand_Image = base64result;
    this.image="data:image/png;base64"+","+base64result;
  }
  delImage()
  {
    if(this.brand_Image!=null)
    {
      this.myFileInput.nativeElement.value = '';
      this.brand_Image=null;
      this.image=null;
    }
  }
  addBrand() {
    if (this.brand == null) {
      this.common.showMessage("warn", "Can not Save, Invoice is invalid.");
    } else {
      this.brand.id = 0;
      this.brand.brandCode = this.myForm.get('brandCode').value;
      this.brand.brandName = this.myForm.get('brandName').value;
      this.brand.shortDescriptionName = this.myForm.get('shortBrandName').value;
      this.brand.arbName =this.myForm.get('arabicName').value;
      this.brand.brandType = this.myForm.get('brandTypeID').value;
      this.brand.remarks = this.myForm.get('remarks').value;
      this.brand.active = this.myForm.get('active').value;
      this.brand.brandLogo = this.brand_Image;
      this.brand.createBy = this.userid;
      

      this.common.showSpinner();
      this.api.postAPI("brand", this.brand).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          //this.router.navigate(['brand']);
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
        this.router.navigate(['brand']);
          }  
        } 
      else
        {
          this.router.navigate(['brand']);
        }
  }
}
