import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleConsignorComponent } from './sale-consignor/sale-consignor.component';
import { MasterSalesComponent } from './master-sales.component';
import { SalesRateComponent } from './sales-rate/sales-rate.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { SalesFormComponent } from 'app/Branch/Shared/master-model/sales-form/sales-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RateMaster2Component } from './rate-master2/rate-master2.component';
import { RatePrintComponent } from './rate-print/rate-print.component';
import { RateImportComponent } from './rate-import/rate-import.component';



@NgModule({
  declarations: [
    MasterSalesComponent,
    SaleConsignorComponent,
    SalesRateComponent,
    SalesFormComponent,
    RateMaster2Component,
    RatePrintComponent,
    RateImportComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MasterSalesModule { }
