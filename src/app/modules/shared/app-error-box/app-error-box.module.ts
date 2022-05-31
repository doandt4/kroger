import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorBoxComponent } from './app-error-box.component';
import { MatInputModule } from '@angular/material/input';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [AppErrorBoxComponent],
    imports: [CommonModule, MatInputModule, TranslateModule],
    exports: [AppErrorBoxComponent, MatInputModule],
})
export class AppErrorBoxModule {}
