import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule } from '@angular/material/tabs';
import { BillingComponent } from './billing.component';
import { BillingChecklistComponent } from './billing-checklist/billing-checklist.component';
import { SalesregistersComponent } from './salesregisters/salesregisters.component';
import { UnbuiltComponent } from './unbuilt/unbuilt.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BillViewComponent } from './bill-view/bill-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BillingSharedModule } from 'app/Branch/billing/billing-shared.module';


@NgModule({
  declarations: [ 
    BillingComponent,
    BillingChecklistComponent,
    SalesregistersComponent,
    UnbuiltComponent,
    BillViewComponent
   ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule, 
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgSelectModule,
    BillingSharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class BillingModule { }
