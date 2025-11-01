import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TripService } from '../trip.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripformComponent } from 'app/Branch/Shared/tripmodel/tripform/tripform.component';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-pending-tripsheet',
  templateUrl: './pending-tripsheet.component.html',
  styleUrls: ['./pending-tripsheet.component.css']
})

export class PendingTripsheetComponent implements OnInit {

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
  customerSupplierFilter = '';
  routeFilter = '';
   searchTerm = '';
      searchSubject = new Subject<string>();
  constructor(public tripservice: TripService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

      this.searchSubject
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((term) => {
          this.searchTerm = term.trim().toLowerCase();
          this.pageIndex = 0;
          this.getTripSheetData(1, this.pageSize, this.searchTerm);
        });
  //  this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
  //   const parsedFilter = JSON.parse(filter);

  //   const customerSupplierFilter = parsedFilter.customerSupplier.toLowerCase();
  //   const routeFilter = parsedFilter.route.toLowerCase();

  //   const customerMatch = data.Customer_Name?.toLowerCase().includes(customerSupplierFilter);
  //   const supplierMatch = data.supplierName?.toLowerCase().includes(customerSupplierFilter);

  //   const routeMatch = data.Route?.toLowerCase().includes(routeFilter);
  //   return (customerMatch || supplierMatch) && routeMatch;
  // };
  }

 refresh() {
  this.getTripSheetData(this.pageIndex + 1, this.pageSize, this.searchTerm);
  }
   applySearch(value: string) {
  this.searchSubject.next(value);
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
          this.showTable = true;
          this.length = res.count;
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
            action: 'editTrip',
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

}
