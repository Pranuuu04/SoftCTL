import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-pending-manifest',
  templateUrl: './pending-manifest.component.html',
  styleUrls: ['./pending-manifest.component.css'],
})
export class PendingManifestComponent implements OnInit {

  sessionLocationCode: any;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  totalountPages: any;
  totalPending: number;
  showTable = false;
  ManifestViewData: any[] = [];
  showFirstLastButtons: any;
  currentPage = 1;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'awbNo', 'bookDate', 'customerName', 'consigneeName', 'fromDest', 'toDest', 'qty', 'actualWt', 'invoiceNo', 'invoiceValue'];
  dataLoaded = false;
  userType: any;
  selectedValue = 'All';
  destinationName = 'All';
  AwbNo: any;

  constructor(private http: AllServicesService,
              private snackBar: MatSnackBar,
              private renderer: Renderer2,
              ) {
                this.sessionLocationCode = localStorage.getItem('originCode');
              }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.destinationName = localStorage.getItem('selectedValue');
    this.dataSource = new MatTableDataSource<any>(this.ManifestViewData);
    this.sessionLocationCode = localStorage.getItem('originCode');
    // if (!this.dataLoaded) {
      this.pendingTableData(1, 15);
    // }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  refresh() {
    this.pendingTableData(1, 15);
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  onInput() {
    if (this.AwbNo.trim() === '') {
      this.pendingTableData(1, 15);
    }
  }

  findAwbno() {
    this.http.findawbNo(this.sessionLocationCode, this.AwbNo).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.dataSource.data = [{
          awbNo: resp.Data[0].awbNo,
          bookDate: resp.Data[0].bookDate,
          actualWt: resp.Data[0].actualWt,
          consigneeName: resp.Data[0].consigneeName,
          customerName: resp.Data[0].customerName,
          fromDest: resp.Data[0].fromDest,
          invoiceNo: resp.Data[0].invoiceNo,
          invoiceValue: resp.Data[0].invoiceValue,
          productName: resp.Data[0].productName,
          qty: resp.Data[0].qty,
          toDest: resp.Data[0].toDest,
        }];
        setTimeout(() => {
          this.renderer.selectRootElement('#AwbNo').focus();
        }, 600);
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    }, error => {
      console.error('Error fetching data:', error);
      this.openSnackBar('Please enter Correct Awb No.', 'error-snackbar');
    });
  }
  pendingTableData(pageNumber: number, pageSize: number) {
   if (this.userType === 'Admin') {
    this.http.getPendingManifest(this.destinationName , pageNumber , pageSize).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.showTable = true;
        this.ManifestViewData = resp.Data;
         this.dataSource.data = this.ManifestViewData;
         setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
        this.dataLoaded = true;
      } else {
        this.showTable = false;
      }
    });
   } else {
    this.http.getPendingManifest(this.sessionLocationCode , pageNumber , pageSize).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.showTable = true;
        this.ManifestViewData = resp.Data;
         this.dataSource.data = this.ManifestViewData;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
        this.dataLoaded = true;
        this.totalPending = resp.count;
        this.pageSize = pageSize;
      }
    });
   }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  loadPage(event: any) {
    const pageNumber = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.pendingTableData(pageNumber, pageSize);
  }
}
