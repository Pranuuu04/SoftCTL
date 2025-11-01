import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'app/service/http.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { CustomerDashboardComponent } from 'app/Customer/dashboard/dashboard.component';
import { AllServicesService } from 'app/service/all-services.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dash-cust-view',
  templateUrl: './dash-cust-view.component.html',
  styleUrls: ['./dash-cust-view.component.css']
})
export class DashCustViewComponent implements OnInit, AfterViewInit {

  TableData: any ;
  displayedColumns: any[] = [ 'AwbNo', 'BookDate', 'ConsignerName', 'ConsigneeName', 'Origin', 'DestinationName', 'Pincode', 'Qty', 'ActualWt', 'InvoiceNo', 'InvoiceValue', 'E_way_Bill_No', 'ManifestNo', 'ManifestDate', 'Inscan_Dt', 'DrsNo', 'drsdt', 'ForwordingName', 'ForwordingNo', 'Status', 'ReasonName', 'TypeofCust', 'TotalAmt'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions: number[] = [15, 25, 50];
  pageSize = 15;
  currentPage = 1;
  Title: any;
  showTable = false;
  totalCount: number;
  length: number;
  pageCount: any;
  showPageSizeOptions = false;


  constructor( private _mdr: MatDialogRef<CustomerDashboardComponent>,
               public dialog: MatDialog,
               public httpService: HttpService,
               private snackBar: MatSnackBar,
               private http: AllServicesService,
               @Inject(MAT_DIALOG_DATA) public data: any
                ) {
                  this.dataSource = new MatTableDataSource(this.TableData);
                  this.Title = this.getTitle(this.data.status);
                 }

  ngOnInit(): void {
     this.dataSource.paginator = this.paginator;
    this.loadData(1);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
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
loadData(pageNumber: number) {
  const fromDate = this.data.fromDate;
  const toDate = this.data.toDate;

  let apiCall;

  // Choose API based on modal type
  if (this.data.modalType === 'Status') {
    // tslint:disable-next-line:max-line-length
    apiCall = this.http.getCustomerDashbordStatusDetails(this.data.sessionLocationCode, this.data.customerCode, fromDate, toDate, this.data.status, pageNumber, this.pageSize);
  } else if (this.data.modalType === 'Sales') {
    // tslint:disable-next-line:max-line-length
    apiCall = this.http.getCustomerDashbordSalesDetails(this.data.sessionLocationCode, this.data.customerCode, fromDate, toDate, this.data.status, pageNumber, this.pageSize);
  }

  apiCall.subscribe((response: any) => {
   if ( response.status === 1 ) {
    this.showTable = true;
    this.TableData = response.Data;
    this.totalCount = response.count;
    this.dataSource = new MatTableDataSource(this.TableData);
    this.length = this.totalCount;
    this.calculatePageCount();
   } else {
    this.showTable = false;
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
        const iframe = "<iframe width='100%' height='100%' src='" + pdfUrl + "'></iframe>";
        const x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
      });
    } else {
      console.error('Element not found.');
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

    if (this.data.modalType === 'Status') {
      // tslint:disable-next-line:max-line-length
      apiCall = this.http.getCustomerDashbordStatusDetails(this.data.sessionLocationCode, this.data.customerCode, fromDate, toDate, this.data.status, 1, pageSize);
    } else if (this.data.modalType === 'Sales') {
      // tslint:disable-next-line:max-line-length
      apiCall = this.http.getCustomerDashbordSalesDetails(this.data.sessionLocationCode, this.data.customerCode, fromDate, toDate, this.data.status, 1, pageSize);
    }

    apiCall.subscribe((response: any) => {
      this.dataSource.filteredData = response.Data;
    });
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
        // const progressDialogRef = this.progressbar();

      const pageSizeForExcel = this.length;
      this.loadDataForExcel(pageSizeForExcel);
      setTimeout(() => {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const fileName = `${this.Title.replace(/\s+/g, '_')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      // progressDialogRef.close();

      }, 500);
    } else {
      this.openSnackBar('Download canceled', 'error-snackbar');
    }
  });
  }


}
