import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { exhaustMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../services';
import { AuthenticateInfo } from '../types';

@Component({
    selector: 'auth-login-container',
    template: `
        <div class="language-switcher-included">
            <div class="login-container">
                <div class="child-container">
                    <auth-login-form
                        class="component-form"
                    ></auth-login-form>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .language-switcher-included{
            height: 100%;
            background-color: white;
        }
            .login-container {
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
            }

            .child-container {
                height: 100%;
                display: flex;
            }

            auth-login-form {
                margin: auto;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginContainer implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject();
    login$ = new Subject<AuthenticateInfo>();
    loginError$ = this.authService.loginError$;
    forgetPassword$ = new Subject();
    currentLanguageCode = '';

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.login$
            .pipe(
                exhaustMap(loginValues => this.authService.login(loginValues)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();

        this.forgetPassword$.subscribe(() => {
            this.router.navigate(['/reset-password']);
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
