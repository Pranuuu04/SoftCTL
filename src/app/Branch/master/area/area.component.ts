import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  zoneViewData: Object;
  countryViewData: object;
  stateViewData: object;
  destinationViewData: object;
  courierBoyViewData: object;
  prefixViewData: object;
  branchMastViewData: object;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getZoneData();
  }

  onTabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    switch (tabIndex) {
      case 0:
        this.getZoneData();
        break;
      case 1:
        this.getMultiZoneData();
        break;
      case 2:
        this.getCountryData();
        break;
      case 3:
        this.getStateData();
        break;
      case 4:
        this.getPinCodeData();
        break;
      case 5:
        this.getDestinationData();
        break;
      case 6:
      this.getPrefixData();
      break;
      default:
        break;
    }
  }

  public getZoneData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Zone&operation=getZone`)
      .subscribe(response => {
        this.zoneViewData = response;
      });
  }

  getMultiZoneData(): void {
    this.http.get('/api/multiZone').subscribe(response => {
    });
  }

  getCountryData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Country&operation=getCountry`)
    .subscribe(response => {
      this.countryViewData = response;
    });
  }

  getStateData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=State&operation=getState`)
    .subscribe(response => {
      this.stateViewData = response;
    });
  }

  getPinCodeData(): void {
    this.http.get('/api/pinCode').subscribe(response => {
    });
  }

  getDestinationData(): void {
    this.http.get(`${environment.apiUrl}Master/destinationMast?masterName=Destination&operation=getDataNameWithCode`)
    .subscribe(response => {
      this.destinationViewData = response;
    });
  }

   getPrefixData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Prefix&operation=getPrefix`)
    .subscribe(response => {
      this.prefixViewData = response;
    });
  }

}
