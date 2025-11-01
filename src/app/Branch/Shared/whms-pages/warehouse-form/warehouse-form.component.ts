// import { Component, OnInit } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css']
})
export class WarehouseFormComponent implements OnInit {

  validationMessage: any;
    warehouseForm: FormGroup;
    code: any;
    name: any;
    contactPerson: any;
    address: any;
    address2: any;
    address3: any;
    state:any;
    city:any;
    pincode:any;
    telePhoneNo:any;
    mobileNo:any;
    faxNo:any;
    email:any;

    stateList:any[]=[]
    destinationList:any[]=[]
 
  
    constructor(private _mdr: MatDialogRef<WarehouseFormComponent>,
      public formBuilder: FormBuilder,
      public httpService: HttpService,
      private router: Router,
      private snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
          
        if (this.data?.warehouseData) {
          this.code = this.data.warehouseData.Warehouse_Code;
          this.name = this.data.warehouseData.Warehouse_Name;
          this.contactPerson = this.data.warehouseData.Warehouse_Cont;
          this.address = this.data.warehouseData.Warehouse_Add1;
          this.address2 = this.data.warehouseData.Warehouse_Add2;
          this.address3 = this.data.warehouseData.Warehouse_Add3;
          this.pincode = this.data.warehouseData.Warehouse_Pin;
          this.telePhoneNo = this.data.warehouseData.Warehouse_Tel;
          this.mobileNo = this.data.warehouseData.Warehouse_Mob;
          this.faxNo = this.data.warehouseData.Warehouse_Fax;
          this.email = this.data.warehouseData.Warehouse_EMail;
          this.state = this.data.warehouseData.State_Code;
          this.city = this.data.warehouseData.City_Code;
        
          console.log('Warehouse Code >>>', this.code);
        }

       }
  
    ngOnInit(): void {

      this.loadState();
      this.loadDestination();
      

      this.validationMessage = {
        code: [{ type: 'required', message: 'Please enter code.' },{ type: 'pattern', message: 'Code should be alphanumeric only.' }],
        name: [{ type: 'required', message: 'Please enter name.' },{ type: 'pattern', message: 'Name should alphanumeric.' }],
        // contactPerson: [{ type: 'required', message: 'Please enter contact person name.' },{ type: 'pattern', message: 'Only letters and spaces are allowed.' }],
        address: [{ type: 'required', message: 'Please enter address.' }],
        state: [{ type: 'required', message: 'Please enter state.' }],
        city: [{ type: 'required', message: 'Please enter city.' }],
        pincode: [{ type: 'pattern', message: 'Pincode must be exactly 6 digits.' }],
        telePhoneNo: [{ type: 'pattern', message: 'Enter valid telephone number (7–15 digits or with hyphen).' }],
        mobileNo: [{ type: 'pattern', message: 'Enter a valid 10-digit mobile number starting with 6–9.' }],
        faxNo: [{ type: 'pattern', message: 'Enter valid fax number (7–15 digits or with hyphen).' }],
        email: [{ type: 'email', message: 'Enter a valid email address.' }]
      };
      
      this.warehouseForm = this.formBuilder.group({
        code: new FormControl('', Validators.compose([ Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/) ])),
        name: new FormControl('', Validators.compose([ Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]+$/)])),
        contactPerson: new FormControl('',),
        address: new FormControl('', Validators.compose([ Validators.required ])),
        address2: new FormControl(''),
        address3: new FormControl(''),
        state: new FormControl('', Validators.compose([ Validators.required ])),
        city: new FormControl('', Validators.compose([ Validators.required ])),
        pincode: new FormControl('',Validators.compose([Validators.pattern(/^\d{6}$/)]) ),
        telePhoneNo: new FormControl('', Validators.compose([Validators.pattern(/^[0-9\-]{7,15}$/) ])),
        mobileNo: new FormControl('',Validators.compose([Validators.pattern(/^[6-9]\d{9}$/)])), 
        faxNo: new FormControl('', ), // Validators.pattern(/^[0-9\-]{7,15}$/)
        email: new FormControl('', Validators.compose([Validators.email])),
 
      });
  
    }


    loadState() {
      // try {
      //   const resp = this.httpService.get(`${environment.apiUrl}Booking/getState`);
      //   console.log(resp, 'loadCity');
      //   this.stateList = resp.Data;
      //   console.log(this.stateList, ' this.cityList');
      // } catch (error) {
      //   console.error('Error in loadDestination:', error);
      //   throw error;
      // }
      this.httpService.get(`${environment.apiUrl}Booking/getState`).then((res: any) =>{
        console.log('formdata:', res.status);
        if (res.status == 1) {  
          this.stateList = res.Data; 
        } else {
          this.openSnackBar(res.message , 'custom-snackbar' );
          // alert(res.message)
        }
      });
    }
  
    // async loadCountry() {
    //   try {
    //     const resp = await this.httpService.get(`${environment.apiUrl}Booking/getCountry`);
    //     this.countryList = resp.Data;
    //   } catch (error) {
    //     console.error('Error in loadCountry:', error);
    //     throw error;
    //   }
    // }
  
    loadDestination() {

      this.httpService.get(`${environment.apiUrl}Booking/getDestination`).then((res: any) =>{
        console.log('formdata:', res.status);
        if (res.status == 1) {  
          this.destinationList = res.Data; 
        } else {
          this.openSnackBar(res.message , 'custom-snackbar' );
          // alert(res.message)
        }
      });
    }


  
    formSubmitwarehouse(formData:any){
      console.log('formdata:>>>', formData);
      this.httpService.get(`${environment.apiUrl}Master/Warehouse?masterName=Warehouse&operation=CreateWarehouse&warehouseCode=${formData.code}&warehouseName=${formData.name}&warehouseCont=${formData.contactPerson || ''}&warehouseAdd1=${formData.address}&warehouseAdd2=${formData.address2}&warehouseAdd3=${formData.address3 || ''}&warehousePin=${formData.pincode || ''}&warehouseTel=${formData.telePhoneNo || ''}&warehouseMob=${formData.mobileNo}&warehouseFax=${formData.faxNo || ''}&warehouseEMail=${formData.email || ''}&stateCode=${formData.state}&cityCode=${formData.city}`).then((res: any) =>{
        console.log('formdata:', res.status);
        if (res.status == 1) {  
          this.openSnackBar(res.message , 'custom-snackbar' );
          this._mdr.close();
        } else {
          this.openSnackBar(res.message , 'custom-snackbar' );
          // alert(res.message)
        }
      });
    }
  
    updateWarehouse(){

      this.httpService.get(`${environment.apiUrl}Master/Warehouse?masterName=Warehouse&operation=UpdateWarehouse&warehouseCode=${this.code}&warehouseName=${this.name}&warehouseCont=${this.contactPerson || ''}&warehouseAdd1=${this.address}&warehouseAdd2=${this.address2}&warehouseAdd3=${this.address3 || ''}&warehousePin=${this.pincode}&warehouseTel=${this.telePhoneNo || ''}&warehouseMob=${this.mobileNo}&warehouseFax=${this.faxNo || ''}&warehouseEMail=${this.email || ''}&stateCode=${this.state}&cityCode=${this.city}`).then((res: any) =>{
        console.log('formdata:', res.status);
        if (res.status == 1) {  
          this.openSnackBar(res.message , 'custom-snackbar' );
          this._mdr.close();
        } else {
          this.openSnackBar(res.message , 'custom-snackbar' );
          // alert(res.message)
        }
      });
  
    }
  
  
    openSnackBar(message: string, panelClass) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      });
    }
  
    CloseDialog(){
      this._mdr.close()
    }

}
