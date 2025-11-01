import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient) { }

  createTrip(data: any) {
    return this.http.post(`${environment.apiUrl}Trip/createTrip`, data);
  }
 updateImportTrip(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}Trip/updateImportTrip`, payload);
  }
  getTripSheetData(SessionLocationCode: string, pageNumber: any, pageSize: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Trip/getTripSheetData?SessionLocationCode=${SessionLocationCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getPendingTrips(pageNumber: any, pageSize: any, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Trip/getPendingTrips?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`)
  }

  getSupplier(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Booking/getSupplier`)
  }

   getTransport(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Booking/getTransport`)
  }
  getTransportt(transportCode: string) {
  const url = `${environment.apiUrl}Booking/getTransport?transportType=${transportCode}`;
  return this.http.get<any>(url);
}

getTripSheetDataa(
  inputName:string,
  sessionLocationCode: string,
  fromDate: string,
  toDate: string,
  tripNo: string,
  customerCode: string,
  pageNumber: number,
  pageSize: number
) {
  const url = `${environment.apiUrl}Trip/getTripSheetData?InputName=${inputName}&SessionLocationCode=${sessionLocationCode}&FromDate=${fromDate}&ToDate=${toDate}&TripNo=${tripNo}&CustomerCode=${customerCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return this.http.get<any>(url);
}

getTripPDF(printData:any): Observable<Blob> {
  const url = `${environment.apiUrl}/Trip/TripSheetPrint`;
  return this.http.post(url, printData, { responseType: 'blob' });
}

cancelTrip(id: number, reason: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Trip/cancelTrip?id=${id}&reason=${reason}`);
  }
}
