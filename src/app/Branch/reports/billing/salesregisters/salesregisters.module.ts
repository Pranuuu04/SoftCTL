import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
      MatTabsModule,
      MatTableModule,
      MatSortModule, 
      FormsModule,
      ReactiveFormsModule,
      MatAutocompleteModule,
      NgSelectModule,
      MatPaginatorModule,
  ]
})
export class SalesregistersModule { }
