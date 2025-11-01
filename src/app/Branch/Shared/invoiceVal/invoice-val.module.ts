import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceValRoutingModule } from './invoice-val-routing.module';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { InvoiceValComponent } from './invoice-val.component';


@NgModule({
  declarations: [
    // InvoiceValComponent
  ],
  imports: [
    CommonModule,
    InvoiceValRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class InvoiceValModule { }
