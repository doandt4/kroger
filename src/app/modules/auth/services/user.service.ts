import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaymentBody } from '../..';
import { CustomEncoder, Logger } from '../../core';
import { ApiConstant, CustomHttpErrorResponse } from '../../types';
import { API_TOKEN } from '../types';

const TRANSACTION_NAME = environment.elasticAPM.transactionName;

@Injectable()
export class UserService {
    url = `${this.apiConstant.endpoint}/auth`;

    urlWallet = `${this.apiConstant.endpoint}/wallet`;

    private errorsSub$ = new Subject<string[]>();
    errors$ = this.errorsSub$.asObservable();

    public userInfo = new BehaviorSubject<any>({});
    userInfo$ = this.userInfo.asObservable();

    private handleError(err: CustomHttpErrorResponse) {
        if (err.errorJson && err.errorJson.message) {
            this.errorsSub$.next(err.errorJson.message);
        } else {
            this.errorsSub$.next([err.message]);
        }
        return EMPTY;
    }

    constructor(@Inject(API_TOKEN) private apiConstant: ApiConstant, private http: HttpClient) {}

    createUser(newUser: any) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Create User' });
        const { username, email, firstname, lastname, password, status } = newUser;
        const input = {
            username,
            email,
            firstname,
            lastname,
            password,
            status,
            role: 'user',
        };
        let userInfo: any;
        return this.http.post(`${this.url}/register`, input, { headers }).pipe(
            tap(result => {
                userInfo = result;
            }),
            map(() => {
                return userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : '';
            }),
            catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
        );
    }

    createUserAdmin(newUser: any) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Create User' });
        let userInfo: any;
        return this.http.post(`${this.url}/create-account`, newUser, { headers }).pipe(
            tap(result => {
                userInfo = result;
            }),
            map(() => {
                return userInfo;
            }),
            catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
        );
    }

    getCurrentUser(id: string) {
        let userInfo: any;
        return this.http.get(`${this.url}/profile/${id}`).pipe(
            tap(response => {
                userInfo = response;
            }),
            map(() => {
                return userInfo;
            }),
        );
    }

    async getCurrentUserAsync(id: string): Promise<any> {
        let userInfo: any;
        return this.http
            .get(`${this.url}/profile/${id}`)
            .pipe(
                tap(response => {
                    userInfo = response;
                }),
                map(() => {
                    return userInfo;
                }),
            )
            .toPromise();
    }

    forgotPassword(email: any) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Forgot Password' });
        const input = {
            email,
        };
        let response: any;
        return this.http.post(`${this.url}/forgot-password`, input, { headers }).pipe(
            tap(result => {
                response = result;
            }),
            map(() => {
                return response;
            }),
            catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
        );
    }

    resetPassword(password: any, id: any) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Reset Password' });
        const { newPassword, confirmPassword } = password;
        const input = {
            newPassword,
            confirmPassword,
        };
        let response: any;
        return this.http.put(`${this.url}/reset-password/${id}`, input, { headers }).pipe(
            tap(result => {
                response = result;
            }),
            map(() => {
                return response;
            }),
            catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
        );
    }

    isEmailUnique(email: string): Promise<any> {
        const params = new HttpParams({ encoder: new CustomEncoder() }).set('email', email);
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Validate uniqueness of IOM user email' });
        return this.http
            .get(`${this.url}/isEmailUnique`, { params, headers, responseType: 'text' })
            .pipe(
                map(value => value === 'true'),
                catchError(err => {
                    Logger.log(err);
                    return EMPTY;
                }),
            )
            .toPromise();
    }

    infoResetPassword(id: string) {
        const headers = new HttpHeaders({ [TRANSACTION_NAME]: 'Get Infomation' });
        let userInfo: any;
        return this.http.get(`${this.url}/reset-password/${id}`, { headers }).pipe(
            tap(response => {
                userInfo = response;
            }),
            map(() => {
                return userInfo;
            }),
        );
    }

    editProfile(input: any) {
        return this.http.put(`${this.url}/edit`, input, { responseType: 'json' }).pipe(
            tap(result => {
                return result;
            }),
            catchError((err: CustomHttpErrorResponse) => throwError(err)),
        );
    }

    topUpWallet(input: PaymentBody) {
        return this.http
            .post(`${this.urlWallet}/top-up`, input, {
                responseType: 'text',
            })
            .pipe(
                tap(result => {
                    return result;
                }),
                catchError((err: CustomHttpErrorResponse) => throwError(err)),
            );
    }

    getDetailWallet(page: number) {
        return this.http.get(`${this.urlWallet}/detail?page=${page}`).pipe(
            tap(result => result),
            catchError((err: CustomHttpErrorResponse) => throwError(err)),
        );
    }

    async getLstQc(): Promise<any> {
        return this.http
            .get(`${this.url}/list-parent`)
            .pipe(
                tap(),
                map((response) => {
                    return response;
                }),
            )
            .toPromise();
    }

    async getListAllUser(page: number, limit: number): Promise<any> {
        return this.http
            .get(`${this.url}/list-user?limit=${limit}&page=${page}`)
            .pipe(
                tap(),
                map((response) => {
                    return response;
                }),
            )
            .toPromise();
    }

    async deleteUser(id_user): Promise<any> {
        return this.http
            .delete(`${this.url}/delete-user/${id_user}`)
            .pipe(
                tap(),
                map((response) => {
                    return response;
                }),
            )
            .toPromise();
    }
}
