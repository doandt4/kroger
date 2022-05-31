import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EMPTY, Subject, throwError } from 'rxjs';
import { API_SHARED_TOKEN } from '../types';
import { ApiConstant, CustomHttpErrorResponse } from '../../types';
import { catchError, map, tap } from 'rxjs/operators';
import { BodyConditionalCampaign } from '../../administrator/campaign/campaign-conditional-create/campaign-conditional-create.component';

@Injectable({
    providedIn: 'root',
})
export class ConditionCampaignService {
    url = `${this.apiConstant.endpoint}/conditional`;
    private errorsSub$ = new Subject<string[]>();

    constructor(@Inject(API_SHARED_TOKEN) private apiConstant: ApiConstant, private http: HttpClient) {}

    private handleError(err: CustomHttpErrorResponse) {
        if (err.errorJson && err.errorJson.message) {
            this.errorsSub$.next(err.errorJson.message);
        } else {
            this.errorsSub$.next([err.message]);
        }
        return EMPTY;
    }

    uploadFileConditionalCampaign(input: any) {
        let response: any;
        return this.http
            .post(`${this.url}/upload-file`, input, {
                responseType: 'text',
            })
            .pipe(
                tap(result => {
                    response = result;
                }),
                map(() => {
                    return response;
                }),
                catchError((err: CustomHttpErrorResponse) => throwError(err)),
            );
    }
    createNewCampaign(input: any) {
        let response: any;
        return this.http
            .post(`${this.url}/create`, input, {
                responseType: 'text',
            })
            .pipe(
                tap(result => {
                    response = result;
                }),
                map(() => {
                    return response;
                }),
                catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
            );
    }

    getConditions() {
        let response: any;
        return this.http.get(`${this.url}/all-conditions`).pipe(
            tap(result => {
                response = result;
            }),
            map(() => {
                return response;
            }),
            catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
        );
    }

    getRules() {
        let response: any;
        return this.http.get(`${this.url}/all-rules`).pipe(
            tap(result => {
                response = result;
            }),
            map(() => {
                return response;
            }),
            catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
        );
    }

    createConditionalCampaign(input: any) {
        let response: any;
        return this.http
            .post(`${this.url}/create`, input, {
                responseType: 'text',
            })
            .pipe(
                tap(result => {
                    response = result;
                }),
                map(() => response),
                catchError((err: CustomHttpErrorResponse) => throwError(err)),
            );
    }

    getTargets() {
        let response: any;
        return this.http.get(`${this.url}/all-target`).pipe(
            tap(result => {
                response = result;
            }),
            map(() => {
                return response;
            }),
            catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
        );
    }

    updateStatusConditional(id: string, status: string) {
        return this.http
            .put(
                `${this.url}/update-status/${id}`,
                { status: status },
                {
                    responseType: 'json',
                },
            )
            .pipe(
                tap(result => result),
                catchError((err: CustomHttpErrorResponse) => throwError(err)),
            );
    }

    getBusinessTarget(body: string[]) {
        let response: any;
        return this.http
            .post(`${this.url}/get-business-target`, body, {
                responseType: 'json',
            })
            .pipe(
                tap(result => {
                    response = result;
                }),
                map(() => {
                    return response;
                }),
                catchError((err: CustomHttpErrorResponse) => this.handleError(err)),
            );
    }

    getDetailConditionalCampaign(id: string) {
        let response: any;
        return this.http.get(`${this.url}/detail/${id}`).pipe(
            tap(result => {
                response = result;
            }),
            map(() => {
                return response;
            }),
            catchError((err: CustomHttpErrorResponse) => throwError(err)),
        );
    }

    editConditionalCampaign(input: BodyConditionalCampaign, id: string) {
        return this.http
            .put(`${this.url}/edit/${id}`, input, {
                responseType: 'json',
            })
            .pipe(
                tap(result => result),
                catchError((err: CustomHttpErrorResponse) => throwError(err)),
            );
    }
}
