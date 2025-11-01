import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewdeleteComponent } from 'app/Branch/Shared/manifest pages/viewdelete/viewdelete.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { BillingService } from '../../../../billing/billing.service';

@Component({
  selector: 'app-delete-bill',
  templateUrl: './delete-bill.component.html',
  styleUrls: ['./delete-bill.component.css']
})
export class DeleteBillComponent implements OnInit {

  awbDisabled = true;
  manifestDisabled = true;
  billEditData: any;
  BillingNo: any;
  createForm: any;
  fromDestCode: any;
  destinationName: any;
  userType: any;
  sessionLocationCode: string;
  BranchCode: string;


  constructor(public httpService: HttpService,
              public dialog: MatDialog,
              private billingService: BillingService,
              public formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private _mdr: MatDialogRef<ViewdeleteComponent >,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    if (data.responseData) {
      this.billEditData = data.responseData,
      this.BillingNo = data.responseData.BillNo,
      this.BranchCode = data.responseData.BranchCode

    }
   }

  ngOnInit(): void {
    this.destinationName = localStorage.getItem('selectedValue');
    this.userType = localStorage.getItem('userType');
    // this.sessionLocationCode = localStorage.getItem('originCode');

    this.createForm = this.formBuilder.group({
      BillingNo: [this.BillingNo],
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
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${this.BillingNo}?` }
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
    const object = {
      BillingNo: this.createForm.value.BillingNo,
      awbNo: this.createForm.value.awbNo,
    };
    if (this.awbDisabled) {
        if (!object.awbNo) {
      this.openSnackBar('AWB Number is required', 'error-snackbar');
      return;
    }
        this.billingService.deleteBillData(this.BranchCode, object.BillingNo, object.awbNo).subscribe((resp: any) => {
          if (resp.status === 1) {
            this.openSnackBar( resp.message, 'custom-snackbar');
            this.closeForm();
          } else {
            this.openSnackBar( resp.message, 'error-snackbar');
          }
        })
      } else {
          this.billingService.deleteBillData(this.BranchCode, this.BillingNo, '').subscribe((resp: any) => {
            if (resp.status === 1) {
              this.openSnackBar( resp.message, 'custom-snackbar');
              this.closeForm();
            } else {
              this.openSnackBar( resp.message, 'error-snackbar');
            }
          })
      }
  }



}
