import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unloading-bulk',
  templateUrl: './unloading-bulk.component.html',
  styleUrls: ['./unloading-bulk.component.css']
})
export class UnloadingBulkComponent implements OnInit {

  constructor(  private _mdr: MatDialogRef<UnloadingBulkComponent>,) { }

  ngOnInit(): void {
  }
  CloseDialog() {
    this._mdr.close(false);
  }
}
