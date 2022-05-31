import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { sandboxOf } from 'angular-playground';
import { BehaviorSubject, EMPTY, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInfo } from '../../core';
import { AuthModule } from '../auth.module';
import { AuthService } from '../services';
import { AuthenticateInfo } from '../types';
import { AuthEmailContainer } from './auth-email.container';

class MockAuthService {
    private isLoginSub$ = new BehaviorSubject(false);
    isLogin$ = this.isLoginSub$.asObservable();

    private userSub$ = new BehaviorSubject<UserInfo>(this.getUser());
    user$ = this.userSub$.asObservable();

    private loginErrorSub$ = new Subject<string[]>();
    loginError$ = this.loginErrorSub$.asObservable();

    private tmpRedirectUrl = '';

    get redirectUrl() {
        return this.tmpRedirectUrl;
    }

    set redirectUrl(value: string) {
        this.tmpRedirectUrl = value;
    }

    login(input: AuthenticateInfo) {
        if (input.email === 'testuser@gmail.com') {
            const user = this.getUser();
            this.userSub$.next(user);
            this.isLoginSub$.next(true);
            return of('success');
        } else {
            this.loginErrorSub$.next(['Bad error']);
            return EMPTY;
        }
    }

    logout() {}

    getUser() {
        return {
            id: '1',
            email: 'testuser@gmail.com',
            role: 'admin',
            firstname: 'Test',
            lastname: 'User',
        } as UserInfo;
    }
}

export default sandboxOf(AuthEmailContainer, {
    imports: [NoopAnimationsModule, AuthModule.forRoot(environment.api), HttpClientModule, RouterTestingModule],
    providers: [
        {
            provide: Router,
            useValue: {
                navigate(url: any) {
                    console.log('mock navigate called', url);
                },
            },
        },
        {
            provide: AuthService,
            useClass: MockAuthService,
        },
    ],
    declareComponent: false,
    label: 'container',
}).add('Auth Email Container', {
    styles: [
        `
    
      auth-email-container {
        height: 300px;
        width: calc(100% / 3);
        border: 1px solid red;
      }
    `,
    ],
    template: `
      <auth-email-container></auth-email-container>
    `,
});
