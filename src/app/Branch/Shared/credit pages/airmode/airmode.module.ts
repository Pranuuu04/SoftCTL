import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirmodeRoutingModule } from './airmode-routing.module';
import { AirmodeCreditComponent } from './airmode.component';


@NgModule({
  declarations: [
    AirmodeCreditComponent
  ],
  imports: [
    CommonModule,
    AirmodeRoutingModule
  ]
})
export class AirmodeModule { }
