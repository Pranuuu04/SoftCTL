import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TripService } from 'app/Branch/operation/tripsheet/trip.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';

@Component({
  selector: 'app-trip-cancel',
  templateUrl: './trip-cancel.component.html',
  styleUrls: ['./trip-cancel.component.css']
})
export class TripCancelComponent implements OnInit {

  originName: string;
  createForm: FormGroup;
  validationMessage: any = [];
  DestinationName: any[];
  sessionLocationCode: string;
  customerName: any;
  VehicleNo: any;
  listData: any = [];
  showTable = false;
  vehicleNumbers: string[] = [];
  selectedType = 'Self';
  tripsheet: any;
  userType: any;
  destinationName: any = 'All';
  CustomerList: any;
  customerForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['index', 'Customer_Name', 'Date', 'Route', 'ReportingTime', 'Qty',  'storeIn', 'vehicleType', 'Shipper_Name', 'LoadingIn', 'LoadingOut', 'InTransit', 'storeOut', 'DispatchTime', 'Reason', 'Remark'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  length = 0;
 pageSize = 10;
 pageIndex = 0;
 showFirstLastButtons = true;
 hidePageSize = false;
 disabled = false;
 pageCount = 0;
 pageSizeOptions = [5, 10, 20];
 pageEvent: PageEvent;
 showPageSizeOptions = false;
  toDate: string;
  fromDate: string;
  supplierList: any;

  constructor(public AllService: AllServicesService,
              public httpService: HttpService,
              public http: HttpClient,
              public tripservice: TripService,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private bookingService: BookingService ) {
                this.originName = localStorage.getItem('originName');
                this.tripsheet = localStorage.getItem('tripSheet');
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
               }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.dataSource = new MatTableDataSource;

    this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
     if (this.userType === 'Admin') {
             const allCust = { customerName: 'All', customerCode: 'All' };
            this.CustomerList = [allCust, ...resp.Data];
          this.customerForm.patchValue({ CustomerName: 'All' });
          //  this.loadSupplierData('All');
        } else {
           this.CustomerList = resp.Data;
        }
    })
    this.getVehicleNumbers();
    this.createForm = this.formBuilder.group({
     CustomerName: ['All', Validators.required],
     supplierName: ['All', Validators.required],
     fromDate: ['', Validators.required],
     toDate: ['', Validators.required],
   });
 this.createForm.get('CustomerName')?.valueChanges.subscribe(customerName => {
    this.loadSupplierData(customerName);
  });
   this.loadSupplierData('All');
  this.validationMessage = {
   CustomerName: [
     { type: 'required', message: 'Customer name is required' }
   ],
   supplierName: [
     { type: 'required', message: 'supplier Name is required' }
   ],
  fromDate: [
    { type: 'required', message: 'fromDate is required' }
  ],
  toDate: [
    { type: 'required', message: 'toDate is required' }
  ],
 };

  }
loadSupplierData(CustomerName: any) {
    this.bookingService.getShipper(CustomerName).subscribe((data: any) => {
         const allSupplier = { shipperName: 'All', shipperCode: 'All' };

    if (data?.Data?.length) {
      this.supplierList = [allSupplier, ...data.Data];
    } else {
      this.supplierList = [allSupplier];
    }
    this.createForm.patchValue({ supplierName: 'All' });
     });
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
  onTransportTypeChange(event: any) {
    this.selectedType = event.target.value;
    if (this.selectedType === 'Self') {
    } else {
    }
}
 openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
   openprogressbar(): MatDialogRef<ProgressBarComponent> {
      const dialogRef = this.dialog.open(ProgressBarComponent, {
        data: {
            action: 'docketPrint',
        },
          width: '20rem',
          disableClose: true,
        });
        return dialogRef;
      }
downloadSample() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '22rem',
    data: { message: 'Do you want to download the Excel file?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.AllService.getReportCancelTrip(
    this.createForm.value.shipperCode,
    this.createForm.value.customerCode,
    this.createForm.value.fromDate,
    this.createForm.value.toDate,
    this.pageIndex + 1,
    this.pageSize
      ).subscribe((response: any) => {
        if (response.status === 1 && Array.isArray(response.Data)) {
          const progressBar = this.openprogressbar();

          const dataForExcel = response.Data.map((element: any) => ({
            'Customer Name': element.Customer_Name,
            'Date': element.Date,
            'Route': element.Route,
            'Reporting Time': element.ReportingTime,
            'Quantity': element.Qty,
            'Store In': element.storeIn,
            'Vehicle Type': element.vehicleType,
            'Shipper Name': element.Shipper_Name,
            'Loading In': element.LoadingIn,
            'Loading Out': element.LoadingOut,
            'In Transit': element.InTransit,
            'Store Out': element.storeOut,
            'Dispatch Time': element.DispatchTime,
            'Reason': element.Reason,
            'Remark': element.Remark
          }));

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'TripArrivalSheet');
          XLSX.writeFile(wb, 'TripArrival_Report.xlsx');

          progressBar.close();
        } else {
          this.openSnackBar('No data found or an error occurred.', 'error-snackbar');
        }
      });
    } else {
      this.openSnackBar('Download cancelled', 'error-snackbar');
    }
  });
}

  getVehicleNumbers() {
    this.AllService.getVehicleNo('').subscribe((response: any) => {
          this.vehicleNumbers = response.Data;
        }, (error) => {
            this.snackBar.open('Error fetching vehicle numbers', 'Close', {
                duration: 3000
            });
            console.error('Error fetching vehicle numbers:', error);
        }
    );
  }
  generatePdf() {
    const doc = new jsPDF();
    const element = document.getElementById('genPDF');
      if (element) {
        html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = '<iframe width=\'100%\' height=\'100%\' src=\'' + pdfUrl + '\'></iframe>';
        const x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
      });
    } else {
      console.error('Element not found.');
    }
  }
  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.calculatePageCount();

    const formData = this.createForm.value;
    this.generateCancelTrip(formData);
  }
  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }

generateCancelTrip(formData: any) {
  if (this.createForm.invalid) {
    this.createForm.markAllAsTouched();
    this.openSnackBar('Please fill all required fields', 'error-snackbar');
    return;
  }

  const sessionLocationCode = this.sessionLocationCode;
  const shipperCode = formData.supplierName;
  const customerCode = formData.CustomerName;
  const fromDate = formData.fromDate;
  const toDate = formData.toDate;

  this.AllService.getReportCancelTrip(
    shipperCode,
    customerCode,
    fromDate,
    toDate,
    this.pageIndex + 1,
    this.pageSize
  ).subscribe({
    next: (resp: any) => {
      if (resp.status === 1) {
        this.showTable = true;
        this.dataSource = resp.Data;
        this.length = resp.count;
        this.calculatePageCount();
        this.openSnackBar(resp.message, 'custom-snackbar');
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
        this.showTable = false;
      }
    },
    error: () => {
      this.openSnackBar('Failed to fetch cancelled trip reports', 'error-snackbar');
    }
  });
}

}
