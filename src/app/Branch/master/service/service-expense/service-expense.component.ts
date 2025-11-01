import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServiceFormComponent } from 'app/Branch/Shared/master-model/service-form/service-form.component';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MasterService } from '../../master.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-service-expense',
  templateUrl: './service-expense.component.html',
  styleUrls: ['./service-expense.component.css']
})
export class ServiceExpenseComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() expenceData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action', 'Expences_Code', 'Expences_Name'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              private http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    console.log(this.expenceData, 'expenceData');
    if (this.expenceData.Data && this.expenceData.Data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.expenceData.Data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.expenceData.Data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openExpensesForm(element) {
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      data: {
        action: 'expenseAdd',
        expensesData: element,
        expensesModeType: 'edit',
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getExpenseData();
    });
  }
getExpenseData(): void {
    this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Expences&operation=getExpences`)
    .subscribe((response: any) => {
      if (response.Data) {
      this.dataSource = new MatTableDataSource<any>(response.Data);
      this.dataSource.paginator = this.paginator;
    }
    });
  }
  deleteExpenses(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this expense: ${element.Expences_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteExpenses(element.Expences_Code, element.Expences_Name)
          .subscribe(
            (resp: any) => {
              if (resp.status === 1) {
                this.openSnackBar(resp.message, 'custom-snackbar');
               this.getExpenseData();
              } else {
                this.openSnackBar(resp.message, 'error-snackbar');
              }
            },
            (error) => {
              console.error('Error deleting expense:', error);
              this.openSnackBar('Failed to delete expense', 'error-snackbar');
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
