import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  deleteDestination(element: any): Observable<any> {
    const url = `${environment.apiUrl}Master/destinationMast?masterName=Destination&operation=deleteDestination` +
                `&code=${element.Destination_Code}&name=${element.Destination_Name}&zoneCode=${element.Zone_Code}` +
                `&stateCode=${element.State_Code}&countryCode=${element.Country_Code}` +
                `&destinationManifest=&destinationDHours=&destinationPHours=&productType=`;
    return this.http.get(url);
  }

  deleteCountry(element: any): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Country&operation=deleteCountry` +
                `&code=${element.Country_Code}&name=${element.Country_Name}`;
    return this.http.get(url);
  }

  getPincodeData(finderType: string, inputFieldsData: string): Observable<any> {
    const url = `${environment.apiUrl}Master/pincodeMast?masterName=PinCode&operation=getByPincode` +
                `&${finderType === 'PinCode' ? 'pinCode' : finderType === 'CityName' ? 'destinationCode' : 'areaName'}=${inputFieldsData}`;
    return this.http.get(url);
  }

  deleteState(stateCode: string, stateName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=State&operation=deleteState&code=${stateCode}&name=${stateName}`;
    return this.http.get(url);
  }
   deleteAirLine(airLineCode: string, airLineName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=AirLine&operation=deleteAirLine&code=${airLineCode}&name=${airLineName}`;
    return this.http.get(url);
  }
  deleteTrainNo(trainNoCode: string, trainNoName: string, trainCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/TrainNo?masterName=TrainNo&operation=deleteTrainNo&trainNoCode=${trainNoCode}&trainNoName=${trainNoName}&trainCode=${trainCode}`;
    return this.http.get(url);
  }
   deleteCourier(courierCode: string, courierName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/EmployeeMast?masterName=Employee&operation=deleteEmployee&employeeCode=${courierCode}&employeeName=${courierName}`;
    return this.http.get(url);
  }
  DeleteLocation(locationCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/GetAndDeleteLocation?operation=DeleteLocation&locationCode=${locationCode}`;
    return this.http.get(url);
  }

 DeleteCoCourier(vendorCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/getAndDeleteVendor?operationName=deleteVendor&vendorCode=${vendorCode}`;
    return this.http.get(url);
  }
   deleteCompany(companyCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/companyGetAndDelete?operation=deleteCompany&companyCode=${companyCode}`;
    return this.http.get(url);
  }
  getVendorByCode(vendorCode: string): Observable<any> {
  const url = `${environment.apiUrl}Master/getAndDeleteVendor?operationName=getVendor&vendorCode=${vendorCode}`;
  return this.http.get<any>(url);
}

  deletePrefix(prefixCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Prefix&operation=deletePrefix&code=${prefixCode}`;
    return this.http.get(url);
  }
  deleteRoute(routeCode: string, routeName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Route&operation=deleteRoute&code=${routeCode}&name=${routeName}`;
    return this.http.get(url);
  }
  deleteZone(zoneCode: string, zoneName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Zone&operation=deleteZone&code=${zoneCode}&name=${zoneName}`;
    return this.http.get(url);
  }

  deletePodCancel(awbNo: string, remark: string): Observable<any> {
    const url = `${environment.apiUrl}Master/inventory?masterName=PodCancel&operation=deletePodCancel` +
                `&locationCode=&awbFromNo=&awbToNo=&date=&customerCode=&employeeCode=&bookNo=&awbNo=${awbNo}&remark=${remark}`;
    return this.http.get(url);
  }

  deleteStock(id: number): Observable<any> {
    const url = `${environment.apiUrl}Master/inventory?masterName=StockEntry&operation=deleteStockEntry&id=${id}`;
    return this.http.get(url);
  }
  deleteStockIssue(id: number): Observable<any> {
    const url = `${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=deleteStockIssue&id=${id}`;
    return this.http.get(url);
  }



  // deleteStockIssue(id: number): Observable<any> {
  //   const url = `${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=deleteStockIssue` +
  //               `&locationCode=&date=&customerCode=&employeeCode=&bookNo=&id=${id}`;
  //   return this.http.get(url);
  // }

  // deleteStockIssueCust(id: number): Observable<any> {
  //   const url = `${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=deleteStockIssue&id=${id}`;
  //   return this.http.get(url);
  // }

  // deleteStockIssueEmp(locationCode: string, awbFromNo: string, awbToNo: string, date: string, customerCode: string, employeeCode: string, bookNo: string): Observable<any> {
  //   const url = `${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=deleteStockIssue` +
  //               `&locationCode=${locationCode}&awbFromNo=${awbFromNo}&awbToNo=${awbToNo}&date=${date}&customerCode=${customerCode}&employeeCode=${employeeCode}&bookNo=${bookNo}`;
  //   return this.http.get(url);
  // }

  deleteDriver(driverCode: string, driverName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/getAndDeleteDriver?operationName=deleteDriver&driverCode=${driverCode}`;
    return this.http.get(url);
  }

  deleteTransport(transportCode: string, transportName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/transportMast?masterName=Transport&operation=deleteTransport&transportCode=${transportCode}&transportName=${transportName}`;
    return this.http.get(url);
  }

  deleteVehicle(vehicleCode: string, vehicleName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/getAndDeleteVehicle?operationName=deleteVehicle&vehicleCode=${vehicleCode}`;
    return this.http.get(url);
  }

  deleteMode(modeCode: string, modeName: string, productType: string): Observable<any> {
    const url = `${environment.apiUrl}Master/modeAndProductMast?masterName=Mode&operation=deleteMode&code=${modeCode}&name=${modeName}&productType=${productType}`;
    return this.http.get(url);
  }

  deleteBank(bankCode: string, bankName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Bank&operation=deleteBank&code=${bankCode}&name=${bankName}`;
    return this.http.get(url);
  }

  deleteDelivery(deliverTypeCode: string, deliverTypeName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=DeliverType&operation=deleteDeliverType&code=${deliverTypeCode}&name=${deliverTypeName}`;
    return this.http.get(url);
  }

  deleteDepartment(departmentCode: string, departmentName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Department&operation=deleteDepartment&code=${departmentCode}&name=${departmentName}`;
    return this.http.get(url);
  }


  deleteExpenses(expensesCode: string, expensesName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Expences&operation=deleteExpences&code=${expensesCode}&name=${expensesName}`;
    return this.http.get(url);
  }

  deletePackageType(packageTypeCode: string, packageTypeName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=PackageType&operation=deletePackageType&code=${packageTypeCode}&name=${packageTypeName}`;
    return this.http.get(url);
  }

  deleteProduct(productCode: string, productName: string, productType: string): Observable<any> {
    const url = `${environment.apiUrl}Master/modeAndProductMast?masterName=Product&operation=deleteProduct&code=${productCode}&name=${productName}&productType=${productType}`;
    return this.http.get(url);
  }

  deleteReason(reasonCode: string, reasonName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Reason&operation=deleteReason&code=${reasonCode}&name=${reasonName}`;
    return this.http.get(url);
  }

  deleteServiceType(serviceCode: string, serviceName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=ServiceType&operation=deleteServiceType&code=${serviceCode}&name=${serviceName}`;
    return this.http.get(url);
  }

  deleteFlight(flightCode: string, flightName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/FlightMast?masterName=Flight&operation=deleteFlight&flightCode=${flightCode}&flightName=${flightName}`;
    return this.http.get(url);
  }

  deleteTrain(trainCode: string, trainName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Train&operation=deleteTrain&code=${trainCode}&name=${trainName}`;
    return this.http.get(url);
  }
  getZones(): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Zone&operation=getZone`;
    return this.http.get(url);
  }

  getStates(): Observable<any> {
    const url = `${environment.apiUrl}Booking/getState`;
    return this.http.get(url);
  }

  getCountries(): Observable<any> {
    const url = `${environment.apiUrl}Booking/getCountry`;
    return this.http.get(url);
  }

  getDestinations(): Observable<any> {
    const url = `${environment.apiUrl}Booking/getDestination`;
    return this.http.get(url);
  }

  getVendors(): Observable<any> {
    const url = `${environment.apiUrl}Manifest/getVendor`;
    return this.http.get(url);
  }
  getRoute(): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Route&operation=getRoute`;
    return this.http.get(url);
  }

  createZone(zoneCode: string, zoneName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Zone&operation=CreateZone&code=${zoneCode}&name=${zoneName}`;
    return this.http.get(url);
  }

  createCountry(countryCode: string, countryName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Country&operation=CreateCountry&code=${countryCode}&name=${countryName}`;
    return this.http.get(url);
  }

  createState(stateCode: string, stateName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=State&operation=CreateState&code=${stateCode}&name=${stateName}`;
    return this.http.get(url);
  }
  CreateRoute(routeCode: string, routeName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Route&operation=CreateRoute&code=${routeCode}&name=${routeName}`;
    return this.http.get(url);
  }
   createCourier( employeeName: string, employeeMobile: string, locationCode: string, password: string,    departmentcode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/EmployeeMast?masterName=Employee&operation=CreateEmployee&employeeCode=&employeeName=${employeeName}&employeeMobile=${employeeMobile}&employeeActive=&locationCode=${locationCode}&password=${password}&hints=&connectingHub=&departmentcode=${departmentcode}`;
    return this.http.get(url);
  }

  createPrefix(prefixCode: string, prefixName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Prefix&operation=CreatePrefix&code=${prefixCode}&name=${prefixName}`;
    return this.http.get(url);
  }
   createLocationMast(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateLocationMast`, formData);
  }
  createOrUpdateZone(operation: string, zoneCode: string, zoneName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Zone&operation=${operation}&code=${zoneCode}&name=${zoneName}`;
    return this.http.get(url);
  }

  createOrUpdateCountry(operation: string, countryCode: string, countryName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Country&operation=${operation}&code=${countryCode}&name=${countryName}`;
    return this.http.get(url);
  }

  createOrUpdateState(operation: string, stateCode: string, stateName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=State&operation=${operation}&code=${stateCode}&name=${stateName}`;
    return this.http.get(url);
  }

  createOrUpdateRoute(operation: string, RouteCode: string, RouteName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Route&operation=${operation}&code=${RouteCode}&name=${RouteName}`;
    return this.http.get(url);
  }

  createOrUpdateDestination(operation: string, data: any): Observable<any> {
    const queryParams = new URLSearchParams({
      masterName: 'Destination',
      operation: operation || '',
      code: data.destDestinationCode || '',
      name: data.destDestinationName || '',
      zoneCode: data.destZoneName || '',
      stateCode: data.destStateName || '',
      countryCode: data.destCountryName || '',
      destinationManifest: data.destManifest || '',
      destinationDHours: data.destDeliveryHours || '',
      destinationPHours: data.destPodHours || '',
      productType: data.destProductType || ''
    });

    const url = `${environment.apiUrl}Master/destinationMast?${queryParams.toString()}`;
    return this.http.get(url);
  }

  createOrUpdatePinCode(operation: string, data: any): Observable<any> {
    // const { pinCode, areaName, destinationCode, stateCode, countryCode, vendorCode, pickupDelivery, odaOpa, km } = data;
    // const url = `${environment.apiUrl}Master/pincodeMast?masterName=PinCode&operation=${operation}&pinCode=${pinCode}&areaName=${areaName}&destinationCode=${destinationCode}&stateCode=${stateCode}&countryCode=${countryCode}&vendorCode=${vendorCode}&pickupDelivery=${pickupDelivery}&odaOpa=${odaOpa}&km=${km}`;
    // return this.http.get(url);
         const params = new HttpParams()
      .set('masterName', 'PinCode')
      .set('operation', operation)
      .set('pinCode', data?.Pincode || '')
      .set('areaName', data?.Area || '')
      .set('destinationCode', data?.pinCodeCity || '')
      .set('stateCode', data?.pinCodeState || '')
      .set('countryCode', data?.pinCodeCountry || '')
      .set('vendorCode', data?.pinCodeVendor || '')
      .set('pickupDelivery', data?.pinCodeType || '')
      .set('odaOpa', data?.pinCodeOda || '')
      .set('km', data?.Kilometer || '');

    const url = `${environment.apiUrl}Master/pincodeMast`;
    return this.http.get(url, { params });

  }
  
 createOrUpdateCourier(operation: string, employeeCode: string, employeeName: string, employeeMobile: string, locationCode: string, password: string, departmentcode: string): Observable<any> {
      const url = `${environment.apiUrl}Master/EmployeeMast?masterName=Employee&operation=${operation}&employeeCode=${employeeCode}&employeeName=${employeeName}&employeeMobile=${employeeMobile}&employeeActive=&locationCode=${locationCode}&password=${password}&hints=&connectingHub=&departmentcode=${departmentcode}`;
      return this.http.get(url);
    }

  createOrUpdatePrefix(operation: string, prefixCode: string, prefixName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Prefix&operation=${operation}&code=${prefixCode}&name=${prefixName}`;
    return this.http.get(url);
  }

 createFlight(flightCode: string, flightName: string, airLineCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/FlightMast?masterName=Flight&operation=CreateFlight&flightCode=${flightCode}&flightName=${flightName}&airLineCode=${airLineCode}`;
    return this.http.get(url);
  }
  createOrUpdateFlight(operation: string, flightCode: string, flightName: string, airLineCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/FlightMast?masterName=Flight&operation=${operation}&flightCode=${flightCode}&flightName=${flightName}&airLineCode=${airLineCode}`;
    return this.http.get(url);
  }
   createOrUpdateAirLine(operation: string, airLineCode: string, airLineName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=AirLine&operation=${operation}&code=${airLineCode}&name=${airLineName}`;
    return this.http.get(url);
  }

   createOrUpdateTrainNo(operation: string, trainNoCode: string, trainNoName: string, trainCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/TrainNo?masterName=TrainNo&operation=${operation}&trainNoCode=${trainNoCode}&trainNoName=${trainNoName}&trainCode=${trainCode}`;
    return this.http.get(url);
  }

  getBranchLocations(): Observable<any> {
    return this.http.get(`${environment.apiUrl}Booking/getBranch`);
  }

  getConsignerData(locationCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Booking/getConsigner?SessionLocationCode=${locationCode}`);
  }
 createTrain(trainCode: string, trainName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Train&operation=CreateTrain&code=${trainCode}&name=${trainName}`;
    return this.http.get(url);
  }
    createAirline(airLineCode: string, airLineName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=AirLine&operation=CreateAirLine&code=${airLineCode}&name=${airLineName}`;
    return this.http.get(url);
  }
    createTrainNo(trainNoCode: string, trainNoName: string, trainCode: string): Observable<any> {
    const url = `${environment.apiUrl}Master/TrainNo?masterName=TrainNo&operation=CreateTrainNo&trainNoCode=${trainNoCode}&trainNoName=${trainNoName}&trainCode=${trainCode}`;
    return this.http.get(url);
  }
  createOrUpdateTrain(operation: string, trainCode: string, trainName: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=Train&operation=${operation}&code=${trainCode}&name=${trainName}`;
    return this.http.get(url);
  }

  getEmployeeData(locationCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Booking/getEmployee?sessionLocationCode=${locationCode}`);
  }

  createStockEntry(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockEntry&operation=CreateStockEntry&locationCode=&awbFromNo=${formData.EntryFromNo}&awbToNo=${formData.EntryToNo}&date=${formData.EntryDate}&customerCode=&employeeCode=&bookNo=${formData.CNote}`);
  }

  updateStockEntry(formData: any, id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockEntry&operation=UpdateStockEntry&locationCode=&awbFromNo=${formData.EntryFromNo}&awbToNo=${formData.EntryToNo}&date=${formData.EntryDate}&bookNo=${formData.CNote}&id=${id}`);
  }

  createBranchEntry(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=CreateStockIssue&locationCode=${formData.branchLocation}&awbFromNo=${formData.branchfromNo}&awbToNo=${formData.branchToNo}&date=${formData.branchEntryDate}&bookNo=${formData.branchCNote}`);
  }

  updateBranchEntry(formData: any, id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=UpdateStockIssue&locationCode=${formData.branchLocation}&awbFromNo=${formData.branchfromNo}&awbToNo=${formData.branchToNo}&date=${formData.branchEntryDate}&bookNo=${formData.branchCNote}&id=${id}`);
  }

  createCustomerEntry(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=CreateStockIssue&locationCode=${formData.locationCode}&awbFromNo=${formData.awbFromNo}&awbToNo=${formData.awbToNo}&date=${formData.date}&customerCode=${formData.customerCode}&bookNo=${formData.bookNo}`);
  }

  updateCustomerEntry(formData: any, id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=UpdateStockIssue&locationCode=${formData.locationCode}&awbFromNo=${formData.awbFromNo}&awbToNo=${formData.awbToNo}&date=${formData.date}&customerCode=${formData.customerCode}&bookNo=${formData.bookNo}&id=${id}`);
  }

  createStockIssue(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=CreateStockIssue&locationCode=${formData.locationCode}&awbFromNo=${formData.awbFromNo}&awbToNo=${formData.awbToNo}&date=${formData.date}&employeeCode=${formData.employeeCode}&bookNo=${formData.bookNo}`);
  }

  updateStockIssue(formData: any, id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=StockIssue&operation=UpdateStockIssue&locationCode=${formData.locationCode}&awbFromNo=${formData.awbFromNo}&awbToNo=${formData.awbToNo}&date=${formData.date}&employeeCode=${formData.employeeCode}&bookNo=${formData.bookNo}&id=${id}`);
  }

  // Create Pod Cancel
  createPodCancel(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=PodCancel&operation=CreatePodCancel&locationCode=&awbFromNo=&awbToNo=&date=${formData.date}&customerCode=&employeeCode=&bookNo=&awbNo=${formData.awbNo}&remark=${formData.remark}`);
  }

  // Update Pod Cancel
  updatePodCancel(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/inventory?masterName=PodCancel&operation=UpdatePodCancel&locationCode=&awbFromNo=&awbToNo=&date=${formData.date}&customerCode=&employeeCode=&bookNo=&awbNo=${formData.awbNo}&remark=${formData.remark}`);
  }

  createMode(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/modeAndProductMast?masterName=Mode&operation=CreateMode&code=${formData.modeCode}&name=${formData.modeName}&productType=${formData.productType}&doxSpx=${formData.dosSpxType}&compName=${formData.companyName}`);
  }

  // Update Mode
  updateMode(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/modeAndProductMast?masterName=Mode&operation=UpdateMode&code=${formData.modeCode}&name=${formData.modeName}&productType=${formData.productType}&doxSpx=${formData.dosSpxType}&compName=${formData.companyName}`);
  }

  // Create Product
  createProduct(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/modeAndProductMast?masterName=Product&operation=CreateProduct&code=${formData.productCode}&name=${formData.productName}&productType=${formData.productType}&doxSpx=${formData.dosSpxType}&compName=${formData.companyName}`);
  }

  // Update Product
  updateProduct(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/modeAndProductMast?masterName=Product&operation=UpdateProduct&code=${formData.productCode}&name=${formData.productName}&productType=${formData.productType}&doxSpx=${formData.dosSpxType}&compName=${formData.companyName}`);
  }
   createUpdateVendorMast(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Master/createAndUpdateVendor`, formData);
  }
  // Create Department
  createDepartment(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Department&operation=CreateDepartment&code=${formData.departmentCode}&name=${formData.departmentName}`);
  }

  updateDepartment(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Department&operation=UpdateDepartment&code=${formData.departmentCode}&name=${formData.departmentName}`);
  }

  // Expenses Operations
  createExpenses(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Expences&operation=CreateExpences&code=${formData.expensesCode}&name=${formData.expensesName}`);
  }

  updateExpenses(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Expences&operation=UpdateExpences&code=${formData.expensesCode}&name=${formData.expensesName}`);
  }

  // Bank Operations
  createBank(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Bank&operation=CreateBank&code=${formData.bankCode}&name=${formData.bankName}`);
  }

  updateBank(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Bank&operation=UpdateBank&code=${formData.bankCode}&name=${formData.bankName}`);
  }

  // Package Operations
  createPackage(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=PackageType&operation=CreatePackageType&code=${formData.packageCode}&name=${formData.packageName}`);
  }

  updatePackage(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=PackageType&operation=UpdatePackageType&code=${formData.packageCode}&name=${formData.packageName}`);
  }

  // Delivery Operations
  createDelivery(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=DeliverType&operation=CreateDeliverType&code=${formData.deliveryCode}&name=${formData.deliveryName}`);
  }

  updateDelivery(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=DeliverType&operation=UpdateDeliverType&code=${formData.deliveryCode}&name=${formData.deliveryName}`);
  }

  // Reason Operations
  createReason(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Reason&operation=CreateReason&code=${formData.reasonCode}&name=${formData.reasonName}`);
  }

  updateReason(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Reason&operation=UpdateReason&code=${formData.reasonCode}&name=${formData.reasonName}`);
  }

  // Service Operations
  createService(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=ServiceType&operation=CreateServiceType&code=${formData.serviceCode}&name=${formData.serviceName}`);
  }

  updateService(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=ServiceType&operation=UpdateServiceType&code=${formData.serviceCode}&name=${formData.serviceName}`);
  }


  // createDriver(formData: any): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}Master/driverMast?masterName=Driver&operation=CreateDriver&driverCode=&driverName=${formData.driverName}&driverAdd1=${formData.driverAdd1}&driverAdd2=${formData.driverAdd2}&driverMob=${formData.driverMob}&driverEmgNo=${formData.driverEmergencyNo}&driverTel=${formData.driverLandline}&driverMail=${formData.driverEmail}&driverGender=${formData.driverGender}&driverBlood=${formData.driverBloodGroup}&identityProof=${formData.driverId1}&identityProofNo=${formData.driverId1no}&identityProof_2=${formData.driverId2}&identityProofNo_2=${formData.driverIdNo2}&identityProof_3=${formData.driverId3}&identityProofNo_3=${formData.driverIdNo3}&licenseExDate=${formData.licenseExpDate}&licenseNo=${formData.licenseNo}&referBy=${formData.refBy}&policeVerify=${formData.PolicyVfy}&oneMoreKycImg=${formData.oneMoreKycImg}&vehicleNo=${formData.vehicleNo}&password=${formData.password}`);
  // }

   createDriver(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateDriver`, formData);
  }

  // updateDriver(formData: any,driverCode:any): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}Master/driverMast?masterName=Driver&operation=UpdateDriver&driverCode=${driverCode}&driverName=${formData.driverName}&driverAdd1=${formData.driverAdd1}&driverAdd2=${formData.driverAdd2}&driverMob=${formData.driverMob}&driverEmgNo=${formData.driverEmergencyNo}&driverTel=${formData.driverLandline}&driverMail=${formData.driverEmail}&driverGender=${formData.driverGender}&driverBlood=${formData.driverBloodGroup}&identityProof=${formData.driverId1}&identityProofNo=${formData.driverId1no}&identityProof_2=${formData.driverId2}&identityProofNo_2=${formData.driverIdNo2}&identityProof_3=${formData.driverId3}&identityProofNo_3=${formData.driverIdNo3}&licenseExDate=${formData.licenseExpDate}&licenseNo=${formData.licenseNo}&referBy=${formData.refBy}&policeVerify=${formData.PolicyVfy}&oneMoreKycImg=${formData.oneMoreKycImg}&vehicleNo=${formData.vehicleNo}&password=${formData.password}`);
  // }

  updateDriver(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateDriver`, formData);
  }

  getDriver(): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/getAndDeleteDriver?operationName=getDriver&driverCode`);
  }

  // Transport Operations
  // Master/transportMast?masterName=Transport&operation=getTransport&transportCode=SDD&transportName=SEARCH Y&transportCName=nilesh12&transportAdd1=vasai &transportAdd2=sativali road&transportAdd3=sativali naka&transportTel=012-5468627&transportMob=9090909091&transportEmail=trans@gmail.comm&connectingHub=12
  createTransport(formData: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/transportMast?masterName=Transport&operation=CreateTransport&transportCode=&transportName=${formData.transportName}&transportCName=${formData.contactPerson}&transportAdd1=${formData.transportAdd}&transportAdd2=${formData.transporterAdd}&transportAdd3=&transportTel=${formData.transportTel}&transportMob=${formData.transportMobile}&transportEmail=${formData.transEmail}&connectingHub=&transportType=${formData.transportType}&pinCode=${formData.pinCode}&state=${formData.transState}&gstno=${formData.transGST}`);
  }

  updateTransport(formData: any, transportCode: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/transportMast?masterName=Transport&operation=UpdateTransport&transportCode=${transportCode}&transportName=${formData.transportName}&transportCName=${formData.contactPerson}&transportAdd1=${formData.transportAdd}&transportAdd2=${formData.transporterAdd}&transportAdd3=&transportTel=${formData.transportTel}&transportMob=${formData.transportMobile}&transportEmail=${formData.transEmail}&connectingHub=&transportType=${formData.transportType}&pinCode=${formData.pinCode}&state=${formData.transState}&gstno=${formData.transGST}`);
  }

  // Vehicle Operations
  //Master/vehicleMast?masterName=Vehicle&operation=CreateVehicle&vehicleCode=KA0044&vehicleName=Honda&vehicleModel=1109G LPT DCR49CBC 85B6M5 &vehicleReg=MH14KA0055&vehicleType=1109 55 FT&insCompany=899I9SDD&vehicleInsNo=855&insValidDate=03-05-2025&pvcNo=95&pvcValidDate=04-05-2025&transportCode=105&ratePerKg=5&hamalyChrgs=150&detentaionChrgs=55
  // createVehicle(formData: any): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}Master/vehicleMast?masterName=Vehicle&operation=CreateVehicle&vehicleCode=&vehicleName=${formData.vehicleName}&vehicleModel=${formData.vehicleModel}&vehicleReg=${formData.VehicleNo}&vehicleType=${formData.vehicleType}&insCompany=${formData.insCompany}&vehicleInsNo=${formData.insuranceNo}&insValidDate=${formData.insValidDate}&pvcNo=${formData.pvcNo}&pvcValidDate=${formData.pvcValidDate}&transportCode=${formData.TransporterName}&ratePerKg=${formData.ratePerKg}&hamalyChrgs=${formData.hamalyCharge}&detentaionChrgs=${formData.detentionCharge}&fastTag=${formData.fastTag}&fastValidDate=${formData.fastValidDate}&registrationDate=${formData.registrDate}&transportType=${formData.TransporterType}&registrationNo=${formData.registrNo}&vehicleNo=${formData.VehicleNo}`);
  // }

  createVehicle(formData: any): Observable<any> {
            return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateVehicle`, formData);
    }

 updateVehicle(formData: any): Observable<any> {
           return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateVehicle`, formData);
    }

  // updateVehicle(formData: any, vehicleCode: any): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}Master/vehicleMast?masterName=Vehicle&operation=UpdateVehicle&vehicleCode=${vehicleCode}&vehicleName=${formData.vehicleName}&vehicleModel=${formData.vehicleModel}&vehicleReg=${formData.VehicleNo}&vehicleType=${formData.vehicleType}&insCompany=${formData.insCompany}&vehicleInsNo=${formData.insuranceNo}&insValidDate=${formData.insValidDate}&pvcNo=${formData.pvcNo}&pvcValidDate=${formData.pvcValidDate}&transportCode=${formData.TransporterName}&ratePerKg=${formData.ratePerKg}&hamalyChrgs=${formData.hamalyCharge}&detentaionChrgs=${formData.detentionCharge}&fastTag=${formData.fastTag}&fastValidDate=${formData.fastValidDate}&registrationDate=${formData.registrDate}&transportType=${formData.TransporterType}&registrationNo=${formData.registrNo}&vehicleNo=${formData.VehicleNo}`);
  // }

CreateVehicleType(formData: any) {
   return this.http.get(`${environment.apiUrl}Master/VehicleType?masterName=VehicleType&operation=CreateVehicleType&vehicleName=${formData.vTypeName}&companyName=${formData.vTypeCompanyName}&vehicleCode=`);
}


UpdateVehicleType(formData: any, vehicleCode: any) {
  return this.http.get(`${environment.apiUrl}Master/VehicleType?masterName=VehicleType&operation=UpdateVehicleType&vehicleName=${formData.vTypeName}&companyName=${formData.vTypeCompanyName}&vehicleCode=${vehicleCode}`);
}

deleteVehicleType(vehicleCode: any) {
  return this.http.get(`${environment.apiUrl}Master/VehicleType?masterName=VehicleType&operation=deleteVehicleType&vehicleName=&companyName=&vehicleCode=${vehicleCode}`);
}

  getChargesName(sessionLocationCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Booking/getChargesName?sessionLocationCode=${sessionLocationCode}&inputName=Consignor`);
  }

  customerMast(data: any) {
    return this.http.post(`${environment.apiUrl}Master/customerMast`, data);
  }
   getCustomer(sessionLocationCode: string, Search:string, pageNumber: any, pageSize: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/customerGetAndDelete?operation=getCustomer&sessionLocationCode=${sessionLocationCode}&Search=${Search}&customerCode=&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
   getCustomerdataByCode(customerCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/customerGetAndDelete?operation=getCustomer&customerCode=${customerCode}`);
  }
    getLocationByCode(locationCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/GetAndDeleteLocation?operation=getLocation&locationCode=${locationCode}`);
  }
   deleteCustomer(customerCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/customerGetAndDelete?operation=deleteCustomer&customerCode=${customerCode}`);
  }
   getRateMaster(sessionLocationCode: string, Search:string, pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/rateMasterGetAndDelete?operation=getRateMaster&clubNo=&sessionLocationCode=${sessionLocationCode}&Search=${Search}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
    getAndDeleteShipperConsig(operation: string, sessionLocationCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/getAndDeleteShipperConsig?masterName=getShipperConsig&operation=${operation}&code=${sessionLocationCode}`);
  }
DeleteShipperConsig(operation: string, code: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/getAndDeleteShipperConsig?masterName=getShipperConsig&operation=${operation}&code=${code}`);
  }
  getRateMasterdataByCode(clubNo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/rateMasterGetAndDelete?operation=getRateMaster&clubNo=${clubNo}`);
  }
   deleteRateMaster(clubNo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/rateMasterGetAndDelete?operation=deleteRateMaster&clubNo=${clubNo}`);
  }
  rateMasterEntry(data: any) {
    return this.http.post(`${environment.apiUrl}Master/rateMasterEntry`, data);
  }
    CreateAndUpdateShipper(data: any) {
    return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateShipper`, data);
  }
    CreateAndUpdateConsignee(data: any) {
    return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateConsignee`, data);
  }
  CreateAndUpdateCompany(obj: any) {
  return this.http.post(`${environment.apiUrl}Master/createAndUpdateCompany`, obj);
}
getCompany(companyCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/companyGetAndDelete?operation=getCompany&companyCode=${companyCode}`);
  }
  getZone(): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Zone&operation=getZone`);
  }
   getByCodeState(code: string, Name: string): Observable<any> {
    const url = `${environment.apiUrl}Master/allMasters?masterName=State&operation=getByCodeState&code=${code}&name=${Name}`;
    return this.http.get(url);
  }
  getByCodeDestination(code: string, Name: string): Observable<any> {
    const url = `${environment.apiUrl}Master/destinationMast?masterName=Destination&operation=getByCodeDestination&code=${code}&name=${Name}`;
    return this.http.get(url);
  }

  getLatLongData(type: string, customerCode: string, supplierCode: string, pageNumber: number, pageSize: number ): Observable<any> {
    const url = `${environment.apiUrl}Trip/getLatLongData?type=${type}&customerCode=${customerCode}&supplierCode=${supplierCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get(url);
  }
  getRatePrint(inputName: string, customerCode: string, pageNumber: number, pageSize: number, logolink: string ): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/RatePrint?inputName=${inputName}&CustomerCode=${customerCode}&pageNumber=${pageNumber}&pageSize=${pageSize}&logolink=${logolink}`);
  }

    importRate(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Master/importRate`, payload);
  }

  getCustomerData(code: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Master/AllMasters?operation=getCustomer&masterName=Customer&code=${code}`);
  }
}
