import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { VieweditComponent } from 'app/Branch/Shared/manifest pages/viewedit/viewedit.component';
import { SharedService } from 'app/service/shared.service';
import { environment } from 'environments/environment.prod';
import { HttpService } from '../../../../service/http.service';
import { ViewDeleteDisComponent } from 'app/Branch/Shared/dispatch_pages/view-delete-dis/view-delete-dis.component';
import { ViewAddDisComponent } from 'app/Branch/Shared/dispatch_pages/view-add-dis/view-add-dis.component';

@Component({
  selector: 'app-view-dispatched',
  templateUrl: './view-dispatched.component.html',
  styleUrls: ['./view-dispatched.component.css']
})
export class ViewDispatchedComponent implements OnInit {
  refresh() {
    throw new Error('Method not implemented.');
  }
  // tslint:disable-next-line:member-ordering
  ToDstCode: any;
  printdata: any;
  manifestNoNew: any;
  loadprintData: any;
  pdfUrl: any;
  destinationCode: any;
  createForm: FormGroup;
  validationMessage: any = [];
  currentDate: string;
  sessionLocationCode: string ;
  fetchedData: any[] = [];
  isLoading = false;
  manifestNo: any = '';
  selectedManifestData: any;
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: number ;
  pageNumber = 1;
  displayedColumns: any[] = ['shipment', 'dispatchNo', 'dispatchDt', 'todest', 'mode', 'SumQty', 'sumActualWt', 'vehicleNo', 'driverName', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  DestinationName: any;
  loadPrintDataAPI: any;
  advancePaid: any;
  amount: any;
  awbNo: any;
  brockerName: any;
  dieselAmt: any;
  driverLicenceNo: any;
  driverName: any;
  fromDest: any;
  kataWt: any;
  manifestDt: any;
  mode: any;
  openingKm: any;
  refrenceNo: any;
  remark: any;
  router: any;
  slipNo: any;
  toDest: any;
  vehicleDieselLtrs: any;
  vehicleDieselNo: any;
  vehicleNo: any;
  vehicleType: any;
  vendorCode: any;
  via: any;
  ManfViewTable: any;
  showTable = false;
  firstOfMonth: any;
  ManfViewPdf: any;
  ClientLogo: any;
  ClientName: any;
  selectedValue: string = 'All';
  userType: any;

  currentDate1 : any;
  currentDate2 : any;
  destination: any;
  dispatchNo: any;
  destinationName: any;


  constructor( public dialog: MatDialog,
               private sharedService: SharedService,
               public formBuilder: FormBuilder,
               private http: HttpClient,
               public httpService: HttpService,
               public formbuilder: FormBuilder,
               private snackBar: MatSnackBar, ) {
                 this.isLoading = false;
               }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    // this.destinationName = localStorage.getItem('selectedValue');
    // this.sharedService.selectedValue$.subscribe(value => {
    //   this.selectedValue = value;
    // });
    this.destinationName = this.sharedService.getSelectedValue();
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    this.ClientName = localStorage.getItem('ClientName');
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.dataSource = new MatTableDataSource<any>(this.ManfViewTable);
    this.loadDestination(),
    this.currentDate1 = new Date().toISOString().split('T')[0];
    this.currentDate2 = new Date().toISOString().split('T')[0];

    this.createForm  = this.formbuilder.group({
      fromDate: new FormControl('', Validators.compose([
        Validators.required
        ])),
      toDate: new FormControl('', Validators.compose([
        Validators.required
      ])),
      dispatchNo: new FormControl('', Validators.compose([
        Validators.required
      ])),
      destination: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getDefaultDate(): string {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.formatDate(firstDayOfMonth);
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();  
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  getCurrentDate(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  formSubmit(formData: any) {
    if (this.userType === 'Admin') {
      if (formData.dispatchNo) {
        this.httpService.get(`${environment.apiUrl}dispatch/getviewDispatchNo?sessionLocationCode=${this.destinationName}&dispatchNo=${formData.dispatchNo}`).then(resp => {
          if (resp.status === 1){
            this.showTable = true;
            this.ManfViewTable = resp.Data;
            this.dataSource.data = this.ManfViewTable;
            this.dataSource.paginator = this.paginator;
            this.createForm.get('manifestNo').reset();
          } else {
            this.openSnackBar(resp.message + ' by manifest No', 'error-snackbar');
            this.showTable = false;
          }
        })
      } else if (formData.destination) {
        this.httpService.get(`${environment.apiUrl}dispatch/getviewDispatchDestination?sessionLocationCode=${this.destinationName}&toDest=${formData.destination}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&pageNumber=1&pageSize=100`).then((resp: any) => {
          if (resp.status === 1){
          this.showTable = true;
          this.ManfViewTable = resp.Data;
          this.dataSource.data = this.ManfViewTable;
          this.dataSource.paginator = this.paginator;
          this.createForm.get('destination').reset();
          } else {
            this.openSnackBar(resp.message + ' by destination', 'error-snackbar');
            this.showTable = false;
          }
          })
      } else {
        this.httpService.get(`${environment.apiUrl}dispatch/getviewDispatchDate?sessionLocationCode=${this.destinationName}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&pageNumber=1&pageSize=100`).then((resp: any) => {
          if (resp.status === 1) {
          this.showTable = true;
          this.ManfViewTable = resp.Data;
          this.dataSource.data = this.ManfViewTable;
          this.dataSource.paginator = this.paginator;
          } else {
            this.openSnackBar(resp.message + ' by Date', 'error-snackbar')
            this.showTable = false;
          }
        })
      }
    } else {
      if (formData.dispatchNo) {
        this.httpService.get(`${environment.apiUrl}dispatch/getviewDispatchNo?sessionLocationCode=${this.sessionLocationCode}&dispatchNo=${formData.dispatchNo}`).then(resp => {
          if (resp.status === 1) {
            this.showTable = true;
            this.ManfViewTable = resp.Data;
            this.dataSource.data = this.ManfViewTable;
            this.dataSource.paginator = this.paginator;
            this.createForm.get('manifestNo').reset();
          } else {
            this.openSnackBar(resp.message + ' by manifest No', 'error-snackbar')
            this.showTable = false;
          }
        })
      } else if (formData.destination) {
        this.httpService.get(`${environment.apiUrl}dispatch/getviewDispatchDestination?sessionLocationCode=${this.sessionLocationCode}&toDest=${formData.destination}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&pageNumber=1&pageSize=100`).then((resp: any) => {
          if (resp.status === 1) {
          this.showTable = true;
          this.ManfViewTable = resp.Data;
          this.dataSource.data = this.ManfViewTable;
          this.dataSource.paginator = this.paginator;
          this.createForm.get('destination').reset();
          } else {
            this.openSnackBar(resp.message + ' by destination', 'error-snackbar');
            this.showTable = false;
          }
          })
      } else {
        this.httpService.get(`${environment.apiUrl}dispatch/getviewDispatchDate?sessionLocationCode=${this.sessionLocationCode}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&pageNumber=1&pageSize=100`).then((resp: any) => {
          if (resp.status === 1) {
          this.showTable = true;
          this.ManfViewTable = resp.Data;
          this.dataSource.data = this.ManfViewTable;
          this.dataSource.paginator = this.paginator;
          } else {
            this.openSnackBar(resp.message + ' by Date', 'error-snackbar');
            this.showTable = false;
          }
        })
      }
    }
  }

  loadDestination() {
   if (this.userType === 'Admin') {
    this.httpService.get(`${environment.apiUrl}Manifest/toBranch?sessionLocationCode=${this.destinationName}`).then((resp : any) => {
      this.DestinationName = resp.Data;
    }, error => {
      this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
    });
   } else {
    this.httpService.get(`${environment.apiUrl}Manifest/toBranch?sessionLocationCode=${this.sessionLocationCode}`).then((resp : any) => {
      this.DestinationName = resp.Data;
    }, error => {
      this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
    });
   }
  }

  openviewadd(element: any) {
    const dialogRef = this.dialog.open(ViewAddDisComponent, {
      data: {
        action: 'add',
        responseData: element,
        ToDstCode: this.ToDstCode
      },
      width: '20rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      this.formSubmit(this.createForm.value);
      if (res) {
      }
    });
  }

  openviewdelete(element: any) {
    const dialogRef = this.dialog.open(ViewDeleteDisComponent, {
      data: {
        action: 'add',
        responseData: element
      },
      width: '20rem',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      this.formSubmit(this.createForm.value);
      if (res) {
      }
    });
  }

  openviewedit(element: any) {
    const dialogRef = this.dialog.open(VieweditComponent, {
      data: {
        action: 'add',
        responseData: element,
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      this.formSubmit(this.createForm.value);
      if (res) {

      }
    });
  }

  printPDF( element: any) {
    if (this.userType === 'Admin') {
      let obj = {
        sessionLocationCode: element.FromDestCode,
        dispatchNo: element.dispatchNo,
        logolink: this.ClientLogo,
        companyName: this.ClientName
      };
      const PdfUrl = `${environment.apiUrl}dispatch/getDispatchForPrint`;
      const headers = new HttpHeaders({
          'Content-Type': 'application/json'
      });
      this.http.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe((blob: Blob) => {
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
      });
    } else {
      let obj = {
        sessionLocationCode: element.FromDestCode,
        dispatchNo: element.dispatchNo,
        logolink: this.ClientLogo,
        companyName: this.ClientName
    };
    const PdfUrl = `${environment.apiUrl}dispatch/getDispatchForPrint`;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    this.http.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe((blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    });
    }
  }

}