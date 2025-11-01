import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:max-line-length
  RateUpdation(sessionLocationCode: string, customerCode: string, fromDate: string, toDate: string, pageNumber: number, pageSize: number): Observable<any> {
  const params = new HttpParams()
    .set('SessionLocationCode', sessionLocationCode)
    .set('customerCode', customerCode)
    .set('fromDate', fromDate)
    .set('toDate', toDate)
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  return this.http.get(`${environment.apiUrl}Booking/RateUpdation`, { params });
}

// all.service.ts
getChargeValue(chargeName: string, customerCode: string, productCode: string, amount: number, bookDate: string, destinationCode: string) {
  const params = new HttpParams()
    .set('chargeName', chargeName)
    .set('customerCode', customerCode)
    .set('productCode', productCode)
    .set('amount', amount.toString())
    .set('bookDate', bookDate)
    .set('destinationCode', destinationCode);

  return this.http.get<any>(`${environment.apiUrl}Booking/getAllCharges`, { params });
}

}
