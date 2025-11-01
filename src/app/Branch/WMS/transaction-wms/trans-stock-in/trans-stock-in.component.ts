import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TripService } from 'app/Branch/operation/tripsheet/trip.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { WMSService } from 'app/Branch/wms.service';

@Component({
  selector: 'app-trans-stock-in',
  templateUrl: './trans-stock-in.component.html',
  styleUrls: ['./trans-stock-in.component.css']
})
export class TransStockInComponent implements OnInit {

@ViewChild('fileInput') fileInput: any;

   createForm: FormGroup;
   validationMessage: any = [];
   sessionLocationCode: string;
  //  selectedFile: any;
   showTable = false;
   userType: any;
   destinationName: any = 'All';
   originList: any;
   excelData: any[] = [];
   stockInDetails: any[] = [];
  itemList: any[] = [];
  serialList: any[] = [];
  warehouseList: any;
  BranchList: any;
  selectedFile: File | null = null;
  filteredItemList: any[] = [];
  filteredSerialList: any[] = [];
  selectedItem = '';
  selectedSerialNo = ''
  currentDate: string;
  // itemName: any;
  // dataSource = new MatTableDataSource<any>([]);
  // tslint:disable-next-line:max-line-length
  // displayedColumns: string[] = ['tripNo',  'tripDate',  'originName',  'destinationName',  'driverName',  'vehicleNo',  'status',  'tripStatus', 'route',  'remark', 'supplierName'];

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

   constructor(public httpService: AllServicesService,
               public http: HttpClient,
               public tripservice: TripService,
               public wmsservice: WMSService,
               public dialog: MatDialog,
               public formBuilder: FormBuilder,
               private snackBar: MatSnackBar, ) {
                }

  ngOnInit(): void {
    // this.getSerialList()
             this.currentDate = new Date().toISOString().split('T')[0];
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');

    this.httpService.GetBranch().subscribe((data: any) => {
      this.BranchList = data.Data;
    });

    this.wmsservice.getItem(this.selectedSerialNo).subscribe((data: any) => {
      this.itemList = data.Data;
      this.filteredItemList = [...this.itemList];
    });

    this.getWarehouse();
    // this.getItem();
         this.createForm = this.formBuilder.group({
          BranchName: ['', Validators.required],
          Warehouse: ['', Validators.required],
          PostDate: ['', Validators.required],
          entryType: [''],
          supplierName: ['', Validators.required],
          docNo: [''],
          docDate: ['', Validators.required],
          transporterName: [''],
          docketNo: [''],
          empName: [''],
          itemType: [''],
          eWayBillNo: [''],
          eWayBillDate: [''],
          Remark: ['']
        });
        this.createForm.addControl('itemEntry', this.formBuilder.group({
          itemNo: ['', [Validators.required]],
          itemName: [''],
          Qty: ['', [Validators.required]],
          serialNo: ['']
        }));
        // this.createForm.get('itemEntry.Qty')?.valueChanges.subscribe(qty => {
        //   const serialNoControl = this.createForm.get('itemEntry.serialNo');
        //   if (qty === 1) {
        //     serialNoControl?.enable();
        //   } else {
        //     serialNoControl?.disable();
        //     serialNoControl?.reset();
        //   }
        // });
       this.validationMessage = {
        BranchName: [
          { type: 'required', message: 'Branch name is required' }
        ],
        Warehouse: [
          { type: 'required', message: 'Warehouse is required' }
        ],
        PostDate: [
          { type: 'required', message: 'PostDate is required'}
        ],
        entryType: [
          { type: 'required', message: 'entryType is required' }
        ],
        supplierName: [
          { type: 'required', message: 'supplierName is required' }
        ],
        docNo: [
          { type: 'required', message: 'Document no. is required' }
        ],
        docDate: [
          { type: 'required', message: 'Document date is required' }
        ],
        transporterName: [
          { type: 'required', message: 'Vehicle number is required' }
        ],
        docketNo: [
          { type: 'required', message: 'docket No is required' }
        ],
        empName: [
          { type: 'required', message: 'Employee is required' }
        ],
        itemType: [
          { type: 'required', message: 'Item type is required'}
        ]
      };

      // this.createForm.get('itemEntry.itemNo')?.valueChanges.subscribe(selectedCode => {
      //   const selectedItem = this.itemList.find(item => item.ItemCode === selectedCode);
        
      //   this.createForm.get('itemEntry.itemName')?.setValue(selectedItem?.ItemName || '');
      //   this.createForm.get('itemEntry.serialNo')?.setValue(selectedItem?.SerialNo || '');
        
      // });

        this.createForm.get('itemEntry.itemNo')?.valueChanges.subscribe(selectedCode => {
            if (this.itemList?.length) {
            const selectedItem = this.itemList.find(item => item.ItemCode === selectedCode);
            this.createForm.get('itemEntry.itemName')?.setValue(selectedItem?.ItemName || '');
            this.createForm.get('itemEntry.serialNo')?.setValue(selectedItem?.SerialNo || '');
          }
        });


      this.createForm.get('itemEntry.serialNo')?.valueChanges.subscribe(selectedCode => {
        if (!selectedCode || !this.serialList?.length) return;
        const selectedSerialNo = this.serialList.find(item => item.SerialNo === selectedCode);
        this.createForm.get('itemEntry.itemName')?.setValue(selectedSerialNo?.ItemName || '', { emitEvent: false });
       this.createForm.get('itemEntry.itemNo')?.setValue( selectedSerialNo?.ItemCode || '', { emitEvent: false });
      });

  }


getSerialList(): void {
  this.http.get<any>(`${environment.apiUrl}/Booking/getSerialNo?itemNo=${this.selectedItem}`).subscribe((data: any) => {
      this.serialList = data.Data;
      this.filteredSerialList = [...this.serialList];
    });
 }

  refresh() {
    throw new Error('Method not implemented.');
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  onAddItem(): void {
    const itemGroup = this.createForm.get('itemEntry') as FormGroup;

    if (itemGroup.valid) {
      const newItem = {
        // Date: new Date().toISOString(),
        ItemNo: itemGroup.value.itemNo,
        ItemName: itemGroup.value.itemName,
        Qty: itemGroup.value.Qty,
        SerialNo: itemGroup.value.serialNo
      };

      this.stockInDetails.push(newItem);
      itemGroup.reset(); // Clear input fields
      this.selectedItem= '';
    } else {
      itemGroup.markAllAsTouched();
    }
  }

  removeItem(index: number): void {
    this.stockInDetails.splice(index, 1);
  }

  onItemSearch(searchTerm: string) {
    if (!searchTerm) {
      this.filteredItemList = [...this.itemList];
    } else {
      this.filteredItemList = this.itemList.filter(item =>
        item.ItemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }
 

onSerialSearch(searchTerm: string): void {
  // console.log("Item No>>>" , this.selectedItem);
  // if (!term) {
  //   this.filteredSerialList = [...this.serialList];
  // } else {
  //   const lowerTerm = term.toLowerCase();
  //   this.filteredSerialList = this.serialList.filter(serial =>
  //     serial.toLowerCase().includes(lowerTerm)
  //   );
  // }

  if (!searchTerm) {
     this.filteredSerialList = [...this.serialList];
    } else {
      this.filteredSerialList = this.serialList.filter(item =>
        item.ItemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.SerialNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
}


  // onItemAdd(newCode: string) {
  //   const matchedItem = this.itemList.find(item => item.ItemCode === newCode);
  //   if (matchedItem) {
  //     this.createForm.get('itemEntry.itemNo')?.setValue(matchedItem.ItemCode);
  //     this.createForm.get('itemEntry.itemName')?.setValue(matchedItem.ItemName);
  //     this.createForm.get('itemEntry.serialNo')?.setValue(matchedItem.SerialNo);
  //   } else {
  //     this.createForm.get('itemEntry.itemName')?.setValue('');
  //     this.createForm.get('itemEntry.serialNo')?.setValue('');
  //   }
  // }

  onItemAdd(newCode: string) {
    const matchedItem = this.serialList.find(item => item.SerialNo === newCode);
    if (matchedItem) {
      this.createForm.get('itemEntry.itemNo')?.setValue(matchedItem.ItemCode);
      this.createForm.get('itemEntry.itemName')?.setValue(matchedItem.ItemName);
      this.createForm.get('itemEntry.serialNo')?.setValue(matchedItem.SerialNo);
    } else {
      this.createForm.get('itemEntry.itemName')?.setValue('');
      this.createForm.get('itemEntry.serialNo')?.setValue('');
    }
  }

  



  generateStock(formData: any): void {
    // if (this.createForm.invalid) {
    //     this.createForm.markAllAsTouched();
    //     this.openSnackBar('Please fill all required fields correctly.', 'error-snackbar');
    //     return;
    //   }
    const body = {
      Origin: formData.BranchName,
      Warehouse: formData.Warehouse,
      PostingDate: formData.PostDate,
      EntryType: formData.entryType,
      SupplierName: formData.supplierName,
      InvNo: formData.docNo,
      InvDate: formData.docDate,
      TransporterName: formData.transporterName,
      DocketNo: formData.docketNo,
      EmployeeName: formData.empName,
      ItemType: formData.itemType,
      EwaybillNo: formData.eWayBillNo,
      EwaybillDate: formData.eWayBillDate,
      Remark: formData.Remark,
      StockInDetails: this.stockInDetails
    };
    this.wmsservice.createStockIn(body).subscribe({
      next: (resp: any) => {
        if (resp.status === 1) {
          this.openSnackBar(resp.message, 'custom-snackbar');
          // this.showTable = false;
          this.createForm.reset();
          this.createForm.get('PostDate')?.setValue(this.currentDate);
          this.stockInDetails = [];
          if (this.fileInput) {
                  this.fileInput.nativeElement.value = null;
                }
        } else {
          this.openSnackBar(resp.message, 'error-snackbar');
        }
      },
      error: (error) => {
        console.error('API Error:', error);

        if (error.status === 0) {
          this.openSnackBar('Network error! Please check your internet connection.', 'error-snackbar');
        } else if (error.status === 400) {
          this.openSnackBar('Bad request! Please check your input data.', 'error-snackbar');
        } else if (error.status === 500) {
          this.openSnackBar('Server error! Please try again later.', 'error-snackbar');
        } else {
          this.openSnackBar('An unexpected error occurred. Please try again.', 'error-snackbar');
        }
      }
    });
  }

getWarehouse() {
  this.wmsservice.getWarehouse().subscribe((resp: any) => {
      this.warehouseList = resp.Data;
    });
}
// getItem() {
//  this.wmsservice.getItem().subscribe((resp: any) => {
//    this.itemList = resp.Data;
//  });
// }

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

       this.stockInDetails = data.map(row => ({
        ItemNo: (row['ItemNo'] || '').toString().trim(),
        ItemName: (row['ItemName'] || '').toString().trim(),
        Qty: Number(row['Qty']) || 0,
        SerialNo: (row['SerialNo'] || '').toString().trim()
      }));

      // event.target.value = '';
    };
    reader.readAsBinaryString(file);
  }
}

resetFileInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = '';
}

   async processExcelFile(file: File) {
     const reader = new FileReader();

     reader.onload = (e) => {
       const fileContent = e.target?.result as ArrayBuffer;
       const arrayBuffer = new Uint8Array(fileContent);
       const data = new Array(arrayBuffer.length);

       for (let i = 0; i !== arrayBuffer.length; ++i) {
         data[i] = String.fromCharCode(arrayBuffer[i]);
       }

       const bstr = data.join('');
       const workbook = XLSX.read(bstr, { type: 'binary' });

       const firstSheetName = workbook.SheetNames[0];
       const worksheet = workbook.Sheets[firstSheetName];

       // this.uploadedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

     };

     reader.onerror = (error) => {
       console.error('Error processing Excel file:', error);
     };

     reader.readAsArrayBuffer(file);
   }


   processExcelData(file: File) {
    if (!file) {
      this.openSnackBar('Please select a file to upload.', 'error-snackbar');
      return;
    }

    if (!this.excelData || this.excelData.length === 0) {
      this.openSnackBar('Excel file is empty. Please upload valid data.', 'error-snackbar');
      return;
    }

    const formattedExcelData = this.excelData.map((row: any) => ({
      Route: row['Route'],
      OTR: row['OTR'] || '',
      Qty: row['QT'] || row['Qty'] || '',
      OTA: row['OTA'] || '',
      vehicleType: row['Vehicle type'] || row['vehicleType'] || ''
    }));

    const hasEmptyRow = formattedExcelData.some(item =>
      !item.Route || !item.OTR || !item.Qty || !item.OTA || !item.vehicleType
    );

    if (hasEmptyRow) {
      this.openSnackBar('Some rows are missing required fields. Please check the file.', 'error-snackbar');
      return;
    }

    const requestBody = {
      excelData: formattedExcelData
    };


    this.http.post(`${environment.apiUrl}/Booking/importTrip`, requestBody).subscribe({
      next: (res: any) => {
        // dialogRef.close();
        if (res.status === 1) {
          this.openSnackBar(res.message, 'custom-snackbar');
          this.createForm.reset();
          // if (this.fileInput) {
          //   this.fileInput.nativeElement.value = '';
          // }
        } else {
          this.openSnackBar(res.message , 'error-snackbar');
        }
      },
      error: (err) => {
        // dialogRef.close();
        this.openSnackBar('Error importing data. Please try again.', 'error-snackbar');
        console.error(err);
      }
    });
  }
  generateExcel() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25rem',
      data: { message: 'Are you sure you want to download the Excel file?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const worksheetData = [
          ['ItemNo', 'ItemName', 'Qty', 'SerialNo']
        ];

        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Sheet1': worksheet },
          SheetNames: ['Sheet1']
        };

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blobData: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(blobData, 'StockInTemplate.xlsx');
      } else {
        this.openSnackBar('Download canceled', 'error-snackbar');
      }
    });
  }


   openprogressbar(selectedFile: string): MatDialogRef<ProgressBarComponent> {
     const dialogRef = this.dialog.open(ProgressBarComponent, {
       data: {
         action: 'add',
         fileName: selectedFile
       },
       width: '35rem',
       disableClose: true
     });
     return dialogRef;
   }

  




  

}
