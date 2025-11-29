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

  @ViewChild('comment') commentTemplate: TemplateRef<any>;
  isawbnoSelected = true;
  isbillnoSelected = true;
  iscustomer_nameSelected = true;
  isbookdateSelected = true;
  isCustomer_typeSelected = true;
  isProductNameSelected = true;
  isPcsSelected = true;
  isModeNameSelected = true;
  isconsignee_nameSelected = true;
  isOriginSelected = true;
  isdestinationSelected = true;
  isActualWeightSelected = true;
  isvolumetricwtSelected = true;
  ischargedwtSelected = true;
  isreceivedamtSelected = true;
  isdocketchrgsSelected = true;
  isfov_chrgsSelected = true;
  isoda_chrgsSelected = true;
  isotherchargesSelected = true;
  isfuelchargesSelected = true;
  isservicetaxSelected = true;
  isreceivedtotalSelected = true;

  @ViewChild('comment1') commentTemplate1: TemplateRef<any>;
  isCustomerNameSelected = true;
  isQtySelected = true;
  isActualWtSelected = true;
  isCAFSelected = true;
  isChargeWtSelected = true;
  isCharges1Selected = true;

  isCharges3Selected = true;
  isCharges5Selected = true;
  isCharges7Selected = true;
  isCharges10Selected =  true;
  isCODSelected =  true;
  isDocketSelected =  true;

  isESSSelected =  true;
  isFOVSelected =  true;
  isFuelSelected =  true;
  isIDCSelected =  true;
  isIGSTSelected =  true;
  isInvalueSelected =  true;

  isODASelected =  true;
  isOthersChargesSelected =  true;
  isRateSelected =  true;
  isReceivedTotalSelected =  true;
  isServiceTaxSelected =  true;
  isVCharges4Selected =  true;

  isVendorCharegedWtSelected =  true;
  isVolumetricWtSelected =  true;
  isVTCSelected =  true;
  isCGSTSelected =  true;
  isCharges4Selected =  true;
  isCharges6Selected =  true;

  isCharges8Selected =  true;
  isCharges9Selected =  true;
  isReceivedAmtSelected =  true;
  isSGSTSelected =  true;

  isVChargesSelected =  true;
  isVCharges1Selected =  true;
  isVCharges2Selected =  true;
  isVCharges6Selected =  true;
  isVendorWtSelected =  true;


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


 sections = [
   {
    name: 'Setup',
     options: [

       { label: 'Awb_No', value: 'awbno', checked: true },
       { label: 'Bill_No', value: 'billno', checked: true },
       { label: 'Customer_name', value: 'customer_name', checked: true },
       { label: 'BookDate', value: 'bookdate', checked: true },
       { label: 'Customer_type', value: 'Customer_type', checked: true },

       { label: 'ProductName', value: 'ProductName', checked: true },

       { label: 'QTY', value: 'Pcs', checked: true },
       { label: 'ModeName', value: 'ModeName', checked: true },
       { label: 'Consignee_name', value: 'consignee_name', checked: true },
       { label: 'Origin', value: 'Origin', checked: true },
       { label: 'Destination', value: 'destination', checked: true },
       { label: 'ActualWeight', value: 'ActualWeight', checked: true },

       { label: 'Volumetric_Wt', value: 'volumetricwt', checked: true },
       { label: 'Charged_Wt', value: 'chargedwt', checked: true },
       { label: 'Received_Amt', value: 'receivedamt', checked: true },
       { label: 'Docket_charges', value: 'docketchrgs', checked: true },
       { label: 'FOV_charges', value: 'fov_chrgs', checked: true },
       { label: 'ODA_charges', value: 'oda_chrgs', checked: true },

       { label: 'Other_charges', value: 'othercharges', checked: true },
       { label: 'Fuel_charges', value: 'fuelcharges', checked: true },
       { label: 'Service_Tax', value: 'servicetax', checked: true },
       { label: 'Received_Total', value: 'receivedtotal', checked: true },
     ],
   },
 ]

 sections1 = [
   {
     name: 'Setup',
     options: [
       { label: 'Customer_Name', value: 'customer_name', checked: true },
       { label: 'QTY', value: 'Pcs', checked: true },
       { label: 'Actual_Wt', value: 'SumofActualWeight', checked: true },
       { label: 'CAF_Charges', value: 'SumofCafCharges', checked: true },
       { label: 'Charge_Weight', value: 'SumofChargeWeight', checked: true },
       { label: 'Charges-1', value: 'SumofCharges1', checked: true },

       { label: 'Charges-3', value: 'SumofCharges3', checked: true },
       { label: 'Charges-5', value: 'SumofCharges5', checked: true },
       { label: 'Charges-7', value: 'SumofCharges7', checked: true },
       { label: 'Charges-10', value: 'SumofCharges10', checked: true },
       { label: 'COD_Charges', value: 'SumofCodcharges', checked: true },
       { label: 'Docket_Charges', value: 'SumofDocketCharges', checked: true },

       { label: 'ESS_Amt', value: 'SumofEssAmt', checked: true },
       { label: 'FOV_Charges', value: 'SumofFovCharges', checked: true },
       { label: 'Fuel_Charges', value: 'SumofFuelcharges', checked: true },
       { label: 'IDC_Charges', value: 'SumofIdcCharges', checked: true },
       { label: 'IGST_Charges', value: 'SumofIgst', checked: true },
       { label: 'InValue', value: 'SumofInvalue', checked: true },

       { label: 'ODA_Charge', value: 'SumofOdacharges', checked: true },
       { label: 'Others_Charges', value: 'SumofOtherCharges', checked: true },
       { label: 'Rate', value: 'SumofRate', checked: true },
       { label: 'Received_Total', value: 'SumofReceivedtotal', checked: true },
       { label: 'Service_Tax', value: 'SumofServiceTax', checked: true },
       { label: 'V_Charges-4', value: 'SumofVcharges4', checked: true },

       { label: 'Vendor_Charged_Wt', value: 'SumofVendorchargewt', checked: true },
       { label: 'Volumetric_Wt', value: 'SumofVolumetricWt', checked: true },
       { label: 'VTC_Charges', value: 'SumofVtccharges', checked: true },
       { label: 'CGST', value: 'Sumofcgst', checked: true },
       { label: 'Charges-4', value: 'Sumofcharges4', checked: true },
       { label: 'Charges-6', value: 'Sumofcharges6', checked: true },

       { label: 'Charges-8', value: 'Sumofcharges8', checked: true },
       { label: 'Charges-9', value: 'Sumofcharges9', checked: true },
       { label: 'Receive_Amt', value: 'Sumofreceiveamt', checked: true },
       { label: 'SGST', value: 'Sumofsgst', checked: true },
       { label: 'V_Charges', value: 'Sumofvcharges', checked: true },

       { label: 'Charges-1', value: 'Sumofvcharges1', checked: true },
       { label: 'Charges-2', value: 'Sumofvcharges2', checked: true },
       { label: 'Charges-6', value: 'Sumofvcharges6', checked: true },
       { label: 'Vendor_Wt', value: 'Sumofvendorwt', checked: true },

     ],
   },
 ]

  constructor(private dialog: MatDialog,
              public httpService: HttpService,
              public formBuilder: FormBuilder,
              private AllService: AllServicesService,
              private bookingService: BookingService,private snackBar: MatSnackBar) {
                this.currentDate = this.getDefaultDate();
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
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
  }

  setupReport() {
    if (this.bookingType === 'Details') {
      this.openDetails();
    } else if (this.bookingType === 'Summary') {
      this.enabledTable = false;
      this.enabledTableSummary = true;
      const commentModal = document.getElementById('comment1');
      if (commentModal) {
          commentModal.style.display = 'block';
          commentModal.style.height = '40rem';
          commentModal.style.width = '70rem';
      }
    } else {
      alert('Please Select Details or Summary');
    }
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

    // if (this.bookingType === 'Details') {
    //   this.httpService.get(`${environment.apiUrl}Rpt/SalChecklist?custcode=` + formData.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + formData.custType + '&Reporttype=Checklist&date&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=Details&Mode=' + formData.modeName + '&pageNumber=' +(this.pageIndex + 1) + '&pageSize=' + this.pageSize ).then(resp => {
    //     console.log(resp, ' hello data ');
    //     if ( resp.status === 1) {
    //         this.dataSource = resp.result[0];
    //         this.enabledTable = true;
    //         this.enabledTableSummary = false;
    //       } else {
    //         alert(resp.message);
    //         this.enabledTable = false;
    //         this.enabledTableSummary = false;
    //       }
    //     });
    // } else if (this.bookingType === 'Summary') {
    //   this.httpService.get(`${environment.apiUrl}Rpt/SalChecklist?custcode=` + formData.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + formData.custType + '&Reporttype=Checklist&date&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=Summary&Mode=' + formData.modeName + '&pageNumber=' +(this.pageIndex + 1) + '&pageSize=' + this.pageSize ).then(resp => {
    //     console.log(resp, ' hello data ');
    //     if ( resp.status === 1) {
    //         this.dataSourceSummary = resp.result[0];
    //         this.enabledTableSummary = true;
    //         this.enabledTable = false;
    //       } else {
    //         alert(resp.message);
    //         this.enabledTableSummary = false;
    //         this.enabledTable = false;
    //       }
    //     });
    //   } else {
    //     alert('Please select all Field ')
    //   }

       
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
      
  // downloadSample() {
  //   const isConfirmed = window.confirm('Do you want to download the Excel file?');
  //   if (isConfirmed) {
  //     if(this.bookingType === 'Details'){
  //       const progressBar = this.openprogressbar();
  //       this.httpService.get(`${environment.apiUrl}Rpt/SalChecklist?custcode=` + this.checkListRegisterForm.value.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + this.checkListRegisterForm.value.custType + '&Reporttype=Checklist&date&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=Summary&Mode=' + this.checkListRegisterForm.value.modeName ).then((response: any) => {
  //         console.log(response,'xsl download response');
  //         const dataForExcel = response.result[0].map(element => {
  //         const headingInUpperCase = {
  //           'awbno' : element.awbno,
  //            'billno' : element.billno,
  //            'customer_name' : element.customer_name,
  //            'bookdate' : element.bookdate,
  //            'Customer_type' : element.Customer_type,
  //            'ProductName' : element.ProductName,
  //            'Pcs' : element.Pcs,
  //            'ModeName' : element.ModeName,
  //            'consignee_name' : element.consignee_name,
  //            'Origin' : element.Origin,
  //            'destination' : element.destination,
  //            'ActualWeight' : element.ActualWeight,
  //            'volumetricwt' : element.volumetricwt,
  //            'chargedwt' : element.chargedwt,
  //            'receivedamt' : element.receivedamt,
  //            'docketchrgs' : element.docketchrgs,
  //            'fov_chrgs' : element.fov_chrgs,
  //            'oda_chrgs' : element.oda_chrgs,
  //            'othercharges' : element.othercharges,
  //            'fuelcharges' : element.fuelcharges,
  //            'servicetax' : element.servicetax,
  //            'receivedtotal' : element.receivedtotal,
  //         };  
  //         return headingInUpperCase;
  //       });
  //         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
  //         const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //         XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
  //         XLSX.writeFile(wb, 'checklistDetails.xlsx');
  //         progressBar.close();
  //       });
  //     } 
  //     else if (this.bookingType === 'Summary'){
  //       const progressBar = this.openprogressbar();
  //       this.httpService.get(`${environment.apiUrl}Rpt/SalChecklist?custcode=` + this.checkListRegisterForm.value.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + this.checkListRegisterForm.value.custType + '&Reporttype=Checklist&date&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=Summary&Mode=' + this.checkListRegisterForm.value.modeName ).then((response: any) => {
  //         console.log(response,'xsl download response');
  //         const dataForExcel = response.result[0].map(element => {
  //         const headingInUpperCase = {
  //           'customer_name' : element.customer_name,
  //           'Pcs' : element.Pcs,
  //           'SumofActualWeight' : element.SumofActualWeight,
  //           'SumofCafCharges' : element.SumofCafCharges,
  //           'SumofChargeWeight' : element.SumofChargeWeight,
  //           'SumofCharges1' : element.SumofCharges1,
  //           'SumofCharges3' : element.SumofCharges3,
  //           'SumofCharges5' : element.SumofCharges5,
  //           'SumofCharges7' : element.SumofCharges7,
  //           'SumofCharges10' : element.SumofCharges10,
  //           'SumofCodcharges' : element.SumofCodcharges,
  //           'SumofDocketCharges' : element.SumofDocketCharges,
  //           'SumofEssAmt' : element.SumofEssAmt,
  //           'SumofFovCharges' : element.SumofFovCharges,
  //           'SumofFuelcharges' : element.SumofFuelcharges,
  //           'SumofIdcCharges' : element.SumofIdcCharges,
  //           'SumofIgst' : element.SumofIgst,
  //           'SumofInvalue' : element.SumofInvalue,
  //           'SumofOdacharges' : element.SumofOdacharges,
  //           'SumofOtherCharges' : element.SumofOtherCharges,
  //           'SumofRate' : element.SumofRate,
  //           'SumofReceivedtotal' : element.SumofReceivedtotal,
  //           'SumofServiceTax' : element.SumofServiceTax,
  //           'SumofVcharges4' : element.SumofVcharges4,
  //           'SumofVendorchargewt' : element.SumofVendorchargewt,
  //           'SumofVolumetricWt' : element.SumofVolumetricWt,
  //           'SumofVtccharges' : element.SumofVtccharges,
  //           'Sumofcgst' : element.Sumofcgst,
  //           'Sumofcharges4' : element.Sumofcharges4,
  //           'Sumofcharges6' : element.Sumofcharges6,
  //           'Sumofcharges8' : element.Sumofcharges8,
  //           'Sumofcharges9' : element.Sumofcharges9,
  //           'Sumofreceiveamt' : element.Sumofreceiveamt,
  //           'Sumofsgst' : element.Sumofsgst,
  //           'Sumofvcharges' : element.Sumofvcharges,
  //           'Sumofvcharges1' : element.Sumofvcharges1,
  //           'Sumofvcharges2' : element.Sumofvcharges2,
  //           'Sumofvcharges6' : element.Sumofvcharges6,
  //           'Sumofvendorwt' : element.Sumofvendorwt,
  //         };  
  //         return headingInUpperCase;
  //       });
  //         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
  //         const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //         XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
  //         XLSX.writeFile(wb, 'checklistSummary.xlsx');
  //         progressBar.close();
  //       });
  //     }
  //     else{
  //         alert('Please select one of them Details & Summary');
  //     }
  //   }
  // }


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
    const cb22 = document.getElementById('cb22') as HTMLInputElement;

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
    const cb22Value = cb22.checked;

    this.isawbnoSelected = cb1Value;
    this.isbillnoSelected = cb2Value;
    this.iscustomer_nameSelected = cb3Value;
    this.isbookdateSelected = cb4Value;
    this.isCustomer_typeSelected = cb5Value;
    this.isProductNameSelected = cb6Value;
    this.isPcsSelected = cb7Value;
    this.isModeNameSelected = cb8Value;
    this.isconsignee_nameSelected = cb9Value;
    this.isOriginSelected = cb10Value;
    this.isdestinationSelected = cb11Value;
    this.isActualWeightSelected = cb12Value;
    this.isvolumetricwtSelected = cb13Value;
    this.ischargedwtSelected = cb14Value;
    this.isreceivedamtSelected = cb15Value;
    this.isdocketchrgsSelected = cb16Value;
    this.isfov_chrgsSelected = cb17Value;
    this.isoda_chrgsSelected = cb18Value;
    this.isotherchargesSelected = cb19Value;
    this.isfuelchargesSelected = cb20Value;
    this.isservicetaxSelected = cb21Value;
    this.isreceivedtotalSelected = cb22Value;

    displayElement.innerHTML = `Selected values:
                                ${cb1Value ? 'awbno' : ''}   ${cb2Value ? 'billno' : ''}
                                ${cb3Value ? 'customer_name' : ''} ${cb4Value ? 'bookdate' : ''}
                                ${cb5Value ? 'Customer_type' : ''} ${cb6Value ? 'ProductName' : ''}
                                ${cb7Value ? 'Pcs' : ''} ${cb8Value ? 'ModeName' : ''}
                                ${cb9Value ? 'consignee_name' : ''} ${cb10Value ? 'Origin' : ''}
                                ${cb11Value ? 'destination' : ''} ${cb12Value ? 'ActualWeight' : ''}
                                ${cb13Value ? ' volumetricwt' : ''} ${cb14Value ? 'chargedwt' : ''}
                                ${cb15Value ? 'receivedamt' : ''} ${cb16Value ? 'docketchrgs' : ''}
                                ${cb17Value ? 'fov_chrgs' : ''} ${cb18Value ? 'oda_chrgs' : ''}
                                ${cb19Value ? 'othercharges' : ''} ${cb20Value ? 'fuelcharges' : ''}
                                ${cb21Value ? 'servicetax' : ''} ${cb22Value ? 'receivedtotal' : ''} `;

    if (cb1.checked) {
      this.sendDataToAPI('awbno', false);
    } else {
      this.sendDataToAPI('awbno', true);
    }

    if (cb2.checked) {
      this.sendDataToAPI('billno', true);
    } else {
      this.sendDataToAPI('billno', false);
    }

    if (cb3.checked) {
      this.sendDataToAPI('customer_name', true);
    } else {
      this.sendDataToAPI('customer_name', false);
    }

    if (cb4.checked) {
        this.sendDataToAPI('bookdate', true);
    } else {
      this.sendDataToAPI('bookdate', false);
    }

    if (cb5.checked) {
      this.sendDataToAPI('Customer_type', true);
    } else {
      this.sendDataToAPI('Customer_type', false);
    }

    if (cb6.checked) {
        this.sendDataToAPI('ProductName', true);
    } else {
      this.sendDataToAPI('ProductName', false);
    }

    if (cb7.checked) {
      this.sendDataToAPI('Pcs', true);
    } else {
      this.sendDataToAPI('Pcs', false);
    }

    if (cb8.checked) {
      this.sendDataToAPI('ModeName', true);
    } else {
      this.sendDataToAPI('ModeName', false);
    }

    if (cb9.checked) {
      this.sendDataToAPI('consignee_name', true);
    } else {
      this.sendDataToAPI('consignee_name', false);
    }

    if (cb10.checked) {
      this.sendDataToAPI('Origin', true);
    } else {
      this.sendDataToAPI('Origin', false);
    }

    if (cb11.checked) {
      this.sendDataToAPI('destination', true);
    } else {
      this.sendDataToAPI('destination', false);
    }
    if (cb12.checked) {
      this.sendDataToAPI('ActualWeight', true);
    } else {
      this.sendDataToAPI('ActualWeight', false);
    }

    if (cb13.checked) {
      this.sendDataToAPI(' volumetricwt', true);
    } else {
      this.sendDataToAPI(' volumetricwt', false);
    }

    if (cb14.checked) {
      this.sendDataToAPI('chargedwt', true);
    } else {
      this.sendDataToAPI('chargedwt', false);
    }

    if (cb15.checked) {
      this.sendDataToAPI('receivedamt', true);
    } else {
      this.sendDataToAPI('receivedamt', false);
    }

    if (cb16.checked) {
      this.sendDataToAPI('docketchrgs', true);
    } else {
      this.sendDataToAPI('docketchrgs', false);
    }

    if (cb17.checked) {
      this.sendDataToAPI('fov_chrgs', true);
    } else {
      this.sendDataToAPI('fov_chrgs', false);
    }

    if (cb18.checked) {
      this.sendDataToAPI('oda_chrgs', true);
    } else {
      this.sendDataToAPI('oda_chrgs', false);
    }

    if (cb19.checked) {
      this.sendDataToAPI('othercharges', true);
    } else {
      this.sendDataToAPI('othercharges', false);
    }

    if (cb20.checked) {
      this.sendDataToAPI('fuelcharges', true);
    } else {
      this.sendDataToAPI('fuelcharges', false);
    }

    if (cb21.checked) {
      this.sendDataToAPI('servicetax', true);
    } else {
      this.sendDataToAPI('servicetax', false);
    }

    if (cb22.checked) {
      this.sendDataToAPI('receivedtotal', true);
    } else {
      this.sendDataToAPI('receivedtotal', false);
    }
  }

  sendDataToAPI(value, isChecked) {
    console.log(`Sending data: ${value} is checked: ${isChecked}`);
  }

  CloseDialog() {
    document.getElementById('comment').style.display = 'none'
  }

  handleCheckbox1(value: string) {
    const cb1 =  document.getElementById('cb1') as HTMLInputElement;
    const cb2 =  document.getElementById('cb2') as HTMLInputElement;
    const cb3 =  document.getElementById('cb3') as HTMLInputElement;
    const cb4 =  document.getElementById('cb4') as HTMLInputElement;
    const cb5 =  document.getElementById('cb5') as HTMLInputElement;
    const cb6 =  document.getElementById('cb6') as HTMLInputElement;

    const cb7 =  document.getElementById('cb7') as HTMLInputElement;
    const cb8 =  document.getElementById('cb8') as HTMLInputElement;
    const cb9 =  document.getElementById('cb9') as HTMLInputElement;
    const cb10 =  document.getElementById('cb10') as HTMLInputElement;
    const cb11 =  document.getElementById('cb11') as HTMLInputElement;
    const cb12 =  document.getElementById('cb12') as HTMLInputElement;

    const cb13 =  document.getElementById('cb13') as HTMLInputElement;
    const cb14 =  document.getElementById('cb14') as HTMLInputElement;
    const cb15 =  document.getElementById('cb15') as HTMLInputElement;
    const cb16 =  document.getElementById('cb16') as HTMLInputElement;
    const cb17 =  document.getElementById('cb17') as HTMLInputElement;
    const cb18 =  document.getElementById('cb18') as HTMLInputElement;

    const cb19 =  document.getElementById('cb19') as HTMLInputElement;
    const cb20 =  document.getElementById('cb20') as HTMLInputElement;
    const cb21 =  document.getElementById('cb21') as HTMLInputElement;
    const cb22 =  document.getElementById('cb22') as HTMLInputElement;
    const cb23 =  document.getElementById('cb23') as HTMLInputElement;
    const cb24 =  document.getElementById('cb24') as HTMLInputElement;

    const cb25 =  document.getElementById('cb25') as HTMLInputElement;
    const cb26 =  document.getElementById('cb26') as HTMLInputElement;
    const cb27 =  document.getElementById('cb27') as HTMLInputElement;
    const cb28 =  document.getElementById('cb28') as HTMLInputElement;
    const cb29 =  document.getElementById('cb29') as HTMLInputElement;
    const cb30 =  document.getElementById('cb30') as HTMLInputElement;

    const cb31 =  document.getElementById('cb31') as HTMLInputElement;
    const cb32 =  document.getElementById('cb32') as HTMLInputElement;
    const cb33 =  document.getElementById('cb33') as HTMLInputElement;
    const cb34 =  document.getElementById('cb34') as HTMLInputElement;

    const cb35 =  document.getElementById('cb35') as HTMLInputElement;
    const cb36 =  document.getElementById('cb36') as HTMLInputElement;
    const cb37 =  document.getElementById('cb37') as HTMLInputElement;
    const cb38 =  document.getElementById('cb38') as HTMLInputElement;
    const cb39 =  document.getElementById('cb39') as HTMLInputElement;


    const displayElement = document.getElementById('displayValues1');

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
    const cb22Value = cb22.checked;
    const cb23Value = cb23.checked;
    const cb24Value = cb24.checked;

    const cb25Value = cb25.checked;
    const cb26Value = cb26.checked;
    const cb27Value = cb27.checked;
    const cb28Value = cb28.checked;
    const cb29Value = cb29.checked;
    const cb30Value = cb30.checked;

    const cb31Value = cb31.checked;
    const cb32Value = cb32.checked;
    const cb33Value = cb33.checked;
    const cb34Value = cb34.checked;
    const cb35Value = cb35.checked;

    const cb36Value = cb36.checked;
    const cb37Value = cb37.checked;
    const cb38Value = cb38.checked;
    const cb39Value = cb39.checked;


    this.isCustomerNameSelected = cb1Value;
    this.isQtySelected = cb2Value;
    this.isActualWtSelected = cb3Value;
    this.isCAFSelected = cb4Value;
    this.isChargeWtSelected = cb5Value;
    this.isCharges1Selected = cb6Value;

    this.isCharges3Selected = cb7Value;
    this.isCharges5Selected = cb8Value;
    this.isCharges7Selected = cb9Value;
    this.isCharges10Selected = cb10Value;
    this.isCODSelected = cb11Value;
    this.isDocketSelected = cb12Value;

    this.isESSSelected = cb13Value;
    this.isFOVSelected = cb14Value;
    this.isFuelSelected = cb15Value;
    this.isIDCSelected = cb16Value;
    this.isIGSTSelected = cb17Value;
    this.isInvalueSelected = cb18Value;

    this.isODASelected = cb19Value;
    this.isOthersChargesSelected = cb20Value;
    this.isRateSelected = cb21Value;
    this.isReceivedTotalSelected = cb22Value;
    this.isServiceTaxSelected = cb23Value;
    this.isVCharges4Selected = cb24Value;

    this.isVendorCharegedWtSelected = cb25Value;
    this.isVolumetricWtSelected = cb26Value;
    this.isVTCSelected = cb27Value;
    this.isCGSTSelected = cb28Value;
    this.isCharges4Selected = cb29Value;
    this.isCharges6Selected = cb30Value;

    this.isCharges8Selected = cb31Value;
    this.isCharges9Selected = cb32Value;
    this.isReceivedAmtSelected = cb33Value;
    this.isSGSTSelected = cb34Value;

    this.isVChargesSelected = cb35Value;
    this.isVCharges1Selected = cb36Value;
    this.isVCharges2Selected = cb37Value;
    this.isVCharges6Selected = cb38Value;
    this.isVendorWtSelected = cb39Value;


    displayElement.innerHTML = `Selected values:
                                ${cb1Value ? 'customer_name' : ''}   ${cb2Value ? 'Pcs' : ''}
                                ${cb3Value ? 'SumofActualWeight' : ''} ${cb4Value ? 'SumofCafCharges' : ''}
                                ${cb5Value ? 'SumofChargeWeight' : ''} ${cb6Value ? 'SumofCharges1' : ''}
                                ${cb7Value ? 'SumofCharges3' : ''}   ${cb8Value ? 'SumofCharges5' : ''}
                                ${cb9Value ? 'SumofCharges7' : ''} ${cb10Value ? 'SumofCharges10' : ''}
                                ${cb11Value ? 'SumofCodcharges' : ''} ${cb12Value ? 'SumofDocketCharges' : ''}
                                ${cb13Value ? 'SumofEssAmt' : ''}   ${cb14Value ? 'SumofFovCharges' : ''}
                                ${cb15Value ? 'SumofFuelcharges' : ''} ${cb16Value ? 'SumofIdcCharges' : ''}
                                ${cb17Value ? 'SumofIgst' : ''} ${cb18Value ? 'SumofInvalue' : ''}
                                ${cb19Value ? 'SumofOdacharges' : ''}   ${cb20Value ? 'SumofOtherCharges' : ''}
                                ${cb21Value ? 'SumofRate' : ''} ${cb22Value ? 'SumofReceivedtotal' : ''}
                                ${cb23Value ? 'SumofServiceTax' : ''} ${cb24Value ? 'SumofVcharges4' : ''}
                                ${cb25Value ? 'SumofVendorchargewt' : ''}   ${cb26Value ? 'SumofVolumetricWt' : ''}
                                ${cb27Value ? 'SumofVtccharges' : ''} ${cb28Value ? 'Sumofcgst' : ''}
                                ${cb29Value ? 'Sumofcharges4' : ''} ${cb30Value ? 'Sumofcharges6' : ''}
                                ${cb31Value ? 'Sumofcharges8' : ''}   ${cb32Value ? 'Sumofcharges9' : ''}
                                ${cb33Value ? 'Sumofreceiveamt' : ''} ${cb34Value ? 'Sumofsgst' : ''}
                                ${cb35Value ? 'Sumofvcharges' : ''}   ${cb36Value ? 'Sumofvcharges1' : ''}
                                ${cb37Value ? 'Sumofvcharges2' : ''} ${cb38Value ? 'Sumofvcharges6' : ''}
                                ${cb39Value ? 'Sumofvendorwt' : ''} `;

    if (cb1.checked) {
      this.sendDataToAPISummary('customer_name', false);
    } else {
      this.sendDataToAPISummary('customer_name', true);
    }

    if (cb2.checked) {
      this.sendDataToAPISummary('Pcs', true);
    } else {
      this.sendDataToAPISummary('Pcs', false);
    }

    if (cb3.checked) {
      this.sendDataToAPISummary('SumofActualWeight', true);
    } else {
      this.sendDataToAPISummary('SumofActualWeight', false);
    }

    if (cb4.checked) {
        this.sendDataToAPISummary('SumofCafCharges', true);
    } else {
      this.sendDataToAPISummary('SumofCafCharges', false);
    }

    if (cb5.checked) {
      this.sendDataToAPISummary('SumofChargeWeight', true);
    } else {
      this.sendDataToAPISummary('SumofChargeWeight', false);
    }

    if (cb6.checked) {
        this.sendDataToAPISummary('SumofCharges1', true);
    } else {
      this.sendDataToAPISummary('SumofCharges1', false);
    }

    if (cb7.checked) {
      this.sendDataToAPISummary('SumofCharges3', false);
    } else {
      this.sendDataToAPISummary('SumofCharges3', true);
    }

    if (cb8.checked) {
      this.sendDataToAPISummary('SumofCharges5', true);
    } else {
      this.sendDataToAPISummary('SumofCharges5', false);
    }

    if (cb9.checked) {
      this.sendDataToAPISummary('SumofCharges7', true);
    } else {
      this.sendDataToAPISummary('SumofCharges7', false);
    }

    if (cb10.checked) {
        this.sendDataToAPISummary('SumofCharges10', true);
    } else {
      this.sendDataToAPISummary('SumofCharges10', false);
    }

    if (cb11.checked) {
      this.sendDataToAPISummary('SumofCodcharges', true);
    } else {
      this.sendDataToAPISummary('SumofCodcharges', false);
    }

    if (cb12.checked) {
        this.sendDataToAPISummary('SumofDocketCharges', true);
    } else {
      this.sendDataToAPISummary('SumofDocketCharges', false);
    }

    if (cb13.checked) {
      this.sendDataToAPISummary('SumofEssAmt', false);
    } else {
      this.sendDataToAPISummary('SumofEssAmt', true);
    }

    if (cb14.checked) {
      this.sendDataToAPISummary('SumofFovCharges', true);
    } else {
      this.sendDataToAPISummary('SumofFovCharges', false);
    }

    if (cb15.checked) {
      this.sendDataToAPISummary('SumofFuelcharges', true);
    } else {
      this.sendDataToAPISummary('SumofFuelcharges', false);
    }

    if (cb16.checked) {
        this.sendDataToAPISummary('SumofIdcCharges', true);
    } else {
      this.sendDataToAPISummary('SumofIdcCharges', false);
    }

    if (cb17.checked) {
      this.sendDataToAPISummary('SumofIgst', true);
    } else {
      this.sendDataToAPISummary('SumofIgst', false);
    }

    if (cb18.checked) {
        this.sendDataToAPISummary('SumofInvalue', true);
    } else {
      this.sendDataToAPISummary('SumofInvalue', false);
    }

    if (cb19.checked) {
      this.sendDataToAPISummary('SumofOdacharges', false);
    } else {
      this.sendDataToAPISummary('SumofOdacharges', true);
    }

    if (cb20.checked) {
      this.sendDataToAPISummary('SumofOtherCharges', true);
    } else {
      this.sendDataToAPISummary('SumofOtherCharges', false);
    }

    if (cb21.checked) {
      this.sendDataToAPISummary('SumofRate', true);
    } else {
      this.sendDataToAPISummary('SumofRate', false);
    }

    if (cb22.checked) {
        this.sendDataToAPISummary('SumofReceivedtotal', true);
    } else {
      this.sendDataToAPISummary('SumofReceivedtotal', false);
    }

    if (cb23.checked) {
      this.sendDataToAPISummary('SumofServiceTax', true);
    } else {
      this.sendDataToAPISummary('SumofServiceTax', false);
    }

    if (cb24.checked) {
        this.sendDataToAPISummary('SumofVcharges4', true);
    } else {
      this.sendDataToAPISummary('SumofVcharges4', false);
    }

    if (cb25.checked) {
      this.sendDataToAPISummary('SumofVendorchargewt', false);
    } else {
      this.sendDataToAPISummary('SumofVendorchargewt', true);
    }

    if (cb26.checked) {
      this.sendDataToAPISummary('SumofVolumetricWt', true);
    } else {
      this.sendDataToAPISummary('SumofVolumetricWt', false);
    }

    if (cb27.checked) {
      this.sendDataToAPISummary('SumofVtccharges', true);
    } else {
      this.sendDataToAPISummary('SumofVtccharges', false);
    }

    if (cb28.checked) {
        this.sendDataToAPISummary('Sumofcgst', true);
    } else {
      this.sendDataToAPISummary('Sumofcgst', false);
    }

    if (cb29.checked) {
      this.sendDataToAPISummary('Sumofcharges4', true);
    } else {
      this.sendDataToAPISummary('Sumofcharges4', false);
    }

    if (cb30.checked) {
        this.sendDataToAPISummary('Sumofcharges6', true);
    } else {
      this.sendDataToAPISummary('Sumofcharges6', false);
    }

    if (cb31.checked) {
      this.sendDataToAPISummary('Sumofcharges8', true);
    } else {
      this.sendDataToAPISummary('Sumofcharges8', false);
    }

    if (cb32.checked) {
        this.sendDataToAPISummary('Sumofcharges9', true);
    } else {
      this.sendDataToAPISummary('Sumofcharges9', false);
    }

    if (cb33.checked) {
      this.sendDataToAPISummary('Sumofreceiveamt', true);
    } else {
      this.sendDataToAPISummary('Sumofreceiveamt', false);
    }

    if (cb34.checked) {
        this.sendDataToAPISummary('Sumofsgst', true);
    } else {
      this.sendDataToAPISummary('Sumofsgst', false);
    }

    if (cb35.checked) {
      this.sendDataToAPISummary('Sumofvcharges', true);
    } else {
      this.sendDataToAPISummary('Sumofvcharges', false);
    }

    if (cb36.checked) {
      this.sendDataToAPISummary('Sumofvcharges1', true);
    } else {
      this.sendDataToAPISummary('Sumofvcharges1', false);
    }

    if (cb37.checked) {
      this.sendDataToAPISummary('Sumofvcharges2', true);
    } else {
      this.sendDataToAPISummary('Sumofvcharges2', false);
    }

    if (cb38.checked) {
      this.sendDataToAPISummary('Sumofvcharges6', true);
    } else {
      this.sendDataToAPISummary('Sumofvcharges6', false);
    }

    if (cb39.checked) {
      this.sendDataToAPISummary('Sumofvendorwt', true);
    } else {
      this.sendDataToAPISummary('Sumofvendorwt', false);
    }
  }

  sendDataToAPISummary(value, isChecked) {
    console.log(`Sending data: ${value} is checked: ${isChecked}`);
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
