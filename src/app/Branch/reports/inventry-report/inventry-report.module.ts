import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissingCnoteComponent } from './missing-cnote/missing-cnote.component';
import { CNoteIssueComponent } from './c-note-issue/c-note-issue.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InventryReportComponent } from './inventry-report.component';
import { StockInComponent } from './stock-in/stock-in.component';



@NgModule({
  declarations: [
    InventryReportComponent,
    MissingCnoteComponent,
    CNoteIssueComponent,
    StockInComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class InventryReportModule { }
