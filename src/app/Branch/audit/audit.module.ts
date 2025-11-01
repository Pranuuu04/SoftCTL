import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { AuditComponent } from './audit.component';
import { AuditBookingComponent } from './audit-booking/audit-booking.component';
import { AuditRateUpdationComponent } from './audit-rate-updation/audit-rate-updation.component';



@NgModule({
  declarations: [
    AuditComponent,
    AuditBookingComponent,
    AuditRateUpdationComponent
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
export class AuditModule { }
