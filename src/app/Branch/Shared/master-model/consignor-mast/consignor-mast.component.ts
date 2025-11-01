import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consignor-mast',
  templateUrl: './consignor-mast.component.html',
  styleUrls: ['./consignor-mast.component.css']
})
export class ConsignorMastComponent implements OnInit {

  paymentForm: FormGroup;

  constructor(private _mdr: MatDialogRef<ConsignorMastComponent>,
              private fb: FormBuilder,
               private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any

   ) { }

  ngOnInit(): void {
  //    this.paymentForm = this.fb.group({
  //   // OpeningAmt: [''],
  //   MinAmt: [0],
  //   BalanceAmt: [0],
  //   creditDays: [0],
  //   InvdueDays: [0],
  //   Remark: ['']
  // });
   this.paymentForm = this.fb.group({
    MinAmt: [{ value: 0, disabled: true }],
    BalanceAmt: [{ value: 0, disabled: true }],
    creditDays: [{ value: 0, disabled: true }],
    InvdueDays: [{ value: 0, disabled: true }],
    Remark: [{ value: '', disabled: true }]
  });
  const details = this.data?.customerDetails;
  if (details) {
    this.paymentForm.patchValue({
      MinAmt: details.Credit_Limit || details.MinAmt || '',
      BalanceAmt: details.Balance || details.BalanceAmt || '',
      creditDays: details.Credit_Days || details.creditDays || '',
      InvdueDays: details.Due_Days || details.InvdueDays || '',
      Remark: details.Remark || ''
      // // OpeningAmt: details.Deposit || details.OpeningAmt || '',
      // MinAmt: details.Credit_Limit || details.MinAmt || '',
      // BalanceAmt: details.Balance || details.BalanceAmt || '',
      // creditDays: details.Credit_Days || details.creditDays || '',
      // InvdueDays: details.Due_Days || details.InvdueDays || '',
      // Remark: details.Remark || ''
    });
  }
   if (this.data?.consCash === 'Credit') {
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.enable();
    });
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
 onSubmit(): void {
  if (this.paymentForm.valid) {
    this.openSnackBar('Payment details submitted successfully!', 'custom-snackbar');
    this._mdr.close(this.paymentForm.value);
  } else {
    this.openSnackBar('Please fill out all required fields correctly.', 'error-snackbar');
    this.paymentForm.markAllAsTouched();
  }
}

  CloseDialog() {
    this._mdr.close(false);
  }

}
