import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingTabComponent } from './booking-tab/booking-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { BookingComponent } from './booking.component';
import { ImportTabComponent } from './import-tab/import-tab.component';
import { InternationalComponent } from './international/international.component';
import { FastEntryTabComponent } from './fast-entry-tab/fast-entry-tab.component';
import { LabelComponent } from 'app/Branch/Shared/label/label.component';
import { PrintBookingComponent } from './print-booking/print-booking.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { ActiveCustomerComponent } from 'app/Branch/Shared/Shipper/active-customer.component';
import { ConsignerComponent } from 'app/Branch/Shared/consigner/consigner.component';
import { CustTypeAddComponent } from 'app/Branch/Shared/cust-type-add/cust-type-add.component';
import { VendorboxComponent } from 'app/Branch/Shared/vendorbox/vendorbox.component';
import { VendorComponent } from 'app/Branch/Shared/vendor/vendor.component';
import { OtherFeatureComponent } from 'app/Branch/Shared/other-feature/other-feature.component';
import { VehicleComponent } from 'app/Branch/Shared/vehicle/vehicle.component';
import { InvoiceValComponent } from 'app/Branch/Shared/invoiceVal/invoice-val.component';
import { VolumetricComponent } from 'app/Branch/Shared/volumetric/volumetric.component';
import { BluedartComponent } from 'app/Branch/Shared/bluedart/bluedart.component';
import { DepartmentComponent } from 'app/Branch/Shared/department/department.component';
import { GstBookingComponent } from 'app/Branch/Shared/GST/gst-booking/gst-booking.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { ErrorLogModalComponent } from 'app/Branch/Shared/error-log-modal/error-log-modal.component';
import { ErrorlogWithoutComponent } from 'app/Branch/Shared/errorlog-without/errorlog-without.component';
import { FtlTabComponent } from './ftl-tab/ftl-tab.component';
import { EShipAPIComponent } from './e-ship-api/e-ship-api.component';
import { PerformaInvoiceComponent } from 'app/Branch/Shared/performa-invoice/performa-invoice.component';
import { Booking2Component } from './booking2/booking2.component';
import { BookPrintComponent } from 'app/Branch/Shared/book-print/book-print.component';



@NgModule({
  declarations: [
    BookingComponent,
    BookingTabComponent,
    ImportTabComponent,
    InternationalComponent,
    FastEntryTabComponent,
    LabelComponent,
    PrintBookingComponent,
    ActiveCustomerComponent,
    ConsignerComponent,
    CustTypeAddComponent,
    VendorboxComponent,
    VendorComponent,
    OtherFeatureComponent,
    VehicleComponent,
    InvoiceValComponent,
    VolumetricComponent,
    BluedartComponent,
    DepartmentComponent,
    GstBookingComponent,
    // ConsigneeComponent
    GstBookingComponent,
    ErrorLogModalComponent,
    ErrorlogWithoutComponent,
    FtlTabComponent,
    EShipAPIComponent,
    PerformaInvoiceComponent,
    Booking2Component,
    BookPrintComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class BookingModule { }
