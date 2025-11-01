import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  modeViewData: object;
  productViewData: object;
  departmentViewData: object;
  expenceViewData: object;
  bankViewData: object;
  packageViewData: object;
  deliveryViewData: object;
  reasonViewData: object;
  serviceViewData: object;

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
    this.getModeData();
  }

  onTabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    console.log(tabIndex, 'tabIndex');
    switch (tabIndex) {
      case 0:
        this.getModeData();
        break;
      case 1:
        this.getProductData();
        break;
      case 2:
        this.getDepartmentData();
        break;
      case 3:
        this.getExpenseData();
        break;
      case 4:
        this.getBankData();
        break;
      case 5:
        this.getPackageData();
        break;
      case 6:
        this.getDeliveryData();
        break;
      case 7:
        this.getReasonData();
        break;
      case 8:
        this.getServiceData();
        break;
      default:
        break;
    }
  }

  public getModeData(): void {
    this.http.get(`${environment.apiUrl}Master/modeAndProductMast?masterName=Mode&operation=getMode`)
      .subscribe(response => {
        if (response) {
          console.log('Mode Data:', response);
          this.modeViewData = response;
        } else {
          console.error('No data received from the API.');
        }
      }, error => {
        console.error('API call failed:', error);
      });
  }


  getProductData(): void {
    this.http.get(`${environment.apiUrl}Master/modeAndProductMast?masterName=Product&operation=getProduct`).subscribe(response => {
      console.log('Zone Data:', response);
        this.productViewData = response;
    });
  }

  getDepartmentData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Department&operation=getDepartment`)
    .subscribe(response => {
      console.log('Country Data:', response);
      this.departmentViewData = response;
    });
  }

  getExpenseData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Expences&operation=getExpences`)
    .subscribe(response => {
      console.log('State Data:', response);
      this.expenceViewData = response;
    });
  }

  getBankData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Bank&operation=getBank`).subscribe(response => {
      console.log('Zone Data:', response);
        this.bankViewData = response;
    });
  }

  getPackageData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=PackageType&operation=getPackageType`)
    .subscribe(response => {
      console.log('Destination Data:', response);
      this.packageViewData = response;
    });
  }

  getDeliveryData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=DeliverType&operation=getDeliverType`)
    .subscribe(response => {
      console.log('State Data:', response);
      this.deliveryViewData = response;
    });
  }

  getReasonData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Reason&operation=getReason`).subscribe(response => {
      console.log('Zone Data:', response);
        this.reasonViewData = response;
    });
  }

  getServiceData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=ServiceType&operation=getServiceType`)
    .subscribe(response => {
      console.log('Destination Data:', response);
      this.serviceViewData = response;
    });
  }

}
