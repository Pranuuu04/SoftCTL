import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-drs-bulk',
  templateUrl: './drs-bulk.component.html',
  styleUrls: ['./drs-bulk.component.css']
})
export class DrsBulkComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: any[] = ['select', 'awbNo', 'bookDate', 'manifestNo', 'manifestDate' , 'customerType', 'consigneeName', 'Origin', 'Destination_Name', 'consigneePin', 'modeCode', 'Product_Type', 'Qty', 'ActualWt', 'totalAmt'];
  sessionLocationCode: string;
  userType: any;
  destinationName: string;
  showTable: boolean;
  selection = new SelectionModel<any>(true, []);
  createForm: any;
  currentDate: string;
  currentDate2: string;
  RunsheetViewTable: any;
  pageSizeOptions: number[] = [5, 10, 20];
  showFirstLastButtons: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 1;
  pageSize: number ;
  isLoading = false;
  DestinationName: any;
  destination: any = '';
  constructor( private _mdr: MatDialogRef<DrsBulkComponent>,
               public dialog: MatDialog,
               public formbuilder: FormBuilder,
               private http: HttpClient,
               private snackBar: MatSnackBar,
               public httpService: AllServicesService,
               private sharedService: SharedService,
               @Inject( MAT_DIALOG_DATA) public data: any ) {
               this.isLoading = false;
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.destinationName = this.sharedService.getSelectedValue();
    this.dataSource = new MatTableDataSource<any>(this.RunsheetViewTable);
    this.loadDestination();
    this.currentDate = this.getDefaultDate();
    this.currentDate2 = new Date().toISOString().split('T')[0];

    this.createForm  = this.formbuilder.group({
          fromDate: new FormControl('', Validators.compose([
            Validators.required
            ])),
          toDate: new FormControl('', Validators.compose([
            Validators.required
          ])),
          destination: new FormControl('', Validators.compose([
            Validators.required
          ])),
        });
      };
  CloseDialog() {
    this._mdr.close(false);
  }

  getDefaultDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = 1;
    const formattedDate = `${year}-${this.padZero(month)}-${this.padZero(day)}`;
    return formattedDate;
  }
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  loadDestination() {
    if (this.userType !== 'Admin') {
    this.httpService.GetDestination(this.sessionLocationCode).subscribe((resp: any) => {
        this.DestinationName = resp.Data;
      });
    } else {
      this.httpService.GetDestination(this.destinationName).subscribe((resp: any) => {
        this.DestinationName = resp.Data;
      });
    }
  }
  formSubmit(formData: any) {
    if (this.userType !== 'Admin') {
      if (formData.destination) {
        this.httpService
          .BulkRunsheetDest(
            this.sessionLocationCode,
            formData.destination,
            formData.fromDate,
            formData.toDate,
            this.currentPage
          )
          .subscribe((resp: any) => {
            if (resp.status === 1) {
              this.showTable = true;
              this.RunsheetViewTable = resp.Data;
              this.dataSource.data = this.RunsheetViewTable;
              setTimeout(() => {
                this.dataSource.paginator = this.paginator;
              });
              this.createForm.get('destination').reset();
              if (this.data.selectedRow && this.data.selectedRow.length > 0) {
                this.data.selectedRow.forEach((AwbNo: string) => {
                  const row = this.RunsheetViewTable.find((item: any) => item.awbNo === AwbNo);
                  if (row) {
                    this.selection.select(row);
                  }
                });
              }
            } else {
              this.openSnackBar(resp.message + ' by destination', 'error-snackbar');
              this.showTable = false;
            }
          });
      } else {
        this.httpService
          .BulkRunsheetDate(
            this.sessionLocationCode,
            formData.fromDate,
            formData.toDate,
            this.currentPage
          )
          .subscribe((resp: any) => {
            if (resp.status === 1) {
              this.showTable = true;
              this.RunsheetViewTable = resp.Data;
              this.dataSource.data = this.RunsheetViewTable;
              setTimeout(() => {
                this.dataSource.paginator = this.paginator;
              });
              if (this.data.selectedRow && this.data.selectedRow.length > 0) {
                this.data.selectedRow.forEach((AwbNo: string) => {
                  const row = this.RunsheetViewTable.find((item: any) => item.awbNo === AwbNo);
                  if (row) {
                    this.selection.select(row);
                  }
                });
              }
            } else {
              this.openSnackBar(resp.message + ' by Date', 'error-snackbar');
              this.showTable = false;
            }
          });
      }
    } else {
      if (formData.destination) {
        this.httpService
          .BulkRunsheetDest(
            this.destinationName,
            formData.destination,
            formData.fromDate,
            formData.toDate,
            this.currentPage
          )
          .subscribe((resp: any) => {
            if (resp.status === 1) {
              this.showTable = true;
              this.RunsheetViewTable = resp.Data;
              this.dataSource.data = this.RunsheetViewTable;
              setTimeout(() => {
                this.dataSource.paginator = this.paginator;
              });
              this.createForm.get('destination').reset();
              if (this.data.selectedRow && this.data.selectedRow.length > 0) {
                this.data.selectedRow.forEach((AwbNo: string) => {
                  const row = this.RunsheetViewTable.find((item: any) => item.awbNo === AwbNo);
                  if (row) {
                    this.selection.select(row);
                  }
                });
              }
            } else {
              this.openSnackBar(resp.message + ' by destination', 'error-snackbar');
              this.showTable = false;
            }
          });
      } else {
        this.httpService
          .BulkRunsheetDate(
            this.destinationName,
            formData.fromDate,
            formData.toDate,
            this.currentPage
          )
          .subscribe((resp: any) => {
            if (resp.status === 1) {
              this.showTable = true;
              this.RunsheetViewTable = resp.Data;
              this.dataSource.data = this.RunsheetViewTable;
              setTimeout(() => {
                this.dataSource.paginator = this.paginator;
              });
              if (this.data.selectedRow && this.data.selectedRow.length > 0) {
                this.data.selectedRow.forEach((AwbNo: string) => {
                  const row = this.RunsheetViewTable.find((item: any) => item.awbNo === AwbNo);
                  if (row) {
                    this.selection.select(row);
                  }
                });
              }
            } else {
              this.openSnackBar(resp.message + ' by Date', 'error-snackbar');
              this.showTable = false;
            }
          });
      }
    }

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
  onUnload() {
    const selectedAwbNos = this.selection.selected.map(row => row.awbNo);
    if (this.selection.selected.length === 0) {
      this.openSnackBar('Please select at least one AWB number!', 'error-snackbar')
    } else {
      this._mdr.close(selectedAwbNos);
      this.openSnackBar('AWB numbers selected successfully!', 'custom-snackbar' )
    }
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

}
