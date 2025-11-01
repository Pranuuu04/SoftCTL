import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,  } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-cust-report',
  templateUrl: './cust-report.component.html',
  styleUrls: ['./cust-report.component.css']
})
export class CustReportComponent implements OnInit {

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
  isHidden: boolean = true;

  displayedColumns: any [] = [ 'srNo', 'AwbNo', 'BookDate', 'customer_name', 'Consignee_Name', 'shipperName', 'Origin', 'destination_name', 'Consignee_Pin', 'mode_name', 'Typeofdelivery', 'Qty', 'ActualWt', 'Status',  'InvoiceNo', 'InvValue', 'EwayBill', 'Consignee_Tel', 'vendor_name', 'Ref_No', 'DelvDT', 'DelvTime', 'Remark', 'ExptDateOfDelvDt', 'T_flag', 'TotalAmt' ];

  displayedColumnsSummary: any [] = [ 'srNo', 'customer_name', 'status', 'TotalAwbno', 'total_qty', 'total_actualwt', 'total_rate' ];
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



  constructor(public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              public AllService: AllServicesService) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    // this.sessionLocationCode = (localStorage.getItem('userType') === 'Admin')
    // ? localStorage.getItem('selectedValue')
    // : localStorage.getItem('originCode');
this.customerName = localStorage.getItem('customerCode');
    this.sessionLocationCode = localStorage.getItem('originCode');
    // this.userType = localStorage.getItem('userType');
    // this.destinationName = localStorage.getItem('selectedValue');

    this.dataSource = new MatTableDataSource;
    this.dataSourceSummary = new MatTableDataSource;
    // this.getCustomerData();
   this.AllService.getDestinationData().subscribe((resp: any) => {
      this.destinationList = resp.Data;
    });
    this.getDestinationList();
    const Status$ = [
      { 'status': 'Intransit' },
      { 'status': 'OutForDelivery' },
      { 'status': 'Delivered' },
      { 'status': 'RTO' }
    ];

    this.statusList = Status$.map(item => item.status);

    // this.getStatusData();
    this.customerForm  = this.formBuilder.group({
      // customerName: new FormControl('All', Validators.compose([
      //    Validators.required
      //   ])),
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

  getDestinationList() {
      this.httpService.get(`${environment.apiUrl}Rpt/destinationmast`).then(resp => {
        console.log(resp, 'get Destination');
        this.destinationList = resp.result[0];
      });
  }

  formData: any = {
    destination: '',
    statusName: '',
    fromDate: '',
    toDate: '',
    reportType: '',
  };

  pageCount: number = 1;
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
    this.formData.destination = this.destination;
    this.formData.statusName = this.customerForm.value.statusName;
    this.formData.fromDate = this.fromDate;
    this.formData.toDate = this.toDate;
    this.formData.reportType = this.reportType;
    this.formSubmit(this.formData);
  }
  onStatusChange(event: any) {
    let selectedValues = event.value;

    if (selectedValues.includes('All')) {
      // If "All" is selected, only keep "All"
      this.customerForm.patchValue({ statusName: ['All'] });
    } else {
      // If other options are selected, ensure "All" is removed
      this.customerForm.patchValue({ statusName: selectedValues.filter(value => value !== 'All') });
    }
  }


  formSubmit(formData: any) {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    let statusParam = '';

  if (formData.statusName === 'All') {
    statusParam = 'Status=All';
  } else {
    statusParam = `Status=[${formData.statusName.map(status => `"${status}"`).join(',')}]`;
  }
    this.httpService.get(`${environment.apiUrl}Reports/getStatusReports?customerCode=${this.customerName}&vendorCode=All&destinationCode=${formData.destination}&${statusParam}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&Reporttype=${formData.reportType}&pageNumber=${this.pageIndex + 1}&pageSize=${this.pageSize}` ).then(resp => {
      if ( resp.status === 1) {
        if (formData.reportType === 'StatusDetail') {
          this.openSnackBar(resp.message, 'custom-snackbar')
          this.length = resp.count;
          this.calculatePageCount();
          this.dataSource = resp.Data;
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

        this.httpService.get(`${environment.apiUrl}Reports/getStatusReports?customerCode=${this.customerName}&vendorCode=All&destinationCode=${this.customerForm.value.destination}&${statusParam}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.customerForm.value.fromDate}&toDate=${this.customerForm.value.toDate}&Reporttype=${this.customerForm.value.reportType}&pageNumber=1&pageSize=${this.length}`)
        .then((response: any) => {
          console.log(response, 'xsl download response');
          const dataForExcel = response.Data.map(element => {
          const headingInUpperCase = {
            'Awb No' : element.AwbNo,
            'Book Date' : element.BookDate,
            'Customer Name' : element.customer_name,
            'Consignee Name' : element.Consignee_Name,
            'Shipper_Name' : element.shipperName,
            'Origin Name' : element.Origin,
            'Destination Name' : element.destination_name,
            'Consignee Pin' : element.Consignee_Pin,
            'Mode Name' : element.mode_name,
            'Delivery Type' : element.Typeofdelivery,
            'Qty' : element.Qty,
            'Actual_Wt' : element.ActualWt,
            'Status' : element.Status,
            'Invoice no' : element.InvoiceNo,
            'Inv value' : element.InvValue,
            'Eway bill' : element.EwayBill,
            'Consignee Tel' : element.Consignee_Tel,
            'Vendor Name' : element.vendor_name,
            'Vendor Ref_No' : element.Ref_No,
            'Delivery Date' : element.DelvDT,
            'Delivery Time' : element.DelvTime,
            'Remark' : element.Remark,
            'Exp.Delivery' : element.ExptDateOfDelvDt,
            'CustomerType' : element.T_flag,
            'Amount' : element.TotalAmt,
          };
          return headingInUpperCase;
        });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
          XLSX.writeFile(wb, 'customerStatusDetails.xlsx');
          progressBar.close();
        });
      } else if (this.reportType === 'StatusSummary') {
        const progressBar = this.openprogressbar();
        this.httpService.get(`${environment.apiUrl}Reports/getStatusReports?customerCode=${this.customerForm.value.customerName}&vendorCode=All&destinationCode=${this.customerForm.value.destination}&${statusParam}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.customerForm.value.fromDate}&toDate=${this.customerForm.value.toDate}&Reporttype=${this.customerForm.value.reportType}&1&pageSize=${this.length}`)
        .then((response: any) => {
          console.log(response, 'xsl download response');
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

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.handlePageEvent({
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.length
      });
    });
  }

  openDetails() {
    this.enabledTable = true;
    this.enabledTableSummary = false;
    const commentModal = document.getElementById('comment');
    if (commentModal) {
        commentModal.style.display = 'block';
        commentModal.style.height = '40rem';
        commentModal.style.width = '70rem';
    }
  }

  detailsSelected() {
    this.enabledTable = false;
    this.enabledTableSummary = false;
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }

  setupReport() {
    if (this.reportType === 'StatusDetail') {
      this.openDetails();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sections = [
    {
      name: 'Setup',
      options: [

        { label: 'AwbNo', value: 'AwbNo', checked: true },
        { label: 'BookDate', value: 'BookDate', checked: true },
        { label: 'CustomerName', value: 'customer_name', checked: true },
        { label: 'ConsigneeName', value: 'Consignee_Name', checked: true },
        { label: 'ShipperName', value: 'shipper_Name', checked: true },

        { label: 'Origin', value: 'Origin', checked: true },
        { label: 'Destination', value: 'destination_name', checked: true },
        { label: 'ConsigneePin', value: 'Consignee_Pin', checked: true },
        { label: 'ModeName', value: 'mode_name', checked: true },
        { label: 'DeliveryType', value: 'product_name', checked: true },

        { label: 'Qty', value: 'Qty', checked: true },
        { label: 'ActualWt', value: 'ActualWt', checked: true },
        { label: 'Status', value: 'Status', checked: true },
        { label: 'ConsigneeTel', value: 'Consignee_Tel', checked: true },
        { label: 'VendorName', value: 'vendor_name', checked: true },

        { label: 'VendorRef_No', value: 'Ref_No', checked: true },
        { label: 'DeliveryDate', value: 'DelvDT', checked: true },
        { label: 'DeliveryTime', value: 'DelvTime', checked: true },
        { label: 'ExpectedDelivery', value: 'ExptDateOfDelvDt', checked: true },
        { label: 'CustomerType', value: 'T_flag', checked: true },
        { label: 'TotalAmt', value: 'TotalAmt', checked: true },
      ],
    },
  ]

  handleCheckbox(value: string) {
    const cb1 =  document.getElementById('cb1') as HTMLInputElement;
    const cb2 =  document.getElementById('cb2') as HTMLInputElement;
    const cb3 =  document.getElementById('cb3') as HTMLInputElement;
    const cb4 =  document.getElementById('cb4') as HTMLInputElement;
    const cb5 =  document.getElementById('cb5') as HTMLInputElement;
    const cb6 =  document.getElementById('cb6') as HTMLInputElement;
    const cb7 =  document.getElementById('cb7') as HTMLInputElement;
    const cb8 =  document.getElementById('cb8') as HTMLInputElement;
    const cb9 =  document.getElementById('cb9') as HTMLInputElement;
    const cb10 = document.getElementById('cb10') as HTMLInputElement;
    const cb11 = document.getElementById('cb11') as HTMLInputElement;
    const cb12 = document.getElementById('cb12') as HTMLInputElement;
    const cb13 = document.getElementById('cb13') as HTMLInputElement;
    const cb14 = document.getElementById('cb14') as HTMLInputElement;
    const cb15 = document.getElementById('cb15') as HTMLInputElement;
    const cb16 = document.getElementById('cb16') as HTMLInputElement;
    const cb17 = document.getElementById('cb17') as HTMLInputElement;
    const cb18 = document.getElementById('cb18') as HTMLInputElement;
    const cb19 = document.getElementById('cb19') as HTMLInputElement;
    const cb20 = document.getElementById('cb20') as HTMLInputElement;
    const cb21 = document.getElementById('cb21') as HTMLInputElement;

    const displayElement = document.getElementById('displayValues');

    const cb1Value = cb1.checked;
    const cb2Value = cb2.checked;
    const cb3Value = cb3.checked;
    const cb4Value = cb4.checked;
    const cb5Value = cb5.checked;
    const cb6Value = cb6.checked;
    const cb7Value = cb7.checked;
    const cb8Value = cb8.checked;
    const cb9Value = cb9.checked;
    const cb10Value = cb10.checked;
    const cb11Value = cb11.checked;
    const cb12Value = cb12.checked;
    const cb13Value = cb13.checked;
    const cb14Value = cb14.checked;
    const cb15Value = cb15.checked;
    const cb16Value = cb16.checked;
    const cb17Value = cb17.checked;
    const cb18Value = cb18.checked;
    const cb19Value = cb19.checked;
    const cb20Value = cb20.checked;
    const cb21Value = cb21.checked;

    this.isAwbNoSelected = cb1Value;
    this.isBookDateSelected = cb2Value;
    this.iscustomer_nameSelected = cb3Value;
    this.isConsignee_NameSelected = cb4Value;
    this.isShipeer_NameSelected = cb5Value;
    this.isOriginSelected = cb6Value;
    this.isdestination_nameSelected = cb7Value;
    this.isConsignee_PinSelected = cb8Value;
    this.ismode_nameSelected = cb9Value;
    this.isproduct_nameSelected = cb10Value;
    this.isQtySelected = cb11Value;
    this.isActualWtSelected = cb12Value;
    this.isStatusSelected = cb13Value;
    this.isConsignee_TelSelected = cb14Value;
    this.isvendor_nameSelected = cb15Value;
    this.isRef_NoSelected = cb16Value;
    this.isDelvDTSelected = cb17Value;
    this.isDelvTimeSelected = cb18Value;
    this.isExptDateOfDelvDtSelected = cb19Value;
    this.isT_flagSelected = cb20Value;
    this.isTotalAmtSelected = cb21Value;

    displayElement.innerHTML = `Selected values:
                                ${cb1Value ? 'AwbNo' : ''}   ${cb2Value ? 'BookDate' : ''}
                                ${cb3Value ? 'customer_name' : ''} ${cb4Value ? 'Consignee_Name' : ''}
                                ${cb5Value ? 'shipper_Name' : ''} ${cb6Value ? 'Origin' : ''}
                                ${cb7Value ? 'destination_name' : ''} ${cb8Value ? 'Consignee_Pin' : ''}
                                ${cb9Value ? 'mode_name' : ''} ${cb10Value ? 'product_name' : ''}
                                ${cb11Value ? 'Qty' : ''} ${cb12Value ? 'ActualWt' : ''}
                                ${cb13Value ? ' Status' : ''} ${cb14Value ? 'Consignee_Tel' : ''}
                                ${cb15Value ? 'vendor_name' : ''} ${cb16Value ? 'Ref_No' : ''}
                                ${cb17Value ? 'DelvDT' : ''} ${cb18Value ? 'DelvTime' : ''}
                                ${cb19Value ? 'ExptDateOfDelvDt' : ''} ${cb20Value ? 'T_flag' : ''}
                                ${cb21Value ? 'TotalAmt' : ''} `;

    if (cb1.checked) {
      this.sendDataToAPI('AwbNo', false);
    } else {
      this.sendDataToAPI('AwbNo', true);
    }

    if (cb2.checked) {
      this.sendDataToAPI('BookDate', true);
    } else {
      this.sendDataToAPI('BookDate', false);
    }

    if (cb3.checked) {
      this.sendDataToAPI('customer_name', true);
    } else {
      this.sendDataToAPI('customer_name', false);
    }

    if (cb4.checked) {
        this.sendDataToAPI('Consignee_Name', true);
    } else {
      this.sendDataToAPI('Consignee_Name', false);
    }

    if (cb5.checked) {
      this.sendDataToAPI('shipper_Name', true);
    } else {
      this.sendDataToAPI('shipper_Name', false);
    }

    if (cb6.checked) {
        this.sendDataToAPI('Origin', true);
    } else {
      this.sendDataToAPI('Origin', false);
    }

    if (cb7.checked) {
      this.sendDataToAPI('destination_name', true);
    } else {
      this.sendDataToAPI('destination_name', false);
    }

    if (cb8.checked) {
      this.sendDataToAPI('Consignee_Pin', true);
    } else {
      this.sendDataToAPI('Consignee_Pin', false);
    }

    if (cb9.checked) {
      this.sendDataToAPI('mode_name', true);
    } else {
      this.sendDataToAPI('mode_name', false);
    }

    if (cb10.checked) {
      this.sendDataToAPI('product_name', true);
    } else {
      this.sendDataToAPI('product_name', false);
    }

    if (cb11.checked) {
      this.sendDataToAPI('Qty', true);
    } else {
      this.sendDataToAPI('Qty', false);
    }
    if (cb12.checked) {
      this.sendDataToAPI('ActualWt', true);
    } else {
      this.sendDataToAPI('ActualWt', false);
    }

    if (cb13.checked) {
      this.sendDataToAPI('Status', true);
    } else {
      this.sendDataToAPI('Status', false);
    }

    if (cb14.checked) {
      this.sendDataToAPI('Consignee_Tel', true);
    } else {
      this.sendDataToAPI('Consignee_Tel', false);
    }

    if (cb15.checked) {
      this.sendDataToAPI('vendor_name', true);
    } else {
      this.sendDataToAPI('vendor_name', false);
    }

    if (cb16.checked) {
      this.sendDataToAPI('Ref_No', true);
    } else {
      this.sendDataToAPI('Ref_No', false);
    }

    if (cb17.checked) {
      this.sendDataToAPI('DelvDT', true);
    } else {
      this.sendDataToAPI('DelvDT', false);
    }

    if (cb18.checked) {
      this.sendDataToAPI('DelvTime', true);
    } else {
      this.sendDataToAPI('DelvTime', false);
    }

    if (cb19.checked) {
      this.sendDataToAPI('ExptDateOfDelvDt', true);
    } else {
      this.sendDataToAPI('ExptDateOfDelvDt', false);
    }

    if (cb20.checked) {
      this.sendDataToAPI('T_flag', true);
    } else {
      this.sendDataToAPI('T_flag', false);
    }

    if (cb21.checked) {
      this.sendDataToAPI('TotalAmt', true);
    } else {
      this.sendDataToAPI('TotalAmt', false);
    }
  }

  sendDataToAPI(value, isChecked) {
    console.log(`Sending data: ${value} is checked: ${isChecked}`);
  }

  CloseDialog() {
    document.getElementById('comment').style.display = 'none'
  }
}
