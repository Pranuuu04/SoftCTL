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
import { Workbook, Worksheet } from 'exceljs';
import { BorderStyle } from 'exceljs';
import * as fs from 'file-saver';


export const EXCEL_COLUMN_MAP = [
  // BASIC
  { flag: 'BookDate', key: 'bookDate', label: 'Book Date' },
  { flag: 'AwbNo', key: 'AwbNo', label: 'Awb No' },
  { flag: 'Origin', key: 'originName', label: 'Origin' },
  { flag: 'Destination', key: 'destinationName', label: 'Destination' },
  { flag: 'Mode', key: 'Mode_Name', label: 'Mode' },
  { flag: 'Pcs', key: 'Qty', label: 'Pcs' },

  // ✅ WEIGHT (API)
  { flag: 'Weight', key: 'ActualWt', label: 'Weight' },

  // RATE
  { flag: 'RateperKg', key: 'RatePerkg', label: 'Rate per Kg' },

  // CHARGES (API NAMES)
  { flag: 'FOV', key: 'FOV_Chrgs', label: 'FOV' },
  { flag: 'Fuel', key: 'FuelCharges', label: 'Fuel' },
  { flag: 'Insurance', key: 'InsuranceCharges', label: 'Insurance' },
  { flag: 'Other', key: 'OtherCharges', label: 'Other' },
  { flag: 'Docket', key: 'DocketChrgs', label: 'Docket' },

  // EXTRA CHARGES
  { flag: 'Charges1', key: 'Charges1', label: 'Charge 1' },
  { flag: 'Charges2', key: 'Charges2', label: 'Charge 2' },
  { flag: 'Charges3', key: 'Charges3', label: 'Charge 3' },
  { flag: 'Charges4', key: 'Charges4', label: 'Charge 4' },
  { flag: 'Charges5', key: 'Charges5', label: 'Charge 5' },
  { flag: 'Charges6', key: 'Charges6', label: 'Charge 6' },
  { flag: 'Charges7', key: 'Charges7', label: 'Charge 7' },
  { flag: 'Charges8', key: 'Charges8', label: 'Charge 8' },
  { flag: 'Charges9', key: 'Charges9', label: 'Charge 9' },
  { flag: 'Charges10', key: 'Charges10', label: 'Charge 10' },

  // FINAL
  { flag: 'TotalAmt', key: 'TOTAL', label: 'Amount' }
];



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


getExcelColumns(setup: any) {
  const columns: any[] = [{ key: 'sr', label: 'SrNo' }];

  EXCEL_COLUMN_MAP.forEach(col => {
    if (setup?.[col.flag] === 1) {
      columns.push({
        key: col.key,
        label: col.label
      });
    }
  });

  return columns;
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
    const items = data.billHeader || [];
    const summary = data.chargesSummary?.[0] || {};
    const setup = data.setup?.[0] || {};
    const terms = data.description?.[0] || {};

    const wb = new Workbook();
    const ws = wb.addWorksheet('Invoice');

    const borderBox:any = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' }
    };

    // ================= COLUMNS =================
    const columns = this.getExcelColumns(setup);
    const colCount = columns.length;

    // ================= LOGO =================
    if (this.ClientLogo) {
      try {
        const logoBase64 = await this.convertImageToBase64(this.ClientLogo);
        const logoId = wb.addImage({ base64: logoBase64, extension: 'png' });

        ws.addImage(logoId, {
          tl: { col: 0, row: 0 },
          ext: { width: 110, height: 65 }
        });

      //       ws.getColumn(1).width = 18;
      //       ws.getColumn(2).width = 18;
      //     } catch (e) {
      //       console.warn('Logo load failed', e);
      //     }
      //   }

      } catch {}
    }

    // ================= HEADER =================
    ws.mergeCells(1, 1, 1, colCount);
    ws.getCell(1, 1).value = header.CompanyName;
    ws.getCell(1, 1).font = { bold: true, size: 16 };
    ws.getCell(1, 1).alignment = { horizontal: 'center', vertical: 'middle' };

    ws.mergeCells(2, 1, 2, colCount);
    ws.getCell(2, 1).value =
      `${header.Location_Add1} ${header.Location_Add2} ${header.Location_Add3}`;
    ws.getCell(2, 1).alignment = { horizontal: 'center' };

    ws.mergeCells(3, 1, 3, colCount);
    ws.getCell(3, 1).value =
      `Tel: ${header.Location_Tel} | Email: ${header.Location_eMail} | GSTIN: ${header.BranchGSTNO}`;
    ws.getCell(3, 1).alignment = { horizontal: 'center' };

    // ================= INFO BOXES =================
    ws.mergeCells(5, 1, 9, Math.ceil(colCount / 3));
    ws.mergeCells(5, Math.ceil(colCount / 3) + 1, 9, Math.ceil(colCount / 3) * 2);
    ws.mergeCells(5, Math.ceil(colCount / 3) * 2 + 1, 9, colCount);

    ws.getCell(5, 1).value =
      `Consignor:\n${header.customerName}\n${header.Customer_Add1 || ''}\n${header.Customer_Pin || ''}\nState: ${header.state_Name} | GSTIN: ${header.CustGST}`;

    ws.getCell(5, Math.ceil(colCount / 3) + 1).value =
      `Shipper:\n${header.Shipper_Name || '-'}`;

    ws.getCell(5, Math.ceil(colCount / 3) * 2 + 1).value =
      `Invoice No: ${header.BillNo}\nInvoice Date: ${header.BillDate}\nFrom: ${header.BillFrom}\nTo: ${header.BillTo}\nMode: ${header.Mode_Name}`;

    [5, 6, 7].forEach((_, i) => {
      ws.getCell(5, i * Math.ceil(colCount / 3) + 1).alignment = { wrapText: true, vertical: 'top' };
      ws.getCell(5, i * Math.ceil(colCount / 3) + 1).border = borderBox;
    });

    // ================= TAX INVOICE =================
    ws.mergeCells(11, 1, 11, colCount);
    ws.getCell(11, 1).value = 'TAX INVOICE';
    ws.getCell(11, 1).font = { bold: true };
    ws.getCell(11, 1).alignment = { horizontal: 'center' };

    // ================= TABLE HEADER =================
    const startRow = 13;
    ws.getRow(startRow).values = columns.map(c => c.label);
    ws.getRow(startRow).font = { bold: true };

    columns.forEach((_, i) => ws.getColumn(i + 1).width = 15);

    ws.getRow(startRow).eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A3B8D4' } };
      cell.border = borderBox;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // ================= TABLE ROWS =================
    let r = startRow + 1;
    let sr = 1;
    let pageTotal = 0;

    items.forEach(item => {
      ws.getRow(r).values = columns.map(c =>
        c.key === 'sr' ? sr++ : item[c.key] ?? ''
      );

      columns.forEach((_, i) => {
        const cell = ws.getCell(r, i + 1);
        cell.border = borderBox;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      pageTotal += item.TOTAL || 0;
      r++;
    });


  // items.forEach(item => {

  //   const rowTotal =
  //     typeof item.TOTAL === 'number'
  //       ? item.TOTAL
  //       : this.calculateRowTotal(item, setup);

  //   ws.getRow(r).values = columns.map(c => {
  //     if (c.key === 'sr') return sr++;
  //     if (c.key === 'TOTAL') return rowTotal;
  //     return item[c.key] ?? '';
  //   });

  //   columns.forEach((_, i) => {
  //     const cell = ws.getCell(r, i + 1);
  //     cell.border = borderBox;
  //     cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //   });

  //   pageTotal += rowTotal;
  //   r++;
  // });

    // ================= PAGE TOTAL =================
    ws.mergeCells(r, 1, r, colCount - 1);
    ws.getCell(r, 1).value = 'Page Total';
    ws.getCell(r, 1).font = { bold: true };
    ws.getCell(r, colCount).value = pageTotal;
    ws.getCell(r, colCount).font = { bold: true };

    r += 2;

    // ================= BANK =================
    ws.mergeCells(r, 1, r + 3, Math.floor(colCount / 2));
    ws.getCell(r, 1).value =
      `Bank Name: ${header.Bank_Name || ''}\n` +
      `Branch: ${header.Bank_Branch || ''}\n` +
      `A/C: ${header.AccountNo || ''}\n` +
      `IFSC: ${header.IFSC_Code || ''}`;
    ws.getCell(r, 1).alignment = { wrapText: true, vertical: 'top' };
    ws.getCell(r, 1).border = borderBox;

    // ================= TAX SUMMARY =================
    const taxCol = Math.floor(colCount / 2) + 1;

    ws.mergeCells(r, taxCol, r, colCount - 1);
    ws.getCell(r, taxCol).value = 'Total Bill Amount';
    ws.getCell(r, colCount).value = summary.sumTotalAmt || 0;

    r++;
    ws.mergeCells(r, taxCol, r, colCount - 1);
    ws.getCell(r, taxCol).value = `SGST @ ${header.SGSTPer}%`;
    ws.getCell(r, colCount).value = summary.SGST || 0;

    r++;
    ws.mergeCells(r, taxCol, r, colCount - 1);
    ws.getCell(r, taxCol).value = `CGST @ ${header.CGSTPer}%`;
    ws.getCell(r, colCount).value = summary.CGST || 0;

    r++;
    ws.mergeCells(r, taxCol, r, colCount - 1);
    ws.getCell(r, taxCol).value = 'Grand Total';
    ws.getCell(r, colCount).value = summary.sumTotalAmt || 0;
    ws.getCell(r, taxCol).font = { bold: true };
    ws.getCell(r, colCount).font = { bold: true };

    r += 2;

  //   const addBottomRow = (label: string, value: number, bold = false) => {
  //   ws.mergeCells(r, Math.floor(colCount / 2) + 1, r, colCount - 1);
  //   ws.getCell(r, Math.floor(colCount / 2) + 1).value = label;
  //   ws.getCell(r, colCount).value = value || 0;

  //   if (bold) {
  //     ws.getCell(r, Math.floor(colCount / 2) + 1).font = { bold: true };
  //     ws.getCell(r, colCount).font = { bold: true };
  //   }
  //   r++;
  // };

  // // Dynamic Bottom Charges
  // if (setup.Bottom_FOV === 1) addBottomRow('FOV', summary.sumFOV);
  // if (setup.Bottom_Fuel === 1) addBottomRow('Fuel', summary.sumFuel);
  // if (setup.Bottom_Insurance === 1) addBottomRow('Insurance', summary.sumInsurance);
  // if (setup.Bottom_Other === 1) addBottomRow('Other', summary.sumOther);
  // if (setup.Bottom_Docket === 1) addBottomRow('Docket', summary.sumDocket);

  // // Taxes
  // if (setup.SGST === 1) addBottomRow(`SGST @ ${header.SGSTPer}%`, summary.SGST);
  // if (setup.CGST === 1) addBottomRow(`CGST @ ${header.CGSTPer}%`, summary.CGST);
  // if (setup.IGST === 1) addBottomRow(`IGST @ ${header.IGSTPer}%`, summary.IGST);

  // // Grand Total
  // addBottomRow('Grand Total', summary.sumTotalAmt, true);


    // ================= AMOUNT IN WORDS =================
    ws.mergeCells(r, 1, r, colCount);
    ws.getCell(r, 1).value =
      `RUPEES IN WORDS: ${(data.totalAmountInWords || '').toUpperCase()} ONLY`;
    ws.getCell(r, 1).font = { bold: true };

    r += 2;

    // ================= TERMS =================
    // ws.mergeCells(r, 1, r, colCount);
    // ws.getCell(r, 1).value = 'TERMS:';
    // ws.getCell(r, 1).font = { bold: true };

    // r++;
    // Object.values(terms).forEach((t: any) => {
    //   if (t) {
    //     ws.mergeCells(r, 1, r, colCount);
    //     ws.getCell(r, 1).value = t;
    //     r++;
    //   }
    // });

// ================= TERMS =================
    const termsStartRow = r;

    ws.mergeCells(r, 1, r, colCount);
    ws.getCell(r, 1).value = 'TERMS:';
    ws.getCell(r, 1).font = { bold: true };
    r++;

    Object.values(terms).forEach((t: any) => {
      if (t) {
        ws.mergeCells(r, 1, r, colCount - 4); // reserve right side for stamp
        ws.getCell(r, 1).value = t;
        ws.getCell(r, 1).alignment = { wrapText: true };
        ws.getRow(r).height = 22;
        r++;
      }
    });

 // ================= STAMP (FIXED SIZE & POSITION) =================
      if (items[0]?.Stamp) {

        const stampId = wb.addImage({
          base64: items[0].Stamp,
          extension: 'png'
        });

        ws.addImage(stampId, {
          tl: {
            col: 13.2,   // Column N (YOU chose this)
            row: 25.3    // Row 26 (YOU chose this)
          },
          ext: {
            width: 220,  // YOU control size
            height: 140
          }
        });
      }
        

    // if (items[0]?.Stamp) {
    //   this.addStampToExcel(
    //     wb,
    //     ws,
    //     items[0].Stamp, // base64 from API
    //     r + 1,          // below terms
    //     colCount
    //   );
    // }

    // ================= SAVE =================
    wb.xlsx.writeBuffer().then(buffer => {
      fs.saveAs(
        new Blob([buffer]),
        `Invoice_${header.CompanyName}_${header.BillNo}.xlsx`
      );
    });

}


// private addStampToExcel(
//   wb: Workbook,
//   ws: Worksheet,
//   base64: string,
//   row: number,
//   colCount: number
// ) {
//   const stampId = wb.addImage({
//     base64,
//     extension: 'png'
//   });

//   ws.addImage(stampId, {
//     tl: {
//       col: colCount - 3,   // right side
//       row: row - 1         // bottom
//     },
//     ext: {
//       width: 200,
//       height: 200
//     }
//   });
// }



private calculateRowTotal(item: any, setup: any): number {
  let total = 0;

  EXCEL_COLUMN_MAP.forEach(col => {

    if (setup?.[col.flag] !== 1) return;

    const value = Number(item[col.key]) || 0;

    switch (col.flag) {

      // Rate × Weight
      case 'RateperKg': {
        const weight =
          Number(item.ActualWt || item.ChargedWt || item.VolumetricWt || 0);
        total += value * weight;
        break;
      }

      // Ignore non-charge columns
      case 'BookDate':
      case 'AwbNo':
      case 'Origin':
      case 'Destination':
      case 'Mode':
      case 'Pcs':
      case 'Weight':
      case 'TotalAmt':
        break;

      // All other charges
      default:
        total += value;
        break;
    }
  });

  return Math.round(total * 100) / 100;
}





}
