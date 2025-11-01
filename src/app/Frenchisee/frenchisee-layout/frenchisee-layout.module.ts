import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FrenchiseeLayoutRoutes } from './frenchisee-layout.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrenchiseeLayoutComponent } from './frenchisee-layout.component';

@NgModule({
  declarations: [FrenchiseeLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(FrenchiseeLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    MatDatepickerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class FrenchiseeLayoutModule { }
