import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {

  driverViewData: object;
  routeViewData: object;
  transportViewData: object;
  VtypeViewData: object;
  vehicleViewData: object;

  constructor(public http: HttpClient, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getDriverData();
  }

  onTabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    console.log(tabIndex, 'tabIndex');
    switch (tabIndex) {
      case 0:
        this.getDriverData();
        break;
      case 1:
        this.getrouteData();
        break;
      case 2:
        this.getTransportData();
        break;
      case 3:
        this.getVtypeData();
        break;
      case 4:
        this.getVehicleData();
        break;
      default:
        break;
    }
  }

 public getDriverData(): void {
    this.http.get(`${environment.apiUrl}Master/getAndDeleteDriver?operationName=getDriver&driverCode`)
      // .subscribe(response => {
      //   console.log('Zone Data:', response);
      //   this.driverViewData = response;
      .subscribe((response:any) => {
        if(response.status == 1){
          this.driverViewData = response;
        }else{
          this.openSnackBar(response.message, 'error-snackbar');
        }
      });
  }

  getrouteData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Route&operation=getRoute`)
    // .subscribe(response => {
    //   console.log('Zone Data:', response);
    //   this.routeViewData = response;
    .subscribe((response:any) => {
      if(response.status == 1){
        this.routeViewData = response;
      }else{
        this.openSnackBar(response.message, 'error-snackbar');
      }
    });
  }

  getTransportData(): void {
    this.http.get(`${environment.apiUrl}Master/transportMast?masterName=Transport&operation=getTransport&transportCode=&transportName=&transportCName=&transportAdd1=&transportAdd2=&transportAdd3=&transportTel=&transportMob=&transportEmail=&connectingHub=`)
    // .subscribe(response => {
    //   console.log('Zone Data:', response);
    //   this.transportViewData = response;
    .subscribe((response:any) => {
      if(response.status == 1){
        this.transportViewData = response;
      }else{
        this.openSnackBar(response.message, 'error-snackbar');
      }
    });
  }

  getVtypeData(): void {
    this.http.get(`${environment.apiUrl}Master/VehicleType?masterName=VehicleType&operation=getVehicleType&vehicleName=&companyName=&vehicleCode=`)
    // .subscribe(response => {
    //   console.log('Zone Data:', response);
    //   this.VtypeViewData = response;
      .subscribe((response:any) => {
        if(response.status == 1){
          this.VtypeViewData = response;
        }else{
          this.openSnackBar(response.message, 'error-snackbar');
        }
    });
  }

  getVehicleData(): void {
    this.http.get(`${environment.apiUrl}Master/getAndDeleteVehicle?operationName=getVehicle&vehicleCode`)
    .subscribe((response:any) => {
      if(response.status == 1){
        this.vehicleViewData = response;
        console.log('Vehical Data:', response);
      }else{
        this.openSnackBar(response.message, 'error-snackbar');
      }
      
    });
  }

  openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

}
