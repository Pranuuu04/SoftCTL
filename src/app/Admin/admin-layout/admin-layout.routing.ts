import { Routes } from '@angular/router';
import { AuthGuard } from 'app/service/auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout.component';

export const AdminLayoutRoutes: Routes = [
    // { path: 'dashboard',      component: DashboardComponent },    
    // { path: 'admin-user',      component: AdminUsermanagementComponent },    

    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],

        children: [
          {
            path: 'dashboard',      component: DashboardComponent 
          },
        
          ]}
    
];
