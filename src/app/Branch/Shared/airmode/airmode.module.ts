import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirmodeRoutingModule } from './airmode-routing.module';
import { AirmodeComponent } from './airmode.component';


@NgModule({
  declarations: [
    AirmodeComponent
  ],
  imports: [
    CommonModule,
    AirmodeRoutingModule
  ]
})
export class AirmodeModule { }
