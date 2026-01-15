import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDescriptionComponent } from 'app/Branch/Shared/billing/invoice-description/invoice-description.component';
import { AllServicesService } from 'app/service/all-services.service';
import { BillingService } from '../billing.service';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'app/service/shared.service';
import { startWith, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-billing-genrate',
  templateUrl: './billing-genrate.component.html',
  styleUrls: ['./billing-genrate.component.css']
})
export class BillingGenrateComponent implements OnInit, OnDestroy {

  invoiceNoEnable = true;
  selectedType = 'clientWise';
  selectedConsignorType = 'Single';
  areaOptions = [
    { label: 'International', value: 'international' },
    { label: 'Domestic', value: 'domestic' },
    { label: 'Intracity', value: 'intracity' }
  ];
  destinationList: any[] = [];
  sessionLocationCode: string;
  consigneeList: any;
  shipperList: any;
  customerList: any;
  LocationList: any;
  modeList: any;
  validationMessage: any = [];
  billingform: FormGroup;
  selectedCustomerCode: string;
  selectedValue: string;
  userType: string;
  isInvoiceVisible = false;
  fromDate: string;
  INVdate: string;
  ToDate: string;
private destroy$ = new Subject<void>();
  constructor(public dialog: MatDialog,
              private AllService: AllServicesService,
              private billingService: BillingService,
              private bookingService: BookingService,
              public formbuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private sharedService: SharedService
   ) { }

  ngOnInit(): void {
     this.sessionLocationCode = (localStorage.getItem('userType') === 'Admin')
    ? localStorage.getItem('selectedValue')
    : localStorage.getItem('originCode');
    this.userType = localStorage.getItem('userType');
    this.fromDate = this.getDefaultDate();
    this.ToDate = new Date().toISOString().split('T')[0];
    this.INVdate = new Date().toISOString().split('T')[0];
    this.loadMode();
        this.billingform = this.formbuilder.group({
          ClientType: new FormControl ('Credit', Validators.compose([ Validators.required])),
          Location: new FormControl (this.sessionLocationCode, Validators.compose([ Validators.required])),
          BillingType: new FormControl ('Monthly', Validators.compose([ Validators.required])),
          Consignor: new FormControl ('', Validators.compose([ Validators.required])),
          destination:  new FormControl([], Validators.compose([])),
          fromDate: new FormControl (this.fromDate, Validators.compose([ Validators.required])),
          toDate: new FormControl (this.ToDate, Validators.compose([ Validators.required])),
          billDate: new FormControl (this.INVdate, Validators.compose([ Validators.required])),
          billno:  new FormControl('', Validators.compose([])),
          Mode:  new FormControl('', Validators.compose([])),
          Shipper:  new FormControl('', Validators.compose([])),
          Consignee:  new FormControl('', Validators.compose([])),
          Type: new FormControl('clientWise'),
          selectedConsignorType: new FormControl(this.selectedConsignorType, Validators.compose([]))
        });
        this.billingform.get('Type')?.valueChanges.subscribe(type => {
          this.selectedType = type;
        });
  }
  ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
  getDefaultDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = 1;
    const formattedDate = `${year}-${this.padZero(month)}-${this.padZero(day)}`;
    return formattedDate;
  }
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  refresh() {
    this.AllService.getDestinationData().subscribe((data) => {
      this.destinationList = data.Data;
    });
    this.billingService.getLocation(this.sessionLocationCode).subscribe((data: any) => {
      this.LocationList = data.Data;
    });
     this.billingform.get('Location')?.valueChanges
    .pipe(
      startWith(this.billingform.get('Location')?.value),
      takeUntil(this.destroy$)
    )
    .subscribe((selectedLocation: string) => {
      if (selectedLocation) {
        this.billingService.getCustomer(selectedLocation)
          .subscribe((data) => this.customerList = data.Data);
      } else {
        this.customerList = [];
      }
    });

    }


  onConsignorChange(value:any): void {
    // this.selectedCustomerCode = customerCode;
    this.selectedCustomerCode = typeof value === 'object' ? value.customerCode : value;
      let branchCode ;
      if(this.userType === 'Admin'){
        branchCode = this.sessionLocationCode
       }else{
        branchCode =  this.billingform.get('Location')?.value;
       }
       if (!branchCode) return;

        this.billingService.getConsignee(branchCode, this.selectedCustomerCode)
          .subscribe((data: any) => {
            this.consigneeList = data.Data;
          });

        this.billingService.getShipper(branchCode, this.selectedCustomerCode)
          .subscribe((data: any) => {
            this.shipperList = data.Data;
          });  
   }


  onConsignorTypeChange(type: string): void {
    this.selectedConsignorType = type;
    this.invoiceNoEnable = type === 'Single';
    if (type === 'All') {
       this.billingform.patchValue({ Consignor: 'All' });
      this.billingform.get('Consignor')?.disable();
      this.billingform.get('Shipper')?.disable();
      this.billingform.get('Consignee')?.disable();
    } else if (type === 'Single') {
      this.billingform.get('Consignor')?.enable();
      this.billingform.get('Shipper')?.enable();
      this.billingform.get('Consignee')?.enable();
    }
  }
  onTypeChange(event: any): void {
    this.selectedType = event;
  }
 openDescription() {
    const dialogRef = this.dialog.open(InvoiceDescriptionComponent, {
      data: {
        action: 'add',
      },
      width: '40rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }
  loadMode() {
    this.bookingService.getMode().subscribe(
      (resp) => {
        this.modeList = resp.Data;
      },
      (error) => {
        console.error('Error in loadMode:', error);
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
  onSubmit(formValues: any): void {
    if (this.billingform.valid) {

      const payload = {
        sessionLocationCode: formValues.Location,
        fromDate: formValues.fromDate,
        toDate: formValues.toDate,
        CustomerCode: this.selectedConsignorType === 'All' ? 'All' : formValues.Consignor,
        ClientType: formValues.ClientType,
        destinationCode: formValues.destination || [],
        ShipperName: formValues.Shipper || null,
        ConsigneeName: formValues.Consignee || null,
        BillingCycle: formValues.BillingType,
        modeCode: formValues.Mode || null,
        billDate: formValues.billDate,
        billNo: formValues.billno || null,
        ConsignerType: formValues.selectedConsignorType
      };

      this.billingService.billGenerate(payload).subscribe(response => {
        if (response.status === 1) {
          this.openSnackBar( response.message, 'custom-snackbar')
            this.billingform.patchValue({
            BillingType: '',
            Consignor: '',
            destination: [],
            billno: '',
            Mode: '',
            Shipper: '',
            Consignee: ''
          });
        } else {
          this.openSnackBar( response.message, 'error-snackbar')
        }
      });
    } else {
      this.billingform.markAllAsTouched();
    }
  }

}
