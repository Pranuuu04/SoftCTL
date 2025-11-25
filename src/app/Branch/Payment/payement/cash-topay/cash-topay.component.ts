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
  selector: 'app-cash-topay',
  templateUrl: './cash-topay.component.html',
  styleUrls: ['./cash-topay.component.css']
})
export class CashTopayComponent implements OnInit {

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

  //  allData = [
  //   {AwbNo: 'AWB1001',BookDate: '2025-10-01',SubTotal: 1200,CGSTAmt: 60,TotalAmt: 1320,ReceivedAmt: 1000,Outstanding: 320,Remark: 'Delivered'},
  //   {AwbNo: 'AWB1002',BookDate: '2025-10-02',SubTotal: 800,CGSTAmt: 40,TotalAmt: 880,ReceivedAmt: 880,Outstanding: 0,Remark: 'Paid'},
  //   {AwbNo: 'AWB1003',BookDate: '2025-10-03',SubTotal: 950,CGSTAmt: 47.5,TotalAmt: 997.5,ReceivedAmt: 500, Outstanding: 497.5,Remark: 'Pending'},
  //   {AwbNo: 'AWB1004',BookDate: '2025-10-05',SubTotal: 1500,CGSTAmt: 75,TotalAmt: 1575,ReceivedAmt: 1500,Outstanding: 75,Remark: 'Delivered'},
  //   {AwbNo: 'AWB1005',BookDate: '2025-10-06',SubTotal: 2000,CGSTAmt: 100,TotalAmt: 2100,ReceivedAmt: 0,Outstanding: 2100,Remark: 'Unpaid'}
  // ];

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
  this.paymentService.getCashToPay(AwbNo, customerCode, fromDate, toDate, pageNumber, pageSize)
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
      action: 'CashTopayEntry',
      mode: action,
      responseData: element,
      fromDate: this.fromDate,
      toDate: this.toDate,
      customerCode:this.filterForm.get('rateCustomer')?.value,
      CashPayReport:false
    },
    // width: '95rem',
    width: '95vw',
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
