import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AllServicesService } from 'app/service/all-services.service';
import { log } from 'console';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css'],
  standalone: true,
  imports: [MatSlideToggleModule],
})
export class CommentDialogComponent implements OnInit {
  form: FormGroup;
  showBox: boolean;
  showBoxDep: boolean;
  statusToggle: boolean = true;
  statusToggleDepartment: boolean = true;
  edd: any;
  dep: any;

  constructor(
    private _mdr: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder,
    private allservice : AllServicesService
  
  ) {  }
  ngOnInit(): void {
    this.showBox = this.allservice.getToggleState();
    this.showBoxDep = this.allservice.getToggleStateDep();
    console.log( this.showBox,'hello sharib');
    console.log( this.showBoxDep,'hello sharib');
    
  }

  toggleEDD() {
    // Toggle the state and notify the other component
    this.allservice.setToggleState(!this.allservice.isToggleOn.value);
  }
  toggleDepartment(){
    this.allservice.setToggleStateDep(!this.allservice.isToggleOn1.value);
  }

  CloseDialog() {
    this._mdr.close(false);
  }

  submitToggleState() {
    // Save the state to the SharedService
    this.edd = this.allservice.setToggleState(this.allservice.isToggleOn.value)
    this.dep = this.allservice.setToggleStateDep(this.allservice.isToggleOn1.value);
    console.log(this.allservice.isToggleOn.value,'fazalllll');
    
    console.log( this.edd ,'hello ankita ');
    console.log( this.dep ,'hello ankita ');


    
    this._mdr.close();
  
    // Close the dialog or perform other actions
  }

}
