import { Component, OnInit,ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// interface ReportData {
//   BillNo: string;
//   BillDate: string;
//   BillAmt: number;
//   TDS: number;
//   Adjustment: number;
//   Outstanding: number;
// }

interface ReportData {
  customerName?: string;
  BillNo: string;
  BillDate: string;
  BillAmt: number;
  TDS: number;
  Adjustment: number;
  Outstanding: number;
  isGroup?: boolean;
}

@Component({
  selector: 'app-payment-entry-report',
  templateUrl: './payment-entry-report.component.html',
  styleUrls: ['./payment-entry-report.component.css']
})
export class PaymentEntryReportComponent implements OnInit {

  filterForm!: FormGroup;
  locations = ['Mumbai', 'Delhi', 'Chennai', 'Bangalore'];
  customers = ['ABC Ltd', 'XYZ Pvt Ltd', 'Global Corp', 'Unity Logistics'];
  allSelected = false;

  displayedColumns: string[] = ['SRNo', 'BillNo', 'BillDate', 'BillAmt', 'TDS', 'Adjustment', 'Outstanding'];
  dataSource = new MatTableDataSource<ReportData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.filterForm = new FormBuilder().group({
      location: ['all'],
      customers: [[]],
    });
  }

  selectAllCustomers() {
    this.allSelected = true;
    this.filterForm.controls['customers'].setValue(this.customers);
  }

  deselectAllCustomers() {
    this.allSelected = false;
    this.filterForm.controls['customers'].setValue([]);
  }

getRowIndex(element: any): number {
  
  const customerName = element.customerName;

  const customerRows = this.dataSource.data.filter(
    (e: any) => !e.isGroup && e.customerName === customerName
  );

  return customerRows.findIndex((e: any) => e === element) + 1;
}

  onFilterSubmit() {
    const selected = this.filterForm.value;

    const allBills: ReportData[] = [
      { customerName: 'ABC Ltd', BillNo: 'B001', BillDate: '2025-10-01', BillAmt: 12000, TDS: 300, Adjustment: 200, Outstanding: 11500 },
      { customerName: 'ABC Ltd', BillNo: 'B002', BillDate: '2025-10-05', BillAmt: 18000, TDS: 400, Adjustment: 100, Outstanding: 17500 },
      { customerName: 'XYZ Pvt Ltd', BillNo: 'X001', BillDate: '2025-10-03', BillAmt: 15000, TDS: 300, Adjustment: 200, Outstanding: 14500 },
      { customerName: 'Global Corp', BillNo: 'G001', BillDate: '2025-10-02', BillAmt: 22000, TDS: 500, Adjustment: 300, Outstanding: 21200 },
    ];

    const filtered = selected.customers.length
      ? allBills.filter(b => selected.customers.includes(b.customerName))
      : allBills;

    this.dataSource.data = this.groupByCustomer(filtered);
    this.dataSource.paginator = this.paginator;
  }

  groupByCustomer(data: ReportData[]): ReportData[] {
    const grouped: ReportData[] = [];
    const customers = Array.from(new Set(data.map(d => d.customerName)));

    customers.forEach(cust => {
      grouped.push({ customerName: cust, isGroup: true } as ReportData);
      const bills = data.filter(x => x.customerName === cust);
      grouped.push(...bills);
    });

    return grouped;
  }

  /** Predicate functions for row definitions **/
  isGroupRow = (index: number, row: ReportData) => row.isGroup === true;
  isDataRow = (index: number, row: ReportData) => !row.isGroup;


  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  // filterForm!: FormGroup;
  // customers = ['ABC Ltd', 'XYZ Pvt Ltd', 'Global Corp', 'Unity Logistics'];
  // locations = ['Mumbai', 'Delhi', 'Chennai', 'Bangalore'];
  // allSelected = false;

  // displayedColumns: string[] = ['SRNo', 'BillNo', 'BillDate', 'BillAmt', 'TDS', 'Adjustment', 'Outstanding'];
  // dataSource = new MatTableDataSource<ReportData>([]);

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  // constructor(private fb: FormBuilder) {}

  // ngOnInit() {
  //   this.filterForm = this.fb.group({
  //     customers: [[]],
  //     location: ['all']
  //   });
  // }

  // selectAllCustomers() {
  //   this.allSelected = true;
  //   this.filterForm.controls['customers'].setValue(this.customers);
  // }

  // deselectAllCustomers() {
  //   this.allSelected = false;
  //   this.filterForm.controls['customers'].setValue([]);
  // }

  // onFilterSubmit() {
  //   const selected = this.filterForm.value;

  //   const allBills: ReportData[] = [
  //     { customerName: 'ABC Ltd', BillNo: 'B001', BillDate: '2025-10-01', BillAmt: 12000, TDS: 300, Adjustment: 200, Outstanding: 11500 },
  //     { customerName: 'ABC Ltd', BillNo: 'B002', BillDate: '2025-10-05', BillAmt: 18000, TDS: 400, Adjustment: 100, Outstanding: 17500 },
  //     { customerName: 'XYZ Pvt Ltd', BillNo: 'X001', BillDate: '2025-10-03', BillAmt: 15000, TDS: 300, Adjustment: 200, Outstanding: 14500 },
  //     { customerName: 'Global Corp', BillNo: 'G001', BillDate: '2025-10-02', BillAmt: 22000, TDS: 500, Adjustment: 300, Outstanding: 21200 }
  //   ];

  //   const filtered = selected.customers.length
  //     ? allBills.filter(b => selected.customers.includes(b.customerName))
  //     : allBills;

  //   const groupedData = this.groupByCustomer(filtered);
  //   this.dataSource.data = groupedData;
  //   this.dataSource.paginator = this.paginator;
  // }

  // groupByCustomer(data: ReportData[]): ReportData[] {
  //   const grouped: ReportData[] = [];
  //   const customers = Array.from(new Set(data.map(d => d.customerName)));

  //   customers.forEach(cust => {
  //     grouped.push({ customerName: cust, isGroup: true });
  //     const bills = data.filter(x => x.customerName === cust);
  //     grouped.push(...bills);
  //   });

  //   return grouped;
  // }

  // /** Identify group and data rows separately **/
  // isGroupRow = (_: number, row: ReportData) => row.isGroup === true;
  // isDataRow = (_: number, row: ReportData) => !row.isGroup;

  //  // applyFilter(value: string) {
  // //   this.dataSource.filter = value.trim().toLowerCase();
  // // }

}


