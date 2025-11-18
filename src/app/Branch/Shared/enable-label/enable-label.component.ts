import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-enable-label',
  templateUrl: './enable-label.component.html',
  styleUrls: ['./enable-label.component.css']
})
export class EnableLabelComponent implements OnInit {

  sessionLocationCode: any;
  originName: any;
  username: any;

  isEddChecked: boolean;
  isShipperChecked: boolean;
  isDepartmentChecked: boolean;
  isConsigneeChecked: boolean;
  isAddressChecked: boolean;
  isBillPartyChecked: boolean;
  isRemarkChecked: boolean;
  isSNoChecked: boolean;
  isVendorChecked: boolean;
  isForwardNoChecked: boolean;
  isDelvTypeChecked: boolean;
  isPkgTypeChecked: boolean;
  isDiscountChecked: boolean;
  isDocketChecked: boolean;
  isFovChecked: boolean;
  isOdaChecked: boolean;
  isPackingChrgChecked: boolean;
  isInsurranceChecked: boolean;
  isLoadingChecked: boolean;
  isOtherChrgChecked: boolean;
  isFuelChrgChecked: boolean;

  addButton: any;
  billParty: any;
  bookDate: any;
  cAdd: any;
  charges1: any;
  charges2: any;
  charges3: any;
  charges4: any;
  charges5: any;
  charges6: any;
  charges7: any;
  charges8: any;
  consignee: any;
  delVType: any;
  department: any;
  discount: any;
  docketCharge: any;
  edd: any;
  fovChrg: any;
  forwardingNo: any;
  odaChrg: any;
  otherChrg: any;
  pkgType: any;
  remark: any;
  shipper: any;
  via: any;
  srNo: any;
  vendor: any;

  constructor(public _mdr: MatDialogRef<EnableLabelComponent>,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) {
              }

  ngOnInit(): void {
        this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');
this.getPermission();
  }

  getPermission() {
    this.httpService.get(`${environment.apiUrl}Booking/getInputpermission?SessionLocationCode=${this.sessionLocationCode}`).then(resp => {
      console.log(resp);
      this.edd = resp.Data[0].EDD;
      this.isEddChecked = this.edd === 1;

      this.billParty = resp.Data[0].BillParty;
      this.isBillPartyChecked = this.billParty === 1;

      this.shipper = resp.Data[0].Shipper;
      this.isShipperChecked = this.shipper === 1;

      this.consignee = resp.Data[0].Consignee;
      this.isConsigneeChecked = this.consignee === 1;

      this.cAdd = resp.Data[0].CAdd;
      this.isAddressChecked = this.cAdd === 1;

      this.remark = resp.Data[0].Remark;
      this.isRemarkChecked = this.remark === 1;

      this.srNo = resp.Data[0].srNo;
      this.isSNoChecked = this.srNo === 1;

      this.vendor = resp.Data[0].vendor;
      this.isVendorChecked = this.vendor === 1;

      this.forwardingNo = resp.Data[0].ForwadingNo;
      this.isForwardNoChecked = this.forwardingNo === 1;

      this.delVType = resp.Data[0].DelvType;
      this.isDelvTypeChecked = this.delVType === 1;

      this.pkgType = resp.Data[0].PkgType;
      this.isPkgTypeChecked = this.pkgType === 1;

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
    })
  }

  updateCheckboxEDD(isEddChecked: string) {
    this[isEddChecked] = !this[isEddChecked];
  }
  updateCheckboxShipper(isShipperChecked: string) {
    this[isShipperChecked] = !this[isShipperChecked];
  }
  updateCheckboxDepartment(isDepartmentChecked: string) {
    this[isDepartmentChecked] = !this[isDepartmentChecked];
  }
  updateCheckboxConsignee(isConsigneeChecked: string) {
    this[isConsigneeChecked] = !this[isConsigneeChecked];
  }
  updateCheckboxAddress(isAddressChecked: string) {
    this[isAddressChecked] = !this[isAddressChecked];
  }
  updateCheckboxBillParty(isBillPartyChecked: string) {
    this[isBillPartyChecked] = !this[isBillPartyChecked];
  }
  updateCheckboxRemark(isRemarkChecked: string) {
    this[isRemarkChecked] = !this[isRemarkChecked];
  }
  updateCheckboxSrNo(isSNoChecked: string) {
    this[isSNoChecked] = !this[isSNoChecked];
  }
  updateCheckboxVendor(isVendorChecked: string) {
    this[isVendorChecked] = !this[isVendorChecked];
  }
  updateCheckboxForwardNo(isForwardNoChecked: string) {
    this[isForwardNoChecked] = !this[isForwardNoChecked];
  }
  updateCheckboxDelvType(isDelvTypeChecked: string) {
    this[isDelvTypeChecked] = !this[isDelvTypeChecked];
  }

  updateCheckboxPkgTpye(isPkgTypeChecked: string) {
    this[isPkgTypeChecked] = !this[isPkgTypeChecked];
  }
  updateCheckboxDiscount(isDiscountChecked: string) {
    this[isDiscountChecked] = !this[isDiscountChecked];
  }
  updateCheckboxDocket(isDocketChecked: string) {
    this[isDocketChecked] = !this[isDocketChecked];
  }
  updateCheckboxFOV(isFovChecked: string) {
    this[isFovChecked] = !this[isFovChecked];
  }
  updateCheckboxODA(isOdaChecked: string) {
    this[isOdaChecked] = !this[isOdaChecked];
  }
  updateCheckboxPacking(isPackingChrgChecked: string) {
    this[isPackingChrgChecked] = !this[isPackingChrgChecked];
  }
  updateCheckboxIncCharge(isInsurranceChecked: string) {
    this[isInsurranceChecked] = !this[isInsurranceChecked];
  }
  updateCheckboxLoading(isLoadingChecked: string) {
    this[isLoadingChecked] = !this[isLoadingChecked];
  }
  updateCheckboxOther(isOtherChrgChecked: string) {
    this[isOtherChrgChecked] = !this[isOtherChrgChecked];
  }
  updateCheckboxFuel(isFuelChrgChecked: string) {
    this[isFuelChrgChecked] = !this[isFuelChrgChecked];
  }

  CloseDialog() {
    this._mdr.close(false);
  }
   openSnackBar(message: string, panelClass: string) {
     this.snackBar.open(message, 'Close', {
       duration: 3000,
       horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass: [panelClass]
     });
   }

  submitValue() {
    const obj = {
      sessionLocationCode: this.sessionLocationCode,
      bookDate: 1,
      EDD: this.isEddChecked ? 1 : 0,
      shipper: this.isShipperChecked ? 1 : 0,
      department: this.isDepartmentChecked ? 1 : 0,
      consignee: this.isConsigneeChecked ? 1 : 0,
      consigneeAdd: this.isAddressChecked ? 1 : 0,
      billParty: this.isBillPartyChecked ? 1 : 0,
      addButton: 1,
      remark: this.isRemarkChecked ? 1 : 0,
      srNo: this.isSNoChecked ? 1 : 0,
      vendor: this.isVendorChecked ? 1 : 0,
      forwadingNo: this.isForwardNoChecked ? 1 : 0,
      via: 1,
      delvType: this.isDelvTypeChecked ? 1 : 0,
      pkgType: this.isPkgTypeChecked ? 1 : 0,
      discount: this.isDiscountChecked ? 1 : 0,
      docketChg: this.isDocketChecked ? 1 : 0,
      FOVChg: this.isFovChecked ? 1 : 0,
      ODAChg: this.isOdaChecked ? 1 : 0,
      otherCharge: this.isOtherChrgChecked ? 1 : 0,
      charges1: this.isPackingChrgChecked ? 1 : 0,
      charges2: this.isInsurranceChecked ? 1 : 0,
      charges3: this.isLoadingChecked ? 1 : 0,
      charges4: this.isFuelChrgChecked ? 1 : 0,
      charges5: 1,
      charges6: 1,
      charges7: 1,
      charges8: 1,
    }
    this.httpService.post(`${environment.apiUrl}Booking/bookingInputPermission`, obj).then(resp => {
      this.openSnackBar(resp.message, 'custom-snackbar');
      this._mdr.close(obj);
    })
  }

}
