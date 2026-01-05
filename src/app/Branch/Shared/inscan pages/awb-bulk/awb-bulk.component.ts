import { Component,  Inject,  OnInit,  ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder } from '@angular/forms';
import { AllServicesService } from 'app/service/all-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-awb-bulk',
  templateUrl: './awb-bulk.component.html',
  styleUrls: ['./awb-bulk.component.css'],
})
export class AwbBulkComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = ['select', 'Awbno', 'Bookdate', 'ManifestNo', 'manifestDt', 'Customer_Name', 'ConsigneeName', 'FromDest', 'ToDest', 'qty', 'actualwT', 'ManifestWt'];
  sessionLocationCode: string;
  destinationName: string;
  showTable: boolean;
  selection = new SelectionModel<any>(true, []);
  scanbyAwbBulkTable: any;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageCount = 0;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  showPageSizeOptions = false;
  pageEvent: PageEvent;
  dispatch: string;
allSelectedAwbs: string[] = [];

  constructor(public dialog: MatDialog,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private sharedService: SharedService,
              public httpService: AllServicesService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _mdr: MatDialogRef<AwbBulkComponent>) {
}

ngOnInit(): void {
  this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
  ? localStorage.getItem('originCode')
  : localStorage.getItem('selectedValue');
  this.destinationName = this.sharedService.getSelectedValue();
  this.dispatch = localStorage.getItem('dispatch');
    this.getScanAwbData(this.pageIndex + 1, this.pageSize);

}
CloseDialog() {
this._mdr.close(false);
}
toggleAllRows() {
  if (this.allSelectedAwbs.length === this.length) {
    this.allSelectedAwbs = [];
    this.selection.clear();
    return;
  }

  this.httpService
    .getPendingInscan(this.sessionLocationCode, this.dispatch, 1, this.length)
    .subscribe((resp: any) => {
      if (resp.status === 1) {
        this.allSelectedAwbs = resp.Data.map((x: any) => x.Awbno);
        this.selection.clear();
        this.scanbyAwbBulkTable.forEach((row: any) => {
          if (this.allSelectedAwbs.includes(row.Awbno)) {
            this.selection.select(row);
          }
        });
      }
    });
}

  isAllSelected() {
  return this.allSelectedAwbs.length === this.length;
}

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

toggleRowSelection(row: any) {

  this.selection.toggle(row);

  if (this.selection.isSelected(row)) {
    if (!this.allSelectedAwbs.includes(row.Awbno)) {
      this.allSelectedAwbs.push(row.Awbno);
    }
  } else {
    this.allSelectedAwbs = this.allSelectedAwbs.filter(
      awb => awb !== row.Awbno
    );
  }
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
    this.getScanAwbData(pageNumber, this.pageSize);
  }

  getScanAwbData(pageNumber: number, pageSize: number) {
       this.httpService.getPendingInscan(this.sessionLocationCode, this.dispatch, pageNumber, pageSize).subscribe((resp: any) => {
       if (resp.status === 1) {
        this.showTable = true;
        this.scanbyAwbBulkTable = resp.Data;
        this.dataSource = new MatTableDataSource(this.scanbyAwbBulkTable);
        this.length = resp.Count;
        this.calculatePageCount();
        if (this.data.selectedRows && this.data.selectedRows.length > 0) {
          this.data.selectedRows.forEach((awbNo: string) => {
            const row = this.scanbyAwbBulkTable.find((item: any) => item.Awbno === awbNo);
            if (row) {
              this.selection.select(row);
            }
          });
        }
       } else {
          this.showTable = false;
          this.scanbyAwbBulkTable = [];
          this.dataSource = new MatTableDataSource([]);
        }
      }, error => {
        console.error('Error fetching data from API', error);
      });
    // }
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
onLoad() {

  if (this.allSelectedAwbs.length === 0) {
    this.openSnackBar('Please select at least one AWB number!', 'error-snackbar');
    return;
  }

  this._mdr.close(this.allSelectedAwbs);

  this.openSnackBar('AWB numbers selected successfully!', 'custom-snackbar');
}

}
