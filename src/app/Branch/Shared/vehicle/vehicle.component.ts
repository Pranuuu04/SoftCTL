import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicleForms :FormGroup
  constructor(
    private _mdr: MatDialogRef<VehicleComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
   private fb: FormBuilder,
   private getData:AllServicesService,
   private http:HttpClient

  ) { 
    
  this.vehicleForms = new FormGroup({
    VehicleType : new FormControl(),
    VehicleNo : new FormControl(),
    DriverName : new FormControl(),
    DriverNo : new FormControl(),
    

  })
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }
  sendDataService(){
    // const locationCode: string =  "mum"
  }
  submit(vehicleFormsvalue){
    //  const TransactionID: string =  this.vehicleForms.value.TransactionID
    //  const TransactionDate: string =  this.vehicleForms.value.TransactionDate
    //  const ReceivedAmount: string =  this.vehicleForms.value.ReceivedAmount
    //  const BalancedAmount: string =  this.vehicleForms.value.TransactionID
// let data={TransactionID,TransactionDate}

    this.getData.reciveCharge(vehicleFormsvalue)
    this._mdr.close(false);
  }

}
