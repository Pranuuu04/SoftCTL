import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusModule } from '../status/status.module';
import { DocketPrintComponent } from 'app/Branch/Shared/report_pages/docket-print/docket-print.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TripReportComponent } from '../trip-report/trip-report.component';
import { TripsheetRComponent } from '../trip-report/tripsheet-r/tripsheet-r.component';
import { ImageViewComponent } from '../trip-report/image-view/image-view.component';
import { TripArrivalComponent } from '../trip-report/trip-arrival/trip-arrival.component';
import { TripDetailsComponent } from '../trip-report/trip-details/trip-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserReportModule } from '../user-report/user-report.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TripCancelComponent } from '../trip-report/trip-cancel/trip-cancel.component';
import { InventryReportModule } from '../inventry-report/inventry-report.module';

@NgModule({
  declarations: [
    DocketPrintComponent,
    TripReportComponent,
    TripsheetRComponent,
    ImageViewComponent,
    TripArrivalComponent,
    TripDetailsComponent,
    TripCancelComponent
  ],
  imports: [
    CommonModule,
    StatusModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    UserReportModule,
    NgSelectModule,
    InventryReportModule
  ]
})
export class ReportsModule { }
