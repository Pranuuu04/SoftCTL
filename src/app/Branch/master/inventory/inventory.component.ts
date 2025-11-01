import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  entryViewData: object;
  branchViewData: object;
  customerViewData: object;
  employeeViewData: object;
  podViewData: object;

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
    this.getStockEntryData();
  }

  onTabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    console.log(tabIndex, 'tabIndex');
    switch (tabIndex) {
      case 0:
        this.getStockEntryData();
        break;
      case 1:
        this.getStockIssueBranchData();
        break;
      case 2:
        this.getStockIssueCustomerData();
        break;
      case 3:
        this.getStockIssueEmployeeData();
        break;
      case 4:
        this.getPodData();
        break;
      default:
        break;
    }
  }

  public getStockEntryData(): void {
    this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockEntry&operation=getStockEntry`)
      .subscribe(response => {
        console.log('Zone Data:', response);
        this.entryViewData = response;
      });
  }

  getStockIssueBranchData(): void {
    this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=getByBranchCode`)
    .subscribe(response => {
      console.log('Zone Data:', response);
      this.branchViewData = response;
    });
  }

  getStockIssueCustomerData(): void {
    this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=getByCustomerCode`)
    .subscribe(response => {
      console.log('Country Data:', response);
      this.customerViewData = response;
    });
  }

  getStockIssueEmployeeData(): void {
    this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=getByEmployeeCode`)
    .subscribe(response => {
      console.log('Zone Data:', response);
      this.employeeViewData = response;
    });
  }

  getPodData(): void {
    this.http.get(`${environment.apiUrl}Master/inventory?masterName=PodCancel&operation=getPodCancel`)
    .subscribe(response => {
      console.log('Country Data:', response);
      this.podViewData = response;
    });
  }

}



