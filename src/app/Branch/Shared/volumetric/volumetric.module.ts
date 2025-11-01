import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VolumetricRoutingModule } from './volumetric-routing.module';
import { MaterialModule } from './../../../angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VolumetricComponent } from './volumetric.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    // VolumetricComponent
  ],
  imports: [
    CommonModule,
    VolumetricRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class VolumetricModule { }
