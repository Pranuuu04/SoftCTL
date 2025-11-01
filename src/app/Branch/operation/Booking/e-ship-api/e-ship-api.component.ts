import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookPrintComponent } from 'app/Branch/Shared/book-print/book-print.component';
import { InvoiceValComponent } from 'app/Branch/Shared/invoiceVal/invoice-val.component';
import { VolumetricComponent } from 'app/Branch/Shared/volumetric/volumetric.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-e-ship-api',
  templateUrl: './e-ship-api.component.html',
  styleUrls: ['./e-ship-api.component.css']
})
export class EShipAPIComponent implements OnInit {

  EshipForm: FormGroup;
  awbType: string;
  selectedOrigin: string ;
  sessionLocationCode: string;
  originList: string;
  destinationList: string;
  selectedDestination: string;
  productList: string;
  selectedProduct: string;
  deliveryTypeList: string;
  deliveryType: string;
  consignerList: any;
  consignerCode: string;
  shipperNameList: any;
  selectedShipper: string;
  stateList: string;
  stateName: string;
  countryList: string;
  countryName: string;
  deleteDisabled = true;
  selectedMode: string;
  modeList: string;
  consigneeList: any;
  consigneeName: string ;
  CustomerName: string;
  pinCode: string;
  volumetrictotal: any;
  volListData: string;
  chargedWt: number;
  Volumetrice: any;
  CustInvoice: any;
  invoiceListData: string;
  invoiceValue: number;
  validationMessage: any = [];
  pinCodecons: string;
  destinationListCon: string;
  stateListCons: string;
  countryListcons: string;
  currentDate: string;
  isShipperChecked: any;
  isConsigneeChecked: any;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  isDialogFilled = false;
  isDialogInvoiceModal = false;


    constructor(public dialog: MatDialog,
                // tslint:disable-next-line:no-shadowed-variable
                public FormBuilder: FormBuilder,
                public AllService: AllServicesService,
                public bookingService: BookingService,
                private snackBar: MatSnackBar,
                public http: HttpClient,
                public httpService: HttpService,
                ) { }

    ngOnInit(): void {
      this.AllService.getDestinationData().subscribe((data) => {
        this.destinationList = data.Data;
        this.destinationListCon = data.Data;
      });
      this.AllService.getOriginData().subscribe((data) => {
        this.originList = data.Data;
      });
      this.AllService.getCountryData().subscribe((data) => {
        this.countryList = data.Data;
        this.countryListcons = data.Data;
      })
      this.sessionLocationCode = localStorage.getItem('originCode');
      this.currentDate = new Date().toISOString().split('T')[0];
      this.modeList = JSON.parse(localStorage.getItem('modeList'));
      this.productList = JSON.parse(localStorage.getItem('productList'));
      this.EshipForm = this.FormBuilder.group({
        VendorName: new FormControl('', Validators.compose([])),
        awbNo: new FormControl('', Validators.compose([Validators.required])),
        date: new FormControl('', Validators.compose([Validators.required])),
        origin: new FormControl(this.sessionLocationCode, Validators.compose([])),
        destination: new FormControl(this.selectedDestination, Validators.compose([Validators.required])),
        Mode: new FormControl(this.selectedMode, Validators.compose([Validators.required])),
        product: new FormControl(this.selectedProduct, Validators.compose([Validators.required])),
        deliveryType: new FormControl(this.deliveryType, Validators.compose([Validators.required])),
        consignerName: new FormControl(this.consignerCode, Validators.compose([Validators.required])),
        refCustName: new FormControl('', Validators.compose([])),
        remark: new FormControl('', Validators.compose([])),
        shipperName: new FormControl(this.selectedShipper, Validators.compose([Validators.required])),
        shipperCompanyName: new FormControl('', Validators.compose([])),
        shipperConPerson: new FormControl('', Validators.compose([])),
        shipAddress1: new FormControl('', Validators.compose([])),
        shipAddress2: new FormControl('', Validators.compose([])),
        shipALandMark: new FormControl('', Validators.compose([])),
        shipPinCode: new FormControl('', Validators.compose([])),
        ShipperCity: new FormControl('', Validators.compose([])),
        shipperState: new FormControl(this.stateName, Validators.compose([])),
        shipperCountry: new FormControl('', Validators.compose([])),
        shipMmobileNo: new FormControl('', Validators.compose([])),
        shipMailId: new FormControl('', Validators.compose([])),
        shipGstNo: new FormControl('', Validators.compose([])),
        shipKycType: new FormControl('', Validators.compose([])),
        shipkycNo: new FormControl('', Validators.compose([])),
        consigneeName: new FormControl(this.consigneeName, Validators.compose([Validators.required])),
        consCompanyName: new FormControl('', Validators.compose([])),
        consContactPer: new FormControl('', Validators.compose([])),
        consAdd1: new FormControl('', Validators.compose([])),
        consAdd2: new FormControl('', Validators.compose([])),
        consLandMark: new FormControl('', Validators.compose([])),
        consPinCode: new FormControl('', Validators.compose([])),
        consDestination: new FormControl('', Validators.compose([])),
        consStateName: new FormControl('', Validators.compose([])),
        consCountryName: new FormControl('', Validators.compose([])),
        consContactNo: new FormControl('', Validators.compose([])),
        consEmailID: new FormControl('', Validators.compose([])),
        consGST: new FormControl('', Validators.compose([])),
        consPCS: new FormControl('', Validators.compose([Validators.required])),
        consAcctual: new FormControl('', Validators.compose([Validators.required])),
        volumetricWt: new FormControl('', Validators.compose([])),
        InvNo: new FormControl('', Validators.compose([])),
        InvValue: new FormControl('', Validators.compose([])),
        CurrencyType: new FormControl('', Validators.compose([])),
        InvDate: new FormControl('', Validators.compose([])),
        InvContent: new FormControl('', Validators.compose([])),
        Ewaybill: new FormControl('', Validators.compose([]))
      });
      this.validationMessage = {
        awbNo : [
          {type: 'required' , message : 'Please select awbNo'}
        ],
        date: [
          { type: 'required', message: 'Please enter date' }
        ],
        destination: [
          { type: 'required', message: 'Please select destination' }
        ],
        Mode: [
          { type: 'required', message: 'Please select Mode' }
        ],
        product: [
          { type: 'required', message: 'Please select product' }
        ],
        deliveryType: [
          { type: 'required', message: 'Please select delivery type' }
        ],
        consignerName: [
          { type: 'required', message: 'Please select consigner name' }
        ],
        shipperName: [
          { type: 'required', message: 'Please select shipper name' }
        ],
        consigneeName: [
          { type: 'required', message: 'Please select consignee name' }
        ],
        consPCS: [
          { type: 'required', message: 'Please enter PCS' }
        ],
        consAcctual: [
          { type: 'required', message: 'Please enter Acctual weight' }
        ],
      };
    }
    refresh() {
      this.deliveryTypeData();
      this.loadConsignerData();
      this.loadState();
    }

    deliveryTypeData() {
      this.bookingService.getDeliveryType().subscribe(
        (resp) => {
          this.deliveryTypeList = resp.Data;
        },
        (error) => {
          console.error('Error in deliveryTypeData:', error);
        }
      );
    }
    loadConsignerData() {
      this.bookingService.loadConsignerData(this.sessionLocationCode)
      .subscribe(
        (resp) => {
          this.consignerList = resp.Data;
        })
    }




    fetchReleventData(event: any) {
      const selectedConsigner = this.consignerList.find(item => item.customerCode === event);

      if (selectedConsigner) {
        this.consignerCode = selectedConsigner.customerCode;
        this.loadShipper(event);
        this.loadConsignee(event);
      }
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

    loadConsignee(params: any) {
      this.bookingService.getConsignee(params).subscribe(
        (resp) => {
          this.consigneeList = resp.Data;
        },
        (error) => {
          console.error('Error in loadConsignee:', error);
        }
      );
    }

    addressList() {
      const consigneeName = this.EshipForm.value.consigneeName.trim();

      const consignee = this.consigneeList.find(
        item => item.ConsigneeName.trim().toLowerCase() === consigneeName.toLowerCase()
      );

      const consigneeCode = consignee ? consignee.ConsigneeCode : undefined;

      if (!consigneeCode) {
        console.error('Consignee code not found');
        return;
      }

      this.bookingService.getConsigneeDetail(consigneeCode).subscribe(
        (resp) => {
          this.EshipForm.controls.consCompanyName.setValue(resp.Data[0].CompanyName);
          this.EshipForm.controls.consContactPer.setValue(resp.Data[0].ContactPerson);
          this.EshipForm.controls.consAdd1.setValue(resp.Data[0].consigneeAdd1);
          this.EshipForm.controls.consAdd2.setValue(resp.Data[0].consigneeAdd2);
          this.EshipForm.controls.consLandMark.setValue(resp.Data[0].consigneeLandmark);
          this.EshipForm.controls.consPinCode.setValue(resp.Data[0].consigneePincode);
          this.EshipForm.controls.consDestination.setValue(resp.Data[0].CityName);
          this.EshipForm.controls.consStateName.setValue(resp.Data[0].stateName);
          this.EshipForm.controls.consCountryName.setValue(resp.Data[0].countryName);
          this.EshipForm.controls.consContactNo.setValue(resp.Data[0].consigneePhoneNo);
          this.EshipForm.controls.consEmailID.setValue(resp.Data[0].consigneeEmail);
          this.EshipForm.controls.consGST.setValue(resp.Data[0].GSTNo);
        },
        (error) => {
          console.error('Error in addressList:', error);
        }
      );
    }
    shipperAddList() {
      const shipperName = this.EshipForm.value.shipperName.trim();
      const shipper = this.shipperNameList.find(item => item.shipperName === shipperName);
      const shipperCode = shipper ? shipper.shipperCode : undefined;

      if (!shipperCode) {
        console.error('Shipper code not found');
        return;
      }

      this.bookingService.getShipperDetail(shipperCode).subscribe(
        (resp) => {
          if (resp.status === 1) {
            const data = resp.Data[0];

            this.EshipForm.controls.shipperCompanyName.setValue(data.CompanyName);
            this.EshipForm.controls.shipperConPerson.setValue(data.ContactPerson);
            this.EshipForm.controls.shipAddress1.setValue(data.ShipperAdd1);
            this.EshipForm.controls.shipAddress2.setValue(data.ShipperAdd2);
            this.EshipForm.controls.shipALandMark.setValue(data.ShipperLandmark);
            this.EshipForm.controls.shipPinCode.setValue(data.ShipperPincode);
            this.EshipForm.controls.ShipperCity.setValue(data.CityCode);
            this.EshipForm.controls.shipperState.setValue(data.stateCode);
            this.EshipForm.controls.shipperCountry.setValue(data.countryCode);
            this.EshipForm.controls.shipMmobileNo.setValue(data.ShipperPhoneNo);
            this.EshipForm.controls.shipMailId.setValue(data.ShipperEmail);
            this.EshipForm.controls.shipGstNo.setValue(data.GSTNo);
            this.EshipForm.controls.shipKycType.setValue(data.KYCtype);
            this.EshipForm.controls.shipkycNo.setValue(data.KYCNo);
          } else {
            console.error('No data found for the given Shipper code');
          }
        },
        (error) => {
          console.error('Error in shipperAddList:', error);
        }
      );
    }

   getPinCode(event: any) {
    this.pinCode = event.target.value;
    if (this.pinCode) {
      this.bookingService.getPincodeData(this.pinCode).subscribe(
        (resp) => {
          const data = resp.Data[0];
          this.EshipForm.controls.cityName.setValue(data.Destination_Code);
          this.EshipForm.controls.stateName.setValue(data.State_Code);
          this.EshipForm.controls.countryName.setValue(data.country_code);
        },
        (error) => {
          console.error('Error in getPinCode:', error);
        }
      );
    }
  }

   getPinCodeCons(event: any) {
    this.pinCodecons = event.target.value;
    if (this.pinCodecons) {
      this.bookingService.getPincodeData(this.pinCodecons).subscribe(
        (resp) => {
          const data = resp.Data[0];
          this.EshipForm.controls.cityName.setValue(data.Destination_Code);
          this.EshipForm.controls.stateName.setValue(data.State_Code);
          this.EshipForm.controls.countryName.setValue(data.country_code);
        },
        (error) => {
          console.error('Error in getpinCodecons:', error);
        }
      );
    }
  }

  loadState() {
    this.bookingService.getState().subscribe(
      (resp) => {
        this.stateList = resp.Data;
        this.stateListCons = resp.Data;
      },
      (error) => {
        console.error('Error in loadState:', error);
      }
    );
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  SubmitEshipForm(formData) {
    if (this.EshipForm.valid) {
    const obj = {
        sessionLocationCode: this.sessionLocationCode,
        awbNo: formData.awbNo,
        customerCode: formData.consignerName || this.consignerCode,
        consigneeName: formData.consigneeName,
        consigneecontactPerson: formData.consContactPer || '',
        consigneeCompanyName: formData.consCompanyName,
        consigneeAdd1: formData.consAdd1 || '',
        consigneeAdd2: formData.consAdd2 || '',
        consigneeAdd3: formData.consLandMark || '',
        consigneePin: formData.consPinCode || '',
        consigneeMobile: formData.consContactNo || '',
        ConsigneeGst: formData.consGST || '',
        consigneeStateCode : '',
        consigneeCountryCode: '',
        consigneeEmail: '',
        modeCode: formData.Mode,
        productCode: formData.product,
        originCode: formData.origin,
        destinationCode: formData.destination || this.selectedDestination,
        bookdate: formData.date,
        // tFlag: formData.,
        qty: formData.consPCS,
        ActualWt: formData.consAcctual,
        VolumetricWt: formData.volumetricWt || this.volumetrictotal || 0,
        InvoiceNo: formData.InvNo || '',
        InvValue: formData.InvValue || this.invoiceValue || 0,
        InvCurrency: formData.CurrencyType || '',
        InvDate: formData.InvDate || '',
        EwayBill: formData.Ewaybill || '',
        Description: formData.InvContent || '',
        deliveryType: formData.deliveryType || '',
        VendorCode1: formData.VendorName || '',
        VendorAwbNo2: formData.refCustName || '',
        KYCNo: formData.shipkycNo || '',
        KYCtype: formData.shipKycType || '',
        KYCimage: this.cardImageBase64 || '',
        shipperName: formData.shipperName,
        shippercontactPerson: formData.shipperConPerson || '',
        shipperCompanyName: formData.shipperCompanyName || '',
        shipperStateCode: formData.shipperState || '',
        shipperAdd1: formData.shipAddress1 || '',
        shipperAdd2: formData.shipAddress2 || '',
        shipperAdd3: formData.shipALandMark || '',
        shipperCountryCode: formData.shipperCountry || '',
        shipperDestinationCode: formData.ShipperCity || '',
        ShipperPin: formData.shipPinCode || '',
        shipperPhone: formData.shipMmobileNo || '',
        shipperGSTNo: formData.shipGstNo || '',
        shipperEmail: formData.shipMailId || '',
        CustInvoice : this.CustInvoice || this.invoiceListData || '',
        Volumetrice : this.Volumetrice || this.volListData || '',
        shipperData : this.isShipperChecked ? 1 : 0,
        consigneeData : this.isConsigneeChecked ? 1 : 0
    }
    if (!this.isDialogFilled) {
      this.openSnackBar('Please fill the Volumetric details', 'error-snackbar');
      return;
    }
     if (!this.isDialogInvoiceModal) {
      this.openSnackBar('Please fill the Invoice details', 'error-snackbar');
      return;
    }
    this.AllService.postEshipEntry(obj).subscribe((resp: any) => {
      if (resp.Status === 1) {
        this.openSnackBar( resp.message, 'custom-snackbar')
        this.EshipForm.reset();
      } else {
        this.openSnackBar( resp.message , 'error-snackbar')
      }
    })
  } else {
    Object.keys(this.EshipForm.controls).forEach((field) => {
      const control = this.EshipForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
  }
  }

  openPrintDialog() {
    const dialogRef = this.dialog.open(BookPrintComponent, {
      data: {
        action: 'add',
      },
      width: '20rem',
      disableClose: true,
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }

  openInvoiceModal() {
    const dialogRef = this.dialog.open(InvoiceValComponent, {
      data: {
        action: 'add',
        CustInvoiceData: this.CustInvoice,
      },
      width: '52rem',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.invoiceListData = res.data;
        this.invoiceValue = res.total;
        this.EshipForm.get('InvValue').setValue(res.total);
        this.isDialogInvoiceModal = true;
      } else {
        this.isDialogInvoiceModal = false ;
      }
    });
  }
  openVolumetricModal(consignerCode: any, selectedProduct: any) {
    const dialogRef = this.dialog.open(VolumetricComponent, {
      data: {
        action: 'add',
        customerSelected: consignerCode, selectedProduct,
        previousQty: this.EshipForm.value.consPCS,
        VolumetriceData: this.Volumetrice
      },
      width: '54rem',
      disableClose: true,
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.volListData = res.data;
        this.volumetrictotal = res.total;
        this.EshipForm.get('volumetricWt').setValue(res.total);
        this.isDialogFilled = true;
        this.compareValue1();
      } else {
        this.isDialogFilled = false;
      }
    });
  }

  compareValue1() {
    if (this.volumetrictotal) {
      if (this.EshipForm.value.consAcctual >= this.volumetrictotal ) {
        this.chargedWt = this.EshipForm.value.consAcctual;
      } else if (this.volumetrictotal >= this.EshipForm.value.consAcctual ) {
        this.chargedWt = this.volumetrictotal;
      }
    } else {
      if (this.EshipForm.value.consAcctual >= this.EshipForm.value.volumetricWt ) {
        this.chargedWt = this.EshipForm.value.consAcctual;
      } else if (this.EshipForm.value.volumetricWt >= this.EshipForm.value.consAcctual ) {
        this.chargedWt = this.EshipForm.value.volumetricWt;
      }
    }
  }

  ShipperSubmit(event: any) {
    this.isShipperChecked = event.target.checked;
  }
  consigneeSubmit( event: any) {
    this.isConsigneeChecked = event.target.checked;
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
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
                    this.cardImageBase64 = '';
                    this.isImageSaved = false;
                }
            };
        };
        reader.readAsDataURL(fileInput.target.files[0]);
    }
}

}
