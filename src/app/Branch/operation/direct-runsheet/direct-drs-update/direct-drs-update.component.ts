import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-direct-drs-update',
  templateUrl: './direct-drs-update.component.html',
  styleUrls: ['./direct-drs-update.component.css']
})
export class DirectDrsUpdateComponent implements OnInit {

 drsForm!: FormGroup;
  pendingDrsCount = 0;
  previewImage: string | null = null;
  currentDate:any;

  constructor(private fb: FormBuilder, private http: HttpClient,private snackBar: MatSnackBar) {
    this.currentDate = this.getCurrentDate();
  }

  ngOnInit() {
    
    this.drsForm = this.fb.group({
      drsNumber: ['', Validators.required],
      drsDate: [this.currentDate, Validators.required],
      drsImage: ['',Validators.required]
    });

    this.fetchPendingCount();
  }

     getCurrentDate(): string {
      const today = new Date();
      return this.formatDate(today);
    }
  
    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
  
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

  fetchPendingCount() {
    this.http.get<number>('api/drs/pending-count').subscribe((count) => {
      this.pendingDrsCount = count;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.drsForm.patchValue({ drsImage: this.previewImage });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.drsForm.valid) {
      console.log(this.drsForm.value);
      this.http.post('api/drs/update', this.drsForm.value).subscribe((res) => {
        // alert('DRS Updated Successfully!');
        this.openSnackBar('DRS Updated Successfully!', 'custom-snackbar');
        this.drsForm.reset();
        this.previewImage = null;
        this.fetchPendingCount();
      });
    }
    else{
      this.drsForm.markAllAsTouched();
      this.openSnackBar('All fields are required!', 'error-snackbar');
    }
  }


  openSnackBar(message: string, panelClass: string) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      });
    }

}
