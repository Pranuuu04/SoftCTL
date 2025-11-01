import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-done-manf',
  templateUrl: './done-manf.component.html',
  styleUrls: ['./done-manf.component.css']
})
export class DoneManfComponent implements OnInit {
manifestform: any;
  ManfTableData: any[] = [];
  displayedColumns: string[] = ['Manifest_no', 'manifestDt', 'via', 'mode', 'shipment', 'qty', 'actualWT', 'vehicle_no', 'Driver_Name', 'Route', 'inscanStatus', 'inscanRemark'];
  dataSource: MatTableDataSource<any>;
  totalPending: any;
  sessionLocationCode: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showTable = false;
  destinationName: any;
  userType: any;
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

  constructor(private getData: AllServicesService,
              public httpService: HttpService,
              private _mdr: MatDialogRef<DoneManfComponent>, ) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.destinationName = localStorage.getItem('selectedValue');
    this.dispatch = localStorage.getItem('dispatch');
    this.sessionLocationCode = localStorage.getItem('originCode');

    this.getScanManfData(this.pageIndex + 1, this.pageSize);
  }

   CloseDialog() {
    this._mdr.close(false);
  }
 handlePageEvent(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  const pageNumber = this.pageIndex + 1;
  this.calculatePageCount();
  this.getScanManfData(pageNumber, this.pageSize);
}

calculatePageCount() {
  this.pageCount = Math.ceil(this.length / this.pageSize);
}
  getScanManfData(pageNumber: number , pageSize: number) {
    if (this.userType !== 'Admin') {
      this.getData.getInscanManif(this.sessionLocationCode, this.dispatch, pageNumber, pageSize).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.showTable = true;
          this.ManfTableData = resp.Data;
          this.length = resp.Count;
          this.calculatePageCount();
          this.dataSource = new MatTableDataSource(this.ManfTableData);
          this.dataSource.paginator = this.paginator;
        } else {
          this.showTable = false;
        }
      })
    } else {
      this.httpService.get(`${environment.apiUrl}inscan/viewInscanByManifestNo?SessionLocationCode=${this.destinationName}&dispatchFlag=${this.dispatch}&pageNumber=${pageNumber}&pageSize=${pageSize}`).then((resp: any) => {
        if (resp.status === 1) {
          this.showTable = true;
          this.ManfTableData = resp.Data;
          this.dataSource = new MatTableDataSource(this.ManfTableData);
          this.dataSource.paginator = this.paginator;
          this.length = resp.Count;
          this.calculatePageCount();
        } else {
          this.showTable = false;
        }
      })
    }
  }
}
