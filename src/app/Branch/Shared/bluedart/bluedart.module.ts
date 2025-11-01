import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BluedartRoutingModule } from './bluedart-routing.module';
import { BluedartComponent } from './bluedart.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    // BluedartComponent
  ],
  imports: [
    CommonModule,
    BluedartRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BluedartModule { }
