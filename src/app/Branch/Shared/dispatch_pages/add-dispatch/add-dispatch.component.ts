import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-dispatch',
  templateUrl: './add-dispatch.component.html',
  styleUrls: ['./add-dispatch.component.css']
})
export class AddDispatchComponent implements OnInit {

  createditForm: any;
  validationMessage: any = [];
  loadManifestData: any;

  constructor(private dialogRef: MatDialogRef<AddDispatchComponent>,
              public formbuilder: FormBuilder,
              private snackBar : MatSnackBar ,
              @Inject(MAT_DIALOG_DATA) public data: any)
               {
                if (data.loadManifestData) {
                  this.loadManifestData = data.loadManifestData;
                }
              }

  ngOnInit(): void {
    this.formRender();
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  formRender(){
    this.createditForm=this.formbuilder.group({
      Driver_Licence_No: new FormControl('',Validators.compose([
      ])),
      Opening_Km:new FormControl('',Validators.compose([
      ])),
      Vehicle_diesel_No: new FormControl('',Validators.compose([
      ])),
      Vehicle_diesel_Ltrs: new FormControl('',Validators.compose([
      ])),
      Kata_Weight: new FormControl('',Validators.compose([
      ])),
      Slip_No: new FormControl('',Validators.compose([
      ])),
      Brocker_Name: new FormControl('',Validators.compose([
      ])),
      Advance_Paid: new FormControl('',Validators.compose([
      ])),
      Diesel_Amount: new FormControl('',Validators.compose([
      ])),
    })
  }

  closeForm(): void {
      this.dialogRef.close();
  }

  formSubmit(formData: any){
    let obj = {
      Driver_Licence_No: formData.Driver_Licence_No,
      Opening_Km: formData.Opening_Km,
      Vehicle_diesel_No: formData.Vehicle_diesel_No,
      Vehicle_diesel_Ltrs: formData.Vehicle_diesel_Ltrs,
      Kata_Weight: formData.Kata_Weight,
      Slip_No: formData.Slip_No,
      Brocker_Name: formData.Brocker_Name,
      Advance_Paid: formData.Advance_Paid,
      Diesel_Amount: formData.Diesel_Amount,
    }
    this.dialogRef.close(obj);
      this.openSnackBar('successfully submitted.','custom-snackbar')
  }
}