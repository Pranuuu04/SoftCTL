import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { DocketMultipleComponent } from '../../docket-multiple/docket-multiple.component';

@Component({
  selector: 'app-docket-print',
  templateUrl: './docket-print.component.html',
  styleUrls: ['./docket-print.component.css']
})
export class DocketPrintComponent implements OnInit {

awbDisabled = true;
CustDisabled = false;
sessionLocationCode: any;
currentDate: string;
customerNameList: any;
PrintForm: FormGroup;
ClientLogo: string;
ClientName: string;
multiplePrintType: any;
fAwbNo: any;
ToAwbNo: any;
printType: any;
listData: any;
  barcode: any;
  customerName: string;
  userType: string;

constructor(private _mdr: MatDialogRef<DocketPrintComponent >,
            public dialog: MatDialog,
            public formBuilder: FormBuilder,
            private httpService: HttpService,
            private snackBar: MatSnackBar,
            @Inject(MAT_DIALOG_DATA) public data: any) {
            }

ngOnInit(): void {
  this.currentDate = new Date().toISOString().split('T')[0];
  this.ClientLogo =  localStorage.getItem('ClientLogo');
  this.ClientName = localStorage.getItem('ClientName');
  this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');
    // this.sessionLocationCode = localStorage.getItem('originCode');
    this.customerName = localStorage.getItem('customerCode');
    this.userType = localStorage.getItem('userType');

    this.loadConsignerData();
    this.PrintForm = this.formBuilder.group({
      fAwbNo: ['', Validators.required],
      ToAwbNo: ['', Validators.required],
      Customer: ['', Validators.required],
      fromdate: ['', Validators.required],
      todate: ['', Validators.required],
      multiplePrintType: ['',  Validators.required ]
    });
     if (this.userType === 'Customer') {
    this.PrintForm.patchValue({ Customer: this.customerName });
  }
    const initialRadioValue = 'awbNo';
    if (initialRadioValue === 'awbNo') {
      this.awbDisabled = false;
      this.CustDisabled = true;
    } else {
      this.awbDisabled = true;
      this.CustDisabled = false;
    }
}

openSnackBar(message: string, panelClass: string) {
  this.snackBar.open(message, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: [panelClass]
  });
}

CloseDialog() {
  this._mdr.close(false);
}

isPrintButtonDisabled(): boolean {
  const formData = this.PrintForm.value;
  const isAwbFieldsFilled = (formData.fAwbNo && formData.ToAwbNo);
  const isCustomerSelected = !!formData.Customer;

  return !(isAwbFieldsFilled || isCustomerSelected);
}

onCheckedCust() {
  this.awbDisabled = true;
  this.CustDisabled = false;
   this.PrintForm.patchValue({
    fAwbNo: '',
    ToAwbNo: '',
    fromdate: this.currentDate,
    todate: this.currentDate
  });
}

onCheckedAwb() {
  this.awbDisabled = false;
  this.CustDisabled = true;
    this.PrintForm.patchValue({
    fromdate: '',
    todate: ''
  });
}

loadConsignerData() {
  this.httpService.get(`${environment.apiUrl}Booking/getConsigner?SessionLocationCode=` + this.sessionLocationCode ).then((resp) => {
      this.customerNameList = resp.Data;
  });
}

onSubmit(formData: any) {
  this.multiplePrintType = this.multiplePrintType || formData.multiplePrintType;
  console.log(this.multiplePrintType, 'multiplePrintTpye');
    if (this.printType === 'awbNo') {
     this.PrintForm.patchValue({ fromdate: '', todate: '' });
  } else if (this.printType === 'cust') {
    formData.fAwbNo = '';
    formData.ToAwbNo = '';
  }
  const progressRef = this.openprogressbar();
  this.httpService.get(`${environment.apiUrl}Booking/getMultiplePrintData?sessionLocationCode=` + this.sessionLocationCode + `&customerCode=` + formData.Customer + `&fromAwbNo=` + formData.fAwbNo + `&toAwbNo=` + formData.ToAwbNo + `&fromdate=` + formData.fromdate + `&todate=` + formData.todate ).then((resp) => {
    console.log(resp, 'resp');
    progressRef.close();
    // tslint:disable-next-line:one-line
    if (resp.status === 1){
      this.listData = resp.Data;
      this.barcode = resp.Data.barcode;
      this.openViewDataModal();
    } else {
      this.openSnackBar(resp.message , 'error-snackbar');
    }
  });
}

openViewDataModal() {
  const dialogRef = this.dialog.open(DocketMultipleComponent, {
    data: {
      action: 'add',
      pageData: this.listData,
      printType: this.multiplePrintType,
      barcode : this.barcode
    },
    width: '80rem',
    disableClose: true,
    });
  dialogRef.afterClosed().subscribe((res) => {
    if (res) { }
  });
}
  openprogressbar(): MatDialogRef<ProgressBarComponent> {
    const dialogRef = this.dialog.open(ProgressBarComponent, {
      data: {
        action: 'docketPrint',
      },
      width: '20rem',
      disableClose: true
    });

    return dialogRef;
  }
}
