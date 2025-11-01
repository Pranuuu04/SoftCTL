import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'app/Branch/master/master.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {

  modeList: any;
  validationMessage: any;
  modeForm: FormGroup;
  productForm: FormGroup;
  departmentForm: FormGroup;
  expansesForm: FormGroup;
  bankForm: FormGroup;
  packageForm: FormGroup;
  deliveryForm: FormGroup;
  reasonForm: FormGroup;
  serviceForm: FormGroup;
  modeCode: any;
  modeName: any;
  companyName: any;
  productType: any;
  dosSpxType: any;
  productCode: any;
  productName: any;

  dosSpxTypeList = [
    { value: 'Dox', name: 'DOX' },
    { value: 'Spx', name: 'SPX' },
  ];

  productTypeList = [
    { value: 'Domestic', name: 'Domestic' },
    { value: 'International', name: 'International' },
    { value: 'Intracity', name: 'Intracity' },
  ];
  modeType: any;
  modeData: any;
  deptModeType: any;
  deptData: any;
  departmentCode: any;
  departmentName: any;
  expensesCode: any;
  expensesName: any;
  expensesModeType: any;
  expensesData: any;
  packageCode: any;
  packageName: any;
  packageModeType: any;
  packageData: any;
  deliveryData: any;
  deliveryModeType: any;
  deliveryCode: any;
  deliveryName: any;
  reasonData: any;
  reasonModeType: any;
  reasonCode: any;
  reasonName: any;
  serviceModeType: any;
  serviceData: any;
  serviceCode: any;
  serviceName: any;
  bankCode: any;
  bankName: any;
  bankData: any;
  bankModeType: any;

  constructor(private _mdr: MatDialogRef<ServiceFormComponent>,
              public httpService: HttpService,
              public snackBar: MatSnackBar,
              public formBuilder: FormBuilder,
              public masterService: MasterService,
              @Inject(MAT_DIALOG_DATA) public data: {
                bankModeType: any;
                bankData: any;
                serviceModeType: any;
                serviceData: any;
                reasonModeType: any;
                reasonData: any;
                deliveryModeType: any;
                deliveryData: any;
                packageModeType: any;
                packageData: any;
                expensesModeType: any;
                expensesData: any;
                deptModeType: any;
                deptData: any;
                modeType: any;
                modeData: any; action: string }) {
                // tslint:disable-next-line:max-line-length
                if (data.modeData  || data.deptData || data.expensesData || data.packageData || data.deliveryData || data.reasonData || data.serviceData || data.bankData) {
                  this.bankData = data.bankData;
                  this.bankModeType = data.bankModeType;
                  this.serviceData = data.serviceData;
                  this.serviceModeType = data.serviceModeType;
                  this.reasonData = data.reasonData;
                  this.reasonModeType = data.reasonModeType;
                  this.deliveryData = data.deliveryData;
                  this.deliveryModeType = data.deliveryModeType;
                  this.packageModeType = data.packageModeType;
                  this.packageData = data.packageData;
                  this.expensesData = data.expensesData;
                  this.expensesModeType = data.expensesModeType;
                  this.modeType = data.modeType;
                  this.deptModeType = data.deptModeType;
                  this.deptData = data.deptData;
                  this.modeData = data.modeData;
                  this.modeCode = this.modeData?.Mode_Code;
                  this.modeName = this.modeData?.Mode_Name;
                  this.companyName = this.modeData?.CompName;
                  this.productType = this.modeData?.Product_Type;
                  this.dosSpxType = this.modeData?.DoxSpx;
                  this.productCode = this.modeData?.Product_Code;
                  this.productName = this.modeData?.Product_Name;
                  this.departmentCode = this.deptData?.Department_code;
                  this.departmentName = this.deptData?.Department_name;
                  this.expensesCode = this.expensesData?.Expences_Code;
                  this.expensesName = this.expensesData?.Expences_Name;
                  this.packageCode = this.packageData?.packageTypeCode;
                  this.packageName = this.packageData?.packageTypeName;
                  this.deliveryCode = this.deliveryData?.deliverTypeCode;
                  this.deliveryName = this.deliveryData?.deliverTypeName;
                  this.reasonCode = this.reasonData?.ReasonCode;
                  this.reasonName = this.reasonData?.ReasonName;
                  this.serviceCode = this.serviceData?.ServiceType_Code;
                  this.serviceName = this.serviceData?.ServiceType_Name;
                  this.bankCode = this.bankData?.Bank_Code;
                  this.bankName = this.bankData?.Bank_Name;
                }
              }

  ngOnInit(): void {
    this.validationMessage = {
      modeCode: [ {type: 'required' , message: 'Please Enter Mode Code.'} ],
      modeName: [ {type: 'required' , message: 'Please Enter Mode Name.'} ],
      companyName: [ {type: 'required' , message: 'Please Enter Company Name.'} ],
      productType: [ {type: 'required' , message: 'Please select Product Type.'} ],
      dosSpxType: [ {type: 'required' , message: 'Please select dosSpxType.'} ],

      productCode: [ {type: 'required' , message: 'Please Enter Product Code.'} ],
      productName: [ {type: 'required' , message: 'Please Enter Product Name.'} ],

      departmentCode: [ {type: 'required' , message: 'Please Enter Department Code.'} ],
      departmentName: [ {type: 'required' , message: 'Please Enter Department Name.'} ],

      expensesCode: [ {type: 'required' , message: 'Please Enter Expanses Code.'} ],
      expensesName: [ {type: 'required' , message: 'Please Enter Expanses Name.'} ],

      bankCode: [ {type: 'required' , message: 'Please Enter Bank Code.'} ],
      bankName: [ {type: 'required' , message: 'Please Enter Bank Name.'} ],

      packageCode: [ {type: 'required' , message: 'Please Enter Package Code.'} ],
      packageName: [ {type: 'required' , message: 'Please Enter Package Name.'} ],

      deliveryCode: [ {type: 'required' , message: 'Please Enter Delivery Code.'} ],
      deliveryName: [ {type: 'required' , message: 'Please Enter Delivery Name.'} ],

      reasonCode: [ {type: 'required' , message: 'Please Enter Reason Code.'} ],
      reasonName: [ {type: 'required' , message: 'Please Enter Reason Name.'} ],

      serviceCode: [ {type: 'required' , message: 'Please Enter Service Code.'} ],
      serviceName: [ {type: 'required' , message: 'Please Enter Service Name.'} ],
    };

    this.modeForm = this.formBuilder.group({
      modeCode: new FormControl('', Validators.compose([ Validators.required ])),
      modeName: new FormControl('', Validators.compose([ Validators.required ])),
      companyName: new FormControl('', Validators.compose([])),
      productType: new FormControl('', Validators.compose([ Validators.required ])),
      dosSpxType: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.productForm =  this.formBuilder.group({
      productCode: new FormControl('', Validators.compose([ Validators.required ])),
      productName: new FormControl('', Validators.compose([ Validators.required ])),
      companyName: new FormControl('', Validators.compose([])),
      productType: new FormControl('', Validators.compose([ Validators.required ])),
      dosSpxType: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.departmentForm = this.formBuilder.group({
      departmentCode: new FormControl('', Validators.compose([ Validators.required ])),
      departmentName: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.expansesForm =  this.formBuilder.group({
      expensesCode: new FormControl('', Validators.compose([ Validators.required ])),
      expensesName: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.bankForm = this.formBuilder.group({
      bankCode: new FormControl('', Validators.compose([ Validators.required ])),
      bankName: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.packageForm = this.formBuilder.group({
      packageCode: new FormControl('', Validators.compose([ Validators.required ])),
      packageName: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.deliveryForm = this.formBuilder.group({
      deliveryCode: new FormControl('', Validators.compose([ Validators.required ])),
      deliveryName: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.reasonForm = this.formBuilder.group({
      reasonCode: new FormControl('', Validators.compose([ Validators.required ])),
      reasonName: new FormControl('', Validators.compose([ Validators.required ])),
    });

    this.serviceForm = this.formBuilder.group({
      serviceCode: new FormControl('', Validators.compose([ Validators.required ])),
      serviceName: new FormControl('', Validators.compose([ Validators.required ])),
    });
  }

  formSubmitMode(formData: any) {
    if (this.modeForm.valid) {
      this.masterService.createMode(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Mode Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.modeForm);
    }
  }

  // Handle Mode Update
  updateMode() {
    if (this.modeForm.valid) {
      const formData = {
        modeCode: this.modeCode,
        modeName: this.modeName,
        productType: this.productType,
        dosSpxType: this.dosSpxType,
        companyName: this.companyName,
      };

      this.masterService.updateMode(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Mode Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.modeForm);
    }
  }

  // Handle Product Form Submission
  formSubmitProduct(formData: any) {
    if (this.productForm.valid) {
      this.masterService.createProduct(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Product Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.productForm);
    }
  }

  // Handle Product Update
  updateProduct() {
    if (this.productForm.valid) {
      const formData = {
        productCode: this.productCode,
        productName: this.productName,
        productType: this.productType,
        dosSpxType: this.dosSpxType,
        companyName: this.companyName,
      };

      this.masterService.updateProduct(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Product Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.productForm);
    }
  }

  // Handle Department Form Submission
  formSubmitDept(formData: any) {
    if (this.departmentForm.valid) {
      this.masterService.createDepartment(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Department Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.departmentForm);
    }
  }
  markFormTouched(form: FormGroup) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: false });
    });
  }

  updateDepartment() {
    if (this.departmentForm.valid) {
      const formData = {
        departmentCode: this.departmentCode,
        departmentName: this.departmentName,
      };

      this.masterService.updateDepartment(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Department Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.departmentForm);
    }
  }

  // Expenses Form Submission
  formSubmitExpanses(formData: any) {
    if (this.expansesForm.valid) {
      this.masterService.createExpenses(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Expenses Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.expansesForm);
    }
  }

  // Update Expenses
  updateExpenses() {
    if (this.expansesForm.valid) {
      const formData = {
        expensesCode: this.expensesCode,
        expensesName: this.expensesName,
      };

      this.masterService.updateExpenses(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Expenses Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.expansesForm);
    }
  }

  // Bank Form Submission
  formSubmitBank(formData: any) {
    if (this.bankForm.valid) {
      this.masterService.createBank(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Bank Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.bankForm);
    }
  }

  // Update Bank
  updateBank() {
    if (this.bankForm.valid) {
      const formData = {
        bankCode: this.bankCode,
        bankName: this.bankName,
      };

      this.masterService.updateBank(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Bank Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.bankForm);
    }
  }

  // Package Form Submission
  formSubmitPackage(formData: any) {
    if (this.packageForm.valid) {
      this.masterService.createPackage(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Package Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.packageForm);
    }
  }

  updatePackage() {
    if (this.packageForm.valid) {
      const formData = {
        packageCode: this.packageCode,
        packageName: this.packageName,
      };

      this.masterService.updatePackage(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Package Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.packageForm);
    }
  }

  // Delivery Form Submission
  formSubmitDelivery(formData: any) {
    if (this.deliveryForm.valid) {
      this.masterService.createDelivery(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Delivery Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.deliveryForm);
    }
  }

  // Update Delivery
  updateDelivery() {
    if (this.deliveryForm.valid) {
      const formData = {
        deliveryCode: this.deliveryCode,
        deliveryName: this.deliveryName,
      };

      this.masterService.updateDelivery(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Delivery Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.deliveryForm);
    }
  }

  // Reason Form Submission
  formSubmitReason(formData: any) {
    if (this.reasonForm.valid) {
      this.masterService.createReason(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Reason Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.reasonForm);
    }
  }

  // Update Reason
  updateReason() {
    if (this.reasonForm.valid) {
      const formData = {
        reasonCode: this.reasonCode,
        reasonName: this.reasonName,
      };

      this.masterService.updateReason(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Reason Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.reasonForm);
    }
  }

  // Service Form Submission
  formSubmitService(formData: any) {
    if (this.serviceForm.valid) {
      this.masterService.createService(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Service Form Submission:', error);
        }
      );
    } else {
      this.markFormTouched(this.serviceForm);
    }
  }

  // Update Service
  updateService() {
    if (this.serviceForm.valid) {
      const formData = {
        serviceCode: this.serviceCode,
        serviceName: this.serviceName,
      };

      this.masterService.updateService(formData).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error in Service Update:', error);
        }
      );
    } else {
      this.markFormTouched(this.serviceForm);
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
