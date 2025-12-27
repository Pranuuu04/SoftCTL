import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BranchDashboardComponent } from 'app/Branch/dashboard/dashboard.component';
import { HttpService } from 'app/service/http.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { AllServicesService } from 'app/service/all-services.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { error } from 'console';


@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

  TableData: any ;
  displayedColumns: any[] = [ 'AwbNo', 'BookDate', 'ConsignerName', 'ConsigneeName', 'Origin', 'DestinationName', 'Pincode', 'Qty', 'ActualWt', 'InvoiceNo', 'InvoiceValue', 'E_way_Bill_No', 'ManifestNo', 'ManifestDate', 'InscanDate', 'DrsNo', 'drsdt', 'ForwordingName', 'ForwordingNo', 'Status', 'ReasonName', 'TypeofCust', 'TotalAmt'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions: number[] = [10, 25, 50];
  pageSize = 10;
  currentPage = 1;
  Title: any;
  length: number;
  pageCount: any;
  showPageSizeOptions = false;
  showTable = false;
isExcelLoading = false;
  constructor( private _mdr: MatDialogRef<BranchDashboardComponent>,
               public dialog: MatDialog,
               private snackBar: MatSnackBar,
               public httpService: HttpService,
               private http: AllServicesService,
               @Inject(MAT_DIALOG_DATA) public data: any
                ) {
                  this.TableData = this.data.RespTableData;
                  this.dataSource = new MatTableDataSource(this.TableData);
                  this.Title = this.getTitle(this.data.status);
                 }

  ngOnInit(): void {
    // this.dataSource.paginator = this.paginator;
    this.loadData(1);
  }

  // ngAfterViewInit() {
  //   if (this.paginator) {
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

 loadData(pageNumber: number) {
  this.isExcelLoading = true;  
  const fromDate = this.data.fromDate;
  const toDate = this.data.toDate;

  let apiCall;

  // Choose API based on modal type
  if (this.data.modalType === 'Inscan') {
    // tslint:disable-next-line:max-line-length
    apiCall = this.http.getBranchDashbordInscanDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, pageNumber, this.pageSize);
  } else if (this.data.modalType === 'Manifest') {
    // tslint:disable-next-line:max-line-length
    apiCall = this.http.getBranchDashbordManifestDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, pageNumber, this.pageSize);
  } else if (this.data.modalType === 'Drs') {
    // tslint:disable-next-line:max-line-length
    apiCall = this.http.getBranchDashbordRunsheetDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, pageNumber, this.pageSize);
  } else if (this.data.modalType === 'Status') {
    // tslint:disable-next-line:max-line-length
    apiCall = this.http.getBranchDashbordStatusDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, pageNumber, this.pageSize);
  } else if (this.data.modalType === 'Sales') {
    // tslint:disable-next-line:max-line-length
    apiCall = this.http.getBranchDashbordSalesDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, pageNumber, this.pageSize);
  }

  apiCall.subscribe({
   next: (response)=>{
    if ( response.status === 1 ) {
    this.TableData = response.Data;
    this.length = response.count;
    this.dataSource = new MatTableDataSource(this.TableData);
    this.showTable = true;
    this.calculatePageCount();
   } else {
    this.showTable = false;
   }
    this.isExcelLoading = false;
  },
   error: ()=>{
     this.openSnackBar('Failed to load table data', 'error-snackbar');
      this.isExcelLoading = false; 
   }
  });
}

calculatePageCount() {
  this.pageCount = Math.ceil(this.length / this.pageSize);
}

handlePageEvent(e: PageEvent) {
  this.pageSize = e.pageSize;
  this.currentPage = e.pageIndex + 1;
  this.loadData(this.currentPage);
}
  CloseDialog() {
    this._mdr.close(false);
  }

  getTitle(status: string): string {
    switch (status) {
      case 'Done':
        return 'Done ' + this.data.modalType;
      case 'Pending':
        return 'Pending ' + this.data.modalType;
      case 'InTransit':
        return 'In Transit ' + this.data.modalType;
      case 'UnDelivered':
        return 'Undelivered ' + this.data.modalType;
      case 'Delivered':
        return 'Delivered ' + this.data.modalType;
      case 'RTO':
        return 'Return to Origin ' + this.data.modalType;
      case 'OFD':
        return 'Out for Delivery ' + this.data.modalType;
      case 'Credit':
        return 'Credit ' + this.data.modalType;
      case 'Cash':
        return 'Cash ' + this.data.modalType;
      case 'ToPay':
        return 'ToPay ' + this.data.modalType;
      case 'COD':
        return 'COD ' + this.data.modalType;
      default:
        return '';
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  loadDataForExcel(pageSize: number) {
    const fromDate = this.data.fromDate;
    const toDate = this.data.toDate;

    let apiCall;

    // Choose API based on modal type
    if (this.data.modalType === 'Inscan') {
      apiCall = this.http.getBranchDashbordInscanDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, 1, pageSize);
    } else if (this.data.modalType === 'Manifest') {
      apiCall = this.http.getBranchDashbordManifestDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, 1, pageSize);
    } else if (this.data.modalType === 'Drs') {
      apiCall = this.http.getBranchDashbordRunsheetDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, 1, pageSize);
    } else if (this.data.modalType === 'Status') {
      apiCall = this.http.getBranchDashbordStatusDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, 1, pageSize);
    } else if (this.data.modalType === 'Sales') {
      apiCall = this.http.getBranchDashbordSalesDetails(this.data.sessionLocationCode, this.data.status, fromDate, toDate, 1, pageSize);
    }

    apiCall.subscribe({
          next: (response: any) => {
      if (response.status === 1) {
        this.downloadExcel(response.Data);
      } else {
        this.openSnackBar('No data found for Excel', 'error-snackbar');
      }
      this.isExcelLoading = false;   // 👈 STOP LOADER
    },
    error: () => {
      this.openSnackBar('Excel download failed', 'error-snackbar');
      this.isExcelLoading = false;   // 👈 STOP LOADER
    }
    });
  }
  downloadExcel(data: any[]) {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  const fileName = `${this.Title.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

  progressbar(): MatDialogRef<ProgressBarComponent> {
  const dialogRef = this.dialog.open(ProgressBarComponent, {
    data: {
      action: 'docketPrint',
    },
    width: '20rem',
    disableClose: true
  });

  return dialogRef;
}
  generateExcel() {
   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       width: '25rem',
       data: { message: 'Are you sure you want to download the Excel file?' }
     });

     dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isExcelLoading = true;
          this.loadDataForExcel(this.length);
          } else {
            this.openSnackBar('Download canceled', 'error-snackbar');
          }
  });
  }

}
