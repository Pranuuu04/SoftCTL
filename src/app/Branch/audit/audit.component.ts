import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MasterReportComponent } from '../WMS/report-wms/master-report/master-report.component';
import { TransactionReportComponent } from '../WMS/report-wms/transaction-report/transaction-report.component';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

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
