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
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})

export class CountryComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() countryData: any;
    sessionLocationCode: any;
    showTable = false;
    pageSize: number ;
    pageSizeOptions: number[] = [15, 50, 100, 1000];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: any[] = [ 'action', 'Country_Code', 'Country_Name'];
    zoneViewData: any[] = [];
    showFirstLastButtons: any;


    constructor(public dialog: MatDialog,
                private router: Router,
                public httpService: HttpService,
                private http: HttpClient,
                public snackBar: MatSnackBar,
                public masterService: MasterService) {}

    ngOnChanges(): void {
      if (this.countryData.Data && this.countryData.Data.length > 0) {
        this.dataSource = new MatTableDataSource<any>(this.countryData.Data);
        this.dataSource.paginator = this.paginator;
      }
    }

    ngOnInit(): void {
      setTimeout(() => {
        this.dataSource = this.countryData.Data;
        console.log(this.dataSource.data, 'this.dataSource.data');
        this.dataSource.paginator = this.paginator;
      }, 500);
    }

    ngAfterViewInit(): void {}

    openCountryForm(element) {
      const dialogRef = this.dialog.open(ZoneFormComponent, {
        data: {
          action: 'countryAdd',
          countryData: element,
          countryMode: 'edit'
        },
        width: '30rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
      this.getCountryData();
      });
    }

      getCountryData(): void {
        this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Country&operation=getCountry`)
        .subscribe((resp: any) => {
    if (resp.Data) {
      this.dataSource = new MatTableDataSource<any>(resp.Data);
      this.dataSource.paginator = this.paginator;
    }
        });
      }

    deleteCountry(element): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '22rem',
        data: { message: `Are you sure you want to delete this ${element.Country_Name}?` }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.masterService.deleteCountry(element).subscribe(resp => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this.getCountryData();
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
