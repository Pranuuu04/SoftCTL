import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { environment } from 'environments/environment';
import { BillingService } from '../billing.service';
import { SharedService } from 'app/service/shared.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-unbuild-billing',
  templateUrl: './unbuild-billing.component.html',
  styleUrls: ['./unbuild-billing.component.css']
})
export class UnbuildBillingComponent implements OnInit {

  sessionLocationCode: any;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  pageCount = 0;
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  pageSizeOptions: number[] = [10, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'awbno', 'bookDate',  'customerName', 'Consignee_Name', 'originName', 'destinationName', 'Qty', 'ClientType', 'Product_Name', 'ActualWt', 'ChargedWt', 'rate', 'fuelCharges', 'TotalAmt'];
  userType: any;
  selectedValue = 'All';
  fromDate: string;
  toDate: string;
  unbillData: any;
  showTable = false;

  constructor(private billingService: BillingService,
              private snackBar: MatSnackBar,
              private sharedService: SharedService,
              ) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');
    this.dataSource = new MatTableDataSource<any>(this.unbillData);
      combineLatest([this.sharedService.fromDate$, this.sharedService.toDate$]).subscribe(([fromDate, toDate]) => {
        if (fromDate !== this.fromDate || toDate !== this.toDate) {
            this.fromDate = fromDate;
            this.toDate = toDate;
            this.pendingTableData(this.pageIndex + 1, this.pageSize);
        }
      });
  }

  refresh() {
    this.pendingTableData(this.pageIndex + 1, this.pageSize);
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  pendingTableData(pageNumber: number, pageSize: number) {
  //  if (this.userType === 'Admin') {
    this.billingService.getUnBill(this.sessionLocationCode, this.fromDate, this.toDate, pageNumber, pageSize).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.showTable = true;
        this.unbillData = resp.Data;
        this.dataSource.data = this.unbillData;
        this.length = resp.count;
        this.calculatePageCount();
        //  setTimeout(() => {
        //   this.dataSource.paginator = this.paginator;
        // });
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
        this.showTable = false;
      }
    });
  //  } else {
  //  // tslint:disable-next-line:max-line-length
  //  this.billingService.getUnBill(this.sessionLocationCode, this.fromDate, this.toDate, pageNumber, pageSize).subscribe((resp: any) => {
  //     if (resp.status === 1) {
  //       this.showTable = true;
  //       this.unbillData = resp.Data;
  //       this.dataSource.data = this.unbillData;
  //         this.length = resp.count;
  //         this.calculatePageCount();
  //        setTimeout(() => {
  //         this.dataSource.paginator = this.paginator;
  //       });
  //     } else {
  //       this.openSnackBar(resp.message, 'error-snackbar');
  //       this.showTable = false;
  //     }
  //   });
  //  }
  }
  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
  handlePageEvent(e: PageEvent) {
      this.length = e.length;
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  const pageNumber = this.pageIndex + 1;
  this.calculatePageCount();
  this.pendingTableData(pageNumber, this.pageSize);
 }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // loadPage(event: any) {
  //   const pageNumber = event.pageIndex + 1;
  //   const pageSize = event.pageSize;
  //   this.pendingTableData(pageNumber, pageSize);
  // }
}
