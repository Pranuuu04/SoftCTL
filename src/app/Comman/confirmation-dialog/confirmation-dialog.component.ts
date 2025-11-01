import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  message = 'Are you sure want to delete?'
  confirmButtonText = 'Yes'
  cancelButtonText = 'Cancel'
  confirmationBox = false;
  reason = '';
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string , confirmButtonText?: string, cancelButtonText?: string, inputRequired?: boolean }) {
      if (data.confirmButtonText) {
        this.confirmButtonText = data.confirmButtonText;
      }
      if (data.cancelButtonText) {
        this.cancelButtonText = data.cancelButtonText;
      }
    }

  ngOnInit(): void {}

 onConfirmClick(): void {
    if (this.data.inputRequired) {
      this.dialogRef.close(this.reason); // return the entered reason
    } else {
      this.dialogRef.close(true); // just confirm
    }
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

}
