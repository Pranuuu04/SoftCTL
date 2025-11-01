import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private dialog : MatDialog
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const localToken = localStorage.getItem('token');
    // request = request.clone({ headers: request.headers.set('x-api-key', localToken) });
    return next.handle(request).pipe(
      tap((event : any) => {
        // if (event && event.body && event.body.status === 2) {
        //   // alert("session is expired");
        //   this.dialogBox();
        // }
      })
    );
  }
  
  dialogBox() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25rem',
      data: { 
        message: 'Session Expired. Please log in again .',
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/auth/login']);
      } else {
      }
    });
  }
  
  setToken(token: string): void {
    const request = new HttpRequest<any>('GET', '/');
    const clonedRequest = request.clone({ headers: request.headers.set('x-api-key', token) });
    this.router.navigateByUrl('/').then(() => {});
  }

}
