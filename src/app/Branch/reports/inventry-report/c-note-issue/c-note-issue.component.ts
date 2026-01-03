import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { MasterService } from 'app/Branch/master/master.service';

@Component({
  selector: 'app-c-note-issue',
  templateUrl: './c-note-issue.component.html',
  styleUrls: ['./c-note-issue.component.css']
})
export class CNoteIssueComponent implements OnInit {

  @ViewChild('TABLE', { read: ElementRef }) table: ElementRef;

  selectcol1: any;
  selectedColumns: any;
  firstOfMonth: any;
  currentDate: any;
  customerList: any;
  destinationList: any;
  cNoteIssueForm: FormGroup;
  sessionLocationCode: any;
  yourDataArray: any;
  enabledTable = false;
  statusList: any[] = [];
  StatusDetail: any;
  reportType: any = 'StatusDetail';
  fromDate: any;
  toDate: any;
  customerName: any = 'All';
  destination: any = 'All';
  statusName: any = 'All';

  length: any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  pageEvent: PageEvent;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  validationMessage: {
    status: { type: string; message: string; }[];
    remark: { type: string; message: string; }[];
    AWB: { type: string; message: string; }[];
  };
  isHidden = true;

displayedColumns: string[] = [
  'srNo',
  'issueDate',
  'name',
  'fromAwb',
  'toAwb'
];

  dataSource  = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  destinationName: string;
  userType: string;
  formData: any = {
    customerName: '',
    destination: '',
    statusName: '',
    fromDate: '',
    toDate: '',
    reportType: '',
  };
  pageCount = 1;
  branchList: any;
  employeeList: any;
isLoading: boolean = false;

  constructor(public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              public AllService: AllServicesService,
              public masterService: MasterService,) {
                this.fromDate = this.getDefaultDate();
                this.toDate = this.getCurrentDate();
              }

  ngOnInit(): void {
    this.sessionLocationCode = (localStorage.getItem('userType') === 'Admin')
    ? localStorage.getItem('selectedValue')
    : localStorage.getItem('originCode');
    this.userType = localStorage.getItem('userType');
    this.dataSource = new MatTableDataSource;
    this.cNoteIssueForm  = this.formBuilder.group({
      stockIssue: new FormControl('Branch', Validators.compose([])),
      branch: new FormControl('All'),
      customerName: new FormControl('All'),
      employee: new FormControl('All'),
      fromDate: new FormControl('', Validators.compose([ ])),
      toDate: new FormControl('', Validators.compose([ ])),
    });    
     this.loadBranch();
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
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

  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
onStockIssueChange() {
  const value = this.cNoteIssueForm.get('stockIssue')?.value;

  if (value === 'Branch') {
    this.cNoteIssueForm.patchValue({ branch: '', customerName: '', employee: '' });
    this.loadBranch();
  }

  if (value === 'Customer') {
    this.cNoteIssueForm.patchValue({ customerName: '', branch: '', employee: '' });
    this.loadCustomer();
  }

  if (value === 'Employee') {
    this.cNoteIssueForm.patchValue({ employee: '', branch: '', customerName: '' });
    this.loadEmployee();
  }
}
loadBranch() {
  this.masterService.getBranchLocations().subscribe((resp: any) => {
      const allBranch = { locationName: 'All', locationCode: 'All' };
    this.branchList = [allBranch, ...resp.Data];
  });
}

loadCustomer() {
  this.AllService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
    const allCust = { customerName: 'All', customerCode: 'All' };
    this.customerList = [allCust, ...resp.Data];
  });
}

loadEmployee() {
  this.masterService.getEmployeeData(this.sessionLocationCode).subscribe((resp: any) => {
     const allemp = { employeeName: 'All', employeeCode: 'All' };
    this.employeeList = [allemp, ...resp.Data];
  });
}
  resetPagination() {
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.calculatePageCount();
     const formData = this.cNoteIssueForm.value;
    this.formSubmit(formData);
  }

  formSubmit(formData: any) {
    this.isLoading = true;
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
     const code =
    formData.stockIssue === 'Branch' ? formData.branch :
    formData.stockIssue === 'Customer' ? formData.customerName :
    formData.stockIssue === 'Employee' ? formData.employee :
    '';

    this.httpService.get(`${environment.apiUrl}Reports/GetStockIssueReport?code=${code}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&pageNumber=${this.pageIndex + 1}&pageSize=${this.pageSize}` ).then(resp => {
        this.isLoading = false; 
      if ( resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar')
          this.length = resp.count;
          this.calculatePageCount();
            this.dataSource = resp.Data.map((item: any, index: number) => {
              let name =
                item.Customer_Name ??
                item.Employee_Name ??
                item.Location_Name ??
                '-';

              return {
                srNo: index + 1 + (this.pageIndex * this.pageSize),
                issueDate: item.IssueDate,
                name: name,
                fromAwb: item.AwbFromNo,
                toAwb: item.AwbToNo
              };
            });
          this.enabledTable = true;
      } else {
        this.openSnackBar(resp.message, 'error-snackbar')
        this.enabledTable = false;
      }
    }).catch(() => {
    this.isLoading = false;   // 🔹 hide loader on error
    this.openSnackBar('Something went wrong', 'error-snackbar');
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
  const isConfirmed = window.confirm('Do you want to download the Excel file?');
  if (!isConfirmed) { return; }

  const progressBar = this.openprogressbar();
const code =
    this.cNoteIssueForm.value.stockIssue === 'Branch' ? this.cNoteIssueForm.value.branch :
    this.cNoteIssueForm.value.stockIssue === 'Customer' ? this.cNoteIssueForm.value.customerName :
    this.cNoteIssueForm.value.stockIssue === 'Employee' ? this.cNoteIssueForm.value.employee :
    '';
    
  this.httpService.get(`${environment.apiUrl}Reports/GetStockIssueReport?code=${code}&fromDate=${this.cNoteIssueForm.value.fromDate}&toDate=${this.cNoteIssueForm.value.toDate}&pageNumber=1&pageSize=${this.length}`)
    .then((response: any) => {
      const dataForExcel = response.Data.map((element: any, index: number) => {
        let name =
          element.Customer_Code ??
          element.Employee_Code ??
          element.Location_Code ??
          '-';

        return {
          'Sr No': index + 1,
          'Date': element.IssueDate,
          'Name': name,
          'From AWB': element.AwbFromNo,
          'To AWB': element.AwbToNo
        };
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Entrysheet');
      XLSX.writeFile(wb, 'cNote_Issue_Report.xlsx');

      progressBar.close();
    })
    .catch(() => {
      progressBar.close();
      this.openSnackBar('Failed to download report', 'error-snackbar');
    });
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
        const iframe = '<iframe width=\'100%\' height=\'100%\' src=\'' + pdfUrl + '\'></iframe>';
        const x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
      });
    } else {
      console.error('Element not found.');
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
