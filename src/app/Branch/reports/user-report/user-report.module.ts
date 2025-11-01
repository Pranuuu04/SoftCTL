import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStatusComponent } from './user-status/user-status.component';
import { UserLogComponent } from './user-log/user-log.component';
import { MaterialModule } from 'app/angularMaterial/angularMaterial';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { UserReportComponent } from './user-report.component';

@NgModule({
  declarations: [
    UserReportComponent,
    UserStatusComponent,
    UserLogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule
  ]
})
export class UserReportModule { }
