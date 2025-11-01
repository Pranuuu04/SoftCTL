import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from '../Shared/dashboard_pages/dashboard-view/dashboard-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';



@NgModule({
  declarations: [
    DashboardViewComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DashboardModule { }
