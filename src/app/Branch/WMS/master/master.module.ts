// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {MatTabsModule } from '@angular/material/tabs';
// import { MatTableModule } from '@angular/material/table';
// import { MatSortModule } from '@angular/material/sort';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MasterComponent } from './master.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { RackComponent } from './rack/rack.component';
import { CategoryComponent } from './category/category.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryFormComponent } from 'app/Branch/Shared/whms-pages/category-form/category-form.component';
import { ItemMastFormComponent } from 'app/Branch/Shared/whms-pages/item-mast-form/item-mast-form.component';
import { RackFormComponent } from 'app/Branch/Shared/whms-pages/rack-form/rack-form.component';
import { WarehouseFormComponent } from 'app/Branch/Shared/whms-pages/warehouse-form/warehouse-form.component';



@NgModule({
  declarations: [
    MasterComponent,
    WarehouseComponent,
    ItemMasterComponent,
    RackComponent,
    CategoryComponent,
    RackFormComponent,
    CategoryFormComponent,
    ItemMastFormComponent,
    WarehouseFormComponent,

  ],
  imports: [
    // CommonModule,
    // MatTabsModule,
    // MatTableModule,
    // MatSortModule,
    // FormsModule,
    // ReactiveFormsModule,
    // MatAutocompleteModule,
    // MatPaginatorModule
      CommonModule,
      RouterModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgSelectModule,
  ]
})
export class MasterModule { }
