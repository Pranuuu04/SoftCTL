import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportTabComponent } from './import-tab/import-tab.component';
import { ManualTabComponent } from './manual-tab/manual-tab.component';
import { StatusEntryComponent } from './status-entry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    StatusEntryComponent,
    ImportTabComponent,
    ManualTabComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class StatusEntryModule { }
