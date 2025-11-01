import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '../../../service/http.service';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  length: any;
  width: any;
  height: any;
  ncp = 1;
  cft: any;
  div: any;
  cftDefault: any;
  divideByDefault: any;
  volWeight: any;
  chargeWeight: any;
  actualWeight = 0;
  totalChargeWeightVendor: any;
  totalVolumetric = 0;
  cftEnabled: boolean;
  divideByEnabled: boolean;
  cftInputEnabled: boolean;
  divideByInputEnabled: boolean;
  vendorForm: any;
  validationMessage: any = [];
  VolumetricCharge: any;
  savedData: void;
  vendorListData: any[] = [];
  // tslint:disable-next-line:max-line-length
  // vendorListData: Array<{ Length: string, Width: string, Height: string, Qty: number, CFT: number, DivideBy: string, VolmetricWt: string, ActualWt: any, ChargeWt: any, VolumetricWt: any, NCP: any}> = [];
  vendorName: any;
  productName: any;
  valuesData: any;
  volumetricWt: any;
  act_Wt: any;
  chargedWt: any;
  previousQty: number;
  totalQty: any;
  qtyListData: any = [];
  vendorVolumetrice: any[] = [];
  cftBy: any;
  dividedBy: any;
  editMode: any;

  constructor(private _mdr: MatDialogRef<VendorComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private bookingService: BookingService ) {
                if (data) {
                (this.editMode = data.editMode),
                (this.vendorName = data.vendorSelected);
                this.productName = data.selectedProduct;
                this.vendorVolumetrice = data.vendorVolumetriceData || [];
                this.totalChargeWeightVendor = data.totalChargeWeightVendor;
              } else {
                this.vendorListData = [];
              }
            }

  ngOnInit(): void {
    // const value = JSON.parse(localStorage.getItem('vendorListData'));
    // if (value != null || undefined) {
    //   this.vendorListData = value;
    // } else {
    //   this.vendorListData = this.vendorVolumetrice;
    // }
    const value = JSON.parse(localStorage.getItem('vendorListData') || 'null');
    if (Array.isArray(value)) {
      this.vendorListData = value;
    } else if (Array.isArray(this.vendorVolumetrice)) {
      this.vendorListData = this.vendorVolumetrice;
    } else {
      this.vendorListData = [];
    }

    this.getApiData();
    this.vendorForm = this.formBuilder.group({
      length: new FormControl('', Validators.compose([Validators.required])),
      width: new FormControl('', Validators.compose([Validators.required])),
      height: new FormControl('', Validators.compose([Validators.required])),
      ncp: new FormControl('', Validators.compose([Validators.required])),
      cft: new FormControl('', Validators.compose([Validators.required])),
      div: new FormControl('', Validators.compose([Validators.required])),
      volumetricWt: new FormControl('', Validators.compose([])),
      chargeWeight: new FormControl('', Validators.compose([])),
      actualWeight: new FormControl('', Validators.compose([])),
    })

    this.validationMessage = {
      length: [{type: 'required', message: 'Please Enter length'}],
      width: [{type: 'required', message: 'Please Enter width'}],
      height: [{type: 'required', message: 'Please Enter height'}],
      ncp: [{type: 'required', message: 'Please Enter ncp'}],
      cft: [{type: 'required', message: 'Please Enter cft'}],
      div: [{type: 'required', message: 'Please Enter div'}],
      volumetricWt: [{type: 'required', message: 'Please Enter volWeight'}],
      chargeWeight: [{type: 'required', message: 'Please Enter chargeWeight'}],
      actualWeight: [{type: 'required', message: 'Please Enter actualWeight'}],
    }

  }

  getApiData(): void {
    this.bookingService.getDividebyAndCFT(this.vendorName, this.productName).subscribe(
      (resp: any) => {
        if (resp.status === 1) {
          this.cftDefault = resp.Data[0].cft;
          this.divideByDefault = resp.Data[0].divideBy;
          this.cftEnabled = true;
          this.divideByEnabled = true;
          this.cftInputEnabled = false;
          this.divideByInputEnabled = false;
        } else {
          this.cftEnabled = false;
          this.divideByEnabled = false;
          this.cftInputEnabled = true;
          this.divideByInputEnabled = true;
        }
      },
      (error) => {
        console.error('Error in getApiData:', error);
      }
    );
  }

  CloseDialog() {
    this._mdr.close();
  }

 calculateVolWt() {
    const obj = {
      length : this.vendorForm.value.length,
      width : this.vendorForm.value.width,
      height : this.vendorForm.value.height,
      qty : this.vendorForm.value.ncp,
      divideBy : this.vendorForm.value.div || this.divideByDefault || this.dividedBy,
      CFT : this.vendorForm.value.cft || this.cftDefault || this.cftBy,
   };
    this.volumetricWt = (obj.length * obj.width * obj.height / obj.divideBy * obj.CFT * obj.qty).toFixed(2);
  }

  compareValue() {
    if (this.volumetricWt > this.vendorForm.value.actualWeight ) {
      this.chargedWt = this.volumetricWt;
    } else {
      this.chargedWt = this.vendorForm.value.actualWeight;
    }
  }
   formSubmit(formData: any, form: NgForm) {
    if (this.vendorForm.valid) {
      const obj = {
        length : formData.length,
        width : formData.width,
        height : formData.height,
        qty : formData.ncp,
        divideBy : formData.div || this.divideByDefault,
        CFT : formData.cft || this.cftDefault,
        volWt: this.volumetricWt,
     };
          this.bookingService.calculateVolumetricCharge(obj).subscribe(
            resp => {
          this.VolumetricCharge = resp.Data[0].VolumetricCharge;
          const chargedWt = this.VolumetricCharge > formData.actualWeight ? this.VolumetricCharge : formData.actualWeight;
            // tslint:disable-next-line:max-line-length
            this.vendorListData.push({Length: obj.length, Width: obj.width, Height: obj.height, Qty: obj.qty, CFT: obj.CFT, DivideBy: obj.divideBy, VolmetricWt: obj.volWt,  ActualWt: formData.actualWeight, ChargeWt: chargedWt })
            this.calculateTotalChargeWeight();
            this.calculateTotalQty();
           console.log(this.vendorListData, 'hello Fazal');
            form.controls['length'].reset();
            form.controls['width'].reset();
            form.controls['height'].reset();
            form.controls['actualWeight'].reset();
            form.controls['ncp'].reset();
            form.controls['div'].reset();
            form.controls['cft'].reset();
            this.volumetricWt = '';
            this.chargedWt = '';
          })
         } else {
          alert('Total Quantity cannot exceed Previous Quantity');
           Object.keys(this.vendorForm.controls).forEach((field) => {
             const control = this.vendorForm.get(field);
             control.markAsTouched({ onlySelf: false });
           });
      }
  }

  saveData() {
    const volumetricTotal = parseFloat(this.totalChargeWeightVendor).toFixed(2);
    const obj = {
      data: this.vendorListData || this.vendorVolumetrice ,
      total: volumetricTotal
    }
    this._mdr.close(obj);
    localStorage.setItem('vendorListData', JSON.stringify(obj.data));
  }

  calculateTotalChargeWeight() {
    this.totalChargeWeightVendor = 0;
    this.vendorListData.forEach(item => {
      const chargeWt = parseFloat(item.ChargeWt || 0);
      this.totalChargeWeightVendor += chargeWt;
    });
  }

  calculateTotalVolumetricWeight() {
    this.totalVolumetric = 0;
    this.vendorListData.forEach(item => {
      const volmetricWt = parseFloat(item.VolumetricWt || 0);
      const actualWt = parseFloat(item.ActualWt || 0);
      item.ChargeWt = Math.max(volmetricWt, actualWt);
      // tslint:disable-next-line:radix
      this.totalVolumetric += parseInt(item.ChargeWt || 0);
    });
  }

  calculateTotalQty() {
    this.totalQty = 0;
    this.vendorListData.forEach(item => {
      // tslint:disable-next-line:radix
      const qty = parseInt(item.NCP || 0);
      this.totalQty += qty;
    });
  }

  deleteItem(index: any) {
    this.vendorListData.splice(index, 1);
    localStorage.setItem('vendorListData', JSON.stringify(this.vendorListData));
    this.calculateTotalChargeWeight();
    this.calculateTotalVolumetricWeight();
    this.calculateTotalQty();
  }

}
