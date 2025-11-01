import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MasterService } from '../../master.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-area-dest',
  templateUrl: './area-dest.component.html',
  styleUrls: ['./area-dest.component.css']
})
export class AreaDestComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() destinationData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action', 'Destination_Code', 'Destination_Name', 'Zone_Name', 'State_Name', 'Country_Name'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              private http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    if (this.destinationData.Data && this.destinationData.Data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.destinationData.Data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.destinationData.Data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openDestinationForm(element) {
    const dialogRef = this.dialog.open(ZoneFormComponent, {
      data: {
        action: 'destAdd',
        destinationData: element,
        destinationMode: 'edit'
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
    this.getDestinationData();
    });
  }

  getDestinationData(): void {
    this.http.get(`${environment.apiUrl}Master/destinationMast?masterName=Destination&operation=getDataNameWithCode`)
    .subscribe((resp: any) => {
        if (resp.Data) {
          this.dataSource = new MatTableDataSource<any>(resp.Data);
          this.dataSource.paginator = this.paginator;
        }
    });
  }
  deleteDestination(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.Destination_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteDestination(element).subscribe(resp => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this.getDestinationData();
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        });
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

//   sessionLocationCode: any;
//   showTable = false;
//   pageSize: number ;
//   pageSizeOptions: number[] = [15, 50, 100, 1000];
//   dataSource: MatTableDataSource<any>;
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   displayedColumns: any[] = [ 'action', 'Destination_Code', 'Destination_Name', 'Zone_Name', 'State_Name', 'Country_Name'];
//   destinationViewData: any[] = [];
//   showFirstLastButtons: any;

//   constructor(private http: AllServicesService,
//               private httpService: HttpService,
//               public dialog: MatDialog,
//               private snackBar: MatSnackBar,
//               ) {}

//   ngOnInit(): void {
//     this.dataSource = new MatTableDataSource<any>(this.destinationViewData);
//     this.sessionLocationCode = localStorage.getItem('originCode');
//     this.destinationTableData(1, 15);
//   }

//   destinationTableData(pageNumber: number, pageSize: number) {
//      // tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
//      this.httpService.get(`${environment.apiUrl}Master/destinationMast?masterName=Destination&operation=getDataNameWithCode`).then((resp: any) => {
//        if (resp.status === 1) {
//          this.showTable = true;
//          console.log(resp.Data, 'resp.Data');
//          this.destinationViewData = resp.Data;
//          this.dataSource.data = this.destinationViewData;
//          this.dataSource.paginator = this.paginator;
//        }
//      });
//   }

//   openDestinationForm(element) {
//     const dialogRef = this.dialog.open(ZoneFormComponent, {
//       data: {
//         action: 'destAdd',
//         destinationData: element,
//         destinationMode: 'edit'
//       },
//       width: '30rem',
//       disableClose: true
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res) {
//         this.destinationTableData(1, 15);
//       }
//     });
//   }

//   deleteDestination(element): void {
//     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//       width: '22rem',
//       data: { message: `Are you sure you want to delete this ${element.Destination_Name}?` }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
// tslint:disable-next-line:max-line-length
//         this.httpService.get(`${environment.apiUrl}Master/destinationMast?masterName=Destination&operation=deleteDestination&code=${element.Destination_Code}&name=${element.Destination_Name}&zoneCode=${element.Zone_Code}&stateCode=${element.State_Code}&countryCode=${element.Country_Code}&destinationManifest=&destinationDHours=&destinationPHours=&productType=`).then(resp => {
//           if (resp.status === 1) {
//             this.openSnackBar(resp.message , 'custom-snackbar' );
//             this.destinationTableData(1, 15);
//           } else {
//             this.openSnackBar(resp.message , 'error-snackbar');
//           }
//         })
//       }
//     });
//   }

//   openSnackBar(message: string, panelClass) {
//     this.snackBar.open(message, 'Close', {
//       duration: 3000,
//       horizontalPosition: 'right',
//       verticalPosition: 'top',
//       panelClass: [panelClass]
//     });
//   }

//   applyFilter(filterValue: string) {
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

// }
