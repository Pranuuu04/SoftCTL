import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-consignee',
  templateUrl: './consignee.component.html',
  styleUrls: ['./consignee.component.css'],
  
})
export class ConsigneeComponent implements OnInit {

  consigneeList: any = [];
  consigneeName: any;

  constructor(private _mdr: MatDialogRef<ConsigneeComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,) {
                if (data.responseData) {
                  this.consigneeList = data.responseData;
                }
               }

  ngOnInit(): void {
  }

  CloseDialog() {
    this._mdr.close(false);
  }

  submitData(){
    let obj = {
      consignee: this.consigneeName,
    }
    this._mdr.close(obj);
  }

}
