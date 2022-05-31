import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyFormatPipe, NumberFormatPipe } from './pipes';

@NgModule({
    declarations: [NumberFormatPipe, MoneyFormatPipe],
    imports: [CommonModule],
    exports: [NumberFormatPipe, MoneyFormatPipe],
})
export class PipeModule {}
