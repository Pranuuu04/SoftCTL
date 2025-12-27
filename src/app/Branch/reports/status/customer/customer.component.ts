import { Component,  ElementRef,  OnInit,  TemplateRef,  ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,  } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AllServicesService } from 'app/service/all-services.service';
import { SetupReportComponent } from 'app/Branch/Shared/report_pages/setup-report/setup-report.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit {

  @ViewChild('TABLE', { read: ElementRef }) table: ElementRef;
  @ViewChild('TABLESummary', { read: ElementRef }) tableSummary: ElementRef;

  selectcol1: any;
  selectedColumns: any;
  firstOfMonth: any;
  currentDate: any;
  customerList: any;
  destinationList: any;
  customerForm: FormGroup;
  sessionLocationCode: any;
  yourDataArray: any;
  enabledTable = false;
  enabledTableSummary = false;
  statusList: any[] = [];
  StatusDetail: any;
  reportType: any = 'StatusDetail';
  fromDate: any;
  toDate: any;
  customerName: any = 'All';
  destination: any = 'All';
  statusName: any = 'All';

  length: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  validationMessage: {
    status: { type: string; message: string; }[];
    remark: { type: string; message: string; }[];
    AWB: { type: string; message: string; }[];
  };
  isHidden = true;
displayedColumns: string[] = ['index'];

customerColumnMapping: { [key: string]: string } = {
  BookDate: 'Book Date',
  ManifestDate: 'Manifest Date',
  AwbNo: 'AWB No',
  manifestNo: 'Manifest No',
  customer_name: 'Customer Name',
  shipperName: 'Shipper Name',
  Consignee_Name: 'Consignee Name',
  Origin: 'Origin',
  destination_name: 'Destination',
  consigneePin: 'Consignee Pin',
  mode_name: 'Mode',
  product_name: 'Product',
  T_flag: 'Customer Type',
  Qty: 'Quantity',
  ActualWt: 'Actual Weight',
  VolumetricWt: 'Volumetric Weight',
  Status: 'Status',
  DelvDT: 'Delivery Date',
  DelvTime: 'Delivery Time',
  ExptDateOfDelvDt: 'Expected Delivery',
  RecvName: 'Receiver Name',
  ContactNo: 'Contact Number',
  RecvNature: 'Nature Of Receipt',
  recvremark: 'Remark',
  DrsNo: 'DRS No',
  drsdt: 'DRS Date',
  Pickup_Boy: 'Delivery Name',
  InvoiceNo: 'Invoice No',
  InvValue: 'Invoice Value',
  EwayBill: 'E-way Bill',
  Consignee_Tel: 'Consignee Tel',
  vendor_name: 'Vendor Name',
  Ref_No: 'Vendor Ref No'
};
alwaysVisibleColumns: string[] = [
  'BookDate',
  'AwbNo',
  'customer_name',
  'shipperName',
  'Consignee_Name',
  'Origin',
  'destination_name',
  'mode_name',
  'product_name',
  'T_flag',
  'Qty',
  'Status',
  'DelvDT'
];
masterColumnOrder: string[] = [
  'index',
  'BookDate',
  'ManifestDate',
  'AwbNo',
  'manifestNo',
  'customer_name',
  'shipperName',
  'Consignee_Name',
  'Origin',
  'destination_name',
  'consigneePin',
  'mode_name',
  'product_name',
  'T_flag',
  'Qty',
  'ActualWt',
  'VolumetricWt',
  'Status',
  'DelvDT',
  'DelvTime',
  'ExptDateOfDelvDt',
  'RecvName',
  'ContactNo',
  'RecvNature',
  'recvremark',
  'DrsNo',
  'drsdt',
  'Pickup_Boy',
  'InvoiceNo',
  'InvValue',
  'EwayBill',
  'Consignee_Tel',
  'vendor_name',
  'Ref_No'
];

  displayedColumnsSummary: any [] = [ 'index', 'customer_name', 'status', 'TotalAwbno', 'total_qty', 'total_actualwt', 'total_rate' ];
  dataSource  = new MatTableDataSource();
  dataSourceSummary  = new MatTableDataSource();

  @ViewChild('comment') commentTemplate: TemplateRef<any>;
  isAwbNoSelected = true;
  isBookDateSelected = true;
  iscustomer_nameSelected = true;
  isConsignee_NameSelected = true;
  isShipeer_NameSelected = true;
  isOriginSelected = true;
  isdestination_nameSelected = true;
  isConsignee_PinSelected = true;
  ismode_nameSelected = true;
  isproduct_nameSelected = true;
  isQtySelected = true;
  isActualWtSelected = true;
  isStatusSelected = true;
  isConsignee_TelSelected = true;
  isvendor_nameSelected = true;
  isRef_NoSelected = true;
  isDelvDTSelected = true;
  isDelvTimeSelected = true;
  isExptDateOfDelvDtSelected = true;
  isT_flagSelected = true;
  isTotalAmtSelected = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  destinationName: string;
  userType: string;
  formData: any = {
    customerName: '',
    destination: '',
    statusName: '',
    fromDate: '',
    toDate: '',
    reportType: '',
  };

  pageCount = 1;
isLoading = false;

  constructor(public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              public AllService: AllServicesService) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.sessionLocationCode = (localStorage.getItem('userType') === 'Admin')
    ? localStorage.getItem('selectedValue')
    : localStorage.getItem('originCode');
    this.userType = localStorage.getItem('userType');
    this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
           const allCust = { customerName: 'All', customerCode: 'All' };
            this.customerList = [allCust, ...resp.Data];
          this.customerForm.patchValue({ customerName: 'All' });
        });
    this.AllService.getDestinationData().subscribe((resp: any) => {
        if (this.userType === 'Admin') {
             const allDest = { destinationName: 'All', destinationCode: 'All' };
            this.destinationList = [allDest, ...resp.Data];
          this.customerForm.patchValue({ destination: 'All' });
        } else {
           this.destinationList = resp.Data;
        }
    });
    this.dataSource = new MatTableDataSource;
    this.dataSourceSummary = new MatTableDataSource;
    const Status$ = [
      { 'status': 'Intransit' },
      { 'status': 'OutForDelivery' },
      { 'status': 'Delivered' },
      { 'status': 'RTO' }
    ];

    this.statusList = Status$.map(item => item.status);

    // this.getStatusData();
    this.customerForm  = this.formBuilder.group({
      customerName: new FormControl('All', Validators.compose([
         Validators.required
        ])),
        statusName: new FormControl(['All'], Validators.compose([
        Validators.required
      ])),
      destination: new FormControl('All', Validators.compose([ ])),
      reportType: new FormControl('StatusDetail', Validators.compose([ ])),
      fromDate: new FormControl('', Validators.compose([ ])),
      toDate: new FormControl('', Validators.compose([ ])),
    });
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
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
    console.log(this.pageIndex, 'pageindex');
    this.calculatePageCount();
    this.formData.customerName = this.customerForm.value.customerName;
    this.formData.destination = this.customerForm.value.destination;
    this.formData.statusName = this.customerForm.value.statusName;
    this.formData.fromDate = this.customerForm.value.fromDate;
    this.formData.toDate = this.customerForm.value.toDate;
    this.formData.reportType = this.customerForm.value.reportType;
    this.formSubmit(this.formData);
  }
  onStatusChange(event: any) {
    const selectedValues = event.value;

    if (selectedValues.includes('All')) {
      // If "All" is selected, only keep "All"
      this.customerForm.patchValue({ statusName: ['All'] });
    } else {
      // If other options are selected, ensure "All" is removed
      this.customerForm.patchValue({ statusName: selectedValues.filter(value => value !== 'All') });
    }
  }


  formSubmit(formData: any) {
    this.isLoading = true;
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    let statusParam = '';

  if (formData.statusName === 'All') {
    statusParam = 'Status=All';
  } else {
    statusParam = `Status=[${formData.statusName.map(status => `"${status}"`).join(',')}]`;
  }
 if (formData.reportType === 'StatusDetail') {
    this.AllService.getReportSetup('getstatusReportSetup').subscribe((setupResp: any) => {
      if (setupResp.status === 1 && setupResp.Data.length) {
        const setup = setupResp.Data[0];
        const selectedKeys = Object.keys(setup).filter(k => setup[k] === 1);
           let finalCols = [
          'index',
          ...this.alwaysVisibleColumns,
          ...selectedKeys
        ];

        this.displayedColumns = finalCols.sort(
          (a, b) => this.masterColumnOrder.indexOf(a) - this.masterColumnOrder.indexOf(b)
        );
      }
    });
  }
    this.httpService.get(`${environment.apiUrl}Reports/getStatusReports?customerCode=${formData.customerName}&vendorCode=All&destinationCode=${formData.destination}&${statusParam}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&Reporttype=${formData.reportType}&pageNumber=${this.pageIndex + 1}&pageSize=${this.pageSize}` ).then(resp => {
      if ( resp.status === 1) {
         this.isLoading = false;
        if (formData.reportType === 'StatusDetail') {
          this.dataSource = resp.Data;
          this.length = resp.count;
          this.openSnackBar(resp.message, 'custom-snackbar')
          this.calculatePageCount();
          this.enabledTable = true;
          this.enabledTableSummary = false;
        } else {
          this.openSnackBar(resp.message, 'custom-snackbar')
          this.length = resp.count;
          this.calculatePageCount();
          this.dataSourceSummary = resp.Data;
          this.enabledTableSummary = true;
          this.enabledTable = false;
        }
      } else {
        this.openSnackBar(resp.message, 'error-snackbar')
        this.enabledTable = false;
        this.enabledTableSummary  = false;
      this.isLoading = false; 
      }
    }).catch(() => {
      this.isLoading = false;
      this.openSnackBar('Something went wrong', 'error-snackbar');
    });
  //  });
  }
  getConfigurableColumns() {
  return this.masterColumnOrder.filter(
    key => !this.alwaysVisibleColumns.includes(key) && key !== 'index'
  );
}
getConfigurableColumnMapping() {
  const obj: any = {};
  this.getConfigurableColumns().forEach(col => {
    if (this.customerColumnMapping[col]) {
      obj[col] = this.customerColumnMapping[col];
    }
  });
  return obj;
}
openSetup() {
  const dialogRef = this.dialog.open(SetupReportComponent, {
    data: {
      action: 'add',
        inputName: 'getstatusReportSetup',
        // columnMapping: this.customerColumnMapping,
        saveApi: 'StatusReportSetup',
      columnMapping: this.getConfigurableColumnMapping()
    },
    width: '45rem',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(selected => {
    let finalList = [
      'index',
      ...this.alwaysVisibleColumns,
      ...(selected || [])
    ];

    this.displayedColumns = finalList.sort(
      (a, b) => this.masterColumnOrder.indexOf(a) - this.masterColumnOrder.indexOf(b)
    );

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

  downloadSample() {
    const isConfirmed = window.confirm('Do you want to download the Excel file?');
    if (isConfirmed) {
      let statusParam = '';

        if (this.customerForm.value.statusName === 'All') {
          statusParam = 'Status=All';
        } else {
          statusParam = `Status=[${this.customerForm.value.statusName.map(status => `"${status}"`).join(',')}]`;
        }
      if (this.reportType === 'StatusDetail') {
        const progressBar = this.openprogressbar();

        this.httpService.get(`${environment.apiUrl}Reports/getStatusReports?customerCode=${this.customerForm.value.customerName}&vendorCode=All&destinationCode=${this.customerForm.value.destination}&${statusParam}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.customerForm.value.fromDate}&toDate=${this.customerForm.value.toDate}&Reporttype=${this.customerForm.value.reportType}&pageNumber=1&pageSize=${this.length}`)
        .then((response: any) => {
         if (response.status === 1) {
            const dataForExcel = response.Data.map((element: any, index: number) => {
              const row: any = { Index: index + 1 };
              this.displayedColumns.forEach(colKey => {
                if (colKey !== 'index') {
                  const header = this.customerColumnMapping[colKey] || colKey;
                  row[header] = element[colKey];
                }
              });
              return row;
            });

            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
            XLSX.writeFile(wb, 'customerStatusDetails.xlsx');
          } else {
            this.openSnackBar(response.message, 'error-snackbar');
          }
          progressBar.close();
        });
      } else if (this.reportType === 'StatusSummary') {
        const progressBar = this.openprogressbar();
        this.httpService.get(`${environment.apiUrl}Reports/getStatusReports?customerCode=${this.customerForm.value.customerName}&vendorCode=All&destinationCode=${this.customerForm.value.destination}&${statusParam}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.customerForm.value.fromDate}&toDate=${this.customerForm.value.toDate}&Reporttype=${this.customerForm.value.reportType}&1&pageSize=${this.length}`)
        .then((response: any) => {
          const dataForExcel = response.Data.map(element => {
          const headingInUpperCase = {
            'Customer_Name' : element.customer_name,
            'Status' : element.status,
            'Total Awb No' : element.TotalAwbno,
            'Total Quantity ' : element.total_qty,
            'Total Actual Weight' : element.total_actualwt,
            'Total Rate' : element.total_rate,
          };
          return headingInUpperCase;
        });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
          XLSX.writeFile(wb, 'customerStatusSummary.xlsx');
          progressBar.close();
        });
      } else {
        this.openSnackBar( 'Please select one of them Details & Summary', 'error-snackbar');
      }
    }
  }

  generatePdf() {
    const doc = new jsPDF();
    const element = document.getElementById('genPDF');
      if (element) {
        html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = '<iframe width=\'100%\' height=\'100%\' src=\'' + pdfUrl + '\'></iframe>';
        const x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
      });
    } else {
      console.error('Element not found.');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
