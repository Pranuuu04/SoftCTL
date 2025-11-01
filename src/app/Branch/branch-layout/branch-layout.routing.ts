import { Routes } from '@angular/router';
import { BranchDashboardComponent,  } from '../dashboard/dashboard.component';
import { ManifestComponent } from '../operation/manifest/manifest.component';
import { TripsheetComponent } from '../operation/tripsheet/tripsheet.component';
import { BranchLayoutComponent } from './branch-layout.component';
import { StatusComponent } from '../reports/status/status.component';
import { InscanComponent } from '../operation/inscan/inscan.component';
import { RunSheetComponent } from '../operation/run-sheet/run-sheet.component';
import { PodUpdateComponent } from '../operation/pod-update/pod-update.component';
import { BookingComponent } from '../operation/Booking/booking.component';
import { PickUpComponent } from '../operation/pick-up/pick-up.component';
import { CRMComponent } from '../crm/crm.component';
import { AreaComponent } from '../master/area/area.component';
import { ReportBookingComponent } from '../reports/report-booking/report-booking.component';
import { TrackingPageComponent } from '../tracking-page/tracking-page.component';
import { BillingComponent } from '../reports/billing/billing.component';
import { ViewUserComponent } from '../user-management/view-user/view-user.component';
import { DispatchedComponent } from '../operation/dispatched/dispatched.component';
import { DirectPodComponent } from '../operation/operation/direct-pod/direct-pod.component';
import { AuthGuard } from 'app/service/auth.guard';
import { StatusEntryComponent } from '../operation/status-entry/status-entry.component';
import { ServiceComponent } from '../master/service/service.component';
import { TransportComponent } from '../master/transport/transport.component';
import { InventoryComponent } from '../master/inventory/inventory.component';
import { DirectRunsheetComponent } from '../operation/direct-runsheet/direct-runsheet.component';
import { MasterSalesComponent } from '../master/master-sales/master-sales.component';
import { BillingComponents } from '../billing/billing.component';
import { TripReportComponent } from '../reports/trip-report/trip-report.component';
import { TransactionWmsComponent } from '../WMS/transaction-wms/transaction-wms.component';
import { ReportWMSComponent } from '../WMS/report-wms/report-wms.component';
import { MasterComponent } from '../WMS/master/master.component';
import { CustomerChargesComponent } from '../master/customer-charges/customer-charges.component';
import { OtherComponent } from '../master/other/other/other.component';
import { TransportWayComponent } from '../master/transport-Way/transport-way.component';
import { AuditComponent } from '../audit/audit.component';
import { PayementComponent } from '../Payment/payement/payement.component';
import { UserReportComponent } from '../reports/user-report/user-report.component';


export const BracnhLayoutRoutes: Routes = [
  {
    path: '',
    component: BranchLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'branch-dashboard',      component: BranchDashboardComponent
      },

    //  master
      {
          path: 'Area',      component : AreaComponent
      },
      {
          path : 'Services',    component : ServiceComponent
      },
      {
          path: 'Transport',      component : TransportComponent
      },
      {
          path : 'Inventory',    component : InventoryComponent
      },
      {
          path : 'Sales',       component : MasterSalesComponent
      },
       {
        path : 'CustomerCharges',       component : CustomerChargesComponent
      },
      {
        path : 'Other',       component : OtherComponent
      },
       {
        path: 'TransportWay',  component: TransportWayComponent
      },
      // oparation

      {
        path: 'Booking',      component: BookingComponent
      },
      {
        path: 'PickUp',      component: PickUpComponent
      },
      {
        path: 'Manifest',      component: ManifestComponent
      },
      {
        path: 'Dispatch',      component: DispatchedComponent
      },
      {
        path: 'TripSheet',      component: TripsheetComponent
      },
      {
        path: 'Inscan',      component: InscanComponent
      },
      {
        path: 'Runsheet',      component: RunSheetComponent
      },
      {
        path: 'DRS',      component: DirectRunsheetComponent
      },
      {
        path: 'StatusEntry',      component: StatusEntryComponent
      },
      {
        path: 'PodUpdate',      component: PodUpdateComponent
      },
      {
        path: 'Pod',      component: DirectPodComponent
      },

      // reports
      {
        path: 'Status',      component: StatusComponent
      },
      {
        path: 'Statements',      component: ReportBookingComponent
      },
      {
        path: 'Billing',      component: BillingComponent
      },
      {
        path: 'Trip',       component: TripReportComponent
      },
      {
        path: 'Users',  component: UserReportComponent
      },
      // Crm
      {
        path: 'CRM',      component: CRMComponent
      },
      // Tracking
      {
        path: 'Tracking',      component: TrackingPageComponent, data: {value : '', type: '' }
      },
      // user managment
      {
        path: 'ViewUsers',      component: ViewUserComponent
      },
      {
        path: 'Billings',      component: BillingComponents
      },
      // WMS transaction
      {
        path: 'WMS-Transaction',    component: TransactionWmsComponent
      },
      {
        path: 'WMS-Report',    component: ReportWMSComponent
      },
       {
        path: 'WMS-Master' , component: MasterComponent
      },
      // Audit
      {
        path: 'Audit' , component: AuditComponent
      },
       // Payment
      {
        path: 'Payment', component: PayementComponent
      },
      ]
    }
];
