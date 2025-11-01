import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-delete-drs',
  templateUrl: './delete-drs.component.html',
  styleUrls: ['./delete-drs.component.css']
})
export class DeleteDrsComponent implements OnInit {

  awbDisabled = true;
  manifestDisabled = true;
  CreateForm: any;
  sessionLocationCode: any;
  DrsNo: any;
  Location: any;
  username: string;


  constructor( private _mdr: MatDialogRef<DeleteDrsComponent >,
                public dialog: MatDialog,
                public formBuilder: FormBuilder,
                private http: HttpService,
                private snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: any) {
             if (data.DrsData) {
                  this.DrsNo = data.DrsData.DrsNO;
                  this.Location = data.DrsData.Location ;
                 }
                }

  ngOnInit(): void {
      this.sessionLocationCode = localStorage.getItem('originCode');
      this.username = localStorage.getItem('userName');
        this.CreateForm = this.formBuilder.group({
      DrsNo: [this.DrsNo],
      awbNo: [''], })
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
    width: '22rem',
    data: {
      message: `Please enter the reason for deleting DRS ${this.DrsNo}?`,
      inputRequired: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (typeof result === 'string' && result.trim()) {
      const reason = result.trim();
      this.formSubmit(reason); // ✅ pass reason to formSubmit()
    } else if (result === '') {
      this.openSnackBar('Deletion reason is required.', 'error-snackbar');
    } else {
      this.openSnackBar('Delete canceled', 'error-snackbar');
    }
  });
}

formSubmit(reason: string): void {
  const obj = {
    DrsNo:  this.DrsNo,
    awbNo: this.CreateForm.value.awbNo,
  };

  if (this.awbDisabled) {
    if (!obj.awbNo) {
      this.openSnackBar( 'AWB field cannot be empty.', 'error-snackbar');
      return;
    }
    this.http.get(`${environment.apiUrl}runsheet/deleteDrsByAwbNo?sessionLocationCode=${this.Location}&awbNo=${obj.awbNo}&Reason=${reason}&userName=${this.username}`).then(resp => {
      if (resp.status === 1) {
        this.openSnackBar( resp.message, 'custom-snackbar');
        this.CloseDialog();
      } else {
        this.openSnackBar( resp.message, 'error-snackbar');
      }
    });
  } else {
    this.http.get(`${environment.apiUrl}runsheet/deleteDrsByDrsNo?sessionLocationCode=${this.sessionLocationCode}&drsNo=${obj.DrsNo}&Reason=${reason}&userName=${this.username}`).then(resp => {
      if (resp.status === 1) {
        this.openSnackBar( resp.message, 'custom-snackbar');
        this.CloseDialog();
      } else {
        this.openSnackBar( resp.message, 'error-snackbar');
      }
    });
  }
}

}
