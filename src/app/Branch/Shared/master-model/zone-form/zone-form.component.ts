import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'app/Branch/master/master.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-zone-form',
  templateUrl: './zone-form.component.html',
  styleUrls: ['./zone-form.component.css']
})
export class ZoneFormComponent implements OnInit {
  // tslint:disable-next-line:no-trailing-whitespace

  validationMessage: any;
  zoneForm: FormGroup;
  countryForm: FormGroup;
  stateForm: FormGroup;
  pinCodeForm: FormGroup;
  destinationForm: FormGroup;
  courierForm: FormGroup;
  prefixForm: FormGroup;
  branchMastForm: FormGroup;
  CoCourierForm: FormGroup;
  listData: any;
  zoneCode: any;
  zoneName: any;
  mode: any;
  countryMode: any;
  countryData: any;
  countryCode: any;
  countryName: any;
  stateCode: any;
  stateName: any;
  stateMode: any;
  stateData: any;
  destinationMode: any;
  destinationData: any;
  destinationName: any;
  destinationCode: any;
  destinationList: any;
  selectedDestination: any;
  destDestinationName: any;
  destDestinationCode: any;
  destZoneName: any;
  destStateName: any;
  destCountryName: any;
  destManifest: any;
  destDeliveryHours: any;
  destPodHours: any;
  destProductType: any;
  zoneList: any;
  stateList: any;
  countryList: any;
  vendorNames: any;
  pinCodeMode: any;
 courierBoyMode: any;
  courierBoyData: any;
  courierBoyName: any;
  courierBoyCode: any;
  courierBoyMobNo: any;
  Location: any;
  Password: any;
  prefixMode: any;
  prefixData: any;
  prefixCode: any;
  prefixName: any;
  branchMastMode: any;
  branchMastData: any;
  branchCode: any;
  productTypeList = [
    { value: 'Domestic', name: 'Domestic' },
    { value: 'International', name: 'International' },
    { value: 'Intracity', name: 'Intracity' },
  ];

  odaTypeList = [
    { value: 'oda', name: 'ODA' },
    { value: 'serviceable', name: 'SERVICEABLE' },
  ];

  pinCodeTypeList = [
    { value: 'delivery', name: 'Delivery' },
    { value: 'pickup', name: 'Pick-UP' },
    { value: 'delivery&pickup', name: 'Delivery & Pick-UP' },
  ];
  pinCodeData: any;
  Area: any;
  pinCodeCountry: any;
  pinCodeCity: any;
  Kilometer: any;
  pinCodeOda: any;
  Pincode: any;
  pinCodeType: any;
  pinCodeState: any;
  pinCodeVendor: any;
  branchList: any;
  buttonLable: string;
  DepartmentData: any;
  CocourierMode: any;
  CocourierData: any;


  constructor(private _mdr: MatDialogRef<ZoneFormComponent>,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              public masterService: MasterService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: {
                pinCodeMode: any;
                pinCodeData: any;
                destinationMode: any;
                destinationData: any;
                stateMode: any;
                stateData: any;
                countryData: any;
                modeData: any;
                countryMode: any;
                courierBoyMode: any;
                courierBoyData: any;
                prefixMode: any;
                prefixData: any;
                branchMastMode: any;
                branchMastData: any;
                CocourierMode: any;
                CocourierData: any;
                zoneData: any; action: string }) {
                if (data.zoneData || data.countryData || data.stateData || data.destinationData || data.pinCodeData || data.courierBoyData
                  || data.prefixData || data.branchMastData || data.CocourierData ) {
                  this.mode = data.modeData;
                  this.stateMode = data.stateMode;
                  this.pinCodeMode = data.pinCodeMode;
                  this.pinCodeData = data.pinCodeData;
                  this.countryMode = data.countryMode;
                  this.destinationMode = data.destinationMode;
                  this.prefixMode = data.prefixMode;
                  this.prefixData = data.prefixData;
                  this.courierBoyMode = data.courierBoyMode;
                  this.courierBoyData = data.courierBoyData;
                  this.branchMastMode = data.branchMastMode;
                  this.branchMastData = data.branchMastData;
                  this.CocourierMode = data.CocourierMode;
                  this.CocourierData = data.CocourierData;

                  this.destinationData = data.destinationData;
                  this.destCountryName = this.destinationData?.Country_Code
                  this.destDestinationCode = this.destinationData?.Destination_Code
                  this.destDeliveryHours = this.destinationData?.Destination_DHours
                  this.destManifest = this.destinationData?.Destination_Manifest
                  this.destDestinationName = this.destinationData?.Destination_Name;

                  this.destPodHours = this.destinationData?.Destination_PHours
                  this.destProductType = this.destinationData?.Product_Type
                  this.destStateName = this.destinationData?.State_Code
                  this.destZoneName = this.destinationData?.Zone_Code

                  this.listData = data.zoneData;
                  this.countryData = data.countryData;
                  this.stateData = data.stateData;
                  this.zoneCode = this.listData?.Zone_Code;
                  this.zoneName = this.listData?.Zone_Name;
                  this.countryCode = this.countryData?.Country_Code;
                  this.countryName = this.countryData?.Country_Name;
                  this.stateName = this.stateData?.State_Name;
                  this.stateCode = this.stateData?.State_Code;

                   this.Area = this.pinCodeData?.Area_Name;
                   this.pinCodeCountry = this.pinCodeData?.Country_Name;
                   this.pinCodeCity = this.pinCodeData?.Destination_Name;
                   this.Kilometer = this.pinCodeData?.KM;
                   this.pinCodeOda = this.pinCodeData?.ODA_OPA;
                   this.Pincode = this.pinCodeData?.Pincode;
                   this.pinCodeType = this.pinCodeData?.PincodeType;
                   this.pinCodeState = this.pinCodeData?.State_Name;
                   this.pinCodeVendor = this.pinCodeData?.Vendor_Name;

                   this.courierBoyCode = this.courierBoyData?.Employee_Code;
                   this.courierBoyName = this.courierBoyData?.Employee_Name;
                   this.courierBoyMobNo = this.courierBoyData?.Employee_Mobile;
                   this.Location = this.courierBoyData?.LOCATION_CODE;
                   this.Password = this.courierBoyData?.Password;
                  //  this.Department = this.courierBoyData?.Department_code;

                   this.prefixCode = this.prefixData?.Prefix_code;
                   this.prefixName = this.prefixData?.Prefix_name;

                   this.branchCode = this.branchMastData?.Location_Code;
                }
               }

  ngOnInit(): void {
      this.buttonLable = this.branchMastMode !== 'edit' ? 'Submit' : 'Update';
      // this.buttonLable = this.CocourierMode !== 'edit' ? 'Submit' : 'Update';
if (this.CocourierMode === 'edit' && this.CocourierData?.Vendor_Code) {
    this.getVendorData(this.CocourierData.Vendor_Code);
  }
      this.validationMessage = {
        zoneCode: [ {type: 'required' , message: 'Please Enter Zone Code.'} ],
        zoneName: [ {type: 'required' , message: 'Please Enter Zone Name.'} ],
        countryCode: [ {type: 'required' , message: 'Please Enter Country Code.'} ],
        countryName: [ {type: 'required' , message: 'Please Enter Country Name.'} ],
        stateCode: [ {type: 'required' , message: 'Please Enter State Code.'} ],
        stateName: [ {type: 'required' , message: 'Please Enter State Name.'} ],
        destinationCode: [ {type: 'required' , message: 'Please Enter Destination Code.'} ],
        destinationName: [ {type: 'required' , message: 'Please Enter Destination Name.'} ],
        destDestinationCode: [ {type: 'required' , message: 'Please Enter Destination Code.'} ],
        destDestinationName: [ {type: 'required' , message: 'Please Enter Destination Name.'} ],
        destZoneName: [ {type: 'required' , message: 'Please select Destination Zone Code.'} ],
        destStateName: [ {type: 'required' , message: 'Please select Destination state Name.'} ],
        destCountryName: [ {type: 'required' , message: 'Please select Destination Country Code.'} ],
        destManifest: [ {type: 'required' , message: 'Please select Destination Manifest Code.'} ],
        destDeliveryHours: [ {type: 'required' , message: 'Please Enter Zone Code.'} ],
        destPodHours: [ {type: 'required' , message: 'Please Enter Zone Code.'} ],
        destProductType: [ {type: 'required' , message: 'Please select Destination product Type.'} ],
        Area: [ {type: 'required' , message: 'Please Enter Area Name.'} ],
        pinCodeCountry: [ {type: 'required' , message: 'Please select Country Name.'} ],
        pinCodeCity: [ {type: 'required' , message: 'Please select City Name.'} ],
        Kilometer: [ {type: 'required' , message: 'Please Enter Kilometer.'} ],
        pinCodeOda: [ {type: 'required' , message: 'Please select ODA/ServiceAble Type.'} ],
        Pincode: [ {type: 'required' , message: 'Please Enter Pincode.'} ],
        pinCodeType: [ {type: 'required' , message: 'Please select Pincode Type.'} ],
        pinCodeState: [ {type: 'required' , message: 'Please select State.'} ],
        pinCodeVendor: [ {type: 'required' , message: 'Please select Vendor.'} ],
      }

      this.zoneForm = this.formBuilder.group({
        zoneCode: new FormControl('', Validators.compose([ Validators.required ])),
        zoneName: new FormControl('', Validators.compose([ Validators.required ])),
      });

      this.countryForm = this.formBuilder.group({
        countryCode: new FormControl('', Validators.compose([ Validators.required ])),
        countryName: new FormControl('', Validators.compose([ Validators.required ])),
      });

      this.stateForm = this.formBuilder.group({
        stateCode: new FormControl('', Validators.compose([ Validators.required ])),
        stateName: new FormControl('', Validators.compose([ Validators.required ])),
      });

      this.pinCodeForm = this.formBuilder.group({
        Area: new FormControl('', Validators.compose([ Validators.required ])),
        pinCodeCountry: new FormControl('', Validators.compose([ Validators.required ])),
        pinCodeCity: new FormControl('', Validators.compose([ Validators.required ])),
        Kilometer: new FormControl('', Validators.compose([])),
        pinCodeOda: new FormControl('', Validators.compose([])),
        Pincode: new FormControl('', Validators.compose([ Validators.required ])),
        pinCodeType: new FormControl('', Validators.compose([])),
        pinCodeState: new FormControl('', Validators.compose([ Validators.required ])),
        pinCodeVendor: new FormControl('', Validators.compose([ Validators.required ])),
      });

      this.destinationForm = this.formBuilder.group({
        destDestinationName: new FormControl('', Validators.compose([ Validators.required ])),
        destDestinationCode: new FormControl('', Validators.compose([ Validators.required ])),
        destZoneName: new FormControl('', Validators.compose([ Validators.required ])),
        destStateName: new FormControl('', Validators.compose([ Validators.required ])),
        destCountryName: new FormControl('', Validators.compose([ Validators.required ])),
        destManifest: new FormControl('', Validators.compose([])),
        destDeliveryHours: new FormControl('', Validators.compose([])),
        destPodHours: new FormControl('', Validators.compose([])),
        destProductType: new FormControl('', Validators.compose([ Validators.required ])),
      })


      this.courierForm = this.formBuilder.group({
        courierBoyName: new FormControl('', Validators.compose([ Validators.required ])),
        courierBoyMobNo: new FormControl('', Validators.compose([ Validators.required ])),
        Location: new FormControl(this.courierBoyData?.LOCATION_CODE || '', Validators.compose([ Validators.required ])),
        empDept: new FormControl(this.courierBoyData?.Department_code || '', Validators.compose([ Validators.required ])),
        Password: new FormControl('', Validators.compose([ Validators.required ])),
      })

        this.prefixForm = this.formBuilder.group({
        prefixCode: new FormControl('', Validators.compose([ Validators.required ])),
        prefixName: new FormControl('', Validators.compose([ Validators.required ])),
      });
      this.branchMastForm = this.formBuilder.group({
        branchMastCode: [''],
        branchMastAdd1: [''],
        branchMastAdd2: [''],
        branchMastAdd3: [''],
        branchMaststartNo: ['', Validators.required],
        branchMastCity: ['', Validators.required],
        branchMastState: ['', Validators.required],
        branchMastPin: [''],
        branchMastTel: [''],
        branchMastStock: ['No'],
        branchMastName: ['', Validators.required],
        branchMastEmail: [''],
        branchMastWeb: [''],
        branchMastGst: [''],
        branchMastHsn: [''],
        branchMastAccNo: [''],
        branchMastBank: [''],
        branchMastIfsc: [''],
        branchMastBranch: [''],
        branchConnecting: [''],
        manifestStock: [0],
        dispatchStock: [0],
        drsStock: [0],
      })
      this.CoCourierForm = this.formBuilder.group({
      CocouirerCode: ['', [Validators.required, Validators.minLength(2)]],
      CocouirerName: ['', [Validators.required]],
      CocouirerContper: [''],
      CocouirerAdd: [''],
      CocouirerPin: [''],
      CocouirerTel: [''],
      CocouirerMobNo: [''],
      CocouirerEmail: [''],
      CocouirerClientFuel: [''],
      CocouirerFuel: [''],
      CocouirerWeb: [''],
      CocouirerGST: ['No'],
      CocouirerGstType: ['Mode'],
      CocouirerGstper: [''],
      SMS: [false],
      'E-Mail': [false],
      Fax: [false]
      })
      this.loadDestination();
      this.loadZone();
      this.loadState();
      this.loadCountry();
      this.loadVendorData();
      this.loadBranch();
      this.getBranchMastData();
      this.getDepartmentData();
  }


  async loadZone() {
    try {
      const resp = await this.masterService.getZones().toPromise();
      this.zoneList = resp.Data;
    } catch (error) {
      console.error('Error in loadZone:', error);
    }
  }

  async loadState() {
    try {
      const resp = await this.masterService.getStates().toPromise();
      this.stateList = resp.Data;
    } catch (error) {
      console.error('Error in loadState:', error);
    }
  }
 async loadBranch() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Booking/getBranch`);
      this.branchList = resp.Data;
    } catch (error) {
      throw error;
    }
  }
  async loadCountry() {
    try {
      const resp = await this.masterService.getCountries().toPromise();
      this.countryList = resp.Data;
    } catch (error) {
      console.error('Error in loadCountry:', error);
    }
  }

  async loadDestination() {
    try {
      const resp = await this.masterService.getDestinations().toPromise();
      this.destinationList = resp.Data;
    } catch (error) {
      console.error('Error in loadDestination:', error);
    }
  }

  async loadVendorData() {
    try {
      const resp = await this.masterService.getVendors().toPromise();
      this.vendorNames = resp.Data;
    } catch (error) {
      console.error('Error in loadVendorData:', error);
    }
  }
getDepartmentData() {
  this.httpService.get(`${environment.apiUrl}Permissions/getDepartment`).then((resp) => {
    this.DepartmentData = resp.Data ;
  });
}
// onDestinationChange(selected: any) {
//   if (selected) {
//     this.branchMastForm.patchValue({
//       branchMastCode: selected.destinationCode
//     });
//   } else {
//     this.branchMastForm.patchValue({
//       branchMastCode: ''
//     });
//   }
// }
onDestinationChange(destinationName: any ) {
  const selected = this.destinationList.find(d => d.destinationName === destinationName);
  if (destinationName) {
    this.branchMastForm.patchValue({
      branchMastCode: destinationName.destinationCode,
      branchMastName: destinationName.destinationName
    });
  } else {
    this.branchMastForm.patchValue({
      branchMastCode: '',
      branchMastName: ''
    });
  }
}



  formSubmitZone(formData: any) {
    if (this.zoneForm.valid) {
      this.masterService.createZone(formData.zoneCode, formData.zoneName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating zone:', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.zoneForm);
    }
  }

  formSubmitCountry(formData: any) {
    if (this.countryForm.valid) {
      this.masterService.createCountry(formData.countryCode, formData.countryName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating country:', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.countryForm);
    }
  }

  formSubmitState(formData: any) {
    if (this.stateForm.valid) {
      this.masterService.createState(formData.stateCode, formData.stateName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating state:', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.stateForm);
    }
  }

  private markFormFieldsAsTouched(formGroup: any): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: false });
    });
  }

  destinationFormSubmit(formData: any) {
    if (this.destinationForm.valid) {
      this.masterService
        .createOrUpdateDestination('CreateDestination', formData)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error creating destination:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.destinationForm);
    }
  }

  formSubmitPinCode(formData: any) {
    if (this.pinCodeForm.valid) {
      this.masterService
        .createOrUpdatePinCode('CreatePincode', formData)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error creating pin code:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.pinCodeForm);
    }
  }
   formSubmitCourier(formData: any) {
    if (this.courierForm.valid) {
      this.masterService.createCourier( formData.courierBoyName, formData.courierBoyMobNo, formData.Location, formData.Password, formData.empDept).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating courier:', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.courierForm);
    }
  }

   formSubmitPrefix(formData: any) {
    if (this.prefixForm.valid) {
      this.masterService.createPrefix(formData.prefixCode, formData.prefixName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating prefix:', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.prefixForm);
    }
  }
formSubmitBranchMast(formValue: any) {
  if (this.branchMastForm.invalid) {
    this.branchMastForm.markAllAsTouched();
    return;
  }

  const payload = {
    inputName: this.branchMastMode !== 'edit' ? 'CreateLocation' : 'UpdateLocation',
    locationCode: formValue.branchMastCode,
    locationName: formValue.branchMastName,
    locationStartNo: formValue.branchMaststartNo,
    locationAdd1: formValue.branchMastAdd1,
    locationAdd2: formValue.branchMastAdd2,
    locationAdd3: formValue.branchMastAdd3,
    locationPin: formValue.branchMastPin,
    locationTel: formValue.branchMastTel,
    locationFax: formValue.branchMastStock === 'Yes' ? 1 : 0,
    locationEmail: formValue.branchMastEmail,
    locationWeb: formValue.branchMastWeb,
    connectingHub: formValue.branchConnecting,
    manifestNo: formValue.manifestStock,
    dispatchNo: formValue.dispatchStock,
    drsNo: formValue.drsStock,
    prefix: '',
    destinationCode: formValue.branchMastCity,
    stateCode: formValue.branchMastState,
    gstNo: formValue.branchMastGst,
    hsnNo: formValue.branchMastHsn,
    companyName: '',
    upf: '',
    subBranch: formValue.branchMastBranch,
    accountNo: formValue.branchMastAccNo,
    bankName: formValue.branchMastBank,
    ifscCode: formValue.branchMastIfsc,
    bankBranch: formValue.branchMastBranch,
    comLoc: ''
  };

  this.masterService.createLocationMast(payload).subscribe({
    next: (response: any) => {
        if (response.status === 1) {
          this.openSnackBar(response.message, 'custom-snackbar');
          this.CloseDialog();
        } else {
          this.openSnackBar(response.message, 'error-snackbar');
        }
      },
      error: (error) => {
        console.error('Error adding Location mast:', error);
      }
    });
}

  //  formSubmitBranchMast(formData: any) {
  //   if (this.courierForm.valid) {
  //     this.masterService.createCourier( formData.courierBoyName, formData.courierBoyMobNo, formData.Location, formData.Password).subscribe(
  //       (resp) => {
  //         if (resp.status === 1) {
  //           this.openSnackBar(resp.message, 'custom-snackbar');
  //           this._mdr.close(true);
  //         } else {
  //           this.openSnackBar(resp.message, 'error-snackbar');
  //         }
  //       },
  //       (error) => {
  //         console.error('Error creating courier:', error);
  //       }
  //     );
  //   } else {
  //     this.markFormFieldsAsTouched(this.courierForm);
  //   }
  // }

  updateZone() {
    if (this.zoneForm.valid) {
      const { zoneCode, zoneName } = this.zoneForm.value;
      this.masterService
        .createOrUpdateZone('UpdateZone', zoneCode, zoneName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating zone:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.zoneForm);
    }
  }

  updateCountry() {
    if (this.countryForm.valid) {
      const { countryCode, countryName } = this.countryForm.value;
      this.masterService
        .createOrUpdateCountry('UpdateCountry', countryCode, countryName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating country:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.countryForm);
    }
  }

  updateState() {
    if (this.stateForm.valid) {
      const { stateCode, stateName } = this.stateForm.value;
      this.masterService
        .createOrUpdateState('UpdateState', stateCode, stateName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating state:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.stateForm);
    }
  }

  updateDestination() {
    if (this.destinationForm.valid) {
      this.masterService
        .createOrUpdateDestination('UpdateDestination', this.destinationForm.value)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating destination:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.destinationForm);
    }
  }
  updatePinCode() {
    if (this.pinCodeForm.valid) {
      const formData = this.pinCodeForm.value;

      this.masterService.createOrUpdatePinCode('UpdatePincode', formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error updating pin code:', error);
          this.openSnackBar('Failed to update pin code', 'error-snackbar');
        }
      );
    } else {
      Object.keys(this.pinCodeForm.controls).forEach((field) => {
        const control = this.pinCodeForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }


   updateCourier() {
    if (this.courierForm.valid) {
      const { courierBoyName, courierBoyMobNo, Location, Password, empDept } = this.courierForm.value;
      this.masterService
        .createOrUpdateCourier('UpdateEmployee', this.courierBoyCode, courierBoyName, courierBoyMobNo, Location, Password, empDept)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating courier:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.courierForm);
    }
  }

   updatePrefix() {
    if (this.prefixForm.valid) {
      const { prefixCode, prefixName } = this.prefixForm.value;
      this.masterService
        .createOrUpdatePrefix('UpdatePrefix', prefixCode, prefixName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating prefix:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.prefixForm);
    }
  }
getBranchMastData() {
  if (!this.branchCode) { return; }

  this.masterService.getLocationByCode(this.branchCode).subscribe((resp: any) => {
    if (resp) {
      const details = resp.Data[0];
      this.branchMastForm.patchValue({
          branchMastCode: details.Location_Code,
          branchMastName: details.Location_Name,
          branchMaststartNo: details.Location_StartNo,
          branchMastAdd1: details.Location_Add1,
          branchMastAdd2: details.Location_Add2,
          branchMastAdd3: details.Location_Add3,
          branchMastPin: details.Location_PIN,
          branchMastTel: details.Location_Tel,
          branchMastEmail: details.Location_eMail,
          branchMastWeb: details.Location_web,
          branchMastStock: details.Location_Fax === '1' ? 'Yes' : 'No',
          branchConnecting: details.ConnectingHub,
          manifestStock: details.ManifestNo,
          dispatchStock: details.DispatchNo,
          drsStock: details.DRSNo,
          branchMastCity: details.Destination_Code,
          branchMastState: details.State_Code,
          branchMastGst: details.GSTNo,
          branchMastHsn: details.HSNNo,
          branchMastAccNo: details.AccountNo,
          branchMastBank: details.Bank_Name,
          branchMastIfsc: details.IFSC_Code,
          branchMastBranch: details.Bank_Branch
      });

    }
  }, err => {
    console.error('Error fetching location mast', err);
  });
}
 submitVendor(formData: any) {
   if (this.CoCourierForm.invalid) {
    this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
    this.CoCourierForm.markAllAsTouched();
    return;
  }
    const payload = {
      inputName: this.CocourierMode !== 'edit' ? 'CreateVendor' : 'UpdateVendor',
      vendorCode: formData.CocouirerCode,
      vendorName: formData.CocouirerName,
      vendorCName: formData.CocouirerName,
      vendorAdd1: formData.CocouirerAdd,
      vendorAdd2: '',
      vendorAdd3: '',
      vendorPin: formData.CocouirerPin,
      vendorTel: formData.CocouirerTel || '',
      vendorFax: formData.CocouirerClientFuel || 0,
      vendorEmail: formData.CocouirerEmail || '',
      vendorWeb: formData.CocouirerWeb || '',
      vendorFuel: formData.CocouirerFuel || 0,
      vendorMobNo1: formData.CocouirerMobNo,
      vendorMobNo2: '',
      serviceTax: formData.CocouirerGST ? 1 : 0,
      gstType: formData.CocouirerGstType || '',
      serviceTaxPer: formData.CocouirerGstper || 0,
      sms: formData.SMS ? 1 : 0,
      mail: formData['E-Mail'] ? 1 : 0,
      fax: formData.Fax ? 1 : 0,
      Upf: 0,
      ConnectingHub: ''
    };

    this.masterService.createUpdateVendorMast(payload)
      .subscribe({
      next: (response: any) => {
        if (response.status === 1) {
          this.openSnackBar(response.message, 'custom-snackbar');
          this.CloseDialog();
        } else {
          this.openSnackBar(response.message, 'error-snackbar');
        }
      },
      error: (error) => {
        console.error('Error adding customer:', error);
      }
    });
  }

  getVendorData(vendorCode: string) {
  this.masterService.getVendorByCode(vendorCode).subscribe({
    next: (resp: any) => {
      if (resp.status === 1 && resp.data && resp.data.length > 0) {
        const vendor = resp.data[0];

        this.CoCourierForm.patchValue({
          CocouirerCode: vendor.Vendor_Code,
          CocouirerName: vendor.Vendor_Name,
          CocouirerContper: vendor.Vendor_CName,
          CocouirerAdd: vendor.Vendor_Add1,
          CocouirerPin: vendor.Vendor_Pin,
          CocouirerTel: vendor.Vendor_Tel,
          CocouirerMobNo: vendor.Vendor_MobNo1,
          CocouirerEmail: vendor.Vendor_eMail,
          CocouirerClientFuel: vendor.Vendor_Fax,
          CocouirerFuel: vendor.Vendor_Fuel,
          CocouirerWeb: vendor.Vendor_Web,
          CocouirerGST: vendor.Service_Tax ? 1 : 0,
          CocouirerGstType: vendor.GstType,
          CocouirerGstper: vendor.Service_Tax_per,
          SMS: vendor.sms === '1',
          'E-Mail': vendor.Mail === '1',
          Fax: vendor.fax === '1'
        });
      } else {
        this.openSnackBar('Vendor not found', 'error-snackbar');
      }
    },
    error: (err) => {
      console.error('Error fetching vendor:', err);
      this.openSnackBar('Failed to load vendor', 'error-snackbar');
    }
  });
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
