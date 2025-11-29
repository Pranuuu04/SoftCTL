import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ViewaddComponent } from 'app/Branch/Shared/manifest pages/viewadd/viewadd.component';
import { ViewdeleteComponent } from 'app/Branch/Shared/manifest pages/viewdelete/viewdelete.component';
import { VieweditComponent } from 'app/Branch/Shared/manifest pages/viewedit/viewedit.component';
import { SetupReportComponent } from 'app/Branch/Shared/report_pages/setup-report/setup-report.component';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';
import { environment } from 'environments/environment.prod';


@Component({
  selector: 'app-view-manifest',
  templateUrl: './view-manifest.component.html',
  styleUrls: ['./view-manifest.component.css']
})
export class ViewManifestComponent implements OnInit {

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
  destination: any = '';
  selectedManifestData: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // pageSize: number ;
  pageNumber = 1;
  formData:any;


    length: any;
    pageSize = 10;
    pageIndex = 0;
    showPageSizeOptions = false;
    showFirstLastButtons = true;
    hidePageSize = false;
    disabled = false;
    customerName: any = 'All';
    custType: any = 'All';
    isHidden: boolean = true;

  // displayedColumns: any[] = ['shipment', 'manifestNo', 'manifestDt', 'todest', 'mode', 'SumQty', 'sumActualWt', 'vehicleNo', 'driverName', 'Action'];
  displayedColumns: any[] = ['Action','index'];
  displayedColumnsManifest = {
      index: 'SR NO',
      shipment: 'Shipment',
      manifestNo: 'Manifest No',
      manifestDt: 'Manifest Date',
      todest: 'To Destination',
      mode: 'Mode',
      SumQty: 'Total Qty',
      sumActualWt: 'Actual Weight',
      vehicleNo: 'Vehicle No',
      driverName: 'Driver Name',
      DestCode: 'To Code',
      fromDestCode: 'From Code',
      fromdest: 'From Name',
      via: 'Via Code',
      viaName: 'Via Name',
      VehicleType: 'Vehicle Type',
      driverMobile: 'Driver Mobile',
      vendorcode: 'Vendor Code',
      vendorName: 'Vendor Name',
      route: 'Route',
      Remark: 'Remark'
  }

  masterColumnOrder = [
    'index',                   
    'manifestNo',     
    'manifestDt',     
    'fromDestCode',   
    'fromdest',        
    'DestCode',       
    'todest',        
    'via',            
    'viaName',        
    'route',          
    'mode',           
    'shipment',      
    'SumQty',        
    'sumActualWt',    
    'VehicleType',    
    'vehicleNo',      
    'driverName',     
    'driverMobile',   
    'vendorcode',     
    'vendorName',    
    'Remark' 
];


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
  currentDate1: any;
  currentDate2: any;
  ManfViewPdf: any;
  ClientLogo: any;
  ClientName: any;
  selectedValue: string;
  userType: any;
  pageEvent: PageEvent;


  constructor( public dialog: MatDialog,
               private sharedService: SharedService,
               public formBuilder: FormBuilder,
               private http: HttpClient,
               public httpService: AllServicesService,
               public formbuilder: FormBuilder,
               private snackBar: MatSnackBar, ) {
               this.isLoading = false;
               }

   ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.selectedValue = this.sharedService.getSelectedValue();
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    this.ClientName = localStorage.getItem('ClientName');

    this.sessionLocationCode = localStorage.getItem('originCode');
        this.dataSource = new MatTableDataSource<any>(this.ManfViewTable);
    this.loadDestination();
    //  this.currentDate1 = new Date().toISOString().split('T')[0];
    //   this.currentDate2 = new Date().toISOString().split('T')[0];
      const from = this.getDefaultDate();
      const to = this.getCurrentDate();
    this.createForm  = this.formbuilder.group({
      fromDate: new FormControl(from, Validators.compose([
        Validators.required
        ])),
      toDate: new FormControl(to, Validators.compose([
        Validators.required
      ])),
      manifestNo: new FormControl('', Validators.compose([
        Validators.required
      ])),
      destination: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
     this.getReportSetupKey();
  }

    refresh() {
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
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
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
  this.formData = formData;
  this.getReportSetupKey();
  if (this.userType === 'Admin') {
    if (formData.manifestNo) {
      this.httpService.viewFromManifestNo(this.selectedValue, formData.manifestNo, this.pageNumber).subscribe((resp: any) => {
        if (resp.status === 1) {
          console.log('viewFromManifestNo', resp.Data);

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
      // tslint:disable-next-line:max-line-length
      this.httpService.viewFromDestManifest(this.selectedValue, formData.destination, formData.fromDate, formData.toDate, this.pageNumber).subscribe((resp: any) => {
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
      this.httpService.viewFromManifestDate(this.selectedValue, formData.fromDate, formData.toDate, this.pageNumber).subscribe((resp: any) => {
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
  } else {
    if (formData.manifestNo) {
      this.httpService.viewFromManifestNo(this.sessionLocationCode, formData.manifestNo, this.pageNumber).subscribe((resp: any) => {
        if (resp.status === 1) {
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
      this.httpService.viewFromDestManifest(this.sessionLocationCode, formData.destination, formData.fromDate, formData.toDate, this.pageNumber).subscribe((resp: any) => {
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
      this.httpService.viewFromManifestDate(this.sessionLocationCode, formData.fromDate, formData.toDate, this.pageNumber).subscribe((resp: any) => {
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
      this.httpService.GetDestination(this.selectedValue).subscribe((resp: any) => {
        this.DestinationName = resp.Data;
      });
    } else {
      this.httpService.GetDestination(this.sessionLocationCode).subscribe((resp: any) => {
        this.DestinationName = resp.Data;
      });
    }
  }

  openviewadd(element: any) {
    const dialogRef = this.dialog.open(ViewaddComponent, {
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
    const dialogRef = this.dialog.open(ViewdeleteComponent, {
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
  // printPDF(formData: any){
  //   const PdfUrl =`${environment.apiUrl}Manifest/getManifestForPrint?sessionLocationCode=${this.sessionLocationCode}&manifestNo=${formData}&logolink=${this.ClientLogo}&companyName=${this.ClientName}`
  //   this.httpService.get(PdfUrl).then(resp=>{
  //       this.ManfViewPdf = resp.Data;
  //       window.open(PdfUrl, '_blank');
  //   })
  // }

printPDF(element) {
  if (this.userType === 'Admin') {
    const obj = {
      sessionLocationCode: element.fromDestCode,
      manifestNo: element.manifestNo,
      logolink: this.ClientLogo,
      companyName: this.ClientName
    };
    const PdfUrl = `${environment.apiUrl}Manifest/getManifestForPrint`;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    this.http.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe((blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    });
  } else {
    const obj = {
      sessionLocationCode: element.fromDestCode,
      manifestNo:  element.manifestNo,
      logolink: this.ClientLogo,
      companyName: this.ClientName
  };
  const PdfUrl = `${environment.apiUrl}Manifest/getManifestForPrint`;
  const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
  this.http.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe((blob: Blob) => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
  });
  }
}



// getReportSetupKey(){
//    this.httpService.getReportSetup('getCheckListSetup').subscribe((setupResp: any) => {
//     if (setupResp.status === 1 && setupResp.Data.length) {
//       const setup = setupResp.Data[0];
//         const selectedKeys = Object.keys(setup).filter(k => setup[k] === 1);
//         this.displayedColumns = ['index','shipment', 'manifestNo', 'manifestDt', 'todest', 'mode', 'SumQty', 'sumActualWt', 'vehicleNo', 'driverName', ...selectedKeys];
//      }
//   });
// }

getReportSetupKey() {
  this.httpService.getReportSetup('getCheckListSetup').subscribe((setupResp: any) => {
    if (setupResp.status === 1 && setupResp.Data.length) {
      const setup = setupResp.Data[0];
      this.displayedColumns = this.masterColumnOrder.filter(col => {
        if (col === 'index') return true;      
        if (setup[col] === 1) return true;     
        if (setup[col] === 0) return false;    
        return true; 
      });
    }
  });
}


  openSetup(){
      const dialogRef = this.dialog.open(SetupReportComponent, {
        data: {
            action: 'add',
            inputName: 'getCheckListSetup',
            columnMapping: this.displayedColumnsManifest,
            saveApi: 'ChecklistReportSetup'
          },
            width: '85rem',
            disableClose: true
          });
        dialogRef.afterClosed().subscribe((selectedKeys: string[]) => {
          if (selectedKeys && selectedKeys.length) {
            this.displayedColumns = ['index', ...selectedKeys];
           }
             this.getReportSetupKey();
        }); 
     }



  downloadSample(){

  }


  pageCount: number = 1;
  calculatePageCount() {
      this.pageCount = Math.ceil(this.length / this.pageSize);
      console.log(this.pageCount,'pageCount');
    }
  
    handlePageEvent(e: PageEvent) {
      this.pageEvent = e;
      this.length = e.length;
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
      this.calculatePageCount();
      this.formSubmit(this.formData);
    }

}
