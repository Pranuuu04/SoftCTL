import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-import-tab',
  templateUrl: './import-tab.component.html',
  styleUrls: ['./import-tab.component.css']
})
export class ImportTabComponent implements OnInit {
  createForm: any;
  validationMessage: any = [];
  currentDate: any;
  dataSource: MatTableDataSource<any>;
  awbNo = '' ;
  displayedAWBNo: any ;
  inputAWBNo = '';
  awbNumbers: string[] = [];
  excelFileUrl: string;
  originName: string;
  DestinationName: any;
  sessionLocationCode: string;
  remarkOptions: string[] = ['Delivered', 'In Transit', 'Pending', 'Cancelled'];
  uploadedData: any;
  fileSelected: any;
  selectedFileName: any;
  fileName: any;
  @ViewChild('fileInput') fileInput: any;
  destinationName: string;
  userType: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  branchName: string;
  sessionLocationName: string;
  // userType: string;

  constructor(public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private allservice: AllServicesService,
              public https: HttpClient,
              private snackBar: MatSnackBar) {
    this.currentDate = this.getDefaultDate();
    this.dataSource = new MatTableDataSource([]);
    // this.userType = localStorage.getItem('userType')
    this.originName = localStorage.getItem('originName');
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.sessionLocationName = localStorage.getItem('originName');
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
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.destinationName = localStorage.getItem('selectedValue');
          if (this.userType === 'Admin') {
            this.branchName = localStorage.getItem('selectedLocationName') || 'All';
            this.originName = this.branchName;
            } else {
            this.originName = this.sessionLocationName;
          }
    // this.loadDestination();
    this.allservice.getDestinationData().subscribe((data) => {
      this.DestinationName = data.Data;
    });
    this.validationMessage = {
      awbNo: [
        {type: 'required' , message: 'enter your awb no'}
      ],
      date: [
        {type: 'required', message: 'please select date'}
      ],
      time: [
        {type: 'required', message: 'please enter time'}
      ],
      to: [
        {type: 'required', message: 'please select destination'}
      ],
       remark: [
        {type: 'required', message: 'please enter remark'}
      ],
    }
    this.createForm = this.formBuilder.group({
      awbNo: ['', Validators.required],
      date: [this.currentDate, Validators.required],
      time: ['', Validators.required],
      to: ['', Validators.required],
      remark: ['', Validators.required]
    });

  //   if (this.userType === 'Admin') {
  //     this.originName = localStorage.getItem('selectedValue');
  //   } else {
  //     this.originName = localStorage.getItem('originName');
  //     this.sessionLocationCode = localStorage.getItem('originCode');
  //   }
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  // loadDestination() {
  //   this.allservice.GetDestination(this.sessionLocationCode).subscribe((resp: any) => {
  //    this.DestinationName = resp.Data;
  //  });
  // }
  extractAWBNumbers(sheetData: any[]) {
    console.log(sheetData, 'sheet data');
    const fileAWBNumbers = sheetData.map((row: any) => row['AWBNO']).filter((awbNo: string) => awbNo);
    this.awbNumbers = [...this.awbNumbers, ...fileAWBNumbers];
    console.log('this.awbNumbers :', this.awbNumbers);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.inputAWBNo) {
        this.allservice.getStausEntryData(this.awbNo).subscribe((reap: any) => {
          this.awbNumbers.push(this.inputAWBNo);
          this.inputAWBNo = '';
        });
      }
    }
  }

  splitAWBNumbers(numbers: string[]): string[][] {
    const result: string[][] = [];
    for (let i = 0; i < numbers.length; i += 15) {
      result.push(numbers.slice(i, i + 15));
    }
    return result;
  }
  // handleKeyDown(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     if (this.inputAWBNo) {
  //       this.allservice.getStausEntryData(this.awbNo).subscribe((reap: any) => {
  //         this.awbNumbers.push(this.inputAWBNo);
  //         this.inputAWBNo = '';
  //       });
  //     }
  //   }
  // }
   // extractAWBNumbers(sheetData: any[]) {
  //   console.log(sheetData , "sheet data");
  //   const fileAWBNumbers = sheetData.map((row: any) => row['AWBNO']).filter((awbNo: string) => awbNo);
  //   this.awbNumbers = [...this.awbNumbers, ...fileAWBNumbers];
  //   console.log("this.awbNumbers :",this.awbNumbers );
  // }
  formSubmit(formValue: any): void {
    if (
      !this.awbNumbers ||
      !formValue.time ||
      !formValue.remark ||
      !formValue.to
    ) {
      this.openSnackBar('Please fill in all required fields.', 'error-snackbar')
      return;
    }
    if (this.awbNumbers.length === 0) {
      this.openSnackBar('Please enter at least one AWB number', 'error-snackbar');
      return;
    }
    const postData = {
      AwbNo: this.awbNumbers,
      delvDt: formValue.date,
      delvTime: formValue.time,
      destinationcode: formValue.to,
      remark: formValue.remark
    };
console.log(postData , 'postData');

    this.https.post(`${environment.apiUrl}Booking/bulkStausEntry`, postData).subscribe((response: any) => {
      if (response.status === 1) {
        this.openSnackBar(response.message, 'custom-snackbar')
        const dateValue = this.createForm.get('date').value;
        const fromValue = this.createForm.get('from').value;
        this.createForm.reset({ date: dateValue , from: fromValue});
          this.awbNumbers = [];
          this.fileInput.nativeElement.value = '';
      } else {
        this.openSnackBar(response.message , 'error-snackbar')
      }
    }, (error) => {
      console.error('API Error:', error);
      this.openSnackBar(error.message, 'error-snackbar')
    });
}

  openExcel() {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = '.xls, .xlsx';
    inputFile.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.readFile(file);
      }
    });
    inputFile.click();
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target?.result as string;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet);
        this.extractAWBNumbers(sheetData);
        const data: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (data.length <= 1) {
          this.openSnackBar('The selected file is empty.', 'error-snackbar');
          this.fileSelected = false;
          return;
        }
      });
    };
    reader.readAsBinaryString(file);
  }

  generateExcel() {
    this.allservice.StatusEntryAwb();
  }

  binaryToArrayBuffer(binary: string): ArrayBuffer {
    const length = binary.length;
    const arrayBuffer = new ArrayBuffer(length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binary.charCodeAt(i);
    }
    return arrayBuffer;
  }
  // generateExcel() {
  //   this.allservice.StatusEntryAwb();
  // }
  // handleFileInput(event: any) {
  //   const file = event.target.files[0];
  //   this.fileName = file.name;
  //   this.uploadedData = event.target.files;
  //   const previousFileSelected = this.fileSelected;
  //   this.selectedFileName = this.fileName;
  //   this.fileSelected = this.uploadedData && this.uploadedData.length > 0;
  //   if (this.fileSelected && previousFileSelected && this.uploadedData[0].name === this.selectedFileName) {
  //     this.fileSelected = false;
  //   }
  //   if (this.fileSelected) {
  //      const fileSize = file.size; // Size of the file in bytes

  //     // Display file size
  //     const reader: FileReader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const binarystr: string = e.target.result;
  //       const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
  //       const wsname: string = wb.SheetNames[0];
  //       const ws: XLSX.WorkSheet = wb.Sheets[wsname];

  //       const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

  //       if (data.length <= 1) {
  //         this.openSnackBar('The selected file is empty.', 'error-snackbar');
  //         this.fileSelected = false;
  //         return;
  //       }

  //       const keys: string[] = data[0];

  //       const formattedData = data.slice(1).map(row => {
  //         const rowData: any = {};
  //         keys.forEach((key, index) => {
  //           rowData[key] = row[index] || '';
  //         });
  //         return rowData;
  //       });

  //     // Assuming the AWB numbers are in a column named 'AWB No'
  //     const awbNumbersFromFile = formattedData.map(row => row['AWB No']).filter(awb => awb);
  //     this.awbNumbers.push(...awbNumbersFromFile);

  //     };
  //     reader.readAsBinaryString(file);
  //   }
  // }
  // openExcel() {
  //   const inputFile = document.createElement('input');
  //   inputFile.type = 'file';
  //   inputFile.accept = '.xls, .xlsx';
  //   inputFile.addEventListener('change', (event) => {
  //     const file = (event.target as HTMLInputElement).files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const binaryString = e.target?.result as string;
  //         const workbook = XLSX.read(binaryString, { type: 'binary' });
  //         workbook.SheetNames.forEach(sheetName => {
  //           const worksheet = workbook.Sheets[sheetName];
  //           const sheetData = XLSX.utils.sheet_to_json(worksheet);
  //           console.log(`Sheet: ${sheetName}`, sheetData);
  //         });
  //       };
  //       reader.readAsBinaryString(file);
  //     }
  //   });
  //   inputFile.click();
  // }

  // binaryToArrayBuffer(binary: string): ArrayBuffer {
  //   const length = binary.length;
  //   const arrayBuffer = new ArrayBuffer(length);
  //   const uint8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < length; i++) {
  //     uint8Array[i] = binary.charCodeAt(i);
  //   }
  //   return arrayBuffer;
  // }
}


