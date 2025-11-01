import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import * as XLSX from 'xlsx';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AllServicesService } from 'app/service/all-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WMSService } from 'app/Branch/wms.service';

@Component({
  selector: 'app-stock-in-report',
  templateUrl: './stock-in-report.component.html',
  styleUrls: ['./stock-in-report.component.css']
})
export class StockInReportComponent implements OnInit {

  originName: string;
  createForm: FormGroup;
  validationMessage: any = [];
  DestinationName: any[];
  sessionLocationCode: string;
  customerName: any;
  VehicleNo: any;
  listData: any = [];
  showTable = false;
  vehicleNumbers: string[] = [];
  selectedType = 'Self';
  tripsheet: any;
  userType: any;
  destinationName: any = 'All';
  CustomerList: any;
  customerForm: FormGroup;
  displayedColumns: string[] = [
    'Origin', 'WarehouseName', 'PostingDate', 'EntryType', 'SupplierName',
    'InvNo', 'InvDate', 'TransporterName', 'DocketNo', 'EmployeeName',
    'ItemType', 'EwaybillNo', 'EwaybillDate', 'Remark', 'ItemNo', 'ItemName',
    'SerialNo', 'QTY'
  ];
  dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
 length = 0;
 pageSize = 10;
 pageIndex = 0;
 showFirstLastButtons = true;
 hidePageSize = false;
 disabled = false;
 pageCount = 0;
 pageSizeOptions = [5, 10, 20];
 pageEvent: PageEvent;
 showPageSizeOptions = false;
  toDate: string;
  fromDate: string;
  itemList: any;
  serialNo = ''

  constructor(public AllService: AllServicesService,
              public wmsservice: WMSService,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private snackBar: MatSnackBar, ) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
               }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.dataSource = new MatTableDataSource;

    this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
     this.CustomerList = resp.Data;
    })
    this.getItem();
    this.createForm = this.formBuilder.group({
      supplierName: ['All', Validators.required],
     itemName: ['All', Validators.required],
     fromDate: ['', Validators.required],
     toDate: ['', Validators.required],
   });

  this.validationMessage = {
   supplierName: [
     { type: 'required', message: 'Supplier name is required' }
   ],
   itemName: [
     { type: 'required', message: 'Item name is required' }
   ],
  fromDate: [
    { type: 'required', message: 'fromDate is required' }
  ],
  toDate: [
    { type: 'required', message: 'toDate is required' }
  ],
 };

  }
  refresh() {
    throw new Error('Method not implemented.');
  }

  getDefaultDate(): string {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.formatDate(firstDayOfMonth);
  }

  getCurrentDate(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

getItem() {
  this.wmsservice.getItem(this.serialNo).subscribe((resp: any) => {
    this.itemList = resp.Data;
  });
 }
 openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
   openprogressbar(): MatDialogRef<ProgressBarComponent> {
      const dialogRef = this.dialog.open(ProgressBarComponent, {
        data: {
            action: 'docketPrint',
        },
          width: '20rem',
          disableClose: true,
        });
        return dialogRef;
      }

      downloadSample() {
        const isConfirmed = window.confirm('Do you want to download the Excel file?');
        if (isConfirmed) {
            this.wmsservice.getWMSStockInReport(
              this.createForm.value.fromDate,
              this.createForm.value.toDate,
              this.createForm.value.itemName,
              this.createForm.value.supplierName,
              1,
              this.length
            ).subscribe((response: any) => {
              if (response.status === 1 && Array.isArray(response.Data)) {
                const progressBar = this.openprogressbar();
                const dataForExcel = response.Data.map(element => ({
                  Origin: element.Origin,
                  WarehouseName: element.WarehouseName,
                  PostingDate: element.PostingDate,
                  EntryType: element.EntryType,
                  SupplierName: element.SupplierName,
                  InvNo: element.InvNo,
                  InvDate: element.InvDate,
                  TransporterName: element.TransporterName,
                  DocketNo: element.DocketNo,
                  EmployeeName: element.EmployeeName,
                  ItemType: element.ItemType,
                  EwaybillNo: element.EwaybillNo,
                  EwaybillDate: element.EwaybillDate,
                  Remark: element.Remark,
                  ItemName: element.ItemName,
                  SerialNo: element.SerialNo,
                  QTY: element.QTY
                }));

                const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
                const wb: XLSX.WorkBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
                XLSX.writeFile(wb, 'stockIn_Details.xlsx');
                progressBar.close();

              } else {
                console.error('response.result is not an array:', response.result);
                this.openSnackBar('No data found or an error occurred.', 'error-snackbar');
              }

            });
        }
      }

  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.calculatePageCount();

    // Use current form data to fetch next page
    const formData = this.createForm.value;
    this.StockInReport(formData);
  }
  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }
  StockInReport(formData: any) {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.openSnackBar('Please fill all required fields', 'error-snackbar');
      return;
    }
    const supplierName = formData.supplierName;
    const itemName = formData.itemName;
    const fromDate = formData.fromDate;
    const toDate = formData.toDate;

    this.wmsservice.getWMSStockInReport(
      fromDate,
      toDate,
      itemName,
      supplierName,
      this.pageIndex + 1,
      this.pageSize
    ).subscribe({
      next: (resp: any) => {
        if (resp.status === 1) {
          this.showTable = true;
          this.dataSource = resp.Data;
          this.length = resp.count;
          this.calculatePageCount();
          this.openSnackBar(resp.message, 'custom-snackbar');
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
          this.showTable = false;

        }
      },
      error: () => {
        this.openSnackBar('Failed to fetch Stockin reports', 'error-snackbar');
      }
    });
  }


}
