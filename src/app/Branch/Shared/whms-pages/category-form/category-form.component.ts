// import { Component, OnInit } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {


  validationMessage: any;
  categoryForm: FormGroup;
  categoryCode: any;
  categoryName: any;

  constructor(private _mdr: MatDialogRef<CategoryFormComponent>,
    public formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

      if (this.data?.categoryData) {
        this.categoryCode = this.data.categoryData.Category_Code;
        this.categoryName = this.data.categoryData.Category_Name;
        console.log('RackCode >>> ',this.categoryCode)
       
      }

    }

  ngOnInit(): void {
      
    this.validationMessage = {
      categoryCode: [ {type: 'required' , message: 'Please Enter Category Code.'},{type: 'pattern' , message: 'Code should be alphanumeric.'} ],
      categoryName: [ {type: 'required' , message: 'Please Enter Category Name.'},{type: 'pattern' , message: 'Name should be alphanumeric.'} ],
    }
    
    this.categoryForm = this.formBuilder.group({
      categoryCode: new FormControl('', Validators.compose([ Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)])),
      categoryName: new FormControl('', Validators.compose([ Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]+$/)])),
    });


  }

  formSubmitCategory(formData:any){

    console.log('formdata:>>>', formData);
    this.httpService.get(`${environment.apiUrl}Master/allMasters?masterName=Category&operation=CreateCategory&code=${formData.categoryCode}&name=${formData.categoryName}`).then((res: any) =>{
      console.log('formdata:', res.status);
      if (res.status == 1) {  
        this.openSnackBar(res.message , 'custom-snackbar' );
        this._mdr.close();
      } else {
        this.openSnackBar(res.message , 'custom-snackbar' );
        // alert(res.message)
      }
    });

  }

  updateCategory(){
    this.httpService.get(`${environment.apiUrl}Master/allMasters?masterName=Category&operation=UpdateCategory&code=${this.categoryCode}&name=${this.categoryName}`).then((res: any) =>{
      console.log('formdata:', res.status);
      if (res.status == 1) {  
        this.openSnackBar(res.message , 'custom-snackbar' );
        this._mdr.close();
      } else {
        this.openSnackBar(res.message , 'custom-snackbar' );
        // alert(res.message)
      }
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

  CloseDialog(){
    this._mdr.close()
  }


}
