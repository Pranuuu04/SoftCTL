import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillPrintComponent } from './bill-print/bill-print.component';
import { UnbuildBillingComponent } from './unbuild-billing/unbuild-billing.component';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    BillPrintComponent,
    UnbuildBillingComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MaterialModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [
    BillPrintComponent,
    UnbuildBillingComponent
  ]
})
export class BillingSharedModule { }
