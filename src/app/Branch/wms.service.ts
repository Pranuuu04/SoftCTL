import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WMSService {

  constructor(private http: HttpClient) { }

  createStockIn(data: any) {
    return this.http.post(`${environment.apiUrl}WMS/createStockIn`, data);
  }

  createStockOut(data: any) {
    return this.http.post(`${environment.apiUrl}WMS/createStockOut`, data);
  }

  getWarehouse () {
    return this.http.get(`${environment.apiUrl}Booking/getWarehouse`);
  }
  getItem (serialNo: any) {
    return this.http.get(`${environment.apiUrl}Booking/getItem?serialNo=${serialNo}`);
  }

  getWMSStockInReport(fromDate: string, toDate: any, ItemNo: any, SupplierName: any, pageNumber: any, pageSize: any): Observable<any> {
  return this.http.get(`${environment.apiUrl}WMS/getWMSStockInReport?ReportType=WMSStocInDetails&FromDate=${fromDate}&ToDate=${toDate}&ItemNo=${ItemNo}&SupplierName=${SupplierName}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

getWMSStockOutReport(fromDate: string, toDate: any, ItemNo: any, SupplierName: any, pageNumber: any, pageSize: any): Observable<any> {
  return this.http.get(`${environment.apiUrl}WMS/getWMSStockOutReport?ReportType=WMSStocOutDetails&FromDate=${fromDate}&ToDate=${toDate}&ItemNo=${ItemNo}&SupplierName=${SupplierName}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

getWMSItemNameReport(ItemNo: any, pageNumber: any, pageSize: any): Observable<any> {
  return this.http.get(`${environment.apiUrl}WMS/getWMSItemNameReport?ItemNo=${ItemNo}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}
}
