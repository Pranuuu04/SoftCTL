import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { InscanComponent } from './inscan.component';
import { ScanByAbwNoComponent } from './scan-by-abw-no/scan-by-abw-no.component';
import { ScanByManifestComponent } from './scan-by-manifest/scan-by-manifest.component';
import { UnloadingTallyComponent } from './unloading-tally/unloading-tally.component';
import { UpdateComponent } from './update/update.component';
import { VehicleInscanComponent } from './vehicle-inscan/vehicle-inscan.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PInscanManifNoComponent } from 'app/Branch/Shared/inscan pages/p-inscan-manif-no/p-inscan-manif-no.component';
import { PInscanAwbNoComponent } from 'app/Branch/Shared/inscan pages/p-inscan-awb-no/p-inscan-awb-no.component';
import { UnloadingBulkComponent } from 'app/Branch/Shared/inscan pages/unloading-bulk/unloading-bulk.component';
import { DoneAwbComponent } from 'app/Branch/Shared/inscan pages/done-awb/done-awb.component';
import { DoneManfComponent } from 'app/Branch/Shared/inscan pages/done-manf/done-manf.component';
import { AwbBulkComponent } from 'app/Branch/Shared/inscan pages/awb-bulk/awb-bulk.component';
import { ManifestBulkComponent } from 'app/Branch/Shared/inscan pages/manifest-bulk/manifest-bulk.component';


@NgModule({
  declarations: [
    InscanComponent,
    ScanByAbwNoComponent,
    ScanByManifestComponent,
    VehicleInscanComponent,
    UnloadingTallyComponent,
    UpdateComponent,
    PInscanManifNoComponent,
    PInscanAwbNoComponent,
    UnloadingBulkComponent,
    DoneAwbComponent,
    DoneManfComponent,
    AwbBulkComponent,
    ManifestBulkComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class InscanModule { }
