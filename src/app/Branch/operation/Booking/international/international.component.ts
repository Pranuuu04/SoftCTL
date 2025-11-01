import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActiveCustomerComponent } from 'app/Branch/Shared/Shipper/active-customer.component';
import { BluedartComponent } from 'app/Branch/Shared/bluedart/bluedart.component';
import { ConsignerComponent } from 'app/Branch/Shared/consigner/consigner.component';
import { DepartmentComponent } from 'app/Branch/Shared/department/department.component';
import { InvoiceValComponent } from 'app/Branch/Shared/invoiceVal/invoice-val.component';
import { VendorComponent } from 'app/Branch/Shared/vendor/vendor.component';
import { VendorboxComponent } from 'app/Branch/Shared/vendorbox/vendorbox.component';
import { VolumetricComponent } from 'app/Branch/Shared/volumetric/volumetric.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-international',
  templateUrl: './international.component.html',
  styleUrls: ['./international.component.css']
})
export class InternationalComponent implements OnInit {

  // customerName: any;
  // originCode: any;
  // shipperName: any;
  // Consignee: any;
  // item: any;
  // consigneeAdd1: string;
  // consigneeAdd2: string;
  // consigneeLandmark: string;
  // consigneePincode: string;
  // consigneePhoneNo: string;
  // consigneeEmail: string;
  // isPushed: boolean = false;
  // showBox: boolean = true;
  // Mode: string;
  // Product: string;
  // Origin: string;
  // Destination: string;
  // custbool: boolean = false;


  constructor(public httpService: HttpService, public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.originCode = localStorage.getItem("originCode");
    // this.loadConsignerData();
    // this.loadShipper();
    // this.loadConsignee();
    // this.loadMode();
    // this.loadProduct();
    // this.loadOrigin();
    // this.loadDestination();
    // this.loadConsigneeDetails();
  }

  // loadConsignerData() {
  //   this.httpService
  //     .get(
  //       `${environment.apiUrl}/getConsigner?LocationCode=` +
  //         this.originCode
  //     )
  //     .then((resp) => {
  //       console.log(resp, "hello data");
  //       this.customerName = resp.Data;
  //     });
  // }

  // loadShipper() {
  //   this.httpService
  //     .get(`${environment.apiUrl}/getShipper`)
  //     .then((resp) => {
  //       console.log(resp, "loadShipper");
  //       this.shipperName = resp.data;
  //     });
  // }

  // loadConsignee() {
  //   this.httpService
  //     .get(`${environment.apiUrl}/getConsignee`)
  //     .then((resp) => {
  //       console.log(resp, "loadConsignee");
  //       this.Consignee = resp.Data;
  //       console.log(this.Consignee, " this.Consignee");
  //     });
  // }

  // loadConsigneeDetails(ConsigneeName: number, ConsigneeCode: string) {
  //   // Find the selected Consignee based on the ConsigneeCode
  //   const selectedConsignee = this.Consignee.find(
  //     (item: any) => item.ConsigneeCode === ConsigneeCode
  //   );
  //   console.log(selectedConsignee, " this.selectedConsignee");
  //   this.httpService.get(
  //     `${environment.apiUrl}/getConsigneeDetail?ConsigneeCode=${ConsigneeCode}`
  //   );
  //   // Update the address fields with the selected Consignee's details
  //   if (selectedConsignee) {
  //     // Update the address fields with the selected Consignee's details
  //     this.consigneeAdd1 = selectedConsignee.consigneeAdd1;
  //     this.consigneeAdd2 = selectedConsignee.consigneeAdd2;
  //     this.consigneeLandmark = selectedConsignee.consigneeLandmark;
  //     this.consigneePincode = selectedConsignee.consigneePincode;
  //     this.consigneePhoneNo = selectedConsignee.consigneePhoneNo;
  //     this.consigneeEmail = selectedConsignee.consigneeEmail;
  //   } else {
  //     // Handle the case when no matching Consignee is found
  //     console.log("No matching Consignee found");
  //     // You can choose to reset the fields or show an error message here.
  //   }
  // }
  // loadMode() {
  //   this.httpService
  //     .get(`${environment.apiUrl}/getMode`)
  //     .then((resp) => {
  //       console.log(resp, "loadMode");
  //       this.Mode = resp.Data;
  //       console.log(this.Mode, " this.Consignee");
  //     });
  // }
  // loadProduct(){
  //   this.httpService
  //   .get(`${environment.apiUrl}/getProduct`)
  //   .then((resp) => {
  //     console.log(resp, "loadProduct");
  //     this.Product = resp.Data;
  //     console.log(this.Product, " this.Product");
  //   });
  // }
  // loadOrigin(){
  //   this.httpService
  //   .get(`${environment.apiUrl}/getOrigin`)
  //   .then((resp) => {
  //     console.log(resp, "loadOrigin");
  //     this.Origin = resp.Data;
  //     console.log(this.Origin, " this.Origin");
  //   });
  // }
  // loadDestination(){
  //   this.httpService
  //   .get(`${environment.apiUrl}/getDestination`)
  //   .then((resp) => {
  //     console.log(resp, "loadDestination");
  //     this.Destination = resp.Data;
  //     console.log(this.Destination, " this.Destination");
  //   });

  // }
  // custOpen(event) {
  //   if (event.target.value == "Yes") {
  //     this.custbool = !this.custbool
  //   }
  // }


  // pushMe() {
  //   this.isPushed = true;
  //   this.showBox = false;
  // }
  // unPushMe() {
  //   this.isPushed = false;
  //   this.showBox = true;
  // }

  // openShipperModal() {
  //   const dialogRef = this.dialog.open(ActiveCustomerComponent, {
  //     data: {
  //       action: "add",
  //     },
  //     width: "35rem",
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       // this.gridColumns;
  //     }
  //   });
  // }

  // openConsignerModal(){
  //   const dialogRef = this.dialog.open(ConsignerComponent, {
  //     data: {
  //       action: "add",
  //     },
  //     width: "35rem",
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       // this.gridColumns;
  //     }
  //   });
  // }

  // openVendorModal(){
  //   const dialogRef = this.dialog.open(VendorComponent, {
  //     data: {
  //       action: "add",
  //     },
  //     width: "68rem",
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       // this.gridColumns;
  //     }
  //   });
  // }

  // openVendorboxModal(){
  //   const dialogRef = this.dialog.open(VendorboxComponent, {
  //     data: {
  //       action: "add",
  //     },
  //     width: "35rem",
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       // this.gridColumns;
  //     }
  //   });
  // }

  // openInvoiceModal(){
  //   const dialogRef = this.dialog.open(InvoiceValComponent, {
  //     data: {
  //       action: "add",
  //     },
  //     width: "35rem",
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       // this.gridColumns;
  //     }
  //   });
  // }

  // openVolumetricModal(){
  //   const dialogRef = this.dialog.open(VolumetricComponent, {
  //     data: {
  //       action: "add",
  //     },
  //     width: "65rem",
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       // this.gridColumns;
  //     }
  //   });
  // }
  // openBluedartModal(){
  //   const dialogRef = this.dialog.open(BluedartComponent, {
  //     data: {
  //       action: "add",
  //     },
  //     width: "35rem",
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       // this.gridColumns;
  //     }
  //   });
  // }
  // openChargeReceivedModal(){
  //   const dialogRef = this.dialog.open(DepartmentComponent, {
  //     data: {
  //       action: "add",
  //     },
  //     width: "35rem",
  //     disableClose: true,
  //     });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       // this.gridColumns;
  //     }
  //   });
  // }
  // openCommentDialog(){
  //   // this.dialog.open("#comment");
  //   document.getElementById("comment").style.display = 'block'

  // }

}
