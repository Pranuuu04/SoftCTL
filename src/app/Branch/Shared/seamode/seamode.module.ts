import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeamodeRoutingModule } from './seamode-routing.module';
import { SeamodeComponent } from './seamode.component';


@NgModule({
  declarations: [
    SeamodeComponent
  ],
  imports: [
    CommonModule,
    SeamodeRoutingModule
  ]
})
export class SeamodeModule { }
