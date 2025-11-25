import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { SetupReportComponent } from 'app/Branch/Shared/report_pages/setup-report/setup-report.component';
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
  selector: 'app-pending-pod-image',
  templateUrl: './pending-pod-image.component.html',
  styleUrls: ['./pending-pod-image.component.css']
})
export class PendingPodImageComponent implements OnInit {

podForm: FormGroup;
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

displayedColumns: string[] = [];
podImageColumnMapping: { [key: string]: string } = {
  index: 'Sr No',
  BookDate: 'Book Date',
  AwbNo: 'AWB No',
  Origin: 'Origin',
  destination_name: 'Destination',
  Status: 'Status',
  DelvDT: 'Delivery Date',
  POD_Img: 'POD Image',
  DelvTime: 'Delivery Time',
  ExptDateOfDelvDt: 'Expected Delivery',
  RecvName: 'Receiver Name',
  ContactNo: 'Contact Number',
  RecvNature: 'Nature Of Rcpt',
  recvremark: 'Remark',
  customer_name: 'Customer Name',
  shipperName: 'Shipper Name',
  Consignee_Name: 'Consignee Name',
  mode_name: 'Mode',
  product_name: 'Product',
  vendor_name: 'Forwarding Name',
  Ref_No: 'Forwarding No',
  DrsNo: 'DRS No',
  drsdt: 'DRS Date',
  Pickup_Boy: 'Delivery Name'
}
// displayedColumns: string[] = [
//       'srNo',
//       'BookDate',
//       'AwbNo',
//       'Origin',
//       'destination_name',
//       'Status',
//       'DelvDT',
//       'POD_Img',
//       'DelvTime',
//       'ExptDateOfDelvDt',
//       'RecvName',
//       'ContactNo',
//       'RecvNature',
//       'recvremark',
//       'customer_name',
//       'shipperName',
//       'Consignee_Name',
//       'mode_name',
//       'product_name',
//       'vendor_name',
//       'Ref_No',
//       'DrsNo',
//       'drsdt',
//       'Pickup_Boy'
//     ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  formData: any = {
    drsType: '',
    fromDate: '',
    toDate: '',
  };

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
    

  this.podForm  = this.formBuilder.group({
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
  

  
// formSubmit(formData: any) {
//   this.httpService
//     .get(`${environment.apiUrl}pod/pendingPodImage?fromDate=${formData.fromDate}&toDate=${formData.toDate}&podPending=${formData.drsType}`)
//     .then(resp => {
//       if (resp.status === 1 && resp.Data) {
//         this.dataSource.data = resp.Data; 
//       } else {
//         this.openSnackBar(resp.message, 'error-snackbar');
//         this.dataSource.data = [];
//       }

//     });
// }

getReportSetupKey(){
   this.AllService.getReportSetup('getPodImgReportSetup').subscribe((setupResp: any) => {
    if (setupResp.status === 1 && setupResp.Data.length) {
      const setup = setupResp.Data[0];
      const selectedKeys = Object.keys(setup).filter(k => setup[k] === 1 && k !== 'POD_Img');
      this.displayedColumns = ['index','BookDate', 'AwbNo', 'Origin', 'destination_name','Status','DelvDT','POD_Img', ...selectedKeys];
    }
  });
}

logColumn(col: string) {
  console.log("COLUMN FOUND:", `"${col}"`);
  return '';
}

formSubmit(formData: any) {
  this.formData = formData
  this.isLoading = true; 
  this.getReportSetupKey();
   this.AllService.getDrsPodReport(this.sessionLocationCode,'PodImageReport',formData.drsType || 'All',formData.fromDate,formData.toDate, this.pageIndex+1,this.pageSize).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          if (resp?.status === 1 && resp?.Data) {
            // this.dataSource =  new MatTableDataSource(resp.Data);
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


openSetup(){
  const dialogRef = this.dialog.open(SetupReportComponent, {
        data: {
          action: 'add',
          inputName: 'getPodImgReportSetup',
          columnMapping: this.podImageColumnMapping,
          saveApi: 'podImgSetup'
        },
        width: '85rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((selectedKeys: string[]) => {
      if (selectedKeys && selectedKeys.length) {
        this.displayedColumns = ['index', ...selectedKeys];
       }
        this.getReportSetupKey();
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

// downloadSample(){
//    const isConfirmed = window.confirm('Do you want to download the Excel file?');
//       if (isConfirmed) {
//         const progressBar = this.openprogressbar();
//         this.AllService.getDrsPodReport(this.sessionLocationCode,'PodImageReport',this.formData.drsType || 'All',this.formData.fromDate,this.formData.toDate, this.pageIndex+1,this.length)
//           .subscribe((response: any) => {
//            if (response.status === 1) {
//               const dataForExcel = response.Data.map((element: any, index: number) => {
//                 const row: any = { Index: index + 1 };
//                 this.displayedColumns.forEach(colKey => {
//                   if (colKey !== 'index') {
//                     const header = this.podImageColumnMapping[colKey] || colKey;
//                     row[header] = element[colKey];
//                   }
//                 });
//                 return row;
//               });
  
//               const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
//               const wb: XLSX.WorkBook = XLSX.utils.book_new();
//               XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
//               XLSX.writeFile(wb, 'PodImageDetails.xlsx');
//             } else {
//               this.openSnackBar(response.message, 'error-snackbar');
//             }
//             progressBar.close();
//           });

//         }
  
// }

downloadSample() {
  const isConfirmed = window.confirm('Do you want to download the Excel file?');
  if (!isConfirmed) return;

  const progressBar = this.openprogressbar();

 this.AllService.getDrsPodReport(this.sessionLocationCode,'PodImageReport',this.formData.drsType || 'All',this.formData.fromDate,this.formData.toDate, this.pageIndex+1,this.length)
  .subscribe({
    next: (response: any) => {
      try {
        if (response?.status === 1 && Array.isArray(response.Data)) {
          const mapping = this.podImageColumnMapping || {};
          const dataForExcel = response.Data.map((element: any, index: number) => {
            const row: any = {};
            const cols = (this.displayedColumns && this.displayedColumns.length) ? this.displayedColumns : Object.keys(mapping);
            cols.forEach(colKey => {
              const header = mapping[colKey] || colKey;
              if (colKey === 'index' || colKey === 'srNo') {
                row[header] = index + 1;
                return;
              }
              if (colKey === 'POD_Img' || colKey === 'Image' || colKey === 'Sign_Img') {
                const val = element[colKey];
                row[header] = val ? 'Yes' : 'No';
                return;
              }
              row[header] = (element && element[colKey] !== null && element[colKey] !== undefined) ? element[colKey] : '';
            });
            return row;
          });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Pod Image');
          XLSX.writeFile(wb, 'PodImageDetails.xlsx');

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
