import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generate-bulk',
  templateUrl: './generate-bulk.component.html',
  styleUrls: ['./generate-bulk.component.css']
})
export class GenerateBulkComponent implements OnInit {

  constructor(private _mdr: MatDialogRef<GenerateBulkComponent>,) { }

  ngOnInit(): void {
  }
  CloseDialog() {
    this._mdr.close(false);
  }

  items: any[] = [
    { order: 76, date: '03/24/2023', Sender: 'Corporation', pincode: 'mumbai', contact: 'Corporation', Conginee: 6660, Fdst: 6660,Tdst:'abc' ,PCS:378, mode: 6660, weight: 6660, selected: false },
    { order: 76, date: '03/24/2023', Sender: 'Corporation', pincode: 'mumbai', contact: 'Corporation', Conginee: 6660, Fdst: 6660,Tdst:'abc' ,PCS:378, mode: 6660, weight: 6660, selected: false },
    { order: 76, date: '03/24/2023', Sender: 'Corporation', pincode: 'mumbai', contact: 'Corporation', Conginee: 6660, Fdst: 6660,Tdst:'abc' ,PCS:378, mode: 6660, weight: 6660, selected: false },
    { order: 76, date: '03/24/2023', Sender: 'Corporation', pincode: 'mumbai', contact: 'Corporation', Conginee: 6660, Fdst: 6660,Tdst:'abc' ,PCS:378, mode: 6660, weight: 6660, selected: false },
    { order: 76, date: '03/24/2023', Sender: 'Corporation', pincode: 'mumbai', contact: 'Corporation', Conginee: 6660, Fdst: 6660,Tdst:'abc' ,PCS:378, mode: 6660, weight: 6660, selected: false },
    { order: 76, date: '03/24/2023', Sender: 'Corporation', pincode: 'mumbai', contact: 'Corporation', Conginee: 6660, Fdst: 6660,Tdst:'abc' ,PCS:378, mode: 6660, weight: 6660, selected: false },
    { order: 76, date: '03/24/2023', Sender: 'Corporation', pincode: 'mumbai', contact: 'Corporation', Conginee: 6660, Fdst: 6660,Tdst:'abc' ,PCS:378, mode: 6660, weight: 6660, selected: false },
    { order: 76, date: '03/24/2023', Sender: 'Corporation', pincode: 'mumbai', contact: 'Corporation', Conginee: 6660, Fdst: 6660,Tdst:'abc' ,PCS:378, mode: 6660, weight: 6660, selected: false },
   
    ];

  selectAll: boolean = false; 

  toggleSelectAll() {
    const isSelected = this.items.every(item => item.selected);
    this.items.forEach(item => (item.selected = !isSelected));
  }

}
