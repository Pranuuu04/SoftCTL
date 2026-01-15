// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuditService } from 'app/Branch/audit/audit.service';
import { PaymentFormComponent } from 'app/Branch/Shared/payment/payment-form/payment-form.component';
import { AllServicesService } from 'app/service/all-services.service';
import { PaymentService } from '../../payment.service';

@Component({
  selector: 'app-payment-entry-bill',
  templateUrl: './payment-entry-bill.component.html',
  styleUrls: ['./payment-entry-bill.component.css']
})
export class PaymentEntryBillComponent implements OnInit {

 sessionLocationCode: any;
   pageSizeOptions: number[] = [10,15, 50, 100, 1000];
   totalountPages: any;
   totalPending: number;
   showTable = false;
   length = 0;
   pageSize = 10;
   pageIndex = 0;
   pageNumber = 1;
   showFirstLastButtons = true;
   hidePageSize = false;
   disabled = false;
   pageCount = 0;
   pageEvent: PageEvent;
   showPageSizeOptions = false;
   dataSource: MatTableDataSource<any>;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   // displayedColumns: string[] = ['action', 'AwbNo', 'BookDate', 'CGSTAmt', 'ServiceTax', 'TotalAmt'];'SubTotal',
   displayedColumns: string[] = ['action','AwbNo','BookDate','SubTotal','SGSTAmt', 'TotalAmt','ReceivedAmt','Outstanding','Remark'];
 
   userType: any;
   selectedValue = 'All';
   fromDate: string;
   toDate: string;
   unbillData: any;
   currentDate1: string;
   currentDate2: string;
   sessionLocationName: string;
   filterForm!: FormGroup;
   customerList: any[] = [];
   rateViewData: any;
   selectedCustomerCode: any;
   AwbNo:any;
   billNo:any;
 

   constructor(private auditService: AuditService,
               public dialog: MatDialog,
               private snackBar: MatSnackBar,
               public formBuilder: FormBuilder,
               public AllService: AllServicesService,
               public paymentService: PaymentService
               ) {
                 this.fromDate = this.getDefaultDate();
                 this.toDate = this.getCurrentDate();
               }
 
   ngOnInit(): void {
 
     this.userType = localStorage.getItem('userType');
       this.currentDate1 = new Date().toISOString().split('T')[0];
        this.currentDate2 = new Date().toISOString().split('T')[0];
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
      ? localStorage.getItem('originCode')
      : localStorage.getItem('selectedValue');
       this.sessionLocationName = localStorage.getItem('originName');
 
       console.log(">>>>>>",this.sessionLocationCode)
 
     // this.AllService.getConsignerData(this.sessionLocationCode).subscribe((data: any) => {
     //   const allCust = { customerName: 'All', customerCode: 'All' };
     //         this.customerList = [allCust, ...data.Data];
     //       this.filterForm.patchValue({ CustomerName: 'All' });
     // });
 
       this.AllService.getAllCustomer('Customer',this.sessionLocationCode).subscribe((data: any) => {
           const allCust = { customerName: 'All', customerCode: 'All' };
               this.customerList = [allCust, ...data.Data];
               this.filterForm.patchValue({ CustomerName: 'All' });
         });
 
      this.filterForm = this.formBuilder.group({
     rateCustomer: ['All', Validators.required],
     fromDate: [this.currentDate1, Validators.required],
     toDate: [this.currentDate2, Validators.required],
     AwbNo:['']
   });
 
   }
 
   refresh() {}
 
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
   openSnackBar(message: string, panelClass: string) {
     this.snackBar.open(message, 'Close', {
       duration: 3000,
       horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass: [panelClass]
     });
   }
 
 calculatePageCount() {
       this.pageCount = Math.ceil(this.length / this.pageSize);
       console.log(this.pageCount, 'pageCount');
     }
 
   handlePageEvent(e: PageEvent) {
     this.pageSize = e.pageSize;
     this.pageIndex = e.pageIndex;
     this.pageNumber = this.pageIndex + 1;
       this.calculatePageCount();
     this.onFilterSubmit();
  }
 
 onFilterSubmit(): void {
 if (this.filterForm.valid) {
        const pageNumber = this.pageNumber;
        const pageSize = this.pageSize;
       const sessionLocationCode = this.sessionLocationCode;
       const customerCode = this.filterForm.get('rateCustomer')?.value;
       const fromDate = this.filterForm.get('fromDate')?.value;
       const toDate = this.filterForm.get('toDate')?.value;
       const AwbNo = this.filterForm.get('AwbNo')?.value;
       // const AwbNoValue = this.filterForm.get('AwbNo')?.value;
       // const AwbNo = AwbNoValue && AwbNoValue.trim() !== '' ? AwbNoValue.trim() : '';
       console.log("AwbNo>>>",AwbNo);
   this.paymentService.getCashToPay(AwbNo, customerCode,'', fromDate, toDate, pageNumber, pageSize)
     .subscribe((resp: any) => {
       if (resp.status === 1) {
         this.openSnackBar(resp.message, 'custom-snackbar');
         this.showTable = true;
         this.dataSource = resp.Data;
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
 
 
 openCashTopayForm(action: 'add' | 'edit', element?: any) {
 
   const dialogRef = this.dialog.open(PaymentFormComponent, {
     data: {
       action: 'paymentEntryBillAdd',
       mode: action,
       responseData: element,
       fromDate: this.fromDate,
       toDate: this.toDate,
       customerCode:this.filterForm.get('rateCustomer')?.value,
       CashPayReport:false
     },
     // width: '95rem',
     width: '85vw',
     maxWidth: '95vw',
     panelClass: 'cashTopay-dialog' ,
     disableClose: true
   });
 
   dialogRef.afterClosed().subscribe(res => {
     // if (res) {
       this.onFilterSubmit();
     // }
   });
 }
  
 
 applyFilter(filterValue: string) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
     }
   }

}
