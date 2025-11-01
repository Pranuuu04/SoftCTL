import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewaddComponent } from 'app/Branch/Shared/manifest pages/viewadd/viewadd.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-add-billing',
  templateUrl: './add-billing.component.html',
  styleUrls: ['./add-billing.component.css']
})
export class AddBillingComponent implements OnInit {

  BillNo: any;
  createForm: any;
  BranchCode: any;

  constructor(public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              private _mdr: MatDialogRef <ViewaddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                if (data.responseData) {
                  this.BillNo = data.responseData.BillNo,
                  this.BranchCode = data.responseData.BranchCode
                  }
              }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      BillNo: [this.BillNo],
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
  closeForm() {
    this._mdr.close(false);
  }
    formSubmit(formData: any) {
      const apiUrl = `${environment.apiUrl}Billing/addBillData?sessionLocationCode=${this.BranchCode}&BillNo=${formData.BillNo}&AwbNo=${formData.awbNo}`;
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
