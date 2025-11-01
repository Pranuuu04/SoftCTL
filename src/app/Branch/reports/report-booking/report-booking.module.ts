import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { VolumatricReportComponent } from './volumatric-report/volumatric-report.component';

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ReportBookingModule { }
