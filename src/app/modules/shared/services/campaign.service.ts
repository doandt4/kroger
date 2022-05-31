import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiConstant, CustomHttpErrorResponse } from '../../types';
import { API_SHARED_TOKEN } from '../types';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  //   url = `https://api.kroger.com/v1/products`;
  url = `${this.apiConstant.endpoint}/products`;
  urlEndpoint = 'https://api.kroger.com/v1/connect/oauth2/token';

  public showDashboard = new BehaviorSubject<boolean>(true);
  showDashboard$ = this.showDashboard.asObservable();

  constructor(
    @Inject(API_SHARED_TOKEN) private apiConstant: ApiConstant,
    private httpIgnore: HttpClient,
    private handler: HttpBackend
  ) {
    this.httpIgnore = new HttpClient(this.handler);
  }

  // private handleError(err: CustomHttpErrorResponse) {
  //   if (err.errorJson && err.errorJson.message) {
  //     this.errorsSub$.next(err.errorJson.message);
  //   } else {
  //     this.errorsSub$.next([err.message]);
  //   }
  //   return EMPTY;
  // }

  searchProduct(query: string, token: string) {
    console.log(query, token);
    let response: any;
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpIgnore
      .get(`${this.url}/?filter.term=${query}&filter.start=1&filter.limit=50`, {
        headers,
      })
      .pipe(
        tap((result) => {
          response = result;
        }),
        map(() => {
          return response;
        }),
        catchError((err: CustomHttpErrorResponse) => throwError(err))
      );
  }

  refreshToken() {
    let body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('scope', 'product.compact');
    let headers = new HttpHeaders({
      Authorization:
        'Basic aGhjLTE0ZDM4MWZiMGMwOTFkZmVmMDM1NDVkMjNiZWRjYTg5MTQ4MjUzMzk0NzQ3NDc4NTU0OnEwd0pHbnlkQkZBdFY2UGtCN1JzUkgxLUtJalVkbFhUYjFFVE1oYkI=',
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.httpIgnore.post(`${this.urlEndpoint}`, body.toString(), {
      headers,
    });
  }
}
