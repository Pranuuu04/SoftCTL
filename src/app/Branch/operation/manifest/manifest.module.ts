import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManifestComponent } from './manifest.component';
import { CreateManifestComponent } from './create-manifest/create-manifest.component';
import { PendingManifestComponent } from './pending-manifest/pending-manifest.component';
import { ViewManifestComponent } from './view-manifest/view-manifest.component';
import {MatTabsModule } from '@angular/material/tabs';
import { ViewaddComponent } from 'app/Branch/Shared/manifest pages/viewadd/viewadd.component';
import { ViewdeleteComponent } from 'app/Branch/Shared/manifest pages/viewdelete/viewdelete.component';
import { VieweditComponent } from 'app/Branch/Shared/manifest pages/viewedit/viewedit.component';
import { ForwadingManifestComponent } from './forwading-manifest/forwading-manifest.component';
import { MannualManifestComponent } from './mannual-manifest/mannual-manifest.component';
import { BulkImportComponent } from './bulk-import/bulk-import.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { AddManifestComponent } from 'app/Branch/Shared/manifest pages/add-manifest/add-manifest.component';
import { BulkManifestComponent } from 'app/Branch/Shared/manifest pages/bulk-manifest/bulk-manifest.component';
import { ManferrorLogComponent } from 'app/Branch/Shared/manifest pages/manferror-log/manferror-log.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ManifestComponent,
    CreateManifestComponent,
    PendingManifestComponent,
    ViewManifestComponent,
    ViewaddComponent,
    ViewdeleteComponent,
    VieweditComponent,
    ForwadingManifestComponent,
    MannualManifestComponent,
    BulkImportComponent,
    AddManifestComponent,
    BulkManifestComponent,
    ManferrorLogComponent,

  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MaterialModule,
    NgSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ManifestModule { }
