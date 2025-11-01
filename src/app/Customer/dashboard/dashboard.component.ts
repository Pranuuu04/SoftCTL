import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DashCustViewComponent } from '../Cust-Shared/Dashboard-modal/dash-cust-view/dash-cust-view.component';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {

  @ViewChild('chartCanvas1') chartCanvas1!: ElementRef;
  @ViewChild('chartCanvas2') chartCanvas2!: ElementRef;
  @ViewChild('chartCanvas3') chartCanvas3!: ElementRef;

  firstData: any;
  xAxisData: any;
  yAxisData: any;
  xAxisLineData: any;
  xAxisPieData: any;
  
  chart: Chart<"pie", number[], string>;
  userType: string;
  fromDate: string;
  toDate: string;
  sessionLocationCode: any;

  statusInTransit: any;
  statusOFD: any;
  statusUnDelv: any;
  statusDelv: any;
  statusRTO: any;
  CrmOpen: any;
  CrmClose: any;
  CrmTotal: any;
  salesCredit: any;
  salesCash: any;
  salesTopay: any;
  salesCOD: any;
  AWBUsed: any;
  AWBUnused: any;
  AWBTotal: any;

  // modal 
  StatusModalData: any;
  SalesModalData : any;
  customerCode: string;

  constructor(
              public httpService: HttpService,
              public dialog: MatDialog,
              private sharedService: SharedService,
             ) { 
              this.userType = localStorage.getItem('userType');
              this.sessionLocationCode = localStorage.getItem('originCode');
              this.fromDate = localStorage.getItem('fromDate');
              this.toDate = localStorage.getItem('toDate');
              }
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.customerCode = localStorage.getItem('customerCode');
  
    this.sharedService.fromDate$.subscribe(fromDate => {
      this.fromDate = fromDate;
      this.updateData();
    });
  
    this.sharedService.toDate$.subscribe(toDate => {
      this.toDate = toDate;
      this.updateData();
    });
  
    this.chartCanvas1Data();
    this.chartCanvas2Data();
    this.updateData();
  }
  
  updateData() {
    this.StatusInTransitData();
    this.statusOFDData();
    this.statusUnDelvData();
    this.statusDelvData();
    this.statusRTOData();
    this.CrmOpenData();
    this.CrmCloseData();
    this.CrmTotalData();
    this.SalesCreditData();
    this.salesCashData();
    this.salesTopayData();
    this.salesCODData();
    this.AWBUsedData();
    this.awbUnusedData();
    this.awbAWBTotalData();
    this.fetchDataPie();
  }
  async StatusInTransitData(){
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordStatus?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&status=InTransit`);
      this.statusInTransit = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async statusOFDData(){
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordStatus?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&status=ODF`);
      this.statusOFD = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async statusUnDelvData(){
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordStatus?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&status=UnDelivered`);
      this.statusUnDelv = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }  
  async statusDelvData(){
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordStatus?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&status=Delivered`);
      this.statusDelv = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async statusRTOData(){
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordStatus?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&status=RTO`);
      this.statusRTO = resp.Data.Status;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
// Crm 
  
async CrmOpenData(){
  try {
    const resp = await this.httpService.get(``);
    this.CrmOpen = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async CrmCloseData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}branch/getBranchDashbordAWBStock?SessionLocationCode=${this.sessionLocationCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbStock=Unused`);
    this.CrmClose = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async CrmTotalData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}branch/getBranchDashbordAWBStock?SessionLocationCode=${this.sessionLocationCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbStock=AWBTotal`);
    this.CrmTotal = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
  // Sales

async SalesCreditData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordSales?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&sales=Credit`);
    this.salesCredit = resp.Data.Sales;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async salesCashData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordSales?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&sales=Cash`);
    this.salesCash = resp.Data.Sales;
} catch (error) {
    console.error('Error fetching done data:', error);
}
}

async salesTopayData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordSales?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&sales=ToPay`);
    this.salesTopay = resp.Data.Sales;
} catch (error) {
    console.error('Error fetching done data:', error);
}
}

async salesCODData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordSales?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&sales=COD`);
    this.salesCOD = resp.Data.Sales;
} catch (error) {
    console.error('Error fetching done data:', error);
}
}

// Awb Stock 
async AWBUsedData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordAWBStock?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbStock=Used`);
    this.AWBUsed = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async awbUnusedData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordAWBStock?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbStock=Unused`);
    this.AWBUnused = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async awbAWBTotalData(){
  try {
    const resp = await this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordAWBStock?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&awbStock=AWBTotal`);
    this.AWBTotal = resp.Data.awbStock;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// graph Shipment details 

chartCanvas1Data() {
  this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordShipmentDetails?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}`)
    .then(
      (resp: any) => {
        if (resp.status === 1) {
          this.firstData = resp.Data[0];
          this.xAxisData = {
            "January": this.firstData.January,
            "February": this.firstData.February,
            "March": this.firstData.March,
            "April": this.firstData.April,
            "May": this.firstData.May,
            "June": this.firstData.June,
            "July": this.firstData.July,
            "August": this.firstData.August,
            "September": this.firstData.September,
            "October": this.firstData.October,
            "November": this.firstData.November,
            "December": this.firstData.December,
          };
          this.generateChart();
        } else {
          console.error("Invalid data structure in the response.");
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
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

chartCanvas2Data(){
  this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordSalesGraph?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}`).then(
    (resp: any) => {
      if (resp.status === 1) {
        this.firstData = resp.Data[0];
        this.xAxisLineData = {
          "January": this.firstData.January,
          "February": this.firstData.February,
          "March": this.firstData.March,
          "April": this.firstData.April,
          "May": this.firstData.May,
          "June": this.firstData.June,
          "July": this.firstData.July,
          "August": this.firstData.August,
          "September": this.firstData.September,
          "October": this.firstData.October,
          "November": this.firstData.November,
          "December": this.firstData.December,
        };
        this.generateLineChart();
      } else {
        console.error("Invalid data structure in the response.");
      }
    },
    (error) => {
      console.error("Error fetching data:", error);
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
  console.log(Object.values(this.xAxisLineData), 'generateLineChart-data');
}

fetchDataPie(){
  this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordShipmentStatus?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}`).then(
    (resp: any) => {
      if (resp.status === 1) {
        this.firstData = resp.Data[0];
        this.xAxisPieData = {
          "Delivered": this.firstData.Delivered,
          "InTransit": this.firstData.InTransit,
          "OutForDelivery": this.firstData.OutForDelivery,
          "RTO": this.firstData.RTO,
          "UnDelivered": this.firstData.UnDelivered,
        };
        this.generatePieChart();
      } else {
        console.error("Invalid data structure in the response.");
      }
    },
    (error) => {
      console.error("Error fetching data:", error);
    }
  );
}

generatePieChart(){
const dangerColor = 'rgba(255, 0, 0, 0.7)';
const successColor = 'rgba(0, 128, 0, 0.7)';
const warningColor = 'rgba(255, 165, 0, 0.7)';
const purple = 'rgb(171, 71, 188)';
const primarycolor = 'rgb(73, 174, 224)';
const backgroundColors = [primarycolor, successColor, warningColor, purple, dangerColor];

const ctx = this.chartCanvas3.nativeElement.getContext('2d');
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Delivered', 'InTransit', 'OFD', 'RTO', 'Undelivered'],
    datasets: [{
      data:  Object.values(this.xAxisPieData),
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
}

// Modal function 

  StatusModal(status :  'InTransit' | 'UnDelivered'| 'Delivered' | 'RTO'| 'OFD' ) {
    // this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordStatusDetails?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&status=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
    // .then(resp => {
    //   if (resp.status === 1) {
    //     this.StatusModalData = resp.Data;
        const dialogRef = this.dialog.open(DashCustViewComponent, {
          data: {
            action: 'add',
            status: status,
            modalType: 'Status',
            sessionLocationCode: this.sessionLocationCode,
            customerCode: this.customerCode,
            fromDate: this.fromDate,
            toDate: this.toDate,
          },
          width: '90rem',
          maxWidth: '90vw',
          disableClose: true,
        });
  
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
          }
        });
    //   }else{
    //     alert(resp.message)
    //   }
    // })
    // .catch(error => {
    //   console.error('Error fetching data:', error);
    // });
  }
  
  
  
  SalesModal(status: 'Credit' | 'Cash'| 'ToPay' | 'COD') {
    // this.httpService.get(`${environment.apiUrl}customer/getCustomerDashbordSalesDetails?sessionLocationCode=${this.sessionLocationCode}&customerCode=${this.customerCode}&fromDate=${this.fromDate}&toDate=${this.toDate}&sales=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
    // .then(resp => {
    //   if (resp.status === 1) {
    //     this.SalesModalData = resp.Data;
        const dialogRef = this.dialog.open(DashCustViewComponent, {
          data: {
            action: 'add',
            status: status,
            modalType: 'Sales',
            sessionLocationCode: this.sessionLocationCode,
            customerCode: this.customerCode,
            fromDate: this.fromDate,
            toDate: this.toDate,
          },
          width: '90rem',
          maxWidth: '90vw',
          disableClose: true,
        });
  
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
          }
        });
    //   }else{
    //     alert(resp.message)
    //   }
    // })
    // .catch(error => {
    //   console.error('Error fetching data:', error);
    // });    
  }
}
