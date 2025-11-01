import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/service/http.service';

@Component({
  selector: 'app-usermanagement-booking',
  templateUrl: './usermanagement-booking.component.html',
  styleUrls: ['./usermanagement-booking.component.css']
})
export class UsermanagementBookingComponent implements OnInit {
  
  selectedSection: any;
  responseData: any[] =[];
  sideMenu :any;
  option: any;
  subOptionSelected: boolean = false;
  selectedOptions: string[] = [];

  constructor(
    public _mdr: MatDialogRef<UsermanagementBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public httpService: HttpService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { 
    this.responseData = JSON.parse(localStorage.getItem('responseData'))
  }

  ngOnInit(): void {}
    
  openSnackBar(message: string, panelClass: string) {
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

  onSectionChange(event: any) {
    this.selectedSection = event.value;
    console.log(this.selectedSection);
    
  }

  submitOptions(): void {
    const selectedOptions = this.responseData.filter(item => item.isChecked);
    this.selectedOptions.forEach(sectionName => {
      selectedOptions.push({ captionName: sectionName, isChecked: true, captionType: 'Menu' });
    });

    const invalidOptions = selectedOptions.filter(option => {
      const relatedSubOptions = this.responseData.filter(subOption =>
        subOption.captionType === 'Child_Menu' && subOption.groupName === option.captionName
      );
      const availableSubOptions = relatedSubOptions.length > 0;
      const selectedSubOptions = relatedSubOptions.filter(subOption => subOption.isChecked);
      return availableSubOptions && selectedSubOptions.length === 0;
    });
    if (invalidOptions.length > 0) {
      const optionNames = invalidOptions.map(option => option.captionName).join(', ');
      this.openSnackBar(`Please select at least one option of: ${optionNames}`, 'error-snackbar');
    } else {
      this._mdr.close(selectedOptions);
    }
  }

  toggleOption(section: any, option: any): void {
    option.isChecked = !option.isChecked;
    if (option.isChecked && !this.selectedOptions.includes(section.captionName)) {
      this.selectedOptions.push(section.captionName);
    }
    this.sideMenu.forEach((item: any) => {
      if (item.captionType === 'Sub_Menu' && item.groupName === option.captionName) {
        item.isChecked = option.isChecked;
      }
    });
  }

  toggleSubOption(section: any, option: any, subOption: any): void {
    subOption.isChecked = !subOption.isChecked;
  }

}