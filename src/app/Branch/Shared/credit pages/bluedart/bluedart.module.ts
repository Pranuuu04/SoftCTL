import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BluedartRoutingModule } from './bluedart-routing.module';
import { BluedartCreditComponent } from './bluedart.component';


@NgModule({
  declarations: [
    BluedartCreditComponent
  ],
  imports: [
    CommonModule,
    BluedartRoutingModule
  ]
})
export class BluedartModule { }
