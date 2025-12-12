import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpService } from 'app/service/http.service';
import { DashboardViewComponent } from '../Shared/dashboard_pages/dashboard-view/dashboard-view.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';
import { BranchDashService } from './branch-dash.service';
import { catchError, combineLatest, distinctUntilChanged, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class BranchDashboardComponent implements OnInit  ,OnDestroy{

  @ViewChild('chartCanvas1') chartCanvas1!: ElementRef;
  @ViewChild('chartCanvas2') chartCanvas2!: ElementRef;
  @ViewChild('chartCanvas3') chartCanvas3!: ElementRef;
  @ViewChildren(MatTabGroup) tabGroups: QueryList<MatTabGroup>;

  firstData: any;
  xAxisData: any;
  yAxisData: any;

  chart: Chart<"pie", number[], string>;
  private destroy$ = new Subject<void>();

  userType: any;
  pickupPending: any ;
  pickupDone: any;
  Done: any;
  pendingPickup: any;
  sessionLocationCode: string;
  manifestPending: string ='Pending';
  manifestDone: string ='Done';
  inscanPending: string ='Pending';
  inscanDone:string ='Done';
  drsPending:any;
  drsDone: any;
  salesCredit: any;
  salesCash: any;
  salesTopay: any;
  salesCOD: any;
  statusInTransit: any;
  statusOFD: any;
  statusUnDelv: any;
  statusDelv: any;
  statusRTO: any;
  TATWithin: any;
  TATDue: any;
  TripOpen: any;
  TripClose: any;
  AWBUsed: any;
  AWBUnused: any;
  AWBTotal: any;
  xAxisLineData: any;
  xAxisPieData: any;
  chartInstance: Chart |undefined;

  fromDate: string;
  toDate: string;
  isClicked: boolean = false;

  // pending&done 
  ManfDoneData : any [];
  ManfPendingData : any [];
  ManfData: any;
  inscanData: any;
  SalesData: any ;
  DrsData: any;
  isLoading: boolean = false;
  dispatch: string ;
  DispatchPending: any;
  DispatchDone: any;
  
  constructor(
              public httpService: HttpService,
              public dialog: MatDialog,
              private snackBar : MatSnackBar,
              private http : AllServicesService,
              private sharedService :SharedService,
              public branchDashService: BranchDashService,
              ) 
            { 
              this.userType = localStorage.getItem('userType');
              this.sessionLocationCode = localStorage.getItem('originCode');
              this.fromDate = localStorage.getItem('fromDate');
              this.toDate = localStorage.getItem('toDate');
              this.dispatch = localStorage.getItem('dispatch');

            }
            ngOnDestroy(): void {
              this.destroy$.next();
              this.destroy$.complete();
            }

  ngOnInit(): void {
    this.isLoading = true;
    let isApiCallInProgress = false;
  combineLatest([
    this.sharedService.fromDate$.pipe(distinctUntilChanged()), 
    this.sharedService.toDate$.pipe(distinctUntilChanged())
  ]).pipe(
    switchMap(([fromDate, toDate]) => {
      this.fromDate = fromDate;
      this.toDate = toDate;
      if (isApiCallInProgress) {
        return [];
      }
      isApiCallInProgress = true;
      return this.loadDataWithUpdatedDates().finally(() => {
        isApiCallInProgress = false;
      });
    }),
    takeUntil(this.destroy$)
  ).subscribe({
    next: () => {
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading data:', err);
      this.isLoading = false;
    }
  });
}


  async loadDataWithUpdatedDates() {
    await Promise.all([
      this.loadPickupPendingData(),
      this.loadManifestPending(),
      this.loadInscanPendingData(),
      this.loadDrsPendingData(),
      this.loadSalesCreditData(),
      this.loadStatusInTransitData(),
      this.loadTATWithinData(),
      this.loadTripOpenData(),
      this.loadAWBUsedData(),
      this.fetchShipmentDetails(),
      this.fetchSalesGraph(),
      this.fetchShipmentStatus(),
    ]);
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

onTabChangePickup(event: any) {
  if (event.index === 1) { 
    this.loadPickupDoneData();
  }
}
onTabChangeManf(event: any) {
  if (event.index === 1) { 
      this.loadManifestDoneData();
  }
}
onTabChangeInscan(event: any) {
  if (event.index === 1) { 
    this.loadInscanDoneData();
  }
}
onTabChangeDrs(event: any) {
  if (event.index === 1) { 
    this.loadDrsDoneData();
  }
}  
onTabChangeStatus(event: MatTabChangeEvent): void {
  switch (event.index) {
    case 1:
      this.loadStatusOFDData();
    break;
    
    case 2:
      this.loadStatusUnDelvData();
    break;
    
    case 3:
      this.loadStatusDelvData();
    break;
    
    case 4:
      this.loadStatusRTOData();
    break;
  }
}
onTabChangeSales(event: MatTabChangeEvent): void {
  switch (event.index) {
    case 1:
this.loadSalesCashData();
   break;
    
    case 2:
this.loadSalesTopayData();
   break;
    
    case 3:
this.loadSalesCODData();
   break;
  }
}
onTabChangeTrip(event: any) {
  if (event.index === 1) { 
    this.loadTripCloseData();
  }
}
onTabChangeTat(event: any) {
  if (event.index === 1) { 
    this.loadTATDueData();
  }
}
async loadPickupPendingData() {
  try {
    const resp = await this.branchDashService.loadPickupPendingData(
      this.sessionLocationCode,
      this.fromDate,
      this.toDate
    ).toPromise();
    this.pickupPending = resp.Data.Pickup;
  } catch (error) {
    console.error('Error fetching pickup pending data:', error);
  }
}

async loadPickupDoneData() {
  try {
    const resp = await this.branchDashService.loadPickupDoneData(
      this.sessionLocationCode,
      this.fromDate,
      this.toDate
    ).toPromise();
    this.pickupDone = resp.Data.Pickup;
  } catch (error) {
    console.error('Error fetching pickup done data:', error);
  }
}

async loadDispatchPending() {
  try {
    const resp = await this.branchDashService.loadDispatchPending(
      this.sessionLocationCode,
      this.fromDate,
      this.toDate
    ).toPromise();
    this.DispatchPending = resp.Data.Manifest;
    this.isClicked = true;
  } catch (error) {
    console.error('Error fetching dispatch pending data:', error);
  }
}

async loadDispatchDoneData() {
  try {
    const resp = await this.branchDashService.loadDispatchDone(
      this.sessionLocationCode,
      this.fromDate,
      this.toDate
    ).toPromise();
    this.DispatchDone = resp.Data.Manifest;
  } catch (error) {
    console.error('Error fetching dispatch done data:', error);
  }
}

async loadManifestPending() {
  try {
    const resp = await this.branchDashService.loadManifestPending(
      this.sessionLocationCode,
      this.fromDate,
      this.toDate
    ).toPromise();
    this.manifestPending = resp.Data.Manifest;
    this.isClicked = true;
  } catch (error) {
    console.error('Error fetching manifest pending data:', error);
  }
}

async loadManifestDoneData() {
  try {
    const resp = await this.branchDashService.loadManifestDone(
      this.sessionLocationCode,
      this.fromDate,
      this.toDate
    ).toPromise();
    this.manifestDone = resp.Data.Manifest;
  } catch (error) {
    console.error('Error fetching manifest done data:', error);
  }
}
async loadInscanPendingData() {
  try {
    const resp = await this.branchDashService
      .loadInscanPending(this.sessionLocationCode, this.fromDate, this.toDate)
      .toPromise();
    this.inscanPending = resp.Data.Inscan;
  } catch (error) {
    console.error('Error fetching inscan pending data:', error);
  }
}

async loadInscanDoneData() {
  try {
    const resp = await this.branchDashService
      .loadInscanDone(this.sessionLocationCode, this.fromDate, this.toDate)
      .toPromise();
    this.inscanDone = resp.Data.Inscan;
  } catch (error) {
    console.error('Error fetching inscan done data:', error);
  }
}

async loadDrsPendingData() {
  try {
    const resp = await this.branchDashService
      .loadDrsPending(this.sessionLocationCode, this.fromDate, this.toDate)
      .toPromise();
    this.drsPending = resp.Data.Runsheet;
  } catch (error) {
    console.error('Error fetching DRS pending data:', error);
  }
}

async loadDrsDoneData() {
  try {
    const resp = await this.branchDashService
      .loadRunsheetDone(this.sessionLocationCode, this.fromDate, this.toDate)
      .toPromise();
    this.drsDone = resp.Data.Runsheet;
  } catch (error) {
    console.error('Error fetching DRS done data:', error);
  }
}

async loadSalesCreditData() {
  try {
    const resp = await this.branchDashService
      .loadSalesData(this.sessionLocationCode, this.fromDate, this.toDate, 'Credit')
      .toPromise();
    this.salesCredit = resp.Data.Sales;
  } catch (error) {
    console.error('Error fetching sales credit data:', error);
  }
}

async loadSalesCashData() {
  try {
    const resp = await this.branchDashService
      .loadSalesData(this.sessionLocationCode, this.fromDate, this.toDate, 'Cash')
      .toPromise();
    this.salesCash = resp.Data.Sales;
  } catch (error) {
    console.error('Error fetching sales cash data:', error);
  }
}

async loadSalesTopayData() {
  try {
    const resp = await this.branchDashService
      .loadSalesData(this.sessionLocationCode, this.fromDate, this.toDate, 'ToPay')
      .toPromise();
    this.salesTopay = resp.Data.Sales;
  } catch (error) {
    console.error('Error fetching sales topay data:', error);
  }
}

async loadSalesCODData() {
  try {
    const resp = await this.branchDashService
      .loadSalesData(this.sessionLocationCode, this.fromDate, this.toDate, 'COD')
      .toPromise();
    this.salesCOD = resp.Data.Sales;
  } catch (error) {
    console.error('Error fetching sales COD data:', error);
  }
}
async loadStatusInTransitData() {
  try {
    const resp = await this.branchDashService
      .loadStatusData(this.sessionLocationCode, this.fromDate, this.toDate, 'InTransit')
      .toPromise();
    this.statusInTransit = resp.Data.Status;
  } catch (error) {
    console.error('Error fetching InTransit data:', error);
  }
}

async loadStatusOFDData() {
  try {
    const resp = await this.branchDashService
      .loadStatusData(this.sessionLocationCode, this.fromDate, this.toDate, 'OFD')
      .toPromise();
    this.statusOFD = resp.Data.Status;
  } catch (error) {
    console.error('Error fetching OFD data:', error);
  }
}

async loadStatusUnDelvData() {
  try {
    const resp = await this.branchDashService
      .loadStatusData(this.sessionLocationCode, this.fromDate, this.toDate, 'UnDelivered')
      .toPromise();
    this.statusUnDelv = resp.Data.Status;
  } catch (error) {
    console.error('Error fetching UnDelivered data:', error);
  }
}
async loadStatusDelvData() {
  try {
    const resp = await this.branchDashService
      .loadStatusData(this.sessionLocationCode, this.fromDate, this.toDate, 'Delivered')
      .toPromise();
    this.statusDelv = resp.Data.Status;
  } catch (error) {
    console.error('Error fetching Delivered data:', error);
  }
}

async loadStatusRTOData() {
  try {
    const resp = await this.branchDashService
      .loadStatusData(this.sessionLocationCode, this.fromDate, this.toDate, 'RTO')
      .toPromise();
    this.statusRTO = resp.Data.Status;
  } catch (error) {
    console.error('Error fetching RTO data:', error);
  }
}

async loadTATWithinData() {
  try {
    const resp = await this.branchDashService
      .loadTATData(this.sessionLocationCode, this.fromDate, this.toDate, 'With')
      .toPromise();
    this.TATWithin = resp.Data.TAT;
  } catch (error) {
    console.error('Error fetching TAT Within data:', error);
  }
}
async loadTATDueData() {
  try {
    const resp = await this.branchDashService
      .loadTATData(this.sessionLocationCode, this.fromDate, this.toDate, 'Due')
      .toPromise();
    this.TATDue = resp.Data.TAT;
  } catch (error) {
    console.error('Error fetching TAT Due data:', error);
  }
}

async loadTripCloseData() {
  try {
    const resp = await this.branchDashService
      .loadTripData(this.sessionLocationCode, this.fromDate, this.toDate, 'Close')
      .toPromise();
    this.TripClose = resp.Data.TripSheet;
  } catch (error) {
    console.error('Error fetching Trip Close data:', error);
  }
}
async loadTripOpenData() {
  try {
    const resp = await this.branchDashService
      .loadTripData(this.sessionLocationCode, this.fromDate, this.toDate, 'Open')
      .toPromise();
    this.TripOpen = resp.Data.TripSheet;
  } catch (error) {
    console.error('Error fetching Trip Open data:', error);
  }
}

async loadAWBUsedData() {
  try {
    const resp = await this.branchDashService
      .loadAWBStockData(this.sessionLocationCode, this.fromDate, this.toDate, 'Used')
      .toPromise();
    this.AWBUsed = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching AWB Used data:', error);
  }
}

async awbUnusedData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}branch/getBranchDashbordAWBStock?SessionLocationCode=${this.sessionLocationCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbStock=Unused`);
    this.AWBUnused = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async awbAWBTotalData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}branch/getBranchDashbordAWBStock?SessionLocationCode=${this.sessionLocationCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbStock=AWBTotal`);
    this.AWBTotal = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


fetchShipmentDetails() {
  this.branchDashService.getShipmentDetails(this.sessionLocationCode).subscribe(
    (resp) => {
      if (resp.status === 1) {
        this.firstData = resp.Data[0];
        this.xAxisData = {
          January: this.firstData.January,
          February: this.firstData.February,
          March: this.firstData.March,
          April: this.firstData.April,
          May: this.firstData.May,
          June: this.firstData.June,
          July: this.firstData.July,
          August: this.firstData.August,
          September: this.firstData.September,
          October: this.firstData.October,
          November: this.firstData.November,
          December: this.firstData.December,
        };
        this.generateChart();
      } else {
        console.error('Invalid data structure in the response.');
      }
    },
    (error) => {
      console.error('Error fetching shipment details:', error);
    }
  );
}
generateChart() {
  const ctx = this.chartCanvas1.nativeElement.getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [{
        label: 'Shipment Yearly Data',
        data: Object.values(this.xAxisData),
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'AWB No.',
            color: 'white'
          },
          ticks: {
            color: 'white',
          },
        },
        x: {
          ticks: {
            color: 'white',
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: 'white',
          },
        },
      },
    }
  });
}


fetchSalesGraph() {
  this.branchDashService.getSalesGraph(this.sessionLocationCode).subscribe(
    (resp) => {
      if (resp.status === 1) {
        this.firstData = resp.Data[0];
        this.xAxisLineData = {
          January: this.firstData.January,
          February: this.firstData.February,
          March: this.firstData.March,
          April: this.firstData.April,
          May: this.firstData.May,
          June: this.firstData.June,
          July: this.firstData.July,
          August: this.firstData.August,
          September: this.firstData.September,
          October: this.firstData.October,
          November: this.firstData.November,
          December: this.firstData.December,
        };
        this.generateLineChart();
      } else {
        console.error('Invalid data structure in the response.');
      }
    },
    (error) => {
      console.error('Error fetching sales graph data:', error);
    }
  );
}
generateLineChart() {
  const ctx = this.chartCanvas2.nativeElement.getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [{
        label: 'Sales Yearly Data',
        data: Object.values(this.xAxisLineData),
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount',
            color: 'white'
          },
          ticks: {
            color: 'white',
          },
        },
        x: {
          ticks: {
            color: 'white',
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: 'white',
          },
        },
      },
    }
  });
}

fetchShipmentStatus() {
  this.branchDashService.getShipmentStatus(this.sessionLocationCode, this.fromDate, this.toDate).subscribe(
    (resp) => {
      if (resp.status === 1) {
        this.firstData = resp.Data[0];
        this.xAxisPieData = {
          Delivered: this.firstData.Delivered,
          InTransit: this.firstData.InTransit,
          OutForDelivery: this.firstData.OutForDelivery,
          RTO: this.firstData.RTO,
          UnDelivered: this.firstData.UnDelivered,
        };
        this.generatePieChart();
      } else {
        console.error('Invalid data structure in the response.');
      }
    },
    (error) => {
      console.error('Error fetching shipment status data:', error);
    }
  );
}

generatePieChart() {
  const dangerColor = 'rgba(255, 0, 0, 0.7)';
  const successColor = 'rgba(0, 128, 0, 0.7)';
  const warningColor = 'rgba(255, 165, 0, 0.7)';
  const purple = 'rgb(171, 71, 188)';
  const primarycolor = 'rgb(73, 174, 224)';
  const backgroundColors = [dangerColor, successColor, warningColor, purple, primarycolor];

  const ctx = this.chartCanvas3.nativeElement.getContext('2d');

  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  if (Object.values(this.xAxisPieData).some(value => value !== 0)) {
    this.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['InTransit', 'OFD', 'Undelivered', 'Delivered', 'RTO'],
        datasets: [{
          data: [this.xAxisPieData.InTransit, this.xAxisPieData.OutForDelivery, this.xAxisPieData.Undelivered, this.xAxisPieData.Delivered, this.xAxisPieData.RTO],
          backgroundColor: backgroundColors,
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 10
        }],
      },
      options: {
        aspectRatio: 1.5,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 10,
              boxWidth: 25
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.formattedValue || '';
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  } else {
    this.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['No Data'],
        datasets: [{
          data: [1], 
          backgroundColor: ['rgba(200, 200, 200, 0.7)'],
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 0
        }],
      },
      options: {
        aspectRatio: 1.5,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 10,
              boxWidth: 25
            }
          },
          tooltip: {
            enabled: false
          }
        }
      }
    });
  }
}
 // openSnackBar(message: string, panelClass: string) {
  //   this.snackBar.open(message, 'Close', {
  //     duration: 3000,
  //     horizontalPosition: 'right',
  //     verticalPosition: 'top',
  //     panelClass: [panelClass]
  //   });
  // }
  //  this.openSnackBar( response.message, 'custom-snackbar')

  // this.openSnackBar( response.message, 'error-snackbar')

ManifestModal(status: 'Done' | 'Pending') {
  // this.checkDataBeforeOpeningModal('Manifest', status).subscribe((hasData) => {
  //   if (hasData) {
      this.dialog.open(DashboardViewComponent, {
        data: {
          action: 'add',
          status: status,
          modalType: 'Manifest',
          sessionLocationCode: this.sessionLocationCode,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
        width: '90rem',
        maxWidth: '90vw',
        disableClose: true,
      });
  //   } else {
  //     this.openSnackBar( 'Data not found', 'error-snackbar')
  //   }
  // });
}

InscanModal(status: 'Done' | 'Pending') {
  // this.checkDataBeforeOpeningModal('Inscan', status).subscribe((hasData) => {
  //   if (hasData) {
      this.dialog.open(DashboardViewComponent, {
        data: {
          action: 'add',
          status: status,
          modalType: 'Inscan',
          sessionLocationCode: this.sessionLocationCode,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
        width: '90rem',
        maxWidth: '90vw',
        disableClose: true,
      });
  //   } else {
  //     this.openSnackBar( 'Data not found', 'error-snackbar')
  //   }
  // });
}

DrsModal(status: 'Done' | 'Pending') {
  // this.checkDataBeforeOpeningModal('Drs', status).subscribe((hasData) => {
  //   if (hasData) {
      this.dialog.open(DashboardViewComponent, {
        data: {
          action: 'add',
          status: status,
          modalType: 'Drs',
          sessionLocationCode: this.sessionLocationCode,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
        width: '90rem',
        maxWidth: '90vw',
        disableClose: true,
      });
  //   } else {
  //     this.openSnackBar( 'Data not found', 'error-snackbar')
  //   }
  // });
}

StatusModal(status: 'InTransit' | 'UnDelivered' | 'Delivered' | 'RTO' | 'OFD') {
  // this.checkDataBeforeOpeningModal('Status', status).subscribe((hasData) => {
  //   if (hasData) {
      this.dialog.open(DashboardViewComponent, {
        data: {
          action: 'add',
          status: status,
          modalType: 'Status',
          sessionLocationCode: this.sessionLocationCode,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
        width: '90rem',
        maxWidth: '90vw',
        disableClose: true,
      });
  //   } else {
  //     this.openSnackBar( 'Data not found', 'error-snackbar')
  //   }
  // });
}

SalesModal(status: 'Credit' | 'Cash' | 'ToPay' | 'COD') {
  // this.checkDataBeforeOpeningModal('Sales', status).subscribe((hasData) => {
  //   if (hasData) {
      this.dialog.open(DashboardViewComponent, {
        data: {
          action: 'add',
          status: status,
          modalType: 'Sales',
          sessionLocationCode: this.sessionLocationCode,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
        width: '90rem',
        maxWidth: '90vw',
        disableClose: true,
      });
  //   } else {
  //     this.openSnackBar( 'Data not found', 'error-snackbar')
  //   }
  // });
}
checkDataBeforeOpeningModal(modalType: string, status: string): Observable<boolean> {
  const fromDate = this.fromDate;
  const toDate = this.toDate;

  let apiCall: Observable<any>;

  // Call respective API based on modal type
  switch (modalType) {
    case 'Manifest':
      apiCall = this.http.getBranchDashbordManifestDetails(this.sessionLocationCode, status, fromDate, toDate, 1, 1);
      break;
    case 'Inscan':
      apiCall = this.http.getBranchDashbordInscanDetails(this.sessionLocationCode, status, fromDate, toDate, 1, 1);
      break;
    case 'Drs':
      apiCall = this.http.getBranchDashbordRunsheetDetails(this.sessionLocationCode, status, fromDate, toDate, 1, 1);
      break;
    case 'Status':
      apiCall = this.http.getBranchDashbordStatusDetails(this.sessionLocationCode, status, fromDate, toDate, 1, 1);
      break;
    case 'Sales':
      apiCall = this.http.getBranchDashbordSalesDetails(this.sessionLocationCode, status, fromDate, toDate, 1, 1);
      break;
    default:
      return of(false);
  }

  return apiCall.pipe(
    map((response: any) => {
      return response.Data && response.Data.length > 0;
    }),
    catchError(() => of(false))
  );
}

}
