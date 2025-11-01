import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchDashService {

  constructor(private http: HttpClient) { }

   // Load Pickup Pending Data
   loadPickupPendingData(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordPickup?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pickup=pending`;
    return this.http.get<any>(url);
  }

  // Load Pickup Done Data
  loadPickupDoneData(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordPickup?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pickup=Done`;
    return this.http.get<any>(url);
  }

  // Load Dispatch Pending Data
  loadDispatchPending(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordManifest?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&manifest=pendingDispatch`;
    return this.http.get<any>(url);
  }

  // Load Dispatch Done Data
  loadDispatchDone(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordManifest?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&manifest=DoneDispatch`;
    return this.http.get<any>(url);
  }

  // Load Manifest Pending Data
  loadManifestPending(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordManifest?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&manifest=pending`;
    return this.http.get<any>(url);
  }

  // Load Manifest Done Data
  loadManifestDone(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordManifest?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&manifest=Done`;
    return this.http.get<any>(url);
  }
  loadInscanPending(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordInscan?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&inscan=pending`;
    return this.http.get<any>(url);
  }

  // Load Inscan Done Data
  loadInscanDone(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordInscan?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&inscan=Done`;
    return this.http.get<any>(url);
  }

  // Load DRS Pending Data
  loadDrsPending(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordRunsheet?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&runsheet=pending`;
    return this.http.get<any>(url);
  }

  // Load Runsheet Done Data
  loadRunsheetDone(sessionLocationCode: string, fromDate: string, toDate: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordRunsheet?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&runsheet=Done`;
    return this.http.get<any>(url);
  }

  // Load Sales Data by Type
  loadSalesData(sessionLocationCode: string, fromDate: string, toDate: string, salesType: string) {
    const url = `${environment.apiUrl}branch/getBranchDashbordSales?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&sales=${salesType}`;
    return this.http.get<any>(url);
  }
    // Status Data
    loadStatusData(sessionLocationCode: string, fromDate: string, toDate: string, statusType: string) {
      const url = `${environment.apiUrl}branch/getBranchDashbordStatus?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&status=${statusType}`;
      return this.http.get<any>(url);
    }

    // TAT Data
    loadTATData(sessionLocationCode: string, fromDate: string, toDate: string, tatType: string) {
      const url = `${environment.apiUrl}branch/getBranchDashbordTAT?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&tat=${tatType}`;
      return this.http.get<any>(url);
    }

    // Trip Data
    loadTripData(sessionLocationCode: string, fromDate: string, toDate: string, tripType: string) {
      const url = `${environment.apiUrl}branch/getBranchDashbordTrip?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&tripsheet=${tripType}`;
      return this.http.get<any>(url);
    }

    // AWB Stock Data
    loadAWBStockData(sessionLocationCode: string, fromDate: string, toDate: string, awbType: string) {
      const url = `${environment.apiUrl}branch/getBranchDashbordAWBStock?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&awbStock=${awbType}`;
      return this.http.get<any>(url);
    }

      // Fetch Shipment Details Data
  getShipmentDetails(sessionLocationCode: string): Observable<any> {
    const url = `${environment.apiUrl}branch/getBranchDashbordShipmentDetails?SessionLocationCode=${sessionLocationCode}`;
    return this.http.get<any>(url);
  }

  // Fetch Sales Graph Data
  getSalesGraph(sessionLocationCode: string): Observable<any> {
    const url = `${environment.apiUrl}branch/getBranchDashbordSalesGraph?SessionLocationCode=${sessionLocationCode}`;
    return this.http.get<any>(url);
  }

  // Fetch Shipment Status Data
  getShipmentStatus(sessionLocationCode: string, fromDate: string, toDate: string): Observable<any> {
    const url = `${environment.apiUrl}branch/getBranchDashbordShipmentStatus?SessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}`;
    return this.http.get<any>(url);
  }
}
