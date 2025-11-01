import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { MasterService } from '../../master.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-prefix-master',
  templateUrl: './prefix-master.component.html',
  styleUrls: ['./prefix-master.component.css']
})
export class PrefixMasterComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() prefixData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action', 'Prefix_code', 'Prefix_name'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              public httpService: HttpService,
              private http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    if (this.prefixData.Data && this.prefixData.Data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.prefixData.Data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.prefixData.Data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openPrefixForm(element) {
    const dialogRef = this.dialog.open(ZoneFormComponent, {
      data: {
        action: 'prefixAdd',
        prefixData: element,
        prefixMode: 'edit'
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
     this.getPrefixData();
    });
  }

  getPrefixData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Prefix&operation=getPrefix`)
    .subscribe((resp: any) => {
    if (resp.Data) {
      this.dataSource = new MatTableDataSource<any>(resp.Data);
      this.dataSource.paginator = this.paginator;
    }
    });
  }
  deletePrefix(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.Prefix_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deletePrefix(element.Prefix_code).subscribe(
          (resp: any) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this.getPrefixData();
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => {
            console.error('Error deleting prefix:', error);
            this.openSnackBar('Failed to delete prefix', 'error-snackbar');
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
