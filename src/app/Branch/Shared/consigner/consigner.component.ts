import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-consigner',
  templateUrl: './consigner.component.html',
  styleUrls: ['./consigner.component.scss']
})

export class ConsignerComponent implements OnInit {

  deptForm: FormGroup
  getName: string;

  constructor(private _mdr: MatDialogRef<ConsignerComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              private fb: FormBuilder,
              private getData: AllServicesService
              ) {
                this.deptForm = this.fb.group({
                  ContactNumber: this.fb.control('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*[0-9]{10,10}')]),
            email : this.fb.control('', [Validators.required, Validators.email]),
            Departmentname: this.fb.control('')
            })
              this.getData.getDepartment().subscribe((res: any) => {
                this.getName = res.Data
                })
              }

  ngOnInit(): void { }

  CloseDialog() {
    this._mdr.close(false);
  }

  saveAllData(deptForm) {
  const send = this.deptForm.value
  this.getData.reciveDept(send)
  this._mdr.close(false);
 }

}
