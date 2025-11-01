import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MasterService } from '../../master.service';
import { HttpService } from 'app/service/http.service';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { TransportWayFormComponent } from 'app/Branch/Shared/master-model/transport-way-form/transport-way-form.component';
import { environment } from 'environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.css']
})
export class AirlineComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() airlineData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action', 'AirLine_Code', 'AirLine_Name'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;
  airlineViewData: Object;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              public http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    if (this.airlineData.Data && this.airlineData.Data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.airlineData.Data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.airlineData.Data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openTransportWayForm(element) {
    const dialogRef = this.dialog.open(TransportWayFormComponent, {
      data: {
        action: 'airlineAdd',
        airlineData: element,
        airlineMode: 'edit'
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getAirLine();
    });
  }
  getAirLine(): void {
      this.http.get(`${environment.apiUrl}Master/allMasters?masterName=AirLine&operation=getAirLine`)
      .subscribe((resp: any) => {
         if (resp.Data) {
      this.dataSource = new MatTableDataSource<any>(resp.Data);
      this.dataSource.paginator = this.paginator;
    }
      });
    }
  deleteAirLine(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.AirLine_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteAirLine(element.AirLine_Code, element.AirLine_Name).subscribe(
          (resp: any) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this.dataSource.data = this.dataSource.data.filter(
              d => d.AirLine_Name !== element.AirLine_Name
            );
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => {
            console.error('Error deleting state:', error);
            this.openSnackBar('Failed to delete state', 'error-snackbar');
          }
        );
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
