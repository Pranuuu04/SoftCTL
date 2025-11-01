import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bulk-pod',
  templateUrl: './bulk-pod.component.html',
  styleUrls: ['./bulk-pod.component.css']
})
export class BulkPodComponent implements OnInit {

  updateform: any;
  uploadedData: any[] = [];
  selectedOption: string;
  selectedFile: any;
  originCode: string | null;
  inputElement: HTMLInputElement;
  formData: FormData;
  orderOptions: string[] = ['Delivered', 'UnDelivered', 'RTO', 'RTC'];

  constructor(public dialog: MatDialog,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private getData: AllServicesService,
              private http: HttpClient) {
                this.originCode = localStorage.getItem('originCode');
              }

  ngOnInit(): void {
    this.selectedOption = '';
    this.updateform = this.formbuilder.group({
      excel: new FormControl('', Validators.compose([Validators.required])),
      order: new FormControl(this.selectedOption, Validators.compose([Validators.required])),
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

  onFileSelected(event: Event) {
    this.inputElement = event.target as HTMLInputElement;
    this.selectedFile = this.inputElement.files?.[0];

    if (this.selectedFile) {
      this.truncateErrorLog();
      this.processExcelFile(this.selectedFile);
    }
  }
async processExcelFile(file: File) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const fileContent = e.target?.result as ArrayBuffer;
    const data = new Uint8Array(fileContent);

    let binary = '';
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }

    const workbook = XLSX.read(binary, { type: 'binary' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const rawData = XLSX.utils.sheet_to_json<any>(worksheet);

    this.uploadedData = rawData.map((row: any) => {
      return {
        AwbNo: row['AwbNo'],
        DelvDT: this.convertExcelDateToDateString(row.DelVDT) ,
        DelvTime: this.convertExcelTime(row['DelvTime']),
        NatureOfRecipt: row['NatureOfRecipt'],
        RecvName: row['RecvName'],
        TelNo: row['TelNo'],
        RecvRemark: row['RecvRemark'],
        Reason: row['Reason'] || '',
        Status: this.updateform.value.order,
        SessionLocationCode: this.originCode
      };
    });

    console.log('Final Excel Data (Objects):', this.uploadedData);
  };

  reader.onerror = (error) => {
    console.error('Error processing Excel file:', error);
  };

  reader.readAsArrayBuffer(file);
}

  private convertExcelTime(excelTime: any): string {
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

    return '';
  }
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

// processExcelData() {
//   if (this.uploadedData && this.uploadedData.length > 0) {
//     const payload = {
//       excelData: this.uploadedData   // Wrap in object
//     };

//     const dialogRef = this.openprogressbar(this.selectedFile);

//     this.http.post(`${environment.apiUrl}Booking/importpod`, payload).subscribe(
//       (response: any) => {
//         console.log('Response:', response);
//         if (response.status === 1) {
//           this.openSnackBar(response.message, 'custom-snackbar');
//           this.updateform.reset();
//           this.uploadedData = [];
//         } else {
//           this.openSnackBar(response.message, 'error-snackbar');
//         }
//         dialogRef.close();
//       },
//       (error) => {
//         dialogRef.close();
//         console.error('Error sending data:', error);
//       }
//     );
//   } else {
//     console.warn('No valid Excel data to upload.');
//   }
// }
processExcelData() {
  if (!this.uploadedData || this.uploadedData.length === 0) {
    console.warn('No valid Excel data to upload.');
    return;
  }

  if (['UnDelivered', 'RTO', 'RTC'].includes(this.updateform.value.order)) {
    const invalidRows = this.uploadedData.filter((row: any) => !row.Reason || row.Reason.trim() === '');

    if (invalidRows.length > 0) {
      this.openSnackBar(`Reason cannot be empty for ${this.updateform.value.order}. Please fill all rows.`, 'error-snackbar');
      this.selectedFile = null;
      const fileInputEl = document.getElementById('Import') as HTMLInputElement;
      if (fileInputEl) {
        fileInputEl.value = '';
      }
      return;
    }
  }

  const payload = {
    excelData: this.uploadedData
  };

  const dialogRef = this.openprogressbar(this.selectedFile);

  this.http.post(`${environment.apiUrl}Booking/importpod`, payload).subscribe(
    (response: any) => {
      console.log('Response:', response);
      if (response.status === 1) {
        this.openSnackBar(response.message, 'custom-snackbar');
        this.updateform.reset();
        this.uploadedData = [];
      } else {
        this.openSnackBar(response.message, 'error-snackbar');
      }
         this.selectedFile = null;
      const fileInputEl = document.getElementById('Import') as HTMLInputElement;
      if (fileInputEl) {
        fileInputEl.value = '';
      }
      dialogRef.close();
    },
    (error) => {
         this.selectedFile = null;
      const fileInputEl = document.getElementById('Import') as HTMLInputElement;
      if (fileInputEl) {
        fileInputEl.value = '';
      }
      dialogRef.close();
      console.error('Error sending data:', error);
    }
  );
}


  generateExcelDelivered() {
    this.getData.generateExcelDelivered();
  }

  generateExcelUndelivered() {
    this.getData.generateExcelUndelivered();
  }

  generateExcelRTC() {
    this.getData.generateExcelRTC();
  }

  generateExcelRTO() {
    this.getData.generateExcelRTO();
  }

  generateExcel() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25rem',
      data: { message: 'Are you sure you want to download the Excel file?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
    if (this.selectedOption) {
      switch (this.selectedOption) {
        case 'Delivered':
          this.getData.generateExcelDelivered();
          break;
        case 'UnDelivered':
          this.getData.generateExcelUndelivered();
          break;
        case 'RTC':
          this.getData.generateExcelRTC();
          break;
        case 'RTO':
          this.getData.generateExcelRTO();
          break;
        default:
          console.error('Invalid option selected');
      }
    } else {
      this.openSnackBar('Please first select status', 'error-snackbar');
    }
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
    this.http.get(`${environment.apiUrl}Booking/truncatePodImport`).subscribe(
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

    generateErrorLog() {
      if (!this.selectedOption) {
        this.openSnackBar('Please select a status first', 'error-snackbar');
        return;
      }

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '25rem',
        data: { message: 'Are you sure you want to download the Excel file?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.http.get(`${environment.apiUrl}Booking/getPodErrorLog`)
            .subscribe((response: any) => {
              if (response.status === 0) {
                this.openSnackBar(response.message, 'error-snackbar');
                return;
              }

              const progressBarRef = this.Excelprogressbar();

              let dataForExcel;

              if (this.selectedOption === 'Delivered') {
                dataForExcel = response.Data.map(element => ({
                  'AwbNo': element.awbNo,
                  'DelVDT': element.delvDT,
                  'DelvTime': element.delvTime,
                  'NatureOfRecipt': element.NatureOfRecipt,
                  'RecvName': element.recvName,
                  'RecvRemark': element.recvRemark,
                  'TelNo': element.telNo,
                  'Error': element.error,
                }));
              } else if (this.selectedOption === 'UnDelivered' || this.selectedOption === 'RTC' || this.selectedOption === 'RTO') {
                dataForExcel = response.Data.map(element => ({
                  'AwbNo': element.awbNo,
                  'DelVDT': element.delvDT,
                  'DelvTime': element.delvTime,
                  'RecvRemark': element.recvRemark,
                  'Reason': element.Reason,
                  'Error': element.error,
                }));
              } else {
                console.error('Invalid status selected');
                progressBarRef.close();
                return;
              }

              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'podsheet');
              XLSX.writeFile(wb, 'ErrorLog.xlsx');
              progressBarRef.close();
              this.openSnackBar('File downloaded successfully', 'custom-snackbar');
            },
            error => {
              console.error('Error fetching data from API', error);
            });
        } else {
          this.openSnackBar('Download canceled', 'error-snackbar');
        }
      });
    }

}
