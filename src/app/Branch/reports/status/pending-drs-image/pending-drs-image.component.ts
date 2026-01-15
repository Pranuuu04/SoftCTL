import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { TransportImagesComponent } from 'app/Branch/master/transport/transport-images/transport-images.component';

@Component({
  selector: 'app-pending-drs-image',
  templateUrl: './pending-drs-image.component.html',
  styleUrls: ['./pending-drs-image.component.css']
})
export class PendingDrsImageComponent implements OnInit {

  drsForm: FormGroup;
  fromDate: any;
  toDate: any;

  length: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20,50];
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  isHidden = true;

 isLoading = false;

  // displayedColumns: string[] = ['srNo','DrsNo','DrsDate','Image'];
    displayedColumns: string[] = [
      'srNo',
      'DrsNo',
      'DrsDate',
      'Employee_Name',
      'Area',
      'VehicleNo',
      'status',
      'DelvDT',
      'Image'
    ];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  formData: any;
  // formData: any = {
  //   drsType: '',
  //   fromDate: '',
  //   toDate: '',
  // };

  pageCount = 1;
  userType: string;
  sessionLocationCode: string;

  constructor(public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              public AllService: AllServicesService,
              public bookingService: BookingService) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.sessionLocationCode = (localStorage.getItem('userType') === 'Admin')
    ? localStorage.getItem('selectedValue')
    : localStorage.getItem('originCode');
    this.userType = localStorage.getItem('userType');
    this.dataSource = new MatTableDataSource;
    

  this.drsForm  = this.formBuilder.group({
      drsType: new FormControl('All', Validators.compose([ ])),
      fromDate: new FormControl('', Validators.compose([ ])),
      toDate: new FormControl('', Validators.compose([ ])),
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

  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }

  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.calculatePageCount();

    this.formData.fromDate = this.fromDate;
    this.formData.toDate = this.toDate;
 
    this.formSubmit(this.formData);
  }
  
  
formSubmit(formData: any) {
  this.formData = formData
  this.isLoading = true; 

  // this.httpService
  //   .get(`${environment.apiUrl}runsheet/pendingDrsImage?fromDate=${formData.fromDate}&toDate=${formData.toDate}&drsPending=${formData.drsType || 'All'}`)
  //   .then(resp => {
      this.AllService.getDrsPodReport(this.sessionLocationCode,'DrsImageReport',formData.drsType || 'All',formData.fromDate,formData.toDate, this.pageIndex+1,this.pageSize).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          if (resp?.status === 1 && resp?.Data) {
            this.dataSource.data = resp.Data;
            this.length = resp.count;
          } else {
            this.dataSource.data = [];
            this.openSnackBar(resp?.message, 'error-snackbar');
          }
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.dataSource.data = [];
          this.openSnackBar("Something went wrong!", 'error-snackbar');
        }
      });
}

    onImageIconClick(images:string) {
       console.log("POD IMG CLICKED:", images);
       const dialogRef = this.dialog.open(TransportImagesComponent, {
         data: {
           ImageData: images,
         },
         width: '600px',
         disableClose: true
       });
       dialogRef.afterClosed().subscribe(() => {
   
       });
     }


headerMapping: any = {
  srNo: 'Sr No',
  DrsNo: 'DRS No',
  DrsDate: 'DRS Date',
  Employee_Name: 'Delivery Name',
  Area: 'Area Name',
  VehicleNo: 'Vehicle Number',
  status: 'Status',
  DelvDT: 'Delivery Date',
  Image: 'DRS Image'
};

// downloadSample() {
//   const isConfirmed = window.confirm('Do you want to download the Excel file?');
//   if (!isConfirmed) return;
//   const progressBar = this.openprogressbar();
//   this.AllService.getDrsPodReport(this.sessionLocationCode,'DrsImageReport',this.formData.drsType || 'All',this.formData.fromDate,this.formData.toDate,1,this.length)
//   .subscribe({
//     next: (response: any) => {
//       if (response.status === 1) {
//         const excelData = response.Data.map((row: any, index: number) => {
//           const excelRow: any = {};
//           this.displayedColumns.forEach(col => {
//             const header = this.headerMapping[col] || col;
//             if (col === 'srNo') {
//               excelRow[header] = index + 1;
//             } else {
//               excelRow[header] = row[col] ?? '';
//             }
//           });
//           return excelRow;
//         });
//         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
//         const wb: XLSX.WorkBook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'DRS Image');
//         XLSX.writeFile(wb, 'DrsImageDetails.xlsx');
//       } else {
//         this.openSnackBar(response.message, 'error-snackbar');
//       }
//       progressBar.close();
//     },
//     error: () => {
//       progressBar.close();
//       this.openSnackBar("Something went wrong!", 'error-snackbar');
//     }
//   });
// }

downloadSample() {
  const isConfirmed = window.confirm('Do you want to download the Excel file?');
  if (!isConfirmed) return;
  const progressBar = this.openprogressbar();
  this.AllService.getDrsPodReport(this.sessionLocationCode,'DrsImageReport',this.formData.drsType || 'All',this.formData.fromDate,this.formData.toDate,1,this.length)
  .subscribe({
    next: (response: any) => {
      try {
        if (response?.status === 1 && Array.isArray(response.Data)) {
          const mapping = this.headerMapping || {};
          const excelData = response.Data.map((row: any, index: number) => {
            const excelRow: any = {};
            (this.displayedColumns && this.displayedColumns.length ? this.displayedColumns : Object.keys(mapping)).forEach(col => {
              const header = mapping[col] || col;
              if (col === 'index' || col === 'srNo') {
                excelRow[header] = index + 1;
                return;
              }
              if (col === 'POD_Img' || col === 'Image' || col === 'Sign_Img') {
                const val = row[col];
                excelRow[header] = val ? 'Yes' : 'No';
                return;
              }
              excelRow[header] = (row && row[col] !== null && row[col] !== undefined) ? row[col] : '';
            });
            return excelRow;
          });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'DRS Image');
          XLSX.writeFile(wb, 'DrsImageDetails.xlsx');
        } else {
          this.openSnackBar(response?.message || 'No data to export', 'error-snackbar');
        }
      } catch (err) {
        console.error('Export error', err);
        this.openSnackBar('Error while preparing export', 'error-snackbar');
      } finally {
        progressBar.close();
      }
    },
    error: (err) => {
      console.error(err);
      progressBar.close();
      this.openSnackBar('Something went wrong!', 'error-snackbar');
    }
  });
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

  
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  // ngAfterViewInit() {
  //   this.paginator.page.subscribe(() => {
  //     this.handlePageEvent({
  //       pageIndex: this.paginator.pageIndex,
  //       pageSize: this.paginator.pageSize,
  //       length: this.length
  //     });
  //   });
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
