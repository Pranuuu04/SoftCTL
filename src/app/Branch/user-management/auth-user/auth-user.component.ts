import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/service/admin.service';

@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css']
})
export class AuthUserComponent implements OnInit {
  userName: any ;
  passUpdateForm: any;
  
  constructor(
              public _mdr :MatDialogRef <AuthUserComponent>,
              private snackBar : MatSnackBar,
              private adminService :AdminService,
              private formbuilder :FormBuilder ,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) { 
                if (data.userName) {
                  this.userName = data.userName;
                }
              }

  ngOnInit(): void {
     this.passUpdateForm = this.formbuilder.group({
    password: ['', [Validators.required, this.validatePassword]]
  });
  }
  hidePassword: boolean = true;

  validatePassword(control: any) {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{4,}$/;
    return regex.test(control.value) ? null : { invalidPassword: true };
  }
  togglePasswordVisibility() {
      this.hidePassword = !this.hidePassword;
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  onSubmit(formData :any){
    this.adminService.editUser(this.userName, formData.password).subscribe((resp: any)=>{
      if(resp.status === 1){
        this.openSnackBar(resp.message , "custom-snackbar");
        this.CloseDialog();
      }else{
        this.openSnackBar(resp.message ,"error-snackbar")
      }
    })
  }
  // onSubmit(): void {
  //   if (!this.userName && !this.password) {
  //     this.openSnackBar("Please enter username and password." , 'error-snackbar');
  //     return;
  //   } else if (!this.userName) {
  //     this.openSnackBar("Please enter username." , 'error-snackbar');
  //     return;
  //   } else if (!this.password) {
  //     this.openSnackBar("Please enter password." , 'error-snackbar');
  //     return;
  //   }else{
  //       this.openSnackBar("Generated succesfully.", 'custom-snackbar');
  //   }

  CloseDialog() {
    this._mdr.close(false);
  }
  
}
