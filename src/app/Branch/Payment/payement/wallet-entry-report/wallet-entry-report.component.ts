import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditService } from 'app/Branch/audit/audit.service';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { PaymentService } from '../../payment.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment.prod';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-wallet-entry-report',
  templateUrl: './wallet-entry-report.component.html',
  styleUrls: ['./wallet-entry-report.component.css']
})
export class WalletEntryReportComponent implements OnInit {

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
      displayedColumns: string[] = ['Customer_Code','Date','Customer_Name','Amount','PaymentMode','Remark'];

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
      rateViewData: any;
      selectedCustomerCode: any;
      AwbNo:any;
      branchName: any;
      isAdmin = false;
    
      constructor(private auditService: AuditService,
                  public dialog: MatDialog,
                  private snackBar: MatSnackBar,
                  public formBuilder: FormBuilder,
                  public AllService: AllServicesService,
                  public httpService:HttpService,
                  public paymentService: PaymentService
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
    
        this.AllService.getConsignerData(this.sessionLocationCode).subscribe((data: any) => {
          const allCust = { customerName: 'All', customerCode: 'All' };
                this.customerList = [allCust, ...data.Data];
              this.filterForm.patchValue({ CustomerName: 'All' });
        });
   
      
      this.filterForm = this.formBuilder.group({
        // branch: ['All', Validators.required],
        customerType:['All', Validators.required],
        // name:['', Validators.required],
        fromDate: [this.currentDate1, Validators.required],
        toDate: [this.currentDate2, Validators.required],
      });
      
       if (this.userType === 'Admin') {
           this.branchData();
       }
   
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
    
          const sessionLocationCode = this.sessionLocationCode;
          const customerCode = this.filterForm.get('customerType')?.value;
          const fromDate = this.filterForm.get('fromDate')?.value;
          const toDate = this.filterForm.get('toDate')?.value;
      this.paymentService.walletReport(customerCode, fromDate, toDate, this.pageNumber, this.pageSize)
        .subscribe((resp: any) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this.showTable = true;
            // this.dataSource = resp.Data;
            this.dataSource = new MatTableDataSource(resp.Data);
            this.length = resp.count;
            this.calculatePageCount();
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
            this.showTable = false;
          }
        });
    
      } else {
        this.filterForm.markAllAsTouched();
         this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
      }
    }


  downloadExcel() {

    const exportData = this.dataSource.data.map(row => ({
      Customer_Code: row.Customer_Code,
      Date: row.Date,
      Customer_Name: row.Customer_Name,
      Amount: row.Amount,
      PaymentMode: row.PaymentMode,
      Remark: row.Remark,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

    XLSX.writeFile(workbook, 'WalletEntry.xlsx');
  }


  downloadPdf() {

    const tableBody = [
      ['Customer Code', 'Date', 'Customer Name', 'Amount', 'Payment Mode','Remark'],
      ...this.dataSource.data.map((item: any) => [
        item.Customer_Code,
        new Date(item.Date).toLocaleDateString(),
        item.Customer_Name,
        item.Amount,
        item.PaymentMode,
        item.Remark
      ])
    ];

    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: 'WalletEntry Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto','auto','*','auto','auto','*'],
            body: tableBody
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        }
      }
    };

    pdfMake.createPdf(docDefinition).download('WalletEntry.pdf');
  }



    
      applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
  

}
