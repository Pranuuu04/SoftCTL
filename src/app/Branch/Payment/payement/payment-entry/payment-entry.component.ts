import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from 'app/Branch/master/master.service';
import { PaymentFormComponent } from 'app/Branch/Shared/payment/payment-form/payment-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { PaymentService } from '../../payment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-payment-entry',
  templateUrl: './payment-entry.component.html',
  styleUrls: ['./payment-entry.component.css']
})
export class PaymentEntryComponent implements OnInit {

    filterForm!: FormGroup;
    customerList: any[] = [];
    currentDate1: string;
    currentDate2: string;
    fromDate: string;
    toDate: string;
    userType: string;
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
  displayedColumns: string[] = [ 'action', 'Ref_No', 'Customer_Name', 'Bank_Name', 'CheqDt', 'RecvDt',
    'Amount_Type', 'ChequeNo', 'Recv_Name', 'TDS', 'Amount', 'Debit',
    'Remark', 'Deposit_Bank', 'UserName', 'BillPay'];
  entryViewData: any[] = [];



  constructor(public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public paymentService: PaymentService,
              public masterService: MasterService,
              public formBuilder: FormBuilder,
              public AllService: AllServicesService,
              ) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
      this.userType = localStorage.getItem('userType');
      this.currentDate1 = new Date().toISOString().split('T')[0];
      this.currentDate2 = new Date().toISOString().split('T')[0];
    this.dataSource = new MatTableDataSource<any>(this.entryViewData);
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.paymentEntryData(this.pageIndex + 1, this.pageSize);


    this.AllService.getConsignerData(this.sessionLocationCode).subscribe((data: any) => {
      const allCust = { customerName: 'All', customerCode: 'All' };
            this.customerList = [allCust, ...data.Data];
          this.filterForm.patchValue({ CustomerName: 'All' });
    });


    this.filterForm = this.formBuilder.group({
        customer: ['All', Validators.required],
        fromDate: [this.currentDate1, Validators.required],
        toDate: [this.currentDate2, Validators.required],
        AwbNo:['']
     });

  }
 refresh() {
  }

  getDefaultDate(): string {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.formatDate(firstDayOfMonth);
  }

  getCurrentDate(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  paymentEntryData(pageNumber: number, pageSize: number) {
     this.paymentService.receivedPayNotes(pageNumber, pageSize).subscribe((resp: any) => {
       if (resp.status === 1) {
         this.showTable = true;
         this.entryViewData = resp.Data;
         this.dataSource.data = this.entryViewData;
         this.length = resp.count;
         this.calculatePageCount();
       } else {
          this.showTable = false;
          this.entryViewData = [];
        }
     });
  }


onFilterSubmit(): void {
 if (this.filterForm.valid) {
       const pageNumber = this.pageIndex+1;
       const pageSize = this.pageSize;
      const sessionLocationCode = this.sessionLocationCode;
      const customerCode = this.filterForm.get('customer')?.value;
      const fromDate = this.filterForm.get('fromDate')?.value;
      const toDate = this.filterForm.get('toDate')?.value;
      const AwbNo = this.filterForm.get('AwbNo')?.value;
      // const AwbNoValue = this.filterForm.get('AwbNo')?.value;
      // const AwbNo = AwbNoValue && AwbNoValue.trim() !== '' ? AwbNoValue.trim() : '';
      console.log("AwbNo>>>",AwbNo);
  this.paymentService.getCashToPay(AwbNo, customerCode, fromDate, toDate, pageNumber, pageSize)
    .subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.showTable = true;
        // this.dataSource = resp.Data;
        this.length = resp.count;
        this.calculatePageCount();
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
        this.showTable = false;
      }
    });

  } else {
    this.filterForm.markAllAsTouched();
     this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
  }
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
  this.paymentEntryData(pageNumber, this.pageSize);
}



 openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

deletePayment(element): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '22rem',
        data: { message: `Are you sure you want to delete the entry for ${element.Ref_Club}?` }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      this.paymentService.deleteReceivedPay(element.Ref_Club).subscribe(
            (resp: any) => {
              if (resp.status === 1) {
                this.openSnackBar(resp.message, 'custom-snackbar');
                if (this.entryViewData.length === 1 && this.pageIndex > 0) {
                  this.pageIndex--;
                }
                this.paymentEntryData(this.pageIndex + 1, this.pageSize);
              } else {
                // this.entryViewData = [];
                this.openSnackBar(resp.message, 'error-snackbar');
              }
            },
            (error) => {
              console.error('Error deleting Rate:', error);
              this.openSnackBar('Failed to delete payment entry', 'error-snackbar');
            }
          );
        }
      });
    }

  openPaymentForm(element) {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      data: {
        action: 'paymentEntryAdd',
        paymentEntryData: element,
        paymentEntryEdit: 'edit'
      },
      width: '60rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {}
      this.paymentEntryData(this.pageIndex + 1, this.pageSize);
    });
  }

  downloadPdf(){
    
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
