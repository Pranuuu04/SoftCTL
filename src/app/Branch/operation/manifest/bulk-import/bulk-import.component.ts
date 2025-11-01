import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManferrorLogComponent } from 'app/Branch/Shared/manifest pages/manferror-log/manferror-log.component';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { SharedService } from 'app/service/shared.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-bulk-import',
  templateUrl: './bulk-import.component.html',
  styleUrls: ['./bulk-import.component.css']
})
export class BulkImportComponent implements OnInit {

  selectedFile: File;
  manifestForm: FormGroup;
  sessionLocationCode: any;
  originName: any;
  ModeName: any;
  DestinationName: any;
  ColoaderName: any;
  isDisabled = false;
  selectedValue: string;
  userType: string;

  constructor(private fb: FormBuilder,
              private getData: AllServicesService,
              public httpService: HttpService,
              public dialog: MatDialog,
              private sharedService: SharedService, ) {
                  this.sessionLocationCode = localStorage.getItem('originCode');
                  this.originName = localStorage.getItem('originName');
                }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.selectedValue = this.sharedService.getSelectedValue();
    this.loadMode();
    this.loadDestination();
    this.loadColoaderName();
    this.renderForm();
  }

  renderForm() {
    this.manifestForm = this.fb.group({
      drone: 'Manifest',
      Manifest_Date: new Date().toISOString().split('T')[0],
      mode: '',
      Origin: '',
      Destination: '',
      Forwading_Name: '',
      Forwading_No: ''
    });
  }

  async loadMode() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Booking/getMode`);
      this.ModeName = resp.Data;
    } catch (error) {
      console.error('Error loading mode:', error);
    }
  }

  // async loadDestination() {
  //   try {
  //     const resp = await this.httpService.get(`${environment.apiUrl}Manifest/toBranch?sessionLocationCode=${this.sessionLocationCode}`);
  //     this.DestinationName = resp.Data;
  //   } catch (error) {
  //     console.error('Error loading destination:', error);
  //   }
  // }
  loadDestination() {
    if (this.userType !== 'Admin') {
    this.getData.GetDestination(this.sessionLocationCode).subscribe((resp: any) => {
        this.DestinationName = resp.Data;
      });
    } else {
      this.getData.GetDestination(this.selectedValue).subscribe((resp: any) => {
        this.DestinationName = resp.Data;
      });
    }
  }
  async loadColoaderName() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Manifest/getVendor`);
      this.ColoaderName = resp.Data;
    } catch (error) {
      console.error('Error loading ColoaderName:', error);
    }
  }

  onDownloadSample() {
    const selectedDrone = this.manifestForm.get('drone').value;
    if (selectedDrone === 'Manifest') {
      this.generateExcelManifestImport();
    } else if (selectedDrone === 'Forwading') {
      this.generateExcelForwadingImport();
    }
  }

  generateExcelManifestImport() {
    this.getData.generateExcelManifestImport();
  }

  generateExcelForwadingImport() {
    this.getData.generateExcelForwadingImport();
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.truncateErrorLog();
      this.selectedFile = inputElement.files[0];
    } else {
      alert('No file selected.');
    }
  }

  async onSubmit() {
    if (this.manifestForm.valid) {
      if (this.selectedFile) {
        const mode = this.manifestForm.get('mode').value;
        const destination = this.manifestForm.get('Destination').value;

        // Check if both mode and destination are selected
        if (mode && destination) {
          const fileName = this.selectedFile.name;
          const dialogRef = this.openprogressbar(fileName);

          try {
            if (this.userType !== 'Admin') {
            const postData = {
              manifestDate: this.manifestForm.get('Manifest_Date').value,
              Mode: mode,
              fromDest: this.sessionLocationCode,
              toDest: destination,
              vendorCode: this.manifestForm.get('Forwading_Name').value,
              refrenceNo: this.manifestForm.get('Forwading_No').value,
            };

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            Object.keys(postData).forEach((key) => {
              formData.append(key, postData[key]);
            });

            const response = await this.httpService.post(`${environment.apiUrl}Manifest/importManifest`, formData);

            if (response.status === 1) {
              alert(response.message);
            } else {
              alert(response.message);
            }
          } else {
            const postData = {
              manifestDate: this.manifestForm.get('Manifest_Date').value,
              Mode: mode,
              fromDest: this.selectedValue,
              toDest: destination,
              vendorCode: this.manifestForm.get('Forwading_Name').value,
              refrenceNo: this.manifestForm.get('Forwading_No').value,
            };

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            Object.keys(postData).forEach((key) => {
              formData.append(key, postData[key]);
            });

            const response = await this.httpService.post(`${environment.apiUrl}Manifest/importManifest`, formData);

            if (response.status === 1) {
              alert(response.message);
            } else {
              alert(response.message);
            }
          }
          } catch (error) {
            console.error('Error sending data:', error);
          } finally {
            dialogRef.close();
          }
        } else {
          alert('Please select both mode and destination.');
        }
      } else {
        alert('Please select a file.');
      }
    } else {
      Object.keys(this.manifestForm.controls).forEach((field) => {
        const control = this.manifestForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }



  onSubmitForwarding() {
    if (this.selectedFile) {
      this.isDisabled = true;
      const fileName = this.selectedFile.name;
      const dialogRef = this.openprogressbar(fileName);

      const forwadingFormData = new FormData();
      forwadingFormData.append('file', this.selectedFile);

      this.httpService.post(`${environment.apiUrl}Manifest/importForwading`, forwadingFormData)
        .then((response) => {
          alert(response.message);
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          dialogRef.close();
          this.isDisabled = false;
        });
    } else {
      alert('No file selected. Please select a file.');
    }
  }

  openprogressbar(fileName: string): MatDialogRef<ProgressBarComponent> {
    const dialogRef = this.dialog.open(ProgressBarComponent, {
      data: {
        action: 'add',
        fileName: fileName
      },
      width: '35rem',
      disableClose: true
    });

    return dialogRef;
  }

  ErrorLog() {
    const dialogRef = this.dialog.open(ManferrorLogComponent, {
      data: {
        action: 'add'
      },
      width: '30rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
    });
}
truncateErrorLog() {
  this.httpService.get(`${environment.apiUrl}Booking/truncateManifestImport`).then(
      (response: any) => {
        console.log(response);
      },
      (error) => {
        console.error('Error truncating error log:', error);
      }
    );
}
}
