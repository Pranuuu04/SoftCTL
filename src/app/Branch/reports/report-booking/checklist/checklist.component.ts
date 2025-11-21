import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { SetupReportComponent } from 'app/Branch/Shared/report_pages/setup-report/setup-report.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {

  customerList: any;
  modeList: any;
  destinationList: any;
  vendorList: any;
  sessionLocationCode: any;
  checkListForm: FormGroup;
  enabledTableCustDetails = false;
  enabledTableCustSummary = false;
  enabledTableVendorDetails = false;
  enabledTableVendorSummary = false;
  selectedColumns: any;

  reportType: any = 'StatementDetails';
  bookingType: any = 'Checklistcust';
  isHidden = true;

  fromDate: any;
  toDate: any;
  customerName: any = 'All';
  destination: any = 'All';
  custType: any = 'All';
  vendorName: any = 'All';
  modeName: any = 'All';

  length: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;

  @ViewChild('commentCustDetails') commentTemplate: TemplateRef<any>;

  formData: any = {
    customerName: '',
    vendorName: '',
    modeName: '',
    destination: '',
    reportType: '',
    bookingType: '',
    custType: '',
    fromDate: '',
    toDate: '',
  };

  pageCount = 1;
 @ViewChild('commentCustSummary') commentTemplateBookSummary: TemplateRef<any>;

 @ViewChild('commentVendorDetails') commentTemplateManifestDetails: TemplateRef<any>;

 @ViewChild('commentVendorSummary') commentTemplateManifestSummary: TemplateRef<any>;

displayedColumnsBookingDetails: any [] = [ 'index' ];
statementMasterOrder = [
  'Bookdate',
  'ManifestDate',
  'awbno',
  'manifestNo',
  'customer_name',
  'GSTNo',
  'shipper_name',
  'Shipper_gstNo',
  'consignee_name',
  'Consignee_GST',
  'Origin',
  'Destination',
  'Customer_type',
  'ModeName',
  'ProductName',
  'Pcs',
  'ActualWeight',
  'volumetricwt',
  'chargedwt',
  'rateperkg',
  'rate',
  'docketchrgs',
  'fov_chrgs',
  'oda_chrgs',
  'charges1',
  'charges2',
  'charges3',
  'FuelPer',
  'fuelcharges',
  'othercharges',
  'cafcharges',
  'HDP_Chrgs',
  'essamt',
  'idccharges',
  'ENS_Chrgs',
  'SC_Chrgs',
  'charges4',
  'charges5',
  'charges6',
  'charges7',
  'charges8',
  'charges9',
  'charges10',
  'GSTPer',
  'igst',
  'cgst',
  'sgst',
  'TotalAmt',
  'vendor_name',
  'Ref_No',
  'InvoiceNo',
  'invvalue',
  'EwayBill'
];

columnHeaderMap = {
  Bookdate: 'Book Date',
  ManifestDate: 'MFT Date',
  awbno: 'AWB No',
  manifestNo: 'MFT No',
  customer_name: 'Customer Name',
  GSTNo: 'Customer GST',
  shipper_name: 'Shipper Name',
  Shipper_gstNo: 'Shipper GST',
  consignee_name: 'Consignee Name',
  Consignee_GST: 'Consignee GST',
  Origin: 'Origin',
  Destination: 'Destination',
  Customer_type: 'Customer Type',
  ModeName: 'Mode',
  ProductName: 'Product',
  Pcs: 'Pcs',
  ActualWeight: 'Actual Wt',
  volumetricwt: 'Vol. Wt',
  chargedwt: 'Charged Wt',
  rateperkg: 'Rate Per Kg',
  rate: 'Rate',
  docketchrgs: 'Docket Charges',
  fov_chrgs: 'FOV Chrgs',
  oda_chrgs: 'ODA Chrgs',
  charges1: 'Charges 1',
  charges2: 'Charges 2',
  charges3: 'Charges 3',
  FuelPer: 'Fuel %',
  fuelcharges: 'Fuel Charges',
  othercharges: 'Other Charges',
  cafcharges: 'CAF Charges',
  HDP_Chrgs: 'HDP Charges',
  essamt: 'ESS Amount',
  idccharges: 'IDC Charges',
  ENS_Chrgs: 'ENS Charges',
  SC_Chrgs: 'SC Charges',
  charges4: 'Charges 4',
  charges5: 'Charges 5',
  charges6: 'Charges 6',
  charges7: 'Charges 7',
  charges8: 'Charges 8',
  charges9: 'Charges 9',
  charges10: 'Charges 10',
  GSTPer: 'GST %',
  igst: 'IGST',
  cgst: 'CGST',
  sgst: 'SGST',
  TotalAmt: 'Total Amount',
  vendor_name: 'Vendor Name',
  Ref_No: 'Reference No',
  InvoiceNo: 'Invoice No',
  invvalue: 'Invoice Value',
  EwayBill: 'E-Way Bill'
};


alwaysVisibleColumns_Statement = [
  'Bookdate',
  'awbno',
  'customer_name',
  'shipper_name',
  'consignee_name',
  'Origin',
  'Destination',
  'ModeName',
  'ProductName',
  'Pcs',
  'ActualWeight'
];

  dataSourceBookingDetails  = new MatTableDataSource();

 displayedColumnsBookingSummary: string[] = [
  'srNo',
  'customer_name',
  'locationName',
  'TotalAwbno',
  'total_qty',
  'total_actualwt',
  'total_rate',
  'total_chargedwt',
  'total_fov_chrgs',
  'total_fuelcharges',
  'total_docketchargs',
  'total_essamt',
  'total_oda_chrgs',
  'total_idccharges',
  'total_cafcharges',
  'total_othercharges',
  'total_charges1',
  'total_charges2',
  'total_charges3',
  'total_charges4',
  'total_carges5',
  'total_charges6',
  'total_charges7',
  'total_charges8',
  'total_charges9',
  'total_charges10',
  'total_igst',
  'total_sgst',
  'total_cgst',
  'total_serviceTax',
  'total_totalamt',
  'total_vpp'
];


  dataSourceBookingSummary  = new MatTableDataSource();

  displayedColumnsManifestDetails: any [] = [ 'index'];

  displayedColumnsManifestSummary: any [] = [ 'srNo', 'Awbcount', 'Vendor', 'Pcs', 'SumofRate',
    'SumofActualWeight',
    'SumofVolumetricWt',

    'SumofCafCharges',
    'SumofCodcharges',
    'SumofDocketCharges',
    'SumofFovCharges',
    'SumofFuelcharges',
    'SumofOdacharges',
    'SumofIdcCharges',
    'SumofVtccharges',
    'SumofOtherCharges',

    'SumofChargeWeight',
    'SumofCharges1',
    'SumofCharges2',
    'SumofCharges3',
    'Sumofcharges4',
    'SumofCharges5',
    'Sumofcharges6',
    'SumofCharges7',
    'Sumofcharges8',
    'Sumofcharges9',
    'SumofCharges10',

    'SumofEssAmt',
    'SumofInvalue',

    'SumofVendorchargewt',

    'Sumofvcharges',
    'Sumofvcharges1',
    'Sumofvcharges2',
    'SumofVcharges4',
    'Sumofvcharges6',

    'Sumofvendorwt',

    'Sumofreceiveamt',
    'SumofIgst',
    'Sumofcgst',
    'Sumofsgst',
    'SumofServiceTax',
    'SumofReceivedtotal',

  ];

  dataSourceManifestDetails  = new MatTableDataSource();
  dataSourceManifestSummary  = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public httpService: HttpService,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private AllService: AllServicesService,
              private bookingService: BookingService) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.sessionLocationCode = (localStorage.getItem('userType') === 'Admin')
    ? localStorage.getItem('selectedValue')
    : localStorage.getItem('originCode');
    this.dataSourceBookingDetails = new MatTableDataSource;
    this.dataSourceBookingSummary = new MatTableDataSource;
    this.dataSourceManifestDetails = new MatTableDataSource;
    this.dataSourceManifestSummary = new MatTableDataSource;

    this.bookingService.getMode().subscribe((resp: any) => {
     this.modeList = resp.Data;
    });
    this.bookingService.getVendor().subscribe((resp: any) => {
      this.vendorList = resp.Data;
    });
    this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
     this.customerList = resp.Data;
    });
    this.AllService.getDestinationData().subscribe((resp: any) => {
      this.destinationList = resp.Data;
    });
    this.checkListForm  = this.formBuilder.group({
      customerName: new FormControl('', Validators.compose([
         Validators.required
      ])),
      vendorName: new FormControl('', Validators.compose([
        Validators.required
     ])),
      modeName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      destination: new FormControl('', Validators.compose([ ])),
      reportType: new FormControl('', Validators.compose([ ])),
      bookingType: new FormControl('', Validators.compose([ ])),
      fromDate: new FormControl('', Validators.compose([ ])),
      toDate: new FormControl('', Validators.compose([ ])),
    });
  }

  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
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

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  formSubmit(formData: any) {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // });
if (formData.reportType === 'StatementDetails') {
    this.AllService.getReportSetup('getStatementReportSetup').subscribe((setupResp: any) => {
      if (setupResp.status === 1 && setupResp.Data.length) {
        const setup = setupResp.Data[0];
        const selectedKeys = Object.keys(setup).filter(k => setup[k] === 1);
        let finalColumns = [
          'index',
          ...this.alwaysVisibleColumns_Statement,
          ...selectedKeys
        ];

        finalColumns = finalColumns.filter((v, i, arr) => arr.indexOf(v) === i);
          finalColumns = finalColumns.sort(
            (a, b) =>
              this.statementMasterOrder.indexOf(a) -
              this.statementMasterOrder.indexOf(b)
          );
          this.displayedColumnsBookingDetails = finalColumns;
          this.displayedColumnsManifestDetails = finalColumns;
      }
    });
  }
    if (this.bookingType === 'Checklistcust') {
      this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=${formData.customerName}&vendorCode=All&destinationCode=${formData.destination}&clientType=All&productCode=All&modeCode=${this.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&Reporttype=${this.reportType}&typeWise=bookDate&pageNumber=${this.pageIndex + 1}&pageSize=${this.pageSize}`).then(resp => {
        console.log(resp);
        if ( resp.status === 1) {
          if (this.reportType === 'StatementDetails') {
              this.dataSourceBookingDetails = resp.Data;
              this.openSnackBar(resp.message, 'custom-snackbar');
              this.length = resp.count;
              this.calculatePageCount();
               const chargesRow = resp.Data[0];

                for (let i = 1; i <= 10; i++) {
                  const txtKey = 'txtCharges' + i;
                  const valKey = 'charges' + i;

                  if (chargesRow[txtKey]) {
                    this.columnHeaderMap[valKey] = chargesRow[txtKey];
                  }
                }
              this.enabledTableCustDetails = true;
              this.enabledTableVendorDetails = false;
              this.enabledTableCustSummary = false;
              this.enabledTableVendorSummary = false;
          } else {
            this.dataSourceBookingSummary = resp.Data;
            this.openSnackBar(resp.message, 'custom-snackbar');
            this.length = resp.count;
            this.calculatePageCount();
            this.enabledTableCustSummary = true;
            this.enabledTableVendorSummary = false;
            this.enabledTableCustDetails = false;
            this.enabledTableVendorDetails = false;
          }
        }
      })
    } else if (this.bookingType === 'Checklistvendor') {
      this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=${formData.customerName}&vendorCode=${formData.vendorName}&destinationCode=${formData.destination}&clientType=All&productCode=All&modeCode=${this.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&Reporttype=${this.reportType}&typeWise=bookDate&pageNumber=${this.pageIndex + 1}&pageSize=${this.pageSize}`).then(resp => {
        console.log(resp);
        if ( resp.status === 1) {
          if (this.reportType === 'StatementDetails') {
              this.dataSourceManifestDetails = resp.Data;
              this.openSnackBar(resp.message, 'custom-snackbar');
              this.length = resp.count;
              this.calculatePageCount();
               const chargesRow = resp.Data[0];

                for (let i = 1; i <= 10; i++) {
                  const txtKey = 'txtCharges' + i;
                  const valKey = 'charges' + i;

                  if (chargesRow[txtKey]) {
                    this.columnHeaderMap[valKey] = chargesRow[txtKey];
                  }
                }
              this.enabledTableVendorDetails = true;
              this.enabledTableCustDetails = false;
              this.enabledTableCustSummary = false;
              this.enabledTableVendorSummary = false;
          } else {
            this.dataSourceBookingSummary = resp.Data;
            this.openSnackBar(resp.message, 'custom-snackbar');
            this.length = resp.count;
            this.calculatePageCount();
            this.enabledTableVendorSummary = false;
              this.enabledTableCustSummary = true;
              this.enabledTableCustDetails = false;
              this.enabledTableVendorDetails = false;
          }
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      })
    }

  }
 getConfigurableColumns() {
  return this.statementMasterOrder.filter(
    key => !this.alwaysVisibleColumns_Statement.includes(key) && key !== 'index'
  );
}
getConfigurableColumnMapping() {
  const obj: any = {};
  this.getConfigurableColumns().forEach(col => {
    if (this.columnHeaderMap[col]) {
      obj[col] = this.columnHeaderMap[col];
    }
  });
  return obj;
}
     openSetup () {
        const dialogRef = this.dialog.open(SetupReportComponent, {
          data: {
            action: 'add',
            inputName: 'getStatementReportSetup',
            columnMapping: this.columnHeaderMap,
          saveApi: 'StatementReportSetup'
          },
          width: '85rem',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe((selectedKeys: string[]) => {
        if (selectedKeys && selectedKeys.length) {
                 let finalColumns = [
            'index',
            ...this.alwaysVisibleColumns_Statement,
            ...selectedKeys
          ];

          // remove duplicates
          finalColumns = finalColumns.filter((v, i, arr) => arr.indexOf(v) === i);
           finalColumns = finalColumns.sort(
            (a, b) =>
              this.statementMasterOrder.indexOf(a) -
              this.statementMasterOrder.indexOf(b)
          );
          this.displayedColumnsBookingDetails = finalColumns;
          this.displayedColumnsManifestDetails = finalColumns;
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

  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.calculatePageCount();
    this.formData.customerName = this.customerName;
    this.formData.vendorName = this.vendorName;
    this.formData.modeName = this.modeName;
    this.formData.destination = this.destination;
    this.formData.custType = this.custType;
    this.formData.fromDate = this.fromDate;
    this.formData.toDate = this.toDate;
    this.formData.reportType = this.reportType;
    this.formSubmit(this.formData);
  }

  downloadSample() {
     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       width: '22rem',
       data: { message: 'Do you want to download the Excel file?' }
     });
     dialogRef.afterClosed().subscribe(result => {
           if (result) {
     if (this.bookingType === 'Checklistcust') {
      if (this.reportType === 'StatementDetails') {
        const progressBar = this.openprogressbar();
        this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=${this.checkListForm.value.customerName}&vendorCode=All&destinationCode=${this.checkListForm.value.destination}&clientType=All&productCode=All&modeCode=${this.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.checkListForm.value.fromDate}&toDate=${this.checkListForm.value.toDate}&Reporttype=${this.reportType}&typeWise=bookDate&pageNumber=1&pageSize=${this.length}`).then((response: any) => {
        if (response.status === 1) {
          const dataForExcel = response.Data.map((element: any, index: number) => {
            const row: any = { Index: index + 1 };
            this.displayedColumnsBookingDetails.forEach(colKey => {
              if (colKey !== 'index') {
                const header = this.columnHeaderMap[colKey] || colKey;
                row[header] = element[colKey];
              }
            });
            return row;
          });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
          XLSX.writeFile(wb, 'checklistReport.xlsx');
        } else {
          this.openSnackBar(response.message, 'error-snackbar');
        }
        progressBar.close();
      });
      } else {
          const progressBar = this.openprogressbar();
         this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=${this.checkListForm.value.customerName}&vendorCode=All&destinationCode=${this.checkListForm.value.destination}&clientType=All&productCode=All&modeCode=${this.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.checkListForm.value.fromDate}&toDate=${this.checkListForm.value.toDate}&Reporttype=${this.reportType}&typeWise=bookDate&pageNumber=1&pageSize=${this.length}`).then((response: any) => {
            console.log(response, 'xsl download response bookdate summary');
            const dataForExcel = response.Data.map(element => {
            const headingInUpperCase = {
              'customer_name': element.customer_name,
              'total_actualwt': element.total_actualwt,
              'total_cafcharges': element.total_cafcharges,
              'total_carges5': element.total_carges5,
              'total_cgst': element.total_cgst,
              'total_chargedwt': element.total_chargedwt,
              'total_charges1': element.total_charges1,
              'total_charges2': element.total_charges2,
              'total_charges3': element.total_charges3,
              'total_charges4': element.total_charges4,
              'total_charges6': element.total_charges6,
              'total_charges7': element.total_charges7,
              'total_charges8': element.total_charges8,
              'total_charges9': element.total_charges9,
              'total_charges10': element.total_charges10,
              'total_docketchargs': element.total_docketchargs,
              'total_essamt': element.total_essamt,
              'total_fov_chrgs': element.total_fov_chrgs,
              'total_fuelcharges': element.total_fuelcharges,
              'total_idccharges': element.total_idccharges,
              'total_igst': element.total_igst,
              'total_oda_chrgs': element.total_oda_chrgs,
              'total_othercharges': element.total_othercharges,
              'total_qty': element.total_qty,
              'total_rate': element.total_rate,
              'total_serviceTax': element.total_serviceTax,
              'total_sgst': element.total_sgst,
              'total_totalamt': element.total_totalamt,
              'total_vpp': element.total_vpp
            };
            return headingInUpperCase;
          });
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
            XLSX.writeFile(wb, 'custCheckListSummary.xlsx');
            progressBar.close();
          });
      }
     } else if (this.bookingType === 'Checklistvendor') {
      if (this.reportType === 'StatementDetails') {
        const progressBar = this.openprogressbar();
       this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=${this.checkListForm.value.customerName}&vendorCode=All&destinationCode=${this.checkListForm.value.destination}&clientType=All&productCode=All&modeCode=${this.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.checkListForm.value.fromDate}&toDate=${this.checkListForm.value.toDate}&Reporttype=${this.reportType}&typeWise=bookDate&pageNumber=1&pageSize=${this.length}`).then((response: any) => {
          if (response.status === 1) {
            const dataForExcel = response.Data.map((element: any, index: number) => {
              const row: any = { Index: index + 1 };
              this.displayedColumnsManifestDetails.forEach(colKey => {
                if (colKey !== 'index') {
                  const header = this.columnHeaderMap[colKey] || colKey;
                  row[header] = element[colKey];
                }
              });
              return row;
            });
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
            XLSX.writeFile(wb, 'coCorrierCheckDetails.xlsx');
          } else {
            this.openSnackBar(response.message, 'error-snackbar');
          }
          progressBar.close();
        });
        //   console.log(response, 'xsl download response manifest bookdetails');
        //   const dataForExcel = response.Data.map(element => {
        //   const headingInUpperCase = {
        //     'ModeName': element.ModeName,
        //     'locationName': element.locationName,
        //     'ProductName': element.ProductName,
        //     'Bookdate': element.Bookdate,
        //     'awbno': element.awbno,
        //     'customer_name': element.customer_name,
        //     'consignee_name': element.consignee_name,
        //     'consigneePin': element.consigneePin,
        //     'consigneeState': element.consigneeState,
        //     'manifestNo': element.manifestNo,
        //     'ManifestDate': element.ManifestDate,
        //     'vendor_name': element.vendor_name,
        //     'Ref_No': element.Ref_No,
        //     'Origin': element.Origin,
        //     'Destination': element.Destination,
        //     'Customer_type': element.Customer_type,
        //     'ActualWeight': element.ActualWeight,
        //     'sgst': element.sgst,
        //     'cgst': element.cgst,
        //     'igst': element.igst,
        //     'Pcs': element.Pcs,
        //     'chargedwt': element.chargedwt,
        //     'billno': element.billno,
        //     'rateperkg': element.rateperkg,
        //     'fuelcharges': element.fuelcharges,
        //     'volumetricwt': element.volumetricwt,
        //     'rate': element.rate,
        //     'fov_chrgs': element.fov_chrgs,
        //     'docketchrgs': element.docketchrgs,
        //     'essamt': element.essamt,
        //     'vtc_chrgs': element.vtc_chrgs,
        //     'oda_chrgs': element.oda_chrgs,
        //     'idccharges': element.idccharges,
        //     'cafcharges': element.cafcharges,
        //     'othercharges': element.othercharges,
        //     'cod_charges': element.cod_charges,
        //     'charges1': element.charges1,
        //     'charges2': element.charges2,
        //     'charges3': element.charges3,
        //     'charges4': element.charges4,
        //     'charges5': element.charges5,
        //     'charges6': element.charges6,
        //     'charges7': element.charges7,
        //     'charges8': element.charges8,
        //     'charges9': element.charges9,
        //     'charges10': element.charges10,
        //     'servicetax': element.servicetax,
        //     'txtother': element.txtother,
        //     'vcharges1': element.vcharges1,
        //     'vcharges2': element.vcharges2,
        //     'vcharges3': element.vcharges3,
        //     'vcharges4': element.vcharges4,
        //     'vcharges5': element.vcharges5,
        //     'vcharges6': element.vcharges6,
        //     'vendorwt': element.vendorwt,
        //     'vendorchargewt': element.vendorchargewt,
        //     'receivedamt': element.receivedamt,
        //     'receivedtotal': element.receivedtotal,
        //     'invvalue': element.invvalue,
        //     'shipper_name': element.shipper_name,
        //     'actualshipper': element.actualshipper,
        //     'TotalAmt': element.TotalAmt
        //   }
        //   return headingInUpperCase;
        // });
        //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
        //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //   XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
        //   XLSX.writeFile(wb, 'coCorrierCheckDetails.xlsx');
        //   progressBar.close();
        // });
      } else {
          const progressBar = this.openprogressbar();
         this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=${this.checkListForm.value.customerName}&vendorCode=All&destinationCode=${this.checkListForm.value.destination}&clientType=All&productCode=All&modeCode=${this.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.checkListForm.value.fromDate}&toDate=${this.checkListForm.value.toDate}&Reporttype=${this.reportType}&typeWise=bookDate&pageNumber=1&pageSize=${this.length}`).then((response: any) => {
            console.log(response, 'xsl download response');
            const dataForExcel = response.Data.map(element => {
            const headingInUpperCase = {
              'customer_name': element.customer_name,
              'total_actualwt': element.total_actualwt,
              'total_cafcharges': element.total_cafcharges,
              'total_carges5': element.total_carges5,
              'total_cgst': element.total_cgst,
              'total_chargedwt': element.total_chargedwt,
              'total_charges1': element.total_charges1,
              'total_charges2': element.total_charges2,
              'total_charges3': element.total_charges3,
              'total_charges4': element.total_charges4,
              'total_charges6': element.total_charges6,
              'total_charges7': element.total_charges7,
              'total_charges8': element.total_charges8,
              'total_charges9': element.total_charges9,
              'total_charges10': element.total_charges10,
              'total_docketchargs': element.total_docketchargs,
              'total_essamt': element.total_essamt,
              'total_fov_chrgs': element.total_fov_chrgs,
              'total_fuelcharges': element.total_fuelcharges,
              'total_idccharges': element.total_idccharges,
              'total_igst': element.total_igst,
              'total_oda_chrgs': element.total_oda_chrgs,
              'total_othercharges': element.total_othercharges,
              'total_qty': element.total_qty,
              'total_rate': element.total_rate,
              'total_serviceTax': element.total_serviceTax,
              'total_sgst': element.total_sgst,
              'total_totalamt': element.total_totalamt,
              'total_vpp': element.total_vpp
            };
            return headingInUpperCase;
          });
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
            XLSX.writeFile(wb, 'coCorrierCheckSummary.xlsx');
            progressBar.close();
          });
      }
     } else {
      this.openSnackBar( 'Please select one of them Details & Summary', 'error-snackbar');
     }
    } else {
      this.openSnackBar('Download cancelled', 'error-snackbar');
    }
  });
  }

}
