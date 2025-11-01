import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZoneFormComponent } from '../zone-form/zone-form.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'app/Branch/master/master.service';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {

  stockEntryMode: any;
  stockEntryData: any;
  EntryFromNo: any;
  EntryToNo: any;
  CNote: any;
  EntryDate: any;
  validationMessage: any;
  stockEntryForm: FormGroup;
  entryForm: FormGroup;
  branchForm: FormGroup;
  customerForm: FormGroup;
  employeeForm: FormGroup;
  podForm: FormGroup;
  branchList: any;
  branchLocation: any;
  branchCNote: any;
  branchEntryDate: any;
  branchfromNo: any;
  branchToNo: any;
  branchMode: any;
  branchEntryData: any;

  custLocation: any;
  customerName: any;
  custCNote: any;
  custfromNo: any;
  custToNo: any;
  CustIssueDate: any;

  customerList: any;
  employeeList: any;
  selectedCustType: any;
  consignerCode: any;
  stockCustomerMode: any;
  stockCustomerData: any;
  employeeName: any;
  podMode: any;
  podData: any;
  podCancelDate: any;
  podAwbNo: any;
  podRemarks: any;
  currentdate: string;
  stockEmpData: any;

  constructor(private _mdr: MatDialogRef<ZoneFormComponent>,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              public masterService: MasterService,
              @Inject(MAT_DIALOG_DATA) public data: {
                podData: any;
                stockCustomerData: any;
                stockEmpData: any;
                branchEntryData: any;
                stockMode: any;
                branchMode: any;
                podMode: any;
                stockCustomerMode: any;
                stockEntryData: any; action: string;
              }) {
                if (data.stockEntryData || data.branchEntryData || data.stockCustomerData || data.stockEmpData || data.podData) {
                  this.stockEntryMode = data.stockMode;
                  this.podMode = data.podMode;
                  this.podData = data.podData;
                  this.stockEntryData = data.stockEntryData;
                  this.stockCustomerMode = data.stockCustomerMode;
                  this.branchMode = data.branchMode;
                  this.branchEntryData = data.branchEntryData;
                  this.stockCustomerData = data.stockCustomerData;
                  this.stockEmpData = data.stockEmpData;

                  this.EntryFromNo = this.stockEntryData?.AwbFromNo;
                  this.EntryToNo = this.stockEntryData?.AwbToNo;
                  this.CNote = this.stockEntryData?.BookNo;
                  this.EntryDate = this.stockEntryData?.IssueDate;
                  this.branchfromNo = this.branchEntryData?.AwbFromNo;
                  this.branchToNo = this.branchEntryData?.AwbToNo;
                  this.branchCNote = this.branchEntryData?.BookNo;
                  this.branchEntryDate = this.branchEntryData?.IssueDate;
                  this.branchLocation = this.branchEntryData?.Location_Code;

                  this.custLocation = this.stockCustomerData?.Location_Code;
                  this.customerName = this.stockCustomerData?.Customer_Code;
                  this.custCNote = this.stockCustomerData?.BookNo;
                  this.custfromNo = this.stockCustomerData?.AwbFromNo;
                  this.custToNo = this.stockCustomerData?.AwbToNo;
                  this.CustIssueDate = this.stockCustomerData?.IssueDate;
                  this.employeeName = this.stockCustomerData?.Employee_Code;
                  this.podCancelDate = this.podData?.CancelDate;
                  this.podAwbNo = this.podData?.AwbNo;
                  this.podRemarks = this.podData?.Remark;
                }
              }

ngOnInit(): void {
  this.validationMessage = {
    EntryFromNo: [ {type: 'required' , message: 'Please Enter From AWB No.'} ],
    EntryToNo: [ {type: 'required' , message: 'Please Enter To AWB No..'} ],
    CNote: [ {type: 'required' , message: 'Please Enter C Note .'} ],
    EntryDate: [ {type: 'required' , message: 'Please select Date.'} ],
    branchLocation: [ {type: 'required' , message: 'Please select branch Location Name.'} ],
    branchCNote: [ {type: 'required' , message: 'Please Enter branch CNote .'} ],
    branchEntryDate: [ {type: 'required' , message: 'Please select branch Entry Date.'} ],
    branchfromNo: [ {type: 'required' , message: 'Please Enter branch from AWB No.'} ],
    branchToNo: [ {type: 'required' , message: 'Please Enter Branch To AWB No.'} ],

    custLocation: [ {type: 'required' , message: 'Please Select Location.'} ],
    customerName: [ {type: 'required' , message: 'Please Select Customer Name.'} ],
    custCNote: [ {type: 'required' , message: 'Please Enter C Note.'} ],
    custfromNo: [ {type: 'required' , message: 'Please Enter from AWB No.'} ],
    custToNo: [ {type: 'required' , message: 'Please Enter To AWB No.'} ],
    CustIssueDate: [ {type: 'required' , message: 'Please select Date.'} ],

    employeeName: [ {type: 'required' , message: 'Please Select Employee Name.'} ],
    podCancelDate: [ {type: 'required' , message: 'Please Select Date To Cancel.'} ],
    podAwbNo: [ {type: 'required' , message: 'Please Enter AWB No.'} ],
    podRemarks: [ {type: 'required' , message: 'Please Enter Remarks.'} ],
  }

  // this.entryForm =  this.formBuilder.group({
  //   EntryFromNo: new FormControl('', Validators.compose([ Validators.required ])),
  //   EntryToNo: new FormControl('', Validators.compose([ Validators.required ])),
  //   CNote: new FormControl('', Validators.compose([ Validators.required ])),
  //   EntryDate: new FormControl('', Validators.compose([ Validators.required ])),
  // });

  // this.branchForm =  this.formBuilder.group({
  //   branchLocation: new FormControl('', Validators.compose([ Validators.required ])),
  //   branchCNote: new FormControl('', Validators.compose([ Validators.required ])),
  //   branchEntryDate: new FormControl('', Validators.compose([ Validators.required ])),
  //   branchfromNo: new FormControl('', Validators.compose([ Validators.required ])),
  //   branchToNo: new FormControl('', Validators.compose([ Validators.required ])),
  // });

  // this.customerForm = this.formBuilder.group({
  //   custLocation: new FormControl('', Validators.compose([ Validators.required ])),
  //   customerName: new FormControl('', Validators.compose([ Validators.required ])),
  //   custCNote: new FormControl('', Validators.compose([ Validators.required ])),
  //   custfromNo: new FormControl('', Validators.compose([ Validators.required ])),
  //   custToNo: new FormControl('', Validators.compose([ Validators.required ])),
  //   CustIssueDate: new FormControl('', Validators.compose([ Validators.required ])),
  // });

  // this.employeeForm = this.formBuilder.group({
  //   employeeName: new FormControl('', Validators.compose([ Validators.required ])),
  //   custLocation: new FormControl('', Validators.compose([ Validators.required ])),
  //   custCNote: new FormControl('', Validators.compose([ Validators.required ])),
  //   custfromNo: new FormControl('', Validators.compose([ Validators.required ])),
  //   custToNo: new FormControl('', Validators.compose([ Validators.required ])),
  //   CustIssueDate: new FormControl('', Validators.compose([ Validators.required ])),
  // });
  this.currentdate = new Date().toISOString().split('T')[0];
  this.initForms();  // Initialize Reactive Forms

  if (this.stockEntryData) {
    this.entryForm.patchValue({
      EntryFromNo: this.stockEntryData.AwbFromNo,
      EntryToNo: this.stockEntryData.AwbToNo,
      EntryDate: this.formatDateToInput(this.stockEntryData.IssueDate),
      CNote: this.stockEntryData.BookNo,
    });
  }

  if (this.branchEntryData) {
    this.branchForm.patchValue({
      branchLocation: this.branchEntryData.Location_Code,
      branchfromNo: this.branchEntryData.AwbFromNo,
      branchToNo: this.branchEntryData.AwbToNo,
      branchEntryDate: this.formatDateToInput(this.branchEntryData.IssueDate),
      branchCNote: this.branchEntryData.BookNo,
    });
  }

  if (this.stockCustomerData) {
    this.customerForm.patchValue({
      custLocation: this.stockCustomerData.Location_Code,
      custfromNo: this.stockCustomerData.AwbFromNo,
      custToNo: this.stockCustomerData.AwbToNo,
      CustIssueDate: this.formatDateToInput(this.stockCustomerData.IssueDate),
      customerName: this.stockCustomerData.Customer_Code,
      custCNote: this.stockCustomerData.BookNo,
    });
  }
if (this.stockEmpData) {
    this.employeeForm.patchValue({
      empLocation: this.stockEmpData.Location_Code,
      empfromNo: this.stockEmpData.AwbFromNo,
      empToNo: this.stockEmpData.AwbToNo,
      empIssueDate: this.formatDateToInput(this.stockEmpData.IssueDate),
      empName: this.stockEmpData.Employee_Code,
      empCNote: this.stockEmpData.BookNo,
    });
  }
  if (this.podData) {
    this.podForm.patchValue({
      podCancelDate: this.formatDateToInput(this.podData.CancelDate),
      podAwbNo: this.podData.AwbNo,
      podRemarks: this.podData.Remark
    });
  }
  this.loadLocation();
   this.setupAutoToNo(this.entryForm, 'EntryFromNo', 'CNote', 'EntryToNo');
    this.setupAutoToNo(this.branchForm, 'branchfromNo', 'branchCNote', 'branchToNo');
    this.setupAutoToNo(this.customerForm, 'custfromNo', 'custCNote', 'custToNo');
    this.setupAutoToNo(this.employeeForm, 'empfromNo', 'empCNote', 'empToNo');
  }

  // Initialize all forms
  private initForms() {
    this.entryForm = this.formBuilder.group({
      EntryFromNo: new FormControl('', Validators.required),
      EntryToNo: new FormControl('', Validators.required),
      EntryDate: new FormControl(this.currentdate, Validators.required),
      CNote: new FormControl('', Validators.required),
    });

    this.branchForm = this.formBuilder.group({
      branchLocation: new FormControl('', Validators.required),
      branchfromNo: new FormControl('', Validators.required),
      branchToNo: new FormControl('', Validators.required),
      branchEntryDate: new FormControl(this.currentdate, Validators.required),
      branchCNote: new FormControl('', Validators.required),
    });

    this.customerForm = this.formBuilder.group({
      custLocation: new FormControl('', Validators.required),
      custfromNo: new FormControl('', Validators.required),
      custToNo: new FormControl('', Validators.required),
      CustIssueDate: new FormControl(this.currentdate, Validators.required),
      customerName: new FormControl('', Validators.required),
      custCNote: new FormControl('', Validators.required),
    });

    this.employeeForm = this.formBuilder.group({
      empLocation: new FormControl('', Validators.required),
      empfromNo: new FormControl('', Validators.required),
      empToNo: new FormControl('', Validators.required),
      empIssueDate: new FormControl(this.currentdate, Validators.required),
      empName: new FormControl('', Validators.required),
      empCNote: new FormControl('', Validators.required),
    });

     this.podForm = this.formBuilder.group({
      podCancelDate: new FormControl('', Validators.required ),
      podAwbNo: new FormControl('', Validators.required ),
      podRemarks: new FormControl('', Validators.required ),
    });
  }

  // Generic method to setup auto-calculation for ToNo
  private setupAutoToNo(form: FormGroup, fromField: string, cNoteField: string, toField: string) {
    form.get(fromField).valueChanges.subscribe(() => this.updateToNo(form, fromField, cNoteField, toField));
    form.get(cNoteField).valueChanges.subscribe(() => this.updateToNo(form, fromField, cNoteField, toField));
  }

  // Generic method to calculate ToNo
  private updateToNo(form: FormGroup, fromField: string, cNoteField: string, toField: string) {
  const fromNo = form.get(fromField)?.value;
  const cNote = form.get(cNoteField)?.value;

  // Update only if BOTH are numbers and not empty
  if (fromNo !== null && fromNo !== '' && !isNaN(+fromNo) &&
      cNote !== null && cNote !== '' && !isNaN(+cNote)) {
    const toNo = +fromNo + +cNote - 1;
    form.patchValue({ [toField]: toNo }, { emitEvent: false });
  } else {
    // Do not clear if one field is missing — just leave as is
    form.patchValue({ [toField]: '' }, { emitEvent: false });
  }
}
  //  updateToNo(form: FormGroup, fromField: string, cNoteField: string, toField: string) {
  //   const fromNo = +form.get(fromField).value;
  //   const cNote = +form.get(cNoteField).value;

  //   if (!isNaN(fromNo) && !isNaN(cNote)) {
  //     const toNo = fromNo + cNote - 1;
  //     form.patchValue({ [toField]: toNo }, { emitEvent: false }); // avoid infinite loop
  //   } else {
  //     form.patchValue({ [toField]: '' }, { emitEvent: false });
  //   }
  // }
private formatDateToInput(dateStr: string): string {
  if (!dateStr) { return ''; }

  const parts = dateStr.split('-'); // ['05', '06', '2025']
  if (parts.length !== 3) { return ''; }

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  return `${year}-${month}-${day}`; // '2025-06-05'
}

  // Load branch locations
  loadLocation() {
    this.masterService.getBranchLocations().subscribe(
      (resp) => {
        this.branchList = resp.Data;
      },
      (error) => {
        console.error('Error in loadLocation:', error);
      }
    );
  }

  // Fetch relevant customer data based on location
  fetchReleventData(event: any) {
    console.log(event, 'event');
    this.masterService.getConsignerData(event).subscribe(
      (resp) => {
        this.customerList = resp.Data;
      },
      (error) => {
        console.error('Error fetching consigner data:', error);
      }
    );
  }

  // Fetch relevant employee data based on location
  relevantDataWithEmployee(event: any) {
    console.log(event, 'event');
    this.masterService.getEmployeeData(event).subscribe(
      (resp) => {
        this.employeeList = resp.Data;
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }
  formSubmitStockEntry(formData: any) {
    if (this.entryForm.valid) {
      this.masterService.createStockEntry(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Stock Entry:', error);
        }
      );
    } else {
      this.markFormTouched(this.entryForm);
    }
  }

  updateStockEntry() {
    if (this.entryForm.valid) {
      const id = this.stockEntryData?.ID;
      this.masterService.updateStockEntry(this.entryForm.value, id).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Stock Entry Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.entryForm);
    }
  }

  // Handle Branch Entry Form Submission
  formSubmitBranch(formData: any) {
    if (this.branchForm.valid) {
      formData = {
      branchLocation: this.branchForm.value.branchLocation,
      branchfromNo: this.branchForm.value.branchfromNo,
      branchToNo: this.branchForm.value.branchToNo,
      branchEntryDate: this.branchForm.value.branchEntryDate,
      branchCNote: this.branchForm.value.branchCNote,
    };
      this.masterService.createBranchEntry(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Branch Entry:', error);
        }
      );
    } else {
      this.markFormTouched(this.branchForm);
    }
  }

  // Handle Branch Entry Update
  updateBranchEntry() {
    if (this.branchForm.valid) {
       const formData = {
      branchLocation: this.branchForm.value.branchLocation,
      branchfromNo: this.branchForm.value.branchfromNo,
      branchToNo: this.branchForm.value.branchToNo,
      branchEntryDate: this.branchForm.value.branchEntryDate,
      branchCNote: this.branchForm.value.branchCNote,
    };
      const id = this.branchEntryData?.ID;
      this.masterService.updateBranchEntry(formData, id).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Branch Entry Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.branchForm);
    }
  }

  // Handle Customer Entry Form Submission
  formSubmitCustomer(formData: any) {
    if (this.customerForm.valid) {
 formData = {
      locationCode: this.customerForm.value.custLocation,
      awbFromNo: this.customerForm.value.custfromNo,
      awbToNo: this.customerForm.value.custToNo,
      date: this.customerForm.value.CustIssueDate,
      customerCode: this.customerForm.value.customerName,
      bookNo: this.customerForm.value.custCNote,
    };
      this.masterService.createCustomerEntry(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Customer Entry:', error);
        }
      );
    } else {
      this.markFormTouched(this.customerForm);
    }
  }

  // Helper to mark all form controls as touched
  markFormTouched(form: FormGroup) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: false });
    });
  }
  updateCustomerEntry() {
    if (this.customerForm.valid) {
       const formData = {
      locationCode: this.customerForm.value.custLocation,
      awbFromNo: this.customerForm.value.custfromNo,
      awbToNo: this.customerForm.value.custToNo,
      date: this.customerForm.value.CustIssueDate,
      customerCode: this.customerForm.value.customerName,
      bookNo: this.customerForm.value.custCNote,
    };
      const id = this.stockCustomerData?.ID;
      this.masterService.updateCustomerEntry(formData, id).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Customer Entry Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.customerForm);
    }
  }

  // Handle Employee Form Submission
  formSubmitEmployee(formData: any) {
    if (this.employeeForm.valid) {
       formData = {
      locationCode: this.employeeForm.value.empLocation,
      awbFromNo: this.employeeForm.value.empfromNo,
      awbToNo: this.employeeForm.value.empToNo,
      date: this.employeeForm.value.empIssueDate,
      employeeCode: this.employeeForm.value.empName,
      bookNo: this.employeeForm.value.empCNote,
    };
      this.masterService.createStockIssue(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Employee Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.employeeForm);
    }
  }

  // Handle Employee Entry Update
  updateEmployeeEntry() {
    if (this.employeeForm.valid) {
       const formData = {
      locationCode: this.employeeForm.value.empLocation,
      awbFromNo: this.employeeForm.value.empfromNo,
      awbToNo: this.employeeForm.value.empToNo,
      date: this.employeeForm.value.empIssueDate,
      employeeCode: this.employeeForm.value.empName,
      bookNo: this.employeeForm.value.empCNote,
    };
      const id = this.stockEmpData?.ID;
      this.masterService.updateStockIssue(formData, id).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Employee Entry Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.employeeForm);
    }
  }

  // Handle Pod Form Submission
  formSubmitPod(formData: any) {
    if (this.podForm.valid) {
      this.masterService.createPodCancel(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Pod Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.podForm);
    }
  }

  // Handle Pod Update
  updatePod() {
    if (this.podForm.valid) {
      // const formData = {
      //   locationCode: '',
      //   awbFromNo: '',
      //   awbToNo: '',
      //   date: this.podCancelDate,
      //   customerCode: '',
      //   employeeCode: '',
      //   bookNo: '',
      //   awbNo: this.podAwbNo,
      //   remark: this.podRemarks,
      // };

      this.masterService.updatePodCancel(this.podForm.value).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Pod Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.podForm);
    }
  }


  openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  CloseDialog() {
    this._mdr.close(false);
  }

}
