import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-airmode',
  templateUrl: './airmode.component.html',
  styleUrls: ['./airmode.component.scss']
})
export class AirmodeComponent implements OnInit {
  constructor(
    private _mdr: MatDialogRef<AirmodeComponent>,
    @Inject(MAT_DIALOG_DATA) data: any

  ) { 
    
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }


}
