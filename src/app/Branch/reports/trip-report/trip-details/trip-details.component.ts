import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripService } from 'app/Branch/operation/tripsheet/trip.service';
import { AllServicesService } from 'app/service/all-services.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { HttpService } from 'app/service/http.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ImageViewComponent } from '../image-view/image-view.component';
import { HttpClient } from '@angular/common/http';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css']
})
export class TripDetailsComponent implements OnInit {


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
displayedColumns: string[] = [
  'index', 'Customer_Name', 'TripDate', 'TripNo', 'AwbNo', 'VehicleNo', 'VehicleType', 'DriverName', 'DriverNo', 'OriginName', 'DestinationName', 'Route', 'Status', 'TripStatus', 'TransportType',  'TransportName', 'ExpectedTime', 'ActualDate', 'ActualTime', 'StatusTime'];
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
        } else {
           this.CustomerList = resp.Data;
        }
    })
    this.getVehicleNumbers();
    this.createForm = this.formBuilder.group({
     CustomerName: ['All', Validators.required],
     supplierName: ['All', Validators.required],
     Status: ['All'],
     Time: ['Reporting', Validators.required],
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
   Transporttype: [
     { type: 'required', message: 'Transport type is required' }
   ],
   VehicleNo: [
     { type: 'required', message: 'Vehicle number is required' }
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
      this.AllService.getTripDetailReports(
        this.sessionLocationCode,
        this.createForm.value.CustomerName,
        this.createForm.value.supplierName,
        this.createForm.value.fromDate,
        this.createForm.value.toDate,
        this.createForm.value.Time,
        this.createForm.value.Status,
        1,
        this.length
      ).subscribe((response: any) => {
        if (response.status === 1 && Array.isArray(response.Data)) {
          const progressBar = this.openprogressbar();

          const dataForExcel = response.Data.map((element: any) => ({
            'Customer Name': element.Customer_Name,
            'Trip Date': element.TripDate,
            'Trip No': element.TripNo,
            'AWB No': element.AwbNo,
            'Vehicle No': element.VehicleNo,
            'Vehicle Type': element.VehicleType,
            'Driver Name': element.DriverName,
            'Driver No': element.DriverNo,
            'Origin': element.OriginName,
            'Destination': element.DestinationName,
            'Route': element.Route,
            'Status': element.Status,
            'Trip Status': element.TripStatus,
            'Transport Type': element.TransportType,
            'Transport Name': element.TransportName,
            'Expected Time': element.ExpectedTime,
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
    this.generateTrip(formData);
  }
  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }
  generateTrip(formData: any) {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.openSnackBar('Please fill all required fields', 'error-snackbar');
      return;
    }

    const sessionLocationCode = this.sessionLocationCode;
    const customerCode = formData.CustomerName;
    const supplierName = formData.supplierName;
    const Time = formData.Time;
    const Status = formData.Status;
    const fromDate = formData.fromDate;
    const toDate = formData.toDate;

    this.AllService.getTripDetailReports(
      sessionLocationCode,
      customerCode,
      supplierName,
      fromDate,
      toDate,
      Time,
      Status,
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
          this.createForm.patchValue({tripNo: ''})
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
          this.showTable = false;

        }
      },
      error: () => {
        this.openSnackBar('Failed to fetch trip arrival reports', 'error-snackbar');
      }
    });
  }

}
