import { Routes } from '@angular/router';
import { CustomerDashboardComponent} from '../dashboard/dashboard.component';
import { CustReportComponent } from '../cust-report/cust-report.component';
import { CustomerLayoutComponent } from './customer-layout.component';
import { AuthGuard } from 'app/service/auth.guard';
import { Component } from '@angular/core';
import { BillingComponents } from 'app/Branch/billing/billing.component';

export const CustomerLayoutRoutes: Routes = [
    {
        path: '',
        component: CustomerLayoutComponent,
        canActivate: [AuthGuard],
        children: [
                { path: 'customer-dashboard',      component: CustomerDashboardComponent },
                { path: 'ShipingStatus',           component: CustReportComponent },
                { path: 'MIS',                     component: CustReportComponent },
                { path: 'Invoice',                 component: BillingComponents }

        ]
    }
]
