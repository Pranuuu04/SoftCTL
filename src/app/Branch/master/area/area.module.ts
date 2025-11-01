import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaComponent } from './area.component';
import { CountryComponent } from './country/country.component';
import { MultizoneComponent } from './multizone/multizone.component';
import { StateComponent } from './state/state.component';
import { ZoneComponent } from './zone/zone.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { PincodeComponent } from './pincode/pincode.component';
import { RouterModule } from '@angular/router';
import { AreaDestComponent } from './area-dest/area-dest.component';
import { ServiceFormComponent } from 'app/Branch/Shared/master-model/service-form/service-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrefixMasterComponent } from './prefix-master/prefix-master.component';

@NgModule({
  declarations: [
    AreaComponent,
    AreaDestComponent,
    CountryComponent,
    MultizoneComponent,
    StateComponent,
    ZoneComponent,
    PincodeComponent,
    ServiceFormComponent,
    ZoneFormComponent,
    PrefixMasterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AreaModule { }
