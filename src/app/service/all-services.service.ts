import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';


@Injectable({
  providedIn: 'root'
})
export class AllServicesService {
  openModal = new BehaviorSubject<any>(false);
  openModal$ = this.openModal.asObservable();

  public caseData: any
  public volumetricData: any
  public vendor: any;
  VendorBoxData: any;
  DataInvoice: any;
  BluedartData: any;
  Datadept: any;
  recivecharge: any;
  sessionLocationCode: any;
  Shipper: any;

  public isToggleOn = new BehaviorSubject<boolean>(false);
  public isToggleOn1 = new BehaviorSubject<boolean>(false);
  toggleState = this.isToggleOn.asObservable();
  toggleStateDep = this.isToggleOn1.asObservable();
  public toggleValue = false;
  public toggleValue1 = false;
  dispatch: string;
  private destinationCache: any = null;

  newLabelName = '';

  printStyleActive = false;

  private printContentSource = new BehaviorSubject<string>('');
  printContent$ = this.printContentSource.asObservable();
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  private savedValue: string;

  private secondTableData = new BehaviorSubject<any[]>([]);
  secondTableData$ = this.secondTableData.asObservable();

  private totalChargeWeight = new BehaviorSubject<number>(0);
totalChargeWeight$ = this.totalChargeWeight.asObservable();

  // booking tab
  private cachedData$: Observable<any> | null = null;
  private cachedOriginData$: Observable<any> | null = null;
  private catchConsignerData$: Observable<any> | null = null;
  private catchCountryData$: Observable<any> | null = null;

  setToggleState(newState: boolean) {
    this.toggleValue = newState;
    this.isToggleOn.next(newState);

    // Save the state to local storage
    localStorage.setItem('toggleState', JSON.stringify(newState));
  }

  setToggleStateDep(newState: boolean) {
    this.toggleValue1 = newState;
    this.isToggleOn1.next(newState);

    // Save the state to local storage
    localStorage.setItem('toggleState1', JSON.stringify(newState));
  }

  setNewLabelName(newLabelName: string) {
    this.newLabelName = newLabelName;
  }

  getNewLabelName() {
    return this.newLabelName;
  }

  getToggleState(): boolean {
    return this.toggleValue;
  }

  getToggleStateDep(): boolean {
    return this.toggleValue1;
  }
  constructor(private http: HttpClient) {
    const savedState = localStorage.getItem('toggleState');
     if (savedState) {
       this.toggleValue = JSON.parse(savedState);
       this.isToggleOn.next(this.toggleValue);
     }
  }

  togglePrintStyle() {
    this.printStyleActive = !this.printStyleActive;
  }

  setPrintContent(content: string) {
    this.printContentSource.next(content);
  }
   updateData(newData: any) {
    this.dataSubject.next(newData);
  }

  addDaysInDate(date: Date, noOfDays: number) {
    const _date = new Date(date);
    const result = _date.setDate(_date.getDate() + noOfDays);
    return new Date(result);
  }
  reciveDatacase(send) {
    this.caseData = send

  }
  reciveVendor(reciveData) {
    this.vendor = reciveData

  }
  reciveShipper(reciveData) {
    this.Shipper = reciveData
    console.log(this.Shipper);


  }
  reciveDataVolumetric(data, volMetric) {
    this.volumetricData = volMetric

  }
  reciveDataVendorbox(data) {
    this.VendorBoxData = data


  }
  reciveBluedart(data) {
    this.BluedartData = data


  }
  reciveDataInvoice(data) {
    this.DataInvoice = data

  }
  reciveCharge(data) {
    this.recivecharge = data
  }
  reciveDept(data) {
    this.Datadept = data
  }

  paymentVerification(status: any) {
    return this.http.post<any>(`${environment.apiUrl}customerList`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getInActive() {
    return this.http.get<any>(`${environment.apiUrl}getinactive`)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getActive() {
    return this.http.get<any>(`${environment.apiUrl}getactive`)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getInactiveCustomerDetail(status) {
    return this.http.post<any>(`${environment.apiUrl}Inactivedetail`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getActiveCustomerDetail(status) {
    return this.http.post<any>(`${environment.apiUrl}Activedetail`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  customerVerified(customerCode, PlanID, status) {
    return this.http.post<any>(`${environment.apiUrl}CustActive?cust_code=${customerCode}&PlanId=${PlanID}`, { status })
      .pipe(
        map(res => {
          console.log(res, '....list')
          return res
        })
      )
  }

  getTopupData(status) {
    return this.http.post<any>(`${environment.apiUrl}activeTopup`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getNonTopupData(status) {
    return this.http.post<any>(`${environment.apiUrl}InactiveTopup`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getForecastData(status) {
    return this.http.post<any>(`${environment.apiUrl}forecast`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getRegularData(status) {
    return this.http.post<any>(`${environment.apiUrl}Regular`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getDisbursedData(status) {
    return this.http.post<any>(`${environment.apiUrl}Disbursed`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }
  getManualPayment() {
    return this.http.get<any>(`${environment.apiUrl}getPayList`)
      .pipe(
        map(res => {
          return res
        })
      )
  }
  getRefferalPayment() {
    return this.http.get<any>(`${environment.apiUrl}refgetPayList`)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  planQualify(code, slab, activeSlab) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<any>(`${environment.apiUrl}RefPlanActive?Referal_code=${code}&Slab=${slab}&ActiveSlab=${activeSlab}`, { code, slab, activeSlab })
      .pipe(
        map(res => {
          return res
        })
      )
  }
  // importExcel() {
  //   return this.http.post<any>('https://neotechnet.com/laxee/api/ReadFile','')
  //     .pipe(
  //       map(res => {
  //         return res
  //       })
  //     )
  // }
  importExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post('https://neotechnet.com/laxee/api/laxee/ReadFile', formData);
  }

  importRefExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post('https://neotechnet.com/laxee/api/laxee/RefReadFile', formData);
  }

  getSalesData(status) {
    return this.http.post<any>(`${environment.apiUrl}ReferalSales`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getRefManualData(status) {
    return this.http.post<any>(`${environment.apiUrl}refgetPayList`, { status })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  paymentDone(data) {
    return this.http.post<any>(`${environment.apiUrl}ForecastPaymentDone`, data)
      .pipe(
        map(res => {
          console.log(res, '...');
          return res
        })
      )
  }
  refPaymentDone(data) {
    return this.http.post<any>(`${environment.apiUrl}RefForecastPaymentDone`, { data })
      .pipe(
        map(res => {
          console.log(res, data, '...');
          return res
        })
      )
  }
  getMisData(data) {
    return this.http.post<any>(`${environment.apiUrl}Refplanlist`, { data })
      .pipe(
        map(res => {
          console.log(res, '...');
          return res
        })
      )
  }

  // getOriginData() {
  //   return this.http.get(`${environment.apiUrl}getOrigin`)
  // }
  getModeData() {
    return this.http.get(`${environment.apiUrl}getMode`)
  }
  getProductData() {
    return this.http.get(`${environment.apiUrl}getProduct`)
  }
  // getDestinationData() {
  //   return this.http.get(`${environment.apiUrl}getDestination`)
  // }

  getShipperData() {
    return this.http.get(`${environment.apiUrl}getShipper`)
  }
  getServiceData() {
    return this.http.get(`${environment.apiUrl}getConsignee`)
  }
  getConsigneeData() {
    return this.http.get(`${environment.apiUrl}getConsignee`)
  }
  getCustomerTypeData() {
    return this.http.get(`${environment.apiUrl}getCustomerType`)
  }
  getstatecodeTypeData() {
    return this.http.get(`${environment.apiUrl}getState`)
  }
  getCountrycodeTypeData() {
    return this.http.get(`${environment.apiUrl}getCountry`)
  }
  getVendorData() {
    return this.http.get(`${environment.apiUrl}getVendor`)
  }


  getDestPincode(DestPincode: number) {
    const destUrl = `${environment.apiUrl}checkPincode?Pincode=${DestPincode}`
    return this.http.get(`${environment.apiUrl}checkPincode?Pincode=${DestPincode}`)

  }
  getAWBData(Session_LocationCode: string, AWBNo: number) {
    Session_LocationCode = 'MUM'
    const url = `${environment.apiUrl}checkAwbNo?Session_LocationCode=${Session_LocationCode}&AWBNo=${AWBNo}`


    return this.http.get(`${environment.apiUrl}checkAwbNo?Session_LocationCode=${Session_LocationCode}&AWBNo=${AWBNo}`)
  }
  getConsigneeDetails(ConsigneeCode: any) {

    return this.http.get(`${environment.apiUrl}getConsigneeDetail?ConsigneeCode=${ConsigneeCode}`)
  }
  getpincode(consigneePin: number) {
    return this.http.get(`${environment.apiUrl}getPincodeDetails?consigneePin=${consigneePin}`)
  }
  getLocationCode(locationCode: any) {
    locationCode = 'PNQ'
    return this.http.get(`${environment.apiUrl}getConsigner?LocationCode=${locationCode}`)
  }
  getConsigner() {
   const locationCode = 'PNQ'
    return this.http.get(`${environment.apiUrl}getConsigner?LocationCode=${locationCode}`)
  }
  getConsignarDetails(ConsigneeCode: any) {

    return this.http.get(`${environment.apiUrl}getConsignerDetail?CustomerCode=${ConsigneeCode}`)
  }
  getDepartment() {

    return this.http.get(`${environment.apiUrl}getDepartment`)
  }

  postconsigneedata(data: any) {
    return this.http.post(`${environment.apiUrl}postConsingnee`, data)
  }


  getlabel() {
    return this.http.get(`${environment.apiUrl}chargesLabel`)
  }
  postAllData() {
console.log('this.vendor', this.vendor);

  const SendData = {
      'locationCode': 'MUM',
      'origin': this.caseData.Origin,
      'AwbNo': this.caseData.AWB,
      'customerCode': this.caseData.Consigner,
      'consigneeName': this.caseData.Consignee,
      'consigneeAdd1': this.caseData.add1,
      'consigneeAdd2': this.caseData.add2,
      'landmark': this.caseData.Lendmark,
      'ConsigneePin': this.caseData.pincode,
      'consigneeTel': this.caseData.phoneno,
      'consigneeGST': this.caseData.GSTNo,
      'ModeCode': this.caseData.Mode,
      'productCode': this.caseData.Product,
      'originCode': this.caseData.Origin,
      'destinationCode': this.caseData.Destination,
      'bookDate': this.caseData.book,
      'dispatchDate': this.caseData.Dispatch,
      't_Flag': this.caseData.CusoType,
      'qty': this.caseData.PcsBox,
      'actualWt': this.caseData.ActualWeight,
      'volumetricWt': this.caseData.VolMetricWt,
      'chargedWt': this.caseData.ChargedWt,
      'ratePerkg': this.caseData.RatePer,
      'rate': this.caseData.RatePer,
      'FOVChrgs': this.caseData.fovno,
      'FuelPer': '',
      'fuelCharges': this.caseData.FuelChrg,
      'docketChrgs': this.caseData.docket,
      'ESSPer': '',
      'ESSAmt': '',
      'VTC_Chrgs': '',
      'ODA_KM': '',
      'ODA_Chrgs': this.caseData.odano,
      'IDCPer': '',
      'IDCCharges': '',
      'CAFPer': '',
      'CAFCharges': '',
      'OtherCharges': this.BluedartData.OtherCharges,
      'Charges1': this.caseData.Topay,
      'Charges2': this.caseData.casePay,
      'Charges3': this.caseData.charge3,
      'Charges4': this.caseData.charge4,
      'Charges5': this.caseData.charge5,
      'Charges6': this.BluedartData.Charges6,
      'Charges7': this.BluedartData.Charges7,
      'Charges8': this.BluedartData.Charges8,
      'Charges9': this.BluedartData.Charges9,
      'Charges10': this.BluedartData.Charges10,
      'GSTPer': this.caseData.GST,
      'IGSTPer': '',
      'CGSTPer': '',
      'SGSTPer': '',
      'IGST': this.caseData.IGST,
      'CGST': this.caseData.CGST,
      'SGST': this.caseData.SGST,
      'ServiceTax': this.caseData.Service,
      'TotalAmt': this.caseData.TotalAmount,
      'vendorCode1': this.VendorBoxData.vendorCode1,
      'vendorRate': '',
      'vendorAwbNo1': this.VendorBoxData.vendorAwbNo1,
      'vendorProduct': '',
      'vendorWt': '',
      'vendorAmt': '',
      'vendorCode2': this.VendorBoxData.vendorCode2,
      'vendorAwbNo2': this.VendorBoxData.vendorAwbNo2,
      'vendorCode3': this.VendorBoxData.vendorCode3,
      'vendorAwbNo3': this.VendorBoxData.vendorAwbNo3,
      'vendorChargewt': '',
      'webAgent': '',
      'delvDT': '',
      'exptDateOfDelvDt': '2022-06-08 00:00:00',
      'DelvTime': '2022-06-08 00:00:00',
      'RecdDt': '2022-06-08 00:00:00',
      'InboundManifestNo': '',
      'InboundManifestDate': '2022-06-08 00:00:00',
      'InboundReceivingDate': '2022-06-08 00:00:00',
      'ManifestNo': '',
      'destinationManifest': '',
      'manifestDate': '2022-06-08 00:00:00',
      'manifestRunNo': '',
      'manifestFlgtNo': '',
      'manifestRemark': '',
      'manifestCSNNo': '',
      'PrintManiCount': '',
      'ManifestOrder': '',
      'bagNo': '',
      'bagDate': '2022-06-08 00:00:00',
      'doxSpx': '',
      'InvValue': '',
      'InvCurrency': '',
      'InvRemark': '',
      'actualShipper': '',
      'ShipperAdd': '',
      'SenderRef': '',

      'shipper': this.Shipper
      // [
      //   {
      //     "shipperName": this.caseData.Shipper,
      //     "stateCode": "",
      //     "add1": this.Shipper.add1,
      //     "add2": this.Shipper.add2,
      //     "pin": this.Shipper.pin,
      //     "phone": this.Shipper.ContactNo,
      //     "GSTNo": this.Shipper.GSTNo,
      //     "CustomerCode": this.caseData.Consigner,
      //     "Email": this.Shipper.Email
      //   }
      // ]
      ,
      'vendor': this.vendor
      //  [
      //   {
      //     "Length": this.vendor.contacts[0].length,
      //     "Width": this.vendor.contacts[0].Weight,
      //     "Height": this.vendor.contacts[0].height,
      //     "DivideBy": 4,
      //     "VolmetricWt": this.vendor.contacts[0].Vol,
      //     "ActualWt":  this.vendor.contacts[0].Act,
      //     "ChargeWt":  this.vendor.contacts[0].ChargeWt
      //   },
      //   {
      //     "Length": this.vendor.contacts[1].length,
      //     "Width": this.vendor.contacts[1].Weight,
      //     "Height": this.vendor.contacts[1].height,
      //     "DivideBy": 4,
      //     "VolmetricWt":this.vendor.contacts[1].Vol,
      //     "ActualWt":this.vendor.contacts[1].Act,
      //     "ChargeWt":this.vendor.contacts[1].ChargeWt,
      //   }
      // ]
      ,
      'CustInvoice': this.DataInvoice
      //  [
      //   {
      //     "InvoiceNo": this.DataInvoice[0].invoiceno,
      //     "InvoiceValue": this.DataInvoice[0].invoiceval,
      //     "remark": this.DataInvoice[0].remark,
      //   },
      //   {
      //     "InvoiceNo": this.DataInvoice[1].invoiceno,
      //     "InvoiceValue": this.DataInvoice[1].invoiceval,
      //     "remark": this.DataInvoice[1].remark,
      //   }
      // ],
      ,
      'Volumetrice': this.volumetricData
      //  [
      //   {
      //     "Length": this.volumetricData[0].Length,
      //     "Width": this.volumetricData[0].Width,
      //     "Height": this.volumetricData[0].Height,
      //     "Qty": "2",
      //     "DivideBy": 2,
      //     "VolmetricWt": this.volumetricData[0].VolmetricWt,
      //     "ActualWt": this.volumetricData[0].ActualWt,
      //     "ChargeWt": this.volumetricData[0].ChargeWt,
      //     "Measure": "mnb",
      //     "Nos": 20,
      //     "upf": "0"

      //   },
      //   {
      //     "Length": this.volumetricData[1].Length,
      //     "Width": this.volumetricData[1].Width,
      //     "Height": this.volumetricData[1].Height,
      //     "Qty": "2",
      //     "DivideBy": 1,
      //     "VolmetricWt": this.volumetricData[1].VolmetricWt,
      //     "ActualWt": this.volumetricData[1].ActualWt,
      //     "ChargeWt": this.volumetricData[1].ChargeWt,
      //     "Measure": "mnb",
      //     "Nos": 20,
      //     "upf": ""


      //   }
      // ]
    }


console.log(SendData, '<============this.Sendata==> ');
    return this.http.post(`${environment.apiUrl}postBooking`, SendData)
  }

  setSavedValue(value: string) {
    this.savedValue = value;
  }

  getSavedValue() {
    return this.savedValue;
  }

  setSecondTableData(data: any[]) {
    this.secondTableData.next(data);
  }

setTotalChargeWeight(chargeWeight: number) {
  this.totalChargeWeight.next(chargeWeight);
}
// booking import tab
  generateExcel() {
    const header = ['AWBNO', 'BOOKDATE', 'CUSTOMER CODE', 'ORIGIN CODE', 'CONSIGNEE NAME', 'CONSIGNEE ADD1', 'CONSIGNEE ADD2', 'CONSIGNEE ADD3', 'CONSIGNEE ADD4', 'DESTINATION NAME', 'PINCODE', 'VENDOR CODE', 'VENDORAWBNO1', 'MODE NAME', 'PRODUCT NAME', 'DOXSPX', 'QTY', 'WEIGHT', 'VOLUMETRIC WT', 'INV VALUE', 'INV NO', 'EDD', 'REMARK'];
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Entrysheet');
    const headerRow = worksheet.addRow(header);
    const columnsToColor = ['AWBNO', 'BOOKDATE', 'CUSTOMER CODE', 'ORIGIN CODE', 'DESTINATION NAME', 'MODE NAME', 'PRODUCT NAME', 'DOXSPX', 'QTY'];
    columnsToColor.forEach(column => {
      const columnIndex = header.indexOf(column);
      if (columnIndex !== -1) {
        headerRow.getCell(columnIndex + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '28bbf5' },
        };
      }
    });
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Format_with_customer.xlsx');
    });
  }

generateExcelwithOutCustomer() {
  const header = ['AWBNO', 'BOOKDATE', 'ORIGIN CODE', 'CONSIGNEE NAME', 'CONSIGNEE ADD1', 'CONSIGNEE ADD2', 'CONSIGNEE ADD3', 'CONSIGNEE ADD4', 'DESTINATION NAME', 'PINCODE', 'VENDOR CODE', 'VENDORAWBNO1', 'MODE NAME', 'PRODUCT NAME', 'DOXSPX', 'QTY', 'WEIGHT', 'VOLUMETRIC WT', 'INV VALUE', 'INV NO', 'EDD', 'REMARK'];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Entrysheet');
  const headerRow = worksheet.addRow(header);
  const columnsToColor = ['AWBNO', 'BOOKDATE', 'ORIGIN CODE', 'DESTINATION NAME', 'MODE NAME', 'PRODUCT NAME', 'DOXSPX', 'QTY'];
  columnsToColor.forEach(column => {
    const columnIndex = header.indexOf(column);
    if (columnIndex !== -1) {
      headerRow.getCell(columnIndex + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '28bbf5' },
      };
    }
  });
  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Format_without_customer.xlsx');
  });
}
StatusEntryAwb() {
  const header = ['AWBNO'];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Statusentry');
  const headerRow = worksheet.addRow(header);

  // Add color formatting to the header
  const columnsToColor = ['AWBNO'];
  columnsToColor.forEach(column => {
    const columnIndex = header.indexOf(column);
    if (columnIndex !== -1) {
      headerRow.getCell(columnIndex + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '28bbf5' },
      };
    }
  });

  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Status_entry.xlsx');
  });
}


generateExcelDelivered() {
  const header = ['AwbNo', 'DelVDT', 'DelvTime', 'NatureOfRecipt', 'RecvName', 'TelNo', 'RecvRemark'];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('podsheet');
  const headerRow = worksheet.addRow(header);
  const columnsToColor = ['AwbNo', 'DelVDT', 'DelvTime', 'NatureOfRecipt', 'RecvName', 'TelNo', 'RecvRemark'];
  columnsToColor.forEach(column => {
    const columnIndex = header.indexOf(column);
    if (columnIndex !== -1) {
      headerRow.getCell(columnIndex + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '28bbf5' },
      };
    }
  });
  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Format_Delivered.xlsx');
  });
}

generateExcelUndelivered() {
  const header = ['AwbNo', 'DelvDT', 'DelvTime', 'Reason', 'RecvRemark'];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('podsheet');
  const headerRow = worksheet.addRow(header);
  const columnsToColor = ['AwbNo', 'DelvDT', 'DelvTime', 'Reason', 'RecvRemark'];
  columnsToColor.forEach(column => {
    const columnIndex = header.indexOf(column);
    if (columnIndex !== -1) {
      headerRow.getCell(columnIndex + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '28bbf5' },
      };
    }
  });
  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Format_Undelivered.xlsx');
  });
}

generateExcelRTC() {
  const header = ['AwbNo', 'DelvDT', 'DelvTime', 'Reason', 'RecvRemark'];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Entrysheet');
  const headerRow = worksheet.addRow(header);
  const columnsToColor = ['AwbNo', 'DelvDT', 'DelvTime', 'Reason', 'RecvRemark'];
  columnsToColor.forEach(column => {
    const columnIndex = header.indexOf(column);
    if (columnIndex !== -1) {
      headerRow.getCell(columnIndex + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '28bbf5' },
      };
    }
  });
  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Format_RTC.xlsx');
  });
}

generateExcelRTO() {
  const header = ['AwbNo', 'DelvDT', 'DelvTime', 'Reason', 'RecvRemark'];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Entrysheet');
  const headerRow = worksheet.addRow(header);
  const columnsToColor = ['AwbNo', 'DelvDT', 'DelvTime', 'Reason', 'RecvRemark'];
  columnsToColor.forEach(column => {
    const columnIndex = header.indexOf(column);
    if (columnIndex !== -1) {
      headerRow.getCell(columnIndex + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '28bbf5' },
      };
    }
  });
  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Format_RTO.xlsx');
  });
}

generateExcelRunsheet() {
  const header = [ 'AwbNo' ];
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('DrsImport');
  worksheet.addRow(header);
  workbook.xlsx.writeBuffer().then((data: any) => {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'DrsImport.xlsx');
});
}

async generateExcelManifestImport() {
  const header = ['AwbNo', ];
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('ManifestImport');
  worksheet.addRow(header);
  workbook.xlsx.writeBuffer().then((data: any) => {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'ManifestImport.xlsx');
});
}


async generateExcelForwadingImport() {
  const header = ['AwbNo', 'Date', 'ForwardingName', 'ForwardingNo', 'Weight' ];
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('ForwadingImport');
  worksheet.addRow(header);
  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'ForwadingImport.xlsx');
  });
}
// dashboard Modal table
GetBranch() {
  return this.http.get(`${environment.apiUrl}Booking/getBranch`);
}

getBranchDashbordInscanDetails(sessionLocationCode: string , status: any , fromDate: any , toDate: any , pageNumber: any, pageSize: any) {
  return this.http.get(`${environment.apiUrl}branch/getBranchDashbordInscanDetails?sessionLocationCode=${sessionLocationCode}&inscan=${status}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

getBranchDashbordManifestDetails(sessionLocationCode: string , status: any , fromDate: any , toDate: any , pageNumber: any, pageSize: any) {
  return this.http.get(`${environment.apiUrl}branch/getBranchDashbordManifestDetails?sessionLocationCode=${sessionLocationCode}&manifest=${status}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

getBranchDashbordRunsheetDetails(sessionLocationCode: string , status: any , fromDate: any , toDate: any , pageNumber: any, pageSize: any) {
  return this.http.get(`${environment.apiUrl}branch/getBranchDashbordRunsheetDetails?sessionLocationCode=${sessionLocationCode}&runsheet=${status}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

getBranchDashbordStatusDetails(sessionLocationCode: string , status: any , fromDate: any , toDate: any , pageNumber: any, pageSize: any) {
  return this.http.get(`${environment.apiUrl}branch/getBranchDashbordStatusDetails?sessionLocationCode=${sessionLocationCode}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

getBranchDashbordSalesDetails(sessionLocationCode: string , status: any , fromDate: any , toDate: any , pageNumber: any, pageSize: any) {
  return this.http.get(`${environment.apiUrl}branch/getBranchDashbordSalesDetails?sessionLocationCode=${sessionLocationCode}&sales=${status}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}
// customerDashboard Modal

// tslint:disable-next-line:max-line-length
getCustomerDashbordStatusDetails( sessionLocationCode: string , customerCode: any , fromDate: any , toDate: any , status: any, pageNumber: any, pageSize: any ) {
  return this.http.get(`${environment.apiUrl}customer/getCustomerDashbordStatusDetails?sessionLocationCode=${sessionLocationCode}&customerCode=${customerCode}&fromDate=${fromDate}&toDate=${toDate}&status=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

// tslint:disable-next-line:max-line-length
getCustomerDashbordSalesDetails( sessionLocationCode: string , customerCode: any , fromDate: any , toDate: any , status: any, pageNumber: any, pageSize: any ) {
  return this.http.get(`${environment.apiUrl}customer/getCustomerDashbordSalesDetails?sessionLocationCode=${sessionLocationCode}&customerCode=${customerCode}&fromDate=${fromDate}&toDate=${toDate}&sales=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}
// INSCAN
  // awb no scan

  getInscanAWB(sessionLocationCode: string , dispatch: string, pageNumber: any, pageSize: any) {
    return this.http.get(`${environment.apiUrl}inscan/viewInscanByAwbNo?SessionLocationCode=${sessionLocationCode}&dispatchFlag=${dispatch}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  findinscanAwb(sessionLocationCode: string , awbNoToCheck: any , dispatch: string) {
    return this.http.get(`${environment.apiUrl}inscan/pendingByAwbNo?SessionLocationCode=${sessionLocationCode}&awbNo=${awbNoToCheck}&dispatchFlag=${dispatch}`)
  }

  getInscanPendingAWB(sessionLocationCode: string , dispatch: string) {
    return this.http.get(`${environment.apiUrl}inscan/pendingByAwbNo?SessionLocationCode=${sessionLocationCode}&dispatchFlag=${dispatch}`)
  }

  getScanDoneAWB(sessionLocationCode: string , dispatch: string) {
    return this.http.get(`${environment.apiUrl}inscan/viewInscanByAwbNo?SessionLocationCode=${sessionLocationCode}&dispatchFlag=${dispatch}`)
  }

  getScanDeleteAWB(Awbno: any, dispatch: string) {
    this.sessionLocationCode = localStorage.getItem('originCode');
    return this.http.get(`${environment.apiUrl}inscan/deleteByAwbNo?sessionLocationCode=${this.sessionLocationCode}&awbNo=${Awbno}&dispatchFlag=${dispatch}`)
  }
  postScanAWB(data: any) {
    return this.http.post(`${environment.apiUrl}inscan/scanByAwbNo`, data)
  }
// pending inscan modal

getPendingInscan(sessionLocationCode: string, dispatch: string, pageNumber: number, pageSize: number ) {
  return this.http.get(`${environment.apiUrl}inscan/pendingByAwbNo?SessionLocationCode=${sessionLocationCode}&dispatchFlag=${dispatch}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}
// pending inscan modal

getPendingScanManf(sessionLocationCode: string, dispatch: string, pageNumber: number, pageSize: number ) {
  return this.http.get(`${environment.apiUrl}inscan/pendingByManifestNo?SessionLocationCode=${sessionLocationCode}&dispatchFlag=${dispatch}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}
// Manifest no scan

  getInscanManif(sessionLocationCode: string, dispatch: string, pageNumber: number, pageSize: number) {
    this.sessionLocationCode = localStorage.getItem('originCode');
    return this.http.get(`${environment.apiUrl}inscan/viewInscanByManifestNo?SessionLocationCode=${sessionLocationCode}&dispatchFlag=${dispatch}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  findinscanManf(sessionLocationCode: any , manfToCheck: any, dispatch: string) {
    return this.http.get(`${environment.apiUrl}inscan/pendingByManifestNo?SessionLocationCode=${sessionLocationCode}&ManifestNo=${manfToCheck}&dispatchFlag=${dispatch}`)
  }
  getInscanPendingManif(sessionLocationCode: any, dispatch: string) {
    return this.http.get(`${environment.apiUrl}inscan/pendingByManifestNo?SessionLocationCode=${sessionLocationCode}&dispatchFlag=${dispatch}`)
  }

  getScanDoneManif(sessionLocationCode: any, dispatch: string) {
    return this.http.get(`${environment.apiUrl}inscan/viewInscanByManifestNo?SessionLocationCode=${sessionLocationCode}&dispatchFlag=${dispatch}`)
  }

  getScanDeleteManif(Manifest_no: any, dispatch: string) {
    this.sessionLocationCode = localStorage.getItem('originCode');
    return this.http.get(`${environment.apiUrl}inscan/deleteByManifestNo?sessionLocationCode=${this.sessionLocationCode}&manifestNo=${Manifest_no}&dispatchFlag=${dispatch}`)
  }
  postScanManif(data: any) {
    return this.http.post(`${environment.apiUrl}inscan/scanByManifestNo`, data)
  }

// Manifest module
// pending manifest
getPendingManifest(sessionLocationCode: string , pageNumber: number, pageSize: number) {
  return this.http.get(`${environment.apiUrl}Manifest/pendingManifest?sessionLocationCode=${sessionLocationCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
}
// create manifest
postGenrateManif(data: any) {
  return this.http.post(`${environment.apiUrl}Manifest/generateManifest`, data);
}
GetDestination(sessionLocationCode: string) {
  return this.http.get(`${environment.apiUrl}Manifest/toBranch?sessionLocationCode=${sessionLocationCode}`)
}
GetMode () {
  return this.http.get(`${environment.apiUrl}Booking/getMode`);
}
getDriver () {
  return this.http.get(`${environment.apiUrl}Manifest/getDriver`);
}
getAvailableDriver() {
 return this.http.get(`${environment.apiUrl}Manifest/getAvailableDriver`);
}
getVehicleType () {
  return this.http.get(`${environment.apiUrl}Booking/getVehicleType`)
}
getDriverMobile (DriverCode: any) {
  return this.http.get(`${environment.apiUrl}Manifest/getDriverMobile?driverCode=${DriverCode}`);
}
getRoute () {
  return this.http.get(`${environment.apiUrl}Manifest/getRoute`);
}
getVendor () {
  return this.http.get(`${environment.apiUrl}Manifest/getVendor`);
}
getVehicleNo (transporterCode: string) {
  return this.http.get(`${environment.apiUrl}Manifest/getVehicleNo?transporterCode=${transporterCode}`);
}
findawbNo(selectedValue: any, awbNoToCheck: any) {
  return this.http.get(`${environment.apiUrl}Manifest/pendingManifestByAwbNo?sessionLocationCode=${selectedValue}&awbNo=${awbNoToCheck}`)
}

// View manifest

viewFromManifestNo(sessionLocationCode: any, manifestNo: any , pageNumber: any) {
  return this.http.get(`${environment.apiUrl}Manifest/viewFromManifestNo?sessionLocationCode=${sessionLocationCode}&manifestNo=${manifestNo}&pageNumber=${pageNumber}&pageSize=200`)
}
viewFromDestManifest(sessionLocationCode: any, destination: any, fromDate: any, toDate: any, pageNumber: number) {
  return this.http.get(`${environment.apiUrl}Manifest/viewFromDestManifest?sessionLocationCode=${sessionLocationCode}&manifestDest=${destination}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=200`);
}
viewFromManifestDate(sessionLocationCode: any, fromDate: any, toDate: any , pageNumber: number) {
  return this.http.get(`${environment.apiUrl}Manifest/viewFromManifestDate?sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=200`)
}
BulkManifestDest(
  sessionLocationCode: string,
  destination: string,
  fromDate: string,
  toDate: string,
  pageNumber: number,
) {
  return this.http.get(
    `${environment.apiUrl}Manifest/pendingManifestByDestination?sessionLocationCode=${sessionLocationCode}&destinationCode=${destination}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=100`
  );
}
BulkManifestDate(
  sessionLocationCode: string,
  fromDate: string,
  toDate: string,
  pageNumber: number
) {
  return this.http.get(
    `${environment.apiUrl}Manifest/pendingManifestByDate?sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=100`
  );
}


// Runsheet

getRunsheetPending(sessionLocationCode: any , pageIndex: number, pageSize: number) {
  return this.http.get(`${environment.apiUrl}runsheet/pendingRunsheet?sessionLocationCode=${sessionLocationCode}&pageNumber=${pageIndex}&pageSize=${pageSize}`)
}
getDirectRunsheetPending(sessionLocationCode: any , pageIndex: number, pageSize: number) {
  return this.http.get(`${environment.apiUrl}runsheet/directPendingRunsheet?sessionLocationCode=${sessionLocationCode}&pageNumber=${pageIndex}&pageSize=${pageSize}`)
}
BulkRunsheetDest(
  sessionLocationCode: string,
  destination: string,
  fromDate: string,
  toDate: string,
  pageNumber: number,
) {
  return this.http.get(
    `${environment.apiUrl}runsheet/pendingRunsheetByDestination?sessionLocationCode=${sessionLocationCode}&destinationCode=${destination}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=100`
  );
}
BulkRunsheetDate(
  sessionLocationCode: string,
  fromDate: string,
  toDate: string,
  pageNumber: number
) {
  return this.http.get(
    `${environment.apiUrl}runsheet/pendingRunsheetByDate?sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=100`
  );
}
// Drs Entry

postDrsEntry(data: any) {
  return this.http.post(`${environment.apiUrl}runsheet/createRunsheet`, data)
}
getEmpList(sessionLocationCode: any) {
  return this.http.get(`${environment.apiUrl}Booking/getEmployee?sessionLocationCode=${sessionLocationCode}`)
}
GetRunsheetAwb(sessionLocationCode: any , awbNoToCheck: any) {
  return this.http.get(`${environment.apiUrl}runsheet/pendingRunsheetGetByAwbNo?sessionLocationCode=${sessionLocationCode}&awbNo=${awbNoToCheck}`)
}
GetDirectRunsheetAwb(sessionLocationCode: any , awbNoToCheck: any) {
  return this.http.get(`${environment.apiUrl}runsheet/directPendingRunsheetGetByAwbNo?sessionLocationCode=${sessionLocationCode}&awbNo=${awbNoToCheck}`)
}

// Drs View
getViewDrsFromDrsNo(sessionLocationCode: any, drsNo: any) {
  return this.http.get(`${environment.apiUrl}runsheet/getViewDrsFromDrsNo?sessionLocationCode=${sessionLocationCode}&drsNo=${drsNo}`)
}
getViewDrsFromPickupBoy(sessionLocationCode: any, deliveryBoy: any) {
  return this.http.get(`${environment.apiUrl}runsheet/getViewDrsFromPickupBoy?sessionLocationCode=${sessionLocationCode}&pickupBoy=${deliveryBoy}&pageNumber=1&pageSize=100`)
}
getViewRunsheet(sessionLocationCode: any, fromDate: any, toDate: any) {
  return this.http.get(`${environment.apiUrl}runsheet/getViewRunsheet?sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=1&pageSize=100`)
}
  // usermanagement

  getMenuData() {
    return this.http.get(`${environment.apiUrl}Permissions/getUserManagementMenu?Name=`)
  }

  getMenuForcustomer() {
    return this.http.get(`${environment.apiUrl}Permissions/getMenuForcustomer?Name`)
  }

  // booking

  getDelVT() {
    return this.http.get(`${environment.apiUrl}Booking/getDeliverType`)
  }

  getPackageType() {
    return this.http.get(`${environment.apiUrl}Booking/getPackageType`)
  }

  importEntry(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Booking/importEntry`, formData)
  }

  // booking e-ship api
  postEshipEntry (data: any ) {
    return this.http.post(`${environment.apiUrl}Booking/vendorBooking`, data)
  }
  // CRM
// complain
getCrmTrackk( selectType: any ) {
  return this.http.get(`${environment.apiUrl}crm/CrmTrackk?awbno=${selectType}&RefNo&ComplainNo`)
}
GetComplain(data: any) {
  return this.http.post(`${environment.apiUrl}Crm/GetComplain`, data);
}

// crm View
  getComplainView() {
    return this.http.get(`${environment.apiUrl}Crm/ViewComplain`)
  }
  deletecomplain(complainNo: string) {
    return this.http.delete(`${environment.apiUrl}Crm/deletecomplain?ComplainNo=${complainNo}`)
  }


  // dispatch
  // pending
  getpendingDispatch(sessionLocationCode: string , pageNumber: number , pageSize: number) {
    return this.http.get(`${environment.apiUrl}dispatch/pendingDispatch?sessionLocationCode=${sessionLocationCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  // create
  FindManifestByAwbNo(sessionLocationCode: string, awbNoToCheck: string , MFTno: number) {
    return this.http.get(`${environment.apiUrl}dispatch/pendingDispatchByAwbNo?sessionLocationCode=${sessionLocationCode}&awbNo=${awbNoToCheck}&manifestNo=${MFTno}`)
  }

  getDispatchByManifestNo(sessionLocationCode: string,  MFTno: number) {
    return this.http.get(`${environment.apiUrl}dispatch/getDispatchByManifestNo?sessionLocationCode=${sessionLocationCode}&manifestNo=${MFTno}`)
  }

  generateDispatch( data: any ) {
    return this.http.post(`${environment.apiUrl}dispatch/generateDispatch`, data)
  }

  pendingManifestno(sessionLocationCode: string) {
    return this.http.get(`${environment.apiUrl}dispatch/pendingManifestno?sessionLocationCode=${sessionLocationCode}`)
  }
//  statusEntry
  getStausEntryData(AwbNo: string) {
    return this.http.get(`${environment.apiUrl}Booking/getStausEntryData?AwbNo=${AwbNo}`)
  }
  postStausEntry (data: any) {
    return this.http.post(`${environment.apiUrl}Booking/StausEntry`, data)
  }
getDestSearchX(SupplierCode: string): Observable<any> {
  return this.http.get(`${environment.apiUrl}Booking/getDestinations?SupplierCode=${SupplierCode}`)
}
  getDestinationData(): Observable<any> {
    if (!this.cachedData$) {
      console.log('Making API request...');
      this.cachedData$ = this.http.get<any>(`${environment.apiUrl}Booking/getDestination`).pipe(
        tap(data => console.log('Data fetched from API:', data)),
        shareReplay(1)
      );
    } else {
      console.log('Using cached data');
    }
    return this.cachedData$;
  }
  getDestinationDataa(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Booking/getDestination`).pipe(
      tap(data => console.log('Data fetched from API:', data)),
      shareReplay(1)
    );
  }
  getCompany(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}Booking/getCompany`)
  }

  getOriginData(): Observable<any> {
    if (!this.cachedOriginData$) {
      this.cachedOriginData$ = this.http.get<any>(`${environment.apiUrl}Booking/getOrigin`).pipe(
        tap(data => console.log('Data fetched from API (origin):', data)),
        shareReplay(1)
      );
    } else {
      console.log('Using cached data for origin');
    }
    return this.cachedOriginData$;
  }
// getConsignerData(sessionLocationCode: any): Observable<any> {
//   if (!this.catchConsignerData$) {
    // tslint:disable-next-line:max-line-length
//     this.catchConsignerData$ = this.http.get<any>(`${environment.apiUrl}Booking/getConsigner?SessionLocationCode=${sessionLocationCode}`).pipe(tap(data => console.log('Data fetched from API (origin):', data)),
//     shareReplay(1)
//     );
//   } else {
//     console.log('Using cached data for origin');
//   }
//   return this.catchConsignerData$;
// }
getCountryData(): Observable<any> {
  if (!this.catchCountryData$) {
    this.catchCountryData$ = this.http.get<any>(`${environment.apiUrl}Booking/getCountry`).pipe(
      tap(data => console.log('Data fetched from API:', data)),
      shareReplay(1)
    );
  } else {
    console.log('Using cached data');
  }
  return this.catchCountryData$;
}
getConsignerData(sessionLocationCode: any) {
  return this.http.get(`${environment.apiUrl}Booking/getConsigner?SessionLocationCode=${sessionLocationCode}`)
}
getWalletConsigner(sessionLocationCode: any) {
  return this.http.get(`${environment.apiUrl}Booking/getConsigner?SessionLocationCode=${sessionLocationCode}&clientType=Credit`)
}
getCountrySales(zoneCode: any) {
  return this.http.get(`${environment.apiUrl}Booking/getCountry?zoneCode=${zoneCode}`)
}
// tslint:disable-next-line:max-line-length
getTripSheetReports(sessionLocationCode: string, customerCode: string, transportType: string,  vehicleNo: string, status: string, fromDate: string, toDate: any, pageNumber: any, pageSize: any): Observable<any> {
  return this.http.get(`${environment.apiUrl}Reports/getTripSheetReports?sessionLocationCode=${sessionLocationCode}&customerCode=${customerCode}&transportType=${transportType}&vehicleNo=${vehicleNo}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

// tslint:disable-next-line:max-line-length
getTripSheetAssignReports(sessionLocationCode: string, customerCode: string, supplierCode: string,  vehicleNo: string, tripNo: string, fromDate: string, toDate: any, details: string, status: string , pageNumber: any, pageSize: any): Observable<any> {
  return this.http.get(`${environment.apiUrl}Reports/getTripSheetAssignReports?sessionLocationCode=${sessionLocationCode}&customerCode=${customerCode}&supplierCode=${supplierCode}&vehicleNo=${vehicleNo}&tripNo=${tripNo}&fromDate=${fromDate}&toDate=${toDate}&details=${details}&status=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
}

// tslint:disable-next-line:max-line-length
getTripSheetReport(sessionLocationCode: string, customerCode: string, transportType: string,  vehicleNo: string, status: string, fromDate: string, toDate: any): Observable<any> {
  return this.http.get(`${environment.apiUrl}Reports/getTripSheetReports?sessionLocationCode=${sessionLocationCode}&customerCode=${customerCode}&transportType=${transportType}&vehicleNo=${vehicleNo}&status=${status}&fromDate=${fromDate}&toDate=${toDate}`)
}

getStatusReport(params: any): Observable<any> {
  const {
    userName,
    type,
    sessionLocationCode,
    clientType,
    fromDate,
    toDate,
    pageNumber,
    pageSize
  } = params;

  const url = `${environment.apiUrl}Reports/getStatusLogReport?inputName=UserStatus&userName=${userName}&type=${type}&sessionLocationCode=${sessionLocationCode}&clientType=${clientType}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

  return this.http.get(url);
}

getLogReport(params: any): Observable<any> {
  const {
    userName,
    type,
    sessionLocationCode,
    clientType,
    fromDate,
    toDate,
    pageNumber,
    pageSize
  } = params;

  const url = `${environment.apiUrl}Reports/getStatusLogReport?inputName=UserLog&userName=${userName}&type=${type}&sessionLocationCode=${sessionLocationCode}&clientType=${clientType}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

  return this.http.get(url);
}

getUserName(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}Booking/getUserName`);
}

getReportCancelTrip(
  shipperCode: string,
  customerCode: string,
  fromDate: string,
  toDate: string,
  pageNumber: number,
  pageSize: number
): Observable<any> {
  return this.http.get(
    `${environment.apiUrl}Trip/ReportCancelTrip?ShipperCode=${shipperCode}&CustomerCode=${customerCode}&FromDate=${fromDate}&ToDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}
getTripDetailReports(
  sessionLocationCode: string,
  customerCode: string,
  supplierCode: string,
  fromDate: string,
  toDate: string,
  details: string,
  status: string,
  pageNumber: number,
  pageSize: number
): Observable<any> {
  return this.http.get(
    `${environment.apiUrl}Reports/getTripDetailReports?sessionLocationCode=${sessionLocationCode}&customerCode=${customerCode}&supplierCode=${supplierCode}&fromDate=${fromDate}&toDate=${toDate}&details=${details}&status=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}

getReportSetup(inputName: string) {
  return this.http.get(`${environment.apiUrl}Reports/getReportSetup?inputName=${inputName}`);
}

saveReportSetup(apiName: string, data: any) {
  return this.http.post(`${environment.apiUrl}Reports/${apiName}`, data);
}

saveManifestSetup(apiName: string, data: any){
  return this.http.post(`${environment.apiUrl}Manifest/${apiName}`, data);
}

getAllCustomer(masterName: string, code: any) {
  return this.http.get(`${environment.apiUrl}Master/allMasters?operation=getCustomer&masterName=${masterName}&code=${code}`);
}


drsImageUpload(obj: any) {
  return this.http.post(`${environment.apiUrl}runsheet/drsImageUpload`,obj);
}


// Reports/getImageReport?sessionLocationCode=MUM&input=DrsImageReport&status=All&fromDate=2025-08-14&toDate=2025-11-14&pageNumber=0&pageSize=10
getDrsPodReport(sessionLocationCode:any,input:any,status:any,fromDate:any,toDate:any,pageNumber:any,pageSize:any) {
  return this.http.get(`${environment.apiUrl}Reports/getImageReport?sessionLocationCode=${sessionLocationCode}&input=${input}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

// Reports/getSalesRegisterReport?customerCode=All&clientType=All&sessionLocationCode=MUM&fromDate=2025-01-01&toDate=2025-12-31&pageNumber=1&pageSize=10
getSalesRegisterReport(customerCode:any,clientType:any,sessionLocationCode:any,fromDate:any,toDate:any,pageNumber:any,pageSize:any) {
  return this.http.get(`${environment.apiUrl}Reports/getSalesRegisterReport?customerCode=${customerCode}&clientType=${clientType}&sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
}


// Reports/getCheckListReport?customerCode=All&modeCode=All&clientType=All&sessionLocationCode=MUM&fromDate=2025-01-01&toDate=2025-11-31&ReportType=ChecklistDetail&pageNumber=1&pageSize=1
getCheckListReport(customerCode:any,modeCode:any,clientType:any ,sessionLocationCode:any,ReportType:any,fromDate:any,toDate:any,pageNumber:any,pageSize:any) {
  return this.http.get(`${environment.apiUrl}Reports/getSalesRegisterReport?customerCode=${customerCode}&modeCode=${modeCode}&clientType=${clientType}&sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&ReportType=${ReportType}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
}




}

