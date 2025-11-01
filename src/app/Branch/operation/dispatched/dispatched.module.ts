import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { ViewAddDisComponent } from 'app/Branch/Shared/dispatch_pages/view-add-dis/view-add-dis.component';
import { ViewDeleteDisComponent } from 'app/Branch/Shared/dispatch_pages/view-delete-dis/view-delete-dis.component';


@NgModule({
  declarations: [
    ViewAddDisComponent,
    ViewDeleteDisComponent  

  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DispatchedModule { }
