import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { SharedService } from 'app/service/shared.service';
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-drs',
  templateUrl: './import-drs.component.html',
  styleUrls: ['./import-drs.component.css']
})
export class ImportDrsComponent implements OnInit {
 
  @ViewChild('fileInput') fileInput: ElementRef;
  Drsentryform: FormGroup;
  validationMessage:any = [];
  currentDate: string;
  sessionLocationCode: string;
  nameList: any ;
  AwbNoData: any ;
  listData: any = [];
  uploadedAwbNos: string[] = [];
  displayedColumns: any[] = ['awbNo','bookDate', 'manifestNo','manifestDate' ,'customerType','consigneeName','Origin','Destination_Name','consigneePin','modeCode','Product_Type','Qty','ActualWt','totalAmt'];
  showTable =false;
  AwbNo: string = '';
  userType: any;
  selectedValue: any;
  destinationName: any;
  fileSelected: any;
  selectedFile: any;
  inputElement: HTMLInputElement;


  constructor(private allservice :AllServicesService,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              public httpService: HttpService,
              private getData: AllServicesService,
              private sharedService: SharedService,
              private http: HttpClient) {
                this.sessionLocationCode = localStorage.getItem('originCode');
              }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    // this.destinationName = localStorage.getItem('selectedValue');
    this.getNameList();
    this.sharedService.selectedValue$.subscribe((value) => {
      this.destinationName = value;
    });
    this.currentDate = new Date().toISOString().split('T')[0];
    this.validationMessage={
      area:[
        {type: 'required', message: 'please Enter area'}
      ],
      userName:[
        {type: 'required', message: 'please enter userName'}
      ],
      employeeMobile:[
        { type: 'minlength', message: 'Mobile number must be at least 10 digits' },
        { type: 'maxlength', message: 'Mobile number cannot exceed 10 digits' },
        { type: 'pattern', message: 'Mobile number should contain only numeric digits' }      
      ]
    }

    this.Drsentryform=this.formbuilder.group({
      area: new FormControl('',Validators.compose([
        Validators.required
      ])),
      userName:new FormControl('',Validators.compose([
        Validators.required
      ])),
      employeeMobile: new FormControl('',Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$') 
      ])),
      vehicleNo: new FormControl('',Validators.compose([
      ]))
    })
  }

    openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  async getNameList() {
    try {
      let resp: any;
      if (this.userType !== 'Admin') {
        resp = await this.allservice.getEmpList(this.sessionLocationCode).toPromise();
      } else {
        resp = await this.allservice.getEmpList(this.destinationName).toPromise();
      }
      
      this.nameList = resp.Data;
    } catch (error) {
      console.error('Error fetching name list:', error);
    }
  }
  generateExcelDRSImport() {
    this.getData.generateExcelRunsheet();
  }

  async onSubmit() {
    if (this.selectedFile) {
      const area = this.Drsentryform.get('area').value;
      const userName = this.Drsentryform.get('userName').value;
  
      if (area && userName) {
        const fileName = this.selectedFile.name;
        const dialogRef = this.openprogressbar(fileName);
  
        try {
          const postData = {
            sessionLocationCode: this.sessionLocationCode,
            vehicleNo: this.Drsentryform.value.vehicleNo,
            pickupBoy: this.Drsentryform.value.userName,
            AwbNo: this.uploadedAwbNos,
            area: this.Drsentryform.value.area,
            employeeMobile: this.Drsentryform.value.employeeMobile,
            userName: "Pranali"
          };
  
          const response = await this.httpService.post(`${environment.apiUrl}runsheet/importRunsheet`, postData);
  
          if (response.status === 1) {
            this.openSnackBar(response.message, 'custom-snackbar');
          } else {
            this.openSnackBar(response.message, 'error-snackbar');
          }
        } catch (error) {
          console.error('Error sending data:', error);
        } finally {
          dialogRef.close();
        }
  
        // Clear the form fields and the selected file
        this.Drsentryform.reset();
        this.selectedFile = null;
         // Clear the file input field
         this.fileInput.nativeElement.value = '';
  
      } else {
        this.openSnackBar('Please select both area and userName.', 'error-snackbar');
      }
    } else {
      this.openSnackBar('Please select a file.', 'error-snackbar');
    }
  }
  
  generateExcel() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25rem',
      data: { message: 'Are you sure you want to download the Excel file?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.generateExcelDRSImport();
      } else {
    this.openSnackBar('Download canceled', 'error-snackbar');
  }
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
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      if (Array.isArray(data[0])) {
        const headers = data[0];
        if (headers.includes('AwbNo') && (headers.length === 1 || (headers.length === 2 && headers.includes('Error')))) {
          const awbNos = data.slice(1).map((row: any) => row[0]).filter(awb => awb);
          if (awbNos.length === 0) {
            this.openSnackBar('The selected file is empty.', 'error-snackbar');
            this.selectedFile = null;
            this.fileInput.nativeElement.value = '';
            return;
          }
          this.uploadedAwbNos = awbNos;
        } else {
          this.openSnackBar('please select correct file.', 'error-snackbar');
          this.selectedFile = null;
          this.fileInput.nativeElement.value = '';
          return;
        }
      } else {
        this.openSnackBar('please select correct file.', 'error-snackbar');
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
        return;
      }
    };
  
    reader.onerror = (error) => {
      console.error('Error processing Excel file:', error);
    };
  
    reader.readAsArrayBuffer(file);
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
    this.http.get(`${environment.apiUrl}runsheet/truncateRunsheetimport`).subscribe(
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
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '25rem',
        data: { message: 'Are you sure you want to download the Excel file?' }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.http.get(`${environment.apiUrl}runsheet/getRunsheetErrorLog`)
            .subscribe((response: any) => {
              if (response.status === 0) {
                this.openSnackBar(response.message, 'error-snackbar');
                return;
              }
    
              const progressBarRef = this.Excelprogressbar();
    
              let dataForExcel;

                dataForExcel = response.Data.map(element => ({
                  'AwbNo': element.AwbNo,
                  'Error': element.Error
                }));
    
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'DrsImport');
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