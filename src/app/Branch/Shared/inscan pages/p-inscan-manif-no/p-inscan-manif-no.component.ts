import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-p-inscan-manif-no',
  templateUrl: './p-inscan-manif-no.component.html',
  styleUrls: ['./p-inscan-manif-no.component.css']
})
export class PInscanManifNoComponent implements OnInit {

  ManfTableData: any[] = [];
  displayedColumns: string[] = ['Manifest_no', 'manifestDt', 'via', 'mode', 'shipment', 'qty', 'Manifestwt', 'vehicle_no', 'Driver_Name', 'Route'];
  dataSource: MatTableDataSource<any>;
  totalPending: any;
  currentPage = 1;
  sessionLocationCode: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showTable = false;
  userType: any;
  selectedValue: any;
  dispatch: string;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageCount = 0;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  showPageSizeOptions = false;
  pageEvent: PageEvent;

  constructor( private _mdr: MatDialogRef<PInscanManifNoComponent>,
               public httpService: AllServicesService,
               private sharedService: SharedService) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.dispatch = localStorage.getItem('dispatch');

    this.selectedValue = this.sharedService.getSelectedValue();
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.getScanManfData(this.pageIndex + 1, this.pageSize)
  }

  // ngAfterViewInit() {
  //   if (this.paginator) {
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }

  CloseDialog() {
    this._mdr.close(false);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
calculatePageCount() {
  this.pageCount = Math.ceil(this.length / this.pageSize);
}
handlePageEvent(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  const pageNumber = this.pageIndex + 1;
  this.calculatePageCount();
  this.getScanManfData(pageNumber, this.pageSize);
}
  getScanManfData(pageNumber: number, pageSize: number) {
    if (this.userType !== 'Admin') {
      this.httpService.getPendingScanManf(this.sessionLocationCode, this.dispatch, pageNumber, pageSize).subscribe((resp: any) => {
        if (resp.status === 1) {
        this.ManfTableData = resp.Data;
        this.showTable = true;
        this.dataSource = new MatTableDataSource(this.ManfTableData);
        this.length = resp.Count;
        this.calculatePageCount();
        }
      }, (error: any) => {
        console.error('Error fetching data from API', error);
      });
    } else {
      this.httpService.getPendingScanManf(this.selectedValue, this.dispatch, pageNumber, pageSize).subscribe((resp: any) => {
        if (resp.status === 1) {
        this.ManfTableData = resp.Data;
        this.showTable = true;
        this.dataSource = new MatTableDataSource(this.ManfTableData);
        this.length = resp.Count;
        this.calculatePageCount();
        }
      }, (error: any) => {
        console.error('Error fetching data from API', error);
      });
    }
  }
}
