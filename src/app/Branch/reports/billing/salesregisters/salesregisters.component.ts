
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
  pageSizeOptions = [5, 10, 20];
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
  displayedColumns: any [] = [];
  displayedColumnsSalesRegister: { [key: string]: string } = {
     index: 'Sr No',

    }
  dataSource  = new MatTableDataSource();
  


  constructor(public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              public AllService: AllServicesService) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
       this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
     this.customerList = resp.Data;
    });
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


  formSubmit(formData: any) {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.httpService.get(`${environment.apiUrl}Rpt/Salesregistercount?custcode=All&sessionLocationCode=MUM&Typeofcust=All&Reporttype=SalesRegister&date=SalesInvoiceDate&fromdate=2024-01-01&todate=2024-04-23&Types=Bookdate&pageNumber=null&pageSize=null` ).then(resp => {
      console.log(resp,'dataCount');
      this.length = resp.result[0][0].Totalcount;
      this.calculatePageCount();
    });

    this.httpService.get(`${environment.apiUrl}/Rpt/Salesregister?custcode=` + formData.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + formData.custType + '&Reporttype=SalesRegister&date=Entrybookdate&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=' + formData.bookingType + '&pageNumber=' +(this.pageIndex + 1) + '&pageSize=' + this.pageSize).then(resp => {
      console.log(resp, ' hello data ');
      if ( resp.status === 1) {
          this.dataSource = resp.result[0];
          this.enabledTable = true;
        } else {
          alert(resp.message);
          this.enabledTable = false;
        }
      });
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
        // this.getReportSetupKey();
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
      
  downloadSample() {
        const isConfirmed = window.confirm('Do you want to download the Excel file?');
        if (isConfirmed) {
          if(this.bookingType === 'SalesInvoiceDate'){
            const progressBar = this.openprogressbar();
            this.httpService.get(`${environment.apiUrl}Rpt/custstatus?custcode=${this.salesRegisterForm.value.customerName}&destinationcode=${this.salesRegisterForm.value.destination}&Status=${this.salesRegisterForm.value.statusName}&sessionLocationCode=${this.sessionLocationCode}&fromdate=${this.salesRegisterForm.value.fromDate}&todate=${this.salesRegisterForm.value.toDate}&Reporttype=${this.salesRegisterForm.value.reportType}`)
            .then((response: any) => {
              console.log(response,'xsl download response');
              const dataForExcel = response.result[0].map(element => {
              const headingInUpperCase = {
                'BillNo' : element.BillNo,
                'Billdate' : element.Billdate,
                'Customer_Name' : element.Customer_Name,
                'GstNo' : element.GstNo,
                'TotalAmt' : element.TotalAmt,
                'TotalAwb' : element.TotalAwb,
                'TotalCgstAmt' : element.TotalCgstAmt,
                'TotalIgst' : element.TotalIgst,
                'IGST' : element.IGST,
                'TotalRate' : element.TotalRate,
                'TotalSgst' : element.TotalSgst,
              };  
              return headingInUpperCase;
            });
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
              XLSX.writeFile(wb, 'salesRegister.xlsx');
              progressBar.close();
            });
          } 
          else{
            alert('Please select one of them Details & Summary');
          }
        }
        
      

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

