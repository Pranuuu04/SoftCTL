import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransTypeComponent } from './trans-type/trans-type.component';
import { TransVehicleComponent } from './trans-vehicle/trans-vehicle.component';
import { TransDriverComponent } from './trans-driver/trans-driver.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { TransportComponent } from './transport.component';
import { TransFormComponent } from 'app/Branch/Shared/master-model/trans-form/trans-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TransRouteComponent } from './trans-route/trans-route.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { TransportImagesComponent } from './transport-images/transport-images.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImportPDComponent } from './import-pd/import-pd.component';



@NgModule({
  declarations: [
    TransportComponent,
    TransTypeComponent,
    TransVehicleComponent,
    TransDriverComponent,
    TransFormComponent,
    TransRouteComponent,
    VehicleTypeComponent,
    TransportImagesComponent,
    ImportPDComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatTooltipModule,
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class TransportModule { }
