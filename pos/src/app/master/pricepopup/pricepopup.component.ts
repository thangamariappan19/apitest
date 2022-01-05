import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA }
  from '@angular/material/dialog';
import { CommonService } from 'src/app/common.service';

export interface DialogData {
  priceListData:Array<any>
}

@Component({
  selector: 'app-pricepopup',
  templateUrl: './pricepopup.component.html',
  styleUrls: ['./pricepopup.component.css']
})
export class PricepopupComponent {

  priceList: Array<any>;

  constructor(
    private common: CommonService,
    public disDialogRef: MatDialogRef<PricepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) 
    {
    this.priceList = data.priceListData;
  }

  onNoClick(): void {
    this.disDialogRef.close();
  }
}
