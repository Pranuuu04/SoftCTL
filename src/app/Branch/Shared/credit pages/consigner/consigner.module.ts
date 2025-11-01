import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsignerRoutingModule } from './consigner-routing.module';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ConsignerRoutingModule,
    MaterialModule
  ]
})
export class ConsignerModule { }
