import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { SharedService } from 'app/service/shared.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-direct-drs-pending',
  templateUrl: './direct-drs-pending.component.html',
  styleUrls: ['./direct-drs-pending.component.css']
})
export class DirectDrsPendingComponent implements OnInit {


  DrsTableData: any[] = [];
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  totalPending: 0;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 1;
  pageSize = 10;
  sessionLocationCode: any;
  displayedColumns: any[] = ['awbNo', 'bookDate', 'manifestNo', 'manifestDate' , 'customerType', 'consigneeName', 'Origin', 'Destination_Name', 'consigneePin', 'modeCode', 'Product_Type', 'Qty', 'ActualWt', 'totalAmt'];
  showTable = false;
  userType: any;
  selectedValue: any;
  AwbNo: string;

  constructor(private sharedService: SharedService,
              private httpService: HttpService,
              private getData: AllServicesService,
              private snackBar: MatSnackBar,
              private renderer: Renderer2, ) { }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.userType = localStorage.getItem('userType');
    this.selectedValue = this.sharedService.getSelectedValue();
    this.dataSource = new MatTableDataSource<any>(this.DrsTableData);
    this.getPendingData(this.currentPage, this.pageSize);
  }
  refresh() {
    this.getPendingData(this.currentPage, this.pageSize);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
  onInput() {
    if (this.AwbNo.trim() === '') {
      this.getPendingData(1, 15);
    }
  }

  findAwbno() {
    this.getData.GetRunsheetAwb(this.sessionLocationCode, this.AwbNo).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.dataSource.data = [{
          awbNo: resp.Data[0].awbNo,
          manifestNo: resp.Data[0].manifestNo,
          bookDate: resp.Data[0].bookDate,
          manifestDate: resp.Data[0].manifestDate,
          customerType : resp.Data[0].customerType,
          customerName: resp.Data[0].customerName,
          consigneeName: resp.Data[0].consigneeName,
          Origin: resp.Data[0].Origin,
          consigneePin: resp.Data[0].consigneePin,
          Destination_Name: resp.Data[0].Destination_Name,
          Qty: resp.Data[0].Qty,
          ActualWt: resp.Data[0].ActualWt,
          Product_Type: resp.Data[0].Product_Type,
          modeCode: resp.Data[0].modeCode,
          totalAmt: resp.Data[0].totalAmt
        }];
        setTimeout(() => {
          this.renderer.selectRootElement('#AwbNo').focus();
        }, 600);
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    }, error => {
      console.error('Error fetching data:', error);
      this.openSnackBar('Please enter Correct Awb No.', 'error-snackbar');
    });
  }

  getPendingData(pageNumber: number, pageSize: number) {
   if (this.userType !== 'Admin') {
    this.getData.getDirectRunsheetPending( this.sessionLocationCode, pageNumber, pageSize).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.showTable = true;
        this.DrsTableData = resp.Data;
        this.dataSource.data = this.DrsTableData;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
        // this.totalPending = resp.count;
      } else {
        this.showTable = false;
        this.DrsTableData = [];
      }
    })
   } else {
    this.httpService.get(`${environment.apiUrl}runsheet/pendingRusheet?sessionLocationCode=${this.selectedValue}&pageNumber=${this.currentPage}&pageSize=${this.pageSize}`).then((resp: any) => {
      console.log(resp);
      if (resp.status === 1) {
        this.showTable = true;
        this.DrsTableData = resp.Data;
        this.dataSource.data = this.DrsTableData;
        // this.totalPending = resp.count;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      }
    })
   }
  }
  loadPage(event: any) {
    const pageNumber = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.getPendingData(pageNumber, pageSize);
  }
  // loadPage(pageNumber: number) {
  //   this.getPendingData(pageNumber, this.pageSize);
  // }

  // onPageSizeChange(event: any) {
  //   this.pageSize = event.value;
  //   this.loadPage(1);
  // }

  // onNextPage() {
  //   this.currentPage++;
  //   this.loadPage(this.currentPage);
  //   console.log('this.currentPage :' , this.currentPage );
  // }

  // onPreviousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.loadPage(this.currentPage);
  //   }
  // }

}
