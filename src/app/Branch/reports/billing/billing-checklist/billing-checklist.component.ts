import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { SetupReportComponent } from 'app/Branch/Shared/report_pages/setup-report/setup-report.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-billing-checklist',
  templateUrl: './billing-checklist.component.html',
  styleUrls: ['./billing-checklist.component.css']
})


export class BillingChecklistComponent implements OnInit {

  @ViewChild('TABLE',{ read: ElementRef }) table: ElementRef;
  @ViewChild('TABLESummary',{ read: ElementRef }) tableSummary: ElementRef;
  currentDate: string;
  selectedColumns: any;
  selectedColumns1: any;
  fromDate: any;
  toDate: any;
  selectedOption = 'details';
  showSummaryPopup = false;
  showDetailsPopup = false;
  detailsSelect = true;
  summarySelect = false;

  detailsValue: any;
  summaryValue: any;
  customerList: any;
  selection = new FormControl('');
  selectionList: string[] = [];
  selectedData: string;
  modeList: any;
  bookingType: any = 'Details';
  enabledTable = false;
  enabledTableSummary = false;
  checkListRegisterForm: FormGroup;
  sessionLocationCode: any;
  customerName: any = 'All';
  custType: any = 'All';
  modeName: any = 'All';

  length = 1000;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  isHidden: boolean = true;

   displayedColumns: any [] = ['index'];

   dataSource  = new MatTableDataSource();

  //  displayedColumnsSummary: any [] = [
  //   'customer_name' ,
  //   'Pcs' ,
  //   'SumofActualWeight' ,
  //   'SumofCafCharges' ,
  //   'SumofChargeWeight' ,
  //   'SumofCharges1' ,
  //   'SumofCharges3' ,
  //   'SumofCharges5' ,
  //   'SumofCharges7' ,
  //   'SumofCharges10' ,
  //   'SumofCodcharges' ,
  //   'SumofDocketCharges' ,
  //   'SumofEssAmt' ,
  //   'SumofFovCharges' ,
  //   'SumofFuelcharges' ,
  //   'SumofIdcCharges' ,
  //   'SumofIgst' ,
  //   'SumofInvalue' ,
  //   'SumofOdacharges' ,
  //   'SumofOtherCharges' ,
  //   'SumofRate' ,
  //   'SumofReceivedtotal' ,
  //   'SumofServiceTax' ,
  //   'SumofVcharges4' ,
  //   'SumofVendorchargewt' ,
  //   'SumofVolumetricWt' ,
  //   'SumofVtccharges' ,
  //   'Sumofcgst' ,
  //   'Sumofcharges4' ,
  //   'Sumofcharges6' ,
  //   'Sumofcharges8' ,
  //   'Sumofcharges9' ,
  //   'Sumofreceiveamt' ,
  //   'Sumofsgst' , 
  //   'Sumofvcharges' ,
  //   'Sumofvcharges1' ,
  //   'Sumofvcharges2' ,
  //   'Sumofvcharges6' ,
  //   'Sumofvendorwt' ,
  //    'action' ];

  displayedColumnsCheckList = {
          index: 'SR NO',
          awbno: 'CNOTE',
          Bookdate: 'BOOKDATE',
          ManifestDate: 'MFT.DATE',
          InvoiceNo: 'Inv.No',
          customer_Code: 'C.Code',
          customer_name: 'CUSTOMER NAME',
          GSTNo: 'Cust GST',
          shipper_Code: 'S. Code',
          shipper_name: 'SHIPER NAME',
          Shipper_gstNo: 'SHEEPER GST',
          consignee_name: 'CONSIGNEE',
          Consignee_GST: 'C GST',
          ModeName: 'MODE',
          ProductName: 'PRODUCT',
          Train_Flight: 'FLIGHT/ TRAIN',
          Origin: 'Origin',
          Destination: 'DEST',
          Customer_type: 'CUST TYPE',
          Pcs: 'Pcs',
          ActualWeight: 'ACT Wgt',
          volumetricwt: 'VOL WT',
          chargedwt: 'Chg Wt',
          rateperkg: 'RATE/KG',
          rate: 'FRT Amt',
          docketchrgs: 'Docket',
          charges1: 'Tempo',
          charges2: 'Other',
          fuelcharges: 'Fuel',
          fov_chrgs: 'Insurance',
          igst: 'IGST',
          cgst: 'CGST',
          sgst: 'SGST',
          TotalAmt: 'TOTAL AMT',
          customer_type: 'S',
          CashRec: 'Cash Rec',
          paymentDate: 'Rcv Date',
          ConsignorState: 'Consignor  State',
          Perc: 'perc',
          ConsigneeState: 'Consignee  State',
          Cnoterecieve: 'Cnote recieve',
          EwayBill: 'e-wayBIll',
          vendor_name: 'forwarding name',
          Ref_No: 'No.',
          invvalue: 'invoice Val',
          manifestNo: 'MFT NO',
          BillName: 'BILL NAME',
          BillNo: 'BILL NO',
          Remark: 'REMARK'
      };

masterColumnOrder = [
  'index',             // SRNO
  'awbno',             // CNOTE
  'Bookdate',          // BOOKDATE
  'ManifestDate',      // MFT.DATE
  'InvoiceNo',         // Inv.No
  'customer_Code',     // C.Code
  'customer_name',     // CUSTOMER NAME
  'GSTNo',             // Cust GST
  'shipper_Code',      // S. Code
  'shipper_name',      // SHIPER NAME
  'Shipper_gstNo',     // SHEEPER GST
  'consignee_name',    // CONSIGNEE
  'Consignee_GST',     // C GST
  'ModeName',          // MODE
  'ProductName',       // PRODUCT
  'Train_Flight',      // FLIGHT/TRAIN
  'Origin',            // Origin
  'Destination',       // DEST
  'Customer_type',     // CUST TYPE
  'Pcs',               // Pcs
  'ActualWeight',      // ACT Wgt
  'volumetricwt',      // VOL WT
  'chargedwt',         // Chg Wt
  'rateperkg',         // RATE/KG
  'rate',              // FRT Amt
  'docketchrgs',       // Docket
  'charges1',          // Tempo
  'charges2',          // Other
  'fuelcharges',       // Fuel
  'fov_chrgs',         // Insurance
  'igst',              // IGST
  'cgst',              // CGST
  'sgst',              // SGST
  'TotalAmt',          // TOTAL AMT
  'customer_type',     // S
  'CashRec',           // Cash Rec
  'paymentDate',       // Rcv Date
  'ConsignorState',    // Consignor State
  'Perc',              // perc
  'ConsigneeState',    // Consignee State
  'Cnoterecieve',      // Cnote receive
  'EwayBill',          // e-wayBIll
  'vendor_name',       // forwarding name
  'Ref_No',            // No.
  'invvalue',          // invoice Val
  'manifestNo',        // MFT NO
  'BillName',          // BILL NAME
  'BillNo',            // BILL NO
  'Remark'             // REMARK
];


dataSourceSummary = new MatTableDataSource();

  constructor(private dialog: MatDialog,
              public httpService: HttpService,
              public formBuilder: FormBuilder,
              private AllService: AllServicesService,
              private bookingService: BookingService,private snackBar: MatSnackBar) {
                this.currentDate = this.getDefaultDate();
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }


  detailsSelected() {
    this.enabledTable = false;
    this.enabledTableSummary = false;
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

  generatePdf() {
    const confirmed = window.confirm('Do you want to download the PDF?');
    if (confirmed) {
      const docDefinition = {
        content: [
          { text: 'Hello, PDF!', fontSize: 16 },
          { text: 'This is a sample PDF generated in Angular.', fontSize: 12 },
        ],
      };
      pdfMake.createPdf(docDefinition).open();
    }
  }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    // this.dataSource = new MatTableDataSource<PeriodicElement>(this.displayedColumns);
    // this.dataSourceSummary = new MatTableDataSource<PeriodicElementSummary>(this.displayedColumnsSummary);

      //  this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
      // this.customerList = resp.Data;
      // });
      this.AllService.getAllCustomer('Customer',this.sessionLocationCode).subscribe((data: any) => {
        const allCust = { customerName: 'All', customerCode: 'All' };
        this.customerList = [allCust, ...data.Data];
        this.checkListRegisterForm.patchValue({ customerName: 'All' });
      });
      
    this.bookingService.getMode().subscribe((resp: any) => {
       const allMode = { Mode_name: 'All', Mode_code: 'All' };
       this.modeList = [allMode, ...resp.Data];
       this.checkListRegisterForm.patchValue({ modeName: 'All' });
    });
      this.checkListRegisterForm  = this.formBuilder.group({
      customerName: new FormControl('', Validators.compose([
         Validators.required
        ])),
      custType: new FormControl('', Validators.compose([
        Validators.required
      ])),
      modeName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      bookingType: new FormControl('', Validators.compose([ ])),
      fromDate: new FormControl('', Validators.compose([ ])),
      toDate: new FormControl('', Validators.compose([ ])),
    });
  }


  formData: any = {
    customerName: '',
    custType: '',
    modeName: '',
    fromDate: '',
    toDate: '',
    bookingType: '',
  };

  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.formData.customerName = this.customerName;
    this.formData.custType = this.custType;
    this.formData.modeName = this.modeName;
    this.formData.fromDate = this.fromDate;
    this.formData.toDate = this.toDate;
    this.formData.bookingType = this.bookingType;
    this.formSubmit(this.formData);
  }


// getReportSetupKey(){
//    this.AllService.getReportSetup('getCheckListSetup').subscribe((setupResp: any) => {
//     if (setupResp.status === 1 && setupResp.Data.length) {
//       const setup = setupResp.Data[0];
//         const selectedKeys = Object.keys(setup).filter(k => setup[k] === 1);
//         this.displayedColumns = ['index','awbno','BillDate','customer_name','shipper_name', 'consignee_name','ModeName','ProductName','Origin', 'Destination','Customer_type','Pcs','ActualWeight','volumetricwt', ...selectedKeys];
//       ];
//     }
//   });
// }

getReportSetupKey() {
  this.AllService.getReportSetup('getCheckListSetup').subscribe((setupResp: any) => {
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


  formSubmit(formData: any) {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.formData = formData;
    this.getReportSetupKey();

    // (customerCode:any,modeCode:any,clientType:any ,sessionLocationCode:any,ReportType:any,fromDate:any,toDate:any,pageNumber:any,pageSize:any) 
        this.AllService.getCheckListReport(formData.customerName,formData.modeName,formData.custType,this.sessionLocationCode,formData.bookingType,this.fromDate,this.toDate,this.pageIndex + 1,this.pageSize).subscribe((res:any)=>{
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

  openSetup(){
      const dialogRef = this.dialog.open(SetupReportComponent, {
        data: {
            action: 'add',
            inputName: 'getCheckListSetup',
            columnMapping: this.displayedColumnsCheckList,
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


  openSnackBar(message:string,panelClass:string){
    this.snackBar.open(message,'close', {
        duration:3000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass:[panelClass]
    })
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
      if (!isConfirmed) return;
    
      const progressBar = this.openprogressbar();
    
     this.AllService.getCheckListReport(this.formData.customerName,this.formData.modeName,this.formData.custType,this.sessionLocationCode,this.formData.bookingType,this.fromDate,this.toDate,this.pageIndex + 1,this.length)
      .subscribe({
        next: (response: any) => {
          try {
            if (response?.status === 1 && Array.isArray(response.Data)) {
              const mapping = this.displayedColumnsCheckList || {};
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
              XLSX.writeFile(wb, 'CheckListDetails.xlsx');
    
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


  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.handlePageEvent({
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.length
      });
    });
  }
  
  

  CloseDialog1() {
    document.getElementById('comment1').style.display = 'none'
  }

}

export interface PeriodicElement {
  awbno: any;
  billno: any;
  customer_name: any;
  bookdate: any;
  Customer_type: any;
  ProductName: any;
  Pcs: any;
  ModeName: any;
  consignee_name: any;
  Origin: any;
  destination: any;
  ActualWeight: any;
  volumetricwt: any;
  chargedwt: any;
  receivedamt: any;
  docketchrgs: any;
  fov_chrgs: any;
  oda_chrgs: any;
  othercharges: any;
  fuelcharges: any;
  servicetax: any;
  receivedtotal: any;

}

export interface PeriodicElementSummary {

  customer_name: any;
  Pcs: any;
  SumofActualWeight: any;
  SumofCafCharges: any;
  SumofChargeWeight: any;
  SumofCharges1: any;
  SumofCharges3: any;
  SumofCharges5: any;
  SumofCharges7: any;
  SumofCharges10: any;
  SumofCodcharges: any;
  SumofDocketCharges: any;
  SumofEssAmt: any;
  SumofFovCharges: any;
  SumofFuelcharges: any;
  SumofIdcCharges: any;
  SumofIgst: any;
  SumofInvalue: any;
  SumofOdacharges: any;
  SumofOtherCharges: any;
  SumofRate: any;
  SumofReceivedtotal: any;
  SumofServiceTax: any;
  SumofVcharges4: any;
  SumofVendorchargewt: any;
  SumofVolumetricWt: any;
  SumofVtccharges: any;
  Sumofcgst: any;
  Sumofcharges4: any;
  Sumofcharges6: any;
  Sumofcharges8: any;
  Sumofcharges9: any;
  Sumofreceiveamt: any;
  Sumofsgst: any;
  Sumofvcharges: any;
  Sumofvcharges1: any;
  Sumofvcharges2: any;
  Sumofvcharges6: any;
  Sumofvendorwt: any;

}
