import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuditService } from 'app/Branch/audit/audit.service';
import { AllServicesService } from 'app/service/all-services.service';
import { MasterService } from '../../master.service';
import { environment } from 'environments/environment.prod';
import * as XLSX from 'xlsx';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-rate-print',
  templateUrl: './rate-print.component.html',
  styleUrls: ['./rate-print.component.css']
})
export class RatePrintComponent implements OnInit {

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
  displayedColumns: string[] = [ 'srNo', 'OriginName', 'DestinationName', 'ModeName', 'ProductName', 'ZoneName', 'FlightName', 'LowerWt', 'UpperWt', 'Rate', 'ActiveDate', 'ClosingDate'
  ];

  userType: any;
  selectedValue = 'All';
  fromDate: string;
  toDate: string;
  unbillData: any;
  ClientLogo: string;
  // currentDate2: string;
  sessionLocationName: string;
  filterForm!: FormGroup;
  customerList: any[] = [];
  rateViewData: any;
  selectedCustomerCode: any;

  constructor(private masterService: MasterService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              public formBuilder: FormBuilder,
              public AllService: AllServicesService,
              ) {
                // this.fromDate = this.getDefaultDate();
                // this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.ClientLogo =  localStorage.getItem('ClientLogo');

    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
      ? localStorage.getItem('originCode')
      : localStorage.getItem('selectedValue');
      this.sessionLocationName = localStorage.getItem('originName');

    this.masterService.getCustomerData(this.sessionLocationCode).subscribe((data: any) => {
        this.customerList = data.Data;
    });
     this.filterForm = this.formBuilder.group({
      rateCustomer: ['', Validators.required],
    });

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
    this.RatePrintTable(pageNumber, this.pageSize);
  }
  RatePrintTable(pageNumber: number, pageSize: number) {
  const customerCode = this.filterForm.get('rateCustomer')?.value;

  if (!customerCode) {
    this.openSnackBar('Please select a customer.', 'error-snackbar');
    return;
  }
this.masterService.getRatePrint('Data', customerCode, pageNumber, pageSize, '').subscribe({
    next: (resp: any) => {
      if (resp.status === 1) {
        this.showTable = true;
        this.rateViewData = resp.Data ;
        this.dataSource.data = this.rateViewData;
        this.length = resp.count;
        this.calculatePageCount();
        this.openSnackBar(resp.message, 'custom-snackbar');
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
        this.showTable = false;
        this.rateViewData = [];
      }
    },
    error: (err) => {
      this.openSnackBar('Failed to fetch rate data.', 'error-snackbar');
      console.error('API error:', err);
    },
  });
}
downloadRatePdf() {
  const customerCode = this.filterForm.get('rateCustomer')?.value;
  const pageNumber = this.pageIndex + 1;
  const apiUrl = `${environment.apiUrl}Master/RatePrint?inputName=Print&CustomerCode=${customerCode}&pageNumber=${pageNumber}&pageSize=${this.length}&logolink=${encodeURIComponent(this.ClientLogo)}`;
  window.open(apiUrl, '_blank');
}

onFilterSubmit(): void {
if (this.filterForm.valid) {
    this.RatePrintTable(1, this.pageSize);
  } else {
    this.filterForm.markAllAsTouched();
     this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
  }
}
 openprogressbar(): MatDialogRef<ProgressBarComponent> {
    const dialogRef = this.dialog.open(ProgressBarComponent, {
      data: {
          action: 'docketPrint',
      },
        width: '30rem',
        disableClose: true,
      });
      return dialogRef;
    }
downloadRateExcel() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '25rem',
    data: { message: 'Are you sure you want to download the Excel file?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const customerCode = this.filterForm.get('rateCustomer')?.value;

      if (!customerCode) {
        this.openSnackBar('Please select a customer.', 'error-snackbar');
        return;
      }

      const progressBar = this.openprogressbar();

      this.masterService.getRatePrint('Data', customerCode, 1, this.length, '').subscribe({
        next: (resp: any) => {
          if (resp.status === 1 && resp.Data?.length > 0) {
            const dataForExcel = resp.Data.map((element: any, index: number) => ({
              'Sr No': index + 1,
              'Origin': element.OriginName,
              'Destination': element.DestinationName,
              'Mode': element.ModeName,
              'Product': element.ProductName,
              'Zone': element.ZoneName,
              'Flight Name': element.FlightName,
              'Lower Wt': element.LowerWt,
              'Upper Wt': element.UpperWt,
              'Rate': element.Rate,
              'Active Date': element.ActiveDate,
              'Closing Date': element.ClosingDate
            }));

            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'RateSheet');
            XLSX.writeFile(wb, 'CustomerRateList.xlsx');

            this.openSnackBar('Excel downloaded successfully!', 'custom-snackbar');
          } else {
            this.openSnackBar('No data found to download.', 'error-snackbar');
          }
          progressBar.close();
        },
        error: (err) => {
          console.error('Excel download error:', err);
          this.openSnackBar('Failed to download Excel file.', 'error-snackbar');
          progressBar.close();
        }
      });
    } else {
      this.openSnackBar('Download canceled', 'error-snackbar');
    }
  });
}


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
