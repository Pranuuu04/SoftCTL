import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DrsBulkComponent } from 'app/Branch/Shared/Runsheet-pages/drs-bulk/drs-bulk.component';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-direct-drs-entry',
  templateUrl: './direct-drs-entry.component.html',
  styleUrls: ['./direct-drs-entry.component.css']
})
export class DirectDrsEntryComponent implements OnInit {

  Drsentryform: FormGroup;
  validationMessage: any = [];
  currentDate: string;
  sessionLocationCode: string;
  DrsViewData: any[] = [];
  pageSizeOptions: number[] = [5, 10, 20];
  showFirstLastButtons: any;
  totalPending: any;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 1;
  pageSize: number ;
  nameList: any ;
  AwbNoData: any ;
  listData: any = [];
  AwbNoDatalist: any = [];
  displayedColumns: any[] = ['awbNo', 'bookDate', 'manifestNo', 'manifestDate' , 'customerType', 'consigneeName', 'Origin', 'Destination_Name', 'consigneePin', 'modeCode', 'Product_Type', 'Qty', 'ActualWt', 'totalAmt'];
  showTable = false;
  AwbNo = '';
  userType: any;
  selectedValue: any;
  destinationName: any;
  username: string;

  constructor(private allservice: AllServicesService,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private renderer: Renderer2, ) {
                this.sessionLocationCode = localStorage.getItem('originCode');
              }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.username = localStorage.getItem('userName');
    this.destinationName = localStorage.getItem('selectedValue');
    this.getNameList();
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.getPendingData(1, 50);

    this.currentDate = new Date().toISOString().split('T')[0];
    this.validationMessage = {
      area: [
        {type: 'required', message: 'please Enter area'}
      ],
      userName: [
        {type: 'required', message: 'please enter userName'}
      ],
      employeeMobile: [
        // { type: 'required', message: 'Mobile number is required' },
        { type: 'minlength', message: 'Mobile number must be at least 10 digits' },
        { type: 'maxlength', message: 'Mobile number cannot exceed 10 digits' },
        { type: 'pattern', message: 'Mobile number should contain only numeric digits' }
      ],
      vehicleNo: [
        {type: 'required', message: 'please enter vehicleNo'}
      ],
       AwbNo: [
        {type: 'required', message: 'please enter AwbNo'}
      ]
    }

    this.Drsentryform = this.formbuilder.group({
      area: new FormControl('', Validators.compose([
        Validators.required
      ])),
      DrsDate: new FormControl(this.currentDate, Validators.compose([
        Validators.required
      ])),
      userName: new FormControl('', Validators.compose([])),
      employeeMobile: new FormControl('', Validators.compose([
        // Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$')
      ])),
      vehicleNo: new FormControl('', Validators.compose([
      ])),
      AwbNo: new FormControl('', Validators.compose([
      ]))
    })
  }
  refresh() {
    this.getPendingData(1, 50);
  }

  async getPendingData(pageNumber: number, pageSize: number) {
    try {
      let resp: any;
      if (this.userType !== 'Admin') {
        resp = await this.allservice.getDirectRunsheetPending(this.sessionLocationCode, pageNumber, pageSize).toPromise();
      } else {
        resp = await this.allservice.getDirectRunsheetPending(this.destinationName, pageNumber, pageSize).toPromise();
      }

      if (resp.status === 1) {
        this.showTable = true;
        this.DrsViewData = resp.Data;
        this.dataSource = new MatTableDataSource(this.DrsViewData);
        this.dataSource.paginator = this.paginator;
      } else {
        this.showTable = false;
      }
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  }


    openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  async getNameList() {
    try {
      let resp: any;
      if (this.userType !== 'Admin') {
        resp = await this.allservice.getEmpList(this.sessionLocationCode).toPromise();
      } else {
        resp = await this.allservice.getEmpList(this.destinationName).toPromise();
      }

      this.nameList = resp.Data;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching name list:', error);
    }
  }

  onEmployeeSelect(event: any) {
  const selectedEmpCode = event.target.value;
  const selectedEmp = this.nameList.find(
    (emp: any) => emp.employeeCode.toString() === selectedEmpCode
  );

  if (selectedEmp) {
    this.Drsentryform.patchValue({
      employeeMobile: selectedEmp.employeeMobile
    });
  }
}
  submitDrsForm(formData: any) {
    const awbNoToCheck = formData.AwbNo;
    if (this.listData.some(item => item.awbNo === awbNoToCheck)) {
      this.openSnackBar('AWB number already exists in the list.', 'error-snackbar')
      return;
    }
    if (this.AwbNoDatalist.includes(awbNoToCheck)) {
      this.openSnackBar( 'AWB number already exists.', 'error-snackbar')
      return;
    }
    if (this.userType !== 'Admin') {
      this.allservice.GetDirectRunsheetAwb(this.sessionLocationCode, awbNoToCheck).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar')
          const awbNoFromResponse = resp.Data[0].awbNo;
          this.AwbNo = '';
          if (this.AwbNoDatalist.includes(awbNoFromResponse)) {
            this.openSnackBar( 'AWB number already exists.', 'error-snackbar')
            return;
          }
          this.AwbNoDatalist.push(awbNoFromResponse);
          setTimeout(() => {
            this.listData.push({
              awbNo: awbNoFromResponse,
              bookDate: resp.Data[0].bookDate,
              conginer: resp.Data[0].customerName,
              conginee: resp.Data[0].consigneeName,
              qty: resp.Data[0].Qty,
              weight: resp.Data[0].ActualWt,
            });
          }, 500);
          setTimeout(() => {
            this.renderer.selectRootElement('#AwbNo').focus();
          }, 600)
        } else {
          this.openSnackBar(resp.message, 'error-snackbar')
        }
      }, error => {
        console.error('Error fetching data:', error);
        this.openSnackBar( 'Please enter Correct Awb No.', 'error-snackbar')
      });
    } else {
      this.allservice.GetDirectRunsheetAwb(this.destinationName, awbNoToCheck).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar')
          const awbNoFromResponse = resp.Data[0].awbNo;
          this.AwbNo = '';
          if (this.AwbNoDatalist.includes(awbNoFromResponse)) {
            this.openSnackBar( 'AWB number already exists.', 'error-snackbar')
            return;
          }
          this.AwbNoDatalist.push(awbNoFromResponse);
          setTimeout(() => {
            this.listData.push({
              awbNo: awbNoFromResponse,
              bookDate: resp.Data[0].bookDate,
              conginer: resp.Data[0].customerName,
              conginee: resp.Data[0].consigneeName,
              qty: resp.Data[0].Qty,
              weight: resp.Data[0].ActualWt,
            });
          }, 500);
          setTimeout(() => {
            this.renderer.selectRootElement('#AwbNo').focus();
          }, 600)
        } else {
          this.openSnackBar(resp.message, 'error-snackbar')
        }
      }, error => {
        console.error('Error fetching data:', error);
        this.openSnackBar( 'Please enter Correct Awb No.', 'error-snackbar')
      });
    }
  }

  generateData() {
    if (
      !this.Drsentryform.value.area
    ) {
      this.openSnackBar('Please fill in all required fields.', 'error-snackbar')
      return;
    }
    // if (this.Drsentryform.get('employeeMobile').invalid) {
    //   this.openSnackBar('Please enter a valid mobile number.','error-snackbar')
    //   return;
    // }
    if (this.AwbNoDatalist.length === 0) {
      this.openSnackBar('AwbNo is empty.', 'error-snackbar')
      return;
    }
    const postData = {
      area: this.Drsentryform.value.area,
      DrsDate: this.Drsentryform.value.DrsDate,
      userName: this.username,
      employeeMobile: this.Drsentryform.value.employeeMobile,
      vehicleNo: this.Drsentryform.value.vehicleNo,
      AwbNo: this.AwbNoDatalist,
      pickupBoy: this.Drsentryform.value.userName,
      sessionLocationCode: this.sessionLocationCode
    };
    if (this.Drsentryform.get('employeeMobile').value) {
      if (this.Drsentryform.get('employeeMobile').invalid) {
        this.openSnackBar('Please enter a valid mobile number.', 'error-snackbar');
        return;
      }
    }
    if (this.userType !== 'Admin') {
      this.allservice.postDrsEntry(postData).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar')
          this.Drsentryform.reset();
            this.Drsentryform.patchValue({
          DrsDate: this.currentDate
        });
          this.listData = [];
          this.getPendingData(1, 50);
          this.AwbNoDatalist = [];
          this.dataSource = new MatTableDataSource(this.DrsViewData);
          this.dataSource.paginator = this.paginator;
        } else {
          this.openSnackBar(resp.message, 'error-snackbar')
        }
      });
    } else {
      const postData = {
        area: this.Drsentryform.value.area,
        userName: this.username,
        employeeMobile: this.Drsentryform.value.employeeMobile,
        vehicleNo: this.Drsentryform.value.vehicleNo,
        AwbNo: this.AwbNoDatalist,
        pickupBoy: this.Drsentryform.value.userName,
        sessionLocationCode: this.destinationName
      };
      this.allservice.postDrsEntry(postData).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar')
          this.Drsentryform.reset();
            this.Drsentryform.patchValue({
          DrsDate: this.currentDate
        });
          this.listData = [];
          this.getPendingData(1, 50);
          this.AwbNoDatalist = [];
          this.dataSource = new MatTableDataSource(this.DrsViewData);
          this.dataSource.paginator = this.paginator;
        } else {
          this.openSnackBar(resp.message, 'error-snackbar')
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
 openDirectDrsBulkModal() {
      const dialogRef = this.dialog.open(DrsBulkComponent, {
        data: {
          action: 'add'
        },
        width: '60rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
        }
      });
    }

}
