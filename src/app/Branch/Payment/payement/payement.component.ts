import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CreditNoteComponent } from './credit-note/credit-note.component';
// import { PaymentAdjustmentComponent } from './payment-adjustment/payment-adjustment.component';

@Component({
  selector: 'app-payement',
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.css']
})
export class PayementComponent implements OnInit {

  @ViewChild(CreditNoteComponent) private Credit: CreditNoteComponent;
  // @ViewChild(PaymentAdjustmentComponent) private Adjustment: PaymentAdjustmentComponent;

  constructor() { }

  ngOnInit(): void {
  }
  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.Credit.refresh();
        break;
      // case 1:
      //   this.Adjustment.refresh();
      //   break;
    }
  }


}
