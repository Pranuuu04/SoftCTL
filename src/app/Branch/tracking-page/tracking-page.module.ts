import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { TackDetailsComponent } from './tack-details/tack-details.component';
import { TrackingPageComponent } from './tracking-page.component';


@NgModule({
  declarations: [
    TrackingPageComponent,
    TackDetailsComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class TrackingPageModule { }
