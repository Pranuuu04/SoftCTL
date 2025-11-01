import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { HttpService } from 'app/service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { CustomerChrgService } from 'app/Branch/master/customer-charges/customer-chrg-sevices/customer-chrg.service';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cust-charg-form',
  templateUrl: './cust-charg-form.component.html',
  styleUrls: ['./cust-charg-form.component.css']
})
export class CustChargFormComponent implements OnInit {

  validationMessage:any;

  //FuelCharge
  fuelChargeForm:FormGroup;
  customerNameFuel:any[] = [];
  productFuel:any;
  fuelCharge:any;
  HdpCharge:any;
  fromDate:any;
  toDate:any;
  clubNoFuel:any;

  //DocketCharge
  docketChargeForm:FormGroup;
  customerNameDocket:any[] = [];
  productDocket:any;
  packingCharge:any;
  docketCharge:any;
  clubNoDocket:any;

  //EssCharge
  essChargeForm:FormGroup;
  customerNameEss:any[] = [];
  productEss:any;
  essCharge:any;
  clubNoEss:any;

   //FovCharge
   fovChargeForm:FormGroup;
   customerNameFov:any[] = [];
   productFov:any;
   fovPersent:any;
   amount:any;
   clubNoFov:any;

    //EnsCharge
    ensChargeForm:FormGroup;
    customerNameEns:any[];
    detinationName: any[];
    ratePerKg:any;
    minimumWt:any;
    minimumAmount:any;
    clubNoEns:any;

    //VolumetricCharge
    volumetricChargeForm:FormGroup;
    customerNameVol:any[] = [];
    volMode:any;
    centimeter:any;
    cft:any;
    inches:any;
    inchCft:any;
    clubNoVol:any;

    //ScCharge
    scChargeForm:FormGroup;
    customerNameSc:any[] = [];
    stateName: any[] = [];
    scPerKg:any;
    clubNoSc:any;

    //CafCharge
    cafChargeForm:FormGroup;
    customerNameCaf: any[] = [];
    productCaf:any;
    cafCharge:any;
    clubNoCaf:any;

     //IdcCharge
     idcChargeForm:FormGroup;
     customerNameIdc:any[] = [];
     productIdc: any[] = [];
     idcPer:any;
     clubNoIdc:any;

     //InsuranceCharge
      insChargeForm:FormGroup;
      customerNameIns:any[] = [];
      productIns:any;
      insPersent:any;
      clubNoIns:any;

      //MetroCharge
       metroChargeForm:FormGroup;
       customerNameMetro:any[] = [];
       productMetro:any;
       metro:any;
       nonMetro:any;
       clubNoMetro:any;

       //OdaCharge
       odaChargeForm:FormGroup;
       customerNameOda:any[] = [];
       productOda:any;
       rateMode:any;
       minimumAmountOda:any
       clubNoOda:any;
      
      // OdaChargePopup
       odaChargeWtKm:FormGroup;


       destinationObj:any[] = [];
       stateObj:any[] = [];
       customerObj:any[] = [];
       productObj:any[] = [];
  
  
    

  constructor(private _mdr: MatDialogRef<CustChargFormComponent>,private snackBar:MatSnackBar,private datePipe:DatePipe,
    public formBuilder: FormBuilder,private customerChrgService:CustomerChrgService, private http:HttpClient,private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {
    
    if(this.data?.FuelCharData){
      //  this.customerNameFuel = [this.data.FuelCharData?.Customer_Code];
       const customerCode = this.data.FuelCharData.Customer_Code;
       if (customerCode) {
        this.customerNameFuel = [customerCode];
       }
      this.productFuel = this.data.FuelCharData?.Product_Code;
      this.fuelCharge = this.data.FuelCharData?.FuelPer;
      this.HdpCharge = this.data.FuelCharData?.Amount;
      this.clubNoFuel = this.data.FuelCharData?.Club_No;
      this.fromDate =  this.convertToDateInputFormat(this.data.FuelCharData?.Active_Date);
      this.toDate = this.convertToDateInputFormat(this.data.FuelCharData?.Closing_Date);
    }

     if(this.data?.DocketCharData){
      //  this.customerNameDocket = [this.data.DocketCharData?.Customer_Code];
       const customerCode = this.data.DocketCharData.Customer_Code;
       if (customerCode) {
        this.customerNameDocket = [customerCode];
       }
       this.productDocket = this.data.DocketCharData?.Product_Code;
       this.packingCharge = this.data.DocketCharData?.NForm_Charges;
       this.docketCharge = this.data.DocketCharData?.Docket_Charges;
       this.fromDate =  this.convertToDateInputFormat(this.data.DocketCharData?.Active_Date);
       this.toDate = this.convertToDateInputFormat(this.data.DocketCharData?.Closing_Date);
       this.clubNoDocket = this.data.DocketCharData?.Club_No;
     }

     if(this.data?.EssCharData){
      // this.customerNameEss = [this.data.EssCharData?.Customer_Code];
      const customerCode = this.data.EssCharData.Customer_Code;
       if (customerCode) {
        this.customerNameEss = [customerCode];
       }
      this.productEss = this.data.EssCharData?.Product_Code;
      this.essCharge = this.data.EssCharData?.FuelCharges;
      this.fromDate =  this.convertToDateInputFormat(this.data.EssCharData?.Active_Date);
      this.toDate = this.convertToDateInputFormat(this.data.EssCharData?.Closing_Date);
      this.clubNoEss = this.data.EssCharData?.Fuel_Code;
    }

    if(this.data?.FovCharData){
      // this.customerNameFov = [this.data.FovCharData?.Customer_Code];
      const customerCode = this.data.FovCharData.Customer_Code;
       if (customerCode) {
        this.customerNameFov = [customerCode];
       }
      this.productFov = this.data.FovCharData?.Product_Code;
      this.fovPersent = this.data.FovCharData?.FOVPer;
      this.amount = this.data.FovCharData?.Amount;
      this.fromDate =  this.convertToDateInputFormat(this.data.FovCharData?.Active_Date);
      this.toDate = this.convertToDateInputFormat(this.data.FovCharData?.Closing_Date);
      this.clubNoFov = this.data.FovCharData?.Club_No;
    }

    if(this.data?.EnsCharData){
      // this.customerNameEns = [this.data.EnsCharData?.Customer_Code];
      const customerCode = this.data.EnsCharData.Customer_Code;
      if (customerCode) {
        this.customerNameEns = [customerCode];
      }
      this.detinationName = this.data.allDestinations;  
      console.log("this.detinationName>>>>>>>>>>", this.detinationName);
      this.ratePerKg = this.data.EnsCharData?.ENSPer;
      this.minimumWt = this.data.EnsCharData?.Weight;
      this.minimumAmount = this.data.EnsCharData?.Amount;
      this.fromDate =  this.convertToDateInputFormat(this.data.EnsCharData?.Active_Date);
      this.toDate = this.convertToDateInputFormat(this.data.EnsCharData?.Closing_Date);
      this.clubNoEns = this.data.EnsCharData?.Club_No;
    }


    if(this.data?.VolCharData){
      // this.customerNameVol = [this.data.VolCharData?.Customer_Code];
      const customerCode = this.data.VolCharData.Customer_Code;
      if (customerCode) {
        this.customerNameVol = [customerCode];
      }
      this.volMode = this.data.VolCharData?.Product_Code;
      this.centimeter = this.data.VolCharData?.Vol_Calc;
      this.cft = this.data.VolCharData?.Calc;
      this.inches = this.data.VolCharData?.Vol_Inches;
      this.inchCft = this.data.VolCharData?.CFT_Inches;
      this.clubNoVol = this.data.VolCharData?.Club_No;
     
    }


    if(this.data?.ScCharData){
      // this.customerNameSc = [this.data.ScCharData?.Customer_Code];
      const customerCode = this.data.ScCharData.Customer_Code;
      if (customerCode) {
        this.customerNameSc = [customerCode];
      }
      this.stateName = this.data.allState;
      this.scPerKg = this.data.ScCharData?.Amount;
      this.fromDate =  this.convertToDateInputFormat(this.data.ScCharData?.Active_Date);
      console.log("this.fromDate>>>>>",this.fromDate);
      this.toDate = this.convertToDateInputFormat(this.data.ScCharData?.Closing_Date);
      this.clubNoSc = this.data.ScCharData?.Club_No;
    }

    if(this.data?.CafCharData){
      // this.customerNameCaf = [this.data.CafCharData?.Customer_Code];
      const customerCode = this.data.CafCharData.Customer_Code;
      if (customerCode) {
        this.customerNameCaf = [customerCode];
      }
      this.productCaf = this.data.CafCharData?.Product_Code;
      this.cafCharge = this.data.CafCharData?.FuelCharges;
      this.fromDate =  this.convertToDateInputFormat(this.data.CafCharData?.Active_Date);
      this.toDate = this.convertToDateInputFormat(this.data.CafCharData?.Closing_Date);
      this.clubNoCaf = this.data.CafCharData?.Fuel_Code;
    }

    if(this.data?.IdcCharData){
      // this.customerNameIdc = [this.data.IdcCharData?.Customer_Code];
      const customerCode = this.data.IdcCharData.Customer_Code;
      if (customerCode) {
        this.customerNameIdc = [customerCode];
      }
      this.productIdc = this.data.allProducts;
      this.idcPer = this.data.IdcCharData?.IDCPer;
      console.log(" this.idcPer>>>>>", this.idcPer);
      this.fromDate =  this.convertToDateInputFormat(this.data.IdcCharData?.Active_Date);
      this.toDate = this.convertToDateInputFormat(this.data.IdcCharData?.Closing_Date);
      this.clubNoIdc = this.data.IdcCharData?.Club_No;
    }

    if(this.data?.InsCharData){
      // this.customerNameIns = [this.data.InsCharData?.Customer_Code];
      const customerCode = this.data.InsCharData.Customer_Code;
      if (customerCode) {
        this.customerNameIns = [customerCode];
      }
      this.productIns = this.data.InsCharData?.Product_Code;
      this.insPersent = this.data.InsCharData?.InsurancePer;
      this.fromDate =  this.convertToDateInputFormat(this.data.InsCharData?.Active_Date);
      this.toDate = this.convertToDateInputFormat(this.data.InsCharData?.Closing_Date);
      this.clubNoIns = this.data.InsCharData?.Club_No;
    }

    if(this.data?.MetroCharData){
      // this.customerNameMetro = [this.data.MetroCharData?.Customer_Code];
      const customerCode = this.data.MetroCharData.Customer_Code;
      if (customerCode) {
        this.customerNameMetro = [customerCode];
      }
      this.productMetro = this.data.MetroCharData?.Product_Code;
      this.metro = this.data.MetroCharData?.MetroCharges;
      this.nonMetro = this.data.MetroCharData?.NonMetroCharges;
      this.fromDate =  this.convertToDateInputFormat(this.data.MetroCharData?.Active_Date);
      this.toDate = this.convertToDateInputFormat(this.data.MetroCharData?.Closing_Date);
      this.clubNoMetro = this.data.MetroCharData?.Club_No;
    }


   }

  ngOnInit(): void {
   
    if(this.data?.InsCharMode === 'add' || this.data?.FuelCharMode === 'add' || this.data?.DocketCharMode === 'add' || this.data?.EssCharMode === 'add'
      || this.data?.FovCharMode === 'add' || this.data?.EnsCharMode === 'add' || this.data?.VolCharMode === 'add' || this.data?.ScCharMode === 'add'
      || this.data?.CafCharMode === 'add' || this.data?.IdcCharMode === 'add' || this.data?.MetroCharMode === 'add')
      {
         this.setDefaultDates();
      }

    this.validationMessage = {
      customerNameFuel:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      productFuel:[ {type: 'required' , message: 'Please Enter Product Name.'} ],
      fuelCharge:[ {type: 'required' , message: 'Please Enter Fuel Charge.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      HdpCharge:[ {type: 'required' , message: 'Please Enter Hdp Charge.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],

      customerNameDocket:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      productDocket:[ {type: 'required' , message: 'Please Enter Product Name.'} ],
      packingCharge:[ {type: 'required' , message: 'Please Enter Packing Charge.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      docketCharge:[ {type: 'required' , message: 'Please Enter Docket Charge.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      
      customerNameEss:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      productEss:[ {type: 'required' , message: 'Please Enter Product Name.'} ],
      essCharge:[ {type: 'required' , message: 'Please Enter Ess Charge.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],

      customerNameFov:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      productFov:[ {type: 'required' , message: 'Please Enter Product Name.'} ],
      fovPersent:[ {type: 'required' , message: 'Please Enter Fov Persent.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      amount:[ {type: 'required' , message: 'Please Enter Amount.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      
      customerNameEns:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      detinationName:[ {type: 'required' , message: 'Please Enter Detination Name.'} ],
      ratePerKg:[ {type: 'required' , message: 'Please Enter Rate Per Kg.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      minimumWt:[ {type: 'required' , message: 'Please Enter Minimum Wt.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      minimumAmount:[ {type: 'required' , message: 'Please Enter Minimum Amount.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],

      customerNameVol:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      volMode:[ {type: 'required' , message: 'Please Enter Mode.'} ],
      centimeter:[ {type: 'required' , message: 'Please Enter.'},{type: 'pattern' , message: 'Please Enter Valid Value.'} ],
      cft:[ {type: 'required' , message: 'Please Enter.'},{type: 'pattern' , message: 'Please Enter Valid Value.'} ],
      inches:[ {type: 'required' , message: 'Please Enter.'},{type: 'pattern' , message: 'Please Enter Valid Value.'} ],
      inchCft:[ {type: 'required' , message: 'Please Enter.'},{type: 'pattern' , message: 'Please Enter Valid Value.'} ],

      customerNameSc:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      stateName:[ {type: 'required' , message: 'Please Enter State Name.'} ],
      scPerKg:[ {type: 'required' , message: 'Please Enter Kg.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      
      customerNameCaf:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      productCaf:[ {type: 'required' , message: 'Please Enter Product Name.'} ],
      cafCharge:[ {type: 'required' , message: 'Please Enter Kg.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],

      customerNameIdc:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      productIdc:[ {type: 'required' , message: 'Please Enter Product Name.'} ],
      idcPer:[ {type: 'required' , message: 'Please Enter Idc Per%.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],

      customerNameIns:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      productIns:[ {type: 'required' , message: 'Please Enter Product Name.'} ],
      insPersent:[ {type: 'required' , message: 'Please Enter Insurance Per%.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],

      customerNameMetro:[ {type: 'required' , message: 'Please Enter Customer Name.'} ],
      productMetro:[ {type: 'required' , message: 'Please Enter Product Name.'} ],
      metro:[ {type: 'required' , message: 'Please Enter Metro Charge.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],
      nonMetro:[ {type: 'required' , message: 'Please Enter Non Metro Charge.'},{type: 'min' , message: 'Please Enter minimum 0.'} ],

    }


    this.fuelChargeForm = this.formBuilder.group({
      customerNameFuel: new FormControl([], Validators.compose([ Validators.required ])),
      productFuel: new FormControl('',Validators.compose([Validators.required])),
      fuelCharge: new FormControl('',Validators.compose([Validators.required])),
      HdpCharge: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });

    // this.fuelChargeForm.patchValue({
    //   customerNameFuel:this.customerNameFuel,
    // });

    this.docketChargeForm = this.formBuilder.group({
      customerNameDocket: new FormControl([], Validators.compose([ Validators.required ])),
      productDocket: new FormControl('',Validators.compose([Validators.required])),
      packingCharge: new FormControl('',Validators.compose([Validators.required])),
      docketCharge: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });

    this.essChargeForm = this.formBuilder.group({
      customerNameEss: new FormControl([], Validators.compose([ Validators.required ])),
      productEss: new FormControl('',Validators.compose([Validators.required])),
      essCharge: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });

    this.fovChargeForm = this.formBuilder.group({
      customerNameFov: new FormControl([], Validators.compose([ Validators.required ])),
      productFov: new FormControl('',Validators.compose([Validators.required])),
      fovPersent: new FormControl('',Validators.compose([Validators.required])),
      amount: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });


    this.ensChargeForm = this.formBuilder.group({
      customerNameEns: new FormControl([], Validators.compose([ Validators.required ])),
      detinationName: new FormControl([],Validators.compose([Validators.required])),
      ratePerKg: new FormControl('',Validators.compose([Validators.required])),
      minimumWt: new FormControl('',Validators.compose([Validators.required])),
      minimumAmount: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });

    this.volumetricChargeForm = this.formBuilder.group({
      customerNameVol: new FormControl([], Validators.compose([ Validators.required ])),
      volMode: new FormControl('',Validators.compose([Validators.required])),
      centimeter: new FormControl('',Validators.compose([ Validators.pattern(/^(?:0|[1-9]\d*)(?:\.\d+)?$/)])),
      cft: new FormControl('',Validators.compose([Validators.pattern(/^(?:0|[1-9]\d*)(?:\.\d+)?$/)])),
      inches: new FormControl('',Validators.compose([Validators.pattern(/^(?:0|[1-9]\d*)(?:\.\d+)?$/)])),
      inchCft: new FormControl('',Validators.compose([Validators.pattern(/^(?:0|[1-9]\d*)(?:\.\d+)?$/)])),
    });


    this.scChargeForm = this.formBuilder.group({
      customerNameSc: new FormControl([], Validators.compose([ Validators.required ])),
      stateName: new FormControl([],Validators.compose([Validators.required])),
      scPerKg: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });


    this.cafChargeForm = this.formBuilder.group({
      customerNameCaf: new FormControl([], Validators.compose([ Validators.required ])),
      productCaf: new FormControl('',Validators.compose([Validators.required])),
      cafCharge: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });
 
   
    this.idcChargeForm = this.formBuilder.group({
      customerNameIdc: new FormControl([], Validators.compose([ Validators.required ])),
      productIdc: new FormControl([],Validators.compose([Validators.required])),
      idcPer: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });

    this.insChargeForm = this.formBuilder.group({
      customerNameIns: new FormControl([], Validators.compose([ Validators.required ])),
      productIns: new FormControl([],Validators.compose([Validators.required])),
      insPersent: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });

    // this.insChargeForm.patchValue({
    //   customerNameIns:this.customerNameIns,
    // });


    this.metroChargeForm = this.formBuilder.group({
      customerNameMetro: new FormControl([], Validators.compose([ Validators.required ])),
      productMetro: new FormControl('',Validators.compose([Validators.required])),
      metro: new FormControl('',Validators.compose([Validators.required])),
      nonMetro: new FormControl('',Validators.compose([Validators.required])),
      fromDate: new FormControl('',Validators.compose([Validators.required])),
      toDate: new FormControl('',Validators.compose([Validators.required])),
    });

    this.odaChargeForm = this.formBuilder.group({
      customerNameOda: new FormControl([], [Validators.required]),
      productOda: new FormControl('', [Validators.required]),
      rateMode: new FormControl('', [Validators.required]),
      minimumAmountOda: new FormControl('', [Validators.required]),
      // rateTable: this.formBuilder.array([]),
      weightTable: this.formBuilder.array([]),
      // KilometerTable: this.formBuilder.array([])
    });

    this.odaChargeWtKm = this.formBuilder.group({
      weightTable: this.formBuilder.array([]),
      KilometerTable: this.formBuilder.array([])
    });


    for (let i = 0; i < 10; i++) {
      // this.addRateRow();
      this.addWeightRow();
      // this.addKilometerRow();
    }
    
    this.getDetination();
    this.getState();
    this.getProduct();
    this.getCustomer()

  }
// end NgOnIt


// get rateTable(): FormArray {
//   return this.odaChargeForm.get('rateTable') as FormArray;
// }

// addRateRow() {
//   const row = this.formBuilder.group({
//     kmsKgs: [''],
//     rate: ['']
//   });
//   this.rateTable.push(row);
// }

get weightTable(): FormArray {
  return this.odaChargeForm.get('weightTable') as FormArray;
}

addWeightRow() {
  const row = this.formBuilder.group({
    FromWeight: [''],
    ToWeight: [''],
    FromKilometer: [''],
    ToKilometert: [''],
    rate: ['']
  });
  this.weightTable.push(row);
}

// get KilometerTable(): FormArray {
//   return this.odaChargeForm.get('KilometerTable') as FormArray;
// }

// addKilometerRow() {
//   const row = this.formBuilder.group({
//     From: [''],
//     To: [''],
//     rate: ['']
//   });
//   this.KilometerTable.push(row);
// }


AddKmWgt(){
  const dialogRef = this.dialog.open(CustChargFormComponent, {
    data: {
      action: 'OdaWtKMAdd',
      // OdaCharData:  element || {},
      // OdaCharMode: element ? 'edit' : 'add'
    },
    width: '55rem',
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(()=> {
     
  });

}



getDetination(){
    this.http.get(`${environment.apiUrl}Booking/getDestination`).subscribe((res:any)=>{
       if(res.status === 1){
          this.destinationObj = res.Data;
       }else{
          this.openSnackBar(res.message , 'error-snackbar');
       }
    });   
  }

  getState(){
    this.http.get(`${environment.apiUrl}Booking/getState`).subscribe((res:any)=>{
       if(res.status === 1){
          this.stateObj = res.Data;
       }else{
          this.openSnackBar(res.message , 'error-snackbar');
       }
    });   
  }

  getProduct(){
    this.http.get(`${environment.apiUrl}Booking/getProduct`).subscribe((res:any)=>{
       if(res.status === 1){
          this.productObj = res.Data;
       }else{
          this.openSnackBar(res.message , 'error-snackbar');
       }
    });   
  }

  getCustomer(){
    this.http.get(`${environment.apiUrl}Booking/getConsigner`).subscribe((res:any)=>{
       if(res.status === 1){
          this.customerObj = res.Data;
       }else{
          this.openSnackBar(res.message , 'error-snackbar');
       }
    });   
  }


  
  convertToDateInputFormat(dateStr: string): string {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined') {
      return '';
    }
  
    const parts = dateStr.split('-'); // expects dd-MM-yyyy
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
  
    if (isNaN(+day) || isNaN(+month) || isNaN(+year)) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // dd-MM-yyyy
  }


  vehicleNumbers = [
    { vehicleReg: 'DELHI', Code: 'DL001' },
    { vehicleReg: 'MUMBAI', Code: 'MB002' },
    { vehicleReg: 'CHENNAI', Code: 'CH003' },
    { vehicleReg: 'PUNE', Code: 'PN004' }
  ];

  // rateTable = Array.from({ length: 10 }, () => ({ kmsKgs: '', rate: null }));

  setDefaultDates() {
    let today = new Date();

    let day = today.getDate().toString().padStart(2, '0'); 
    let month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    let year = today.getFullYear();

     let toDt = `${month}-${day}-${year}`;
     let fromDt = `${month}-01-${year}`;
   
     this.toDate = this.datePipe.transform(toDt, 'yyyy-MM-dd') || '';
     this.fromDate = this.datePipe.transform(fromDt, 'yyyy-MM-dd') || '';

     console.log("From Date :", this.fromDate);
     console.log("To Date :",this.toDate);
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


  // Fuel Charge
  formSubmitFuelCharg(formData:any){
   //Master/FuleMast?masterName=Fuel&operation=CreateFuel&customerCode=${formData.customerNameFuel}&productCode=${formData.productFuel}&fuelPer=${formData.fuelCharge}&amount=${formData.HdpCharge}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}&connectingHub=qe
   if (this.fuelChargeForm.valid) {
    const fuelData = {
      operation:"CreateFuel",
      customerCode: formData.customerNameFuel,
      productCode:formData.productFuel,
      fuelPer:formData.fuelCharge,
      amount:formData.HdpCharge,
      activeDate:formData.fromDate,
      closingDate:formData.toDate,
      clubNo:''
    }
   
    const formValue = this.replaceUndefinedWithEmptyString(fuelData);
    this.customerChrgService.createFuelCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.fuelChargeForm.controls).forEach((field) => {
      const control = this.fuelChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
}

updateFuelCharg(){
  if (this.fuelChargeForm.valid) { 
    const formData = this.fuelChargeForm.value;
    const fuelData = {
      operation:"UpdateFuel",
      customerCode: formData.customerNameFuel,
      productCode:formData.productFuel,
      fuelPer:formData.fuelCharge,
      amount:formData.HdpCharge,
      activeDate:formData.fromDate,
      closingDate:formData.toDate,
      clubNo: this.clubNoFuel,
    }

    const formValue = this.replaceUndefinedWithEmptyString(fuelData);
    this.customerChrgService.updateFuelCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
  }
  else {
    Object.keys(this.fuelChargeForm.controls).forEach((field) => {
      const control = this.fuelChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
}


   // Docket Charge
formSubmitDocketCharg(formData:any){
    // Master/DocketMast?masterName=Docket&operation=CreateDocket&customerCode=${formData.customerNameDocket}&productCode=${formData.productDocket}&docketCharges=${formData.docketCharge}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}&nFormCharges=${formData.packingCharge}
    if (this.docketChargeForm.valid) {

      const docketData = {
        operation:"CreateDocket",
        customerCode: formData.customerNameDocket,
        productCode:formData.productDocket,
        docketCharges:formData.docketCharge,
        nFormCharges:formData.packingCharge,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo:''
      }

    const formValue = this.replaceUndefinedWithEmptyString(docketData);
    this.customerChrgService.createDocketCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.docketChargeForm.controls).forEach((field) => {
      const control = this.docketChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }

  updateDocketCharg(){
    if (this.docketChargeForm.valid) {
      const formData = this.docketChargeForm.value
      const docketData = {
        operation:"UpdateDocket",
        customerCode: formData.customerNameDocket,
        productCode:formData.productDocket,
        docketCharges:formData.docketCharge,
        nFormCharges:formData.packingCharge,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoDocket,
      }
    const formValue = this.replaceUndefinedWithEmptyString(docketData);
    this.customerChrgService.updateDocketCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.docketChargeForm.controls).forEach((field) => {
      const control = this.docketCharge.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


   // Ess Charge
formSubmitEssCharg(formData:any){
    // Master/ESSMast?masterName=ESS&operation=CreateESS&customerCode=${formData.customerNameEss}&productCode=${formData.productEss}&fuelCharges=${formData.essCharge}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}
    if (this.essChargeForm.valid) {
      const essData = {
        operation:"CreateESS",
        customerCode: formData.customerNameEss,
        productCode:formData.productEss,
        fuelCharges:formData.essCharge,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: '',
      }

    const formValue = this.replaceUndefinedWithEmptyString(essData);
    this.customerChrgService.createEssCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
    }
    else {
      Object.keys(this.essChargeForm.controls).forEach((field) => {
        const control = this.essChargeForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
     }
  }

  updateEssCharg(){
    if (this.essChargeForm.valid) {
      const formData = this.essChargeForm.value
      const docketData = {
        operation:"UpdateESS",
        customerCode: formData.customerNameEss,
        productCode:formData.productEss,
        fuelCharges:formData.essCharge,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoEss,
      }
    const formValue = this.replaceUndefinedWithEmptyString(docketData);
    this.customerChrgService.updateEssCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.essChargeForm.controls).forEach((field) => {
      const control = this.essChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


   // Fov Charge
  formSubmitFovCharg(formData:any){
    // Master/FOVMast?masterName=FOV&operation=CreateFOV&customerCode=${formData.customerNameFov}&productCode=${formData.productFov}&FOVPer=${formData.fovPersent}&amount=${formData.amount}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}&connectingHub=q

    if (this.fovChargeForm.valid) {
      const fovData = {
        operation:"CreateFov",
        customerCode: formData.customerNameFov,
        productCode:formData.productFov,
        FOVPer:formData.fovPersent,
        amount:formData.amount,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: '',
      }

    const formValue = this.replaceUndefinedWithEmptyString(fovData);
    this.customerChrgService.createFovCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   } 
  else {
    Object.keys(this.fovChargeForm.controls).forEach((field) => {
      const control = this.fovChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }

  updateFovCharg(){

    if (this.fovChargeForm.valid) {
      const formData = this.fovChargeForm.value;
      const fovData = {
        operation:"UpdateFov",
        customerCode: formData.customerNameFov,
        productCode:formData.productFov,
        FOVPer:formData.fovPersent,
        amount:formData.amount,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoFov,
      }

    const formValue = this.replaceUndefinedWithEmptyString(fovData);
    this.customerChrgService.updateFovCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   } 
   else {
    Object.keys(this.fovChargeForm.controls).forEach((field) => {
      const control = this.fovChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


   // Ens Charge
  formSubmitEnsCharg(formData:any){
    // Master/ENSMast?masterName=ENS&operation=CreateENS&customerCode=${formData.customerNameEns}&productCode=${formData.productEns || ''}&destinationCode=${formData.detinationName}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}&ENSPer=${formData.ratePerKg}&amount=${formData.minimumAmount}&weight=${formData.minimumWt}`
    if (this.ensChargeForm.valid) {
      const ensData = {
        operation:"CreateEns",
        customerCode: formData.customerNameEns,
        // productCode:formData.productEns,
        destinationCode:formData.detinationName,
        ENSPer:formData.ratePerKg,
        amount:formData.minimumAmount,
        weight:formData.minimumWt,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: '',
      }

    console.log("Multiple Destination",this.detinationName);
    const formValue = this.replaceUndefinedWithEmptyString(ensData);
    this.customerChrgService.createEnsCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
    }
    else {
      Object.keys(this.ensChargeForm.controls).forEach((field) => {
        const control = this.ensChargeForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
     }
  }

  updateEnsCharg(){
    if (this.ensChargeForm.valid) {
      const formData = this.ensChargeForm.value;
      const ensData = {
        operation:"UpdateEns",
        customerCode: formData.customerNameEns,
        // productCode:formData.productEns,
        destinationCode:formData.detinationName,
        ENSPer:formData.ratePerKg,
        amount:formData.minimumAmount,
        weight:formData.minimumWt,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoEns,
      }
    
    const formValue = this.replaceUndefinedWithEmptyString(ensData);
    this.customerChrgService.updateEnsCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.ensChargeForm.controls).forEach((field) => {
      const control = this.ensChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


   // Volumetric Charge
  formSubmitVolumetricCharg(formData:any){
    // VolumetricMast?masterName=Volumetric&operation=CreateVolumetric&customerCode=${formData.customerNameEns}&productCode=${formData.volMode}&volCalc=${formData.centimeter}&calc=${formData.cft}&volInches=${formData.inches}&CFTInches=${formData.inchCft}
    if (this.volumetricChargeForm.valid) {
      const volData = {
        operation:"CreateVolumetric",
        customerCode: formData.customerNameVol,
        productCode:formData.volMode,
        volCalc:formData.centimeter,
        calc:formData.cft,
        volInches:formData.inches,
        CFTInches:formData.inchCft,
        clubNo: '',
      }
    const formValue = this.replaceUndefinedWithEmptyString(volData);
    this.customerChrgService.createVolCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.volumetricChargeForm.controls).forEach((field) => {
      const control = this.volumetricChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }

  updateVolumetricCharg(){

    if (this.volumetricChargeForm.valid) {
      const formData = this.volumetricChargeForm.value;
      const volData = {
        operation:"UpdateVolumetric",
        customerCode: formData.customerNameVol,
        productCode:formData.volMode,
        volCalc:formData.centimeter,
        calc:formData.cft,
        volInches:formData.inches,
        CFTInches:formData.inchCft,
        clubNo: this.clubNoVol,
      }

    const formValue = this.replaceUndefinedWithEmptyString(volData);
    this.customerChrgService.updateVolCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.volumetricChargeForm.controls).forEach((field) => {
      const control = this.volumetricChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


   // Sc Charge
  formSubmitScCharg(formData:any){
    // Master/SCMast?masterName=SCharge&operation=CreateSCharge&customerCode=${formData.customerNameSc}&stateName=${formData.stateName}&amount=${formData.scPerKg}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}`
    if (this.scChargeForm.valid) {
      const volData = {
        operation:"CreateSCharge",
        customerCode: formData.customerNameSc,
        stateCode:formData.stateName,
        amount:formData.scPerKg,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: '',
      }
    const formValue = this.replaceUndefinedWithEmptyString(volData);
    this.customerChrgService.createScCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
  }else {
    Object.keys(this.scChargeForm.controls).forEach((field) => {
      const control = this.scChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }

  updateScCharg(){ 
    if (this.scChargeForm.valid) {
      const formData = this.scChargeForm.value;
      const volData = {
        operation:"UpdateSCharge",
        customerCode: formData.customerNameSc,
        stateCode:formData.stateName,
        amount:formData.scPerKg,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoSc,
      }
    const formValue = this.replaceUndefinedWithEmptyString(volData);
    this.customerChrgService.updateScCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
  }else {
    Object.keys(this.scChargeForm.controls).forEach((field) => {
      const control = this.scChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


   // Caf Charge
  formSubmitCafCharg(formData:any){
    // Master/CAFMast?masterName=CAFCharge&operation=CreateCAFCharge&customerCode=${formData.customerNameCaf}&productCode=${formData.productCaf}&fuelCharges=${formData.cafCharge}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}`
    if (this.cafChargeForm.valid) {
      const cafData = {
        operation:"CreateCAFCharge",
        customerCode: formData.customerNameCaf,
        productCode:formData.productCaf,
        fuelCharges:formData.cafCharge,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: '',
      }

    const formValue = this.replaceUndefinedWithEmptyString(cafData);
    this.customerChrgService.createCafCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }else {
    Object.keys(this.cafChargeForm.controls).forEach((field) => {
      const control = this.cafChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }

  updateCafCharg(){
    if (this.cafChargeForm.valid) {
      const formData = this.cafChargeForm.value
      const cafData = {
        operation:"UpdateCAFCharge",
        customerCode: formData.customerNameCaf,
        productCode:formData.productCaf,
        fuelCharges:formData.cafCharge,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoCaf,
      }
    const formValue = this.replaceUndefinedWithEmptyString(cafData);
    this.customerChrgService.updateCafCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }else {
    Object.keys(this.cafChargeForm.controls).forEach((field) => {
      const control = this.cafChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


   // Idc Charge
  formSubmitIdcCharg(formData:any){
    // Master/IDCMast?masterName=IDCCharge&operation=CreateIDCCharge&customerCode=${formData.customerNameIdc}&productCode=${formData.productIdc}&IDCPer=${formData.idcPer}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}`
    if (this.idcChargeForm.valid) {
      const idcData = {
        operation:"CreateIDCCharge",
        customerCode: formData.customerNameIdc,
        productCode: formData.productIdc,
        IDCPer: formData.idcPer,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: '',
      }
    const formValue = this.replaceUndefinedWithEmptyString(idcData);
    this.customerChrgService.createIdcCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.idcChargeForm.controls).forEach((field) => {
      const control = this.idcChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }

  updateIdcCharg(){
    if (this.idcChargeForm.valid) {
      const formData = this.idcChargeForm.value
      const idcData = {
        operation:"UpdateIDCCharge",
        customerCode: formData.customerNameIdc,
        productCode: formData.productIdc,
        IDCPer: formData.idcPer,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoIdc,
      }
    const formValue = this.replaceUndefinedWithEmptyString(idcData);
    this.customerChrgService.updateIdcCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.idcChargeForm.controls).forEach((field) => {
      const control = this.idcChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


  // Insurance Charge
  formSubmitInsCharg(formData:any){
    // /Master/Insurance?masterName=Insurance&operation=CreateInsurance&customerCode=${formData.customerNameIns}&productCode=${formData.productIns}&insurancePer=${formData.insPersent}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}`
    if (this.insChargeForm.valid) {
      const idcData = {
        operation:"CreateInsurance",
        customerCode: formData.customerNameIns,
        productCode: formData.productIns,
        insurancePer: formData.insPersent,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: '',
      }
    const formValue = this.replaceUndefinedWithEmptyString(idcData);
    this.customerChrgService.createInsuranceCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
    }
    else {
      Object.keys(this.insChargeForm.controls).forEach((field) => {
        const control = this.insChargeForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
     }
  }

  updateInsCharg(){
    if (this.insChargeForm.valid) {
      const formData = this.insChargeForm.value
      const insData = {
        operation:"UpdateInsurance",
        customerCode: formData.customerNameIns,
        productCode: formData.productIns,
        insurancePer: formData.insPersent,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoIns,
      }
    const formValue = this.replaceUndefinedWithEmptyString(insData);
    this.customerChrgService.updateInsuranceCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   } else {
    Object.keys(this.insChargeForm.controls).forEach((field) => {
      const control = this.insChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


  // Metro Charge
  formSubmitMetroCharg(formData:any){
    // /Master/Metro?masterName=Metro&operation=CreateMetro&customerCode=${formData.customerNameMetro}&productCode=${formData.productMetro}&metroCharges=${formData.metro}&nonMetroCharges=${formData.nonMetro}&activeDate=${formData.fromDate}&closingDate=${formData.toDate}`)
    if (this.metroChargeForm.valid) {
      const metroData = {
        operation:"CreateMetro",
        customerCode: formData.customerNameMetro,
        productCode: formData.productMetro,
        metroCharges: formData.metro,
        nonMetroCharges: formData.nonMetro,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: '',
      }
    const formValue = this.replaceUndefinedWithEmptyString(metroData);
    this.customerChrgService.createMetroCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.metroChargeForm.controls).forEach((field) => {
      const control = this.metroChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }

  updateMetroCharg(){
    if (this.metroChargeForm.valid) {
      const formData = this.metroChargeForm.value
      const metroData = {
        operation:"UpdateMetro",
        customerCode: formData.customerNameMetro,
        productCode: formData.productMetro,
        metroCharges: formData.metro,
        nonMetroCharges: formData.nonMetro,
        activeDate:formData.fromDate,
        closingDate:formData.toDate,
        clubNo: this.clubNoMetro,
      }
    const formValue = this.replaceUndefinedWithEmptyString(metroData);
    this.customerChrgService.updateMetroCharge(formValue).subscribe((res:any)=>{
      if(res.status === 1){
        this.openSnackBar(res.message , 'custom-snackbar');
        this.CloseDialog();
      }else{
        this.openSnackBar(res.message , 'error-snackbar');
      }
    });
   }
   else {
    Object.keys(this.metroChargeForm.controls).forEach((field) => {
      const control = this.metroChargeForm.get(field);
      control.markAsTouched({ onlySelf: false });
    });
   }
  }


  formSubmitOdaCharg(formData:any){

  }

  updateOdaCharg(){

  }


  formSubmitWtKm(formData:any){

  }


  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  // onSearch() {
  //   this.().subscribe((res: any) => {
  //     console.log('formdata:', res);
  //     console.log('formdata:', res.Data);
  //     if (res.status == 1) {
  //       // this.dataSource1.data=res.Data;
  //       const flattenedData = res.Data[0];
  //       this.dataSource = new MatTableDataSource(flattenedData);
  //       this.displayedColumns = Object.keys(flattenedData[0]);
  //       // this.showTable = true;
  //     } else {
  //       alert( res.message)
  //     }
  //   },error => {
  //          console.error("API Error:", error);
  //          alert("An error occurred while fetching data.");
  //          this.dataSource = new MatTableDataSource([]);
  //          this.displayedColumns = [];
  //         //  this.showTable = false;
  //      });
  // }



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

  statusList = [0, 1, 0, 1, 0, 0, 1, 1, 0, 0]; // Or from API

  getRowClass(status: number): string {
    return status === 0 ? 'row-green' : 'row-blue';
  }


}
