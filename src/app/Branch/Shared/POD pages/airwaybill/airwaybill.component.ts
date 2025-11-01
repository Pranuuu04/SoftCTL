import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-airwaybill',
  templateUrl: './airwaybill.component.html',
  styleUrls: ['./airwaybill.component.css']
})
export class AirwaybillComponent implements OnInit {

  constructor(  private _mdr: MatDialogRef<AirwaybillComponent>,) { }

  ngOnInit(): void {
  }
  CloseDialog() {
    this._mdr.close(false);
  }

}
