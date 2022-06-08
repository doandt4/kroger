import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiConstant } from '../../types';
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

  searchProduct(query: string, token: string, start: number) {
    let response: any;
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpIgnore
      .get(
        `${this.url}/?filter.term=${query}&filter.start=${start}&filter.limit=50&filter.locationId=01400943`,
        {
          headers,
        }
      )
      .pipe(
        tap((result) => {
          response = result;
        }),
        map(() => {
          return response;
        }),
        catchError((err: HttpErrorResponse) => throwError(err))
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

  // convertWebpToJpg(urlImage: string) {
  //   const url =
  //     'https://v2.convertapi.com/convert/webp/to/jpg?Secret=JoHnbXejdPU9NwDk&StoreFile=true';
  //   let body = {
  //     Parameters: [
  //       {
  //         Name: 'File',
  //         FileValue: {
  //           Url: `${urlImage}`,
  //         },
  //       },
  //       {
  //         Name: 'StoreFile',
  //         Value: true,
  //       },
  //     ],
  //   };

  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this.httpIgnore.post(`${url}`, body, {
  //     headers,
  //   });
  // }

  // convertWebpToJpgByUrl(urlImage: string) {
  //   const url =
  //     'https://v2.convertapi.com/convert/webp/to/jpg?Secret=Hftj8oJxW282rjfH&StoreFile=true';
  //   let body = {
  //     Parameters: [
  //       {
  //         Name: 'File',
  //         FileValue: {
  //           Url: urlImage,
  //         },
  //       },
  //       {
  //         Name: 'StoreFile',
  //         Value: true,
  //       },
  //     ],
  //   };

  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this.httpIgnore
  //     .post(`${url}`, body, {
  //       headers,
  //     })
  //     .toPromise();
  // }

  convertWebpToJpgBase64(dataBase64: string) {
    let response: any;
    const url =
      'https://v2.convertapi.com/convert/webp/to/jpg?Secret=JoHnbXejdPU9NwDk&StoreFile=true';
    let body = {
      Parameters: [
        {
          Name: 'File',
          FileValue: {
            Name: '1.sm.webp',
            Data: `${dataBase64}`,
          },
        },
        {
          Name: 'StoreFile',
          Value: true,
        },
      ],
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpIgnore
      .post(`${url}`, body, {
        headers,
      })
      .pipe(
        tap((result) => {
          response = result;
        }),
        map(() => {
          return response;
        }),
        catchError((err: HttpErrorResponse) => throwError(err))
      )
      .toPromise()
      .catch((error) => {
        return throwError(error);
      });
  }
}
