import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http : HttpClient) { }

  getBranchDashbordSalesDetails(sessionLocationCode : string , customerCode : any ,fromDate:any ,toDate :any ,status: any) {
    return this.http.get(`${environment.apiUrl}customer/getCustomerDashbordStatus?sessionLocationCode=${sessionLocationCode}&customerCode=${customerCode}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`)
  }
}
