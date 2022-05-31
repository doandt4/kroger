import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthLazyModule } from '../auth-lazy.module';
import { AuthModule } from '../auth.module';
import { AuthLoginContainer } from './auth-login.container';

describe('AuthLoginContainerComponent', () => {
    let component: AuthLoginContainer;
    let fixture: ComponentFixture<AuthLoginContainer>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                AuthLazyModule,
                AuthModule.forRoot(environment.api),
                HttpClientTestingModule,
                RouterTestingModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthLoginContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
