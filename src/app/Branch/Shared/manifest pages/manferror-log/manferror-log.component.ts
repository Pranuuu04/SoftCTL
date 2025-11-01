import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-manferror-log',
  templateUrl: './manferror-log.component.html',
  styleUrls: ['./manferror-log.component.css']
})
export class ManferrorLogComponent implements OnInit {

  showCustomerCode: any;
  ErrorData: any[] = []; 
  displayedColumns: string[] = ['AwbForManifest','error'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 20];
  currentPage = 1;
  totalPending: any;
  sessionLocationCode: any;
  showFirstLastButtons: any;
  pageSize: number;
  showTable =false;
  constructor(
              private _mdr: MatDialogRef<ManferrorLogComponent>,
              public httpService: HttpService,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) { 
                this.showCustomerCode = data.showCustomerCode;
             this.sessionLocationCode = localStorage.getItem('originCode');
             }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.getScanAwbData();
  }

ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.getScanAwbData();

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 CloseDialog() {
    this._mdr.close(false);
  }
  
  getScanAwbData() {
    this.httpService
      .get(`${environment.apiUrl}Booking/getManifestErrorLog`)
      .then((resp) => {
 console.log(resp ,"manifest Error Log data");
 
        if(resp.status === 1){
        this.showTable =true;
        this.ErrorData = resp.Data;
        this.dataSource = new MatTableDataSource(this.ErrorData);
        this.dataSource.paginator = this.paginator;
       }
      })
      .catch((error: any) => {
        console.error('Error fetching data from API', error);
      });
  }
  
  generateExcel() {
    const isConfirmed = window.confirm('Do you want to download the Excel file?');
    if (isConfirmed) {
      const dataForExcel = this.dataSource.filteredData.map(element => {
        const headingInUpperCase = {
          'AwbNo': element.AwbForManifest,
          'ERROR': element.error
        };  
        return headingInUpperCase;
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ManifestImport');
      XLSX.writeFile(wb, 'ErrorLog.xlsx');
    }
  }
}
