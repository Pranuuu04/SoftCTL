import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../payment.service';
import { PaymentFormComponent } from 'app/Branch/Shared/payment/payment-form/payment-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from 'app/Branch/master/master.service';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.css']
})
export class CreditNoteComponent implements OnInit {

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
  displayedColumns: string[] = [ 'action', 'NoteNo', 'NoteDate', 'Customer_Name', 'Particulars', 'Remark', 'Amount'];
  CreditViewData: any[] = [];

  constructor(public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public paymentService: PaymentService,
              public masterService: MasterService
              ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.CreditViewData);
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.CreditNotesData(this.pageIndex + 1, this.pageSize);
  }
 refresh() {
  }


  CreditNotesData(pageNumber: number, pageSize: number) {
     this.paymentService.getCreditNotes(pageNumber, pageSize).subscribe((resp: any) => {
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
  this.CreditNotesData(pageNumber, this.pageSize);
}

 openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

   deleteCredit(element): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '22rem',
        data: { message: `Are you sure you want to delete the credit note for ${element.NoteNo}?` }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      this.paymentService.deleteCreditNote(element.NoteNo).subscribe(
            (resp: any) => {
              if (resp.status === 1) {
                this.openSnackBar(resp.message, 'custom-snackbar');
                if (this.CreditViewData.length === 1 && this.pageIndex > 0) {
                  this.pageIndex--;
                }
                this.CreditNotesData(this.pageIndex + 1, this.pageSize);
              } else {
                // this.rateViewData = [];
                this.openSnackBar(resp.message, 'error-snackbar');
              }
            },
            (error) => {
              console.error('Error deleting credit note:', error);
              this.openSnackBar('Failed to delete credit note', 'error-snackbar');
            }
          );
        }
      });
    }

  openCreditForm(element) {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      data: {
        action: 'CreditNoteAdd',
        CreditNotesData: element,
        CreditNotesEdit: 'edit'
      },
      width: '55rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {}
      this.CreditNotesData(this.pageIndex + 1, this.pageSize);
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
