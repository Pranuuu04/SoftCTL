import { Component, Inject, OnInit } from '@angular/core';
import { AddManifestComponent } from '../add-manifest/add-manifest.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-viewedit',
  templateUrl: './viewedit.component.html',
  styleUrls: ['./viewedit.component.css']
})
export class VieweditComponent implements OnInit {
   
  createForm: any;
  validationMessage: any = [];
  dataSource: any;
  paginator: any;
  dialogRef: any;
  manifestNoValue: string;
  manifestEditData: any;
  ModeName: any;
  inputRouteName: any;
  manifestNo: any;
  addmanifest: any;
  Driver_Licence_No: any;
  Opening_Km: any;
  Vehicle_diesel_No: any;
  Vehicle_diesel_Ltrs: any;
  Kata_Weight: any;
  Slip_No: any;
  Brocker_Name: any;
  Advance_Paid: any;
  Diesel_Amount: any;
  manifestidDirect: any;
  co_loaderCode: string;
  ColoaderName: any;
  sessionLocationCode: any;
  sessionLocationName: any;
  loadManifestData: any;
  DestinationName: any;
  DriverName: any;
  maifestDate: any;


  constructor(public httpService: HttpService, 
              public dialog: MatDialog, 
              public formbuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {
              if (data.responseData) {
                console.log(data.responseData, 'comingdata-VieweditComponent');
                this.manifestEditData = data.responseData;
              }
              this.loadEditManifestData();
            }
  
  
  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.sessionLocationName = localStorage.getItem('originName');
    this.loadMode();
    this.loadRouteName();
    this.loadColoaderName();
    this.formRender();
    this.loadDestination();
    this.loadDriverName();
    // this.loadEditManifestData();
   
  }

  formRender(){
    this.validationMessage={
      manifestNo:[
        {type: 'required' , message: 'enter your date'}
      ],
      manifestDate:[
        {type: 'required', message: 'please select status'}
      ],
      origin:[
        {type: 'required', message: 'please select date'}
      ],
      destination:[
        {type: 'required', message: 'please enter time'}
      ],
      mode:[
        {type: 'required', message: 'please enter recipt'}
      ],
      via:[
        {type: 'required', message: 'please select receiver'}
      ],
      vehicleType:[
        {type: 'required', message: 'please enter contact no'}
      ],
      vehicleNo:[
        {type: 'required', message: 'please enter remark'}
      ],
      driverName: [
        {type: 'required', message: 'please enter otp'}
      ],
      driverNo: [
        {type: 'required', message: 'please enter otp'}
      ], 
      coloaderName: [
        {type: 'required', message: 'please enter otp'}
      ],
      coloaderNo: [
        {type: 'required', message: 'please enter otp'}
      ], 
      route: [
        {type: 'required', message: 'please enter otp'}
      ],
      remark: [
        {type: 'required', message: 'please enter otp'}
      ], 
    }

    this.createForm=this.formbuilder.group({
      manifestNo: new FormControl(this.manifestEditData.manifestNo,Validators.compose([
        Validators.required
      ])),
      manifestDate:new FormControl(this.maifestDate,Validators.compose([
        Validators.required
      ])),
      origin: new FormControl('',Validators.compose([
        Validators.required
      ])),
      destination: new FormControl('',Validators.compose([
        Validators.required
      ])),
      mode: new FormControl('',Validators.compose([
        Validators.required
      ])),
      via: new FormControl('',Validators.compose([
        // Validators.required
      ])),
      vehicleType: new FormControl('',Validators.compose([
        Validators.required
      ])),
      vehicleNo: new FormControl('',Validators.compose([
        Validators.required
      ])),
      driverName: new FormControl('',Validators.compose([
        Validators.required
      ])),
      driverNo: new FormControl('',Validators.compose([
        Validators.required
      ])),
      coloaderName: new FormControl('',Validators.compose([
        Validators.required
      ])),
      coloaderNo: new FormControl('',Validators.compose([
        Validators.required
      ])),
      route: new FormControl('',Validators.compose([
        // Validators.required
      ])),
      remark: new FormControl('',Validators.compose([
        // Validators.required
      ])),
    })
  }



  async loadDestination() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Manifest/toBranch`);
      console.log(resp, "loadDestination");
      this.DestinationName = resp.Data;
    } catch (error) {
      console.error("Error loading mode:", error);
    }
  }


  async loadDriverName() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Manifest/getDriver`);
      console.log(resp, "loadDestination");
      this.DriverName = resp.Data;
    } catch (error) {
      console.error("Error loading mode:", error);
    }
  }

  async loadMode() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Booking/getMode`);
      console.log(resp, "loadMode");
      this.ModeName = resp.Data;
    } catch (error) {
      console.error("Error loading mode:", error);
    }
  }
  

  async loadRouteName() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Manifest/getRoute`);
      console.log(resp, "loadRouteName");
      this.inputRouteName = resp.Data;
    } catch (error) {
      console.error("Error loading route name:", error);
    }
  }

  // async loadEditManifestData() {
  //   try {
  //     const resp = await this.httpService.get(`${environment.apiUrl}Manifest/getForEdit?manifestNo=${this.manifestEditData.manifestNo}`);
  //     console.log(resp,'respdata from manifestNo');
  //     this.loadManifestData = resp.Data[0];
  //     this.maifestDate = this.loadManifestData.manifestDt

  //   } catch (error) {
  //     console.error("Error loading edit manifest data:", error);
  //   }
  // }

  loadEditManifestData(){
    this.httpService.get(`${environment.apiUrl}Manifest/getForEdit?manifestNo=${this.manifestEditData.manifestNo}`).then(resp=>{
      console.log(resp,'respdata from manifestNo');
      this.loadManifestData = resp.Data[0];
      this.maifestDate = this.loadManifestData.manifestDt;
      console.log( this.maifestDate,'manifestDate');
      console.log(  this.loadManifestData ,'manifestLaod Data');
    })
  }
  
  


  // async loadEditManifestData() {
  //   try {
  //     console.log(this.manifestEditData.manifestNo,'sdaa');
  //     const response = await this.httpService.get(`${environment.apiUrl}Manifest/getForEdit?manifestNo=` + this.manifestEditData.manifestNo);
  //     const data = response.Data[0];
  //       this.manifestNoValue = data.manifestNo;
  //       console.log('Data from the API:', data);
  //       this.addmanifest = data;
  //       console.log('Form Controls:', this.createForm.controls);
  //       this.createForm.patchValue({
  //       manifestNo: data.manifestNo,
  //       manifestDate: data.manifestDt,
  //       origin: data.fromDest,
  //       destination: data.toDest,
  //       mode: data.mode,
  //       via: data.via,
  //       vehicleType: data.vehicleType,
  //       vehicleNo: data.vehicleNo,
  //       driverName: data.driverName,
  //       driverNo: data.driverLicenceNo,
  //       coLoaderNo: data.coLoadername,
  //       route: data.router,
  //       remark: data.remark
  //     });
  //     console.log('Form Value:', this.createForm.value);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // }

  
  
  formSubmit(formData:any){
    let object= {
      manifestNo: formData.manifestNo || this.manifestEditData.manifestNo,
      fromDest: formData.origin || this.sessionLocationName,
      toDest: formData.destination || this.manifestEditData.todest,
      Mode: formData.mode || this.manifestEditData.mode,
      Remark: formData.remark,
      Vehicletype: formData.Vehicletype,
      VehicleNo: formData.VehicleNo || this.manifestEditData.vehicleNo,
      via: formData.via,
      route: formData.route,
      VendorCode:  formData.co_loaderCode,
      driverName: formData.driverName || this.manifestEditData.driverName,
      // Amount: "20000",
      openingKM: this.Opening_Km || '',
      refrenceNo: formData.coLoaderNo || '',
      DriverLicenceNo: this.Driver_Licence_No || '',
      VehicleDieselLtrs: this.Vehicle_diesel_Ltrs || '',
      BrockerName: this.Brocker_Name || '',
      Katawt: this.Kata_Weight || '',
      AdvancePaid: this.Advance_Paid || '',
      VehicleDieselNo: this.Vehicle_diesel_No || '',
      SlipNo: this.Slip_No || '',
      DieselAmt: this.Diesel_Amount || '',
    }
    console.log(object, 'khushboo');
    this.httpService.post(`${environment.apiUrl}Manifest/editManifest`,object).then(resp=>{
      console.log(resp,'formSubmitVieweditComponent');
      if(resp.status === 1){
        alert(resp.message);
        this.dialog.closeAll();
      } else{
        alert(resp.message);
      }
    })
}

  openaddmanifest() {
    this.dialogRef = this.dialog.open(AddManifestComponent, {
      data: {
        action: 'add',
        responseData: this.loadManifestData,
      },
      width: '65rem',
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // console.log('Data received from AddManifestComponent:', res);
        // console.log('Data received :', res.obj);

        // this.Driver_Licence_No = res.Driver_Licence_No;
        // this.Opening_Km = res.Opening_Km;
        // this.Vehicle_diesel_No = res.Vehicle_diesel_No;
        // this.Vehicle_diesel_Ltrs = res.Vehicle_diesel_Ltrs;
        // this.Kata_Weight = res.Kata_Weight;
        // this.Slip_No = res.Slip_No;
        // this.Brocker_Name = res.Brocker_Name;
        // this.Advance_Paid = res.Advance_Paid;
        // this.Diesel_Amount = res.Diesel_Amount;
      }
    });
    
  }
  submitButtonClicked() {
    console.log('Submit button clicked.');
    }
  closeForm() {
    this.dialog.closeAll();
  }

  updateSelectedColoaderNameCode(inputValue: string): void {
    const productCodeMatch = inputValue.match(/\(([^)]+)\)/);
  
    if (productCodeMatch && productCodeMatch.length > 1) {
      this.co_loaderCode = productCodeMatch[1];
    } else {
      this.co_loaderCode = ''; // Set it to an empty string if there's no match
    }
  
    console.log(this.co_loaderCode, 'this.co_loaderCode');
  }

  loadColoaderName() {
    this.httpService
      .get(`${environment.apiUrl}Manifest/getVendor`)
      .then((resp) => {
        console.log(resp, "loadRouteName");
        this.ColoaderName = resp.Data;
      });
  }
  
}