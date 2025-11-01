import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { MasterReportComponent } from './master-report/master-report.component';

@Component({
  selector: 'app-report-wms',
  templateUrl: './report-wms.component.html',
  styleUrls: ['./report-wms.component.css']
})
export class ReportWMSComponent implements OnInit {

@ViewChild(MasterReportComponent) private Master: MasterReportComponent;
  @ViewChild(TransactionReportComponent) private Transaction: TransactionReportComponent;

  constructor() { }

  ngOnInit(): void {
  }
  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.Master.refresh();
        break;
      case 1:
        this.Transaction.refresh();
        break;
    }
  }

}
