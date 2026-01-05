import { HttpClient } from '@angular/common/http';
import { HttpService } from './../../../../service/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-done-awb',
  templateUrl: './done-awb.component.html',
  styleUrls: ['./done-awb.component.css']
})
export class DoneAwbComponent implements OnInit {
  AwbTableData: any[] = [];
  displayedColumns: string[] = ['Awbno', 'Bookdate', 'ManifestNo', 'manifestDt', 'Customer_Name', 'ConsigneeName', 'FromDest', 'ToDest', 'qty', 'actualwT', 'ManifestWt', 'inscanStatus', 'inscanRemark'];
  dataSource: MatTableDataSource<any>;
  sessionLocationCode: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  constructor(private getData: AllServicesService,
              private httpService: HttpClient,
              private sharedService: SharedService,
              private _mdr: MatDialogRef<DoneAwbComponent>) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.destinationName = this.sharedService.getSelectedValue();
    this.dispatch = localStorage.getItem('dispatch');
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.getScanAwbData(this.pageIndex + 1, this.pageSize);
  }
   CloseDialog() {
    this._mdr.close(false);
  }

  handlePageEvent(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  const pageNumber = this.pageIndex + 1;
  this.calculatePageCount();
  this.getScanAwbData(pageNumber, this.pageSize);
}

calculatePageCount() {
  this.pageCount = Math.ceil(this.length / this.pageSize);
}

  async getScanAwbData(pageNumber: number , pageSize: number) {
  if (this.userType !== 'Admin') {
    try {
      const resp: any = await this.getData.getInscanAWB(this.sessionLocationCode, this.dispatch, pageNumber, pageSize).toPromise();
      if (resp.status === 1) {
        this.showTable = true;
        this.AwbTableData = resp.Data;
        this.length = resp.Count;
        this.calculatePageCount();
        this.dataSource = new MatTableDataSource(this.AwbTableData);
      } else {
        this.showTable = false;
        this.AwbTableData = [];
        this.dataSource = new MatTableDataSource([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  } else {
    try {
      this.httpService.get(
  `${environment.apiUrl}inscan/viewInscanByAwbNo?SessionLocationCode=${this.destinationName}&dispatchFlag=${this.dispatch}&pageNumber=${pageNumber}&pageSize=${pageSize}`
).subscribe((resp: any) => {
  if (resp.status === 1) {
    this.showTable = true;
    this.AwbTableData = resp.Data;
    this.length = resp.Count;
    this.calculatePageCount();
    this.dataSource = new MatTableDataSource(this.AwbTableData);
  } else {
    this.showTable = false;
    this.AwbTableData = [];
    this.dataSource = new MatTableDataSource([]);
  }
}, (error: any) => {
  console.error('Error fetching data:', error);
});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
