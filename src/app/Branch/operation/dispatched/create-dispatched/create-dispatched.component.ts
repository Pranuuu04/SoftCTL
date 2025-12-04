import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AllServicesService } from 'app/service/all-services.service';
import { BulkManifestComponent } from 'app/Branch/Shared/manifest pages/bulk-manifest/bulk-manifest.component';
import { AddDispatchComponent } from 'app/Branch/Shared/dispatch_pages/add-dispatch/add-dispatch.component';
import { environment } from 'environments/environment';
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-dispatched',
  templateUrl: './create-dispatched.component.html',
  styleUrls: ['./create-dispatched.component.css']
})
export class CreateDispatchedComponent implements OnInit {
  sessionLocationCode: string;
  originName: any;
  tripsheet: string;
  createForm: any;
  validationMessage: any = [];
  listData: any = [];
  AwbNoDatalist: any = [];
  showTable = false; 
  Diesel_Amount: string; 
  Driver_Licence_No: string; 
  Opening_Km: string; 
  Vehicle_diesel_No: string; 
  Vehicle_diesel_Ltrs: string; 
  Kata_Weight: string; 
  Slip_No: string; 
  Brocker_Name: string;
  Advance_Paid: string; 
  selectedType = 'Hired';
  vehicleNumbers: string[] = [];
  DestinationName: any[];
  ModeName: any;
  DriverName: any[];
  driverNumber: any;
  ColoaderName: any;
  selectedVendorCode: string = '';
  inputRouteName: any;
  awbNumber: string;
  manfNo: any;
  mftNo: any;
  actualWeight: any;
  destinationName: any;
  userType: any;

  constructor(public httpService: AllServicesService,
              public httpservice: HttpService,
              public http :HttpClient,
              private router: Router,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              private renderer: Renderer2,
              private snackBar: MatSnackBar,) {
                this.originName = localStorage.getItem('originName');
                this.tripsheet = localStorage.getItem('tripSheet');
               }
     
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');
  this.createForm = this.formBuilder.group({
    MFTno: new FormControl('', Validators.compose([])),
    awbNumber: new FormControl('', Validators.compose([])),
    origin: new FormControl('', Validators.compose([Validators.required])),
    destination: new FormControl('', Validators.compose([Validators.required])),
    via: new FormControl('', Validators.compose([Validators.required])),
    Mode: new FormControl('', Validators.compose([Validators.required])),
    transportType : new FormControl('', Validators.compose([Validators.required])),
    VehicleType: new FormControl('', Validators.compose([Validators.required])),
    VehicleNo: new FormControl('', Validators.compose([Validators.required])),
    Drivername: new FormControl('', Validators.compose([Validators.required])),
    driverNumber: new FormControl('', Validators.compose([Validators.required])),
    ColoaderName: new FormControl('', Validators.compose([Validators.required])),
    ColoaderNumber: new FormControl('', Validators.compose([Validators.required])),
    Route: new FormControl('', Validators.compose([Validators.required])),
    Remark: new FormControl('', Validators.compose([Validators.required])),
    BookingWt: new FormControl('', Validators.compose([Validators.required])),
    Manifestwt: new FormControl('', Validators.compose([Validators.required])),
  });

  this.loadMode();
  this.loadDestination();
  this.loadDriverName();
  this.loadRouteName();
  this.loadColoaderName();
  this.getMFTno();
  // this.createForm.controls['origin'].setValue(this.originName);
  this.createForm.controls['origin'].setValue(this.sessionLocationCode);
  this.validationMessage = {
    MFTno :[
      {type: 'required' ,message :'Please select MFTno'}
    ],
    awbNumber: [
      { type: 'required', message: 'Please enter AWB Number' }
    ],
    destination: [
      { type: 'required', message: 'Please select Destination' }
    ],
    via: [
      { type: 'required', message: 'Please select Via' }
    ],
  };
  }
  refresh() {

  }
    openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  ontransportTypeChange(event: any) {
    this.selectedType = event.target.value;
    if (this.selectedType === 'Self') {
        this.getVehicleNumbers();
    } else {
    }
}
getVehicleNumbers() {
  this.httpService.getVehicleNo('').subscribe((response: any) => {
        this.vehicleNumbers = response.Data;
      },(error) => {
          this.snackBar.open('Error fetching vehicle numbers', 'Close', {
              duration: 3000
          });
          console.error('Error fetching vehicle numbers:', error);
      }
  );
}

getDataByMFTno(event: any){
  this.mftNo = event.target.value;
 if(this.userType === 'Admin'){
  this.httpservice.get(`${environment.apiUrl}dispatch/getDispatchByManifestNo?sessionLocationCode=${this.sessionLocationCode}&manifestNo=${this.mftNo}`).then(resp=>{
    if(resp.status === 1){
      this.createForm.controls.destination.setValue(resp.Data[0].toDest );
      this.createForm.controls.via.setValue(resp.Data[0].viacode );
      this.createForm.controls.Mode.setValue(resp.Data[0].modeName );
      this.createForm.controls.VehicleType.setValue(resp.Data[0].vehicleType );
      this.createForm.controls.VehicleNo.setValue(resp.Data[0].vehicleNo );
      this.createForm.controls.Drivername.setValue(resp.Data[0].drivercode );
      this.createForm.controls.driverNumber.setValue(resp.Data[0].driverMobile );
      this.createForm.controls.ColoaderName.setValue(resp.Data[0].vendorCode );
      this.createForm.controls.ColoaderNumber.setValue(resp.Data[0].refrenceNo );
      this.createForm.controls.Route.setValue(resp.Data[0].RouteName );
      this.createForm.controls.Remark.setValue(resp.Data[0].remark );
      this.createForm.controls.Manifestwt.setValue(resp.Data[0].manifestWt );
    }
  })
 }else{
  this.httpService.getDispatchByManifestNo(this.sessionLocationCode,this.mftNo).subscribe((resp:any)=>{
    if(resp.status === 1){
      this.createForm.controls.destination.setValue(resp.Data[0].toDest );
      this.createForm.controls.via.setValue(resp.Data[0].viacode );
      this.createForm.controls.Mode.setValue(resp.Data[0].modeName );
      this.createForm.controls.VehicleType.setValue(resp.Data[0].vehicleType );
      this.createForm.controls.VehicleNo.setValue(resp.Data[0].vehicleNo );
      this.createForm.controls.Drivername.setValue(resp.Data[0].drivercode );
      this.createForm.controls.driverNumber.setValue(resp.Data[0].driverMobile );
      this.createForm.controls.ColoaderName.setValue(resp.Data[0].vendorCode );
      this.createForm.controls.ColoaderNumber.setValue(resp.Data[0].refrenceNo );
      this.createForm.controls.Route.setValue(resp.Data[0].RouteName );
      this.createForm.controls.Remark.setValue(resp.Data[0].remark );
      this.createForm.controls.Manifestwt.setValue(resp.Data[0].manifestWt );
    }
  })
 }

}
   
findAwbNo(formData: any) {
  const awbNoToCheck = formData.awbNumber;
  const ManfToCheck = formData.MFTno;
  if (!ManfToCheck) {
    this.openSnackBar('Please select a manifest number.', 'error-snackbar');
    return;
  }
  if (this.listData.some(item => item.AwbNo === awbNoToCheck)) {
    this.openSnackBar('AWB number already exists in the list.', 'error-snackbar')
    return;
  }

  if (this.AwbNoDatalist.includes(awbNoToCheck)) {
    this.openSnackBar('AWB number already exists.', 'error-snackbar')
    return;
  }
  if(this.userType === 'Admin'){
    this.httpservice.get(`${environment.apiUrl}dispatch/pendingDispatchByAwbNo?sessionLocationCode=${this.sessionLocationCode}&awbNo=${awbNoToCheck}&manifestNo=${ManfToCheck}`).then((resp:any) => {
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
            eWayBillNo : resp.Data[0].eWayBillNo
          });
        }, 500);
        setTimeout(() => {
          this.renderer.selectRootElement('#awbInput').focus();
        }, 600); 
      }else {
        this.openSnackBar(resp.message, 'error-snackbar')
      }
    },error => {
      this.openSnackBar( 'Please enter Correct Awb No.', 'error-snackbar')
    })
  }else{
    this.httpService.FindManifestByAwbNo(this.sessionLocationCode, awbNoToCheck , ManfToCheck).subscribe((resp:any) => {
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
            eWayBillNo : resp.Data[0].eWayBillNo
          });
        }, 500);
        setTimeout(() => {
          this.renderer.selectRootElement('#awbInput').focus();
        }, 600); 
      }else {
        this.openSnackBar(resp.message, 'error-snackbar')
      }
    },error => {
      this.openSnackBar( 'Please enter Correct Awb No.', 'error-snackbar')
    })
  }
}


  generateData(formData) {
    if (
      !this.createForm.value.destination ||
      !this.createForm.value.Mode ||
      !this.AwbNoDatalist
    ) {
      this.openSnackBar( 'Please fill in all required fields.', 'error-snackbar')
      return;
    }
    let postData = {
      sessionLocationCode:this.sessionLocationCode ,
      toDest:formData.destination,
      manifestNo:formData.MFTno,
      Mode:formData.Mode,
      Remark:formData.Remark || '',
      Vehicletype:formData.VehicleType || '',
      VehicleNo:formData.VehicleNo || '',
      via:formData.via || '',
      route:formData.Route || '',
      AwbNo: this.AwbNoDatalist || '',
      VendorCode:formData.ColoaderName || '',
      driverName:formData.Drivername || '',
      refrenceNo:formData.ColoaderNumber || '',
      openingKM:this.Opening_Km || 0,
      DriverLicenceNo:this.Driver_Licence_No || '',
      VehicleDieselLtrs:this.Vehicle_diesel_Ltrs || '',
      BrockerName:this.Brocker_Name || '',
      Katawt:this.Kata_Weight || '',
      AdvancePaid:this.Advance_Paid || 0,
      VehicleDieselNo:this.Vehicle_diesel_No || '',
      SlipNo:this.Slip_No || '',
      DieselAmt:this.Diesel_Amount || 0
    };
    if(this.userType === 'Admin'){
      let postData = {
        sessionLocationCode:  this.sessionLocationCode,
        toDest:formData.destination,
        manifestNo:formData.MFTno,
        Mode:formData.Mode,
        Remark:formData.Remark || '',
        Vehicletype:formData.VehicleType || '',
        VehicleNo:formData.VehicleNo || '',
        via:formData.via || '',
        route:formData.Route || '',
        AwbNo: this.AwbNoDatalist || '',
        VendorCode:formData.ColoaderName || '',
        driverName:formData.Drivername || '',
        refrenceNo:formData.ColoaderNumber || '',
        openingKM:this.Opening_Km || 0,
        DriverLicenceNo:this.Driver_Licence_No || '',
        VehicleDieselLtrs:this.Vehicle_diesel_Ltrs || '',
        BrockerName:this.Brocker_Name || '',
        Katawt:this.Kata_Weight || '',
        AdvancePaid:this.Advance_Paid || 0,
        VehicleDieselNo:this.Vehicle_diesel_No || '',
        SlipNo:this.Slip_No || '',
        DieselAmt:this.Diesel_Amount || 0
      };
      this.httpservice.post(`${environment.apiUrl}dispatch/generateDispatch`,postData).then((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar');
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([this.router.url]);
          // this.getMFTno();
          // this.createForm.reset();
          // this.listData = [];
          // this.AwbNoDatalist = [];
        } else {
          this.openSnackBar(resp.message,'error-snackbar')
        }
      });
    }else{
      this.httpService.generateDispatch(postData).subscribe((resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar( resp.message, 'custom-snackbar');
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([this.router.url]);
          // this.getMFTno();
          // this.createForm.reset();
          // this.listData = [];
          // this.AwbNoDatalist = [];
        } else {
          this.openSnackBar(resp.message,'error-snackbar')
        }
      });
    }
  }
  openaddDispatch() {
    const dialogRef = this.dialog.open(AddDispatchComponent, {
      data: {
        Driver_Licence_No: this.Driver_Licence_No,
        Opening_Km: this.Opening_Km,
        Vehicle_diesel_No: this.Vehicle_diesel_No,
        Vehicle_diesel_Ltrs: this.Vehicle_diesel_Ltrs,
        Kata_Weight: this.Kata_Weight,
        Slip_No: this.Slip_No,
        Brocker_Name: this.Brocker_Name,
        Advance_Paid: this.Advance_Paid,
        Diesel_Amount: this.Diesel_Amount
      },
      width: '40rem',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
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
        action: 'add'
      },
      width: '50rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      
      }
    });
  }

  loadDestination() {
      this.httpService.GetDestination(this.sessionLocationCode).subscribe((resp :any) => {
        this.DestinationName = resp.Data;
      },error =>{
        this.openSnackBar('An error occurred while fetching data. Please try again later.', 'error-snackbar');
      });    
  }

  getMFTno(){
   if(this.userType === 'Admin'){
    this.httpservice.get(`${environment.apiUrl}dispatch/pendingManifestno?sessionLocationCode=${this.sessionLocationCode}`).then(resp=>{
      this.manfNo = resp.Data;
    })
   }else{
    this.httpService.pendingManifestno(this.sessionLocationCode).subscribe((resp :any)=> {
      this.manfNo = resp.Data;
    })
   }
  }

  loadMode() {
   if(this.userType === 'Admin'){
    this.httpservice.get(`${environment.apiUrl}Booking/getMode`).then((resp : any) => {
      this.ModeName = resp.Data;
    });
    }else{
      this.httpService.GetMode().subscribe((resp : any) => {
        this.ModeName = resp.Data;
      });
    }
  }

  loadDriverName() {
   if(this.userType === 'Admin'){
    this.httpservice.get(`${environment.apiUrl}Manifest/getDriver`).then((resp : any) => {
      this.DriverName = resp.Data;
    });
   }else{
    this.httpService.getDriver().subscribe((resp : any) => {
      this.DriverName = resp.Data;
    });
   }
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
    this.httpService.getRoute().subscribe((resp : any) => {
        this.inputRouteName = resp.Data;
      });
  }

  loadColoaderName() {
    this.httpService.getVendor().subscribe((resp : any) => {
        this.ColoaderName = resp.Data;
      });
  }
}
