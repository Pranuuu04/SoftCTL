import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveCustomerRoutingModule } from './active-customer-routing.module';
import { ShipperCreditComponent } from './active-customer.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';


@NgModule({
  declarations: [
    ShipperCreditComponent
  ],
  imports: [
    CommonModule,
    ActiveCustomerRoutingModule,
    MaterialModule
  ]
})
export class ActiveCustomerModule { }
