import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusRoutingModule } from './status-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { CustomerComponent } from './customer/customer.component';
import { StatusComponent } from './status.component';
import { VehicleStatusComponent } from './vehicle-status/vehicle-status.component';
import { VendorStatusComponent } from './vendor-status/vendor-status.component';
import { CurrentStatusComponent } from './current-status/current-status.component';
import { PendingDrsImageComponent } from './pending-drs-image/pending-drs-image.component';
import { PendingPodImageComponent } from './pending-pod-image/pending-pod-image.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    StatusComponent,
    CustomerComponent,
    VendorStatusComponent,
    VehicleStatusComponent,
    CurrentStatusComponent,
    PendingDrsImageComponent,
    PendingPodImageComponent,
  ],
  imports: [
    CommonModule,
    StatusRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class StatusModule { }
