import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransStockInComponent } from './trans-stock-in/trans-stock-in.component';
import { TransStockOutComponent } from './trans-stock-out/trans-stock-out.component';
import { TransactionWmsComponent } from './transaction-wms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    TransactionWmsComponent,
    TransStockInComponent,
    TransStockOutComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class TransactionWmsModule { }
