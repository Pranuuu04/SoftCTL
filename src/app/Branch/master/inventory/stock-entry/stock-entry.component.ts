import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InventoryFormComponent } from 'app/Branch/Shared/master-model/inventory-form/inventory-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MasterService } from '../../master.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-entry',
  templateUrl: './stock-entry.component.html',
  styleUrls: ['./stock-entry.component.css']
})
export class StockEntryComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() entryData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action', 'AwbFromNo', 'AwbToNo'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              private http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    if (this.entryData.Data && this.entryData.Data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.entryData.Data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.entryData.Data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openEntryForm(element) {
    const dialogRef = this.dialog.open(InventoryFormComponent, {
      data: {
        action: 'EntryAdd',
        stockEntryData: element,
        stockMode: 'edit'
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
     this.getStockEntryData();
    });
  }
getStockEntryData(): void {
    this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockEntry&operation=getStockEntry`)
      .subscribe((resp: any) => {
    if (resp.Data) {
      this.dataSource = new MatTableDataSource<any>(resp.Data);
      this.dataSource.paginator = this.paginator;
    }
      });
  }
  deleteEntryForm(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete from this ${element.AwbFromNo} to this ${element.AwbToNo}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteStock(element.ID).subscribe(
          (resp: any) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate([this.router.url]);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => {
            console.error('Error deleting stock entry:', error);
            this.openSnackBar('Failed to delete stock entry', 'error-snackbar');
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
