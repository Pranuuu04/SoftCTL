import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable'
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';


@Component({
  selector: 'app-unbuilt',
  templateUrl: './unbuilt.component.html',
  styleUrls: ['./unbuilt.component.css']
})
 export class UnbuiltComponent implements OnInit {

  @ViewChild('TABLE', { read: ElementRef }) table: ElementRef;
  @ViewChild('TABLESummary', { read: ElementRef }) tableSummary: ElementRef;

  currentDate: string;
  selectedColumns: any;
  fromDate: any;
  toDate: any;
  customerList: any;
  unbuildRegisterForm: any;
  sessionLocationCode: any;
  enabledTable = false;
  enabledTableSummary = false;
  customerName: any = 'All';
  custType: any = 'All';
  bookingType: any = 'Detail';

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
  isBillNoSelected = true;
  isCustomerNameSelected = true;
  isQtySelected = true;
  isCharges1Selected = true;
  isCharges3Selected = true;
  isCharges4Selected = true;
  isCharges5Selected = true;
  isCharges6Selected = true;
  isCharges7Selected = true;
  isCharges8Selected = true;
  isCharges9Selected = true;
  isCODChargesSelected = true;
  isDocketSelected = true;
  isCAFSelected = true;
  isFOVSelected = true;
  isFuelSelected = true;
  isIDCSelected = true;
  isODASelected = true;
  isOthersChargesSelected = true;
  isVChargesSelected = true;
  isVCharges1Selected = true;
  isVCharges2Selected = true;
  isVCharges4Selected = true;
  isVCharges6Selected = true;
  isRateSelected = true;
  isVTCChargesSelected = true;
  isActualWtSelected = true;
  isChargedWtSelected = true;
  isVolumetricWtSelected = true;
  isESSAmountSelected = true;
  isCGSTSelected = true;
  isSGSTSelected = true;
  isIGSTSelected = true;
  isReceiveAmtSelected = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: any [] = [ 'awbno', 'billno', 'customer_name', 'bookdate', 'Customer_type', 'ProductName', 'Pcs', 'ModeName', 'consignee_name', 'Origin', 'destination', 'ActualWeight', 'volumetricwt', 'chargedwt', 'receivedamt', 'docketchrgs', 'fov_chrgs', 'oda_chrgs', 'othercharges', 'fuelcharges' , 'servicetax' , 'receivedtotal', 'action' ];

  dataSource  = new MatTableDataSource([this.displayedColumns]);

  displayedColumnsSummary: any [] = [
    'billno','customer_name' ,'Pcs' ,'SumofCharges1' ,'SumofCharges3' ,'Sumofcharges4' ,'SumofCharges5' ,'Sumofcharges6' ,'SumofCharges7' ,'Sumofcharges8' ,'Sumofcharges9' ,'SumofCodcharges' ,'SumofDocketCharges' ,'SumofCafCharges' ,'SumofFovCharges' ,'SumofFuelcharges' ,'SumofIdcCharges' ,'SumofOdacharges' ,'SumofOtherCharges' ,'Sumofvcharges' ,'Sumofvcharges1' ,'Sumofvcharges2' ,'SumofVcharges4' ,'Sumofvcharges6' ,'SumofRate' ,'SumofVtccharges' ,'SumofActualWeight' ,'SumofChargeWeight' ,'SumofVolumetricWt' ,'SumofEssAmt' ,'Sumofcgst' ,'Sumofsgst' ,'SumofIgst' ,'Sumofreceiveamt' ,'action' ];

  dataSourceSummary = new MatTableDataSource([this.displayedColumnsSummary]);


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
        { label: 'Bill_No', value: 'billno', checked: true },
        { label: 'Customer_Name', value: 'customer_name', checked: true },
        { label: 'QTY', value: 'Pcs', checked: true },
        { label: 'Charges1', value: 'SumofCharges1', checked: true },
        { label: 'Charges2', value: 'SumofCharges3', checked: true },
        { label: 'Charges3', value: 'Sumofcharges4', checked: true },

        { label: 'Charges5', value: 'SumofCharges5', checked: true },
        { label: 'Charges6', value: 'Sumofcharges6', checked: true },
        { label: 'Charges7', value: 'SumofCharges7', checked: true },
        { label: 'Charges8', value: 'Sumofcharges8', checked: true },
        { label: 'Charges9', value: 'Sumofcharges9', checked: true },
        { label: 'COD_Charges', value: 'SumofCodcharges', checked: true },

        { label: 'Docket_Charges', value: 'SumofDocketCharges', checked: true },
        { label: 'CAF_Charges', value: 'SumofCafCharges', checked: true },
        { label: 'FOV_Charges', value: 'SumofFovCharges', checked: true },
        { label: 'Fuel_Charges', value: 'SumofFuelcharges', checked: true },
        { label: 'IDC_Charges', value: 'SumofIdcCharges', checked: true },
        { label: 'ODA_Charges', value: 'SumofOdacharges', checked: true },

        { label: 'Other_Charge', value: 'SumofOtherCharges', checked: true },
        { label: 'V_Charges', value: 'Sumofvcharges', checked: true },
        { label: 'V-Charges1', value: 'Sumofvcharges1', checked: true },
        { label: 'V_Charges2', value: 'Sumofvcharges2', checked: true },
        { label: 'V_Charges4', value: 'SumofVcharges4', checked: true },
        { label: 'V_Charges6', value: 'Sumofvcharges6', checked: true },

        { label: 'Rate', value: 'SumofRate', checked: true },
        { label: 'VTC_Charges', value: 'SumofVtccharges', checked: true },
        { label: 'Actual_Weight', value: 'SumofActualWeight', checked: true },
        { label: 'Charged_Weight', value: 'SumofChargeWeight', checked: true },
        { label: 'Volumetric_Wt', value: 'SumofVolumetricWt', checked: true },
        { label: 'ESS_Amount', value: 'SumofEssAmt', checked: true },

        { label: 'CGST', value: 'Sumofcgst', checked: true },
        { label: 'SGST', value: 'Sumofsgst', checked: true },
        { label: 'IGST', value: 'SumofIgst', checked: true },
        { label: 'Received_Amount', value: 'Sumofreceiveamt', checked: true },

      ],
    },
  ]

  constructor(public dialog: MatDialog,
              public httpService: HttpService,
              public formBuilder: FormBuilder,
              public AllService: AllServicesService) {
              this.currentDate = this.getDefaultDate();
              this.fromDate = this.getDefaultDate();
              this.toDate = this.getCurrentDate();
            }

  saveButtonClicked(): void {
    console.log('Save button clicked.');
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
    if (this.bookingType === 'Detail') {
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
        const iframe = "<iframe width='100%' height='100%' src='" + pdfUrl + "'></iframe>";
        const x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
      });
    } else {
      console.error("Element not found.");
    }
  }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    // this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
    //  this.customerList = resp.Data;
    // });
    this.AllService.getAllCustomer('Customer',this.sessionLocationCode).subscribe((data: any) => {
        const allCust = { customerName: 'All', customerCode: 'All' };
        this.customerList = [allCust, ...data.Data];
        this.unbuildRegisterForm.patchValue({ customerName: 'All' });
      });
    this.dataSource = new MatTableDataSource(this.displayedColumns);
    this.dataSourceSummary = new MatTableDataSource(this.displayedColumnsSummary);
    this.dataSource.paginator = this.paginator;
    this.unbuildRegisterForm  = this.formBuilder.group({
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

  formSubmit(formData: any) {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    if (this.bookingType === 'Detail') {
      this.httpService.get(`${environment.apiUrl}Rpt/Unbilled?custcode=` + formData.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + formData.custType + '&Reporttype=Unbilled&date&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=' + formData.bookingType + '&pageNumber=' + (this.pageIndex + 1) + '&pageSize=' + this.pageSize).then(resp => {
        console.log(resp, ' hello data ');
        if ( resp.status === 1) {
            this.dataSource = resp.result[0];
            this.enabledTable = true;
            this.enabledTableSummary = false;
          } else {
            alert(resp.message);
            this.enabledTable = false;
            this.enabledTableSummary = false;
          }
        });
    } else if (this.bookingType === 'Summary') {
      this.httpService.get(`${environment.apiUrl}Rpt/Unbilled?custcode=` + formData.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + formData.custType + '&Reporttype=Unbilled&date&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=' + formData.bookingType + '&pageNumber=' + (this.pageIndex + 1) + '&pageSize=' + this.pageSize).then(resp => {
        console.log(resp, ' hello data ');
        if ( resp.status === 1) {
            this.dataSourceSummary = resp.result[0];
            this.enabledTableSummary = true;
            this.enabledTable = false;
          } else {
            alert(resp.message);
            this.enabledTableSummary = false;
            this.enabledTable = false;
          }
        });
    } else {
      alert('Please select all Field ')
    }

  }

  formData: any = {
    customerName: '',
    custType: '',
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
    this.formData.bookingType = this.bookingType;
    this.formData.fromDate = this.fromDate;
    this.formData.toDate = this.toDate;
    this.formSubmit(this.formData);
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
      if (this.bookingType === 'Detail'){
        const progressBar = this.openprogressbar();
        this.httpService.get(`${environment.apiUrl}Rpt/Unbilled?custcode=` + this.unbuildRegisterForm.value.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + this.unbuildRegisterForm.value.custType + '&Reporttype=Unbilled&date&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=' + this.unbuildRegisterForm.value.bookingType)
        .then((response: any) => {
          console.log(response, 'xsl download response');
          const dataForExcel = response.result[0].map(element => {
          const headingInUpperCase = {
            'awbno' : element.awbno,
            'billno' : element.billno,
            'customer_name' : element.customer_name,
            'bookdate' : element.bookdate,
            'Customer_type' : element.Customer_type,
            'ProductName' : element.ProductName,
            'Pcs' : element.Pcs,
            'ModeName' : element.ModeName,
            'consignee_name' : element.consignee_name,
            'Origin' : element.Origin,
            'destination' : element.destination,
            'ActualWeight' : element.ActualWeight,
            'volumetricwt' : element.volumetricwt,
            'chargedwt' : element.chargedwt,
            'receivedamt' : element.receivedamt,
            'docketchrgs' : element.docketchrgs,
            'fov_chrgs' : element.fov_chrgs,
            'oda_chrgs' : element.oda_chrgs,
            'othercharges' : element.othercharges,
            'fuelcharges' : element.fuelcharges,
            'servicetax' : element.servicetax,
            'receivedtotal' : element.receivedtotal,
          };  
          return headingInUpperCase;
        });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
          XLSX.writeFile(wb, 'unbuildDetails.xlsx');
          progressBar.close();
        });
      } 
      else if (this.bookingType === 'Summary'){
        const progressBar = this.openprogressbar();
        this.httpService.get(`${environment.apiUrl}Rpt/Unbilled?custcode=` + this.unbuildRegisterForm.value.customerName + '&destinationcode&Status&sessionLocationCode=' + this.sessionLocationCode + '&Typeofcust=' + this.unbuildRegisterForm.value.custType + '&Reporttype=Unbilled&date&fromdate=' + this.fromDate + '&todate=' + this.toDate + '&Types=' + this.unbuildRegisterForm.value.bookingType)
        .then((response: any) => {
          console.log(response, 'xsl download response');
          const dataForExcel = response.result[0].map(element => {
          const headingInUpperCase = {
              'billno' : element.billno,
              'customer_name' : element.customer_name,
              'Pcs' : element.Pcs,
              'SumofCharges1' : element.SumofCharges1,
              'SumofCharges3' : element.SumofCharges3,
              'Sumofcharges4' : element.Sumofcharges4,
              'SumofCharges5' : element.SumofCharges5,
              'Sumofcharges6' : element.Sumofcharges6,
              'SumofCharges7' : element.SumofCharges7,
              'Sumofcharges8' : element.Sumofcharges8,
              'Sumofcharges9' : element.Sumofcharges9,
              'SumofCodcharges' : element.SumofCodcharges,
              'SumofDocketCharges' : element.SumofDocketCharges,
              'SumofCafCharges' : element.SumofCafCharges,
              'SumofFovCharges' : element.SumofFovCharges,
              'SumofFuelcharges' : element.SumofFuelcharges,
              'SumofIdcCharges' : element.SumofIdcCharges,
              'SumofOdacharges' : element.SumofOdacharges,
              'SumofOtherCharges' : element.SumofOtherCharges,
              'Sumofvcharges' : element.Sumofvcharges,
              'Sumofvcharges1' : element.Sumofvcharges1,
              'Sumofvcharges2' : element.Sumofvcharges2,
              'SumofVcharges4' : element.SumofVcharges4,
              'Sumofvcharges6' : element.Sumofvcharges6,
              'SumofRate' : element.SumofRate,
              'SumofVtccharges' : element.SumofVtccharges,
              'SumofActualWeight' : element.SumofActualWeight,
              'SumofChargeWeight' : element.SumofChargeWeight,
              'SumofVolumetricWt' : element.SumofVolumetricWt,
              'SumofEssAmt' : element.SumofEssAmt,
              'Sumofcgst' : element.Sumofcgst,
              'Sumofsgst' : element.Sumofsgst,
              'SumofIgst' : element.SumofIgst,
              'Sumofreceiveamt' : element.Sumofreceiveamt,
          };  
          return headingInUpperCase;
        });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
          XLSX.writeFile(wb, 'unbuildSummary.xlsx');
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




  updateSelectedData() {
    // this.selectedColumns = this.selection.value;
    // this.displayedColumns = this.selectedColumns.slice();
  }

// downloadSample() {
//   const confirmed = window.confirm('Do you want to download the sample file?');
//   if (confirmed) {
//     const link = document.createElement('a');
//     link.style.display = 'none';
//     link.href = '/assets/excelFileName.xlsx';
//     link.download = 'excelFileName.xlsx';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

    this.isBillNoSelected = cb1Value;
    this.isCustomerNameSelected = cb2Value;
    this.isQtySelected = cb3Value;
    this.isCharges1Selected = cb4Value;
    this.isCharges3Selected = cb5Value;
    this.isCharges4Selected = cb6Value;

    this.isCharges5Selected = cb7Value;
    this.isCharges6Selected = cb8Value;
    this.isCharges7Selected = cb9Value;
    this.isCharges8Selected = cb10Value;
    this.isCharges9Selected = cb11Value;
    this.isCODChargesSelected = cb12Value;

    this.isDocketSelected = cb13Value;
    this.isCAFSelected = cb14Value;
    this.isFOVSelected = cb15Value;
    this.isFuelSelected = cb16Value;
    this.isIDCSelected = cb17Value;
    this.isODASelected = cb18Value;

    this.isOthersChargesSelected = cb19Value;
    this.isVChargesSelected = cb20Value;
    this.isVCharges1Selected = cb21Value;
    this.isVCharges2Selected = cb22Value;
    this.isVCharges4Selected = cb23Value;
    this.isVCharges6Selected = cb24Value;

    this.isRateSelected = cb25Value;
    this.isVTCChargesSelected = cb26Value;
    this.isActualWtSelected = cb27Value;
    this.isChargedWtSelected = cb28Value;
    this.isVolumetricWtSelected = cb29Value;
    this.isESSAmountSelected = cb30Value;

    this.isCGSTSelected = cb31Value;
    this.isSGSTSelected = cb32Value;
    this.isIGSTSelected = cb33Value;
    this.isReceiveAmtSelected = cb34Value;


    displayElement.innerHTML = `Selected values:
                                ${cb1Value ? 'billno' : ''}   ${cb2Value ? 'customer_name' : ''}
                                ${cb3Value ? 'Pcs' : ''} ${cb4Value ? 'SumofCharges1' : ''}
                                ${cb5Value ? 'SumofCharges3' : ''} ${cb6Value ? 'Sumofcharges4' : ''}
                                ${cb7Value ? 'SumofCharges5' : ''}   ${cb8Value ? 'Sumofcharges6' : ''}
                                ${cb9Value ? 'SumofCharges7' : ''} ${cb10Value ? 'Sumofcharges8' : ''}
                                ${cb11Value ? 'Sumofcharges9' : ''} ${cb12Value ? 'SumofCodcharges' : ''}
                                ${cb13Value ? 'SumofDocketCharges' : ''}   ${cb14Value ? 'SumofCafCharges' : ''}
                                ${cb15Value ? 'SumofFovCharges' : ''} ${cb16Value ? 'SumofFuelcharges' : ''}
                                ${cb17Value ? 'SumofIdcCharges' : ''} ${cb18Value ? 'SumofOdacharges' : ''}
                                ${cb19Value ? 'SumofOtherCharges' : ''}   ${cb20Value ? 'Sumofvcharges' : ''}
                                ${cb21Value ? 'Sumofvcharges1' : ''} ${cb22Value ? 'Sumofvcharges2' : ''}
                                ${cb23Value ? 'SumofVcharges4' : ''} ${cb24Value ? 'Sumofvcharges6' : ''}
                                ${cb25Value ? 'SumofRate' : ''}   ${cb26Value ? 'SumofVtccharges' : ''}
                                ${cb27Value ? 'SumofActualWeight' : ''} ${cb28Value ? 'SumofChargeWeight' : ''}
                                ${cb29Value ? 'SumofVolumetricWt' : ''} ${cb30Value ? 'SumofEssAmt' : ''}
                                ${cb31Value ? 'Sumofcgst' : ''}   ${cb32Value ? 'Sumofsgst' : ''}
                                ${cb33Value ? 'SumofIgst' : ''} ${cb34Value ? 'Sumofreceiveamt' : ''} `;

    if (cb1.checked) {
      this.sendDataToAPISummary('billno', false);
    } else {
      this.sendDataToAPISummary('billno', true);
    }

    if (cb2.checked) {
      this.sendDataToAPISummary('customer_name', true);
    } else {
      this.sendDataToAPISummary('customer_name', false);
    }

    if (cb3.checked) {
      this.sendDataToAPISummary('Pcs', true);
    } else {
      this.sendDataToAPISummary('Pcs', false);
    }

    if (cb4.checked) {
        this.sendDataToAPISummary('SumofCharges1', true);
    } else {
      this.sendDataToAPISummary('SumofCharges1', false);
    }

    if (cb5.checked) {
      this.sendDataToAPISummary('SumofCharges3', true);
    } else {
      this.sendDataToAPISummary('SumofCharges3', false);
    }

    if (cb6.checked) {
        this.sendDataToAPISummary('Sumofcharges4', true);
    } else {
      this.sendDataToAPISummary('Sumofcharges4', false);
    }

    if (cb7.checked) {
      this.sendDataToAPISummary('SumofCharges5', false);
    } else {
      this.sendDataToAPISummary('SumofCharges5', true);
    }

    if (cb8.checked) {
      this.sendDataToAPISummary('Sumofcharges6', true);
    } else {
      this.sendDataToAPISummary('Sumofcharges6', false);
    }

    if (cb9.checked) {
      this.sendDataToAPISummary('SumofCharges7', true);
    } else {
      this.sendDataToAPISummary('SumofCharges7', false);
    }

    if (cb10.checked) {
        this.sendDataToAPISummary('Sumofcharges8', true);
    } else {
      this.sendDataToAPISummary('Sumofcharges8', false);
    }

    if (cb11.checked) {
      this.sendDataToAPISummary('Sumofcharges9', true);
    } else {
      this.sendDataToAPISummary('Sumofcharges9', false);
    }

    if (cb12.checked) {
        this.sendDataToAPISummary('SumofCodcharges', true);
    } else {
      this.sendDataToAPISummary('SumofCodcharges', false);
    }

    if (cb13.checked) {
      this.sendDataToAPISummary('SumofDocketCharges', false);
    } else {
      this.sendDataToAPISummary('SumofDocketCharges', true);
    }

    if (cb14.checked) {
      this.sendDataToAPISummary('SumofCafCharges', true);
    } else {
      this.sendDataToAPISummary('SumofCafCharges', false);
    }

    if (cb15.checked) {
      this.sendDataToAPISummary('SumofFovCharges', true);
    } else {
      this.sendDataToAPISummary('SumofFovCharges', false);
    }

    if (cb16.checked) {
        this.sendDataToAPISummary('SumofFuelcharges', true);
    } else {
      this.sendDataToAPISummary('SumofFuelcharges', false);
    }

    if (cb17.checked) {
      this.sendDataToAPISummary('SumofIdcCharges', true);
    } else {
      this.sendDataToAPISummary('SumofIdcCharges', false);
    }

    if (cb18.checked) {
        this.sendDataToAPISummary('SumofOdacharges', true);
    } else {
      this.sendDataToAPISummary('SumofOdacharges', false);
    }

    if (cb19.checked) {
      this.sendDataToAPISummary('SumofOtherCharges', false);
    } else {
      this.sendDataToAPISummary('SumofOtherCharges', true);
    }

    if (cb20.checked) {
      this.sendDataToAPISummary('Sumofvcharges', true);
    } else {
      this.sendDataToAPISummary('Sumofvcharges', false);
    }

    if (cb21.checked) {
      this.sendDataToAPISummary('Sumofvcharges1', true);
    } else {
      this.sendDataToAPISummary('Sumofvcharges1', false);
    }

    if (cb22.checked) {
        this.sendDataToAPISummary('Sumofvcharges2', true);
    } else {
      this.sendDataToAPISummary('Sumofvcharges2', false);
    }

    if (cb23.checked) {
      this.sendDataToAPISummary('SumofVcharges4', true);
    } else {
      this.sendDataToAPISummary('SumofVcharges4', false);
    }

    if (cb24.checked) {
        this.sendDataToAPISummary('Sumofvcharges6', true);
    } else {
      this.sendDataToAPISummary('Sumofvcharges6', false);
    }

    if (cb25.checked) {
      this.sendDataToAPISummary('SumofRate', false);
    } else {
      this.sendDataToAPISummary('SumofRate', true);
    }

    if (cb26.checked) {
      this.sendDataToAPISummary('SumofVtccharges', true);
    } else {
      this.sendDataToAPISummary('SumofVtccharges', false);
    }

    if (cb27.checked) {
      this.sendDataToAPISummary('SumofActualWeight', true);
    } else {
      this.sendDataToAPISummary('SumofActualWeight', false);
    }

    if (cb28.checked) {
        this.sendDataToAPISummary('SumofChargeWeight', true);
    } else {
      this.sendDataToAPISummary('SumofChargeWeight', false);
    }

    if (cb29.checked) {
      this.sendDataToAPISummary('SumofVolumetricWt', true);
    } else {
      this.sendDataToAPISummary('SumofVolumetricWt', false);
    }

    if (cb30.checked) {
        this.sendDataToAPISummary('SumofEssAmt', true);
    } else {
      this.sendDataToAPISummary('SumofEssAmt', false);
    }

    if (cb31.checked) {
      this.sendDataToAPISummary('Sumofcgst', true);
    } else {
      this.sendDataToAPISummary('Sumofcgst', false);
    }

    if (cb32.checked) {
        this.sendDataToAPISummary('Sumofsgst', true);
    } else {
      this.sendDataToAPISummary('Sumofsgst', false);
    }

    if (cb33.checked) {
      this.sendDataToAPISummary('SumofIgst', true);
    } else {
      this.sendDataToAPISummary('SumofIgst', false);
    }

    if (cb34.checked) {
        this.sendDataToAPISummary('Sumofreceiveamt', true);
    } else {
      this.sendDataToAPISummary('Sumofreceiveamt', false);
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

billno: any;
customer_name: any;
Pcs: any;
SumofCharges1: any;
SumofCharges3: any;
Sumofcharges4: any;
SumofCharges5: any;
Sumofcharges6: any;
SumofCharges7: any;
Sumofcharges8: any;
Sumofcharges9: any;
SumofCodcharges: any;
SumofDocketCharges: any;
SumofCafCharges: any;
SumofFovCharges: any;
SumofFuelcharges: any;
SumofIdcCharges: any;
SumofOdacharges: any;
SumofOtherCharges: any;
Sumofvcharges: any;
Sumofvcharges1: any;
Sumofvcharges2: any;
SumofVcharges4: any;
Sumofvcharges6: any;
SumofRate: any;
SumofVtccharges: any;
SumofActualWeight: any;
SumofChargeWeight: any;
SumofVolumetricWt: any;
SumofEssAmt: any;
Sumofcgst: any;
Sumofsgst: any;
SumofIgst: any;
Sumofreceiveamt: any;

}


