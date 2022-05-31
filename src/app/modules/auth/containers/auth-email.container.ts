import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, map, shareReplay, takeUntil} from 'rxjs/operators';
import {AuthService} from '../services';

@Component({
    selector: 'auth-email-container',
    template: `
        <div class='auth-container'>
            <div class='logout-item' (click)='logout()'>
                <img class='logout-img' src='../../../../../assets/images/logout.svg'/>
                <button class='logout-btn' [attr.aria-label]="'logout'">
                    Logout
                </button>
            </div>
            <button class='user-account' mat-icon-button type='button' [attr.aria-label]="'user account'">
                <span class='user-initial'>{{ initial$ | async }}</span>
            </button>
            <p class='user-fullname'>{{ fullname$ | async }}</p>
        </div>
    `,
    styles: [
        `
            :host {
                display: flex;
                align-items: flex-end;
            }

            .auth-container {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .user-account {
                width: 5em;
                height: 5em;
                background-color: #b4cdff;
                border: 1px solid #9a9a9a;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                cursor: default;
            }

            .user-initial {
                font-size: 24px;
                font-weight: bold;
                color: #0035a0;
                text-transform: uppercase;
            }

            .user-fullname {
                font-family: Gill Medium;
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 20px;
                text-align: center;
                text-transform: uppercase;
            }

            .logout-item {
                display: flex;
                margin-bottom: 24px;
                cursor: pointer;
            }

            .logout-btn {
                margin-right: 24px;
                cursor: pointer;
                background: #0035a0 !important;
                color: #ffffff;
                border: none;
                font-family: Gill Medium;
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 20px;
                text-transform: uppercase;
            }

            .logout-img {
                margin-right: 12px;
            }

            app-language-switcher {
                padding: 30px 0;
            }

            @media only screen and (max-width: 400px) {
                .mat-menu-item {
                    font-size: 0.75rem;
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthEmailContainer implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject();
    isLogin$: Observable<boolean>;
    fullname$: Observable<string>;
    initial$: Observable<string>;

    constructor(
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.isLogin$ = this.authService.isLogin$;

        const user$ = this.authService.user$;
        this.fullname$ = user$.pipe(
            filter(user => !!user),
            map(user => {
                const firstname = (user && user.firstname) || '';
                const lastname = (user && user.lastname) || '';
                const fullname = `${firstname} ${lastname}`;
                return fullname;
            }),
            shareReplay(1),
            takeUntil(this.unsubscribe$),
        );

        this.initial$ = user$.pipe(
            filter(user => !!user),
            map(user => {
                const firstname = (user && user.firstname) || '';
                const lastname = (user && user.lastname) || '';
                const firstnameFirstChar = firstname.length > 0 ? firstname.substring(0, 1) : '';
                const lastnameFirstChar = lastname.length > 0 ? lastname.substring(0, 1) : '';
                const initial = `${firstnameFirstChar} ${lastnameFirstChar}`;
                return initial;
            }),
            shareReplay(1),
            takeUntil(this.unsubscribe$),
        );
    }

    logout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
