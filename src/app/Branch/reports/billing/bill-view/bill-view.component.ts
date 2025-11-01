import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.css']
})
export class BillViewComponent {

  displayedColumns: any[] = [ 'Bill_No', 'Bill_Date', 'Customer_Name','Count_Of_AWBNo','Count_Of_Pics','Amt','GST','Total_Amt',];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getCurrentDate(): string {
    // Implement logic to return the current date as a string
    return new Date().toISOString().split('T')[0];
  }

  getDefaultDate(): string {
    // Implement logic to return the default date as a string
    // For example, returning the current date
    return new Date().toISOString().split('T')[0];
  }
}

export interface PeriodicElement {
  // position: any;
  Bill_No: any;
  Bill_Date: any;
  Customer_Name: any;
  Count_Of_AWBNo: any;
  Count_Of_Pics: any;
  Amt: any;
  GST: any;
  Total_Amt: any
}

const ELEMENT_DATA: PeriodicElement[] = [
  {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },
  // {Bill_No: '12346', Bill_Date: '20-09-2023', Customer_Name: 'ABC', Count_Of_AWBNo:'1234', Count_Of_Pics: '45', Amt: '90', GST:'2', Total_Amt: '70', },

];

 