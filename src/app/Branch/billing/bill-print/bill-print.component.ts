import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AddBillingComponent } from 'app/Branch/Shared/billing/billing-print/add-billing/add-billing.component';
import { DeleteBillComponent } from 'app/Branch/Shared/billing/billing-print/delete-bill/delete-bill.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { BillingService } from '../billing.service';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-bill-print',
  templateUrl: './bill-print.component.html',
  styleUrls: ['./bill-print.component.css']
})
export class BillPrintComponent implements OnInit {

   printdata: any;
   manifestNoNew: any;
   loadprintData: any;
   pdfUrl: any;
   createForm: FormGroup;
   sessionLocationCode: string ;
   isLoading = false;
   pageSizeOptions: number[] = [5, 10, 20];
   pageSize: number ;
   pageNumber = 1;
   displayedColumns: any[] = ['BillNo', 'BranchName', 'Customer_Code', 'Customer_Name', 'TotalAmount', 'CNote', 'BillDate', 'FromDate', 'ToDate', 'Action'];
   dataSource = new MatTableDataSource<any>();
   @ViewChild(MatPaginator) paginator: MatPaginator;
   billViewTable: any;
   showTable = false;
   firstOfMonth: any;
   ManfViewPdf: any;
   ClientLogo: any;
   ClientName: any;
   selectedValue = 'All';
   userType: any;
   currentDate1: any;
   currentDate2: any;
   destinationName: any;
   customerData: any;
  BranchCode: any;

   constructor( public dialog: MatDialog,
                public formBuilder: FormBuilder,
                private http: HttpClient,
                private billingService: BillingService,
                public httpService: HttpService,
                public formbuilder: FormBuilder,
                private snackBar: MatSnackBar,
                private AllService:AllServicesService) {
                  this.isLoading = false;
                }

   ngOnInit(): void {
     this.userType = localStorage.getItem('userType');
     this.destinationName = localStorage.getItem('selectedValue');
    //  this.sessionLocationCode = localStorage.getItem('originCode');
      this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
        ? localStorage.getItem('originCode') : localStorage.getItem('selectedValue');
     this.ClientLogo =  localStorage.getItem('ClientLogo');
     this.ClientName = localStorage.getItem('ClientName');
     this.dataSource = new MatTableDataSource<any>(this.billViewTable);
      const from = this.getDefaultDate();
      const to = this.getCurrentDate();
     this.createForm  = this.formbuilder.group({
      fromDate: new FormControl(from, Validators.compose([
         Validators.required
        ])),
      toDate: new FormControl(to, Validators.compose([
        Validators.required
      ])),
      Customer: new FormControl('All'),
      FromBillingNo: new FormControl(''),
      ToBillingNo: new FormControl(''),
    });

    this.createForm.get('FromBillingNo')?.valueChanges.subscribe((fromBillNo) => {
      if (fromBillNo) {
        this.createForm.get('Customer')?.reset();
      }
    });

    this.createForm.get('ToBillingNo')?.valueChanges.subscribe((toBillNo) => {
      if (toBillNo) {
        this.createForm.get('Customer')?.reset();
      }
    });
    this.createForm.get('Customer')?.valueChanges.subscribe((toBillNo) => {
      if (toBillNo) {
        this.createForm.get('FromBillingNo')?.reset();
        this.createForm.get('ToBillingNo')?.reset();
      }
    });
   }

   refresh() {
    this.loadCustomerData();
  }

   applyFilter(filterValue: string) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
     }
   }
   getDefaultDate(): string {
     const today = new Date();
     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
     return this.formatDate(firstDayOfMonth);
   }
   formatDate(date: Date): string {
     const year = date.getFullYear();
     const month = date.getMonth() + 1;
     const day = date.getDate();
     return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
   }

   getCurrentDate(): string {
     const today = new Date();
     return this.formatDate(today);
   }

   openSnackBar(message: string, panelClass: string) {
     this.snackBar.open(message, 'Close', {
       duration: 3000,
       horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass: [panelClass]
     });
   }
   loadCustomerData(): void {
    // this.billingService.getCustomer(this.sessionLocationCode).subscribe({
    //   next: (resp) => {
    //     const allCust = { customerName: 'All', customerCode: 'All' };
    //         this.customerData = [allCust, ...resp.Data];
    //       this.createForm.patchValue({ CustomerName: 'All' });
    //   },
    //   error: (err) => {
    //     console.error('Error fetching customer data:', err);
    //   },
    // });
      this.AllService.getAllCustomer('Customer',this.sessionLocationCode).subscribe((data: any) => {
          const allCust = { customerName: 'All', customerCode: 'All' };
              this.customerData = [allCust, ...data.Data];
              this.createForm.patchValue({ CustomerName: 'All' });
        });
  }

  onSubmit() {
    const fromDate = this.createForm.get('fromDate')?.value;
    const toDate = this.createForm.get('toDate')?.value;
    const customer = this.createForm.get('Customer')?.value || '';
    const fromBillNo = this.createForm.get('FromBillingNo')?.value || '';
    const toBillNo = this.createForm.get('ToBillingNo')?.value || '';

    let CustomerCode = customer;
    let FromBillingNo = fromBillNo;
    let ToBillingNo = toBillNo;

    if (fromDate && toDate && !customer && !fromBillNo && !toBillNo) {
      CustomerCode = '';
      FromBillingNo = '';
      ToBillingNo = '';
    } else if (fromDate && toDate && customer && !fromBillNo && !toBillNo) {
      FromBillingNo = '';
      ToBillingNo = '';
    } else if (fromDate && toDate && fromBillNo && toBillNo && !customer) {
      CustomerCode = '';
    }
    this.billingService
      .getViewBill(
        this.sessionLocationCode,
        fromDate,
        toDate,
        CustomerCode,
        FromBillingNo,
        ToBillingNo
      )
      .subscribe(
        (response: any) => {
           if ( response.status === 1 ) {
            this.showTable = true;
            this.billViewTable = response.Data;
            this.dataSource.data = this.billViewTable;
            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
            });
            if (!customer && !fromBillNo && !toBillNo) {
              this.createForm.get('Customer')?.reset();
              this.createForm.get('FromBillingNo')?.reset();
              this.createForm.get('ToBillingNo')?.reset();
            } else if (customer && !fromBillNo && !toBillNo) {
              this.createForm.get('Customer')?.reset();
            } else if (fromBillNo && toBillNo && !customer) {
              this.createForm.get('FromBillingNo')?.reset();
              this.createForm.get('ToBillingNo')?.reset();
            }
            } else {
              this.showTable = false;
              this.openSnackBar(response.message, 'error-snackbar')
              if (!customer && !fromBillNo && !toBillNo) {
                this.openSnackBar(response.message + ' by date' , 'error-snackbar')
              } else if (customer && !fromBillNo && !toBillNo) {
                this.openSnackBar(response.message + ' by customer' , 'error-snackbar')
              } else if (fromBillNo && toBillNo && !customer) {
                this.openSnackBar(response.message + ' by invoice number' , 'error-snackbar')
              }
            }
        },
        (error) => {
          console.error('API Error:', error);
        }
      );
  }

   openviewadd(element: any) {
     const dialogRef = this.dialog.open(AddBillingComponent, {
       data: {
         action: 'add',
         responseData: element,
         BranchCode: this.BranchCode
       },
       width: '20rem',
       disableClose: true
     });
     dialogRef.afterClosed().subscribe(res => {
       this.onSubmit();
       if (res) {
       }
     });
   }

   openviewdelete(BillNo: string) {
     const dialogRef = this.dialog.open(DeleteBillComponent, {
       data: {
         action: 'add',
         responseData: BillNo
       },
       width: '20rem',
       disableClose: true
     });

     dialogRef.afterClosed().subscribe(res => {
       this.onSubmit();
       if (res) {
       }
     });
   }
    Excelprogressbar(): MatDialogRef<ProgressBarComponent> {
       const dialogRef = this.dialog.open(ProgressBarComponent, {
         data: {
           action: 'docketPrint',
         },
         width: '20rem',
         disableClose: true
       });

       return dialogRef;
     }

printPDF(element) {
  const dialogRef = this.Excelprogressbar();
  if (this.userType === 'Admin') {

    const obj = {
      sessionLocationCode: element.BranchCode,
      BillNo: element.BillNo,
      logolink: this.ClientLogo,
      CustomerCode: element.Customer_Code,
    };

    const PdfUrl = `${environment.apiUrl}Billing/billPrint`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe(
      (blob: Blob) => {
         dialogRef.close();
        const blobUrl = URL.createObjectURL(blob);
      const fileName = `Billing_Print_${element.BillNo}.pdf`;
       const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(blobUrl);

        window.open(blobUrl, '_blank');
      },
      (error) => {
        console.error('Error generating PDF:', error);
      }
    );
  } else {
    let obj = {
      sessionLocationCode: element.BranchCode,
      BillNo: element.BillNo,
      logolink: this.ClientLogo,
      CustomerCode: element.Customer_Code
    };

    const PdfUrl = `${environment.apiUrl}Billing/billPrint`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe(
      (blob: Blob) => {
         dialogRef.close();
        const blobUrl = URL.createObjectURL(blob);
        const fileName = `Billing_Print_${element.BillNo}.pdf`;
         const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

        window.open(blobUrl, '_blank');
      URL.revokeObjectURL(blobUrl);
      },
      (error) => {
        console.error('Error generating PDF:', error);
      }
    );
  }
}

printXLS(element){
  // this.downloadInvoiceExcel(element)
  this.billingService.billPrintData(element.BranchCode,element.BillNo,element.Customer_Code).subscribe((res:any)=>{
       if(res.status === 1){
          this.downloadInvoiceExcel(res.data)
       }else{
        this.openSnackBar(res.message, 'error-snackbar')
       }
  })
}

downloadInvoiceExcel(data: any) {

  const header = data.billHeader[0];
  const items = data.billHeader;
  const summary = data.chargesSummary[0];
  const desc = data.description[0];

  const wb = new Workbook();
  const ws = wb.addWorksheet("Invoice");

  // ====================== HEADER ======================
  ws.mergeCells('A1:J1');
  ws.getCell('A1').value = header.CompanyName;
  ws.getCell('A1').font = { bold: true, size: 18 };
  ws.getCell('A1').alignment = { horizontal: 'center' };

  ws.mergeCells('A2:J2');
  ws.getCell('A2').value = `${header.Location_Add1}, ${header.Location_Add2}, ${header.Location_Add3}`;
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A3:J3');
  ws.getCell('A3').value = `Tel: ${header.Location_Tel} | Email: ${header.Location_eMail} | GSTIN: ${header.BranchGSTNO}`;
  ws.getCell('A3').alignment = { horizontal: 'center' };

  ws.mergeCells('A4:J4');
  ws.getCell('A4').value = "TAX INVOICE";
  ws.getCell('A4').font = { bold: true, size: 14 };
  ws.getCell('A4').alignment = { horizontal: 'center' };

  // ================== CONSIGNOR + INVOICE ==================
  ws.mergeCells('A6:E6'); ws.getCell('A6').value = "Consignor Details";
  ws.mergeCells('F6:J6'); ws.getCell('F6').value = "Invoice Details";
  ws.getRow(6).font = { bold: true };

  ws.getCell('A7').value = "Customer:";      ws.getCell('B7').value = header.customerName;
  ws.getCell('A8').value = "State:";         ws.getCell('B8').value = header.state_Name;
  ws.getCell('A9').value = "GSTIN:";         ws.getCell('B9').value = header.CustGST ?? "-";

  ws.getCell('F7').value = "Invoice No:";    ws.getCell('G7').value = `${header.InvoiceCode}/${header.BillNo}/${header.FinancialYear}`;
  ws.getCell('F8').value = "Invoice Date:";  ws.getCell('G8').value = header.BillDate;
  ws.getCell('F9').value = "Bill Period:";   ws.getCell('G9').value = `${header.BillFrom} to ${header.BillTo}`;
  ws.getCell('F10').value = "Mode:";         ws.getCell('G10').value = header.Mode_Name;

  // ================== TABLE HEADER ==================
  const tableHead = [
    "Sr","Book Date","AWB No","Origin","Destination",
    "Mode","Pcs","Weight","Rate/Kg","Amount"
  ];

  let row = 12;
  ws.getRow(row).values = tableHead;
  ws.getRow(row).font = { bold: true };

  ws.getRow(row).eachCell(c=>{
    c.alignment = { horizontal:"center" };
    c.border = { top:{style:'thin'}, bottom:{style:'thin'}, left:{style:'thin'}, right:{style:'thin'} };
    c.fill = { type:"pattern", pattern:"solid", fgColor:{argb:"A3B8D4"} };
  });

  // ================== ROW DATA ==================
  let total = 0;
  let r = row+1;

  items.forEach((item,i)=>{

    ws.getRow(r).values = [
      i+1, item.bookDate, item.AwbNo, item.originName, item.destinationName,
      item.Mode_Name, item.Qty, item.ChargedWt, item.RatePerkg, item.TOTAL
    ];

    total += item.TOTAL;

    ws.getRow(r).eachCell(c=>{
      c.border = { top:{style:'thin'}, bottom:{style:'thin'}, left:{style:'thin'}, right:{style:'thin'} };
    });

    r++;
  });

  // ================== TOTAL SECTION ==================
  ws.mergeCells(`A${r}:I${r}`);
  ws.getCell(`A${r}`).value = "Total Bill Amount";
  ws.getCell(`A${r}`).font = { bold:true };
  ws.getCell(`J${r}`).value = total; r++;

  ws.mergeCells(`A${r}:I${r}`);
  ws.getCell(`A${r}`).value = `CGST @${header.CGSTPer}%`; 
  ws.getCell(`J${r}`).value = summary.CGST; r++;

  ws.mergeCells(`A${r}:I${r}`);
  ws.getCell(`A${r}`).value = `SGST @${header.SGSTPer}%`; 
  ws.getCell(`J${r}`).value = summary.SGST; r++;

  ws.mergeCells(`A${r}:I${r}`);
  ws.getCell(`A${r}`).value = "Grand Total";
  ws.getCell(`A${r}`).font = { bold:true };
  ws.getCell(`J${r}`).value = summary.sumTotalAmt;
  ws.getCell(`J${r}`).font = { bold:true }; r++;

  // ================== AMOUNT IN WORDS ==================
  ws.mergeCells(`A${r}:J${r}`);
  ws.getCell(`A${r}`).value = `Amount in Words: ${data.totalAmountInWords} Only`;
  ws.getCell(`A${r}`).font = { italic:true }; r+=2;

  // ================== TERMS ==================
  ws.getCell(`A${r}`).value = "Terms & Conditions:"; 
  ws.getCell(`A${r}`).font = { bold:true }; r++;

  Object.values(desc).forEach((d:any)=>{
    if(d) { ws.getCell(`A${r}`).value = d; r++; }
  });

  // ================== SAVE FILE ==================
  wb.xlsx.writeBuffer().then((file)=>{
    fs.saveAs(new Blob([file]), `Invoice_${header.BillNo}.xlsx`);
  });

}

}
