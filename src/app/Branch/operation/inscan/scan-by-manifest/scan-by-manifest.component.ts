import { HttpService } from './../../../../service/http.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ManifestBulkComponent } from 'app/Branch/Shared/inscan pages/manifest-bulk/manifest-bulk.component';
import { PInscanManifNoComponent } from 'app/Branch/Shared/inscan pages/p-inscan-manif-no/p-inscan-manif-no.component';
import { AllServicesService } from 'app/service/all-services.service';
import { DoneManfComponent } from 'app/Branch/Shared/inscan pages/done-manf/done-manf.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { SharedService } from 'app/service/shared.service';

@Component({
  selector: 'app-scan-by-manifest',
  templateUrl: './scan-by-manifest.component.html',
  styleUrls: ['./scan-by-manifest.component.css']
})
export class ScanByManifestComponent implements OnInit {

  currentDate: string;
  validationMessage: any = [];
  manifestform: FormGroup;
  ManfTableData: any[] = [];
  totalPending: any;
  sessionLocationCode: string;
  totalDone: number;
  showTable = false;
  Manifest_no: number;
  Status = 'Arrived';
  listData: any = [];
  ManfNoDatalist: string [] = [];
  ManfNo: any = '';
  userType: string;
  destinationName: any;
  dispatch: string;
  isLoading = false;

  constructor(public dialog: MatDialog,
              private httpService: HttpService,
              private formbuilder: FormBuilder,
              private getData: AllServicesService,
              private snackBar: MatSnackBar,
              private renderer: Renderer2) {}


  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.dispatch = localStorage.getItem('dispatch');
 this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');
    this.currentDate = new Date().toISOString().split('T')[0];
    this.validationMessage = {
      Status: [
        {type: 'required', message: 'please select status'}
      ],
      remark: [
        {type: 'required', message: 'please enter remark'}
      ],
      manifest: [
        {type: 'required', message: 'please enter manifest No.'}
      ],
      dispatch: [
        {type: 'required', message: 'please enter dispatch No.'}
      ]
    }

    this.manifestform = this.formbuilder.group({
      manfDate: new FormControl(this.currentDate, Validators.compose([])),
      Status: new FormControl('', Validators.compose([
        Validators.required
      ])),
      remark: new FormControl('', Validators.compose([])),
      manifest: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }
  refresh() {
    this.getScanManfPeding();
    this.getScanManfDone();
  }

  // openManifestBulkModal() {
  //   const dialogRef = this.dialog.open(ManifestBulkComponent, {
  //     data: {
  //       action: 'add',
  //       selectedRows : this.ManfNoDatalist
  //     },
  //     width: '60rem',
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe((selectedAwb: string[]) => {
  //     if (selectedAwb) {
  //       selectedAwb.forEach((manfNo) => {
  //         // Check for duplicates in ManfNoDatalist or listData
  //         if (
  //           !this.ManfNoDatalist.includes(manfNo) &&
  //           !this.listData.some((item) => item.AwbNo === manfNo)
  //         ) {
  //           // Add to ManfNoDatalist
  //           this.ManfNoDatalist.push(manfNo);

  //           if (this.userType !== 'Admin') {
  //           this.getData.findinscanManf(this.sessionLocationCode, manfNo, this.dispatch).subscribe(
  //             (resp: any) => {
  //               if (resp.status === 1) {
  //                 this.showTable = true;
  //                 const ManfDetails = resp.Data[0];
  //                 this.listData.push({
  //                   Manifest_no: ManfDetails.Manifest_no,
  //                   manifestDt: ManfDetails.manifestDt,
  //                   via: ManfDetails.via,
  //                   mode: ManfDetails.mode,
  //                   shipment: ManfDetails.shipment,
  //                   qty: ManfDetails.qty,
  //                   actualWT: ManfDetails.actualWT,
  //                   vehicle_no: ManfDetails.vehicle_no,
  //                   Driver_Name: ManfDetails.Driver_Name,
  //                   Route: ManfDetails.Route,
  //                 });
  //                 this.openSnackBar('AWB added successfully!', 'custom-snackbar');
  //               } else {
  //                 this.openSnackBar(resp.message, 'error-snackbar');
  //               }
  //             },
  //             (error) => {
  //               this.openSnackBar('Error fetching AWB details.', 'error-snackbar');
  //             }
  //           );
  //         } else {
  //           this.getData.findinscanManf(this.sessionLocationCode, manfNo, this.dispatch).subscribe(
  //             (resp: any) => {
  //               if (resp.status === 1) {
  //                 this.showTable = true;
  //                 const ManfDetails = resp.Data[0];
  //                 this.listData.push({
  //                   Manifest_no: ManfDetails.Manifest_no,
  //                   manifestDt: ManfDetails.manifestDt,
  //                   via: ManfDetails.via,
  //                   mode: ManfDetails.mode,
  //                   shipment: ManfDetails.shipment,
  //                   qty: ManfDetails.qty,
  //                   actualWT: ManfDetails.actualWT,
  //                   vehicle_no: ManfDetails.vehicle_no,
  //                   Driver_Name: ManfDetails.Driver_Name,
  //                   Route: ManfDetails.Route,
  //                 });
  //                 this.openSnackBar('AWB added successfully!', 'custom-snackbar');
  //               } else {
  //                 this.openSnackBar(resp.message, 'error-snackbar');
  //               }
  //             },
  //             (error) => {
  //               this.openSnackBar('Error fetching AWB details.', 'error-snackbar');
  //             }
  //           );
  //         }
  //         } else {
  //           this.openSnackBar(
  //             `AWB ${manfNo} already exists in the list.`,
  //             'error-snackbar'
  //           );
  //         }
  //       });
  //     }
  //   });
  // }
openManifestBulkModal() {
  const dialogRef = this.dialog.open(ManifestBulkComponent, {
    data: {
      action: 'add',
      selectedRows: this.ManfNoDatalist
    },
    width: '60rem',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((selectedManf: string[]) => {

    if (!selectedManf) return;

    this.isLoading = true;

    let processed = 0;

    selectedManf.forEach((manfNo) => {
      if (
        this.ManfNoDatalist.includes(manfNo) ||
        this.listData.some(item => item.Manifest_no === manfNo)
      ) {
        this.openSnackBar(`Manifest ${manfNo} already exists.`, 'error-snackbar');

        processed++;
        if (processed === selectedManf.length) this.isLoading = false;
        return;
      }
      this.ManfNoDatalist.push(manfNo);
      this.getData
        .findinscanManf(this.sessionLocationCode, manfNo, this.dispatch)
        .subscribe(
          (resp: any) => {
            processed++;

            if (resp.status === 1) {
              this.showTable = true;

              const d = resp.Data[0];

              this.listData.push({
                Manifest_no: d.Manifest_no,
                manifestDt: d.manifestDt,
                via: d.via,
                mode: d.mode,
                shipment: d.shipment,
                qty: d.qty,
                actualWT: d.actualWT,
                vehicle_no: d.vehicle_no,
                Driver_Name: d.Driver_Name,
                Route: d.Route,
              });

              this.openSnackBar('Manifest added successfully!', 'custom-snackbar');

            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }

            if (processed === selectedManf.length) {
              this.isLoading = false;
            }
          },
          () => {
            processed++;
            this.openSnackBar('Error fetching Manifest details.', 'error-snackbar');

            if (processed === selectedManf.length) {
              this.isLoading = false;
            }
          }
        );
    });
  });
}

  openPendingManfModal() {
    const dialogRef = this.dialog.open(PInscanManifNoComponent, {
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

  DoneManfModal() {
    const dialogRef = this.dialog.open(DoneManfComponent, {
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

  submitmanifest(formData: any) {
    if (this.ManfNoDatalist.length === 0) {
      if (this.dispatch === '1') {
        this.openSnackBar( 'Atleast enter one dispatch No', 'error-snackbar')
      } else {
        this.openSnackBar( 'Atleast enter one Manifest No', 'error-snackbar')
      }
      return;
    }
    // tslint:disable-next-line:prefer-const
    let obj = {
      sessionLocationCode: this.sessionLocationCode,
      InscanDate: formData.manfDate,
      inscanStatus: this.Status,
      inscanRemark: formData.remark || null ,
      manifestNo: this.ManfNoDatalist,
      dispatchFlag : this.dispatch
    }
    if (this.userType !== 'Admin') {
      this.getData.postScanManif(obj).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar')
          this.showTable = false;
          this.manifestform.reset();
           this.manifestform.patchValue({
          manfDate: this.currentDate
        });
          this.listData = [];
          this.ManfNoDatalist = [];
          this.getScanManfDone();
          this.getScanManfPeding();
        } else {
          this.openSnackBar( resp.message, 'error-snackbar')
        }
      });
    } else {
      this.getData.postScanManif(obj).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.showTable = false;
          this.manifestform.reset();
           this.manifestform.patchValue({
          manfDate: this.currentDate
        });
          this.ManfNoDatalist = [];
          this.getScanManfDone();
          this.getScanManfPeding();
        } else {
          this.openSnackBar( resp.message, 'error-snackbar')
        }
      }, error => {
        this.openSnackBar('Error fetching data:', 'error-snackbar')
      });
    }
  }

  findManfNo(formData: any) {
    const manfToCheck = formData.manifest;
    if (this.listData.some(item => item.manifest === manfToCheck)) {
      if (this.dispatch === '1') {
        this.openSnackBar('dispatch number already exists in the list.', 'error-snackbar');
      } else {
        this.openSnackBar('manifest number already exists in the list.', 'error-snackbar');
      }
      return;
    }
    if (this.ManfNoDatalist.includes(manfToCheck)) {
      if (this.dispatch === '1') {
        this.openSnackBar('Dispatch number already exists.', 'error-snackbar');
      } else {
        this.openSnackBar('manifest number already exists.', 'error-snackbar');
      }

      return;
    }
    if (this.userType !== 'Admin') {
      this.getData.findinscanManf(this.sessionLocationCode, manfToCheck, this.dispatch).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          const manfFromResponse = resp.Data[0].Manifest_no;
          this.showTable = true;
          this.ManfNo = '';

          if (this.ManfNoDatalist.includes(manfFromResponse)) {
            this.openSnackBar('number already exists.', 'error-snackbar');
            return;
          }
          this.ManfNoDatalist.push(manfFromResponse);
          setTimeout(() => {
            this.listData.push({
              Manifest_no: manfFromResponse,
              manifestDt: resp.Data[0].manifestDt,
              via: resp.Data[0].via,
              mode: resp.Data[0].mode,
              shipment: resp.Data[0].shipment,
              qty: resp.Data[0].qty,
              actualWT: resp.Data[0].actualWT,
              vehicle_no: resp.Data[0].vehicle_no,
              Driver_Name: resp.Data[0].Driver_Name,
              Route: resp.Data[0].Route,
            });
          }, 500);
          setTimeout(() => {
            this.renderer.selectRootElement('#manifest').focus();
          }, 600)
        }
      }, error => {
        this.openSnackBar('Please enter Correct dispatch no.', 'error-snackbar');
      })
    } else {
      this.getData.findinscanManf(this.sessionLocationCode, manfToCheck, this.dispatch).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          const manfFromResponse = resp.Data[0].Manifest_no;
          this.showTable = true;
          this.ManfNo = '';

          if (this.ManfNoDatalist.includes(manfFromResponse)) {
            this.openSnackBar('number already exists.', 'error-snackbar');
            return;
          }
          this.ManfNoDatalist.push(manfFromResponse);
          setTimeout(() => {
            this.listData.push({
              Manifest_no: manfFromResponse,
              manifestDt: resp.Data[0].manifestDt,
              via: resp.Data[0].via,
              mode: resp.Data[0].mode,
              shipment: resp.Data[0].shipment,
              qty: resp.Data[0].qty,
              actualWT: resp.Data[0].actualWT,
              vehicle_no: resp.Data[0].vehicle_no,
              Driver_Name: resp.Data[0].Driver_Name,
              Route: resp.Data[0].Route,
            });
          }, 500);
          setTimeout(() => {
            this.renderer.selectRootElement('#manifest').focus();
          }, 600)
        }
      }, error => {
        this.openSnackBar('Please enter Correct dispatch no.', 'error-snackbar');
      })
    }
  }

  async getScanManfPeding() {
    if (this.userType !== 'Admin') {
      try {
        const resp: any = await this.getData.getInscanPendingManif(this.sessionLocationCode, this.dispatch).toPromise();
        this.totalPending = resp.Count;
        } catch (error) {
          this.openSnackBar( 'Error fetching pending data:', 'error-snackbar')
          console.error('Error fetching pending data:', error);
        }
    } else {
      try {
        const resp: any = await this.httpService.get(`${environment.apiUrl}inscan/pendingByManifestNo?SessionLocationCode=${this.sessionLocationCode}&dispatchFlag=${this.dispatch}`)
        this.totalPending = resp.Count;
        } catch (error) {
          this.openSnackBar( 'Error fetching pending data:', 'error-snackbar')
          console.error('Error fetching pending data:', error);
        }
    }
  }

  async getScanManfDone() {
    if (this.userType !== 'Admin') {
      try {
        const resp: any = await this.getData.getScanDoneManif(this.sessionLocationCode, this.dispatch).toPromise();
        this.totalDone = resp.Count
      } catch (error) {
        this.openSnackBar('Error fetching pending data:', 'error-snackbar')
        console.error('Error fetching done data:', error);
      }
    } else {
      try {
        const resp: any = await this.httpService.get(`${environment.apiUrl}inscan/viewInscanByManifestNo?SessionLocationCode=${this.sessionLocationCode}&dispatchFlag=${this.dispatch}`)
        this.totalDone = resp.Count
      } catch (error) {
        this.openSnackBar('Error fetching pending data:', 'error-snackbar')
        console.error('Error fetching done data:', error);
      }
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
      const manifestNoToDelete = this.listData[index].Manifest_no;
      this.listData.splice(index, 1);
      const manfIndex = this.ManfNoDatalist.indexOf(manifestNoToDelete);
      if (manfIndex !== -1) {
        this.ManfNoDatalist.splice(manfIndex, 1);
      }
    }
  }

}
