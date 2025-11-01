import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bluedart',
  templateUrl: './bluedart.component.html',
  styleUrls: ['./bluedart.component.scss']
})
export class BluedartCreditComponent implements OnInit {

  constructor(
    private _mdr: MatDialogRef<BluedartCreditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) { }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }
}
