import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'app/service/http.service';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';


@Component({
  selector: 'app-vendorbox',
  templateUrl: './vendorbox.component.html',
  styleUrls: ['./vendorbox.component.css']
})
export class VendorboxComponent implements OnInit {

  vendor2: any;
  selectedVendor3: any;
  forwardingNo2: any;
  forwardingNo3: any;
  validationMessage: any = [];
  bookingForm: any;
  vendorNames: any;
  selectedVendor2: any;
  selectedforwardingNo2: any;
  selectdVendor3: any;
  selectedforwardingNo3: any;


  constructor(private _mdr: MatDialogRef<VendorboxComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public httpService: HttpService,
              public formBuilder: FormBuilder,
              public bookingService: BookingService
              ) {
                if (data) {
                  this.vendor2 = data.vendor2;
                  this.forwardingNo2 = data.forwardNo2;
                  this.selectedVendor3 = data.vendor3;
                  this.forwardingNo3 = data.forwardNo3;
                }
              }

  ngOnInit(): void {
    this.loadVendorData();
    this.validationMessage = {
      vendor2: [ { } ],
      forwardingNo2: [ {type: 'required' , message: 'Please Enter Awb No.'} ],
      selectedVendor3: [ {type: 'required' , message: 'Select Date.'} ],
      forwardingNo3: [{}],
    }
    this.bookingForm = this.formBuilder.group({
      vendor2: new FormControl(this.vendor2, Validators.compose([ ])),
      forwardingNo2: new FormControl(this.forwardingNo2, Validators.compose([])),
      selectedVendor3: new FormControl(this.selectedVendor3, Validators.compose([])),
      forwardingNo3: new FormControl(this.forwardingNo3, Validators.compose([])),
    })
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
  CloseDialog() {
    this._mdr.close(false);
  }

  formSubmit(formData: any) {
    const obj = {
      vendor2:  formData.vendor2 || this.vendor2,
      forwarding2: formData.forwardingNo2,
      vendor3: formData.selectedVendor3 || this.selectedVendor3,
      forwarding3: formData.forwardingNo3,
    }
    this._mdr.close(obj);
  }

}
