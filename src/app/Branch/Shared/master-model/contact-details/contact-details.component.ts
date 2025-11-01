import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

   contactForm!: FormGroup;
  contactList: any[] = [];

  constructor(private _mdr: MatDialogRef<ContactDetailsComponent>,
              public fb: FormBuilder,
              private snackBar: MatSnackBar,
               @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      Name: ['', Validators.required],
      PhoneNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      Email: ['', [Validators.required, Validators.email]]
    });
   if (this.data?.contactDetails) {
    const incoming: any[] = Array.isArray(this.data.contactDetails)
      ? this.data.contactDetails
      : [this.data.contactDetails];

    incoming.forEach(c =>
      this.contactList.push({
        Person_Name: c.Person_Name,
        Mob_No:      c.Mob_No,
        Email:       c.Email
      })
    );

  }
  }

addContact(): void {
  if (this.contactForm.valid) {
    const contact = {
      Person_Name: this.contactForm.value.Name,
      Email: this.contactForm.value.Email,
      Mob_No: this.contactForm.value.PhoneNo
    };
    this.contactList.push(contact);
    this.contactForm.reset();
    this.openSnackBar('Contact added successfully!', 'custom-snackbar');
  } else {
    this.openSnackBar('Please fill out all required fields correctly.', 'error-snackbar');
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

  removeContact(index: number): void {
    this.contactList.splice(index, 1);
  }

 submitContacts(): void {
  if (this.contactList.length > 0) {
    this.openSnackBar('Contacts submitted successfully!', 'custom-snackbar');
    this._mdr.close(this.contactList);
  } else {
    this.openSnackBar('No contacts to submit.', 'error-snackbar');
  }
}


  CloseDialog() {
    this._mdr.close();
  }

}
