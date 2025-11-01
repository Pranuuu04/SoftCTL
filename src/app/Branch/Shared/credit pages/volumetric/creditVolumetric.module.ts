import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VolumetricRoutingModule } from '../../volumetric/volumetric-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    VolumetricRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class VolumetricCreditModule { }
