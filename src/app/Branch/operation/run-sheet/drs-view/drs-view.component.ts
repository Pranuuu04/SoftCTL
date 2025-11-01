import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import 'jspdf-autotable';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AddDrsComponent } from 'app/Branch/Shared/Runsheet-pages/add-drs/add-drs.component';
import { DeleteDrsComponent } from 'app/Branch/Shared/Runsheet-pages/delete-drs/delete-drs.component';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-drs-view',
  templateUrl: './drs-view.component.html',
  styleUrls: ['./drs-view.component.css']
})
export class DRSViewComponent implements OnInit {

  pdfContainer: any;
  fromDate: any;
  toDate: any;
  sessionLocationCode: any;
  DrsViewForm: any;
  validationMessage: any;
  DrsViewTable: any;
  nameList: any;
  showTable = false;
  firstOfMonth: any;
  currentDate1 : any;
  currentDate2 : any;
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: number ;
  pageNumber = 1;
  showPdfSection = false;
  displayedColumns: any[] = ['DrsNO', 'DrsDate', 'employeeName', 'employeeNo', 'Area', 'counting', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  DrsprintData: any;
  manifestNoNew: any;
  DRSNo: any;
  DrsPdf: any;
  PDfApi: any;
  ClientLogo: any;
  ClientName: any;
  originName: string;
  userType: any;
  destinationName: any;


  constructor(public dialog: MatDialog,
              public formbuilder: FormBuilder,
              private httpsevice: AllServicesService,
              private httpclient: HttpClient,
              private snackBar: MatSnackBar,
              private sharedService: SharedService,
              ) {
              }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.destinationName = this.sharedService.getSelectedValue();
    this.dataSource = new MatTableDataSource<any>(this.DrsViewTable);
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.originName = localStorage.getItem('originName');
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    this.ClientName = localStorage.getItem('ClientName');

    this.getNameList();
      // this.currentDate1 = new Date().toISOString().split('T')[0];
      // this.currentDate2 = new Date().toISOString().split('T')[0];
      const from = this.getDefaultDate();
      const to = this.getCurrentDate();
    this.validationMessage = {
      fromDate: [
        {type: 'required', message: 'Please select fromDate.'}
      ],
      toDate: [
        {type: 'required', message: 'Please enter toDate.'}
      ]
    };

    this.DrsViewForm  = this.formbuilder.group({
      fromDate: new FormControl(from, Validators.compose([
         Validators.required
        ])),
      toDate: new FormControl(to, Validators.compose([
        Validators.required
      ])),
      DRS: new FormControl('', Validators.compose([
        Validators.required
      ])),
      deliveryBoy: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }
  refresh() {
  }
 ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
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
    this.snackBar.open(message, 'Ok', {
      duration: 3034300,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  submit(formData: any) {
   if (this.userType !== 'Admin') {
    if (formData.DRS){
      this.httpsevice.getViewDrsFromDrsNo( this.sessionLocationCode , formData.DRS).subscribe((resp: any) => {
        if (resp.status === 1){
          // this.openSnackBar( resp.message +' by Drs number', 'custom-snackbar')
          this.showTable = true;
          this.DrsViewTable = resp.Data;
          this.dataSource.data = this.DrsViewTable;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          });
          this.DrsViewForm.get('DRS').reset();
        }else{
          this.showTable = false;
          this.openSnackBar(resp.message + ' by Drs number', 'error-snackbar')
        }
      })
    } else if (formData.deliveryBoy){
      this.httpsevice.getViewDrsFromPickupBoy(this.sessionLocationCode , formData.deliveryBoy).subscribe((resp: any) => {
        if (resp.status === 1){
          // this.openSnackBar( resp.message +' by delivery boy', 'custom-snackbar')
        this.showTable = true;
        this.DrsViewTable = resp.Data;
        this.dataSource.data = this.DrsViewTable;
        this.dataSource.paginator = this.paginator;
        this.DrsViewForm.get('deliveryBoy').reset();
        }else{
          this.showTable = false;
          this.openSnackBar(resp.message + ' by delivery boy', 'error-snackbar')
        }
        })
    } else {
      this.httpsevice.getViewRunsheet(this.sessionLocationCode, formData.fromDate, formData.toDate).subscribe((resp: any) => {
        if (resp.status === 1){
        // this.openSnackBar( resp.message+' by Date', 'custom-snackbar')
        this.showTable = true;
        this.DrsViewTable = resp.Data;
        this.dataSource.data = this.DrsViewTable;
        this.dataSource.paginator = this.paginator;
        } else {
          this.showTable = false;
          this.openSnackBar(resp.message + ' by Date', 'error-snackbar')
        }
      })
    }
   } else {
    if (formData.DRS) {
      this.httpsevice.getViewDrsFromDrsNo(this.destinationName , formData.DRS).subscribe((resp: any) => {
        if (resp.status === 1){
          this.openSnackBar( resp.message + ' by Drs number', 'custom-snackbar')
          this.showTable = true;
          this.DrsViewTable = resp.Data;
          this.dataSource.data = this.DrsViewTable;
          this.dataSource.paginator = this.paginator;
          this.DrsViewForm.get('DRS').reset();
        } else {
          this.showTable = false;
          this.openSnackBar(resp.message + ' by Drs number', 'error-snackbar')
        }
      })
    } else if (formData.deliveryBoy) {
      this.httpsevice.getViewDrsFromPickupBoy(this.destinationName , formData.deliveryBoy).subscribe((resp: any) => {
        if (resp.status === 1){
          this.openSnackBar( resp.message + ' by delivery boy', 'custom-snackbar')
        this.showTable = true;
        this.DrsViewTable = resp.Data;
        this.dataSource.data = this.DrsViewTable;
        this.dataSource.paginator = this.paginator;
        this.DrsViewForm.get('deliveryBoy').reset();
        } else {
          this.showTable = false;
          this.openSnackBar(resp.message + ' by delivery boy', 'error-snackbar')
        }
        })
    } else {
      this.httpsevice.getViewRunsheet(this.destinationName, formData.fromDate, formData.toDate).subscribe((resp: any) => {
        if (resp.status === 1) {
        this.openSnackBar( resp.message + ' by Date', 'custom-snackbar')
        this.showTable = true;
        this.DrsViewTable = resp.Data;
        this.dataSource.data = this.DrsViewTable;
        this.dataSource.paginator = this.paginator;
        } else {
          this.showTable = false;
          this.openSnackBar(resp.message + ' by Date', 'error-snackbar')
        }
      })
    }
   }
  }

  getNameList() {
    if (this.userType !== 'Admin') {
      this.httpsevice.getEmpList(this.sessionLocationCode).subscribe((resp: any) => {
        this.nameList = resp.Data;
      })
    } else {
      this.httpsevice.getEmpList(this.destinationName).subscribe((resp: any) => {
        this.nameList = resp.Data;
      })
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


// printPDF(formData: any){
//   const PdfUrl =`${environment.apiUrl}runsheet/getForPrintRunsheet?sessionLocationCode=${this.sessionLocationCode}&drsNo=${formData}&logolink=httpsevice://www.neotechnet.com/LOGO/LOGO1.jpg`
//   this.httpsevice.get(PdfUrl).then(resp=>{
//       this.DrsPdf = resp.Data;
//       window.open(PdfUrl, '_blank');
//   })
// }
printPDF(element : any ) {
  let obj = {
    sessionLocationCode: element.Location || this.destinationName,
    drsNo: element.DrsNO,
    logolink: this.ClientLogo,
    companyName: this.ClientName,
    // branchName:this.originName
};
console.log(obj , "printPDF");

  const PdfUrl = `${environment.apiUrl}runsheet/getForPrintRunsheet`;
  const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
  this.httpclient.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe((blob: Blob) => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
  });
}

addBulkModal(DrsNO : any) {
   const dialogRef = this.dialog.open(AddDrsComponent, {
     data: {
       action: 'add',
       DrsData: DrsNO,
     },
     width: '20rem',
     disableClose: true
   });
   dialogRef.afterClosed().subscribe(res => {
    this.submit(this.DrsViewForm.value);
    if (res) {
    }
   });
 }

 deleteBulkModal(DrsNO : any) {
    const dialogRef = this.dialog.open(DeleteDrsComponent, {
      data: {
        action: 'add',
        DrsData: DrsNO
      },
      width: '20rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      this.submit(this.DrsViewForm.value);
      if (res) {
      }
    });
  }

}