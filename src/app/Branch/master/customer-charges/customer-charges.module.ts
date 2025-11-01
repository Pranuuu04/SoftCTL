import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerChargesComponent } from './customer-charges.component';
import { FuelChargesComponent } from './fuel-charges/fuel-charges.component';
import { DocketChargesComponent } from './docket-charges/docket-charges.component';
import { EssChargesComponent } from './ess-charges/ess-charges.component';
import { FovChargesComponent } from './fov-charges/fov-charges.component';
import { EnsChargesComponent } from './ens-charges/ens-charges.component';
import { VolumetricChargesComponent } from './volumetric-charges/volumetric-charges.component';
import { ScChargesComponent } from './sc-charges/sc-charges.component';
import { CafChargesComponent } from './caf-charges/caf-charges.component';
import { IdcChargesComponent } from './idc-charges/idc-charges.component';
import { InsuranceChargesComponent } from './insurance-charges/insurance-charges.component';
import { MetroChargesComponent } from './metro-charges/metro-charges.component';
import { CustChargFormComponent } from 'app/Branch/Shared/master-model/cust-charg-form/cust-charg-form.component';
import { OdaChargesComponent } from './oda-charges/oda-charges.component';


@NgModule({
  declarations: [
    CustomerChargesComponent,
    FuelChargesComponent,
    DocketChargesComponent,
    EssChargesComponent,
    FovChargesComponent,
    EnsChargesComponent,
    VolumetricChargesComponent,
    ScChargesComponent,
    CafChargesComponent,
    IdcChargesComponent,
    InsuranceChargesComponent,
    MetroChargesComponent,
    CustChargFormComponent,
    OdaChargesComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  providers: [DatePipe],
})
export class CustomerChargesModule { }
