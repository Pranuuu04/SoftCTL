import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-p-inscan-awb-no',
  templateUrl: './p-inscan-awb-no.component.html',
  styleUrls: ['./p-inscan-awb-no.component.css']
})
export class PInscanAwbNoComponent implements OnInit {

@ViewChild(MatPaginator) paginator: MatPaginator;

  AwbTableData: any[] = [];
  displayedColumns: string[] = ['Awbno', 'Bookdate', 'ManifestNo', 'manifestDt', 'Customer_Name', 'ConsigneeName', 'FromDest', 'ToDest', 'qty', 'actualwT', 'ManifestWt'];
  dataSource: MatTableDataSource<any>;
  pageSizeOptions: number[] = [5, 10, 20];
  currentPage = 1;
  totalPending: any;
  sessionLocationCode: any;
  // pageSize: number;
  showTable = false;
  userType: any;
  selectedValue: any;
  destinationName: any;
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

    constructor(public httpService: AllServicesService,
                private _mdr: MatDialogRef<PInscanAwbNoComponent>,
                private sharedService: SharedService) {
                  this.sessionLocationCode = localStorage.getItem('originCode');
                }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.destinationName = this.sharedService.getSelectedValue();
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.dispatch = localStorage.getItem('dispatch');

    this.getScanAwbData(this.pageIndex + 1, this.pageSize);
  }

// ngAfterViewInit() {
//     if (this.paginator) {
//       this.dataSource.paginator = this.paginator;
//     }
//     this.getScanAwbData(this.pageIndex + 1, this.pageSize);

//   }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 CloseDialog() {
    this._mdr.close(false);
  }
calculatePageCount() {
  this.pageCount = Math.ceil(this.length / this.pageSize);
}
handlePageEvent(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  const pageNumber = this.pageIndex + 1;
  this.calculatePageCount();
  this.getScanAwbData(pageNumber, this.pageSize);
}

  getScanAwbData(pageNumber: number, pageSize: number) {
  const serviceCall = this.userType === 'Admin'
    ? this.httpService.getPendingInscan(this.destinationName, this.dispatch, pageNumber, pageSize)
    : this.httpService.getPendingInscan(this.sessionLocationCode, this.dispatch, pageNumber, pageSize);

  serviceCall.subscribe((resp: any) => {
    if (resp.status === 1) {
      this.showTable = true;
      this.AwbTableData = resp.Data;
      this.dataSource = new MatTableDataSource(this.AwbTableData);
      this.length = resp.Count;
      this.calculatePageCount();
    } else {
      this.showTable = false;
      this.AwbTableData = [];
    }
  }, error => {
    console.error('Error fetching data from API', error);
  });
}


}
