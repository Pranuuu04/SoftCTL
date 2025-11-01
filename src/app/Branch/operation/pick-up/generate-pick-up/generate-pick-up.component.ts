import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GenerateBulkComponent } from 'app/Branch/Shared/pick-up/generate-bulk/generate-bulk.component';

@Component({
  selector: 'app-generate-pick-up',
  templateUrl: './generate-pick-up.component.html',
  styleUrls: ['./generate-pick-up.component.css']
})
export class GeneratePickUpComponent implements OnInit {
  
  
  // @ViewChild('comment') commentTemplate: TemplateRef<any>;


  selectedCar: number;

  cars = [
      { id: 1, name: 'Volvo' },
      { id: 2, name: 'Saab' },
      { id: 3, name: 'Opel' },
      { id: 4, name: 'Audi' },
  ];
  

  currentDate: any;
  pageSizeOptions: number[] = [5, 10, 20];
  dataSource  = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 1;
  pageSize: number ;
  displayedColumns: any[] = ['awbNo','bookDate', 'manifestNo' ,'customerType','consigneeName','Origin','Destination_Name','consigneePin','modeCode','Product_Type','Qty','ActualWt','totalAmt'];

  

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().split('T')[0];
  }
  
  openGenBulkModal(){
    const dialogRef = this.dialog.open(GenerateBulkComponent, {
      data: {
        action: 'add'
      },
      width: '70rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
    });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
 ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

}

export interface PeriodicElement {

  awbNo: any;
  bookDate: any;
  manifestNo: any;
  customerType: any;
  consigneeName: any;
  Origin: any;
  Destination_Name: any;
  consigneePin: any;
  modeCode: any;
  Product_Type: any;
  Qty: any;
  ActualWt: any;
  totalAmt: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {awbNo: '12346', bookDate: '20-09-2023', manifestNo: 'Prasad', customerType:'COD', consigneeName: 'Mumbai', Origin: 'Mumbai', Destination_Name: 'Mumbai', consigneePin: 'Darbhanga', modeCode:'Good' , Product_Type:'Good', Qty:'Good', ActualWt:'Good', totalAmt:'Good'},
  {awbNo: '12346', bookDate: '20-09-2023', manifestNo: 'Prasad', customerType:'COD', consigneeName: 'Mumbai', Origin: 'Mumbai', Destination_Name: 'Mumbai', consigneePin: 'Darbhanga', modeCode:'Good' , Product_Type:'Good', Qty:'Good', ActualWt:'Good', totalAmt:'Good'},
  {awbNo: '12346', bookDate: '20-09-2023', manifestNo: 'Prasad', customerType:'COD', consigneeName: 'Mumbai', Origin: 'Mumbai', Destination_Name: 'Mumbai', consigneePin: 'Darbhanga', modeCode:'Good' , Product_Type:'Good', Qty:'Good', ActualWt:'Good', totalAmt:'Good'},
  {awbNo: '12346', bookDate: '20-09-2023', manifestNo: 'Prasad', customerType:'COD', consigneeName: 'Mumbai', Origin: 'Mumbai', Destination_Name: 'Mumbai', consigneePin: 'Darbhanga', modeCode:'Good' , Product_Type:'Good', Qty:'Good', ActualWt:'Good', totalAmt:'Good'},
  {awbNo: '12346', bookDate: '20-09-2023', manifestNo: 'Prasad', customerType:'COD', consigneeName: 'Mumbai', Origin: 'Mumbai', Destination_Name: 'Mumbai', consigneePin: 'Darbhanga', modeCode:'Good' , Product_Type:'Good', Qty:'Good', ActualWt:'Good', totalAmt:'Good'},
  {awbNo: '12346', bookDate: '20-09-2023', manifestNo: 'Prasad', customerType:'COD', consigneeName: 'Mumbai', Origin: 'Mumbai', Destination_Name: 'Mumbai', consigneePin: 'Darbhanga', modeCode:'Good' , Product_Type:'Good', Qty:'Good', ActualWt:'Good', totalAmt:'Good'},
  {awbNo: '12346', bookDate: '20-09-2023', manifestNo: 'Prasad', customerType:'COD', consigneeName: 'Mumbai', Origin: 'Mumbai', Destination_Name: 'Mumbai', consigneePin: 'Darbhanga', modeCode:'Good' , Product_Type:'Good', Qty:'Good', ActualWt:'Good', totalAmt:'Good'},
  {awbNo: '12346', bookDate: '20-09-2023', manifestNo: 'Prasad', customerType:'COD', consigneeName: 'Mumbai', Origin: 'Mumbai', Destination_Name: 'Mumbai', consigneePin: 'Darbhanga', modeCode:'Good' , Product_Type:'Good', Qty:'Good', ActualWt:'Good', totalAmt:'Good'},
 
];

