import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-trainmode',
  templateUrl: './trainmode.component.html',
  styleUrls: ['./trainmode.component.scss']
})
export class TrainmodeComponent implements OnInit {

  constructor(
    private _mdr: MatDialogRef<TrainmodeComponent>,
    @Inject(MAT_DIALOG_DATA) data: any

  ) { 
    
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }

}
