import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {

  // common 
  sessionLocationCode: string;
  CustomerDisable: boolean = true;
  withOutCustDisable: boolean =false;
  userType: string = "Admin";
  selectedOptions: string[] = [];
  hidePassword : boolean = true ;
  // Admin 
  NewUserName: string = '';
  NewPassword: string = '';
  selectDepartment: any; 
  captionNames: string[] = [];
  Adminform: any;
  RoutingPath: string [] =[];

  // Branch 
  Branchform : any ;
  branchName: any;
  selectedSection: any;
  responseData: any[] =[];
  sideMenu :any;
  option: any;
  subOptionSelected: boolean = false;
  CustcaptionNames: any []=[]
  selectedCaptionNames: string[] = [];
  CustomerRoutingpath: string [] = [];
  selectedCaptionName: string;

  constructor(public dialog: MatDialog,
            private getData: AllServicesService,
            private formbuilder: FormBuilder,
            private http: HttpClient,
            private httpService: HttpService,
            private snackBar : MatSnackBar,
            private _mdr : MatDialogRef <AdminManagementComponent>) {
              this.sessionLocationCode = localStorage.getItem('originCode');
              this.responseData = JSON.parse(localStorage.getItem('responseData'));
            }

  ngOnInit(): void {  
    this.BranchData();

    const initialRadioValue = 'Admin'; 
  if (initialRadioValue === 'Admin') {
    this.CustomerDisable = false;
    this.withOutCustDisable = true;
  } else {
    this.CustomerDisable = true;
    this.withOutCustDisable = false;
  }
  // user formcontrol 
  this.Adminform = this.formbuilder.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, this.validatePassword]]
  });

  this.Branchform = this.formbuilder.group({
    custUsername : ['',[Validators.required , Validators.minLength(3)]],
    custPassword : ['',[Validators.required , this.validatePassword]],
    selectBranch : ['',Validators.required]
  })  
  }
  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }
  validatePassword(control: any) {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{4,}$/;
    return regex.test(control.value) ? null : { invalidPassword: true };
  }  
  
  onCheckedCust() {
  this.CustomerDisable = false;
  this.withOutCustDisable = true;
  this.userType = 'Admin';
  this.Branchform.reset();
}
onCheckedWithoutCust() {
  this.CustomerDisable = true;
  this.withOutCustDisable = false;
  this.userType = 'BranchAdmin';
  this.Adminform.reset();
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

BranchData() {
  this.httpService.get(`${environment.apiUrl}Booking/getBranch` ).then((resp) => {
      this.branchName = resp.Data;
    });
}

submitForm(formData: any) {
    let captionNames: string[] = [];
    let routingPaths : string []= [];

    this.responseData.forEach(item => {
      captionNames.push(item.captionName);
      routingPaths.push(`/${item.captionName}`); 
    });

  if (this.Adminform.valid) {
    let obj = {
      userName: formData.userName,
      Password: formData.password,
      employeeCode: '',
      customerCode: '',
      locationCode: '',
      userType: this.userType,
      captionName: captionNames,
      routingPath : routingPaths
    };

    this.http.post(`${environment.apiUrl}Permissions/userManagementPermissions`, obj).subscribe((resp: any) => {
    if (resp.status === 1) {
      this.openSnackBar(resp.message, 'custom-snackbar');
      this.CloseDialog();
      this.Adminform.patchValue({
        userName: '',
        password: ''
      });
    } else {
      this.openSnackBar(resp.message, 'error-snackbar');
    }
  });
  } else {
    this.Adminform.markAllAsTouched();
  }
}

onSectionChange(event: any, captionName: string) {
  this.selectedSection = event.value;
  this.selectedCaptionName = captionName; 
}

submitOptions(): void {
  const selectedOptions = this.responseData.filter(item => item.isChecked);
  this.selectedOptions.forEach(sectionName => {
    selectedOptions.push({ captionName: sectionName, isChecked: true, captionType: 'Menu' });
  });

  const invalidOptions = selectedOptions.filter(option => {
    const relatedSubOptions = this.responseData.filter(subOption =>
      subOption.captionType === 'Child_Menu' && subOption.groupName === option.captionName
    );
    const availableSubOptions = relatedSubOptions.length > 0;
    const selectedSubOptions = relatedSubOptions.filter(subOption => subOption.isChecked);
    return availableSubOptions && selectedSubOptions.length === 0;
  });
  if (invalidOptions.length > 0) {
    const optionNames = invalidOptions.map(option => option.captionName).join(', ');
    this.openSnackBar(`Please select at least one option of: ${optionNames}`, 'error-snackbar');
  } else {
    if (selectedOptions && selectedOptions.length > 0) {
      this.selectedCaptionNames = selectedOptions.map(option => option.captionName);
      this.CustomerRoutingpath = selectedOptions.map(option => `/${option.captionName}`);
    }
  }
}

toggleOption(section: any, option: any): void {
  option.isChecked = !option.isChecked;
  if (option.isChecked && !this.selectedOptions.includes(section.captionName)) {
    this.selectedOptions.push(section.captionName);
  }
  this.sideMenu.forEach((item: any) => {
    if (item.captionType === 'Sub_Menu' && item.groupName === option.captionName) {
      item.isChecked = option.isChecked;
    }
  });
}


toggleSubOption(section: any, option: any, subOption: any): void {
  subOption.isChecked = !subOption.isChecked;
}

submitCustForm(formData: any){
  this.submitOptions();
  if(this.Branchform.valid){
    let obj ={
      userName : formData.custUsername,
      Password :formData.custPassword,
      employeeCode: '',
      userType : this.userType,
      locationCode: formData.selectBranch,
      customerCode :'',
      captionName:  this.selectedCaptionNames,
      routingPath : this.CustomerRoutingpath
    }
    this.http.post(`${environment.apiUrl}Permissions/userManagementPermissions`, obj).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.CloseDialog();
        this.Adminform.patchValue({
          custUsername: '',
          custPassword: '',
          Customer: ''
        });
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    });
  }else {
    this.Branchform.markAllAsTouched();
  }
}
}
