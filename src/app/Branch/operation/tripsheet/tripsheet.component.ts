import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PendingTripsheetComponent } from './pending-tripsheet/pending-tripsheet.component';
import { TripImportComponent } from './trip-import/trip-import.component';
import { AssignTripComponent } from './assign-trip/assign-trip.component';

@Component({
  selector: 'app-tripsheet',
  templateUrl: './tripsheet.component.html',
  styleUrls: ['./tripsheet.component.css']
})
export class TripsheetComponent implements OnInit {

  // @ViewChild(TripImportComponent) private Import: TripImportComponent;
  // @ViewChild(PendingTripsheetComponent) private pending: PendingTripsheetComponent;
  // @ViewChild(AssignTripComponent) private Assign: AssignTripComponent;

  activeTab = 0;

@ViewChild('createTripRef') createTripRef: any;
@ViewChild('viewTripRef') viewTripRef: any;
@ViewChild('TripImportRef') TripImportRef: any;
@ViewChild('pendingTripRef') pendingTripRef: any;
@ViewChild('TripAssignRef') TripAssignRef: any;

  constructor() { }

  ngOnInit(): void {
  }

  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.TripImportRef.refresh();
        break;
      case 1:
        this.pendingTripRef.refresh();
        break;
      case 2:
        this.TripAssignRef.refresh();
        break;
    }
  }

   

  // onTabChange(index: number) {
  //   this.activeTab = index;
  // }

onEditTrip(data: any) {
 
  this.activeTab = 3;
  setTimeout(() => {
    this.createTripRef?.populateForm(data);
  }, 100);
}
}
