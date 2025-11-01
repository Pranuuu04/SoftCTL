import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { HttpService } from 'app/service/http.service';
import { UsermanagementBookingComponent } from 'app/Branch/Shared/usermanagement-booking/usermanagement-booking.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // common
  sessionLocationCode: string;
  CustomerDisable = true;
  withOutCustDisable: boolean = false;
  userType: string = "User";
  selectedOptions: string[] = [];
  hidePassword: boolean = true;

  // user
  selectEmployee: any;
  employeeData: any;
  DepartmentData: any;
  Destination: any;
  NewUserName: string = '';
  NewPassword: string = '';
  selectDepartment: any;
  captionNames: string[] = [];
  Userform: any;
  RoutingPath: string [] = [];

  // customer
  Custform: any ;
  customerName: any;
  selectedSection: any;
  responseData: any[] = [];
  sideMenu: any;
  option: any;
  subOptionSelected: boolean = false;
  CustcaptionNames: any [] = []
  selectedCaptionNames: string[] = [];
  CustomerRoutingpath: string [] = [];
  CustMenu: any;

  constructor(public dialog: MatDialog,
            private getData: AllServicesService,
            private formbuilder: FormBuilder,
            private http: HttpClient,
            private httpService: HttpService,
            private snackBar: MatSnackBar,
            private _mdr: MatDialogRef <UserComponent>) {
              this.sessionLocationCode = localStorage.getItem('originCode');
              this.responseData = JSON.parse(localStorage.getItem('responseData'));
            }

  ngOnInit(): void {
    this.EmployeeData();
    this.getDestination();
    this.ConsignerData();
    this.getDepartmentData();

    // customer function calling
    this.getCustMenu();
    const initialRadioValue = 'User';
  if (initialRadioValue === 'User') {
    this.CustomerDisable = false;
    this.withOutCustDisable = true;
  } else {
    this.CustomerDisable = true;
    this.withOutCustDisable = false;
  }
  // user formcontrol
  this.Userform = this.formbuilder.group({
    department: ['', Validators.required],
    employee: ['', Validators.required],
    userName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, this.validatePassword]]
  });

  this.Custform = this.formbuilder.group({
    custUsername : ['', [Validators.required , Validators.minLength(3)]],
    custPassword : ['', [Validators.required , this.validatePassword]],
    Customer : ['', Validators.required]
  })

  }

  validatePassword(control: any) {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{4,}$/;
    return regex.test(control.value) ? null : { invalidPassword: true };
  }
openDepartmentDialog() {
  const selectedDept = this.Userform.get('department')?.value;
  if (!selectedDept) {
    return; // no department selected, prevent empty dialog
  }

  // Call your existing PermissionModal logic
  this.PermissionModal(selectedDept);
}


  onCheckedCust() {
  this.CustomerDisable = false;
  this.withOutCustDisable = true;
  this.userType = 'User';
  this.Custform.reset();
}
onCheckedWithoutCust() {
  this.CustomerDisable = true;
  this.withOutCustDisable = false;
  this.userType = 'Customer';
  this.Userform.reset();
}
openSnackBar(message: string, panelClass: string) {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: [panelClass]
  });
}

CloseDialog() {
  this._mdr.close(false);
}

togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
}
getDepartmentData() {
  this.httpService.get(`${environment.apiUrl}Permissions/getDepartment`).then((resp) => {
    this.DepartmentData = resp.Data ;
  });
}
onDepartmentChange(event: any) {
  const selectedDepartmentCode = event.target.value ;
  if (selectedDepartmentCode) {
    this.httpService.get(`${environment.apiUrl}Permissions/getEmployee?sessionLocationCode=${this.sessionLocationCode}&departmentCode=${selectedDepartmentCode}`).then((resp) => {
      this.employeeData = resp.Data;
      if (this.employeeData.length > 0) {
        this.PermissionModal(this.employeeData[0].employeeCode);
      }
      this.selectEmployee = null;
    });
  }
}
 EmployeeData() {
  this.httpService.get(`${environment.apiUrl}Permissions/getEmployee?sessionLocationCode=${this.sessionLocationCode}`).then((resp) => {
    this.employeeData = resp.Data ;
  });
}

getDestination(){
  this.httpService.get(`${environment.apiUrl}Booking/getDestination`).then((resp) => {
    this.Destination = resp.Data;
  });
}

ConsignerData() {
  this.httpService.get(`${environment.apiUrl}Booking/getConsigner?SessionLocationCode=` + this.sessionLocationCode ).then((resp) => {
      this.customerName = resp.Data;
    });
}

PermissionModal(employeeCode: string) {
  const dialogRef = this.dialog.open(UsermanagementBookingComponent, {
    data: {
      action: 'add',
      employeeCode: employeeCode
    },
    width: '50rem',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((selectedOptions: any[]) => {
    if (selectedOptions && selectedOptions.length > 0) {
      this.captionNames = selectedOptions.map(option => option.captionName);
      this.RoutingPath = selectedOptions.map(option => `/${option.captionName}`);
      this.openSnackBar("Permissions granted successfully", 'custom-snackbar');
    }
  });
}
submitForm(formData: any) {
  if (this.Userform.valid) {
    let obj = {
      userName: formData.userName,
      Password: formData.password,
      employeeCode: formData.employee,
      customerCode: '',
      locationCode: this.sessionLocationCode,
      userType: this.userType,
      captionName: this.captionNames,
      routingPath : this.RoutingPath
    };
    console.log(obj);

    this.http.post(`${environment.apiUrl}Permissions/userManagementPermissions`, obj).subscribe((resp: any) => {
    if (resp.status === 1) {
      this.openSnackBar(resp.message, 'custom-snackbar');
      this.Userform.patchValue({
        employee: '',
        userName: '',
        password: ''
      });
    } else {
      this.openSnackBar(resp.message, 'error-snackbar');
    }
  });
  } else {
    this.Userform.markAllAsTouched();
  }
}

getCustMenu(){
  this.httpService.get(`${environment.apiUrl}Permissions/getMenuForcustomer?Name`).then((resp) => {
    this.CustMenu = resp.Data;
  });
}
toggleCaptionName(captionName: string, checked: boolean) {
  if (checked) {
    this.selectedCaptionNames.push(captionName);
    this.CustomerRoutingpath.push(`/${captionName}`);
  } else {
    const index = this.selectedCaptionNames.indexOf(captionName);
    if (index !== -1) {
      this.selectedCaptionNames.splice(index, 1);
      this.CustomerRoutingpath.splice(index, 1);

    }
  }
}

submitCustForm(formData: any){
  if (this.Custform.valid){
    let obj = {
      userName : formData.custUsername,
      Password : formData.custPassword,
      employeeCode: '',
      userType : this.userType,
      locationCode: this.sessionLocationCode,
      customerCode : formData.Customer,
      captionName: this.selectedCaptionNames,
      routingPath : this.CustomerRoutingpath
    }
    console.log(obj, "submitCustomer form");
    this.http.post(`${environment.apiUrl}Permissions/userManagementPermissions`, obj).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.CloseDialog();
        this.Custform.reset();
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    });
  }else {
    this.Custform.markAllAsTouched();
  }
}
// openUserAuthModal() {
//   const dialogRef = this.dialog.open(AuthUserComponent, {
//     data: {
//       action: 'add'
//     },
//     width: '25rem',
//     disableClose: true
//   });
//   dialogRef.afterClosed().subscribe(res => {
//     if (res) {
//       this.NewUserName = res.userName;
//       this.NewPassword = res.password;
//     }
//   });
// }

}