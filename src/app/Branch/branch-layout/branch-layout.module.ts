import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BranchDashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BracnhLayoutRoutes } from './branch-layout.routing';
import { OperationModule } from '../operation/operation/operation.module';
import { CrmModule } from '../crm/crm.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ReportsModule } from '../reports/reports/reports.module';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { AreaModule } from '../master/area/area.module';
import { ServiceModule } from '../master/service/service.module';
import { TransportModule } from '../master/transport/transport.module';
import { InventoryModule } from '../master/inventory/inventory.module';
import { BillingModule } from '../billing/billing.module';
import { ReportWmsModule } from '../WMS/report-wms/report-wms.module';
import { TransactionWmsModule } from '../WMS/transaction-wms/transaction-wms.module';
import { MasterModule } from '../WMS/master/master.module';
import { CustomerChargesModule } from '../master/customer-charges/customer-charges.module';
import { OtherModule } from '../master/other/other/other.module';
import { TransportWayModule } from '../master/transport-Way/transport-way.module';
import { AuditModule } from '../audit/audit.module';



@NgModule({
  declarations: [
    BranchDashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(BracnhLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DashboardModule,
    OperationModule,
    CrmModule,
    ReportsModule,
    AreaModule,
    ServiceModule,
    TransportModule,
    InventoryModule,
    BillingModule,
    ReportWmsModule,
    TransactionWmsModule,
    MasterModule,
    CustomerChargesModule,
    OtherModule,
    TransportWayModule,
    AuditModule

  ],  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class BranchLayoutModule { }
