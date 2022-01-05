import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MLanguageMaster } from 'src/app/models/m-language-master';

@Component({
  selector: 'app-language-add',
  templateUrl: './language-add.component.html',
  styleUrls: ['./language-add.component.css']
})
export class LanguageAddComponent implements OnInit {
  myForm: FormGroup;
  language: MLanguageMaster;
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
      languageCode: ['', Validators.required],
      languageName: ['', Validators.required],
      remarks: [''],
      active:[true]
  
    });
    this.clear_controls();
    this.language = new MLanguageMaster();
  }
  clear_controls(){
    
    this.myForm.controls['languageCode'].setValue('');
    this.myForm.controls['languageName'].setValue('');
    this.myForm.controls['remarks'].setValue('');
    this.myForm.controls['active'].setValue(true);
  }
  ngOnInit() {
  }
  addLanguage(){
    if (this.language == null) {
      this.common.showMessage("warn", "Can not Save, Language Details are invalid.");
    }  else {
      this.language.id = 0;
      this.language.languageCode = this.myForm.get('languageCode').value;
      this.language.languageName = this.myForm.get('languageName').value;
      this.language.remarks = this.myForm.get('remarks').value;
      this.language.active = this.myForm.get('active').value;      
     // .log(this.language);
      this.common.showSpinner();
      this.api.postAPI("language", this.language).subscribe((data) => {
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


  close() {
    if(this.myForm.dirty){      
      if(confirm("Are You Sure You want to Close the Form Without Saving?")) {
        this.router.navigate(['language']);
    }  
    } 
    else
    {
      this.router.navigate(['language']);
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
