import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, EMPTY, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomEncoder, Logger, UserInfo } from '../../core';
import { ApiConstant, CustomHttpErrorResponse } from '../../types';
import { API_TOKEN, AuthenticateInfo, NotificationResult, TokenPayload } from '../types';
import { UserService } from './user.service';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class AuthService {
    authUrl = `${this.apiConstants.endpoint}/auth`;
    private errorsSub$ = new Subject<string[]>();

    private isLoginSub$ = new BehaviorSubject(this.isLogin());
    isLogin$ = this.isLoginSub$.asObservable();

    private userSub$ = new BehaviorSubject<UserInfo | null>(this.getUser());
    user$ = this.userSub$.asObservable();

    private loginErrorSub$ = new Subject<string[]>();
    loginError$ = this.loginErrorSub$.asObservable();

    private contactUsErrorSub$ = new Subject<string[]>();
    contactUsError$ = this.contactUsErrorSub$.asObservable();

    private closeSideNavSub$ = new Subject();
    closeSideNav$ = this.closeSideNavSub$.asObservable();

    private tmpRedirectUrl = '';

    private checkAccessSub$ = new Subject<boolean>();

    private disableBlockchainSub$ = new Subject<boolean>();
    disableBlockchain$ = this.disableBlockchainSub$.asObservable();

    private menuNotificationSub$ = new Subject<NotificationResult>();
    menuNotification$ = this.menuNotificationSub$.asObservable();

    private handleError(err: CustomHttpErrorResponse) {
        if (err.errorJson && err.errorJson.message) {
            this.errorsSub$.next(err.errorJson.message);
        } else {
            this.errorsSub$.next([err.message]);
        }
        return EMPTY;
    }

    constructor(
        @Inject(API_TOKEN) private apiConstants: ApiConstant,
        private httpClient: HttpClient,
        private router: Router,
        public translate: TranslateService,
        private userService: UserService,
    ) {}

    get redirectUrl() {
        return this.tmpRedirectUrl;
    }

    set redirectUrl(value: string) {
        this.tmpRedirectUrl = value;
    }

    get checkAccess$() {
        return this.checkAccessSub$.asObservable();
    }

    login(input: AuthenticateInfo) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Login' });
        return this.httpClient
            .post(`${this.authUrl}/login`, input, {
                responseType: 'text',
                headers,
            })
            .pipe(
                tap(jwt => {
                    localStorage.setItem('jwt', jwt);
                    const user = this.getUser();
                    this.userSub$.next(user);
                    this.isLoginSub$.next(true);
                    const redirectUrl =
                        this.redirectUrl && this.redirectUrl !== '/login'
                            ? this.redirectUrl
                            : user?.role === 'qc'
                            ? '/administrator/campaigns-list'
                            : '/administrator/dashboard';
                    console.log('redirectUrl', redirectUrl);
                    this.router.navigate([redirectUrl]);
                }),
                catchError((err: CustomHttpErrorResponse) => {
                    this.isLoginSub$.next(false);
                    if (err.errorJson) {
                        this.loginErrorSub$.next(err.errorJson.message);
                    } else {
                        this.loginErrorSub$.next([err.message]);
                    }
                    return throwError(err);
                    // return EMPTY;
                }),
            );
    }

    isLogin() {
        return this.getJWT() != null;
    }

    invalidateSession() {
        localStorage.removeItem('jwt');
        this.isLoginSub$.next(false);
        this.loginErrorSub$.next([]);
        this.userSub$.next(null);
        this.userService.userInfo.next({});
        this.redirectUrl = '';
    }

    logout() {
        this.invalidateSession();
        const currentUrl = window.location.pathname;
        currentUrl !== '/login' ? this.router.navigate(['/']) : '';
        this.closeSideNavSub$.next();
    }

    getJWT() {
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                return null;
            }
            const token: TokenPayload = jwt_decode<TokenPayload>(jwt);
            const isExpired = Date.now() > token.exp * 1000;
            if (isExpired) {
                localStorage.removeItem('jwt');
                return null;
            }
            return jwt;
        } catch {
            localStorage.removeItem('jwt');
            return null;
        }
    }

    getUser(): UserInfo | null {
        const jwt = this.getJWT();
        if (!jwt) {
            return null;
        }

        const {
            id,
            email,
            role,
            firstname,
            lastname,
            lastLoginTime,
            status,
            geography,
            region,
            managerId,
            caseWorkerName,
            language,
        } = jwt_decode<TokenPayload>(jwt);

        return {
            id,
            email,
            role,
            firstname,
            lastname,
            lastLoginTime,
            status,
            geography,
            region,
            managerId,
            caseWorkerName,
            language,
        };
    }

    checkAccess(url: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Check access right' });
        const params = new HttpParams({ encoder: new CustomEncoder() }).set('url', url);

        this.httpClient
            .get<boolean>(`${this.authUrl}/check-access`, { headers, params })
            .pipe(
                tap((result: boolean) => {
                    Logger.log('checkAccess boolResult', result);
                    this.checkAccessSub$.next(result);
                }),
                catchError(err => {
                    Logger.log('checkAccess exception', err);
                    this.checkAccessSub$.next(false);
                    return EMPTY;
                }),
            )
            .subscribe();
    }

    isBlockchainDisabled() {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Check whether or not blockchain is disabled' });

        this.httpClient
            .get<{ disabled: boolean }>(`${this.authUrl}/disable-blockchain`, { headers })
            .pipe(
                tap(({ disabled }) => {
                    this.disableBlockchainSub$.next(disabled);
                }),
                catchError(err => {
                    Logger.log('isBlockchainDisabled exception', err);
                    this.disableBlockchainSub$.next(false);
                    return EMPTY;
                }),
            )
            .subscribe();
    }
    getNotification(): Observable<NotificationResult> {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Get all notification' });
        return this.httpClient
            .get<NotificationResult>(`${this.authUrl}/notification`, { headers })
            .pipe();
    }

    updateUserLanguage(userId: string, currentLanguageCode?: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'update user language' });
        const userI = { userId: userId, languageCode: currentLanguageCode };

        console.log(`${this.authUrl}/update-user-language`);
        return this.httpClient
            .post(`${this.authUrl}/update-user-language`, userI, {
                headers,
                responseType: 'text',
            })
            .pipe(
                tap((jwt: any) => {
                    localStorage.setItem('jwt', jwt);
                    let user = this.getUser();
                    this.userSub$.next(user);
                }),
            )
            .subscribe();
    }

    getListUserOfAgent() {
        return this.httpClient.get(`${this.authUrl}/list-user`).pipe(
            tap(result => {
                return result;
            }),
            catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
        );
    }
}
