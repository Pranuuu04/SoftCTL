// import { Component, OnInit } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-item-mast-form',
  templateUrl: './item-mast-form.component.html',
  styleUrls: ['./item-mast-form.component.css']
})
export class ItemMastFormComponent implements OnInit {

  validationMessage: any;
   itemMastForm: FormGroup;
   code: any;
   name: any;
   category: any;
   volume: any;
   itemType: any;
   mrp:any;
   qty:any;
   sNo:any;
   categoryList:any[]=[];

 
   constructor(private _mdr: MatDialogRef<ItemMastFormComponent>,
     public formBuilder: FormBuilder,
     public httpService: HttpService,
     private router: Router,
     private snackBar: MatSnackBar,
     @Inject(MAT_DIALOG_DATA) public data: any) {

      if (this.data?.itemMastData) {
        this.code = this.data.itemMastData.Item_Code;
        this.name = this.data.itemMastData.Item_Name;
        this.category = this.data.itemMastData.Category_Code;
        this.volume = this.data.itemMastData.Volume;
        this.itemType = this.data.itemMastData.Item_Type;
        this.mrp = this.data.itemMastData.Rate;
        this.qty = this.data.itemMastData.Qty;
        console.log('RackCode >>> ',this.code)
       
      }
      }
 
   ngOnInit(): void {

    this.getCategoryData();

    this.validationMessage = {
      code: [{ type: 'required', message: 'Please enter code.' },{ type: 'pattern', message: 'Code should be alphanumeric only.' }],
      name: [{ type: 'required', message: 'Please enter name.' }],
      category: [{ type: 'required', message: 'Please select item category.' }],
      itemType: [{ type: 'required', message: 'Please select item category.' }],
      // volume: [{ type: 'required', message: 'Please enter volume.' }],
      mrp: [{ type: 'pattern', message: 'MRP should be numeric only.' }],
      qty: [{ type: 'pattern', message: 'Quantity should be numeric only.' }],
      // sNo: [{ type: 'required', message: 'Please enter serial number.' },{ type: 'pattern', message: 'Serial number should be alphanumeric only.' }]
    };
    
     
     this.itemMastForm = this.formBuilder.group({
       code: new FormControl('', Validators.compose([ Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/) ])),
       name: new FormControl('', Validators.compose([ Validators.required])),
       category: new FormControl('', Validators.compose([ Validators.required ])),
       itemType: new FormControl('', Validators.compose([ Validators.required ])),
       volume: new FormControl('',),
       mrp: new FormControl('',Validators.compose([Validators.pattern(/^[0-9]+$/) ])),
       qty: new FormControl('', Validators.compose([Validators.pattern(/^[0-9]+$/) ])),
       sNo: new FormControl('',),

     });
 
   }

   replaceUndefinedWithEmptyString(obj: any): any {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = obj[key] === undefined ? '' : obj[key];
      }
    }
    return sanitized;
  }


   getCategoryData(){
    this.httpService.get(`${environment.apiUrl}Master/allMasters?masterName=Category&operation=getCategory&code=&name=`).then((res: any) =>{
      console.log('formdata:', res.status);
      if (res.status == 1) {  
         this.categoryList = res.Data;
         console.log("Categories loaded:", this.categoryList);
        // this.openSnackBar(res.message , 'custom-snackbar' );
      } else {
        this.openSnackBar(res.message , 'custom-snackbar' );
        // alert(res.message)
      }
    });
   }
 
   formSubmitItemMast(formData:any){
    console.log('formdata:>>>', formData);
    this.httpService.get(`${environment.apiUrl}Master/ItemMast?masterName=Item&operation=CreateItem&itemCode=${formData.code}&itemName=${formData.name}&categoryCode=${formData.category}&volume=${formData.volume || ''}&rate=${formData.mrp || ''}&qty=${formData.qty || ''}&itemType=${formData.itemType}`).then((res: any) =>{
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
 
   updateItemMast(){

    this.httpService.get(`${environment.apiUrl}Master/ItemMast?masterName=Item&operation=UpdateItem&itemCode=${this.code}&itemName=${this.name}&categoryCode=${this.category}&volume=${this.volume}&rate=${this.mrp}&qty=${this.qty}&itemType=${this.itemType}`).then((res: any) =>{
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
