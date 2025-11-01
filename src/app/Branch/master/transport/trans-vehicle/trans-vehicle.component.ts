import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransFormComponent } from 'app/Branch/Shared/master-model/trans-form/trans-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MasterService } from '../../master.service';
import { HttpClient } from '@angular/common/http';
import { TransportImagesComponent } from '../transport-images/transport-images.component';

@Component({
  selector: 'app-trans-vehicle',
  templateUrl: './trans-vehicle.component.html',
  styleUrls: ['./trans-vehicle.component.css']
})
export class TransVehicleComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() vehicleData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = ['action', 'Registration_Date','Vehicle_No' ,'Vehicle_Name','vehicletypeName','Transport_Type','Transport_Name','imageIcon'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;
  


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              public snackBar: MatSnackBar,
              private http:HttpClient,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    // if (this.vehicleData.Data && this.vehicleData.Data.length > 0) {
    //   this.dataSource = new MatTableDataSource<any>(this.vehicleData.Data);
    //   this.dataSource.paginator = this.paginator;
    // }
    this.getVehicleData();
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.dataSource = new MatTableDataSource<any>(this.vehicleData.Data);
    //   this.dataSource.paginator = this.paginator;
    // }, 500);
  }

  ngAfterViewInit(): void {}

  getVehicleData(): void {
    //  Master/getAndDeleteVehicle?operationName=getVehicle&VehicleCode
    this.http.get(`${environment.apiUrl}Master/getAndDeleteVehicle?operationName=getVehicle&VehicleCode`)
    .subscribe((response:any) => {
      console.log('Vehical Data:', response);
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  vehicleEntryForm(element) {
    const dialogRef = this.dialog.open(TransFormComponent, {
      data: {
        action: element ? 'VehicleEdit' : 'VehicleAdd',
        vehicleData: element || {},
        vehicleMode: element ? 'edit' : 'add'
      },
      width: '55rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(()=> {
      
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // this.router.onSameUrlNavigation = 'reload';
        // this.router.navigate([this.router.url]);
        this.getVehicleData();
      
    });
  }

  vehicleDeleteForm(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this Vehicle Name ${element.Vehicle_Name}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteVehicle(
          element.Vehicle_Code,
          element.Vehicle_Name
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
            console.error('Error deleting vehicle:', error);
            this.openSnackBar('Failed to delete vehicle', 'error-snackbar');
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

   onImageIconClick(images:string) {
      const dialogRef = this.dialog.open(TransportImagesComponent, {
        data: {
          ImageData: images,
        },
        width: '600px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(() => {
  
      });
  
    }

}
