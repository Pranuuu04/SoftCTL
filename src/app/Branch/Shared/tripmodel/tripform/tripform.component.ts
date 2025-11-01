import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { TripService } from 'app/Branch/operation/tripsheet/trip.service';
import { AllServicesService } from 'app/service/all-services.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-tripform',
  templateUrl: './tripform.component.html',
  styleUrls: ['./tripform.component.css']
})
export class TripformComponent implements OnInit, AfterViewInit {

   createForm: FormGroup;
   validationMessage: any = [];
   originList: any;
   DestinationName: any[] = [];
   inputRouteName: any;
   Route: any;
   DriverName: any[];
   selectedVendorCode = '';
   dispatch: string;
   Desination: any;
   listData: any = [];
   showTable = false;
   AwbNoDatalist: any = [];
   driverNumber: any;
   vehicleNumbers: any[] = [];
   selectedType = 'Hired';
   tripsheet: any;
   userType: any;
   destinationName: any = 'All';
  CustomerList: any;
  sessionLocationCode: string;
  ColoaderName: any;
  customerName: any;
  formDate: any;
  VehicleTypeList: any;
  selectedDriver: any;
  supplierList: any;
  tranportList: any;
  userName: any;

  constructor(private _mdr: MatDialogRef<TripformComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public httpService: AllServicesService,
                public formBuilder: FormBuilder,
                private snackBar: MatSnackBar,
                public tripservice: TripService,
                public bookingService: BookingService ) {
                  // this.formDate = this.data.Date
                 }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.userName = localStorage.getItem('userName');
    //  this.destinationName = localStorage.getItem('selectedValue');
     this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue') || 'All';

     this.httpService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
      this.CustomerList = resp.Data;
      // if (this.data?.Customer_Name) {
        // const selectedCustomer = this.CustomerList.find(
        //   (item: any) => item.customerName === this.data.Customer_Name
        // );
        // if (selectedCustomer) {
          this.createForm.patchValue({ CustomerName: this.data.Customer_Code });
          this.loadSupplierData(this.data.Customer_Code);
        // }
      // }
    });
    //  this.httpService.getOriginData().subscribe((data) => {
    //   this.originList = data.Data;
    // });

    this.tripservice.getTransport().subscribe((data) => {
      this.tranportList = data.Data;
    });
 this.bookingService.getShipper(this.data.Customer_Code).subscribe((data: any) => {
  this.supplierList = data.Data;

  if (this.data?.supplierName) {
    const selectedSupplier = this.supplierList.find(
      (item: any) => item.shipperCode  === this.data.supplierName
    );
    if (selectedSupplier) {
      this.createForm.patchValue({ supplierName: selectedSupplier.shipperCode  });
    }
  }
});

      this.createForm = this.formBuilder.group({
          CustomerName: ['', Validators.required],
          Date: ['', Validators.required],
          originName: ['', Validators.required],
          destination: [[], Validators.required],
          Route: ['', Validators.required],
          Transporttype: ['Hired', Validators.required],
          transName: ['', Validators.required],
          VehicleType: ['', Validators.required],
          VehicleNo: ['', Validators.required],
          Drivername: ['', Validators.required],
          DriverNo: ['', Validators.required],
          Remark: [''],
          OTA: [this.data.OTA],
          OTR: [this.data.OTR],
          Qty: [this.data.QT],
          LoadingIn: [this.data.LoadingIn],
          LoadingOut: [this.data.LoadingOut],
          InTransit: [this.data.InTransit],
          DispatchTime: [this.data.DispatchTime],
          StoreOut: [this.data.StoreOutTime],
          supplierName: ['', Validators.required]
        });

        // for routeUpdate
        // if (this.data?.action === 'editTrip') {
            this.createForm.get('destination')?.valueChanges.subscribe((destinations: string[]) => {
            this.updateRouteFromDestinations(destinations);
          });
        // }
  this.createForm.get('Transporttype')?.valueChanges.subscribe(value => {
   this.createForm.patchValue({ transName: null, VehicleNo: null, VehicleType: null, Drivername: '', DriverNo: '' });
      this.tranportList = [];
      this.vehicleNumbers = [];
      this.VehicleTypeList = [];
  if (value === 'Self' || value === 'Hired') {
    this.loadTransportList(value);
  }
});


  this.loadTransportList('Hired');
  const shipperCode = this.createForm.get('supplierName')?.value;
        forkJoin({
          origins: this.httpService.getDestSearchX(shipperCode) as Observable<any>,
          destinations: this.userType === 'Admin'
            ? this.httpService.getDestSearchX(shipperCode) as Observable<any>
            : this.httpService.getDestSearchX(shipperCode) as Observable<any>
        }).subscribe(({ origins, destinations }) => {
          this.originList = (origins as any).Data;
          this.DestinationName = (destinations as any).Data;

          this.loadRouteName();
        });
        this.loadRouteName();
        // this.createForm.get('Route')?.valueChanges.subscribe((routeName: string) => {
        //   this.handleRouteSelection(routeName);
        // });
        if (this.data?.Date) {
           const [day, month, year] = this.data.Date.split('-');
          const formattedDate = `${year}-${month}-${day}`;
          this.createForm.patchValue({ Date: formattedDate });
        }
        this.createForm.get('Route')?.valueChanges.subscribe(routeName => {
          this.handleRouteSelection(routeName);
        });
        this.createForm.get('supplierName')?.valueChanges.subscribe((shipperCode: string) => {
    if (shipperCode) {
      this.httpService.getDestSearchX(shipperCode).subscribe(
        (resp: any) => {
          this.originList = resp.Data;
          this.DestinationName = resp.Data;
        },
        error => {
          this.openSnackBar('An error occurred while fetching origin/destination data.', 'error-snackbar');
        }
      );
    } else {
      this.originList = [];
      this.DestinationName = [];
    }
  });

  }
  ngAfterViewInit() {
  // this.loadDestination();
  this.loadDriverName();
  this.loadVehicleType();
  setTimeout(() => {
    this.loadTransportList('Hired');
  }, 0);
}
// for routeUpdate
updateRouteFromDestinations(destinations: string[]) {
  const originCode = this.createForm.get('originName')?.value;
  const originItem = this.originList.find(item => item.destinationCode  === originCode);

  if (!originItem) { return; }

  // Route format: Origin - Dest1 - Dest2 ...
  const routeName = [originItem.destinationName, ...(destinations || [])].join(' - ');

  this.createForm.patchValue({ Route: routeName }, { emitEvent: false });
}

loadSupplierData(CustomerName: any) {
    this.bookingService.getShipper(CustomerName).subscribe((data: any) => {
      this.supplierList = data.Data;
     });
  }
   loadTransportList(type: string): void {
  this.tripservice.getTransportt(type).subscribe(
    (data) => {
      this.tranportList = data?.Data || [];
    },
    (error) => {
      console.error('Error loading transport list', error);
      this.tranportList = [];
    }
  );
}
  handleRouteSelection(routeName: string) {
    if (!routeName) { return; }

    const parts = routeName.split('-').map(p => p.trim().toLowerCase());
    if (parts.length < 2) { return; }

    const origin = parts[0];
    const destinationParts = parts.slice(1);

    const originItem = this.originList.find(item =>
      item.destinationName?.trim().toLowerCase() === origin
    );

    const matchedDestinations = destinationParts
    .map(dest => this.DestinationName.find(item =>
      item.destinationName?.toLowerCase().includes(dest)
    ))
    .filter(Boolean)
    .map(item => item!.destinationName);

  if (originItem && matchedDestinations.length) {
    this.createForm.patchValue({
      originName: originItem.destinationCode,
      destination: matchedDestinations
    });

      console.log('Form patched:', originItem.destinationCode, matchedDestinations);
    } else {
      console.warn('Match not found:', {
        originInput: origin,
        // destinationInput: destination,
        originMatch: !!originItem,
        destinationMatch: !!matchedDestinations
      });
    }
  }

  CloseDialog() {
    this._mdr.close(false);
  }
    openSnackBar(message: string, panelClass: string) {
     this.snackBar.open(message, 'Close', {
       duration: 3000,
       horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass: [panelClass]
     });
   }

   loadVehicleType() {
    this.httpService.getVehicleType().subscribe((resp: any) => {
      this.VehicleTypeList = resp.Data;
    });
   }

    loadDestination() {
     if (this.userType === 'Admin') {
       this.httpService.getDestinationData().subscribe((resp: any) => {
         this.DestinationName = resp.Data;
       }, error => {
         this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
       });
     } else {
       this.httpService.getDestinationData().subscribe((resp: any) => {
         this.DestinationName = resp.Data;
       }, error => {
         this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
       });
     }
   }

  generateTrip(formData: any) {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.openSnackBar('Please fill all required fields correctly.', 'error-snackbar');
      return;
    }

    const requestData = {
      AwbNo: '',
      Customer_Code: formData.CustomerName,
      BookDate: formData.Date,
      Origin_code: formData.originName,
      Destination_Code: formData.destination.join('-'),
      Manifest_Remark: formData.Remark || '',
      Transport_Code: formData.transName,
      Transpoter_type: formData.Transporttype,
      Vehicle_Type: formData.VehicleType,
      VehicleNo: formData.VehicleNo,
      DriverName: formData.Drivername,
      Driver_Mobile: formData.DriverNo,
      Route: formData.Route,
      supplierName: formData.supplierName,
      Location_Code: this.sessionLocationCode,
       OTR : formData.OTR,
      OTA : formData.OTA,
      Qty : formData.Qty,
      LoadingIn: formData.LoadingIn,
      LoadingOut: formData.LoadingOut,
      InTransit: formData.InTransit,
      DispatchTime: formData.DispatchTime,
      StoreOutTime: formData.StoreOut,
      ID: this.data.ID,
      userName: this.userName
    };

    this.tripservice.createTrip(requestData).subscribe({
      next: (resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          this.CloseDialog();
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      },
      error: (error) => {
        console.error('API Error:', error);

        if (error.status === 0) {
          this.openSnackBar('Network error! Please check your internet connection.', 'error-snackbar');
        } else if (error.status === 400) {
          this.openSnackBar('Bad request! Please check your input data.', 'error-snackbar');
        } else if (error.status === 500) {
          this.openSnackBar('Server error! Please try again later.', 'error-snackbar');
        } else {
          this.openSnackBar('An unexpected error occurred. Please try again.', 'error-snackbar');
        }
      }
    });
  }
  updateTrip(formData: any) {
  // if (this.createForm.invalid) {
  //   this.createForm.markAllAsTouched();
  //   return;
  // }

  const payload = {
    ID: this.data.ID,
    Customer_Code: formData.CustomerName,
    Date: formData.Date,
    Route: formData.Route,
    OTR: formData.OTR,
    Qty: formData.Qty,
    OTA: formData.OTA,
    VehicleType: formData.VehicleType,
    SupplierName: formData.supplierName,
    LoadingIn: formData.LoadingIn,
    LoadingOut: formData.LoadingOut,
    DispatchTime: formData.DispatchTime,
    VehicleOutTime: formData.StoreOut,
    InTransit: formData.InTransit,
    Remark: formData.Remark
  };

  this.tripservice.updateImportTrip(payload).subscribe({
     next: (resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          this.CloseDialog();
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      },
      error: (error) => {
        console.error('API Error:', error);

        if (error.status === 0) {
          this.openSnackBar('Network error! Please check your internet connection.', 'error-snackbar');
        } else if (error.status === 400) {
          this.openSnackBar('Bad request! Please check your input data.', 'error-snackbar');
        } else if (error.status === 500) {
          this.openSnackBar('Server error! Please try again later.', 'error-snackbar');
        } else {
          this.openSnackBar('An unexpected error occurred. Please try again.', 'error-snackbar');
        }
      }
  });
}


 getVehicleNumbers() {
   if (!this.createForm.value.transName) {
    this.vehicleNumbers = [];
    this.createForm.get('VehicleNo')?.reset();
    return;
  }
  this.httpService.getVehicleNo(this.createForm.value.transName).subscribe((response: any) => {
        this.vehicleNumbers = response.Data;
      }, (error) => {
          this.snackBar.open('Error fetching vehicle numbers', 'Close', {
              duration: 3000
          });
          console.error('Error fetching vehicle numbers:', error);
      }
  );
}

  loadDriverName() {
    this.httpService.getAvailableDriver().subscribe((resp: any) => {
        this.DriverName = resp.Data;
      });
  }
  // onDriverNameChange(event: any) {
  //   const selectedDriverCode = event.target.value;
  //   if (selectedDriverCode) {
  //     this.httpService.getDriverMobile(selectedDriverCode).subscribe((response: any) => {
  //         if (response.status === 1) {
  //          const driverMobileNo = response.Data[0].driverMobileNo;
  //          this.createForm.patchValue({
  //            DriverNo: driverMobileNo
  //          })
  //          // this.driverNumber = response.Data[0].driverMobileNo;
  //         } else {
  //           alert(response.message);
  //         }
  //       });
  //   }
  // }
  onVehicleChange(selectedVehicleReg: any) {
  const selectedVehicle = this.vehicleNumbers.find(v => v.vehicleReg === selectedVehicleReg.vehicleReg);
  if (selectedVehicle) {
    this.createForm.patchValue({
      VehicleType: selectedVehicle.vehicleType || '',
      Drivername: selectedVehicle.driverCode || '',
      DriverNo: selectedVehicle.driverMobileNo || ''
    });

    if (!selectedVehicle.driverMobileNo && selectedVehicle.driverCode) {
      this.httpService.getDriverMobile(selectedVehicle.driverCode).subscribe((response: any) => {
        if (response.status === 1 && response.Data.length > 0) {
          this.createForm.patchValue({
            DriverNo: response.Data[0].driverMobileNo
          });
        }
      });
    }
  }
}
  onDriverNameChange(driverCode: any) {
    // const inputValue = event.target.value;

    // Find the selected driver object
    const selectedDriver = driverCode?.driverCode;

    if (selectedDriver) {
      // this.selectedDriver = selectedDriver.driverCode
      this.httpService.getDriverMobile(selectedDriver).subscribe((response: any) => {
        if (response.status === 1) {
          this.createForm.patchValue({
            DriverNo: response.Data[0].driverMobileNo,
            // Drivername: selectedDriver.driverName // show only name in the field
          });
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
      this.inputRouteName = resp.Data || [];

      if (this.data?.Route) {
        let selectedRoute = this.inputRouteName.find(
          (item: any) =>
            item.routeName.trim().toLowerCase() === this.data.Route.trim().toLowerCase()
        );

        if (!selectedRoute) {
          selectedRoute = { routeName: this.data.Route };
          this.inputRouteName.push(selectedRoute);
        }

        setTimeout(() => {
          this.createForm.patchValue({ Route: selectedRoute.routeName });
          this.handleRouteSelection(selectedRoute.routeName);
        });
      }
    });
  }

}
