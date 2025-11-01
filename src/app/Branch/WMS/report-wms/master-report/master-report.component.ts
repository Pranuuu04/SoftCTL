import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-report',
  templateUrl: './master-report.component.html',
  styleUrls: ['./master-report.component.css']
})
export class MasterReportComponent implements OnInit {
  refresh() {
    throw new Error('Method not implemented.');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
