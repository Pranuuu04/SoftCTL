import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { environment } from 'environments/environment.prod';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from '../../master.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-import-pd',
  templateUrl: './import-pd.component.html',
  styleUrls: ['./import-pd.component.css']
})
export class ImportPDComponent implements OnInit {

   createForm: any;
   uploadedData: unknown[];
   selectedOption: string;
   selectedFile: any;
   originCode: string | null;
   inputElement: HTMLInputElement;
   formData: FormData;
   orderOptions: string[] = ['Delivered', 'UnDelivered', 'RTO', 'RTC'];
   excelData: any[] = [];
  CustomerList: any;
  sessionLocationCode: string;
  @ViewChild('fileInput') fileInput!: ElementRef;
  supplierList: any;
  dataSource = new MatTableDataSource<any>([]);
displayedColumns: string[] = [
  'ID',
  'Customer_Code',
  'Supplier_Code',
  'DestinationCode',
  'DestinationName',
  'Lat_Long'
];
length = 0;
  pageSize = 10;
  pageIndex = 0;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  pageCount = 0;
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showTable = false;
  
  searchSubject = new Subject<string>();
  searchTerm: string = '';
  
  constructor(public dialog: MatDialog,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private getData: AllServicesService,
              private http: HttpClient,
              private bookingService: BookingService,
              private masterservice: MasterService) {
                this.originCode = localStorage.getItem('originCode');
              }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.getData.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
      this.CustomerList = [ { customerCode: 'Select Customer', customerName: 'Select Customer', disabled: true }, ...resp.Data];
      this.createForm.patchValue({ CustomerName: 'Select Customer' });
    });
    this.createForm = this.formbuilder.group({
      CustomerName: ['Select Customer', Validators.required],
      supplierName: ['', Validators.required],
      inputType: ['Deliverd', Validators.required]
    });

  this.createForm.get('CustomerName')?.valueChanges.subscribe(customerName => {
    this.loadSupplierData(customerName);
  });
   this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe((term) => {
      this.searchTerm = term.trim();
      this.pageIndex = 0;
      this.getTripSheetData(1, this.pageSize, this.searchTerm);
    });
    // this.searchSubject
    //   .pipe(
    //     debounceTime(500),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(searchTerm => {
    //     this.searchValue = searchTerm;
    //     this.pageIndex = 0;
    //     this.getTripSheetData(1, this.pageSize, searchTerm);
    //   });
  
  }

refresh() {  }
loadSupplierData(CustomerName: any) {
    this.bookingService.getShipper(CustomerName).subscribe((data: any) => {
      this.supplierList = data.Data;
    });
  }
   fromSubmit(formData) {
     const obj = {
       excel: formData.excel,
     }
     console.log(obj);
   }
   openSnackBar(message: string, panelClass: string) {
     this.snackBar.open(message, 'Close', {
       duration: 3000,
       horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass: [panelClass]
     });
   }

  private convertExcelTime(excelTime: any): string {
  if (excelTime === null || excelTime === undefined || excelTime === '') {
    return '00:00';
  }

  let timeNumber: number | null = null;

  if (typeof excelTime === 'number') {
    timeNumber = excelTime % 1;
  } else if (typeof excelTime === 'string') {
    const [h, m = '0'] = excelTime.split(':');
    const hours = parseInt(h, 10) % 24;
    const minutes = parseInt(m, 10);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  if (timeNumber !== null) {
    const totalSeconds = Math.round(timeNumber * 24 * 60 * 60);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  return '00:00';
}
onSearch(): void {
  if (this.createForm.valid) {
    const pageNumber = 1;
    const pageSize = this.pageSize;

    this.getTripSheetData(pageNumber, pageSize, this.searchTerm);
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
  const pageNumber = this.pageIndex + 1;
    this.calculatePageCount();
  this.getTripSheetData(pageNumber, this.pageSize, this.searchTerm);
}
getTripSheetData(pageNumber: number, pageSize: number, searchTerm: string = ''): void {
    const type = this.createForm.value.inputType;
  const customerCode = this.createForm.value.CustomerName;
  const supplierCode = this.createForm.value.supplierName;

  this.masterservice.getLatLongData(type, customerCode, supplierCode, pageNumber, pageSize, searchTerm).subscribe({
    next: (res) => {
      if (res.status === 1) {
        this.dataSource.data = res.Data;
        this.showTable = true;
        this.length = res.Count;
        this.calculatePageCount();
      } else {
        this.showTable = false;
      }
    },
    error: (err) => {
      console.error('API error:', err);
      this.showTable = false;
    }
  });
}
applySearch(value: string): void {
  this.searchSubject.next(value);
}
onFileSelected(event: any) {
  const file: File = event.target.files[0];
  this.selectedFile = file;

  if (file) {
    this.truncateErrorLog()
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      this.excelData = jsonData.map((row: any) => ({
        ...row,
        // OTR: this.convertExcelTime(row['OTR']),
        // OTA: this.convertExcelTime(row['OTA']),
        // LoadingIn: this.convertExcelTime(row['LoadingIn']),
        // LoadingOut: this.convertExcelTime(row['LoadingOut']),
        // 'Dispatch time': this.convertExcelTime(row['Dispatch time']),
      }));

    };


    reader.readAsArrayBuffer(file);
  }
}

   async processExcelFile(file: File) {
     const reader = new FileReader();

     reader.onload = (e) => {
       const fileContent = e.target?.result as ArrayBuffer;
       const arrayBuffer = new Uint8Array(fileContent);
       const data = new Array(arrayBuffer.length);

       for (let i = 0; i !== arrayBuffer.length; ++i) {
         data[i] = String.fromCharCode(arrayBuffer[i]);
       }

       const bstr = data.join('');
       const workbook = XLSX.read(bstr, { type: 'binary' });

       const firstSheetName = workbook.SheetNames[0];
       const worksheet = workbook.Sheets[firstSheetName];
     };

     reader.onerror = (error) => {
       console.error('Error processing Excel file:', error);
     };

     reader.readAsArrayBuffer(file);
   }

processExcelData(file: File) {
  if (!file) {
    this.openSnackBar('Please select a file to upload.', 'error-snackbar');
    return;
  }

  if (!this.excelData || this.excelData.length === 0) {
    this.openSnackBar('Excel file is empty. Please upload valid data.', 'error-snackbar');
    return;
  }

  const CustomerName = this.createForm.get('CustomerName')?.value;
  const supplierName = this.createForm.get('supplierName')?.value;
  const inputType = this.createForm.get('inputType')?.value;
  if (!CustomerName || !supplierName) {
    this.openSnackBar('Please fill all required fields before submitting.', 'error-snackbar');
    return;
  }

  const formattedExcelData = this.excelData.map((row: any) => ({
    inputName: inputType,
    Customer_Code: CustomerName,
    Supplier_Code: supplierName,
    DestinationCode: row['Destination Code'] || '',
    DestinationName: row['Destination Name'] || '',
    Lat_Long: row['Lat, long'] || '',
  }));

  const hasEmptyRow = formattedExcelData.some(item =>
    !item.DestinationCode || !item.DestinationName || !item.Lat_Long
  );

  if (hasEmptyRow) {
    this.openSnackBar('Some rows are missing required fields. Please check the file.', 'error-snackbar');
    return;
  }

  const requestBody = {
    excelData: formattedExcelData
  };

  const dialogRef = this.Excelprogressbar();
  this.http.post(`${environment.apiUrl}Trip/importLatLong`, requestBody).subscribe({
    next: (res: any) => {
      dialogRef.close();
      if (res.status === 1) {
        this.openSnackBar(res.message, 'custom-snackbar');
        this.createForm.reset();
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      } else {
        this.openSnackBar(res.message, 'error-snackbar');
      }
    },
    error: (err) => {
      dialogRef.close();
      this.openSnackBar('Error importing data. Please try again.', 'error-snackbar');
      console.error(err);
    }
  });
}


   generateExcel() {
     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       width: '25rem',
       data: { message: 'Are you sure you want to download the Excel file?' }
     });

     dialogRef.afterClosed().subscribe(result => {
       if (result) {
        const worksheetData = [
          ['Destination Code', 'Destination Name', 'Lat, long']
        ];

        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'ImportPD': worksheet },
          SheetNames: ['ImportPD']
        };

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blobData: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(blobData, 'ImportPD.xlsx');
        this.openSnackBar('Excel downloaded successfully', 'custom-snackbar');
  } else {
     this.openSnackBar('Download canceled', 'error-snackbar');
   }
 });
   }

   openprogressbar(selectedFile: string): MatDialogRef<ProgressBarComponent> {
     const dialogRef = this.dialog.open(ProgressBarComponent, {
       data: {
         action: 'add',
         fileName: selectedFile
       },
       width: '35rem',
       disableClose: true
     });
     return dialogRef;
   }

   truncateErrorLog() {
     this.http.get(`${environment.apiUrl}Trip/truncateLatLong`).subscribe(
         (response: any) => {
           console.log(response);
         },
         (error) => {
           console.error('Error truncating error log:', error);
         }
       );
     }

     Excelprogressbar(): MatDialogRef<ProgressBarComponent> {
       const dialogRef = this.dialog.open(ProgressBarComponent, {
         data: {
           action: 'docketPrint',
         },
         width: '20rem',
         disableClose: true
       });

       return dialogRef;
     }
generateLatLongErrorLog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25rem',
      data: { message: 'Are you sure you want to download the Trip Error Log?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.openSnackBar('Download canceled', 'error-snackbar');
        return;
      }
      this.http.get(`${environment.apiUrl}Trip/getLatLongLog`).subscribe(
        (response: any) => {
          if (response.status === 0) {
            this.openSnackBar(response.message || 'No error data found.', 'error-snackbar');
            // progressBarRef.close();
            return;
          }
      const progressBarRef = this.Excelprogressbar();

          const dataForExcel = response.Data.map((item: any) => ({
            'Destination Code': item.Destination_Code,
            'Destination Name': item.Destination_Name,
            'Lat, Long': item.Lat_Long,
            'Error': item.Error
          }));

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'TripErrorLog');
          XLSX.writeFile(wb, 'TripErrorLog.xlsx');

          progressBarRef.close();
          this.openSnackBar('Error log downloaded successfully.', 'custom-snackbar');
        },
        (error) => {
          console.error('Error fetching data from API:', error);
          this.openSnackBar('Failed to fetch error data.', 'error-snackbar');
        }
      );
    });
  }
}
