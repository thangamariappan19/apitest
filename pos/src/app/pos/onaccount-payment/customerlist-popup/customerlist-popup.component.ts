import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MCustomer } from 'src/app/models/m-customer';


@Component({
  selector: 'app-customerlist-popup',
  templateUrl: './customerlist-popup.component.html',
  styleUrls: ['./customerlist-popup.component.css']
})
export class CustomerlistPopupComponent implements OnInit {
  TableList:Array<any>;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
    this.TableList=this.data;
  }
  SelectItem_checkedChanged(item :MCustomer)
  {

  }

}
