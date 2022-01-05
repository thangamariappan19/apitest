import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MColorMaster } from 'src/app/models/m-color-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-color-add',
  templateUrl: './color-add.component.html',
  styleUrls: ['./color-add.component.css']
})
export class ColorAddComponent implements OnInit {

  myForm: FormGroup;
  color: MColorMaster;
  color_image:any;
  image: any;

  user_details: MUserDetails = null;
  userid:number;
  @ViewChild('fileInput')
  myFileInput: ElementRef;
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
      colorCode: ['', Validators.required],
      description: ['', Validators.required],
      shade: ['', Validators.required],
      nrfCode: ['', Validators.required],
      colors: ['', Validators.required],
      attribute1: [''],
      attribute2: [''],
      remarks: [''],
      active:[false],
      fileInput:['']
  
    });
    this.getStaticValues();
    this.clear_controls();
  }
  clear_controls(){
    this.color = new MColorMaster();
    this.myForm.controls['colorCode'].setValue('');
    this.myForm.controls['description'].setValue('');
    this.myForm.controls['shade'].setValue('');
    this.myForm.controls['nrfCode'].setValue('');
    this.myForm.controls['colors'].setValue('');
    this.myForm.controls['attribute1'].setValue('');
    this.myForm.controls['attribute2'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
    if(this.color_image!=null)
    {
      this.myFileInput.nativeElement.value = '';
      this.image=null;

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
    return ((k > 64 && k < 91)
      || (k > 96 && k < 123)
      || k == 8
      || k == 32
      || (k >= 48 && k <= 57));
  }
  ngOnInit() {
  }

  addColor(){
    if (this.color == null) {
      this.common.showMessage("warn", "Can not Save, Division Details are invalid.");
    }  else {
      this.color.id = 0;
      this.color.colorCode = this.myForm.get('colorCode').value;
      this.color.description = this.myForm.get('description').value;
      this.color.shade = this.myForm.get('shade').value;
      this.color.nRFCode = this.myForm.get('nrfCode').value;
      let color_str=this.myForm.get('colors').value;
      color_str=color_str.substring(1);
      this.color.colors = parseInt(color_str, 16);
      //this.color.colors = this.myForm.get('colors').value;
      this.color.attribute1 = this.myForm.get('attribute1').value;
      this.color.attribute2 = this.myForm.get('attribute2').value;
      this.color.multiColorImage=this.color_image;
      this.color.remarks = this.myForm.get('remarks').value;
      this.color.active = this.myForm.get('active').value;  
      this.color.createBy=this.userid;    
     // .log(this.color);
      this.common.showSpinner();
      this.api.postAPI("color", this.color).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.clear_controls();
          this.router.navigate(['color']);
        } 
        else if(data != null && data.statusCode != null && data.statusCode == 2){
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
  public picked(event, field) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.color_image = file;
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
    this.color_image = base64result;
    this.image="data:image/png;base64"+","+base64result;
  }

  delImage()
  {
    if(this.color_image!=null)
    {
      this.myFileInput.nativeElement.value = '';
      this.color_image=null;
       this.image=null;
    }
  }
  close(){
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['color']);
          }  
        } 
      else
        {
          this.router.navigate(['color']);
        }
  }
  validateCode(){
    let code=this.myForm.get('colorCode').value;
    if(code.length <3)
    {
      this.common.showMessage("warn", "Color Code Must be in 3 Character.");
    }
  }
}
