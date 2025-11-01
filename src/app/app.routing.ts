import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { AuthGuard } from './service/auth.guard';
import { BranchDashboardComponent } from './Branch/dashboard/dashboard.component';
import { BranchLayoutComponent } from './Branch/branch-layout/branch-layout.component';
import { CustomerLayoutComponent } from './Customer/customer-layout/customer-layout.component';
import { CustomerDashboardComponent } from './Customer/dashboard/dashboard.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./Authentication/login/login.module').then(m => m.LoginModule),
  },

  {
    path: 'Admin',
    canActivate: [AuthGuard], 
    component: AdminLayoutComponent,
    children: [{
    path :  'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], 

    }],
  },

  {
    path: 'Branch',
    canActivate: [AuthGuard], 
    component: BranchLayoutComponent,
    children: [ {
      path: 'branch-dashboard',
      component: BranchDashboardComponent,
      canActivate: [AuthGuard], 
    },],
  },

  {
    path: 'Customer',
    canActivate: [AuthGuard], 
    component : CustomerLayoutComponent,
    children: [{
      path: 'customer-dashboard',
      component: CustomerDashboardComponent,
      canActivate: [AuthGuard], 
    }],
  },
 
  {
    path: 'frenchisee',
    children: [{
      path: '',
      loadChildren: () => import('./Frenchisee/frenchisee-layout/frenchisee-layout.module').then(m => m.FrenchiseeLayoutModule)
    }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
