import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { DashCustViewComponent } from '../Cust-Shared/Dashboard-modal/dash-cust-view/dash-cust-view.component';

@NgModule({
  declarations: [
    DashCustViewComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
