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
// import * as pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  modeList: any;
  vendorList: any;
  sessionLocationCode: any;
  currentDate: any;
  serviceForm: FormGroup;
  enabledTableDetails = false;
  enabledTableSummary = false;
  isHidden = true;

  reportType: any = 'StatementDetails';
  fromDate: any;
  toDate: any;
  modeName: any = 'All';
  productName: any = 'All';

  length: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  pageCount = 1;

  @ViewChild(MatPaginator) paginator: MatPaginator;
displayedColumnsDetails: any [] = [ 'index'];
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
  'Customer_type',
  'ModeName',
  'ProductName',
  'Pcs',
  'ActualWeight'
];
  dataSourceDetails  =  new MatTableDataSource;

  dataSourceSummary  = new MatTableDataSource;

 displayColumnsSummmary: string[] = [
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
  constructor(public httpService: HttpService,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private bookingService: BookingService,
              private AllService: AllServicesService) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.sessionLocationCode = (localStorage.getItem('userType') === 'Admin')
    ? localStorage.getItem('selectedValue')
    : localStorage.getItem('originCode');
    this.dataSourceDetails = new MatTableDataSource;
    this.dataSourceSummary = new MatTableDataSource;

     this.bookingService.getMode().subscribe((resp: any) => {
     this.modeList = resp.Data;
    });
    this.bookingService.getProduct().subscribe((resp: any) => {
      this.vendorList = resp.Data;
    });
    this.serviceForm  = this.formBuilder.group({
      modeName: new FormControl('', Validators.compose([
          Validators.required
      ])),
      productName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      reportType: new FormControl('', Validators.compose([ ])),
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
  // tslint:disable-next-line:member-ordering
  formData: any = {
    modeName: '',
    productName: '',
    fromDate: '',
    toDate: '',
    reportType: '',
  };

  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.calculatePageCount();
    this.formData.modeName = this.modeName;
    this.formData.productName = this.productName;
    this.formData.fromDate = this.fromDate;
    this.formData.toDate = this.toDate;
    this.formData.reportType = this.reportType;
    this.formSubmit(this.formData);
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
          this.displayedColumnsDetails = finalColumns;
      }
    });
  }
    this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=All&vendorCode=All&destinationCode=All&clientType=All&productCode=${formData.productName}&modeCode=${formData.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&Reporttype=${formData.reportType}&typeWise=bookDate&pageNumber=${this.pageIndex + 1}&pageSize=${this.pageSize}`).then(resp => {
      console.log(resp, 'Data find  ');
      if (resp.status === 1) {
        if (this.reportType === 'StatementDetails') {
          this.openSnackBar(resp.message, 'custom-snackbar');
          this.dataSourceDetails = resp.Data;
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
          this.enabledTableDetails = true;
          this.enabledTableSummary = false;
        } else  if (this.reportType === 'StatementSummary') {
          this.openSnackBar(resp.message, 'custom-snackbar');
          this.dataSourceSummary = resp.Data;
          this.length = resp.count;
          this.calculatePageCount();
          this.enabledTableDetails = false;
          this.enabledTableSummary = true;
        } else {
          this.openSnackBar( 'Select Details And Summary', 'error-snackbar')
        }
      } else {
        this.openSnackBar( resp.message, 'error-snackbar')
      }
    })
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
          columnMapping: this.getConfigurableColumnMapping(),
        saveApi: 'StatementReportSetup'
        },
        width: '45rem',
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
          this.displayedColumnsDetails = finalColumns;
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
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '22rem',
          data: { message: 'Do you want to download the Excel file?' }
        });
        dialogRef.afterClosed().subscribe(result => {
              if (result) {
      if (this.reportType === 'StatementDetails') {
        const progressBar = this.openprogressbar();
        this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=All&vendorCode=All&destinationCode=All&clientType=All&productCode=${this.serviceForm.value.productName}&modeCode=${this.serviceForm.value.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.serviceForm.value.fromDate}&toDate=${this.serviceForm.value.toDate}&Reporttype=${this.serviceForm.value.reportType}&typeWise=bookDate&pageNumber=1&pageSize=${this.length}`)
        .then((response: any) => {
        //   console.log(response, 'xsl download response');
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
        //   XLSX.writeFile(wb, 'Servicesdetail.xlsx');
        //   progressBar.close();
        // });
          if (response.status === 1) {
            const dataForExcel = response.Data.map((element: any, index: number) => {
              const row: any = { Index: index + 1 };
              this.displayedColumnsDetails.forEach(colKey => {
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
            XLSX.writeFile(wb, 'Servicesdetails.xlsx');
          } else {
            this.openSnackBar(response.message, 'error-snackbar');
          }
          progressBar.close();
        });
      } else if (this.reportType === 'StatementSummary') {
        const progressBar = this.openprogressbar();
        this.httpService.get(`${environment.apiUrl}Reports/getStatementReports?customerCode=All&vendorCode=All&destinationCode=All&clientType=All&productCode=${this.serviceForm.value.productName}&modeCode=${this.serviceForm.value.modeName}&sessionLocationCode=${this.sessionLocationCode}&fromDate=${this.serviceForm.value.fromDate}&toDate=${this.serviceForm.value.toDate}&Reporttype=${this.serviceForm.value.reportType}&typeWise=bookDate&pageNumber=1&pageSize=${this.length}`)
        .then((response: any) => {
          console.log(response, 'xsl download response');
          const dataForExcel = response.Data.map(element => {
          const headingInUpperCase = {
           'customer_name' : element.customer_name,
           'mode_name' : element.mode_name,
           'product_name' : element.product_name,
           'CountofAwbno' : element.CountofAwbno,
           'Pcs' : element.Pcs,
           'SumofActualWeight' : element.SumofActualWeight,
           'SumofCafCharges' : element.SumofCafCharges,
           'SumofChargeWeight' : element.SumofChargeWeight,
           'SumofCharges1' : element.SumofCharges1,
           'SumofCharges3' : element.SumofCharges3,
           'SumofCharges5' : element.SumofCharges5,
           'SumofCharges7' : element.SumofCharges7,
           'SumofCharges10' : element.SumofCharges10,
           'SumofCodcharges' : element.SumofCodcharges,
           'SumofDocketCharges' : element.SumofDocketCharges,
           'SumofEssAmt' : element.SumofEssAmt,
           'SumofFovCharges' : element.SumofFovCharges,
           'SumofFuelcharges' : element.SumofFuelcharges,
           'SumofIdcCharges' : element.SumofIdcCharges,
           'SumofIgst' : element.SumofIgst,
           'SumofInvalue' : element.SumofInvalue,
           'SumofOdacharges' : element.SumofOdacharges,
           'SumofOtherCharges' : element.SumofOtherCharges,
           'SumofRate' : element.SumofRate,
           'SumofReceivedtotal' : element.SumofReceivedtotal,
           'SumofServiceTax' : element.SumofServiceTax,
           'SumofVcharges4' : element.SumofVcharges4,
           'SumofVendorchargewt' : element.SumofVendorchargewt,
           'SumofVolumetricWt' : element.SumofVolumetricWt,
           'SumofVtccharges' : element.SumofVtccharges,
           'Sumofcgst' : element.Sumofcgst,
           'Sumofcharges4' : element.Sumofcharges4,
           'Sumofcharges6' : element.Sumofcharges6,
           'Sumofcharges8' : element.Sumofcharges8,
           'Sumofcharges9' : element.Sumofcharges9,
           'Sumofreceiveamt' : element.Sumofreceiveamt,
           'Sumofsgst' : element.Sumofsgst,
           'Sumofvcharges' : element.Sumofvcharges,
           'Sumofvcharges1' : element.Sumofvcharges1,
           'Sumofvcharges2' : element.Sumofvcharges2,
           'Sumofvcharges6' : element.Sumofvcharges6,
           'Sumofvendorwt' : element.Sumofvendorwt,
          };
          return headingInUpperCase;
        });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
          XLSX.writeFile(wb, 'StatementSummary.xlsx');
          progressBar.close();
        });
      } else {
        this.openSnackBar( 'Please select one of them Details & Summary', 'error-snackbar');
      }
    } else {
      this.openSnackBar('Download cancelled', 'error-snackbar');
    }
  });
  }

}
