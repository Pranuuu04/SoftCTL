import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SalesFormComponent } from 'app/Branch/Shared/master-model/sales-form/sales-form.component';
import { MasterService } from '../../master.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-sale-consignor',
  templateUrl: './sale-consignor.component.html',
  styleUrls: ['./sale-consignor.component.css']
})
export class SaleConsignorComponent implements OnInit {

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
  displayedColumns: any[] = [ 'index', 'action', 'Customer_Code', 'Customer_Name', 'LocationName', 'GSTNo', 'T_Flag', 'Customer_Pin',
    'Destination_Name', 'State_Name', 'Client_Status'];
  customerViewData: any[] = [];
  searchValue: string = ''; 
  searchSubject = new Subject<string>();

  constructor(public dialog: MatDialog,
              public masterService: MasterService,
              public snackBar: MatSnackBar
              ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.customerViewData);
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.customerData(this.pageIndex + 1, this.pageSize);
    this.searchSubject
  .pipe(
    debounceTime(500),
    distinctUntilChanged()
  )
  .subscribe(searchTerm => {
    this.searchValue = searchTerm;
    this.pageIndex = 0;
    this.customerData(1, this.pageSize, searchTerm);
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
  this.customerData(pageNumber, this.pageSize, searchValue);
}

  customerData(pageNumber: number, pageSize: number, Search: string = this.searchValue ) {
     this.masterService.getCustomer(this.sessionLocationCode, Search, pageNumber, pageSize).subscribe((resp: any) => {
       if (resp.status === 1) {
         this.showTable = true;
         this.customerViewData = resp.Data.customerDetails;
         this.dataSource.data = this.customerViewData;
          this.length = resp.count;
          this.calculatePageCount();
       } else {
          this.showTable = false;
          this.customerViewData = []
        }
     });
  }
  refresh() {
   this.customerData(this.pageIndex + 1, this.pageSize);
  }
  openSnackBar(message: string, panelClass) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      });
    }
     deleteCustomer(element): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '22rem',
          data: { message: `Are you sure you want to delete this ${element.Customer_Name}?` }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.masterService.deleteCustomer(element.Customer_Code).subscribe(
              (resp: any) => {
                if (resp.status === 1) {
                  this.openSnackBar(resp.message, 'custom-snackbar');
                  this.customerData(this.pageIndex + 1, this.pageSize);
                } else {
                  // this.customerViewData = [];
                  this.openSnackBar(resp.message, 'error-snackbar');
                }
              },
              (error) => {
                console.error('Error deleting customer:', error);
                this.openSnackBar('Failed to delete customer', 'error-snackbar');
              }
            );
          }
        });
      }

  openConsignorForm(element) {
    const dialogRef = this.dialog.open(SalesFormComponent, {
      data: {
        action: 'ConsignorAdd',
        ConsignorData: element,
        ConsignorEdit: 'edit'
      },
      width: '95rem',
      maxWidth: '95%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
     this.customerData(this.pageIndex + 1, this.pageSize);

    });
  }
  applyFilter(filterValue: string) {
    const pageNumber = 1; // reset to first page when searching
  this.pageIndex = 0;
  this.customerData(pageNumber, this.pageSize, filterValue.trim());
  }

}
