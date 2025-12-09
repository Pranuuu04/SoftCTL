import { CommonInterceptor } from './service/common.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from './Comman/Components.module';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { BranchLayoutComponent } from './Branch/branch-layout/branch-layout.component';
import { LoginModule } from './Authentication/login/login.module';
import { BranchLayoutModule } from './Branch/branch-layout/branch-layout.module';
import { CustomerLayoutComponent } from './Customer/customer-layout/customer-layout.component';
import { FrenchiseeLayoutModule } from './Frenchisee/frenchisee-layout/frenchisee-layout.module';
import { ConsignerCreditComponent } from './Branch/Shared/credit pages/consigner/consigner.component';
import { GenerateBulkComponent } from './Branch/Shared/pick-up/generate-bulk/generate-bulk.component';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportBookingComponent } from './Branch/reports/report-booking/report-booking.component';
import { ChecklistComponent } from './Branch/reports/report-booking/checklist/checklist.component';
import { ServicesComponent } from './Branch/reports/report-booking/services/services.component';
import { StatementComponent } from './Branch/reports/report-booking/statement/statement.component';
import { AdminLayoutModule } from './Admin/admin-layout/admin-layout.module';
import { CustBookingComponent } from './Customer/cust-booking/cust-booking.component';
import { ConfirmationDialogComponent } from './Comman/confirmation-dialog/confirmation-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnableLabelComponent } from './Branch/Shared/enable-label/enable-label.component';
import { ConsigneeComponent } from './Branch/Shared/consignee/consignee.component';
import { MaterialModule } from './angularMaterial/angularMaterial';
import { CustomerLayoutModule } from './Customer/customer-layout/customer-layout.module';
import { AuthUserComponent } from './Branch/user-management/auth-user/auth-user.component';
import { ViewUserComponent } from './Branch/user-management/view-user/view-user.component';
import { UserComponent } from './Branch/user-management/user/user.component';
import { UsermanagementBookingComponent } from './Branch/Shared/usermanagement-booking/usermanagement-booking.component';
import { DispatchedComponent } from './Branch/operation/dispatched/dispatched.component';
import { PendingDispatchedComponent } from './Branch/operation/dispatched/pending-dispatched/pending-dispatched.component';
import { ViewDispatchedComponent } from './Branch/operation/dispatched/view-dispatched/view-dispatched.component';
import { CreateDispatchedComponent } from './Branch/operation/dispatched/create-dispatched/create-dispatched.component';
import { BookMultiplePrintComponent } from './Branch/Shared/book-multiple-print/book-multiple-print.component';
import { AddDispatchComponent } from './Branch/Shared/dispatch_pages/add-dispatch/add-dispatch.component';
import { DocketMultipleComponent } from './Branch/Shared/docket-multiple/docket-multiple.component';
import { BillingPrintComponent } from './Branch/Shared/billing/billing-print/billing-print.component';
import { InvoiceDescriptionComponent } from './Branch/Shared/billing/invoice-description/invoice-description.component';
import { AddBillingComponent } from './Branch/Shared/billing/billing-print/add-billing/add-billing.component';
import { DeleteBillComponent } from './Branch/Shared/billing/billing-print/delete-bill/delete-bill.component';
import { ConsignorMastComponent } from './Branch/Shared/master-model/consignor-mast/consignor-mast.component';
import { ContactDetailsComponent } from './Branch/Shared/master-model/contact-details/contact-details.component';
import { DrsBulkComponent } from './Branch/Shared/Runsheet-pages/drs-bulk/drs-bulk.component';
import { VolumatricReportComponent } from './Branch/reports/report-booking/volumatric-report/volumatric-report.component';
import { TripCancelComponent } from './Branch/reports/trip-report/trip-cancel/trip-cancel.component';
import { SetupReportComponent } from './Branch/Shared/report_pages/setup-report/setup-report.component';
import { InventryReportComponent } from './Branch/reports/inventry-report/inventry-report.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    MaterialModule,
    LoginModule,
    AdminLayoutModule,
    BranchLayoutModule,
    CustomerLayoutModule,
    FrenchiseeLayoutModule,
    NgxPaginationModule,
    NgSelectModule,
    ComponentsModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    BranchLayoutComponent,
    CustomerLayoutComponent,
    ConsignerCreditComponent,
    GenerateBulkComponent,
    ReportBookingComponent,
    ChecklistComponent,
    ServicesComponent,
    StatementComponent,
    VolumatricReportComponent,
    CustBookingComponent,
    ConfirmationDialogComponent,
    EnableLabelComponent,
    ConsigneeComponent,
    AuthUserComponent,
    ViewUserComponent,
    UserComponent,
    UsermanagementBookingComponent,
    DispatchedComponent,
    PendingDispatchedComponent,
    ViewDispatchedComponent,
    CreateDispatchedComponent,
    BookMultiplePrintComponent,
    AddDispatchComponent,
    DocketMultipleComponent,
    BillingPrintComponent,
    InvoiceDescriptionComponent,
    AddBillingComponent,
    DeleteBillComponent,
    ConsignorMastComponent,
    ContactDetailsComponent,
    DrsBulkComponent,
    SetupReportComponent,
  ],
  providers: [DatePipe ,
    {provide: HTTP_INTERCEPTORS , useClass : CommonInterceptor ,  multi : true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
