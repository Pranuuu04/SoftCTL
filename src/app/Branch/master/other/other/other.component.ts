import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {

  courierBoyViewData: any;
  branchMastViewData: any;
  CourierMastViewData: any;
  CompanyMastViewData: any;
   activeTab = 0

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

onTabChange(index: number): void {
    this.activeTab = index;

    switch (index) {
      case 2:
        this.getCourierboyData();
        break;
      case 3:
        this.getBranchMastData();
        break;
      case 4:
        this.getCourierMastData();
        break;
      // case 5:
      //   this.getCompanyMastData();
      //   break;
      default:
        break;
    }
  }

   getCourierboyData(): void {
    this.http.get(`${environment.apiUrl}Master/EmployeeMast?masterName=Employee&operation=getEmployee`)
    .subscribe(response => {
      this.courierBoyViewData = response;
    });
  }

  getBranchMastData(): void {
    this.http.get(`${environment.apiUrl}Master/GetAndDeleteLocation?operation=getLocation`)
      .subscribe(response => {
        this.branchMastViewData = response;
      });
  }

  getCourierMastData(): void {
    this.http.get(`${environment.apiUrl}Master/getAndDeleteVendor?operationName=getVendor`)
      .subscribe(response => {
        this.CourierMastViewData = response;
      });
  }

  //   getCompanyMastData(pageNumber: number = 1, pageSize: number = 10): void {
  //   this.http.get(`${environment.apiUrl}Master/companyGetAndDelete?operation=getCompany&pageNumber=${pageNumber}&pageSize=${pageSize}`)
  //     .subscribe(response => {
  //       this.CompanyMastViewData = response;
  //     });
  // }

}
