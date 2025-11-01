import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BillingGenrateComponent } from './billing-genrate/billing-genrate.component';
import { UnbuildBillingComponent } from './unbuild-billing/unbuild-billing.component';
import { BillPrintComponent } from './bill-print/bill-print.component';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})

export class BillingComponents implements OnInit {

  @ViewChild(UnbuildBillingComponent) private Unbuild: UnbuildBillingComponent;
  @ViewChild(BillingGenrateComponent) private Genrate: BillingGenrateComponent;
  @ViewChild(BillPrintComponent) private BillPrint: BillPrintComponent;
  sessionLocationCode: string;
  selectedValue: string;
  userType: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.selectedValue = this.sharedService.getSelectedValue();
    this.userType = localStorage.getItem('userType');
  }
 onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.Unbuild.refresh();
        break;
      case 1:
        this.Genrate.refresh();
        break;
      case 2:
        this.BillPrint.refresh();
        break;
    }
  }
}
