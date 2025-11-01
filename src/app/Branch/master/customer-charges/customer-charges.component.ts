import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-charges',
  templateUrl: './customer-charges.component.html',
  styleUrls: ['./customer-charges.component.css']
})
export class CustomerChargesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  activeTab: number = 0;

onTabChange(index: number) {
  this.activeTab = index;
}

}
