import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-seamode',
  templateUrl: './seamode.component.html',
  styleUrls: ['./seamode.component.scss']
})
export class SeamodeCreditComponent implements OnInit {

  constructor(
    private _mdr: MatDialogRef<SeamodeCreditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any

  ) { 
    
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }

}
