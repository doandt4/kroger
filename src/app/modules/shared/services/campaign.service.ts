import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ApiConstant, CustomHttpErrorResponse } from "../../types";
import { catchError, map, tap } from "rxjs/operators";
import { BehaviorSubject, EMPTY, Subject } from "rxjs";
import { API_SHARED_TOKEN } from "../types";

@Injectable({
  providedIn: "root",
})
export class CampaignService {
  //   url = `https://api.kroger.com/v1/products`;
  url = `${this.apiConstant.endpoint}/products`;

  private errorsSub$ = new Subject<string[]>();

  public showDashboard = new BehaviorSubject<boolean>(true);
  showDashboard$ = this.showDashboard.asObservable();

  constructor(
    @Inject(API_SHARED_TOKEN) private apiConstant: ApiConstant,
    private http: HttpClient
  ) {}

  private handleError(err: CustomHttpErrorResponse) {
    if (err.errorJson && err.errorJson.message) {
      this.errorsSub$.next(err.errorJson.message);
    } else {
      this.errorsSub$.next([err.message]);
    }
    return EMPTY;
  }

  searchProduct(query: string) {
    console.log(query);
    let response: any;
    return this.http
      .get(`${this.url}/?filter.term=${query}&filter.start=1&filter.limit=50`)
      .pipe(
        tap((result) => {
          response = result;
        }),
        map(() => {
          return response;
        }),
        catchError((err: CustomHttpErrorResponse) => this.handleError(err))
      );
  }
}
