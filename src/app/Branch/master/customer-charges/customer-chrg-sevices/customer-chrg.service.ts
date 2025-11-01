import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerChrgService {

  constructor(private http:HttpClient) { }

  getFuelCharge(){
    return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getFuel&clubNo=&customerCode=&productCode=`);
 }

 deleteFuelCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteFuel&clubNo=${Club_No}&customerCode=&productCode=`);
}

createFuelCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateFuel`,formData);
}

updateFuelCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateFuel`,formData);
}


getDocketCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getDocket&clubNo=&customerCode=&productCode=`);
}

deleteDocketCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteDocket&clubNo=${Club_No}&customerCode=&productCode=`);
}

createDocketCharge(formData:any){
return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateDocket`,formData);
}

updateDocketCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateDocket`,formData);
}



getEssCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getESS&clubNo=&customerCode=&productCode=`);
}

deleteEssCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteESS&clubNo=${Club_No}&customerCode=&productCode=`);
}

createEssCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateESS`,formData);
}

updateEssCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateESS`,formData);
}


getFovCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getFOV&clubNo=&customerCode=&productCode=`);
}

deleteFovCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteFOV&clubNo=${Club_No}&customerCode=&productCode=`);
}

createFovCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateFOV`,formData);
}

updateFovCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateFOV`,formData);
}


getEnsCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getENS&clubNo=&customerCode=&productCode=`);
}

deleteEnsCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteENS&clubNo=${Club_No}&customerCode=&productCode=`);
}

createEnsCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateENS`,formData);
}

updateEnsCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateENS`,formData);
}


getVolCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getVolumetric&clubNo=&customerCode=&productCode=`);
}

deleteVolCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteVolumetric&clubNo=${Club_No}&customerCode=&productCode=`);
}

createVolCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateVolumetric`,formData);
}

updateVolCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateVolumetric`,formData);
}

    

getScCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getSCharge&clubNo=&customerCode=&productCode=`);
}

deleteScCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteSCharge&clubNo=${Club_No}&customerCode=&productCode=`);
}

createScCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateSC`,formData);
}

updateScCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateSC`,formData);
}


getCafCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getCAFCharge&clubNo=&customerCode=&productCode=`);
}

deleteCafCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteCAFCharge&clubNo=${Club_No}&customerCode=&productCode=`);
}

createCafCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateCAF`,formData);
}

updateCafCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateCAF`,formData);
}

   
getIdcCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getIDCCharge&clubNo=&customerCode=&productCode=`);
}

deleteIdcCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteIDCCharge&clubNo=${Club_No}&customerCode=&productCode=`);
}

createIdcCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateIDC`,formData);
}

updateIdcCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateIDC`,formData);
}


getInsuranceCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getInsurance&clubNo=&customerCode=&productCode=`);
}

deleteInsuranceCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteInsurance&clubNo=${Club_No}&customerCode=&productCode=`);
}

createInsuranceCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateInsurance`,formData);
}

updateInsuranceCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateInsurance`,formData);
}


getMetroCharge(){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=getMetro&clubNo=&customerCode=&productCode=`);
}

deleteMetroCharge(Club_No:any){
  return this.http.get(`${environment.apiUrl}Master/GetAndDeleteCharges?masterName=AllCharges&operation=deleteMetro&clubNo=${Club_No}&customerCode=&productCode=`);
}

createMetroCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateMetro`,formData);
}

updateMetroCharge(formData:any){
  return this.http.post(`${environment.apiUrl}Master/CreateAndUpdateMetro`,formData);
}










}
