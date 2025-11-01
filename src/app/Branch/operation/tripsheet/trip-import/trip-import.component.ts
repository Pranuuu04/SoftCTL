import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-trip-import',
  templateUrl: './trip-import.component.html',
  styleUrls: ['./trip-import.component.css']
})
export class TripImportComponent implements OnInit {

   updateform: any;
   uploadedData: unknown[];
   selectedOption: string;
   selectedFile: any;
   originCode: string | null;
   inputElement: HTMLInputElement;
   formData: FormData;
   excelData: any[] = [];
  CustomerList: any;
  sessionLocationCode: string;
  @ViewChild('fileInput') fileInput!: ElementRef;

   constructor(public dialog: MatDialog,
               public formbuilder: FormBuilder,
               private snackBar: MatSnackBar,
               private getData: AllServicesService,
               private http: HttpClient) {
                 this.originCode = localStorage.getItem('originCode');
               }

   ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.getData.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
      this.CustomerList = resp.Data;
     });
     this.updateform = this.formbuilder.group({
      custName: ['', Validators.required],
      Date: ['', Validators.required]
     });
   }

 refresh() {  }

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

onFileSelected(event: any) {
  const file: File = event.target.files[0];
  this.selectedFile = file;

  if (file) {
    this.truncateErrorLog();
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      this.excelData = jsonData.map((row: any) => ({
        ...row,
        'Reporting time': this.convertExcelTime(row['Reporting time']),
        'Store In': this.convertExcelTime(row['Store In']),
        LoadingIn: this.convertExcelTime(row['LoadingIn']),
        LoadingOut: this.convertExcelTime(row['LoadingOut']),
        'Dispatch time': this.convertExcelTime(row['Dispatch time']),
        Transit: this.convertExcelTime(row['Transit']),
        'Store out': this.convertExcelTime(row['Store out']),
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

    const custCode = this.updateform.get('custName')?.value;
    const date = this.updateform.get('Date')?.value;

    if (!custCode || !date) {
      this.openSnackBar('Please fill all required fields before submitting.', 'error-snackbar');
      return;
    }

    const formattedExcelData = this.excelData.map((row: any) => ({
      Customer_Code: custCode,
      Date: new Date(date).toISOString(),
      Route: row['Route'],
      OTR: row['Reporting time'] || '',
      LoadingIn: row['LoadingIn'] || '',
      LoadingOut: row['LoadingOut'] || '',
      DispatchTime: row['Dispatch time'] || '',
      InTransit: row['Transit'] || '',
      Qty: row['QT'] || row['Qty'] || '',
      OTA: row['Store In'] || '',
      storeOutTime: row['Store out'] || '',
      vehicleType: row['Vehicle type'] || row['vehicleType'] || '',
      supplierName: row['Supplier name'] || '',
      Remark: row['Remark'] || ''
    }));

    const hasEmptyRow = formattedExcelData.some(item =>
      !item.Route || !item.OTR || !item.LoadingIn || !item.LoadingOut || !item.DispatchTime  || !item.InTransit || !item.Qty || !item.OTA || !item.storeOutTime || !item.vehicleType 
    );

    if (hasEmptyRow) {
      this.openSnackBar('Some rows are missing required fields. Please check the file.', 'error-snackbar');
      return;
    }

    const requestBody = {
      excelData: formattedExcelData
    };

    const dialogRef = this.Excelprogressbar();

    this.http.post(`${environment.apiUrl}Trip/importTrip`, requestBody).subscribe({
      next: (res: any) => {
        dialogRef.close();
        if (res.status === 1) {
          this.openSnackBar(res.message, 'custom-snackbar');
          this.updateform.reset();
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        } else {
          this.openSnackBar(res.message , 'error-snackbar');
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
          ['Route', 'Reporting time', 'LoadingIn', 'LoadingOut', 'Dispatch time', 'Transit', 'QT', 'Store In', 'Store out', 'Vehicle type', 'Supplier name', 'Remark'],
        ];

        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Sheet1': worksheet },
          SheetNames: ['Sheet1']
        };

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blobData: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(blobData, 'TripSheet.xlsx');
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
     this.http.get(`${environment.apiUrl}Trip/truncateTripImport`).subscribe(
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
     generateTripErrorLog() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '25rem',
    data: { message: 'Are you sure you want to download the Error Log?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.http.get(`${environment.apiUrl}Trip/getTripErrorLog`)
        .subscribe((response: any) => {
          if (response.status === 0) {
            this.openSnackBar(response.message, 'error-snackbar');
            return;
          }

          const progressBarRef = this.Excelprogressbar();

          const dataForExcel = response.Data.map((element: any) => ({
            'Route': element.Route,
            'Reporting Time': element.OTR,
            'Qty': element.Qty,
            'Store In': element.OTA,
            'Loading In': element.LoadingIn,
            'Loading Out': element.LoadingOut,
            'Dispatch Time': element.DispatchTime,
            'Transit': element.InTransit,
            'Store Out': element.storeOutTime,
            'Vehicle Type': element.vehicleType,
            'Supplier Name': element.supplierName,
            'Remark': element.Remark,
            'Error': element.Error
          }));

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'TripErrorLog');
          XLSX.writeFile(wb, 'TripErrorLog.xlsx');

          progressBarRef.close();
          this.openSnackBar(response.message, 'custom-snackbar');
        },
        error => {
          console.error('Error fetching error log:', error);
          this.openSnackBar('Failed to fetch error log. Please try again.', 'error-snackbar');
        });
    } else {
      this.openSnackBar('Download canceled', 'error-snackbar');
    }
  });
}

}
