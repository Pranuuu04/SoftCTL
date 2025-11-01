import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { StockIssueBranchComponent } from './stock-issue-branch/stock-issue-branch.component';
import { StockIssueCustomerComponent } from './stock-issue-customer/stock-issue-customer.component';
import { StockIssueEMPComponent } from './stock-issue-emp/stock-issue-emp.component';
import { PODCancleComponent } from './pod-cancle/pod-cancle.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { InventoryComponent } from './inventory.component';
import { InventoryFormComponent } from 'app/Branch/Shared/master-model/inventory-form/inventory-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    InventoryComponent,
    StockEntryComponent,
    StockIssueBranchComponent,
    StockIssueCustomerComponent,
    StockIssueEMPComponent,
    PODCancleComponent,
    InventoryFormComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryModule { }
