import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MColorMaster } from 'src/app/models/m-color-master';
import { MUserDetails } from 'src/app/models/m-user-details';

@Component({
  selector: 'app-color-edit',
  templateUrl: './color-edit.component.html',
  styleUrls: ['./color-edit.component.css']
})
export class ColorEditComponent implements OnInit {

  myForm: FormGroup;
  color: MColorMaster;
  id : any;
  color_image:any;

  user_details: MUserDetails = null;
  userid:number;

  current_image: string = "assets/img/preview-image.png";
  temp_image: string = "assets/img/preview-image.png";

  constructor(
    private api:ApiService,
    private common:CommonService,
    private fb:FormBuilder,
    private confirm:ConfirmService,
    public router:Router ,
    private activatedRoute:ActivatedRoute
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
      attribute1: ['', Validators.required],
      attribute2: ['', Validators.required],
      remarks: [''],
      active:[false]
    });
    this.getStaticValues();
    this.clear_controls();
  }
  clear_controls(){
    this.color = new MColorMaster();
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getColor();
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
  getColor(){
    this.common.showSpinner();
    this.api.getAPI("color?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['colorCode'].setValue(data.colorRecord.colorCode);
            this.myForm.controls['description'].setValue(data.colorRecord.description);
            this.myForm.controls['shade'].setValue(data.colorRecord.shade);
            this.myForm.controls['nrfCode'].setValue(data.colorRecord.nrfCode);
            this.myForm.controls['colors'].setValue("#"+(data.colorRecord.colors).toString(16));
            this.myForm.controls['attribute1'].setValue(data.colorRecord.attribute1);
            this.myForm.controls['attribute2'].setValue(data.colorRecord.attribute2);
            this.myForm.controls['remarks'].setValue(data.colorRecord.remarks);
            this.myForm.controls['active'].setValue(data.colorRecord.active);
            this.color_image=data.colorRecord.multiColorImage;
            this.current_image = data.colorRecord.multiColorImage == null || data.colorRecord.multiColorImage == '' ? this.temp_image : 'data:image/gif;base64,' + data.colorRecord.multiColorImage;

            //.log(this.company_list);
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  updateColor(){
    if (this.color == null) {
      this.common.showMessage("warn", "Can not Save, Color Details are invalid.");
    }  else {
      this.color.id = this.id;
      this.color.colorCode = this.myForm.get('colorCode').value;
      this.color.description = this.myForm.get('description').value;
      this.color.shade = this.myForm.get('shade').value;
      this.color.nRFCode = this.myForm.get('nrfCode').value;
      let color_str=this.myForm.get('colors').value;
      color_str=color_str.substring(1);
      this.color.colors = parseInt(color_str, 16);
      //let check= '#'+this.color.colors.toString(16);
      this.color.attribute1 = this.myForm.get('attribute1').value;
      this.color.attribute2 = this.myForm.get('attribute2').value;
      this.color.multiColorImage=this.color_image;
      this.color.remarks = this.myForm.get('remarks').value;
      this.color.active = this.myForm.get('active').value;  
      this.color.updateBy=this.userid;

     // .log(this.color);
      this.common.showSpinner();
      this.api.putAPI("color", this.color).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['color']);
        } else {
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
}
