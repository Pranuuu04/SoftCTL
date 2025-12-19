import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Component({
  selector: 'app-rate-import',
  templateUrl: './rate-import.component.html',
  styleUrls: ['./rate-import.component.css']
})
export class RateImportComponent implements OnInit {

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
  trainFlightOptions: any[] = [];
  originList: any;
   zoneList: any;
  productList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  destinationList: any[] = [];
  modeList: any[] = [];
  flightData: any[] = [];
  selectedMode = '';
  trainData: any[] = [];
  rateDetailsArray: any[] = [];
  isExcelValid = false;
  constructor(public dialog: MatDialog,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              public AllService: AllServicesService,
              public masterService: MasterService,
              private http: HttpClient,
              private bookingService: BookingService,
              private httpclient: HttpClient) {
                this.originCode = localStorage.getItem('originCode');
              }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.masterService.getCustomerData(this.sessionLocationCode).subscribe((resp: any) => {
      this.CustomerList = resp.Data;
    });
      this.AllService.getOriginData().subscribe((data) => {
      this.originList = data.Data;
    })
    this.masterService.getZone().subscribe((data: any) => {
      this.zoneList = data.Data;
    })
        const from = this.getDefaultDate(); // 1st of month
      const to = this.getCurrentDate();
     this.createForm = this.formbuilder.group({
      CustomerName: ['', Validators.required],
      fromDate: [from, Validators.required ],
      toDate: [to, Validators.required ],
      Origin: ['', Validators.required],
      Zone: ['', Validators.required],
      Mode: ['', Validators.required],
      product: [[], Validators.required],
      trainFlight: [''],
      trainFlightNo: [''],
      RateIncrease: [0, [Validators.min(0)]],
      MinWt: [0, [Validators.min(0)]],
      MinAmt: [0, [Validators.min(0)]],
      RateMode: ['Flat', Validators.required],
      type: ['Zone', Validators.required]
    });

    this.loadProduct();
    this.loadMode();

    this.loadState();
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

    this.getTripSheetData(pageNumber, pageSize);
  }
}

  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
  }
  handlePageEvent(e: PageEvent) {
     this.length = e.length;
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  const pageNumber = this.pageIndex + 1;
    this.calculatePageCount();
  this.getTripSheetData(pageNumber, this.pageSize);
}
getTripSheetData(pageNumber: number, pageSize: number): void {
    const type = this.createForm.value.inputType;
  const customerCode = this.createForm.value.CustomerName;
  const supplierCode = this.createForm.value.supplierName;

  this.masterService.getLatLongData(type, customerCode, supplierCode, pageNumber, pageSize,'').subscribe({
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
 loadProduct() {
    this.bookingService.getProduct().subscribe(
      (resp) => {
        this.productList = resp.Data;
      },
      (error) => {
        console.error('Error in loadProduct:', error);
      }
    );
  }
 loadState() {
  this.bookingService.getState().subscribe(
    (resp) => {
      this.stateList = resp.Data;
    },
    (error) => {
      console.error('Error in loadState:', error);
    }
  );
}
 loadMode() {
  this.bookingService.getMode().subscribe(
    (resp) => {
      this.modeList = resp.Data;
      const savedMode = localStorage.getItem('selectedMode');
      if (savedMode) {
        const matchedMode = this.modeList.find(item => item.Mode_code === savedMode);
        if (matchedMode) {
          this.selectedMode = matchedMode.Mode_code;
          this.createForm.patchValue({ Mode: matchedMode.Mode_code });
          this.handleModeChange(matchedMode);
        }
      }
    },
    (error) => {
      console.error('Error in loadMode:', error);
    }
  );
}
handleModeChange(mode: any) {
  const modeCode = mode?.Mode_code || '';

  this.createForm.get('trainFlight')?.clearValidators();
  this.createForm.get('trainFlightNo')?.clearValidators();

  if (modeCode === 'AI') {
    this.createForm.patchValue({ trainFlight: '', trainFlightNo: '' });
    this.getFlightData();

    this.createForm.get('trainFlight')?.setValidators([Validators.required]);
    this.createForm.get('trainFlightNo')?.setValidators([Validators.required]);

  } else if (modeCode === 'T') {
    this.createForm.patchValue({ trainFlight: '', trainFlightNo: '' });
    this.getTrain();
    this.createForm.get('trainFlight')?.setValidators([Validators.required]);
    this.createForm.get('trainFlightNo')?.setValidators([Validators.required]);

  } else {
    this.trainFlightOptions = [];
    this.createForm.patchValue({ trainFlight: null, trainFlightNo: '' });

    this.createForm.get('trainFlight')?.clearValidators();
    this.createForm.get('trainFlightNo')?.clearValidators();
  }
  this.createForm.get('trainFlight')?.updateValueAndValidity();
  this.createForm.get('trainFlightNo')?.updateValueAndValidity();

}

   getDefaultDate(): string {
     const today = new Date();
     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
     return this.formatDate(firstDayOfMonth);
   }
   formatDate(date: Date): string {
     const year = date.getFullYear();
     const month = date.getMonth() + 1;
     const day = date.getDate();
     return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
   }

   getCurrentDate(): string {
     const today = new Date();
     return this.formatDate(today);
   }

getFlightData(): void {
  this.httpclient.get(`${environment.apiUrl}Master/FlightMast?masterName=Flight&operation=getFlight`)
    .subscribe((response: any) => {
      this.flightData = response.Data;
      this.trainFlightOptions = this.flightData.map(item => ({
        name: item.AirLine_Name,
        code: item.AirLine_Code,
        displayNo: item.Flight_Code
      }));
    });
}

getTrain(): void {
  this.httpclient.get(`${environment.apiUrl}Master/TrainNo?masterName=TrainNo&operation=getTrainNo`)
    .subscribe((response: any) => {
      this.trainData = response.Data;
      this.trainFlightOptions = this.trainData.map(item => ({
        name: item.Train_Name,
        code: item.Train_Code,
        displayNo: item.TrainNo_Name
      }));
    });
}

onTrainFlightSelect(selectedCode: string) {
  const selected = this.trainFlightOptions.find(item => item.code === selectedCode);
  this.createForm.patchValue({
    trainFlightNo: selected?.displayNo || ''
  });
}
onFileSelected(event: any) {
  const file: File = event.target.files[0];
  this.selectedFile = file;
this.isExcelValid = false;
  if (file) {
    this.truncateErrorLog();

    const reader: FileReader = new FileReader();

    reader.onload = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '', header: 1 }) as any[][];

      if (jsonData.length === 0) {
        this.openSnackBar(' The Excel file is empty.', 'error-snackbar');
        return;
      }

      const headers = (jsonData[0] as any[]).map((h: any) => String(h).trim());
      const rateMode = this.createForm.get('RateMode')?.value;
      const type = this.createForm.get('type')?.value;

      // ✅ Expected headers based on RateMode and Type
      let expectedHeaders: string[] = [];

   if (rateMode === 'Flat') {
  if (type === 'Zone') { expectedHeaders = ['Zone', 'Lower Wt', 'Upper Wt', 'Rate']; }
  else if (type === 'State') { expectedHeaders = ['State', 'Lower Wt', 'Upper Wt', 'Rate']; }
  else if (type === 'Destination') { expectedHeaders = ['Destination', 'Lower Wt', 'Upper Wt', 'Rate']; }
} else if (rateMode === 'Addition') {
  if (type === 'Zone') { expectedHeaders = ['Zone', 'Addition', 'Lower Wt', 'Upper Wt', 'Rate']; }
  else if (type === 'State') { expectedHeaders = ['State', 'Addition', 'Lower Wt', 'Upper Wt', 'Rate']; }
  else if (type === 'Destination') { expectedHeaders = ['Destination', 'Addition', 'Lower Wt', 'Upper Wt', 'Rate']; }
} else if (rateMode === 'AddOn') {
  if (type === 'Zone') { expectedHeaders = ['Zone', 'AddOn', 'Lower Wt', 'Upper Wt', 'Rate']; }
  else if (type === 'State') { expectedHeaders = ['State', 'AddOn', 'Lower Wt', 'Upper Wt', 'Rate']; }
  else if (type === 'Destination') { expectedHeaders = ['Destination', 'AddOn', 'Lower Wt', 'Upper Wt', 'Rate']; }
} else if (rateMode === 'Multiple') {
  if (type === 'Zone') { expectedHeaders = ['Zone', 'Multiple', 'Lower Wt', 'Upper Wt', 'Rate']; }
  else if (type === 'State') { expectedHeaders = ['State', 'Multiple', 'Lower Wt', 'Upper Wt', 'Rate']; }
  else if (type === 'Destination') { expectedHeaders = ['Destination', 'Multiple', 'Lower Wt', 'Upper Wt', 'Rate']; }
}
const headersSet = new Set(headers.map(h => h.toLowerCase()));
const expectedSet = new Set(expectedHeaders.map(h => h.toLowerCase()));

const missingHeaders = expectedHeaders.filter(h => !headersSet.has(h.toLowerCase()));
const extraHeaders = headers.filter(
  h =>
    !expectedSet.has(h.toLowerCase()) &&
    ['addition', 'addon', 'multiple'].includes(h.toLowerCase()) // unexpected RateMode column present
);

if (missingHeaders.length > 0 || extraHeaders.length > 0) {
  const issues: string[] = [];
  if (missingHeaders.length > 0) {
    issues.push(`Missing column(s): ${missingHeaders.join(', ')}`);
  }
  if (extraHeaders.length > 0) {
    issues.push(`Unexpected column(s): ${extraHeaders.join(', ')}`);
  }

  this.openSnackBar(`Invalid Excel file.\n${issues.join('\n')}`, 'error-snackbar');
  this.isExcelValid = false;

  // ✅ Clear file input
  this.selectedFile = null;
  if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
  return;
}
      // const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));

      // if (missingHeaders.length > 0) {
      //   this.openSnackBar(`Invalid Excel file.\nMissing column(s): ${missingHeaders.join(', ')}`, 'error-snackbar');
      //   this.isExcelValid = false;
      //    this.selectedFile = null;
      //     if (this.fileInput) {
      //       this.fileInput.nativeElement.value = '';
      //     }
      //   return;
      // }
      this.isExcelValid = true;
      const validJsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const now = new Date().toISOString();

      this.rateDetailsArray = validJsonData.map((row: any, index: number) => {
        const base = {
          ZoneName: '',
          StateName: '',
          DestinationName: '',
          // Rd_Number: index + 1,
          On_Addition: Number(row.Addition || row.AddOn || row.Multiple || 0),
          Lower_Wt: Number(row['Lower Wt'] || 0),
          Upper_Wt: Number(row['Upper Wt'] || 0),
          Rate: Number(row['Rate'] || 0),
          Active_Date: this.createForm.get('fromDate')?.value || '',
          Closing_Date: this.createForm.get('toDate')?.value || '',
        };

        if (type === 'Zone') {
          base.ZoneName = row['Zone'] || '';
        } else if (type === 'State') {
          base.StateName = row['State'] || '';
        } else if (type === 'Destination') {
          base.DestinationName = row['Destination'] || '';
        }

        return base;
      });

      console.log('✅ Parsed RateDetails:', this.rateDetailsArray);
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
    this.openSnackBar('Please select an Excel file to import.', 'error-snackbar');
    return;
  }

  if (!this.isExcelValid) {
    this.openSnackBar('Invalid or unverified Excel file.', 'error-snackbar');
         this.selectedFile = null;
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
    return;
  }
  if (this.createForm.invalid) {
    this.createForm.markAllAsTouched();
    this.openSnackBar('Please fill all required fields before submitting.', 'error-snackbar');
    return;
  }

  const formValue = this.createForm.value;

  const payload = {
    Cust_Code: formValue.CustomerName,
    Mode_Code: formValue.Mode,
    Prod_Code: formValue.product || [],
    Orgin_Code: formValue.Origin,
    OrginZone_Code: formValue.Zone,
    Method: formValue.RateMode,
    Active_Date: formValue.fromDate,
    Closing_Date: formValue.toDate,
    RatePer: formValue.RateIncrease || 0,
    Amount: formValue.MinAmt || 0,
    Weight: formValue.MinWt || 0,
    Flight: formValue.trainFlight || '',
    Flight_No: formValue.trainFlightNo || '',
    RateDetails: this.rateDetailsArray
  };

  console.log('Payload sending >>>>', payload);

  const dialogRef = this.Excelprogressbar();
  this.masterService.importRate(payload).subscribe({
    next: (res) => {
      console.log('API Response:', res);
      dialogRef.close();
      if (res.status === 1) {
        this.openSnackBar(res.message, 'custom-snackbar');
        this.createForm.reset();
          const from = this.getDefaultDate();
        const to = this.getCurrentDate();

        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.createForm.patchValue({
          fromDate: from,
          toDate: to,
          RateMode: 'Flat',
          type: 'Zone',
          RateIncrease: 0,
          MinWt: 0,
          MinAmt: 0
        });
      } else {
        this.openSnackBar(res.message, 'error-snackbar');
      }
    },
    error: (err) => {
      dialogRef.close();
      this.openSnackBar('Error importing data. Please try again.', 'error-snackbar');
    }
  });
}


generateExcel() {
  const rateMode = this.createForm.get('RateMode')?.value;
  const type = this.createForm.get('type')?.value;

  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '25rem',
    data: { message: 'Are you sure you want to download the Excel file?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      let headers: string[] = [];

      if (rateMode === 'Flat') {
        if (type === 'Zone') {
          headers = ['Zone', 'Lower Wt', 'Upper Wt', 'Rate'];
        } else if (type === 'State') {
          headers = ['State', 'Lower Wt', 'Upper Wt', 'Rate'];
        } else if (type === 'Destination') {
          headers = ['Destination', 'Lower Wt', 'Upper Wt', 'Rate'];
        }
      } else if (
        rateMode === 'Addition' ||
        rateMode === 'AddOn' ||
        rateMode === 'Multiple'
      ) {
        if (type === 'Zone') {
          headers = ['Zone', 'Addition', 'Lower Wt', 'Upper Wt', 'Rate'];
        } else if (type === 'State') {
          headers = ['State', 'Addition', 'Lower Wt', 'Upper Wt', 'Rate'];
        } else if (type === 'Destination') {
          headers = ['Destination', 'Addition', 'Lower Wt', 'Upper Wt', 'Rate'];
        }
      }

      if (headers.length === 0) {
        console.error('Invalid combination of RateMode and Type');
        return;
      }

      const data = [headers, new Array(headers.length).fill('')];

      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Rate Sheet': worksheet },
        SheetNames: ['Rate Sheet'],
      };

      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const file: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });

      const fileName = `${rateMode}_${type}_RateSheet.xlsx`;
      FileSaver.saveAs(file, fileName);
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
     this.http.get(`${environment.apiUrl}Master/truncateRateMasterLog`).subscribe(
         (response: any) => {
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
generateRateMasterErrorLog() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '25rem',
    data: { message: 'Are you sure you want to download the Rate Master Error Log?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) {
      this.openSnackBar('Download canceled', 'error-snackbar');
      return;
    }

    const progressBarRef = this.Excelprogressbar();

    this.http.get(`${environment.apiUrl}Master/getRateMasterLog`).subscribe(
      (response: any) => {
        progressBarRef.close();

        if (!response || response.status === 0 || !response.Data?.length) {
          this.openSnackBar(response?.message || 'No error log data found.', 'error-snackbar');
          return;
        }

        const dataForExcel = response.Data.map((item: any) => ({
          'Sr No': item.ID,
          'Name': item.Name,
          'Lower weight': item.LowerWt,
          'Upper weight': item.UpperWt,
          'On addition': item.OnAddition,
          'Rate': item.Rate,
          'Error Message': item.Error,
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'RateMasterErrorLog');

        XLSX.writeFile(wb, 'RateMasterErrorLog.xlsx');
        this.openSnackBar('Error log downloaded successfully.', 'custom-snackbar');
      },
      (error) => {
        progressBarRef.close();
        console.error('Error fetching Rate Master log:', error);
        this.openSnackBar('Failed to fetch error log data.', 'error-snackbar');
      }
    );
  });
}

}
