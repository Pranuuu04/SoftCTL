import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'app/service/http.service';
import { MasterService } from '../../master.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { TransFormComponent } from 'app/Branch/Shared/master-model/trans-form/trans-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() VtypeData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action',  'Vehicle_Code', 'Vehicle_Name','Company_Name'];//'sno',
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              public snackBar: MatSnackBar,
              private http:HttpClient,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    // if (this.VtypeData.Data && this.VtypeData.Data.length > 0) {
    //   this.dataSource = new MatTableDataSource<any>(this.VtypeData.Data);
    //   this.dataSource.paginator = this.paginator;
    // }
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.dataSource = new MatTableDataSource<any>(this.VtypeData.Data);
    //   this.dataSource.paginator = this.paginator;
    // }, 500);
    this.getVtypeData();
  }

  ngAfterViewInit(): void {}

  getVtypeData(): void {
    this.http.get(`${environment.apiUrl}Master/VehicleType?masterName=VehicleType&operation=getVehicleType&vehicleName=&companyName=&vehicleCode=`)
    .subscribe((response:any) => {
      console.log('Zone Data:', response);
      this.dataSource = new MatTableDataSource<any>(response.Data);
      this.dataSource.paginator = this.paginator;
    });
  }

  openVehicleForm(element) {
    const dialogRef = this.dialog.open(TransFormComponent, {
      data: {
        action: element ? 'vtypeEdit' : 'vtypeAdd',
        vtypeData: element || {},
        vtypeMode:element ? 'edit' : 'add'
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {   
      //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      //   this.router.onSameUrlNavigation = 'reload';
      //   this.router.navigate([this.router.url]);
       this.getVtypeData();
      });
  }

  deleteVehicle(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.Route_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteVehicleType(element.Vehicle_Code).subscribe(
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
