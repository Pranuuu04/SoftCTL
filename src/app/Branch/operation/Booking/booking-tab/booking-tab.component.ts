
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GstBookingComponent } from 'app/Branch/Shared/GST/gst-booking/gst-booking.component';
import { ActiveCustomerComponent } from 'app/Branch/Shared/Shipper/active-customer.component';
import { BluedartComponent } from 'app/Branch/Shared/bluedart/bluedart.component';
import { BookPrintComponent } from 'app/Branch/Shared/book-print/book-print.component';
import { ConsignerComponent } from 'app/Branch/Shared/consigner/consigner.component';
import { CustTypeAddComponent } from 'app/Branch/Shared/cust-type-add/cust-type-add.component';
import { DepartmentComponent } from 'app/Branch/Shared/department/department.component';
import { EnableLabelComponent } from 'app/Branch/Shared/enable-label/enable-label.component';
import { InvoiceValComponent } from 'app/Branch/Shared/invoiceVal/invoice-val.component';
import { LabelComponent } from 'app/Branch/Shared/label/label.component';
import { OtherFeatureComponent } from 'app/Branch/Shared/other-feature/other-feature.component';
import { VehicleComponent } from 'app/Branch/Shared/vehicle/vehicle.component';
import { VendorComponent } from 'app/Branch/Shared/vendor/vendor.component';
import { VendorboxComponent } from 'app/Branch/Shared/vendorbox/vendorbox.component';
import { VolumetricComponent } from 'app/Branch/Shared/volumetric/volumetric.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';
import 'jspdf-autotable';
import { event } from 'jquery';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AllServicesService } from 'app/service/all-services.service';
import { BookingService } from '../booking.service';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { SharedService } from 'app/service/shared.service';
import { PerformaInvoiceComponent } from 'app/Branch/Shared/performa-invoice/performa-invoice.component';

@Component({
  selector: 'app-booking-tab',
  templateUrl: './booking-tab.component.html',
  styleUrls: ['./booking-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingTabComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('awbNoInput') awbNoInput: ElementRef;
  @ViewChild('originSelect') originSelect: NgSelectComponent;

  awbType = 'Manual';
  pinCode: string;
  custType: any;
  billParty = 'Consignor';
  containerType = 'pcs';
  actaulWeightType = 'weight';
  deliveryType: string;
  packageType: string;
  docketAction = 'yes';
  fovAction = 'yes';
  odaAction = 'yes';
  packingAction = 'yes';
  insuranceAction = 'yes';
  loadingAction = 'yes';
  fuelAction = 'yes';
  selectedVendor1: string;
  selectedMode: string;
  selectedProduct: string;
  selectedOrigin: string ;
  selectedDestination: string;
  sessionLocationCode: string;
  sessionLocationName: string;
  username: string;
  consignerList: any;
  consignerCode: string;
  shipperNameList: any;
  consigneeList: any;
  cityName: string;
  stateName: string;
  countryName: string;
  cityList: any[] = [];
  stateList: string;
  countryList: any[] = [];
  modeList: any;
  productList: any;
  originList: string;
  // destinationList: string;
  viaList = '';
  via = '';
  deliveryTypeList: string;
  packageTypeList: string;
  defaultDate: string;
  newCustomerCode: string;
  bookingForm: FormGroup;
  validationMessage: any = [];
  selectedConsignee: string;
  listData: string;
  vendorChargedWt: number;
  invoiceValue: number;
  invoiceListData: string;
  volListData: string;
  performaListData: string;
  volumetrictotal: any;
  vendorList: string;
  forwarding2: string;
  forwarding3: string;
  vendor2: string;
  vendor3: string;
  gst = 0;
  subTotalAmt = 0;
  totalAmount = 0;
  withoutGSTTotalAmt = 0;
  gstValue: any;
  gstPer: any;
  igstPer = 0;
  cgstPer = 0;
  sgstPer = 0;
  igst = 0;
  cgst = 0;
  sgst = 0;
  gstAmount = 0;
  consigneeName: string;
  address1: string;
  address2: string;
  landMark: string;
  mobileNo: string;
  gstNo: any;
  emailId: string;
  conAddress1: string;
  consigneeAddress2: string;
  consigneeLandmark: string;
  consigneePincode: string;
  consigneeCityName: string;
  consigneestateName: string;
  consigneestateCode: string;
  consigneecountryName: string;
  consigneePhoneNo: string;
  consigneeEmail: string;
  consigneeGST: string;
  isEddChecked = true;
  isShipperChecked = true;
  isDepartmentChecked = true;
  isConsigneeChecked = true;
  isAddressChecked = true;
  isBillPartyChecked = true;
  isRemarkChecked = true;
  isSNoChecked = true;
  isVendorChecked = true;
  isForwardNoChecked = true;
  isDelvTypeChecked = true;
  isPkgTypeChecked = true;
  isDiscountChecked = true;
  isDocketChecked = true;
  isFovChecked = true;
  isOdaChecked = true;
  isPackingChrgChecked = true;
  isInsurranceChecked = true;
  isLoadingChecked = true;
  isOtherChrgChecked = true;
  isFuelChrgChecked = true;

  lebelSet1: string;
  lebelSet2: string;
  lebelSet3: string;
  lebelSet4: string;
  lebelSet5: string;
  lebelSet6: string;
  lebelSet7: string;
  edd: any;
  shipper: any;
  consignee: any;
  cAdd: any;
  remark: any;
  srNo: any;
  vendor: any;
  forwardingNo: any;
  delVType: any;
  pkgType: any;
  discount: number;
  docketCharge: number;
  fovChrg: number;
  odaChrg: number;
  charges1: number;
  charges2: number;
  charges3: number;
  charges4: number;
  otherChrg: number;
  department: any;

  cafCharges: number;
  hdpCharges: number;
  essCharges: number;
  idcCharges: number;
  encCharges: number;
  scCharges: number;
  charge4: number;
  charge5: number;
  charge6: number;
  charge7: number;
  charge8: number;
  charge9: number;
  selectedCustType: string;
  product: string;
  mode: string;
  event: any;
  vendorData: Date;
  vendorNames: string;
  ewayBillData: string;

  chargedWt = 0;
  freightAmt = 0;
  newFreightAmt = 0;
  GSTPer = 0;
  IGST = 0;
  CGST = 0;
  SGST = 0;
  IGSTAmt = 0;
  CGSTAmt = 0;
  SGSTAmt = 0;
  CustomerName: string;
  freightGST = 0;
  docketGST = 0;
  fovGST = 0;
  odaGST = 0;
  packingGST = 0;
  insuranceGST = 0;
  loadingGST = 0;
  fuelGST = 0;
  othersGST = 0;
  eWayBill: string;
  invoiceNo: string;
  actualWt = 0.5;
  quantity: any;
  forwardNo: string;
  serialNo: string;
  remarks: string;
  volumetricWt = 0;
  ratePerKg = 0;
  fovCharge = 0;
  odaCharge = 0;
  fuelCharge = 0;
  docketCharges = 0;
  packingCharge = 0;
  insuranceCharge = 0;
  loadingCharge = 0;
  otherCharge = 0;
  selectedShipper: string;
  updateEnabled = false;
  deleteDisabled = true;
  CustInvoice: any ;
  vendorVolumetrice: any;
  Volumetrice: any;
  expectedDeliveryDate: Date;
  discountAmt = 0;
  awbNo: string;
  awbInputFeild = false;
  selectedVendor2: string;
  forwardNo2: string;
  selectedVendor3: string;
  forwardNo3: string;
  editEnabled = false;
  disabledForm = true;
  userType: string;
  consignerName: string;
  isInputField = false;
  shipperAdd1: string;
  shipperAdd2: string;
  shipperCity: string;
  shipperEmail: string;
  shipperGSTNo: any;
  shipperName: string;
  shipperPhone: any;
  shipperPinCode: string;
  shipperStateCode: string;
  DestinationCode: string;
  ShipperSave: any;
  savaConsignee: any;
  kycImage: any;
  disableButtons = true;
  ClientName: string;
  ClientLogo: string;
  customerName: string;
  SelectedCustType: string;
  destinationList: any[] = []; // Complete destination data
  paginatedDestinationList: any[] = []; // Data shown in dropdown
  filteredDestinationList: any[] = []; // Data shown based on search term
  scrollTrigger$: Subject<void> = new Subject<void>(); // Subject to debounce scroll events
  destinationName: any;
  isInputDisabled: boolean;
  invoiceNote: any;
  performaValue: any;
  CompanyPrint: string;
  companyCode: any;
  private subscriptions: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  constructor(public httpService: HttpService,
              public AllService: AllServicesService,
              public bookingService: BookingService,
              public dialog: MatDialog,
              private router: Router,
              public formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private httpclient: HttpClient,
            private sharedService: SharedService ) {
                  // this.sessionLocationCode = localStorage.getItem('originCode');
                  // this.userType = localStorage.getItem('userType');
                  localStorage.removeItem('vendorListData');
                  localStorage.removeItem('CustInvoice');
                  localStorage.removeItem('Volumetrice');
                  localStorage.removeItem('vendorVolumetrice');
                  localStorage.removeItem('invoiceNoList');
                  localStorage.removeItem('ewayBillList');
                  localStorage.removeItem('gstPer');
                  localStorage.removeItem('ewayBillNumbers');
                  localStorage.removeItem('totalChargeWeightVendor');
                  localStorage.removeItem('vendor2');
                  localStorage.removeItem('forwarding2');
                  localStorage.removeItem('vendor3');
                  localStorage.removeItem('forwarding3');
                  localStorage.removeItem('Vol');
                }
                refresh() {
                }
 ngOnInit() {
 this.defaultDate = new Date().toISOString().split('T')[0];
  //  this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
  //    ? localStorage.getItem('originCode')
  //    : this.sharedService.getSelectedValue();
 this.userType = localStorage.getItem('userType');
 console.log("userType >>>>>",this.userType)

  if (this.userType === 'Admin') {
    this.sharedService.selectedValue$.subscribe(value => {
      this.sessionLocationCode = value;
      this.loadConsignerData();
      this.getPermission();
      console.log('sessionLocationCode updated from sharedService:', value);
    });
  } else {
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.getPermission();
  }

//  this.consignerCode = localStorage.getItem('consignerCode') || '';
  this.selectedCustType = localStorage.getItem('custType') || '';
  this.loadConsignerData();
    this.renderForm();
    this.getLabelData();
    const savedAwbType = localStorage.getItem('awbType');
    if (savedAwbType) {
      this.awbType = savedAwbType;
    }
    this.userType = localStorage.getItem('userType');
    this.username = localStorage.getItem('userName');
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    this.ClientName = localStorage.getItem('ClientName');
    this.customerName = localStorage.getItem('customerName');
    this.CompanyPrint = localStorage.getItem('CompanyPrint');
    this.checkBranchSelection();
    if (this.userType === 'Admin') {
      this.selectedOrigin = this.sharedService.getBranchType();
      this.sessionLocationCode = this.selectedOrigin;
    } else {
      this.sessionLocationCode = localStorage.getItem('originCode');
      this.sessionLocationName = localStorage.getItem('originName');
      this.selectedOrigin = this.sessionLocationCode;
    }
    // localStorage.removeItem('custType');
    //         localStorage.removeItem('consignerCode');
    this.loadState();

    this.AllService.getDestinationDataa().subscribe((data) => {
      this.destinationList = data.Data;
      this.cityList = data.Data;
      this.filteredDestinationList = [...this.destinationList]; // Initialize with all items
    });
    this.AllService.getOriginData().subscribe((data) => {
      this.originList = data.Data;
    });
    this.AllService.getCountryData().subscribe((data) => {
      this.countryList = data.Data;
        const india = this.countryList.find(c => c.countryCode === 'IN');
        if (india) {
          this.bookingForm.patchValue({
            countryName: india.countryCode
          });
          this.countryName = india.countryCode;
        }
    })
    this.loadVendorData();
    this.loadMode();
    this.loadProduct();
    this.deliveryTypeData();
    this.packageTypeData();
    this.getPinCode(event);
    // this.addressList();
    this.getLabelData();
  this.setControlState();

  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getCurrentDate(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  onScrollToEnd() {
    this.scrollTrigger$.next();
  }
  onCitySelect(cityCode: string) {
    this.cityName = cityCode;
  }
  onSearch(searchTerm: string) {
    if (!searchTerm) {
      this.filteredDestinationList = [...this.destinationList];
    } else {
      this.filteredDestinationList = this.destinationList.filter(item =>
        item.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.destinationCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }
 fetchViaData(event: any) {
    this.destinationName = event;
    this.loadVia(event);
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  setControlState() {
    if (this.userType === 'Customer') {
      this.bookingForm.get('consignerName')?.disable();
      this.bookingForm.get('custType')?.disable();
    } else {
      this.bookingForm.get('consignerName')?.enable();
      this.bookingForm.get('custType')?.enable();
    }
  }
    checkBranchSelection(): void {
      if (this.selectedOrigin === 'All') {
        this.openSnackBar('Please select a specific branch.', 'error-snackbar')
        this.bookingForm.get('awbType')?.enable();
        this.bookingForm.get('awbNo')?.enable();
        this.disableButtons = true;
      } else {
        this.disableButtons = false;
      }
    }
  //   freightCharge() {
  //     if (this.chargedWt && this.ratePerKg && this.chargedWt > 0 && this.ratePerKg > 0) {
  //         this.newFreightAmt = this.ratePerKg * this.chargedWt;
  //         this.newFreightAmt = parseFloat(this.newFreightAmt.toFixed(2));
  //         this.bookingForm.get('freightAmt').setValue(this.newFreightAmt);

  //         this.bookingService.calculateGst(this.sessionLocationCode, this.newFreightAmt, this.consignerCode, this.selectedProduct)
  //             .subscribe((resp) => {
  //                 this.gstPer = resp.Data[0].GSTPer;
  //                 localStorage.setItem('gstPer', this.gstPer);
  //                 this.gstPer = localStorage.getItem('gstPer');
  //                 this.freightGST = Number(this.newFreightAmt * this.gstPer) / 100;
  //                 this.calculateTotalAmount();
  //             });
  //     } else {
  //         this.bookingForm.get('freightAmt').setValue(0);
  //         this.newFreightAmt = 0;
  //         this.freightGST = 0;
  //         this.calculateTotalAmount();
  //     }
  // }
freightCharge() {
  if (this.chargedWt && this.ratePerKg && this.chargedWt > 0 && this.ratePerKg > 0) {
    this.newFreightAmt = this.ratePerKg * this.chargedWt;
    this.newFreightAmt = parseFloat(this.newFreightAmt.toFixed(2));
    this.bookingForm.get('freightAmt')?.setValue(this.newFreightAmt);
  } else {
    this.bookingForm.get('freightAmt')?.setValue(0);
    this.newFreightAmt = 0;
    this.freightGST = 0;
  }
}
  ngAfterViewInit() {
    this.focusOnAwbNoInput();
    this.bookingForm.get('ratePerKg').valueChanges.subscribe(() => {
      this.freightCharge();
    });
    if (this.userType === 'Admin') {
      this.bookingForm.get('awbNo').valueChanges.subscribe(() => {
        this.selectedOrigin = localStorage.getItem('selectedValue');
        this.sessionLocationCode = this.selectedOrigin;
      });
    } else {
      this.sessionLocationCode = localStorage.getItem('originCode');
      this.sessionLocationName = localStorage.getItem('originName');
      this.selectedOrigin = this.sessionLocationCode;
    }
 const chargeFields = [
    'freightAmt',
    'discountAmt',
    'docketCharge',
    'fovCharge',
    'odaCharge',
    'packingCharge',
    'insuranceCharge',
    'loadingCharge',
    'otherCharge',
    'fuelCharge',
    'consignerCode',
    'selectedProduct'
  ];

  chargeFields.forEach(field => {
     this.bookingForm.get(field)?.valueChanges
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe(() => this.calculateTotalAmount());
  });

    this.bookingForm.get('awbType').valueChanges.subscribe(value => {
      if (value === 'Auto') {
        this.bookingForm.get('awbNo')?.disable();
      } else {
        this.bookingForm.get('awbNo')?.enable();
      }
    });
  }
  saveAwbType(): void {
    localStorage.setItem('awbType', this.awbType);
    this.bookingForm.patchValue({ awbType: this.awbType });
    this.bookingForm.updateValueAndValidity(); // Force validation update
  }

  showValidationMessage(): boolean {
    return this.awbType === 'Manual';
  }

  renderForm() {
    this.validationMessage = {
      awbType: [ { } ],
      awbNo: [ {type: 'required' , message: 'Please Enter Awb No.'} ],
      bookDate: [ {type: 'required' , message: 'Select Date.'} ],
      expectedDeliveryDate: [{}],
      consignerName: [ {type: 'required' , message: 'Select Consigner Name.'} ],
      shipperName: [{}],
      consigneeName: [{}],
      address1: [{}],
      address2: [{}],
      landMark: [{}],
      pinCode: [{type: 'pattern' , maxLength: 'Enter Valid PinCode.'}],
      cityName: [{}],
      stateName: [{}],
      countryName: [{}],
      mobileNo: [{}],
      custType: [{}],
      gstNo: [{}],
      emailId: [{}],
      billParty: [{}],
      savaConsignee: [{}],
      remark: [{}],
      srNo: [{}],
      selectedVendor1: [{}],
      forwardingNo: [{}],
      vendorChargedWt: [{}],
      modeName: [ {type: 'required' , message: 'Select Mode Name.'} ],
      productmode: [ {type: 'required' , message: 'Select Product Name.'} ],
      origin: [ {type: 'required' , message: 'Select Origin Name.'} ],
      destination: [ {type: 'required' , message: 'Select Destination Name.'} ],
      via: [{}],
      deliveryType: [{}],
      packageType: [{}],
      containerType: [{}],
      pcs: [{type: 'required' , message: 'Please Enter Quatity.'}],
      invoiceValue: [{}],
      actualWt: [{type: 'required' , message: 'Please Enter Actual Weight.'}],
      volumetricWt: [{}],
      chargedWt: [{}],
      actaulWeightType: [{}],
      ratePerKg: [{}],
      freightAmt: [{}],
      discountAmt: [{}],
      docketCharge: [{}],
      fovCharge: [{}],
      odaCharge: [{}],
      packingCharge: [{}],
      insuranceCharge: [{}],
      loadingCharge: [{}],
      otherCharge: [{}],
      fuelCharge: [{}],
      docketAction: [{}],
      fovAction: [{}],
      odaAction: [{}],
      packingAction: [{}],
      insuranceAction: [{}],
      loadingAction: [{}],
      fuelAction: [{}],
      eWayBill: [{}],
      invoiceNo: [{}]
    }

    this.bookingForm = this.formBuilder.group({
      awbType: new FormControl(this.awbType, Validators.required),
      awbNo: new FormControl('', Validators.compose([ Validators.required ])),
      bookDate: new FormControl('', Validators.compose([ Validators.required ])),
      expectedDeliveryDate: new FormControl('', Validators.compose([])),
      consignerName: new FormControl(this.consignerCode, Validators.compose([ Validators.required ])),
      shipperName: new FormControl(this.selectedShipper, Validators.compose([])),
      consigneeName: new FormControl(this.consigneeName, Validators.compose([])),
      address1: new FormControl(this.address1, Validators.compose([])),
      address2: new FormControl('', Validators.compose([])),
      landMark: new FormControl('', Validators.compose([])),
      pinCode: new FormControl(this.pinCode, Validators.compose([Validators.maxLength(6)])),
      cityName: new FormControl(this.cityName, Validators.compose([])),
      stateName: new FormControl(this.stateName, Validators.compose([])),
      countryName: new FormControl(this.countryName, Validators.compose([])),
      mobileNo: new FormControl('', Validators.compose([])),
      custType: new FormControl(this.selectedCustType, Validators.compose([])),
      gstNo: new FormControl('', Validators.compose([])),
      emailId: new FormControl('', Validators.compose([])),
      billParty: new FormControl(this.billParty, Validators.compose([])),
      savaConsignee: new FormControl(this.billParty, Validators.compose([])),
      remark: new FormControl('', Validators.compose([])),
      srNo: new FormControl('', Validators.compose([])),
      selectedVendor1: new FormControl('', Validators.compose([])),
      forwardingNo: new FormControl('', Validators.compose([])),
      vendorChargedWt: new FormControl('', Validators.compose([])),
      modeName: new FormControl(this.selectedMode, Validators.compose([ Validators.required ])),
      productmode: new FormControl(this.selectedProduct, Validators.compose([ Validators.required ])),
      origin: new FormControl(this.selectedOrigin, Validators.compose([ Validators.required ])),
      destination: new FormControl(this.destinationName, Validators.compose([ Validators.required ])),
      via: new FormControl(this.via, Validators.compose([])),
      deliveryType: new FormControl(this.deliveryType, Validators.compose([])),
      packageType: new FormControl(this.packageType, Validators.compose([])),
      containerType : new FormControl(this.containerType, Validators.compose([])),
      pcs: new FormControl(this.quantity, Validators.compose([Validators.required])),
      invoiceValue: new FormControl('', Validators.compose([])),
      actualWt: new FormControl(this.actualWt, Validators.compose([Validators.required])),
      volumetricWt: new FormControl('', Validators.compose([])),
      chargedWt: new FormControl('', Validators.compose([])),
      actaulWeightType: new FormControl('', Validators.compose([])),
      ratePerKg: new FormControl('', Validators.compose([])),
      freightAmt: new FormControl('', Validators.compose([Validators.required])),
      discountAmt: new FormControl('', Validators.compose([])),
      docketCharge: new FormControl('', Validators.compose([])),
      fovCharge: new FormControl('', Validators.compose([])),
      odaCharge: new FormControl('', Validators.compose([])),
      packingCharge: new FormControl('', Validators.compose([])),
      insuranceCharge: new FormControl('', Validators.compose([])),
      loadingCharge: new FormControl('', Validators.compose([])),
      otherCharge: new FormControl('', Validators.compose([])),
      fuelCharge: new FormControl('', Validators.compose([])),
      docketAction: new FormControl('', Validators.compose([])),
      fovAction: new FormControl('', Validators.compose([])),
      odaAction: new FormControl('', Validators.compose([])),
      packingAction: new FormControl('', Validators.compose([])),
      insuranceAction: new FormControl('', Validators.compose([])),
      loadingAction: new FormControl('', Validators.compose([])),
      fuelAction: new FormControl('', Validators.compose([])),
      eWayBill: new FormControl('', Validators.compose([])),
      invoiceNo: new FormControl('', Validators.compose([])),
      subTotalAmt: new FormControl('', Validators.compose([])),
      totalAmount: new FormControl('', Validators.compose([])),
    })
  }

  private focusOnAwbNoInput() {
    if (this.awbNoInput && this.awbNoInput.nativeElement) {
      this.awbNoInput.nativeElement.focus();
    }
  }

  // getCurrentDate(): any {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, '0');
  //   const day = String(today.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }
  async loadConsignerData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Booking/getConsigner?SessionLocationCode=` + this.sessionLocationCode);
      this.consignerList = resp.Data;
       if (this.consignerList && this.consignerList.length > 0) {
      // First, check if a previous value exists in localStorage
      const savedConsignerCode = localStorage.getItem('consignerCode');
      if (savedConsignerCode) {
        const matchedConsigner = this.consignerList.find(item => item.customerCode === savedConsignerCode);
        if (matchedConsigner) {
          this.consignerCode = matchedConsigner.customerCode;
        }
      }
    }
      if (this.userType === 'Customer') {
        const customer = this.consignerList.find(item => item.customerName === this.customerName);
      if (customer) {
        this.consignerCode = customer.customerCode;
        this.selectedCustType = customer.custType;
        this.fetchReleventData(customer.customerCode);
        // this.bookingForm.get('consignerName')?.disable();
      } else {
        console.error('Customer name not found in consignerList');
      }
      }
       if (this.consignerCode) {
        this.fetchReleventData(this.consignerCode);
      }
    } catch (error) {
      console.error('Error in loadConsignerData:', error);
    }
  }
  // tslint:disable-next-line:no-shadowed-variable
  // fetchReleventData(event: any) {
  //   const selectedConsigner = this.consignerList.find(item => item.customerCode === event);
  //   if (selectedConsigner) {
  //   this.selectedShipper = null;
  //   this.consigneeName = null;
  //     // this.consignerCode = selectedConsigner.customerCode;
  //     this.bookingForm.patchValue({
  //       consignerName: selectedConsigner.customerCode,
  //       custType: selectedConsigner.custType
  //     });
  //     this.selectedCustType = selectedConsigner.custType;
  //     this.loadShipper(selectedConsigner.customerCode);
  //     this.loadConsignee(event);
  //   }
  // }

// Inside fetchReleventData
// tslint:disable-next-line:no-shadowed-variable
fetchReleventData(event: any) {
  const selectedConsigner = this.consignerList.find(item => item.customerCode === event);
  if (selectedConsigner) {
    this.selectedShipper = null;
    this.consigneeName = null;

    this.bookingForm.patchValue({
      consignerName: selectedConsigner.customerCode
    });

    if (!this.awbInputFeild) {
      this.bookingForm.patchValue({
        custType: selectedConsigner.custType
      });
      this.selectedCustType = selectedConsigner.custType;
    }

    this.loadShipper(selectedConsigner.customerCode);
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
  // tslint:disable-next-line:no-shadowed-variable
  // findShipperDetails(event: any) {
  //   const ShipperCode = event.target.value;
  //   this.bookingService.getShipperDetail(ShipperCode).subscribe(
  //     (resp: any) =>  {
  //     if (resp.status === 1) {
  //       this.shipperAdd1 = resp.Data[0].ShipperAdd1;
  //       this.shipperAdd2 = resp.Data[0].ShipperAdd2;
  //       this.shipperCity = resp.Data[0].CityCode;
  //       this.shipperEmail = resp.Data[0].ShipperEmail;
  //       this.shipperGSTNo = resp.Data[0].GSTNo;
  //       this.shipperName = resp.Data[0].ShipperName;
  //       this.shipperPhone = resp.Data[0].ShipperPhoneNo;
  //       this.shipperPinCode = resp.Data[0].ShipperPincode;
  //       this.shipperStateCode = resp.Data[0].stateCode;
  //       this.DestinationCode = resp.Data[0].countryCode;
  //       this.ShipperSave = resp.Data[0].ShipperAdd1;
  //     } else {
  //     }
  //   })
  // }
onShipperSelected(selected: any) {
  const rawValue = this.bookingForm.get('shipperName')?.value?.trim();
  if (!rawValue) {
    return;
  }
  if (!selected) {
    // Clear all shipper-related fields
    this.shipperAdd1 = '';
    this.shipperAdd2 = '';
    this.shipperCity = '';
    this.shipperEmail = '';
    this.shipperGSTNo = '';
    this.shipperName = '';
    this.shipperPhone = '';
    this.shipperPinCode = '';
    this.shipperStateCode = '';
    this.DestinationCode = '';
    this.ShipperSave = '';

    // Clear form controls
    this.bookingForm.controls.cityName.setValue('');
    this.bookingForm.controls.stateName.setValue('');
    this.bookingForm.controls.countryName.setValue('');
    return;
  }

  // const selected = this.shipperNameList.find(item =>
  //   item.shipperName === shipperName
  // );

  if (selected) {
    this.bookingService.getShipperDetail(selected.shipperCode).subscribe(
      (resp: any) => {
        if (resp.status === 1 && resp.Data.length > 0) {
          const data = resp.Data[0];
          this.shipperAdd1 = data.ShipperAdd1;
          this.shipperAdd2 = data.ShipperAdd2;
          this.shipperCity = data.CityCode;
          this.shipperEmail = data.ShipperEmail;
          this.shipperGSTNo = data.GSTNo;
          this.shipperName = data.ShipperName;
          this.shipperPhone = data.ShipperPhoneNo;
          this.shipperPinCode = data.ShipperPincode;
          this.shipperStateCode = data.stateCode;
          this.DestinationCode = data.countryCode;
          this.ShipperSave = data.ShipperAdd1;

          this.bookingForm.controls.cityName.setValue(data.CityCode);
          this.bookingForm.controls.stateName.setValue(data.stateCode);
          this.bookingForm.controls.countryName.setValue(data.countryCode);
        }
      },
      (error) => {
        console.error('Error in getShipperDetail:', error);
      }
    );
  }
}

  // openConsigneeModal() {
  //   const dialogRef = this.dialog.open(ConsigneeComponent, {
  //     data: {
  //       action: 'add',
  //       responseData: this.consigneeList,
  //     },
  //     width: '30rem',
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       this.selectedConsignee = res.consignee;
  //       this.addressList();
  //     }
  //   });
  // }
onConsigneeSelected(selected: any) {
  // const consigneeName = this.bookingForm.get('consigneeName')?.value?.trim();
  const rawValue = this.bookingForm.get('consigneeName')?.value?.trim();

  if (!rawValue) {
    return;
  }
  const [consigneeName, consigneeCode] = rawValue.split(' | ');
  this.selectedConsignee = consigneeName?.trim();

  if (!selected) {
    this.conAddress1 = '';
    this.consigneeAddress2 = '';
    this.consigneeLandmark = '';
    this.consigneePincode = '';
    this.consigneeCityName = '';
    this.consigneestateName = '';
    this.consigneestateCode = '';
    this.consigneecountryName = '';
    this.consigneePhoneNo = '';
    this.consigneeEmail = '';
    this.consigneeGST = '';
    this.CustomerName = '';
    this.bookingForm.patchValue({
    cityName: '',
    stateName: '',
  });
    return;
  }
//  const selected = this.consigneeList.find(item =>
//     item.ConsigneeName === consigneeName
//   );

  if (selected) {
    this.bookingService.getConsigneeDetail(selected.ConsigneeCode).subscribe(
      (resp) => {
        const data = resp.Data[0];
        this.conAddress1 = data.consigneeAdd1;
        this.consigneeAddress2 = data.consigneeAdd2;
        this.consigneeLandmark = data.consigneeLandmark;
        this.consigneePincode = data.consigneePincode;
        this.consigneeCityName = data.CityName;
        this.consigneestateName = data.stateName;
        this.consigneestateCode = data.stateCode;
        this.consigneecountryName = data.countryName;
        this.consigneePhoneNo = data.consigneePhoneNo;
        this.consigneeEmail = data.consigneeEmail;
        this.consigneeGST = data.GSTNo;
        this.CustomerName = data.CustomerName;
         this.bookingForm.patchValue({
              cityName: data.destinationCode,
              stateName: data.stateCode,
              countryName: data.countryCode
            });
      },
      (error) => {
        console.error('Error in getConsigneeDetail:', error);
      }
    );
  }
}
  // tslint:disable-next-line:no-shadowed-variable
  getPinCode(event: any) {
    this.pinCode = event.target.value;
    if (this.pinCode.length >= 4 && this.pinCode.length <= 6) {
      this.bookingService.getPincodeData(this.pinCode).subscribe(
        (resp) => {
          const data = resp.Data[0];
          this.bookingForm.controls.cityName.setValue(data.Destination_Code);
          this.bookingForm.controls.stateName.setValue(data.State_Code);
          this.bookingForm.controls.countryName.setValue(data.country_code);
        },
        (error) => {
          console.error('Error in getPinCode:', error);
        }
      );
    }
  }

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

  loadVendorData() {
    this.bookingService.getVendor().subscribe(
      (resp) => {
        this.vendorNames = resp.Data;
      },
      (error) => {
        console.error('Error in loadVendorData:', error);
      }
    );
  }

  loadMode() {
    this.bookingService.getMode().subscribe(
      (resp) => {
        this.modeList = resp.Data;
        const savedMode = localStorage.getItem('selectedMode');
        if (savedMode) {
          const matchedMode = this.modeList.find(item => item.Mode_code === savedMode);
          if (matchedMode) {
            this.selectedMode = matchedMode.Mode_code;
          }
        }
      },
      (error) => {
        console.error('Error in loadMode:', error);
      }
    );
  }

  loadProduct() {
    this.bookingService.getProduct().subscribe(
      (resp) => {
        this.productList = resp.Data;
        const savedProduct = localStorage.getItem('selectedProduct');
        if (savedProduct) {
          const matchedProduct = this.productList.find(item => item.productCode === savedProduct);
          if (matchedProduct) {
            this.selectedProduct = matchedProduct.productCode;
          }
        }
      },
      (error) => {
        console.error('Error in loadProduct:', error);
      }
    );
  }


  // tslint:disable-next-line:no-shadowed-variable
  // fetchViaData(event: any) {
  //   this.cityName = event;
  //   this.loadVia(event);
  // }

  loadVia(params: any) {
    this.bookingService.getDestManifest(params).subscribe(
      (resp) => {
        this.viaList = resp.Data.map((item: { DestManifest: any }) => item.DestManifest);
      },
      (error) => {
        console.error('Error in loadVia:', error);
      }
    );
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

  packageTypeData() {
    this.bookingService.getPackageType().subscribe(
      (resp) => {
        this.packageTypeList = resp.Data;
      },
      (error) => {
        console.error('Error in packageTypeData:', error);
      }
    );
  }

  openShipperModal(consignerCode: any) {
    const dialogRef = this.dialog.open(ActiveCustomerComponent, {
      data: {
        action: 'add',
        responseData: this.consignerCode,
        shipperAdd1: this.shipperAdd1,
        shipperAdd2: this.shipperAdd2,
        shipperEmail: this.shipperEmail,
        shipperGSTNo: this.shipperGSTNo,
        shipperStateCode: this.shipperStateCode,
        shipperPhone: this.shipperPhone,
        shipperPinCode: this.shipperPinCode,
        selectedShipper: this.bookingForm.get('shipperName')?.value,
        shipperCity: this.shipperCity,
        kycImage: this.kycImage,
        ShipperSave: this.ShipperSave
      },
      width: '35rem',
      disableClose: true,
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.isInputField = true;
        this.bookingForm.get('shipperName').setValue(res.shipperName);
        this.shipperAdd1 = res.shipperAdd1;
        this.shipperAdd2 = res.shipperAdd2;
        this.shipperCity = res.shipperCity;
        this.shipperEmail = res.shipperEmail;
        this.shipperGSTNo = res.shipperGSTNo;
        this.shipperName = res.shipperName;
        this.shipperPhone = res.shipperPhone;
        this.shipperPinCode = res.shipperPinCode;
        this.DestinationCode = res.DestinationCode;
        this.ShipperSave = res.ShipperSave ? 1 : 0;
        this.kycImage = res.kycImage;
      }
    });
  }

  openConsignerModal() {
    const dialogRef = this.dialog.open(ConsignerComponent, {
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

  openVendorModal(selectedVendor1: any, selectedProduct: any) {
    const dialogRef = this.dialog.open(VendorComponent, {
      data: {
        action: 'add',
        vendorSelected: selectedVendor1, selectedProduct,
        vendorVolumetriceData: this.vendorVolumetrice,
        totalChargeWeightVendor: this.vendorChargedWt
      },
      width: '52rem',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listData = result.data;
        this.vendorChargedWt = result.total;
        this.bookingForm.get('vendorChargedWt').setValue(result.total);
      }
    });
  }

  openVendorboxModal() {
    const dialogRef = this.dialog.open(VendorboxComponent, {
      data: {
        vendor2: this.vendor2,
        forwardNo2: this.forwarding2,
        vendor3: this.vendor3,
        forwardNo3: this.forwarding3
      },
      width: '25rem',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.vendorData = result;
        this.forwarding2 = result.forwarding2;
        this.forwarding3 = result.forwarding3;
        this.vendor2 = result.vendor2;
        this.vendor3 = result.vendor3;
      }
    });
  }

  openInvoiceModal() {
    const dialogRef = this.dialog.open(InvoiceValComponent, {
      data: {
        action: 'add',
        CustInvoiceData: this.CustInvoice,
        editMode: this.editEnabled,
        invoiceValue: this.invoiceValue,
      },
      width: '52rem',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.invoiceListData = res.data;
        this.invoiceValue = res.total;
        this.bookingForm.get('invoiceValue').setValue(res.total);
        this.eWayBill = res.ewayBillData;
        this.invoiceNo = res.invoiceData;
        this.eWayBill = res.ewayBillData;
        this.bookingForm.get('eWayBill').setValue(this.eWayBill);
        this.bookingForm.get('invoiceNo').setValue(this.invoiceNo);
      }
    });
  }

  performaModal() {
    const dialogRef = this.dialog.open(PerformaInvoiceComponent, {
      data: {
        action: 'add',
        performaListData: this.performaListData,
        editMode: this.editEnabled,
      },
      width: '96%',
      maxWidth: '90rem',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.performaListData = res.data;
      }
    });
  }
  openVolumetricModal(consignerCode: any, selectedProduct: any) {
    const dialogRef = this.dialog.open(VolumetricComponent, {
      data: {
        action: 'add',
        customerSelected: consignerCode, selectedProduct,
        previousQty: this.bookingForm.value.pcs,
        VolumetriceData: this.Volumetrice,
        editMode: this.editEnabled,
        totalChargeWeight: this.chargedWt,
        totalActWeight: this.actualWt,
        totalVolWeight: this.volumetricWt
      },
      width: '54rem',
      disableClose: true,
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.volListData = res.data;
        this.volumetrictotal = res.total;
        this.bookingForm.get('volumetricWt').setValue(res.total);
        this.compareWeights();
        this.actualWt = res.totalActWt;
        // this.bookingForm.get('volumetricWt').setValue(res.totalVolWt)
      }
    });
  }

  openBluedartModal( ) {
    const dialogRef = this.dialog.open(BluedartComponent, {
      data: {
        action: 'add',
      },
      width: '50rem',
      disableClose: true,
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.cafCharges = res.cafCharges;
        this.hdpCharges = res.hdpCharges;
        this.essCharges = res.essCharges;
        this.idcCharges = res.idcCharges;
        this.encCharges = res.encCharges;
        this.scCharges = res.scCharges;
        this.charge4 = res.charge4;
        this.charge5 = res.charge5;
        this.charge6 = res.charge6;
        this.charge7 = res.charge7;
        this.charge8 = res.charge8;
        this.charge9 = res.charge9;
      }
    });
  }

  openChargeReceivedModal() {
    const dialogRef = this.dialog.open(DepartmentComponent, {
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

  openCustModal() {
    const dialogRef = this.dialog.open(CustTypeAddComponent, {
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

  openVehicleModal() {
    const dialogRef = this.dialog.open(VehicleComponent, {
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

  openOtherModal() {
    const dialogRef = this.dialog.open(OtherFeatureComponent, {
      data: {
        action: 'add',
      },
      width: '30rem',
      disableClose: true,
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }
getGstDataWithoutModal(subTotalAmt: any, consignerCode: any) {
     if (!subTotalAmt || !consignerCode || !this.sessionLocationCode || !this.selectedProduct) { return; }

  this.httpService.get(`${environment.apiUrl}Booking/gstCalculate?sessionLocationCode=${this.sessionLocationCode}&totalAmt=${subTotalAmt}&customerCode=${consignerCode}&modeCode=${this.selectedProduct}`).then(resp => {
    const gstValue = resp.Data[0];

    if (gstValue) {
      this.GSTPer = gstValue.GSTPer;
      this.IGST = gstValue.IGST;
      this.CGST = gstValue.CGST;
      this.SGST = gstValue.SGST;
      this.IGSTAmt = gstValue.IGSTAmt;
      this.CGSTAmt = gstValue.CGSTAmt;
      this.SGSTAmt = gstValue.SGSTAmt;
      this.gstAmount = Number(gstValue.CGSTAmt + gstValue.IGSTAmt + gstValue.SGSTAmt);
    } else {
      console.error('Unexpected API response format', resp);
    }
  }).catch(error => {
    console.error('Error fetching GST data:', error);
  });
}

  openGstModal(consignerCode: any) {
    const dialogRef = this.dialog.open(GstBookingComponent, {
      data: {
        action: 'add',
        subTotalAmt: this.withoutGSTTotalAmt,
        consignerCode: this.consignerCode,
        modeCode : this.selectedProduct
      },
      width: '20rem',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.gstValue = result.gstValue;
      this.GSTPer = this.gstValue.GSTPer;
      this.IGST = this.gstValue.IGST;
      this.CGST = this.gstValue.CGST;
      this.SGST = this.gstValue.SGST;
      this.IGSTAmt = this.gstValue.IGSTAmt;
      this.CGSTAmt = this.gstValue.CGSTAmt;
      this.SGSTAmt = this.gstValue.SGSTAmt;
      this.gstAmount = result.totalGST;
    });
  }

  openLabelDialog() {
    const dialogRef = this.dialog.open(LabelComponent, {
      data: {
        action: 'add',
      },
      width: '40rem',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.lebelSet1 = res.txtlabel1;
        this.lebelSet2 = res.txtlabel2;
        this.lebelSet3 = res.txtlabel3;
        this.lebelSet4 = res.txtlabel4;
        this.lebelSet5 = res.charges1;
        this.lebelSet6 = res.charges2;
        this.lebelSet7 = res.charges3;
      }
    });
  }
  getLabelData() {
    this.bookingService.getLabelData(this.sessionLocationCode).subscribe(
      (resp) => {
        this.lebelSet5 = resp.Data[0].Charges_1;
        this.lebelSet6 = resp.Data[0].Charges_2;
        this.lebelSet7 = resp.Data[0].Charges_3;
        this.lebelSet1 = resp.Data[0].txt_label1;
        this.lebelSet2 = resp.Data[0].txt_label2;
        this.lebelSet3 = resp.Data[0].txt_label3;
        this.lebelSet4 = resp.Data[0].txt_label4;
      },
      (error) => {
        console.error('Error fetching label data:', error);
      }
    );
  }

  openEnableDialog () {
    const dialogRef = this.dialog.open(EnableLabelComponent, {
      data: {
        action: 'add'
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.isEddChecked = res.EDD;
        this.isShipperChecked = res.shipper;
        this.isDepartmentChecked = res.department;
        this.isConsigneeChecked = res.consignee;
        this.isAddressChecked = res.consigneeAdd;
        this.isBillPartyChecked = res.billParty;
        this.isRemarkChecked = res.remark;
        this.isSNoChecked = res.srNo;
        this.isVendorChecked = res.vendor;
        this.isForwardNoChecked = res.forwadingNo;
        this.isDelvTypeChecked = res.delvType;
        this.isPkgTypeChecked = res.pkgType;
        this.isDiscountChecked = res.discount;
        this.isDocketChecked = res.docketChg;
        this.isFovChecked = res.FOVChg;
        this.isOdaChecked = res.ODAChg;
        this.isPackingChrgChecked = res.charges1;
        this.isInsurranceChecked = res.charges2;
        this.isLoadingChecked = res.charges3;
        this.isOtherChrgChecked = res.otherCharge;
        this.isFuelChrgChecked = res.charges4;
         if (!this.isShipperChecked) {
      this.bookingForm.get('shipperName')?.disable();
    } else {
      this.bookingForm.get('shipperName')?.enable();
    }

     if (!this.isConsigneeChecked) {
      this.bookingForm.get('consigneeName')?.disable();
    } else {
      this.bookingForm.get('consigneeName')?.enable();
    }

    if (!this.isBillPartyChecked) {
      this.bookingForm.get('billParty')?.disable();
    } else {
      this.bookingForm.get('billParty')?.enable();
    }

    if (!this.isVendorChecked) {
      this.bookingForm.get('selectedVendor1')?.disable();
    } else {
      this.bookingForm.get('selectedVendor1')?.enable();
    }

     if (!this.isDelvTypeChecked) {
      this.bookingForm.get('deliveryType')?.disable();
    } else {
      this.bookingForm.get('deliveryType')?.enable();
    }

     if (!this.isPkgTypeChecked) {
      this.bookingForm.get('packageType')?.disable();
    } else {
      this.bookingForm.get('packageType')?.enable();
    }
      }
    });
  }

  getPermission() {
    this.bookingService.getPermission(this.sessionLocationCode).subscribe(
      (resp) => {
      this.edd = resp.Data[0].EDD;
      this.isEddChecked = this.edd === 1;

      this.shipper = resp.Data[0].Shipper;
      this.isShipperChecked = this.shipper === 1;

      this.consignee = resp.Data[0].Consignee;
      this.isConsigneeChecked = this.consignee === 1;
      if (!this.isConsigneeChecked) {
        this.bookingForm.get('consigneeName')?.disable();
      } else {
        this.bookingForm.get('consigneeName')?.enable();
      }
      this.cAdd = resp.Data[0].CAdd;
      this.isAddressChecked = this.cAdd === 1;

      this.remark = resp.Data[0].Remark;
      this.isRemarkChecked = this.remark === 1;

      this.srNo = resp.Data[0].srNo;
      this.isSNoChecked = this.srNo === 1;

      this.vendor = resp.Data[0].vendor;
      this.isVendorChecked = this.vendor === 1;
      if (!this.isVendorChecked) {
        this.bookingForm.get('selectedVendor1')?.disable();
      } else {
        this.bookingForm.get('selectedVendor1')?.enable();
      }
      this.forwardingNo = resp.Data[0].ForwadingNo;
      this.isForwardNoChecked = this.forwardingNo === 1;

      this.delVType = resp.Data[0].DelvType;
      this.isDelvTypeChecked = this.delVType === 1;
      if (!this.isDelvTypeChecked) {
        this.bookingForm.get('deliveryType')?.disable();
      } else {
        this.bookingForm.get('deliveryType')?.enable();
      }

      this.pkgType = resp.Data[0].PkgType;
      this.isPkgTypeChecked = this.pkgType === 1;
      if (!this.isPkgTypeChecked) {
        this.bookingForm.get('packageType')?.disable();
      } else {
        this.bookingForm.get('packageType')?.enable();
      }

      this.discount = resp.Data[0].Discount;
      this.isDiscountChecked = this.discount === 1;

      this.docketCharge = resp.Data[0].DocketChg;
      this.isDocketChecked = this.docketCharge === 1;

      this.docketCharge = resp.Data[0].DocketChg;
      this.isDocketChecked = this.docketCharge === 1;

      this.fovChrg = resp.Data[0].FOVChg;
      this.isFovChecked = this.fovChrg === 1;

      this.odaChrg = resp.Data[0].ODAChg;
      this.isOdaChecked = this.odaChrg === 1;

      this.charges1 = resp.Data[0].Charges1;
      this.isPackingChrgChecked = this.charges1 === 1;

      this.charges2 = resp.Data[0].Charges2;
      this.isInsurranceChecked = this.charges2 === 1;

      this.charges3 = resp.Data[0].Charges3;
      this.isLoadingChecked = this.charges3 === 1;

      this.charges4 = resp.Data[0].Charges4;
      this.isFuelChrgChecked = this.charges4 === 1;

      this.otherChrg = resp.Data[0].Other_Charge;
      this.isOtherChrgChecked = this.otherChrg === 1;

      this.department = resp.Data[0].Department;
      this.isDepartmentChecked = this.department === 1;
        if (!this.isShipperChecked) {
        this.bookingForm.get('shipperName')?.disable();
      } else {
        this.bookingForm.get('shipperName')?.enable();
      }

    },
    (error) => {
      console.error('Error fetching permissions:', error);
    }
   );
  }
  openConfirmationDialog(bookingNumber: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '24rem',
      data: { message: 'Are you sure you want to print?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
    if (Number(this.CompanyPrint) === 1) {
        this.openPrintDialog(bookingNumber);
      } else {
        this.printPDF(bookingNumber);
      }
      } else {
      this.openSnackBar('Download canceled', 'error-snackbar');
      }
    });
  }
  printPDF(awbNo: string) {
      const obj = {
        sessionLocationCode: this.sessionLocationCode,
        awbNo: awbNo,
        logolink: this.ClientLogo,
        // companyName: this.ClientName,
        companyCode: this.companyCode,
        companyFlag: Number(this.CompanyPrint),
      };
      const PdfUrl = `${environment.apiUrl}Booking/getDocketPrint`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      this.httpclient.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe(
        (blob: Blob) => {
          if (blob.size === 39) {
            alert('No data available for the entered AWB No.');
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
        },
        (error) => {
          console.error('API Error:', error);
          alert('Error fetching data. Please try again.');
        }
      );
  }
  openPrintDialog( bookingNumber: string) {
    const dialogRef = this.dialog.open(BookPrintComponent, {
      data: {
        action: 'add',
        bookingNumber: bookingNumber
      },
      width: '20rem',
      disableClose: true,
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }

  // compareWeights() {
  //   const actualWt = this.bookingForm.get('actualWt')?.value;
  //   const volumetricWt = this.bookingForm.get('volumetricWt')?.value || this.volumetrictotal;

  //   if ((actualWt === null || actualWt === '') && (volumetricWt === null || volumetricWt === '')) {
  //     this.chargedWt = 0;
  //   } else if (actualWt && volumetricWt) {
  //     this.chargedWt = Math.max(actualWt, volumetricWt);
  //   } else if (actualWt) {
  //     this.chargedWt = actualWt;
  //   } else if (volumetricWt) {
  //     this.chargedWt = volumetricWt;
  //   } else {
  //     this.chargedWt = 0;
  //   }
  //   this.freightCharge();
  // }
compareWeights() {
   const actualWt = Number(this.bookingForm.get('actualWt')?.value) || 0;
  const volumetricWt = Number(this.bookingForm.get('volumetricWt')?.value) || 0;

  let weight = 0;

  if (actualWt === 0 && volumetricWt === 0) {
    weight = 0;
  } else if (actualWt && volumetricWt) {
    weight = Math.max(actualWt, volumetricWt);
  } else if (actualWt) {
    weight = actualWt;
  } else if (volumetricWt) {
    weight = volumetricWt;
  } else {
    weight = 0;
  }

  // ✅ Rounding rule
  const decimalPart = weight - Math.floor(weight);
  if (decimalPart > 0.5) {
    this.chargedWt = Math.ceil(weight);
  } else if (decimalPart === 0.5) {
    this.chargedWt = Math.ceil(weight);
  } else {
    this.chargedWt = Math.floor(weight);
  }

  this.freightCharge();
}
  calculateTotalAmount(): void {
    const newFreightAmt = this.newFreightAmt || 0;
    const consignerCode = this.consignerCode || undefined;

    if (newFreightAmt === 0 && !consignerCode) {
      return;
    }

    const freightAmt = this.bookingForm.get('freightAmt').value || newFreightAmt || this.freightAmt || 0;
    const discount = this.bookingForm.get('discountAmt').value || this.discountAmt || 0;
    const docketChrgs = this.bookingForm.get('docketCharge').value || this.docketCharges || 0;
    const fovChrgs = this.bookingForm.get('fovCharge').value || this.fovCharge || 0;
    const odaChrgs = this.bookingForm.get('odaCharge').value || this.odaCharge || 0;
    const packingChrg = this.bookingForm.get('packingCharge').value || this.packingCharge || 0;
    const insuranceChrg = this.bookingForm.get('insuranceCharge').value || this.insuranceCharge || 0;
    const loadingChrg = this.bookingForm.get('loadingCharge').value || this.loadingCharge || 0;
    const otherChrg = this.bookingForm.get('otherCharge').value || this.otherCharge || 0;
    const fuelCharges = this.bookingForm.get('fuelCharge').value || this.fuelCharge || 0;

    const docketActionValue = this.bookingForm.get('docketAction').value || 'no';
    const fovActionValue = this.bookingForm.get('fovAction').value || 'no';
    const odaActionValue = this.bookingForm.get('odaAction').value || 'no';
    const packingActionValue = this.bookingForm.get('packingAction').value || 'no';
    const insuranceActionValue = this.bookingForm.get('insuranceAction').value || 'no';
    const loadingActionValue = this.bookingForm.get('loadingAction').value || 'no';
    const fuelActionValue = this.bookingForm.get('fuelAction').value || 'no';
    // tslint:disable-next-line:max-line-length
    this.subTotalAmt = freightAmt - discount + docketChrgs + fovChrgs + odaChrgs + packingChrg + insuranceChrg + loadingChrg + otherChrg + fuelCharges;
    this.getGstDataWithoutModal(this.subTotalAmt, this.consignerCode);

   // tslint:disable-next-line:max-line-length
    this.gstPer = localStorage.getItem('gstPer');

    // tslint:disable-next-line:max-line-length
    this.docketGST = docketActionValue === 'yes' ? parseFloat((this.bookingForm.get('docketCharge').value * this.gstPer / 100).toFixed(2)) : 0;
    this.fovGST = fovActionValue === 'yes' ? parseFloat((this.bookingForm.get('fovCharge').value * this.gstPer / 100).toFixed(2)) : 0;
    this.odaGST = odaActionValue === 'yes' ? parseFloat((this.bookingForm.get('odaCharge').value * this.gstPer / 100).toFixed(2)) : 0;
    // tslint:disable-next-line:max-line-length
    this.packingGST = packingActionValue === 'yes' ? parseFloat((this.bookingForm.get('packingCharge').value * this.gstPer / 100).toFixed(2)) : 0;
       // tslint:disable-next-line:max-line-length
    this.insuranceGST = insuranceActionValue === 'yes' ? parseFloat((this.bookingForm.get('insuranceCharge').value * this.gstPer / 100).toFixed(2)) : 0;
        // tslint:disable-next-line:max-line-length
    this.loadingGST = loadingActionValue === 'yes' ? parseFloat((this.bookingForm.get('loadingCharge').value * this.gstPer / 100).toFixed(2)) : 0;
    this.fuelGST = fuelActionValue === 'yes' ? parseFloat((this.bookingForm.get('fuelCharge').value * this.gstPer / 100).toFixed(2)) : 0;
    this.othersGST = parseFloat((this.bookingForm.get('otherCharge').value * this.gstPer / 100).toFixed(2));

    this.withoutGSTTotalAmt = Number(this.subTotalAmt) -
                              (docketActionValue === 'no' ? Number(docketChrgs) : 0) -
                              (fovActionValue === 'no' ? Number(fovChrgs) : 0) -
                              (odaActionValue === 'no' ? Number(odaChrgs) : 0) -
                              (packingActionValue === 'no' ? Number(packingChrg) : 0) -
                              (insuranceActionValue === 'no' ? Number(insuranceChrg) : 0) -
                              (loadingActionValue === 'no' ? Number(loadingChrg) : 0) -
                              (fuelActionValue === 'no' ? Number(fuelCharges) : 0);
    this.withoutGSTTotalAmt = parseFloat(Number(this.withoutGSTTotalAmt).toFixed(2)) || 0;
    this.totalAmount = parseFloat((Number(this.subTotalAmt) + Number(this.gstAmount)).toFixed(2));
    this.bookingForm.patchValue({ 'TotalAmount': this.totalAmount }, { emitEvent: false });
  }

  // tslint:disable-next-line:no-shadowed-variable
  preventTab(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }

  formSubmit(formData: any) {
    // if (this.bookingForm.valid) {
      const selectedConsigner = this.consignerList.find(item => item.customerCode === formData.consignerName);
      const awbNo = formData.awbNo ? formData.awbNo.trim() : '';
      if (this.awbType === 'Manual' && awbNo === '') {        this.openSnackBar('AWB Number is required', 'error-snackbar');
        return;
      }
      if ((formData.custType || this.selectedCustType) === 'Cash') {
        const freightValue = formData.freightAmt || this.newFreightAmt || this.freightAmt || 0;
        if (freightValue <= 0) {
          this.openSnackBar('Freight Amount is required', 'error-snackbar');
          return;
        }
      }

      const obj = {
        Session_LocationCode: this.sessionLocationCode,
        AwbNo: awbNo,
        userName: this.username,
        bookDate: formData.bookDate || this.defaultDate || '',
        dispatchDate: formData.expectedDeliveryDate || this.expectedDeliveryDate || null,
        customerCode: formData.consignerName || this.consignerCode,
        consigneeName: formData.consigneeName || this.consigneeName || this.selectedConsignee || this.CustomerName || '',
        consigneeadd1: formData.address1 || this.address1 || this.conAddress1 || '',
        consigneeadd2: formData.address2 || this.address2 || this.consigneeAddress2 || '',
        consigneeadd3: formData.landMark || this.landMark || this.consigneeLandmark || '',
        consigneePin: formData.pinCode || this.pinCode || this.consigneePincode || '',
        consigneeTel: formData.mobileNo || this.mobileNo || this.consigneePhoneNo || '',
        gstNo: formData.gstNo || this.gstNo || this.consigneeGST || '',
        consigneeEmail: formData.emailId || this.emailId || this.consigneeEmail,

        consigneeState: formData.stateName || '',
        consigneeCity: formData.cityName || '',
        consigneeCountry: formData.countryName || '',
        consigneeSave: formData.savaConsignee ? 1 : 0 || this.savaConsignee ? 1 : 0,
        consigneeCompanyName: '',
        ConsigneecontactPerson: '',

        clientType: formData.custType || this.selectedCustType ,
        billParty: formData.billParty || this.billParty,
        srNo: formData.srNo || '',
        remark: formData.remark || '',
        boxPcs: formData.containerType || this.containerType || '',
        packgeType: formData.packageType || this.packageType || '',
        deliveryType: formData.deliveryType || this.deliveryType || '',
        shipperCode: formData.shipperName || this.selectedShipper || '',
        trainFlight: '',
        trainFlightNo: '',

        ShipperAdd1: this.shipperAdd1 || '',
        ShipperAdd2: this.shipperAdd2 || '',
        ShipperAdd3: '',
        shipperDestinationCode: this.shipperCity || '',
        ShipperEmail: this.shipperEmail || '',
        Shipper_gstNo: this.shipperGSTNo || '',
        ShipperName: this.shipperName || formData.shipperName || this.selectedShipper || '',
        Shipperphone: this.shipperPhone || '',
        Shipperpin: this.shipperPinCode || '',
        Shipperstatecode: this.shipperStateCode || '',
        // DestinationCode: this.DestinationCode || '',
        ShipperSave: this.ShipperSave || 0,
        shipperCompanyName: '',
        shippercontactPerson: '',
        shipperCountryCode: '',

        KYCNo: '',
        KYCtype: '',
        KYCimage: this.kycImage,

        productCode: formData.productmode || this.selectedProduct || '',
        ModeCode: formData.modeName || this.selectedMode || '',
        originCode: formData.origin || this.selectedOrigin || '',
        destinationCode: formData.destination || this.destinationName || '',
        qty: formData.pcs || '',
        ActualWt: formData.actualWt || 0,
        VolumetricWt: formData.volumetricWt || this.volumetrictotal || 0,
        DelvTime: '',
        VendorCode1: formData.selectedVendor1 || this.selectedVendor1 || '',
        VendorAwbNo1: formData.forwardingNo || '',
        VendorCode2: this.vendor2 || '',
        VendorAwbNo2: this.forwarding2 || '',
        VendorCode3: this.vendor3 || '',
        VendorAwbNo3: this.forwarding3 || '',
        VendorChargewt: this.vendorChargedWt || this.vendorChargedWt || 0,
        RatePerkg: formData.ratePerKg || 0,
        fovChrgs: formData.fovCharge || 0,
        FuelCharges: formData.fuelCharge || 0,
        DocketChrgs: formData.docketCharge || 0,
        ODAChrgs: formData.odaCharge || 0,
        GSTPer: this.GSTPer || 0,
        IGSTPer: this.IGST  || 0 ,
        CGSTPer: this.CGST || 0 ,
        SGSTPer: this.SGST || 0 ,
        IGST: this.IGSTAmt || 0,
        CGST: this.CGSTAmt || 0,
        SGST: this.SGSTAmt || 0,
        TotalAmt: formData.totalAmount || this.totalAmount || 0,
        otherCharges: formData.otherCharge || 0,
        Charges1: formData.packingCharge || 0,
        Charges2: formData.insuranceCharge || 0,
        Charges3: formData.loadingCharge || 0,
        Charges4: this.charge4 || 0,
        Charges5: this.charge5 || 0,
        Charges6: this.charge6 || 0,
        Charges7: this.charge7 || 0,
        Charges8: this.charge8 || 0,
        Charges9: this.charge9 || 0,
        Charges10: 0,
        ESSPer: 0,
        ESSAmt: this.essCharges || 0,
        vtcChrgs: 0,
        ODAKM: 0,
        IDCPer: 0,
        IDCCharges: this.idcCharges || 0,
        CAFPer: 0,
        CAFCharges: this.cafCharges || 0,
        ensCharges: this.encCharges || 0,
        scCharges: this.scCharges || 0,
        hdpCharges: this.hdpCharges || 0,
        Rate: formData.freightAmt || this.newFreightAmt || this.freightAmt || 0,
        FuelPer: 0,
        ServiceTax: this.gstAmount || 0,
        CustInvoice: this.invoiceListData || '',
        Volumetrice: this.volListData || '',
        PerformaInvoice: this.performaListData || '',
        vendorVolumetrice: this.listData || '',
        invValue: this.invoiceValue || formData.invoiceValue || 0,
        eWayBill: this.eWayBill || formData.eWayBill || '',
        invNo : this.invoiceNo || formData.invoiceNo || '',
        discountAmt: this.discountAmt || formData.discountAmt || 0,
        transpoterType : '',
        vehicleType : '',
        driverName : '',
        driverMobile : '',
        vehicleNo : '',
        brockerName : '',
        ChargedWt : formData.chargedWt || 0
      }
      this.consignerCode = selectedConsigner ? selectedConsigner.customerCode : '';
      this.selectedCustType = selectedConsigner ? selectedConsigner.custType : '';
      localStorage.setItem('custType', this.selectedCustType);
      localStorage.setItem('consignerCode', this.consignerCode);
      localStorage.setItem('selectedMode', this.selectedMode);
      localStorage.setItem('selectedProduct', this.selectedProduct);

      if (this.awbType === 'Manual') {
        // tslint:disable-next-line:max-line-length
        this.bookingService.checkAwbNo(this.sessionLocationCode, this.awbNo).subscribe(
          (resp) => {
          if (resp.status === 1) {
            this.bookingService.createBooking(obj).subscribe(
              (response) => {
              if (response.Status === 1) {
                this.openSnackBar( response.message, 'custom-snackbar')
                {
                  localStorage.removeItem('invoiceListData');
                  this.invoiceListData = '';
                  localStorage.removeItem('volListData');
                  localStorage.removeItem('updatedPerformaList');
                  this.volListData = '';
                  this.performaListData = '',
                  this.listData = '';
                  localStorage.removeItem('invoiceNumbers');
                  localStorage.removeItem('vendorVolumetrice');
                  localStorage.removeItem('invoiceNoList');
                  localStorage.removeItem('ewayBillList');
                  localStorage.removeItem('gstPer');
                  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                  this.router.onSameUrlNavigation = 'reload';
                  this.router.navigate([this.router.url]);
                }
              } else {
                this.openSnackBar(response.message, 'error-snackbar');
              }
            });
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        })
      } else {
        this.bookingService.createBooking(obj).subscribe(
          (response) =>  {
          if (response.Status === 1) {
            this.openSnackBar(response.message, 'custom-snackbar')
            const bookingNumber = response.message.split(' ')[0];
            this.openConfirmationDialog(bookingNumber);
            {
              localStorage.removeItem('invoiceListData');
              this.invoiceListData = '';
              localStorage.removeItem('volListData');
              localStorage.removeItem('updatedPerformaList');
              this.performaListData = '',
              this.volListData = '';
              this.listData = '';
              localStorage.removeItem('invoiceNumbers');
              localStorage.removeItem('vendorVolumetrice');
              localStorage.removeItem('invoiceNoList');
              localStorage.removeItem('ewayBillList');
              localStorage.removeItem('gstPer');
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate([this.router.url]);
            }
          } else {
            this.openSnackBar(response.message, 'error-snackbar')
          }
        });
      }
    // } else {
    //   Object.keys(this.bookingForm.controls).forEach((field) => {
    //     const control = this.bookingForm.get(field);
    //     control.markAsTouched({ onlySelf: false });
    //   });
    // }
  }

  // tslint:disable-next-line:no-shadowed-variable
  findEditAwbNo(event: any) {
    this.awbNo = event.target.value;
    // this.destinationName = ''; // Selected destination name

    if (this.awbNo && this.selectedOrigin === 'All') {
      this.openSnackBar('Please select a specific branch.', 'error-snackbar')
      event.target.value = '';
      this.awbNo = '';
      event.target.focus();
      return;
    }
    this.checkBranchSelection();
          // tslint:disable-next-line:max-line-length
          this.bookingService.getBookingDetails(this.awbNo, this.sessionLocationCode).subscribe(
            (resp: any) => {
          if (resp.status === 1) {
            this.awbInputFeild = true;
            this.updateEnabled = true;
            this.deleteDisabled = false;
            this.editEnabled = true;
            this.selectedProduct = resp.Data.data.Product_Code;
            this.destinationName = resp.Data.data.Destination_code;
            this.defaultDate = resp.Data.data.bookDate;
            this.consignerCode = resp.Data.data.Customer_Code;
            this.selectedMode = resp.Data.data.Mode_code;
            // this.selectedProduct = resp.Data.data.Product_Code;
            // this.cityName = resp.Data.data.Consignee_City;
            this.selectedOrigin = resp.Data.data.Origin_code;
            this.actualWt = resp.Data.data.ActualWt;
            this.billParty = resp.Data.data.BillParty;
            this.quantity = resp.Data.data.qty;
            this.containerType = resp.Data.data.box_pcs;
            this.deliveryType = resp.Data.data.deliveryTName;
            this.packageType = resp.Data.data.packgeTName;

            this.serialNo = resp.Data.data.S_No;
            this.remarks = resp.Data.data.Remark;
            this.vendorChargedWt = resp.Data.data.VendorChargewt;
            this.chargedWt = resp.Data.data.ChargedWt;

            this.selectedVendor1 = resp.Data.data.Vendor_Code1;
            this.forwardNo = resp.Data.data.VendorAwbNo1;

            this.vendor2 = resp.Data.data.Vendor_Code2;
            this.forwarding2 = resp.Data.data.VendorAwbNo2;

            this.vendor3 = resp.Data.data.Vendor_Code3;
            this.forwarding3 = resp.Data.data.VendorAwbNo3;

            this.volumetricWt = resp.Data.data.VolumetricWt;
            this.totalAmount = resp.Data.data.TotalAmt;
            this.ratePerKg = resp.Data.data.RatePerkg;
            this.docketCharges = resp.Data.data.DocketChrgs;
            this.fovCharge = resp.Data.data.FOV_Chrgs;
            this.odaCharge = resp.Data.data.ODA_Chrgs;
            this.packingCharge = resp.Data.data.Charges1;
            this.insuranceCharge = resp.Data.data.Charges2;
            this.loadingCharge = resp.Data.data.Charges3;
            this.otherCharge = resp.Data.data.OtherCharges
            this.fuelCharge = resp.Data.data.FuelCharges;
            this.CustInvoice = resp.Data.CustInvoice;
            this.performaListData = resp.Data.PerformaInvoice;
            this.vendorVolumetrice = resp.Data.vendorVolumetrice;
            this.Volumetrice = resp.Data.Volumetrice;
            // this.selectedCustType = resp.Data.data.T_Flag;
            this.invoiceNo = resp.Data.data.InvoiceNo;
            this.invoiceValue = resp.Data.data.InvValue;
            this.eWayBill = resp.Data.data.EwayBill;
            this.freightAmt = resp.Data.data.Rate;
            this.discountAmt = resp.Data.data.Discount;
            this.gstAmount = resp.Data.data.ServiceTax;
            this.expectedDeliveryDate = resp.Data.data.dispatchDate;

            this.shipperAdd1 = resp.Data.data.ShipperAdd;
            this.shipperAdd2 = resp.Data.data.ShipperAdd2;
            this.shipperEmail = resp.Data.data.ShipperEmail;
            this.shipperGSTNo = resp.Data.data.Shipper_gstNo;
            this.shipperStateCode = resp.Data.data.Shipper_statecode;
            this.shipperPhone = resp.Data.data.Shipperphone;
            this.shipperPinCode = resp.Data.data.Shipperpin;
            // this.selectedShipper = resp.Data.data.Shipper_Name;
            this.bookingForm.patchValue({
              shipperName: resp.Data.data.Shipper_Name,
              custType: resp.Data.data.T_Flag,
              consigneeName: resp.Data.data.Consignee_Name
            });
            this.shipperCity = resp.Data.data.shipperCity
            // this.isInputField = !!this.selectedShipper;
            this.address1 = resp.Data.data.Consignee_Add1;
            this.address2 = resp.Data.data.Consignee_Add2;
            this.landMark = resp.Data.data.Consignee_Add3;
            this.cityName = resp.Data.data.Consignee_City;
            this.countryName = resp.Data.data.Consignee_Country;
            this.emailId = resp.Data.data.Consignee_Email;
            this.gstNo = resp.Data.data.Consignee_GST;
            this.pinCode = resp.Data.data.Consignee_Pin;
            this.stateName = resp.Data.data.Consignee_State;
            this.mobileNo = resp.Data.data.Consignee_Tel;
            // this.isInputField = true;
            this.isInputDisabled = true;
            this.fetchReleventData(this.consignerCode);
            this.loadShipper(this.consignerCode);
          } else {
            // this.resetFormState();
            // tslint:disable-next-line:max-line-length
            this.bookingService.checkAwbNo(this.sessionLocationCode, this.awbNo).subscribe(
              (respo) => {
              if (respo.status === 1) {
                // alert(respo.message)
              } else {
                this.openSnackBar(respo.message, 'error-snackbar')
              }
            },
            (error) => {
              console.error('Error fetching Awb details:', error);
            })
            this.formSubmit(this.bookingForm.value);
          }
        })
    }

  // openDeleteDialog() {
  //   const isConfirmed = window.confirm('Do you want to Delete these Booking?');
  //   if (isConfirmed) {
  //     this.bookingService.deleteBooking(this.bookingForm.value.awbNo).subscribe(
  //       (resp) => {
  //       if (resp.status === 1) {
  //             this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //             this.router.onSameUrlNavigation = 'reload';
  //             this.router.navigate([this.router.url]);
  //       } else {
  //         this.openSnackBar(resp.message, 'error-snackbar')
  //       }
  //     })
  //   } else {
  //   }
  // }
  openDeleteDialog(): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '30rem',
    data: {
      message: 'Please enter the reason for deleting this booking.',
      inputRequired: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (typeof result === 'string' && result.trim()) {
      const reason = result.trim();
      const awbNo = this.bookingForm.value.awbNo;
      const userName = this.username;

      this.bookingService.deleteBooking(awbNo, reason, userName).subscribe(resp => {
        if (resp.status === 1) {
          this.openSnackBar('Booking deleted successfully.', 'custom-snackbar');
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([this.router.url]);
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      });
    } else if (result === '') {
      this.openSnackBar('Deletion reason is required.', 'error-snackbar');
    } else {
      this.openSnackBar('Delete canceled.', 'error-snackbar');
    }
  });
}

// openUpdateConfirmationDialog(): void {
//   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//     width: '30rem',
//     data: { message: 'Please enter a reason for update', inputRequired: true }
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result && result.trim() !== '') {
//       this.updateForm(result);
//     } else if (result === '') {
//       this.openSnackBar('Update reason is required.', 'error-snackbar');
//     } else {
//       this.openSnackBar('Update canceled.', 'error-snackbar');
//     }
//   });
// }

  updateForm() {
    const selectedConsigner = this.consignerList.find(item => item.customerCode === this.bookingForm.value.consignerName);
        if ((this.bookingForm.value.custType || this.selectedCustType) === 'Cash') {
        const freightValue = this.bookingForm.value.freightAmt || this.newFreightAmt || this.freightAmt || 0;
        if (freightValue <= 0) {
          this.openSnackBar('Freight Amount is required', 'error-snackbar');
          return;
        }
      }
      const obj = {
        Session_LocationCode: this.sessionLocationCode,
        AwbNo: this.bookingForm.value.awbNo || this.awbNo,
        userName: this.username,
        bookDate: this.defaultDate || this.bookingForm.value.bookDate || '',
        dispatchDate: this.expectedDeliveryDate || null,
        customerCode: this.consignerCode || this.bookingForm.value.consignerName,
        consigneeName: this.consigneeName || this.bookingForm.value.consigneeName || '',
        consigneeadd1: this.address1 || this.bookingForm.value.address1 || '',
        consigneeadd2: this.address2 || this.bookingForm.value.address2 || '',
        consigneeadd3: this.landMark || this.bookingForm.value.landMark || '',
        consigneePin: this.pinCode || this.bookingForm.value.pinCode || '',
        consigneeTel: this.mobileNo || this.bookingForm.value.mobileNo || '',
        gstNo: this.gstNo || this.bookingForm.value.gstNo || '',
        clientType: this.bookingForm.value.custType || this.selectedCustType ,
        billParty: this.billParty || this.bookingForm.value.billParty,
        srNo: this.serialNo || this.bookingForm.value.srNo || '',
        remark: this.remarks || this.bookingForm.value.remark || '',
        boxPcs: this.containerType || this.bookingForm.value.containerType || '',
        packgeType: this.packageType || this.bookingForm.value.packageType  || '',
        deliveryType: this.deliveryType || this.bookingForm.value.deliveryType || '',
        shipperCode: this.selectedShipper || this.bookingForm.value.shipperName || '',
        productCode: this.selectedProduct || this.bookingForm.value.productmode || '',
        ModeCode: this.selectedMode || this.bookingForm.value.modeName || '',
        originCode: this.selectedOrigin || this.bookingForm.value.origin || '',
        destinationCode: this.bookingForm.value.destination || '',
        qty: this.bookingForm.value.pcs || this.quantity || '',
        ActualWt: this.actualWt || this.bookingForm.value.actualWt || 0,
        VolumetricWt: this.volumetricWt ||  this.bookingForm.value.volumetricWt || this.volumetrictotal || 0,
        DelvTime: '',
        VendorCode1: this.selectedVendor1 || this.bookingForm.value.selectedVendor1 || '',
        VendorAwbNo1: this.forwardNo || this.bookingForm.value.forwardingNo || '',
        VendorCode2: this.vendor2 || '',
        VendorAwbNo2: this.forwarding2 || '',
        VendorCode3: this.vendor3 || '',
        VendorAwbNo3: this.forwarding3 || '',
        VendorChargewt: this.vendorChargedWt || 0,
        RatePerkg: this.ratePerKg || this.bookingForm.value.ratePerKg || this.ratePerKg || 0,
        fovChrgs: this.fovCharge || this.bookingForm.value.fovCharge || 0,
        FuelCharges: this.fuelCharge || this.bookingForm.value.fuelCharge || 0,
        DocketChrgs: this.docketCharges || this.bookingForm.value.docketCharge || 0,
        ODAChrgs: this.odaCharge || this.bookingForm.value.odaCharge || 0,
        GSTPer: this.GSTPer || 0,
        IGSTPer: this.IGST  || 0 ,
        CGSTPer: this.CGST || 0 ,
        SGSTPer: this.SGST || 0 ,
        IGST: this.IGSTAmt || 0,
        CGST: this.CGSTAmt || 0,
        SGST: this.SGSTAmt || 0,
        TotalAmt: this.totalAmount || this.bookingForm.value.totalAmount || 0,
        otherCharges: this.otherCharge || this.bookingForm.value.otherCharge || 0,
        Charges1: this.packingCharge || this.bookingForm.value.packingCharge || 0,
        Charges2: this.insuranceCharge || this.bookingForm.value.insuranceCharge || 0,
        Charges3: this.loadingCharge || this.bookingForm.value.loadingCharge || 0,
        Charges4: this.charge4 || 0,
        Charges5: this.charge5 || 0,
        Charges6: this.charge6 || 0,
        Charges7: this.charge7 || 0,
        Charges8: this.charge8 || 0,
        Charges9: this.charge9 || 0,
        Charges10: 0,
        ESSPer: 0,
        ESSAmt: this.essCharges || 0,
        vtcChrgs: 0,
        ODAKM: 0,
        IDCPer: 0,
        IDCCharges: this.idcCharges || 0,
        CAFPer: 0,
        CAFCharges: this.cafCharges || 0,
        ensCharges: this.encCharges || 0,
        scCharges: this.scCharges || 0,
        hdpCharges: this.hdpCharges || 0,
        Rate: this.freightAmt || this.newFreightAmt || this.bookingForm.value.freightAmt || 0 ,
        FuelPer: 0,
        ServiceTax:  this.gstAmount || 0,
        // KYCimage: 'dddrfs',
        CustInvoice: this.invoiceListData ? this.invoiceListData : this.CustInvoice || ' ',
        Volumetrice: this.volListData ? this.volListData : this.Volumetrice || ' ',
        PerformaInvoice: this.performaListData || '',
        vendorVolumetrice: this.listData ? this.listData : this.vendorVolumetrice || ' ',
        invValue: this.invoiceValue || this.bookingForm.value.invoiceValue || 0,
        eWayBill: this.eWayBill || this.bookingForm.value.eWayBill || '',
        invNo : this.invoiceNo || this.bookingForm.value.invoiceNo || '',
        discountAmt: this.discountAmt || this.bookingForm.value.discountAmt || 0,
        transpoterType : '',
        vehicleType : '',
        driverName : '',
        driverMobile : '',
        vehicleNo : '',
        brockerName : '',
        consigneeEmail: this.emailId || this.consigneeEmail,
        ShipperAdd1: this.shipperAdd1 || '',
        ShipperAdd2: this.shipperAdd2 || '',
        ShipperAdd3: '',
        shipperDestinationCode: this.shipperCity || '',
        ShipperEmail: this.shipperEmail || '',
        Shipper_gstNo: this.shipperGSTNo || '',
        ShipperName: this.bookingForm.value.shipperName || this.selectedShipper || '',
        Shipperphone: this.shipperPhone || '',
        Shipperpin: this.shipperPinCode || '',
        Shipperstatecode: this.shipperStateCode || '',
        // DestinationCode: this.DestinationCode || '',
        ShipperSave: this.ShipperSave || 0,
        shipperCompanyName: '',
        shippercontactPerson: '',
        shipperCountryCode: '',
        KYCNo: '',
        KYCtype: '',
        KYCimage: this.kycImage,
        consigneeState: this.stateName || '',
        consigneeCity: this.cityName || '',
        consigneeCountry: this.countryName || '',
        consigneeSave: this.savaConsignee ? 1 : 0 || this.savaConsignee ? 1 : 0,
        consigneeCompanyName: '',
        ConsigneecontactPerson: '',
        trainFlight: '',
        trainFlightNo: '',
        ChargedWt : this.bookingForm.value.chargedWt || 0,
        Reason: '',
      }
      this.consignerCode = selectedConsigner ? selectedConsigner.customerCode : '';
      this.selectedCustType = selectedConsigner ? selectedConsigner.custType : '';
      localStorage.setItem('consignerCode', this.consignerCode);
      localStorage.setItem('custType', this.selectedCustType);
      localStorage.setItem('selectedMode', this.selectedMode);
      localStorage.setItem('selectedProduct', this.selectedProduct);
      this.bookingService.updateBooking(obj).subscribe(
        (response) => {
          if (response.Status === 1) {
            this.openSnackBar(response.message, 'custom-snackbar')
            localStorage.removeItem('custType');
            localStorage.removeItem('consignerCode');
            {
              this.invoiceListData = '';
              this.volListData = '';
              this.listData = '';
              localStorage.removeItem('updatedPerformaList');
              this.performaListData = '',
              localStorage.removeItem('volListData');
              localStorage.removeItem('invoiceListData');
              localStorage.removeItem('invoiceNumbers');
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate([this.router.url]);
            }
          } else {
            this.openSnackBar(response.message, 'error-snackbar')
          }
        });
  }

}
