import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-cust-type-add',
  templateUrl: './cust-type-add.component.html',
  styleUrls: ['./cust-type-add.component.css']
})
export class CustTypeAddComponent implements OnInit {

  custTypeForms: FormGroup
  constructor(private _mdr: MatDialogRef<CustTypeAddComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              private getData: AllServicesService,
  ) {

  this.custTypeForms = new FormGroup({
    Amount : new FormControl(),
    Weight : new FormControl(),
    CustomerType : new FormControl(),
    Remark : new FormControl(),


  })
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }
  sendDataService() {
    // const locationCode: string =  "mum"
  }
  submit(custTypeFormsvalue) {
    //  const TransactionID: string =  this.custTypeForms.value.TransactionID
    //  const TransactionDate: string =  this.custTypeForms.value.TransactionDate
    //  const ReceivedAmount: string =  this.custTypeForms.value.ReceivedAmount
    //  const BalancedAmount: string =  this.custTypeForms.value.TransactionID
// let data={TransactionID,TransactionDate}

    this.getData.reciveCharge(custTypeFormsvalue)
    this._mdr.close(false);
  }

}
