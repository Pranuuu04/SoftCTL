import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorCreditComponent implements OnInit {
  constructor(
    private _mdr: MatDialogRef<VendorCreditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any

  ) { 
    
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }
  SavaData(){
    this._mdr.close(false);
  }

}

