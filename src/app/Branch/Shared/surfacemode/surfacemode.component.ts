import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-surfacemode',
  templateUrl: './surfacemode.component.html',
  styleUrls: ['./surfacemode.component.scss']
})
export class SurfacemodeComponent implements OnInit {

  constructor(
    private _mdr: MatDialogRef<SurfacemodeComponent>,
    @Inject(MAT_DIALOG_DATA) data: any

  ) { 
    
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }

}
