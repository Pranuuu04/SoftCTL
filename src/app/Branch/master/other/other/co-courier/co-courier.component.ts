import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from 'app/Branch/master/master.service';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-co-courier',
  templateUrl: './co-courier.component.html',
  styleUrls: ['./co-courier.component.css']
})
export class CoCourierComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() CourierMastData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'index', 'action', 'Vendor_Code', 'Vendor_Name'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              public httpService: HttpService,
              public http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    if (this.CourierMastData.data && this.CourierMastData.data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.CourierMastData.data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.CourierMastData.data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openCourierMastForm(element) {
    const dialogRef = this.dialog.open(ZoneFormComponent, {
      data: {
        action: 'CoCourierMastAdd',
        CocourierData: element,
        CocourierMode: 'edit'
      },
      width: '60rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
        this.loadCourierMastData();
    });
  }
loadCourierMastData() {
  this.http.get(`${environment.apiUrl}Master/getAndDeleteVendor?operationName=getVendor`).subscribe((resp: any) => {
    if (resp.data) {
      this.dataSource = new MatTableDataSource<any>(resp.data);
      this.dataSource.paginator = this.paginator;
    }
  });
}

  deleteCourierMast(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.Vendor_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.DeleteCoCourier(element.Vendor_Code).subscribe(
          (resp: any) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
                this.loadCourierMastData();
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => {
            console.error('Error deleting employee:', error);
            this.openSnackBar('Failed to delete employee', 'error-snackbar');
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
