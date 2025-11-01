// Angular
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// Perfect Scrollbar
// import { CoreModule } from "@angular/flex-layout";
// import { ToastrComponent } from "./toastr.component";
import { MaterialModule } from './../../angularMaterial/angularMaterial';


@NgModule({
    declarations: [
    ],
    exports: [

    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        // CoreModule,
        MaterialModule,

    ],
})
export class PartialsModule { }
