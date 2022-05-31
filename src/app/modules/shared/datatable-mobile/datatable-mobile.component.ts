import { AfterViewInit, Component,  OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-datatable-mobile',
    templateUrl: './datatable-mobile.component.html',
    styleUrls: ['./datatable-mobile.component.scss'],
})
export class DatatableMobileComponent implements OnInit, AfterViewInit, OnChanges {
    constructor() {}

    ngOnInit() {}

    ngAfterViewInit(): void {
    }

    ngOnChanges(_: SimpleChanges): void {
    }
}
