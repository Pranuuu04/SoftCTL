import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditInvoiceValRoutingModule } from './credit-invoice-val-routing.module';
import { CreditInvoiceValComponent } from './credit-invoice-val.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreditInvoiceValComponent
  ],
  imports: [
    CommonModule,
    CreditInvoiceValRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreditInvoiceValModule { }
