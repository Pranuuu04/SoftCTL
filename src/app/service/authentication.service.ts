import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }
  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  hasValidToken(): boolean {
    return localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined;
  }
  
  // loadOrigin(): Observable<any> {
  //   return this.http.get<any>(`${environment.apiUrl}Booking/getOrigin`)
  //     .pipe(
  //       tap(resp => localStorage.setItem('originList', JSON.stringify(resp.Data)))
  //     );
  // }
  // loadDestination(): Observable<any> {
  //   return this.http.get<any>(`${environment.apiUrl}Booking/getDestination`)
  //     .pipe(
  //       tap(resp => localStorage.setItem('destinationList', JSON.stringify(resp.Data)))
  //     );
  // }

  loadMode(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Booking/getMode`)
      .pipe(
        tap(resp => localStorage.setItem('modeList', JSON.stringify(resp.Data)))
      );
  }

  loadProduct(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Booking/getProduct`)
      .pipe(
        tap(resp => localStorage.setItem('productList', JSON.stringify(resp.Data)))
      );
  }
  // logout() {
  //   localStorage.removeItem("token");
  //   this.currentUserSubject.next(null!);
  //   this.router.navigate(['/login']);
  // }
}