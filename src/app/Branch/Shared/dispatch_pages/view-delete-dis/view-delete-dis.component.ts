import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-delete-dis',
  templateUrl: './view-delete-dis.component.html',
  styleUrls: ['./view-delete-dis.component.css']
})
export class ViewDeleteDisComponent implements OnInit {

  awbDisabled: boolean = true;
  DispatchDisabled: boolean = true;
  DispatchEditData: any;
  DispatchNo: any;
  createForm: any;
  sessionLocationCode: any;
  destinationName: any;
  userType: any;
  Location: any;


  constructor(public httpService: HttpService, 
              public dialog: MatDialog, 
              public formBuilder: FormBuilder,
              private snackBar :MatSnackBar,
              private _mdr: MatDialogRef<ViewDeleteDisComponent >,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.sessionLocationCode = localStorage.getItem('originCode');
    if (data.responseData) {
      this.DispatchEditData = data.responseData,
      this.DispatchNo = data.responseData.dispatchNo,
      this.Location = data.responseData.FromDestCode ;
    }
   } 

  ngOnInit(): void {
    this.destinationName = localStorage.getItem('selectedValue');
    this.userType = localStorage.getItem('userType');

    this.createForm = this.formBuilder.group({
      DispatchNo: [this.DispatchNo],
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
    this.DispatchDisabled = true;
  }

  onCheckedAwb() {
    this.awbDisabled = true;
    this.DispatchDisabled = true;
  }

  confirmDeleteDrs(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${this.DispatchNo}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formSubmit();
      } else {
        this.openSnackBar( 'delete cancel', 'error-snackbar');
      }
    });
  }
  formSubmit() {
    let object = {
      DispatchNo: this.createForm.value.DispatchNo || this.DispatchNo,
      awbNo: this.createForm.value.awbNo,
    };
    if (this.awbDisabled){
      if(this.userType === 'Admmin'){
        const apiUrl = `${environment.apiUrl}Dispatch/deleteDispatchByAwbNo?DispatchNo=${object.DispatchNo}&fromDest=${this.destinationName}&awbNo=${object.awbNo}`;
        this.httpService.get(apiUrl).then((resp) => {
          if(resp.status === 1){
            this.openSnackBar( resp.message, 'custom-snackbar');
            this.closeForm();
          } else {
            this.openSnackBar( resp.message, 'error-snackbar');
          }
          });
      }else{
        const apiUrl = `${environment.apiUrl}dispatch/deleteByDispatchNo?sessionLocationCode=${this.Location}&dispatchNo=${object.DispatchNo}&awbNo=${object.awbNo}`;
        this.httpService.get(apiUrl).then((resp) => {
          if(resp.status === 1){
            this.openSnackBar( resp.message, 'custom-snackbar');
            this.closeForm();
          } else {
            this.openSnackBar( resp.message, 'error-snackbar');
          }
          });
      }
      } else {
        if(this.userType === 'Admin'){
          const apiUrl = `${environment.apiUrl}dispatch/deleteByDispatchNo?dispatchNo=${object.DispatchNo}&sessionLocationCode=${this.destinationName}`;
          this.httpService.get(apiUrl).then((resp) => {
            if(resp.status === 1){
              this.openSnackBar( resp.message, 'custom-snackbar');
              this.closeForm();
            } else {
              this.openSnackBar( resp.message, 'error-snackbar');
            }
          });
        }else{
          const apiUrl = `${environment.apiUrl}dispatch/deleteByDispatchNo?dispatchNo=${object.DispatchNo}&sessionLocationCode=${this.sessionLocationCode}`;
          this.httpService.get(apiUrl).then((resp) => {
            if(resp.status === 1){
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
