import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


import { ActiveCustomerRoutingModule } from './active-customer-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActiveCustomerComponent } from './active-customer.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';


@NgModule({
  declarations: [
    // ActiveCustomerComponent
  ],
  imports: [
    CommonModule,
    ActiveCustomerRoutingModule,
    MaterialModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule
  ]
})
export class ActiveCustomerModule { }
