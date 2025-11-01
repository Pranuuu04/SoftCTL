import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { VendorCreditComponent } from './vendor.component';


@NgModule({
  declarations: [
    VendorCreditComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
    MaterialModule
  ]
})
export class VendorModule { }
