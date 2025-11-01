import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  // getPackageType() {
  //   return this.http.get(`${environment.apiUrl}Booking/getPackageType`)
  // }
  calculateGst(sessionLocationCode: string, totalAmt: number, customerCode: string, modeCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Booking/gstCalculate?sessionLocationCode=${sessionLocationCode}&totalAmt=${totalAmt}&customerCode=${customerCode}&modeCode=${modeCode}`);
  }

  getShipper(consignerCode: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/getShipper?customerCode=${consignerCode}`;
    return this.http.get(url);
  }

  getConsignee(customerCode: any): Observable<any> {
    const url = `${environment.apiUrl}/Booking/getConsignee?customerCode=${customerCode}`;
    return this.http.get(url);
  }

  getShipperDetail(shipperCode: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/getShipperDetail?shipperCode=${shipperCode}`;
    return this.http.get(url);
  }
  getProduct(): Observable<any> {
    const url = `${environment.apiUrl}Booking/getProduct`;
    return this.http.get(url);
  }
  getConsigneeDetail(consigneeCode: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/getConsigneeDetail?consigneeCode=${consigneeCode}`;
    return this.http.get(url);
  }

  getPincodeData(pinCode: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/getPincodeData?pinCode=${pinCode}`;
    return this.http.get(url);
  }

  getState(): Observable<any> {
    const url = `${environment.apiUrl}Booking/getState`;
    return this.http.get(url);
  }

  getVendor(): Observable<any> {
    const url = `${environment.apiUrl}Manifest/getVendor`;
    return this.http.get(url);
  }

  getMode(): Observable<any> {
    const url = `${environment.apiUrl}Booking/getMode`;
    return this.http.get(url);
  }

  getDestManifest(destinationCode: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/getDestManifest?destinationCode=${destinationCode}`;
    return this.http.get(url);
  }

  getDeliveryType(): Observable<any> {
    const url = `${environment.apiUrl}Booking/getDeliverType`;
    return this.http.get(url);
  }

  getPackageType(): Observable<any> {
    const url = `${environment.apiUrl}Booking/getPackageType`;
    return this.http.get(url);
  }
  getGstData(sessionLocationCode: string, totalAmt: any, customerCode: any, modeCode: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/gstCalculate?sessionLocationCode=${sessionLocationCode}&totalAmt=${totalAmt}&customerCode=${customerCode}&modeCode=${modeCode}`;
    return this.http.get(url);
  }
  getLabelData(sessionLocationCode: string): Observable<any> {
    const url = `${environment.apiUrl}Booking/getChargesName?sessionLocationCode=${sessionLocationCode}`;
    return this.http.get(url);
  }
  getPermission(sessionLocationCode: string): Observable<any> {
    const url = `${environment.apiUrl}Booking/getInputpermission?SessionLocationCode=${sessionLocationCode}`;
    return this.http.get(url);
  }

  checkAwbNo(sessionLocationCode: string, awbNo: string): Observable<any> {
    const url = `${environment.apiUrl}Booking/checkAwbNo?sessionLocationCode=${sessionLocationCode}&awbNo=${awbNo}`;
    return this.http.get(url);
  }
  createBooking(obj: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/bookingCreate`;
    return this.http.post(url, obj);
  }
  getBookingDetails(awbNo: string, sessionLocationCode: string): Observable<any> {
    const url = `${environment.apiUrl}Booking/getBooking?AwbNo=${awbNo}&sessionLocationCode=${sessionLocationCode}`;
    return this.http.get(url);
  }

  deleteBooking(awbNo: string, reason: string, userName: string): Observable<any> {
    const url = `${environment.apiUrl}Booking/deleteBooking?AwbNo=${awbNo}&Reason=${encodeURIComponent(reason)}&userName=${userName}`;
    return this.http.get<any>(url);
  }
  updateBooking(obj: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/bookingUpdate`;
    return this.http.post<any>(url, obj);
  }
  loadConsignerData(sessionLocationCode: string ): Observable<any> {
    const url = `${environment.apiUrl}Booking/getConsigner?SessionLocationCode=${sessionLocationCode}`;
    return this.http.get<any>(url);
  }
  // booking model

  getDividebyAndCFT(vendorCode: string, productCode: string): Observable<any> {
    const url = `${environment.apiUrl}Booking/getDividebyandCFTForVen?vendorCode=${vendorCode}&productCode=${productCode}`;
    return this.http.get<any>(url);
  }
  calculateVolumetricCharge(obj: any): Observable<any> {
    const url = `${environment.apiUrl}Booking/VolumetricCalc`;
    return this.http.post<any>(url, obj);
  }
  getChargesLabels(sessionLocationCode: string): Observable<any> {
    const url = `${environment.apiUrl}Booking/getChargesName?sessionLocationCode=${sessionLocationCode}`;
    return this.http.get<any>(url);
  }

  // import tab

  uploadExcelData(excelData: any): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}Booking/importEntry`, { exelData: excelData }, {
      reportProgress: true,
      observe: 'events'
    });
  }
  getBookingErrorLog(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Booking/getBookingErrorLog`);
  }
  truncateErrorLog(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Booking/truncateBookingImport`);
  }
//   getRate(destinationCode: string, customerCode: string, modeCode: string, productCode: string, actualWt: number, originCode: string) {
//   const url = `${environment.apiUrl}Booking/getRate?destinationCode=${destinationCode}&customerCode=$
// {customerCode}&modeCode=${modeCode}&productCode=${productCode}&actualWt=${actualWt}&originCode=${originCode}`;
//   return this.http.get<any>(url);
// }

getAllRate(customer: string, mode: string, product: string, origin: string, dest: string, weight: number, bookDate: string, invValue: number): Observable<any> {
  const url = `${environment.apiUrl}Booking/getAllRate?customer=${customer}&mode=${mode}&product=${product}&origin=${origin}&dest=${dest}&weight=${weight}&bookDate=${bookDate}&invValue=${invValue}`;
  return this.http.get(url);
}

verifyGSTNumber(gstNo: string) {
  return this.http.get(`${environment.apiUrl}verifyGST_No?GstNo=${gstNo}`);
}
}
