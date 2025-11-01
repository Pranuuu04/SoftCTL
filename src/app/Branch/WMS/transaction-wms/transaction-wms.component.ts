import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TransStockInComponent } from './trans-stock-in/trans-stock-in.component';
import { TransStockOutComponent } from './trans-stock-out/trans-stock-out.component';

@Component({
  selector: 'app-transaction-wms',
  templateUrl: './transaction-wms.component.html',
  styleUrls: ['./transaction-wms.component.css']
})
export class TransactionWmsComponent implements OnInit {

@ViewChild(TransStockInComponent) private StockIn: TransStockInComponent;
  @ViewChild(TransStockOutComponent) private StockOut: TransStockOutComponent;

  constructor() { }

  ngOnInit(): void {
  }
  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.StockIn.refresh();
        break;
      case 1:
        this.StockOut.refresh();
        break;
    }
  }

}
