import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainmodeRoutingModule } from './trainmode-routing.module';
import { TrainmodeComponent } from './trainmode.component';


@NgModule({
  declarations: [
    TrainmodeComponent
  ],
  imports: [
    CommonModule,
    TrainmodeRoutingModule
  ]
})
export class TrainmodeModule { }
