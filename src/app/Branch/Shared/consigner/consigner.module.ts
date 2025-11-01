import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsignerRoutingModule } from './consigner-routing.module';
import { ConsignerComponent } from './consigner.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    // ConsignerComponent
  ],
  imports: [
     CommonModule,
    ConsignerRoutingModule,
     MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class ConsignerModule { }
