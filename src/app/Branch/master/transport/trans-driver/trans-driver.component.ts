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
import { TransportImagesComponent } from '../transport-images/transport-images.component';

@Component({
  selector: 'app-trans-driver',
  templateUrl: './trans-driver.component.html',
  styleUrls: ['./trans-driver.component.css']
})
export class TransDriverComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() driverData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // displayedColumns: any[] = [ 'action','Driver_Name', 'License_no', 'Driver_Mob','Driver_EmgNo','Vehicle_No','imageIcon'];
  displayedColumns: any[] = [ 'action','Driver_Name', 'License_no', 'Driver_Mob','Driver_EmgNo','Vehicle_No','User_Type','imageIcon'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    // if (this.driverData.Data && this.driverData.Data.length > 0) {
    //   this.dataSource = new MatTableDataSource<any>(this.driverData.data);
    //   this.dataSource.paginator = this.paginator;
    // }
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.dataSource = new MatTableDataSource<any>(this.driverData.data);
    //   this.dataSource.paginator = this.paginator;
    // }, 500);
    this.getDriverData();
  }

  ngAfterViewInit(): void {}

  driverEntryForm(element) {
    const dialogRef = this.dialog.open(TransFormComponent, {
      data: {
        action: element ? 'DriverEdit' : 'DriverAdd',
        driverData: element || {},
        driverMode: element ? 'edit' : 'add'
      },
      width: '65rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {

        this.getDriverData();
    });
  }

  getDriverData(){
         this.masterService.getDriver().subscribe(
          (resp: any) => {
            if (resp.status === 1) {
             this.dataSource = new MatTableDataSource<any>(resp.data);
             this.dataSource.paginator = this.paginator;
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => {
            console.error('Error deleting driver:', error);
            this.openSnackBar('Failed to delete driver', 'error-snackbar');
          }
        );
  }

  deleteDriverForm(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this Driver Name ${element.Driver_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteDriver(
          element.Driver_Code,
          element.Driver_Name
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
            console.error('Error deleting driver:', error);
            this.openSnackBar('Failed to delete driver', 'error-snackbar');
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




