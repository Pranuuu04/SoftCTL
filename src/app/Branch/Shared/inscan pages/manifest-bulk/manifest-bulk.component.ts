import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder } from '@angular/forms';
import { AllServicesService } from 'app/service/all-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-manifest-bulk',
  templateUrl: './manifest-bulk.component.html',
  styleUrls: ['./manifest-bulk.component.css'],
})
export class ManifestBulkComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = ['select', 'Manifest_no', 'manifestDt', 'via', 'mode', 'shipment', 'qty', 'Manifestwt', 'vehicle_no', 'Driver_Name', 'Route'];
  sessionLocationCode: string;
  destinationName: string;
  showTable: boolean;
  selection = new SelectionModel<any>(true, []);
  scanbyManfBulkTable: any;
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
  userType: string;

  constructor(public dialog: MatDialog,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              public httpService: AllServicesService,
               private sharedService: SharedService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _mdr: MatDialogRef<ManifestBulkComponent>) {
}

ngOnInit(): void {
  this.sessionLocationCode = localStorage.getItem('originCode');
  this.userType = localStorage.getItem('userType');
  this.destinationName = this.sharedService.getSelectedValue();
  this.dispatch = localStorage.getItem('dispatch');
  // this.dataSource = new MatTableDataSource<any>(this.scanbyManfBulkTable);

    this.getScanManfData(this.pageIndex + 1, this.pageSize);

}
CloseDialog() {
this._mdr.close(false);
}
  toggleAllRows() {
    if (this.selection.hasValue() && this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  toggleRowSelection(row: any) {
    this.selection.toggle(row);
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
    if (this.userType === 'Admin') {
      this.httpService.getPendingScanManf(this.destinationName, this.dispatch, pageNumber, pageSize).subscribe((resp: any) => {
        if (resp.status === 1) {
         this.showTable = true;
         this.scanbyManfBulkTable = resp.Data;
         this.length = resp.Count;
        this.calculatePageCount();
         this.dataSource = new MatTableDataSource(this.scanbyManfBulkTable);
         setTimeout(() => {
           this.dataSource.paginator = this.paginator;
         });
         if (this.data.selectedRows && this.data.selectedRows.length > 0) {
           this.data.selectedRows.forEach((awbNo: string) => {
             const row = this.scanbyManfBulkTable.find((item: any) => item.Awbno === awbNo);
             if (row) {
               this.selection.select(row); // Preselect the matching rows
             }
           });
         }
        }
       }, error => {
         console.error('Error fetching data from API', error);
       });
    } else {
      this.httpService.getPendingScanManf(this.sessionLocationCode, this.dispatch, pageNumber, pageSize).subscribe((resp: any) => {
       if (resp.status === 1) {
        this.showTable = true;
        this.scanbyManfBulkTable = resp.Data;
        this.dataSource = new MatTableDataSource(this.scanbyManfBulkTable);
        this.length = resp.Count;
        this.calculatePageCount();
        if (this.data.selectedRows && this.data.selectedRows.length > 0) {
          this.data.selectedRows.forEach((awbNo: string) => {
            const row = this.scanbyManfBulkTable.find((item: any) => item.Awbno === awbNo);
            if (row) {
              this.selection.select(row); // Preselect the matching rows
            }
          });
        }
       }
      }, error => {
        console.error('Error fetching data from API', error);
      });
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
onLoad() {
  const selectedAwbNos = this.selection.selected.map(row => row.Manifest_no);
  if (this.selection.selected.length === 0) {
    this.openSnackBar('Please select at least one AWB number!', 'error-snackbar')
  } else {
    this._mdr.close(selectedAwbNos);
    this.openSnackBar('AWB numbers selected successfully!', 'custom-snackbar' )
  }
}
}
