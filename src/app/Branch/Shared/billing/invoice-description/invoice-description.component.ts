import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-description',
  templateUrl: './invoice-description.component.html',
  styleUrls: ['./invoice-description.component.css']
})
export class InvoiceDescriptionComponent implements OnInit {

  constructor(private _mdr: MatDialogRef<InvoiceDescriptionComponent>,
                @Inject(MAT_DIALOG_DATA) data: any,) { }

  ngOnInit(): void {
  }

  CloseDialog() {
    this._mdr.close(false);
  }

}
