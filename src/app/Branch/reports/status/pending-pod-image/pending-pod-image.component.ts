import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-pending-pod-image',
  templateUrl: './pending-pod-image.component.html',
  styleUrls: ['./pending-pod-image.component.css']
})
export class PendingPodImageComponent implements OnInit {

podForm: FormGroup;
  fromDate: any;
  toDate: any;

  length: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20,50];
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  isHidden = true;

  isLoading = false;

  // displayedColumns: string[] = ['srNo','AwbNo','BookDate','pod_Img'];//'delv_Dt',
displayedColumns: string[] = [
      'srNo',
      'BookDate',
      'AwbNo',
      'Origin',
      'destination_name',
      'Status',
      'DelvDT',
      'POD_Img',
      'DelvTime',
      'ExptDateOfDelvDt',
      'RecvName',
      'ContactNo',
      'RecvNature',
      'recvremark',
      'customer_name',
      'shipperName',
      'Consignee_Name',
      'mode_name',
      'product_name',
      'vendor_name',
      'Ref_No',
      'DrsNo',
      'drsdt',
      'Pickup_Boy'
    ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  formData: any = {
    drsType: '',
    fromDate: '',
    toDate: '',
  };

  pageCount = 1;
  userType: string;
  sessionLocationCode: string;

  constructor(public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              public AllService: AllServicesService,
              public bookingService: BookingService) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.sessionLocationCode = (localStorage.getItem('userType') === 'Admin')
    ? localStorage.getItem('selectedValue')
    : localStorage.getItem('originCode');
    this.userType = localStorage.getItem('userType');
    this.dataSource = new MatTableDataSource;
    

  this.podForm  = this.formBuilder.group({
      drsType: new FormControl('', Validators.compose([ ])),
      fromDate: new FormControl('', Validators.compose([ ])),
      toDate: new FormControl('', Validators.compose([ ])),
    });

  }

  getDefaultDate(): string {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.formatDate(firstDayOfMonth);
  }

  getCurrentDate(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }

  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.calculatePageCount();

    this.formData.fromDate = this.fromDate;
    this.formData.toDate = this.toDate;
 
    this.formSubmit(this.formData);
  }
  

  
// formSubmit(formData: any) {
//   this.httpService
//     .get(`${environment.apiUrl}pod/pendingPodImage?fromDate=${formData.fromDate}&toDate=${formData.toDate}&podPending=${formData.drsType}`)
//     .then(resp => {
//       if (resp.status === 1 && resp.Data) {
//         this.dataSource.data = resp.Data; 
//       } else {
//         this.openSnackBar(resp.message, 'error-snackbar');
//         this.dataSource.data = [];
//       }

//     });
// }


formSubmit(formData: any) {

  this.isLoading = true; 

   this.AllService.getDrsPodReport(this.sessionLocationCode,'PodImageReport',formData.drsType || 'All',formData.fromDate,formData.toDate, this.pageIndex+1,this.pageSize).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          if (resp?.status === 1 && resp?.Data) {
            this.dataSource.data = resp.Data;
            this.length = resp.count;
          } else {
            this.dataSource.data = [];
            this.openSnackBar(resp?.message, 'error-snackbar');
          }
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.dataSource.data = [];
          this.openSnackBar("Something went wrong!", 'error-snackbar');
        }
      });
}

  openprogressbar(): MatDialogRef<ProgressBarComponent> {
    const dialogRef = this.dialog.open(ProgressBarComponent, {
      data: {
          action: 'docketPrint',
      },
        width: '30rem',
        disableClose: true,
      });
      return dialogRef;
    }

  
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  // ngAfterViewInit() {
  //   this.paginator.page.subscribe(() => {
  //     this.handlePageEvent({
  //       pageIndex: this.paginator.pageIndex,
  //       pageSize: this.paginator.pageSize,
  //       length: this.length
  //     });
  //   });
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
