import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-viewdelete',
  templateUrl: './viewdelete.component.html',
  styleUrls: ['./viewdelete.component.css']
})
export class ViewdeleteComponent implements OnInit {

  awbDisabled = true;
  manifestDisabled = true;
  manifestEditData: any;
  manifestNo: any;
  createForm: any;
  fromDestCode: any;
  destinationName: any;
  userType: any;
  username: string;


  constructor(public httpService: HttpService,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private _mdr: MatDialogRef<ViewdeleteComponent >,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    if (data.responseData) {
      this.manifestEditData = data.responseData,
      this.manifestNo = data.responseData.manifestNo,
      this.fromDestCode = data.responseData.fromDestCode
    }
   }

  ngOnInit(): void {
    this.destinationName = localStorage.getItem('selectedValue');
    this.userType = localStorage.getItem('userType');
    this.username = localStorage.getItem('userName');
    this.createForm = this.formBuilder.group({
      manifestNo: [this.manifestNo],
      awbNo: ['']})  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  closeForm() {
    this._mdr.close(false);
  }

  saveButtonClicked(): void {
  }

  onChecked() {
    this.awbDisabled = false;
    this.manifestDisabled = true;
  }

  onCheckedAwb() {
    this.awbDisabled = true;
    this.manifestDisabled = true;
  }

 confirmDeleteDrs(): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '30rem',
    data: {
      message: `Please enter the reason for deleting manifest ${this.manifestNo}`,
      inputRequired: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (typeof result === 'string' && result.trim()) {
      const reason = result.trim();
      this.formSubmit(reason);
    } else if (result === '') {
      this.openSnackBar('Deletion reason is required.', 'error-snackbar');
    } else {
      this.openSnackBar('Delete canceled', 'error-snackbar');
    }
  });
}

  formSubmit(reason: string) {
    const object = {
      manifestNo: this.createForm.value.manifestNo || this.manifestNo,
      awbNo: this.createForm.value.awbNo,
    };
    if (this.awbDisabled) {
      if (this.userType === 'Admin') {
        const apiUrl = `${environment.apiUrl}Manifest/deleteManifest?inputName=deleteManifestByAwbNo&manifestNo=${object.manifestNo}&fromDest=${this.destinationName}&awbNo=${object.awbNo}&Reason=${reason}&userName=${this.username}`;
        this.httpService.get(apiUrl).then((resp) => {
          if (resp.status === 1) {
            this.openSnackBar( resp.message, 'custom-snackbar');
            this.closeForm();
          } else {
            this.openSnackBar( resp.message, 'error-snackbar');
          }
          });
      } else {
        const apiUrl = `${environment.apiUrl}Manifest/deleteManifest?inputName=deleteManifestByAwbNo&manifestNo=${object.manifestNo}&fromDest=${this.fromDestCode}&awbNo=${object.awbNo}&Reason=${reason}&userName=${this.username}`;
        this.httpService.get(apiUrl).then((resp) => {
          if (resp.status === 1) {
            this.openSnackBar( resp.message, 'custom-snackbar');
            this.closeForm();
          } else {
            this.openSnackBar( resp.message, 'error-snackbar');
          }
          });
      }
      } else {
        if (this.userType === 'Admin') {
          const apiUrl = `${environment.apiUrl}Manifest/deleteManifest?inputName=deleteManifestByManifestNo&manifestNo=${object.manifestNo}&fromDest=${this.destinationName}&Reason=${reason}&userName=${this.username}`;
          this.httpService.get(apiUrl).then((resp) => {
            if (resp.status === 1) {
              this.openSnackBar( resp.message, 'custom-snackbar');
              this.closeForm();
            } else {
              this.openSnackBar( resp.message, 'error-snackbar');
            }
          });
        } else {
          const apiUrl = `${environment.apiUrl}Manifest/deleteManifest?inputName=deleteManifestByManifestNo&manifestNo=${object.manifestNo}&fromDest=${this.fromDestCode}&Reason=${reason}&userName=${this.username}`;
          this.httpService.get(apiUrl).then((resp) => {
            if (resp.status === 1) {
              this.openSnackBar( resp.message, 'custom-snackbar');
              this.closeForm();
            } else {
              this.openSnackBar( resp.message, 'error-snackbar');
            }
          });
        }
      }
  }



}
