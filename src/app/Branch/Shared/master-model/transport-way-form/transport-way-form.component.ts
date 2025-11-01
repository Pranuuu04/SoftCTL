import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'app/Branch/master/master.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-transport-way-form',
  templateUrl: './transport-way-form.component.html',
  styleUrls: ['./transport-way-form.component.css']
})
export class TransportWayFormComponent implements OnInit {

  validationMessage: any;

  airlineForm: FormGroup;
  airlineMode: any;
  airlineData: any;
  airlineName: any;
  airlineCode: any;

  trainForm: FormGroup;
  trainMode: any;
  trainData: any;
  trainName: any;
  trainCode: any;

  tNumberForm: FormGroup;
  tNumberMode: any;
  tNumberData: any;
  tNumberName: any;
  tNumberCode: any;
  tNumberTrainName: any;
  tNumberTrainCode: any;

  flightForm: FormGroup;
  flightMode: any;
  flightData: any;
  flightName: any;
  flightCode: any;
  flightAirlineName: any;
  flightAirlineCode: any;


  trainList: any;
  airlineList: Object;
  constructor(private _mdr: MatDialogRef<TransportWayFormComponent>,
                public formBuilder: FormBuilder,
                public httpService: HttpService,
                public http: HttpClient,
                public masterService: MasterService,
                private snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: {
                  airlineMode: any;
                  airlineData: any;

                  flightMode: any;
                  flightData: any;

                  trainMode: any;
                  trainData: any;

                  tNumberMode: any;
                  tNumberData: any;

                  action: string;
                }) {
                  if ( data.airlineData || data.flightData || data.trainData || data.tNumberData ) {

                    this.airlineMode = data.airlineMode;
                    this.airlineData = data.airlineData;
                    this.airlineName = this.airlineData?.AirLine_Name;
                    this.airlineCode = this.airlineData?.AirLine_Code;

                    this.flightMode = data.flightMode;
                    this.flightData = data.flightData;
                    this.flightName = this.flightData?.Flight_Name;
                    this.flightCode = this.flightData?.Flight_Code;
                    this.flightAirlineName = this.flightData?.AirLine_Code;
                    this.flightAirlineCode = this.flightData?.AirLine_Code;

                    this.trainMode = data.trainMode;
                    this.trainData = data.trainData;
                    this.trainName = this.trainData?.Train_Name;
                    this.trainCode = this.trainData?.Train_Code;

                    this.tNumberMode = data.tNumberMode;
                    this.tNumberData = data.tNumberData;
                    this.tNumberName = this.tNumberData?.TrainNo_Name;
                    this.tNumberCode = this.tNumberData?.TrainNo_Code;
                    this.tNumberTrainName = this.tNumberData?.Train_Code;
                    this.tNumberTrainCode = this.tNumberData?.Train_Code;
                    }
                }

  ngOnInit(): void {
    this.validationMessage = {
      airlineCode: [ {type: 'required' , message: 'Please Enter airline Code.'} ],
      airlineName: [ {type: 'required' , message: 'Please Enter airline Name.'} ],

      flightCode: [ {type: 'required' , message: 'Please Enter flight Code.'} ],
      flightName: [ {type: 'required' , message: 'Please Enter flight Name.'} ],
      flightAirlineName: [ {type: 'required' , message: 'Please Enter Airline Name.'} ],

      trainCode: [ {type: 'required' , message: 'Please Enter train Code.'} ],
      trainName: [ {type: 'required' , message: 'Please Enter train Name.'} ],

      tNumberCode: [ {type: 'required' , message: 'Please Enter trainNo. Code.'} ],
      tNumberName: [ {type: 'required' , message: 'Please Enter trainNo. Name.'} ],
      tNumberTrainName: [ {type: 'required' , message: 'Please Enter train Name.'} ],

    }
      this.airlineForm = this.formBuilder.group({
        airlineCode: new FormControl('', Validators.compose([ Validators.required ])),
        airlineName: new FormControl('', Validators.compose([ Validators.required ])),
      });

      this.flightForm = this.formBuilder.group({
        flightCode: new FormControl('', Validators.compose([ Validators.required ])),
        flightName: new FormControl('', Validators.compose([ Validators.required ])),
        flightAirlineName: new FormControl('', Validators.compose([ Validators.required ])),
      });

      this.trainForm = this.formBuilder.group({
        trainCode: new FormControl('', Validators.compose([ Validators.required ])),
        trainName: new FormControl('', Validators.compose([ Validators.required ])),
      });

      this.tNumberForm = this.formBuilder.group({
        tNumberCode: new FormControl('', Validators.compose([ Validators.required ])),
        tNumberName: new FormControl('', Validators.compose([ Validators.required ])),
        tNumberTrainName: new FormControl('', Validators.compose([ Validators.required ])),

      });

      this.loadTrainName();
      this.getAirLine();
  }

    loadTrainName() {
      this.http.get(`${environment.apiUrl}Master/allMasters?masterName=Train&operation=getTrain`).subscribe((resp: any) => {
      this.trainList = resp.Data;
      })
  }

  getAirLine(): void {
      this.http.get(`${environment.apiUrl}Master/allMasters?masterName=AirLine&operation=getAirLine`)
      .subscribe((resp: any) => {
        this.airlineList = resp.Data;
      });
    }
  formSubmitairline(formData: any) {
    if (this.airlineForm.valid) {
      this.masterService.createAirline(formData.airlineCode, formData.airlineName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating airline:', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.airlineForm);
    }
  }

  formSubmitflight(formData: any) {
    if (this.flightForm.valid) {
      this.masterService.createFlight(formData.flightCode, formData.flightName, formData.flightAirlineName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating flight:', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.flightForm);
    }
  }

  formSubmittrain(formData: any) {
    if (this.trainForm.valid) {
      this.masterService.createTrain(formData.trainCode, formData.trainName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating train:', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.trainForm);
    }
  }

  formSubmitTNumber(formData: any) {
    if (this.tNumberForm.valid) {
      this.masterService.createTrainNo(formData.tNumberCode, formData.tNumberName, formData.tNumberTrainName).subscribe(
        (resp) => {
          if (resp.status === 1) {
            this.openSnackBar(resp.message, 'custom-snackbar');
            this._mdr.close(true);
          } else {
            this.openSnackBar(resp.message, 'error-snackbar');
          }
        },
        (error) => {
          console.error('Error creating train no.', error);
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.tNumberForm);
    }
  }

  updateAirline() {
    if (this.airlineForm.valid) {
      const { airlineCode, airlineName } = this.airlineForm.value;
      this.masterService
        .createOrUpdateAirLine('UpdateAirLine', airlineCode, airlineName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating airline:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.airlineForm);
    }
  }

  updateFlight() {
    if (this.flightForm.valid) {
      const { flightCode, flightName, flightAirlineName } = this.flightForm.value;
      this.masterService
        .createOrUpdateFlight('UpdateFlight', flightCode, flightName, flightAirlineName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating flight:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.flightForm);
    }
  }

  updateTrain() {
    if (this.trainForm.valid) {
      const { trainCode, trainName } = this.trainForm.value;
      this.masterService
        .createOrUpdateTrain('UpdateTrain', trainCode, trainName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating train:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.trainForm);
    }
  }

  updateTNumber() {
    if (this.tNumberForm.valid) {
      const { tNumberCode, tNumberName, tNumberTrainName } = this.tNumberForm.value;
      this.masterService
        .createOrUpdateTrainNo('UpdateTrainNo', tNumberCode, tNumberName, tNumberTrainName)
        .subscribe(
          (resp) => {
            if (resp.status === 1) {
              this.openSnackBar(resp.message, 'custom-snackbar');
              this._mdr.close(true);
            } else {
              this.openSnackBar(resp.message, 'error-snackbar');
            }
          },
          (error) => console.error('Error updating tNumber:', error)
        );
    } else {
      this.markFormFieldsAsTouched(this.tNumberForm);
    }
  }

  private markFormFieldsAsTouched(formGroup: any): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: false });
    });
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
