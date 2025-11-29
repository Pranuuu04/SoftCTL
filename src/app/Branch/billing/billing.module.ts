import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillPrintComponent } from './bill-print/bill-print.component';
import { BillingGenrateComponent } from './billing-genrate/billing-genrate.component';
import { BillingComponents } from './billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { UnbuildBillingComponent } from './unbuild-billing/unbuild-billing.component';
import { MatSelectModule } from '@angular/material/select';
import { BillingSharedModule } from './billing-shared.module';

@NgModule({
  declarations: [
      BillingComponents,
      BillingGenrateComponent,
      // BillPrintComponent,
      // UnbuildBillingComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MaterialModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgSelectModule,
    BillingSharedModule
  ]
  
})
export class BillingModule { }
