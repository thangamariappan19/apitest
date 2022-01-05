import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA }
  from '@angular/material/dialog';
import { CommonService } from 'src/app/common.service';

export interface DialogData {
  discountType: string;
  discountValue: number;
  discountRemarks: string;
  invoiceTotal: number;
}

@Component({
  selector: 'app-discount-popup',
  templateUrl: './discount-popup.component.html',
  styleUrls: ['./discount-popup.component.css']
})
export class DiscountPopupComponent {
  max_amount: number;
  constructor(
    private common: CommonService,
    public disDialogRef: MatDialogRef<DiscountPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.max_amount = data.invoiceTotal != null ? data.invoiceTotal : 0;
  }

  validate() {
    if(this.data.discountType == "Percentage" && this.data.discountValue > 100){
      this.data.discountValue = 0;
      this.common.showMessage("warn","Discount Percentage exceeded 100");
    }
    else if(this.data.discountType == "Percentage" && this.data.discountValue > this.max_amount)
    {
      this.data.discountValue = 0;
      this.common.showMessage("info","Please select Atleast one item to apply Discount");
    }
    else if(this.data.discountType == "Amount" && this.data.discountValue > this.max_amount){
      this.data.discountValue = 0;
      if(this.max_amount==0)
      {
        this.common.showMessage("info","Please select Atleast one item to apply Discount");
      }
     else
     {
      this.common.showMessage("warn","Discount Amount exceeded Invoice Amount");
     }
    }
  }

  onNoClick(): void {
    this.disDialogRef.close();
  }
  removeClick():void{
    this.data.discountValue = 0;
    this.data.discountRemarks = "";
  }
}
