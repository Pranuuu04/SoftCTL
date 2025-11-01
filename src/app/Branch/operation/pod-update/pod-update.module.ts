import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { BulkUpdateComponent } from './bulk-update/bulk-update.component';
import { DeliverdComponent } from './deliverd/deliverd.component';
import { PodUpdateComponent } from './pod-update.component';
import { UndeliverdComponent } from './undeliverd/undeliverd.component';
import { AirwaybillComponent } from 'app/Branch/Shared/POD pages/airwaybill/airwaybill.component';


@NgModule({
  declarations: [
    PodUpdateComponent,
    DeliverdComponent,
    UndeliverdComponent,
    BulkUpdateComponent,
    AirwaybillComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PodUpdateModule { }
