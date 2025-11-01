import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pending-pick-up',
  templateUrl: './pending-pick-up.component.html',
  styleUrls: ['./pending-pick-up.component.css']
})
export class PendingPickUpComponent implements OnInit {

  constructor() { }
  displayedColumns: any[] = ['orderNo','date', 'senderName','pincode', 'contact', 'conginee','Fdst','Tdst','pcs','mode','weight'];

  ngOnInit(): void {
  }

  dataSource  = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

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

  orderNo: any;
  date: any;
  senderName: any;
  pincode: any;
  contact: any;
  conginee: any;
  Fdst: any;
  Tdst: any;
  pcs: any;
  mode: any;
  weight: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
  {orderNo: '12346', date: '20-09-2023', senderName: 'FAzal', pincode:'SHARIB', contact: 'Mumbai', conginee: 'Mumbai', Fdst: 'Mumbai', Tdst: 'Darbhanga', pcs:'Good' , mode:'Good',weight:'Good'},
 
];
