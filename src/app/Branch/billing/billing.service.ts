import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient) { }

  getUnBill(sessionLocationCode: string, fromDate: any, toDate: any, pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}Billing/unBill?sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getCustomer(sessionLocationCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Billing/getCustomer?sessionLocationCode=${sessionLocationCode}`);
  }
  getLocation(sessionLocationCode: string ) {
  return this.http.get(`${environment.apiUrl}Billing/getLocation?sessionLocationCode=${sessionLocationCode}`)
}
  getShipper(sessionLocationCode: string , CustomerCode: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Billing/getShipper?sessionLocationCode=${sessionLocationCode}&CustomerCode=${CustomerCode}`)
  }

  getConsignee(sessionLocationCode: string, CustomerCode: string ) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${environment.apiUrl}Billing/getConsignee?sessionLocationCode=${sessionLocationCode}&CustomerCode=${CustomerCode}`)
  }

  billGenerate(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Billing/billGenerate`, formData)
  }

  getViewBill(sessionLocationCode: string, fromDate: string, toDate: string, CustomerCode: string, fromBillNo: string, toBillNo: string ) {
    return this.http.get(`${environment.apiUrl}Billing/getViewBill?sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&CustomerCode=${CustomerCode}&fromBillNo=${fromBillNo}&toBillNo=${toBillNo}`)
  }

  deleteBillData(sessionLocationCode: string, BillNo: string, AwbNo: string) {
    return this.http.get(`${environment.apiUrl}Billing/deleteBillData?sessionLocationCode=${sessionLocationCode}&BillNo=${BillNo}&AwbNo=${AwbNo}`)
  }

}
