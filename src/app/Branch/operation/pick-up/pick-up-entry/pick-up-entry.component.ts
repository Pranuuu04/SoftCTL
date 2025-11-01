import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pick-up-entry',
  templateUrl: './pick-up-entry.component.html',
  styleUrls: ['./pick-up-entry.component.css']
})
export class PickUpEntryComponent implements OnInit {
  selectedCar: number;

  cars = [
      { id: 1, name: 'Volvo' },
      { id: 2, name: 'Saab' },
      { id: 3, name: 'Opel' },
      { id: 4, name: 'Audi' },
  ];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
