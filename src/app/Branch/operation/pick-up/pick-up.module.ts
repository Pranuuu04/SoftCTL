import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { GeneratePickUpComponent } from './generate-pick-up/generate-pick-up.component';
import { PendingPickUpComponent } from './pending-pick-up/pending-pick-up.component';
import { PickUpDoneComponent } from './pick-up-done/pick-up-done.component';
import { PickUpEntryComponent } from './pick-up-entry/pick-up-entry.component';
import { PickUpComponent } from './pick-up.component';
import { ViewPickUpComponent } from './view-pick-up/view-pick-up.component';
import { NgSelectModule } from '@ng-select/ng-select';
// import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

@NgModule({
  declarations: [  
    PickUpComponent,
    PendingPickUpComponent,
    PickUpEntryComponent,
    GeneratePickUpComponent,
    ViewPickUpComponent,
    PickUpDoneComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    // NgOptionHighlightModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PickUpModule { }
