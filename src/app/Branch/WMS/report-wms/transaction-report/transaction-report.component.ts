import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { HttpService } from 'app/service/http.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TripService } from 'app/Branch/operation/tripsheet/trip.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AllServicesService } from 'app/service/all-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.css']
})
export class TransactionReportComponent implements OnInit {

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
  displayedColumns: string[] = [
    'TripNo', 'AwbNo', 'TripDate', 'VehicleNo', 'vehicleType', 'DriverName', 'DriverNo', 'OriginName', 'DestinationName', 'Route',
    'Status', 'TripStatus', 'location_code', 'OpeningKM', 'ClosingKM', 'TotalKM',
    'ContactNo', 'ReciverName', 'supplierName',
    'VehicleInDate', 'VehicleInTime', 'VehicleOutDate', 'VehicleOutTime' , 'TripcloseInDate', 'TripcloseInTime',  'TripStartDt', 'TripStartTime', 'TripEndDt', 'TripEndTime', 'Remark',
  ];
  dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;

  // reportType: any = 'StatusDetail';
 length = 0; // Total number of records
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

  constructor(public AllService: AllServicesService,
              public httpService: HttpService,
              public http: HttpClient,
              public tripservice: TripService,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private renderer: Renderer2,
              private snackBar: MatSnackBar, ) {
                this.originName = localStorage.getItem('originName');
                this.tripsheet = localStorage.getItem('tripSheet');
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
               }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.sessionLocationCode = localStorage.getItem('userType') !== 'admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.dataSource = new MatTableDataSource;

    this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
     this.CustomerList = resp.Data;
    })
    this.getVehicleNumbers();
    this.createForm = this.formBuilder.group({
     CustomerName: ['All', Validators.required],
     Transporttype: ['All', Validators.required],
     VehicleNo: ['All', Validators.required],
     Status: ['All', Validators.required],
     fromDate: ['', Validators.required],
     toDate: ['', Validators.required],
   });

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
   Status: [
    { type: 'required', message: 'Status is required' }
  ],
  fromDate: [
    { type: 'required', message: 'fromDate is required' }
  ],
  toDate: [
    { type: 'required', message: 'toDate is required' }
  ],
 };

  }
  refresh() {
    throw new Error('Method not implemented.');
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
        const isConfirmed = window.confirm('Do you want to download the Excel file?');
        if (isConfirmed) {
            this.AllService.getTripSheetReports(
              this.sessionLocationCode,
              this.createForm.value.CustomerName,
              this.createForm.value.Transporttype,
              this.createForm.value.VehicleNo,
              this.createForm.value.Status,
              this.createForm.value.fromDate,
              this.createForm.value.toDate,
              1,
              this.length
            ).subscribe((response: any) => {
              if (response.status === 1 && Array.isArray(response.Data)) {
                const progressBar = this.openprogressbar();
                const dataForExcel = response.Data.map(element => ({
                  'Trip No': element.TripNo,
                  'Trip Date': element.TripDate,
                  'Vehicle No': element.VehicleNo,
                  'Driver Name': element.DriverName,
                  'Origin Name': element.OriginName,
                  'Destination Name': element.DestinationName,
                  'Route': element.Route,
                  'Status': element.Status,
                  'Trip Status': element.TripStatus,
                  'Location Code': element.location_code,
                  'Advance': element.Advance,
                  'Opening KM': element.OpeningKM,
                  'Closing KM': element.ClosingKM,
                  'Total KM': element.TotalKM,
                  'Contact No': element.ContactNo,
                  'Receiver Name': element.ReciverName,
                  'Remark': element.Remark,
                  'Trip Start Date': element.TripStartDt,
                  'Trip Start Time': element.TripStartTime,
                  'Trip End Date': element.TripEndDt,
                  'Trip End Time': element.TripEndTime,
                  'VehicleInDate': element.VehicleInDate,
                  'VehicleInTime': element.VehicleInTime,
                  'VehicleOutDate': element.VehicleOutDate,
                   'VehicleOutTime': element.VehicleOutTime,
                }));

                const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
                const wb: XLSX.WorkBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
                XLSX.writeFile(wb, 'Trisheet_Details.xlsx');
                progressBar.close();

              } else {
                console.error('response.result is not an array:', response.result);
                this.openSnackBar('No data found or an error occurred.', 'error-snackbar');
              }

            });
        }
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

    // Use current form data to fetch next page
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
    const transportType = formData.Transporttype;
    const VehicleNo = formData.VehicleNo;
    const Status = formData.Status;
    const fromDate = formData.fromDate;
    const toDate = formData.toDate;

    this.AllService.getTripSheetReports(
      sessionLocationCode,
      customerCode,
      transportType,
      VehicleNo,
      Status,
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
        this.openSnackBar('Failed to fetch trip reports', 'error-snackbar');
      }
    });
  }


}
