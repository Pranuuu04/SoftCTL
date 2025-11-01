import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { MasterService } from '../../master.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-branch-mast',
  templateUrl: './branch-mast.component.html',
  styleUrls: ['./branch-mast.component.css']
})
export class BranchMastComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() branchMastData: any;
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'index', 'action', 'Location_Code', 'Location_Name'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;


  constructor(public dialog: MatDialog,
              public httpService: HttpService,
              public http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  ngOnChanges(): void {
    if (this.branchMastData.Data && this.branchMastData.Data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.branchMastData.Data);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.branchMastData.Data);
      this.dataSource.paginator = this.paginator;
    }, 500);
  }

  ngAfterViewInit(): void {}

  openBranchMastForm(element) {
    const dialogRef = this.dialog.open(ZoneFormComponent, {
      data: {
        action: 'branchMastAdd',
        branchMastData: element,
        branchMastMode: 'edit'
      },
      width: '60rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
        this.loadBranchMastData();
    });
  }
loadBranchMastData() {
  this.http.get(`${environment.apiUrl}Master/GetAndDeleteLocation?operation=getLocation`).subscribe((resp: any) => {
    if (resp.Data) {
      this.dataSource = new MatTableDataSource<any>(resp.Data);
      this.dataSource.paginator = this.paginator;
    }
  });
}

  deleteBranchMast(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.Location_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.DeleteLocation(element.Location_Code).subscribe(
          (resp: any) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
                this.dataSource.data = this.dataSource.data.filter(
              d => d.Location_Code !== element.Location_Code
            );
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
