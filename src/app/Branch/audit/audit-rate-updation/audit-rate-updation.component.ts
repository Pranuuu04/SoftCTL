import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BillingService } from 'app/Branch/billing/billing.service';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';
import { combineLatest } from 'rxjs';
import { AuditService } from '../audit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-audit-rate-updation',
  templateUrl: './audit-rate-updation.component.html',
  styleUrls: ['./audit-rate-updation.component.css']
})
export class AuditRateUpdationComponent implements OnInit {

  sessionLocationCode: any;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  totalountPages: any;
  totalPending: number;
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    'AwbNo', 'BookDate', 'ChargeableWt', 'RatePerKg', 'Rate',
    'FOVCharge', 'PackingCharge', 'DocketCharge', 'ENSCharge', 'SCCharge',
    'InsuranceCharge', 'FuelPer', 'FuelCharge', 'ESSPer', 'ESSCharge',
    'IDCPer', 'IDCCharge', 'CAFPer', 'CAFCharge', 'IGSTAmt', 'IGST',
    'SGST', 'SGSTAmt', 'CGST', 'CGSTAmt', 'ServiceTax', 'TotalAmt',
  ];

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

  constructor(private auditService: AuditService,
              private snackBar: MatSnackBar,
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
   this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');
      this.sessionLocationName = localStorage.getItem('originName');

    this.AllService.getConsignerData(this.sessionLocationCode).subscribe((data: any) => {
      const allCust = { customerName: 'All', customerCode: 'All' };
            this.customerList = [allCust, ...data.Data];
          this.filterForm.patchValue({ CustomerName: 'All' });
    });
     this.filterForm = this.formBuilder.group({
    rateCustomer: ['All', Validators.required],
    fromDate: [this.currentDate1, Validators.required],
    toDate: [this.currentDate2, Validators.required]
  });

  // this.RateUpdationTable(1, this.pageSize);
    this.dataSource = new MatTableDataSource<any>(this.rateViewData);

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
    const pageNumber = this.pageIndex + 1;
      this.calculatePageCount();
    this.RateUpdationTable(pageNumber, this.pageSize);
  }
  RateUpdationTable(pageNumber: number, pageSize: number) {
const sessionLocationCode = this.sessionLocationCode;
  const customerCode = this.filterForm.get('rateCustomer')?.value;
  const fromDate = this.filterForm.get('fromDate')?.value;
  const toDate = this.filterForm.get('toDate')?.value;
  this.auditService.RateUpdation(sessionLocationCode, customerCode, fromDate, toDate, pageNumber, pageSize)
    .subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.showTable = true;
        this.rateViewData = resp.data;
        this.dataSource.data = this.rateViewData;
        this.length = resp.count;
        this.calculatePageCount();
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
        this.showTable = false;
        this.rateViewData = [];
      }
    });
}
onFilterSubmit(): void {
if (this.filterForm.valid) {
    this.RateUpdationTable(1, this.pageSize);
  } else {
    this.filterForm.markAllAsTouched();
     this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
  }
}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // loadPage(event: any) {
  //   const pageNumber = event.pageIndex + 1;
  //   const pageSize = event.pageSize;
  //   this.RateUpdationTable(pageNumber, pageSize);
  // }
}
