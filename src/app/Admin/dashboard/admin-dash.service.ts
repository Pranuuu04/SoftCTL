import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDashService {

  constructor(private http: HttpClient ) { }
  
  getBranchData(fromDate: string, toDate: string, branch: string, clientType: string) {
    const url = `${environment.apiUrl}admin/getAdminDashbordBranch?fromDate=${fromDate}&toDate=${toDate}&branch=${branch}&clientType=${clientType}`;
    return this.http.get<any>(url); // Replace `any` with an appropriate type if available.
  }
}
