import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-manifest',
  templateUrl: './add-manifest.component.html',
  styleUrls: ['./add-manifest.component.css']
})
export class AddManifestComponent implements OnInit {

  createditForm: any;
  validationMessage: any = [];
  loadManifestData: any;

  constructor(private dialogRef: MatDialogRef<AddManifestComponent>,
              public formbuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any)
               {
                if (data.loadManifestData) {
                  this.loadManifestData = data.loadManifestData;
                }
              }

  ngOnInit(): void {

    
    this.formRender();

  if (this.loadManifestData) {
    this.createditForm.patchValue({
      Driver_Licence_No: this.loadManifestData.Driver_Licence_No,
      Opening_Km: this.loadManifestData.Opening_Km,
      Vehicle_diesel_No: this.loadManifestData.Vehicle_diesel_No,
      Vehicle_diesel_Ltrs: this.loadManifestData.Vehicle_diesel_Ltrs,
      Kata_Weight: this.loadManifestData.Kata_Weight,
      Slip_No: this.loadManifestData.Slip_No,
      Brocker_Name: this.loadManifestData.Brocker_Name,
      Advance_Paid: this.loadManifestData.Advance_Paid,
      Diesel_Amount: this.loadManifestData.Diesel_Amount,
    });
  }
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
  }
}
