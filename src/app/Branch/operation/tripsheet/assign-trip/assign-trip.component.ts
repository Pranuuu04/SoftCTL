import { Component, OnInit, ViewChild } from '@angular/core';
import { TripService } from '../trip.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TripformComponent } from 'app/Branch/Shared/tripmodel/tripform/tripform.component';
import { MatDialog } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-assign-trip',
  templateUrl: './assign-trip.component.html',
  styleUrls: ['./assign-trip.component.css']
})
export class AssignTripComponent implements OnInit {

  showTable = false;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['index', 'action', 'Customer_Name', 'supplierName',  'Date', 'OTR', 'LoadingIn', 'LoadingOut', 'DispatchTime', 'InTransit',  'Qty', 'OTA', 'StoreOutTime', 'Route',  'vehicleType'];
 length = 0;
  pageSize = 50;
  pageIndex = 0;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  pageCount = 0;
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  pageSizeOptions: number[] = [50, 100, 1000];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sessionLocationCode: string;
  CustomerList: any;
  customerSupplierFilter = '';
  routeFilter = '';
   searchTerm = '';
   searchSubject = new Subject<string>();
  constructor(public tripservice: TripService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              public httpService: AllServicesService) {

  }
  ngOnInit(): void {
  //    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
  //   const parsedFilter = JSON.parse(filter);

  //   const customerSupplierFilter = parsedFilter.customerSupplier.toLowerCase();
  //   const routeFilter = parsedFilter.route.toLowerCase();

  //   const customerMatch = data.Customer_Name?.toLowerCase().includes(customerSupplierFilter);
  //   const supplierMatch = data.supplierName?.toLowerCase().includes(customerSupplierFilter);

  //   const routeMatch = data.Route?.toLowerCase().includes(routeFilter);
  //   return (customerMatch || supplierMatch) && routeMatch;
  // };
   this.searchSubject
    .pipe(
      debounceTime(500),          // wait 500ms after last key press
      distinctUntilChanged()      // only call if term actually changed
    )
    .subscribe((term) => {
      this.searchTerm = term.trim().toLowerCase();
      this.pageIndex = 0;
      this.getTripSheetData(1, this.pageSize, this.searchTerm);
    });
  }
 refresh() {
    this.getTripSheetData(this.pageIndex + 1, this.pageSize, this.searchTerm);
  }
  openSnackBar(message: string, panelClass: string) {
     this.snackBar.open(message, 'Close', {
       duration: 3000,
       horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass: [panelClass]
     });
   }
// applyCustomerSupplierFilter(value: string) {
//   this.customerSupplierFilter = value.trim().toLowerCase();
//   this.updateFilter();
// }

// applyRouteFilter(value: string) {
//   this.routeFilter = value.trim().toLowerCase();
//   this.updateFilter();
// }

// updateFilter() {
//   this.dataSource.filter = JSON.stringify({
//     customerSupplier: this.customerSupplierFilter || '',
//     route: this.routeFilter || ''
//   });
// }

// applyFilter(filterValue: string) {
//   this.dataSource.filter = filterValue.trim().toLowerCase();
// }

  convertMinutesToTime(minutes: number): string {
    const date = new Date(0, 0, 0, 0, minutes);
    const hours = date.getHours();
    const mins = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const formatted = `${this.padZero(displayHours)}:${this.padZero(mins)} ${period}`;
    return formatted;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

   calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
  handlePageEvent(e: PageEvent) {
  this.length = e.length;
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  const pageNumber = this.pageIndex + 1;
    this.calculatePageCount();
  this.getTripSheetData(pageNumber, this.pageSize, this.searchTerm);
}
  getTripSheetData(pageNumber: number, pageSize: number, searchTerm: string): void {
    this.tripservice.getPendingTrips(pageNumber, pageSize, searchTerm).subscribe({
      next: (res) => {
        if (res.status === 1) {
          this.dataSource.data = res.Data;
          this.length = res.count;
          this.showTable = true;
          this.calculatePageCount();
        } else {
          this.dataSource.data = [];
          this.length = 0;
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.showTable = false;
      }
    });
  }

   openTripForm(element?: any) {
      const dialogRef = this.dialog.open(TripformComponent, {
        data: {
          action: 'addTrip',
          Customer_Name: element?.Customer_Name,
          Customer_Code: element?.Customer_Code,
          Date: element?.Date,
          Route: element?.Route,
          supplierName: element?.supplierCode,
          OTA: element?.OTA,
          OTR: element?.OTR,
          QT: element.Qty,
          ID: element.ID,
          LoadingIn: element?.LoadingIn,
          LoadingOut: element?.LoadingOut,
          InTransit: element?.InTransit,
          DispatchTime: element?.DispatchTime,
          StoreOutTime: element?.StoreOutTime,
        },
        width: '75rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        this.getTripSheetData(this.pageIndex + 1, this.pageSize, this.searchTerm);
        if (res) {
        }
      });
    }
cancelTripApi(id: number, reason: string): void {
  this.tripservice.cancelTrip(id, reason).subscribe({
    next: (res: any) => {
      if (res.status === 1) {
        this.openSnackBar(res.message, 'custom-snackbar');
        this.getTripSheetData(this.pageIndex + 1, this.pageSize, this.searchTerm);
      } else {
        this.openSnackBar(res.message, 'error-snackbar');
      }
    },
    error: (err) => {
      this.openSnackBar('Error cancelling trip. Please try again.', 'error-snackbar');
    }
  });
}
 applySearch(value: string) {
  this.searchSubject.next(value);
  }
confirmCancelTrip(element: any): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '30rem',
    data: {
      message: `Please enter the reason for canceling trip ${element.ID}`,
      inputRequired: true,
      confirmButtonText: 'Cancel Trip',
      cancelButtonText: 'Close'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (typeof result === 'string' && result.trim()) {
      const reason = result.trim();
      this.cancelTripApi(element.ID, reason);
    } else if (result === '') {
      this.openSnackBar('Cancellation reason is required.', 'error-snackbar');
    } else {
      this.openSnackBar('Trip cancellation canceled', 'error-snackbar');
    }
  });
}

}
