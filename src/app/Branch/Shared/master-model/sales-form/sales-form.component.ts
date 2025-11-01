import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'app/Branch/master/master.service';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { ConsignorMastComponent } from '../consignor-mast/consignor-mast.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.css']
})
export class SalesFormComponent implements OnInit {

  originList: any;
  selectedOrigin: any;
  branchName: any;
  RateForm: FormGroup;
  productList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  destinationList: any[] = [];
  modeList: any[] = [];
  sessionLocationCode: string;
  selectedValue: any;
  userType: string;
  customerList: any;
  LocationList: any;
  currentDate1: string;
  currentDate2: string;
  consignorForm: FormGroup;
  companyList: any;
  DepartmentData: any;
  extraDataFromChild: any = null;
  chargesState: { [key: string]: boolean } = {};
  chargesKeys: string[] = [];  contactDetails: any;
  essState: { [key: string]: boolean } = {};
  sessionLocationName: string;
  chargesValues: any;
  pinCode: any;
  tempRateDetailForm: any;
  @ViewChild('additionInput') additionInput!: ElementRef;
  zoneList: any;
  ConsignorData: any;
  ConsignorEdit: any;
  Customer_Code: any;
  customerDetails: any;
  ContactDetails: any;
  buttonLable: string;
  RateEdit: any;
  Club_No: any;
  rateDetails: any;
  rateButton: string;
  selectedZone: any;
  trainFlightOptions: any[] = [];
  flightData: any[] = [];
  trainData: any[] = [];
  selectedMode = '';
  ConsigneegstVerify: string = '';
  isGstVerified: boolean = false;
  lastVerifiedGST: any;
// printDetailKeys: string[] = [ 'Origin', 'Destination', 'Consignee', 'Product', 'Mode', 'Pcs', 'Weight', 'Train_Flight_No', 'RateperKg', 'FOV', 'Fuel', 'Docket', 'ESS', 'Metro', 'VTC', 'ENS', 'SC', 'HDP', 'ODA', 'IDC', 'CAF', 'Insurance', 'Other', 'COD', 'Charges1', 'Charges2', 'Charges3', 'Charges4', 'Charges5', 'Charges6', 'Charges7', 'Charges8', 'Charges9', 'Charges10', 'Bottom_RateperKG', 'Bottom_FOV', 'Bottom_Fuel', 'Bottom_Docket', 'Bottom_ESS', 'Bottom_Metro', 'Bottom_VTC', 'Bottom_ENS', 'Bottom_SC', 'Bottom_HDP', 'Bottom_ODA',
//   'Bottom_IDC', 'Bottom_CAF', 'Bottom_Insurance', 'Bottom_Other', 'Bottom_COD', 'Bottom_Charges1', 'Bottom_Charges2', 'Bottom_Charges3', 'Bottom_Charges4', 'Bottom_Charges5',
//   'Bottom_Charges6', 'Bottom_Charges7',
//   'Bottom_Charges8', 'Bottom_Charges9', 'Bottom_Charges10', 'shipperDetails', 'stamp', 'PageWiseTotal', 'AllPageHeader'
// ];
printDetailKeys: string[] = [];
printDetailState: { [key: string]: boolean } = {};
isCompanySelected = false;

  constructor(private _mdr: MatDialogRef<SalesFormComponent>,
              private httpService: HttpService,
              private httpclient: HttpClient,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              public AllService: AllServicesService,
              public bookingService: BookingService,
              @Inject(MAT_DIALOG_DATA) public data: {
                ConsignorData: any;
                ConsignorEdit: any;

                RateData: any;
                RateEdit: any;

                action: any;
              },
              public masterService: MasterService,
              public formBuilder: FormBuilder,
              ) {
                if (data?.ConsignorData) {
                  this.Customer_Code = data.ConsignorData.Customer_Code;
                  this.ConsignorEdit = data.ConsignorEdit;

                  if (data?.ConsignorData.Company_Code) {
                       this.isCompanySelected = true;
                       this.onCompanySelect(data?.ConsignorData.Company_Code)
                  }
                 
                }

                if (data?.RateData) {
                  this.Club_No = data.RateData.Club_No;
                  this.RateEdit = data.RateEdit;
                }
              }

  ngOnInit(): void {
    this.buttonLable = this.ConsignorEdit !== 'edit' ? 'Submit' : 'Update';
    this.rateButton = this.RateEdit !== 'edit' ? 'Submit' : 'Update';

     this.userType = localStorage.getItem('userType');
     this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');
      this.sessionLocationName = localStorage.getItem('originName');
    const gstFlag = localStorage.getItem('GstVerify');
    this.isGstVerified = gstFlag === '1';
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0 = Jan, 11 = Dec
this.currentDate1 = this.formatDateLocal(new Date(currentYear, currentMonth, 1));

this.currentDate2 = this.formatDateLocal(new Date(currentYear, 11, 31));

       this.AllService.getConsignerData(this.sessionLocationCode).subscribe((data: any) => {
      this.customerList = data.Data;
    });
    this.AllService.getOriginData().subscribe((data) => {
      this.originList = data.Data;
    })
    this.AllService.GetBranch().subscribe((data: any) => {
      this.LocationList = data.Data;
    });
    this.masterService.getZone().subscribe((data: any) => {
      this.zoneList = data.Data;
    })
  if (this.userType === 'Admin') {
    this.branchData();
  }
    this.branchData();
    this.loadProduct();
    this.loadMode();
    this.loadCharges();
    this.getCompany();
    this.getDepartmentData();
    this.loadState();
    if (this.data.ConsignorData) {
    this.customerData();
  }
  //   if (!this.data.ConsignorData) {
  //   const defaultCheckedFields = ['Origin', 'Destination', 'Consignee', 'Mode', 'Pcs', 'Weight'];
  //   this.printDetailKeys.forEach(key => {
  //     this.printDetailState[key] = defaultCheckedFields.includes(key);
  //   });
  // } else {
  //   this.customerData();
  // }
    this.consignorForm = this.formBuilder.group({
      consBranch: [this.userType !== 'Admin' ? this.sessionLocationCode : '', Validators.required],
      ConsCode: ['', Validators.required],
      ConsName: ['', Validators.required],
      BillingName: [''],
      consPerson: [''],
      GSTYN: ['No', Validators.required],
      GSTtype: ['Mode', Validators.required],
      consGst: [''],
      consGST2: [''],
      consHSN: [''],
      PanNum: [''],
      ConsAdd1: [''],
      ConsAdd2: [''],
      ConsAdd3: [''],
      conspin: ['', [Validators.pattern('^[0-9]{6}$')]],
      Origin: ['', Validators.required],
      State: ['', Validators.required],
      consMob: ['', [Validators.pattern(/^\d{10}$/)]],
      ConsTel: [''],
      ConsEmail: ['', Validators.email],
      ConsWeb: [''],
      consClient: ['', Validators.required],
      consCash: ['', Validators.required],

      consStatus: ['', Validators.required],
      consBillingType: ['', Validators.required],
      consDepartment: ['', Validators.required],
      consOperation: ['', Validators.required],
      consstock: ['', Validators.required],
      consFuel: [0],
      consFOV: [0],
      consFOVPer: [0],
      consMisscell: [0],
      consDiscount: [0],
      discountPercent: [0],
      FreightAmt: [''],
      Wallet: [''],
      SMS: [false],
      Mail: [false],
      WhatsApp: [false],
      smsOption: [[]],
      whatsAppOption: [[]],
      // ConsUser: [''],
      // ConsPassword: [''],
      connectingHub:  ['', Validators.required],
      CompanyName:  ['', Validators.required]
    });
this.customerData();

this.RateForm = this.formBuilder.group({
  fromDate: [this.currentDate1, Validators.required],
  toDate: [this.currentDate2, Validators.required],
  // fromDate: [''],
  // toDate: [''],
  rateLocation: ['', Validators.required],
  rateCustomer: ['', Validators.required],
  RateOrigin: ['', Validators.required],
  Zone: [''],
  Mode: ['', Validators.required],
  rateProduct: [[], Validators.required],
  rateZone: [[], Validators.required],
  rateCountry: [[]],
  rateState: [[]],
  rateDestination: [[]],
  RateMode: ['Flat', Validators.required],
  RateIncrease: ['0'],
  RateMinWt: ['0'],
  RateMinAmt: ['0'],
  trainFlight: [''],
  trainFlightNo: [''],
  RateDetails: this.formBuilder.array([])
});
this.tempRateDetailForm = this.formBuilder.group({
  On_Addition: ['', Validators.required],
  Lower_Wt: ['', Validators.required],
  Upper_Wt: ['', Validators.required],
  Rate: ['', Validators.required],
  Active_Date: ['', Validators.required],
  Closing_Date: ['', Validators.required]
});
// this.RateForm.get('RateMode')?.valueChanges.subscribe(mode => {
//   if (mode === 'Flat') {
//     this.tempRateDetailForm.get('On_Addition')?.setValue('0');
//     this.tempRateDetailForm.get('On_Addition')?.disable();
//   } else {
//     this.tempRateDetailForm.get('On_Addition')?.enable();
//   }
// });
this.RateForm.get('RateMode')?.valueChanges.subscribe(mode => {
  if (mode === 'Flat') {
    this.tempRateDetailForm.get('On_Addition')?.setValue('0');
    this.tempRateDetailForm.get('On_Addition')?.disable();
  } else {
    this.tempRateDetailForm.get('On_Addition')?.enable();
  }
});

const initialMode = this.RateForm.get('RateMode')?.value;
if (initialMode === 'Flat') {
  this.tempRateDetailForm.get('On_Addition')?.setValue('0');
  this.tempRateDetailForm.get('On_Addition')?.disable();
} else {
  this.tempRateDetailForm.get('On_Addition')?.enable();
}

 if ( this.RateEdit === 'edit' ) {
  this.RateData();
  }
if ( this.RateEdit !== 'edit' ) {
  this.RateForm.get('rateCountry')?.disable();
  this.RateForm.get('rateState')?.disable();
  this.RateForm.get('rateDestination')?.disable();
}
}
handleConsignorClick() {
  const walletValue = this.consignorForm.get('Wallet')?.value;

  if (walletValue === 'Yes') {
    this.openConsignorMast();
  } else {
    this.openSnackBar('Please enable Wallet to proceed with payment.', 'error-snackbar');
  }
}
formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
onCheckboxChange(selected: string) {
  if (selected === 'SMS' && this.consignorForm.get('SMS')?.value) {
    this.consignorForm.patchValue({ WhatsApp: false, whatsAppOption: '' });
  } else if (selected === 'WhatsApp' && this.consignorForm.get('WhatsApp')?.value) {
    this.consignorForm.patchValue({ SMS: false, smsOption: '' });
  }
}
customerData() {
  if (!this.Customer_Code) { return; }

  this.masterService.getCustomerdataByCode(this.Customer_Code).subscribe((resp: any) => {
    if (resp) {
      const customerDetails = resp.Data.customerDetails[0];
      this.customerDetails = customerDetails;
      this.ContactDetails = resp.Data.contactDetails;

       if (resp.Data.printDetails && resp.Data.printDetails.length > 0) {
      const printObj = resp.Data.printDetails[0];
      this.printDetailKeys.forEach(key => {
        this.printDetailState[key] = printObj[key] === 1;
      });
    }
      const smsOptions = [];
      if (customerDetails.bookingMsg) { smsOptions.push('Booking'); }
      if (customerDetails.DRSotpMsg) { smsOptions.push('OTP'); }
      if (customerDetails.DRSMsg) { smsOptions.push('DRS'); }
      if (customerDetails.Deliverymsg) { smsOptions.push('delivered'); }

      const whatsappOptions = [];
      if (customerDetails.bookingMsg) { whatsappOptions.push('Booking'); }
      if (customerDetails.DRSotpMsg) { whatsappOptions.push('OTP'); }
      if (customerDetails.DRSMsg) { whatsappOptions.push('DRS'); }
      if (customerDetails.Deliverymsg) { whatsappOptions.push('delivered'); }

      this.consignorForm.patchValue({
        consBranch: customerDetails.Location_Code,
        ConsCode: customerDetails.Customer_Code,
        ConsName: customerDetails.Customer_Name,
        BillingName: customerDetails.BillingName,
        consPerson: customerDetails.Customer_CName,
        GSTYN: customerDetails.Service_Tax === 1 ? 'Yes' : 'No',
        GSTtype: customerDetails.GstType,
        consGst: customerDetails.GSTNo,
        consGST2: customerDetails.Service_Tax_per,
        consHSN: customerDetails.HSNNo,
        PanNum: customerDetails.PANNo,
        ConsAdd1: customerDetails.Customer_Add1,
        ConsAdd2: customerDetails.Customer_Add2,
        ConsAdd3: customerDetails.Customer_Add3,
        conspin: customerDetails.Customer_Pin,
        Origin: customerDetails.Destination_Code,
        State: customerDetails.State_Code,
        consMob: customerDetails.Customer_Mob1,
        ConsTel: customerDetails.Customer_Tel,
        ConsEmail: customerDetails.Customer_eMail,
        ConsWeb: customerDetails.Customer_Web,
        consClient: customerDetails.Client_type,
        consCash: customerDetails.T_Flag,
        consStatus: customerDetails.Client_Status,
        consBillingType: customerDetails.BillingCycle,
        consDepartment: customerDetails.DepartmentCode,
        consOperation: customerDetails.Booking_Type,
        consFuel: customerDetails.Fuel_chrg,
        consFOV: customerDetails.FovAmt,
        consFOVPer: customerDetails.Docket_Charges,
        consMisscell: customerDetails.ESS,
        consDiscount: customerDetails.Discount,
        discountPercent: customerDetails.Discount_Percent,
        FreightAmt: customerDetails.FreightAmt === 1 ? 'Yes' : 'No',
        Wallet: customerDetails.Wallet === 1 ? 'Yes' : 'No',
        SMS: customerDetails.sms,
        Mail: customerDetails.Mail,
        WhatsApp: customerDetails.Fax,
        smsOption: smsOptions,
        whatsAppOption: whatsappOptions,
        connectingHub: customerDetails.ConnectingHub,
        CompanyName: customerDetails.Company_Code,
        consstock: customerDetails.Currency_Symbol === '1' ? 'Yes' : 'No'
      });
      for (let i = 1; i <= 11; i++) {
        const key = `Charges${i}`;
        this.chargesState[i] = customerDetails[key] === 1;
      }

     for (let i = 1; i <= 10; i++) {
  const key = `ESS${i}`;
  this.essState[i] = customerDetails[key] === 1;
}

    }
  }, err => {
    console.error('Error fetching customer data', err);
  });
}
verifyGST() {
   if ( this.lastVerifiedGST === this.consignorForm.value.consGst) {
    this.openSnackBar('GST already verified!', 'custom-snackbar');
    return;
  }
  if (!this.consignorForm.value.consGst || this.consignorForm.value.consGst.length !== 15) {
    this.openSnackBar( 'Please enter a valid 15-digit GST number', 'error-snackbar');
    return;
  }

  this.bookingService.verifyGSTNumber(this.consignorForm.value.consGst).subscribe(
    (resp: any) => {
      if ( resp.status === 1) {
        this.openSnackBar( resp.message, 'custom-snackbar')
          const res = resp.data.pradr.addr;
             const address1Parts = [res.bnm, res.flno, res.bno].filter(Boolean);
          const address1 = address1Parts.join(', ');

          const address2Parts = [res.st, res.locality].filter(Boolean);
          const address2 = address2Parts.join(', ');

          const cityItem = this.originList.find(item =>
            item.originName.toLowerCase() === res.loc.toLowerCase()
          );
          const stateItem = this.stateList.find(item =>
            item.stateName.toLowerCase() === res.stcd.toLowerCase()
          );

          this.consignorForm.patchValue({
            ConsAdd1: address1,
            ConsAdd2: address2,
            ConsAdd3: res.landMark,
            conspin: res.pncd,
            Origin: cityItem ? cityItem.originCode : null,
            State: stateItem ? stateItem.stateCode : null,
            ConsName: resp.data.tradeNam
          });
            this.lastVerifiedGST = this.consignorForm.value.consGst;
        // }
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
         this.consignorForm.patchValue({
          ConsAdd1: '',
          ConsAdd2: '',
          ConsAdd3: '',
          conspin: '',
          Origin: null,
          State: null,
          ConsName: ''
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
parseDateString(dateStr: string): string {
  if (!dateStr) { return ''; }
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
get rateDetailsArray(): FormArray {
  return this.RateForm.get('RateDetails') as FormArray;
}
RateData() {
  if (!this.Club_No) { return; }

  this.masterService.getRateMasterdataByCode(this.Club_No).subscribe((resp: any) => {
    if (resp) {
      const rateDetails = resp.Data.rateMasterData[0];
      // this.RateForm.get('rateCountry')?.enable();
      // this.RateForm.get('rateState')?.enable();
      // this.RateForm.get('rateDestination')?.enable();

      this.AllService.getCountrySales(rateDetails.Zone_Codes[0]).subscribe((countryData: any) => {
        this.countryList = countryData.Data;
if (rateDetails.Country_Codes?.length) {
  this.RateForm.get('rateCountry')?.enable();

  setTimeout(() => {
    this.RateForm.patchValue({ rateCountry: rateDetails.Country_Codes });

    // Trigger the cascade
    this.onCountrySelectionChange(
      rateDetails.Country_Codes.map(code => ({ countryCode: code }))
    );
  });
} else {
  this.RateForm.get('rateCountry')?.disable();
}
        this.RateForm.patchValue({
          fromDate: this.parseDateString(rateDetails.Active_Date),
          toDate: this.parseDateString(rateDetails.Closing_Date),
          rateLocation: rateDetails,
          rateCustomer: rateDetails.Cust_Code,
          RateOrigin: rateDetails.Orgin_Code,
          Zone: rateDetails.OrginZone_Code?.trim() || '',
          Mode: rateDetails.Mode_Code,
          rateProduct: rateDetails.Prod_Codes,
          rateZone: rateDetails.Zone_Codes,
          RateMode: rateDetails.Method,
          RateIncrease: rateDetails.RatePer,
          RateMinWt: rateDetails.Weight,
          RateMinAmt: rateDetails.Amount,
          trainFlight: rateDetails.Flight,
          trainFlightNo: rateDetails.Flight_No,
        });
        this.onZoneSelectionChange(rateDetails.Zone_Codes.map(code => ({ Zone_Code: code })));
        this.onCountrySelectionChange(rateDetails.Country_Codes.map(code => ({ countryCode: code })));
        this.onStateSelectionChange(rateDetails.State_Codes.map(code => ({ State_Code: code })));

        // if (rateDetails.Country_Codes?.length) {
        //   this.RateForm.get('rateCountry')?.enable();
        //   this.RateForm.patchValue({ rateCountry: rateDetails.Country_Codes });
        // } else {
        //   this.RateForm.get('rateCountry')?.disable();
        // }

        // if (rateDetails.State_Codes?.length) {
        //   this.RateForm.get('rateState')?.enable();
        //   this.RateForm.patchValue({ rateState: rateDetails.State_Codes });
        // } else {
        //   this.RateForm.get('rateState')?.disable();
        // }

        // if (rateDetails.Destination_Codes?.length) {
        //   this.RateForm.get('rateDestination')?.enable();
        //   this.RateForm.patchValue({ rateDestination: rateDetails.Destination_Codes });
        // } else {
        //   this.RateForm.get('rateDestination')?.disable();
        // }

        // Conditional state and destination loading
        if (rateDetails.Country_Codes.length === 1) {
          this.loadStateByCode(rateDetails.Country_Codes[0], rateDetails.Zone_Codes[0], () => {
            this.RateForm.patchValue({
              rateState: rateDetails.State_Codes
            });

            if (rateDetails.State_Codes.length === 1) {
              this.loadDestination(rateDetails.State_Codes[0], rateDetails.Zone_Codes[0]);
              this.RateForm.patchValue({
                rateDestination: rateDetails.Destination_Codes
              });
            }
          });
        }
      });
const rateDetailsList = resp.Data.rateDetailsData;

        const rateDetailsFormArray = this.RateForm.get('RateDetails') as FormArray;
        rateDetailsFormArray.clear();

        rateDetailsList.forEach(detail => {
          const detailGroup = this.formBuilder.group({
            On_Addition: [this.RateForm.get('RateMode')?.value === 'Flat' ? 0 : (detail.On_Addition ?? 0), Validators.required],
            Lower_Wt: [detail.Lower_Wt , Validators.required],
            Upper_Wt: [detail.Upper_Wt , Validators.required],
            Rate: [detail.Rate , Validators.required],
            Active_Date: [detail.Active_Date , Validators.required],
            Closing_Date: [detail.Closing_Date , Validators.required],
          });
          rateDetailsFormArray.push(detailGroup);
        });
    }
  });
}

loadStateByCode(code: string, name: string, callback?: () => void): void {
  this.masterService.getByCodeState(code, name).subscribe((data) => {
    this.stateList = data.Data;
    this.RateForm.get('rateState')?.enable();
    if (callback) { callback(); }
  });
}



  getDefaultDate(): string {
     const today = new Date();
     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
     return this.formatDate(firstDayOfMonth);
   }
   formatDate(date: Date): string {
     const year = date.getFullYear();
     const month = date.getMonth() + 1;
     const day = date.getDate();
     return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
   }
    getCurrentDate(): string {
     const today = new Date();
     return this.formatDate(today);
   }

toggleCharge(key: string, checked: boolean) {
  this.chargesState[key] = checked;
  console.log(`Charge ${key} set to ${checked}`);
}
toggleEss(key: string, checked: boolean) {
  this.essState[key] = checked;
  console.log(`ESS ${key} set to ${checked}`);
}
loadCharges() {
  this.masterService.getChargesName(this.sessionLocationCode).subscribe(
    (response) => {
      if (response.status === 1 && response.Data.length > 0) {
        const data = response.Data[0];
        this.chargesKeys = Object.keys(data).filter(k => /^Charges_([1-9]|10|11|12|13)$/.test(k));
        this.chargesValues = this.chargesKeys.map(key => data[key]);

        this.chargesState = {};
        this.essState = {};

        this.chargesKeys.forEach((key, index) => {
          const chargeLabel = data[key];
          this.chargesState[index + 1] = false;
           this.essState[index + 1] = false;
        });

        console.log('Charge labels:', this.chargesValues);
      }
    },
    (error) => {
      console.error('Error fetching charges:', error);
    }
  );
}

openConsignorMast() {
   const consCash = this.consignorForm.get('consCash')?.value;
  const dialogRef = this.dialog.open(ConsignorMastComponent, {
    data: {
      action: 'add',
      customerDetails: this.extraDataFromChild || this.customerDetails,
      consCash: consCash
    },
    width: '25rem',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      this.extraDataFromChild = res;
      console.log('Data from ConsignorMastComponent:', this.extraDataFromChild);
    }
  });
}

  openContactDetails() {
    const dialogRef = this.dialog.open(ContactDetailsComponent, {
      data: {
        action: 'add',
        contactDetails: this.contactDetails || this.ContactDetails
      },
      width: '50rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
         this.contactDetails = res;
      }
    });
  }
  loadProduct() {
    this.bookingService.getProduct().subscribe(
      (resp) => {
        this.productList = resp.Data;
      },
      (error) => {
        console.error('Error in loadProduct:', error);
      }
    );
  }
  // loadStateByCode(code: string) {
  //   this.masterService.getByCodeState(code).subscribe(
  //     (resp) => {
  //       this.stateList = resp.Data;
  //     },
  //     (error) => {
  //       console.error('Error in loadStateByCode:', error);
  //     }
  //   );
  // }
  loadState() {
  this.bookingService.getState().subscribe(
    (resp) => {
      this.stateList = resp.Data;
    },
    (error) => {
      console.error('Error in loadState:', error);
    }
  );
}
  // loadMode() {
  //   this.bookingService.getMode().subscribe(
  //     (resp) => {
  //       this.modeList = resp.Data;
  //     },
  //     (error) => {
  //       console.error('Error in loadMode:', error);
  //     }
  //   );
  // }
  loadMode() {
  this.bookingService.getMode().subscribe(
    (resp) => {
      this.modeList = resp.Data;
      const savedMode = localStorage.getItem('selectedMode');
      if (savedMode) {
        const matchedMode = this.modeList.find(item => item.Mode_code === savedMode);
        if (matchedMode) {
          this.selectedMode = matchedMode.Mode_code;
          this.RateForm.patchValue({ Mode: this.selectedMode });
          this.handleModeChange(this.selectedMode);
        }
      }
    },
    (error) => {
      console.error('Error in loadMode:', error);
    }
  );
}

handleModeChange(modeCode: string) {
  this.selectedMode = modeCode;
  localStorage.setItem('selectedMode', modeCode);

  if (modeCode === 'AI') {
    this.RateForm.patchValue({ trainFlight: '', trainFlightNo: '' });
    this.getFlightData();
  } else if (modeCode === 'T') {
    this.RateForm.patchValue({ trainFlight: '', trainFlightNo: '' });
    this.getTrain();
  } else {
    this.trainFlightOptions = [];
    this.RateForm.patchValue({ trainFlight: null, trainFlightNo: '' });
  }
}

getFlightData(): void {
  this.httpclient.get(`${environment.apiUrl}Master/FlightMast?masterName=Flight&operation=getFlight`)
    .subscribe((response: any) => {
      this.flightData = response.Data;
      this.trainFlightOptions = this.flightData.map(item => ({
        name: item.AirLine_Name,
        code: item.AirLine_Code,
        displayNo: item.Flight_Code
      }));
    });
}

getTrain(): void {
  this.httpclient.get(`${environment.apiUrl}Master/TrainNo?masterName=TrainNo&operation=getTrainNo`)
    .subscribe((response: any) => {
      this.trainData = response.Data;
      this.trainFlightOptions = this.trainData.map(item => ({
        name: item.Train_Name,
        code: item.Train_Code,
        displayNo: item.TrainNo_Name
      }));
    });
}

onTrainFlightSelect(selectedCode: string) {
  const selected = this.trainFlightOptions.find(item => item.code === selectedCode);
  this.RateForm.patchValue({
    trainFlightNo: selected?.displayNo || ''
  });
}
   getCompany() {
    // tslint:disable-next-line:max-line-length
     this.httpService.get(`${environment.apiUrl}Booking/getCompany`).then((res: any) => {
        this.companyList = res.Data;
       })
    }
//     onCompanySelect(event: any): void {
//   const selectedCode = event.target.value;
//   if (selectedCode) {
//     this.getBillingSetup(selectedCode);
//   }
// }
onCompanySelect(event: any): void {
  // const selectedCompanyCode = event.target.value;
  const selectedCompanyCode = event?.target?.value ?? event;

  if (selectedCompanyCode) {
    this.isCompanySelected = false; // Reset before loading new data

    // Load print details for that company if required (API or logic)
    this.getBillingSetup(selectedCompanyCode);
  } else {
    this.isCompanySelected = false;
  }
}

// 🔹 API call to get billing setup for selected company
getBillingSetup(companyCode: string): void {
  this.httpService
    .get(`${environment.apiUrl}Master/companyGetAndDelete?operation=getBillingSetup&companyCode=${companyCode}`)
    .then((res: any) => {
      if (res.status === 1) {
        // const billingData = res.Data.companyDetails[0];
         const billingData = res.Data[0];
       
        this.isCompanySelected = true;
        
        this.printDetailKeys = Object.keys(billingData);
        this.printDetailState = {};

        this.printDetailKeys.forEach(key => (this.printDetailState[key] = false));
        Object.keys(billingData).forEach(key => {
          if (this.printDetailState.hasOwnProperty(key)) {
            this.printDetailState[key] = billingData[key] === 1;
          }
        });  
      } else {
        this.openSnackBar('No billing setup found for this company.', 'error-snackbar');
        this.isCompanySelected = false;
      }
    })
    .catch(() => {
      this.openSnackBar('Failed to fetch billing setup.', 'error-snackbar');
    });
}

    getDepartmentData() {
      this.httpService.get(`${environment.apiUrl}Permissions/getDepartment`).then((resp) => {
        this.DepartmentData = resp.Data ;
      });
    }
    //  getFlightData(): void {
    //     this.http.get(`${environment.apiUrl}Master/FlightMast?masterName=Flight&operation=getFlight`)
    //       .subscribe((response: any) => {
    //         console.log('Zone Data:', response);
    //         this.flightList = response.Data;
    //       });
    //   }
    //   getAirLine(): void {
    //     this.http.get(`${environment.apiUrl}Master/allMasters?masterName=AirLine&operation=getAirLine`)
    //     .subscribe((response: any) => {
    //       this.airlineList = response.Data;
    //     });
    //   }
  branchData() {
    this.httpService.get(`${environment.apiUrl}Booking/getBranch` ).then((resp) => {
        this.branchName = resp.Data;
      });
  }
//   loadDestination(code: string, name: string): void {
//   this.masterService.getByCodeDestination(code, name).subscribe(
//     (data) => {
//       this.destinationList = data.Data;
//     },
//     (error) => {
//       console.error('Error in loadDestination:', error);
//     }
//   );
// }
loadDestination(stateCode: string, zoneCode: string, callback?: () => void): void {
  this.masterService.getByCodeDestination(stateCode, zoneCode).subscribe((res: any) => {
    this.destinationList = res.Data || [];

    // Only call callback if provided
    if (callback) {
      callback();
    }
  });
}

  onStateSelectionChange(selectedStates: any): void {
  // const  = event.value || [];
    const code = selectedStates[0].State_Code;

  if (selectedStates[0].State_Code && selectedStates.length === 1) {
    const name = this.selectedZone || '';
    this.loadDestination(code, name);
    this.RateForm.get('rateDestination')?.enable();
  } else {
    this.destinationList = [];
    this.RateForm.get('rateDestination')?.disable();
    this.RateForm.get('rateDestination')?.setValue([]);
  }
}
  onZoneSelectionChange(selectedZones: any): void {
  // const selectedZones = event.value || [];
      this.selectedZone = selectedZones[0].Zone_Code;

  if (selectedZones[0].Zone_Code && selectedZones.length === 1) {
      this.AllService.getCountrySales(this.selectedZone).subscribe((data: any) => {
      this.countryList = data.Data;
      this.RateForm.get('rateCountry')?.enable();
            console.log('Country control enabled:', this.RateForm.get('rateCountry')?.enabled);

    });
  } else {
     this.selectedZone = null;
    this.countryList = [];
    this.RateForm.get('rateCountry')?.disable();
    this.RateForm.get('rateCountry')?.setValue([]);
    this.stateList = [];
    this.RateForm.get('rateState')?.disable();
    this.RateForm.get('rateState')?.setValue([]);
    this.destinationList = [];
    this.RateForm.get('rateDestination')?.disable();
    this.RateForm.get('rateDestination')?.setValue([]);
  }
}

 onCountrySelectionChange(selectedCountries: any): void {
  // const selectedCountries = event.value || [];
    const code = selectedCountries[0].countryCode;

  if (selectedCountries[0].countryCode && selectedCountries.length === 1) {
    const name = this.selectedZone || '';
    this.loadStateByCode(code, name);
    this.RateForm.get('rateState')?.enable();
  } else {
    this.stateList = [];
    this.RateForm.get('rateState')?.disable();
    this.RateForm.get('rateState')?.setValue([]);
    this.destinationList = [];
    this.RateForm.get('rateDestination')?.disable();
    this.RateForm.get('rateDestination')?.setValue([]);
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
  addCustomer(formData: any) {
     if (this.consignorForm.invalid) {
    this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
    this.consignorForm.markAllAsTouched();
    return;
  }

  // if (this.consignorForm.get('GSTYN')?.value === 'Yes' && !formData.consGst) {
  //   this.openSnackBar('GST No. is required', 'error-snackbar');
  //   this.consignorForm.get('consGst')?.markAsTouched();
  //   return;
  // }

   const getMessageFlags = (options: string[]) => ({
    bookingMsg: options.includes('Booking') ? 1 : 0,
    DRSMsg: options.includes('DRS') ? 1 : 0,
    deliveryMsg: options.includes('delivered') ? 1 : 0,
    DRSOtpMsg: options.includes('OTP') ? 1 : 0,
  });

  const smsOptions = formData.SMS ? formData.smsOption || [] : [];
  const whatsappOptions = formData.WhatsApp ? formData.whatsAppOption || [] : [];

  const combinedOptions = [...new Set([...smsOptions, ...whatsappOptions])];
  const messageFlags = getMessageFlags(combinedOptions);

    const obj = {
      inputName:  this.ConsignorEdit !== 'edit' ? 'CreateCustomer' : 'UpdateCustomer',
    customerCode: formData.ConsCode,
    customerName: formData.ConsName,
    customerCName: formData.consPerson,
    customerAdd1: formData.ConsAdd1,
    customerAdd2: formData.ConsAdd2,
    customerAdd3: formData.ConsAdd3,
    customerPin: formData.conspin,
    locationCode: formData.consBranch,
    tFlag: formData.consCash,
    serviceTax: formData.GSTYN === 'Yes' ? 1 : 0,
    serviceTaxPer: formData.consGST2,
    creditLimit: this.extraDataFromChild?.MinAmt || '',
    creditDays: this.extraDataFromChild?.creditDays || '',
    dueDays: this.extraDataFromChild?.InvdueDays || '',
    contractAmount: 0,
    customerTel: formData.ConsTel,
    customerMob1: formData.consMob,
    Remark: this.extraDataFromChild?.Remark || '',
    customerMob2: formData.consMob,
    customerFax: '',
    customereMail: formData.ConsEmail,
    customerWeb: formData.ConsWeb,
    currencyCode: '',
    currencyName: '',
    currencySymbol: formData.consstock === 'Yes' ? 1 : 0,
    salesExecutiveCode: '',
    salesExecutiveCommType: '',
    salesExecutiveAmt: 0,
    destinationCode: formData.Origin,
    stateCode: formData.State,
    // deposit: this.extraDataFromChild?.OpeningAmt || 0,
    deposit: 0,
    balance: this.extraDataFromChild?.BalanceAmt || 0,
    billingCycle: formData.consBillingType,
    fuelCharges: 0,
    fuelchrg: formData.consFuel || 0,
    discount: formData.consDiscount,
    discountPercent: formData.discountPercent,
    FreightAmt: formData.FreightAmt === 'Yes' ? 1 : 0,
    Wallet: formData.Wallet === 'Yes' ? 1 : 0,
    dom: '',
    username: '',
    password: '',
    sms: formData.SMS ? 1 : 0,
    mail: formData.Mail ? 1 : 0,
    fax: formData.WhatsApp ? 1 : 0,
    volumetricCalc: 0,
    VTCCharges: 0,
    nFormCharges: 0,
    docketCharges: formData.consFOVPer || 0,
    fovAmt: formData.consFOV || 0,
    insurance: 0,
    customerGroup: '',
    GSTNo: formData.consGst,
    PANNo: formData.PanNum,
    HSNNo: formData.consHSN,
    clientType: formData.consClient,
    gstType: formData.GSTtype,
    bookingType: formData.consOperation,
    clientStatus: formData.consStatus,
    Upf: 0,
    ESS: formData.consMisscell,
    companyCode: formData.CompanyName,
    BillingName: formData.BillingName,
    DepartmentCode: formData.consDepartment,
    ...messageFlags,
    connectingHub: formData.connectingHub,
    contactDetails: this.contactDetails || '',
    printDetails: [this.printDetailKeys.reduce((acc: any, key: string) => {
        acc[key] = this.printDetailState[key] ? 1 : 0;
        return acc;
      }, {})
    ]
    }
for (const [index, checked] of Object.entries(this.essState)) {
  const key = `ESS${index}`;
  obj[key] = checked ? 1 : 0;
}


for (const [index, checked] of Object.entries(this.chargesState)) {
  const key = `charges${index}`;
  obj[key] = checked ? 1 : 0;
}
// for (const [key, checked] of Object.entries(this.printDetailState)) {
//   obj[key] = checked ? 1 : 0;
// }
// obj.printDetails = this.printDetailKeys.map(key => ({
//   field: key,
//   selected: this.printDetailState[key] ? 1 : 0
// }));
    console.log('formdata :', obj);
    this.masterService.customerMast(obj).subscribe({
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

getPinCode(event: any) {
  this.pinCode = event.target.value;

  if (this.pinCode) {
    this.bookingService.getPincodeData(this.pinCode).subscribe(
      (resp) => {
        const data = resp.Data[0];
        if (data) {
          this.consignorForm.controls.Origin.setValue(data.Destination_Code);
          this.consignorForm.controls.State.setValue(data.State_Code);
        }
      },
      (error) => {
        console.error('Error in getPinCode:', error);
      }
    );
  }
}

addRateDetail() {
     if (this.RateForm.get('RateMode')?.value === 'Flat') {
    this.tempRateDetailForm.get('On_Addition')?.setValue('0');
    this.tempRateDetailForm.get('On_Addition')?.markAsDirty();
    this.tempRateDetailForm.get('On_Addition')?.markAsTouched();
    this.tempRateDetailForm.get('On_Addition')?.updateValueAndValidity();
  }
  if (this.tempRateDetailForm.invalid) {
    this.openSnackBar('Please fill all fields before adding.', 'error-snackbar');
    return;
  }

  if (this.RateForm.get('RateMode')?.value === 'Flat') {
    this.tempRateDetailForm.patchValue({ On_Addition: '0' });
  }

  const formValue = this.tempRateDetailForm.value;
  const index = this.rateDetailsArray.length + 1;

  const detailGroup = this.formBuilder.group({
    Rd_Number: [index],
    On_Addition: [ this.RateForm.get('RateMode')?.value === 'Flat' ? 0 : formValue.On_Addition],
    Lower_Wt: [formValue.Lower_Wt],
    Upper_Wt: [formValue.Upper_Wt],
    Rate: [formValue.Rate],
    Active_Date: [formValue.Active_Date],
    Closing_Date: [formValue.Closing_Date],
    Flag: ['']
  });

  this.rateDetailsArray.push(detailGroup);
  this.tempRateDetailForm.reset();
  if (this.RateForm.get('RateMode')?.value === 'Flat') {
  this.tempRateDetailForm.patchValue({ On_Addition: '0' });
}
  setTimeout(() => {
    this.additionInput.nativeElement.focus();
  }, 0);
}


   addRate(formData: any) {
 if (this.RateForm.invalid) {
    this.openSnackBar('Please fill out all required fields.', 'error-snackbar');
    this.RateForm.markAllAsTouched();
     Object.keys(this.RateForm.controls).forEach(controlName => {
    const control = this.RateForm.get(controlName);
    if (control?.invalid) {
      console.warn(`${controlName} is invalid`, control.errors);
    }
  });
    return;
  }
    const obj = {
    inputName:   this.RateEdit !== 'edit' ? 'CreateRateEntry' : 'UpdateRateEntry',
    Club_No: this.RateEdit === 'edit' ? this.Club_No : 0,
    Cust_Code: formData.rateCustomer,
    Vendor_Code: '',
    Flag: 'C',
    Mode_Code: formData.Mode,
    Prod_Code: formData.rateProduct,
    Orgin_Code: formData.RateOrigin,
    Zone_Code: formData.rateZone,
    OrginZone_Code: formData.Zone,
    Country_Code: formData.rateCountry || [],
    State_Code: formData.rateState || [],
    Destination_Code: formData.rateDestination || [],
    Method: formData.RateMode,
    Slab: 2,
    Active_Date: formData.fromDate,
    Closing_Date: formData.toDate,
    DoxSpx: '',
    RatePer: formData.RateIncrease || 0,
    Amount: formData.RateMinAmt || 0,
    Weight: formData.RateMinWt || 0,
    ConnectingHub: '',
    RateDetails: formData.RateDetails,
    Flight: formData.trainFlight || '',
    Flight_No: formData.trainFlightNo || '',
    }
    console.log('formdata :', obj);
    this.masterService.rateMasterEntry(obj).subscribe({
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

  removeRateDetail(index: number) {
  this.rateDetailsArray.removeAt(index);
}

CloseDialog() {
this._mdr.close(false);
}
}
