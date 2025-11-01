import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeComponent } from './mode/mode.component';
import { ServiceProductComponent } from './service-product/service-product.component';
import { ServiceDeptComponent } from './service-dept/service-dept.component';
import { ServiceExpenseComponent } from './service-expense/service-expense.component';
import { ServiceBankNameComponent } from './service-bank-name/service-bank-name.component';
import { ServiceDeliverytypeComponent } from './service-deliverytype/service-deliverytype.component';
import { ServicePackageTypComponent } from './service-package-typ/service-package-typ.component';
import { ServiceReasonComponent } from './service-reason/service-reason.component';
import { ServiceComponent } from './service.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ServiceComponent,
    ModeComponent,
    ServiceProductComponent,
    ServiceDeptComponent,
    ServiceExpenseComponent,
    ServiceBankNameComponent,
    ServiceDeliverytypeComponent,
    ServicePackageTypComponent,
    ServiceReasonComponent,
    ServiceTypeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    // CommonModule,
    // RouterModule,
    // MaterialModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServiceModule { }
