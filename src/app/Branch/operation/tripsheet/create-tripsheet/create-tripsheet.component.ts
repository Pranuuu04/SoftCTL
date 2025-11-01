import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { TripService } from '../trip.service';
import { Console } from 'console';
import { BookingService } from '../../Booking/booking.service';

@Component({
  selector: 'app-create-tripsheet',
  templateUrl: './create-tripsheet.component.html',
  styleUrls: ['./create-tripsheet.component.css']
})
export class CreateTripsheetComponent implements OnInit, AfterViewInit {

  // @Input() editMode: boolean = false;

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
   ModeName: any;
   DestinationName: any[];
   selectedDriverCode: string;
   inputRouteName: any;
   ColoaderName: any;
   sessionLocationCode: string;
   LrNumber: any = '';

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
   ToDest = '';
   AwbNo: number[] ;
   selectedMode: any;
   remark: any;
   vehicletype: any;
   VehicleNo: any;
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
  originList: any;
  userName: any;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['tripNo',  'tripDate', 'OTR', 'OTA',  'originName',  'destinationName',  'driverName',  'vehicleNo',  'status',  'tripStatus', 'route',  'remark', 'supplierName'];
length = 0;
  pageSize = 10;
  pageIndex = 0;
  showFirstLastButtons = true;
  hidePageSize = false;
  disabled = false;
  pageCount = 0;
  pageEvent: PageEvent;
  showPageSizeOptions = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  VehicleTypeList: string[] = [];
  supplierList: any;
  tranportList: any;
  timeSlots: string[] = [];
  editMode = false;
  tirpNo: any;

   constructor(public httpService: AllServicesService,
               public http: HttpClient,
               public tripservice: TripService,
               public dialog: MatDialog,
               public formBuilder: FormBuilder,
               private renderer: Renderer2,
               private snackBar: MatSnackBar,
               private bookingService: BookingService) {
                //  this.sessionLocationCode = localStorage.getItem('originCode');
                 this.originName = localStorage.getItem('originName');
                 this.tripsheet = localStorage.getItem('tripSheet');
                }

  ngOnInit(): void {
     this.getTime24();
     this.userType = localStorage.getItem('userType');
      this.userName = localStorage.getItem('userName');
    //  this.destinationName = localStorage.getItem('selectedValue');
     this.dispatch = localStorage.getItem('dispatch');
     this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');

     this.httpService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
      this.CustomerList = resp.Data;
     });
    //  this.httpService.getOriginData().subscribe((data) => {
    //   this.originList = data.Data;
    // });

  // this.tripservice.getSupplier().subscribe((data) => {
  //     this.supplierList = data.Data;
  //   });


    //   this.tripservice.getTransport().subscribe((data) => {
    //   this.tranportList = data.Data;
    // });

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
      supplierName: ['', Validators.required],
      OTR: [''],
      OTA: [''],
      loadingIn: [''],
      loadingOut: [''],
      inTransit: [''],
      DispatchTime: [''],
      StoreOut: ['']
    });


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
   this.loadDriverName();
   this.loadRouteName();
   this.getTripSheetData(this.pageIndex + 1, this.pageSize);
   this.loadVehicleType();
  //  this.createForm.controls['origin'].setValue(this.originName);

  this.createForm.get('CustomerName')?.valueChanges.subscribe(customerName => {
    this.loadSupplierData(customerName);
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
  this.createForm.get('Route')?.valueChanges.subscribe(routeName => {
    this.handleRouteSelection(routeName);
  });
  // this.createForm.get('Route')?.valueChanges.subscribe(routeName => {
  //   this.handleRouteSelection(routeName);
  // });

  this.createForm.get('originName')?.valueChanges.subscribe(originCode => {
    this.updateRouteFromSelections();
  });

  this.createForm.get('destination')?.valueChanges.subscribe(destinations => {
    this.updateRouteFromSelections();
  });

   this.validationMessage = {
    CustomerName: [
      { type: 'required', message: 'Customer name is required' }
    ],
    Date: [
      { type: 'required', message: 'Date is required' }
    ],
    originName: [
      { type: 'required', message: 'Origin is required'}
    ],
    destination: [
      { type: 'required', message: 'Destination is required' }
    ],
    Route: [
      { type: 'required', message: 'Route is required' }
    ],
    Transporttype: [
      { type: 'required', message: 'Transport type is required' }
    ],
    VehicleType: [
      { type: 'required', message: 'Vehicle type is required' }
    ],
    VehicleNo: [
      { type: 'required', message: 'Vehicle number is required' }
    ],
    Drivername: [
      { type: 'required', message: 'Driver name is required' }
    ],
    DriverNo: [
      { type: 'required', message: 'Driver number is required' }
    ],
    supplierName: [
      { type: 'required', message: 'Supplier name is required'}
    ]
  };

   }
   loadSupplierData(CustomerName: any) {
  this.bookingService.getShipper(CustomerName).subscribe((data: any) => {
    this.supplierList = data.Data;   // assign shipper list
  });
}

//    onShipperChange(shipperCode: string) {
//   if (!shipperCode) {
//     this.originList = [];
//     this.DestinationName = [];
//     return;
//   }

//   this.httpService.getDestSearchX(shipperCode).subscribe(
//     (resp: any) => {
//       this.originList = resp.Data;
//       this.DestinationName = resp.Data;
//     },
//     error => {
//       this.openSnackBar('An error occurred while fetching origin/destination data.', 'error-snackbar');
//     }
//   );
// }



// loadSupplierData(CustomerName: any) {
//   this.bookingService.getShipper(CustomerName).subscribe((data: any) => {
//     this.supplierList = data.Data;

//     if (this.supplierList && this.supplierList.length > 0) {
//       const firstSupplierCode = this.supplierList[0].shipperCode; // or whichever supplier user selects

//       // Load Destinations
//       this.httpService.getDestSearchX(firstSupplierCode).subscribe(
//         (resp: any) => {
//           this.DestinationName = resp.Data;
//         },
//         error => {
//           this.openSnackBar('An error occurred while fetching destinations. Please try again later.', 'error-snackbar');
//         }
//       );

//       // Load Origins
//       this.httpService.getDestSearchX(firstSupplierCode).subscribe(
//         (resp: any) => {
//           this.originList = resp.Data;
//         },
//         error => {
//           this.openSnackBar('An error occurred while fetching origins. Please try again later.', 'error-snackbar');
//         }
//       );
//     }
//   });
// }

loadTransportList(type: string): void {
  this.tripservice.getTransportt(type).subscribe(
    (data) => {
      if (data.status === 1) {
        this.tranportList = data.Data;
      } else {
        this.tranportList = [];
      }
    },
    (error) => {
      console.error('Error loading transport list', error);
      this.tranportList = [];
    }
  );
}
   handleRouteSelection(routeName: string) {
    // if (!routeName) { return; }
if (!routeName) {
    // Clear origin and destination if route cleared
    this.createForm.patchValue({
      originName: '',
      destination: []
    }, { emitEvent: false });
    return;
  }
    const parts = routeName.split('-').map(p => p.trim().toLowerCase());
    if (parts.length < 2) { return; }

    const origin = parts[0];
    const destinationParts = parts.slice(1);

    const originItem = this.originList.find(item =>
      item.destinationName?.toLowerCase().includes(origin)
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
      console.warn('No match found for origin or destination(s)');
    }
  }

updateRouteFromSelections() {
  const originCode = this.createForm.get('originName')?.value;
  const destinations = this.createForm.get('destination')?.value || [];

  if (!originCode || destinations.length === 0) {
    return;
  }

  // Get origin name from code
  const originItem = this.originList.find(o => o.destinationCode   === originCode);
  const originName = originItem ? originItem.destinationName : originCode;

  // Join destinations by " - "
  const routeName = `${originName} - ${destinations.join(' - ')}`;

  // Only patch if different (avoid loop with valueChanges)
  if (this.createForm.get('Route')?.value !== routeName) {
    this.createForm.patchValue({ Route: routeName }, { emitEvent: false });
  }
}

getTime24() {
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 1) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        this.timeSlots.push(`${h}:${m}`);
      }
    }
}

  calculatePageCount() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    console.log(this.pageCount, 'pageCount');
  }
  handlePageEvent(e: PageEvent) {
     this.length = e.length;
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  const pageNumber = this.pageIndex + 1;
    this.calculatePageCount();
  this.getTripSheetData(pageNumber, this.pageSize);
}
getTripSheetData(pageNumber: number, pageSize: number): void {
  this.tripservice.getTripSheetData(this.sessionLocationCode, pageNumber, pageSize).subscribe({
    next: (res) => {
      if (res.status === 1) {
        this.dataSource.data = res.Data;
        this.showTable = true;
        this.length = res.count;
        this.calculatePageCount();
      } else {
        this.showTable = false;
      }
    },
    error: (err) => {
      console.error('API error:', err);
      this.showTable = false;
    }
  });
}


onVehicleChange(selectedVehicleReg: any) {
  const selectedVehicle = this.vehicleNumbers.find(v => v.vehicleReg === selectedVehicleReg.vehicleReg);
  if (selectedVehicle) {
    this.createForm.patchValue({
      VehicleType: selectedVehicle.vehicleType || '',
      Drivername: selectedVehicle.driverName || '',
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


applyFilter(value: string): void {
  this.dataSource.filter = value.trim().toLowerCase();
}
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

   generateTrip(formData: any) {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.openSnackBar('Please fill all required fields correctly.', 'error-snackbar');
      return;
    }

    const requestData = {
      InputName: 'CreateTrip',
      tripNo: this.tirpNo,
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
      OTR : formData.OTR || '',
      OTA : formData.OTA || '',
      ID : '',
      LoadingIn: formData.loadingIn || '',
      LoadingOut: formData.loadingOut || '',
      InTransit: formData.inTransit || '',
      DispatchTime: formData.DispatchTime || '',
      StoreOutTime: formData.StoreOut || '',
      userName: this.userName,
    };

    this.tripservice.createTrip(requestData).subscribe({
      next: (resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          const transportTypeValue = this.createForm.get('Transporttype')?.value;
          this.createForm.reset({
            Transporttype: transportTypeValue
          });

          this.listData = [];
          this.getTripSheetData(this.pageIndex + 1, this.pageSize);
          this.showTable = false;
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



tripUpdate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.openSnackBar('Please fill all required fields correctly.', 'error-snackbar');
      return;
    }
   const formData = this.createForm.value;

    const requestData = {
      InputName: 'UpdateTrip',
      tripNo: this.tirpNo,
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
      OTR : formData.OTR || '',
      OTA : formData.OTA || '',
      ID : '',
      LoadingIn: formData.loadingIn || '',
      LoadingOut: formData.loadingOut || '',
      InTransit: formData.inTransit || '',
      DispatchTime: formData.DispatchTime || '',
      StoreOutTime: formData.StoreOut || '',
      userName: this.userName,
    };

    this.tripservice.createTrip(requestData).subscribe({
      next: (resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          const transportTypeValue = this.createForm.get('Transporttype')?.value;
          this.createForm.reset({
            Transporttype: transportTypeValue
          });

          this.listData = [];
          this.getTripSheetData(this.pageIndex + 1, this.pageSize);
          this.showTable = false;
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



  //  loadDestination(SupplierCode: string) {
  //    if (this.userType === 'Admin') {
  //      this.httpService.getDestSearchX(SupplierCode).subscribe((resp: any) => {
  //        this.DestinationName = resp.Data;
  //      }, error => {
  //        this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
  //      });
  //    } else {
  //      this.httpService.getDestSearchX(SupplierCode).subscribe((resp: any) => {
  //        this.DestinationName = resp.Data;
  //      }, error => {
  //        this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
  //      });
  //    }
  //  }

   loadDriverName() {
     this.httpService.getAvailableDriver().subscribe((resp: any) => {
         this.DriverName = resp.Data;
       });
   }
   loadVehicleType() {
    this.httpService.getVehicleType().subscribe((resp: any) => {
      this.VehicleTypeList = resp.Data;
    });
   }
   onDriverNameChange(selectedDriver: any) {
    const driverCode = selectedDriver?.driverCode;
    if (driverCode) {
       this.httpService.getDriverMobile(driverCode).subscribe((response: any) => {
           if (response.status === 1) {
            const driverMobileNo = response.Data[0].driverMobileNo;
            this.createForm.patchValue({
              DriverNo: driverMobileNo
            })
            // this.driverNumber = response.Data[0].driverMobileNo;
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



   convertToDate(dateStr: string): string {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined') {
      return '';
    }

    const str = String(dateStr);
    const parts = str.split('-'); // expects dd-MM-yyyy
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;

    if (isNaN(+day) || isNaN(+month) || isNaN(+year)) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // yyyy-MM-dd
  }


   populateForm(data: any) {
      this.editMode = true;
      this.tirpNo = data.TripNo;
      console.log('TirpNo>>>>>>>>> ', this.tirpNo)
    this.createForm.patchValue({
      CustomerName: data.Customer_Code || '',
      Date: this.convertToDate(data.TripDate),
      originName: data.Origin_code || '',
      // destination: data.DestinationName ? [data.DestinationName] : '',
      destination: data.DestinationName ? data.DestinationName.split('-').map((dest: string) => dest.trim()) : [],
      Route: data.Route || '',
      Transporttype: data.Transpoter_type || 'Hired',
      transName: data.Transport_Code || '',
      VehicleType: data.Vehicle_Type || '',
      VehicleNo: data.VehicleNo || '',
      Drivername: data.DriverName || '',
      DriverNo: data.DriverNo || '',
      Remark: data.Remark || '',
      supplierName: data.shipperCode || '',
      OTR: data.OTR || '',
      OTA: data.OTA || '',
      loadingIn: data.LoadingIn || '',
      loadingOut: data.LoadingOut || '',
      inTransit: data.InTransit || '',
      DispatchTime: data.DispatchTime || '',
      StoreOut: data.StoreOutTime || ''
    });

      console.log('Date', this.createForm.value.Date);
      console.log('Drivername', this.createForm.value.Drivername);
      console.log('supplierName', this.createForm.value.supplierName);


  }
}
