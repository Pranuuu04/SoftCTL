import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AllServicesService } from 'app/service/all-services.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-manual-tab',
  templateUrl: './manual-tab.component.html',
  styleUrls: ['./manual-tab.component.css']
})
export class ManualTabComponent implements OnInit {
  vendorForm: FormGroup;
  listData: any = [];
  editingIndex: number = null;
  AwbNo: string ;
  remarkOptions: string[] = ['Delivered', 'In Transit', 'Pending', 'Cancelled'];
  AwbNoDatalist: any = [];
  showTable = false;
  sessionLocationCode: string;
  DestinationName: any;
  originName: string;
  userType: any;
 destinationName: any = 'All';
  sessionLocationName: string;
  branchName: string;
  selectedDestination: any = {};

  constructor(private formBuilder: FormBuilder,
              private http: AllServicesService,
              private snackBar: MatSnackBar,
              public https: HttpClient,
              public dialog: MatDialog,
              ) {
                this.sessionLocationCode = localStorage.getItem('originCode');
                this.sessionLocationName = localStorage.getItem('originName');
                this.userType = localStorage.getItem('userType');

              }

  ngOnInit(): void {
    // this.loadDestination();
    this.http.getDestinationData().subscribe((data) => {
      this.DestinationName = data.Data;
    });
    // this.destinationName = localStorage.getItem('selectedValue');
        if (this.userType === 'Admin') {
          this.branchName = localStorage.getItem('selectedLocationName') || 'All';
          this.originName = this.branchName;
        } else {
          this.originName = this.sessionLocationName;
        }

    this.vendorForm = this.formBuilder.group({
      id: [''],
      awb : new FormControl ('', Validators.compose([ Validators.required])),
      date: new FormControl ('', Validators.compose( [ Validators.required])),
      time: new FormControl ('', Validators.compose( [ Validators.required])),
      from: new FormControl (this.originName, Validators.compose( [ Validators.required])),
      to: new FormControl ('', Validators.compose([ Validators.required])),
      remark: new FormControl ('', Validators.compose( [ Validators.required]))
    });

  }

  convertTo24HourFormat(time12h: string): string {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    return `${hours}:${minutes}`;
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  handleFormSubmit(formData: any) {
    if (this.vendorForm.valid) {
      if (this.editingIndex === null) {
        // this.listData.push(formData);
        this.addNewEntry(formData);
      } else {
        // this.listData[this.editingIndex] = formData;
        this.updateEntry(this.editingIndex, formData);
        this.editingIndex = null;
      }

      const awbValue = this.vendorForm.get('awb').value;
      const fromValue = this.vendorForm.get('from').value;
      this.vendorForm.reset({ awb: awbValue , from: fromValue});
    }
  }

  addNewEntry(formData: any) {
    let postData = {
      AwbNo : this.AwbNo,
      delvDt: formData.date,
      delvTime: formData.time,
      destinationcode: formData.to,
      remark: formData.remark
    };

    this.http.postStausEntry(postData).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.listData.push(formData);
        this.openSnackBar(resp.message, 'custom-snackbar')
      } else {
        this.openSnackBar(resp.message, 'error-snackbar')
      }
    });
  }

  updateEntry(index: number, formData: any) {
    const selectedDestination = this.DestinationName.find(item => item.destinationName === formData.to);
    let postData = {
      id: formData.id,
      AwbNo: this.AwbNo,
      delvDt: formData.date,
      delvTime: formData.time,
      destinationcode:  selectedDestination ? selectedDestination.destinationCode : null,
      remark: formData.remark
    };

    this.https.post(`${environment.apiUrl}Booking/editStausEntry`, postData).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar')
      } else {
        this.openSnackBar(resp.message, 'error-snackbar')
      }
    });
  }

  editEntry(index: number) {
    this.editingIndex = index;
    let selectedEntry = this.listData[index];

    this.vendorForm.patchValue({
      id: selectedEntry.id,
      awb: this.AwbNo,
      // awb: selectedEntry.awb,
      date: selectedEntry.date,
      time: selectedEntry.time,
      // from: this.destinationName,
      to: selectedEntry.to,
      remark: selectedEntry.remark
    });
  }

  confirmDeleteDrs(index: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEntry(index)
      } else {
        this.openSnackBar( 'delete cancel', 'error-snackbar');
      }
    });
  }
  deleteEntry(index: number) {
    const entry = this.listData[index];
    this.https.get(`${environment.apiUrl}Booking/deleteStausEntry?AwbNo=${this.AwbNo}&id=${entry.id}`).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.listData.splice(index, 1);
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    });
  }

  // loadDestination() {
  //   if (this.userType === 'Admin') {
  //     this.http.GetDestination(this.destinationName).subscribe((resp: any) => {
  //       this.DestinationName = resp.Data;
  //     });
  //   } else {
  //     this.http.GetDestination(this.sessionLocationCode).subscribe((resp: any) => {
  //       this.DestinationName = resp.Data;
  //     });
  //   }
  //  }
   getDataByAwb(formData: any) {
    const awbNoToCheck = formData.awb;
    if (this.AwbNoDatalist.includes(awbNoToCheck)) {
        this.openSnackBar('AWB number already exists.', 'error-snackbar')
        return;
    }
    const awbValue = this.vendorForm.get('awb').value;
    const fromValue = this.vendorForm.get('from').value;
    this.vendorForm.reset({ awb: awbValue , from: fromValue});
    this.listData = [];
    this.http.getStausEntryData(awbNoToCheck).subscribe((resp: any) => {
        if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar')
            this.showTable = true;
            resp.Data.forEach((dataItem: any) => {
                const awbNoFromResponse = dataItem.awbNo;
                console.log('dataItems :', dataItem);
                this.listData.push({
                  awb: awbNoFromResponse,
                  id: dataItem.id,
                  date: dataItem.DelvDt,
                  time: dataItem.DelvTime,
                  from: dataItem.originName,
                  to: dataItem.Destination_name || dataItem.Destination_code,
                  remark: dataItem.Remark,
              });

                if (this.AwbNoDatalist.includes(awbNoFromResponse)) {
                    this.openSnackBar('AWB number already exists.', 'error-snackbar')
                    return;
                }

                this.AwbNoDatalist.push(awbNoFromResponse);
            });
            this.AwbNo = awbNoToCheck;
        } else {
            this.openSnackBar(resp.message, 'error-snackbar')
        }
    }, error => {
        this.openSnackBar('Please enter Correct Awb No.', 'error-snackbar')
    });
}

}
