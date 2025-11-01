import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscanModule } from '../inscan/inscan.module';
import { PickUpModule } from '../pick-up/pick-up.module';
import { PodUpdateModule } from '../pod-update/pod-update.module';
import { RunSheetModule } from '../run-sheet/run-sheet.module';
import { TripsheetModule } from '../tripsheet/tripsheet.module';
import { ManifestModule } from '../manifest/manifest.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { DirectPodModule } from './direct-pod/direct-pod.module';
import { DirectRunsheetModule } from '../direct-runsheet/direct-runsheet.module';
import { StatusEntryModule } from '../status-entry/status-entry.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingModule } from '../Booking/booking.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RunSheetModule,
    InscanModule,
    PickUpModule,
    PodUpdateModule,
    DirectPodModule,
    TripsheetModule,
    ManifestModule,
    StatusEntryModule,
    BookingModule,
    MatFormFieldModule, 
    HttpClientModule,
    DirectRunsheetModule,
    ReactiveFormsModule
  ]
})
export class OperationModule { }
