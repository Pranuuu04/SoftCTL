import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerDashboardComponent} from '../dashboard/dashboard.component';
import { CustomerLayoutRoutes } from './customer-layout.routing';
import { DashboardModule } from '../dashboard/dashboard.module';
import { CustBookingModule } from '../cust-booking/cust-booking.module';
import { CustReportComponent } from '../cust-report/cust-report.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CustomerLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    DashboardModule,
    CustBookingModule,
    MaterialModule,
  ],
  declarations: [
    CustomerDashboardComponent,
    CustReportComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerLayoutModule { }
