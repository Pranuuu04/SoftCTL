import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayementComponent } from './payement.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTabsModule } from '@angular/material/tabs';
import { CustCreditComponent } from './cust-credit/cust-credit.component';
import { PaymentEntryComponent } from './payment-entry/payment-entry.component';
import { PaymentFormComponent } from 'app/Branch/Shared/payment/payment-form/payment-form.component';
import { WalletEntryComponent } from './wallet-entry/wallet-entry.component';
import { CashTopayComponent } from './cash-topay/cash-topay.component';
import { CashTopayReportComponent } from './cash-topay-report/cash-topay-report.component';
import { CreditNoteReportComponent } from './credit-note-report/credit-note-report.component';
import { PaymentEntryReportComponent } from './payment-entry-report/payment-entry-report.component';
import { WalletEntryReportComponent } from './wallet-entry-report/wallet-entry-report.component';
import { PaymentEntryBillComponent } from './payment-entry-bill/payment-entry-bill.component';
import { PaymentEntryBillReportComponent } from './payment-entry-bill-report/payment-entry-bill-report.component';


@NgModule({
  declarations: [
    PayementComponent,
    CreditNoteComponent,
    CustCreditComponent,
    PaymentEntryComponent,
    PaymentFormComponent,
    WalletEntryComponent,
    CashTopayComponent,
    CashTopayReportComponent,
    CreditNoteReportComponent,
    PaymentEntryReportComponent,
    WalletEntryReportComponent,
    PaymentEntryBillComponent,
    PaymentEntryBillReportComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MaterialModule,
    NgSelectModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
  ]
})
export class PayementModule { }
