import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from 'app/Branch/master/master.service';
import { OtherMastFormComponent } from 'app/Branch/Shared/master-model/other-mast-form/other-mast-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-company-master',
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.css']
})
export class CompanyMasterComponent implements OnInit , AfterViewInit {

  // @Input() CompanyMastData: any;
  sessionLocationCode: any;
  showTable = false;
  // pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'index', 'action', 'Company_Code', 'Company_Name', 'GST'];
  zoneViewData: any[] = [];
  showFirstLastButtons: any;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  hidePageSize = false;
  pageCount = 0;
  companyViewData: any[] = [];
  disabled = false;
  pageEvent: PageEvent;
  constructor(public dialog: MatDialog,
              public httpService: HttpService,
              public http: HttpClient,
              public snackBar: MatSnackBar,
              public masterService: MasterService) {}

  // ngOnChanges(): void {
  //   if (this.CompanyMastData.Data && this.CompanyMastData.Data.length > 0) {
  //     this.dataSource = new MatTableDataSource<any>(this.CompanyMastData.Data.companyDetails);
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }

  ngOnInit(): void {
    // setTimeout(() => {
      // this.dataSource = new MatTableDataSource<any>(this.CompanyMastData.Data.companyDetails);
    //   this.dataSource.paginator = this.paginator;
    // }, 500);
    this.dataSource = new MatTableDataSource<any>(this.companyViewData);
      this.loadCompanyMastData(this.pageIndex + 1, this.pageSize);
  }

   calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
  handlePageEvent(e: PageEvent) {
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  const pageNumber = this.pageIndex + 1;
    this.calculatePageCount();
  this.loadCompanyMastData(pageNumber, this.pageSize);
}
  // }

  ngAfterViewInit(): void {}

  openCourierMastForm(element) {
    const dialogRef = this.dialog.open(OtherMastFormComponent, {
      data: {
        action: 'companyMastAdd',
        companyData: element,
        companyMode: 'edit'
      },
      width: '80rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
        this.loadCompanyMastData(this.pageIndex + 1, this.pageSize);
    });
  }
  getLogoUrl(logo: string): string | null {
  if (!logo) { return null; }

  // Case 1: already a full URL
  if (logo.startsWith('http')) {
    return logo;
  }

  // Case 2: already base64 with prefix
  if (logo.startsWith('data:image')) {
    return logo;
  }

  // Case 3: base64 without prefix
  if (/^[A-Za-z0-9+/=]+$/.test(logo)) {
    return 'data:image/png;base64,' + logo;
  }

  // Case 4: only filename (like "Tracking.webp")
  return `https://www.softctl.com/LOGO/${logo}`;
}

loadCompanyMastData(pageNumber: number, pageSize: number) {
  // tslint:disable-next-line:max-line-length
  this.http.get(`${environment.apiUrl}Master/companyGetAndDelete?operation=getCompany&pageNumber=${pageNumber}&pageSize=${pageSize}`).subscribe((resp: any) => {
      if (resp.status === 1) {
        //  this.showTable = true;
         this.companyViewData = resp.Data.companyDetails;
         this.dataSource.data = this.companyViewData;
          this.length = resp.count;
          this.calculatePageCount();
       } else {
          this.showTable = false;
          this.companyViewData = []
        }
    // if (resp.Data) {
    //   this.dataSource = new MatTableDataSource<any>(resp.Data.companyDetails);
    //           this.length = resp.count;
    //       this.calculatePageCount();
    // }
  });
}

  deleteCourierMast(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: `Are you sure you want to delete this ${element.Company_Name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.deleteCompany(element.Company_Code).subscribe(
          (resp: any) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
                this.loadCompanyMastData(this.pageIndex + 1, this.pageSize);
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
// onPageChange(event: PageEvent) {
//   const pageNumber = event.pageIndex + 1;
//   const pageSize = event.pageSize;
//   this.loadCompanyMastData(pageNumber, pageSize);
// }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
