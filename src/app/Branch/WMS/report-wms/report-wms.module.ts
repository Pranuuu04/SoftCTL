import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { MasterReportComponent } from './master-report/master-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { ReportWMSComponent } from './report-wms.component';
import { StockInReportComponent } from './stock-in-report/stock-in-report.component';
import { StockoutReportComponent } from './stockout-report/stockout-report.component';
import { ItemReportComponent } from './item-report/item-report.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ReportWMSComponent,
    TransactionReportComponent,
    MasterReportComponent,
    StockInReportComponent,
    StockoutReportComponent,
    ItemReportComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class ReportWmsModule { }
