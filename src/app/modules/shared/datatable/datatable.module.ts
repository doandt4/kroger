import { NgModule } from '@angular/core';
import { DatatableComponent } from './datatable.component';
import { MaterialModule } from '../material.module';

@NgModule({
    declarations: [DatatableComponent],
    imports: [MaterialModule],
    exports: [DatatableComponent],
})
export class DataTableModule {}
