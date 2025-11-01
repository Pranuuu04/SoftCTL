import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImportTabComponent } from './import-tab/import-tab.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BookingTabComponent } from './booking-tab/booking-tab.component';
import { EShipAPIComponent } from './e-ship-api/e-ship-api.component';
import { FtlTabComponent } from './ftl-tab/ftl-tab.component';
import { FastEntryTabComponent } from './fast-entry-tab/fast-entry-tab.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

@ViewChild(BookingTabComponent) private Booking: BookingTabComponent;
@ViewChild(EShipAPIComponent) private EShipAPI: EShipAPIComponent;
@ViewChild(FtlTabComponent) private FTL: FtlTabComponent;
@ViewChild(FastEntryTabComponent) private fastEntry: FastEntryTabComponent;
  private isBookingDataLoaded = false;
  private isFTLDataLoaded = false;
  private isEShipAPIDataLoaded = false;
  private isFastEntryDataLoaded = false;


constructor(public dialog: MatDialog
            ) {}
 
ngOnInit(): void {}
tabChanged(event: number): void {
  switch (event) {
    case 0: // Booking Tab
      if (!this.isBookingDataLoaded) {
        this.Booking.refresh();
        this.isBookingDataLoaded = true;
      }
      break;
    case 1:
      this.importModal();
      break;
    case 2:
      if (!this.isEShipAPIDataLoaded) {
        this.EShipAPI.refresh();
        this.isEShipAPIDataLoaded = true;
      }
      break;
    case 3:
      if (!this.isFastEntryDataLoaded) {
        this.fastEntry.refresh();
        this.isFastEntryDataLoaded = true;
      }
      break;
  }
}
// tabChanged(event: number): void {
//   switch (event) {
//     case 0: // Booking Tab
//       if (!this.isBookingDataLoaded) {
//         this.Booking.refresh();
//         this.isBookingDataLoaded = true; // Set to true after data is loaded
//       }
//       break;
//     case 1: // Import Tab
//       this.importModal();
//       break;
//     case 2: // FTL Tab
//       if (!this.isFTLDataLoaded) {
//         this.FTL.refresh();
//         this.isFTLDataLoaded = true;
//       }
//       break;
//     case 3: // E-Ship-API Tab
//       if (!this.isEShipAPIDataLoaded) {
//         this.EShipAPI.refresh();
//         this.isEShipAPIDataLoaded = true;
//       }
//       break;
//     case 4: // Fast Entry Tab
//       if (!this.isFastEntryDataLoaded) {
//         this.fastEntry.refresh();
//         this.isFastEntryDataLoaded = true;
//       }
//       break;
//   }
// }
importModal() {
  const dialogRef = this.dialog.open(ImportTabComponent, {
    data: {
      action: 'add'
    },
    width: '35rem',
    disableClose: true
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res) {
    }
  });
}
}
