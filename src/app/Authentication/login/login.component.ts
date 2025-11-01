import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AllServicesService } from 'app/service/all-services.service';
import { AuthenticationService } from 'app/service/authentication.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  userType: any;
  validationMessage: any;
  ClientLogo: any;
  ClientName: any;
  isSuccessfulLogin = false;
  tripSheet: any;
  responseData: any[] = [];
  sideMenu: any;
  hidePassword: boolean = true;
  dispatch: string;
  Transport: number;

  constructor( private formBuilder: FormBuilder,
               private router: Router,
               public httpService: HttpService,
               public authService: AuthenticationService,
               private snackBar: MatSnackBar,
               public dialog: MatDialog,
               ) { }

  ngOnInit(): void {
    this.getLogo();

    this.validationMessage = {
      username: [
        {type: 'required', message: 'Please enter user name.'}
      ],
      password: [
        {type: 'required', message: 'Please enter your Password.'}
      ],
    };
    this.loginForm  = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  togglePasswordVisibility() {
      this.hidePassword = !this.hidePassword;
  }
   openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  clearSiteData() {
    // localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    sessionStorage.clear();
  }

  formSubmit(formData: any) {
    if (this.loginForm.invalid) {
        this.openSnackBar('Please fill in all required fields.','error-snackbar')
      return;
    }
    this.clearSiteData();
     this.httpService.get(`${environment.apiUrl}Permissions/Login?username=` + this.loginForm.controls.username.value + '&password=' + this.loginForm.controls.password.value).then(resp => {
    if (resp.status === 1) {
      this.loadInitialData();
      this.userType = resp.Data[0].userType;
      localStorage.setItem('userType', resp.Data[0].userType);
      localStorage.setItem('userName', resp.Data[0].userName);
      localStorage.setItem('Password', resp.Data[0].Password);
      localStorage.setItem('originCode', resp.Data[0].originCode);
      localStorage.setItem('originName', resp.Data[0].originName);
      localStorage.setItem('customerCode', resp.Data[0].customerCode);
      localStorage.setItem('customerName', resp.Data[0].customerName);
      localStorage.setItem('token', resp.Data[0].token);
      localStorage.setItem('isLoggedIn' ,'true')
      this.sideMenu = resp.Data[1];
      this.responseData = [];
             for (const key in this.sideMenu) {
                 const abc = this.sideMenu[key];
                 this.responseData.push(abc);
             }
     localStorage.setItem('responseData', JSON.stringify(this.responseData));
      this.openSnackBar( resp.message, 'custom-snackbar')
       if ( this.userType === 'Admin') {
        this.router.navigate(['/dashboard']);
       } else if ( this.userType === 'BranchAdmin' || this.userType === 'User'){
        this.router.navigate(['/Branch/branch-dashboard']);
       } else if (this.userType === 'Customer') {
        this.router.navigate(['/Customer/customer-dashboard']);
       } else {
        localStorage.setItem('isLoggedIn' ,'false');
        this.router.navigate(['/auth/login']);
        this.openSnackBar(resp.message, 'error-snackbar')
       }
     } else {
      this.openSnackBar(resp.message, 'error-snackbar')
    }
    })
  }

  getLogo() {
    this.httpService.get(`https://www.softctl.com/NISTrackCTL/softCTLPermmision?clientURL=${environment.apiUrl}`)
    .then((resp) => {
      this.ClientLogo = resp.Data[0].logoUrl;
      localStorage.setItem('ClientLogo', resp.Data[0].logoUrl);
      this.ClientName = resp.Data[0].ClientName;
      localStorage.setItem('ClientName', resp.Data[0].ClientName);
      this.tripSheet = resp.Data[1].tripSheet;
      localStorage.setItem('tripSheet', resp.Data[1].tripSheet);
      this.dispatch = resp.Data[1].dispatch;
      localStorage.setItem('dispatch', resp.Data[1].dispatch);
      this.Transport = resp.Data[1].Transport;
      localStorage.setItem('Transport', resp.Data[1].Transport);
      localStorage.setItem('billing', resp.Data[1].billing);
      localStorage.setItem('reports', resp.Data[1].reports);
      localStorage.setItem('statusEntry', resp.Data[1].statusEntry);
      localStorage.setItem('driverEx', resp.Data[1].driverEx);
      localStorage.setItem('CRM', resp.Data[1].CRM);
      localStorage.setItem('mail', resp.Data[1].mail);
      localStorage.setItem('massage', resp.Data[1].massage);
      localStorage.setItem('masters', resp.Data[1].masters);
      localStorage.setItem('operation', resp.Data[1].operation);
      localStorage.setItem('payment', resp.Data[1].payment);
      localStorage.setItem('pickup', resp.Data[1].pickup);
      localStorage.setItem('utilies', resp.Data[1].utilies);
      localStorage.setItem('CompanyPrint', resp.Data[1].CompanyPrint);
      localStorage.setItem('GstVerify', resp.Data[1].GstVerify);

    }, (error) => {
      console.error(error);
    });
  }

  handleEmailClick(event: Event): void {
    event.preventDefault();
    window.location.href = 'mailto:cs@neotechnet.com';
  }

loadInitialData(): void {

  this.authService.loadMode().subscribe({
    next: () => console.log('Mode loaded successfully'),
    error: err => console.error('Error loading mode:', err)
  });

  this.authService.loadProduct().subscribe({
    next: () => console.log('Product loaded successfully'),
    error: err => console.error('Error loading product:', err)
  });
}

}
