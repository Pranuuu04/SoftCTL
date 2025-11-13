import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SalesFormComponent } from 'app/Branch/Shared/master-model/sales-form/sales-form.component';
import { MasterService } from '../../master.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-sales-rate',
  templateUrl: './sales-rate.component.html',
  styleUrls: ['./sales-rate.component.css']
})
export class SalesRateComponent implements OnInit {

  sessionLocationCode: any;
  showTable = false;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
   pageCount = 0;
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  dataSource: MatTableDataSource<any>;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [ 'index', 'action', 'Club_No', 'Cust_Code',
    'Customer_Name',  'Country_Name',  'State_Name',  'Destination_Name',  'Mode_Name',  'Product_Name',
  'OriginName',  'Zone_Name'];
  rateViewData: any[] = [];
  searchSubject = new Subject<string>();
  searchValue: string = '';
  constructor(public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public masterService: MasterService
              ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.rateViewData);
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.searchValue = searchTerm;
        this.pageIndex = 0;
        this.rateData(1, this.pageSize, searchTerm);
      });
  }
 refresh() {
    this.rateData(this.pageIndex + 1, this.pageSize);
  }

  rateData(pageNumber: number, pageSize: number, Search: string = this.searchValue) {
    this.masterService.getRateMaster(this.sessionLocationCode, Search, pageNumber, pageSize).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.showTable = true;
        this.rateViewData = resp.Data.rateMasterData;
        this.dataSource.data = this.rateViewData;
        this.length = resp.count;
        this.calculatePageCount();
      } else {
          this.showTable = false;
          this.rateViewData = [];
        }
     });
  }
  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
  handlePageEvent(e: PageEvent) {
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  const pageNumber = this.pageIndex + 1;
  const searchValue = (document.getElementById('Filter') as HTMLInputElement)?.value || '';

    this.calculatePageCount();
  this.rateData(pageNumber, this.pageSize);
}

 openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
   deleteRate(element): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '22rem',
        data: { message: `Are you sure you want to delete this ${element.Club_No}?` }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.masterService.deleteRateMaster(element.Club_No).subscribe(
            (resp: any) => {
              if (resp.status === 1) {
                this.openSnackBar(resp.message, 'custom-snackbar');
                if (this.rateViewData.length === 1 && this.pageIndex > 0) {
                  this.pageIndex--;
                }
                this.rateData(this.pageIndex + 1, this.pageSize);
              } else {
                // this.rateViewData = [];
                this.openSnackBar(resp.message, 'error-snackbar');
              }
            },
            (error) => {
              console.error('Error deleting Rate:', error);
              this.openSnackBar('Failed to delete Rate', 'error-snackbar');
            }
          );
        }
      });
    }

  openRateForm(element) {
    const dialogRef = this.dialog.open(SalesFormComponent, {
      data: {
        action: 'RateAdd',
        RateData: element,
        RateEdit: 'edit'
      },
      width: '95rem',
      maxWidth: '95%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {}
      this.rateData(this.pageIndex + 1, this.pageSize);
    });
  }
 applyFilter(filterValue: string) {
    const pageNumber = 1;
  this.pageIndex = 0;
  this.rateData(pageNumber, this.pageSize, filterValue.trim());
  }


}
