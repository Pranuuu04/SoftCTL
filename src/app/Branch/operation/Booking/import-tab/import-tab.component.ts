import { Component, OnInit, ViewChild } from '@angular/core';
import { AllServicesService } from 'app/service/all-services.service';
import * as XLSX from 'xlsx';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil, timer } from 'rxjs';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { BookingService } from '../booking.service';

type AOA = any[][];
@Component({
  selector: 'app-import-tab',
  templateUrl: './import-tab.component.html',
  styleUrls: ['./import-tab.component.css'],
})
export class ImportTabComponent implements OnInit{

@ViewChild('fileInput') fileInput: any;
uploadedData: any[] = null;
uploadedData2: any[] = null;
CustomerDisable: boolean = true;
withOutCustDisable: boolean =false;
data: AOA = [[1, 2], [3, 4]];
fileName: string ;
customerName: any;
sessionLocationCode: string;
selectedFile: any;
customerNameList: any;
selectedCustomerCode: any;
isDisabled: boolean = false;
progress = 0;
fileSelected: boolean = false;
totalSize: number = 0;
  selectedFileName: string;

constructor(private getData: AllServicesService,
            public httpService: HttpService,
            public httpClient: HttpClient,
            private router: Router,
            public dialog: MatDialog,
            public bookingService: BookingService,
            private _mdr: MatDialogRef<ImportTabComponent >,
            private snackBar: MatSnackBar) {}

ngOnInit(): void {
  this.loadConsignerData();
  this.sessionLocationCode = localStorage.getItem('originCode');

  const initialRadioValue = 'WithCust';
  if (initialRadioValue === 'WithCust') {
    this.CustomerDisable = false;
    this.withOutCustDisable = true;
  } else {
    this.CustomerDisable = true;
    this.withOutCustDisable = false;
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

generateExcel() {
  this.getData.generateExcel();
}

generateExcelwithOutCustomer() {
  this.getData.generateExcelwithOutCustomer();
}

handleFileInput(event: any) {
  const file = event.target.files[0];
  this.fileName = file.name;
  this.uploadedData = event.target.files;
  const previousFileSelected = this.fileSelected;
  this.selectedFileName = this.fileName;
  this.fileSelected = this.uploadedData && this.uploadedData.length > 0;
  if (this.fileSelected && previousFileSelected && this.uploadedData[0].name === this.selectedFileName) {
    this.fileSelected = false;
  }
  if (this.fileSelected) {
     const fileSize = file.size;

    let fileSizeDisplay: string;
    if (fileSize < 1024) {
      fileSizeDisplay = fileSize + ' bytes';
    } else if (fileSize < 1024 * 1024) {
      fileSizeDisplay = (fileSize / 1024).toFixed(2) + ' KB';
    } else {
      fileSizeDisplay = (fileSize / (1024 * 1024)).toFixed(2) + ' MB';
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      if (data.length <= 1) {
        this.openSnackBar('The selected file is empty.', 'error-snackbar');
        this.fileSelected = false;
        return;
      }

      const keys: string[] = data[0];
      const requiredKeys = ['AWBNO', 'BOOKDATE', 'CUSTOMER CODE', 'ORIGIN CODE', 'CONSIGNEE NAME', 'DESTINATION NAME', 'PINCODE', 'MODE NAME', 'PRODUCT NAME', 'DOXSPX', 'QTY', 'WEIGHT', 'VOLUMETRIC WT', 'INV VALUE', 'INV NO', 'EDD', 'REMARK'];
      const missingKeys = requiredKeys.filter(key => !keys.includes(key));

      if (missingKeys.length > 0) {
        this.openSnackBar(`please select correct file.`, 'error-snackbar')
        this.fileSelected = false;
        return;
      } else {
        this.fileSelected = true;
      }

      const formattedData = data.slice(1).map(row => {
        const rowData: any = {};
        keys.forEach((key, index) => {
    rowData[key] = row[index] !== undefined && row[index] !== null ? String(row[index]).trim() : '';
        });
        return rowData;
      });
       // Check for empty rows
 while (
  formattedData.length > 0 &&
  Object.values(formattedData[formattedData.length - 1]).every(value => value === '')
) {
  formattedData.pop();
}

// Now check if any *internal* rows are empty (optional)
const emptyRows = formattedData.filter(row =>
  Object.values(row).every(value =>
    value === null || value === undefined || String(value).trim() === ''
  )
);

       if (emptyRows.length > 0) {
         this.openSnackBar('The selected file contains empty rows.', 'error-snackbar');
         this.fileSelected = false;
         return;
       }

      this.uploadedData = formattedData;
      this.truncateErrorLog();
      this.totalSize = formattedData.length * 1000;
    };
    reader.readAsBinaryString(file);
  }
}
handleFileInput2(event: any) {
  const file = event.target.files[0];
  this.fileName = file.name;
  this.uploadedData2 = event.target.files;
  this.fileSelected = this.uploadedData2 && this.uploadedData2.length > 0;

  if (this.fileSelected) {
     const fileSize = file.size; // Size of the file in bytes

    // Convert file size to KB or MB
    let fileSizeDisplay: string;
    if (fileSize < 1024) {
      fileSizeDisplay = fileSize + ' bytes';
    } else if (fileSize < 1024 * 1024) {
      fileSizeDisplay = (fileSize / 1024).toFixed(2) + ' KB';
    } else {
      fileSizeDisplay = (fileSize / (1024 * 1024)).toFixed(2) + ' MB';
    }

    // Display file size
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      if (data.length <= 1) {
        this.openSnackBar('The selected file is empty.', 'error-snackbar');
        this.fileSelected = false;
        return;
      }

      const keys: string[] = data[0];
      // tslint:disable-next-line:max-line-length
      const requiredKeys = ['AWBNO', 'BOOKDATE', 'ORIGIN CODE', 'CONSIGNEE NAME', 'DESTINATION NAME', 'PINCODE', 'MODE NAME', 'PRODUCT NAME', 'DOXSPX', 'QTY', 'WEIGHT', 'VOLUMETRIC WT', 'INV VALUE', 'INV NO', 'EDD', 'REMARK'];
      const missingKeys = requiredKeys.filter(key => !keys.includes(key));
      if (keys.includes('CUSTOMER CODE')) {
        this.openSnackBar( `please select correct file.`, 'error-snackbar')
        this.fileSelected = false;
        return;
      }
      if (missingKeys.length > 0) {
        this.openSnackBar(`please select correct file.`, 'error-snackbar')
        this.fileSelected = false;
        return;
      } else {
        this.fileSelected = true;
      }

      const formattedData = data.slice(1).map(row => {
        const rowData: any = {};
        keys.forEach((key, index) => {
          rowData[key] = row[index] || '';
        });
        return rowData;
      });
    const emptyRows = formattedData.filter(row => Object.values(row).every(value => value === ''));
    if (emptyRows.length > 0) {
      this.openSnackBar('The selected file contains empty rows.', 'error-snackbar');
      this.fileSelected = false;
      return;
    }

      this.uploadedData2 = formattedData;
      this.truncateErrorLog();
      this.totalSize = formattedData.length * 1000;
    };
    reader.readAsBinaryString(file);
  }
}
// customer submit
submitcustomer() {
  if (this.fileSelected) {
    const excelData = this.prepareExcelData(this.uploadedData);
    const dialogRef = this.openprogressbar(this.fileName);

    this.httpClient.post(`${environment.apiUrl}Booking/importEntry`, { exelData: excelData }, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      takeUntil(dialogRef.componentInstance.getCancelSignal())
    ).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (this.totalSize) {
            const progress = Math.round( 100 * event.loaded / this.totalSize);
            dialogRef.componentInstance.progress = progress;
            dialogRef.componentInstance.currentItem = `Uploading ${progress} of ${this.uploadedData.length}`;
          }
        } else if (event.type === HttpEventType.Response) {
          const remainingProgress = 100 - dialogRef.componentInstance.progress;
          const increment = remainingProgress / 10;
          let currentProgress = dialogRef.componentInstance.progress;

          const interval = setInterval(() => {
            currentProgress += increment;
            dialogRef.componentInstance.progress = Math.min(Math.ceil(currentProgress), 100);
            if (currentProgress >= 100) {
              clearInterval(interval);
              timer(1000).subscribe(() => {
                dialogRef.close();
                const response: any = event.body;
                if (response.status === 0) {
                  this.openSnackBar(response.message, 'error-snackbar');
                } else {
                  this.openSnackBar(response.message, 'custom-snackbar');
                  this.CloseDialog();
                }
                this.selectedFile = null;
                if (this.fileInput) {
                  this.fileInput.nativeElement.value = null;
                }
                this.fileSelected = false;
              });
            }
          }, 10);
        }
      },
      // (error) => {
      //   dialogRef.close();
      //   this.openSnackBar('An error occurred while uploading the file. Please try again.', 'error-snackbar');
      //   this.fileSelected = false;
      // }
    );
  }
}

// without customer submit
submitWithoutCustomer() {
  if (this.fileSelected && this.selectedCustomerCode) {
    const excelData = this.ExcelWithoutCust(this.uploadedData2);
    const dialogRef = this.openprogressbar(this.fileName);

    this.httpClient.post(`${environment.apiUrl}Booking/importEntry`, { exelData: excelData }, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      takeUntil(dialogRef.componentInstance.getCancelSignal())
    ).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (this.totalSize) {
            const progress = Math.round(100 * event.loaded / this.totalSize);
            dialogRef.componentInstance.progress = progress;
            dialogRef.componentInstance.currentItem = `Uploading ${progress} of ${this.uploadedData2.length}`;
          }
        } else if (event.type === HttpEventType.Response) {
          const remainingProgress = 100 - dialogRef.componentInstance.progress;
          const increment = remainingProgress / 10;
          let currentProgress = dialogRef.componentInstance.progress;

          const interval = setInterval(() => {
            currentProgress += increment;
            dialogRef.componentInstance.progress = Math.min(Math.ceil(currentProgress), 100);
            if (currentProgress >= 100) {
              clearInterval(interval);
              timer(1000).subscribe(() => {
                dialogRef.close();
                const response: any = event.body;
                if (response.status === 0) {
                  this.openSnackBar(response.message, 'error-snackbar');
                } else {
                  this.openSnackBar(response.message, 'custom-snackbar');
                  this.CloseDialog();
                }
                this.selectedFile = null;
                this.selectedCustomerCode = null;
                if (this.fileInput) {
                  this.fileInput.nativeElement.value = null;
                }
                this.fileSelected = false;
              });
            }
          }, 10);
        }
      },
      (error) => {
        dialogRef.close();
        console.error('Error occurred while uploading file:', error);
        this.openSnackBar('An error occurred while uploading the file. Please try again.', 'error-snackbar');
        this.fileSelected = false;
      }
    );
  } else {
    this.openSnackBar('Please select a Customer name.', 'error-snackbar');
  }
}

prepareExcelData(data: any[]): any[] {
  return data.map(row => ({
    sessionLocationCode : this.sessionLocationCode,
    awbNo: row.AWBNO || '',
    bookDate: this.convertExcelDateToDateString(row.BOOKDATE) || '',
    customerCode: row['CUSTOMER CODE'] || '',
    originCode: row['ORIGIN CODE'] || '',
    consigneeName: row['CONSIGNEE NAME'] || '',
    consigneeAdd1: row['CONSIGNEE ADD1'] || '',
    consigneeAdd2: row['CONSIGNEE ADD2'] || '',
    consigneeAdd3: row['CONSIGNEE ADD3'] || '',
    consigneeAdd4: row['CONSIGNEE ADD4'] || '',
    destinationName: row['DESTINATION NAME'] || '',
    pincode: row.PINCODE  || '',
    vendorCode: row['VENDOR CODE'] || '',
    vendorAwbNo1: row.VENDORAWBNO1  || '',
    modeName: row['MODE NAME'] || '',
    productName: row['PRODUCT NAME'] || '',
    doxSpx: row.DOXSPX  || '',
    qty: row.QTY || '',
    weight: row.WEIGHT || '',
    volumetricWt: row['VOLUMETRIC WT'] || '',
    invValue: row['INV VALUE'] || 0,
    invNo: row['INV NO'] || '',
    ExpDelDate: this.convertExcelDateToDateString(row.EDD) || '',
    remark: row.REMARK || ''
  }));
}

// convertExcelDateToDateString(excelDate: number): string {
//   const date = new Date(Date.UTC(1900, 0, excelDate - 1));
//   return date.toISOString().split('T')[0];
// }
convertExcelDateToDateString(excelDate: any): string {
  if (!excelDate) {
    console.error('Invalid date:', excelDate);
    return '';
  }

  try {
    const jsDate = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    if (isNaN(jsDate.getTime())) {
      throw new Error('Invalid Excel date');
    }
    return jsDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error converting Excel date:', excelDate, error);
    return '';
  }
}

ExcelWithoutCust(data: any[]): any[] {
  return data.map(row => ({
    sessionLocationCode : this.sessionLocationCode,
    awbNo: row.AWBNO || '',
    bookDate: this.convertExcelDateToDateString(row.BOOKDATE) || '',
    customerCode: this.selectedCustomerCode || '',
    originCode: row['ORIGIN CODE'] || '',
    consigneeName: row['CONSIGNEE NAME'] || '',
    consigneeAdd1: row['CONSIGNEE ADD1'] || '',
    consigneeAdd2: row['CONSIGNEE ADD2'] || '',
    consigneeAdd3: row['CONSIGNEE ADD3'] || '',
    consigneeAdd4: row['CONSIGNEE ADD4'] || '',
    destinationName: row['DESTINATION NAME'] || '',
    pincode: row.PINCODE || '',
    vendorCode: row['VENDOR CODE'] || '',
    vendorAwbNo1: row.VENDORAWBNO1 || '',
    modeName: row['MODE NAME'] || '',
    productName: row['PRODUCT NAME'] || '',
    doxSpx: row.DOXSPX || '',
    qty: row.QTY || '',
    weight: row.WEIGHT || '',
    volumetricWt: row['VOLUMETRIC WT'] || '',
    invValue: row['INV VALUE'] || 0,
    invNo: row['INV NO'] || '',
    ExpDelDate: this.convertExcelDateToDateString(row.EDD) || '',
    remark: row.REMARK  || ''
  }));
}

openprogressbar(fileName: string): MatDialogRef<ProgressBarComponent> {
const dialogRef = this.dialog.open(ProgressBarComponent, {
  data: {
    action: 'add',
    fileName: fileName
  },
  width: '30rem',
  disableClose: true
});
return dialogRef;
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
onCheckedCust() {
  this.CustomerDisable = false;
  this.withOutCustDisable = true;
  this.clearFileSelection();
}
onCheckedWithoutCust() {
  this.CustomerDisable = true;
  this.withOutCustDisable = false;
  this.clearFileSelection();
}

clearFileSelection() {
  this.selectedFile = null;
  if (this.fileInput) {
    this.fileInput.nativeElement.value = null;
  }
  this.fileSelected = false;
}

loadConsignerData() {
  this.bookingService.loadConsignerData(this.sessionLocationCode)
  .subscribe(
    (resp) => {
      this.customerNameList = resp.Data;
    })
}
CloseDialog() {
  this._mdr.close(false);
  this.router.navigate(['/branch-dashboard']);
}

generateExcelCust() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '25rem',
    data: { message: 'Are you sure you want to download the Excel file?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const progressBarRef = this.Excelprogressbar();

      this.bookingService.getBookingErrorLog().subscribe(
        (response: any) => {
          if ( response.status === 1 ) {
            const dataForExcel = response.Data.map(element => ({
              'AWBNO': element.awbNo,
              'BOOKDATE': element.bookDate,
              'CUSTOMER CODE': element.customerCode,
              'ORIGIN CODE': element.originCode,
              'CONSIGNEE NAME': element.consigneeName,
              'CONSIGNEE ADD1': element.consigneeAdd1,
              'CONSIGNEE ADD2': element.consigneeAdd2,
              'CONSIGNEE ADD3': element.consigneeAdd3,
              'CONSIGNEE ADD4': element.consigneeAdd4,
              'DESTINATION NAME': element.destinationName,
              'PINCODE': element.pinCode,
              'VENDOR CODE': element.vendorCode,
              'VENDORAWBNO1': element.vendorAwbNo1,
              'MODE NAME': element.modeName,
              'PRODUCT NAME': element.productName,
              'DOXSPX': element.doxSpx,
              'QTY': element.qty,
              'WEIGHT': element.weight,
              'VOLUMETRIC WT': element.volumetricWt,
              'INV VALUE': element.invValue,
              'INV NO': element.invNo,
              'EDD': element.ExpDelDate,
              'REMARK': element.remark,
              'ERROR': element.error
            }));
  
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
            XLSX.writeFile(wb, 'ErrorLog.xlsx');
            progressBarRef.close();
            this.openSnackBar('File downloaded successfully', 'custom-snackbar');
          } else {
            progressBarRef.close();
            this.openSnackBar(response.message, 'error-snackbar');
          }
        },
        error => {
          console.error('Error fetching data from API', error);
          progressBarRef.close();
          this.openSnackBar('An error occurred while downloading the file.', 'error-snackbar');
        }
      );
    } else {
      this.openSnackBar('Download canceled', 'error-snackbar');
    }
  });
}

generateExcelWithCust() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '25rem',
    data: { message: 'Are you sure you want to download the Excel file?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const progressBarRef = this.Excelprogressbar();

      this.bookingService.getBookingErrorLog().subscribe(
        (response: any) => {
          const dataForExcel = response.Data.map(element => ({
            'AWBNO': element.awbNo,
            'BOOKDATE': element.bookDate,
            'ORIGIN CODE': element.originCode,
            'CONSIGNEE NAME': element.consigneeName,
            'CONSIGNEE ADD1': element.consigneeAdd1,
            'CONSIGNEE ADD2': element.consigneeAdd2,
            'CONSIGNEE ADD3': element.consigneeAdd3,
            'CONSIGNEE ADD4': element.consigneeAdd4,
            'DESTINATION NAME': element.destinationName,
            'PINCODE': element.pinCode,
            'VENDOR CODE': element.vendorCode,
            'VENDORAWBNO1': element.vendorAwbNo1,
            'MODE NAME': element.modeName,
            'PRODUCT NAME': element.productName,
            'DOXSPX': element.doxSpx,
            'QTY': element.qty,
            'WEIGHT': element.weight,
            'VOLUMETRIC WT': element.volumetricWt,
            'INV VALUE': element.invValue,
            'INV NO': element.invNo,
            'EDD': element.ExpDelDate,
            'REMARK': element.remark,
            'ERROR': element.error
          }));

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
          XLSX.writeFile(wb, 'ErrorLog.xlsx');

          progressBarRef.close();
          this.openSnackBar('File downloaded successfully', 'custom-snackbar');
        },
        error => {
          console.error('Error fetching data from API', error);
          progressBarRef.close();
          this.openSnackBar('An error occurred while fetching data.', 'error-snackbar');
        }
      );
    } else {
      this.openSnackBar('Download canceled', 'error-snackbar');
    }
  });
}
truncateErrorLog() {
  this.bookingService.truncateErrorLog().subscribe(
    (response: any) => {
      console.log(response);
    },
    (error) => {
      console.error('Error truncating error log:', error);
    }
  );
}

}

