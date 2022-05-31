import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableMobileComponent } from './datatable-mobile.component';

describe('DatatableMobileComponent', () => {
    let component: DatatableMobileComponent;
    let fixture: ComponentFixture<DatatableMobileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DatatableMobileComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DatatableMobileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
