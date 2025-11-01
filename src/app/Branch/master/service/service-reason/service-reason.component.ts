import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServiceFormComponent } from 'app/Branch/Shared/master-model/service-form/service-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MasterService } from '../../master.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-service-reason',
  templateUrl: './service-reason.component.html',
  styleUrls: ['./service-reason.component.css']
})
export class ServiceReasonComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() reasonData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action', 'ReasonCode', 'ReasonName'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              private http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    console.log(this.reasonData, 'reasonData');
    if (this.reasonData.Data && this.reasonData.Data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.reasonData.Data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.reasonData.Data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openReasonForm(element) {
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      data: {
        action: 'reasonAdd',
        reasonData: element,
        reasonModeType: 'edit',
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getReasonData();
    });
  }
getReasonData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Reason&operation=getReason`).subscribe((response: any) => {
      if (response.Data) {
      this.dataSource = new MatTableDataSource<any>(response.Data);
      this.dataSource.paginator = this.paginator;
    }
    });
  }
  deleteReason(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.ReasonName}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteReason(element.ReasonCode, element.ReasonName)
          .subscribe(
            (resp: any) => {
              if (resp.status === 1) {
                this.openSnackBar(resp.message, 'custom-snackbar');
                this.getReasonData();
              } else {
                this.openSnackBar(resp.message, 'error-snackbar');
              }
            },
            (error) => {
              console.error('Error deleting reason:', error);
              this.openSnackBar('Failed to delete reason', 'error-snackbar');
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
