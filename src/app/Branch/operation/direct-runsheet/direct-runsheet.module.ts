import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectDrsEntryComponent } from './direct-drs-entry/direct-drs-entry.component';
import { DirectDrsViewComponent } from './direct-drs-view/direct-drs-view.component';
import { DirectDrsPendingComponent } from './direct-drs-pending/direct-drs-pending.component';
import { DirectRunsheetComponent } from './direct-runsheet.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectDrsUpdateComponent } from './direct-drs-update/direct-drs-update.component';



@NgModule({
  declarations: [
    DirectRunsheetComponent,
    DirectDrsEntryComponent,
    DirectDrsViewComponent,
    DirectDrsPendingComponent,
    DirectDrsUpdateComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DirectRunsheetModule { }
