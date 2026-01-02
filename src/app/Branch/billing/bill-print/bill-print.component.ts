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
import { BorderStyle } from 'exceljs';
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
     console.log("Test>>>> ",this.ClientLogo)
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

  this.http.post(PdfUrl, obj, { headers, responseType: 'blob' as 'json' })
    .subscribe((blob: Blob) => {

      dialogRef.close();

      // 👉 Create a new Blob with PDF MIME type
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });

      const fileName = `Billing_Print_${element.BillNo}.pdf`;

      // 👉 Create blob URL
      const blobUrl = URL.createObjectURL(pdfBlob);

      // 👉 Open in new tab (NO download)
      const newTab = window.open(blobUrl, '_blank');

      // OPTIONAL: Attach the filename in the window title
      if (newTab) {
        newTab.document.title = fileName;
      }

    }, error => {
      dialogRef.close();
      console.error("Error generating PDF:", error);
    });
}


getExcelColumns(setup: any) {
  return [
    { key: 'sr', label: 'SrNo', show: true },
    { key: 'bookDate', label: 'Book Date', show: setup.BookDate === 1 },
    { key: 'AwbNo', label: 'Awb No', show: setup.AwbNo === 1 },
    { key: 'Consignee_Name', label: 'Consignee', show: setup.Consignee === 1 },
    { key: 'originName', label: 'Origin', show: setup.Origin === 1 },
    { key: 'destinationName', label: 'Destination', show: setup.Destination === 1 },
    { key: 'Mode_Name', label: 'Mode', show: setup.Mode === 1 },
    { key: 'Qty', label: 'Pcs', show: setup.Pcs === 1 },
    { key: 'RatePerkg', label: 'Rate per Kg', show: setup.RateperKg === 1 },
    { key: 'DocketChrgs', label: 'Docket', show: setup.Docket === 1 },
    { key: 'TOTAL', label: 'Amount', show: setup.TotalAmt === 1 }
  ].filter(c => c.show);
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


// downloadInvoiceExcel(data: any) {

//   const header = data.billHeader[0];
//   const items = data.billHeader;
//   const summary = data.chargesSummary[0];
//   const setup = data.setup[0];
//   const terms = data.description[0];

//   const wb = new Workbook();
//   const ws = wb.addWorksheet('Invoice');

//   const thin = { style: 'thin' };
//   const borderBox:any = { top: thin, left: thin, right: thin, bottom: thin };

//   // ================= COMPANY HEADER =================
//   ws.mergeCells('A1:K1');
//   ws.getCell('A1').value = header.CompanyName;
//   ws.getCell('A1').font = { bold: true, size: 16 };
//   ws.getCell('A1').alignment = { horizontal: 'center' };

//   ws.mergeCells('A2:K2');
//   ws.getCell('A2').value =
//     `${header.Location_Add1} ${header.Location_Add2} ${header.Location_Add3}`;
//   ws.getCell('A2').alignment = { horizontal: 'center' };

//   ws.mergeCells('A3:K3');
//   ws.getCell('A3').value =
//     `Tel: ${header.Location_Tel} | Email: ${header.Location_eMail} | GSTIN: ${header.BranchGSTNO}`;
//   ws.getCell('A3').alignment = { horizontal: 'center' };

//   // ================= 3 BOX SECTION =================
//   ws.mergeCells('A5:D9'); // Consignor
//   ws.mergeCells('E5:H9'); // Shipper
//   ws.mergeCells('I5:K9'); // Invoice

//   ws.getCell('A5').value =
//     `Consignor:\n${header.customerName}\n${header.Customer_Add1 || ''}\n${header.Customer_Pin || ''}\nState: ${header.state_Name} | GSTIN: ${header.CustGST}`;

//   ws.getCell('E5').value =
//     `Shipper:\n${header.Shipper_Name || '-'}\nMobile:\nEmail:\nState Code | GSTIN`;

//   ws.getCell('I5').value =
//     `Invoice No: ${header.BillNo}\nInvoice Date: ${header.BillDate}\nInvoice From: ${header.BillFrom}\nInvoice To: ${header.BillTo}\nMode: ${header.Mode_Name}`;

//   ['A5','E5','I5'].forEach(c => {
//     ws.getCell(c).alignment = { wrapText: true, vertical: 'top' };
//     ws.getCell(c).border = borderBox;
//   });

//   // ================= TAX INVOICE =================
//   ws.mergeCells('A11:K11');
//   ws.getCell('A11').value = 'TAX INVOICE';
//   ws.getCell('A11').font = { bold: true };
//   ws.getCell('A11').alignment = { horizontal: 'center' };

//   // ================= TABLE =================
//   const columns = this.getExcelColumns(setup);
//   const startRow = 13;

//   ws.getRow(startRow).values = columns.map(c => c.label);
//   ws.getRow(startRow).font = { bold: true };

//   ws.getRow(startRow).eachCell(cell => {
//     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A3B8D4' } };
//     cell.border = borderBox;
//     cell.alignment = { horizontal: 'center' };
//   });

//   let r = startRow + 1;
//   let sr = 1;
//   let pageTotal = 0;

//   items.forEach(item => {
//     ws.getRow(r).values = columns.map(c =>
//       c.key === 'sr' ? sr++ : item[c.key] ?? ''
//     );

//     ws.getRow(r).eachCell(cell => cell.border = borderBox);
//     pageTotal += item.TOTAL;
//     r++;
//   });

//   // ================= PAGE TOTAL =================
//   ws.mergeCells(`A${r}:J${r}`);
//   ws.getCell(`A${r}`).value = 'Page Total';
//   ws.getCell(`K${r}`).value = pageTotal;
//   ws.getCell(`A${r}`).font = { bold: true };
//   r += 2;

//   // ================= BANK + TAX BOX =================
//   ws.mergeCells(`A${r}:F${r+3}`);
//   ws.getCell(`A${r}`).value =
//     `Bank Name: ${header.Bank_Name}\nBranch: ${header.Bank_Branch}\nA/C: ${header.AccountNo}\nIFSC: ${header.IFSC_Code}`;
//   ws.getCell(`A${r}`).alignment = { wrapText: true };
//   ws.getCell(`A${r}`).border = borderBox;

//   ws.mergeCells(`G${r}:J${r}`);
//   ws.getCell(`G${r}`).value = 'Total Bill Amount';
//   ws.getCell(`K${r}`).value = summary.sumTotalAmt;

//   ws.mergeCells(`G${r+1}:J${r+1}`);
//   ws.getCell(`G${r+1}`).value = `SGST @ ${header.SGSTPer}%`;
//   ws.getCell(`K${r+1}`).value = summary.SGST;

//   ws.mergeCells(`G${r+2}:J${r+2}`);
//   ws.getCell(`G${r+2}`).value = `CGST @ ${header.CGSTPer}%`;
//   ws.getCell(`K${r+2}`).value = summary.CGST;

//   ws.mergeCells(`G${r+3}:J${r+3}`);
//   ws.getCell(`G${r+3}`).value = 'Grand Total';
//   ws.getCell(`K${r+3}`).value = summary.sumTotalAmt;
//   ws.getCell(`G${r+3}`).font = { bold: true };

//   // ================= AMOUNT IN WORDS =================
//   r += 5;
//   ws.mergeCells(`A${r}:K${r}`);
//   ws.getCell(`A${r}`).value =
//     `RUPEES IN WORDS: ${data.totalAmountInWords.toUpperCase()} ONLY`;
//   ws.getCell(`A${r}`).font = { bold: true };

//   // ================= TERMS =================
//   r += 2;
//   ws.mergeCells(`A${r}:K${r}`);
//   ws.getCell(`A${r}`).value = 'TERMS:';
//   ws.getCell(`A${r}`).font = { bold: true };
//   r++;

//   Object.values(terms).forEach((t: any) => {
//     if (t) {
//       ws.mergeCells(`A${r}:K${r}`);
//       ws.getCell(`A${r}`).value = t;
//       r++;
//     }
//   });

//   // ================= SAVE =================
//   wb.xlsx.writeBuffer().then(buffer => {
//     fs.saveAs(
//       new Blob([buffer]),
//       `Invoice_${header.CompanyName}_${header.BillNo}.xlsx`
//     );
//   });
// }

async convertImageToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


async downloadInvoiceExcel(data: any) {

  const header = data.billHeader[0];
  const items = data.billHeader;
  const summary = data.chargesSummary[0];
  const setup = data.setup[0];
  const terms = data.description[0];

  const wb = new Workbook();
  const ws = wb.addWorksheet('Invoice');

  const borderBox: any = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' }
  };

  // ================= CLIENT LOGO =================
  if (this.ClientLogo) {
    try {
      const logoBase64 = await this.convertImageToBase64(this.ClientLogo);

      const logoId = wb.addImage({
        base64: logoBase64,
        extension: 'png' // or 'jpeg'
      });

      ws.addImage(logoId, {
        tl: { col: 0, row: 0 },   // A1
        ext: { width: 120, height: 70 }
      });

      ws.getColumn(1).width = 18;
      ws.getColumn(2).width = 18;
    } catch (e) {
      console.warn('Logo load failed', e);
    }
  }

  // ================= COMPANY HEADER =================
  ws.mergeCells('C1:K1');
  ws.getCell('C1').value = header.CompanyName;
  ws.getCell('C1').font = { bold: true, size: 16 };
  ws.getCell('C1').alignment = { horizontal: 'center' };

  ws.mergeCells('C2:K2');
  ws.getCell('C2').value =
    `${header.Location_Add1} ${header.Location_Add2} ${header.Location_Add3}`;
  ws.getCell('C2').alignment = { horizontal: 'center' };

  ws.mergeCells('C3:K3');
  ws.getCell('C3').value =
    `Tel: ${header.Location_Tel} | Email: ${header.Location_eMail} | GSTIN: ${header.BranchGSTNO}`;
  ws.getCell('C3').alignment = { horizontal: 'center' };

  // ================= 3 BOX SECTION =================
  ws.mergeCells('A5:D9'); // Consignor
  ws.mergeCells('E5:H9'); // Shipper
  ws.mergeCells('I5:K9'); // Invoice

  ws.getCell('A5').value =
    `Consignor:\n${header.customerName}\n${header.Customer_Add1 || ''}\n${header.Customer_Pin || ''}\nState: ${header.state_Name} | GSTIN: ${header.CustGST}`;

  ws.getCell('E5').value =
    `Shipper:\n${header.Shipper_Name || '-'}\nMobile:\nEmail:\nState Code | GSTIN`;

  ws.getCell('I5').value =
    `Invoice No: ${header.BillNo}\nInvoice Date: ${header.BillDate}\nInvoice From: ${header.BillFrom}\nInvoice To: ${header.BillTo}\nMode: ${header.Mode_Name}`;

  ['A5', 'E5', 'I5'].forEach(c => {
    ws.getCell(c).alignment = { wrapText: true, vertical: 'top' };
    ws.getCell(c).border = borderBox;
  });

  // ================= TAX INVOICE =================
  ws.mergeCells('A11:K11');
  ws.getCell('A11').value = 'TAX INVOICE';
  ws.getCell('A11').font = { bold: true };
  ws.getCell('A11').alignment = { horizontal: 'center' };

  // ================= TABLE =================
  const columns = this.getExcelColumns(setup);
  const startRow = 13;

  ws.getRow(startRow).values = columns.map(c => c.label);
  ws.getRow(startRow).font = { bold: true };

  ws.getRow(startRow).eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A3B8D4' } };
    cell.border = borderBox;
    cell.alignment = { horizontal: 'center' };
  });

  let r = startRow + 1;
  let sr = 1;
  let pageTotal = 0;

  items.forEach(item => {
    ws.getRow(r).values = columns.map(c =>
      c.key === 'sr' ? sr++ : item[c.key] ?? ''
    );
    ws.getRow(r).eachCell(cell => cell.border = borderBox);
    pageTotal += item.TOTAL;
    r++;
  });

  // ================= PAGE TOTAL =================
  ws.mergeCells(`A${r}:J${r}`);
  ws.getCell(`A${r}`).value = 'Page Total';
  ws.getCell(`K${r}`).value = pageTotal;
  ws.getCell(`A${r}`).font = { bold: true };
  r += 2;

  // ================= BANK + TAX BOX =================
  ws.mergeCells(`A${r}:F${r + 3}`);
  ws.getCell(`A${r}`).value =
    `Bank Name: ${header.Bank_Name}\nBranch: ${header.Bank_Branch}\nA/C: ${header.AccountNo}\nIFSC: ${header.IFSC_Code}`;
  ws.getCell(`A${r}`).alignment = { wrapText: true };
  ws.getCell(`A${r}`).border = borderBox;

  ws.mergeCells(`G${r}:J${r}`);
  ws.getCell(`G${r}`).value = 'Total Bill Amount';
  ws.getCell(`K${r}`).value = summary.sumTotalAmt;

  ws.mergeCells(`G${r + 1}:J${r + 1}`);
  ws.getCell(`G${r + 1}`).value = `SGST @ ${header.SGSTPer}%`;
  ws.getCell(`K${r + 1}`).value = summary.SGST;

  ws.mergeCells(`G${r + 2}:J${r + 2}`);
  ws.getCell(`G${r + 2}`).value = `CGST @ ${header.CGSTPer}%`;
  ws.getCell(`K${r + 2}`).value = summary.CGST;

  ws.mergeCells(`G${r + 3}:J${r + 3}`);
  ws.getCell(`G${r + 3}`).value = 'Grand Total';
  ws.getCell(`K${r + 3}`).value = summary.sumTotalAmt;
  ws.getCell(`G${r + 3}`).font = { bold: true };

  // ================= AMOUNT IN WORDS =================
  r += 5;
  ws.mergeCells(`A${r}:K${r}`);
  ws.getCell(`A${r}`).value =
    `RUPEES IN WORDS: ${data.totalAmountInWords.toUpperCase()} ONLY`;
  ws.getCell(`A${r}`).font = { bold: true };

  // ================= TERMS =================
  r += 2;
  ws.mergeCells(`A${r}:K${r}`);
  ws.getCell(`A${r}`).value = 'TERMS:';
  ws.getCell(`A${r}`).font = { bold: true };
  r++;

  Object.values(terms).forEach((t: any) => {
    if (t) {
      ws.mergeCells(`A${r}:K${r}`);
      ws.getCell(`A${r}`).value = t;
      r++;
    }
  });

  // ================= SAVE =================
  wb.xlsx.writeBuffer().then(buffer => {
    fs.saveAs(
      new Blob([buffer]),
      `Invoice_${header.CompanyName}_${header.BillNo}.xlsx`
    );
  });
}




}
