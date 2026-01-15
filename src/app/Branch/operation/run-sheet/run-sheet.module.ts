import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { DRSEntryComponent } from './drs-entry/drs-entry.component';
import { DRSViewComponent } from './drs-view/drs-view.component';
import { PendingDRSComponent } from './pending-drs/pending-drs.component';
import { RunSheetComponent } from './run-sheet.component';
import { AddDrsComponent } from 'app/Branch/Shared/Runsheet-pages/add-drs/add-drs.component';
import { DeleteDrsComponent } from 'app/Branch/Shared/Runsheet-pages/delete-drs/delete-drs.component';
import { ImportDrsComponent } from './import-drs/import-drs.component';
import { DirectRunsheetModule } from '../direct-runsheet/direct-runsheet.module';

@NgModule({
  declarations: [
    RunSheetComponent,
    PendingDRSComponent,
    DRSEntryComponent,
    DRSViewComponent,
    AddDrsComponent,
    DeleteDrsComponent,
    ImportDrsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DirectRunsheetModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RunSheetModule { }
