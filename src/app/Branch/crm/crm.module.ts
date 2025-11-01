import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmRoutingModule } from './crm-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { CrmComplainComponent } from './crm-complain/crm-complain.component';
import { CrmQuerryComponent } from './crm-querry/crm-querry.component';
import { CrmViewComponent } from './crm-view/crm-view.component';
import { CRMComponent } from './crm.component';


@NgModule({
  declarations: [
    CRMComponent,
    CrmComplainComponent,
    CrmViewComponent,
    CrmQuerryComponent,
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CrmModule { }
