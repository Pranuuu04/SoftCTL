import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';



export interface PeriodicElement {
  position:number;
  vehicleNo: number;
  bookingDt: string;
  consignee: string;
  destination: string;
  pcs: string;
  weight: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, vehicleNo: 76, bookingDt: '03/24/2023', consignee: 'Corporation', destination: 'mumbai', pcs: 'Corporation', weight: 6660},
  {position: 2, vehicleNo: 76, bookingDt: '03/24/2023', consignee: 'Corporation', destination: 'mumbai', pcs: 'Corporation', weight: 6660},
  {position: 3, vehicleNo: 76, bookingDt: '03/24/2023', consignee: 'Corporation', destination: 'mumbai', pcs: 'Corporation', weight: 6660},
  {position: 4, vehicleNo: 76, bookingDt: '03/24/2023', consignee: 'Corporation', destination: 'mumbai', pcs: 'Corporation', weight: 6660},
  {position: 5, vehicleNo: 76, bookingDt: '03/24/2023', consignee: 'Corporation', destination: 'mumbai', pcs: 'Corporation', weight: 6660},
  {position: 6, vehicleNo: 76, bookingDt: '03/24/2023', consignee: 'Corporation', destination: 'mumbai', pcs: 'Corporation', weight: 6660},
  {position: 7, vehicleNo: 76, bookingDt: '03/24/2023', consignee: 'Corporation', destination: 'mumbai', pcs: 'Corporation', weight: 6660},
  {position: 8, vehicleNo: 76, bookingDt: '03/24/2023', consignee: 'Corporation', destination: 'mumbai', pcs: 'Corporation', weight: 6660}
   
];



@Component({
  selector: 'app-vehicle-bulk',
  templateUrl: './vehicle-bulk.component.html',
  styleUrls: ['./vehicle-bulk.component.css'],
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule,MatPaginatorModule],
})
export class VehicleBulkComponent implements AfterViewInit {

  
  constructor(  private _mdr: MatDialogRef<VehicleBulkComponent>,) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;

                ngAfterViewInit() {
                  this.dataSource.paginator = this.paginator;
                }        

                displayedColumns: string[] = ['select','position', 'vehicleNo', 'bookingDt', 'consignee', 'destination', 'pcs','weight'];
                dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
                selection = new SelectionModel<PeriodicElement>(true, []);
                // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
              
                isAllSelected() {
                  const numSelected = this.selection.selected.length;
                  const numRows = this.dataSource.data.length;
                  return numSelected === numRows;
                }
              
                toggleAllRows() {
                  if (this.isAllSelected()) {
                    this.selection.clear();
                    return;
                  }
              
                  this.selection.select(...this.dataSource.data);
                }
              
                checkboxLabel(row?: PeriodicElement): string {
                  if (!row) {
                    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
                  }
                  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
                }

  CloseDialog() {
    this._mdr.close(false);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
