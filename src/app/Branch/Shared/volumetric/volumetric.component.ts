import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '../../../service/http.service';
import { AllServicesService } from 'app/service/all-services.service';
import { environment } from 'environments/environment.prod';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';

@Component({
  selector: 'app-volumetric',
  templateUrl: './volumetric.component.html',
  styleUrls: ['./volumetric.component.scss']
})
export class VolumetricComponent implements OnInit {

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
  totalChargeWeight: any;
  totalVolumetric = 0;
  cftEnabled: boolean;
  divideByEnabled: boolean;
  cftInputEnabled: boolean;
  divideByInputEnabled: boolean;
  vendorForm: any;
  validationMessage: any = [];
  VolumetricCharge: any;
  savedData: void;
  volListData: any[] = [];
  customerName: any;
  productName: any;
  valuesData: any;
  volumetricWt: any;
  act_Wt: any;
  chargedWt: any;
  previousQty: number;
  totalQty: any;
  qtyListData: any = [];
  Volumetrice: any = [];
  cftBy: any;
  dividedBy: any;
  editMode: any;
  totalActWeight: any;
  totalVolWeight: any;
  MeasureType = 'CM';

  constructor(private _mdr: MatDialogRef<VolumetricComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              public bookingService: BookingService ) {
                if (data) {
                (this.editMode = data.editMode),
                (this.customerName = data.customerSelected);
                this.productName = data.selectedProduct;
                this.previousQty = data.previousQty;
                this.Volumetrice = data.VolumetriceData || [];
                this.totalChargeWeight = data.totalChargeWeight;
                this.totalActWeight = data.totalActWeight;
                this.totalVolumetric = data.totalVolWeight;
                // this.Volumetrice = data.VolumetriceData || [];
                // this.volListData = [...this.Volumetrice ];
              } else {
                this.volListData = [];
              }
            }

  ngOnInit(): void {
    // this.calculateTotalChargeWeight();
    // this.totalChargeWeight = localStorage.getItem('totalChargeWeight');
    // tslint:disable-next-line:prefer-const
    // let value = JSON.parse(localStorage.getItem('volListData'));
    // if (value != null || undefined) {
    //   this.volListData = value;
    // } else {
    //   this.volListData = this.Volumetrice;
    // }
    const value = JSON.parse(localStorage.getItem('volListData') || 'null');
    if (Array.isArray(value)) {
      this.volListData = value;
    } else if (Array.isArray(this.Volumetrice)) {
      this.volListData = this.Volumetrice;
    } else {
      this.volListData = [];
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
    // if (this.editMode) {
    //   this.patchVolListData();
    // }
  }
  // patchVolListData(): void {
  //   this.volListData = [...this.Volumetrice];
  // }
  // async getApiData() {
  //   try {
  // tslint:disable-next-line:max-line-length
  //     const resp = await this.httpService.get(`${environment.apiUrl}Booking/getDividebyandCFTForVol?customerCode=${this.customerName}&productCode=${this.productName}`);
  //     if (resp.status === 1) {
  //       this.cftDefault = resp.Data[0].cft;
  //       this.divideByDefault = resp.Data[0].divideBy;

  //       // Set the values in the form group
  //       this.vendorForm.patchValue({
  //         cft: this.cftDefault,
  //         div: this.divideByDefault
  //       });

  //       this.cftEnabled = true;
  //       this.divideByEnabled = true;
  //       this.cftInputEnabled = false;
  //       this.divideByInputEnabled = false;
  //     } else {
  //       this.cftEnabled = false;
  //       this.divideByEnabled = false;
  //       this.cftInputEnabled = true;
  //       this.divideByInputEnabled = true;
  //     }
  //   } catch (error) {
  //     console.error('Error in loadMode:', error);
  //     throw error;
  //   }
  // }
  async getApiData() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Booking/getDividebyandCFTForVol?customerCode=${this.customerName}&productCode=${this.productName}&MeasureType=${this.MeasureType}`);
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
    } catch (error) {
      console.error('Error in loadMode:', error);
      throw error;
    }
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
     if (this.vendorForm.value.ncp > 0) {
      this.volumetricWt = (obj.length * obj.width * obj.height / obj.divideBy * obj.CFT * obj.qty).toFixed(2);
    } else {
      alert('Please Insert Quantity atleast 1');
    }
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
    this.totalQty = this.totalQty || 0;
     // tslint:disable-next-line:radix
     const newTotalQty = this.totalQty + parseInt(obj.qty || 0);
      if (newTotalQty <= this.previousQty) {
        this.totalQty = Number(newTotalQty);
        this.bookingService.calculateVolumetricCharge(obj).subscribe(
          resp => {
          this.VolumetricCharge = resp.Data[0].VolumetricCharge;
              console.log(this.Volumetrice, 'this.Volumetrice');
              const finalChargeWeight = formData.chargeWeight ? formData.chargeWeight : Math.max(this.VolumetricCharge, formData.actualWeight);

              // const chargedWt = this.VolumetricCharge > formData.actualWeight ? this.VolumetricCharge : formData.actualWeight;
              console.log(typeof(this.volListData));

              // tslint:disable-next-line:max-line-length
              this.volListData.push({Length: obj.length, Width: obj.width, Height: obj.height, Qty: obj.qty, CFT: obj.CFT, DivideBy: obj.divideBy, VolmetricWt: obj.volWt,  ActualWt: formData.actualWeight, ChargeWt: finalChargeWeight })
              this.calculateTotalChargeWeight();
              this.calculateTotalActWeight();
              this.calculateTotalVolWeight();
              this.calculateTotalQty();
                form.controls['length'].reset();
                form.controls['width'].reset();
                form.controls['height'].reset();
                form.controls['actualWeight'].reset();
                form.controls['ncp'].reset();
                form.controls['chargeWeight'].reset();
                // form.controls['cft'].reset();
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
  }

  saveData() {
    const obj = {
      data: this.volListData || this.Volumetrice,
      total: this.totalChargeWeight,
      totalActWt: this.totalActWeight,
      totalVolWt: this.totalVolumetric
      // volumetricWt: this.volumetricWt
    }
    this._mdr.close(obj);
    localStorage.setItem('volListData', JSON.stringify(obj.data));
    // localStorage.setItem('Volumetrice', JSON.stringify(obj.data));
    // localStorage.setItem('totalVolumetric', JSON.stringify(obj.data));
    // localStorage.setItem('totalChargeWeight', this.totalChargeWeight);
  }
  calculateTotalChargeWeight() {
    this.totalChargeWeight = 0;
    this.volListData.forEach(item => {
      const chargeWt = parseFloat(item.ChargeWt || '0');
      this.totalChargeWeight += chargeWt;
    });
    this.totalChargeWeight = parseFloat(this.totalChargeWeight.toFixed(2));
  }
  calculateTotalActWeight() {
    this.totalActWeight = 0;
    this.volListData.forEach(item => {
      const ActualWt = parseFloat(item.ActualWt || '0');
      this.totalActWeight += ActualWt;
    });
    this.totalActWeight = parseFloat(this.totalActWeight.toFixed(2));
  }
  calculateTotalVolWeight() {
    this.totalVolumetric = 0;
    this.volListData.forEach(item => {
      const VolumetricWt = parseFloat(item.VolmetricWt || '0');
      this.totalVolumetric += VolumetricWt;
    });
    this.totalVolumetric = parseFloat(this.totalVolumetric.toFixed(2));
  }

  calculateTotalVolumetricWeight() {
    this.totalVolumetric = 0;
    this.volListData.forEach(item => {
      const volmetricWt = parseFloat(item.VolumetricWt || 0);
      const actualWt = parseFloat(item.ActualWt || 0);
      item.ChargeWt = Math.max(volmetricWt, actualWt).toFixed(2);
      // tslint:disable-next-line:radix
      this.totalVolumetric += parseInt(item.ChargeWt || 0);
    });
  }

  calculateTotalQty() {
    this.totalQty = 0;
    this.volListData.forEach(item => {
      // tslint:disable-next-line:radix
      const qty = parseInt(item.NCP || 0);
      this.totalQty += qty;
      console.log(this.totalQty, 'this.totalQty');
    });
  }

  deleteItem(index: any) {
    this.volListData.splice(index, 1);
    localStorage.setItem('volListData', JSON.stringify(this.volListData));
    // this.calculateTotalChargeWeight();
    // this.calculateTotalActWeight();
    // this.calculateTotalVolWeight();
    // this.calculateTotalVolumetricWeight();
    // this.calculateTotalQty();

    this.calculateTotalChargeWeight();
    this.calculateTotalActWeight();
    this.calculateTotalVolWeight();
    this.calculateTotalQty();
  }

}
