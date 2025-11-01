import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentFormComponent } from 'app/Branch/Shared/payment/payment-form/payment-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { PaymentService } from '../../payment.service';

@Component({
  selector: 'app-wallet-entry',
  templateUrl: './wallet-entry.component.html',
  styleUrls: ['./wallet-entry.component.css']
})
export class WalletEntryComponent implements OnInit {

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
  displayedColumns: string[] = [ 'action', 'ID', 'Date', 'customerName', 'Amount', 'PaymentMode', 'Remark'];
  CreditViewData: any[] = [];

  constructor(public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public paymentService: PaymentService
              ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.CreditViewData);
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.WalletEntryData(this.pageIndex + 1, this.pageSize);
  }
 refresh() {
  }


  WalletEntryData(pageNumber: number, pageSize: number) {
     this.paymentService.getAndDeleteWallet(pageNumber, pageSize).subscribe((resp: any) => {
       if (resp.status === 1) {
         this.showTable = true;
         this.CreditViewData = resp.Data;
         this.dataSource.data = this.CreditViewData;
         this.length = resp.count;
         this.calculatePageCount();
       } else {
          this.showTable = false;
          this.CreditViewData = [];
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
    this.calculatePageCount();
  this.WalletEntryData(pageNumber, this.pageSize);
}

 openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

   deleteWalletEntry(element): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '22rem',
        data: { message: `Are you sure you want to delete the Wallet entry for ${element.ID}?` }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      this.paymentService.DeleteWallet(element.ID, element.CustomerCode).subscribe(
            (resp: any) => {
              if (resp.status === 1) {
                this.openSnackBar(resp.message, 'custom-snackbar');
                if (this.CreditViewData.length === 1 && this.pageIndex > 0) {
                  this.pageIndex--;
                }
                this.WalletEntryData(this.pageIndex + 1, this.pageSize);
              } else {
                // this.rateViewData = [];
                this.openSnackBar(resp.message, 'error-snackbar');
              }
            },
            (error) => {
              console.error('Error deleting credit note:', error);
              this.openSnackBar('Failed to delete Wallet entry', 'error-snackbar');
            }
          );
        }
      });
    }

  openWalletEntryForm(element) {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      data: {
        action: 'WalletEntryAdd',
        WalletEntryData: element,
      },
      width: '55rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {}
      this.WalletEntryData(this.pageIndex + 1, this.pageSize);
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
