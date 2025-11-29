
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { SetupReportComponent } from 'app/Branch/Shared/report_pages/setup-report/setup-report.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-salesregisters',
  templateUrl: './salesregisters.component.html',
  styleUrls: ['./salesregisters.component.css']
})
 export class SalesregistersComponent implements OnInit {

  @ViewChild('TABLE',{ read: ElementRef }) table: ElementRef;

  currentDate: string;
  selectedColumns: any;
  fromDate: any;
  toDate: any;
  selectedData: string;
  customerList: any;
  salesRegisterForm: any;
  bookingType: any = 'SalesInvoiceDate';
  sessionLocationCode: string;
  enabledTable = false;

  length: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20,50,100];
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  customerName: any = 'All';
  custType: any = 'All';
  isHidden: boolean = true;
  


  @ViewChild(MatPaginator) paginator: MatPaginator;

  // displayedColumns: any [] = [ 'srNo' , 'Invno' , 'BillDate' , 'customer_name' , 'Typeofcustomer' , 'FromDate' , 'ToDate' , 'CustomerGst' , 'HsnNo' , 'TotaDockets' , 'Amount' , 'TotalCGST' , 'TotalIGST' , 'TotalSGST' , 'TotalAmount' ];
  displayedColumns: any [] = ['index'];

  // displayedColumnsSalesRegister = {
  //     index: 'Sr No',
  //     BillDate: 'Bill Date',
  //     BillNo: 'Bill No',
  //     customer_name: 'Customer Name',
  //     Pcs: 'Pcs',
  //     rate: 'Rate',
  //     rateperkg: 'Rate Per Kg',
  //     TotalAmt: 'Total Amount',
  //     // GST / Taxes
  //     gst: 'GST',
  //     cgst: 'CGST',
  //     sgst: 'SGST',
  //     igst: 'IGST',
  //     // Dynamic Charge Labels (from your API sample)
  //     charges1: 'LOADING',
  //     charges2: 'DELIVERY',
  //     charges3: 'TEMPO CHAG',
  //     charges4: 'UNLOADING',
  //     charges5: 'EXTRA',
  //     charges6: 'APPOINTMENT',
  //     charges7: 'CHARGES',
  //     charges8: 'RATE',
  //     charges9: 'AMOUNT',
  //     charges10: 'charg10',
  //     // Other charge fields you have in API (optional)
  //     ENS_Chrgs: 'ENS Charges',
  //     HDP_Chrgs: 'HDP Charges',
  //     SC_Chrgs: 'SC Charges',
  //     docketchrgs: 'Docket Charges',
  //     idccharges: 'IDC Charges',
  //     oda_chrgs: 'ODA Charges',
  //     fov_chrgs: 'FOV Charges',
  //     fuelcharges: 'Fuel Charges',
  //     cafcharges: 'CAF Charges',
  //     essamt: 'ESS Amount',
  //     othercharges: 'Other Charges',
  //   };

  displayedColumnsSalesRegister = {
      index: 'SR. NO.',
      BillDate: 'Inv.Date',
      BillNo: 'Inv No',
      customer_name: 'Bill party Name',
      gstno: 'GST No.',
      Cnotes: 'Cnotes',
      Pcs: 'Count_Of_Pics',
      rate: 'Freight',
      docketchrgs: 'Docket CHRg',
      fov_chrgs: 'FOV chrg',
      oda_chrgs: 'ODA chrg',
      charges1: 'chrg 1',
      charges2: 'chrg 2',
      charges3: 'chrg 3',
      FuelPer: 'FuelPer',
      fuelcharges: 'Fuel Chg',
      othercharges: 'other chrg',
      GSTPer: 'GST %',
      igst: 'IGST',
      cgst: 'CGST',
      sgst: 'SGST',
      TotalAmt: 'TotalAmt'
    };

  dataSource  = new MatTableDataSource();
  
  constructor(public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              public AllService: AllServicesService,private snackBar: MatSnackBar) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
  //  this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
  //    this.customerList = resp.Data;
  //   });
 
    this.dataSource = new MatTableDataSource;
    this.salesRegisterForm  = this.formBuilder.group({
      customerName: new FormControl('All', Validators.compose([
         Validators.required
        ])),
        custType: new FormControl('All', Validators.compose([
        Validators.required
      ])),
      bookingType: new FormControl('', Validators.compose([ ])),
      fromDate: new FormControl('', Validators.compose([ ])),
      toDate: new FormControl('', Validators.compose([ ])),
    });

      this.AllService.getAllCustomer('Customer',this.sessionLocationCode).subscribe((data: any) => {
        const allCust = { customerName: 'All', customerCode: 'All' };
        this.customerList = [allCust, ...data.Data];
        this.salesRegisterForm .patchValue({ customerName: 'All' });
      });

    this.getReportSetupKey();
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

  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }

  formData: any = {
    customerName: '',
    custType: '',
    bookingType: '',
    fromDate: '',
    toDate: '',
  };

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
    this.formData.customerName = this.customerName;
    this.formData.custType = this.custType;
    this.formData.bookingType = this.bookingType;
    this.formData.fromDate = this.fromDate;
    this.formData.toDate = this.toDate;
    this.formSubmit(this.formData);
  }

getReportSetupKey(){
   this.AllService.getReportSetup('getSalesRegisterSetup').subscribe((setupResp: any) => {
    if (setupResp.status === 1 && setupResp.Data.length) {
      const setup = setupResp.Data[0];
      const selectedKeys = Object.keys(setup).filter(k => setup[k] === 1);
      this.displayedColumns = ['index','BillDate' , ...selectedKeys];
    }
  });
}

formSubmit(formData: any) {
    this.formData = formData;
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.getReportSetupKey();
    // this.httpService.get(`${environment.apiUrl}Rpt/Salesregistercount?custcode=All&sessionLocationCode=MUM&Typeofcust=All&Reporttype=SalesRegister&date=SalesInvoiceDate&fromdate=2024-01-01&todate=2024-04-23&Types=Bookdate&pageNumber=null&pageSize=null` ).then(resp => {
    //   console.log(resp,'dataCount');
    //   this.length = resp.result[0][0].Totalcount;
    //   this.calculatePageCount();
    // });

    // this.httpService.get(`${environment.apiUrl}/Rpt/Salesregister?custcode=` + formData.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + formData.custType + '&Reporttype=SalesRegister&date=Entrybookdate&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=' + formData.bookingType + '&pageNumber=' +(this.pageIndex + 1) + '&pageSize=' + this.pageSize).then(resp => {
    //   console.log(resp, ' hello data ');
    //   if ( resp.status === 1) {
    //       this.dataSource = resp.result[0];
    //       this.enabledTable = true;
    //     } else {
    //       alert(resp.message);
    //       this.enabledTable = false;
    //     }
    //   });

      // formData.bookingType,
       this.AllService.getSalesRegisterReport(formData.customerName, formData.custType,this.sessionLocationCode,this.fromDate,this.toDate,this.pageIndex + 1,this.pageSize).subscribe((res:any)=>{
          if ( res.status === 1) {
          this.dataSource = res.Data;
          this.enabledTable = true;
          this.length = res.count;
        } else {
          this.openSnackBar(res.message,'error-snackbar');
          this.enabledTable = false;
        }
       })

  }

  openSnackBar(message:string,panelClass:string){
    this.snackBar.open(message,'close', {
        duration:3000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass:[panelClass]
    })
  }


  openSetup(){
     const dialogRef = this.dialog.open(SetupReportComponent, {
        data: {
          action: 'add',
          inputName: 'getSalesRegisterSetup',
          columnMapping: this.displayedColumnsSalesRegister,
          saveApi: 'SalesRegisterSetup'
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

  openprogressbar(): MatDialogRef<ProgressBarComponent> {
    const dialogRef = this.dialog.open(ProgressBarComponent, {
      data: {
          action: 'add',
      },
        width: '30rem',
        disableClose: true,
      });
      return dialogRef;
  }
      
  // downloadSample() {
  //       const isConfirmed = window.confirm('Do you want to download the Excel file?');
  //       if (isConfirmed) {
  //         if(this.bookingType === 'SalesInvoiceDate'){
  //           const progressBar = this.openprogressbar();
  //           this.httpService.get(`${environment.apiUrl}Rpt/custstatus?custcode=${this.salesRegisterForm.value.customerName}&destinationcode=${this.salesRegisterForm.value.destination}&Status=${this.salesRegisterForm.value.statusName}&sessionLocationCode=${this.sessionLocationCode}&fromdate=${this.salesRegisterForm.value.fromDate}&todate=${this.salesRegisterForm.value.toDate}&Reporttype=${this.salesRegisterForm.value.reportType}`)
  //           .then((response: any) => {
  //             console.log(response,'xsl download response');
  //             const dataForExcel = response.result[0].map(element => {
  //             const headingInUpperCase = {
  //               'BillNo' : element.BillNo,
  //               'Billdate' : element.Billdate,
  //               'Customer_Name' : element.Customer_Name,
  //               'GstNo' : element.GstNo,
  //               'TotalAmt' : element.TotalAmt,
  //               'TotalAwb' : element.TotalAwb,
  //               'TotalCgstAmt' : element.TotalCgstAmt,
  //               'TotalIgst' : element.TotalIgst,
  //               'IGST' : element.IGST,
  //               'TotalRate' : element.TotalRate,
  //               'TotalSgst' : element.TotalSgst,
  //             };  
  //             return headingInUpperCase;
  //           });
  //             const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
  //             const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //             XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
  //             XLSX.writeFile(wb, 'salesRegister.xlsx');
  //             progressBar.close();
  //           });
  //         } 
  //         else{
  //           alert('Please select one of them Details & Summary');
  //         }
  //       }
        
      

  // }

  downloadSample() {
    const isConfirmed = window.confirm('Do you want to download the Excel file?');
    if (!isConfirmed) return;
  
    const progressBar = this.openprogressbar();
  
   this.AllService.getSalesRegisterReport(this.formData.customerName, this.formData.custType,this.sessionLocationCode,this.fromDate,this.toDate,this.pageIndex + 1,this.length)
    .subscribe({
      next: (response: any) => {
        try {
          if (response?.status === 1 && Array.isArray(response.Data)) {
            const mapping = this.displayedColumnsSalesRegister || {};
            const dataForExcel = response.Data.map((element: any, index: number) => {
              const row: any = {};
              const cols = (this.displayedColumns && this.displayedColumns.length) ? this.displayedColumns : Object.keys(mapping);
              cols.forEach(colKey => {
                const header = mapping[colKey] || colKey;
                if (colKey === 'index' || colKey === 'srNo') {
                  row[header] = index + 1;
                  return;
                }
                if (colKey === 'POD_Img' || colKey === 'Image' || colKey === 'Sign_Img') {
                  const val = element[colKey];
                  row[header] = val ? 'Yes' : 'No';
                  return;
                }
                row[header] = (element && element[colKey] !== null && element[colKey] !== undefined) ? element[colKey] : '';
              });
              return row;
            });
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Pod Image');
            XLSX.writeFile(wb, 'SalesRegisterDetails.xlsx');
  
          } else {
            this.openSnackBar(response?.message || 'No data to export', 'error-snackbar');
          }
        } catch (err) {
          console.error('Export error', err);
          this.openSnackBar('Error while preparing export', 'error-snackbar');
        } finally {
          progressBar.close();
        }
      },
      error: (err) => {
        console.error(err);
        progressBar.close();
        this.openSnackBar('Something went wrong!', 'error-snackbar');
      }
    });
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.handlePageEvent({
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.length
      });
    });
  }

  

 }  

