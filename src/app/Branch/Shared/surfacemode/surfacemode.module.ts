import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurfacemodeRoutingModule } from './surfacemode-routing.module';
import { SurfacemodeComponent } from './surfacemode.component';


@NgModule({
  declarations: [
    SurfacemodeComponent
  ],
  imports: [
    CommonModule,
    SurfacemodeRoutingModule
  ]
})
export class SurfacemodeModule { }
