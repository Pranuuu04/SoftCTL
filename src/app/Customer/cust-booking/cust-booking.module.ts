import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustBookingRoutingModule } from './cust-booking-routing.module';
import { DeleteBookingComponent } from './delete-booking/delete-booking.component';
import { EditCustBookingComponent } from './edit-cust-booking/edit-cust-booking.component';
import { AddCustBookingComponent } from './add-cust-booking/add-cust-booking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';


@NgModule({
  declarations: [
    DeleteBookingComponent,
    EditCustBookingComponent,
    AddCustBookingComponent
  ],
  
  imports: [
    CommonModule,
    CustBookingRoutingModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustBookingModule { }
