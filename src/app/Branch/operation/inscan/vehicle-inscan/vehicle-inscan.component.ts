import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VehicleBulkComponent } from 'app/Branch/Shared/inscan pages/vehicle-bulk/vehicle-bulk.component';

@Component({
  selector: 'app-vehicle-inscan',
  templateUrl: './vehicle-inscan.component.html',
  styleUrls: ['./vehicle-inscan.component.css']
})
export class VehicleInscanComponent implements OnInit {
  displayedColumns: any[] = ['vehicleNo','manfNo', 'via','mode', 'Shipt', 'Pcs','Weight','Origine','Dst','DriverName','Route','action'];
  dataSource  = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public dialog: MatDialog ) { }

  ngOnInit(): void {
  }
  openVehicleBulkModal(){
    const dialogRef = this.dialog.open(VehicleBulkComponent, {
      data: {
        action: 'add'
      },
      width: '60rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
    });

  }
  deleteRow(rowData: PeriodicElement) {
    const index = this.dataSource.data.indexOf(rowData);    
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);     
      this.dataSource.data = [...this.dataSource.data];
    }
  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
 
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

export interface PeriodicElement {

  vehicleNo: any;
  manfNo: any;
  via: any;
  mode: any;
  Shipt: any;
  Pcs: any;
  Weight: any;
  Origine: any;
  Dst: any;
  DriverName: any;
  Route: any;
  
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {vehicleNo: '12346', manfNo: '20-09-2023', via: 'FAzal', mode:'SHARIB', Shipt: 'Mumbai', Pcs: 'Mumbai', Weight: 'Mumbai', Origine: 'Darbhanga', Dst:'Good' , DriverName:'Good',Route:'Good', action:'Good'},
  {vehicleNo: '12346', manfNo: '20-09-2023', via: 'FAzal', mode:'SHARIB', Shipt: 'Mumbai', Pcs: 'Mumbai', Weight: 'Mumbai', Origine: 'Darbhanga', Dst:'Good' , DriverName:'Good',Route:'Good', action:'Good'},
  {vehicleNo: '12346', manfNo: '20-09-2023', via: 'FAzal', mode:'SHARIB', Shipt: 'Mumbai', Pcs: 'Mumbai', Weight: 'Mumbai', Origine: 'Darbhanga', Dst:'Good' , DriverName:'Good',Route:'Good', action:'Good'},
  {vehicleNo: '12346', manfNo: '20-09-2023', via: 'FAzal', mode:'SHARIB', Shipt: 'Mumbai', Pcs: 'Mumbai', Weight: 'Mumbai', Origine: 'Darbhanga', Dst:'Good' , DriverName:'Good',Route:'Good', action:'Good'},
  {vehicleNo: '12346', manfNo: '20-09-2023', via: 'FAzal', mode:'SHARIB', Shipt: 'Mumbai', Pcs: 'Mumbai', Weight: 'Mumbai', Origine: 'Darbhanga', Dst:'Good' , DriverName:'Good',Route:'Good', action:'Good'},
  {vehicleNo: '12346', manfNo: '20-09-2023', via: 'FAzal', mode:'SHARIB', Shipt: 'Mumbai', Pcs: 'Mumbai', Weight: 'Mumbai', Origine: 'Darbhanga', Dst:'Good' , DriverName:'Good',Route:'Good', action:'Good'},
  {vehicleNo: '12346', manfNo: '20-09-2023', via: 'FAzal', mode:'SHARIB', Shipt: 'Mumbai', Pcs: 'Mumbai', Weight: 'Mumbai', Origine: 'Darbhanga', Dst:'Good' , DriverName:'Good',Route:'Good', action:'Good'},
   {vehicleNo: '12346', manfNo: '20-09-2023', via: 'FAzal', mode:'SHARIB', Shipt: 'Mumbai', Pcs: 'Mumbai', Weight: 'Mumbai', Origine: 'Darbhanga', Dst:'Good' , DriverName:'Good',Route:'Good', action:'Good'},
 
];
