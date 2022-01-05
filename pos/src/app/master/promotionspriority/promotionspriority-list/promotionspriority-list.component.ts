import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from 'src/app/confirm/confirm.service';
import { Router } from '@angular/router';
import { MPromotionspriorityMaster } from 'src/app/models/m-promotionspriority-master';

@Component({
  selector: 'app-promotionspriority-list',
  templateUrl: './promotionspriority-list.component.html',
  styleUrls: ['./promotionspriority-list.component.css']
})
export class PromotionspriorityListComponent implements OnInit {
  json: Array<any>;
  promotionspriority_List: Array<MPromotionspriorityMaster>;
  id: any;
  priorityNo:any;

  myForm: FormGroup;
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

    });
    this.getpromotionspriorityList();
    this.clear_controls();
  }

  clear_controls() {

  }

  getpromotionspriorityList() {
    this.promotionspriority_List = null;
    this.common.showSpinner();
    this.api.getAPI("promotionspriority")
      .subscribe((data) => {
        setTimeout(() => {
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.promotionspriority_List = data.promotionsList;
          } else {
            this.common.showMessage('warn', 'Failed to retrieve Data.');
          }
          this.common.hideSpinner();
        }, this.common.time_out_delay);
      });
  }

  UpdatepromotionspriorityList() {
    {
      let allow:boolean=true;
      for(let numb of this.promotionspriority_List)
      {
        if(numb.priorityNo.toString()== "")
        {
          allow=false;
          break;
        }
        else{
          allow=true;
        }
      }
      if(allow==true){
      if (this.promotionspriority_List == null && this.promotionspriority_List.length == 0 ) {
        this.common.showMessage("warn", "Can not Save, Promotions Priority Details are invalid.");
      } else {
        // .log(this.promotionspriority_List);
        this.common.showSpinner();
        this.api.postAPI("promotionspriority", this.promotionspriority_List).subscribe((data) => {
          //// .log(data);
          if (data != null && data.statusCode != null && data.statusCode == 1) {
            this.common.hideSpinner();
            this.getpromotionspriorityList();
            this.common.showMessage('success', data.displayMessage);
          } else {
            setTimeout(() => {
              this.common.hideSpinner();
              this.common.showMessage('error', 'Failed to Save.');
            }, this.common.time_out_delay);
          }

        });
      }
      }else{
        this.common.showMessage("warn", "Can not Save, Promotions Priority Number Should not be Empty.");
      }
    }
  }
  prioritynochange(item) {
    if(this.promotionspriority_List != null && this.promotionspriority_List.length > 0){
      if(item.priorityNo != null && item.priorityNo.toString() != ""){
        let filter_item = this.promotionspriority_List.filter(x=>x.priorityNo == item.priorityNo && x.promotionName != item.promotionName);
        if(filter_item != null && filter_item.length > 0){
          item.priorityNo = null;
          this.common.showMessage("warn","Priority Number already exists");
        }
      }
    }
  }

  ngOnInit() {
  }

  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
