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
}