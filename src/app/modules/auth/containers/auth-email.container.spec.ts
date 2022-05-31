import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthEmailContainer } from './auth-email.container';
import { AuthModule } from '../auth.module';
import { AuthLazyModule } from '../auth-lazy.module';

describe('AuthEmailContainerComponent', () => {
    let component: AuthEmailContainer;
    let fixture: ComponentFixture<AuthEmailContainer>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AuthLazyModule,
                AuthModule.forRoot(environment.api),
                RouterTestingModule,
                HttpClientTestingModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthEmailContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
