import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddManifestComponent } from 'app/Branch/Shared/manifest pages/add-manifest/add-manifest.component';
import { BulkManifestComponent } from 'app/Branch/Shared/manifest pages/bulk-manifest/bulk-manifest.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'app/service/shared.service';
import { AllServicesService } from 'app/service/all-services.service';
import { SetupReportComponent } from 'app/Branch/Shared/report_pages/setup-report/setup-report.component';

@Component({
  selector: 'app-create-manifest',
  templateUrl: './create-manifest.component.html',
  styleUrls: ['./create-manifest.component.css']
})

export class CreateManifestComponent implements OnInit {
  ManfDate: string;
  destCode: string;
  ModeCode: string;
  driverNameCode: string;
  co_loaderCode: string;
  routeCode: string;
  originName: string;
  actualWeight: any;
  Mode_code: any;

  createForm: FormGroup;
  validationMessage: any = [];

  displayedColumns: string[] = ['AwbNo', 'Date', 'Consigner', 'Consignee', 'FromDest', 'ToDest', 'PCs', 'Weight', 'InvoiceValue', 'eWayBillNo'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ModeName: any;
  DestinationName: any[];
  selectedDriverCode: string;
  inputRouteName: any;
  ColoaderName: any;
  sessionLocationCode: string;
  awbNumber: any = '';

  Diesel_Amount: string;
  Driver_Licence_No: string;
  Opening_Km: string;
  Vehicle_diesel_No: string;
  Vehicle_diesel_Ltrs: string;
  Kata_Weight: string;
  Slip_No: string;
  Brocker_Name: string;
  Advance_Paid: string;
  bookDate: any;
  customerName: any;
  consigneeName: any;
  fromDest: any;
  toDest: any;
  qty: any;
  actualWt: any;
  invoiceValue: any;
  ToDest: string = '';
  AwbNo: number[] ;
  selectedMode: any;
  remark: any;
  vehicletype: any;
  VehicleNo: any;
  Route: any;
  DriverName: any[];
  selectedVendorCode: string = '';
  dispatch: string;
  Desination: any;
  // RefrenceNo; any;
  listData: any = [];
  showTable = false;
  AwbNoDatalist: any = [];
  driverNumber: any;
  vehicleNumbers: string[] = [];
  selectedType = 'Hired';
  tripsheet: any;
  userType: any;
  destinationName: any = 'All';

  constructor(public httpService: AllServicesService,
              public http: HttpClient,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private renderer: Renderer2,
              private snackBar: MatSnackBar, ) {
                this.sessionLocationCode = localStorage.getItem('originCode');
                this.originName = localStorage.getItem('originName');
                this.tripsheet = localStorage.getItem('tripSheet');
               }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.destinationName = localStorage.getItem('selectedValue');
    this.dispatch = localStorage.getItem('dispatch');
    this.ManfDate = new Date().toISOString().split('T')[0];

    this.createForm = this.formBuilder.group({
    awbNumber: new FormControl('', Validators.compose([])),
    origin: new FormControl('', Validators.compose([Validators.required])),
    ManfDate: new FormControl(this.ManfDate, Validators.compose([Validators.required])),
    destination: new FormControl('', Validators.compose([Validators.required])),
    via: new FormControl('', Validators.compose([Validators.required])),
    Drivername: new FormControl('', Validators.compose([Validators.required])),
    DriverNo: new FormControl('', Validators.compose([Validators.required])),
    ColoaderName: new FormControl('', Validators.compose([Validators.required])),
    Mode: new FormControl('', Validators.compose([Validators.required])),
    Remark: new FormControl('', Validators.compose([Validators.required])),
    Transporttype : new FormControl('', Validators.compose([Validators.required])),
    Vehicletype: new FormControl('', Validators.compose([Validators.required])),
    VehicleNo: new FormControl('', Validators.compose([Validators.required])),
    Route: new FormControl('', Validators.compose([Validators.required])),
    Desination: new FormControl('', Validators.compose([Validators.required])),
    RefrenceNo: new FormControl('', Validators.compose([Validators.required])),
    ManifestWeight: new FormControl('', Validators.compose([Validators.required])),
  });
  this.loadMode();
  this.loadDestination();
  this.loadDriverName();
  this.loadRouteName();
  this.loadColoaderName();
  this.createForm.controls['origin'].setValue(this.originName);

  this.validationMessage = {
    awbNumber: [
      { type: 'required', message: 'Please enter AWB Number' }
    ],
    origin: [
      { type: 'required', message: 'Please select Origin' }
    ],
    destination: [
      { type: 'required', message: 'Please select Destination' }
    ],
    via: [
      { type: 'required', message: 'Please select Via' }
    ],
    Drivername: [
      { type: 'required', message: 'Please select Driver Name' }
    ],
    ColoaderName: [
      { type: 'required', message: 'Please select CoLoader Name' }
    ],
  };
  }
  onTransportTypeChange(event: any) {
    this.selectedType = event.target.value;
    if (this.selectedType === 'Self') {
        this.getVehicleNumbers();
    } else {
        // Do nothing or handle accordingly for hired vehicles
    }
}
  refresh() {}
deleteRow(item: any): void {
  const index = this.listData.indexOf(item);
  if (index !== -1) {
    const AwbNoToDelete = this.listData[index].AwbNo;
    this.listData.splice(index, 1);
    const awbIndex = this.AwbNoDatalist.indexOf(AwbNoToDelete);
    if (awbIndex !== -1) {
      this.AwbNoDatalist.splice(awbIndex, 1);
    }
  }
}

getVehicleNumbers() {
  this.httpService.getVehicleNo('').subscribe((response: any) => {
        this.vehicleNumbers = response.Data;
      }, (error) => {
          this.snackBar.open('Error fetching vehicle numbers', 'Close', {
              duration: 3000
          });
          console.error('Error fetching vehicle numbers:', error);
      }
  );
}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
    openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  findAwbNo(formData: any) {
    const awbNoToCheck = formData.awbNumber;

    if (this.listData.some(item => item.AwbNo === awbNoToCheck)) {
      this.openSnackBar('AWB number already exists in the list.', 'error-snackbar')
      return;
    }

    if (this.AwbNoDatalist.includes(awbNoToCheck)) {
      this.openSnackBar('AWB number already exists.', 'error-snackbar')
      return;
    }
    if (this.userType === 'Admin') {
      this.httpService.findawbNo(this.destinationName, awbNoToCheck).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar')
          const awbNoFromResponse = resp.Data[0].awbNo;
          this.actualWeight = resp.Data[0].actualWt;
          this.showTable = true;
          this.awbNumber = '';

          if (this.AwbNoDatalist.includes(awbNoFromResponse)) {
            this.openSnackBar('AWB number already exists.', 'error-snackbar')
            return;
          }

          this.AwbNoDatalist.push(awbNoFromResponse);

          setTimeout(() => {
            this.listData.push({
              AwbNo: awbNoFromResponse,
              Date: resp.Data[0].bookDate,
              Consigner: resp.Data[0].customerName,
              Consignee: resp.Data[0].consigneeName,
              FromDest: resp.Data[0].fromDest,
              ToDest: resp.Data[0].toDest,
              PCs: resp.Data[0].qty,
              Weight: resp.Data[0].actualWt,
              InvoiceValue: resp.Data[0].invoiceValue,
            });
          }, 500);
          setTimeout(() => {
            this.renderer.selectRootElement('#awbInput').focus();
          }, 600);
        } else {
          this.openSnackBar(resp.message, 'error-snackbar')
        }
      }, error => {
        this.openSnackBar( 'Please enter Correct Awb No.', 'error-snackbar')
      })
    } else {
      this.httpService.findawbNo(this.sessionLocationCode, awbNoToCheck).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar')
          const awbNoFromResponse = resp.Data[0].awbNo;
          this.actualWeight = resp.Data[0].actualWt;
          this.showTable = true;
          this.awbNumber = '';

          if (this.AwbNoDatalist.includes(awbNoFromResponse)) {
            this.openSnackBar('AWB number already exists.', 'error-snackbar')
            return;
          }

          this.AwbNoDatalist.push(awbNoFromResponse);

          setTimeout(() => {
            this.listData.push({
              AwbNo: awbNoFromResponse,
              Date: resp.Data[0].bookDate,
              Consigner: resp.Data[0].customerName,
              Consignee: resp.Data[0].consigneeName,
              FromDest: resp.Data[0].fromDest,
              ToDest: resp.Data[0].toDest,
              PCs: resp.Data[0].qty,
              Weight: resp.Data[0].actualWt,
              InvoiceValue: resp.Data[0].invoiceValue,
            });
          }, 500);
          setTimeout(() => {
            this.renderer.selectRootElement('#awbInput').focus();
          }, 600);
        } else {
          this.openSnackBar(resp.message, 'error-snackbar')
        }
      }, error => {
        this.openSnackBar( 'Please enter Correct Awb No.', 'error-snackbar')
      })
    }

  }

  generateManifest(formData: any) {
    if (
      !this.createForm.value.destination ||
      !this.createForm.value.Mode ||
      !this.AwbNoDatalist
    ) {
      this.openSnackBar( 'Please fill in all required fields.', 'error-snackbar')
      return;
    }
    let obj  = {
     sessionLocationCode: this.destinationName || this.sessionLocationCode || this.originName || formData.origin,
     toDest: formData.destination,
     ManfDate: formData.ManfDate,
     Mode: formData.Mode,
     Remark: formData.Remark || '',
     Vehicletype: formData.Vehicletype || '',
     VehicleNo: formData.VehicleNo || '',
     via: formData.via || '',
     route: formData.Route || '',
     AwbNo: this.AwbNoDatalist || '',
     VendorCode: formData.ColoaderName || '',
     driverName: formData.Drivername || '',
     driverMobile: formData.DriverNo || this.driverNumber || '',
     openingKM: this.Opening_Km || 0,
     refrenceNo: formData.RefrenceNo || '',
     DriverLicenceNo: this.Driver_Licence_No || '',
     VehicleDieselLtrs: this.Vehicle_diesel_Ltrs || '',
     BrockerName: this.Brocker_Name || '',
     Katawt: this.Kata_Weight || '',
     AdvancePaid: this.Advance_Paid || 0,
     VehicleDieselNo: this.Vehicle_diesel_No || '',
     SlipNo: this.Slip_No || '',
     DieselAmt: this.Diesel_Amount || 0,
     ManifestWeight: formData.ManifestWeight || '',
     flag : this.tripsheet,
     dispatchFlag : this.dispatch
    };

    this.httpService.postGenrateManif(obj).subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar( resp.message, 'custom-snackbar')
        this.createForm.reset();
         this.createForm.patchValue({
          ManfDate: this.ManfDate
        });
        this.listData = [];
        this.showTable = false;
        this.AwbNoDatalist = [];

          this.Driver_Licence_No = '';
          this.Opening_Km = '';
          this.Vehicle_diesel_No = '';
          this.Vehicle_diesel_Ltrs = '';
          this.Kata_Weight = '';
          this.Slip_No = '';
          this.Brocker_Name = '';
          this.Advance_Paid = '';
          this.Diesel_Amount = '';
      } else {
        this.openSnackBar(resp.message, 'error-snackbar')
      }
    });
  }

  openaddmanifest() {
    const dialogRef = this.dialog.open(AddManifestComponent, {
      data: {
        loadManifestData: {
          Driver_Licence_No: this.Driver_Licence_No,
          Opening_Km: this.Opening_Km,
          Vehicle_diesel_No: this.Vehicle_diesel_No,
          Vehicle_diesel_Ltrs: this.Vehicle_diesel_Ltrs,
          Kata_Weight: this.Kata_Weight,
          Slip_No: this.Slip_No,
          Brocker_Name: this.Brocker_Name,
          Advance_Paid: this.Advance_Paid,
          Diesel_Amount: this.Diesel_Amount
        } 
      },
      width: '55rem',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log("Res>>>>>",res)
        this.Driver_Licence_No = res.Driver_Licence_No;
        this.Opening_Km = res.Opening_Km;
        this.Vehicle_diesel_No = res.Vehicle_diesel_No;
        this.Vehicle_diesel_Ltrs = res.Vehicle_diesel_Ltrs;
        this.Kata_Weight = res.Kata_Weight;
        this.Slip_No = res.Slip_No;
        this.Brocker_Name = res.Brocker_Name;
        this.Advance_Paid = res.Advance_Paid;
        this.Diesel_Amount = res.Diesel_Amount;
      }
    });
  }
  openbulkmanifest() {
    const dialogRef = this.dialog.open(BulkManifestComponent, {
      data: {
        action: 'add',
        selectedRow: this.AwbNoDatalist,
      },
      width: '50rem',
      disableClose: true,
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

            // Fetch details for this AWB number
            this.httpService.findawbNo(this.sessionLocationCode, awbNo).subscribe(
              (resp: any) => {
                if (resp.status === 1) {
                  this.showTable = true;
                  const awbDetails = resp.Data[0]; // Assuming Data[0] contains AWB details
                  this.listData.push({
                    AwbNo: awbDetails.awbNo,
                    Date: awbDetails.bookDate,
                    Consigner: awbDetails.customerName,
                    Consignee: awbDetails.consigneeName,
                    FromDest: awbDetails.fromDest,
                    ToDest: awbDetails.toDest,
                    PCs: awbDetails.qty,
                    Weight: awbDetails.actualWt,
                    InvoiceValue: awbDetails.invoiceValue,
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
            this.openSnackBar(
              `AWB ${awbNo} already exists in the list.`,
              'error-snackbar'
            );
          }
        });
      }
    });
  }

  loadDestination() {
    if (this.userType === 'Admin') {
      this.httpService.GetDestination(this.destinationName).subscribe((resp: any) => {
        this.DestinationName = resp.Data;
      }, error => {
        this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
      });
    } else {
      this.httpService.GetDestination(this.sessionLocationCode).subscribe((resp: any) => {
        this.DestinationName = resp.Data;
      }, error => {
        this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
      });
    }
  }

  loadMode() {
    this.httpService.GetMode().subscribe((resp: any) => {
        this.ModeName = resp.Data;
      });
  }

  loadDriverName() {
    this.httpService.getDriver().subscribe((resp: any) => {
        this.DriverName = resp.Data;
      });
  }
  onDriverNameChange(event: any) {
    const selectedDriverCode = event.target.value;
    if (selectedDriverCode) {
      this.httpService.getDriverMobile(selectedDriverCode).subscribe((response: any) => {
          if (response.status === 1) {
            this.driverNumber = response.Data[0].driverMobileNo;
          } else {
            alert(response.message);
          }
        });
    }
  }
    selectVendor(event: any) {
    const selectedVendorName = event.target.value;
    const selectedVendor = this.ColoaderName.find(item => item.vendorName === selectedVendorName);

    if (selectedVendor) {
      this.selectedVendorCode = selectedVendor.vendorCode;
    }
  }


  loadRouteName() {
    this.httpService.getRoute().subscribe((resp: any) => {
        this.inputRouteName = resp.Data;
      });
  }

  loadColoaderName() {
    this.httpService.getVendor().subscribe((resp: any) => {
        this.ColoaderName = resp.Data;
      });
  }


}
