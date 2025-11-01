import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransFormComponent } from 'app/Branch/Shared/master-model/trans-form/trans-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MasterService } from '../../master.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trans-type',
  templateUrl: './trans-type.component.html',
  styleUrls: ['./trans-type.component.css']
})
export class TransTypeComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() transportData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action','Transport_CName' ,'Transport_Type' ,'Transport_Mob'];//'sno',
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              public snackBar: MatSnackBar,
              private http: HttpClient,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    // if (this.transportData.Data && this.transportData.Data.length > 0) {
    //   this.dataSource = new MatTableDataSource<any>(this.transportData.Data);
    //   this.dataSource.paginator = this.paginator;
    // }
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.dataSource = new MatTableDataSource<any>(this.transportData.Data);
    //   this.dataSource.paginator = this.paginator;
    // }, 500);
    this.getTransportData();
  }

  ngAfterViewInit(): void {}

  getTransportData(): void {
    this.http.get(`${environment.apiUrl}Master/transportMast?masterName=Transport&operation=getTransport&transportCode=&transportName=&transportCName=&transportAdd1=&transportAdd2=&transportAdd3=&transportTel=&transportMob=&transportEmail=&connectingHub=`)
    .subscribe((response:any) => {
      console.log('Zone Data:', response);
      this.dataSource = new MatTableDataSource<any>(response.Data);
      this.dataSource.paginator = this.paginator;
      // this.transportViewData = response;
    });
  }

  transPortEntryForm(element) {
    const dialogRef = this.dialog.open(TransFormComponent, {
      data: {
        action: element ? 'TransTypeEdit' : 'TransTypeAdd',
        transportData: element || {},
        transportMode: element ? 'edit' : 'add'
      },
      width: '45rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // this.router.onSameUrlNavigation = 'reload';
        // this.router.navigate([this.router.url]);
        this.getTransportData();
    });
  }

  transportDeleteForm(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this Transport Name ${element.Transport_Name}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteTransport(
          element.Transport_Code,
          element.Transport_Name
        ).subscribe(
          (resp: any) => {
            // if (resp.status === 1) {
            //   this.openSnackBar(resp.message, 'custom-snackbar');
            //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            //   this.router.onSameUrlNavigation = 'reload';
            //   this.router.navigate([this.router.url]);
            // } else {
            //   this.openSnackBar(resp.message, 'error-snackbar');
            // }
       
            const index = this.dataSource.data.indexOf(element);
            if (index > -1) {
              const updatedData = [...this.dataSource.data];
              updatedData.splice(index, 1);
              this.dataSource.data = updatedData;
              if (updatedData.length === 0) {
                this.dataSource = new MatTableDataSource([]);
              }
              if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
              }
            }

            else {
                this.openSnackBar(resp.message, 'error-snackbar');
              }
          },
          (error) => {
            console.error('Error deleting transport:', error);
            this.openSnackBar('Failed to delete transport', 'error-snackbar');
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
