import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
// import { event } from 'jquery';

@Component({
  selector: 'app-active-customer',
  templateUrl: './active-customer.component.html',
  styleUrls: ['./active-customer.component.scss']
})
export class ActiveCustomerComponent implements OnInit {

  shipperForm: FormGroup;
  validationMessage: any = [];
  pinCode: string;
  customerCode: string;
  stateCode: string;
  countryCode: string;
  destinationCode: string;
  shipperName: string;
  address1: string;
  address2: string;
  emailID: string;
  gstNo: string;
  cityName: string;
  contactNo: string;
  kycImage: any;
cityList: any[] = [];

  itemData: any;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
gstVerification: any;
  ShipperSave: any;
  ShippergstVerify: string = '';
isGstVerified: boolean = false;
  lastVerifiedGST: string;
showGstVerification = false;
  kycFileName: any;
shipperNameList: any[] = [];
  selectedShipper: any;

  constructor(private _mdr: MatDialogRef<ActiveCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public httpService: HttpService,
              public formBuilder: FormBuilder,
              private AllService: AllServicesService,
              private bookingService: BookingService,
              private snackBar: MatSnackBar,
              ) {
                  if (data.responseData) {
                    this.customerCode = data.responseData;
                    this.address1 = data.shipperAdd1;
                    this.address2 = data.shipperAdd2;
                    this.emailID = data.shipperEmail;
                    this.gstNo = data.shipperGSTNo;
                    this.cityName = data.shipperCity;
                    this.contactNo = data.shipperPhone;
                    this.pinCode = data.shipperPinCode;
                    this.shipperName = data.selectedShipper;
                    this.kycImage = data.kycImage || null;
                    this.ShipperSave = data.ShipperSave ?? 0;
                  };
              }

  ngOnInit(): void {
    // if (this.data?.source === 'booking2') {
    //   this.showGstVerification = true;
    // }
     this.AllService.getDestinationDataa().subscribe((data) => {
      this.cityList = data.Data;
    });
    const gstFlag = localStorage.getItem('GstVerify');
    this.isGstVerified = gstFlag === '1';
     this.loadShipper(this.customerCode);
    // this.getPinCode(event);
    this.shipperForm = this.formBuilder.group({
      shipperName: [this.shipperName || '', Validators.required],
      contactNo: [''],
      emailID: [''],
      gstNo: [''],
      pinCode: [''],
      address1: [''],
      address2: [''],
      cityName: [''],
      saveShipper: [this.ShipperSave ? true : false],
    });
     if (this.kycImage) {
    // ✅ If you have an image preview control
    this.cardImageBase64 = this.kycImage;
  }
  this.shipperForm.patchValue({
      cityName: this.cityName,
      saveShipper: this.ShipperSave
    });
    this.validationMessage = {
      shipperName: [{type: 'required' , message: 'Please Enter Shipper Name.'}],
      contactNo: [{}],
      emailID: [{}],
      gstNo: [{}],
      pinCode: [{}],
      address1: [{}],
      address2: [{}],
      cityName: [{}],
      saveShipper: [{}]
    }
  }
  // tslint:disable-next-line:no-shadowed-variable
  getPinCode(event: any): void {
    this.pinCode = event.target.value;
    if (this.pinCode) {
      this.bookingService.getPincodeData(this.pinCode).subscribe(
        (response: any) => {
            this.shipperForm.controls.cityName.setValue(response.Data[0].Destination_Code);
        },
        (error) => {
          console.error('Error fetching pincode data:', error);
        }
      );
    }
  }

  CloseDialog() {
    this._mdr.close(false);
  }
loadShipper(consignerCode: any) {
  this.bookingService.getShipper(consignerCode).subscribe(
    (resp) => {
      this.shipperNameList = resp.Data;
    },
    (error) => {
      console.error('Error in loadShipper:', error);
    }
  );
}
onShipperSelectedInDialog() {
  const rawValue = this.shipperForm.get('shipperName')?.value?.trim();
  if (!rawValue) {
    return;
  }

  const shipperName = rawValue.split(' (')[0];
  this.selectedShipper = shipperName;

  const selected = this.shipperNameList.find(item =>
    item.shipperName === shipperName
  );

  if (!shipperName) {
     this.shipperForm.patchValue({
    contactNo: '',
    emailID: '',
    address1: '',
    address2: '',
    pinCode: '',
    cityName: '',
    gstNo: ''
  });
    return;
  }

  // const selected = this.shipperNameList.find(item => item.shipperName === shipperName);

  if (selected) {
    this.bookingService.getShipperDetail(selected.shipperCode).subscribe(
      (resp: any) => {
        if (resp.status === 1 && resp.Data.length > 0) {
          const data = resp.Data[0];

          // patch dialog form with shipper details
          this.shipperForm.patchValue({
            contactNo: data.ShipperPhoneNo,
            emailID: data.ShipperEmail,
            address1: data.ShipperAdd1,
            address2: data.ShipperAdd2,
            pinCode: data.ShipperPincode,
            cityName: data.CityCode,
            gstNo: data.GSTNo
          });
        }
      },
      (error) => {
        console.error('Error in getShipperDetail:', error);
      }
    );
  }
}
  formSubmit() {
    if (this.shipperForm.invalid) {
      Object.keys(this.shipperForm.controls).forEach((field) => {
        this.shipperForm.get(field)?.markAsTouched();
      });
      return;
    }

    const obj = {
      CustomerCode: this.customerCode,
      shipperName: this.selectedShipper || this.shipperForm.value.shipperName,
      shipperAdd1: this.shipperForm.value.address1,
      shipperAdd2: this.shipperForm.value.address2,
      shipperCity: this.shipperForm.value.cityName,
      shipperPinCode: this.shipperForm.value.pinCode || this.pinCode,
      shipperStateCode: this.stateCode,
      shipperPhone: this.shipperForm.value.contactNo,
      shipperGSTNo: this.shipperForm.value.gstNo,
      shipperEmail: this.shipperForm.value.emailID,
      DestinationCode: this.destinationCode,
      CountryCode: this.countryCode,
      ShipperSave: this.shipperForm.value.saveShipper || 0,
      kycImage: this.cardImageBase64,
    };

    console.log(obj, 'hello');
    this._mdr.close(obj);
  }

   openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
verifyGST() {
   if ( this.lastVerifiedGST === this.shipperForm.value.gstNo) {
    this.openSnackBar('GST already verified!', 'custom-snackbar');
    return;
  }
  if (!this.shipperForm.value.gstNo || this.shipperForm.value.gstNo.length !== 15) {
    this.openSnackBar( 'Please enter a valid 15-digit GST number', 'error-snackbar');
    return;
  }

  this.bookingService.verifyGSTNumber(this.shipperForm.value.gstNo).subscribe(
    (resp: any) => {
      if ( resp.status === 1) {
        this.openSnackBar( resp.message, 'custom-snackbar')
        // if (resp.data) {
          const res = resp.data.pradr.addr;
             const address1Parts = [res.bnm, res.flno, res.bno].filter(Boolean);
          const address1 = address1Parts.join(', ');

          const address2Parts = [res.st, res.locality].filter(Boolean);
          const address2 = address2Parts.join(', ');

          const cityItem = this.cityList.find(item =>
            item.destinationName.toLowerCase() === res.loc.toLowerCase()
          );

          this.shipperForm.patchValue({
            address1: address1,
            address2: address2,
            landMark: res.landMark,
            pinCode: res.pncd,
            cityName: cityItem ? cityItem.destinationCode : null,
            shipperName: resp.data.tradeNam
          });
          this.lastVerifiedGST = this.shipperForm.value.gstNo;
        // }
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
          this.shipperForm.patchValue({
          address1: '',
          address2: '',
          landMark: '',
          pinCode: '',
          cityName: null,
          stateName: null
        });
        this.lastVerifiedGST = null;
      }
    },
    (err) => {
      console.error('GST verification failed', err);
      this.openSnackBar('Error verifying GST number', 'error-snackbar');
    }
  );
}
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
    this.kycFileName = file.name;
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
        const max_height = 15200;
        const max_width = 25600;
        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];
                console.log(img_height, img_width);
                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    this.isImageSaved = true;
                    this.shipperForm.get('image').setValue('');
                    console.log(this.cardImageBase64);
                    this.cardImageBase64 = '';
                    this.isImageSaved = false;
                }
            };
        };
        reader.readAsDataURL(fileInput.target.files[0]);
    }
}

  saveData(activeFormValue) {
    this._mdr.close(false);
  }

}
