import { Component, Inject, OnInit ,Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZoneFormComponent } from '../zone-form/zone-form.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { HttpService } from 'app/service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'app/Branch/master/master.service';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trans-form',
  templateUrl: './trans-form.component.html',
  styleUrls: ['./trans-form.component.css']
})
export class TransFormComponent implements OnInit {

  @Input() transportViewData: any;
  validationMessage: any;
  driverForm: FormGroup;
  showPassword = false;
  transportForm: FormGroup;
  vehicleForm: FormGroup;
  routeForm: FormGroup;
  vTypeForm: FormGroup;
  transportMode: any;
  vehicleMode: any;
  driverData: any;
  driverMode: any;
  driverName: any;
  driverCode: any;
  vehicleData: any;
  transportData: any;
  driverAdd1: any;
  driverAdd2: any;
  driverMob: any;
  password:any;
  driverLandline: any;
  driverEmergencyNo: any;
  driverEmail: any;
  driverGender: any;
  driverBloodGroup: any;
  driverId1: any;
  IdProofImg1:any;
  driverId1no: any;
  driverId2: any;
  IdProofImg2:any;
  driverIdNo2: any;
  licenseNo: any;
  licenseExpDate: any;
  licenseImg: any;
  refBy: any;
  transportType: any;
  PolicyVfy: any;
  userType: any;
  driverId3: any;
  driverIdNo3: any;
  vehicleNo: any;
  oneMoreKycImg: any;

  transportCode: any;
  transportName: any;
  contactPerson: any;
  transportAdd: any;
  transportTel: any;
  transportMobile: any;
  transEmail: any;
  transporterAdd: any;
  pinCode: any;
  transState: any;
  transGST: any;

  vehicleCode: any;
  vehicleName: any;
  vehicleModel: any;
  registrationNo: any;
  regImg: any;
  vehicleType: any;
  Transporter: any;
  insuranceNo: any;
  pvcNo: any;
  pvcValidDate: any;
  transNO: any;
  ratePerKg:any;
  hamalyCharge:any;
  detentionCharge:any;
  insValidDate: any;
  routeName: any;
  routeCode: any;
  routeData: any;
  routeMode: any;
  vtypeMode: any;
  VtypeData: any;
  registrNo: any;
  registrDate: any;
  VehicleNo: any;
  TransporterType: any;
  TransporterName: any;
  fastTag: any;
  fastValidDate: any;
  otherChrg:any;
  vTypeName: any;
  vTypeCode: any;
  vTypeCompanyName;
  vehicleImg: any; 
  transportNameList: any[] = [];
  vehicleNumbers: any[] = [];
  vehicleTypeList: any[] = [];
  // imageError: any;
  imageErrors: { [key: string]: string } = {};
  isImageSaved: any;
  imageConversionInProgress: boolean = true;


  constructor(private _mdr: MatDialogRef<ZoneFormComponent>,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              public AllService: AllServicesService,
              public snackBar: MatSnackBar,
              public masterService: MasterService,
              private http: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: any = {
                // vehicleData: any;
                // routeData: any;
                // routeMode: any;
                // vehicleMode: any;
                // transportMode: any;
                // VtypeData: any;
                // vtypeMode: any;
                // driverMode: any;
                // driverData:any 
                // action: string;
              }
              ) {
                if ( data.routeData || data.vehicleData || data.vtypeData || data.driverData || data.transportData) {
                  console.log("Driver Data = ",this.driverData)
                  this.transportMode = data.transportMode;
                  this.transportData  = data.transportData;
                  this.vehicleMode = data.vehicleMode;
                  this.vehicleData = data.vehicleData;
                  this.driverMode = data.driverMode;
                  this.routeMode = data.routeMode;
                  this.vtypeMode = data.vtypeMode;
                  this.routeData = data.routeData;
                  this.VtypeData = data.vtypeData;
                  this.driverData = data.driverData

                  console.log("Driver Data = ",this.driverData)
                  this.driverCode = this.driverData?.Driver_Code
                  this.driverName = this.driverData?.Driver_Name;
                  this.driverCode = this.driverData?.Driver_Code;
                  this.driverAdd1 = this.driverData?.Driver_Add1;
                  this.driverAdd2 = this.driverData?.Driver_Add2;
                  this.driverBloodGroup = this.driverData?.Driver_Blood;
                  this.driverEmergencyNo = this.driverData?.Driver_EmgNo;
                  this.driverGender = this.driverData?.Driver_Gender;
                  this.driverEmail = this.driverData?.Driver_Mail;
                  this.driverMob = this.driverData?.Driver_Mob;
                  this.password = this.driverData?.Password;
                  this.driverLandline = this.driverData?.Driver_Tel;
                  this.driverId1 = this.driverData?.IdentityProof;
                  this.driverId1no = this.driverData?.IdentityProofNo;
                  this.driverIdNo2 = this.driverData?.IdentityProofNo_2;
                  this.driverId2 = this.driverData?.IdentityProof_2;
                  this.driverIdNo3 = this.driverData?.IdentityProofNo_3;
                  this.driverId3 = this.driverData?.IdentityProof_3;
                  this.licenseNo = this.driverData?.License_no;
                  this.PolicyVfy = this.driverData?.Police_Verify;
                  this.userType = this.driverData?.User_Type;
                  // this.licenseExpDate = this.driverData?.License_Exdate;
                  // const liExpDate = this.driverData?.License_Exdate?this.driverData.License_Exdate.split('T')[0] : '';
                  this.licenseExpDate = this.convertToDateInputFormat(this.driverData?.License_Exdate);
                  this.vehicleNo= this.driverData?.Vehicle_No;
                  this.refBy= this.driverData?.ReferBy;
                  this.licenseImg = this.driverData?.Emp_Photo;
                  this.oneMoreKycImg = this.driverData?.OneMoreKyc_Img;
                  this.IdProofImg1 = this.driverData?.Emp_Scan1;
                  this.IdProofImg2 = this.driverData?.Emp_Scan1;

                  this.routeName = this.routeData?.Route_Name;
                  this.routeCode = this.routeData?.Route_Code;

                  console.log("VtypeData Data = ",this.VtypeData)
                  this.vTypeCode = this.VtypeData?.Vehicle_Code;
                  console.log(" vehicleCode Data = ", this.vTypeCode)
                  this.vTypeName = this.VtypeData?.Vehicle_Name;
                  this.vTypeCompanyName = this.VtypeData?.Company_Name;

                  
                  console.log("Transeport Data = ",this.transportData)
                  this.transportCode = this.transportData?.Transport_Code;
                  this.transportName = this.transportData?.Transport_Name;
                  this.contactPerson = this.transportData?.Transport_CName;
                  this.transportAdd = this.transportData?.Transport_Add1;
                  this.transporterAdd = this.transportData?.Transport_Add2;
                  this.transportTel = this.transportData?.Transport_Tel;
                  this.transportMobile = this.transportData?.Transport_Mob;
                  this.transEmail = this.transportData?.Transport_Email;
                  this.pinCode = this.transportData?.Pin_Code;
                  this.transGST = this.transportData?.GST_No;
                  this.transState = this.transportData?.State;
                  this.transportType = this.transportData?.Transport_Type;

                  console.log("Vehicle Data = ",this.vehicleData)
                  this.vehicleCode = this.vehicleData?.Vehicle_Code;
                  this.vehicleName = this.vehicleData?.Vehicle_Name;
                  this.vehicleModel = this.vehicleData?.Vehicle_Model;
                  this.registrNo = this.vehicleData?.Registration_No;
                  this.VehicleNo = this.vehicleData?.Vehicle_Reg;
                  // this.registrDate = this.vehicleData?.Registration_Date;
                  this.registrDate = this.convertToDateInputFormat(this.vehicleData?.Registration_Date),
                  this.vehicleType = this.vehicleData?.Vehicle_Type;
                  this.Transporter = this.vehicleData?.Ins_Company;
                  this.insuranceNo = this.vehicleData?.Vehicle_InsNo;
                  this.pvcNo = this.vehicleData?.PVC_No;
                  // this.pvcValidDate = this.vehicleData?.PVCValidDate;
                  this.pvcValidDate =  this.convertToDateInputFormat(this.vehicleData?.PVCValidDate),
                  this.transNO = this.vehicleData?.TransportNo;
                  this.ratePerKg = this.vehicleData?.RatePerKg;
                  this.hamalyCharge = this.vehicleData?.Hamaly_Chrgs;
                  this.detentionCharge = this.vehicleData?.Detentaion_Chrgs;
                  // this.insValidDate = this.vehicleData?.InsValidDate;  
                  this.insValidDate = this.convertToDateInputFormat(this.vehicleData?.InsValidDate),                  
                  // this.fastValidDate = this.vehicleData?.FastValidDate;
                  this.fastValidDate = this.convertToDateInputFormat(this.vehicleData?.FastValidDate),
                  this.fastTag = this.vehicleData?.Fast_Tag;
                  this.TransporterType = this.vehicleData?.Transport_Type;
                  this.TransporterName = this.vehicleData?.Transport_Code;
                  // this.vehicleForm.patchValue({
                  //   TransporterName:this.vehicleData?.Transport_Code,
                  //   }),
                  this.regImg  = this.vehicleData?.Image1;
                  this.vehicleImg = this.vehicleData?.Image2;                                            
                }

              }

  ngOnInit(): void {

    this.validationMessage = {
      // driverCode: [ {type: 'required' , message: 'Please Enter Driver Code.'} ],
      licenseNo: [ {type: 'required' , message: 'Please Enter License No.'} ],
      driverName: [ {type: 'required' , message: 'Please Enter Driver Name.'} ],
      licenseExpDate: [ {type: 'required' , message: 'Please Enter License Expiry Date.'} ],
      licenseImg: [ {type: 'required' , message: 'Please Select License Image.'} ],
      driverAdd1: [ {type: 'required' , message: 'Please Enter Driver Add1.'} ],
      // driverAdd2: [ {type: 'required' , message: 'Please Enter Driver Add2.'} ],
      // driverMob: [ {type: 'required' , message: 'Please Enter Driver Mobile.'} ],
      driverMob: [ {type: 'required' , message: 'Please Enter Driver Mobile.'} ,{ type: 'pattern', message: 'Enter a valid 10-digit mobile number.' }],
      password: [ {type: 'required' , message: 'Please Enter Your Password.'},{ type: 'pattern', message: 'Password must be minimum 4 character.' }],
      // driverLandline: [ {type: 'required' , message: 'Please Enter Driver Landline.'} ],
      // driverEmergencyNo: [ {type: 'required' , message: 'Please Enter Driver Emergency No.'} ],
      // driverEmail: [ {type: 'required' , message: 'Please Enter Driver Email.'} ],
      driverGender: [ {type: 'required' , message: 'Enter Driver Gender.'} ],
      userType: [ {type: 'required' , message: 'Enter User Type.'} ],
      driverId1: [ {type: 'required' , message: 'Please Select Driver ID.'} ],
      driverId1no: [ {type: 'required' , message: 'Please Enter ID No.'} ],
      IdProofImg1:  [ {type: 'required' , message: 'Please Select Img.'} ],
      driverId2: [ {type: 'required' , message: 'Please Select Driver ID2.'} ],
      driverIdNo2: [ {type: 'required' , message: 'Please Enter ID No.'} ],
      vehicleNo: [{type: 'required' , message: 'Please Enter Vehicle No.'}],
      IdProofImg2: [ {type: 'required' , message: 'Please Select Img.'} ],
      routeCode: [ {type: 'required' , message: 'Please Enter Route Code.'} ],
      routeName: [ {type: 'required' , message: 'Please Enter Route Name.'} ],

      // transportCode: [ {type: 'required' , message: 'Please Enter Transport Code.'} ],
      transportName: [ {type: 'required' , message: 'Please Enter Transport Name.'} ],
      contactPerson: [ {type: 'required' , message: 'Please Enter Transport Contact Person.'} ],
      transportAdd: [ {type: 'required' , message: 'Please Enter Transport Address.'} ],
      // transportTel: [ {type: 'required' , message: 'Please Enter Transport Tel.'} ],
      transportMobile: [ {type: 'required' , message: 'Please Enter Transport Mobile.'} ],
      // transEmail: [ {type: 'required' , message: 'Please Enter Transport Email.'} ],
      transportType: [ {type: 'required' , message: 'Please Enter Transport Type.'} ],

      // vehicleCode: [ {type: 'required' , message: 'Please Enter Vehicle Code.'} ],
      vehicleName: [ {type: 'required' , message: 'Please Enter Vehicle Name.'} ],
      // vehicleModel: [ {type: 'required' , message: 'Please Enter Vehicle Model.'} ],
      registrNo: [ {type: 'required' , message: 'Please Enter Vehicle Reg No.'} ],
      registrDate: [{type: 'required' , message: 'Please Enter Vehicle Reg Date.'}],
      vehicleType: [ {type: 'required' , message: 'Please Enter Vehicle Type.'} ],
      VehicleNo: [ {type: 'required' , message: 'Please Enter Vehicle No.'}],
      vehicleImg: [ {type: 'required' , message: 'Please Enter Vehicle Img.'}],
      regImg: [ {type: 'required' , message: 'Please Enter Registration Img.'}],
      // Transporter: [ {type: 'required' , message: 'Please Enter Vehicle Ins Company.'} ],
      // insuranceNo: [ {type: 'required' , message: 'Please Enter Vehicle Ins No.'} ],
      // pvcNo: [ {type: 'required' , message: 'Please Enter Vehicle PVC No.'} ],
      // pvcValidDate: [ {type: 'required' , message: 'Please Select PVC Valid Date.'} ],
      // transNO: [ {type: 'required' , message: 'Please Enter Trans No.'} ],
      // ratePerKg: [ {type: 'required' , message: 'Please Enter Rate/Kg.'} ],
      // hamalyCharge: [ {type: 'required' , message: 'Please Enter Hamaly Charges.'} ],
      // detentionCharge: [ {type: 'required' , message: 'Please Enter Detention Charges.'} ],
      // insValidDate: [ {type: 'required' , message: 'Please Select INS Valid Date.'} ],

      vTypeName: [{type: 'required' , message: 'Please Enter Vehicle Name'}],
      vTypeCompanyName: [{type: 'required' , message: 'Please Enter Vehicle Company Name'}],
    };

    this.driverForm =  this.formBuilder.group({
      // driverCode: new FormControl('', Validators.compose([ Validators.required ])),
      driverName: new FormControl('', Validators.compose([ Validators.required ])),
      driverAdd1: new FormControl('', Validators.compose([ Validators.required ])),
      driverAdd2: new FormControl('',),
      driverMob: new FormControl('', Validators.compose([ Validators.required,Validators.pattern(/^[6-9]\d{9}$/)])),
      password: new FormControl('', Validators.compose([ Validators.required,Validators.pattern(/^.{4,}$/)])),
      driverLandline: new FormControl('',),
      driverEmail: new FormControl('',),
      driverGender: new FormControl('', Validators.compose([ Validators.required ])),
      driverBloodGroup: new FormControl('',),
      driverId1: new FormControl('', Validators.compose([ Validators.required ])),
      driverId1no: new FormControl('', Validators.compose([ Validators.required ])),
      IdProofImg1: new FormControl(''),
      driverId2: new FormControl('', Validators.compose([ Validators.required ])),
      driverIdNo2: new FormControl('', Validators.compose([ Validators.required ])),
      IdProofImg2: new FormControl(''),
      driverId3: new FormControl(''),
      driverIdNo3: new FormControl(''),
      driverEmergencyNo: new FormControl(''),
       licenseNo: new FormControl('',Validators.compose([ Validators.required ])),
       licenseExpDate: new FormControl('',Validators.compose([ Validators.required ])),
       licenseImg: new FormControl(''),
       refBy: new FormControl(''),
       PolicyVfy: new FormControl(''),
       userType:new FormControl('',Validators.compose([ Validators.required ])),
       oneMoreKycImg: new FormControl(''),
       vehicleNo: new FormControl('',Validators.compose([ Validators.required ])),
    });

    this.transportForm =  this.formBuilder.group({
      // transportCode: new FormControl('', Validators.compose([ Validators.required ])),
      transportName: new FormControl('', Validators.compose([ Validators.required ])),
      contactPerson: new FormControl('', Validators.compose([ Validators.required ])),
      transportAdd: new FormControl('', Validators.compose([ Validators.required ])),
      transportTel: new FormControl(''),
      transportMobile: new FormControl('', Validators.compose([ Validators.required ])),
      transEmail: new FormControl(''),
      transportType: new FormControl('', Validators.compose([ Validators.required ])),
      transporterAdd: new FormControl(''), 
      pinCode: new FormControl(''),        
      transState: new FormControl(''),     
      transGST: new FormControl(''),    

    });

    this.vTypeForm = this.formBuilder.group({
      // vTypeCode: new FormControl('', Validators.compose([ Validators.required ])),
      vTypeName: new FormControl('', Validators.compose([ Validators.required ])),
      vTypeCompanyName: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.vehicleForm = this.formBuilder.group({
      vehicleName: new FormControl('', Validators.compose([ Validators.required ])),
      vehicleModel: new FormControl(''),
      vehicleType: new FormControl('',Validators.compose([ Validators.required ])), // Validators.compose([ Validators.required ])
      insuranceNo: new FormControl(''),
      pvcNo: new FormControl(''),
      hamalyCharge: new FormControl('0'),
      detentionCharge: new FormControl('0'),
      insValidDate: new FormControl(''),
       
      registrNo: new FormControl('',Validators.compose([ Validators.required ])),
      regImg: new FormControl(''),
      registrDate: new FormControl('',Validators.compose([ Validators.required ])),
      VehicleNo: new FormControl('',Validators.compose([ Validators.required ])),
      TransporterType: new FormControl(''),
      TransporterName: new FormControl(''),
      pvcValidDate: new FormControl(''),
      fastValidDate: new FormControl(''),
      fastTag: new FormControl(''),
      transNO: new FormControl(''),
      ratePerKg: new FormControl('0'),
      otherChrg: new FormControl('0'),
      vehicleImg: new FormControl(''),
    });


    this.routeForm = this.formBuilder.group({
      routeCode: new FormControl('', Validators.compose([ Validators.required ])),
      routeName: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.getVehicleNumbers();
    this.getTransportData();
    this.getVtypeData();
  }

  convertToDateInputFormat(dateStr: string): string {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr === '01-01-1900') {
      return '';
    }
  
    const str = String(dateStr);
    const parts = str.split('-'); // expects dd-MM-yyyy
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
  
    if (isNaN(+day) || isNaN(+month) || isNaN(+year)) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // yyyy-MM-dd
  }

  replaceUndefinedWithEmptyString(obj: any): any {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = obj[key] === undefined ? '' : obj[key];
      }
    }
    return sanitized;
  }

  getVehicleNumbers() {
     this.AllService.getVehicleNo('').subscribe((response: any) => {
      console.log('Vehicle Numbers Data:', response);
      this.vehicleNumbers = response.Data;
    });
    
  }

  getTransportData(): void {
    this.http.get(`${environment.apiUrl}Master/transportMast?masterName=Transport&operation=getBySelf%26Hired&transportCode=&transportName=&transportCName=&transportAdd1=&transportAdd2=&transportAdd3=&transportTel=&transportMob=&transportEmail=&connectingHub=&transportType=${this.TransporterType}`)
    .subscribe((response:any) => {
      console.log('Zone Data:', response);
      this.transportNameList = response.Data;
    });
  }

  getVtypeData(): void {
    this.http.get(`${environment.apiUrl}Master/VehicleType?masterName=VehicleType&operation=getVehicleType&vehicleName=&companyName=&vehicleCode=`)
    .subscribe((response:any) => {
      console.log('Zone Data:', response);
      this.vehicleTypeList = response.Data;
    });
  }

// async onFileSelected(event: Event, controlName: string, formType: 'vehicle' | 'driver'):Promise<string> {
//   const input = event.target as HTMLInputElement;
//   this.imageErrors[controlName] = null;

//   if (input.files && input.files.length > 0) {
//     const file = input.files[0];

//     const MAX_SIZE = 50 * 1024;
//     const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
//     const MAX_HEIGHT = 15200;
//     const MAX_WIDTH = 25600;

//     if (!ALLOWED_TYPES.includes(file.type)) {
//       this.imageErrors[controlName] = 'Only JPG, JPEG, and PNG formats are allowed.';
//       return;
//     }

//     if (file.size > MAX_SIZE) {
//       this.imageErrors[controlName] = 'Maximum file size allowed is 50kb.';
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       const image = new Image();
//       image.src = e.target.result;

//       image.onload = () => {
//         const height = image.height;
//         const width = image.width;

//         if (height > MAX_HEIGHT || width > MAX_WIDTH) {
//           this.imageErrors[controlName] = `Maximum dimensions allowed are ${MAX_HEIGHT}x${MAX_WIDTH}px.`;
//           return;
//         }

//         const base64String = e.target.result as string;

//         // Get the correct form
//         const targetForm =
//           formType === 'vehicle' ? this.vehicleForm :
//           formType === 'driver' ? this.driverForm : null;

//         if (targetForm?.get(controlName)) {
//           targetForm.get(controlName)?.setValue(base64String);
//         }

//         // Optional preview setup
//         (this as any)[controlName] = base64String;

//         this.isImageSaved = true;
//         console.log(`${formType} → ${controlName} → base64:`, base64String);
//       };
//     };

//     reader.readAsDataURL(file);
//   }
// }


async onFileSelected(event: Event, controlName: string, formType: 'vehicle' | 'driver'): Promise<string | void> {
  const input = event.target as HTMLInputElement;
  this.imageErrors[controlName] = null;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];
  const MAX_SIZE = 50 * 1024;
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
  const MAX_HEIGHT = 15200;
  const MAX_WIDTH = 25600;

  if (!ALLOWED_TYPES.includes(file.type)) {
    this.imageErrors[controlName] = 'Only JPG, JPEG, and PNG formats are allowed.';
    return;
  }

  if (file.size > MAX_SIZE) {
    this.imageErrors[controlName] = 'Maximum file size allowed is 50kb.';
    return;
  }

  try {
    const base64String = await this.readAndValidateImage(file, MAX_WIDTH, MAX_HEIGHT, controlName);
    
    const targetForm = formType === 'vehicle' ? this.vehicleForm
                    : formType === 'driver' ? this.driverForm
                    : null;

    if (targetForm?.get(controlName)) {
      targetForm.get(controlName)?.setValue(base64String);
    }

    // Optional image preview setup
    (this as any)[controlName] = base64String;
    this.isImageSaved = true;

    console.log(`${formType} → ${controlName} → base64:`, base64String);
    return base64String;
  } catch (error: any) {
    this.imageErrors[controlName] = error.message;
  }
}


private readAndValidateImage(file: File, maxWidth: number, maxHeight: number, controlName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          reject(new Error(`Maximum dimensions allowed are ${maxHeight}x${maxWidth}px.`));
        } else {
          resolve(e.target.result as string);
        }
      };

      img.onerror = () => {
        reject(new Error('Invalid image content.'));
      };
    };

    reader.onerror = () => {
      reject(new Error('File could not be read.'));
    };

    reader.readAsDataURL(file);
  });
}


 async formSubmitDriver(formData: any) {
  // const allImagesReady = await this.prepareDriverImagesBeforeSubmit();
  // if (!allImagesReady) {
  //   this.openSnackBar('Please upload all required images.', 'error-snackbar');
  //   return;
  // }
    if (this.driverForm.valid) {
      const driverData = {
        operation: 'CreateDriver',
        driverCode: '',
        driverName: formData.driverName,
        licenseNo: formData.licenseNo,
        licenseExDate: formData.licenseExpDate,
        driverAdd1: formData.driverAdd1,
        driverAdd2: formData.driverAdd2,
        driverMob: formData.driverMob,
        driverEmgNo: formData.driverEmergencyNo,
        driverTel: formData.driverLandline,
        driverMail: formData.driverEmail,
        driverGender: formData.driverGender,
        driverBlood: formData.driverBloodGroup,
        identityProof: formData.driverId1,
        identityProofNo: formData.driverId1no,
        identityProof_2: formData.driverId2,
        identityProofNo_2: formData.driverIdNo2,
        identityProof_3: formData.driverId3,
        identityProofNo_3: formData.driverIdNo3,
        referBy: formData.refBy,
        policeVerify: formData.PolicyVfy,
        password: formData.password, 
        oneMoreKycImg: formData.oneMoreKycImg,
        Emp_Photo: formData.licenseImg,
        Emp_Scan1: formData.IdProofImg1,
        Emp_Scan2: formData.IdProofImg2,
        vehicleNo: formData.vehicleNo,
        userType: formData.userType,
      };

      const formValue = this.replaceUndefinedWithEmptyString(driverData);
      this.masterService.createDriver(formValue).subscribe(resp => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message , 'custom-snackbar');
          this._mdr.close(true);
        } else {
          this.openSnackBar(resp.message , 'error-snackbar');
        }
      }, error => {
        this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
      });
    } else {
      Object.keys(this.driverForm.controls).forEach((field) => {
        const control = this.driverForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }


async updateDriver() {
  // const allImagesReady = await this.prepareDriverImagesBeforeSubmit();
  // if (!allImagesReady) {
  //   this.openSnackBar('Please upload all required images.', 'error-snackbar');
  //   return;
  // }
  if (this.driverForm.valid) {

  const formData = this.driverForm.value;
  const driverData = {
    operation: 'UpdateDriver',
    driverCode: this.driverCode,
    driverName: formData.driverName,
    licenseNo: formData.licenseNo,
    licenseExDate: formData.licenseExpDate,
    driverAdd1: formData.driverAdd1,
    driverAdd2: formData.driverAdd2,
    driverMob: formData.driverMob,
    driverEmgNo: formData.driverEmergencyNo,
    driverTel: formData.driverLandline,
    driverMail: formData.driverEmail,
    driverGender: formData.driverGender,
    driverBlood: formData.driverBloodGroup,
    identityProof: formData.driverId1,
    identityProofNo: formData.driverId1no,
    identityProof_2: formData.driverId2,
    identityProofNo_2: formData.driverIdNo2,
    identityProof_3: formData.driverId3,
    identityProofNo_3: formData.driverIdNo3,
    referBy: formData.refBy,
    policeVerify: formData.PolicyVfy,
    password: formData.password,
    oneMoreKycImg: formData.oneMoreKycImg,
    Emp_Photo: formData.licenseImg,
    Emp_Scan1: formData.IdProofImg1,
    Emp_Scan2: formData.IdProofImg2,
    vehicleNo: formData.vehicleNo,
    userType: formData.userType,
  };

  const formValue = this.replaceUndefinedWithEmptyString(driverData);

  this.masterService.updateDriver(formValue).subscribe(
    (resp) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this._mdr.close(true);
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    },
    (error) => {
      this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
    });
  }else {
    Object.keys(this.driverForm.controls).forEach((field) => {
      const control = this.driverForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
  }
}


  formSubmitRoute(formData: any) {
    if (this.routeForm.valid) {
      this.masterService.CreateRoute(formData.routeCode, formData.routeName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating state:', error);
        }
      );
    } else {
      Object.keys(this.routeForm.controls).forEach((field) => {
        const control = this.routeForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }

 updateRoute() {
    if (this.routeForm.valid) {
      const { routeCode, routeName } = this.routeForm.value;

      this.masterService
        .createOrUpdateRoute('UpdateRoute', routeCode, routeName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating state:', error)
        );
    } else {
      Object.keys(this.routeForm.controls).forEach((field) => {
        const control = this.routeForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }

  formSubmitTransport(formData: any) {
    if (this.transportForm.valid) {
      const formValue = this.replaceUndefinedWithEmptyString(formData);
      this.masterService.createTransport(formValue).subscribe(resp => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          this._mdr.close(true);
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      }, error => {
        this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
      });
    } else {
      Object.keys(this.transportForm.controls).forEach((field) => {
        const control = this.transportForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }

  updateTransport() {
    if (this.transportForm.valid) {
      const transportData = {
        transportCode: this.transportCode,
        transportName: this.transportName,
        contactPerson: this.contactPerson,
        transportAdd: this.transportAdd,
        transEmail: this.transEmail
      };
      const formValue = this.replaceUndefinedWithEmptyString(this.transportForm.value);
      this.masterService.updateTransport(formValue,this.transportCode).subscribe(resp => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          this._mdr.close(true);
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      }, error => {
        this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
      });
    } else {
      Object.keys(this.transportForm.controls).forEach((field) => {
        const control = this.transportForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }

  formSubmitVtype(formData: any) {
    if (this.vTypeForm.valid) {
      const formValue = this.replaceUndefinedWithEmptyString(formData);
      this.masterService.CreateVehicleType(formValue).subscribe(
        (resp:any) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating state:', error);
        }
      );
    } else {
      Object.keys(this.vTypeForm.controls).forEach((field) => {
        const control = this.vTypeForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }

  updateVType() {
    if (this.vTypeForm.valid) {
      // const { vTypeCode, vTypeName } = this.vTypeForm.value;
      const formValue = this.replaceUndefinedWithEmptyString(this.vTypeForm.value);
      this.masterService
        .UpdateVehicleType(formValue, this.vTypeCode).subscribe((resp:any) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating state:', error)
        );
    } else {
      Object.keys(this.vTypeForm.controls).forEach((field) => {
        const control = this.vTypeForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }

 async formSubmitVehicle(formData: any) {
    if (this.vehicleForm.valid) {

      const vehicleData = {
        operation: 'CreateVehicle',
        vehicleCode: '',
        vehicleName: formData.vehicleName,
        registrationNo: formData.registrNo,
        registrationDate: formData.registrDate,
        vehicleNo: formData.VehicleNo,
        vehicleModel: formData.vehicleModel,
        vehicleReg: formData.VehicleNo,
        vehicleType: formData.vehicleType,
        insCompany: formData.insCompany || '',
        vehicleInsNo: formData.insuranceNo,
        insValidDate: formData.insValidDate,
        pvcNo: formData.pvcNo,
        pvcValidDate: formData.pvcValidDate,
        transportCode: formData.TransporterName,
        transportType: formData.TransporterType,
        ratePerKg: formData.ratePerKg,
        hamalyChrgs: formData.hamalyCharge,
        detentaionChrgs: formData.detentionCharge,
        otherCharges: formData.otherChrg, 
        fastTag: formData.fastTag,
        fastValidDate: formData.fastValidDate,
        image1: formData.regImg,
        image2: formData.vehicleImg,
        transportNo: formData.transNO,
      };

      const formValue = this.replaceUndefinedWithEmptyString(vehicleData);
      this.masterService.createVehicle(formValue).subscribe(resp => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          this._mdr.close(true);
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      }, error => {
        this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
      });
    } else {
      Object.keys(this.vehicleForm.controls).forEach((field) => {
        const control = this.vehicleForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }


  async updateVehicle() {
    if (this.vehicleForm.valid) {
      const formData = this.vehicleForm.value;  
       const vehicleData = {
        operation: 'UpdateVehicle',
        vehicleCode: this.vehicleCode,
        vehicleName: formData.vehicleName,
        registrationNo: formData.registrNo,
        registrationDate: formData.registrDate,
        vehicleNo: formData.VehicleNo,
        vehicleModel: formData.vehicleModel,
        vehicleReg: formData.VehicleNo,
        vehicleType: formData.vehicleType,
        insCompany: formData.insCompany || '',
        vehicleInsNo: formData.insuranceNo,
        insValidDate: formData.insValidDate,
        pvcNo: formData.pvcNo,
        pvcValidDate: formData.pvcValidDate,
        transportCode: formData.TransporterName,
        transportType: formData.TransporterType,
        ratePerKg: formData.ratePerKg,
        hamalyChrgs: formData.hamalyCharge,
        detentaionChrgs: formData.detentionCharge,
        otherCharges: formData.otherChrg, 
        fastTag: formData.fastTag,
        fastValidDate: formData.fastValidDate,
        image1: formData.regImg,
        image2: formData.vehicleImg,
        transportNo: formData.transNO,
      };

      const formValue = this.replaceUndefinedWithEmptyString(vehicleData);
      this.masterService.updateVehicle(formValue).subscribe(resp => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          this._mdr.close(true);
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      }, error => {
        this.openSnackBar('An error occurred. Please try again.', 'error-snackbar');
      });
    } else {
      Object.keys(this.vehicleForm.controls).forEach((field) => {
        const control = this.vehicleForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
    }
  }

  openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  CloseDialog() {
    this._mdr.close(false);
  }

}

