import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { AirlineComponent } from './airline/airline.component';
import { FlightMasterComponent } from './flight-master/flight-master.component';
import { TrainMasterComponent } from './train-master/train-master.component';
import { TrainNumberComponent } from './train-number/train-number.component';
import { TransportWayComponent } from './transport-way.component';
import { TransportWayFormComponent } from 'app/Branch/Shared/master-model/transport-way-form/transport-way-form.component';



@NgModule({
  declarations: [
    AirlineComponent,
    FlightMasterComponent,
    TrainMasterComponent,
    TrainNumberComponent,
    TransportWayComponent,
    TransportWayFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class TransportWayModule { }
