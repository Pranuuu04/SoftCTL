import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-other-feature',
  templateUrl: './other-feature.component.html',
  styleUrls: ['./other-feature.component.css']
})
export class OtherFeatureComponent implements OnInit {

  constructor(  private _mdr: MatDialogRef<OtherFeatureComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
   private fb: FormBuilder,
   private getData:AllServicesService,
   private http:HttpClient
) {}

  ngOnInit(): void {
  }
  CloseDialog() {
    this._mdr.close(false);
  }
}
