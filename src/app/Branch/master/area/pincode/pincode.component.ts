import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.css']
})
export class PincodeComponent implements OnInit {

  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action', 'Pincode', 'Area_Name'];
  destinationViewData: any[] = [];
  showFirstLastButtons: any;
  finderType = 'PinCode';
  inputFieldsData: any;

  finderTypeList = [
    { value: 'PinCode', name: 'PinCode' },
    { value: 'CityName', name: 'CityName' },
    { value: 'AreaName', name: 'AreaName' },
  ];


  constructor(private http: AllServicesService,
              private httpService: HttpService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              public masterService: MasterService
              ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.destinationViewData);
    this.sessionLocationCode = localStorage.getItem('originCode');
    // this.pinCodeTableData(1, 15);
  }

  pinCodeTableData(): void {
    if (!this.finderType || !this.inputFieldsData) {
      this.openSnackBar('Please provide valid input', 'error-snackbar');
      return;
    }
  
    this.masterService.getPincodeData(this.finderType, this.inputFieldsData).subscribe(
      (resp: any) => {
        this.showTable = true;
  
        if (resp.status === 1) {
          console.log(resp.Data, 'resp.pincode');
          this.openSnackBar(resp.message, 'custom-snackbar');
          this.destinationViewData = resp.Data;
          this.dataSource.data = this.destinationViewData;
          this.dataSource.paginator = this.paginator;
          this.inputFieldsData = ''; // Clear input
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      },
      (error) => {
        this.showTable = false;
        console.error('Error fetching pincode data', error);
        this.openSnackBar('Failed to fetch pincode data', 'error-snackbar');
      }
    );
  }
  

  openDestinationForm(element) {
    const dialogRef = this.dialog.open(ZoneFormComponent, {
      data: {
        action: 'pincodeAdd',
        pinCodeData: element,
        pinCodeMode: 'edit'
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.pinCodeTableData(1, 15);
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
        this.httpService.get(`${environment.apiUrl}Master/destinationMast?masterName=Destination&operation=deleteDestination&code=${element.Destination_Code}&name=${element.Destination_Name}&zoneCode=${element.Zone_Code}&stateCode=${element.State_Code}&countryCode=${element.Country_Code}&destinationManifest=&destinationDHours=&destinationPHours=&productType=`).then(resp => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message , 'custom-snackbar' );
            // this.pinCodeTableData(1, 15);
          } else {
            this.openSnackBar(resp.message , 'error-snackbar');
          }
        })
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
