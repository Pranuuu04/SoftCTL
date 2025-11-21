import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-setup-report',
  templateUrl: './setup-report.component.html',
  styleUrls: ['./setup-report.component.css']
})
export class SetupReportComponent implements OnInit {

   reportSetup: any = {};
   columnMapping: { [key: string]: string } = {
  TripDate: 'Trip Date',
  TripNo: 'Trip No',
  AwbNo: 'AWB No',
  CustomerName: 'Customer Name',
  SupplierName: 'Supplier Name',
  VendorName: 'Vendor Name',
  VendorType: 'Vendor Type',
  VehicleNo: 'Vehicle No',
  VehicleType: 'Vehicle Type',
  DriverName: 'Driver Name',
  DriverNo: 'Driver No',
  Remark: 'Remark',
  Route: 'Route',
  OldRoute: 'Old Route',
  Origin: 'Origin',
  Destination: 'Destination',
  Status: 'Status',
  TripStatus: 'Trip Status',
  OpeningKM: 'Opening KM',
  ClosingKM: 'Closing KM',
  TotalKM: 'Total KM',
  ReceiverName: 'Receiver Name',
  ContactNo: 'Contact No',
  ReportingTime: 'Reporting Time',
  VehicleInDate: 'Vehicle In Date',
  VehicleInTime: 'Vehicle In Time',
  ReportingTimeStatus: 'Reporting Time Status',
  VehicleOutDate: 'Vehicle Out Date',
  VehicleOutTime: 'Vehicle Out Time',
  DispatchTime: 'Dispatch Time',
  DispatchTimeStatus: 'Dispatch Time Status',
  LoadingIn: 'Loading In',
  LoadingInDate: 'Loading In Date',
  LoadingInTime: 'Loading In Time',
  LoadingInTimeStatus: 'Loading In Time Status',
  LoadingOut: 'Loading Out',
  LoadingOutDate: 'Loading Out Date',
  LoadingOutTime: 'Loading Out Time',
  LoadingOutTimeStatus: 'Loading Out Time Status',
  TripStartDate: 'Trip Start Date',
  TripStartTime: 'Trip Start Time',
  StoreIn: 'Store In',
  StoreInDate: 'Store In Date',
  StoreInTime: 'Store In Time',
  ArrivingTimeStatus: 'Arriving Time Status',
  InTransit: 'Transit',
  ActualInTransit: 'Actual Transit',
  InTransitStatus: 'Transit Status',
  TripEndDate: 'Trip End Date',
  TripEndTime: 'Trip End Time',
  StoreOut: 'Store Out',
  StoreOutDate: 'Store Out Date',
  StoreOutTime: 'Store Out Time',
  StoreOutStatus: 'Store Out Status',
  TotalTripHrs: 'Total Trip Hrs',
  MHReturnHrs: 'MH Return Hrs',
  UserName: 'User Name',
  DeliveredRemark: 'Delivered Remark'
};
keepOriginalOrder = (a: any, b: any): number => {
  const keysOrder = Object.keys(this.columnMapping);
  return keysOrder.indexOf(a.key) - keysOrder.indexOf(b.key);
};
  constructor(
              private _mdr: MatDialogRef<SetupReportComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public AllService: AllServicesService, ) { }

  ngOnInit(): void {
     if (this.data.columnMapping) {
      this.columnMapping = this.data.columnMapping;   // ✅ use mapping from parent
    }
  //  this.loadReportSetup();
   const inputName = this.data.inputName
   this.AllService.getReportSetup(inputName).subscribe((resp: any) => {
    if (resp.status === 1 && resp.Data.length > 0) {
      this.reportSetup = resp.Data[0];
    }
  });
  }
CloseDialog() {
    this._mdr.close(false);
  }
trackByKey(index: number, item: any): string {
  return item.key;
}
  // loadReportSetup() {
  //   this.AllService.getReportSetup(this.data.inputName).subscribe((resp: any) => {
  //     if (resp.status === 1 && resp.Data.length > 0) {
  //       this.reportSetup = resp.Data[0];
  //     }
  //   });
  // }

  toggleChanged(key: string, event: any) {
    this.reportSetup[key] = event.checked ? 1 : 0;
    console.log(this.reportSetup);
  }

saveAndClose() {
  const saveApi = this.data.saveApi;
  this.AllService.saveReportSetup(saveApi, this.reportSetup).subscribe({
    next: () => {
      const selectedKeys = Object.keys(this.reportSetup).filter(k => this.reportSetup[k] === 1);
      this._mdr.close(selectedKeys);
    },
    error: () => {
      alert('Failed to save setup!');
    }
  });
 }
}
