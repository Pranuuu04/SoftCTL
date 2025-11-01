import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainmodeRoutingModule } from './trainmode-routing.module';
import { TrainmodeCreditComponent } from './trainmode.component';


@NgModule({
  declarations: [
    TrainmodeCreditComponent
  ],
  imports: [
    CommonModule,
    TrainmodeRoutingModule
  ]
})
export class TrainmodeModule { }
