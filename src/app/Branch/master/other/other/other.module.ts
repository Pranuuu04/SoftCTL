import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { OtherComponent } from './other.component';
import { ShipperComponent } from './shipper/shipper.component';
import { ConsigneeComponent } from './consignee/consignee.component';
import { OtherMastFormComponent } from 'app/Branch/Shared/master-model/other-mast-form/other-mast-form.component';
import { CourierBoyComponent } from '../../area/courier-boy/courier-boy.component';
import { BranchMastComponent } from '../../area/branch-mast/branch-mast.component';
import { CoCourierComponent } from './co-courier/co-courier.component';
import { CompanyMasterComponent } from './company-master/company-master.component';


@NgModule({
  declarations: [
    OtherComponent,
    ShipperComponent,
    ConsigneeComponent,
    OtherMastFormComponent,
    CourierBoyComponent,
    BranchMastComponent,
    CoCourierComponent,
    CompanyMasterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class OtherModule { }
