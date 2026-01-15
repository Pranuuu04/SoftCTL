import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'app/Branch/master/master.service';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { event } from 'jquery';

@Component({
  selector: 'app-other-mast-form',
  templateUrl: './other-mast-form.component.html',
  styleUrls: ['./other-mast-form.component.css']
})
export class OtherMastFormComponent implements OnInit {


    validationMessage: any = [];
    companyMastForm: FormGroup;
    shipperForm: FormGroup;
    shipperName = '';
    companyNameShip = '';
    contactPersonShip = '';
    contactNo = '';
    emailID = '';
    gstNoShip = '';
    pinCodeShip = '';
    address1Ship = '';
    address2Ship = '';
    // landMarkShip: string = '';
    cityNameShip: any = null;
    stateNameShip: any = null;
    countryNameShip: any = null;
    kycType = '';
    kycNumber = '';
    kycImage: any = null;

    itemData: any;
    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;


    consigneeForm: FormGroup;
    consigneeName = '';
    address1 = '';
    address2 = '';
    landMark = '';
    mobileNo = '';
    emailId = '';
    pinCode = '';
    cityName = '';
    stateName = '';
    countryName = '';
    gstNo = '';
    // selectedCustType: string = '';
    // billParty: string = '';
    remarks = '';
    serialNo = '';

    // Control flags for conditional disabling
    isRemarkChecked = true; // or false based on logic
    isSNoChecked = true;    // or false based on logic

    // Dropdown data
    cityList: any[] = [];
    stateList: any[] = [];
    countryList: any[] = [];
  customerList: any;
  sessionLocationCode: string;
  ShipperMode: any;
  shipper_Code: any;
  Consignee_Code: any;
  ConsigneeMode: any;
  lastVerifiedGSTShip: string | null = null;
  isAddressCheckedShip = false;
  shipperNameList: any;
  lastVerifiedGSTConsignee: string | null = null;
  isAddressCheckedConsignee = false;
  companyList: any;
  isGstVerified: boolean = false;
buttonLable: string = 'Submit';
 printDetailKeys: string[] = [
    'Origin', 'Destination', 'Consignee', 'Product', 'Mode', 'Pcs', 'Weight',
    'Train_Flight_No', 'RateperKg', 'FOV', 'Fuel', 'Docket', 'ESS', 'Metro',
    'VTC', 'ENS', 'SC', 'HDP', 'ODA', 'IDC', 'CAF', 'Insurance', 'Other',
    'COD', 'Charges1', 'Charges2', 'Charges3', 'Charges4', 'Charges5',
    'Charges6', 'Charges7', 'Charges8', 'Charges9', 'Charges10',
    'Bottom_RateperKG', 'Bottom_FOV', 'Bottom_Fuel', 'Bottom_Docket',
    'Bottom_ESS', 'Bottom_Metro', 'Bottom_VTC', 'Bottom_ENS', 'Bottom_SC',
    'Bottom_HDP', 'Bottom_ODA', 'Bottom_IDC', 'Bottom_CAF', 'Bottom_Insurance',
    'Bottom_Other', 'Bottom_COD', 'Bottom_Charges1', 'Bottom_Charges2',
    'Bottom_Charges3', 'Bottom_Charges4', 'Bottom_Charges5', 'Bottom_Charges6',
    'Bottom_Charges7', 'Bottom_Charges8', 'Bottom_Charges9', 'Bottom_Charges10',
    'shipperDetails', 'stamp', 'PageWiseTotal', 'AllPageHeader'
  ];
  companyMode: any;
  Company_Code: any;
// logoPreview: string | ArrayBuffer | null = null;
// stampPreview: string | ArrayBuffer | null = null;
selectedLogoFile: File | null = null;
selectedStampFile: File | null = null;

    constructor(private _mdr: MatDialogRef<OtherMastFormComponent>,
                public httpService: HttpService,
                public formBuilder: FormBuilder,
                private AllService: AllServicesService,
                public masterService: MasterService,
                private http: HttpClient,
                public bookingService: BookingService,
                private snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: any
                ) {

                    if (data?.ShipperData) {
                      this.shipper_Code = data.ShipperData.shipper_Code;
                      this.ShipperMode = data.ShipperMode;
                    };
                     if (data?.ConsigneeData) {
                      this.Consignee_Code = data.ConsigneeData.Consignee_Code;
                      this.ConsigneeMode = data.ConsigneeMode;
                    }
                      if (data?.companyData) {
                      this.Company_Code = data.companyData.Company_Code;
                      this.companyMode = data.companyMode;
                    }
                }

    ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');
 const gstFlag = localStorage.getItem('GstVerify');
    this.isGstVerified = gstFlag === '1';
       this.masterService.getCustomerData(this.sessionLocationCode).subscribe((data: any) => {
      this.customerList = data.Data;
    });
      this.AllService.getDestinationDataa().subscribe((res: any) => {
        this.cityList = res.Data;
      });
if (this.companyMode) {
  this.buttonLable = 'Update';
} else {
  this.buttonLable = 'Submit';
}

     this.getState();
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

      this.shipperForm = this.formBuilder.group({
        shipperName: new FormControl('', Validators.compose([Validators.required])),
        companyNameShip: new FormControl('', Validators.compose([])),
        contactPersonShip: new FormControl('', Validators.compose([])),
        contactNo: new FormControl('', Validators.compose([])),
        emailID: new FormControl('', Validators.compose([])),
        gstNoShip: new FormControl('', Validators.compose([])),
        pinCodeShip: new FormControl('', Validators.compose([])),
        address1Ship: new FormControl('', Validators.compose([Validators.required])),
        address2Ship: new FormControl('', Validators.compose([Validators.required])),
        landMarkShip: new FormControl('', Validators.compose([])),
        cityNameShip: new FormControl('', Validators.compose([])),
        stateNameShip:  new FormControl('', Validators.compose([Validators.required])),
        countryNameShip: new FormControl('', Validators.compose([])),
        kycType: new FormControl('', Validators.compose([])),
        kycNumber : new FormControl('', Validators.compose([])),
        kycImage: new FormControl('', Validators.compose([])),
        shipperCustomer: new FormControl('', Validators.compose([Validators.required])),
      });
    this.shipperData();
      this.consigneeForm = this.formBuilder.group({
        consigneeName:  new FormControl('', Validators.compose([Validators.required])),
        companyName:  new FormControl('', Validators.compose([])),
        contactPerson:   new FormControl('', Validators.compose([])),
        address1:  new FormControl('', Validators.compose([Validators.required])),
        address2:  new FormControl('', Validators.compose([Validators.required])),
        landMark:  new FormControl('', Validators.compose([])),
        mobileNo: new FormControl('', Validators.compose([ Validators.pattern(/^[0-9]{10}$/)])),
        emailId: new FormControl('', Validators.compose([])),
        pinCode:  new FormControl('', Validators.compose([])),
        cityName:  new FormControl('', Validators.compose([])),
        stateName:  new FormControl('', Validators.compose([Validators.required])),
        countryName:  new FormControl('', Validators.compose([])),
        gstNo:  new FormControl('', Validators.compose([])),
        // custType:  new FormControl('', Validators.compose([Validators.required])),
        // billParty:  new FormControl('', Validators.compose([Validators.required])),
        // remark:  new FormControl('', Validators.compose([])),
        // srNo:  new FormControl('', Validators.compose([])),
        consigneeCustomer:  new FormControl('', Validators.compose([Validators.required])),
      });
       this.companyMastForm = this.formBuilder.group({
      companyMastName: ['', Validators.required],
      companyMastAdd1: [''],
      companyMastAdd2: [''],
      companyMastAdd3: [''],
      // companyMastCity: [''],
      companyMastPin: [''],
      // companyMastState: [''],
      companyMastGst: ['', Validators.pattern(/^[A-Z0-9]{15}$/)],
      companyMastMobile: ['', Validators.pattern(/^[0-9]{10}$/)],
      companyMastEmail: [''],
      companyMastLogo: [''],
      companyMastStamp: [''],
      companyMastWeb: [''],
      printDetails: this.formBuilder.array(this.printDetailKeys.map(() => new FormControl(false)),
    this.validateAtLeastOneChecked())
    });
       this.AllService.getCountryData().subscribe((res: any) => {
        this.countryList = res.Data;
    if (res.Data.length === 1) {
      const singleCountryCode = this.countryList[0].countryCode;
   if (!this.shipperForm.get('countryNameShip')?.value) {
        this.shipperForm.patchValue({ countryNameShip: singleCountryCode });
      }

      if (!this.consigneeForm.get('countryName')?.value) {
        this.consigneeForm.patchValue({ countryName: singleCountryCode });
      }
      // this.shipperForm.patchValue({
      //   countryNameShip: singleCountryCode
      // });

      // this.consigneeForm.patchValue({
      //   countryName: singleCountryCode
      // });
    }
      });
      this.ConsigneeData();
      this.getCompany();
      this.companyData();
      // this.getPinCode(event);

    }
    get printDetailsFormArray() {
    return this.companyMastForm.get('printDetails') as FormArray;
  }
  validateAtLeastOneChecked(): any {
  return (formArray: FormArray) => {
    const isAtLeastOneChecked = formArray.controls.some(control => control.value === true);
    return isAtLeastOneChecked ? null : { required: true };
  };
}
   getCompany() {
    // tslint:disable-next-line:max-line-length
     this.httpService.get(`${environment.apiUrl}Booking/getCompany`).then((res: any) => {
        this.companyList = res.Data;
       })
    }
getPinCode(event: any) {
  this.pinCode = event.target.value;

  if (this.pinCode) {
    this.bookingService.getPincodeData(this.pinCode).subscribe(
      (resp) => {
        const data = resp.Data[0];
        if (data) {
          this.consigneeForm.controls.cityName.setValue(data.Destination_Code);
          this.consigneeForm.controls.stateName.setValue(data.State_Code);
          this.consigneeForm.controls.countryName.setValue(data.country_code);
        }
      },
      (error) => {
        console.error('Error in getPinCode:', error);
      }
    );
  }
}
    getState() {
        this.http.get(`${environment.apiUrl}Booking/getState`).subscribe((res: any) => {
           if (res.status === 1) {
            this.stateList = res.Data;
           } else {
              this.openSnackBar(res.message , 'error-snackbar');
           }
        });
      }

    // tslint:disable-next-line:no-shadowed-variable
    // getPinCode(event: any): void {
    //   this.pinCode = event.target.value;
    //   if (this.pinCode) {
    //     this.bookingService.getPincodeData(this.pinCode).subscribe(
    //       (response: any) => {
    //           this.shipperForm.controls.cityName.setValue(response.Data[0].Destination_Code);
    //       },
    //       (error) => {
    //         console.error('Error fetching pincode data:', error);
    //       }
    //     );
    //   }
    // }


    formSubmitShipper(formData: any) {
      if (this.shipperForm.valid) {
      const obj = {
    operation:  this.ShipperMode !== 'edit' ? 'CreateShipper' : 'UpdateShipper' ,
    shipperCode:  this.ShipperMode === 'edit' ? this.shipper_Code : '',
    shipperName: formData.shipperName ,
    shipperCompanyName: formData.companyNameShip,
    shipperContactPerson: formData.contactPersonShip,
    shipperStateCode: formData.stateNameShip,
    shipperAdd: formData.address1Ship,
    shipperAdd2: formData.address2Ship,
    shipperAdd3: formData.landMarkShip,
    shipperPin: formData.pinCodeShip,
    shipperPhone: formData.contactNo,
    shipperCountryCode: formData.countryNameShip,
    shipperDestinationCode: formData.cityNameShip,
    shipperGSTNo: formData.gstNoShip,
    customerCode: formData.shipperCustomer,
    shipperEmail: formData.emailID,
    KYCNo: formData.kycNumber,
    KYCtype: formData.kycType,
    KYCimage: formData.kycImage

      }
      console.log(obj, 'hello');
          this.masterService.CreateAndUpdateShipper(obj).subscribe({
      next: (response: any) => {
        if (response.status === 1) {
          this.openSnackBar(response.message, 'custom-snackbar');
          this.CloseDialog();
        } else {
          this.openSnackBar(response.message, 'error-snackbar');
        }
      },
      error: (error) => {
        console.error('Error adding shipper:', error);
      }
    });
    } else {
      Object.keys(this.shipperForm.controls).forEach((field) => {
        const control = this.shipperForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    }

// updateShipper(){
//   if (this.shipperForm.valid) {



//   }
//   else {
//     Object.keys(this.shipperForm.controls).forEach((field) => {
//       const control = this.shipperForm.get(field);
//       control.markAsTouched({ onlySelf: true });
//     });
//   }
// }

gstVerify() {
  const gstNo = this.shipperForm.value.gstNoShip;

  if (this.lastVerifiedGSTShip === gstNo) {
    this.openSnackBar('GST already verified!', 'custom-snackbar');
    return;
  }

  if (!gstNo || gstNo.length !== 15) {
    this.openSnackBar('Please enter a valid 15-digit GST number', 'error-snackbar');
    return;
  }

  this.bookingService.verifyGSTNumber(gstNo).subscribe(
    (resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');

        if (resp.data && resp.data.pradr && resp.data.pradr.addr) {
          const res = resp.data.pradr.addr;

          const address1Parts = [res.bnm, res.flno, res.bno].filter(Boolean);
          const address1 = address1Parts.join(', ');

          const address2Parts = [res.st, res.locality].filter(Boolean);
          const address2 = address2Parts.join(', ');

          const cityItem = this.cityList.find(item =>
            item.destinationName.toLowerCase() === res.loc.toLowerCase()
          );
          const stateItem = this.stateList.find(item =>
            item.stateName.toLowerCase() === res.stcd.toLowerCase()
          );

          this.shipperForm.patchValue({
            shipperName: resp.data.tradeNam,
            contactPersonShip: resp.data.lgnm,
            gstNoShip: gstNo,
            address1Ship: address1,
            address2Ship: address2,
            landMarkShip: res.landMark,
            pinCodeShip: res.pncd,
            cityNameShip: cityItem ? cityItem.destinationCode : null,
            stateNameShip: stateItem ? stateItem.stateCode : null
          });

          this.isAddressCheckedShip = true;
          this.lastVerifiedGSTShip = gstNo;
        }
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
        this.shipperForm.patchValue({
          companyNameShip: '',
          contactPersonShip: '',
          gstNoShip: '',
          address1Ship: '',
          address2Ship: '',
          landMarkShip: '',
          pinCodeShip: '',
          cityNameShip: null,
          stateNameShip: null
        });
        this.lastVerifiedGSTShip = null;
      }
    },
    (err) => {
      console.error('GST verification failed', err);
      this.openSnackBar('Error verifying GST number', 'error-snackbar');
    }
  );
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
shipperData() {
  if (!this.shipper_Code) { return; }

  this.masterService.DeleteShipperConsig('getByShipperCode', this.shipper_Code).subscribe((resp: any) => {
    if (resp) {
      const data = resp.Data[0];

        this.shipperForm.patchValue({
        shipperName: data.shipper_Name,
        companyNameShip: data.CompanyCode,
        contactPersonShip: data.contactPerson,
        contactNo: data.phone,
        emailID: data.Email,
        gstNoShip: data.GSTNo,
        pinCodeShip: data.pin,
        address1Ship: data.Add1,
        address2Ship: data.Add2,
        landMarkShip: data.Add3,
        cityNameShip: data.Destination_Code,
        stateNameShip: data.State_Code,
        countryNameShip: data.Country_Code,
        kycType: data.KYCtype,
        kycNumber: data.KYCNo,
        kycImage: data.KYC_image,
        shipperCustomer: data.Customer_Code
        });
    }
  });
}

gstVerifyConsignee() {
  const gstNo = this.consigneeForm.value.gstNo;

  if (this.lastVerifiedGSTConsignee === gstNo) {
    this.openSnackBar('GST already verified!', 'custom-snackbar');
    return;
  }

  if (!gstNo || gstNo.length !== 15) {
    this.openSnackBar('Please enter a valid 15-digit GST number', 'error-snackbar');
    return;
  }

  this.bookingService.verifyGSTNumber(gstNo).subscribe(
    (resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');

        if (resp.data && resp.data.pradr && resp.data.pradr.addr) {
          const res = resp.data.pradr.addr;

          const address1Parts = [res.bnm, res.flno, res.bno].filter(Boolean);
          const address1 = address1Parts.join(', ');

          const address2Parts = [res.st, res.locality].filter(Boolean);
          const address2 = address2Parts.join(', ');

          const cityItem = this.cityList.find(item =>
            item.destinationName.toLowerCase() === res.loc.toLowerCase()
          );
          const stateItem = this.stateList.find(item =>
            item.stateName.toLowerCase() === res.stcd.toLowerCase()
          );

          this.consigneeForm.patchValue({
            consigneeName: resp.data.tradeNam,
            contactPerson: resp.data.lgnm,
            gstNo: gstNo,
            address1: address1,
            address2: address2,
            landMark: res.landMark,
            pinCode: res.pncd,
            cityName: cityItem ? cityItem.destinationCode : null,
            stateName: stateItem ? stateItem.stateCode : null
          });

          this.isAddressCheckedConsignee = true;
          this.lastVerifiedGSTConsignee = gstNo;
        }
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
        this.consigneeForm.patchValue({
          consigneeName: '',
          contactPerson: '',
          gstNo: '',
          address1: '',
          address2: '',
          landMark: '',
          pinCode: '',
          cityName: null,
          stateName: null
        });
        this.lastVerifiedGSTConsignee = null;
      }
    },
    (err) => {
      console.error('GST verification failed', err);
      this.openSnackBar('Error verifying GST number', 'error-snackbar');
    }
  );
}

    formSubmitConsignee(formData: any) {
      if (this.consigneeForm.valid) {
           const obj = {
            operation:  this.ConsigneeMode !== 'edit' ? 'CreateConsignee' : 'UpdateConsignee' ,
            consigneeCode:  this.ConsigneeMode === 'edit' ? this.Consignee_Code : '',
            consigneeName: formData.consigneeName,
            consigneeCompanyName: formData.companyName,
            consigneecontactPerson: formData.contactPerson,
            customerCode: formData.consigneeCustomer,
            consigneeadd1: formData.address1,
            consigneeadd2: formData.address2,
            consigneeadd3: formData.landMark,
            consigneePin: formData.pinCode,
            consigneeCity: formData.cityName,
            consigneeState: formData.stateName,
            consigneeCountry: formData.countryName,
            consigneeTel: formData.mobileNo,
            consigneeEmail: formData.emailId,
            gstNo: formData.gstNo
      }
      console.log(obj, 'hello');
          this.masterService.CreateAndUpdateConsignee(obj).subscribe({
      next: (response: any) => {
        if (response.status === 1) {
          this.openSnackBar(response.message, 'custom-snackbar');
          this.CloseDialog();
        } else {
          this.openSnackBar(response.message, 'error-snackbar');
        }
      },
      error: (error) => {
        console.error('Error adding shipper:', error);
      }
    });
      } else {
        Object.keys(this.consigneeForm.controls).forEach((field) => {
          const control = this.consigneeForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      }
    }

  ConsigneeData() {
  if (!this.Consignee_Code) { return; }

  this.masterService.DeleteShipperConsig('getByConsigneeCode', this.Consignee_Code).subscribe((resp: any) => {
    if (resp) {
      const data = resp.Data[0];

        this.consigneeForm.patchValue({
          consigneeName: data.Consignee_Name,
            companyName: data.CompanyCode,
            contactPerson: data.contactPerson,
            consigneeCustomer: data.Customer_Code,
            address1: data.Consignee_add1,
            address2: data.Consignee_add2,
            landMark: data.Consignee_add3,
            pinCode: data.Consignee_Pin,
            cityName: data.Destination_Code,
            stateName: data.stateCode,
            countryName: data.countryCode,
            mobileNo: data.Consignee_Tel,
            emailId: data.Consignee_Email,
            gstNo: data.GSTNo
        });
    }
  });
}
onFileSelected(event: any, type: 'logo' | 'stamp'): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) { return; }

  // ✅ File size range in bytes (20KB – 50KB)
  const minSize = 20 * 1024; // 20 KB
  const maxSize = 50 * 1024; // 50 KB

  if (file.size < minSize) {
    this.openSnackBar('Image size must be at least 20 KB.', 'error-snackbar');
    input.value = '';
    return;
  }

  if (file.size > maxSize) {
    this.openSnackBar('Image size must not exceed 50 KB.', 'error-snackbar');
    input.value = '';
    return;
  }

  // ✅ Allow only PNG or JPG
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    this.openSnackBar('Only JPG or PNG images are allowed.', 'error-snackbar');
    return;
  }

  // ✅ Read file as Base64
  const reader = new FileReader();
  reader.onload = () => {
    if (type === 'logo') {
      this.companyMastForm.patchValue({ companyMastLogo: reader.result });
      this.selectedLogoFile = file;
    } else {
      this.companyMastForm.patchValue({ companyMastStamp: reader.result });
      this.selectedStampFile = file;
    }
  };
  reader.readAsDataURL(file);
}


formSubmitCompanyMast(formData: any) {
  if (this.companyMastForm.valid) {
    const operation = this.companyMode !== 'edit' ? 'CreateCompany' : 'UpdateCompany';

    const printDetailControls = this.companyMastForm.get('printDetails') as FormArray;
    const printDetailsObj: any = {};
    this.printDetailKeys.forEach((key, index) => {
      printDetailsObj[key] = printDetailControls.at(index).value ? 1 : 0;
    });

    const obj = {
      inputName: operation,
      companyCode: this.companyMode === 'edit' ? this.Company_Code : '',
      companyName: formData.companyMastName,
      locationCode: this.sessionLocationCode,
      add1: formData.companyMastAdd1,
      add2: formData.companyMastAdd2,
      add3: formData.companyMastAdd3,
      pincode: formData.companyMastPin,
      mobile: formData.companyMastMobile,
      email: formData.companyMastEmail,
      gst: formData.companyMastGst,
        logo: formData.companyMastLogo?.replace(/^data:image\/[a-z]+;base64,/, '') || '', // remove prefix before sending
  stamp: formData.companyMastStamp?.replace(/^data:image\/[a-z]+;base64,/, '') || '',

      web: formData.companyMastWeb,
      remark: formData.companyMastRemark,
      comLoc: 'All',
      printDetails: [printDetailsObj]
    };

    console.log('Company Object:', obj);

    this.masterService.CreateAndUpdateCompany(obj).subscribe({
      next: (response: any) => {
        if (response.status === 1) {
          this.openSnackBar(response.message, 'custom-snackbar');
          this.CloseDialog();
        } else {
          this.openSnackBar(response.message, 'error-snackbar');
        }
      },
      error: (error) => {
        console.error('Error creating/updating company:', error);
      }
    });
  } else {
    Object.keys(this.companyMastForm.controls).forEach((field) => {
      const control = this.companyMastForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
companyData() {
  if (!this.Company_Code) { return; }

  this.masterService
    .getCompany(this.Company_Code)
    .subscribe((resp: any) => {
      if (resp) {
        const data = resp.Data.companyDetails[0];
        const PrintData = resp.Data.printDetails[0];
      // const city = this.cityList.find(item => item.destinationName === data.Destination_Name);
      // const state = this.stateList.find(item => item.stateName === data.State_Name);
      // const country = this.countryList.find(item => item.countryName === data.Country_Name);
        this.companyMastForm.patchValue({
            companyMastName: data.Company_Name || '',
            companyMastAdd1: data.Add1 || '',
            companyMastAdd2: data.Add2 || '',
            companyMastAdd3: data.Add3 || '',
            // companyMastCity: city?.destinationCode || '',
            companyMastPin: data.Pincode || '',
            // companyMastState: state?.stateCode || '',
            companyMastGst: data.GST || '',
            companyMastMobile: data.Mobile || '',
            companyMastEmail: data.Email || '',
            companyMastLogo: data.LOGO || '',
            companyMastStamp: data.STAMP || '',
            companyMastWeb: data.Web || ''
        });
        // this.logoPreview = data.LOGO || null;
        // if (PrintData) {
        //   const detailsArray = this.companyMastForm.get('printDetails') as FormArray;
        //   PrintData.forEach((val: boolean, index: number) => {
        //     detailsArray.at(index).setValue(val);
        //   });
        // }
 if (PrintData) {
        const detailsArray = this.companyMastForm.get('printDetails') as FormArray;
        this.printDetailKeys.forEach((key, index) => {
          const value = PrintData.hasOwnProperty(key) && PrintData[key] === 1;
          detailsArray.at(index).setValue(value);
        });
      }
        // Change button label to Update
        // this.buttonLable = 'Update';
      }
    });
}


  fileChangeEvent(fileInput: any) {
  this.imageError = null;
  if (fileInput.target.files && fileInput.target.files[0]) {
    const max_size = 20971520;
    const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
    const max_height = 15200;
    const max_width = 25600;

    const file = fileInput.target.files[0];

    if (file.size > max_size) {
      this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
      return;
    }

    if (!allowed_types.includes(file.type)) {
      this.imageError = 'Only Images are allowed (JPG | PNG)';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {
        const img_height = rs.currentTarget['height'];
        const img_width = rs.currentTarget['width'];

        if (img_height > max_height || img_width > max_width) {
          this.imageError = `Maximum dimensions allowed ${max_height}*${max_width}px`;
          return;
        } else {
          const imgBase64Path = e.target.result;
          this.shipperForm.get('kycImage')?.setValue(imgBase64Path); // ✅ Set base64 to form
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;
        }
      };
    };
    reader.readAsDataURL(file);
  }
}


  openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  CloseDialog() {
    this._mdr.close(false);
  }



}
