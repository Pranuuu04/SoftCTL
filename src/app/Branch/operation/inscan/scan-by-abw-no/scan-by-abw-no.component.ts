import { HttpService } from './../../../../service/http.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AwbBulkComponent } from 'app/Branch/Shared/inscan pages/awb-bulk/awb-bulk.component';
import { PInscanAwbNoComponent } from 'app/Branch/Shared/inscan pages/p-inscan-awb-no/p-inscan-awb-no.component';
import { AllServicesService } from 'app/service/all-services.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { DoneAwbComponent } from 'app/Branch/Shared/inscan pages/done-awb/done-awb.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-scan-by-abw-no',
  templateUrl: './scan-by-abw-no.component.html',
  styleUrls: ['./scan-by-abw-no.component.css']
})
export class ScanByAbwNoComponent implements OnInit {

  currentDate: string;
  awbform: FormGroup;
  validationMessage: any = [];
  AwbTableData: any[] = [];
  sessionLocationCode: string;
  totalPending: number;
  totalDone: number;
  showTable = false;
  Awbno: string = '';
  Status = 'Arrived';
  listData: any = [];
  AwbNoDatalist: string[] = [];
  userType: string;
  destinationName: any;
  dispatch: string;

  constructor(public dialog: MatDialog,
              private httpService: HttpService,
              private formbuilder: FormBuilder,
              private getData: AllServicesService,
              private snackBar: MatSnackBar,
              private renderer: Renderer2,
              private sharedService: SharedService
            ) {
              }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
      this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');

    this.dispatch = localStorage.getItem('dispatch');

     this.currentDate = new Date().toISOString().split('T')[0];
     this.getScanAwbDone();
     this.getScanAwbPeding();
     this.getPedingScan();
      this.getDoneScan();

    this.validationMessage = {
      AWB: [
        {type: 'required', message: 'Please enter Awb no.'}
      ]
    };

    this.awbform  = this.formbuilder.group({
      inscanDate: new FormControl(this.currentDate, Validators.compose([])),
      remark: new FormControl('', Validators.compose([
      ])),
      AWB: new FormControl('', Validators.compose([
         Validators.required
        ])),
    });
  }

  refresh() {
    this.getScanAwbDone();
     this.getScanAwbPeding();
     this.getPedingScan();
     this.getDoneScan();
  }

  async getPedingScan() {
      if (this.userType !== 'Admin') {
        try {
          const resp: any = await  this.getData.getInscanPendingAWB(this.sessionLocationCode, this.dispatch).subscribe((resp: any) => {
            if (resp.status === 1) {
              this.totalPending = resp.Count;
            }
          })
        } catch (error) {
          this.openSnackBar( 'Error fetching pending data:', 'error-snackbar')
          console.error('Error fetching pending data:', error);
        }
      } else {
        try {
          const resp: any = await this.httpService.get(`${environment.apiUrl}inscan/pendingByAwbNo?SessionLocationCode=${this.sessionLocationCode}&dispatchFlag=${this.dispatch}`);
          this.totalPending = resp.Count;
        } catch (error) {
          this.openSnackBar( 'Error fetching pending data:', 'error-snackbar')
          console.error('Error fetching pending data:', error);
        }
      }
  }

  async getDoneScan() {
    if (this.userType === 'Admin') {
      try {
        const resp: any = await  this.httpService.get(`${environment.apiUrl}inscan/viewInscanByAwbNo?SessionLocationCode=${this.sessionLocationCode}&dispatchFlag=${this.dispatch}`);
        this.totalDone = resp.Count;
      } catch (error) {
        this.openSnackBar( 'Error fetching pending data:', 'error-snackbar')
        console.error('Error fetching done data:', error);
      }
    }
  }

  openAwbBulkModal() {
    const dialogRef = this.dialog.open(AwbBulkComponent, {
      data: {
        action: 'add',
        selectedRows: this.AwbNoDatalist
      },
      width: '60rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((selectedAwb: string[]) => {
      if (selectedAwb) {
        selectedAwb.forEach((awbNo) => {
          // Check for duplicates in AwbNoDatalist or listData
          if (
            !this.AwbNoDatalist.includes(awbNo) &&
            !this.listData.some((item) => item.AwbNo === awbNo)
          ) {
            // Add to AwbNoDatalist
            this.AwbNoDatalist.push(awbNo);

            if (this.userType !== 'Admin') {
            this.getData.findinscanAwb(this.sessionLocationCode, awbNo, this.dispatch).subscribe(
              (resp: any) => {
                if (resp.status === 1) {
                  this.showTable = true;
                  const awbDetails = resp.Data[0]; // Assuming Data[0] contains AWB details
                  this.listData.push({
                    Awbno: awbDetails.Awbno,
                    Bookdate: awbDetails.Bookdate,
                    ManifestNo: awbDetails.ManifestNo,
                    manifestDt: awbDetails.manifestDt,
                    Customer_Name: awbDetails.Customer_Name,
                    ConsigneeName: awbDetails.ConsigneeName,
                    FromDest: awbDetails.FromDest,
                    ToDest: awbDetails.ToDest,
                    qty: awbDetails.qty,
                    actualwT: awbDetails.actualwT,
                    ManifestWt: awbDetails.ManifestWt,
                  });
                  this.openSnackBar('AWB added successfully!', 'custom-snackbar');
                } else {
                  this.openSnackBar(resp.message, 'error-snackbar');
                }
              },
              (error) => {
                this.openSnackBar('Error fetching AWB details.', 'error-snackbar');
              }
            );
          } else {
            this.getData.findinscanAwb(this.sessionLocationCode, awbNo, this.dispatch).subscribe(
              (resp: any) => {
                if (resp.status === 1) {
                  this.showTable = true;
                  const awbDetails = resp.Data[0]; // Assuming Data[0] contains AWB details
                  this.listData.push({
                    Awbno: awbDetails.Awbno,
                    Bookdate: awbDetails.Bookdate,
                    ManifestNo: awbDetails.ManifestNo,
                    manifestDt: awbDetails.manifestDt,
                    Customer_Name: awbDetails.Customer_Name,
                    ConsigneeName: awbDetails.ConsigneeName,
                    FromDest: awbDetails.FromDest,
                    ToDest: awbDetails.ToDest,
                    qty: awbDetails.qty,
                    actualwT: awbDetails.actualwT,
                    ManifestWt: awbDetails.ManifestWt,
                  });
                  this.openSnackBar('AWB added successfully!', 'custom-snackbar');
                } else {
                  this.openSnackBar(resp.message, 'error-snackbar');
                }
              },
              (error) => {
                this.openSnackBar('Error fetching AWB details.', 'error-snackbar');
              }
            );
          }
          } else {
            this.openSnackBar(
              `AWB ${awbNo} already exists in the list.`,
              'error-snackbar'
            );
          }
        });
      }
    });
  }

  openPendingAWBModal() {
    const dialogRef = this.dialog.open(PInscanAwbNoComponent, {
      data: {
        action: 'add'
      },
      width: '70rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
    });
  }

  DoneAWBModal() {
    const dialogRef = this.dialog.open(DoneAwbComponent, {
      data: {
        action: 'add'
      },
      width: '70rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
    });
  }

  formSubmit(formData: any) {
    if (this.AwbNoDatalist.length === 0) {
      this.openSnackBar('At least enter one Awb No', 'error-snackbar');
      return;
    }

    const obj = {
      sessionLocationCode: this.sessionLocationCode,
      awbNo: this.AwbNoDatalist,
      InscanDate: formData.inscanDate,
      inscanStatus: this.Status,
      inscanRemark: formData.remark || null,
      dispatchFlag : this.dispatch
    }
    this.getData.postScanAWB(obj).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.showTable = false;
        this.awbform.reset();
         this.awbform.patchValue({
          inscanDate: this.currentDate
        });
        this.listData = [];
        this.AwbNoDatalist = [];
        this.getScanAwbPeding();
        this.getScanAwbDone();
        this.getPedingScan();
        this.getDoneScan();
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    }, error => {
      this.openSnackBar('Error occurred while submitting form: ' + error.message, 'error-snackbar');
      console.error('Error occurred while submitting form:', error);
    });
  }

  async getScanAwbPeding() {
    if (this.userType !== 'Admin') {
      try {
        const resp: any = await this.getData.getInscanPendingAWB(this.sessionLocationCode, this.dispatch).toPromise();
        this.totalPending = resp.Count;
      } catch (error) {
        this.openSnackBar( 'Error fetching pending data:', 'error-snackbar')
        console.error('Error fetching pending data:', error);
      }
    }
  }

  async getScanAwbDone() {
    if (this.userType !== 'Admin') {
      try {
        const resp: any = await this.getData.getScanDoneAWB(this.sessionLocationCode, this.dispatch).toPromise();
        this.totalDone = resp.Count;
      } catch (error) {
        this.openSnackBar( 'Error fetching pending data:', 'error-snackbar')
        console.error('Error fetching done data:', error);
      }
    }
  }

  confirmDelete(Awbno: any): void {
    this.Awbno = Awbno;
    this.openConfirmationDialog();
  }
  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '24rem',
      data: { message: 'Are you sure you want to delete this AWB?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData.getScanDeleteAWB(this.Awbno, this.dispatch).subscribe((resp: any) => {
          if (resp.status === 1) {
            this.openSnackBar( resp.message, 'error-snackbar')
            this.showTable = false;
            this.getScanAwbPeding();
            this.getScanAwbDone();
          } else {
            this.openSnackBar( resp.message, 'error-snackbar')
          }
        });
      } else {
      }
    });
  }

  findAwbNo(formData: any) {
    const awbNoToCheck = formData.AWB;
    if (this.listData.some(item => item.AWB === awbNoToCheck)) {
      this.openSnackBar('AWB number already exists in the list.', 'error-snackbar');
      return;
    }
    if (this.AwbNoDatalist.includes(awbNoToCheck)) {
      this.openSnackBar('AWB number already exists.', 'error-snackbar');
      return;
    }
    if (this.userType !== 'Admin') {
      this.getData.findinscanAwb(this.sessionLocationCode, awbNoToCheck, this.dispatch).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          const awbNoFromResponse = resp.Data[0].Awbno;
          this.showTable = true;
          this.Awbno = '';
          if (this.AwbNoDatalist.includes(awbNoFromResponse)) {
            this.openSnackBar('AWB number already exists.', 'error-snackbar');
            return;
          }
          this.AwbNoDatalist.push(awbNoFromResponse);
          setTimeout(() => {
            this.listData.push({
              Awbno: awbNoFromResponse,
              Bookdate: resp.Data[0].Bookdate,
              ManifestNo: resp.Data[0].ManifestNo,
              manifestDt: resp.Data[0].manifestDt,
              Customer_Name: resp.Data[0].Customer_Name,
              ConsigneeName: resp.Data[0].ConsigneeName,
              FromDest: resp.Data[0].FromDest,
              ToDest: resp.Data[0].ToDest,
              qty: resp.Data[0].qty,
              actualwT: resp.Data[0].actualwT,
              ManifestWt: resp.Data[0].ManifestWt,
            });
          }, 500);
          setTimeout(() => {
            this.renderer.selectRootElement('#AWB').focus();
          }, 600)
        } else {
           this.openSnackBar('Please enter Correct Awb No.', 'error-snackbar');
        }
      }, error => {
        this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
        console.error('Error:', error);
      });
    } else {
      this.getData.findinscanAwb(this.sessionLocationCode, awbNoToCheck, this.dispatch).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          const awbNoFromResponse = resp.Data[0].Awbno;
          this.showTable = true;
          this.Awbno = '';

          if (this.AwbNoDatalist.includes(awbNoFromResponse)) {
            this.openSnackBar('AWB number already exists.', 'error-snackbar');
            return;
          }
          this.AwbNoDatalist.push(awbNoFromResponse);
          setTimeout(() => {
            this.listData.push({
              Awbno: awbNoFromResponse,
              Bookdate: resp.Data[0].Bookdate,
              ManifestNo: resp.Data[0].ManifestNo,
              manifestDt: resp.Data[0].manifestDt,
              Customer_Name: resp.Data[0].Customer_Name,
              ConsigneeName: resp.Data[0].ConsigneeName,
              FromDest: resp.Data[0].FromDest,
              ToDest: resp.Data[0].ToDest,
              qty: resp.Data[0].qty,
              actualwT: resp.Data[0].actualwT,
              ManifestWt: resp.Data[0].ManifestWt,
            });
          }, 500);
          setTimeout(() => {
            this.renderer.selectRootElement('#AWB').focus();
          }, 600)
        }
      })
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
  deleteRow(item: any): void {
    const index = this.listData.indexOf(item);
    if (index !== -1) {
      const AwbNoToDelete = this.listData[index].Awbno;
      this.listData.splice(index, 1);
      const awbIndex = this.AwbNoDatalist.indexOf(AwbNoToDelete);
      if (awbIndex !== -1) {
        this.AwbNoDatalist.splice(awbIndex, 1);
      }
    }
  }

}