import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeamodeRoutingModule } from './seamode-routing.module';
import { SeamodeCreditComponent } from './seamode.component';


@NgModule({
  declarations: [
    SeamodeCreditComponent
  ],
  imports: [
    CommonModule,
    SeamodeRoutingModule
  ]
})
export class SeamodeModule { }
