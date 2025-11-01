import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurfacemodeRoutingModule } from './surfacemode-routing.module';
import { SurfacemodeCreditComponent } from './surfacemode.component';


@NgModule({
  declarations: [
    SurfacemodeCreditComponent
  ],
  imports: [
    CommonModule,
    SurfacemodeRoutingModule
  ]
})
export class SurfacemodeModule { }
