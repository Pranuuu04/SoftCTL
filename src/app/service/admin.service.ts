import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient
              ) { }

  getUserList(userType : any,sessionLocationCode : any){
    return this.http.get(`${environment.apiUrl}Permissions/getPermissionData?userType=${userType}&sessionLocationCode=${sessionLocationCode}`)
  }

  deleteUser(userName : string){
    return this.http.get(`${environment.apiUrl}Permissions/deletePermissionData?userName=${userName}`)
  }

  editUser(userName: string ,Password :string){
    return this.http.get(`${environment.apiUrl}Permissions/editPermissionData?userName=${userName}&Password=${Password}`)
  }
  
}
