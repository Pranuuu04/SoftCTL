import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-fast-entry-tab',
  templateUrl: './fast-entry-tab.component.html',
  styleUrls: ['./fast-entry-tab.component.css']
})
export class FastEntryTabComponent implements OnInit {

  fastEntryForm: FormGroup;
  sessionLocationCode: any;
  validationMessage: any = [];
  productList: any;
  selectedProduct: any;
  selectedMode: any;
  modeList: any;
  consignerList: any;
  consignerCode: any;
  shipperNameList: any;
  selectedShipper: any;
  originList: any;
  selectedOrigin: any ;
  sessionLocationName: string;
  destinationListCon: any;
  consigneeList: any;
  consigneeName: any ;
  entryList: any = [];
  custType: any;
  selectedCustType: any;
  selectedConsignor: any;
  FastpinCode: any;
  @ViewChild('pincodeInput') pincodeInput: ElementRef;
  maxDate: any;
  username: string;

  constructor(  public httpService: HttpService,
                public formBuilder: FormBuilder,
                private snackBar: MatSnackBar,
                public dialog: MatDialog,
                public AllService: AllServicesService,
                public bookingService: BookingService ) {
  }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.selectedOrigin =  this.sessionLocationCode ;
    this.productList = JSON.parse(localStorage.getItem('productList'));
    this.modeList = JSON.parse(localStorage.getItem('modeList'));
    this.username = localStorage.getItem('userName');
    // this.originList = JSON.parse(localStorage.getItem('originList'));
    // this. = JSON.parse(localStorage.getItem('destinationList'));
    this.AllService.getDestinationData().subscribe((data) => {
      this.destinationListCon = data.Data;
    });
    this.AllService.getOriginData().subscribe((data) => {
      this.originList = data.Data;
    });
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.fastEntryForm = this.formBuilder.group({
      bookDt : new FormControl ('' , Validators.compose ([Validators.required])),
      Cust : new FormControl (this.consignerCode , Validators.compose ([Validators.required])),
      modeName : new FormControl (this.selectedMode , Validators.compose ([Validators.required])),
      Product : new FormControl (this.selectedProduct , Validators.compose ([Validators.required])),
      Shipper : new FormControl ('' , Validators.compose ([])),
      Pincode : new FormControl ('' , Validators.compose([Validators.pattern('^[0-9]{6}$')])),
      AwbNo : new FormControl ('' , Validators.compose ([])),
      Origin : new FormControl ('' ,  Validators.compose ([])),
      Destination : new FormControl ('' , Validators.compose ([])),
      consignee : new FormControl ('' , Validators.compose ([])),
      Quantity : new FormControl ('' , Validators.compose([Validators.min(0)])),
      actWt : new FormControl ('' , Validators.compose([Validators.min(0)])),
      volWt : new FormControl ('' , Validators.compose([Validators.min(0)])),
      Amt : new FormControl ('' , Validators.compose([Validators.min(0)])),
    });
    this.validationMessage = {
      bookDt: [
        {type: 'required', message: 'please select date'}
      ],
      Cust: [
        {type: 'required', message: 'please select consignor'}
      ],
      modeName: [
        {type: 'required', message: 'please select mode'}
      ],
      Product: [
        {type: 'required', message: 'please select product'}
      ]
    }
  }
  refresh() {
    this.loadConsignerData();
  }

  loadConsignerData() {
    this.bookingService.loadConsignerData(this.sessionLocationCode)
    .subscribe(
      (resp) => {
        this.consignerList = resp.Data;
      })
  }
  fetchReleventData(event: any) {
    const selectedConsigner = this.consignerList.find((item: { customerCode: any; }) => item.customerCode === event);
    console.log(selectedConsigner, 'selectedConsigner');
    if (selectedConsigner) {
      this.consignerCode = selectedConsigner.customerCode;
      this.selectedCustType = selectedConsigner.custType;
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
  getFastpinCode(event: any) {
    this.FastpinCode = event.target.value;
    console.log(this.FastpinCode, 'event.target.value');

    if (this.FastpinCode) {
      this.bookingService.getPincodeData(this.FastpinCode).subscribe(
        (resp) => {
          console.log('API response:', resp);
          if (resp && Array.isArray(resp.Data) && resp.Data.length > 0) {
            this.fastEntryForm.controls['Destination'].setValue(resp.Data[0].Destination_Code);
          } else {
            console.error('Invalid API response structure:', resp);
          }
        },
        (error) => {
          console.error('Error in getFastpinCode:', error);
        }
      );
    }
  }

  // handleFormSubmit(formData: any): void {
  //   this.fastEntryForm.markAllAsTouched();
  //   const tableFields = ['AwbNo', 'Destination', 'Quantity', 'actWt'];

  //   const emptyFields = tableFields.filter(field => !this.fastEntryForm.get(field).value);
  //   if (emptyFields.length > 0) {
  //     this.openSnackBar('Please fill all the required fields.', 'error-snackbar');
  //     return;
  //   }

  //   if (!this.fastEntryForm.get('Pincode').valid) {
  //     this.openSnackBar('Please enter a valid Pincode.', 'error-snackbar');
  //     return;
  //   }

  //   if (this.fastEntryForm.valid) {
  //     const selectedOriginObj = this.originList.find(item => item.originCode === formData.Origin || this.selectedOrigin);
  //     const selectedDestinationObj = this.destinationListCon.find(item => item.destinationCode === formData.Destination);

  //     const updatedFormData = {
  //       ...formData,
  //       originName: selectedOriginObj ? selectedOriginObj.originName : '',
  //       destinationName: selectedDestinationObj ? selectedDestinationObj.destinationName : '',
  //     };

  //     this.formSubmit(updatedFormData);
  //   } else {
  //     this.openSnackBar('Form is invalid.', 'error-snackbar');
  //   }
  // }

  // // Function to handle successful form submission
  // handleSuccessfulSubmission(updatedFormData: any): void {
  //   this.entryList.push(updatedFormData);
  //   this.fastEntryForm.patchValue({
  //     Shipper: '',
  //     Pincode: '',
  //     AwbNo: '',
  //     Destination: '',
  //     consignee: '',
  //     Quantity: '',
  //     actWt: '',
  //     volWt: '',
  //     Amt: ''
  //   });
  //   console.log('Entry List:', this.entryList);
  //   this.pincodeInput.nativeElement.focus();
  // }

  // formSubmit(formData: any) {
  //     const obj = {
  //       Session_LocationCode: this.sessionLocationCode,
  //       AwbNo: formData.AwbNo ,
  //       userName: '',
  //       bookDate: formData.bookDt,
  //       dispatchDate: null,
  //       customerCode: formData.Cust,
  //       consigneeName:  formData.consignee,
  //       consigneeadd1: '',
  //       consigneeadd2: '',
  //       consigneeadd3: '',
  //       consigneePin: formData.Pincode,
  //       consigneeTel: '',
  //       gstNo: '',
  //       consigneeEmail: '',
  //       consigneeState: '',
  //       consigneeCity: '',
  //       consigneeCountry: '',
  //       consigneeSave: 0,
  //       consigneeCompanyName: '',
  //       ConsigneecontactPerson: '',

  //       clientType: this.selectedCustType,
  //       billParty: 'Consignor',
  //       srNo: '',
  //       remark: '',
  //       boxPcs: '',
  //       packgeType: '',
  //       deliveryType: '',
  //       shipperCode: '',

  //       ShipperAdd1: '',
  //       ShipperAdd2: '',
  //       ShipperAdd3: '',
  //       shipperDestinationCode: '',
  //       ShipperEmail: '',
  //       ShippergstNo: '',
  //       ShipperName:  formData.Shipper || '',
  //       Shipperphone: '',
  //       Shipperpin: '',
  //       Shipperstatecode: '',
  //       DestinationCode: '',
  //       ShipperSave: 0,
  //       shipperCompanyName: '',
  //       shippercontactPerson: '',
  //       shipperCountryCode: '',

  //       KYCNo: '',
  //       KYCtype: '',
  //       KYCimage: '',

  //       productCode: formData.Product,
  //       ModeCode: formData.modeName ,
  //       originCode: formData.Origin || this.selectedOrigin,
  //       destinationCode:  formData.Destination || '',
  //       qty:  formData.Quantity || '',
  //       ActualWt:  formData.actWt || 0,
  //       VolumetricWt:  formData.volWt || 0,
  //       DelvTime: '',
  //       VendorCode1: '',
  //       VendorAwbNo1: '',
  //       VendorCode2: '',
  //       VendorAwbNo2: '',
  //       VendorCode3: '',
  //       VendorAwbNo3: '',
  //       VendorChargewt: 0,
  //       RatePerkg: 0,
  //       fovChrgs: 0,
  //       FuelCharges: 0,
  //       DocketChrgs: 0,
  //       ODAChrgs: 0,
  //       GSTPer: 0,
  //       IGSTPer: 0 ,
  //       CGSTPer: 0 ,
  //       SGSTPer: 0 ,
  //       IGST: 0,
  //       CGST: 0,
  //       SGST: 0,
  //       TotalAmt: 0,
  //       otherCharges: 0,
  //       Charges1: 0,
  //       Charges2: 0,
  //       Charges3: 0,
  //       Charges4: 0,
  //       Charges5: 0,
  //       Charges6: 0,
  //       Charges7: 0,
  //       Charges8: 0,
  //       Charges9: 0,
  //       Charges10: 0,
  //       ESSPer: 0,
  //       ESSAmt: 0,
  //       vtcChrgs: 0,
  //       ODAKM: 0,
  //       IDCPer: 0,
  //       IDCCharges: 0,
  //       CAFPer: 0,
  //       CAFCharges: 0,
  //       ensCharges: 0,
  //       scCharges: 0,
  //       hdpCharges: 0,
  //       Rate: 0,
  //       FuelPer: 0,
  //       ServiceTax: 0,
  //       CustInvoice: '',
  //       Volumetrice: '',
  //       vendorVolumetrice: '',
  //       invValue: 0,
  //       eWayBill: '',
  //       invNo : '',
  //       discountAmt: 0,
  //       transpoterType : '',
  //       vehicleType : '',
  //       driverName : '',
  //       driverMobile : '',
  //       vehicleNo : '',
  //       brockerName : '',
  //     }
  //     this.bookingService.createBooking(obj).subscribe(
  //       (response) => {
  //         if (response.Status === 1) {
  //           this.openSnackBar(response.message, 'custom-snackbar');
  //         } else {
  //           this.openSnackBar(response.message, 'error-snackbar');
  //         }
  //       },
  //       (error) => {
  //         console.error('Error in formSubmit:', error);
  //         this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
  //       }
  //     );
  // }
  handleFormSubmit(formData: any) {
    this.fastEntryForm.markAllAsTouched();
    const tableFields = [
        'AwbNo',
        'Destination',
        'Quantity',
        'actWt'
    ];

    const emptyFields = tableFields.filter(field => !this.fastEntryForm.get(field).value);

  if (emptyFields.length > 0) {
    this.openSnackBar('Please fill all the required fields.', 'error-snackbar')
      return;
  }
   // Check if Pincode is valid
   if (!this.fastEntryForm.get('Pincode').valid) {
    this.openSnackBar('Please enter a valid Pincode.', 'error-snackbar');
    return;
}
    if (this.fastEntryForm.valid) {
  const selectedOriginObj = this.originList.find(item => item.originCode === formData.Origin || this.selectedOrigin);
  const selectedDestinationObj = this.destinationListCon.find(item => item.destinationCode === formData.Destination);

  const updatedFormData = {
      ...formData,
      originName: selectedOriginObj ? selectedOriginObj.originName : '',
      destinationName: selectedDestinationObj ? selectedDestinationObj.destinationName : '',
  };
      this.formSubmit(updatedFormData).then((isSuccess) => {
          if (isSuccess) {
              this.entryList.push(updatedFormData);
              this.fastEntryForm.patchValue({
                  Shipper: '',
                  Pincode: '',
                  AwbNo: '',
                  Destination: '',
                  consignee: '',
                  Quantity: '',
                  actWt: '',
                  volWt: '',
                  Amt: ''
              });
              console.log('Entry List:', this.entryList);
              this.pincodeInput.nativeElement.focus();
          }
      });
  } else {
      this.openSnackBar('Form is invalid.', 'error-snackbar');
  }
    // if (this.fastEntryForm.valid) {
    //   const selectedOriginObj = this.originList.find(item => item.originCode === formData.Origin);
    //   const selectedDestinationObj = this.destinationListCon.find(item => item.destinationCode === formData.Destination);

    //   const updatedFormData = {
    //       ...formData,
    //       originName: selectedOriginObj ? selectedOriginObj.originName : '',
    //       destinationName: selectedDestinationObj ? selectedDestinationObj.destinationName : '',
    //   };
    //     this.entryList.push(updatedFormData);
    //     this.formSubmit(updatedFormData);

    //     this.fastEntryForm.patchValue({
    //         Pincode: '',
    //         AwbNo: '',
    //         Destination: '',
    //         consignee: '',
    //         Quantity: '',
    //         actWt: '',
    //         volWt: '',
    //         Amt: ''
    //     });
    //     console.log('Entry List:', this.entryList);
    // } else {
    //     this.openSnackBar('Form is invalid.', 'error-snackbar')
    // }
}

  formSubmit(formData: any) {
      const obj = {
        Session_LocationCode: this.sessionLocationCode,
        AwbNo: formData.AwbNo ,
        userName: '',
        bookDate: formData.bookDt,
        dispatchDate: null,
        customerCode: formData.Cust,
        consigneeName:  formData.consignee,
        consigneeadd1: '',
        consigneeadd2: '',
        consigneeadd3: '',
        consigneePin: formData.Pincode,
        consigneeTel: '',
        gstNo: '',
        consigneeEmail: '',
        consigneeState: '',
        consigneeCity: '',
        consigneeCountry: '',
        consigneeSave: 0,
        consigneeCompanyName: '',
        ConsigneecontactPerson: '',

        clientType: this.selectedCustType,
        billParty: 'Consignor',
        srNo: '',
        remark: '',
        boxPcs: '',
        packgeType: '',
        deliveryType: '',
        shipperCode: '',

        ShipperAdd1: '',
        ShipperAdd2: '',
        ShipperAdd3: '',
        shipperDestinationCode: '',
        ShipperEmail: '',
        ShippergstNo: '',
        ShipperName:  formData.Shipper || '',
        Shipperphone: '',
        Shipperpin: '',
        Shipperstatecode: '',
        DestinationCode: '',
        ShipperSave: 0,
        shipperCompanyName: '',
        shippercontactPerson: '',
        shipperCountryCode: '',

        KYCNo: '',
        KYCtype: '',
        KYCimage: '',

        productCode: formData.Product,
        ModeCode: formData.modeName ,
        originCode: formData.Origin || this.selectedOrigin,
        destinationCode:  formData.Destination || '',
        qty:  formData.Quantity || '',
        ActualWt:  formData.actWt || 0,
        VolumetricWt:  formData.volWt || 0,
        DelvTime: '',
        VendorCode1: '',
        VendorAwbNo1: '',
        VendorCode2: '',
        VendorAwbNo2: '',
        VendorCode3: '',
        VendorAwbNo3: '',
        VendorChargewt: 0,
        RatePerkg: 0,
        fovChrgs: 0,
        FuelCharges: 0,
        DocketChrgs: 0,
        ODAChrgs: 0,
        GSTPer: 0,
        IGSTPer: 0 ,
        CGSTPer: 0 ,
        SGSTPer: 0 ,
        IGST: 0,
        CGST: 0,
        SGST: 0,
        TotalAmt: 0,
        otherCharges: 0,
        Charges1: 0,
        Charges2: 0,
        Charges3: 0,
        Charges4: 0,
        Charges5: 0,
        Charges6: 0,
        Charges7: 0,
        Charges8: 0,
        Charges9: 0,
        Charges10: 0,
        ESSPer: 0,
        ESSAmt: 0,
        vtcChrgs: 0,
        ODAKM: 0,
        IDCPer: 0,
        IDCCharges: 0,
        CAFPer: 0,
        CAFCharges: 0,
        ensCharges: 0,
        scCharges: 0,
        hdpCharges: 0,
        Rate: 0,
        FuelPer: 0,
        ServiceTax: 0,
        CustInvoice: '',
        Volumetrice: '',
        vendorVolumetrice: '',
        invValue: 0,
        eWayBill: '',
        invNo : '',
        discountAmt: 0,
        transpoterType : '',
        vehicleType : '',
        driverName : '',
        driverMobile : '',
        vehicleNo : '',
        brockerName : '',
        trainFlight: '',
        trainFlightNo: '',
      }
      console.log('fform :' , obj);
      return this.httpService.post(`${environment.apiUrl}Booking/bookingCreate`, obj).then((response) => {
          if (response.Status === 1) {
            this.openSnackBar( response.message, 'custom-snackbar');
            this.fastEntryForm.reset();
            return true;
          } else {
            this.openSnackBar(response.message , 'error-snackbar')
            return false;
          }
        }).catch((error) => {
          this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
          return false;
      });
  }
  openDeleteDialog(awbNo: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '22rem',
      data: { message: 'Do you want to delete this booking?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteBooking(awbNo);
      } else {
        this.openSnackBar('Delete canceled', 'error-snackbar');
      }
    });
  }
  deleteBooking(awbNo: string): void {
    this.bookingService.deleteBooking(awbNo, 'Deleted by user', this.username).subscribe(
      (resp: any) => {
        if (resp.status === 1) {
          this.entryList = this.entryList.filter(entry => entry.AwbNo !== awbNo);
          this.openSnackBar(resp.message, 'custom-snackbar');
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      },
      (error) => {
        console.error('Error deleting booking:', error);
        this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
      }
    );
  }
}
