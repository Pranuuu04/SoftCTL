import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-transport-way',
  templateUrl: './transport-way.component.html',
  styleUrls: ['./transport-way.component.css']
})
export class TransportWayComponent implements OnInit {

  airlineViewData: object;
  flightViewData: Object;
  trainViewData: Object;
  trainNoViewData: object;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAirLine();
  }

  onTabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    switch (tabIndex) {
      case 0:
        this.getAirLine();
        break;
      case 1:
        this.getFlightData();
        break;
      case 2:
        this.getTrain();
        break;
      case 3:
        this.getTrainNo();
        break;
      default:
        break;
    }
  }

  public getFlightData(): void {
    this.http.get(`${environment.apiUrl}Master/FlightMast?masterName=Flight&operation=getFlight`)
      .subscribe(response => {
        this.flightViewData = response;
      });
  }

  getAirLine(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=AirLine&operation=getAirLine`)
    .subscribe(response => {
      this.airlineViewData = response;
    });
  }

  getTrain(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Train&operation=getTrain`)
    .subscribe(response => {
      this.trainViewData = response;
    });
  }

  getTrainNo(): void {
    this.http.get(`${environment.apiUrl}Master/TrainNo?masterName=TrainNo&operation=getTrainNo`)
    .subscribe(response => {
      this.trainNoViewData = response;
    });
  }

}
