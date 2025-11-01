import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MasterService } from '../../master.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() zoneData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action', 'Zone_Code', 'Zone_Name'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              private http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    if (this.zoneData.Data && this.zoneData.Data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.zoneData.Data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.zoneData.Data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openZoneForm(element) {
    const dialogRef = this.dialog.open(ZoneFormComponent, {
        data: {
          action: 'zoneAdd',
          zoneData: element,
          modeData: 'edit'
        },
        width: '30rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        this.getZoneData();
      });
  }
  deleteZone(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.Zone_Code}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteZone(element.Zone_Code, element.Zone_Name).subscribe(
          (resp: any) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this.getZoneData();
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => {
            console.error('Error deleting zone:', error);
            this.openSnackBar('Failed to delete zone', 'error-snackbar');
          }
        );
      }
    });
  }
getZoneData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Zone&operation=getZone`)
      .subscribe((resp: any) => {
    if (resp.Data) {
      this.dataSource = new MatTableDataSource<any>(resp.Data);
      this.dataSource.paginator = this.paginator;
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
//   displayedColumns: any[] = [ 'action', 'Zone_Code', 'Zone_Name'];
//   zoneViewData: any[] = [];
//   showFirstLastButtons: any;

//   constructor(private http: AllServicesService,
//               private httpService: HttpService,
//               public dialog: MatDialog,
//               private snackBar: MatSnackBar,
//               ) {}

//   ngOnInit(): void {
//     this.dataSource = new MatTableDataSource<any>(this.zoneViewData);
//     this.sessionLocationCode = localStorage.getItem('originCode');
//     this.zoneTableData(1, 15);
//   }

//   zoneTableData(pageNumber: number, pageSize: number) {
//      // tslint:disable-next-line:whitespace
//      // tslint:disable-next-line:max-line-length
//      const operation = 'getZone'
//      this.httpService.get(`${environment.apiUrl}Master/allMasters?masterName=Zone&operation=getZone&code=&name=`).then((resp: any) => {
//        if (resp.status === 1) {
//          this.showTable = true;
//          console.log(resp.Data, 'resp.Data');
//          this.zoneViewData = resp.Data;
//          this.dataSource.data = this.zoneViewData;
//          this.dataSource.paginator = this.paginator;
//        }
//      });
//   }

//   openZoneForm(element) {
//     const dialogRef = this.dialog.open(ZoneFormComponent, {
//       data: {
//         action: 'zoneAdd',
//         zoneData: element,
//         modeData: 'edit'
//       },
//       width: '30rem',
//       disableClose: true
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res) {
//         this.zoneTableData(1, 15);
//       }
//     });
//   }

//   deleteZone(element): void {
//     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//       width: '22rem',
//       data: { message: `Are you sure you want to delete this ${element.Zone_Code}?` }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
// tslint:disable-next-line:max-line-length
//         this.httpService.get(`${environment.apiUrl}Master/allMasters?masterName=Zone&operation=deleteZone&code=${element.Zone_Code}&name=${element.Zone_Name}`).then(resp => {
//           if (resp.status === 1) {
//             this.openSnackBar(resp.message , 'custom-snackbar' );
//             this.zoneTableData(1, 15);
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

