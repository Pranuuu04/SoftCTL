import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-forwading-manifest',
  templateUrl: './forwading-manifest.component.html',
  styleUrls: ['./forwading-manifest.component.css'],
})
export class ForwadingManifestComponent implements OnInit {

  form: FormGroup;
  tableData: any[] = [];
  sessionLocationCode: string;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
    this.sessionLocationCode = localStorage.getItem('originCode');

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fromDate: [this.getCurrentDate(), Validators.required],
      Vendor_Name: ['', Validators.required],
      Vendor_AwbNo: ['', Validators.required],
      Vendor_Weight:['', Validators.required],
      AWB_No: ['', Validators.required]
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

// ...

onSubmit(): void {
  if (this.form.valid) {
    const formData = this.form.value;

    // Create the payload to be sent to the API
    const payload = {
      awbNo: [formData.AWB_No],
      vendorAwbNo: formData.Vendor_AwbNo,
      fromDest:  this.sessionLocationCode,  // You may need to adjust this based on your requirements
      date: formData.fromDate,
      vendorWt: formData.Vendor_Weight
    };

    // Send the data to the API
    this.httpClient.post(`${environment.apiUrl}Manifest/forwardingManifest`, payload)
      .subscribe(
        (response: any) => {
          // Handle the API response if needed
          console.log('API response forwardingManifest:', response);
          if (response && response.message) {
            alert(response.message); // Display the message from the API in an alert
          } else {
            alert('Unexpected response from the server.');
          }
        },
        (error) => {
          // Handle the API error if needed
          console.error('API error:', error);
          alert('Error submitting data. Please try again.'); // Display a generic error message
        }
      );

    // Add the form data to the local tableData array
    this.tableData.push(formData);
    this.form.reset();
  }
}
// ...

  }
