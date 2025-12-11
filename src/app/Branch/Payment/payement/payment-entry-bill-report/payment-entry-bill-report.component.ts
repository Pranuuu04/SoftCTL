// import { Component, OnInit } from '@angular/core';
import { Component, OnInit,ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuditService } from 'app/Branch/audit/audit.service';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { PaymentService } from '../../payment.service';
import { environment } from 'environments/environment.prod';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MasterService } from 'app/Branch/master/master.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-payment-entry-bill-report',
  templateUrl: './payment-entry-bill-report.component.html',
  styleUrls: ['./payment-entry-bill-report.component.css']
})
export class PaymentEntryBillReportComponent implements OnInit {

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
              'Customer_Code',
              'Customer_Name',
              'Shipper_Name',
              'Consignee_Name',
              'BookDate',
              'Location_Code',
              'BillNo',
              'BillDt',
              'BillAmt',
              'ServiceTax',
              'OutStandingAmt',
              'Payment_Location_Code',
              'Adjustment_Amt'
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
    
        //  this.AllService.getConsignerData(this.sessionLocationCode)
        //     .subscribe((data: any) => {
        //       const all = { customerName: 'All', customerCode: 'All' };
        //       this.customerList = [all, ...data.Data];
        //     });
  
          this.AllService.getAllCustomer('Customer',this.sessionLocationCode).subscribe((data: any) => {
              const allCust = { customerName: 'All', customerCode: 'All' };
                    this.customerList = [allCust, ...data.Data];
                  this.filterForm.patchValue({ CustomerName: 'All' });
            });
  
          this.masterService.getAndDeleteShipperConsig('getConsignee',this.sessionLocationCode)
            .subscribe((data: any) => {
              const all = { Consignee_Name: 'All', Consignee_Code: 'All' };
              this.consigneeList = [all, ...data.Data];
            });
  
          this.masterService.getAndDeleteShipperConsig('getShipper', this.sessionLocationCode)
            .subscribe((data: any) => {
              const all = { shipper_Name: 'All', shipper_Code: 'All' };
              this.shipperList = [all, ...data.Data];
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
                const allBranch = { locationName: 'All', locationCode: 'All' };
                this.branchName = [allBranch, ...resp.Data];
                this.filterForm.patchValue({ branch: 'All' });
                // this.branchName = resp.Data;
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
        
    //  this.paymentService.PaymentEntryReport(this.sessionLocationCode, customerCode, shipperName, consigneeName, fromDate, toDate, this.pageNumber, this.pageSize)
    //    .subscribe((resp: any) => {
    //      if (resp.status === 1) {
    //        this.openSnackBar(resp.message, 'custom-snackbar');
    //        this.showTable = true;
    //         this.dataSource = new MatTableDataSource(resp.Data);
    //        this.length = resp.count;
    //        this.calculatePageCount();
    //      } else {
    //        this.openSnackBar(resp.message, 'error-snackbar');
    //        this.showTable = false;
    //        // this.rateViewData = [];
    //      }
    //    });
   
     } else {
       this.filterForm.markAllAsTouched();
        this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
     }
   }
  
  
    // downloadExcel() {
    
    //     const exportData = this.dataSource.data.map(row => ({
    //       Customer_Code: row.Customer_Code,
    //       Date: row.Date,
    //       Customer_Name: row.Customer_Name,
    //       Amount: row.Amount,
    //       PaymentMode: row.PaymentMode,
    //       Remark: row.Remark,
    //     }));
    
    //     const worksheet = XLSX.utils.json_to_sheet(exportData);
    //     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    
    //     XLSX.writeFile(workbook, 'PaymentData.xlsx');
    //   }
  
  downloadExcel() {
  
    const exportData = this.dataSource.filteredData.length
      ? this.dataSource.filteredData
      : this.dataSource.data;
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payment Entry Report');
  
    XLSX.writeFile(wb, 'PaymentEntryReport.xlsx');
  }
    
    
  downloadPdf() {
  
    const header = [
      'Customer Code',
      'Customer Name',
      'Shipper',
      'Consignee',
      'Book Date',
      'Location Code',
      'Bill No',
      'Bill Date',
      'Bill Amt',
      'Service Tax',
      'Outstanding',
      'Payment Loc Code',
      'Adjustment'
    ];
  
      const exportData = this.dataSource.filteredData.length
      ? this.dataSource.filteredData
      : this.dataSource.data;
  
    const tableBody = [
      header,
      // ...this.dataSource.data.map((e: any) => [
      ...exportData.map((e: any) => [
        e.Customer_Code || '',
        e.Customer_Name || '',
        e.Shipper_Name || '',
        e.Consignee_Name || '',
        e.BookDate ? new Date(e.BookDate).toLocaleDateString() : '',
        e.Location_Code || '',
        e.BillNo ?? '',
        e.BillDt ? new Date(e.BillDt).toLocaleDateString() : '',
        e.BillAmt ?? '',
        e.ServiceTax ?? '',
        e.OutStandingAmt ?? '',
        e.Payment_Location_Code ?? '',
        e.Adjustment_Amt ?? '',
      ])
    ];
  
    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: 'Payment Entry Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: Array(header.length).fill('*'),
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
  
    pdfMake.createPdf(docDefinition).download('PaymentEntryReport.pdf');
  }
  
  
      applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
  

}
