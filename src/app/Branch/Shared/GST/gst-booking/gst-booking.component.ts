import { HttpService } from 'app/service/http.service';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';
import { environment } from 'environments/environment';
import { BookingService } from 'app/Branch/operation/Booking/booking.service';

@Component({
  selector: 'app-gst-booking',
  templateUrl: './gst-booking.component.html',
  styleUrls: ['./gst-booking.component.css']
})
export class GstBookingComponent implements OnInit {

  subTotalAmt: any;
  consignerCode: any;
  sessionLocationCode: any;
  gstValue: any;
  totalGST: any;
  productCode: any;
  
  constructor(private bookingService: BookingService,
              private getData: AllServicesService,
              private _mdr: MatDialogRef<GstBookingComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              private fb:FormBuilder) {
                if (data.subTotalAmt || data.consignerCode) {
                  this.subTotalAmt = data.subTotalAmt;
                  this.consignerCode = data.consignerCode;
                  this.productCode = data.modeCode;
                  console.log(this.subTotalAmt);
                  console.log(this.consignerCode);
                }
              }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.getGstData();
  }
  getGstData(){
    this.bookingService.getGstData(this.sessionLocationCode, this.subTotalAmt, this.consignerCode, this.productCode).subscribe(
        (resp: any) => {
      this.gstValue = resp.Data[0];
      this.totalGST = Number(this.gstValue.CGSTAmt + this.gstValue.IGSTAmt + this.gstValue.SGSTAmt);
      // this.totalGST = Number(300+200+190);
    },
    (error) => {
      console.error('Error fetching GST data:', error);
    })
  }

  CloseDialog() {
    this._mdr.close(false);
  }

  savedata(){
    let obj = {
      gstValue: this.gstValue,
      totalGST: this.totalGST
    }
    this._mdr.close(obj);
  }

}
