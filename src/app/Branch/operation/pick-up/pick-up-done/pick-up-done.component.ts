import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pick-up-done',
  templateUrl: './pick-up-done.component.html',
  styleUrls: ['./pick-up-done.component.css']
})
export class PickUpDoneComponent {
  displayedColumns: any[] = ['position', 'AwbNo', 'Date', 'Consigner','Consignee','FromDst','ToDst','PCs','Weight','Action'];

  constructor() { }

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface PeriodicElement {
  position: any;
  AwbNo: any;
  Date: any;
  Consigner: any;
  Consignee: any;
  FromDst: any;
  ToDst: any;
  PCs: any;
  Weight: any;
  Action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 2, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 3, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 4, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 5, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 6, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 7, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 8, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 9, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 10, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 11, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 12, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 13, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 14, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 15, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 16, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 17, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 18, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 19, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},
  {position: 20, AwbNo: '12346', Date: '20-09-2023', Consigner: 'FAzal', Consignee:'SHARIB', FromDst: 'Mumbai', ToDst: 'Darbhanga', PCs:'2', Weight: '70', Action:'Good'},

];
