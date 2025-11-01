import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-active-customer',
  templateUrl: './active-customer.component.html',
  styleUrls: ['./active-customer.component.scss']
})
export class ShipperCreditComponent implements OnInit {
  
  activeForm :FormGroup
  constructor(
    private _mdr: MatDialogRef<ShipperCreditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb :FormBuilder,
    private getData :AllServicesService,
    private http:HttpClient

  ) { 
    
    this.activeForm =this.fb.group({
      pin: new FormControl(), 
      add1: new FormControl(), 
      add2: new FormControl(), 
      City: new FormControl(),
      ContactNo: this.fb.control('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*[0-9]{10,10}')]),
      Email: this.fb.control('', [Validators.email]),
      GSTNo: new FormControl(), 
    })
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }
  submit(activeFormValue){
    
  }
  saveData(activeFormValue){
    let send = this.activeForm.value
    this.getData.reciveShipper(send)
    this._mdr.close(false);
  }
  
}

