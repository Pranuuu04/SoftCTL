import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';
import { AuditService } from 'app/Branch/audit/audit.service';

@Component({
  selector: 'app-bluedart',
  templateUrl: './bluedart.component.html',
  styleUrls: ['./bluedart.component.scss']
})
export class BluedartComponent implements OnInit {

  originCode: string;
  originName: string;
  chargeForm: FormGroup;
  getLabel4Changes: string;
  getLabel5Changes: string;
  getLabel6Changes: string;
  getLabel7Changes: string;
  getLabel8Changes: string;
  getLabel9Changes: string;
  consignerName: any;
  productmode: any;
  freightAmt: any;
  destination: any;
  origin: any;
  bookDate: any;

  constructor(private _mdr: MatDialogRef<BluedartComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private bookingService: BookingService,
            public auditService: AuditService) {
              this.consignerName = this.data.consignerName
              this.productmode = this.data.productmode
              this.freightAmt = this.data.freightAmt
              this.bookDate = this.data.bookDate
              this.destination = this.data.destination
              this.origin = this.data.origin
            }

  ngOnInit(): void {
    this.originCode = localStorage.getItem('originCode');
    this.originName = localStorage.getItem('originName');
    this.getLabelData();

    this.chargeForm = this.formBuilder.group({
      cafCharges: new FormControl('', Validators.compose([ ])),
      hdpCharges: new FormControl('', Validators.compose([])),
      essCharges: new FormControl('', Validators.compose([])),
      idcCharges: new FormControl('', Validators.compose([])),
      encCharges: new FormControl('', Validators.compose([])),
      scCharges: new FormControl('', Validators.compose([])),
      charge4: new FormControl('', Validators.compose([])),
      charge5: new FormControl('', Validators.compose([])),
      charge6: new FormControl('', Validators.compose([])),
      charge7: new FormControl('', Validators.compose([])),
      charge8: new FormControl('', Validators.compose([])),
      charge9: new FormControl('', Validators.compose([])),
    });
      if (this.data.cachedCharges) {
    this.chargeForm.patchValue(this.data.cachedCharges);
  }
  }

  getLabelData() {
    this.bookingService.getChargesLabels(this.originCode).subscribe(
      (resp: any) => {
      this.getLabel4Changes = resp.Data[0].Charges_4;
      this.getLabel5Changes = resp.Data[0].Charges_5;
      this.getLabel6Changes = resp.Data[0].Charges_6;
      this.getLabel7Changes = resp.Data[0].Charges_7;
      this.getLabel8Changes = resp.Data[0].Charges_8;
      this.getLabel9Changes = resp.Data[0].Charges_9;
    })
  }

  CloseDialog() {
    this._mdr.close(false);
  }
  fetchDialogCharge(chargeName: string, controlName: string) {
  const customerCode = this.consignerName;
  const productCode = this.productmode;
  const amount = this.freightAmt;
  const bookDate = this.bookDate;
  const destinationCode = this.destination;

  if (!customerCode || !productCode || !amount || !bookDate || !destinationCode) { return; }

  this.auditService.getChargeValue(chargeName, customerCode, productCode, amount, bookDate, destinationCode)
    .subscribe(
      (res: any) => {
        const value = res?.chargeAmount ?? 0;
        this.chargeForm.controls[controlName]?.patchValue(value);
      },
      (err) => {
        console.error(`Error fetching ${chargeName}`, err);
      }
    );
}


  formSubmit(formData: any) {
    const obj = {
        cafCharges: formData.cafCharges ?? 0,
        hdpCharges: formData.hdpCharges ?? 0,
        essCharges: formData.essCharges ?? 0,
        idcCharges: formData.idcCharges ?? 0,
        encCharges: formData.encCharges ?? 0,
        scCharges: formData.scCharges ?? 0,
        charge4: formData.charge4 ?? 0,
        charge5: formData.charge5 ?? 0,
        charge6: formData.charge6 ?? 0,
        charge7: formData.charge7 ?? 0,
        charge8: formData.charge8 ?? 0,
        charge9: formData.charge9 ?? 0,
      };
      this._mdr.close(obj);
    }

}
