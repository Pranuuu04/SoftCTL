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
import { environment } from 'environments/environment.prod';


@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

  createForm: FormGroup;
  validationMessage: any = [];
  sessionLocationCode: string;
  showTable = false;
  userType: any;
  CustomerList: any;
  displayedColumns: string[] = [
  'srNo','locationName' , 'BookDate', 'AwbNo', 'Customer_Name', 'Consignee_Name', 'Mode_Name', 'OriginName', 'DestinationName', 'ClientType', 'Qty', 'ActualWt', 'ChargedWt', 'FreighAmt', 'IGST', 'CGST', 'SGST', 'GST', 'TotalAmt', 'UserName', 'Status'
];
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
  branchName: any;
  userList: any;

  constructor(public AllService: AllServicesService,
              public httpService: HttpService,
              public http: HttpClient,
              public tripservice: TripService,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private snackBar: MatSnackBar, ) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
               }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.dataSource = new MatTableDataSource;

   this.AllService.getUserName().subscribe((resp: any) => {
      if (this.userType === 'Admin') {
          const allUsers = { UserName: 'All' };
          this.userList = [allUsers, ...resp.Data];
          this.createForm.patchValue({ UserName: 'All' });
        } else {
          this.userList = resp.Data;
        }
    });
    this.branchData();
    this.createForm = this.formBuilder.group({
     UserName: ['All', Validators.required],
     fromDate: ['', Validators.required],
     toDate: ['', Validators.required],
     BranchName: ['All'],
     TFlag: ['All']
   });

  this.validationMessage = {
   UserName: [
     { type: 'required', message: 'User name is required' }
   ],
   fromDate: [
     { type: 'required', message: 'fromDate is required' }
   ],
   toDate: [
     { type: 'required', message: 'toDate is required' }
   ],
  BranchName: [
    { type: 'required', message: 'Branch name is required' }
  ]
 };

  }
   branchData() {
      this.httpService.get(`${environment.apiUrl}Booking/getBranch` ).then((resp) => {
        if (this.userType === 'Admin') {
             const allBranch = { locationName: 'All', locationCode: 'All' };
            this.branchName = [allBranch, ...resp.Data];

          this.createForm.patchValue({ BranchName: 'All' });
        } else {
           this.branchName = resp.Data;
        }
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
      const formData = this.createForm.value;

    const sessionCodeToSend = this.userType === 'Admin'
      ? formData.BranchName
      : this.sessionLocationCode;

    const params = {
      userName: formData.UserName,
      type: 'All',
      sessionLocationCode: sessionCodeToSend,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      pageNumber: 1,
      pageSize: this.length
    };

      this.AllService.getStatusReport(params).subscribe((response: any) => {
        if (response.status === 1 && Array.isArray(response.data)) {
          const progressBar = this.openprogressbar();

          const dataForExcel = response.data.map((element: any) => ({
            'AWB No': element.AwbNo,
            'Book Date': element.BookDate?.split('T')[0],
            'Customer Name': element.Customer_Name,
            'Consignee Name': element.Consignee_Name,
            'Mode': element.Mode_Name,
            'Origin': element.OriginName,
            'Destination': element.DestinationName,
            'Qty': element.Qty,
            'Actual Weight': element.ActualWt,
            'Charged Weight': element.ChargedWt,
            'FreighAmt': element.FreighAmt,
            'IGST': element.IGST,
            'CGST': element.CGST,
            'SGST': element.SGST,
            'GST': element.GST,
            'TotalAmt': element.TotalAmt,
            'User Name': element.UserName,
            'Status': element.Status
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
    this.generateLog(formData);
  }
  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }
  generateLog(formData: any) {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.openSnackBar('Please fill all required fields', 'error-snackbar');
      return;
    }
     const sessionCodeToSend = this.userType === 'Admin'
    ? formData.BranchName // Use selected branch
    : this.sessionLocationCode;
  const params = {
    userName: formData.UserName,
    type: 'All',
    clientType: formData.TFlag,
    sessionLocationCode: sessionCodeToSend,
    fromDate: formData.fromDate,
    toDate: formData.toDate,
    pageNumber: this.pageIndex + 1,
    pageSize: this.pageSize
  };

  this.AllService.getStatusReport(params).subscribe({
      next: (resp: any) => {
        if (resp.status === 1) {
          this.showTable = true;
          this.dataSource = resp.data;
          this.length = resp.count;
          this.calculatePageCount();
          this.openSnackBar(resp.message, 'custom-snackbar');
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
          this.showTable = false;

        }
      },
      error: () => {
        this.openSnackBar('Failed to fetch Status reports', 'error-snackbar');
      }
    });
  }

}
