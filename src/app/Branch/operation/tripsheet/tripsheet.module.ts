import { CUSTOM_ELEMENTS_SCHEMA, NgModule, LOCALE_ID} from '@angular/core';
import { CommonModule} from '@angular/common';
import { TripsheetComponent } from './tripsheet.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewTripsheetComponent } from './view-tripsheet/view-tripsheet.component';
import { PendingTripsheetComponent } from './pending-tripsheet/pending-tripsheet.component';
import { CreateTripsheetComponent } from './create-tripsheet/create-tripsheet.component';
import { TripImportComponent } from './trip-import/trip-import.component';
import { AssignTripComponent } from './assign-trip/assign-trip.component';
import { TripformComponent } from 'app/Branch/Shared/tripmodel/tripform/tripform.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    TripsheetComponent,
    CreateTripsheetComponent,
    PendingTripsheetComponent,
    ViewTripsheetComponent,
    TripImportComponent,
    AssignTripComponent,
    TripformComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMatTimepickerModule.setLocale('en-GB'),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class TripsheetModule { }
