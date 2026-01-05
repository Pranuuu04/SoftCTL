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
  allSelectedManifests: string[] = [];


  constructor(public dialog: MatDialog,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              public httpService: AllServicesService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _mdr: MatDialogRef<ManifestBulkComponent>) {
}

ngOnInit(): void {
      this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');
  this.userType = localStorage.getItem('userType');
  this.dispatch = localStorage.getItem('dispatch');
    this.getScanManfData(this.pageIndex + 1, this.pageSize);

}
CloseDialog() {
this._mdr.close(false);
}
toggleAllRows() {
  if (this.allSelectedManifests.length === this.length) {
    this.allSelectedManifests = [];
    this.selection.clear();
    return;
  }
 this.httpService
    .getPendingScanManf(this.sessionLocationCode, this.dispatch, 1, this.length)
    .subscribe((resp: any) => {
      if (resp.status === 1) {
        this.allSelectedManifests = resp.Data.map((x: any) => x.Manifest_no);
        this.selection.clear();
        this.scanbyManfBulkTable.forEach((row: any) => {
          if (this.allSelectedManifests.includes(row.Manifest_no)) {
            this.selection.select(row);
          }
        });
      }
    });
}



isAllSelected() {
  return this.allSelectedManifests.length === this.length;
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
    if (!this.allSelectedManifests.includes(row.Manifest_no)) {
      this.allSelectedManifests.push(row.Manifest_no);
    }
  } else {
    this.allSelectedManifests = this.allSelectedManifests.filter(
      id => id !== row.Manifest_no
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
  this.getScanManfData(pageNumber, this.pageSize);
}
  getScanManfData(pageNumber: number, pageSize: number) {
    if (this.userType === 'Admin') {
      this.httpService.getPendingScanManf(this.sessionLocationCode, this.dispatch, pageNumber, pageSize).subscribe((resp: any) => {
        if (resp.status === 1) {
         this.showTable = true;
         this.scanbyManfBulkTable = resp.Data;
         this.length = resp.Count;
        this.calculatePageCount();
         this.dataSource = new MatTableDataSource(this.scanbyManfBulkTable);
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

  if (this.allSelectedManifests.length === 0) {
    this.openSnackBar('Please select at least one manifest!', 'error-snackbar');
    return;
  }

  this._mdr.close(this.allSelectedManifests);

  this.openSnackBar('Manifest numbers selected successfully!', 'custom-snackbar');
}

}
