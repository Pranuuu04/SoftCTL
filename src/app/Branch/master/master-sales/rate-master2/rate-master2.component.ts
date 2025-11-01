import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SalesFormComponent } from 'app/Branch/Shared/master-model/sales-form/sales-form.component';
import { MasterService } from '../../master.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rate-master2',
  templateUrl: './rate-master2.component.html',
  styleUrls: ['./rate-master2.component.css']
})
export class RateMaster2Component implements OnInit {

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
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [ 'index', 'action', 'Club_No', 'Cust_Code',
    'Customer_Name',  'Country_Name',  'State_Name',  'Destination_Name',  'Mode_Name',  'Product_Name',
  'OriginName',  'Zone_Name'];
  rateViewData: any[] = [];

  constructor(public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public masterService: MasterService
              ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.rateViewData);
    this.sessionLocationCode = localStorage.getItem('originCode');
  }
 refresh() {
    this.rateData(this.pageIndex + 1, this.pageSize);
  }
calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
  handlePageEvent(e: PageEvent) {
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  const pageNumber = this.pageIndex + 1;
    this.calculatePageCount();
  this.rateData(pageNumber, this.pageSize);
}
  rateData(pageNumber: number, pageSize: number) {
     this.masterService.getRateMaster(pageNumber, pageSize).subscribe((resp: any) => {
       if (resp.status === 1) {
         this.showTable = true;
         this.rateViewData = resp.Data.rateMasterData;
         this.dataSource.data = this.rateViewData;
         this.length = resp.count;
         this.calculatePageCount();
       } else {
          this.showTable = false;
        }
     });
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
                this.rateData(this.pageIndex + 1, this.pageSize);
              } else {
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
        action: 'RateAdd2',
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
