import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditService } from 'app/Branch/audit/audit.service';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import { PaymentService } from '../../payment.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MasterService } from 'app/Branch/master/master.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import { toWords } from 'number-to-words';

@Component({
  selector: 'app-credit-note-report',
  templateUrl: './credit-note-report.component.html',
  styleUrls: ['./credit-note-report.component.css']
})
export class CreditNoteReportComponent implements OnInit {

  sessionLocationCode: any;
    pageSizeOptions: number[] = [15, 50, 100, 1000];
    totalountPages: any;
    totalPending: number;
    showTable = false;
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageNumber = 1;
    showFirstLastButtons = true;
    hidePageSize = false;
    disabled = false;
    pageCount = 0;
    pageEvent: PageEvent;
    showPageSizeOptions = false;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [
          'action',
          'SrNO',
          'Customer_Name',
          'Shipper_Name',
          'Consignee_Name',
          'BookDate',
          'NoteNo',
          'NoteDate',
          'Particulars',
          'Amount',
          'Remark',  
        ];
  
    userType: any;
    selectedValue = 'All';
    fromDate: string;
    toDate: string;
    unbillData: any;
    currentDate1: string;
    currentDate2: string;
    sessionLocationName: string;
    filterForm!: FormGroup;
    customerList: any[] = [];
    consigneeList: any[] = [];
    shipperList: any[] = [];
    rateViewData: any;
    selectedCustomerCode: any;
    AwbNo:any;
    branchName: any;
    isAdmin = false;
    branchDetails: any;
    
    selectedElement: any;
    isLoadingPdf = false;
  
    constructor(private auditService: AuditService,
                public dialog: MatDialog,
                private snackBar: MatSnackBar,
                public formBuilder: FormBuilder,
                public AllService: AllServicesService,
                public httpService:HttpService,
                public paymentService: PaymentService,
                public masterService: MasterService
                ) {
                  this.fromDate = this.getDefaultDate();
                  this.toDate = this.getCurrentDate();
                }
  
    ngOnInit(): void {
  
      this.userType = localStorage.getItem('userType');
      this.isAdmin = this.userType === 'Admin';
        this.currentDate1 = new Date().toISOString().split('T')[0];
         this.currentDate2 = new Date().toISOString().split('T')[0];
     this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
       ? localStorage.getItem('originCode')
       : localStorage.getItem('selectedValue');
        this.sessionLocationName = localStorage.getItem('originName');


          // this.AllService.getConsignerData(this.sessionLocationCode)
          // .subscribe((data: any) => {
          //   const all = { customerName: 'All', customerCode: 'All' };
          //   this.customerList = [all, ...data.Data];
          //   this.filterForm.patchValue({ CustomerName: 'All' });
          // });

        this.AllService.getAllCustomer('Customer',this.sessionLocationCode).subscribe((data: any) => {
            const allCust = { customerName: 'All', customerCode: 'All' };
                  this.customerList = [allCust, ...data.Data];
                this.filterForm.patchValue({ CustomerName: 'All' });
          });

        this.masterService.getAndDeleteShipperConsig('getConsignee', this.sessionLocationCode)
          .subscribe((data: any) => {
            const all = { Consignee_Name: 'All', Consignee_Code: 'All' };
            this.consigneeList = [all, ...data.Data];
          });

        this.masterService.getAndDeleteShipperConsig('getShipper', this.sessionLocationCode)
          .subscribe((data: any) => {
            const all = { shipper_Name: 'All', shipper_Code: 'All' };
            this.shipperList = [all, ...data.Data];
          });

        this.masterService.getLocationByCode(this.sessionLocationCode)
          .subscribe((data: any) => {
            this.branchDetails = data.Data[0];
          });
 
    
       this.filterForm = this.formBuilder.group({
      branch: ['All', Validators.required],
      customerType:['Customer', Validators.required],
      name:['All',Validators.required],
      fromDate: [this.currentDate1, Validators.required],
      toDate: [this.currentDate2, Validators.required],
    });
    
     if (this.userType === 'Admin') {
         this.branchData();
     }

      this.filterForm.get('customerType').valueChanges.subscribe(type => {
        this.filterForm.patchValue({ name: 'All' }, { emitEvent: false });
      });

     //  if (this.userType !== 'Admin') {
     //     this.filterForm.patchValue({
     //       branch: this.sessionLocationName
     //     });
 
     //     this.filterForm.get('branch')?.disable();
     //  }
 
   }
  
    refresh() {}
 
 
       branchData() {
          this.httpService.get(`${environment.apiUrl}Booking/getBranch` ).then((resp) => {
              this.branchName = resp.Data;
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
    
    openSnackBar(message: string, panelClass: string) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      });
    }
  
  calculatePageCount() {
        this.pageCount = Math.ceil(this.length / this.pageSize);
        console.log(this.pageCount, 'pageCount');
      }
  
    handlePageEvent(e: PageEvent) {
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
      this.pageNumber = this.pageIndex + 1;
        this.calculatePageCount();
        this.onFilterSubmit();
    }
 
  
 onFilterSubmit(): void {
 if (this.filterForm.valid) {
 
       let sessionLocationCode ;
       if(this.userType!=='Admin'){
        sessionLocationCode = this.sessionLocationCode;
       }else{
        sessionLocationCode = this.filterForm.get('branch')?.value;
       }
        const customerType = this.filterForm.get('customerType')?.value;
        let customerCode;
        let shipperName;
        let consigneeName;
        if(customerType === 'Customer'){
          customerCode  = this.filterForm.get('name')?.value;
        }
        else if(customerType === 'Shipper'){
           shipperName  = this.filterForm.get('name')?.value;
        }
         else if(customerType === 'Consignee'){
           consigneeName  = this.filterForm.get('name')?.value;
        }
       
       const fromDate = this.filterForm.get('fromDate')?.value;
       const toDate = this.filterForm.get('toDate')?.value;
      

   this.paymentService.creditNotReport(this.sessionLocationCode, customerCode, shipperName, consigneeName, fromDate, toDate, this.pageNumber, this.pageSize)
     .subscribe((resp: any) => {
       if (resp.status === 1) {
         this.openSnackBar(resp.message, 'custom-snackbar');
         this.showTable = true;
          this.dataSource = new MatTableDataSource(resp.Data);
         this.length = resp.count;
         this.calculatePageCount();
       } else {
         this.openSnackBar(resp.message, 'error-snackbar');
         this.showTable = false;
         // this.rateViewData = [];
       }
     });
 
   } else {
     this.filterForm.markAllAsTouched();
      this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
   }
 }


downloadExcel() {

  const displayedColumns = [
    'SrNO',
    'Customer_Name',
    'Shipper_Name',
    'Consignee_Name',
    'BookDate',
    'NoteNo',
    'NoteDate',
    'Particulars',
    'Amount',
    'Remark'
  ];

    const exportData = this.dataSource.filteredData.length
      ? this.dataSource.filteredData
      : this.dataSource.data;

  // const excelData = this.dataSource.data.map((row: any, index: number) => {
    const excelData = exportData.map((row: any, index: number) => {
    const temp: any = {
      SrNO: index + 1,
      Customer_Name: row.Customer_Name,
      Shipper_Name: row.Shipper_Name,
      Consignee_Name: row.Consignee_Name,
      BookDate: row.BookDate ? new Date(row.BookDate).toLocaleDateString() : '',
      NoteNo: row.NoteNo,
      NoteDate: row.NoteDate ? new Date(row.NoteDate).toLocaleDateString() : '',
      Particulars: row.Particulars,
      Amount: row.Amount,
      Remark: row.Remark
    };

    const ordered: any = {};
    displayedColumns.forEach(col => {
      ordered[col] = temp[col] ?? '';
    });

    return ordered;
  });

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'CreditNote Report');

  XLSX.writeFile(wb, 'CreditNoteReport.xlsx');
}

    
downloadPdf() {

  const header = [
    'Customer Name',
    'Shipper',
    'Consignee',
    'Book Date',
    'Location',
    'Note No',
    'Note Date',
    'Particulars',
    'Remark',
    'Amount'
  ];

     const exportData = this.dataSource.filteredData.length
    ? this.dataSource.filteredData
    : this.dataSource.data;

  // Build table body
  const tableBody = [
    header,
    // ...this.dataSource.data.map((e: any) => [
      ...exportData.map((e: any) => [
      e.Customer_Name || '',
      e.Shipper_Name || '',
      e.Consignee_Name || '',
      e.BookDate ? new Date(e.BookDate).toLocaleDateString() : '',
      e.Location_Code || '',
      e.NoteNo ?? '',
      e.NoteDate ? new Date(e.NoteDate).toLocaleDateString() : '',
      e.Particulars ?? '',
      e.Remark ?? '',
      e.Amount ?? ''
    ])
  ];

  const columnWidths = header.map(() => '*');  

  const docDefinition: any = {
    pageOrientation: 'landscape',
    pageSize: 'A4',
    pageMargins: [10, 10, 10, 10],

    content: [
      { text: 'Note Report', style: 'header' },

      {
        table: {
          headerRows: 1,
          widths: columnWidths,  
          body: tableBody
        },
        layout: {
          fillColor: (rowIndex: any) => rowIndex === 0 ? '#e8e8e8' : null
        }
      }
    ],

    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 8]
      }
    },

    defaultStyle: {
      fontSize: 8
    }
  };

  pdfMake.createPdf(docDefinition).download('NoteData.pdf');
}


// downloadPdfForOne(element: any) {

//     const b = this.branchDetails || {};
//     const gstNo = this.branchDetails?.GSTNo || '';
//     const panNo = gstNo.length >= 12 ? gstNo.substring(2, 12) : 'N/A';

//   const docDefinition: any = {
//     pageMargins: [30, 20, 30, 20],
//     content: [
//       {
//         table: {
//           widths: ['*'],
//           body: [[
//             {
//               // stack: [
//               //   { text: 'A-ONE CARRIERS', style: 'title' },
//               //   { text: 'E1-101, KAILASH ESPLANADE, OPP. SHREYAS CINEMA, L.B.S. MARG, GHATKOPAR (WEST), MUMBAI - 400086.', style: 'subText' },
//               //   { text: 'Contact: 022 25004420 / 9820430332 | Email: aone_carriers@rediffmail.com', style: 'subText' },
//               //   { text: 'GSTIN/UIN: 27ACQPA9420Q1ZO | State: Maharashtra, Code: 27', style: 'subText' },
//               // ],
//               stack: [
//                 { text: b.CompanyName || 'SOFTCTL IT SERVICES', style: 'title' },
//                 { text: `${b.Location_Add1 || ''}${b.Location_Add2 ? ', ' + b.Location_Add2 : ''}${b.Location_Add3 ? ', ' + b.Location_Add3 : ''}${
//                     b.Location_PIN ? ' - ' + b.Location_PIN : ''}`,
//                  style: 'subText'
//                 },
//                 {text: `Contact: ${b.Location_Tel || ''}${b.Location_eMail ? ' | Email: ' + b.Location_eMail : ''}`,
//                   style: 'subText'
//                 },
//                 {text: `GSTIN/UIN: ${gstNo || ''} | State: ${b.Location_Name || ''}, Code: ${b.State_Code || ''}`,
//                   style: 'subText'
//                 },
//                 b.Location_web? { text: `Website: ${b.Location_web}`, style: 'subText' } : ''
//               ],
//               border: [true, true, true, false],
//               margin: [0, 5, 0, 5]
//             }
//           ]]
//         },
//         layout: 'noBorders'
//       },

//       { text: 'TAX INVOICE / CREDIT NOTE', style: 'header', margin: [0, 10, 0, 0] },

//       {
//         columns: [
//           { text: `No.: ${element.NoteNo || '-'}`, width: '50%' },
//           { text: `Dated: ${element.NoteDate ? new Date(element.NoteDate).toLocaleDateString() : '-'}`, alignment: 'right', width: '50%' }
//         ],
//         style: 'boldText',
//         margin: [0, 0, 0, 8]
//       },

//       {
//         table: {
//           widths: ['25%', '75%'],
//           body: [
//             [
//               { text: "Party's Name", bold: true },
//               {
//                 stack: [
//                   { text: element.Customer_Name || '' },
//                   { text: element.Customer_Address || 'PRINT WORLD INDUSTRIAL COMPLEX, BLDG NO. A-4, 1st FLOOR, GALA 109 TO 113, BHIWANDI 421302' },
//                 ]
//               }
//             ],
//             [{ text: 'GSTIN/UIN.:', bold: true }, { text: element.GSTIN || '27ABHFS0951L1ZU' }]
//           ]
//         },
//         margin: [0, 0, 0, 10]
//       },

//       {
//         table: {
//           headerRows: 1,
//           widths: ['*', '*', 80],
//           body: [
//             [
//               { text: 'Particulars', bold: true },
//               { text: 'Remark', bold: true },
//               { text: 'Amount', bold: true, alignment: 'right' }
//             ],
//             [
//               { text: element.Particulars || '', margin: [0, 3, 0, 3] },
//               { text: element.Remark || '', margin: [0, 3, 0, 3] },
//               { text: (element.Amount || 0).toFixed(2), alignment: 'right' }
//             ]
//           ]
//         },
//         layout: 'lightHorizontalLines',
//         margin: [0, 0, 0, 8]
//       },

//       {
//         columns: [
//           { text: 'Amount (in words):', bold: true, width: '40%' },
//           { text: this.convertAmountToWords(element.Amount) || 0, italics: true, width: '60%' }
//         ],
//         margin: [0, 5, 0, 10]
//       },

//       {
//         columns: [
//           {
//             width: '60%',
//             stack: [
//               // { text: `Company's PAN: ACQPA9420Q`, bold: true, margin: [0, 5, 0, 5] }
//               { text: `Company's PAN: ${panNo}`, bold: true, margin: [0, 5, 0, 5] }
//             ]
//           },
//           {
//             width: '40%',
//             stack: [
//               {
//                 table: {
//                   widths: ['*', 60],
//                   body: [
//                     ['Total Amount', { text: (element.Amount || 0).toFixed(2), alignment: 'right' }],
//                     ['GST 18%', { text: ((element.Amount || 0) * 0.18).toFixed(2), alignment: 'right' }],
//                     ['Grand Total', { text: ((element.Amount || 0) * 1.18).toFixed(2), alignment: 'right', bold: true }]
//                   ]
//                 },
//                 layout: 'lightHorizontalLines'
//               },
//               { text: '\nFOR '+b.CompanyName, alignment: 'right', bold: true, margin: [0, 20, 0, 0] },
//               { text: 'Authorised Signatory', alignment: 'right', margin: [0, 5, 0, 0] }
//             ]
//           }
//         ]
//       }
//     ],

//     styles: {
//       title: { fontSize: 14, bold: true, alignment: 'center' },
//       header: { fontSize: 12, bold: true, alignment: 'center' },
//       subText: { fontSize: 9, alignment: 'center' },
//       boldText: { bold: true, fontSize: 10 }
//     },

//     defaultStyle: { fontSize: 9 }
//   };

//   pdfMake.createPdf(docDefinition).download(`CreditNote_${element.NoteNo || 'Note'}.pdf`);
// }


// convertAmountToWords(amount: number): string {
//   const words = require('number-to-words');
//   return words.toWords(amount).toUpperCase() + ' ONLY';
// }




// downloadPdfForOne(element: any) {
//  this.selectedElement= element; 
//   setTimeout(() => this.generatePdf(), 100); 
// }

// generatePdf() {
//   const elementToPrint = document.getElementById('creditNoteTemplate');
//   if (!elementToPrint) return;

//   html2canvas(elementToPrint, { scale: 2 }).then(canvas => {
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`CreditNote_${this.selectedElement?.NoteNo || 'Note'}.pdf`);
//   });
// }


generatePdf(element: any) {
  const noteNo = element.NoteNo;
  this.isLoadingPdf = true; 

  this.paymentService.PaymentCreditNotePrint(noteNo).subscribe({
    next: (response: Blob) => {
      const fileURL = URL.createObjectURL(response);
      setTimeout(() => {
        window.open(fileURL, '_blank');
        this.isLoadingPdf = false; 
        setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
      }, 200); 
    },
    error: (err) => {
      console.error('PDF generation failed:', err);
      this.openSnackBar('Unable to open PDF', 'error-snackbar');
      this.isLoadingPdf = false;
    }
  });
}



    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

}
