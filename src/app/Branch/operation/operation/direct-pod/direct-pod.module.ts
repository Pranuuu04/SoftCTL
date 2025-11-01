import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkPodComponent } from './bulk-pod/bulk-pod.component';
import { DeliverdPodComponent } from './deliverd-pod/deliverd-pod.component';
import { UndeliverdPodComponent } from './undeliverd-pod/undeliverd-pod.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { DirectPodComponent } from './direct-pod.component';

@NgModule({
  declarations: [
    DirectPodComponent,
    BulkPodComponent,
    DeliverdPodComponent,
    UndeliverdPodComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DirectPodModule { }
