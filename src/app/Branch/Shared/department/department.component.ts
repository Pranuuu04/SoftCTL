import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  depaForms: FormGroup

  constructor(private _mdr: MatDialogRef<DepartmentComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              private getData: AllServicesService,
            ) {
                this.depaForms = new FormGroup({
                  TransactionID : new FormControl(),
                  TransactionDate : new FormControl(),
                  ReceivedAmount : new FormControl(),
                  BalancedAmount : new FormControl(),
                })
              }

  ngOnInit(): void {}

  CloseDialog() {
    this._mdr.close(false);
  }

  sendDataService() {}
  submit(depaFormsvalue) {
    this.getData.reciveCharge(depaFormsvalue)
    this._mdr.close(false);
  }

}
