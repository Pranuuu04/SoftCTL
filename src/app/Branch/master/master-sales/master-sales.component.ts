import { Component, OnInit, ViewChild } from '@angular/core';
import { SaleConsignorComponent } from './sale-consignor/sale-consignor.component';
import { SalesRateComponent } from './sales-rate/sales-rate.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RateMaster2Component } from './rate-master2/rate-master2.component';

@Component({
  selector: 'app-master-sales',
  templateUrl: './master-sales.component.html',
  styleUrls: ['./master-sales.component.css']
})
export class MasterSalesComponent implements OnInit {

  @ViewChild (SaleConsignorComponent) private saleConsignor: SaleConsignorComponent;
  @ViewChild (SalesRateComponent) private salesRate: SalesRateComponent;
  @ViewChild  (RateMaster2Component) private salesRate2: RateMaster2Component;

  constructor() { }

  ngOnInit(): void {
  }
onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.saleConsignor.refresh();
        break;
      case 1:
        this.salesRate.refresh();
        break;
      case 4:
        this.salesRate2.refresh();
        break;
    }
}
}
