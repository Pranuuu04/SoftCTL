import { Component, ElementRef, OnInit, ViewChild, DoCheck } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SharedService } from 'app/service/shared.service';
import { DashboardViewComponent } from 'app/Branch/Shared/dashboard_pages/dashboard-view/dashboard-view.component';
import { AllServicesService } from 'app/service/all-services.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminDashService } from './admin-dash.service';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, DoCheck {

  @ViewChild('chartCanvas1') chartCanvas1!: ElementRef;
  @ViewChild('chartCanvas2') chartCanvas2!: ElementRef;
  @ViewChild('chartCanvas3') chartCanvas3!: ElementRef;

  chart: Chart<'pie', number[], string>;
  userType: string;

  Data: number;
  branchCash: number;
  branchCredit: number;
  branchToPay: number;
  branchCOD: number;
  frenchiseeCredit: number;
  frenchiseeCash: number;
  frenchiseeToPay: number;
  frenchiseeCOD: number;
  invoiceAmountTotal: number;
  invoiceAmountOutstanding: number;
  operationPickup: number;
  operationManifest: number;
  operationInscan: number;
  operationDRS: number;
  StatusInTransit: number;
  StatusOFD: number;
  StatusUndeliverd: number;
  StatusDeliverd: number;
  StatusRTO: number;
  awbstockTotal: number;
  awbstockUsed: number;
  awbstockUnused: number;
  tripSheetOpen: number;
  tripSheetClose: number;
  TATWithin: number;
  TATDue: number;
  CRMUnsolved: number;
  CRMSolved: number;

  xAxisLineData: any;
  xAxisPieData: any;
  firstData: any;
  xAxisData: { January: any; February: any; March: any; April: any; May: any; June: any; July: any; August: any; September: any; October: any; November: any; December: any; };
  chartInstance: Chart |undefined;

  fromDate: string;
  toDate: string;
  selectedValue: string;
  dispatch: string;
  inscanData: any;
  DrsData: any;
  ManfData: any;
  SalesData: any;
  Transport: number;

  constructor(public httpService: HttpService,
              public http: AllServicesService,
              public dialog: MatDialog,
              private sharedService: SharedService,
              private snackBar: MatSnackBar,
              public adminDashService: AdminDashService
              ) {
              this.userType = localStorage.getItem('userType');
              this.fromDate = localStorage.getItem('fromDate');
              this.toDate = localStorage.getItem('toDate');
              this.selectedValue = localStorage.getItem('selectedValue');
              this.userType = localStorage.getItem('userType');
              this.dispatch = localStorage.getItem('dispatch');
            }

    ngOnInit(): void {
      this.Transport = Number(localStorage.getItem('Transport'));

      this.sharedService.fromDate$.subscribe(fromDate => {
        this.fromDate = fromDate;
        if (this.Transport !== 1) {
        this.loadbranchCashData();
        this.loadbranchCreditData();
        this.loadbranchToPayData();
        this.loadbranchCODData();

        this.loadOperationPickupData();
        this.loadOperationManifestData();
        this.loadOperationInscantData();
        this.loadOperationDRSData();

        this.loadStatusInTransitData();
        this.loadStatusOFDData();
        this.loadStatusUndeliverdData();
        this.loadStatusDeliverdData();
        this.loadStatusRTOData();

        this.fetchDataPie();
      }
      });

      this.sharedService.toDate$.subscribe(toDate => {
        this.toDate = toDate;
        if (this.Transport !== 1) {

        this.loadbranchCashData();
        this.loadbranchCreditData();
        this.loadbranchToPayData();
        this.loadbranchCODData();

        this.loadOperationPickupData();
        this.loadOperationManifestData();
        this.loadOperationInscantData();
        this.loadOperationDRSData();

        this.loadStatusInTransitData();
        this.loadStatusOFDData();
        this.loadStatusUndeliverdData();
        this.loadStatusDeliverdData();
        this.loadStatusRTOData();

        this.fetchDataPie();
        }
      });

      if (this.Transport !== 1) {
      this.loadfrenchiseeCreditData();
      this.loadfrenchiseeCashData();
      this.loadfrenchiseeToPayData();
      this.loadfrenchiseeCODData();
      this.loadinvoiceAmountTotalData();
      this.loadinvoiceAmountOutstandinglData();

      this.loadawbstockTotalData();
      this.loadawbstockUsedData();
      this.loadawbstockUnusedData();
      this.loadTripSheetOpenData();
      this.loadTripSheetCloseData();
      this.loadtatreportWithinData();
      this.loadtatreportDueData();
      this.loadCRMUnsolvedData();
      this.loadCRMSolvedData();
      this.fetchData();
      this.fetchDataLine();
      this.fetchDataPie();
      }
      this.fromDate = localStorage.getItem('fromDate');
      this.toDate = localStorage.getItem('toDate');
    }
    ngDoCheck(): void {
      const selectedBranchType = this.sharedService.getSelectedValue();

      if (selectedBranchType !== this.selectedValue) {
        this.selectedValue = selectedBranchType;
        if (this.Transport !== 1) {
          this.loadbranchCashData();
        this.loadbranchCreditData();
        this.loadbranchToPayData();
        this.loadbranchCODData();

        this.loadOperationPickupData();
        this.loadOperationManifestData();
        this.loadOperationInscantData();
        this.loadOperationDRSData();

        this.loadStatusInTransitData();
        this.loadStatusOFDData();
        this.loadStatusUndeliverdData();
        this.loadStatusDeliverdData();
        this.loadStatusRTOData();
        }
      }
    }
      openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  async loadbranchCashData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordBranch?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=Cash`);
      this.branchCash = resp.Data.Sales;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadbranchCreditData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordBranch?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=Credit`);
      this.branchCredit = resp.Data.Sales;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadbranchToPayData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordBranch?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=ToPay`);
      this.branchToPay = resp.Data.Sales;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadbranchCODData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordBranch?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=COD`);
      this.branchCOD = resp.Data.Sales;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  onTabChangeBranch(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 1:
        this.loadbranchCreditData();
      break;

      case 2:
        this.loadbranchToPayData();
      break;

      case 3:
        this.loadbranchCODData();
      break;

    }
  }


  async loadOperationManifestData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordOperation?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&cardName=Manifest`);
      this.operationManifest = resp.Data.Operation;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadOperationPickupData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordOperation?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&cardName=Pickup`);
      this.operationPickup = resp.Data.Operation;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadOperationInscantData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordOperation?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&cardName=Inscan`);
      this.operationInscan = resp.Data.Operation;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadOperationDRSData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordOperation?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&cardName=DRS`);
      this.operationDRS = resp.Data.Operation;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  onTabChangeOperation(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 1:
        this.loadOperationManifestData();
      break;

      case 2:
        this.loadOperationInscantData();
      break;

      case 3:
        this.loadOperationDRSData();
      break;

    }
  }

  async loadStatusInTransitData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordStatus?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=InTransit`);
      this.StatusInTransit = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadStatusOFDData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordStatus?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=OFD`);
      this.StatusOFD = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadStatusUndeliverdData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordStatus?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=Undelivered`);
      this.StatusUndeliverd = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadStatusDeliverdData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordStatus?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=Delivered`);
      this.StatusDeliverd = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadStatusRTOData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordStatus?fromDate=${this.fromDate}&toDate=${this.toDate}&branch=${this.selectedValue}&clientType=RTO`);
      this.StatusRTO = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  onTabChangeStatus(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 1:
        this.loadStatusOFDData();
      break;

      case 2:
        this.loadStatusUndeliverdData();
      break;

      case 3:
        this.loadStatusDeliverdData();
      break;

      case 4:
        this.loadStatusRTOData();
      break;
    }
  }


loadfrenchiseeCreditData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordFrenchisee?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&frenchisee=Credit`).then(resp => {
    console.log(resp, 'hello loadfrenchiseeCreditData');
    this.frenchiseeCredit = resp.Data.Frenchisee;
    console.log(this.frenchiseeCredit, 'this.frenchiseeCredit');

  })
}

loadfrenchiseeCashData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordFrenchisee?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&frenchisee=Cash`).then(resp => {
    this.frenchiseeCash = resp.Data.Frenchisee;
  })
}

loadfrenchiseeToPayData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordFrenchisee?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&frenchisee=ToPay`).then(resp => {
    this.frenchiseeToPay = resp.Data.Frenchisee;
  })
}

loadfrenchiseeCODData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordFrenchisee?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&frenchisee=COD`).then(resp => {
    console.log(resp, 'hello loadfrenchiseeCODData');
    this.frenchiseeCOD = resp.Data.Frenchisee;
    console.log(this.frenchiseeCOD, 'this.frenchiseeCOD');

  })
}

loadinvoiceAmountTotalData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordInvoiceAmount?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&invoiceAmount=Total`).then(resp => {
    console.log(resp, 'hello loadinvoiceAmountTotalData');
    this.invoiceAmountTotal = resp.Data.invoiceAmount;
    console.log(this.invoiceAmountTotal, 'this.invoiceAmountTotal');

  })
}

loadinvoiceAmountOutstandinglData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordInvoiceAmount?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&invoiceAmount=Outstanding`).then(resp => {
    console.log(resp, 'hello loadinvoiceAmountOutstandingData');
    this.invoiceAmountOutstanding = resp.Data.invoiceAmount;
    console.log(this.invoiceAmountOutstanding, 'this.invoiceAmountOutstanding');

  })
}





loadawbstockUsedData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordAWBStock?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbstock=Used`).then(resp => {
    console.log(resp, 'hello loadawbstockUsedData');
    this.awbstockUsed = resp.Data.awbStock;
    console.log(this.awbstockUsed, 'this.awbstockUsed');

  })
}

loadawbstockUnusedData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordAWBStock?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbstock=Unused`).then(resp => {
    console.log(resp, 'hello loadawbstockUnusedData');
    this.awbstockUnused = resp.Data.awbStock;
    console.log(this.awbstockUnused, 'this.awbstockUnused');

  })
}

loadawbstockTotalData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordAWBStock?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbstock=Total`).then(resp => {
    console.log(resp, 'hello loadawbstockTotalData');
    this.awbstockTotal = resp.Data.awbStock;
    console.log(this.awbstockTotal, 'this.awbstockTotal');

  })
}

loadTripSheetOpenData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordTrip?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&tripsheet=Open`).then(resp => {
    console.log(resp, 'hello loadTripSheetOpenData');
    this.tripSheetOpen = resp.Data.TripSheet;
    console.log(this.tripSheetOpen, 'this.TripSheetOpen');

  })
}

loadTripSheetCloseData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordTrip?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&tripsheet=Close`).then(resp => {
    console.log(resp, 'hello loadTripSheetCloseData');
    this.tripSheetClose = resp.Data.TripSheet;
    console.log(this.tripSheetClose, 'this.TripSheetClose');

  })
}

loadtatreportWithinData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordTAT?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&tatreport=Within`).then(resp => {
    console.log(resp, 'hello loadtatreportWithinData');
    this.TATWithin = resp.Data.TAT;
    console.log(this.TATWithin, 'this.TATWithin');

  })
}

loadtatreportDueData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordTAT?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&tatreport=Due`).then(resp => {
    console.log(resp, 'hello loadtatreportDueData');
    this.TATDue = resp.Data.TAT;
    console.log(this.TATDue, 'this.TATDue');

  })
}

loadCRMUnsolvedData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordCRM?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&CRM=Unsolved`).then(resp => {
    console.log(resp, 'hello loadCRMUnsolvedData');
    this.CRMUnsolved = resp.Data.CRM;
    console.log(this.CRMUnsolved, 'this.CRMUnsolved');

  })
}

loadCRMSolvedData() {
  this.httpService.get(`${environment.apiUrl}admin/getAdminDashbordCRM?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}&CRM=Solved`).then(resp => {
    console.log(resp, 'hello loadCRMSolvedData');
    this.CRMSolved = resp.Data.CRM;
    console.log(this.CRMSolved, 'this.CRMSolved');

  })
}

fetchData() {
  this.httpService.get(`${environment.apiUrl}admin/getadminDashbordShipmentDetails?SessionLocationCode=${this.selectedValue}`)
    .then(
      (resp: any) => {
        console.log(resp, 'resp of graph 1');

        if (resp.status === 1) {
          this.firstData = resp.Data[0];
          this.xAxisData = {
            'January': this.firstData.January,
            'February': this.firstData.February,
            'March': this.firstData.March,
            'April': this.firstData.April,
            'May': this.firstData.May,
            'June': this.firstData.June,
            'July': this.firstData.July,
            'August': this.firstData.August,
            'September': this.firstData.September,
            'October': this.firstData.October,
            'November': this.firstData.November,
            'December': this.firstData.December,
          };
          console.log(this.xAxisData['January'], 'xAxisData of graph 1');
          this.generateChart();
        } else {
          console.error('Invalid data structure in the response.');
          console.log('Response:', resp);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
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
  console.log(Object.values(this.xAxisData), 'generateChart-data');
}

fetchDataLine() {
  this.httpService.get(`${environment.apiUrl}admin/getadminDashbordSalesGraph?SessionLocationCode=${this.selectedValue}`).then(
    (resp: any) => {
      console.log(resp, 'resp of graph 2');

      if (resp.status === 1) {
        this.firstData = resp.Data[0];
        this.xAxisLineData = {
          'January': this.firstData.January,
          'February': this.firstData.February,
          'March': this.firstData.March,
          'April': this.firstData.April,
          'May': this.firstData.May,
          'June': this.firstData.June,
          'July': this.firstData.July,
          'August': this.firstData.August,
          'September': this.firstData.September,
          'October': this.firstData.October,
          'November': this.firstData.November,
          'December': this.firstData.December,
        };
        console.log(this.xAxisLineData['January'], 'xAxisLineData of graph 1');
        this.generateLineChart();
      } else {
        console.error('Invalid data structure in the response.');
        console.log('Response:', resp);
      }
    },
    (error) => {
      console.error('Error fetching data:', error);
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
            text: 'Amount', // Set the Y-axis label text here
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
  console.log(Object.values(this.xAxisLineData), 'generateLineChart-data');
}

fetchDataPie() {
  this.httpService.get(`${environment.apiUrl}admin/getadminDashbordShipmentStatus?SessionLocationCode=${this.selectedValue}&fromDate=${this.fromDate}&toDate=${this.toDate}`).then(
    (resp: any) => {
      if (resp.status === 1) {
        this.firstData = resp.Data[0];
        this.xAxisPieData = {
          'Delivered': this.firstData.Delivered,
          'InTransit': this.firstData.InTransit,
          'OutForDelivery': this.firstData.OutForDelivery,
          'RTO': this.firstData.RTO,
          'UnDelivered': this.firstData.UnDelivered,
        };
        this.generatePieChart();
      } else {
        console.error('Invalid data structure in the response.');
      }
    },
    (error) => {
      console.error('Error fetching data:', error);
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

  // Destroy existing chart instance if it exists
  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  // Check if there is any non-zero data point
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
    // If no data is found, create an empty chart with a default label
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
            enabled: false // Disable tooltip for the empty chart
          }
        }
      }
    });
  }
}

InscanModal(status: 'Done' | 'Pending') {
  // this.http.getBranchDashbordInscanDetails(this.selectedValue, status, this.fromDate, this.toDate, pageNumber, pageSize).subscribe((resp: any) => {
  //     if (resp.status === 1) {
  //       this.inscanData = resp.Data;
        // const dialogRef = 
        this.dialog.open(DashboardViewComponent, {
          data: {
            action: 'add',
            // RespTableData: this.inscanData,
            status: status,
            modalType: 'Inscan',
            sessionLocationCode: this.selectedValue,
            fromDate: this.fromDate,
            toDate: this.toDate,
          },
          width: '90rem',
          maxWidth: '90vw',
          disableClose: true,
        });

    //     dialogRef.afterClosed().subscribe(res => {
    //       if (res) {
    //       }
    //     });
    //   } else {
    //     this.openSnackBar(resp.message , 'error-snackbar')
    //   }
    // }, error => {
    //   console.error('Error fetching data:', error);
    // })
}

ManifestModal(status: 'Done' | 'Pending' ) {
  // this.http.getBranchDashbordManifestDetails(this.selectedValue, status, this.fromDate, this.toDate, pageNumber, pageSize).subscribe((resp: any) => {
  //   if (resp.status === 1) {
  //     this.ManfData = resp.Data;
  //     const dialogRef = 
      this.dialog.open(DashboardViewComponent, {
        data: {
          action: 'add',
          // RespTableData: this.ManfData,
          status: status,
          modalType: 'Manifest',
          sessionLocationCode: this.selectedValue,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
        width: '90rem',
        maxWidth: '90vw',
        disableClose: true,
      });

  //     dialogRef.afterClosed().subscribe(res => {
  //       if (res) {
  //       }
  //     });

  //   } else {
  //     this.openSnackBar(resp.message , 'error-snackbar')
  //   }
  // }, error => {
  //   console.error('Error fetching data:', error);
  // });


}

DrsModal(status: 'Done' | 'Pending') {
  // this.http.getBranchDashbordRunsheetDetails(this.selectedValue, status, this.fromDate, this.toDate, pageNumber, pageSize).subscribe((resp: any) => {
  //     if (resp.status === 1) {
  //       this.DrsData = resp.Data;
  //       const dialogRef = 
        this.dialog.open(DashboardViewComponent, {
          data: {
            action: 'add',
            // RespTableData: this.DrsData,
            status: status,
            modalType: 'Drs',
            sessionLocationCode: this.selectedValue,
            fromDate: this.fromDate,
            toDate: this.toDate,
          },
          width: '90rem',
          maxWidth: '90vw',
          disableClose: true,
        });

    //     dialogRef.afterClosed().subscribe(res => {
    //       if (res) {
    //       }
    //     });
    //   } else {
    //     this.openSnackBar(resp.message , 'error-snackbar')
    //   }
    // }, error => {
    //   console.error('Error fetching data:', error);
    // });
}

StatusModal(status:  'InTransit' | 'UnDelivered'| 'Delivered' | 'RTO'| 'OFD' ) {
  // this.http.getBranchDashbordStatusDetails(this.selectedValue, status, this.fromDate, this.toDate, pageNumber, pageSize).subscribe((resp: any) => {
  //   if (resp.status === 1) {
  //     this.SalesData = resp.Data;
  //     const dialogRef = 
      this.dialog.open(DashboardViewComponent, {
        data: {
          action: 'add',
          // RespTableData : this.SalesData,
          status: status,
          modalType: 'Status',
          sessionLocationCode: this.selectedValue,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
        width: '90rem',
        maxWidth: '90vw',
        disableClose: true,
      });

  //     dialogRef.afterClosed().subscribe(res => {
  //       if (res) {
  //       }
  //     });
  //   } else {
  //     this.openSnackBar(resp.message , 'error-snackbar')
  //   }
  // }, error => {
  //   console.error('Error fetching data:', error);
  // });
}

BranchModal(status: 'Credit' | 'Cash'| 'ToPay' | 'COD') {
  // this.http.getBranchDashbordSalesDetails(this.selectedValue, status, this.fromDate, this.toDate, pageNumber, pageSize).subscribe((resp: any) => {
  //   if (resp.status === 1) {
  //     this.SalesData = resp.Data;
  //     const dialogRef = 
      this.dialog.open(DashboardViewComponent, {
        data: {
          action: 'add',
          // RespTableData : this.SalesData,
          status: status,
          modalType: 'Sales',
          sessionLocationCode: this.selectedValue,
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
        width: '90rem',
        maxWidth: '90vw',
        disableClose: true,
      });

  //     dialogRef.afterClosed().subscribe(res => {
  //       if (res) {
  //       }
  //     });
  //   } else {
  //     this.openSnackBar(resp.message , 'error-snackbar')
  //   }
  // }, error => {
  //   console.error('Error fetching data:', error);
  // });
}
checkDataBeforeOpeningModal(modalType: string, status: string): Observable<any> {
  const fromDate = this.fromDate;
  const toDate = this.toDate;

  let apiCall: Observable<any>;

  switch (modalType) {
    case 'Inscan':
      apiCall = this.http.getBranchDashbordInscanDetails(this.selectedValue, status, fromDate, toDate, 1, 1);
      break;
    case 'Manifest':
      apiCall = this.http.getBranchDashbordManifestDetails(this.selectedValue, status, fromDate, toDate, 1, 1);
      break;
    case 'Drs':
      apiCall = this.http.getBranchDashbordRunsheetDetails(this.selectedValue, status, fromDate, toDate, 1, 1);
      break;
    case 'Status':
      apiCall = this.http.getBranchDashbordStatusDetails(this.selectedValue, status, fromDate, toDate, 1, 1);
      break;
    case 'Sales':
      apiCall = this.http.getBranchDashbordSalesDetails(this.selectedValue, status, fromDate, toDate, 1, 1);
      break;
    default:
      return of({ valid: false });
  }

  return apiCall.pipe(
    map((response: any) => {
      return response.Data && response.Data.length > 0; // Returns true if data exists, otherwise false
    }),
    // map((resp: any) => ({
    //   valid: resp.status === 1 && resp.Data.length > 0,
    //   data: resp.Data
    // })),
    catchError(() => of({ valid: false }))
  );
}

}
