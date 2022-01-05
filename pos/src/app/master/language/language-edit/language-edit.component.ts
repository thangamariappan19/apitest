import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MLanguageMaster } from 'src/app/models/m-language-master';

@Component({
  selector: 'app-language-edit',
  templateUrl: './language-edit.component.html',
  styleUrls: ['./language-edit.component.css']
})
export class LanguageEditComponent implements OnInit {
  myForm: FormGroup;
  language: MLanguageMaster;
  id: any;
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
      languageCode: ['', Validators.required],
      languageName: ['', Validators.required],
      remarks: [''],
      active: [false]

    });
    this.clear_controls();
  }
  clear_controls() {
    this.language = new MLanguageMaster();
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getLanguage();
  }
  getLanguage() {
    this.common.showSpinner();
    this.api.getAPI("language?ID=" + this.id)
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.myForm.controls['languageCode'].setValue(data.languageMasterRecord.languageCode);
            this.myForm.controls['languageName'].setValue(data.languageMasterRecord.languageName);
            this.myForm.controls['remarks'].setValue(data.languageMasterRecord.remarks);
            this.myForm.controls['active'].setValue(data.languageMasterRecord.active);
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

  updateLanguage() {
    if (this.language == null) {
      this.common.showMessage("warn", "Can not Save, Language Details are invalid.");
    } else {
      this.language.id = this.id;
      this.language.languageCode = this.myForm.get('languageCode').value;
      this.language.languageName = this.myForm.get('languageName').value;
      this.language.remarks = this.myForm.get('remarks').value;
      this.language.active = this.myForm.get('active').value;
     // .log(this.language);
      this.common.showSpinner();
      this.api.putAPI("language", this.language).subscribe((data) => {
        //// .log(data);
        if (data != null && data.statusCode != null && data.statusCode == 1) {
          this.common.hideSpinner();
          this.common.showMessage('success', data.displayMessage);
          this.router.navigate(['language']);
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
